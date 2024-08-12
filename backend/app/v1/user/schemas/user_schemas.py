from pydantic import BaseModel

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
    class Config():
        orm_mode = True

class ExchangeRateOutSP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    selling_price: float
    class Config():
        orm_mode = True

class ExchangeRateOutBP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    buying_price: float
    class Config():
        orm_mode = True

class ImageURLOut(BaseModel):
    url: str
    class Config:
        orm_mode=True
