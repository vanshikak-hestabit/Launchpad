import { supabase } from "@/lib/supabase/client";

export async function handleAIActions(message, session) {
  if (!session) return { handled: false, reply: null };

  let handled = false;
  let reply = null;

  // synonyms for "add"
  const addWords = "(?:add|insert|create)";

  // TODO 
  const todoRegex = new RegExp(`${addWords} (.+?) (?:to|in) (?:my )?todo`, "i");
  const todoMatch = message.match(todoRegex);
  if (todoMatch && todoMatch[1]) {
    const todoContent = todoMatch[1].trim();
    const { error } = await supabase.from("todo").insert({
      title: todoContent,
      user_id: session.user.id,
      completed: false,
    });
    if (error) console.error("Error inserting todo:", error.message);
    handled = true;
    reply = `I've added "${todoContent}" to your to-do list.`;
  }

  // Notes 
  const noteRegex = new RegExp(`${addWords} (.+?) note`, "i");
  const noteMatch = message.match(noteRegex);
  if (noteMatch && noteMatch[1]) {
    let content = noteMatch[1].trim();

    // remove in
    content = content.replace(/\s+in$/i, "").trim();

    // Optional title
    const titleMatch = message.match(/with title (.+)$/i);
    const title = titleMatch ? titleMatch[1].trim() : content.slice(0, 20);

    const { error } = await supabase.from("notes").insert({
      content,
      title,
      user_id: session.user.id,
    });
    if (error) console.error("Error inserting note:", error.message);

    handled = true;
    reply = `I've added "${content}" to your notes.`;
  }

  return { handled, reply };
}