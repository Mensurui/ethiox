from pydantic import BaseModel
from typing import Optional, List
from datetime import date

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

class Article(BaseModel):
    title:str
    sub_title:str
    content:str
    source:str
    article_category_id:int
    date_published:date

class ArticleOut(BaseModel):
    title:str
    sub_title:str
    content:str
    source:str
    author:Optional[str]=None
    article_category_name:str
    date_published:date
    class Config:
        orm_mode=True

class ArticlesShowcase(BaseModel):
    id:int
    title:str
    source:str
    date_published:date
    class Config:
        orm_mode = True
