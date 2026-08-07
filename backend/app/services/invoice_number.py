import re
from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Business, Invoice

_NUMBER_RE = re.compile(r"(\d+)\s*$")


def next_invoice_number(db: Session, business: Business, for_date: date | None = None) -> str:
    prefix = business.invoice_prefix or "INV-"
    stmt = select(Invoice.invoice_number).where(Invoice.business_id == business.id)
    existing = db.scalars(stmt).all()

    highest = 0
    for num in existing:
        if num.startswith(prefix):
            match = _NUMBER_RE.search(num[len(prefix) :])
            if match:
                highest = max(highest, int(match.group(1)))

    return f"{prefix}{highest + 1:04d}"
