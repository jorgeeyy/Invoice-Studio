from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

Currency = Literal["USD", "EUR", "GBP", "GHS", "CAD", "AUD"]
PaymentTerms = Literal["due_on_receipt", "net_15", "net_30", "net_60", "custom"]
DiscountType = Literal["percentage", "fixed"]
InvoiceTemplate = Literal["minimal", "corporate", "modern", "agency", "elegant"]
InvoiceStatus = Literal["draft", "final"]
ClientStatus = Literal["active", "archived"]


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Address(BaseModel):
    street: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str | None = None


class ORMCamelModel(CamelModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )
