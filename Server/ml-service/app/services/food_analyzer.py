import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.food import FoodAnalysis


# Find ml-service directory
BASE_DIR = Path(__file__).resolve().parents[2]

# Load ml-service/.env
load_dotenv(BASE_DIR / ".env")

# Read API key
api_key = os.getenv("GEMINI_API_KEY")

# Check API key
if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. Check Server/ml-service/.env"
    )

# Create Gemini client
client = genai.Client(
    api_key=api_key
)


def analyze_food(
        image_bytes: bytes,
        mime_type: str
) -> FoodAnalysis:

    prompt = """
You are an AI assistant for a food rescue platform.

Analyze the provided food image.

Determine:

1. Main food category (you MUST choose exactly one from this list):
   - Cooked Meals
   - Raw Vegetables
   - Fruits
   - Bakery Items
   - Packaged Food
   - Dairy
   - Beverages
   - Other

2. List the food items clearly visible.

3. Estimate the number of servings visible.
   This is only an estimate from the image.

4. Give your confidence from 0 to 1.

5. Assess apparent donation suitability:
   - SUITABLE
   - QUESTIONABLE
   - UNSUITABLE
   - UNKNOWN

Important:
A photograph cannot guarantee that food is actually safe to eat.

6. Estimate urgency:
   - HIGH
   - MEDIUM
   - LOW

Return only the requested structured response.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            ),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FoodAnalysis
        )
    )

    return FoodAnalysis.model_validate_json(
        response.text
    )