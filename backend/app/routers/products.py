from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_business
from app.db import get_db
from app.models import Business, Product
from app.schemas import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> list[Product]:
    return db.scalars(
        select(Product)
        .where(Product.business_id == business.id)
        .order_by(Product.created_at.desc())
    ).all()


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Product:
    product = Product(**payload.model_dump(by_alias=False), business_id=business.id)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Product:
    product = db.scalar(
        select(Product).where(Product.id == product_id, Product.business_id == business.id)
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    payload: ProductUpdate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Product:
    product = db.scalar(
        select(Product).where(Product.id == product_id, Product.business_id == business.id)
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    data = payload.model_dump(exclude_unset=True, by_alias=False)
    for key, value in data.items():
        if value is not None:
            setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> None:
    product = db.scalar(
        select(Product).where(Product.id == product_id, Product.business_id == business.id)
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
