"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";

const FIXTURE_ID = 18257739; // Spain vs Argentina — swap this for whichever match you're demoing

function getMomentType(event: any): string | null {
  const soccer = event.dataSoccer;
  if (!soccer) return null;

  if (soccer.Goal) return "goal";
  if (soccer.RedCard) return "redcard";
  if (soccer.YellowCard) return "yellowcard";
  return null;
}

export default function LivePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const { publicKey } = useWallet();
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [claiming, setClaiming] = useState<number | null>(null);
  const [fixture, setFixture] = useState<any>(null);
  const [mintResult, setMintResult] = useState<{ index: number; mintAddress: string } | null>(null); 
 const [otherFixtures, setOtherFixtures] = useState<any[]>([]);
  useEffect(() => {
    const eventSource = new EventSource(`/api/txline/scores?fixtureId=${FIXTURE_ID}`);

    eventSource.onopen = () => {
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.Ts && !data.fixtureId) {
        return;
      }

      const momentType = getMomentType(data);
      if (!momentType) {
        return;
      }

      console.log("New moment:", momentType, data);
      setEvents((prev) => [{ ...data, momentType }, ...prev]);
    };

    eventSource.onerror = () => {
      setConnectionStatus("error");
    };

    return () => {
      eventSource.close();
    };
  }, []);

useEffect(() => {
    fetch("/api/txline/fixtures")
      .then((res) => res.json())
      .then((fixtures) => {
        const match = fixtures.find((f: any) => f.FixtureId === FIXTURE_ID);
        if (match) setFixture(match);
        setOtherFixtures(
      fixtures
    .filter((f: any) => f.FixtureId !== FIXTURE_ID)
    .slice(0, 6)
);
      })
      .catch((err) => console.error("Failed to load fixture info:", err));
  }, []);

  async function handleClaim(event: any, index: number) {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    setClaiming(index);

    try {
      const soccer = event.dataSoccer;
      const teamName =
        fixture && event.participant1Id === fixture.Participant1Id
          ? fixture.Participant1
          : fixture && event.participant1Id === fixture.Participant2Id
          ? fixture.Participant2
          : "Team";

      const response = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientWallet: publicKey.toBase58(),
          momentType: event.momentType,
          teamName,
          minute: soccer?.Minutes || 0,
        }),
      });

      const result = await response.json();

     if (result.success) {
        setClaimedIds((prev) => new Set(prev).add(index));
        setMintResult({ index, mintAddress: result.mintAddress });
      } else {
        alert("Claim failed: " + result.error);
      }
    } catch (error) {
      console.error("Claim error:", error);
      alert("Something went wrong claiming this moment.");
    } finally {
      setClaiming(null);
    }
  }

  function injectTestEvent() {
    const fakeEvent = {
      fixtureId: FIXTURE_ID,
      participant1Id: 3021,
      momentType: "goal",
      dataSoccer: {
        Goal: true,
        Minutes: 34,
      },
    };
    setEvents((prev) => [fakeEvent, ...prev]);
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl italic"
          style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
        >
          Live Room
        </h1>
        <WalletMultiButton />
      </div>

      {fixture && (
        <div
          className="rounded-xl border p-6 mb-8 flex items-center justify-between"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div>
            <p
              className="text-sm mb-2 italic"
              style={{ fontFamily: "var(--font-display)", color: "var(--pitch-green)" }}
            >
              Live now
            </p>
            <p
              className="text-2xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {fixture.Participant1}{" "}
              <span style={{ color: "var(--text-muted)" }}>vs</span>{" "}
              {fixture.Participant2}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {fixture.Competition}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={injectTestEvent}
        className="mb-8 text-xs px-4 py-2 rounded-lg border italic"
        style={{ borderColor: "var(--accent-bright)", color: "var(--accent-bright)", fontFamily: "var(--font-display)" }}
      >
        Simulate a Moment
      </button>

      <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
        {connectionStatus === "connected" ? "Connected to live match feed" : "Connecting..."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {events.length === 0 && (
          <div
            className="col-span-full rounded-xl border border-dashed p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-lg mb-2 italic"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              No moments yet
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Goals and cards will appear here the instant they happen.
            </p>
          </div>
        )}
        {events.map((event, index) => {
          const isClaimed = claimedIds.has(index);
          const isClaiming = claiming === index;
          const imageMap: Record<string, string> = {
            goal: "/moments/goal.svg",
            redcard: "/moments/redcard.svg",
            yellowcard: "/moments/yellowcard.svg",
          };
          const imageSrc = imageMap[event.momentType] || "/moments/generic.svg";

         return (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden transition-transform hover:-translate-y-2"
              style={{
                border: isClaimed ? "2px solid var(--gold)" : "1px solid var(--border)",
                boxShadow: isClaimed
                  ? "0 0 30px rgba(0, 229, 255, 0.35)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <img src={imageSrc} alt={event.momentType} className="w-full h-72 object-cover" />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, var(--bg-deep) 10%, transparent 55%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p
                  className="text-2xl italic mb-4"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {event.momentType?.toUpperCase()}
                </p>
                <button
                  onClick={() => handleClaim(event, index)}
                  disabled={isClaimed || isClaiming}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: isClaimed ? "transparent" : "var(--gold)",
                    color: isClaimed ? "var(--gold)" : "var(--bg-deep)",
                    border: isClaimed ? "1px solid var(--gold)" : "none",
                    opacity: isClaiming ? 0.6 : 1,
                    cursor: isClaimed || isClaiming ? "default" : "pointer",
                  }}
                >
                  {isClaimed ? "Claimed ✓" : isClaiming ? "Claiming..." : "Claim"}
                </button>
              </div>
            </div>
          
          );
        })}
      </div>
      {mintResult && (
        <div
          className="fixed bottom-6 right-6 rounded-xl border p-4 max-w-sm"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--accent-bright)" }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--accent-bright)" }}>
            Moment claimed
          </p>
          <p className="text-xs mb-3 break-all" style={{ color: "var(--text-muted)" }}>
            {mintResult.mintAddress}
          </p>
          <div className="flex gap-3">
            <a
              href={`https://explorer.solana.com/address/${mintResult.mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
              style={{ color: "var(--accent-bright)" }}
            >
              View on Explorer
            </a>
            <button
              onClick={() => setMintResult(null)}
              className="text-xs underline"
              style={{ color: "var(--text-muted)" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {otherFixtures.length > 0 && (
        <div className="mt-20">
          <h2
            className="text-lg mb-6 italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            More Fixtures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherFixtures.map((f) => (
              <div
                key={f.FixtureId}
                className="rounded-xl border p-5 flex justify-between items-center"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <p className="text-base" style={{ color: "var(--text-primary)" }}>
                  {f.Participant1}{" "}
                  <span style={{ color: "var(--text-muted)" }} className="mx-1">vs</span>{" "}
                  {f.Participant2}
                </p>
                <p
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: "var(--bg-deep)", color: "var(--gold)" }}
                >
                  World Cup
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </main>
  );
}