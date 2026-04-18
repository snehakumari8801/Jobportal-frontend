

import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";

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

                  <a href={`/employer/dashboard/${jobId}/${a.studentId}`}
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
                  </a>
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
function JobCard({ job, onViewApplicants, onDelete }) {
  return (
    <div
      style={{
        background: "#13192b",
        border: "1px solid #1f2937",
        borderRadius: "14px",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#374151"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1f2937"}
    >
      {/* Title + Buttons Row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        <h3 style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: 700,
          color: "#f9fafb",
        }}>
          {job.title}
        </h3>

        {/* Button group */}
        <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
          <button
            onClick={() => onViewApplicants(job)}
            style={{
              background: "#e2b96f",
              color: "#0d1117",
              border: "none",
              borderRadius: "9px",
              padding: "12px 16px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            View Applicants
          </button>

          <button
            onClick={() => onDelete(job._id)}
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "9px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      <p style={{
        margin: 0,
        fontSize: "13px",
        color: "#6b7280",
        lineHeight: "1.6",
      }}>
        {job.description}
      </p>
    </div>
  );
}

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