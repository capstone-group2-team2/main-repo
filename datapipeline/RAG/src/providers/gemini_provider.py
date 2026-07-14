import os

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()


class GeminiProvider:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found."
            )

        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel(
            "gemini-flash-latest"
        )

    def generate(self, prompt: str):

        response = self.model.generate_content(
            prompt
        )

        return response.text

# TODO:
# Migrate from google-generativeai
# to google-genai in a future update.