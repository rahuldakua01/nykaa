import json

import jwt
from jwt import InvalidTokenError
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.schemas.user import Register,Login,Token,UserStateData,OrderCreate,OrderOut
from backend.serviecs.auth_service import register_user,login_user,user_delete
from fastapi.routing import APIRouter
from fastapi import Depends,Form,HTTPException
from backend.core.config import SECRET_KEY,ALGORITHM
from backend.core.dependencies import get_db
from sqlalchemy.orm import Session
from pydantic import EmailStr
from backend.models.user import User
from backend.models.user_state import UserState
from backend.models.order import Order


router = APIRouter()
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        mail = payload.get("sub")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if not mail:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.mail == mail).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# @router.post("/register")
# def register(data:Register,db:Session=Depends(get_db)):
#     return register_user(data,db)


@router.post("/login",response_model=Token)
def login(data:Login,db:Session=Depends(get_db)):
    return login_user(data,db)

@router.delete("/delete{user_id}")
def delete(user_id:int,db:Session=Depends(get_db)):
    return user_delete(user_id,db)

@router.post("/register")
def register(
    name: str = Form(...),
    phone: int = Form(...),
    mail: EmailStr = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    data = Register(
        name = name,
        phone = phone,
        mail = mail,
        password = password
    )
    return register_user(data, db)


@router.get("/user-state", response_model=UserStateData)
def get_user_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    state = db.query(UserState).filter(UserState.user_id == current_user.id).first()
    if not state:
        return UserStateData()

    return UserStateData(
        cart=json.loads(state.cart or "[]"),
        wishlist=json.loads(state.wishlist or "[]")
    )


@router.put("/user-state", response_model=UserStateData)
def update_user_state(
    data: UserStateData,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    state = db.query(UserState).filter(UserState.user_id == current_user.id).first()
    if not state:
        state = UserState(user_id=current_user.id)
        db.add(state)

    state.cart = json.dumps(data.cart)
    state.wishlist = json.dumps(data.wishlist)
    db.commit()
    db.refresh(state)

    return data


@router.post("/orders", response_model=OrderOut)
def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = Order(
        user_id=current_user.id,
        order_id=data.order_id,
        items=json.dumps(data.items),
        address=json.dumps(data.address),
        totals=json.dumps(data.totals),
        payment_method=data.payment_method
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return OrderOut(
        order_id=order.order_id,
        items=json.loads(order.items),
        address=json.loads(order.address),
        totals=json.loads(order.totals),
        payment_method=order.payment_method,
        created_at=order.created_at
    )


@router.get("/orders", response_model=list[OrderOut])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return [
        OrderOut(
            order_id=order.order_id,
            items=json.loads(order.items),
            address=json.loads(order.address),
            totals=json.loads(order.totals),
            payment_method=order.payment_method,
            created_at=order.created_at
        )
        for order in orders
    ]
