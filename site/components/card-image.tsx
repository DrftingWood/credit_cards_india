import Image from "next/image";
import type { EnrichedCard } from "@/lib/types";
import { IssuerLogo } from "./logos/issuer-logo";
import { NetworkLogo } from "./logos/network-logo";

/**
 * Renders a card's visual face with a flattened, smooth pixelated fintech aesthetic
 * inspired by Kiwi and modern digital card vaults.
 *
 * Visual features:
 *   - ISO 7810 credit-card ratio (1.586 : 1) with smooth rounded corners.
 *   - Signature Kiwi-style micro-dot / pixel matrix texture overlay.
 *   - Realistic EMV smart chip and contactless NFC wave icons.
 *   - Dynamic palette mapping (metal/onyx, travel midnight, dining flame, fintech neon).
 *   - Masked card number with deterministic 4-digit card ending.
 *   - Tactile inner bevel, holographic reflection sheen, and ambient rim light.
 *   - If licensed image art is available (card.image_path), embeds it cleanly inside
 *     the same flattened frame with pixelated overlay.
 */

interface CardImageProps {
  card: EnrichedCard;
  size?: "tile" | "hero";
  className?: string;
}

const SIZES = {
  tile: { width: 340, heightClass: "aspect-[1.586/1]" },
  hero: { width: 560, heightClass: "aspect-[1.586/1]" },
} as const;

/** Deterministic 4-digit number from card id string for realistic card embossing */
function getCardLastFour(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash) % 9000 + 1000;
  return positive.toString();
}

/** Determine authentic card color palette and styling based on card characteristics */
function getCardStyling(card: EnrichedCard) {
  const id = card.id.toLowerCase();
  const brandColor = card.issuer_detail.brand_color || "#1e293b";
  const tier = card.tier;

  // 1. Super-Premium / Metal / Black cards
  if (
    tier === "super-premium" ||
    tier === "invite-only" ||
    id.includes("infinia") ||
    id.includes("magnus") ||
    id.includes("centurion") ||
    id.includes("reserve") ||
    id.includes("metal") ||
    id.includes("black") ||
    id.includes("emeralde-private")
  ) {
    return {
      gradient: "linear-gradient(135deg, #18181b 0%, #09090b 50%, #27272a 100%)",
      accent: "#e4e4e7",
      chipColor: "#fbbf24", // gold chip
      isDark: true,
      tag: "METAL",
    };
  }

  // 2. Food & Dining co-brands (Swiggy, EazyDiner, Zomato)
  if (id.includes("swiggy") || id.includes("eazydiner") || id.includes("zomato")) {
    return {
      gradient: "linear-gradient(135deg, #09090b 0%, #18181b 45%, #ea580c 100%)",
      accent: "#fed7aa",
      chipColor: "#fbbf24",
      isDark: true,
      tag: "DINING",
    };
  }

  // 3. Travel & Airlines (Atlas, TravelOne, Horizon, Vistara, IndiGo, Air India)
  if (
    id.includes("atlas") ||
    id.includes("travel") ||
    id.includes("horizon") ||
    id.includes("vistara") ||
    id.includes("indigo") ||
    id.includes("air-india") ||
    id.includes("etihad") ||
    id.includes("krisflyer")
  ) {
    return {
      gradient: "linear-gradient(135deg, #091e3a 0%, #0f172a 55%, #0284c7 100%)",
      accent: "#bae6fd",
      chipColor: "#e2e8f0", // silver chip
      isDark: true,
      tag: "VOYAGE",
    };
  }

  // 4. Fuel & Commute (BPCL, IOCL, HPCL)
  if (id.includes("bpcl") || id.includes("iocl") || id.includes("hpcl") || id.includes("fuel")) {
    return {
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 55%, #dc2626 100%)",
      accent: "#fecaca",
      chipColor: "#fbbf24",
      isDark: true,
      tag: "FUEL",
    };
  }

  // 5. Fintech / UPI First (Kiwi, Jupiter, super.money, Slice, Wave)
  if (id.includes("kiwi") || id.includes("jupiter") || id.includes("super") || id.includes("slice") || id.includes("wave")) {
    return {
      gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #10b981 100%)",
      accent: "#a7f3d0",
      chipColor: "#34d399",
      isDark: true,
      tag: "UPI REWARDS",
    };
  }

  // 6. E-Commerce (Amazon Pay, Flipkart, Tata Neu)
  if (id.includes("amazon-pay")) {
    return {
      gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #f59e0b 100%)",
      accent: "#fef3c7",
      chipColor: "#fbbf24",
      isDark: true,
      tag: "AMAZON PAY",
    };
  }

  if (id.includes("tata-neu")) {
    return {
      gradient: "linear-gradient(135deg, #3b0764 0%, #581c87 55%, #a855f7 100%)",
      accent: "#f3e8ff",
      chipColor: "#fbbf24",
      isDark: true,
      tag: "TATA NEU",
    };
  }

  // 7. General Issuer Brand fallback
  return {
    gradient: `linear-gradient(135deg, ${brandColor} 0%, #09090b 85%)`,
    accent: "#ffffff",
    chipColor: "#e2e8f0",
    isDark: true,
    tag: card.tier.replace("-", " ").toUpperCase(),
  };
}

export function CardImage({ card, size = "tile", className }: CardImageProps) {
  const { heightClass } = SIZES[size];
  const styling = getCardStyling(card);
  const last4 = getCardLastFour(card.id);
  const isHero = size === "hero";

  const wrapperClass = `relative w-full ${heightClass} overflow-hidden rounded-xl border border-white/10 shadow-lg select-none ${className ?? ""}`.trim();

  return (
    <div
      className={wrapperClass}
      style={{ background: styling.gradient }}
      aria-label={card.name}
    >
      {/* Real Card Artwork (if licensed art is provided) */}
      {card.image_path ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={card.image_path}
            alt={card.name}
            fill
            sizes={isHero ? "560px" : "340px"}
            className="object-cover opacity-85"
            unoptimized
          />
        </div>
      ) : null}

      {/* Signature Kiwi-style Smooth Pixelated / Dot Matrix Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.16) 1.2px, transparent 1.2px)",
          backgroundSize: "7px 7px",
          mixBlendMode: "overlay",
          opacity: 0.75,
        }}
      />

      {/* Diagonal Frosted Glass Light Sheen */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(118deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 60%)",
        }}
      />

      {/* Tactile Card Details Container */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-4 text-white">
        {/* Top Bar: Issuer Logo + Contactless NFC & Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white/95 px-2 py-1 shadow-sm flex items-center">
              <IssuerLogo issuer={card.issuer_detail} height={isHero ? 18 : 14} />
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Contactless Waves SVG */}
            <svg
              className="w-4 h-4 text-white/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M8.5 16.5a5 5 0 0 1 0-7" />
              <path d="M12 19a8.5 8.5 0 0 0 0-12" />
              <path d="M15.5 21.5a12 12 0 0 0 0-17" />
            </svg>

            {/* Sub-tier / Tag Chip */}
            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-white/90 border border-white/10 uppercase">
              {styling.tag}
            </span>
          </div>
        </div>

        {/* Middle Area: Realistic EMV Microchip */}
        <div className="my-auto pt-1">
          <div className="flex items-center justify-between">
            {/* EMV Microchip SVG */}
            <div className="relative w-8 h-6 sm:w-9 sm:h-7 rounded-sm bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border border-amber-600/60 shadow-sm flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0.5 border border-amber-700/40 rounded-sm" />
              <div className="w-full h-[1px] bg-amber-800/40 absolute top-1/2 -translate-y-1/2" />
              <div className="h-full w-[1px] bg-amber-800/40 absolute left-1/3" />
              <div className="h-full w-[1px] bg-amber-800/40 absolute right-1/3" />
            </div>

            {/* Masked PAN placeholder */}
            <div className="font-mono text-xs sm:text-sm tracking-widest text-white/75 drop-shadow-sm tabular-nums">
              •••• {last4}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Card Name + Network Hologram Logo */}
        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="min-w-0 pr-2">
            <div
              className={`${
                isHero ? "text-base sm:text-lg" : "text-xs sm:text-sm"
              } font-bold text-white tracking-tight leading-snug drop-shadow-md line-clamp-1`}
            >
              {card.name}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/60 font-medium mt-0.5">
              {card.network_tier ? card.network_tier.replace("-", " ") : card.network}
            </div>
          </div>

          <span className="rounded-md bg-white/95 px-2 py-1 shadow-sm shrink-0 flex items-center">
            <NetworkLogo network={card.network_detail} height={isHero ? 16 : 13} />
          </span>
        </div>
      </div>

      {/* Subtle Inner Highlight Rim */}
      <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/20 z-30" />
    </div>
  );
}
