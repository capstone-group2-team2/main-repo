from fastapi import FastAPI
from pydantic import BaseModel, Field
from datetime import datetime
import json

app = FastAPI(
    title="Sales Agent API",
    description="Responds to customer inquiries about product prices and availability."
)


def load_pricing_db():
    """Load pricing database from JSON file."""
    with open("data/pricing.json", encoding="utf-8") as f:
        data = json.load(f)

    return data["products"]


PRICING_DB = load_pricing_db()


class SalesRequest(BaseModel):
    customer_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=2000)


class SalesResponse(BaseModel):
    customer_id: str
    message: str
    matched_product: str | None
    price_info: dict | None
    reply: str
    timestamp: str


@app.get("/")
def home():
    return {"message": "Sales Agent is running"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


def find_product(message: str):
    """
    Search product by name or display name.
    """
    message_lower = message.lower()

    for product in PRICING_DB:
        if product["name"].lower() in message_lower:
            return product

        if product["display_name"].lower() in message_lower:
            return product

    return None


@app.post("/sales", response_model=SalesResponse)
def sales_agent(data: SalesRequest):

    product = find_product(data.message)

    # Product not found
    if product is None:
        return SalesResponse(
            customer_id=data.customer_id,
            message=data.message,
            matched_product=None,
            price_info=None,
            reply="Sorry, I couldn't find this product. Please provide the product name.",
            timestamp=datetime.now().isoformat()
        )


    # Product found
    if product["in_stock"]:
        stock_message = "and it is currently in stock."
    else:
        stock_message = "but it is currently out of stock."


    reply = (
        f"The price of {product['display_name']} is "
        f"{product['price']} {product['currency']}, "
        f"{stock_message}"
    )


    return SalesResponse(
        customer_id=data.customer_id,
        message=data.message,
        matched_product=product["display_name"],
        price_info=product,
        reply=reply,
        timestamp=datetime.now().isoformat()
    )