const express = require("express");
const router = express.Router();

const { getUserLists } = require("../controllers/MCPController.js");

function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.MCP_API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
}

router.get("/getUserLists", requireApiKey, getUserLists);

module.exports = router;
