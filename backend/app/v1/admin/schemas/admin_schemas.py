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
    selling_price:float
    buying_price:float

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

class PromotionalImagesout(BaseModel):
    id:int
    title:str
    class Config:
        orm_mode=True
