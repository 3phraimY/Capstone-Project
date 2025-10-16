from fastmcp import FastMCP
import requests
from dotenv import load_dotenv
import os

load_dotenv()

mcp = FastMCP("My MCP Server")

@mcp.tool
def greet(name: str) -> str:
    return f"Hello, {name}!"

@mcp.tool
def getUserLists(userId: str) -> dict:

    """    Fetch user lists from Supabase. Returns savedList, seenList, and exclusionList    """

    user_lists_url = os.getenv("USER_LISTS_URL")
    api_key_name = os.getenv("MCP_API_KEY_NAME")
    api_key_value = os.getenv("MCP_API_KEY_VALUE")
    url = f"{user_lists_url}/api/mcp/getUserLists?userId={userId}"

    headers = {api_key_name: api_key_value}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run(transport="http", port=8000)