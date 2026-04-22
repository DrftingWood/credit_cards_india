import Image from "next/image";
import type { NetworkRecord, Network } from "@/lib/types";

/**
 * Renders a network brand-mark (Visa / Mastercard / RuPay / Amex / Diners).
 *
 * Accepts either a full NetworkRecord (preferred, used wherever the enriched
 * card is available) or a bare network slug (used where we only have the slug,
 * e.g. the filter sidebar).
 *
 * Renders inside a fixed-size box using object-fit: contain so logos of
 * different native aspect ratios (Visa is wide; Diners is square; Mastercard
 * is square-ish) all feel visually consistent on the page. Gracefully
 * degrades to a text chip when the network record has no logo_path.
 */

interface NetworkLogoProps {
  network: NetworkRecord | Network;
  /** Visual height in px. The logo is rendered inside a box that's ~2.6x as
   *  wide so wide logos (Visa) and square logos (Diners) appear at the same
   *  visual weight. */
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

const ASPECT = 2.6;

export function NetworkLogo({ network, height = 18, className }: NetworkLogoProps) {
  const isRecord = typeof network !== "string";
  const slug = isRecord ? network.id : network;
  const name = isRecord ? network.name : NETWORK_NAMES[slug as Network] ?? slug;
  const logoPath = isRecord ? network.logo_path : null;

  if (logoPath) {
    const width = Math.round(height * ASPECT);
    return (
      <span
        className={`inline-block align-middle ${className ?? ""}`.trim()}
        style={{ width, height, position: "relative" }}
        aria-label={`${name} logo`}
      >
        <Image
          src={logoPath}
          alt={`${name} logo`}
          fill
          sizes={`${width}px`}
          style={{ objectFit: "contain", objectPosition: "center" }}
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
