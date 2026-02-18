"use client";
import { useRef, useState } from "react";
import { useLocalParticipant } from "@livekit/components-react";

export function useVoiceLoop(agentSystemPrompt) {
  const { localParticipant } = useLocalParticipant();

  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("idle");

  const mediaRecorder = useRef(null);

  async function startListening() {
    setStatus("listening");

    const audioTrack =
      localParticipant.audioTracks.values().next().value?.track;
    if (!audioTrack) return;

    const stream = new MediaStream([audioTrack.mediaStreamTrack]);
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.current = recorder;

    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      setStatus("thinking");

      const blob = new Blob(chunks, { type: "audio/webm" });
      const res = await fetch("/api/voice/stt", { method: "POST", body: blob });
      const { transcript } = await res.json();

      setTranscript(transcript);
      if (transcript.trim()) await handleLLM(transcript);
    };

    recorder.start();
  }

  function stopListening() {
    mediaRecorder.current?.stop();
  }

  async function handleLLM(userMessage) {
    const chatRes = await fetch("/api/voice/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        systemPrompt: agentSystemPrompt,
      }),
    });

    const { reply: agentReply } = await chatRes.json();
    setReply(agentReply);
    await speakText(agentReply);
  }

  async function speakText(text) {
    setStatus("speaking");

    const ttsRes = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const audioBlob = await ttsRes.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => setStatus("idle");
    audio.play();
  }

  return { transcript, reply, status, startListening, stopListening };
}
