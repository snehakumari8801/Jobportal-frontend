
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Search from "../student/Search";

// ─── JobCard ─────────────────────────────
function JobCard({
  job,
  studentId,
  title,
  jobId,
  description,
  education,
  skills = [],
  onApply,
  saveHandler,
  isSaved,
  github,
  linkedin,
  portfolio,
  resume
}) {
  const [hovered, setHovered] = useState(false);

  const application = job.applications?.find(
    (app) => String(app.studentId) === String(studentId)
  );
  const applied = !!application;
  const status = application?.status;

  const handleApply = () => { if (applied) return; onApply(); };

  const getButtonText = () => {
    if (!applied) return "Apply Now";
    if (status === "pending")  return "⏳ Pending";
    if (status === "accepted") return "✅ Accepted";
    if (status === "rejected") return "❌ Rejected";
    return "Applied";
  };

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

  const parseEducation = (str) => {
    if (!str) return [];
    return str.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const educations = parseEducation(education);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"
          : "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        border: `1px solid ${hovered ? "#e2b96f" : "#2d3748"}`,
        borderRadius: "16px",
        padding: "20px 18px",
        transition: "0.3s",
        transform: hovered ? "translateY(-3px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
        marginTop:"30px"
      }}
    >

      {/* ── Title + time ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f9fafb", margin: 0, lineHeight: 1.3 }}>
          {title}
        </h3>
        <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", paddingTop: "3px" }}>
          {timeAgo(job.createdAt)}
        </span>
      </div>

      {/* ── Meta badges: location, jobType, workMode, salary ── */}
      {(job.location || job.jobType || job.workMode || job.salary) && (
        <div style={badgeRow}>
          {job.location && <span style={{ ...badge, ...locBadge  }}>📍 {job.location}</span>}
          {job.jobType  && <span style={{ ...badge, ...typeBadge }}>      {job.jobType}</span>}
          {job.workMode && <span style={{ ...badge, ...modeBadge }}>{job.workMode}</span>}
          {job.salary   && <span style={{ ...badge, ...salBadge  }}>💰 {job.salary}</span>}
        </div>
      )}

      {/* ── Description ── */}
      {description && (
        <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af", lineHeight: 1.7 }}>
          {description}
        </p>
      )}

      <div style={divider} />

      {/* ── Skills + Education row ── */}
      <div style={infoGrid}>
        {skills.length > 0 && (
          <div style={section}>
            <span style={metaLabel}>Required Skills</span>
            <div style={badgeRow}>
              {skills.map((s, i) => (
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

      {/* ── Links ── */}
      {(github || linkedin || portfolio || resume) && (
        <>
          <div style={divider} />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                🔗 GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                🔗 LinkedIn
              </a>
            )}
            {portfolio && (
              <a href={portfolio} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                🌐 Portfolio
              </a>
            )}
            {resume && (
              
            <a    href={`https://jobportal-backend-12-vt48.onrender.com/${resume}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, color: "#34d399" }}
              >
                📄 Resume
              </a>
            )}
          </div>
        </>
      )}

      <div style={divider} />

      {/* ── Footer: posted date + applicant count ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ fontSize: "11px", color: "#4b5563" }}>
          Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        {job.applicants?.length >= 0 && (
          <span style={countPill}>
            {job.applicants.length} {job.applicants.length === 1 ? "applicant" : "applicants"}
          </span>
        )}
      </div>

      {/* ── Buttons: 2-col grid, save spans full ── */}
      <div style={btnGrid}>
        <button
          onClick={handleApply}
          disabled={applied}
          style={{
            ...baseBtn,
            background: applied ? "#1f2937" : "linear-gradient(135deg, #e2b96f, #c9973e)",
            color: applied ? "#4ade80" : "#111827",
            cursor: applied ? "not-allowed" : "pointer",
          }}
        >
          {getButtonText()}
        </button>

        <button
          onClick={saveHandler}
          style={{
            ...baseBtn,
            background: isSaved ? "rgba(226,185,111,0.15)" : "#1f2937",
            color: isSaved ? "#e2b96f" : "#9ca3af",
            border: isSaved ? "1px solid rgba(226,185,111,0.4)" : "1px solid #374151",
            cursor: "pointer",
          }}
        >
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}


/* ─── Styles ─── */
const badgeRow   = { display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" };
const divider    = { height: "1px", background: "#1f2937" };
const infoGrid   = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" };
const section    = { display: "flex", flexDirection: "column", gap: "5px" };
const metaLabel  = { fontSize: "10px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.07em" };

const badge      = { display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 };
const locBadge   = { background: "#1f2937",                color: "#9ca3af", border: "1px solid #374151" };
const typeBadge  = { background: "rgba(226,185,111,0.12)", color: "#c99a50", border: "1px solid rgba(226,185,111,0.3)" };
const modeBadge  = { background: "rgba(52,211,153,0.1)",   color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };
const salBadge   = { background: "rgba(168,85,247,0.1)",   color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" };
const skillBadge = { background: "rgba(59,130,246,0.1)",   color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" };
const eduBadge   = { background: "rgba(52,211,153,0.1)",   color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" };

const linkStyle  = { fontSize: "12px", color: "#60a5fa", textDecoration: "none", fontWeight: 600 };
const countPill  = { fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151" };

const btnGrid    = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", width: "100%" };
const baseBtn    = { borderRadius: "9px", padding: "10px 8px", fontSize: "13px", fontWeight: 700, border: "none", width: "100%", transition: "opacity 0.2s" };

// ─── Dashboard ─────────────────────────────
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [defaultJobs, setDefaultJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student") || "null");

  // ✅ FIX: prevent crash
  if (!student) {
    return <h2>Please login</h2>;
  }

  // ─── Fetch default jobs ─────────────────
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/students/jobs", {
        headers: {
          Authorization: `Bearer ${student.token}`
        }
      });

      setJobs(res.data || []);
      setDefaultJobs(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // ─── Search handler ─────────────────
  const handleSearch = async (filters) => {
    try {
      // reset case
      if (!filters || Object.keys(filters).length === 0) {
        setJobs(defaultJobs);
        return;
      }

      setLoading(true);

      const query = new URLSearchParams(filters).toString();

      const res = await axiosInstance.get(
        `/jobs/search?${query}`,
        {
          headers: {
            Authorization: `Bearer ${student.token}`
          }
        }
      );

      setJobs(res.data?.jobs || []);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId) => {
    navigate(`/student/dashboard/apply/${jobId}`);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const saveHandler = async (jobId) => {
    try {
      const response = await axiosInstance.post(
        `/jobs/save/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${student?.token}`
          }
        }
      );

      const isSaved = response.data?.saved;

      if (isSaved) {
        // ✅ add
        setSavedJobs((prev) => [...prev, jobId]);
      } else {
        // ✅ remove
        setSavedJobs((prev) => prev.filter(id => id !== jobId));
      }

    } catch (error) {
      console.log(error);
    }
  };




  return (
    <>
      <Toaster />

      <div style={{ minHeight: "100vh", background: "white" }}>
        <Navbar />
        <Sidebar />

        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 24px" }}>

          {/* SEARCH (unchanged UI) */}
          <Search onSearch={handleSearch} />

          <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "black" }}>
            Suggested Jobs
          </h1>

          {loading && <p>Loading...</p>}

          {!loading && Array.isArray(jobs) && jobs.length === 0 && (
            <p>No jobs found</p>
          )}

          {!loading &&
            Array.isArray(jobs) &&
            jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                studentId={student?._id}
                jobId={job._id}
                title={job.title}
                description={job.description}
                skills={job.requiredSkills}
                education={job.requiredEducation}
                onApply={() => handleApply(job._id)}
                saveHandler={() => saveHandler(job._id)}
                isSaved={savedJobs.includes(job._id)}
                github={job.github}
                linkedin={job.linkedin}
                portfolio={job.portfolio}
                resume={job.resume}
              />
            ))}
        </div>
      </div>
    </>
  );
}