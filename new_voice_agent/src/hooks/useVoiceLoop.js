"use client";
import { useRef, useState } from "react";
import { useLocalParticipant } from "@livekit/components-react";

export function useVoiceLoop(agent) {
  const currentAudio = useRef(null);
  const { localParticipant } = useLocalParticipant();
  const [messages, setMessages] = useState([]); 
  const [status, setStatus] = useState("idle");
  const [draft, setDraft] = useState("");

  const mediaRecorder = useRef(null);

  async function startListening() {
    // livekit connects
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

  // micrecorder only accepts mediastream but we have mictrack so convert 
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(new MediaStream([audioTrack.mediaStreamTrack]));
    const dest = ctx.createMediaStreamDestination();

    // force mono
    source.channelInterpretation = "discrete";
    // This connects the microphone input (source) to the output stream (dest)
    source.connect(dest);
 
    // if browser accepts high quality opus use this:that
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

      // show first 100 bytes for debug
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
    }, 3000); // 3 seconds chunk

  }

  function resetConversation() {
    setMessages([]);
  }

  function stopListening() {
    mediaRecorder.current?.stop();
  }
    async function handleLLM(userMessage) {
      // add in history
      setMessages(prev => [
        ...prev,
        { role: "user", content: userMessage }
      ]);

    // Search knowledge
      console.log("VOICE AGENT ID:", agent?.agent_id);
      const searchRes = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          agent_id: agent?.agent_id, 
          top_k: 5,
        }),
      });

      const searchData = await searchRes.json();

      const chunks = searchData?.results
        ?.map((r) => r.chunk_text)
        .filter(Boolean);

      // If no chunks found
      if (!chunks || chunks.length === 0) {
        await speakText("No relevant information found in the documents.");
        return;
      }

      // Generate answer from chunks
      const answerRes = await fetch("/api/knowledge/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage,
          chunks,
        }),
      });

      const answerData = await answerRes.json();
      const agentReply = answerData.answer || "No answer generated.";

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: agentReply }
        ]);

        await speakText(agentReply);
      }

  // speaking the answer 
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
        // html audio obj
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        currentAudio.current = audio;

        audio.onended = () => setStatus("idle");
        await audio.play();
      } catch (err) {
        console.error("speakText error:", err);
        setStatus("idle");
      }
    }

      function pauseSpeaking() {
        if (currentAudio.current) {
          currentAudio.current.pause();
        }
      }

      function resumeSpeaking() {
        if (currentAudio.current) {
          currentAudio.current.play();
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
      resetConversation,
      pauseSpeaking,
      resumeSpeaking,
    };

  }

// Listen to your voice -> Turn voice into text -> Search documents -> Generate an answer -> Speak the answer