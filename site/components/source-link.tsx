import type { Source } from "@/lib/types";
import { formatDate, hostOf } from "@/lib/utils";

export function SourceLink({ source, prefix = "Source" }: { source?: Source | null; prefix?: string }) {
  if (!source?.url) return null;
  return (
    <div className="text-xs text-slate-500 mt-2">
      {prefix}:{" "}
      <a href={source.url} target="_blank" rel="noreferrer">
        {hostOf(source.url)}
      </a>{" "}
      · retrieved {formatDate(source.retrieved_on)}
    </div>
  );
}
