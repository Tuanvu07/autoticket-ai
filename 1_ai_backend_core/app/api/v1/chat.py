from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    tenant_id: str
    message: str

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    return {
        "tenant_id": request.tenant_id,
        "reply": f"Mock response for message: {request.message}"
    }
