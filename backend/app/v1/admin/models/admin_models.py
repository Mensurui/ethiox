from ....config import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

class Currency(Base):
    __tablename__ = "currency"

    id = Column(Integer, primary_key=True, index=True)
    currency_name = Column(String, nullable=False)
    currency_icon = Column(String)

    daily_xr = relationship("DailyExchangeRate", back_populates="currency")

class Bank(Base):
    __tablename__="bank"

    id = Column(Integer, primary_key=True, index=True)
    bank_name = Column(String, nullable=False)
    
    daily_xr = relationship("DailyExchangeRate", back_populates="bank")

class PromotionalImages(Base):
    __tablename__="promotional_images"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False)

class DailyExchangeRate(Base):
    __tablename__="daily_exchangerate"
    
    id = Column(Integer, primary_key=True, index=True)
    transactional_buying_price = Column(Float, nullable=False)
    transactional_selling_price = Column(Float, nullable=False)
    cash_buying_price = Column(Float, nullable=False)
    cash_selling_price = Column(Float, nullable=False)
    date = Column(DateTime, default=func.now())
    bank_id = Column(Integer, ForeignKey("bank.id"), nullable=False)
    currency_id = Column(Integer, ForeignKey("currency.id"), nullable=False)

    currency = relationship("Currency", back_populates="daily_xr")
    bank = relationship("Bank", back_populates="daily_xr")
