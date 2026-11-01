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
export const IconHealth = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.8 4.8 0 018.8-2.6 4.8 4.8 0 018.8 2.6z" /><path d="M8 12h8M12 8v8" /></Svg>;
export const IconGroceries = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M4 8h16l-1 12H5L4 8zM3 8l2-5h14l2 5M9 12v4M15 12v4" /></Svg>;
export const IconStack = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></Svg>;
export const IconLightbulb = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1115.5 14.5c-.8.7-1.2 1.5-1.4 2.5h-4.2c-.2-1-.6-1.8-1.4-2.5z" /></Svg>;
export const IconWarning = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M10.3 4.3a2 2 0 013.4 0l8 14a2 2 0 01-1.7 3H4a2 2 0 01-1.7-3l8-14z" /><path d="M12 9v5M12 18h.01" /></Svg>;
export const IconLock = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></Svg>;
export const IconUnlock = ({ className }: { className?: string }) =>
  <Svg className={className}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 017.5-2" /></Svg>;
export const IconCheck = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M5 12l4 4L19 6" /></Svg>;
export const IconStar = ({ className }: { className?: string }) =>
  <Svg className={className}><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z" /></Svg>;
