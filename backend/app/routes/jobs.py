import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from app.utils.security import get_current_user
from app.services.processor import JobProcessor
from app.config import VIDEO_DIR
from datetime import datetime
import os
import uuid
import threading

router = APIRouter(prefix="/jobs", tags=["jobs"])
processor = JobProcessor()

@router.post("/submit-url")
async def submit_url(youtube_url: str = Form(...), user=Depends(get_current_user)):
    from app.db import db
    job_id = str(uuid.uuid4())
    job_doc = {
        "_id": job_id,
        "id": job_id,
        "user_id": user["_id"],
        "source_type": "youtube",
        "source": youtube_url,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.jobs.insert_one(job_doc)
    threading.Thread(target=processor.process_job, args=(job_id,), daemon=True).start()
    return {"job_id": job_id, "status": "pending"}

@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...), user=Depends(get_current_user)):
    from app.db import db
    job_id = str(uuid.uuid4())
    file_path = os.path.join(VIDEO_DIR, f"{job_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    job_doc = {
        "_id": job_id,
        "id": job_id,
        "user_id": user["_id"],
        "source_type": "video",
        "source": file_path,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.jobs.insert_one(job_doc)
    threading.Thread(target=processor.process_job, args=(job_id,), daemon=True).start()
    return {"job_id": job_id, "status": "pending"}

@router.get("/")
async def list_jobs(user=Depends(get_current_user)):
    from app.db import db
    jobs = await db.jobs.find({"user_id": user["_id"]}).sort("created_at", -1).to_list(100)
    return jobs

@router.get("/{job_id}")
async def get_job(job_id: str, user=Depends(get_current_user)):
    from app.db import db
    job = await db.jobs.find_one({"_id": job_id, "user_id": user["_id"]})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/{job_id}/download/transcript")
async def download_transcript(job_id: str, user=Depends(get_current_user)):
    from app.db import db
    job = await db.jobs.find_one({"_id": job_id, "user_id": user["_id"]})
    if not job or not job.get("transcript_path"):
        raise HTTPException(status_code=404, detail="Transcript not found")
    return FileResponse(job["transcript_path"], filename=f"transcript_{job_id}.txt")

@router.get("/{job_id}/download/audio")
async def download_audio(job_id: str, user=Depends(get_current_user)):
    from app.db import db
    job = await db.jobs.find_one({"_id": job_id, "user_id": user["_id"]})
    if not job or not job.get("audio_path"):
        raise HTTPException(status_code=404, detail="Audio not found")
    return FileResponse(job["audio_path"], filename=f"audio_{job_id}.mp3")