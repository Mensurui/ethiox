from ..schemas import admin_schemas
from fastapi import APIRouter, Depends, UploadFile, File
from ..services import admin_services
from ....config import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ....auth.services import auth_services
from ..models import admin_models
from pathlib import Path
import shutil
from fastapi.responses import JSONResponse

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
print(f"BaseDIR is:{BASE_DIR}")
UPLOAD_DIRECTORY = BASE_DIR / "static/images"

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
    return x_list

@router.delete('/admin/x_rlist')
async def remove_xchange(x_id: int, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    x_value = await admin_services.remove_exchange(x_id=x_id, db=db)
    return x_value

@router.post('/admin/upload-image')
async def add_image(file:UploadFile = File(...), current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        return JSONResponse(content={"error": "Invalid image format"}, status_code=400)
    Path(UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)
    file_path = Path(UPLOAD_DIRECTORY) / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    relative_url = f"/static/images/{file.filename}"
    db_image = admin_models.PromotionalImages(url=relative_url, title=file.filename)  # Adjust based on your Image model
    db.add(db_image)
    await db.commit()
    
    return {"url": relative_url}

@router.get('/admin/images')
async def get_images(current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    image_list = await admin_services.images(db=db)
    return image_list

@router.delete('/admin/images')
async def delete_image(image_id:int, current_user=Depends(auth_services.get_current_user), db:AsyncSession=Depends(get_db)):
    image_value = await admin_services.remove_image(image_id=image_id, db=db)
    return image_value
