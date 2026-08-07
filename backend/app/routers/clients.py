from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_business
from app.db import get_db
from app.models import Business, Client
from app.schemas import ClientCreate, ClientOut, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientOut])
def list_clients(
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> list[Client]:
    return db.scalars(
        select(Client)
        .where(Client.business_id == business.id)
        .order_by(Client.created_at.desc())
    ).all()


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Client:
    client = Client(**payload.model_dump(by_alias=False), business_id=business.id)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/{client_id}", response_model=ClientOut)
def get_client(
    client_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Client:
    client = db.scalar(
        select(Client).where(Client.id == client_id, Client.business_id == business.id)
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.put("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: str,
    payload: ClientUpdate,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> Client:
    client = db.scalar(
        select(Client).where(Client.id == client_id, Client.business_id == business.id)
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    data = payload.model_dump(exclude_unset=True, by_alias=False)
    for key, value in data.items():
        if value is not None:
            setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: str,
    business: Business = Depends(get_current_business),
    db: Session = Depends(get_db),
) -> None:
    client = db.scalar(
        select(Client).where(Client.id == client_id, Client.business_id == business.id)
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
