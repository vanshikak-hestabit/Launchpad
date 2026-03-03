import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { question, chunks } = await req.json();

    if (!question || !chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: "Missing question or chunks" },
        { status: 400 }
      );
    }

    // Combine retrieved chunks into context
    const context = chunks.join("\n\n");

    const prompt = `
You are an expert assistant.
Answer the question using ONLY the information from the context.
If the answer is not present, say:
"Answer not found in the provided material."

Context:
${context}

Question:
${question}

Answer in clear, well-structured paragraphs.
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You answer using provided context only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3, // low randomness
      }),
    });

    const data = await res.json();
    console.log("GROQ RESPONSE:", data);  

    const answer =
      data?.choices?.[0]?.message?.content ||
      "No answer generated.";

    return NextResponse.json({ answer });

  } catch (err) {
    console.error("Answer generation failed:", err);
    return NextResponse.json(
      { error: "Answer generation failed" },
      { status: 500 }
    );
  }
}

// Take retrieved chunks + question → generate final answer using Groq LLM.
