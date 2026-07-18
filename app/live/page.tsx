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

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const { publicKey } = useWallet();
  const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
  const [claiming, setClaiming] = useState<number | null>(null);
  const [fixture, setFixture] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/txline/scores?fixtureId=${FIXTURE_ID}`);

    eventSource.onopen = () => {
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.Ts && !data.fixtureId) {
        return; // heartbeat, ignore
      }

      const momentType = getMomentType(data);
      if (!momentType) {
        return; // not a moment we care about, ignore
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
        event.participant1IsHome !== undefined
          ? `Team ${event.participant1Id}`
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
        alert(`Claimed! NFT minted: ${result.mintAddress}`);
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
          className="text-3xl tracking-wide"
          style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
        >
          Claimed
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
        className="mb-8 text-xs px-3 py-1 rounded border"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Inject Test Goal (dev only)
      </button>

      <p
        className="mb-8 text-sm uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}
      >
        Status: {connectionStatus}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.length === 0 && (
          <div
            className="col-span-full rounded-xl border border-dashed p-12 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-lg mb-2"
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
              className="rounded-xl overflow-hidden border transition-all"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: isClaimed ? "var(--gold)" : "var(--border)",
                boxShadow: isClaimed ? "0 0 20px rgba(201, 169, 97, 0.25)" : "none",
              }}
            >
              <img src={imageSrc} alt={event.momentType} className="w-full h-40 object-cover" />
              <div className="p-4">
                <p
                  className="text-sm tracking-widest mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {event.momentType?.toUpperCase()}
                </p>
                <button
                  onClick={() => handleClaim(event, index)}
                  disabled={isClaimed || isClaiming}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
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
    </main>
  );
}