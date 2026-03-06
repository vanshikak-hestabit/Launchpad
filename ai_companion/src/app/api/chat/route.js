import { NextResponse } from "next/server";
import { generateGroqResponse } from "@/lib/groq_client";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const reply = await generateGroqResponse(messages);

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