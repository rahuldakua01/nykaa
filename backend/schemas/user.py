from datetime import datetime

from pydantic import BaseModel,Field,EmailStr


class Register(BaseModel):
    name : str
    phone : int
    mail : EmailStr
    password : str=Field(min_length=6)


class Login(BaseModel):
    mail : str
    password : str


class Token(BaseModel):
    access_token : str
    token_type : str
    name : str


class UserStateData(BaseModel):
    cart: list[dict] = Field(default_factory=list)
    wishlist: list[str] = Field(default_factory=list)


class OrderCreate(BaseModel):
    order_id: str
    items: list[dict]
    address: dict
    totals: dict
    payment_method: str


class OrderOut(OrderCreate):
    created_at: datetime
