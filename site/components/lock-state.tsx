import { IconLock, IconUnlock } from "@/components/icons";

/** Lock/unlock glyph plus a visually hidden state word (the icon is aria-hidden). */
export function LockState({ unlocked }: { unlocked: boolean }) {
  const Icon = unlocked ? IconUnlock : IconLock;
  return (
    <>
      <Icon className="mr-1 inline align-[-0.125em]" />
      <span className="sr-only">{unlocked ? "Unlocked" : "Locked"}</span>
    </>
  );
}
