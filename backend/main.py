import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base
import models

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure pgvector extension is created before tables are created
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="ReelVault API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import items, search, ingestion

app.include_router(items.router)
app.include_router(search.router)
app.include_router(ingestion.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ReelVault API is running"}
