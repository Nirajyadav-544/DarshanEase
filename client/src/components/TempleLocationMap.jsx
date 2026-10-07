import React from "react";

export default function TempleLocationMap({ name, location }) {
  const cleanName = String(name || "Kashi Vishwanath Temple")
    .replace(/[^a-zA-Z0-9\s,]/g, "")
    .trim();

  const cleanLoc = String(location || "Varanasi").trim();

  const searchAddress = `${cleanName}, ${cleanLoc}`;

  // Google Maps Embed URL
  const realMapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    searchAddress
  )}&output=embed`;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f3f4f6",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          🗺️ Temple Location
        </h3>

        <span
          style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          LIVE
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "350px",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <iframe
          title="Temple Location"
          src={realMapEmbedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          color: "#666",
          fontSize: "13px",
        }}
      >
        📍 {searchAddress}
      </p>
    </div>
  );
}