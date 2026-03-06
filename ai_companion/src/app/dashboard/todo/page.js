"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("todo")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setTasks(data);
  };

  // Add new task
  const addTask = async () => {
    if (!newTask) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("todo")
      .insert({ user_id: session.user.id, title: newTask })
      .select()
      .single();

    if (error) console.error(error);
    else setTasks((prev) => [...prev, data]);

    setNewTask("");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My To-Do List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={addTask} className="bg-primary text-white px-4 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 bg-gray-100 rounded">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}