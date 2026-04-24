
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const INITIAL_STATE = {
  title: "",
  location: "",
  description: "",
  requiredSkills: "",
  requiredEducation: "",
  salary: "",
  jobType: "",
  workMode: "",
};

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"];
const WORK_MODES = ["Remote", "On-Site", "Hybrid"];

export default function PostJob() {
  const [job, setJob] = useState(INITIAL_STATE);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const prev = document.body.style.cssText;
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)";
    document.body.style.minHeight = "100vh";

    const styleTag = document.createElement("style");
    styleTag.id = "postjob-styles";
    styleTag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      #postjob-page ::placeholder { color: #475569 !important; opacity: 1; }
      #postjob-page input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 100px #1e1b3a inset !important;
        -webkit-text-fill-color: #f1f5f9 !important;
      }
      .job-type-btn {
        flex: 1;
        padding: 9px 6px;
        background: rgba(255,255,255,0.05);
        border: 1.5px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s;
        font-family: 'Syne', 'DM Sans', sans-serif;
        text-align: center;
        white-space: nowrap;
      }
      .job-type-btn:hover {
        border-color: rgba(108,99,255,0.5);
        color: #c4b5fd;
        background: rgba(108,99,255,0.08);
      }
      .job-type-btn.active {
        background: rgba(108,99,255,0.18);
        border-color: rgba(108,99,255,0.85);
        color: #a78bfa;
      }
      .job-type-btn.error {
        border-color: rgba(248,113,113,0.7);
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.body.style.cssText = prev;
      document.getElementById("postjob-styles")?.remove();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!job.title.trim()) newErrors.title = "Job title is required";
    if (!job.location.trim()) newErrors.location = "Location is required";
    if (!job.salary.trim()) newErrors.salary = "Salary is required";
    if (!job.jobType) newErrors.jobType = "Please select a job type";
    if (!job.workMode) newErrors.workMode = "Please select a work mode";
    if (!job.description.trim()) newErrors.description = "Job description is required";
    if (!job.requiredSkills.trim()) newErrors.requiredSkills = "At least one skill is required";
    if (!job.requiredEducation.trim()) newErrors.requiredEducation = "Required education is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("employer"))?.token;
      const skillsArray = job.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await axiosInstance.post(
        "/jobs/createJob",
        {
          title: job.title,
          location: job.location,
          description: job.description,
          requiredEducation: job.requiredEducation,
          requiredSkills: skillsArray,
          salary: job.salary,
          jobType: job.jobType,
          workMode: job.workMode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Job posted successfully!");
      setJob(INITIAL_STATE);
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    background: focusedField === name ? "rgba(108,99,255,0.1)" : errors[name] ? "rgba(248,113,113,0.05)" : "rgba(255,255,255,0.05)",
    border: `1.5px solid ${errors[name] ? "rgba(248,113,113,0.7)" : focusedField === name ? "rgba(108,99,255,0.8)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#f1f5f9",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "'Syne', 'DM Sans', sans-serif",
    display: "block",
  });

  const textareaStyle = (name) => ({
    ...inputStyle(name),
    resize: "vertical",
    minHeight: "120px",
    lineHeight: "1.6",
  });

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "7px",
  };

  const errorMsg = (field) =>
    errors[field] ? (
      <span style={{ fontSize: "11px", color: "#f87171", marginTop: "5px", display: "block" }}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Toaster position="top-right" />
      <Navbar />
      <Sidebar/>

      <div
        id="postjob-page"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 16px 40px",
          fontFamily: "'Syne', 'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "20px",
            padding: "40px 36px",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <p style={{
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#6c63ff",
            marginBottom: "6px",
            marginTop: 0,
          }}>
            Employer Portal
          </p>
          <h2 style={{
            fontSize: "26px",
            fontWeight: 500,
            margin: "0 0 28px 0",
            background: "linear-gradient(90deg, #fff 55%, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Post a New Job
          </h2>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Job Title */}
            <div>
              <label style={labelStyle}>Job Title *</label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                style={inputStyle("title")}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
              />
              {errorMsg("title")}
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location *</label>
              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                placeholder="e.g. Riga, Latvia"
                style={inputStyle("location")}
                onFocus={() => setFocusedField("location")}
                onBlur={() => setFocusedField(null)}
              />
              {errorMsg("location")}
            </div>

            {/* Salary */}
            <div>
              <label style={labelStyle}>Salary *</label>
              <input
                type="text"
                name="salary"
                value={job.salary}
                onChange={handleChange}
                placeholder="e.g. $60k–$80k / year"
                style={inputStyle("salary")}
                onFocus={() => setFocusedField("salary")}
                onBlur={() => setFocusedField(null)}
              />
              {errorMsg("salary")}
            </div>

            {/* Job Type */}
            <div>
              <label style={labelStyle}>Job Type *</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`job-type-btn${job.jobType === type ? " active" : ""}${errors.jobType && !job.jobType ? " error" : ""}`}
                    onClick={() => {
                      setJob((prev) => ({ ...prev, jobType: prev.jobType === type ? "" : type }));
                      setErrors((prev) => ({ ...prev, jobType: "" }));
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errorMsg("jobType")}
            </div>

            {/* Work Mode */}
            <div>
              <label style={labelStyle}>Work Mode *</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {WORK_MODES.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`job-type-btn${job.workMode === mode ? " active" : ""}${errors.workMode && !job.workMode ? " error" : ""}`}
                    onClick={() => {
                      setJob((prev) => ({ ...prev, workMode: prev.workMode === mode ? "" : mode }));
                      setErrors((prev) => ({ ...prev, workMode: "" }));
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {errorMsg("workMode")}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Job Description *</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and expectations..."
                style={textareaStyle("description")}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
              />
              {errorMsg("description")}
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>Required Skills *</label>
              <input
                type="text"
                name="requiredSkills"
                value={job.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                style={inputStyle("requiredSkills")}
                onFocus={() => setFocusedField("requiredSkills")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.requiredSkills
                ? errorMsg("requiredSkills")
                : <span style={{ fontSize: "11px", color: "#475569", marginTop: "5px", display: "block" }}>Separate multiple skills with commas</span>
              }
            </div>

            {/* Education */}
            <div>
              <label style={labelStyle}>Required Education *</label>
              <input
                type="text"
                name="requiredEducation"
                value={job.requiredEducation}
                onChange={handleChange}
                placeholder="e.g. BSc Computer Science"
                style={inputStyle("requiredEducation")}
                onFocus={() => setFocusedField("requiredEducation")}
                onBlur={() => setFocusedField(null)}
              />
              {errorMsg("requiredEducation")}
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                background: "linear-gradient(135deg, #6c63ff, #3ecfff)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.3px",
                boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "inherit",
                marginTop: "4px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(108,99,255,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(108,99,255,0.4)";
              }}
            >
              Post Job
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}