import React, { useState } from "react";
import axios from "axios";

const Summarizer = ({ messages }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/groq/summarize", {
        messages,
      });
      setSummary(res.data.summary);
    } catch (err) {
      alert("Failed to summarize.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSummarize}>
        {loading ? "Summarizing..." : "Summarize Chat"}
      </button>
      {summary && <p className="mt-2 text-gray-700">{summary}</p>}
    </div>
  );
};

export default Summarizer;
