import { NextResponse } from "next/server";
import { generateGroqResponse } from "@/lib/groq_client";

export async function POST(req) {
    try {
      const { messages } = await req.json();

      const systemPrompt = {
        role: "system",
        content: `
  You are a helpful AI companion.

  Formatting rules:

  1. Default responses must be plain text paragraphs.
  2. Do NOT use markdown symbols such as *, #, **, or numbered lists.
  3. Only use bullet points if the user explicitly asks for them.
  4. When using bullet points, use the dash symbol "-" only.
  5. Each bullet must be on a new line.
  6. Never use symbols like • or * as bullets.
  `
      };

    const finalMessages = [systemPrompt, ...messages];
    const reply = await generateGroqResponse(finalMessages);

    return NextResponse.json({
      success: true,
      reply: reply,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}