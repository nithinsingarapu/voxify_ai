import os
from ..config import TRANSCRIPTS_DIR

def save_text(text: str, filename_prefix: str):
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
    filename = f"{filename_prefix}.txt"
    path = os.path.join(TRANSCRIPTS_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    return path
