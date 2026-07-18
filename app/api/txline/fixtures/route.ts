import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const API_ORIGIN = "https://txline-dev.txodds.com";
const API_TOKEN = process.env.TXLINE_API_TOKEN;


async function getGuestJwt() {
  const res = await fetch(`${API_ORIGIN}/auth/guest/start`, {
    method: "POST",
  });
  const data = await res.json();
  return data.token;
}

export async function GET() {
  try {
    const jwt = await getGuestJwt();

    const res = await fetch(`${API_ORIGIN}/api/fixtures/snapshot`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "X-Api-Token": API_TOKEN as string,
      },
    });

    const fixtures = await res.json();
    return Response.json(fixtures);
  } catch (error) {
    console.error("Fixtures fetch failed:", error);
    return Response.json({ error: "Failed to fetch fixtures" }, { status: 500 });
  }
}