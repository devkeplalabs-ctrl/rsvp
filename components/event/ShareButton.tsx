"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  publicSlug: string;
}

export function ShareButton({ publicSlug }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/e/${publicSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleShare}
    >
      {copied ? (
        <><Check className="w-4 h-4 text-green-600" /> Copied!</>
      ) : (
        <><Share2 className="w-4 h-4" /> Share</>
      )}
    </Button>
  );
}
