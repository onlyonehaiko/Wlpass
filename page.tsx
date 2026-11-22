"use client";

import { useState } from "react";

const tokens = {
  ink: "#0B0B0C",
  sub: "#6B6B72",
  line: "#E7E7EA",
  accent: "#2B4CFF",
  surface: "#F7F7F8",
  good: "#1A8A4C",
};

export default function CheckWalletPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { held: boolean; count: number }>(null);
  const [error, setError] = useState("");

  async function handleCheck() {
    setError("");
    setResult(null);
    const trimmed = address.trim();
    if (!trimmed) {
      setError("Enter an address first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/check-wallet?address=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, marginBottom: 10 }}>Check my wallet</h1>
        <p style={{ fontSize: 14, color: tokens.sub, margin: "0 0 26px" }}>
          Paste any XRPL address to see if it holds a WL Pass.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="rN4aBcD9f...8pQ2"
            style={{
              flex: 1,
              background: tokens.surface,
              border: `1px solid ${tokens.line}`,
              borderRadius: 9,
              padding: "0 14px",
              height: 48,
              fontSize: 13,
              fontFamily: "monospace",
              color: tokens.ink,
            }}
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              background: tokens.accent,
              color: "#fff",
              border: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              padding: "0 20px",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>

        {error && <p style={{ color: "#C0392B", fontSize: 13, marginBottom: 16 }}>{error}</p>}

        {result && result.held && (
          <div
            style={{
              border: `1px solid ${tokens.line}`,
              borderRadius: 12,
              padding: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(26,138,76,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: tokens.good, fontSize: 18 }}>✓</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>WL Pass found</div>
              <div style={{ fontSize: 12, color: tokens.sub }}>
                This wallet holds {result.count} pass{result.count === 1 ? "" : "es"} from this issuer.
              </div>
            </div>
          </div>
        )}

        {result && !result.held && (
          <div style={{ border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 18, fontSize: 13, color: tokens.sub }}>
            No pass found for this address.
          </div>
        )}
      </div>
    </div>
  );
}
