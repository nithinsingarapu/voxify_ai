import os
from app.config import ASSEMBLY_API
import assemblyai as aai

# initialize once
if ASSEMBLY_API is None:
    raise RuntimeError("ASSEMBLY_API not set. Set it in .env")

aai.settings.api_key = ASSEMBLY_API

class AssemblyAITranscriberService:
    def __init__(self):
        self.config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.universal, speaker_labels=True)
        self.transcriber = aai.Transcriber(config=self.config)

    def transcribe(self, audio_path: str):
        """
        Return the transcript object from AssemblyAI (synchronous).
        Caller should extract utterances and text and save them.
        """
        transcript = self.transcriber.transcribe(audio_path)
        if transcript.status == "error":
            raise RuntimeError(f"Transcription failed: {transcript.error}")
        return transcript