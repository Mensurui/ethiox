import jwt
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from ...v1.admin.services import admin_services
from ..schemas import auth_schemas
from fastapi import HTTPException, status, Depends
from ...config import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from ...settings import settings

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data:dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

'''
def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
'''


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db:AsyncSession=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Payload: {payload}")
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = auth_schemas.TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await admin_services.get_user(db=db, username=token_data.username)
    if user is None:
        raise credentials_exception
    print(f"User{user}")
    return user
