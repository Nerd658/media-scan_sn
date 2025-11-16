from fastapi import FastAPI
from .db import lifespan
from .api import analysis, history, monitoring, stats

app = FastAPI(lifespan=lifespan)

app.include_router(analysis.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")
app.include_router(monitoring.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"Message": "QG Backend (v5 - Modular)"}
