

import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";

const s = {
  page: {
    minHeight: "100vh",
    background: "#f5f4f0",
    padding: "2rem 1rem",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "480px",
    overflow: "hidden",
  },
  banner: { height: "80px", background: "#e2b96f", position: "relative" },
  avatar: {
    width: "64px", height: "64px", borderRadius: "50%",
    background: "#fff", border: "3px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px", fontWeight: 500, color: "#854F0B",
    position: "absolute", bottom: "-28px", left: "1.5rem",
  },
  body: { padding: "2.5rem 1.5rem 1.5rem" },
  name: { fontSize: "18px", fontWeight: 500, margin: "0 0 2px" },
  sub: { fontSize: "13px", color: "#888", margin: "0 0 1.5rem" },
  divider: { border: "none", borderTop: "0.5px solid #eee", margin: "1.25rem 0" },
  sectionLabel: {
    fontSize: "11px", fontWeight: 500,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: "#999", marginBottom: "10px",
  },
  field: { display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" },
  label: { fontSize: "13px", color: "#666" },
  input: {
    background: "#f9f9f9", border: "0.5px solid #e0e0e0",
    borderRadius: "8px", padding: "8px 12px",
    fontSize: "14px", fontFamily: "inherit",
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  skillsWrap: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" },
  skill: {
    background: "#FAEEDA", color: "#633806",
    fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
  },
  footer: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.25rem", flexWrap: "wrap", gap: "10px",
  },
  btn: {
    border: "0.5px solid #ccc", borderRadius: "8px",
    padding: "8px 20px", fontSize: "14px",
    fontWeight: 500, cursor: "pointer", background: "#fff",
  },
  btnPrimary: {
    background: "#e2b96f", border: "0.5px solid #c9a05a",
    borderRadius: "8px", padding: "8px 20px",
    fontSize: "14px", fontWeight: 500,
    color: "#412402", cursor: "pointer",
  },
};

function getInitials(name) {
  return name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "", education: "", skills: "", experience: "", role: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/students/profile", {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("student")).token}` },
      });
      setProfile({ ...res.data, skills: res.data.skills.join(", ") });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = e =>
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        "/students/profile",
        { ...profile, skills: profile.skills.split(",").map(s => s.trim()) },
        { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("student")).token}` } }
      );
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const skillTags = profile.skills.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <>
      <Navbar />
      <Toaster />
      <div style={s.page}>
        <form onSubmit={handleSubmit} style={s.card}>

          {/* Amber banner + avatar */}
          <div style={s.banner}>
            <div style={s.avatar}>{getInitials(profile.name)}</div>
          </div>

          <div style={s.body}>
            <p style={s.name}>{profile.name || "Your name"}</p>
            <p style={s.sub}>Student profile</p>

            {/* Basic info */}
            <div style={s.sectionLabel}>Basic info</div>
            <div style={s.field}>
              <label style={s.label}>Full name</label>
              <input name="name" value={profile.name} onChange={handleChange}
                placeholder="Jane Smith" style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Education</label>
              <input name="education" value={profile.education} onChange={handleChange}
                placeholder="B.Tech Computer Science, 2025" style={s.input} />
            </div>

            <hr style={s.divider} />

            {/* Skills */}
            <div style={s.sectionLabel}>Skills</div>
            <div style={s.field}>
              <label style={s.label}>Skills (comma separated)</label>
              <input name="skills" value={profile.skills} onChange={handleChange}
                placeholder="React, Node.js, MongoDB" style={s.input} />
            </div>
            {skillTags.length > 0 && (
              <div style={s.skillsWrap}>
                {skillTags.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
              </div>
            )}

            <hr style={s.divider} />

            {/* Experience */}
            <div style={s.sectionLabel}>Experience</div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Years of experience</label>
                <input type="number" name="experience" value={profile.experience}
                  onChange={handleChange} placeholder="2" min="0" style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Current role</label>
                <input name="role" value={profile.role || ""} onChange={handleChange}
                  placeholder="e.g. Intern" style={s.input} />
              </div>
            </div>

            {/* Footer */}
            <div style={s.footer}>
              <span style={{ fontSize: "12px", color: "#bbb" }}>
                Changes are saved to your account
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" style={s.btn} onClick={fetchProfile}>Discard</button>
                <button type="submit" style={s.btnPrimary}>Save changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}