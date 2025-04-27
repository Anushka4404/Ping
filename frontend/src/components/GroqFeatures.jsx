// frontend/src/components/GroqFeatures.jsx
import React, { useState } from "react";
import axios from "axios";

const GroqFeatures = ({ chatMessages }) => {
  const [summary, setSummary] = useState("");
  const [translated, setTranslated] = useState("");
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [targetLang, setTargetLang] = useState("French");
  const [loading, setLoading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Replace with your Render backend URL in production
  const BACKEND_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-app.onrender.com' // Replace this with your deployed backend URL
    : 'http://localhost:5000'; // Local development URL

  const handleSummarize = async () => {
    if (!chatMessages?.length) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/groq/summarize`, {
        messages: chatMessages.map((m) => m.text || m.content || ""),
      });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Error summarizing chat.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!chatMessages?.length) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    const text = lastMsg?.text || lastMsg?.content || "";
    if (!text) return alert("Last message is empty.");

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/groq/translate`, {
        message: text,
        targetLang,
      });
      setTranslated(res.data.translated);
    } catch (err) {
      alert("Error translating message.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestReply = async () => {
    if (!chatMessages?.length) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    const text = lastMsg?.text || lastMsg?.content || "";
    if (!text) return alert("Last message is empty.");

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/groq/suggest-reply`, {
        message: text,
      });
      
      let replies = res.data.suggestion
        .split(/\n\d+\.\s+/) // splits at 1. , 2. , 3. etc.
        .filter(r => r.trim().length > 0);

      // Remove first reply if it looks like instruction (not actual reply)
      if (replies[0]?.toLowerCase().includes("here are")) {
        replies = replies.slice(1);
      }

      setSuggestedReplies(replies);
    } catch (err) {
      alert("Error suggesting a reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Reply copied to clipboard!");
  };

  return (
    <div className="p-4 border rounded-md shadow bg-white mt-4">
      
      {/* Button to open features */}
      <div className="mb-4">
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          {showFeatures ? "Hide Features" : "Unlock Groq Magic"}
        </button>
      </div>

      {/* Features visible after clicking the button */}
      {showFeatures && (
        <>
          {/* Summarize Section */}
          <div className="mb-6">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Summarize Chat
            </button>

            {summary && (
              <div className="mt-2 bg-gray-100 p-2 rounded border text-sm whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </div>

          {/* Translate Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <select
                className="border px-2 py-1 rounded"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Hindi">Hindi</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>

              <button
                onClick={handleTranslate}
                disabled={loading}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Translate Last Msg
              </button>
            </div>

            {translated && (
              <div className="mt-2 bg-gray-100 p-2 rounded border text-sm whitespace-pre-wrap">
                {translated}
              </div>
            )}
          </div>

          {/* Suggest Reply Section */}
          <div className="mb-6">
            <button
              onClick={handleSuggestReply}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Suggest Reply
            </button>

            {suggestedReplies.length > 0 && (
              <div className="mt-2 bg-gray-100 p-2 rounded border text-sm space-y-2">
                {suggestedReplies.map((reply, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="mr-2">{reply}</span>
                    <button
                      onClick={() => handleCopy(reply)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-xs"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GroqFeatures;
