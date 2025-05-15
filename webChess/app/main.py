from fastapi import FastAPI
from .api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MiniChess API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
app.include_router(router)
