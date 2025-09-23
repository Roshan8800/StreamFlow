from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="PlayNite API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "PlayNite API is running!", "version": "1.0.0"}

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    role: str = "user"  # user or admin
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    preferences: dict = Field(default_factory=dict)
    watch_history: List[str] = Field(default_factory=list)
    favorites: List[str] = Field(default_factory=list)

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Video(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    google_drive_url: str
    embed_url: str
    thumbnail: Optional[str] = None
    category: str
    tags: List[str] = Field(default_factory=list)
    duration: Optional[int] = None  # in seconds
    views: int = 0
    likes: int = 0
    dislikes: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    uploaded_by: str  # admin user id

class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    google_drive_url: str
    category: str
    tags: List[str] = Field(default_factory=list)
    duration: Optional[int] = None

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    video_id: str
    user_id: str
    username: str
    text: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    likes: int = 0
    replies: List[dict] = Field(default_factory=list)

class CommentCreate(BaseModel):
    video_id: str
    text: str

# Mock authentication for now
def mock_get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # This will be replaced with real Firebase auth later
    return {
        "id": "mock-user-id",
        "email": "user@example.com",
        "username": "TestUser",
        "role": "user"
    }

def mock_get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # This will be replaced with real Firebase auth later
    return {
        "id": "mock-admin-id",
        "email": "admin@example.com",
        "username": "Admin",
        "role": "admin"
    }

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and 'T' in value:
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
    return item

# Auth Routes
@api_router.post("/auth/register", response_model=User)
async def register_user(user_data: UserCreate):
    # Mock user creation - will integrate with Firebase later
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = User(
        email=user_data.email,
        username=user_data.username,
        role="user"
    )
    user_dict = prepare_for_mongo(user.dict())
    await db.users.insert_one(user_dict)
    return user

@api_router.post("/auth/login")
async def login_user(login_data: UserLogin):
    # Mock login - will integrate with Firebase later
    user = await db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "access_token": f"mock-token-{user['id']}",
        "token_type": "bearer",
        "user": User(**parse_from_mongo(user))
    }

# User Routes
@api_router.get("/users/profile", response_model=User)
async def get_user_profile(current_user: dict = Depends(mock_get_current_user)):
    user = await db.users.find_one({"id": current_user["id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**parse_from_mongo(user))

@api_router.put("/users/profile", response_model=User)
async def update_user_profile(user_update: dict, current_user: dict = Depends(mock_get_current_user)):
    user_update["updated_at"] = datetime.now(timezone.utc)
    user_update = prepare_for_mongo(user_update)
    
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": user_update}
    )
    
    updated_user = await db.users.find_one({"id": current_user["id"]})
    return User(**parse_from_mongo(updated_user))

# Video Routes
@api_router.get("/videos", response_model=List[Video])
async def get_videos(category: Optional[str] = None, search: Optional[str] = None, limit: int = 20, skip: int = 0):
    query = {"is_active": True}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    videos = await db.videos.find(query).skip(skip).limit(limit).to_list(limit)
    return [Video(**parse_from_mongo(video)) for video in videos]

@api_router.get("/videos/{video_id}", response_model=Video)
async def get_video(video_id: str):
    video = await db.videos.find_one({"id": video_id, "is_active": True})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Increment view count
    await db.videos.update_one(
        {"id": video_id},
        {"$inc": {"views": 1}}
    )
    
    video["views"] += 1
    return Video(**parse_from_mongo(video))

@api_router.post("/videos/{video_id}/like")
async def toggle_video_like(video_id: str, current_user: dict = Depends(mock_get_current_user)):
    # This is a simplified toggle - in real app, track user likes
    video = await db.videos.find_one({"id": video_id})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    await db.videos.update_one(
        {"id": video_id},
        {"$inc": {"likes": 1}}
    )
    return {"message": "Video liked successfully"}

# Comment Routes
@api_router.get("/videos/{video_id}/comments", response_model=List[Comment])
async def get_video_comments(video_id: str):
    comments = await db.comments.find({"video_id": video_id}).sort("timestamp", -1).to_list(100)
    return [Comment(**parse_from_mongo(comment)) for comment in comments]

@api_router.post("/videos/{video_id}/comments", response_model=Comment)
async def create_comment(video_id: str, comment_data: CommentCreate, current_user: dict = Depends(mock_get_current_user)):
    comment = Comment(
        video_id=video_id,
        user_id=current_user["id"],
        username=current_user["username"],
        text=comment_data.text
    )
    comment_dict = prepare_for_mongo(comment.dict())
    await db.comments.insert_one(comment_dict)
    return comment

# Admin Routes
@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(current_user: dict = Depends(mock_get_admin_user)):
    users = await db.users.find().to_list(1000)
    return [User(**parse_from_mongo(user)) for user in users]

@api_router.post("/admin/videos", response_model=Video)
async def create_video(video_data: VideoCreate, current_user: dict = Depends(mock_get_admin_user)):
    # Generate embed URL from Google Drive URL
    embed_url = video_data.google_drive_url
    if "drive.google.com" in video_data.google_drive_url:
        file_id = video_data.google_drive_url.split("/d/")[1].split("/")[0] if "/d/" in video_data.google_drive_url else None
        if file_id:
            embed_url = f"https://drive.google.com/file/d/{file_id}/preview"
    
    video = Video(
        title=video_data.title,
        description=video_data.description,
        google_drive_url=video_data.google_drive_url,
        embed_url=embed_url,
        category=video_data.category,
        tags=video_data.tags,
        duration=video_data.duration,
        uploaded_by=current_user["id"]
    )
    video_dict = prepare_for_mongo(video.dict())
    await db.videos.insert_one(video_dict)
    return video

@api_router.get("/admin/analytics")
async def get_analytics(current_user: dict = Depends(mock_get_admin_user)):
    total_users = await db.users.count_documents({})
    total_videos = await db.videos.count_documents({"is_active": True})
    total_views = await db.videos.aggregate([
        {"$group": {"_id": None, "total_views": {"$sum": "$views"}}}
    ]).to_list(1)
    total_comments = await db.comments.count_documents({})
    
    return {
        "total_users": total_users,
        "total_videos": total_videos,
        "total_views": total_views[0]["total_views"] if total_views else 0,
        "total_comments": total_comments
    }

# Categories route
@api_router.get("/categories")
async def get_categories():
    return [
        "Action", "Comedy", "Drama", "Horror", "Romance", 
        "Thriller", "Sci-Fi", "Documentary", "Animation", "Adventure"
    ]

# Mock data seeding
@api_router.post("/admin/seed-data")
async def seed_mock_data(current_user: dict = Depends(mock_get_admin_user)):
    # Create sample videos
    sample_videos = [
        {
            "title": "Sample Video 1",
            "description": "This is a sample video for testing",
            "google_drive_url": "https://drive.google.com/file/d/1example/view",
            "embed_url": "https://drive.google.com/file/d/1example/preview",
            "category": "Action",
            "tags": ["sample", "test", "action"],
            "views": 150,
            "likes": 25
        },
        {
            "title": "Sample Video 2", 
            "description": "Another sample video",
            "google_drive_url": "https://drive.google.com/file/d/2example/view",
            "embed_url": "https://drive.google.com/file/d/2example/preview", 
            "category": "Comedy",
            "tags": ["sample", "comedy", "funny"],
            "views": 200,
            "likes": 40
        }
    ]
    
    for video_data in sample_videos:
        video = Video(**video_data, uploaded_by=current_user["id"])
        video_dict = prepare_for_mongo(video.dict())
        await db.videos.insert_one(video_dict)
    
    return {"message": "Mock data seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()