# Voxify_AI
An Intelligent Hybrid System for Scalable Podcast Transcription, Analysis & Summarization

📄 Abstract

Voxify AI is a hybrid AI system that transforms long-form, multi-speaker podcasts into structured transcripts, speaker-aware labels, and coherent summaries. The system integrates AssemblyAI’s unified ASR + speaker diarization with Google Gemini 1.5 Flash, enabling long-context abstractive summarization of multi-hour podcast transcripts in a single-pass (up to one million tokens).

This system is implemented using a FastAPI backend and a React + Axios frontend, ensuring production-level performance, modularity, and scalability.


🔍 Problem Statement

Podcasts contain rich insights but are time-consuming to navigate. Existing solutions face major limitations:

->Unstructured and noisy transcripts

->Poor diarization or incorrect speaker mapping

->Fragmented summaries due to LLM context limits

->High latency when using self-hosted Whisper models

Voxify AI solves these through a hybrid architecture, achieving high accuracy, low latency, and context-preserving summarization suitable for real-world deployment.


🚀 Key Features
🎧 Unified ASR + Diarization (AssemblyAI)

->High-accuracy Universal-2 model

->Pre-aligned speaker labels

->Robust in noisy audio

->Word-level timestamps

🧠 Long-Context Summarization (Gemini 1.5 Flash)

->Processes entire podcast transcripts at once

->No chunking required

->Structured output: summary, highlights, chapters

⚛️ Modern Web Architecture

->React UI with Axios for API interaction

->FastAPI backend with modular service layers

->CORS-enabled, async, scalable

🗂 Multi-format Outputs

->Transcript (.txt / JSON)

->Abstractive summary

->Key highlights

->Speaker-based insights

->Chapter timestamp segmentation

System Architecture:
<img width="1286" height="691" alt="VOXIFY methodology" src="https://github.com/user-attachments/assets/27315714-2817-4ee0-88ae-29ed04413a5e" />
