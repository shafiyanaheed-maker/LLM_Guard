import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Gemini API Key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=api_key)

# Original Gemini Model
MODEL_NAME = "gemini-flash-latest"

# Initialize Gemini model
model = genai.GenerativeModel(MODEL_NAME)


def forward_prompt(prompt: str):
    """
    Sends the prompt to Google Gemini and returns the response.
    """

    try:
        response = model.generate_content(prompt)

        return {
            "model": MODEL_NAME,
            "response": response.text
        }

    except Exception as e:
        return {
            "model": MODEL_NAME,
            "response": f"Gemini API Error: {str(e)}"
        }