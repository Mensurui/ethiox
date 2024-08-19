from pydantic import BaseModel
from typing import Optional

class AdminInput(BaseModel):
    username:str
    password:str

class AdminOut(BaseModel):
    username:str

class BankInput(BaseModel):
    bank_name:str

class CurrencyInput(BaseModel):
    currency_name:str
    currency_icon: Optional[str]

class ExchangeRateBase(BaseModel):
    transactional_buying_price:float
    transactional_selling_price:float
    cash_buying_price:float
    cash_selling_price:float

class ExchangeRateInput(ExchangeRateBase):
    bank_id:int
    currency_id:int

class ExchangeRateOut(ExchangeRateBase):
    id:int
    bank_name:str
    currency_name:str
    currency_icon:str
    class Config:
        orm_mode = True

class PromotionalImagesIn(BaseModel):
    secure_url:str
    etag:str

class PromotionalImagesout(BaseModel):
    id:int
    title:str
    url:str
    class Config:
        orm_mode=True
