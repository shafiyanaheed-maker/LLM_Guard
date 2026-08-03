from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes import router
from app.login import router as login_router

app = FastAPI(
    title="LLM-Guard API",
    description="AI Prompt Firewall",
    version="1.0",
    debug=True
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
          "http://localhost:5173",
    "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(login_router)

app.mount("/dashboard", StaticFiles(directory="dashboard"), name="dashboard")


@app.get("/")
def home():
    return {
        "project": "LLM-Guard",
        "status": "Running",
        "message": "Welcome to LLM-Guard API"
    }
