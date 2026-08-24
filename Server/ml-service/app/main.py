from fastapi import FastAPI

from app.routes.food import router as food_router


app = FastAPI(
    title="Food Rescue ML Service",
    description="AI service for food analysis and NGO intelligence",
    version="1.0.0"
)

app.include_router(food_router)


@app.get("/")
def root():
    return {
        "service": "Food Rescue ML Service",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }