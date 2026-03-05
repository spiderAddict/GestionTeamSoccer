from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///database/gestion_soccer.db"  # fichier SQLite local

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}  # nécessaire pour SQLite
)
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)
Base = declarative_base() # <-- UNIQUE Base pour tous les modèles

# fonction pour récupérer une session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()