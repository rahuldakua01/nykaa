from datetime import datetime,timedelta,timezone
import jwt

from pwdlib import PasswordHash
from core.config import SECRET_KEY,ALGORITHM


password_hash = PasswordHash.recommended()

def verify_password(plain_password, hased_password):
    return password_hash.verify(plain_password, hased_password)


def get_hash_password(password):
    return password_hash.hash(password)

def create_access_token(data:dict, expires_delta : timedelta | None=None):
    to_encoded = data.copy()

    if expires_delta:
        expire = (
            datetime.now(timezone.utc)+expires_delta
        )
    else:
        expire = (
            datetime.now(timezone.utc) + timedelta(minutes=15)
        )
    
    to_encoded.update({"exp" : expire})

    encoded_jwt = jwt.encode(to_encoded,SECRET_KEY,ALGORITHM)

    return encoded_jwt


