from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.deps import get_current_user
from app.db import get_db
from app.models import Business, User
from app.schemas import LoginIn, RegisterIn, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.auth_cookie_secure,
        path="/",
        max_age=settings.access_token_expire_minutes * 60,
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.auth_cookie_name,
        path="/",
        samesite="lax",
        secure=settings.auth_cookie_secure,
    )


def _token_response(response: Response, user: User) -> TokenResponse:
    token = security.create_access_token(user.id)
    _set_auth_cookie(response, token)
    return TokenResponse(
        user=UserOut(id=user.id, email=user.email, name=user.name, company=user.company, created_at=user.created_at),
        token=token,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        email=payload.email.lower(),
        name=payload.name,
        company=payload.company,
        password_hash=security.hash_password(payload.password),
    )
    db.add(user)
    db.flush()
    db.add(
        Business(
            user_id=user.id,
            name=payload.company or f"{payload.name}'s Studio",
            email=payload.email.lower(),
        )
    )
    db.commit()
    db.refresh(user)
    return _token_response(response, user)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginIn, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not security.verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    return _token_response(response, user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    _clear_auth_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> UserOut:
    return UserOut(id=user.id, email=user.email, name=user.name, company=user.company, created_at=user.created_at)
