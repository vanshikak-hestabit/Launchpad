"use client";
import { useRef, useState } from "react";
import { useLocalParticipant } from "@livekit/components-react";

export function useVoiceLoop(agentSystemPrompt) {
  const { localParticipant } = useLocalParticipant();
  const [messages, setMessages] = useState([]); 
  const [status, setStatus] = useState("idle");
  const [draft, setDraft] = useState("");


  const mediaRecorder = useRef(null);

  async function startListening() {
  if (!localParticipant) return;

  setStatus("listening");

  // Wait for mic track to be published
  let micPublication;
  for (let i = 0; i < 10; i++) {
    const pubs = Array.from(localParticipant.trackPublications.values());
    micPublication = pubs.find(
      p => p.kind === "audio" && p.source === "microphone" && p.track
    );
    if (micPublication) break;
    await new Promise(r => setTimeout(r, 300));
  }

  if (!micPublication?.track) {
    console.error("Mic track never became available");
    setStatus("idle");
    return;
  }

  const audioTrack = micPublication.track;

  // Create AudioContext **after** getting the track
  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(new MediaStream([audioTrack.mediaStreamTrack]));
  const dest = ctx.createMediaStreamDestination();

  // force mono
  source.channelInterpretation = "discrete";
  source.connect(dest);

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";

    const recorder = new MediaRecorder(dest.stream, { mimeType });  mediaRecorder.current = recorder;

  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = async () => {
  setStatus("thinking");

  // Use the correct MIME type that the recorder actually used
  const blob = new Blob(chunks, { type: mimeType });
  console.log("Blob size:", blob.size);

  // Debug: show first 100 bytes so we know audio is real
  const arrayBuffer = await blob.arrayBuffer();
  console.log("First 100 bytes of audio:", new Uint8Array(arrayBuffer).slice(0, 100));

  // Send blob to Deepgram
  const res = await fetch("/api/voice/stt", { method: "POST", body: blob, headers: { "Content-Type": mimeType }});
  const data = await res.json();
  console.log("STT full response:", data); // full Deepgram response
  console.log("Transcript extracted:", data.transcript);

  if (data.transcript?.trim()) {
    setDraft(data.transcript);
    setStatus("idle");
  } else {
    setStatus("idle");
  }

};

  recorder.start();

  setTimeout(() => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
  }, 3000); // ⬅️ 3 seconds chunk

}

  function stopListening() {
    mediaRecorder.current?.stop();
  }
    async function handleLLM(userMessage) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: userMessage }
      ]);

      const chatRes = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt: agentSystemPrompt,
        }),
      });
      const { reply: agentReply } = await chatRes.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: agentReply }
      ]);

      await speakText(agentReply);
    }


  async function speakText(text) {
  setStatus("speaking");

  try {
    const res = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error("TTS API error:", await res.text());
      setStatus("idle");
      return;
    }

    const audioBlob = await res.blob(); // MP3 blob
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => setStatus("idle");
    await audio.play();
  } catch (err) {
    console.error("speakText error:", err);
    setStatus("idle");
  }
}

  return {
  messages,
  status,
  draft,
  setDraft,
  startListening,
  stopListening,
  handleLLM,
};


}