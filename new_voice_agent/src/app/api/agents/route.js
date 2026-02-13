import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("Agents")
    .select("*")

  if (error) {
    console.error("GET ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}


export async function POST(request) {
  const body = await request.json()
  const { name, system_prompt, voice } = body

  const { data, error } = await supabase
    .from("Agents")
    .insert([{ name, system_prompt, voice }])
    .select()

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
