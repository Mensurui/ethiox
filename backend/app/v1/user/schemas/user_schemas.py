from pydantic import BaseModel
from datetime import date
from typing import Optional

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

class ArticlesShowcase(BaseModel):
    id:int
    title:str
    source:str
    date_published:date

class ArticlesShowcaseMore(ArticlesShowcase):
    article_category_name:str

class ArticleOut(BaseModel):
    title:str
    sub_title:str
    content:str
    source:str
    author:Optional[str]=None
    article_category_name:str
    article_category_id:int
    date_published:date
