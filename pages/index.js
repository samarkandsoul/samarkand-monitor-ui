// pages/index.js
import React from "react";

export async function getServerSideProps() {
  let monitorData = null;
  let error = null;

  try {
    const res = await fetch("https://samarkand-monitor.onrender.com", {
      method: "GET",
    });
    monitorData = await res.json();
  } catch (e) {
    error = "Monitor backend-ə qoşulmaq alınmadı";
  }

  return {
    props: {
      monitorData,
      error,
    },
  };
}

export default function Home({ monitorData, error }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#050816",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        Samarkand Soul – Monitor Panel
      </h1>
      <p style={{ opacity: 0.7, marginBottom: "24px" }}>
        Sistem ürək döyüntüləri (heartbeat) statusu
      </p>

      <section
        style={{
          borderRadius: "16px",
          padding: "20px",
          background: "#0b1020",
          border: "1px solid #262c4a",
          maxWidth: "480px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
          🧠 Monitor Service
        </h2>

        {error && (
          <p style={{ color: "#ff6b6b" }}>
            ❌ {error}
          </p>
        )}

        {monitorData && (
          <div>
            <p>
              <strong>Status:</strong>{" "}
              {monitorData.status === "alive" ? "✅ Alive" : monitorData.status}
            </p>
            <p>
              <strong>Service:</strong> {monitorData.service}
            </p>
            <p>
              <strong>Message:</strong> {monitorData.message}
            </p>
          </div>
        )}

        {!error && !monitorData && (
          <p>Yüklənir...</p>
        )}
      </section>
    </main>
  );
}
