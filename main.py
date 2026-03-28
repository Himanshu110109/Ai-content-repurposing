import os
from dotenv import load_dotenv
from langchain_classic.chat_models import init_chat_model
from prompt import prompt
from langchain_core.output_parsers import JsonOutputParser
import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfloader import pdfload
from web_loader import webload
from instructions import get_instruction

load_dotenv()

print("INIT LLM...")
llm = init_chat_model(model="groq:llama-3.1-8b-instant")
print("LLM INITIALIZED")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return "hello world"

@app.post("/generate")
async def generate(
        file: UploadFile = File(None),
        content: str = Form(None),
        url: str = Form(None),
        tone: str = Form(""),
        variation_instruction: str = Form(""),
        types: str = Form('["tweets", "linkedin", "email"]')
):
    types = json.loads(types)
    if file:
        raw_data = await pdfload(file)
    elif url:
        raw_data = webload(url)
    elif content:
        raw_data = content
    else:
        return {"error": "provide content, url or pdf"}

    parser = JsonOutputParser()

    chain = prompt | llm | parser

    response = chain.invoke({
        "content": raw_data,
        "instructions": get_instruction(types),
        "tone":tone,
        "variation_instruction": variation_instruction
    })

    filtered = {k:v for k, v in response.items() if k in types}
    return filtered
