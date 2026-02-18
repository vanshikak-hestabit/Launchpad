import { NextResponse } from "next/server";

export async function POST(req) {
  const audioBlob = await req.arrayBuffer();

  const res = await fetch(
    "https://api.deepgram.com/v1/listen?punctuate=true&model=nova-2",
    {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      body: audioBlob,
    }
  );

  const data = await res.json();

  const transcript =
    data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

  return NextResponse.json({ transcript });
}
