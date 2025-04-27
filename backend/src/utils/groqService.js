// backend/src/utils/groqService.js
import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groqInstance = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    "Authorization": `Bearer ${GROQ_API_KEY}`,
    "Content-Type": "application/json",
  }
});

const askGroq = async (messages) => {
  const response = await groqInstance.post("/chat/completions", {
    model: "mixtral-8x7b-32768",
    messages,
  });
  return response.data.choices[0].message.content.trim();
};

export default askGroq;
