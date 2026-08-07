from app.schemas.invoice import InvoiceItemCreate


def item_amount(quantity: float, unit_price: float, discount: float = 0.0) -> float:
    return quantity * unit_price - discount


def discount_amount(subtotal: float, discount: float, discount_type: str) -> float:
    if discount <= 0:
        return 0.0
    if discount_type == "percentage":
        return round(subtotal * discount / 100.0, 2)
    return round(discount, 2)


def compute_subtotal(items: list[InvoiceItemCreate]) -> float:
    return round(sum(item_amount(i.quantity, i.unit_price, i.discount) for i in items), 2)


def compute_totals(
    items: list[InvoiceItemCreate],
    discount: float,
    discount_type: str,
    tax_rate: float,
) -> dict[str, float]:
    subtotal = compute_subtotal(items)
    discount_amt = discount_amount(subtotal, discount, discount_type)
    taxable = subtotal - discount_amt
    tax = round(taxable * tax_rate / 100.0, 2) if tax_rate else 0.0
    total = round(taxable + tax, 2)
    return {
        "subtotal": subtotal,
        "discount_amount": discount_amt,
        "tax": tax,
        "total": total,
    }
