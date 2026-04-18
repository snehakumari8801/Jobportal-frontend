import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleApply = async (jobId) => {
    navigate(`/student/dashboard/apply/${jobId}`);

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
        padding: "26px 30px",
        marginBottom: "18px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 60px rgba(226,185,111,0.1), 0 4px 24px rgba(0,0,0,0.4)"
          : "0 2px 12px rgba(0,0,0,0.3)",
        animation: `fadeSlideIn 0.5s ease both`,
        animationDelay: `${index * 0.1}s`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent top line */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: hovered ? "100%" : "0%", height: "2px",
        background: "linear-gradient(90deg, #e2b96f, #f6d89f)",
        transition: "width 0.4s ease",
      }} />

      {/* Index badge */}
      <div style={{
        position: "absolute", top: "20px", right: "24px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px", color: "#4b5563",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        #{String(index + 1).padStart(2, "0")}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "21px", fontWeight: "700",
        color: "#f9fafb", marginBottom: "8px",
        letterSpacing: "-0.01em", lineHeight: 1.3,
        paddingRight: "48px",
      }}>{job.title}</h2>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "14px", color: "#9ca3af",
        lineHeight: 1.7, marginBottom: "16px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{job.description}</p>

      {/* Skills */}
      {job.requiredSkills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "20px" }}>
          {job.requiredSkills.map((skill, i) => (
            <span key={i} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px", color: "#e2b96f",
              background: "rgba(226,185,111,0.08)",
              border: "1px solid rgba(226,185,111,0.2)",
              borderRadius: "6px", padding: "3px 9px",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>{skill}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
        paddingTop: "16px", borderTop: "1px solid #1f2937",
      }}>
        {/* Education */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "8px",
            background: "rgba(99,102,241,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px",
          }}>🎓</div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px", color: "#6b7280",
          }}>{job.requiredEducation}</span>
        </div>

        {/* Apply Button */}
        <button
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px", fontWeight: "600",
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "9px 20px", borderRadius: "8px",
            border: "1px solid rgba(226,185,111,0.3)",
            background: "rgba(226,185,111,0.07)",
            color: "#e2b96f", cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(226,185,111,0.15)";
            e.currentTarget.style.borderColor = "#e2b96f";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(226,185,111,0.07)";
            e.currentTarget.style.borderColor = "rgba(226,185,111,0.3)";
          }}
          onClick={()=>handleApply(job._id)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("student"))?.token;

  async function getAllJob() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/jobs/allJob", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getAllJob(); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "white",
        backgroundImage: `
          radial-gradient(ellipse at 15% 15%, rgba(226,185,111,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 85%, rgba(99,102,241,0.04) 0%, transparent 50%)
        `,
      }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937", color: "#f9fafb",
              border: "1px solid #374151",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", borderRadius: "10px",
            },
          }}
        />

        <Navbar />
        <Sidebar/>

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Header */}
          <div style={{ marginBottom: "48px", animation: "fadeSlideIn 0.6s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#4ade80", display: "inline-block",
                animation: "pulse-dot 2s ease-in-out infinite",
                boxShadow: "0 0 0 3px rgba(74,222,128,0.15)",
              }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "11px", color: "#6b7280",
                letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                {jobs.length} open position{jobs.length !== 1 ? "s" : ""}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 5vw, 50px)",
              fontWeight: "800",
             
            }}>
              All Jobs
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px", color: "#6b7280",
              marginTop: "10px", fontWeight: "300",
            }}>
              Browse open positions and find your next opportunity
            </p>
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, #e2b96f33, #2d3748, transparent)",
            marginBottom: "36px",
          }} />

          {/* Shimmer Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  height: "190px", borderRadius: "16px",
                  background: "linear-gradient(90deg, #1f2937 25%, #2d3748 50%, #1f2937 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && jobs.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 0",
              animation: "fadeSlideIn 0.5s ease both",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px", color: "#d1d5db", marginBottom: "8px",
              }}>No jobs available</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px", color: "#6b7280",
              }}>Check back soon for new openings</p>
            </div>
          )}

          {/* Job Cards */}
          {!loading && jobs.map((job, index) => (
            <JobCard key={job._id} job={job} index={index} />
          ))}

          {!loading && jobs.length > 0 && (
            <p style={{
              textAlign: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px", color: "#374151",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginTop: "40px",
            }}>
              — End of listings —
            </p>
          )}
        </div>
      </div>
    </>
  );
}