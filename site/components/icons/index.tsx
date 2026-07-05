import type { SVGProps } from "react";

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  const p: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round",
    className, "aria-hidden": true, width: "1em", height: "1em",
  };
  return <svg {...p}>{children}</svg>;
}

export const IconArrowRight = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const IconSearch = ({ className }: { className?: string }) =>
  <Svg className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></Svg>;
export const IconLink = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1" /></Svg>;
export const IconCashback = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></Svg>;
export const IconTravel = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M2 16l8-2 4-9 2 1-2 8 6-1 1 2-9 3-4 5-2-1 2-5-6 1z" /></Svg>;
export const IconDining = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M6 3v8a3 3 0 006 0V3M8 3v6M18 3c-2 1-3 3-3 6v3M15 12h3v9" /></Svg>;
export const IconFuel = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="4" y="4" width="10" height="16" rx="1" /><path d="M14 9h3a2 2 0 012 2v5a2 2 0 002 2M14 12h3" /></Svg>;
export const IconShopping = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M6 6h15l-1.5 9h-12z" /><path d="M6 6L5 3H3" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></Svg>;
export const IconFree = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h6" /></Svg>;
export const IconPremium = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M3 8l4 3 5-6 5 6 4-3-2 11H5z" /></Svg>;
export const IconForex = ({ className }: { className?: string }) =>
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Svg>;
