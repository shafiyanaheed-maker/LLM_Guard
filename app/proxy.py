import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=api_key)

MODEL_NAME = "gemini-flash-latest"

model = genai.GenerativeModel(MODEL_NAME)


def forward_prompt(prompt: str):
    """
    Sends the prompt to Google Gemini and measures API latency.
    """

    start_time = time.perf_counter()

    try:
        response = model.generate_content(prompt)

        elapsed = time.perf_counter() - start_time

        print(f"[LATENCY] Gemini API: {elapsed:.3f} seconds")

        return {
            "success": True,
            "model": MODEL_NAME,
            "response": response.text,
            "latency_seconds": round(elapsed, 3)
        }

    except Exception as e:
        elapsed = time.perf_counter() - start_time

        print(f"[LATENCY] Gemini API failed after {elapsed:.3f} seconds")

        return {
            "success": False,
            "model": MODEL_NAME,
            "response": None,
            "latency_seconds": round(elapsed, 3),
            "error": f"Gemini API Error: {str(e)}"
        }