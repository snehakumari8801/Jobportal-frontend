
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

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
  banner: { height: "80px", background: "rgb(17, 24, 39)", position: "relative" },
  avatar: {
    width: "64px", height: "64px", borderRadius: "50%",
    background: "#fff", border: "3px solid #fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px", fontWeight: 500, color: "#854F0B",
    position: "absolute", bottom: "-28px", left: "1.5rem",
    overflow: "hidden"
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
    name: "", education: "", skills: "", experience: "",
    role: "", github: "", portfolio: "", linkedin: "",
    company: "", position: "", degreeStart: "", degreeEnd: "",
    projects: "", dob: "", location: "", coverLetter: "",
    resume: null, profileImage: null
  });

  // ✅ Track new file uploads separately from existing URLs
  const [newResume, setNewResume] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/students/profile", {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("student")).token}` },
      });
      setProfile({
        ...res.data,
        skills: res.data.skills?.join(", ") || "",
      });
      // Clear new file selections on fetch
      setNewResume(null);
      setNewProfileImage(null);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = e =>
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = e => {
    const { name, files } = e.target;
    if (!files[0]) return;
    if (name === "resume") setNewResume(files[0]);
    if (name === "profileImage") setNewProfileImage(files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // ✅ Append text fields only
      const textFields = [
        "name", "education", "experience", "role", "github",
        "portfolio", "linkedin", "company", "position",
        "degreeStart", "degreeEnd", "projects", "dob",
        "location", "coverLetter"
      ];

      textFields.forEach(key => {
        if (profile[key] !== null && profile[key] !== undefined) {
          formData.append(key, profile[key]);
        }
      });

      // ✅ Skills as JSON array
      formData.append(
        "skills",
        JSON.stringify(profile.skills.split(",").map(s => s.trim()).filter(Boolean))
      );

      // ✅ Only append files if new ones were selected
      if (newResume) formData.append("resume", newResume);
      if (newProfileImage) formData.append("profileImage", newProfileImage);

      console.log(formData)

      await axiosInstance.put("/students/profile", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("student")).token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Profile updated");
      fetchProfile(); // Refresh to get updated URLs
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  

  useEffect(() => { fetchProfile(); }, []);

  const skillTags = profile.skills.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <>
      <Navbar />
      <Sidebar />
      <Toaster />
      <div style={s.page}>
        <form onSubmit={handleSubmit} style={s.card}>

          {/* Banner + Avatar */}
          <div style={s.banner}>
            <div style={s.avatar}>
              <label htmlFor="profileImageUpload" style={{ cursor: "pointer", width: "100%", height: "100%" }}>
                {newProfileImage ? (
                  <img src={URL.createObjectURL(newProfileImage)} alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : profile.profileImage ? (
                  <img
                    src={typeof profile.profileImage === "string"
                      ? `https://jobportal-backend-12-vt48.onrender.com${profile.profileImage}`
                      : URL.createObjectURL(profile.profileImage)}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : getInitials(profile.name)}
                <div style={{
                  position: "absolute", bottom: "4px", right: "4px",
                  background: "#e2b96f", width: "18px", height: "18px",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "11px", color: "#111", fontWeight: "bold",
                }}>✎</div>
              </label>
              <input id="profileImageUpload" type="file" name="profileImage"
                accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>
          </div>

          <div style={s.body}>
            <p style={s.name}>{profile.name || "Your name"}</p>
            <p style={s.sub}>Student profile</p>

            <div style={s.sectionLabel}>Basic info</div>
            <div style={s.field}>
              <label style={s.label}>Full name</label>
              <input name="name" value={profile.name} onChange={handleChange} style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Education</label>
              <input name="education" value={profile.education} onChange={handleChange} style={s.input} />
            </div>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Degree Start</label>
                <input type="date" name="degreeStart" value={profile.degreeStart} onChange={handleChange} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Degree End</label>
                <input type="date" name="degreeEnd" value={profile.degreeEnd} onChange={handleChange} style={s.input} />
              </div>
            </div>

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Skills</div>
            <div style={s.field}>
              <input name="skills" value={profile.skills} onChange={handleChange} style={s.input} placeholder="e.g. React, Node.js, Python" />
            </div>
            {skillTags.length > 0 && (
              <div style={s.skillsWrap}>
                {skillTags.map((sk, i) => <span key={i} style={s.skill}>{sk}</span>)}
              </div>
            )}

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Experience</div>
            <div style={s.grid2}>
              <input type="number" name="experience" value={profile.experience} onChange={handleChange} style={s.input} placeholder="Years" />
              <input name="role" value={profile.role} onChange={handleChange} style={s.input} placeholder="Role" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Company</label>
              <input name="company" value={profile.company} onChange={handleChange} style={s.input} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Position</label>
              <input name="position" value={profile.position} onChange={handleChange} style={s.input} />
            </div>

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Links</div>
            <div style={s.field}>
              <input name="github" value={profile.github} onChange={handleChange} placeholder="GitHub" style={s.input} />
            </div>
            <div style={s.field}>
              <input name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="Portfolio" style={s.input} />
            </div>
            <div style={s.field}>
              <input name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="LinkedIn" style={s.input} />
            </div>

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Personal</div>
            <div style={s.field}>
              <label style={s.label}>DOB</label>
              <input type="date" name="dob" value={profile.dob} onChange={handleChange} style={s.input} />
            </div>
            <div style={s.field}>
              <input name="location" value={profile.location} onChange={handleChange} placeholder="Location" style={s.input} />
            </div>

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Projects</div>
            <div style={s.field}>
              <input name="projects" value={profile.projects} onChange={handleChange} style={s.input} />
            </div>

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Cover Letter</div>
            <textarea name="coverLetter" value={profile.coverLetter} onChange={handleChange}
              style={{ ...s.input, minHeight: "100px" }} />

            <hr style={s.divider} />

            <div style={s.sectionLabel}>Uploads</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

              {/* Show existing resume */}
              {profile.resume && !newResume && (
                <div style={{ fontSize: "13px" }}>
                  📄 Current Resume:{" "}
                  <a href={profile.resume.startsWith("http") ? profile.resume : `https://jobportal-backend-12-vt48.onrender.com${profile.resume}`}
                    target="_blank" rel="noreferrer" style={{ color: "#854F0B" }}>
                    View / Download
                  </a>
                </div>
              )}

              {/* Show new resume name if selected */}
              {newResume && (
                <div style={{ fontSize: "13px", color: "#333" }}>
                  📄 New resume selected: <strong>{newResume.name}</strong>{" "}
                  <span style={{ color: "#888", cursor: "pointer" }} onClick={() => setNewResume(null)}>✕ remove</span>
                </div>
              )}

              <input type="file" name="resume" onChange={handleFileChange}
                style={s.input} accept=".pdf,.doc,.docx" />
              <span style={{ fontSize: "12px", color: "#888" }}>
                Upload new resume to replace existing one
              </span>
            </div>

            <div style={s.footer}>
              <span style={{ fontSize: "12px", color: "#bbb" }}>Changes are saved to your account</span>
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