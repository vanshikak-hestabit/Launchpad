import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

 
// embeddings from Google Gemini 
async function getGeminiEmbeddings(texts) {
  if (!Array.isArray(texts)) return [];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;

  const requests = texts.map(async (text) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    });

    if (!res.ok) throw new Error(await res.text());

    const json = await res.json();
    if (!json.embedding?.values) throw new Error("Invalid embedding response");

    return json.embedding.values;
  });

  return Promise.all(requests);
}


// Search API
export async function POST(req) {
  try {
    const { query, agent_id, top_k = 5 } = await req.json();

    if (!query || !agent_id) {
      return NextResponse.json({ error: "Missing query or agent_id" }, { status: 400 });
    }

    // Generate embedding for the query
    const [queryEmbedding] = await getGeminiEmbeddings([query]);

    // Call Supabase RPC for similarity search
    const { data, error } = await supabase.rpc("match_document_chunks", {
      match_agent_id: agent_id,
      match_embedding: queryEmbedding, // pgvector column expects a JS array
      match_top_k: top_k,
    });

    if (error) throw error;

    //  Return the top chunks
    return NextResponse.json({ results: data });
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json({ error: "Search failed", details: err.message }, { status: 500 });
  }
}

// Question → Vector → Similarity Search → Return Top Chunks
