from datetime import date
from uuid import uuid4

from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin
from app.models.user import uuid_str


class Invoice(Base, TimestampMixin):
    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    business_id: Mapped[str] = mapped_column(
        ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False
    )
    client_id: Mapped[str] = mapped_column(
        ForeignKey("clients.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    invoice_number: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    reference: Mapped[str | None] = mapped_column(String(120), nullable=True)
    discount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    discount_type: Mapped[str] = mapped_column(String(20), default="percentage", nullable=False)
    tax_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    tax_name: Mapped[str] = mapped_column(String(50), default="VAT", nullable=False)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    internal_notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    payment_terms: Mapped[str] = mapped_column(String(30), default="net_30", nullable=False)
    payment_instructions: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    template: Mapped[str] = mapped_column(String(20), default="minimal", nullable=False)

    business: Mapped["Business"] = relationship(back_populates="invoices")  # noqa: F821
    client: Mapped["Client"] = relationship(back_populates="invoices")  # noqa: F821
    items: Mapped[list["InvoiceItem"]] = relationship(  # noqa: F821
        back_populates="invoice",
        cascade="all, delete-orphan",
        order_by="InvoiceItem.sort_order",
    )
