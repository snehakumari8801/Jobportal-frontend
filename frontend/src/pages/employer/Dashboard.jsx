
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom"
import Sidebar from "../../components/Sidebar";

// ─────────────────────────────────────────────
// APPLICANTS MODAL
// ─────────────────────────────────────────────
function ApplicantsModal({ applicants, onClose, jobId }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "10px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13192b",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: "16px",
          border: "1px solid #1f2937",
          color: "white",
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid #1f2937",
          position: "sticky",
          top: 0,
          background: "#13192b",
          zIndex: 1,
          borderRadius: "16px 16px 0 0",
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#f9fafb" }}>
              Applicants
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b7280" }}>
              {applicants.length} {applicants.length === 1 ? "person" : "people"} applied
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#9ca3af",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            x
          </button>
        </div>

        {/* Applicants Body */}
        <div style={{ padding: "16px 20px 24px" }}>
          {applicants.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#4b5563" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>No applicants yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              {applicants.map((a) => (
                <div
                  key={a._id}
                  style={{
                    background: "#1a2235",
                    border: "1px solid #1f2937",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Avatar + Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "rgba(226,185,111,0.12)",
                      border: "1px solid rgba(226,185,111,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#e2b96f",
                      flexShrink: 0,
                    }}>
                      {a.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#f3f4f6",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {a.name}
                      </p>
                      <p style={{
                        margin: "2px 0 0",
                        fontSize: "12px",
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {a.email}
                      </p>
                    </div>
                  </div>

                  {/* View Link */}

                  <Link to={`/employer/dashboard/${jobId}/${a.studentId}`}
                    style={{
                      background: "rgba(226,185,111,0.1)",
                      border: "1px solid rgba(226,185,111,0.25)",
                      color: "#e2b96f",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    View Application
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// JOB CARD
// ─────────────────────────────────────────────
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

function JobCard({ job, onViewApplicants, onDelete }) {
  const skills = job.requiredSkills || [];
  const educations = parseEducation(job.requiredEducation);
  const applicantCount = job.applicants?.length ?? 0;

  return (
    <div style={cardStyle}>

      {/* ── Title + badges ── */}
      <div>
        <h3 style={titleStyle}>{job.title}</h3>
        <div style={badgeRow}>
          {job.location && <span style={{ ...badge, ...locBadge }}>📍 {job.location}</span>}
          {job.jobType && <span style={{ ...badge, ...typeBadge }}>{job.jobType}</span>}
          {job.workMode && <span style={{ ...badge, ...modeBadge }}>{job.workMode}</span>}
          {job.salary && <span style={{ ...badge, ...salaryBadge }}>💰 {job.salary}</span>}
        </div>
      </div>

      {/* ── Buttons: 2-col grid, Delete spans full width ── */}
      <div style={btnGrid}>
        <Link to={`/employer/applications/${job._id}`} style={{ textDecoration: "none" }}>
          <button style={{ ...goldBtn, width: "100%" }}
            onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
            Recommendation 
          </button>
        </Link>
        <button style={goldBtn}
          onClick={() => onViewApplicants(job)}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          View Applicants
        </button>
        <button style={dangerBtn}
          onClick={() => onDelete(job._id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
          }}>
          Delete
        </button>
      </div>

      {/* ── Description ── */}
      {job.description && <p style={descStyle}>{job.description}</p>}

      <div style={divider} />

      {/* ── Skills + Education ── */}
      <div style={infoGrid}>
        {skills.length > 0 && (
          <div style={section}>
            <span style={metaLabel}>Required Skills</span>
            <div style={badgeRow}>
              {skills.map((s) => (
                <span key={s} style={{ ...badge, ...skillBadge }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {educations.length > 0 && (
          <div style={section}>
            <span style={metaLabel}>Education</span>
            <div style={badgeRow}>
              {educations.map((e) => (
                <span key={e} style={{ ...badge, ...eduBadge }}>{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={divider} />

      {/* ── Footer ── */}
      <div style={footer}>
        <span style={dateText}>Posted {formatDate(job.createdAt)}</span>
        <span style={countPill}>
          {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
        </span>
      </div>
    </div>
  );
}


/* ─── Styles ─── */
const cardStyle = {
  background: "#13192b",
  border: "1px solid #1f2937",
  borderRadius: "14px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "85%",
  transition: "border-color 0.2s",
  marginTop:"30px"
};

const titleStyle = {
  margin: "0 0 6px",
  fontSize: "15px",
  fontWeight: 700,
  color: "#f9fafb",
  lineHeight: 1.4,
};

const badgeRow = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  alignItems: "center",
};

const btnGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "7px",
  width: "90%",
};

const baseBtn = {
  borderRadius: "9px",
  padding: "10px 8px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
  border: "none",
  width: "100%",
  transition: "opacity 0.2s",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const goldBtn = { ...baseBtn, background: "#e2b96f", color: "#0d1117" };
const dangerBtn = {
  ...baseBtn,
  gridColumn: "1 / -1",
  background: "rgba(239,68,68,0.1)",
  color: "#f87171",
  border: "1px solid rgba(239,68,68,0.25)",
};

const hoverIn = (e) => (e.currentTarget.style.opacity = "0.8");
const hoverOut = (e) => (e.currentTarget.style.opacity = "1");

const descStyle = {
  margin: 0,
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: 1.7,
};

const divider = { height: "1px", background: "#1f2937" };

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "10px",
};

const section = { display: "flex", flexDirection: "column", gap: "5px" };

const metaLabel = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#4b5563",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const badge = {
  display: "inline-flex",
  alignItems: "center",
  padding: "3px 9px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: 600,
};

const locBadge = { background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" };
const typeBadge = { background: "rgba(226,185,111,0.15)", color: "#c99a50", border: "1px solid rgba(226,185,111,0.35)" };
const modeBadge = { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };
const salaryBadge = { background: "rgba(168,85,247,0.1)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" };
const skillBadge = { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" };
const eduBadge = { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };

const footer = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" };
const dateText = { fontSize: "11px", color: "#4b5563" };
const countPill = { fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" };

// ─────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: "#13192b",
      border: "1px solid #1f2937",
      borderRadius: "14px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}>
      {[["45%", "16px"], ["80%", "12px"], ["65%", "12px"]].map(([w, h], i) => (
        <div key={i} style={{
          height: h,
          width: w,
          background: "#1f2937",
          borderRadius: "6px",
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const getToken = () =>
    JSON.parse(localStorage.getItem("employer"))?.token;

  // ── FETCH JOBS ──
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/employers/jobs/mine", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // ── FETCH APPLICANTS ──
  const fetchApplicants = async (job) => {
    try {
      const res = await axiosInstance.get(
        `/employers/jobs/${job._id}/applicants`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setSelectedJob({
        jobId: job._id,
        applicants: res.data,
      });
    } catch (err) {
      toast.error("Failed to load applicants");
    }
  };

  // ── DELETE JOB ──
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/employers/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Toaster position="top-right" />
      <Navbar />
      <Sidebar />

      <div style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "28px 16px 48px",
      }}>

        {/* Page Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, }}>
            Employer Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#4b5563" }}>
            {loading ? "Loading jobs..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} posted`}
          </p>
        </div>

        {/* Job List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {loading ? (
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : jobs.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "64px 20px",
              background: "#13192b",
              borderRadius: "14px",
              border: "1px solid #1f2937",
              color: "#4b5563",
              fontSize: "14px",
            }}>
              No jobs posted yet
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewApplicants={fetchApplicants}
                onDelete={deleteJob}
              />
            ))
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {selectedJob && (
        <ApplicantsModal
          jobId={selectedJob.jobId}
          applicants={selectedJob.applicants}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}