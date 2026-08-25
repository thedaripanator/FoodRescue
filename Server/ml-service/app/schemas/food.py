from typing import List, Literal
from pydantic import BaseModel, Field


class FoodAnalysis(BaseModel):

    foodType: Literal[
        "Cooked Meals",
        "Raw Vegetables",
        "Fruits",
        "Bakery Items",
        "Packaged Food",
        "Dairy",
        "Beverages",
        "Other"
    ] = Field(
        description="Main food category visible in the image."
    )

    foodItems: List[str] = Field(
        description="Food items clearly visible in the image."
    )

    estimatedServings: int = Field(
        ge=0,
        description="Estimated number of servings. This is only an estimate from the image."
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence in the overall food analysis, from 0 to 1."
    )

    suitability: Literal[
        "SUITABLE",
        "QUESTIONABLE",
        "UNSUITABLE",
        "UNKNOWN"
    ] = Field(
        description="Whether the visible food appears suitable for donation. Image analysis cannot guarantee food safety."
    )

    urgency: Literal[
        "LOW",
        "MEDIUM",
        "HIGH"
    ] = Field(
        description="Suggested urgency based on the apparent food type and perishability."
    )