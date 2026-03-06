"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ChatPage() {
  const params = useParams();
  const companionId = params.companionID;

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("companion_id", companionId)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    if (data) setConversations(data);
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    if (data) setMessages(data);
  };

  useEffect(() => {
    const init = async () => {
      await fetchConversations();
      startTempConversation();
    };
    init();
  }, [companionId]);

  useEffect(() => {
    if (activeConversation && activeConversation.id) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startTempConversation = () => {
    setActiveConversation({ id: null });
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg) return;

    const messageText = newMsg;   // store message
    setNewMsg(""); 

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: newMsg,
    };

    setMessages((prev) => [...prev, userMessage]);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let conversationId = activeConversation.id;

    if (!conversationId) {
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({ companion_id: companionId, user_id: session.user.id })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      conversationId = newConv.id;
      setActiveConversation(newConv);
      fetchConversations();
    }

    // Insert user message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: newMsg,
      user_id: session.user.id,
    });

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: newMsg }],
      }),
    });

    const data = await res.json();

    // Insert assistant message
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: data.reply,
      user_id: session.user.id,
    });

    fetchMessages(conversationId);
  };

  const handleNewConversation = () => {
    startTempConversation();
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/4 border-r p-4 flex flex-col">
        <button
          onClick={handleNewConversation}
          className="bg-primary text-white px-3 py-2 rounded mb-4"
        >
          New Conversation
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`w-full text-left p-2 rounded ${
                activeConversation?.id === conv.id
                  ? "bg-primary/20"
                  : "bg-gray-100"
              }`}
            >
              Conversation {conv.id.slice(0, 6)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-col flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded max-w-xs ${
                msg.role === "user"
                  ? "bg-primary/20 text-primary self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded px-3 py-2"
          />

          <button type="submit" className="bg-primary text-white px-4 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}