const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithGemini = async (req, res) => {
  const { message, history } = req.body;

  // Build the conversation history for Gemini
  const conversationHistory = Array.isArray(history) ? history : [];
  conversationHistory.push({ role: "user", parts: [{ text: message }] });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({ history: conversationHistory });
    const result = await chat.sendMessage(message);
    const modelResponse = result.response.text();

    res.json({ response: modelResponse });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = { chatWithGemini };
