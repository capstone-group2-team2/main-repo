from .providers.gemini_provider import GeminiProvider
from .providers.groq_provider import GroqProvider
from .providers.openrouter_provider import OpenRouterProvider


class LLMManager:

    def __init__(self):

        self.providers = []

        for provider in (
            GeminiProvider,
            GroqProvider,
            OpenRouterProvider
        ):

            try:

                self.providers.append(provider())

                print(f"{provider.__name__} initialized.")

            except Exception as e:

                print(
                    f"Skipping {provider.__name__}: {e}"
                )

    def generate(self, prompt: str):

        last_error = None

        for provider in self.providers:

            try:

                print(
                    f"Using {provider.__class__.__name__}..."
                )

                return {
                    "provider": provider.__class__.__name__,
                    "answer": provider.generate(prompt)
                }

            except Exception as e:

                print(
                    f"{provider.__class__.__name__} failed: {e}"
                )

                last_error = e

        raise RuntimeError(
            f"All LLM providers failed.\n{last_error}"
        )