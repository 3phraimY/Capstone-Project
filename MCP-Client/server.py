import os
import asyncio
from fastmcp import Client
from google import genai
from dotenv import load_dotenv
from google.genai import types

load_dotenv()

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL")
GEMINI_API_KEY = os.getenv("GENAI_API_KEY")
CLIENT_BEARER_TOKEN = os.getenv("CLIENT_BEARER_TOKEN")

mcp_client = Client(MCP_SERVER_URL, auth=CLIENT_BEARER_TOKEN)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

async def main():
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