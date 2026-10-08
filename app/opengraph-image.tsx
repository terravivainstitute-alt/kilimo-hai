import { ImageResponse } from "next/og";

export const alt = "Kilimo Hai — Organic Farming Services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#1b3a1e",
          padding: "0 90px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "rgba(47,107,63,0.35)",
            display: "flex",
          }}
        />
        <svg width="360" height="368" viewBox="175 85 250 255" style={{ marginRight: 70 }}>
          <path d="M 185 300 Q 300 255 415 300 L 415 330 Q 300 290 185 330 Z" fill="#8a5a3b" />
          <rect x="294" y="190" width="12" height="115" rx="6" fill="#c7dba3" />
          <path d="M 300 235 C 230 215, 190 150, 215 95 C 280 110, 320 170, 300 235 Z" fill="#74a34f" />
          <path d="M 300 235 C 370 215, 410 150, 385 95 C 320 110, 280 170, 300 235 Z" fill="#c7dba3" />
          <ellipse cx="300" cy="195" rx="20" ry="30" fill="#9ccc65" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, fontWeight: 700, color: "#f6f3ea" }}>Kilimo Hai</div>
          <div style={{ fontSize: 38, color: "#c7dba3", marginTop: 16 }}>
            Ushauri na bidhaa za kilimo hai
          </div>
          <div style={{ fontSize: 30, color: "rgba(199,219,163,0.8)", marginTop: 10 }}>
            Organic farming advice and products
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
