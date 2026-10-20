import { ImageResponse } from "next/og";
import { getIndex } from "@/lib/data";

// Default share image (Open Graph / Twitter card), rendered once at build time
// and served as a static PNG at /og.png. A route handler rather than the
// `opengraph-image` file convention, because file-based images override the
// per-card `image_path` art that card pages set in generateMetadata.
export const dynamic = "force-static";

export function GET() {
  const n = getIndex().counts.cards_total;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #eef4ff 100%)",
          color: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#1d4ed8" }}>
          Credit Cards · India
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            Compare Indian credit cards
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#334155" }}>
            Fees, rewards and benefits — every value linked to its source.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#475569" }}>
          {`${n} cards · open dataset · calculator & recommender`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
