from datetime import datetime

from app.schemas.common import (
    Address,
    ORMCamelModel,
    Currency,
    PaymentTerms,
)


class BusinessOut(ORMCamelModel):
    id: str
    user_id: str
    name: str
    logo: str | None = None
    email: str | None = None
    phone: str | None = None
    website: str | None = None
    address: Address | None = None
    tax_id: str | None = None
    default_currency: Currency = "USD"
    default_tax_rate: float = 0.0
    default_tax_name: str = "VAT"
    invoice_prefix: str = "INV-"
    default_payment_terms: PaymentTerms = "net_30"
    bank_details: str | None = None
    mobile_money_details: str | None = None
    payment_instructions: str | None = None
    signature: str | None = None
    stamp: str | None = None
    created_at: datetime
    updated_at: datetime


class BusinessUpdate(ORMCamelModel):
    name: str | None = None
    logo: str | None = None
    email: str | None = None
    phone: str | None = None
    website: str | None = None
    address: Address | None = None
    tax_id: str | None = None
    default_currency: Currency | None = None
    default_tax_rate: float | None = None
    default_tax_name: str | None = None
    invoice_prefix: str | None = None
    default_payment_terms: PaymentTerms | None = None
    bank_details: str | None = None
    mobile_money_details: str | None = None
    payment_instructions: str | None = None
    signature: str | None = None
    stamp: str | None = None
