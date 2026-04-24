
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function ApplyJob() {
  const { jobId } = useParams();
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    resume: null,
    resumeUrl: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/students/profile", {
          headers: {
            Authorization: `Bearer ${student?.token}`,
          },
        });

        const data = res.data;
        console.log(data)

        setForm((prev) => ({
          ...prev,
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          github: data?.github || "",
          linkedin: data?.linkedin || "",
          portfolio: data?.portfolio || "",
          resumeUrl: data?.resume || "",
          coverLetter: data?.coverLetter || ""
        }));
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    if (student?.token) fetchProfile();
  }, [student?.token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "resume" ? files[0] : value,
    }));
  };

  const handleApply = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("github", form.github);
      formData.append("linkedin", form.linkedin);
      formData.append("portfolio", form.portfolio);
      formData.append("coverLetter", form.coverLetter);

      if (form.resume) {
        formData.append("resume", form.resume);
      }

      await axiosInstance.post(`/students/apply/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${student?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Application sent successfully!");

      setForm((prev) => ({
        ...prev,
        coverLetter: "",
        resume: null,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <>
      {/* 🔥 ORIGINAL THEME STYLE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');

        * { box-sizing: border-box; }

        body {
          background: #0d1117;
          font-family: 'DM Sans', sans-serif;
          color: #f9fafb;
        }

        .aj-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #2d3748;
          background: rgba(255,255,255,0.03);
          color: #f3f4f6;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }

        .aj-input:focus {
          border-color: rgba(226,185,111,0.5);
          box-shadow: 0 0 0 3px rgba(226,185,111,0.08);
        }

        .aj-file-zone {
          border: 1px dashed #374151;
          border-radius: 12px;
          padding: 22px;
          text-align: center;
          cursor: pointer;
          margin-top: 10px;
          background: rgba(255,255,255,0.02);
          transition: 0.2s;
        }

        .aj-file-zone:hover {
          border-color: #e2b96f;
        }

        button {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #e2b96f, #c9973e);
          color: #111827;
          transition: 0.2s;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(226,185,111,0.25);
        }

        label {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 6px;
          display: block;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .section {
          margin-bottom: 18px;
        }

        .card {
          background: linear-gradient(160deg, #1a1f2e, #131720);
          border: 1px solid #2d3748;
          border-radius: 18px;
          padding: 28px;
        }
      `}</style>

      <Toaster />

      <div style={{ minHeight: "100vh", background: "#0d1117" }}>
        <Navbar />
        <Sidebar />

        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px" }}>
          <div className="card">

            <div className="section">
              <Field label="Full name">
                <input className="aj-input" name="name" value={form.name} onChange={handleChange} />
              </Field>
            </div>

            <Field label="Email">
              <input className="aj-input" name="email" value={form.email} onChange={handleChange} />
            </Field>

            <Field label="Phone">
              <input className="aj-input" name="phone" value={form.phone} onChange={handleChange} />
            </Field>

            <Field label="GitHub">
              <input className="aj-input" name="github" value={form.github} onChange={handleChange} />
            </Field>

            <Field label="LinkedIn">
              <input className="aj-input" name="linkedin" value={form.linkedin} onChange={handleChange} />
            </Field>

            <Field label="Portfolio">
              <input className="aj-input" name="portfolio" value={form.portfolio} onChange={handleChange} />
            </Field>

            <Field label="Cover Letter">
              <textarea className="aj-input" name="coverLetter" value={form.coverLetter} onChange={handleChange} />
            </Field>

            <label className="aj-file-zone">
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
              />

              <div>📄 Upload Resume</div>

              {form.resumeUrl && !form.resume && (
                <div style={{ color: "#4ade80", marginTop: "6px" }}>
                  Current Resume: {form.resumeUrl.split("/").pop()}
                </div>
              )}

              {form.resume && (
                <div style={{ color: "#e2b96f", marginTop: "6px" }}>
                  New: {form.resume.name}
                </div>
              )}
            </label>

            <button onClick={handleApply}>
              Apply now
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label>{label}</label>
      {children}
    </div>
  );
}