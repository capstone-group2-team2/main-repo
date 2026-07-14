from services.sentiment.service import SentimentService

service = SentimentService()

result = service.predict(
    "My salary is delay and I need to know the policies for delaied salaries."
)

print(result)