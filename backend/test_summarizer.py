from app.services.summarizer import SummarizerService

if __name__ == "__main__":
    summarizer = SummarizerService()

    sample_transcript = """
    Host: Welcome to our AI podcast! Today we're discussing how AI agents will transform the world.
    Guest: Absolutely, automation will boost productivity and help humans focus on creativity.
    Host: What about the risks?
    Guest: We must ensure ethical development and responsible deployment of AI.
    """

    result = summarizer.summarize(sample_transcript)
    print("\n--- SUMMARY OUTPUT ---\n")
    print(result)
