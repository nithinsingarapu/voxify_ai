import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "voxify")
ASSEMBLY_API = os.getenv("ASSEMBLY_API")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
STORAGE_DIR = os.getenv("STORAGE_DIR", "./data")
AUDIO_DIR = os.path.join(STORAGE_DIR, "audio")
VIDEO_DIR = os.path.join(STORAGE_DIR, "videos")
TRANSCRIPTS_DIR = os.path.join(STORAGE_DIR, "transcripts")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
