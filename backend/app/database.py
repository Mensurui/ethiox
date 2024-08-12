from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession 
from sqlalchemy.orm import DeclarativeBase
from .settings import settings

#SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://iroia:mensur@127.0.0.1/exr"
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{settings.database_username}:{settings.database_password}@{settings.database_hostname}/{settings.database_name}"

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True, future=True)

SessionLocal = async_sessionmaker(engine, class_=AsyncSession)

class Base(DeclarativeBase):
    pass
