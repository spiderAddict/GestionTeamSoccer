import os
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/version", tags=["system"])
def get_version():
    return {
        "version": os.getenv("APP_VERSION", "0.0.0-devlocal")
    }