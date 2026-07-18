import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const API_ORIGIN = "https://txline-dev.txodds.com";
const API_TOKEN = process.env.TXLINE_API_TOKEN;

async function getGuestJwt() {
  const res = await fetch(`${API_ORIGIN}/auth/guest/start`, { method: "POST" });
  const data = await res.json();
  return data.token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fixtureId = searchParams.get("fixtureId");

  const jwt = await getGuestJwt();

  const upstreamUrl = `${API_ORIGIN}/api/scores/stream${fixtureId ? `?fixtureId=${fixtureId}` : ""}`;

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "X-Api-Token": API_TOKEN as string,
    },
  });

  if (!upstreamResponse.body) {
    return new Response("No stream available", { status: 500 });
  }

  return new Response(upstreamResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}