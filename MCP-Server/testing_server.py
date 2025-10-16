import asyncio
from fastmcp import Client
from dotenv import load_dotenv
import os

load_dotenv()

client_url = os.getenv("CLIENT_URL")
client = Client(f"{client_url}/mcp")

async def call_tool(name: str):
    async with client:
        result = await client.call_tool("greet", {"name": name})
        print(result)

async def call_get_user_lists(user_id: str):
    async with client:
        result = await client.call_tool("getUserLists", {"userId": user_id})
        print(result)

# asyncio.run(call_tool("Ford"))
asyncio.run(call_get_user_lists("0e059844-f935-4fdf-880b-b6fe6d4ba56e"))