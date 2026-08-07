from datetime import date, datetime

from pydantic import Field, model_validator

from app.schemas.common import (
    Currency,
    DiscountType,
    InvoiceStatus,
    InvoiceTemplate,
    ORMCamelModel,
    PaymentTerms,
)


class InvoiceItemCreate(ORMCamelModel):
    product_id: str | None = None
    description: str
    quantity: float = Field(gt=0)
    unit_price: float = Field(ge=0)
    discount: float = Field(default=0.0, ge=0)
    tax_rate: float = Field(default=0.0, ge=0)


class InvoiceItemOut(ORMCamelModel):
    id: str
    product_id: str | None = None
    description: str
    quantity: float
    unit_price: float
    discount: float
    tax_rate: float
    amount: float


class InvoiceCreate(ORMCamelModel):
    client_id: str
    issue_date: date
    currency: Currency = "USD"
    reference: str | None = None
    items: list[InvoiceItemCreate] = Field(min_length=1)
    discount: float = Field(default=0.0, ge=0)
    discount_type: DiscountType = "percentage"
    tax_rate: float = Field(default=0.0, ge=0)
    tax_name: str = "VAT"
    notes: str | None = None
    internal_notes: str | None = None
    payment_terms: PaymentTerms = "net_30"
    payment_instructions: str | None = None
    template: InvoiceTemplate = "minimal"

    @model_validator(mode="after")
    def _require_items(self) -> "InvoiceCreate":
        if not self.items:
            raise ValueError("At least one item is required")
        return self


class InvoiceUpdate(ORMCamelModel):
    client_id: str | None = None
    issue_date: date | None = None
    currency: Currency | None = None
    reference: str | None = None
    items: list[InvoiceItemCreate] | None = None
    discount: float | None = Field(default=None, ge=0)
    discount_type: DiscountType | None = None
    tax_rate: float | None = Field(default=None, ge=0)
    tax_name: str | None = None
    notes: str | None = None
    internal_notes: str | None = None
    payment_terms: PaymentTerms | None = None
    payment_instructions: str | None = None
    template: InvoiceTemplate | None = None
    status: InvoiceStatus | None = None


class InvoiceOut(ORMCamelModel):
    id: str
    invoice_number: str
    business_id: str
    client_id: str
    client_name: str
    client_email: str | None = None
    status: InvoiceStatus
    issue_date: date
    currency: Currency
    reference: str | None = None
    items: list[InvoiceItemOut]
    subtotal: float
    discount: float
    discount_type: DiscountType
    tax_rate: float
    tax_name: str
    tax: float
    total: float
    notes: str | None = None
    internal_notes: str | None = None
    payment_terms: PaymentTerms
    payment_instructions: str | None = None
    template: InvoiceTemplate
    created_at: datetime
    updated_at: datetime


class InvoiceListOut(ORMCamelModel):
    id: str
    invoice_number: str
    client_id: str
    client_name: str
    client_email: str | None = None
    status: InvoiceStatus
    issue_date: date
    currency: Currency
    subtotal: float
    total: float
    template: InvoiceTemplate
    created_at: datetime
    updated_at: datetime
