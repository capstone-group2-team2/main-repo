from pydantic import BaseModel, EmailStr


# ==========================================================
# Employee Login
# ==========================================================

class EmployeeLoginRequest(BaseModel):
    username: str
    password: str


# ==========================================================
# Customer Login
# ==========================================================

class CustomerLoginRequest(BaseModel):
    username: str
    password: str


# ==========================================================
# Login Response
# ==========================================================

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    user_id: str
    role: str