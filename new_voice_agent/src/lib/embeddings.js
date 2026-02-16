// lib/embeddings.js
import axios from "axios";

export async function getEmbedding(text) {
  try {
    const response = await axios.post(
      "https://api.groq.ai/v1/embeddings",
      {
        input: text,
        model: "text-embedding-3-small" // or whatever your Groq model is
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.data[0].embedding; // vector array
  } catch (err) {
    console.error("Embedding error:", err.response?.data || err);
    throw err;
  }
}

export function chunkText(text, maxWords = 500) {
  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  const chunks = [];
  let currentChunk = "";

  for (const p of paragraphs) {
    const wordCount = currentChunk.split(/\s+/).length;
    const pCount = p.split(/\s+/).length;

    if (wordCount + pCount <= maxWords) {
      currentChunk += (currentChunk ? "\n" : "") + p;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = p;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}
