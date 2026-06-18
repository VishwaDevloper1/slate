from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import secrets
from datetime import datetime, timezone, timedelta

from app.database import get_db
from app.models import User
from app.security import hash_password, verify_password, create_access_token, verify_token
from app.schemas import UserSignup, UserLogin, ForgotPassword, ResetPassword
from app.mail import send_reset_email

router = APIRouter()

# The system-wide authorization parsing injection variable
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Bypasses the strict form-data requirement by consuming our validated UserLogin schema
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please try again."
        )

    # Sub contains our subject context identifier payload (User Email)
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }        


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User profile context not found."
        )
    return user


@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }   
 

@router.post("/forgot-password")
async def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    # Security best practice: avoid explicit feedback on whether an account exists
    if not user:
        return {"message": "If account exists, reset link sent"}

    token = secrets.token_urlsafe(32)
    user.reset_token = token
    # Explicitly using timezone-aware UTC format to match database tracking schemas
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=30)
    db.commit()

    reset_link = f"http://localhost:5173/reset?token={token}"
    await send_reset_email(user.email, reset_link)
    
    return {"message": "Reset email processed"}


@router.post("/reset")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == request.token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid recovery token signature."
        )

    # Ensure timestamp evaluations match timezone-aware data engines
    current_time = datetime.now(timezone.utc)
    expiry_time = user.reset_token_expiry.replace(tzinfo=timezone.utc) if user.reset_token_expiry.tzinfo is None else user.reset_token_expiry

    if expiry_time < current_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recovery window token expired."
        )

    user.password_hash = hash_password(request.password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return {"message": "Password reset successful"}