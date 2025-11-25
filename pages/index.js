// pages/index.js
import React from "react";

const API_BASE = "https://samarkand-monitor.onrender.com";

async function safeFetchJson(url) {
  try {
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getServerSideProps() {
  const [core, agents] = await Promise.all([
    safeFetchJson(`${API_BASE}/health/core`),
    safeFetchJson(`${API_BASE}/health/agents`),
  ]);

  return {
    props: {
      core,
      agents,
    },
  };
}

function StatusPill({ value }) {
  let label = value;
  if (value === "alive") label = "✅ Alive";
  if (value === "degraded") label = "⚠️ Degraded";
  if (value === "down") label = "🔥 Down";

  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: "999px",
        background: "#111827",
        border: "1px solid #374151",
        fontSize: "13px",
      }}
    >
      {label}
    </span>
  );
}

export default function Home({ core, agents }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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

      <div
        style={{
          display: "grid",
          gap: "16px",
          maxWidth: "900px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {/* 🧠 Monitor service */}
        <section
          style={{
            borderRadius: "16px",
            padding: "20px",
            background: "#0b1020",
            border: "1px solid #262c4a",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🧠 Monitor Service
          </h2>

          {!core && <p>Yüklənir və ya backend cavab vermədi...</p>}

          {core && (
            <div style={{ display: "grid", gap: "6px", fontSize: "14px" }}>
              <div>
                <strong>Status:</strong>{" "}
                <StatusPill value={core.status || "unknown"} />
              </div>
              <div>
                <strong>Service:</strong> {core.service}
              </div>
              <div>
                <strong>Message:</strong> {core.message}
              </div>
            </div>
          )}
        </section>

        {/* 🤖 Brat agent backend */}
        <section
          style={{
            borderRadius: "16px",
            padding: "20px",
            background: "#0b1020",
            border: "1px solid #262c4a",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            🤖 Brat Agent Backend
          </h2>

          {!agents && <p>Yüklənir və ya backend cavab vermədi...</p>}

          {agents && (
            <div style={{ display: "grid", gap: "6px", fontSize: "14px" }}>
              <div>
                <strong>Overall:</strong>{" "}
                <StatusPill value={agents.status || "unknown"} />
              </div>
              <div>
                <strong>Service:</strong> {agents.service}
              </div>

              {agents.brat_agent_backend && (
                <>
                  <div>
                    <strong>Agent status:</strong>{" "}
                    <StatusPill
                      value={agents.brat_agent_backend.status || "unknown"}
                    />
                  </div>
                  <div>
                    <strong>HTTP code:</strong>{" "}
                    {agents.brat_agent_backend.http_status ?? "—"}
                  </div>
                  {agents.brat_agent_backend.error && (
                    <div style={{ color: "#f97373" }}>
                      <strong>Error:</strong>{" "}
                      {agents.brat_agent_backend.error}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
        }
