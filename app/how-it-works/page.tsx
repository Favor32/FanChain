export default function HowItWorks() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1
        className="text-3xl mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
      >
        How It Works
      </h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        Fanchain listens to a live, verified feed of World Cup match data.
        When something notable happens — a goal, a red card — it's immediately
        offered to fans watching as a claimable collectible.
      </p>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        Claiming mints that moment as a real, ownable item directly into your
        connected wallet. It's not a screenshot or a highlight clip — it's a
        permanent record you actually hold.
      </p>
      <p style={{ color: "var(--text-muted)" }}>
        Every moment is tied to data that's independently verifiable, not
        just reported — so what you're claiming is backed by something real.
      </p>
    </main>
  );
}