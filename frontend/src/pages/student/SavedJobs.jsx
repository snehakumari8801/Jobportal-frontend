

import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function SavedJobs() {
  const student = JSON.parse(localStorage.getItem("student"));
  const token = student?.token;

  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/save/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs(response.data.savedJobs || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    const d = Math.floor(diff / 86400);
    const h = Math.floor(diff / 3600);
    const m = Math.floor(diff / 60);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return "Just now";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const parseEducation = (str) => {
    if (!str) return [];
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const handleApply = (jobId) => navigate(`/student/dashboard/apply/${jobId}`);

  const handleUnsave = async (jobId) => {
    try {
      await axiosInstance.post(`/jobs/save/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs((prev) => prev.filter((job) => job.jobId?._id !== jobId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 16px", width: "100%", boxSizing: "border-box" }}>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#f9fafb", marginBottom: "6px" }}>
          Saved Jobs
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "24px" }}>
          {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
        </p>

        {savedJobs.length === 0 ? (
          <div style={{
            background: "#13192b",
            border: "1px solid #1f2937",
            borderRadius: "14px",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔖</div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>No saved jobs yet</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {savedJobs.map((job) => {
              if (!job.jobId) return null;
              const j = job.jobId;
              const educations = parseEducation(j.requiredEducation);

              return (
                <SavedJobCard
                  key={job._id}
                  j={j}
                  timeAgo={timeAgo}
                  formatDate={formatDate}
                  educations={educations}
                  onApply={() => handleApply(j._id)}
                  onUnsave={() => handleUnsave(j._id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Individual Card ─── */
function SavedJobCard({ j, timeAgo, formatDate, educations, onApply, onUnsave }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"
          : "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        border: `1px solid ${hovered ? "#e2b96f" : "#2d3748"}`,
        borderRadius: "14px",
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "0.3s",
        transform: hovered ? "translateY(-2px)" : "none",
        width: "100%",
        boxSizing: "border-box",
      }}
    >

      {/* ── Title + time ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f9fafb", margin: 0, lineHeight: 1.3, flex: 1 }}>
          {j.title}
        </h3>
        <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", paddingTop: "2px" }}>
          {timeAgo(j.createdAt)}
        </span>
      </div>

      {/* ── Meta badges ── */}
      {(j.location || j.jobType || j.workMode || j.salary) && (
        <div style={badgeRow}>
          {j.location && <span style={{ ...badge, ...locBadge }}>📍 {j.location}</span>}
          {j.jobType && <span style={{ ...badge, ...typeBadge }}>{j.jobType}</span>}
          {j.workMode && <span style={{ ...badge, ...modeBadge }}>{j.workMode}</span>}
          {j.salary && <span style={{ ...badge, ...salBadge }}>💰 {j.salary}</span>}
        </div>
      )}

      {/* ── Description ── */}
      {j.description && (
        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.7 }}>
          {j.description}
        </p>
      )}

      <div style={divider} />

      {/* ── Skills + Education ── */}
      <div style={infoGrid}>
        {j.requiredSkills?.length > 0 && (
          <div style={section}>
            <span style={metaLabel}>Required Skills</span>
            <div style={badgeRow}>
              {j.requiredSkills.map((s, i) => (
                <span key={i} style={{ ...badge, ...skillBadge }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {educations.length > 0 && (
          <div style={section}>
            <span style={metaLabel}>Education</span>
            <div style={badgeRow}>
              {educations.map((e, i) => (
                <span key={i} style={{ ...badge, ...eduBadge }}>{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={divider} />

      {/* ── Footer: posted date + applicant count ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ fontSize: "11px", color: "#4b5563" }}>
          Posted {formatDate(j.createdAt)}
        </span>
        {j.applicants?.length >= 0 && (
          <span style={countPill}>
            {j.applicants.length} {j.applicants.length === 1 ? "applicant" : "applicants"}
          </span>
        )}
      </div>

      {/* ── Buttons: 2-col grid ── */}
      <div style={btnGrid}>
        <button
          onClick={onApply}
          style={{ ...applyBtn }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Apply Now
        </button>
        <button
          onClick={onUnsave}
          style={{ ...unsaveBtn }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
          }}
        >
          🔖 Unsave
        </button>
      </div>

    </div>
  );
}

/* ─── Styles ─── */
const badgeRow = { display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" };
const divider = { height: "1px", background: "#1f2937" };
const infoGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" };
const section = { display: "flex", flexDirection: "column", gap: "5px" };
const metaLabel = { fontSize: "10px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.07em" };

const badge = { display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 };
const locBadge = { background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" };
const typeBadge = { background: "rgba(226,185,111,0.12)", color: "#c99a50", border: "1px solid rgba(226,185,111,0.3)" };
const modeBadge = { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };
const salBadge = { background: "rgba(168,85,247,0.1)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" };
const skillBadge = { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" };
const eduBadge = { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };

const countPill = { fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" };

const btnGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%" };
const baseBtn = { borderRadius: "9px", padding: "10px 8px", fontSize: "13px", fontWeight: 700, border: "none", width: "100%", cursor: "pointer", transition: "opacity 0.2s" };
const applyBtn = { ...baseBtn, background: "linear-gradient(135deg, #e2b96f, #c9973e)", color: "#0d1117" };
const unsaveBtn = { ...baseBtn, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)", transition: "all 0.2s" };