import Image from "next/image";
import type { EnrichedCard } from "@/lib/types";
import { IssuerLogo } from "./logos/issuer-logo";
import { NetworkLogo } from "./logos/network-logo";

/**
 * Renders the card's visual.
 *   - If card.image_path is set, shows that image (licensed real card art).
 *   - Otherwise renders a stylised tile with the issuer's brand_color as
 *     background, issuer logo top-left, card name bottom-left, network logo
 *     bottom-right. Aspect ratio is ISO credit-card (1.586:1).
 *
 * Sizing is controlled by the caller via `size`:
 *   - "tile" — small grid header (browse / featured).
 *   - "hero" — large image on the detail page header.
 */

interface CardImageProps {
  card: EnrichedCard;
  size?: "tile" | "hero";
  className?: string;
}

const SIZES = {
  tile: { width: 320, heightClass: "aspect-[1.586/1]" },
  hero: { width: 560, heightClass: "aspect-[1.586/1]" },
} as const;

export function CardImage({ card, size = "tile", className }: CardImageProps) {
  const bg = card.issuer_detail.brand_color || "#1e293b"; // slate-800 fallback
  const { width, heightClass } = SIZES[size];
  const wrapperClass = `relative w-full ${heightClass} overflow-hidden rounded-lg ${className ?? ""}`.trim();

  if (card.image_path) {
    return (
      <div className={wrapperClass}>
        <Image
          src={card.image_path}
          alt={card.name}
          fill
          sizes={`${width}px`}
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  // Stylised placeholder
  return (
    <div
      className={wrapperClass}
      style={{
        backgroundColor: bg,
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 55%)",
      }}
      aria-label={card.name}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          {/* Issuer mark: wrap in a chip for contrast on arbitrary brand colors */}
          <span className="rounded bg-white/90 px-2 py-1 shadow-sm">
            <IssuerLogo issuer={card.issuer_detail} height={16} />
          </span>
          {size === "hero" ? (
            <span className="text-xs uppercase tracking-wider text-white/80">
              {card.tier.replace("-", " ")}
            </span>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div
            className={`${size === "hero" ? "text-base md:text-lg" : "text-xs"} font-semibold text-white leading-tight drop-shadow-sm line-clamp-2`}
            style={{ maxWidth: "70%" }}
          >
            {card.name}
          </div>
          <span className="rounded bg-white/90 px-1.5 py-0.5 shadow-sm shrink-0">
            <NetworkLogo network={card.network_detail} height={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
