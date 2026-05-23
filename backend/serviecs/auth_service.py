from sqlalchemy.orm import Session
from backend.models.user import User
from backend.core.security import verify_password,get_hash_password,create_access_token
from fastapi import HTTPException
from backend.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta



def register_user(data,db:Session):
    existing_user = db.query(User).filter((User.mail == data.mail) | (User.phone == data.phone)).first()

    if existing_user:
        raise HTTPException(status_code=400,detail="Username and Phone number already Exist")
    hashed_password = get_hash_password(data.password)

    user = User(
        name = data.name,
        phone = data.phone,
        mail = data.mail,
        hashed_password = hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"Message" : "Register Successfully"}

def login_user(data,db:Session):
    login_id = data.mail.strip()
    user = db.query(User).filter(User.mail == login_id).first()

    if not user and login_id.isdigit():
        user = db.query(User).filter(User.phone == int(login_id)).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username and password")
    
    if not verify_password(data.password,user.hashed_password):
        raise HTTPException(status_code=402, detail="Invalid username and password")
    access_token_expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(data={"sub" : user.mail},expires_delta= access_token_expire)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": user.name
    }


def user_delete(user_id:int,db:Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"Message" : "User not found"}
    
    db.delete(user)
    db.commit()

    return {"Message" : "User Deleted Successfully"}
