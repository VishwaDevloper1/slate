from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig
)
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_USER"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)


async def send_reset_email(
    email: str,
    reset_link: str
):

    message = MessageSchema(
        subject="Reset Your Password",
        recipients=[email],
        body=f"""
Click the link below to reset your password:

{reset_link}

This link expires in 30 minutes.
""",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)