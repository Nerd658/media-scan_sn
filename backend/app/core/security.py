from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt, JWTError
import bcrypt # Import bcrypt directly
from ..config import settings
from ..schemas.user import TokenData

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # No longer needed

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm

def create_access_token(subject: Union[str, Any], role: str, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30) # Default 30 minutes
    to_encode = {"exp": expire, "sub": str(subject), "role": role}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Union[TokenData, None]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            return None
        return TokenData(email=email, role=role)
    except JWTError:
        return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Encode plain password to bytes and check against hashed password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    # Encode password to bytes and truncate to 72 bytes
    truncated_password_bytes = password.encode('utf-8')[:72]
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(truncated_password_bytes, salt)
    return hashed_password.decode('utf-8') # Decode back to string for storage
