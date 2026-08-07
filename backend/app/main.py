from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import Base, SessionLocal, engine
from app.models import Business, User
from app.routers import auth, business, clients, invoices, products

DEMO_EMAIL = "demo@example.com"
DEMO_PASSWORD = "demo1234"


def seed_demo_user() -> None:
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == DEMO_EMAIL).first():
            return
        from app.core.security import hash_password

        user = User(
            email=DEMO_EMAIL,
            name="Demo Studio",
            company="Demo Studio",
            password_hash=hash_password(DEMO_PASSWORD),
        )
        db.add(user)
        db.flush()
        db.add(
            Business(
                user_id=user.id,
                name="Demo Studio",
                email=DEMO_EMAIL,
                invoice_prefix="INV-",
                default_currency="USD",
                default_payment_terms="net_30",
                address={
                    "street": "1 Demo Street",
                    "city": "Accra",
                    "country": "Ghana",
                },
            )
        )
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    if settings.database_url.startswith("sqlite"):
        seed_demo_user()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = settings.api_prefix
app.include_router(auth.router, prefix=api_prefix)
app.include_router(business.router, prefix=api_prefix)
app.include_router(clients.router, prefix=api_prefix)
app.include_router(products.router, prefix=api_prefix)
app.include_router(invoices.router, prefix=api_prefix)


@app.get(f"{api_prefix}/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
