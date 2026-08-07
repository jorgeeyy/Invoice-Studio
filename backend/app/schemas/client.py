from datetime import datetime

from app.schemas.common import (
    Address,
    ClientStatus,
    ORMCamelModel,
)


class ClientBase(ORMCamelModel):
    name: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    website: str | None = None
    company: str | None = None
    address: Address | None = None
    tax_id: str | None = None
    notes: str | None = None
    status: ClientStatus = "active"


class ClientCreate(ClientBase):
    pass


class ClientUpdate(ORMCamelModel):
    name: str | None = None
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    website: str | None = None
    company: str | None = None
    address: Address | None = None
    tax_id: str | None = None
    notes: str | None = None
    status: ClientStatus | None = None


class ClientOut(ClientBase, ORMCamelModel):
    id: str
    created_at: datetime
    updated_at: datetime
