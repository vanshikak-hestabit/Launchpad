import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { agentId, userId } = await req.json();

  // Create a token for the user to join the room
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: userId || "user-" + Date.now() }
  );

  // Grant permission to join the agent's room
  token.addGrant({
    room: `agent-${agentId}`,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json({ token: await token.toJwt() });
}