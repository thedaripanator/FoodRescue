from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.food_analyzer import analyze_food


router = APIRouter(
    prefix="/ml",
    tags=["Food Analysis"]
)


@router.post("/analyze-food")
async def analyze_food_image(
        image: UploadFile = File(...)
):

    if not image.content_type:
        raise HTTPException(
            status_code=400,
            detail="Image content type is missing"
        )

    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed"
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Empty image file"
        )

    try:

        result = analyze_food(
            image_bytes=image_bytes,
            mime_type=image.content_type
        )

        return {
            "filename": image.filename,
            "analysis": result.model_dump()
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Food analysis failed: {str(e)}"
        )