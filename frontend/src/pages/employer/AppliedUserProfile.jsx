

import axiosInstance from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// ── icon components ───────────────────────────────────────────────────────────
const IconBriefcase = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
    <path d="M20 6h-2.18A3 3 0 0 0 15 4h-6a3 3 0 0 0-2.82 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-11 0a1 1 0 0 1 2 0h-2zm5 0h-1a1 1 0 0 1-2 0h3z" />
  </svg>
);
const IconPerson = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
  </svg>
);
const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

// ── responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ── main component ────────────────────────────────────────────────────────────
export default function AppliedUserProfile() {
  const params = useParams();
  const token = JSON.parse(localStorage.getItem("employer"))?.token;
  const isMobile = useIsMobile();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // inject fonts
    if (!document.getElementById("aup-fonts")) {
      const link = document.createElement("link");
      link.id = "aup-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      // const response = await axiosInstance.get(
      //   `/employers/jobs/${params.jobId}/applicants/${params.studentId}`,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const response = await axios.get(
        `https://jobportal-backend-be9i.onrender.com/api/employers/jobs/${params.jobId}/applicants/${params.studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      
      
      setData(response.data);
      const app = response.data.job.applications.find(
        (a) => a.studentId === params.studentId
      );
      if (app?.status) setStatus(app.status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axiosInstance.patch(
        `/employers/jobs/${params.jobId}/applicants/${params.studentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
       toast.success(
      newStatus === "accepted"
        ? "Application Accepted ✅"
        : "Application Rejected ❌"
    );
    } catch (err) {
      console.log(err);
    }
  };

  const S = {
    body: {
      fontFamily: "'DM Sans', sans-serif",
      background: "#f7f4ef",
      color: "#1a1a2e",
      minHeight: "100vh",
      margin: 0,
    },
    topBanner: {
      background: "#1a1a2e",
      padding: isMobile ? "14px 16px" : "18px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    brand: {
      fontFamily: "'Playfair Display', serif",
      color: "#c9a84c",
      fontSize: isMobile ? "0.95rem" : "1.1rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    breadcrumb: {
      fontSize: "0.75rem",
      color: "rgba(255,255,255,0.4)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    page: {
      maxWidth: "860px",
      margin: "0 auto",
      padding: isMobile ? "24px 14px 60px" : "48px 32px 80px",
    },
    hero: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "flex-end",
      justifyContent: "space-between",
      gap: "14px",
      marginBottom: "32px",
      paddingBottom: "24px",
      borderBottom: "1.5px solid #ede8df",
    },
    heroEyebrow: {
      fontSize: "0.7rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "#c9a84c",
      fontWeight: 500,
      marginBottom: "8px",
    },
    heroName: {
      fontFamily: "'Playfair Display', serif",
      fontSize: isMobile ? "1.9rem" : "2.6rem",
      fontWeight: 700,
      lineHeight: 1.1,
      color: "#1a1a2e",
    },
    heroMeta: {
      fontSize: "0.85rem",
      color: "#7a7570",
      marginTop: "6px",
      wordBreak: "break-all",
    },
    statusBadge: (st) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "7px 16px",
      borderRadius: "999px",
      fontSize: "0.78rem",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      alignSelf: isMobile ? "flex-start" : "auto",
      ...(st === "accepted" && { background: "#d8f3dc", color: "#2d6a4f" }),
      ...(st === "rejected" && { background: "#fde8eb", color: "#9b2335" }),
      ...(!st || st === "pending" ? { background: "#fdf3d0", color: "#5c4a1e" } : {}),
    }),
    statusDot: { width: "7px", height: "7px", borderRadius: "50%", background: "currentColor" },
    section: {
      marginBottom: "20px",
      background: "#fff",
      border: "1px solid #ede8df",
      borderRadius: "3px",
      overflow: "hidden",
    },
    sectionHeader: {
      padding: isMobile ? "12px 16px" : "16px 24px",
      background: "#ede8df",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "1px solid #e0dbd0",
    },
    sectionIcon: {
      width: "28px",
      height: "28px",
      background: "#1a1a2e",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    sectionTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1rem",
      fontWeight: 600,
      color: "#1a1a2e",
    },
    sectionBody: {
      padding: isMobile ? "16px" : "24px",
    },
    jobTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: isMobile ? "1.15rem" : "1.35rem",
      fontWeight: 600,
      marginBottom: "8px",
    },
    jobDesc: {
      fontSize: "0.88rem",
      color: "#7a7570",
      lineHeight: 1.65,
      marginBottom: "16px",
    },
    tagRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "4px",
    },
    tag: {
      background: "#f7f4ef",
      border: "1px solid #d8d3c8",
      borderRadius: "3px",
      padding: "3px 10px",
      fontSize: "0.76rem",
      color: "#1a1a2e",
    },
    tagGold: {
      background: "#e8d5a3",
      border: "1px solid #c9a84c",
      borderRadius: "3px",
      padding: "3px 10px",
      fontSize: "0.76rem",
      color: "#5c4a1e",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "14px" : "20px",
    },
    infoLabel: {
      display: "block",
      fontSize: "0.68rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#7a7570",
      fontWeight: 500,
      marginBottom: "4px",
    },
    infoValue: {
      fontSize: "0.9rem",
      color: "#1a1a2e",
      wordBreak: "break-word",
    },
    infoLink: {
      fontSize: "0.9rem",
      color: "#1a1a2e",
      textDecoration: "none",
      borderBottom: "1px solid #c9a84c",
      wordBreak: "break-all",
    },
    divider: {
      border: "none",
      borderTop: "1px solid #ede8df",
      margin: "20px 0",
    },
    resumeBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      padding: "8px 16px",
      background: "#f7f4ef",
      border: "1px solid #ede8df",
      borderRadius: "2px",
      fontSize: "0.78rem",
      fontWeight: 500,
      color: "#1a1a2e",
      textDecoration: "none",
      cursor: "pointer",
      letterSpacing: "0.04em",
    },
    actionBar: {
      background: "#1a1a2e",
      borderRadius: "3px",
      padding: isMobile ? "20px 16px" : "24px 28px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: "16px",
      marginTop: "12px",
    },
    actionLabel: {
      fontSize: "0.75rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.45)",
      marginBottom: "4px",
    },
    actionTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1.1rem",
      color: "#fff",
    },
    btnRow: {
      display: "flex",
      gap: "10px",
      width: isMobile ? "100%" : "auto",
    },
    btnAccept: {
      flex: isMobile ? 1 : "none",
      padding: "11px 26px",
      border: "none",
      borderRadius: "2px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 500,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      cursor: "pointer",
      background: "#2d6a4f",
      color: "#fff",
    },
    btnReject: {
      flex: isMobile ? 1 : "none",
      padding: "11px 26px",
      borderRadius: "2px",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 500,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      cursor: "pointer",
      background: "transparent",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.25)",
    },
  };

  if (loading)
    return (
      <div style={{ ...S.body, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#7a7570" }}>Loading…</p>
      </div>
    );

  if (!data)
    return (
      <div style={{ ...S.body, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#7a7570" }}>No data found.</p>
      </div>
    );

  const { job, student } = data;
  const app = job.applications.find((a) => a.studentId === student._id);
  const currentStatus = status || "pending";

  return (
    <div style={S.body}>
      {/* TOP BANNER */}


  <Toaster />
  <Navbar />      

      <div style={S.page}>
        {/* HERO */}
        <div style={S.hero}>
          <div>
            <div style={S.heroEyebrow}>Applicant Profile</div>
            <div style={S.heroName}>{student.name}</div>
            <div style={S.heroMeta}>
              {student.email}
              {app &&
                ` · Applied ${new Date(app.appliedAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })}`}
            </div>
          </div>
          <div style={S.statusBadge(currentStatus)}>
            <span style={S.statusDot} />
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </div>
        </div>

        {/* JOB SECTION */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={S.sectionIcon}><IconBriefcase /></div>
            <span style={S.sectionTitle}>Position Applied For</span>
          </div>
          <div style={S.sectionBody}>
            <div style={S.jobTitle}>{job.title}</div>
            <div style={S.jobDesc}>{job.description}</div>
            <div style={{ marginBottom: "16px" }}>
              <span style={S.infoLabel}>Required Education</span>
              <span style={S.infoValue}>{job.requiredEducation}</span>
            </div>
            <span style={S.infoLabel}>Required Skills</span>
            <div style={S.tagRow}>
              {job.requiredSkills.map((skill) => (
                <span key={skill} style={S.tagGold}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* STUDENT SECTION */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={S.sectionIcon}><IconPerson /></div>
            <span style={S.sectionTitle}>Candidate Details</span>
          </div>
          <div style={S.sectionBody}>
            <div style={S.infoGrid}>
              <div>
                <span style={S.infoLabel}>Full Name</span>
                <span style={S.infoValue}>{student.name}</span>
              </div>
              <div>
                <span style={S.infoLabel}>Email Address</span>
                <span style={{ ...S.infoValue, wordBreak: "break-all" }}>{student.email}</span>
              </div>
              <div>
                <span style={S.infoLabel}>Education</span>
                <span style={S.infoValue}>{student.education}</span>
              </div>
            </div>
            <hr style={S.divider} />
            <span style={S.infoLabel}>Skills</span>
            <div style={S.tagRow}>
              {student.skills.map((skill) => (
                <span key={skill} style={S.tag}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* APPLICATION SECTION */}
        {app && (
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <div style={S.sectionIcon}><IconFile /></div>
              <span style={S.sectionTitle}>Application Details</span>
            </div>
            <div style={S.sectionBody}>
              <div style={S.infoGrid}>
                <div>
                  <span style={S.infoLabel}>Phone</span>
                  <span style={S.infoValue}>{app.phone}</span>
                </div>
                <div>
                  <span style={S.infoLabel}>Applied At</span>
                  <span style={S.infoValue}>{new Date(app.appliedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span style={S.infoLabel}>GitHub</span>
                  <a href={app.github} target="_blank" rel="noreferrer" style={S.infoLink}>{app.github}</a>
                </div>
                <div>
                  <span style={S.infoLabel}>LinkedIn</span>
                  <a href={app.linkedin} target="_blank" rel="noreferrer" style={S.infoLink}>{app.linkedin}</a>
                </div>
              </div>
              <hr style={S.divider} />
              <span style={S.infoLabel}>Resume</span>
              <div style={{ marginTop: "6px" }}>
                <a
                  href={`https://jobportal-backend-be9i.onrender.com/${app.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  style={S.resumeBtn}
                >
                  <IconDownload />
                  View Resume PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ACTION BAR */}
        <div style={S.actionBar}>
          <div>
            <div style={S.actionLabel}>Hiring Decision</div>
            <div style={S.actionTitle}>Update application status</div>
          </div>
          <div style={S.btnRow}>
            <button style={S.btnAccept} onClick={() => updateStatus("accepted")}>✓ Accept</button>
            <button style={S.btnReject} onClick={() => updateStatus("rejected")}>✕ Reject</button>
          </div>
        </div>

      </div>
    </div>
  );
}