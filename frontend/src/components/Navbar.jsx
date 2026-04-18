

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { FaBell, FaTimes, FaUserCircle, FaBriefcase } from "react-icons/fa";
import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");
const socket = io("https://jobportal-backend-be9i.onrender.com");

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

  // ---------------- OUTSIDE CLICK ----------------
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!userData || !role) return;

    socket.emit("register", { userId: userData._id, role });

    const eventName =
      role === "employer"
        ? "employer-notification"
        : "student-notification";

    socket.on(eventName, (data) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === data._id);
        if (exists) return prev;
        return [data, ...prev];
      });
    });

    return () => socket.off(eventName);
  }, [userData, role]);

  // ---------------- FETCH ----------------
  const fetchNotifications = async () => {
    try {
      const url =
        role === "student"
          ? "/students/notifications"
          : "/employers/notifications";

      const res = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${userData?.token}` },
      });

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [role]);

  // ---------------- MARK ALL SEEN ----------------
  const markAllSeen = async () => {
    try {
      if (notifications.length === 0) return;

      const url =
        role === "student"
          ? "/students/notifications"
          : "/employers/notifications";

      await axiosInstance.patch(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );

      setNotifications([]);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- HANDLERS ----------------
  const handleBellClick = async () => {
    if (open) await markAllSeen();
    setOpen(!open);
    setProfileOpen(false);
  };

  const handleClose = async () => {
    await markAllSeen();
    setOpen(false);
  };

  const handleNotificationClick = (n) => {
    setOpen(false);

    if (role === "student" && n.jobId)
      navigate(`/student/job/${n.jobId}`);

    if (role === "employer" && n.jobId)
      navigate(`/employer/job/${n.jobId}/applicants`);
  };

  const handleProfileNavigate = () => {
    setProfileOpen(false);
    navigate(
      role === "employer"
        ? "/employer/profile"
        : "/student/profile"
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("student");
    localStorage.removeItem("employer");
    navigate("/login");
  };

  const initials = userData?.name
    ? userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : role === "employer"
      ? "EM"
      : "ST";

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#1a1a2e] text-white">
        <div className="flex items-center justify-between px-3 sm:px-5 md:px-6 py-3">

          {/* LEFT */}
          <div
            className="flex items-center gap-2 cursor-pointer pl-10 sm:pl-0"
            onClick={() =>
              navigate(
                role === "employer"
                  ? "/employer/dashboard"
                  : "/student/dashboard"
              )
            }
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:ml-9  rounded-xl bg-white/20 flex items-center justify-center">
              <FaBriefcase />
            </div>

            <span className="font-bold text-sm sm:text-base md:text-lg hidden xs:block">
              Job App
            </span>


            {/* CREATE JOB */}
            {role === "employer" && (
              <button
                onClick={() => navigate("/employer/jobpost")}
                className="bg-green-500 px-4 py-1 rounded"
              >
                + Create Job
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

            {/* 🔔 NOTIFICATIONS */}
            {role && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleBellClick}
                  className="relative p-2 hover:bg-white/10 rounded-lg"
                >
                  <FaBell />

                  {notifications.length > 0 && (
                    <span className="
                      absolute -top-1 -right-1
                      bg-red-500 text-[10px]
                      w-4 h-4 flex items-center justify-center
                      rounded-full
                    ">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </button>

                {/* ✅ FINAL FIXED DROPDOWN */}
                {open && (
                  <div
                    className="
      fixed sm:absolute
      right-2 sm:right-0
      top-16 sm:top-auto
      w-[92vw] sm:w-80
      max-h-[70vh]
      bg-white text-black
      rounded-xl shadow-2xl
      z-[99999]
      border border-gray-200
      overflow-hidden
    "
                  >
                    {/* HEADER */}
                    <div className="flex justify-between items-center p-3 border-b bg-white sticky top-0 z-10">
                      <span className="font-semibold text-sm">
                        Notifications
                      </span>
                      <FaTimes
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={handleClose}
                      />
                    </div>

                    {/* BODY */}
                    <div className="overflow-y-auto max-h-[60vh]">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-400 text-sm">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className="
              p-3 border-b last:border-0
              hover:bg-gray-50 cursor-pointer
              text-sm active:bg-gray-100
              break-words whitespace-normal
              leading-snug
            "
                          >
                            {n.message}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 👤 PROFILE */}
            {role && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setOpen(false);
                  }}
                  className="
                    w-8 h-8 sm:w-9 sm:h-9
                    rounded-full bg-white/20
                    flex items-center justify-center
                    text-xs font-bold
                  "
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div className="
                    absolute right-0 mt-2
                    w-48 bg-white text-black
                    rounded-xl shadow-xl z-50
                  ">
                    <div className="px-3 py-2 border-b bg-gray-50">
                      <p className="text-xs font-semibold truncate">
                        {userData?.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {role}
                      </p>
                    </div>

                    <button
                      onClick={handleProfileNavigate}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SPACE FOR FIXED NAVBAR */}
      <div className="h-16 sm:h-16 md:h-18"></div>
    </>
  );
}