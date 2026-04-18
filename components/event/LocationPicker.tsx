"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, X } from "lucide-react";

interface Prediction {
  place_id: string;
  description: string;
}

interface Props {
  defaultLocationName?: string;
  defaultLocationUrl?: string;
}

export function LocationPicker({ defaultLocationName = "", defaultLocationUrl = "" }: Props) {
  const [query, setQuery] = useState(defaultLocationName);
  const [locationName, setLocationName] = useState(defaultLocationName);
  const [locationUrl, setLocationUrl] = useState(defaultLocationUrl);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapEmbed, setMapEmbed] = useState<string | null>(
    defaultLocationName && defaultLocationUrl ? buildEmbedFromMapsUrl(defaultLocationUrl) : null
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  function buildEmbedFromMapsUrl(url: string): string | null {
    try {
      const match = url.match(/q=([-\d.]+),([-\d.]+)/);
      if (!match) return null;
      return `https://www.google.com/maps/embed/v1/place?key=${""}&q=${match[1]},${match[2]}`;
    } catch { return null; }
  }

  function buildEmbed(lat: number, lng: number, name: string) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  const search = async (q: string) => {
    if (q.length < 2) { setPredictions([]); setShowDropdown(false); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/places?input=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPredictions(data.predictions ?? []);
      setShowDropdown((data.predictions ?? []).length > 0);
    } catch { /* fail silently */ }
    setIsSearching(false);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setLocationName(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 400);
  };

  const handleSelect = async (prediction: Prediction) => {
    setQuery(prediction.description);
    setLocationName(prediction.description);
    setPredictions([]);
    setShowDropdown(false);
    setIsSearching(true);

    try {
      const res = await fetch(`/api/places?placeId=${prediction.place_id}`);
      const data = await res.json();
      const loc = data.result?.geometry?.location;
      if (loc) {
        const mapsUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
        setLocationUrl(mapsUrl);
        setMapEmbed(buildEmbed(loc.lat, loc.lng, prediction.description));
      }
    } catch { /* fail silently */ }

    setIsSearching(false);
  };

  const clear = () => {
    setQuery("");
    setLocationName("");
    setLocationUrl("");
    setMapEmbed(null);
    setPredictions([]);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-3">
      {/* Hidden inputs submitted with the form */}
      <input type="hidden" name="location" value={locationName} />
      <input type="hidden" name="locationUrl" value={locationUrl} />

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <Input
          placeholder="Search for a venue or address..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="pl-9 pr-9"
          autoComplete="off"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-zinc-400" />
        )}
        {!isSearching && query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
            {predictions.map((p) => (
              <button
                key={p.place_id}
                type="button"
                onMouseDown={() => handleSelect(p)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-stone-50 flex items-start gap-2.5 border-b border-stone-100 last:border-0 transition-colors"
              >
                <MapPin className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span className="text-zinc-700 line-clamp-1">{p.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map preview */}
      {mapEmbed && (
        <div className="rounded-xl overflow-hidden border border-stone-200 h-44">
          <iframe
            src={mapEmbed}
            className="w-full h-full"
            title="Location preview"
            loading="lazy"
          />
        </div>
      )}

      {/* Editable maps link */}
      {locationName && (
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Maps link (auto-filled, or paste your own)</label>
          <Input
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="text-xs"
          />
        </div>
      )}
    </div>
  );
}
