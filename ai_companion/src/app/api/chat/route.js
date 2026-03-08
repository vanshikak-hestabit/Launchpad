import { NextResponse } from "next/server";
import { generateGroqResponse } from "@/lib/groq_client";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const supabase = await createSupabaseServer();
    const { messages, firstMessage, companionId } = await req.json();
    const { data: companion } = await supabase
      .from("companions")
      .select("*")
      .eq("id", companionId)
      .single();

    const systemPrompt = {
      role: "system",
      content: `
    You are ${companion?.name || "an AI companion"}.

    Personality traits:
    ${companion?.personality_traits || ""}

    Communication style:
    ${companion?.communications_style || ""}

    Background story:
    ${companion?.background_story || ""}

    Relationship with the user:
    ${companion?.relationship_story || ""}

    Additional character instructions:
    ${companion?.system_prompt || ""}

    Behavior rules:
    - Always stay in character as ${companion?.name || "the companion"}.
    - Never say you are an AI language model.
    - Speak as if you are the companion interacting directly with the user.

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

    let title = null;

    if (firstMessage) {
        const titlePrompt = [
          {
            role: "system",
            content: `
        You are an AI that generates a short 3-5 word title for a conversation.

        Rules:
        - If the first message is a simple greeting (hi, hello, hey, good morning, etc.), title must be "Friendly Greeting".
        - If the first message is a question or topic, title must summarize it literally in 3-5 words.
        - Do not create creative or story-like titles.
        - Keep it short and precise.
        `
          },
          {
            role: "user",
            content: firstMessage
          }
        ];

      title = await generateGroqResponse(titlePrompt);
      title = title.trim();
    }

    return NextResponse.json({
      success: true,
      reply,
      title
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}