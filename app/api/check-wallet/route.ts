import { NextRequest, NextResponse } from "next/server";

// This route runs on the server only. The Bithomp API key never reaches
// the browser, and the person checking their wallet never sees Bithomp's
// name anywhere in the response.

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const issuer = process.env.ISSUER_ADDRESS;
  const apiKey = process.env.BITHOMP_API_KEY;

  if (!address) {
    return NextResponse.json({ error: "Missing address." }, { status: 400 });
  }
  if (!issuer || !apiKey) {
    return NextResponse.json(
      { error: "Server is not configured yet. Missing ISSUER_ADDRESS or BITHOMP_API_KEY." },
      { status: 500 }
    );
  }

  try {
    // Bithomp: list NFTs owned by an address, filtered to our issuer.
    // Check the exact header name on your Bithomp dashboard when you get
    // your key, this is the one documented at the time this was written.
    const url = `https://bithomp.com/api/v2/nfts?owner=${encodeURIComponent(
      address
    )}&issuer=${encodeURIComponent(issuer)}&limit=50`;

    const bithompRes = await fetch(url, {
      headers: { "x-bithomp-token": apiKey },
      // Avoid caching someone else's wallet result.
      cache: "no-store",
    });

    if (!bithompRes.ok) {
      const text = await bithompRes.text();
      return NextResponse.json(
        { error: `Lookup failed (${bithompRes.status}). ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await bithompRes.json();
    const nfts = data?.nfts ?? [];

    return NextResponse.json({ held: nfts.length > 0, count: nfts.length });
  } catch (err: any) {
    return NextResponse.json({ error: "Could not reach the lookup service." }, { status: 502 });
  }
}
