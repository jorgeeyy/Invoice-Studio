from datetime import datetime

from pydantic import EmailStr, Field

from app.schemas.common import ORMCamelModel


class RegisterIn(ORMCamelModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    company: str | None = Field(default=None, max_length=120)


class LoginIn(ORMCamelModel):
    email: EmailStr
    password: str


class UserOut(ORMCamelModel):
    id: str
    email: EmailStr
    name: str
    company: str | None = None
    created_at: datetime


class TokenResponse(ORMCamelModel):
    user: UserOut
    token: str
