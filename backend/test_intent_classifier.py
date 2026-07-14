from agents.employee.intent_classifier import IntentClassifier

classifier = IntentClassifier()

messages = [
    "My VPN is not working.",
    "I forgot my password.",
    "I want annual leave.",
    "What is the HR policy?",
    "My salary is wrong.",
]

for message in messages:

    result = classifier.classify(message)

    print("=" * 50)
    print(message)
    print(result)