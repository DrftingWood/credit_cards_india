// The one icon barrel. Phosphor (Regular weight; pass weight="light" for large icons) is imported
// ONLY here - an ESLint rule bans @phosphor-icons/react everywhere else (docs/DESIGN_INSTRUCTIONS.md DI-21).
//
// We import from "/dist/ssr": the default entry uses React context, which server components cannot
// render. The ssr entry is plain components, so the same barrel works in server and client code.
//
// Icons are decorative by default (aria-hidden). Pass aria-label to make one meaningful; it then
// gets role="img" and loses aria-hidden. A label in text always comes first (UX-2): an icon supports it.
//
// Hand-drawn SVGs live only where they are marks (issuer/network logos in components/logos, card art
// in components/card-image.tsx). Interface glyphs belong here.
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  Airplane,
  ArrowRight,
  Basket,
  Check,
  Crown,
  CreditCard,
  Desktop,
  ForkKnife,
  GasPump,
  Gift,
  Globe,
  HandCoins,
  Heart,
  Lightbulb,
  Lightning,
  LinkSimple,
  Lock,
  LockOpen,
  MagnifyingGlass,
  Moon,
  Receipt,
  Scales,
  ShoppingBag,
  ShoppingCart,
  Star,
  Sun,
  Warning,
} from "@phosphor-icons/react/dist/ssr";

export type { IconProps };

/** Wrap a Phosphor glyph: decorative (aria-hidden) unless an accessible name is given. */
function glyph(Base: ComponentType<IconProps>, displayName: string) {
  const Icon = (props: IconProps) => {
    const named = props["aria-label"] != null || props["aria-labelledby"] != null;
    return named ? <Base role="img" {...props} /> : <Base aria-hidden="true" {...props} />;
  };
  Icon.displayName = displayName;
  return Icon;
}

export const IconArrowRight = glyph(ArrowRight, "IconArrowRight");
export const IconSearch = glyph(MagnifyingGlass, "IconSearch");
export const IconLink = glyph(LinkSimple, "IconLink");
export const IconCashback = glyph(HandCoins, "IconCashback");
export const IconTravel = glyph(Airplane, "IconTravel");
export const IconDining = glyph(ForkKnife, "IconDining");
export const IconFuel = glyph(GasPump, "IconFuel");
export const IconShopping = glyph(ShoppingCart, "IconShopping");
export const IconFree = glyph(Gift, "IconFree");
export const IconPremium = glyph(Crown, "IconPremium");
export const IconForex = glyph(Globe, "IconForex");

// Added when the emoji were removed (Task 9) and the theme toggle moved off hand-drawn SVG.
export const IconBag = glyph(ShoppingBag, "IconBag");
export const IconHealth = glyph(Heart, "IconHealth");
export const IconBills = glyph(Receipt, "IconBills");
export const IconCard = glyph(CreditCard, "IconCard");
export const IconBalance = glyph(Scales, "IconBalance");
export const IconLock = glyph(Lock, "IconLock");
export const IconUnlock = glyph(LockOpen, "IconUnlock");
export const IconWarning = glyph(Warning, "IconWarning");
export const IconTip = glyph(Lightbulb, "IconTip");
export const IconStack = glyph(Lightning, "IconStack");
export const IconThemeLight = glyph(Sun, "IconThemeLight");
export const IconThemeDark = glyph(Moon, "IconThemeDark");
export const IconThemeSystem = glyph(Desktop, "IconThemeSystem");

// Added by the 2026-10 catalogue integration (base 278c51c), mapped to Phosphor here.
export const IconGroceries = glyph(Basket, "IconGroceries");
export const IconLightbulb = glyph(Lightbulb, "IconLightbulb");
export const IconCheck = glyph(Check, "IconCheck");
export const IconStar = glyph(Star, "IconStar");
