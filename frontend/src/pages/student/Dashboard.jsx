
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
  github,
  linkedin,
  portfolio,
  resume
}) {
  const [hovered, setHovered] = useState(false);

  // ✅ FIX: safe application matching (IMPORTANT)
  const application = job.applications?.find(
    (app) => String(app.studentId) === String(studentId)
  );

  const applied = !!application;
  const status = application?.status;

  const handleApply = () => {
    if (applied) return;
    onApply();
  };

  const getButtonText = () => {
    if (!applied) return "Apply Now";

    if (status === "pending") return "⏳ Pending";
    if (status === "accepted") return "✅ Accepted";
    if (status === "rejected") return "❌ Rejected";

    return "Applied";
  };

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
        padding: "28px 32px",
        marginBottom: "20px",
        transition: "0.3s",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >

      {/* TITLE */}
      <h2 style={{ color: "#f9fafb", marginBottom: "10px" }}>
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
        {description}
      </p>

      {/* EDUCATION */}
      <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
        {education}
      </p>

      {/* LINKS (UNCHANGED) */}
      <div style={{ marginBottom: "16px" }}>
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer">
            🔗 GitHub
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            🔗 LinkedIn
          </a>
        )}
        {portfolio && (
          <a href={portfolio} target="_blank" rel="noopener noreferrer">
            🌐 Portfolio
          </a>
        )}
        {resume && (
          <a
            href={`https://jobportal-backend-be9i.onrender.com/${resume}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#34d399", fontWeight: "600" }}
          >
            📄 View Resume
          </a>
        )}
      </div>

      {/* SKILLS (UNCHANGED) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {skills.map((skill, i) => (
          <span
            key={i}
            style={{
              fontSize: "11px",
              color: "#e2b96f",
              border: "1px solid rgba(226,185,111,0.3)",
              padding: "4px 10px",
              borderRadius: "6px"
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* APPLY BUTTON (ONLY FIXED LOGIC) */}
      <button
        onClick={handleApply}
        disabled={applied}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: applied ? "not-allowed" : "pointer",
          background: applied
            ? "#1f2937"
            : "linear-gradient(135deg, #e2b96f, #c9973e)",
          color: applied ? "#4ade80" : "#111827",
        }}
      >
        {getButtonText()}
      </button>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [defaultJobs, setDefaultJobs] = useState([]);
  const [loading, setLoading] = useState(false);

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