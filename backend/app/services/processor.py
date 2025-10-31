import traceback
from app.services.audio_extractor import AudioExtractor
from app.services.transcriber import AssemblyAITranscriberService
from app.services.summarizer import SummarizerService
from app.utils.file_helpers import save_text_to_file
from app.config import TRANSCRIPTS_DIR
from datetime import datetime
import os
from pymongo import MongoClient
from app.config import MONGODB_URI, MONGO_DB_NAME

class JobProcessor:
    def __init__(self):
        self.extractor = AudioExtractor()
        self.transcriber = AssemblyAITranscriberService()
        self.summarizer = SummarizerService()
        # Use synchronous MongoDB client for background thread
        self.sync_client = MongoClient(MONGODB_URI)
        self.sync_db = self.sync_client[MONGO_DB_NAME]

    def process_job(self, job_id: str):
        """
        Blocking process that:
         - fetches job document
         - extracts audio (if needed)
         - transcribes via AssemblyAI
         - summarizes via OpenAI
         - persists results and updates job status in MongoDB
        """
        jobs = self.sync_db.jobs
        job = jobs.find_one({"_id": job_id})
        if not job:
            return

        try:
            jobs.update_one(
                {"_id": job_id}, 
                {"$set": {"status": "processing", "updated_at": datetime.utcnow()}}
            )

            source_type = job.get("source_type")
            source = job.get("source")

            # 1) Extract audio
            audio_path = self.extractor.extract(source, source_type)
            jobs.update_one(
                {"_id": job_id}, 
                {"$set": {"audio_path": audio_path, "updated_at": datetime.utcnow()}}
            )

            # 2) Transcribe
            transcript_obj = self.transcriber.transcribe(audio_path)
            # Build a single textual transcript (utterances)
            transcript_text = ""
            try:
                for utt in transcript_obj.utterances:
                    # Assembly's utterance speaker label may be like "spk_0"
                    speaker = getattr(utt, "speaker", None) or "Speaker"
                    transcript_text += f"{speaker}: {utt.text}\n"
            except Exception:
                # fallback if assembly transcript has a text field
                if hasattr(transcript_obj, "text"):
                    transcript_text = transcript_obj.text
                else:
                    transcript_text = str(transcript_obj)

            # Save transcript to file
            transcript_filename = f"transcript_{job_id}.txt"
            transcript_path = save_text_to_file(transcript_text, transcript_filename)
            jobs.update_one(
                {"_id": job_id}, 
                {"$set": {"transcript_path": transcript_path, "updated_at": datetime.utcnow()}}
            )

            # 3) Summarize
            summary = self.summarizer.summarize(transcript_text)
            jobs.update_one(
                {"_id": job_id}, 
                {"$set": {"summary": summary, "status": "done", "updated_at": datetime.utcnow()}}
            )

        except Exception as e:
            tb = traceback.format_exc()
            jobs.update_one(
                {"_id": job_id}, 
                {"$set": {"status": "failed", "error": str(e), "traceback": tb, "updated_at": datetime.utcnow()}}
            )