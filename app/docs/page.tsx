export default function Docs() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1
        className="text-3xl mb-12 italic"
        style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
      >
        Docs
      </h1>

      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>Home</h2>
        <p style={{ color: "var(--text-muted)" }}>
          The landing page introduces Fanchain: claim real World Cup moments as
          on-chain collectibles the instant they happen. It previews the
          collection of claimable moment types and links into the Live Room.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>Live Room</h2>
        <p style={{ color: "var(--text-muted)" }} className="mb-2">
          This is where the experience happens. Once your wallet is connected,
          the app holds a live connection to match data. When a goal, red card,
          or yellow card is confirmed, a claimable card appears immediately.
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Tapping Claim mints that moment as an NFT directly into your wallet —
          a permanent record, not a screenshot.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>How It Works</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Explains the underlying flow in plain terms: connect, watch, claim.
          Aimed at fans with no blockchain background.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>Wallet & Network</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Fanchain supports Phantom wallet and currently runs on Solana Devnet
          for testing. Claimed moments can be verified on Solana's block
          explorer using the address shown after each claim.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>Data Source</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Match data is sourced from a live, verifiable World Cup feed, with
          access itself controlled on-chain — meaning even the data your
          moments are based on is anchored to Solana, not just the collectible
          you end up owning.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="text-xl mb-2" style={{ color: "var(--text-primary)" }}>Powered by TxODDS</h2>
        <p style={{ color: "var(--text-muted)" }} className="mb-2">
          TxODDS provides the live football data Fanchain runs on — real-time
          scores, fixtures, and match events for World Cup competitions,
          delivered as they happen.
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          What makes this data trustworthy is that access to it is itself
          governed on-chain: applications must hold a verified Solana-based
          subscription to receive it. That means the moments Fanchain lets you
          claim trace back to a data source that's provably legitimate, not
          just self-reported.
        </p>
      </section>
    </main>
  );
}