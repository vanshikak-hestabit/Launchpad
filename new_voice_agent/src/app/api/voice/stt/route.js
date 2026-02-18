import { NextResponse } from "next/server";

export async function POST(req) {
  const audioBuffer = await req.arrayBuffer();

  // Send with proper Content-Type for webm/opus
  const res = await fetch(
    "https://api.deepgram.com/v1/listen?punctuate=true&model=nova-2",
    {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm; codecs=opus", // explicitly set codecs
      },
      body: audioBuffer,
    }
  );

  const data = await res.json();

  console.log("Deepgram full response:", data); // debug full response

  const transcript =
    data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

  return NextResponse.json({ transcript });
}
