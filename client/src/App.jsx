import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/applicants" element={<Applicants />} />
            <Route path="/post-job" element={<PostJob />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Renders correct dashboard based on role
import { useAuth } from "./context/AuthContext";
const DashboardRouter = () => {
  const { user } = useAuth();
  return user?.role === "recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
};

export default App;