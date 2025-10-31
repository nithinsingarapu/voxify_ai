from pydantic import BaseModel, Field, EmailStr, constr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=72)
    full_name: Optional[str] = None

class UserInDB(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    full_name: Optional[str] = None
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class JobCreate(BaseModel):
    user_id: str
    source_type: str  # "youtube" or "video"
    source: str       # url or filename

class JobInDB(BaseModel):
    id: Optional[str] = None
    user_id: str
    source_type: str
    source: str
    audio_path: Optional[str] = None
    transcript_path: Optional[str] = None
    summary: Optional[dict] = None
    status: str = "pending"  # pending, processing, done, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    error: Optional[str] = None
