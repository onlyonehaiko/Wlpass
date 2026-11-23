"use client";

import { useState } from "react";

const tokens = {
  ink: "#0B0B0C",
  sub: "#6B6B72",
  line: "#E7E7EA",
  accent: "#2B4CFF",
  surface: "#F7F7F8",
};

export default function ConnectPage() {
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [socials, setSocials] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!wallet.trim() || !name.trim()) {
      setError("Wallet address and collection name are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: name,
          socials,
          description,
          creatorWallet: wallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23 }}>Submitted</h1>
          <p style={{ color: tokens.sub, fontSize: 14 }}>We will review your pass and be in touch.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", padding: "44px 24px 60px" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 23, marginBottom: 8 }}>Set up your collection</h1>
      <p style={{ fontSize: 14, color: tokens.sub, margin: "0 0 28px" }}>
        Tell us about the drop. Real wallet sign in is coming soon, for now just paste your address.
      </p>

      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Wallet address</label>
      <input
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="rPQ8f...2kLm"
        style={{ width: "100%", background: tokens.surface, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: "13px 14px", fontSize: 14, marginBottom: 18, boxSizing: "border-box" }}
      />

      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Collection name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Odd Ones"
        style={{ width: "100%", background: tokens.surface, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: "13px 14px", fontSize: 14, marginBottom: 18, boxSizing: "border-box" }}
      />

      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>X or website, optional</label>
      <input
        value={socials}
        onChange={(e) => setSocials(e.target.value)}
        placeholder="x.com/yourcollection"
        style={{ width: "100%", background: tokens.surface, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: "13px 14px", fontSize: 14, marginBottom: 18, boxSizing: "border-box" }}
      />

      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Short description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="A line or two about the drop"
        style={{ width: "100%", minHeight: 84, background: tokens.surface, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: "13px 14px", fontSize: 14, marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit" }}
      />

      {error && <p style={{ color: "#C0392B", fontSize: 13, margin: "8px 0" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", background: tokens.accent, color: "#fff", border: "none", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, padding: 15, borderRadius: 9, cursor: "pointer", marginTop: 8 }}
      >
        {loading ? "Submitting..." : "Continue"}
      </button>
    </div>
  );
}
