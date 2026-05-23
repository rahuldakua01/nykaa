from pathlib import Path

from fastapi import FastAPI,Request
from fastapi.responses import HTMLResponse
from backend.api.routers import api_router
from backend.db.base import Base
from backend.db.session import engine
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)
app = FastAPI(title="Rahul")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

templates = Jinja2Templates(directory=FRONTEND_DIR / "templates")
app.mount("/static",StaticFiles(directory=FRONTEND_DIR / "statics"),name="static")

@app.get("/",response_class=HTMLResponse)
def home(request : Request):
    return templates.TemplateResponse(request=request , name="index.html")

# @app.get("/")
# def home():
#     return HTMLResponse("<h1>Welcome to my website</h1>")
