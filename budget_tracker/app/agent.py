
"""
Agent Brain (Gemini Flash)

Handles:
- Chat responses
- Future Supabase tool integration
"""

import os
from dotenv import load_dotenv
from google import genai

# Load environment variables from .env
load_dotenv()

# =========================
# ENV VARIABLES
# =========================

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Missing GOOGLE_API_KEY in .env")

# =========================
# GEMINI CLIENT
# =========================

client = genai.Client(api_key=GOOGLE_API_KEY)

MODEL = "gemini-2.5-flash"

# =========================
# SYSTEM PROMPT
# =========================

SYSTEM_PROMPT = """
You are Budget Buddy, an AI finance assistant.

Your role:
- Help users track spending
- Explain budgets clearly
- Analyze categories
- Suggest savings improvements
- Predict end-of-month spending

Rules:
- Be concise
- Be numeric when possible
- Ask for missing data instead of guessing
"""


# =========================
# MAIN CHAT FUNCTION
# =========================

def ask(message: str) -> str:
    """
    Sends message to Gemini Flash and returns response.
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=[
            SYSTEM_PROMPT,
            message
        ]
    )

    return response.text


class Agent:
    def ask(self, message: str):
        return ask(message)

agent = Agent()