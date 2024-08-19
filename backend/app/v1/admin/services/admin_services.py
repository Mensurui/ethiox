from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas import admin_schemas
from fastapi import Depends, HTTPException
from ....config import get_db
from ..models import admin_models
from ..utils import admin_utils 
from ....auth.services import auth_services
from datetime import timedelta
from sqlalchemy.future import select
from sqlalchemy import delete, desc
from sqlalchemy import func, distinct

async def get_user(username:str, db:AsyncSession=Depends(get_db)):
    user_query = select(admin_models.Admin).where(admin_models.Admin.username==username)
    user_data = await db.execute(user_query)
    user = user_data.scalar()
    if not user:
        raise HTTPException(status_code=404, detail=f"Incorrect data")
    return user

async def authenticate_user(username:str, password:str, db:AsyncSession=Depends(get_db)):
    user = await get_user(username, db)
    if not user:
        return False
    if not admin_utils.verify_password(password, user.password):
        return False
    return user

async def registration(admin_data:admin_schemas.AdminInput, db:AsyncSession=Depends(get_db)):
    db_admin = admin_models.Admin(**admin_data.dict())
    db_admin.password = admin_utils.get_password_hash(db_admin.password)
    db.add(db_admin)
    await db.commit()
    await db.refresh(db_admin)

    access_token_expires = timedelta(minutes=auth_services.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_services.create_access_token(data={"sub":db_admin.username}, expires_delta=access_token_expires)
    return {"access_token":access_token, "token_type":"Bearer"}

async def bregistration(bank_name:admin_schemas.BankInput, db:AsyncSession=Depends(get_db)):
    db_bank = admin_models.Bank(**bank_name.dict())
    db.add(db_bank)
    await db.commit()
    await db.refresh(db_bank)
    return db_bank

async def bankslist(db:AsyncSession=Depends(get_db)):
    bank_query = select(admin_models.Bank)
    bank_data = await db.execute(bank_query)
    bank_list = bank_data.scalars().all()
    return bank_list

async def remove_bank(bank_id: int, db: AsyncSession = Depends(get_db)):
    bank_query = select(admin_models.Bank).where(admin_models.Bank.id == bank_id)
    bank_data = await db.execute(bank_query)
    bank_instance = bank_data.scalars().first()

    if bank_instance is None:
        raise HTTPException(status_code=404, detail="Bank with that ID doesn't exist")

    bankdelete_query = delete(admin_models.Bank).where(admin_models.Bank.id == bank_id)
    await db.execute(bankdelete_query)
    await db.commit()  # Commit the transaction

    return {"detail": "Success"}

async def currency(currency_data:admin_schemas.CurrencyInput, db:AsyncSession=Depends(get_db)):
    db_curr = admin_models.Currency(**currency_data.dict())
    db.add(db_curr)
    await db.commit()
    await db.refresh(db_curr)
    return db_curr

async def currencylist(db:AsyncSession=Depends(get_db)):
    currency_query = select(admin_models.Currency)
    currency_data = await db.execute(currency_query)
    currency_list = currency_data.scalars().all()
    return currency_list

async def remove_currency(currency_id:int, db:AsyncSession=Depends(get_db)):
    currency_query = select(admin_models.Currency).where(admin_models.Currency.id == currency_id)
    currency_data = await db.execute(currency_query)
    currency_instance = currency_data.scalars().first()
    if not currency_instance:
        raise HTTPException(status_code=404, detail="Not Found")

    currencydelete_query = delete(admin_models.Currency).where(admin_models.Currency.id == currency_id)
    await db.execute(currencydelete_query)
    await db.commit()
    return {"detail":"Success"}

async def exchange_rate(xchange_data:admin_schemas.ExchangeRateInput, db:AsyncSession=Depends(get_db)):
    db_xrate = admin_models.DailyExchangeRate(**xchange_data.dict())
    db.add(db_xrate)
    await db.commit()
    await db.refresh(db_xrate)
    return db_xrate


async def exchange_list(db: AsyncSession = Depends()):
    # Subquery to get the latest date for each bank
    subquery = (
        select(
            admin_models.DailyExchangeRate.bank_id,
            func.max(admin_models.DailyExchangeRate.date).label("latest_date")
        )
        .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
        .subquery()
    )
    
    # Main query to select unique bank data based on the latest date
    exchange_query = (
        select(admin_models.DailyExchangeRate)
        .join(
            subquery,
            (admin_models.DailyExchangeRate.bank_id == subquery.c.bank_id) &
            (admin_models.DailyExchangeRate.date == subquery.c.latest_date)
        )
        .options(
            joinedload(admin_models.DailyExchangeRate.bank),
            joinedload(admin_models.DailyExchangeRate.currency)
        )
        .order_by(desc(admin_models.DailyExchangeRate.date))
    )
    
    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()

    exchange_listed = [
        admin_schemas.ExchangeRateOut(
            id=x.id,
            transactional_selling_price=x.transactional_selling_price,
            transactional_buying_price=x.transactional_buying_price,
            cash_selling_price=x.cash_selling_price,
            cash_buying_price=x.cash_buying_price,
            bank_name=x.bank.bank_name,
            currency_name=x.currency.currency_name,
            currency_icon=x.currency.currency_icon
        )
        for x in exchange_list
    ]
    return exchange_listed


async def remove_exchange(x_id:int, db:AsyncSession=Depends(get_db)):
    exchange_query = select(admin_models.DailyExchangeRate).where(admin_models.DailyExchangeRate.id == x_id)
    exchange_operation = await db.execute(exchange_query)
    exchange_data = exchange_operation.scalars().first()

    if not exchange_data:
        raise HTTPException(status_code=404, details="No data")

    delete_query = delete(admin_models.DailyExchangeRate).where(admin_models.DailyExchangeRate.id == x_id)
    await db.execute(delete_query)
    await db.commit()
    return {"detail":"Success"}

async def add_image(image_data: admin_schemas.PromotionalImagesIn, db:AsyncSession=Depends(get_db)):
    db_image = admin_models.PromotionalImages(
            url = image_data.secure_url,
            title = image_data.etag
            )
    db.add(db_image)
    await db.commit()
    await db.refresh(db_image)
    return {"message":"success"}

async def images(db:AsyncSession=Depends(get_db)):
    images_query = select(admin_models.PromotionalImages)
    images_operation = await db.execute(images_query)
    images_data = images_operation.scalars().all()
    images_listed = [
            admin_schemas.PromotionalImagesout(
                id = image.id,
                title = image.title,
                url = image.url
                )for image in images_data
            ]
    return images_listed

async def remove_image(image_id:int, db:AsyncSession=Depends(get_db)):
    image_query = select(admin_models.PromotionalImages).where(admin_models.PromotionalImages.id == image_id)
    image_operation = await db.execute(image_query)
    image_data = image_operation.scalars().first()

    if not image_data:
        raise HTTPException(status_code=404, details="No data")

    delete_query = delete(admin_models.PromotionalImages).where(admin_models.PromotionalImages.id == image_id)
    await db.execute(delete_query)
    await db.commit()
    return {"detail":"Success"}
