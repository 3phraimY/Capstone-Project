from fastmcp import FastMCP
from fastmcp.server.auth.providers.jwt import JWTVerifier
import requests
from dotenv import load_dotenv
import os

load_dotenv()

SHARED_SECRET = os.getenv("CLIENT_BEARER_TOKEN") 

verifier = JWTVerifier(
    public_key=SHARED_SECRET, 
    algorithm="HS256", 
    issuer="mcp-server",
    audience="capstone-project",
)

mcp = FastMCP("My MCP Server", auth=verifier)

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