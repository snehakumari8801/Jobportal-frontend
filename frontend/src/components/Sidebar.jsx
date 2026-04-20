
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
   
    {
      to: "/student/dashboard",
      label: "Suggested Jobs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
     {
      to: "/dashboard/allJobs",
      label: "All Jobs",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

      {/* HEADER */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "10px",
        color: "#6b7280",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "0 12px",
        marginBottom: "8px",
      }}>
        Navigation
      </p>

      {/* LINKS */}
      {links.map(({ to, label, icon }, i) => {
        const isActive = location.pathname === to;

        return (
          <Link
            key={to}
            to={to}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",

              /* 🔥 FIX OVERFLOW */
              whiteSpace: "nowrap",
              overflow: "hidden",

              padding: "10px 14px",
              borderRadius: "10px",
              textDecoration: "none",

              background: isActive ? "rgba(226,185,111,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(226,185,111,0.25)" : "transparent"}`,
              color: isActive ? "#e2b96f" : "#6b7280",
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: "18px",
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>

            {/* LABEL (FIX CUT ISSUE) */}
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "500",

                flex: 1,
                minWidth: 0,

                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>

            {/* ACTIVE DOT */}
            {isActive && (
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#e2b96f",
                  flexShrink: 0,
                }}
              />
            )}
          </Link>
        );
      })}

      {/* DIVIDER */}
      <div
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, #e2b96f22, transparent)",
          margin: "12px 0",
        }}
      />

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: "#6b7280",
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* RESPONSIVE STYLE */}
      <style>{`
        .sidebar-desktop {
          display: flex;
        }

        .sidebar-hamburger {
          display: none;
        }

        /* 📱 ONLY MOBILE */
        @media (max-width: 1067px) {
          .sidebar-desktop {
            display: none !important;
          }

          .sidebar-hamburger {
            display: flex;
          }
        }
      `}</style>

      {/* DESKTOP + TABLET SIDEBAR */}
      <aside
        className="sidebar-desktop"
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          height: "calc(100vh - 64px)",

          /* 🔥 FIX WIDTH STABILITY */
          width: "240px",

          background: "#0a0e17",
          borderRight: "1px solid #1f2937",
          padding: "18px 12px",
          overflowY: "auto",
          zIndex: 50,
        }}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE BUTTON */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed",
          top: "14px",
          left: "14px",
          zIndex: 60,
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "20px",
        }}
      >
        ☰
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 70,
          }}
        />
      )}

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",

            /* 🔥 SAFE MOBILE WIDTH */
            width: "80vw",
            maxWidth: "300px",

            background: "#0a0e17",
            borderRight: "1px solid #1f2937",
            padding: "18px 12px",
            zIndex: 80,
            overflowY: "auto",
          }}
        >
          <SidebarContent />
        </aside>
      )}
    </>
  );
}