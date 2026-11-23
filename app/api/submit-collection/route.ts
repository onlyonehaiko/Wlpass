import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Server is not configured yet." }, { status: 500 });
  }

  const body = await req.json();
  const { collectionName, socials, description, creatorWallet } = body;

  if (!collectionName || !creatorWallet) {
    return NextResponse.json({ error: "Collection name and wallet are required." }, { status: 400 });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("collections")
    .insert({
      collection_name: collectionName,
      socials: socials || null,
      description: description || null,
      creator_wallet: creatorWallet,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
