from fastapi import FastAPI 
from .config import init_db
from app.v1.admin.endpoints import admin_endpoints
from app.auth.endpoints import auth_endpoints
from app.v1.user.endpoints import user_endpoints
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import JSONResponse
import os
import sys
sys.path.append('./backend')


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

top = Path(__file__).resolve().parent
print(f"Serving static files from: {top}/static")


@app.on_event("startup")
async def on_startup():
    await init_db()

app.mount("/static", StaticFiles(directory=f"{top}/static"), name="static")

@app.get("/")
async def root():
    return {"message":"ETXchange Admin Panel"}

print("Starting FastAPI application...")

@app.get("/list-static-files")
async def list_static_files():
    static_dir = f"{top}/static/images"
    files = os.listdir(static_dir)
    return JSONResponse(files)

app.include_router(admin_endpoints.router)
app.include_router(auth_endpoints.router)
app.include_router(user_endpoints.router)
