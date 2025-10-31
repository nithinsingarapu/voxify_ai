import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URI, MONGO_DB_NAME

client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGO_DB_NAME]

# collections used:
# db.users
# db.jobs