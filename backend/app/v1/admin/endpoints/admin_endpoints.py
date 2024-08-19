from ..schemas import admin_schemas
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from ..services import admin_services
from ....config import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ....auth.services import auth_services
from ..models import admin_models
from pathlib import Path
import shutil
from fastapi.responses import JSONResponse
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from ....settings import settings


router = APIRouter()

cloudinary.config(
        cloud_name = f"{settings.cloud_name}",
        api_key = f"{settings.api_key}",
        api_secret = f"{settings.api_secret}",
        secure = f"{settings.secure}"
        )

@router.post('/admin/register')
async def admin_register(admin_data:admin_schemas.AdminInput, db:AsyncSession=Depends(get_db)):
    registration_value = await admin_services.registration(admin_data=admin_data, db=db)
    print(f"Register Value: {registration_value}")
    return registration_value

@router.post('/admin/add_banks')
async def bank_register(bank_name:admin_schemas.BankInput, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    print(f"Bank Name")
    b_registration_value = await admin_services.bregistration(bank_name=bank_name, db=db)
    return b_registration_value

@router.get('/admin/blist')
async def getBanks(current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    b_value = await admin_services.bankslist(db=db)
    return b_value

@router.delete('/admin/blist')
async def deleteBank(bank_id:int, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    b_value = await admin_services.remove_bank(bank_id=bank_id, db=db)
    return b_value

@router.post('/admin/add_currency')
async def add_currency(currency_data:admin_schemas.CurrencyInput, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    curr_value = await admin_services.currency(currency_data=currency_data, db=db)
    return curr_value

@router.get('/admin/clist')
async def get_currency(current_user=Depends(auth_services.get_current_user),db:AsyncSession=Depends(get_db)):
    curr_list = await admin_services.currencylist(db=db)
    return curr_list

@router.delete('/admin/clist')
async def delete_currency(currency_id:int, current_user=Depends(auth_services.get_current_user),db:AsyncSession=Depends(get_db)):
    c_value = await admin_services.remove_currency(currency_id=currency_id, db=db)
    return c_value

@router.post('/admin/add_xchange')
async def add_xchange(xchange_data:admin_schemas.ExchangeRateInput, current_user=Depends(auth_services.get_current_user),db:AsyncSession=Depends(get_db)):
    x_value = await admin_services.exchange_rate(xchange_data = xchange_data, db=db)
    return x_value

@router.get('/admin/xlist')
async def get_xchange(current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    x_list = await admin_services.exchange_list(db=db)
    print(f"ExchangeList: {x_list}")
    return x_list

@router.delete('/admin/x_rlist')
async def remove_xchange(x_id: int, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    x_value = await admin_services.remove_exchange(x_id=x_id, db=db)
    return x_value

@router.post('/admin/upload-image')
async def add_images(file:UploadFile = File(...), current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    try:
        result = upload(file.file)
        print(f"Result: {result}")
        await admin_services.add_image(image_data=admin_schemas.PromotionalImagesIn(secure_url=result["secure_url"], etag=result["etag"]), db=db)
        return {"success"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error{e}")

@router.get('/admin/images')
async def get_images(current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    image_list = await admin_services.images(db=db)
    return image_list

@router.delete('/admin/images')
async def delete_image(image_id:int, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    image_value = await admin_services.remove_image(image_id=image_id, db=db)
    return image_value
