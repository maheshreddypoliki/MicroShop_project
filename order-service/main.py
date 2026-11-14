import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import redis

app = FastAPI(title="MicroShop Order Service", version="1.0.0")

# Read Redis configuration from environment variables (injected via Docker Compose)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Initialize Redis client connection
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

class OrderItem(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_email: str
    items: list[OrderItem]

@app.get("/healthz")
def health_check():
    try:
        # Check if Redis is responsive
        redis_client.ping()
        return {"status": "healthy", "redis": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "redis": str(e)}, 500

@app.post("/api/orders")
def create_order(order: OrderCreate):
    try:
        order_data = order.model_dump()
        # Push order into a Redis list queue
        redis_client.rpush("orders_queue", json.dumps(order_data))
        return {"message": "Order successfully placed and queued", "order": order_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))