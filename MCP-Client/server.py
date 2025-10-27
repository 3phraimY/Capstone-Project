import os
import asyncio
from fastmcp import Client
from google import genai
from dotenv import load_dotenv
from google.genai import types
import jwt
from datetime import datetime, timedelta, timezone

load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")
GEMINI_API_KEY = os.getenv("GENAI_API_KEY")
SHARED_SECRET = os.getenv("CLIENT_BEARER_TOKEN")

mcp_client = Client(MCP_SERVER_URL, auth=SHARED_SECRET)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

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


async def main():
    client_jwt_token = generate_auth_token()
    
    mcp_client = Client(MCP_SERVER_URL, auth=client_jwt_token)
    
    await mcp_client._connect() 
    
    response = await gemini_client.aio.models.generate_content(
        model="gemini-2.0-flash",
        contents="Write a short story about a robot learning to love.",
        config=types.GenerateContentConfig(
            temperature=0,
            tools=[mcp_client.session], 
        ),
    )
    print(response.text)
    
    await mcp_client._disconnect()

if __name__ == "__main__":
    asyncio.run(main())