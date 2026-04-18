

import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function ApplyJob() {
  const { jobId } = useParams();
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    github: "", linkedin: "", portfolio: "",
    coverLetter: "", resume: null,
  });

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
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      await axiosInstance.post(`/students/apply/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${student?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Application sent successfully!");
      setForm({ name: "", email: "", phone: "", github: "", linkedin: "", portfolio: "", coverLetter: "", resume: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.85); } }
        * { box-sizing: border-box; }
        .aj-input { background:#0d1117; border:1px solid #2d3748; border-radius:8px; padding:9px 13px; font-size:14px; color:#f9fafb; font-family:'DM Sans',sans-serif; outline:none; width:100%; transition:border-color .2s; }
        .aj-input:focus { border-color:rgba(226,185,111,.5); box-shadow:0 0 0 3px rgba(226,185,111,.08); }
        .aj-input::placeholder { color:#4b5563; }
        .aj-file-zone { background:#0d1117; border:1px dashed #374151; border-radius:8px; padding:22px; text-align:center; cursor:pointer; transition:border-color .2s; }
        .aj-file-zone:hover { border-color:rgba(226,185,111,.4); }
      `}</style>

      <Toaster position="top-right" toastOptions={{
        style: { background:"#1f2937", color:"#f9fafb", border:"1px solid #374151", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", borderRadius:"10px" }
      }} />

      <div style={{ minHeight:"100vh",  backgroundImage:"radial-gradient(ellipse at 20% 10%, rgba(226,185,111,0.04) 0%, transparent 50%)" }}>
        <Navbar />
        <Sidebar />

        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"48px 24px 80px", fontFamily:"'DM Sans',sans-serif" }}>

          {/* Header */}
          <div style={{ marginBottom:"36px", animation:"fadeSlideIn .6s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#e2b96f", display:"inline-block", animation:"pulse-dot 2s ease-in-out infinite", boxShadow:"0 0 0 3px rgba(226,185,111,.15)" }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", color:"#6b7280", letterSpacing:".14em", textTransform:"uppercase" }}>
                Application form
              </span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,42px)", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.1,  }}>
              Apply for this position
            </h1>
            <p style={{ fontSize:"14px", color:"#6b7280", marginTop:"8px", fontWeight:300 }}>
              Fill in your details — we'll review your application shortly
            </p>
          </div>

          {/* Gold divider */}
          <div style={{ height:"1px", background:"linear-gradient(90deg,rgba(226,185,111,.2),#2d3748,transparent)", marginBottom:"32px" }} />

          {/* Card */}
          <div style={{ background:"linear-gradient(135deg,#111827 0%,#1f2937 100%)", border:"1px solid #2d3748", borderRadius:"16px", padding:"28px 32px", animation:"fadeSlideIn .5s ease both" }}>

            {/* Personal info */}
            <SectionLabel>Personal info</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="Full name"><input className="aj-input" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" /></Field>
              <Field label="Email"><input className="aj-input" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" /></Field>
            </div>
            <Field label="Phone"><input className="aj-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" /></Field>

            <InnerDivider />

            {/* Online presence */}
            <SectionLabel>Online presence</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="GitHub"><input className="aj-input" name="github" value={form.github} onChange={handleChange} placeholder="github.com/username" /></Field>
              <Field label="LinkedIn"><input className="aj-input" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/username" /></Field>
            </div>
            <Field label="Portfolio"><input className="aj-input" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="yoursite.com" /></Field>

            <InnerDivider />

            {/* Cover letter */}
            <SectionLabel>Cover letter</SectionLabel>
            <Field label="Why are you a great fit?">
              <textarea
                className="aj-input"
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you're a great fit for this role…"
                style={{ minHeight:"100px", resize:"vertical", lineHeight:1.6 }}
              />
            </Field>

            <InnerDivider />

            {/* Resume */}
            <SectionLabel>Resume</SectionLabel>
            <label className="aj-file-zone">
              <div style={{ fontSize:"24px", marginBottom:"6px" }}>📄</div>
              <div style={{ fontSize:"13px", color:"#6b7280" }}>
                <span style={{ color:"#e2b96f" }}>Click to upload</span> or drag and drop
              </div>
              <div style={{ fontSize:"13px", color:"#4b5563", marginTop:"3px" }}>PDF, DOC — max 5 MB</div>
              {form.resume && (
                <div style={{ fontSize:"13px", color:"#4ade80", marginTop:"8px", fontWeight:500 }}>
                  {form.resume.name}
                </div>
              )}
              <input type="file" name="resume" onChange={handleChange} accept=".pdf,.doc,.docx" style={{ display:"none" }} />
            </label>

            {/* Footer */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"24px", flexWrap:"wrap", gap:"12px" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", color:"#374151", letterSpacing:".08em", textTransform:"uppercase" }}>
                — secure submission
              </span>
              <div style={{ display:"flex", gap:"8px" }}>
                <button style={{ background:"transparent", border:"1px solid #374151", borderRadius:"8px", padding:"9px 22px", fontSize:"13px", fontWeight:500, color:"#9ca3af", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  Save draft
                </button>
                <button
                  onClick={handleApply}
                  style={{ background:"linear-gradient(135deg,#e2b96f,#c9973e)", border:"none", borderRadius:"8px", padding:"9px 24px", fontSize:"13px", fontWeight:500, color:"#111827", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
                >
                  Apply now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", color:"#6b7280", letterSpacing:".14em", textTransform:"uppercase", marginBottom:"14px" }}>
      {children}
    </p>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"5px", marginBottom:"14px" }}>
      <label style={{ fontSize:"12px", color:"#9ca3af", fontFamily:"'DM Sans',sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

function InnerDivider() {
  return <hr style={{ border:"none", borderTop:"1px solid #1f2937", margin:"20px 0" }} />;
}