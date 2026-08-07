from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import JSON, DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.user import uuid_str


class Business(Base, TimestampMixin):
    __tablename__ = "businesses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    tax_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    default_currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    default_tax_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    default_tax_name: Mapped[str] = mapped_column(String(50), default="VAT", nullable=False)
    invoice_prefix: Mapped[str] = mapped_column(String(20), default="INV-", nullable=False)
    default_payment_terms: Mapped[str] = mapped_column(
        String(30), default="net_30", nullable=False
    )
    bank_details: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    mobile_money_details: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    payment_instructions: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    signature: Mapped[str | None] = mapped_column(String(500), nullable=True)
    stamp: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user: Mapped["User"] = relationship(back_populates="businesses")
    clients: Mapped[list["Client"]] = relationship(  # noqa: F821
        back_populates="business", cascade="all, delete-orphan"
    )
    products: Mapped[list["Product"]] = relationship(  # noqa: F821
        back_populates="business", cascade="all, delete-orphan"
    )
    invoices: Mapped[list["Invoice"]] = relationship(  # noqa: F821
        back_populates="business", cascade="all, delete-orphan"
    )
