
import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const st = JSON.parse(localStorage.getItem("student"));
  const isCompleted = st?.isCompleted ?? st?.isComplete;
  console.log(isCompleted)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const url = role === "student" ? "/students/login" : "/employers/login";
  //     const res = await axiosInstance.post(url, form);
  //     toast.success("Welcome back!");
  //     const userData = { ...res.data, role };
  //     if (role === "student") {
  //       localStorage.setItem("student", JSON.stringify(userData));
  //       localStorage.removeItem("employer");
  //     } else {
  //       localStorage.setItem("employer", JSON.stringify(userData));
  //       localStorage.removeItem("student");
  //     }

  //     if (role === "student") {
  //       // console.log(st.isComplete)
  //       navigate(isCompleted ? "/student/dashboard" : "/student/profile");
  //     } else {
  //       navigate("/employer/dashboard");
  //     }
  //     // navigate(role === "student" ? "/student/dashboard" : "/employer/dashboard");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Invalid credentials");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const url =
      role === "student"
        ? "/students/login"
        : "/employers/login";

    const res = await axiosInstance.post(url, form);

    toast.success("Welcome back!");

    const userData = { ...res.data, role };

    // store correctly
    if (role === "student") {
      localStorage.setItem("student", JSON.stringify(userData));
      localStorage.removeItem("employer");
    } else {
      localStorage.setItem("employer", JSON.stringify(userData));
      localStorage.removeItem("student");
    }

    // ✅ IMPORTANT: use response, not localStorage
    if (role === "student") {
      const isCompleted =
        res.data?.isCompleted ?? res.data?.isComplete;

      navigate(
        isCompleted
          ? "/student/dashboard"
          : "/student/profile"
      );
    } else {
      navigate("/employer/dashboard");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};
  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #2d3748",
    background: "rgba(255,255,255,0.03)",
    color: "#f3f4f6",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "10px",
    color: "#6b7280",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fieldIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-input:focus {
          border-color: rgba(226,185,111,0.5) !important;
          box-shadow: 0 0 0 3px rgba(226,185,111,0.08) !important;
          background: rgba(226,185,111,0.03) !important;
        }
        .reg-input::placeholder { color: #4b5563; }
        .reg-input:hover { border-color: #374151 !important; }

        .role-tab { transition: all 0.25s ease; }
        .role-tab:hover { opacity: 0.9; }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(226,185,111,0.3) !important;
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        .text-link:hover { color: #e2b96f !important; }
        .eye-btn:hover { color: #e2b96f !important; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: "10%", left: "15%",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226,185,111,0.06) 0%, transparent 70%)",
          animation: "floatOrb 7s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "15%",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          animation: "floatOrb 9s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />

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

        <div style={{
          width: "100%", maxWidth: "400px",
          animation: "fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both",
          position: "relative", zIndex: 1,
        }}>

          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #f9fafb 30%, #e2b96f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "8px",
            }}>
              Job App
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", color: "#6b7280", fontWeight: "300",
            }}>
              Sign in to continue
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "linear-gradient(160deg, #1a1f2e 0%, #131720 100%)",
            border: "1px solid #2d3748",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(226,185,111,0.05)",
          }}>

            {/* Role Toggle */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid #1f2937",
            }}>
              {["student", "employer"].map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    className="role-tab"
                    onClick={() => setRole(r)}
                    style={{
                      padding: "16px", border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px", fontWeight: "600",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      background: active ? "rgba(226,185,111,0.07)" : "transparent",
                      color: active ? "#e2b96f" : "#4b5563",
                      borderBottom: active ? "2px solid #e2b96f" : "2px solid transparent",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {r === "student" ? "🎓 Student" : "🏢 Employer"}
                  </button>
                );
              })}
            </div>

            {/* Form Body */}
            <div style={{ padding: "28px 28px 32px" }}>

              <div style={{ marginBottom: "24px" }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px", fontWeight: "700",
                  color: "#f9fafb", letterSpacing: "-0.02em",
                  marginBottom: "4px",
                }}>
                  {role === "student" ? "Student Login" : "Employer Login"}
                </h2>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px", color: "#6b7280",
                }}>
                  {role === "student"
                    ? "Access your job matches and applications"
                    : "Manage your listings and candidates"}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                  {/* Email */}
                  <div style={{ animation: "fieldIn 0.3s ease both", animationDelay: "0.05s" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      className="reg-input"
                      type="email" name="email"
                      placeholder="you@example.com"
                      value={form.email} onChange={handleChange}
                      required style={inputStyle}
                    />
                  </div>

                  {/* Password */}
                  <div style={{ animation: "fieldIn 0.3s ease both", animationDelay: "0.1s" }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="reg-input"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Your password"
                        value={form.password} onChange={handleChange}
                        required
                        style={{ ...inputStyle, paddingRight: "44px" }}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          position: "absolute", right: "14px",
                          top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none",
                          color: "#4b5563", cursor: "pointer",
                          fontSize: "16px", lineHeight: 1,
                          transition: "color 0.2s",
                          padding: 0,
                        }}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #2d3748, transparent)",
                    margin: "4px 0",
                  }} />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                    style={{
                      width: "100%", padding: "14px",
                      borderRadius: "10px", border: "none",
                      cursor: loading ? "default" : "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px", fontWeight: "700",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      background: loading
                        ? "#1f2937"
                        : "linear-gradient(135deg, #e2b96f, #c9973e)",
                      color: loading ? "#6b7280" : "#111827",
                      boxShadow: loading ? "none" : "0 4px 18px rgba(226,185,111,0.25)",
                      transition: "all 0.25s ease",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "8px",
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={{
                          width: "14px", height: "14px",
                          border: "2px solid #374151",
                          borderTopColor: "#e2b96f",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }} />
                        Signing in…
                      </>
                    ) : (
                      `Sign in as ${role === "student" ? "Student" : "Employer"} →`
                    )}
                  </button>
                </div>
              </form>

              {/* Register link */}
              <p style={{
                textAlign: "center",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", color: "#4b5563",
                marginTop: "20px",
              }}>
                Don't have an account?{" "}
                <span
                  className="text-link"
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#9ca3af", cursor: "pointer",
                    fontWeight: "500", transition: "color 0.2s",
                  }}
                >
                  Register
                </span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", color: "#374151",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginTop: "24px",
          }}>
            Secure · Private · Free
          </p>
        </div>
      </div>
    </>
  );
}
















// import { useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [role, setRole] = useState("student");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const url =
//       role === "student"
//         ? "/students/login"
//         : "/employers/login";

//     const res = await axiosInstance.post(url, form);

//     console.log("LOGIN RESPONSE:", res.data);

//     const userData = { ...res.data, role };

//     if (role === "student") {
//       localStorage.setItem("student", JSON.stringify(userData));
//       localStorage.removeItem("employer");
//     } else {
//       localStorage.setItem("employer", JSON.stringify(userData));
//       localStorage.removeItem("student");
//     }

//     toast.success("Welcome back!");

//     // only student uses profile check
//     if (role === "student") {
//       const isCompleted =
//         userData?.isCompleted ?? userData?.isComplete;

//       navigate(
//         isCompleted
//           ? "/student/dashboard"
//           : "/student/profile"
//       );
//     } else {
//       navigate("/employer/dashboard");
//     }

//   } catch (err) {
//     console.log("LOGIN ERROR:", err.response?.data);
//     toast.error(
//       err.response?.data?.message || "Invalid credentials"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <>
//       <Toaster />

//       {/* 🔥 YOUR ENTIRE UI STAYS SAME */}
//       {/* (I did NOT change your design) */}

//       <div>
//         {/* Role toggle, inputs, styles → unchanged */}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//           />

//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//           />

//           <button type="submit" disabled={loading}>
//             Login
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }