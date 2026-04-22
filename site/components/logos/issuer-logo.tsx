import Image from "next/image";
import type { IssuerRecord } from "@/lib/types";

/**
 * Renders an issuer brand-mark (HDFC / ICICI / SBI / …).
 *
 * Variants:
 *   - "mark-only" (default) — logo only; falls back to the short-name chip.
 *   - "with-name"           — logo + common name on a pill; fallback is full name.
 *
 * Renders the logo inside a fixed-size box with object-fit: contain so logos
 * with very different native aspect ratios (some are square, some are wide
 * wordmarks) all feel visually consistent on the page. Gracefully degrades
 * to a text chip when the issuer record has no logo_path.
 */

interface IssuerLogoProps {
  issuer: IssuerRecord;
  variant?: "mark-only" | "with-name";
  /** Visual height in px. Logo rendered inside a fixed-ratio box. */
  height?: number;
  className?: string;
}

const ASPECT = 2.4;

export function IssuerLogo({
  issuer,
  variant = "mark-only",
  height = 20,
  className,
}: IssuerLogoProps) {
  const displayName = issuer.short_name || issuer.name;
  const wrapperClass = `inline-flex items-center gap-1.5 ${className ?? ""}`.trim();

  if (issuer.logo_path) {
    const width = Math.round(height * ASPECT);
    return (
      <span className={wrapperClass} aria-label={issuer.name}>
        <span
          className="inline-block align-middle"
          style={{ width, height, position: "relative" }}
        >
          <Image
            src={issuer.logo_path}
            alt={`${issuer.name} logo`}
            fill
            sizes={`${width}px`}
            style={{ objectFit: "contain", objectPosition: "left center" }}
            unoptimized
          />
        </span>
        {variant === "with-name" ? (
          <span className="text-sm text-slate-700">{displayName}</span>
        ) : null}
      </span>
    );
  }

  // Text fallback
  return (
    <span
      className={`${wrapperClass} text-xs uppercase tracking-wide text-slate-500`}
      aria-label={issuer.name}
    >
      {variant === "with-name" ? issuer.name : displayName}
    </span>
  );
}
