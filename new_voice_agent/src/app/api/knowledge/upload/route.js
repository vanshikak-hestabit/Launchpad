import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import pdfParse from "pdf-parse-debugging-disabled";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const dynamic = "force-dynamic"; //prevents caching 

// reads pdf, extract text and returns text
async function extractTextFromPdf(buffer) {
  const parsed = await pdfParse(buffer);
  return parsed.text;
}

// generates embeddings
async function getGeminiEmbeddings(texts) {
  // google gemini embedding model - gemini-embedding-001
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;

  // returns vector embedding
  return Promise.all(
    texts.map(async (text) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text }] },
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();
      return json.embedding.values;
    })
  );
}
 
// runs when frontend uploads file 
// FormData is a container used to send files + extra fields from browser to server.
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const agent_id = formData.get("agent_id");

    if (!file || !agent_id) {
      return NextResponse.json(
        { error: "Missing file or agent_id" },
        { status: 400 }
      );
    }

    // verify agent exists
    const { data: agent, error: agentError } = await supabase
      .from("Agents")
      .select("agent_id")
      .eq("agent_id", agent_id)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: "Invalid agent_id" },
        { status: 400 }
      );
    }

    // loading data in mem conver raw binary data to node.js buffer obj
    //  A Buffer is just Node’s way of storing binary data
    const buffer = Buffer.from(await file.arrayBuffer());

    let rawText = "";
    if (file.type === "application/pdf") {
      rawText = await extractTextFromPdf(buffer);
    } else if (file.type === "text/plain") {
      rawText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // insert doc in db
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert([{ agent_id, file_name: file.name, original_text: rawText }])
      .select()
      .single();

    if (docError) throw docError;

    // chunking 
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const chunks = await splitter.splitText(rawText);
    const embeddings = await getGeminiEmbeddings(chunks);

    const rows = chunks.map((chunk, i) => ({
      document_id: docData.id,
      agent_id,
      chunk_text: chunk,
      embedding: embeddings[i],
    }));

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(rows);

    if (chunkError) throw chunkError;

    return NextResponse.json({
      success: true,
      document_id: docData.id,
      chunks_added: rows.length,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}

//Request → FormData → File → AgentCheck → Buffer → TypeCheck → Extract → SaveDocument → Split → Embed → SaveChunks → SuccessResponse
