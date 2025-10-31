# import json
# import os
# from openai import OpenAI
# from app.config import OPENAI_API_KEY

# if not OPENAI_API_KEY:
#     raise RuntimeError("OPENAI_API_KEY not set in .env")

# client = OpenAI(api_key=OPENAI_API_KEY)

# PODCAST_SUMMARY_PROMPT_TEMPLATE = """
# You are an expert podcast analyst, journalist, and content strategist.
# Your goal is to extract the maximum value from a podcast transcript.
# Return strictly valid JSON following this shape:
# {{
#   "summary": "...",
#   "speaker_highlights": [...],
#   "key_takeaways": [...],
#   "memorable_quotes": [...]
# }}
# Now analyze the transcript below and output only valid JSON.

# Transcript:
# \"\"\"{transcript_text}\"\"\"
# """

# class SummarizerService:
#     def __init__(self, model_name="gpt-4o-mini"):
#         self.model_name = model_name

#     def summarize(self, transcript_text: str) -> dict:
#         prompt = PODCAST_SUMMARY_PROMPT_TEMPLATE.format(transcript_text=transcript_text)
#         try:
#             response = client.chat.completions.create(
#                 model=self.model_name,
#                 messages=[
#                     {"role": "system", "content": "You are an expert podcast analyst. Always respond with valid JSON only."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 temperature=0.4,
#                 response_format={"type": "json_object"}
#             )
#             text = response.choices[0].message.content.strip()
#             return json.loads(text)
#         except Exception as e:
#             # if the response isn't perfect JSON, return raw text to debug
#             return {"error": f"summarization failed: {str(e)}", "raw": str(e)}




#FOR GEMINI API KEY
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set in .env")
genai.configure(api_key=API_KEY)

PODCAST_SUMMARY_TEMPLATE = """
You are an expert podcast analyst, journalist, and content strategist.
Your goal is to extract the **maximum value** from a podcast transcript.

### Your task:
Analyze the entire transcript deeply and return structured insights in **valid JSON** format.

---

### JSON OUTPUT FORMAT (strictly follow this format):
{{
  "summary": "A 3-4 paragraph detailed summary capturing tone, context, and flow of discussion.",
  "speaker_highlights": [
      "Speaker 1: what they mainly discussed or emphasized",
      "Speaker 2: their viewpoints or experiences"
  ],
  "key_takeaways": [
      "Insight 1 : concise but meaningful",
      "Insight 2 : actionable or thought-provoking point",
      "Insight 3 : key debate, idea, or conclusion"
  ],
  "memorable_quotes": [
      "\"Exact quote or rephrased impactful statement\"",
      "\"Another quote capturing emotion or essence\""
  ]
}}

---

### Guidelines:
- Write **professionally**, like a podcast editor summarizing for an article.
- Identify **themes**, **arguments**, and **emotional tone**.
- Capture **flow of ideas** (e.g., topic transitions or debates).
- Mention **who said what**, when possible (use generic speaker labels if names unknown).
- Keep the **summary coherent and objective** — no hallucinations or extra facts.
- Output **only valid JSON**, nothing else.

---

Now, here is the podcast transcript:
\"\"\"{transcript_text}\"\"\"
"""

class SummarizerService:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or MODEL
        self.model = genai.GenerativeModel(self.model_name)

    def summarize(self, transcript_text: str) -> dict:
        prompt = PODCAST_SUMMARY_TEMPLATE.format(transcript_text=transcript_text)
        text = None
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"temperature": 0.4}
            )
            text = getattr(response, "text", str(response)).strip()
            if text.startswith("```"):
                if text.startswith("```json"):
                    text = text[len("```json"):].strip()
                else:
                    text = text[len("```"):].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
            return json.loads(text)
        except Exception as e:
            return {"error": f"summarization failed: {str(e)}", "raw": str(e)}


