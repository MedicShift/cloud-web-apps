from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from routers import auth, staff, hospital, department, request_router, shift
from schemas import scheduling
from database import engine
from models import base

# Create database tables
base.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nurse Scheduling API",
    version="1.0.0",
    description="Advanced nurse scheduling system with constraint satisfaction"
)

# CORS - Updated for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",  # Angular
        "http://localhost:3000",  # React
        "http://localhost:19000", # React Native Expo
        "http://localhost:19001",
        "http://localhost:19006",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(staff.router, prefix="/api", tags=["staff"])
app.include_router(hospital.router, prefix="/api", tags=["hospital"])
app.include_router(department.router, prefix="/api", tags=["department"])
app.include_router(request_router.router, prefix="/api", tags=["request"])
app.include_router(shift.router, prefix="/api", tags=["shift"])
# app.include_router(scheduling.router, prefix="/api", tags=["scheduling"])  # NEW

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Nurse Scheduling API",
        "version": "1.0.0",
        "features": [
            "Staff management",
            "Shift management",
            "Configurable scheduling rules",
            "Constraint satisfaction scheduling",
            "Leave management"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}