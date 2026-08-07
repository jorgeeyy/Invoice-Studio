from app.models import Invoice
from app.schemas.invoice import InvoiceItemOut, InvoiceListOut, InvoiceOut
from app.services.calculations import compute_totals, item_amount


def invoice_to_out(invoice: Invoice) -> InvoiceOut:
    items = invoice.items
    totals = compute_totals(
        items=items,
        discount=invoice.discount,
        discount_type=invoice.discount_type,
        tax_rate=invoice.tax_rate,
    )
    client = invoice.client
    return InvoiceOut(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        business_id=invoice.business_id,
        client_id=invoice.client_id,
        client_name=client.name if client else "",
        client_email=client.email if client else None,
        status=invoice.status,
        issue_date=invoice.issue_date,
        currency=invoice.currency,
        reference=invoice.reference,
        items=[
            InvoiceItemOut(
                id=it.id,
                product_id=it.product_id,
                description=it.description,
                quantity=it.quantity,
                unit_price=it.unit_price,
                discount=it.discount,
                tax_rate=it.tax_rate,
                amount=round(item_amount(it.quantity, it.unit_price, it.discount), 2),
            )
            for it in items
        ],
        subtotal=totals["subtotal"],
        discount=totals["discount_amount"],
        discount_type=invoice.discount_type,
        tax_rate=invoice.tax_rate,
        tax_name=invoice.tax_name,
        tax=totals["tax"],
        total=totals["total"],
        notes=invoice.notes,
        internal_notes=invoice.internal_notes,
        payment_terms=invoice.payment_terms,
        payment_instructions=invoice.payment_instructions,
        template=invoice.template,
        created_at=invoice.created_at,
        updated_at=invoice.updated_at,
    )


def invoice_to_list(invoice: Invoice) -> InvoiceListOut:
    items = invoice.items
    totals = compute_totals(
        items=items,
        discount=invoice.discount,
        discount_type=invoice.discount_type,
        tax_rate=invoice.tax_rate,
    )
    client = invoice.client
    return InvoiceListOut(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        client_id=invoice.client_id,
        client_name=client.name if client else "",
        client_email=client.email if client else None,
        status=invoice.status,
        issue_date=invoice.issue_date,
        currency=invoice.currency,
        subtotal=totals["subtotal"],
        total=totals["total"],
        template=invoice.template,
        created_at=invoice.created_at,
        updated_at=invoice.updated_at,
    )
