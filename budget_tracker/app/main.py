"""
FastAPI Backend

Exposes API endpoints for the React frontend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agent import agent
from .tools import (
    get_budget_summary,
    get_category_breakdown,
    today_summary
)

app = FastAPI(
    title="Budget Buddy API",
    version="1.0"
)

# =========================
# CORS CONFIG
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|.*\.onrender\.com)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# =========================
# REQUEST MODEL
# =========================

class ChatRequest(BaseModel):
    message: str


# =========================
# API ENDPOINTS
# =========================

@app.get("/")
def home():
    return {
        "message": "Budget Buddy API is running."
    }


@app.post("/chat")
def chat(request: ChatRequest):

    response = agent.ask(request.message)

    return {
        "reply": response
    }


@app.get("/summary")
def summary():
    return get_budget_summary()


@app.get("/categories")
def categories():
    return get_category_breakdown()


@app.get("/today")
def get_today():
    return today_summary()