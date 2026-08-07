from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_business
from app.db import get_db
from app.models import Business
from app.schemas import BusinessOut, BusinessUpdate

router = APIRouter(prefix="/businesses", tags=["business"])


@router.get("/me", response_model=BusinessOut)
def get_me(business: Business = Depends(get_current_business)) -> Business:
    return business


@router.put("/me", response_model=BusinessOut)
def update_me(
    payload: BusinessUpdate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Business:
    data = payload.model_dump(exclude_unset=True, by_alias=False)
    for key, value in data.items():
        if value is not None:
            setattr(business, key, value)
    db.commit()
    db.refresh(business)
    return business
