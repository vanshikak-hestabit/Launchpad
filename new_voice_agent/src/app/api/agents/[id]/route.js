import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function PUT(request, context) {
  const { id } = await context.params
  console.log("id", id)

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

export async function DELETE(request, context) {
  try {
  
    const { id } = await context.params

    console.log("Deleting agent id:", id)

    if (!id) {
      return NextResponse.json(
        { error: "Missing agent id" },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from("Agents")
      .delete()
      .eq("agent_id", id)
      .select()

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deleted: data,
    })

  } catch (err) {
    console.error("Unexpected delete error:", err)
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting agent" },
      { status: 500 }
    )
  }
}