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

async def generate_message_with_mcp(message: str, system_instructions: str, history=None):
    client_jwt_token = generate_auth_token()
    mcp_client = Client(MCP_SERVER_URL, auth=client_jwt_token)    
    await mcp_client._connect() 
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

    # Build conversation history for Gemini
    conversation_history = history if isinstance(history, list) else []
    conversation_history.append({"role": "user", "parts": [{"text": message}]})

    response = await gemini_client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=conversation_history,
        config=types.GenerateContentConfig(
            temperature=0.1,
            top_p=0.8,
            tools=[mcp_client.session], 
            system_instruction=system_instructions
            ),
    )
    await mcp_client._disconnect()
    return response.text

# --- FastAPI HTTPS endpoint ---
app = FastAPI()
security = HTTPBearer()
EXPECTED_TOKEN = os.getenv("MCP_CLIENT_ENDPOINT_BEARER_TOKEN")  # Set this in your .env

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
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
    user_id = data.get("userId")

    system_instructions = "\n".join([
    "You are an AI assistant that is able to conversationally suggest tv shows and movies based on user preferences.",
    "Always use the getUserLists tool to retrieve the user's lists before making any recommendations.",

    #send userId to system instructions
    f"This user's userId is {user_id}, which you can use to look up their preferences using the getUserLists tool.",
    
    #explanation of lists/recommendation guidelines
    "From these results, the saved list are those that the user wants to watched, but hasn't yet seen, the seen list are movies that the user has watched before, the exclusion list are titles that the user does not want to appear in future recommendations, and the previous recommendations list are titles that you have recommended to the user in the past.",
    "When making recommendations, avoid suggesting titles that appear in the user's seen, saved, exclusion, or previous recommendations list.",
    "When giving a recommendation, provide a brief explanation of why you think the user would enjoy that title based on their preferences.",
    "Always use the getUserLists tool to retrieve the user's lists before making any recommendations.",
    "You must NOT recommend any title that appears in the user's saved, seen, exclusion, or previous recommendations lists.",
    "If you recommend a title from any of these lists, your response will be considered invalid.",
    
    #output format instructions
    "The final output containing recommendations **MUST** be a valid JSON array, and it **MUST** follow this exact structure for every recommendation: "
    "```json [{\"title\": \"<title>\", \"year\": \"<year>\", \"imbdId\": \"<imbdId>\", \"reason\": \"<reason>\"}] ```",
    "Do not include any text, headers, or explanations outside of the final JSON array. Only output the JSON block.",
    "NEVER return an empty array; always provide at least one recommendation, your response will be considered invalid."
    ])
    if not message:
        return JSONResponse({"error": "Missing contentMessage"}, status_code=400)
    try:
        result = await generate_message_with_mcp(message, system_instructions, history)
        return {"result": result}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)