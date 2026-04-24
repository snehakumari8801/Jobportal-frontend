
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const student = JSON.parse(localStorage.getItem("student"));


  // 🔹 Toggle Save/Unsave
  const toggleSaveJob = async (jobId) => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));

      const res = await axiosInstance.post(
        `/jobs/save/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${student?.token}`,
          },
        }
      );

      const isSaved = res.data?.saved;

      if (isSaved) {
        setSavedJobs((prev) =>
          prev.includes(jobId) ? prev : [...prev, jobId]
        );
      } else {
        setSavedJobs((prev) =>
          prev.filter((id) => id !== jobId)
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <JobsContext.Provider value={{ savedJobs, toggleSaveJob }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => useContext(JobsContext);