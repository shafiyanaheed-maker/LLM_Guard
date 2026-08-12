from pydantic import BaseModel, Field


class PromptRequest(BaseModel):
    username: str
    prompt: str = Field(min_length=1)


class PromptResponse(BaseModel):
    status: str
    llm_response: dict
