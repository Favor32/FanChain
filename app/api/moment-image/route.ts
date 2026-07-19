export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "generic";
  const team = searchParams.get("team") || "Team";
  const minute = searchParams.get("minute") || "0";

  const colors: Record<string, string> = {
    goal: "#00E5FF",
    redcard: "#FF3B3B",
    yellowcard: "#F4D35E",
    generic: "#00E5FF",
  };
  const labels: Record<string, string> = {
    goal: "GOAL",
    redcard: "RED CARD",
    yellowcard: "YELLOW CARD",
    generic: "MOMENT",
  };

  const accentColor = colors[type] || colors.generic;
  const label = labels[type] || labels.generic;

  const svg = `
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16192B"/>
      <stop offset="100%" stop-color="#0A0A0F"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)"/>
  <rect x="14" y="14" width="472" height="472" rx="16" fill="none" stroke="${accentColor}" stroke-width="3"/>
  <rect x="26" y="26" width="448" height="448" rx="10" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.4"/>
  <circle cx="250" cy="180" r="120" fill="url(#glow)"/>
  <text x="250" y="150" font-family="Arial, sans-serif" font-size="16" letter-spacing="3" fill="${accentColor}" text-anchor="middle">${minute}' MINUTE</text>
  <text x="250" y="320" font-family="Georgia, serif" font-style="italic" font-size="46" fill="#F2F3F7" text-anchor="middle" font-weight="bold">${label}</text>
  <text x="250" y="365" font-family="Georgia, serif" font-size="28" fill="#F2F3F7" text-anchor="middle">${team}</text>
  <text x="250" y="440" font-family="Arial, sans-serif" font-size="13" letter-spacing="4" fill="${accentColor}" text-anchor="middle">FANCHAIN COLLECTIBLE</text>
</svg>`.trim();

  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}