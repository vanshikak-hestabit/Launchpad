import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; 
import pdfParse from "pdf-parse-debugging-disabled";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const dynamic = "force-dynamic";

/**
 * Extracts text from a PDF buffer using pdf-parse-debugging-disabled
 */
async function extractTextFromPdf(buffer) {
  const parsed = await pdfParse(buffer);
  return parsed.text;
}

/**
 * Get embeddings from Google Gemini using your preferred chunk mapping
 */
async function getGeminiEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;

  const requests = texts.map(async (text) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: {
          parts: [{ text }],
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Embedding failed: ${errText}`);
    }

    const json = await res.json();

    if (!json.embedding?.values) {
      throw new Error("Invalid embedding response format");
    }

    return json.embedding.values; // 768-length vector
  });

  // Run all embedding requests in parallel
  return Promise.all(requests);
}

/**
 * Main upload handler
 */
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

    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    // Extract text
    if (file.type === "text/plain") {
      rawText = buffer.toString("utf-8");
    } else if (file.type === "application/pdf") {
      rawText = await extractTextFromPdf(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Store full document in Supabase
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert([{ agent_id, file_name: file.name, original_text: rawText }])
      .select();

    if (docError) throw docError;
    const document_id = docData[0].id;

    // Chunk text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const chunks = await splitter.splitText(rawText);

    // Generate embeddings
    const embeddings = await getGeminiEmbeddings(chunks);

    // Insert chunks into Supabase
    const rows = chunks.map((chunkText, i) => ({
      document_id,
      agent_id,
      chunk_text: chunkText,
      embedding: embeddings[i],
    }));

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(rows);

    if (chunkError) throw chunkError;

    return NextResponse.json({
      success: true,
      document_id,
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
