from pydantic import BaseModel


class PromptRequest(BaseModel):
    username: str
    prompt: str


class PromptResponse(BaseModel):
    status: str
    llm_response: dict