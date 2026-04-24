
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

export default function Applications() {
    const [matchApplication, setMatchApplication] = useState([]);
    const params = useParams();

    const matchingApplication = async (jobId) => {
        try {
            const response = await axiosInstance.get(
                `/jobs/matchAppplication/${jobId}`
            );
            setMatchApplication(response.data || []);
        } catch (error) {
            console.log(error?.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (params.jobId) {
            matchingApplication(params.jobId);
        }
    }, [params.jobId]);

    const getColor = (percent) => {
        if (percent >= 80) return "#16a34a";
        if (percent >= 50) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div style={{ padding: "16px", background: "#f4f6f8", minHeight: "100vh" }}>
            <Navbar />

            <h1 style={{ margin: "16px 0" }}>Applications</h1>

            <div
                style={{
                    display: "grid",
                    gap: "16px",
                }}
            >
                {Array.isArray(matchApplication) && matchApplication.length === 0 ? (
                    <p>No applications found</p>
                ) : (
                    matchApplication.map((app) => {
                        const totalSkills = app.requiredSkillsCount || 5;
                        const matched = app.matchedSkillsCount || 0;
                        const percent = Math.round((matched / totalSkills) * 100);

                        return (
                            <div
                                key={app._id}
                                style={{
                                    background: "#fff",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    gap: "16px",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap", // ✅ important for responsiveness
                                }}
                            >
                                {/* Profile */}
                                <img
                                    src={
                                        app.profileImage
                                            ? `https://jobportal-backend-12-vt48.onrender.com/${app.profileImage}`
                                            : "https://via.placeholder.com/80"
                                    }
                                    alt="profile"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid #ddd",
                                        flexShrink: 0,
                                    }}
                                />

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    {/* Header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                        }}
                                    >
                                        <h2 style={{ margin: 0, fontSize: "18px" }}>
                                            {app.name}
                                        </h2>

                                        <span
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "20px",
                                                color: "#fff",
                                                background: getColor(percent),
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                alignSelf: "flex-start",
                                            }}
                                        >
                                            {percent}% Match
                                        </span>
                                    </div>

                                    <p style={{ color: "#555", margin: "4px 0" }}>
                                        {app.email}
                                    </p>

                                    <p><b>Education:</b> {app.education}</p>
                                    <p><b>Experience:</b> {app.experience}</p>
                                    <p><b>Location:</b> {app.location}</p>

                                    {/* Skills */}
                                    <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {(app.skills || []).map((s, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    background: "#e2e8f0",
                                                    padding: "4px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}