from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from database import get_db
from schema import StaffLogin
from auth import authenticate_user, create_access_token, get_current_user
from datetime import timedelta

router = APIRouter()

@router.post("/auth/login")
def login(request: StaffLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": user.email_id}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="accessToken",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=3600
    )
    return {"message": "Login successful"}

@router.post("/auth/logout")
def logout(response: Response):
    response.set_cookie(
        key="accessToken",
        value="",
        httponly=True,
        secure=True,
        samesite="none",
        max_age=0
    )
    return {"message": "Logged out successfully"}