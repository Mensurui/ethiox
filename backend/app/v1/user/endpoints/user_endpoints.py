from fastapi import APIRouter
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ....config import get_db
from ..services import user_services
from typing import List, Optional
from ..schemas import user_schemas
router = APIRouter()

@router.get('/user/xlist')
async def get_xchange(currency_id:Optional[int]=7, db:AsyncSession=Depends(get_db)):
    x_list = await user_services.exchange_list(currency_id=currency_id, db=db)
    return x_list

@router.get('/user/xlist/tsp')
async def get_topsp(currency_name: Optional[str]="Dollar", db:AsyncSession=Depends(get_db)):
    x_tpt = await user_services.top_sellingrate(currency_name=currency_name, db=db)
    return x_tpt

@router.get('/user/xlist/tbp')
async def get_topbp(currency_name:Optional[str]="Dollar", db:AsyncSession=Depends(get_db)):
    x_tbp = await user_services.top_buyingrate(currency_name=currency_name, db=db)
    return x_tbp

@router.get('/user/clist')
async def get_clist(db:AsyncSession=Depends(get_db)):
    c_values = await user_services.currency_list(db=db)
    return c_values

@router.get('/user/ad', response_model=List[user_schemas.ImageURLOut])
async def get_images_urls(db: AsyncSession = Depends(get_db)) -> List[user_schemas.ImageURLOut]:
    promo_values = await user_services.images_urls(db=db)
    return promo_values
