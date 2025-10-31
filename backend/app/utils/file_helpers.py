import os
from app.config import TRANSCRIPTS_DIR

def save_text_to_file(text: str, filename: str) -> str:
    file_path = os.path.join(TRANSCRIPTS_DIR, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
    return file_path