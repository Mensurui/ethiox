from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from ..schemas import auth_schemas
from ..services import auth_services
from ...v1.admin.services import admin_services
from ...config import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db:AsyncSession=Depends(get_db)
) -> auth_schemas.Token:
    user = await admin_services.authenticate_user(form_data.username, form_data.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth_services.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_services.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return auth_schemas.Token(access_token=access_token, token_type="bearer")


@router.get("/admin/me")
async def read_users_me(
    current_user = Depends(auth_services.get_current_user),
): 
    print(f"Current User: {current_user}")
    return current_user
    
