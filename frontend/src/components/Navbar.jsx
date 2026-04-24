
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { FaBell, FaTimes } from "react-icons/fa";
import { io } from "socket.io-client";

const socket = io("https://jobportal-backend-12-vt48.onrender.com");

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 50,
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 50%, #16213e 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(12px)",
  },

  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    height: "60px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  left: {
    marginLeft: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  logoBox: {
    marginLeft: "40px",
    width: "60px",
    height: "40px",
    borderRadius: "6px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    fontWeight: 700,
    fontSize: "16px",
    color: "#fff",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  bellBtn: {
    position: "relative",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#cbd5e1",
  },

  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "#f43f5e",
    color: "#fff",
    fontSize: "10px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 10px)",
    width: "min(320px, 92vw)",
    maxWidth: "320px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    overflow: "hidden",
    zIndex: 9999,
  },

  dropHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid #eee",
    background: "#fafafa",
  },

  dropBody: {
    maxHeight: "300px",
    overflowY: "auto",
  },

  notifItem: {
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
    cursor: "pointer",
  },

  emptyMsg: {
    padding: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#888",
  },

  avatarBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#6c63ff",
    color: "#fff",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 10px)",
    width: "200px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
    zIndex: 9999,
  },

  spacer: {
    height: "60px",
  },
};

export default function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const employer = JSON.parse(localStorage.getItem("employer"));
  const student = JSON.parse(localStorage.getItem("student"));

  const userData = employer || student;
  const role = employer ? "employer" : "student";

  // socket
  useEffect(() => {
    if (!userData) return;

    socket.emit("register", {
      userId: userData._id,
      role,
    });

    const event =
      role === "employer"
        ? "employer-notification"
        : "student-notification";

    socket.on(event, (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off(event);
  }, []);

  // fetch notifications
  useEffect(() => {
    const fetchData = async () => {
      const url =
        role === "student"
          ? "/students/notifications"
          : "/employers/notifications";

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });

      setNotifications(res.data);
    };

    fetchData();
  }, []);

  // mark notifications as seen
  const markAsSeen = async () => {
    try {
      const url =
        role === "student"
          ? "/students/notifications"
          : "/employers/notifications";

      await axiosInstance.patch(url, {}, {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });


      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as seen", err);
    }
  };

  // const handleBellClick = () => {
  //   const isOpening = !open;
  //   setOpen(isOpening);
  //   setProfileOpen(false);

  //   // call API only when opening and there are unread notifications
  //   if (isOpening && notifications.some((n) => !n.read)) {
  //     markAsSeen();
  //   }
  // };

  // const handleClose = () => setOpen(false);

  const handleBellClick = () => {
    setOpen(!open);
    setProfileOpen(false);
  };

  const handleClose = async () => {
    setOpen(false);

    // mark as seen on backend + clear list
    if (notifications.length > 0) {
      try {
        const url =
          role === "student"
            ? "/students/notifications"
            : "/employers/notifications";

        await axiosInstance.patch(url, {}, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
      } catch (err) {
        console.error("Failed to mark notifications as seen", err);
      }

      // ✅ Clear both count and messages
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const initials = userData?.name
    ? userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : role === "employer"
      ? userData?.company?.slice(0, 2).toUpperCase()
      : "ST";

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          {/* LEFT */}
          <div
            style={styles.left}
            onClick={() =>
              navigate(role === "employer" ? "/employer/dashboard" : "/student/dashboard")
            }
          >
            <div style={styles.logoBox}>
              <img
                src="/rnu.jpg"
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={styles.brandName}>Job App</span>
          </div>

          {/* RIGHT */}
          <div style={styles.right}>

            {/* BELL */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button style={styles.bellBtn} onClick={handleBellClick}>
                <FaBell />
                {unreadCount > 0 && (
                  <span style={styles.badge}>{unreadCount}</span>
                )}
              </button>

              {open && (
                <div style={styles.dropdown}>
                  <div style={styles.dropHeader}>
                    <b>Notifications</b>
                    <FaTimes
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>

                  <div style={styles.dropBody}>
                    {notifications.length === 0 ? (
                      <p style={styles.emptyMsg}>No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} style={styles.notifItem}>
                          {n.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div style={{ position: "relative", textAlign: "center", fontSize: "15px", fontWeight: "800px" }} ref={profileRef}>
              <div
                style={styles.avatarBtn}
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setOpen(false);
                }}
              >
                {initials}
              </div>

              {profileOpen && (
                <div style={styles.profileDropdown}>

                  {/* HEADER */}
                  <div style={{ padding: "10px", fontSize: "13px" }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {role === "employer" ? userData?.company : userData?.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "15px", color: "#191919" }}>
                      {role}
                    </p>
                  </div>

                  <hr />

                  {/* VIEW PROFILE (ONLY STUDENT) */}
                  {role === "student" && (
                    <div
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/student/profile");
                      }}
                      style={{ padding: "10px", cursor: "pointer" }}
                    >
                      View Profile
                    </div>
                  )}

                  {/* CREATE JOB (ONLY EMPLOYER) */}
                  {role === "employer" && (
                    <div
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/employer/jobpost");
                      }}
                      style={{ padding: "10px", cursor: "pointer", color: "#16a34a" }}
                    >
                      Create Job
                    </div>
                  )}

                  <hr />

                  {/* LOGOUT */}
                  <div
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem("student");
                      localStorage.removeItem("employer");
                      navigate("/login");
                    }}
                    style={{ padding: "10px", cursor: "pointer", color: "red" }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.spacer} />
    </>
  );
}