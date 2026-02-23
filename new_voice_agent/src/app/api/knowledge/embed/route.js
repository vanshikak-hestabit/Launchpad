import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to chunk text (500 words)
function chunkText(text, maxWords = 500) {
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

// Helper to get embedding from Groq
async function getEmbedding(text) {
  const response = await axios.post(
    "https://api.groq.ai/v1/embeddings",
    { input: text, model: "text-embedding-3-small" },
    {
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data[0].embedding;
}

export async function POST(req) {
  try {
    const { document_id } = await req.json();
    if (!document_id)
      return NextResponse.json({ error: "Missing document_id" }, { status: 400 });

    // Fetch document
    const { data: docs, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .single();

    if (docError) throw docError;

    const chunks = chunkText(docs.original_text, 500);

    const chunkInserts = [];
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      chunkInserts.push({
        document_id,
        agent_id: docs.agent_id,
        chunk_text: chunk,
        embedding,
      });
    }

    // Insert into document_chunks
    const { data, error } = await supabase
      .from("document_chunks")
      .insert(chunkInserts)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, chunks_added: data.length });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }
}
