
import axiosInstance from "../../api/axiosInstance";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const styles = {
  // GLOBAL
  body: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#f7f4ef",
    color: "#1a1a2e",
    minHeight: "100vh",
  },

  // TOP BANNER
  topBanner: {
    background: "#1a1a2e",
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: "'Playfair Display', serif",
    color: "#c9a84c",
    fontSize: "1.1rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  breadcrumb: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  // PAGE
  page: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "48px 32px 80px",
  },

  // HERO
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "end",
    marginBottom: "44px",
    paddingBottom: "28px",
    borderBottom: "1.5px solid #ede8df",
    gap: "16px",
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
    fontSize: "2.6rem",
    fontWeight: 700,
    lineHeight: 1.1,
    color: "#1a1a2e",
  },
  heroMeta: {
    fontSize: "0.85rem",
    color: "#7a7570",
    marginTop: "6px",
  },

  // STATUS BADGE
  statusBadge: (status) => ({
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
    ...(status === "accepted" && { background: "#d8f3dc", color: "#2d6a4f" }),
    ...(status === "rejected" && { background: "#fde8eb", color: "#9b2335" }),
    ...(!status || status === "pending" ? { background: "#fdf3d0", color: "#5c4a1e" } : {}),
  }),
  statusDot: (status) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "currentColor",
  }),

  // SECTION CARD
  section: {
    marginBottom: "28px",
    background: "#fff",
    border: "1px solid #ede8df",
    borderRadius: "3px",
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "16px 24px",
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
    letterSpacing: "0.02em",
    color: "#1a1a2e",
  },
  sectionBody: {
    padding: "24px",
  },

  // JOB
  jobTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.35rem",
    fontWeight: 600,
    marginBottom: "8px",
  },
  jobDesc: {
    fontSize: "0.88rem",
    color: "#7a7570",
    lineHeight: 1.65,
    marginBottom: "16px",
  },

  // TAGS
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
    letterSpacing: "0.02em",
  },
  tagGold: {
    background: "#e8d5a3",
    border: "1px solid #c9a84c",
    borderRadius: "3px",
    padding: "3px 10px",
    fontSize: "0.76rem",
    color: "#5c4a1e",
    letterSpacing: "0.02em",
  },

  // INFO GRID
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
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
  },
  infoLink: {
    fontSize: "0.9rem",
    color: "#1a1a2e",
    textDecoration: "none",
    borderBottom: "1px solid #c9a84c",
  },

  // DIVIDER
  divider: {
    border: "none",
    borderTop: "1px solid #ede8df",
    margin: "20px 0",
  },

  // RESUME BUTTON
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

  // ACTION BAR
  actionBar: {
    background: "#1a1a2e",
    borderRadius: "3px",
    padding: "24px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
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
  },
  btnAccept: {
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

// ── tiny icon components ──────────────────────────────────────────────────────
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
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

// ── main component ────────────────────────────────────────────────────────────
export default function AppliedUserProfile() {
  const params = useParams();
  const token = JSON.parse(localStorage.getItem("employer"))?.token;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // ── fetch ──
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/employers/jobs/${params.jobId}/applicants/${params.studentId}`,
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

  useEffect(() => {
    fetchDetails();
  }, []);

  // ── update status ──
  const updateStatus = async (newStatus) => {
    try {
      await axiosInstance.patch(
        `/employers/jobs/${params.jobId}/applicants/${params.studentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div style={{ ...styles.body, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#7a7570", fontFamily: "'DM Sans', sans-serif" }}>Loading…</p>
      </div>
    );

  if (!data)
    return (
      <div style={{ ...styles.body, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p style={{ color: "#7a7570", fontFamily: "'DM Sans', sans-serif" }}>No data found.</p>
      </div>
    );

  const { job, student } = data;
  const app = job.applications.find((a) => a.studentId === student._id);
  const currentStatus = status || "pending";

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div style={styles.body}>
        {/* TOP BANNER */}
        <div style={styles.topBanner}>
          <span style={styles.brand}>TalentDesk</span>
          <span style={styles.breadcrumb}>Applicant Review</span>
        </div>

        <div style={styles.page}>
          {/* HERO */}
          <div style={styles.hero}>
            <div>
              <div style={styles.heroEyebrow}>Applicant Profile</div>
              <div style={styles.heroName}>{student.name}</div>
              <div style={styles.heroMeta}>
                {student.email}
                {app && ` · Applied ${new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
              </div>
            </div>
            <div style={styles.statusBadge(currentStatus)}>
              <span style={styles.statusDot(currentStatus)} />
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </div>
          </div>

          {/* JOB SECTION */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}><IconBriefcase /></div>
              <span style={styles.sectionTitle}>Position Applied For</span>
            </div>
            <div style={styles.sectionBody}>
              <div style={styles.jobTitle}>{job.title}</div>
              <div style={styles.jobDesc}>{job.description}</div>

              <div style={{ marginBottom: "16px" }}>
                <span style={styles.infoLabel}>Required Education</span>
                <span style={styles.infoValue}>{job.requiredEducation}</span>
              </div>

              <span style={styles.infoLabel}>Required Skills</span>
              <div style={styles.tagRow}>
                {job.requiredSkills.map((skill) => (
                  <span key={skill} style={styles.tagGold}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* STUDENT SECTION */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}><IconPerson /></div>
              <span style={styles.sectionTitle}>Candidate Details</span>
            </div>
            <div style={styles.sectionBody}>
              <div style={styles.infoGrid}>
                <div>
                  <span style={styles.infoLabel}>Full Name</span>
                  <span style={styles.infoValue}>{student.name}</span>
                </div>
                <div>
                  <span style={styles.infoLabel}>Email Address</span>
                  <span style={styles.infoValue}>{student.email}</span>
                </div>
                <div>
                  <span style={styles.infoLabel}>Education</span>
                  <span style={styles.infoValue}>{student.education}</span>
                </div>
              </div>

              <hr style={styles.divider} />

              <span style={styles.infoLabel}>Skills</span>
              <div style={styles.tagRow}>
                {student.skills.map((skill) => (
                  <span key={skill} style={styles.tag}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* APPLICATION SECTION */}
          {app && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionIcon}><IconFile /></div>
                <span style={styles.sectionTitle}>Application Details</span>
              </div>
              <div style={styles.sectionBody}>
                <div style={styles.infoGrid}>
                  <div>
                    <span style={styles.infoLabel}>Phone</span>
                    <span style={styles.infoValue}>{app.phone}</span>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Applied At</span>
                    <span style={styles.infoValue}>
                      {new Date(app.appliedAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>GitHub</span>
                    <a href={app.github} target="_blank" rel="noreferrer" style={styles.infoLink}>
                      {app.github}
                    </a>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>LinkedIn</span>
                    <a href={app.linkedin} target="_blank" rel="noreferrer" style={styles.infoLink}>
                      {app.linkedin}
                    </a>
                  </div>
                </div>

                <hr style={styles.divider} />

                <span style={styles.infoLabel}>Resume</span>
                <div style={{ marginTop: "6px" }}>
                  <a
                    href={`https://jobportal-backend-be9i.onrender.com/${app.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.resumeBtn}
                  >
                    <IconDownload />
                    View Resume PDF
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BAR */}
          <div style={styles.actionBar}>
            <div>
              <div style={styles.actionLabel}>Hiring Decision</div>
              <div style={styles.actionTitle}>Update application status</div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btnAccept} onClick={() => updateStatus("accepted")}>
                ✓ Accept
              </button>
              <button style={styles.btnReject} onClick={() => updateStatus("rejected")}>
                ✕ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}