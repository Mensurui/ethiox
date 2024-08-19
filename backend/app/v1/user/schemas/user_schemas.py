from pydantic import BaseModel

class ExchangeRateBase(BaseModel):
    transactional_selling_price:float
    transactional_buying_price:float
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
    class Config():
        orm_mode = True

class ExchangeRateOutCSP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    cash_selling_price: float
    class Config():
        orm_mode = True

class ExchangeRateOutCBP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    cash_buying_price: float
    class Config():
        orm_mode = True

class ImageURLOut(BaseModel):
    url: str
    class Config:
        orm_mode=True

class ExchangeRateOutTSP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    transactional_selling_price: float
    class Config():
        orm_mode = True

class ExchangeRateOutTBP(BaseModel):
    bank_name:str
    currency_name:str
    currency_icon:str
    transactional_buying_price: float
    class Config():
        orm_mode = True

