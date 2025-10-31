from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.models_pydantic import UserCreate, Token
from app.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# bcrypt has a 72 byte limit
MAX_BCRYPT_LENGTH = 72

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

@router.post("/register")
async def register(user: UserCreate):
    from app.db import db
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Truncate password to 72 bytes for bcrypt
    password_bytes = user.password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
    hashed_password = pwd_context.hash(password_bytes.decode('utf-8'))
    
    user_doc = {
        "_id": user.email,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    from app.db import db
    user = await db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Truncate password to 72 bytes for bcrypt verification
    password_bytes = form_data.password.encode('utf-8')[:MAX_BCRYPT_LENGTH]
    password_to_verify = password_bytes.decode('utf-8')
    
    if not pwd_context.verify(password_to_verify, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token({"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}