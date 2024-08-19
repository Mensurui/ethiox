from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....config import get_db
from ..services import user_services
from typing import List, Optional
from ..schemas import user_schemas
router = APIRouter()

@router.get('/user/xlist')
async def get_xchange(currency_id:Optional[int]=28, db:AsyncSession=Depends(get_db)):
    print(f"Received currency_id: {currency_id}")
    x_list = await user_services.exchange_list(currency_id=currency_id, db=db)
    print(f"Result: {x_list}")
    return x_list

@router.get('/user/xlist/tra_tsp')
async def get_topsp(currency_id: Optional[int]=10, db:AsyncSession=Depends(get_db)):
    x_tpt = await user_services.top_sellingrate(currency_id=currency_id, db=db)
    return x_tpt

@router.get('/user/xlist/tra_tbp')
async def get_topbp(currency_id:Optional[int]=10, db:AsyncSession=Depends(get_db)):
    x_tbp = await user_services.top_buyingrate(currency_id=currency_id, db=db)
    return x_tbp

@router.get('/user/xlist/cas_tsp')
async def get_cas_topsp(currency_id:Optional[int]=10, db:AsyncSession=Depends(get_db)):
    x_ctsp = await user_services.top_cashsellingrate(currency_id=currency_id, db=db)
    return x_ctsp

@router.get('/user/xlist/cas_tbp')
async def get_cas_topbp(currency_id:Optional[int]=10, db:AsyncSession=Depends(get_db)):
    x_xtbp = await user_services.top_cashbuyingrate(currency_id=currency_id, db=db)
    return x_xtbp

@router.get('/user/clist')
async def get_clist(db:AsyncSession=Depends(get_db)):
    c_values = await user_services.currency_list(db=db)
    return c_values

@router.get('/user/ad', response_model=List[user_schemas.ImageURLOut])
async def get_images_urls(db: AsyncSession = Depends(get_db)) -> List[user_schemas.ImageURLOut]:
    promo_values = await user_services.images_urls(db=db)
    return promo_values
