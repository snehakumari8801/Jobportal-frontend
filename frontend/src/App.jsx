// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// // Pages
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
// import DashboardEmployer from "./pages/employer/Dashboard";
// import JobPostEmployer from "./pages/employer/PostJob";

// import DashboardStudent from "./pages/student/Dashboard";
// import ProfileStudent from "./pages/student/Profile"
// import AllJobs from "./pages/student/AllJobs";
// import ApplyJob from "./pages/student/ApplyJob";
// import AppliedUserProfile from "./pages/employer/AppliedUserProfile";
// import SavedJobs from "./pages/student/SavedJobs";
// import Applications from "./pages/employer/Applications";

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         {/* Toast notifications */}
//         {/* <Toaster position="top-right" reverseOrder={false} /> */}

//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/student/dashboard" element={<DashboardStudent />} />
//           <Route path="/student/profile" element={<ProfileStudent />} />
//           <Route path="/employer/dashboard" element={<DashboardEmployer />} />
//           <Route path="/dashboard/allJobs" element={<AllJobs />} />
//           <Route path="/student/dashboard/apply/:jobId" element={<ApplyJob />} />
//           <Route path="/employer/jobpost" element={<JobPostEmployer />} />
//           <Route path="/employer/dashboard/:jobId/:studentId" element={<AppliedUserProfile />} />
//           <Route path="/student/dashboard/saved" element={<SavedJobs />} />
//           <Route path="/employer/applications/:jobId" element={<Applications />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;










// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import DashboardEmployer from "./pages/employer/Dashboard";
import JobPostEmployer from "./pages/employer/PostJob";

import DashboardStudent from "./pages/student/Dashboard";
import ProfileStudent from "./pages/student/Profile"
import AllJobs from "./pages/student/AllJobs";
import ApplyJob from "./pages/student/ApplyJob";
import AppliedUserProfile from "./pages/employer/AppliedUserProfile";
import SavedJobs from "./pages/student/SavedJobs";
import Applications from "./pages/employer/Applications";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Toast notifications */}
        {/* <Toaster position="top-right" reverseOrder={false} /> */}

        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/dashboard" element={<DashboardStudent />} />
          <Route path="/student/profile" element={<ProfileStudent />} />
          <Route path="/employer/dashboard" element={<DashboardEmployer />} />
          <Route path="/dashboard/allJobs" element={<AllJobs />} />
          <Route path="/student/dashboard/apply/:jobId" element={<ApplyJob />} />
          <Route path="/employer/jobpost" element={<JobPostEmployer />} />
          <Route path="/employer/dashboard/:jobId/:studentId" element={<AppliedUserProfile />} />
          <Route path="/student/dashboard/saved" element={<SavedJobs />} />
          <Route path="/employer/applications/:jobId" element={<Applications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;