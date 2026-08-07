from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core import security
from app.core.deps import get_current_business, get_current_user
from app.db import get_db
from app.models import Business, Client, Invoice, InvoiceItem, User
from app.schemas import InvoiceCreate, InvoiceListOut, InvoiceOut, InvoiceUpdate
from app.services.invoice_number import next_invoice_number
from app.services.invoice_serializer import invoice_to_list, invoice_to_out
from app.services.pdf_render import render_invoice_pdf_for

router = APIRouter(prefix="/invoices", tags=["invoices"])


def _get_invoice(db: Session, invoice_id: str, business: Business) -> Invoice:
    invoice = db.scalar(
        select(Invoice)
        .options(joinedload(Invoice.client), joinedload(Invoice.items))
        .where(Invoice.id == invoice_id, Invoice.business_id == business.id)
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


def _validate_client(db: Session, client_id: str, business: Business) -> Client:
    client = db.scalar(
        select(Client).where(Client.id == client_id, Client.business_id == business.id)
    )
    if not client:
        raise HTTPException(status_code=400, detail="Client does not exist")
    return client


def _item_field(item, key):
    if isinstance(item, dict):
        return item.get(key)
    return getattr(item, key, None)


def _replace_items(db: Session, invoice: Invoice, items) -> None:
    invoice.items.clear()
    for index, item in enumerate(items):
        invoice.items.append(
            InvoiceItem(
                product_id=_item_field(item, "product_id"),
                description=_item_field(item, "description"),
                quantity=_item_field(item, "quantity"),
                unit_price=_item_field(item, "unit_price"),
                discount=_item_field(item, "discount"),
                tax_rate=_item_field(item, "tax_rate"),
                sort_order=index,
            )
        )
    db.flush()


@router.get("", response_model=list[InvoiceListOut])
def list_invoices(
    search: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    sort: str = Query(default="created_at"),
    order: str = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> list[InvoiceListOut]:
    stmt = (
        select(Invoice)
        .options(selectinload(Invoice.client), selectinload(Invoice.items))
        .where(Invoice.business_id == business.id)
    )
    if status_filter:
        stmt = stmt.where(Invoice.status == status_filter)
    if search:
        pattern = f"%{search}%"
        stmt = stmt.join(Client).where(
            or_(
                Invoice.invoice_number.ilike(pattern),
                Invoice.reference.ilike(pattern),
                Client.name.ilike(pattern),
                Client.email.ilike(pattern),
            )
        )
    column = getattr(Invoice, sort, Invoice.created_at)
    stmt = stmt.order_by(column.asc() if order == "asc" else column.desc())
    stmt = stmt.offset((page - 1) * limit).limit(limit)
    return [invoice_to_list(i) for i in db.scalars(stmt).all()]


@router.post("", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    _validate_client(db, payload.client_id, business)
    invoice = Invoice(
        business_id=business.id,
        client_id=payload.client_id,
        invoice_number=next_invoice_number(db, business, payload.issue_date),
        status="draft",
        issue_date=payload.issue_date,
        currency=payload.currency,
        reference=payload.reference,
        discount=payload.discount,
        discount_type=payload.discount_type,
        tax_rate=payload.tax_rate,
        tax_name=payload.tax_name,
        notes=payload.notes,
        internal_notes=payload.internal_notes,
        payment_terms=payload.payment_terms,
        payment_instructions=payload.payment_instructions,
        template=payload.template,
    )
    db.add(invoice)
    db.flush()
    _replace_items(db, invoice, payload.items)
    db.commit()
    return invoice_to_out(_get_invoice(db, invoice.id, business))


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(
    invoice_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    return invoice_to_out(_get_invoice(db, invoice_id, business))


@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(
    invoice_id: str,
    payload: InvoiceUpdate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    invoice = _get_invoice(db, invoice_id, business)
    data = payload.model_dump(exclude_unset=True, by_alias=False)
    if "client_id" in data and data["client_id"]:
        _validate_client(db, data["client_id"], business)
    if "items" in data:
        _replace_items(db, invoice, data.pop("items"))
    for key, value in data.items():
        if value is not None:
            setattr(invoice, key, value)
    db.commit()
    return invoice_to_out(_get_invoice(db, invoice.id, business))


@router.post("/{invoice_id}/duplicate", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def duplicate_invoice(
    invoice_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> InvoiceOut:
    source = _get_invoice(db, invoice_id, business)
    new_invoice = Invoice(
        business_id=business.id,
        client_id=source.client_id,
        invoice_number=next_invoice_number(db, business),
        status="draft",
        issue_date=source.issue_date,
        currency=source.currency,
        reference=source.reference,
        discount=source.discount,
        discount_type=source.discount_type,
        tax_rate=source.tax_rate,
        tax_name=source.tax_name,
        notes=source.notes,
        internal_notes=source.internal_notes,
        payment_terms=source.payment_terms,
        payment_instructions=source.payment_instructions,
        template=source.template,
    )
    db.add(new_invoice)
    db.flush()
    for index, item in enumerate(source.items):
        db.add(
            InvoiceItem(
                invoice_id=new_invoice.id,
                product_id=item.product_id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                discount=item.discount,
                tax_rate=item.tax_rate,
                sort_order=index,
            )
        )
    db.commit()
    return invoice_to_out(_get_invoice(db, new_invoice.id, business))


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Response:
    invoice = db.scalar(
        select(Invoice).where(Invoice.id == invoice_id, Invoice.business_id == business.id)
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db.delete(invoice)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{invoice_id}/pdf")
async def download_invoice_pdf(
    invoice_id: str,
    business: Business = Depends(get_current_business),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    invoice = _get_invoice(db, invoice_id, business)
    token = security.create_access_token(user.id)
    pdf = await render_invoice_pdf_for(invoice_id, token)
    filename = f"{invoice.invoice_number}.pdf"
    return StreamingResponse(
        iter([pdf]),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
