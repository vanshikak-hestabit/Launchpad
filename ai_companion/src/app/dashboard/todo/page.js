"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos
  const fetchTodos = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setTodos(data);
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("todo")
      .insert({ user_id: session.user.id, title: newTodo, completed: false })
      .select()
      .single();

    if (error) console.error(error);
    else setTodos((prev) => [...prev, data]);

    setNewTodo("");
  };

  // Complete a todo
  const completeTodo = async (id) => {
    const { data, error } = await supabase
      .from("todo")
      .update({ completed: true })
      .eq("id", id);

    if (error) console.error(error);
    else setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from("todo")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
    else setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My To-Do List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={addTodo} className="bg-primary text-white px-4 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <span className={todo.completed ? "line-through text-gray-500" : ""}>{todo.title}</span>
            <div className="flex gap-2">
            <button onClick={() => completeTodo(todo.id)} title="Complete">
                <CheckCircle2 className="text-black w-5 h-5" />
            </button>
            <button onClick={() => deleteTodo(todo.id)} title="Delete">
                <XCircle className="text-black w-5 h-5" />
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}