import Image from "next/image";
import type { IssuerRecord } from "@/lib/types";

/**
 * Renders an issuer brand-mark (HDFC / ICICI / SBI / …).
 *
 * Variants:
 *   - "mark-only" (default) — logo only; falls back to the short-name chip.
 *   - "with-name"           — logo + common name on a pill; fallback is full name.
 *
 * Each logo renders at its native aspect ratio (no fixed-box letterboxing)
 * so wordmarks keep their natural width and square marks stay square.
 * Gracefully degrades to a text chip when the issuer record has no logo_path.
 */

interface IssuerLogoProps {
  issuer: IssuerRecord;
  variant?: "mark-only" | "with-name";
  /** Rendered height in px. Width is auto to preserve the logo's aspect. */
  height?: number;
  className?: string;
}

export function IssuerLogo({
  issuer,
  variant = "mark-only",
  height = 22,
  className,
}: IssuerLogoProps) {
  const displayName = issuer.short_name || issuer.name;
  const wrapperClass = `inline-flex items-center gap-1.5 ${className ?? ""}`.trim();

  if (issuer.logo_path) {
    return (
      <span className={wrapperClass} aria-label={issuer.name}>
        <Image
          src={issuer.logo_path}
          alt={`${issuer.name} logo`}
          height={height}
          width={height * 4}
          sizes={`${height * 4}px`}
          style={{ height, width: "auto", maxWidth: "none" }}
          unoptimized
        />
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
