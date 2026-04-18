

import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";

const INITIAL_STATE = {
  title: "",
  description: "",
  requiredSkills: "",
  requiredEducation: "",
};

export default function PostJob() {
  const [job, setJob] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("employer"))?.token;

      // ✅ Convert comma-separated string → clean array
      const skillsArray = job.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // ✅ Send clean JSON (NOT FormData)
      const payload = {
        title: job.title,
        description: job.description,
        requiredEducation: job.requiredEducation,
        requiredSkills: skillsArray,
      };

      console.log("Sending payload:", payload);

      await axiosInstance.post("/jobs/createJob", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job posted successfully");
      setJob(INITIAL_STATE);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Toaster />
      <Navbar />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold">Post Job</h2>

        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="requiredSkills"
          value={job.requiredSkills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="requiredEducation"
          value={job.requiredEducation}
          onChange={handleChange}
          placeholder="Education"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}