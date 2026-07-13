import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import FindJobs from "./pages/candidate/FindJobs";
import MyApplications from "./pages/candidate/MyApplications";
import MyProfile from "./pages/candidate/MyProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import Applicants from "./pages/recruiter/Applicants";
import PostJob from "./pages/recruiter/PostJob";
import EditJob from "./pages/recruiter/EditJob";
import JobDetails from "./pages/JobDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const DashboardRouter = () => {
  const { user } = useAuth();
  return user?.role === "recruiter" ? (
    <RecruiterDashboard />
  ) : (
    <CandidateDashboard />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/applicants" element={<Applicants />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/jobs/:id/edit" element={<EditJob />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
