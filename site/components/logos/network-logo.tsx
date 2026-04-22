import Image from "next/image";
import type { NetworkRecord, Network } from "@/lib/types";

/**
 * Renders a network brand-mark (Visa / Mastercard / RuPay / Amex / Diners).
 *
 * Accepts either a full NetworkRecord (preferred, used wherever the enriched
 * card is available) or a bare network slug (used where we only have the
 * slug, e.g. the filter sidebar).
 *
 * Each logo renders at its native aspect ratio — wide wordmarks (Visa, RuPay)
 * stay wide; square marks (Amex, Diners) stay square. This keeps each brand
 * at its natural proportions, not letterboxed inside a shared box. Callers
 * pick a height that's large enough to keep square marks legible.
 */

interface NetworkLogoProps {
  network: NetworkRecord | Network;
  /** Rendered height in px. Width scales to preserve the logo's aspect. */
  height?: number;
  className?: string;
}

const NETWORK_NAMES: Record<Network, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  rupay: "RuPay",
  amex: "American Express",
  diners: "Diners Club",
};

export function NetworkLogo({ network, height = 20, className }: NetworkLogoProps) {
  const isRecord = typeof network !== "string";
  const slug = isRecord ? network.id : network;
  const name = isRecord ? network.name : NETWORK_NAMES[slug as Network] ?? slug;
  const logoPath = isRecord ? network.logo_path : null;

  if (logoPath) {
    return (
      <span
        className={`inline-flex items-center align-middle ${className ?? ""}`.trim()}
        aria-label={`${name} logo`}
      >
        <Image
          src={logoPath}
          alt={`${name} logo`}
          height={height}
          width={height * 4}
          sizes={`${height * 4}px`}
          style={{ height, width: "auto", maxWidth: "none" }}
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={`chip capitalize ${className ?? ""}`.trim()}
      aria-label={name}
    >
      {name}
    </span>
  );
}
