# Invoice Studio — Backend

FastAPI backend for Invoice Studio: a multi-currency invoicing app with clients, products, invoices, PDF generation, and live invoice previews.

## Stack

- **FastAPI** + **Uvicorn**
- **SQLAlchemy 2.0** (declarative, `Mapped`/`mapped_column`)
- **Alembic** migrations (auto-run on startup)
- **Pydantic v2** schemas (camelCase wire format via `ORMCamelModel`)
- **SQLite** by default (any SQLAlchemy URL supported)
- Managed with [`uv`](https://docs.astral.sh/uv/)

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Setup

```bash
cd backend
uv sync          # install dependencies into .venv
```

## Running

```bash
uv run uvicorn app.main:app --reload
```

The app serves on `http://localhost:8000`. Health check: `GET /api/health`.

On startup the app runs pending Alembic migrations automatically, and if the database is empty it seeds a demo user.

**Demo login:** `demo@example.com` / `demo1234`

## Configuration

All settings live in `app/core/config.py` and are overridable via environment variables (or a `.env` file in the backend root):

| Variable            | Default                    | Description                          |
| ------------------- | -------------------------- | ------------------------------------ |
| `APP_NAME`          | `Invoice Studio API`       | Application title                    |
| `API_PREFIX`        | `/api`                     | Route prefix for all endpoints       |
| `DATABASE_URL`      | `sqlite:///./invoice_studio.db` | SQLAlchemy database URL         |
| `JWT_SECRET`        | `dev-secret-change-me`     | Signing secret for auth tokens       |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `43200`           | Session lifetime                     |
| `AUTH_COOKIE_NAME`  | `invoice_studio`           | Name of the auth cookie              |
| `CORS_ORIGINS`      | comma-separated origins    | Allowed frontend origins             |

## Database migrations (Alembic)

Migrations run automatically at startup. Manual workflow:

```bash
# after changing a model, generate the migration
uv run alembic revision --autogenerate -m "describe the change"

# apply pending migrations
uv run alembic upgrade head

# inspect state
uv run alembic current
```

Notes:

- Migrations are configured to target the app's `Base.metadata` and use the same `DATABASE_URL` as the app.
- SQLite is supported in **batch mode** (`render_as_batch=True`), so ALTER TABLE operations rebuild tables in place without data loss.
- Tests use their own in-memory database and do not touch the dev database.

## Tests

```bash
uv run pytest
```

## Project structure

```
app/
  main.py            # FastAPI app, lifespan, migration bootstrap, demo seed
  db.py              # engine, SessionLocal, DeclarativeBase
  core/config.py     # settings
  core/security.py   # password hashing / JWT
  models/            # SQLAlchemy ORM models
  schemas/           # Pydantic request/response schemas
  routers/           # auth, business, clients, products, invoices
  services/          # calculations, invoice numbering, serialization, PDF render
alembic/
  env.py             # migration environment
  versions/          # versioned migration scripts
tests/               # pytest suite
```