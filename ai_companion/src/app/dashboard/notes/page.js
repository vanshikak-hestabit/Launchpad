"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { XCircle } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    if (data) setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or update note
  const addOrUpdateNote = async () => {
    if (!title || !content) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (editingNoteId) {
      // Update note
      const { error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", editingNoteId);

      if (error) console.error(error);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNoteId ? { ...note, title, content } : note
        )
      );
      setEditingNoteId(null);
    } else {
      // Add note
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title,
          content,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) console.error(error);
      if (data) setNotes((prev) => [data, ...prev]);
    }

    setTitle("");
    setContent("");
  };

  // Delete note
  const deleteNote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) console.error(error);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Click note to edit
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note.id);
  };

  return (
    <div className="p-6">
      {/* Add/Edit Note Form */}
      <div className="mb-6 flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded px-3 py-2 h-24"
        />
        <button
          onClick={addOrUpdateNote}
          className="bg-primary text-white px-4 py-2 rounded w-max"
        >
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </div>

      {/* Notes List */}
      <div className="flex flex-wrap gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-yellow-100 p-4 rounded shadow relative cursor-pointer w-[250px] h-[150px] overflow-hidden"
            onClick={() => editNote(note)}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="absolute top-2 right-2 text-black"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="font-bold mb-2 truncate">{note.title}</h3>
            <p className="text-sm line-clamp-6 break-words">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}