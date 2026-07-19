export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6">
      <div className="flex flex-col items-center text-center pt-12 pb-20">
        <div className="floating-ball mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" className="spinning-ball">
            <circle cx="40" cy="40" r="38" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <path
              d="M40 12 L52 22 L48 38 L32 38 L28 22 Z M40 12 L40 4 M52 22 L66 20 M48 38 L58 50 M32 38 L22 50 M28 22 L14 20"
              fill="none"
              stroke="var(--accent-bright)"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <h1
          className="text-6xl sm:text-7xl mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Fanchain
        </h1>
        <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Every goal. Every card. Yours, the instant it happens — a verified,
          on-chain claim to the moment you watched, sent straight to your wallet.
        </p>
        <a
          href="/live"
          className="inline-block px-8 py-3 rounded-lg font-medium"
          style={{ backgroundColor: "var(--gold)", color: "var(--bg-deep)" }}
        >
          Enter the Live Room
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
        <div>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }} className="text-2xl mb-2">01</p>
          <p style={{ color: "var(--text-primary)" }} className="mb-1 font-medium">Connect your wallet</p>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">Link Phantom in a couple taps. That's the only setup.</p>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }} className="text-2xl mb-2">02</p>
          <p style={{ color: "var(--text-primary)" }} className="mb-1 font-medium">Watch it happen</p>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">Goals and cards appear the second they're confirmed on the pitch.</p>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }} className="text-2xl mb-2">03</p>
          <p style={{ color: "var(--text-primary)" }} className="mb-1 font-medium">Claim it</p>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">One tap mints it to your wallet. It's yours, permanently.</p>
        </div>
      </div>
      <div className="mt-24 mb-16">
        <h2
          className="text-2xl mb-2 italic text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          The Collection
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
          Every moment type you can claim
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { img: "/moments/goal.svg", label: "Goal" },
            { img: "/moments/redcard.svg", label: "Red Card" },
            { img: "/moments/yellowcard.svg", label: "Yellow Card" },
            { img: "/moments/generic.svg", label: "Moment" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: "var(--border)" }}
            >
              <img src={item.img} alt={item.label} className="w-full h-32 object-cover" />
              <p
                className="text-xs text-center py-2"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
          