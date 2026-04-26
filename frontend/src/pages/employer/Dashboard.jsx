import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

/* ─────────────────────────────────────────────
   GLOBAL RESPONSIVE STYLES
───────────────────────────────────────────── */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; }

  .emp-dashboard {
    // background: #0d1117;
    min-height: 100vh;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  /* ── Main layout: offset content away from sidebar ── */
  .emp-main {
    margin-left: 0;
    min-height: 100vh;
    transition: margin-left 0.3s;
  }

  /* Match your Sidebar's actual width at desktop */
  @media (min-width: 768px) {
    .emp-main { margin-left: 260px; }
  }

  /* ── Page content wrapper ── */
  .emp-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px 60px;
    width: 100%;
  }
  @media (min-width: 480px) { .emp-page { padding: 24px 24px 60px; } }
  @media (min-width: 768px) { .emp-page { padding: 32px 32px 60px; } }

  /* ── Page header ── */
  .emp-header { margin-bottom: 24px; }
  .emp-header h1 {
    margin: 0;
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 700;
  }
  .emp-header p { margin: 4px 0 0; font-size: 13px; color: #6b7280; }

  /* ── Job list ── */
  .emp-job-list { display: flex; flex-direction: column; gap: 14px; width: 100%; }

  /* ── Job card ── */
  .emp-card {
    background: #13192b;
    border: 1px solid #1f2937;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    transition: border-color 0.2s;
  }
  .emp-card:hover { border-color: #374151; }

  .emp-card-title {
    margin: 0 0 8px;
    font-size: clamp(14px, 3vw, 16px);
    font-weight: 700;
    color: #f9fafb;
    line-height: 1.4;
  }

  /* ── Badge row ── */
  .badge-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-loc   { background: #1f2937; color: #9ca3af; border: 1px solid #374151; }
  .badge-type  { background: rgba(226,185,111,0.15); color: #c99a50; border: 1px solid rgba(226,185,111,0.35); }
  .badge-mode  { background: rgba(52,211,153,0.1);   color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
  .badge-sal   { background: rgba(168,85,247,0.1);   color: #c084fc; border: 1px solid rgba(168,85,247,0.25); }
  .badge-skill { background: rgba(59,130,246,0.1);   color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
  .badge-edu   { background: rgba(52,211,153,0.1);   color: #34d399; border: 1px solid rgba(52,211,153,0.25); }

  /* ── Button grid ── */
  .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; }

  .btn-base {
    border-radius: 9px;
    padding: 10px 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    width: 100%;
    transition: opacity 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-gold { background: #e2b96f; color: #0d1117; }
  .btn-gold:hover { opacity: 0.82; }

  .btn-danger {
    grid-column: 1 / -1;
    background: rgba(239,68,68,0.1);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 9px;
    padding: 10px 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }

  /* ── Description ── */
  .emp-desc { margin: 0; font-size: 13px; color: #6b7280; line-height: 1.7; word-break: break-word; }

  .emp-divider { height: 1px; background: #1f2937; flex-shrink: 0; }

  /* ── Info grid ── */
  .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
  .info-section { display: flex; flex-direction: column; gap: 5px; }
  .meta-label {
    font-size: 10px; font-weight: 700; color: #4b5563;
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  /* ── Card footer ── */
  .card-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; }
  .date-text  { font-size: 11px; color: #4b5563; }
  .count-pill { font-size: 11px; padding: 3px 9px; border-radius: 20px; background: #1f2937; color: #9ca3af; border: 1px solid #374151; }

  /* ── Empty state ── */
  .emp-empty {
    text-align: center; padding: 64px 20px; background: #13192b;
    border-radius: 14px; border: 1px solid #1f2937; color: #4b5563; font-size: 14px;
  }

  /* ── Skeleton ── */
  .skeleton-card {
    background: #13192b; border: 1px solid #1f2937;
    border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
  }
  .skeleton-line {
    background: linear-gradient(90deg, #1f2937 25%, #263044 50%, #1f2937 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000; padding: 12px;
  }
  .modal-box {
    background: #13192b; width: 100%; max-width: 600px;
    max-height: 88vh; overflow-y: auto; border-radius: 16px;
    border: 1px solid #1f2937; color: white;
  }
  .modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 20px; border-bottom: 1px solid #1f2937;
    position: sticky; top: 0; background: #13192b; z-index: 1;
    border-radius: 16px 16px 0 0; gap: 12px;
  }
  .modal-header h2 { margin: 0; font-size: clamp(14px, 3vw, 16px); font-weight: 600; color: #f9fafb; }
  .modal-header p  { margin: 2px 0 0; font-size: 12px; color: #6b7280; }

  .modal-close-btn {
    background: #1f2937; border: none; border-radius: 8px; color: #9ca3af;
    cursor: pointer; min-width: 32px; height: 32px; font-size: 16px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .modal-close-btn:hover { background: #374151; }

  .modal-body { padding: 16px 20px 24px; }

  /* ── Applicant row ── */
  .applicant-list { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
  .applicant-row {
    background: #1a2235; border: 1px solid #1f2937; border-radius: 12px;
    padding: 12px 14px; display: flex; align-items: center;
    justify-content: space-between; gap: 10px; flex-wrap: wrap;
  }
  .applicant-info { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .avatar {
    width: 38px; height: 38px; min-width: 38px; border-radius: 50%;
    background: rgba(226,185,111,0.12); border: 1px solid rgba(226,185,111,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #e2b96f;
  }
  .applicant-name  { margin: 0; font-size: 14px; font-weight: 600; color: #f3f4f6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .applicant-email { margin: 2px 0 0; font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .view-link {
    background: rgba(226,185,111,0.1); border: 1px solid rgba(226,185,111,0.25);
    color: #e2b96f; padding: 6px 14px; border-radius: 8px; font-size: 12px;
    font-weight: 600; text-decoration: none; white-space: nowrap;
    flex-shrink: 0; transition: background 0.2s;
  }
  .view-link:hover { background: rgba(226,185,111,0.2); }

  a.btn-link { text-decoration: none; display: block; width: 100%; }
`;

function InjectStyles() {
  useEffect(() => {
    const existing = document.getElementById("emp-dash-styles");
    if (existing) existing.remove();
    const style = document.createElement("style");
    style.id = "emp-dash-styles";
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return null;
}

/* ─────────────────────────────────────────────
   APPLICANTS MODAL
───────────────────────────────────────────── */
function ApplicantsModal({ applicants, onClose, jobId }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Applicants</h2>
            <p>{applicants.length} {applicants.length === 1 ? "person" : "people"} applied</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {applicants.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#4b5563", fontSize: "14px" }}>
              No applicants yet
            </div>
          ) : (
            <div className="applicant-list">
              {applicants.map((a) => (
                <div key={a._id} className="applicant-row">
                  <div className="applicant-info">
                    <div className="avatar">{a.name?.charAt(0).toUpperCase() || "?"}</div>
                    <div style={{ minWidth: 0 }}>
                      <p className="applicant-name">{a.name}</p>
                      <p className="applicant-email">{a.email}</p>
                    </div>
                  </div>
                  <Link to={`/employer/dashboard/${jobId}/${a.studentId}`} className="view-link">
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

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const parseEducation = (str) => {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
};

/* ─────────────────────────────────────────────
   JOB CARD
───────────────────────────────────────────── */
function JobCard({ job, onViewApplicants, onDelete }) {
  const skills = job.requiredSkills || [];
  const educations = parseEducation(job.requiredEducation);
  const applicantCount = job.applicants?.length ?? 0;

  return (
    <div className="emp-card">
      <div>
        <h3 className="emp-card-title">{job.title}</h3>
        <div className="badge-row">
          {job.location && <span className="badge badge-loc">📍 {job.location}</span>}
          {job.jobType && <span className="badge badge-type">{job.jobType}</span>}
          {job.workMode && <span className="badge badge-mode">{job.workMode}</span>}
          {job.salary && <span className="badge badge-sal">💰 {job.salary}</span>}
        </div>
      </div>

      <div className="btn-grid">
        <Link to={`/employer/applications/${job._id}`} className="btn-link">
          <button className="btn-base btn-gold">Recommendation</button>
        </Link>
        <button className="btn-base btn-gold" onClick={() => onViewApplicants(job)}>
          View Applicants
        </button>
        <button className="btn-danger" onClick={() => onDelete(job._id)}>
          Delete
        </button>
      </div>

      {job.description && <p className="emp-desc">{job.description}</p>}

      <div className="emp-divider" />

      <div className="info-grid">
        {skills.length > 0 && (
          <div className="info-section">
            <span className="meta-label">Required Skills</span>
            <div className="badge-row">
              {skills.map((s) => <span key={s} className="badge badge-skill">{s}</span>)}
            </div>
          </div>
        )}
        {educations.length > 0 && (
          <div className="info-section">
            <span className="meta-label">Education</span>
            <div className="badge-row">
              {educations.map((e) => <span key={e} className="badge badge-edu">{e}</span>)}
            </div>
          </div>
        )}
      </div>

      <div className="emp-divider" />

      <div className="card-footer">
        <span className="date-text">Posted {formatDate(job.createdAt)}</span>
        <span className="count-pill">{applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {[["45%", "16px"], ["80%", "12px"], ["65%", "12px"]].map(([w, h], i) => (
        <div key={i} className="skeleton-line" style={{ height: h, width: w }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const getToken = () => JSON.parse(localStorage.getItem("employer"))?.token;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/employers/jobs/mine", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (job) => {
    try {
      const res = await axiosInstance.get(`/employers/jobs/${job._id}/applicants`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSelectedJob({ jobId: job._id, applicants: res.data });
    } catch {
      toast.error("Failed to load applicants");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/employers/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <>
      <InjectStyles />
      <div className="emp-dashboard">
        <Toaster position="top-right" />
        <Navbar />
        <Sidebar />

        <div className="emp-main">
          <div className="emp-page">
            <div className="emp-header">
              <h1>Employer Dashboard</h1>
              <p>{loading ? "Loading jobs…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} posted`}</p>
            </div>

            <div className="emp-job-list">
              {loading ? (
                [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              ) : jobs.length === 0 ? (
                <div className="emp-empty">No jobs posted yet</div>
              ) : (
                jobs.map((job) => (
                  <JobCard key={job._id} job={job} onViewApplicants={fetchApplicants} onDelete={deleteJob} />
                ))
              )}
            </div>
          </div>
        </div>

        {selectedJob && (
          <ApplicantsModal
            jobId={selectedJob.jobId}
            applicants={selectedJob.applicants}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </>
  );
}
