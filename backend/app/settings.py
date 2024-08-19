from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_hostname:str
    database_password:str
    database_name:str
    database_username:str
    secret_key:str
    algorithm:str
    access_token_expire_minutes:int
    cloud_name:str
    api_key:str
    api_secret:str
    secure:bool

    class Config:
        env_file = ".env"

settings = Settings()
