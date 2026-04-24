import Image from "next/image";
import type { NetworkRecord, Network } from "@/lib/types";

/**
 * Renders a network brand-mark (Visa / Mastercard / RuPay / Amex / Diners).
 *
 * Accepts either a full NetworkRecord (preferred, used wherever the enriched
 * card is available) or a bare network slug (used where we only have the slug,
 * e.g. the filter sidebar). Gracefully degrades to a text chip when the
 * network record has no logo_path set, so pages stay meaningful even before
 * any logo assets are committed under site/public/logos/networks/.
 */

interface NetworkLogoProps {
  network: NetworkRecord | Network;
  /** Height in pixels. The width scales to preserve the logo's aspect ratio. */
  height?: number;
  /** Optional className on the wrapper. */
  className?: string;
}

const NETWORK_NAMES: Record<Network, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  rupay: "RuPay",
  amex: "American Express",
  diners: "Diners Club",
};

export function NetworkLogo({ network, height = 18, className }: NetworkLogoProps) {
  const isRecord = typeof network !== "string";
  const slug = isRecord ? network.id : network;
  const name = isRecord ? network.name : NETWORK_NAMES[slug as Network] ?? slug;
  const logoPath = isRecord ? network.logo_path : null;

  if (logoPath) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center" }}
        aria-label={`${name} logo`}
      >
        <Image
          src={logoPath}
          alt={`${name} logo`}
          height={height}
          width={Math.round(height * 2.2)}
          style={{ height, width: "auto", objectFit: "contain" }}
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
