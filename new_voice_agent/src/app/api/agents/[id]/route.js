import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, { context }) {
  const { id } = context.params

  if (!id) return NextResponse.json({ error: "Missing ID in URL" }, { status: 400 })

  const body = await request.json()
  const { name, system_prompt, voice } = body

  const { data, error } = await supabase
    .from("Agents")
    .update({ name, system_prompt, voice })
    .eq("agent_id", id)
    .select()

  if (error) {
    console.error("SUPABASE UPDATE ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_, context) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = context?.params?.id; 
    if (!id) {
      return NextResponse.json({ error: "Missing agent id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select(); // optional, if you want deleted row info

    if (error) {
      console.error("SUPABASE DELETE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });

  } catch (err) {
    console.error("Error deleting agent:", err);
    return NextResponse.json({ error: "An error occurred while deleting agent" }, { status: 500 });
  }
}
