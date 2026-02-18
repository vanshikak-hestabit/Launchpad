import { NextResponse } from "next/server";

export async function POST(req) {
  const { message, systemPrompt } = await req.json();

  // Call Groq API (OpenAI compatible)
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt || "You are a helpful voice assistant. Keep answers short and conversational." },
        { role: "user", content: message },
      ],
      max_tokens: 150, // keep short for low latency
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I could not respond.";

  return NextResponse.json({ reply });
}