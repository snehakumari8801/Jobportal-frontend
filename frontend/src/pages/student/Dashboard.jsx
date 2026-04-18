

import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

// ─── JobCard ────────────────────────────────────────────────────
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

  // ✅ find application for logged-in student
  const application = job.applications?.find(
    (app) => app.studentId === studentId
  );

  const applied = !!application;
  const status = application?.status;

  const handleApply = () => {
    if (applied) return;
    onApply();
  };

  const linkStyle = {
    color: "#60a5fa",
    textDecoration: "none",
    fontSize: "13px",
    display: "block",
    marginBottom: "6px",
    wordBreak: "break-all",
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
      {/* Title */}
      <h2 style={{ color: "#f9fafb", marginBottom: "10px" }}>
        {title}
      </h2>

      {/* Description */}
      <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
        {description}
      </p>

      {/* Education */}
      <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
        {education}
      </p>

      {/* Links */}
      <div style={{ marginBottom: "16px" }}>
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
          <a
            href={`http://localhost:5000/${resume}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: "#34d399", fontWeight: "600" }}
          >
            📄 View Resume
          </a>
        )}
      </div>

      {/* Skills */}
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

      {/* Button */}
      <button
        onClick={handleApply}
        disabled={applied}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: applied ? "default" : "pointer",
          background: applied
            ? "#1f2937"
            : "linear-gradient(135deg, #e2b96f, #c9973e)",
          color: applied ? "#4ade80" : "#111827",
        }}
      >
        {applied
          ? status === "pending"
            ? "⏳ Pending"
            : status === "accepted"
            ? "✅ Accepted"
            : "❌ Rejected"
          : "Apply Now"}
      </button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student") || "null");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/students/jobs", {
        headers: { Authorization: `Bearer ${student?.token}` },
      });
      setJobs(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
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
          <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "black" }}>
            Suggested Jobs
          </h1>

          {loading && <p>Loading...</p>}

          {!loading && jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}                     // ✅ pass full job
              studentId={student?._id}     // ✅ pass student id
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