from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.security import verify_token
from sqlalchemy.orm import Session
import traceback
router = APIRouter()
from app.database import get_db
from app.schemas import UserSignup
from app.models import User
from app.security import hash_password
from app.schemas import UserSignup, UserLogin
from app.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.models import User
import secrets
from datetime import datetime, timedelta

from app.schemas import (
    ForgotPassword,
    ResetPassword
)
from app.mail import send_reset_email

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    try:
        print("Request received")

        existing_user = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        hashed_password = hash_password(user.password)

        new_user = User(
            username=user.username,
            email=user.email,
            password_hash=hashed_password
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User created successfully"}

    except Exception as e:
        print("ERROR:")
        traceback.print_exc()
        raise e



@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }        

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    email = verify_token(token)

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user



@router.get("/me")
def read_me(
    current_user: User = Depends(
        get_current_user
    )
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }   
 

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPassword,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        return {
            "message":
            "If account exists, reset link sent"
        }

    token = secrets.token_urlsafe(32)

    user.reset_token = token

    user.reset_token_expiry = (
        datetime.utcnow()
        + timedelta(minutes=30)
    )

    db.commit()

    reset_link = (
        f"http://localhost:5173/"
        f"reset?token={token}"
    )

    await send_reset_email(
    user.email,
    reset_link
)
    
    return {
    "message":
    "Reset email sent"
}
@router.post("/reset")
def reset_password(
    request: ResetPassword,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.reset_token == request.token
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )

    if user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Token expired"
        )

    user.password_hash = hash_password(
        request.password
    )

    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()

    return {
        "message": "Password reset successful"
    }    