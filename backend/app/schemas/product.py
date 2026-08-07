from datetime import datetime

from app.schemas.common import Currency, ORMCamelModel


class ProductBase(ORMCamelModel):
    name: str
    description: str | None = None
    unit_price: float
    currency: Currency = "USD"
    tax_rate: float = 0.0
    quantity: int = 0
    category: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ORMCamelModel):
    name: str | None = None
    description: str | None = None
    unit_price: float | None = None
    currency: Currency | None = None
    tax_rate: float | None = None
    quantity: int | None = None
    category: str | None = None


class ProductOut(ProductBase, ORMCamelModel):
    id: str
    created_at: datetime
    updated_at: datetime
