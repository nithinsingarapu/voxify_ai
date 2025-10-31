import os
import subprocess
import yt_dlp
from urllib.parse import urlparse
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.config import AUDIO_DIR, VIDEO_DIR

class AudioExtractor:
    def __init__(self, output_dir: str = AUDIO_DIR):
        os.makedirs(output_dir, exist_ok=True)
        self.output_dir = output_dir

    def is_youtube_url(self, url: str) -> bool:
        parsed = urlparse(url)
        return "youtube.com" in parsed.netloc or "youtu.be" in parsed.netloc

    def extract_from_youtube(self, youtube_url: str) -> str:
        """Download and extract best-quality audio (mp3 320kbps)"""
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(self.output_dir, '%(id)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '320',
            }],
            'quiet': True
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=True)
            audio_file = os.path.join(self.output_dir, f"{info['id']}.mp3")
        return audio_file

    def extract_from_video(self, video_path: str, output_format: str = "wav") -> str:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        output_path = os.path.join(self.output_dir, os.path.splitext(os.path.basename(video_path))[0] + f".{output_format}")

        # Use ffmpeg - copy audio codec if possible
        cmd = [
            "ffmpeg", "-y", "-i", video_path,
            "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
            output_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT, check=False)
        return output_path

    def extract(self, input_source: str, source_type: str):
        if source_type == "youtube" or self.is_youtube_url(input_source):
            return self.extract_from_youtube(input_source)
        return self.extract_from_video(input_source)