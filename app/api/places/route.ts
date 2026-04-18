import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");
  const placeId = searchParams.get("placeId");

  if (!API_KEY) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 });
  }

  // Place Details — returns lat/lng for a selected place
  if (placeId) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${API_KEY}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Autocomplete — returns suggestions as the user types
  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}&language=en`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
