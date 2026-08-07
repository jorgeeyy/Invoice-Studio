from uuid import uuid4

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.user import uuid_str


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    invoice_id: Mapped[str] = mapped_column(
        ForeignKey("invoices.id", ondelete="CASCADE"), index=True, nullable=False
    )
    product_id: Mapped[str | None] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"), nullable=True
    )
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    discount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    tax_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    invoice: Mapped["Invoice"] = relationship(back_populates="items")  # noqa: F821
