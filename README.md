# Voxify_AI
**An Intelligent Hybrid System for Scalable Podcast Transcription, Analysis & Summarization**

---

### 📄 Abstract

Voxify AI is a hybrid AI system that transforms long-form, multi-speaker podcasts into structured transcripts, speaker-aware labels, and coherent summaries. The system integrates AssemblyAI’s unified ASR + speaker diarization with Google Gemini 1.5 Flash, enabling long-context abstractive summarization of multi-hour podcast transcripts in a single-pass (up to one million tokens).

This system is implemented using a FastAPI backend and a React + Axios frontend, ensuring production-level performance, modularity, and scalability.

---

### 🔍 Problem Statement

Podcasts contain rich insights but are time-consuming to navigate. Existing solutions face major limitations:

> * Unstructured and noisy transcripts
> * Poor diarization or incorrect speaker mapping
> * Fragmented summaries due to LLM context limits
> * High latency when using self-hosted Whisper models

Voxify AI solves these through a hybrid architecture, achieving high accuracy, low latency, and context-preserving summarization suitable for real-world deployment.

---

### 🚀 Key Features

* **🎧 Unified ASR + Diarization (AssemblyAI)**
    * High-accuracy Universal-2 model
    * Pre-aligned speaker labels
    * Robust in noisy audio
    * Word-level timestamps

* **🧠 Long-Context Summarization (Gemini 1.5 Flash)**
    * Processes entire podcast transcripts at once
    * No chunking required
    * Structured output: summary, highlights, chapters

* **⚛️ Modern Web Architecture**
    * React UI with Axios for API interaction
    * FastAPI backend with modular service layers
    * CORS-enabled, async, scalable

* **🗂 Multi-format Outputs**
    * Transcript (.txt / JSON)
    * Abstractive summary
    * Key highlights
    * Speaker-based insights
    * Chapter timestamp segmentation

---

### System Architecture

![VOXIFY Methodology](https://github.com/user-attachments/assets/27315714-2817-4ee0-88ae-29ed04413a5e)

---

### 🔧 Tech Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Axios |
| **Backend** | FastAPI, Python 3.10 |
| **Audio Processing** | FFmpeg, yt-dlp |
| **ASR + Diarization** | AssemblyAI API |
| **Summarization** | Gemini 1.5 Flash |
| **Formats** | JSON, TXT |

---

### ⚙️ Installation Steps

#### 🚀 Backend (FastAPI) Setup Steps

1.  Download or clone the Voxify AI repository.
2.  Open the `backend` folder.
3.  Create a new Python virtual environment.
4.  Activate the virtual environment.
5.  Install all backend dependencies: `pip install -r requirements.txt`.
6.  Create a `.env` file inside the `backend` folder.
7.  Add your `ASSEMBLYAI_API_KEY` and `GEMINI_API_KEY` inside the `.env` file.
8.  Start the FastAPI backend server (e.g., `uvicorn main:app --reload`).
9.  Confirm the API is running locally (default: `http://127.0.0.1:8000`).
10. Optionally check the auto-generated Swagger UI at `http://127.0.0.1:8000/docs`.

#### ⚛️ Frontend (React) Setup Steps

1.  Navigate to the `frontend` folder inside the project.
2.  Ensure Node.js and npm are installed on your system.
3.  Install the required frontend dependencies: `npm install`.
4.  Start the React development server: `npm start`.
5.  Confirm the frontend is available locally (default: `http://localhost:3000`).
6.  Verify the frontend is correctly communicating with the FastAPI backend.

---

### 🔗 End-to-End System Usage (Developer Flow)

1.  Start the backend server.
2.  Start the frontend application.
3.  Open the browser interface (`http://localhost:3000`).
4.  Upload an audio file or provide a YouTube link.
5.  The backend extracts audio, transcribes it, performs diarization, and generates summaries.
6.  The frontend receives and displays the transcript, summary, highlights, and chapter markers.
7.  Download or store the processed results as needed.

---

### 📊 Performance Summary

| Metric | Legacy Whisper Stack | Hybrid Model (This Project) |
| :--- | :--- | :--- |
| **WER** | 8.4% | **6.7%** |
| **Diarization Accuracy** | Low | **High** |
| **Latency (per 1hr audio)**| 15–20 min | **2–4 min** |
| **Summary Quality** | Fragmented | **Coherent** |
| **Deployment** | Heavy (GPU required) | **Lightweight (API-based)** |

---

### 🧭 Legacy Method (Short Note)

A previous version utilized an open-source stack (Faster-Whisper, WhisperX, pyannote.audio). This approach offered flexibility but suffered from:

> * Timestamp misalignment (10–15% DER)
> * High latency (GPU required)
> * Inconsistent diarization
> * Summaries lacked context due to chunking

The hybrid **AssemblyAI + Gemini** model fully replaces this legacy approach, providing superior performance and scalability.

### 📚 References
* AssemblyAI Research (Universal-2, Conformer-2)
* Google Gemini 1.5 Flash Paper
* pyannote.audio: Speaker Diarization
* OpenAI Whisper Research
* Voxify AI Final Report & Research Paper

---

### 📜 License

This project is licensed under the MIT License.

---

### 🤝 Contributions

PRs are welcome!

Future contributions: multilingual support, topic clustering, sentiment analysis, streaming ASR.

---

### 🎯 Future Scope
* Multilingual ASR + summarization
* Sentiment & emotion detection
* Topic modeling
* Vector search & RAG-enabled podcast insights
* Real-time streaming transcription
