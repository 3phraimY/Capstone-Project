import os
import asyncio
from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastmcp import Client
from google import genai
from dotenv import load_dotenv
from google.genai import types
import jwt
from datetime import datetime, timedelta, timezone

load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SHARED_SECRET = os.getenv("CLIENT_BEARER_TOKEN")

def generate_auth_token():
    expiration_time = datetime.now(timezone.utc) + timedelta(hours=1)
    payload = {
        "iss": "mcp-server",
        "aud": "capstone-project",
        "sub": "mcp_ai_client",
        "exp": expiration_time,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(
        payload,
        SHARED_SECRET, 
        algorithm="HS256"
    )
    return token

async def generate_message_with_mcp(message: str, history=None):
    client_jwt_token = generate_auth_token()
    mcp_client = Client(MCP_SERVER_URL, auth=client_jwt_token)    
    await mcp_client._connect() 
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    # Build conversation history for Gemini
    conversation_history = history if isinstance(history, list) else []
    conversation_history.append({"role": "user", "parts": [{"text": message}]})

    response = await gemini_client.aio.models.generate_content(
        model="gemini-2.0-flash",
        contents=conversation_history,
        config=types.GenerateContentConfig(
            temperature=0,
            tools=[mcp_client.session], 
        ),
    )
    await mcp_client._disconnect()
    return response.text

# --- FastAPI HTTPS endpoint ---
app = FastAPI()
security = HTTPBearer()
EXPECTED_TOKEN = os.getenv("MCP_CLIENT_ENDPOINT_BEARER_TOKEN")  # Set this in your .env

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    print("Verifying token:", credentials)
    if credentials.scheme.lower() != "bearer" or credentials.credentials != EXPECTED_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentication token",
        )

@app.post("/gemini")
async def gemini_endpoint(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(verify_token)
):
    data = await request.json()
    message = data.get("contentMessage")
    history = data.get("history")
    if not message:
        return JSONResponse({"error": "Missing contentMessage"}, status_code=400)
    try:
        result = await generate_message_with_mcp(message, history)
        return {"result": result}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)