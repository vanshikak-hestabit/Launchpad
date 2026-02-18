import { NextResponse } from "next/server";

export async function POST(req) {
  const { text } = await req.json();

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        optimize_streaming_latency: 4,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("ElevenLabs TTS error:", errText);
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  // Return as MP3 blob
  const arrayBuffer = await res.arrayBuffer();
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=tts.mp3",
    },
  });
}
