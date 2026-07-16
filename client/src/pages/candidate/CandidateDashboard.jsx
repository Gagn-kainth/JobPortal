import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import {
  User, Send, Calendar, Bookmark, Clock, ChevronRight,
  Briefcase, MapPin, DollarSign, Check,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { calculateProfileStrength } from "../../utils/profileStrength";

const COLORS = ["#f97316", "#f3f4f6"];

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, interviewRes, savedRes, profileRes] = await Promise.all([
        api.get("/dashboard/candidate"),
        api.get("/interviews/my"),
        api.get("/jobs/saved/my"),
        api.get("/auth/profile"),
      ]);
      setData(dashRes.data);
      setInterviews(interviewRes.data);
      setSavedJobsList(savedRes.data);
      setProfile(profileRes.data.user);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Failed to load dashboard</p>
      </div>
    );
  }

  const { checks, percent: profilePercent } = calculateProfileStrength(profile);
  const chartData = [
    { name: "Complete", value: profilePercent },
    { name: "Remaining", value: 100 - profilePercent },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back, here's your overview</p>

      {/* Stat Cards - responsive: 2 cols on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard icon={User} value={`${profilePercent}%`} label="Profile Complete" to="/profile" color="orange" />
        <StatCard icon={Send} value={data.totalApplied} label="Active Applications" to="/applications" color="blue" />
        <StatCard icon={Calendar} value={interviews.length} label="Upcoming Interviews" to="/applications" color="purple" />
        <StatCard icon={Bookmark} value={savedJobsList.length} label="Saved Jobs" to="/jobs" color="green" />
      </div>

      {/* Main Content - stack on mobile, side-by-side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">Upcoming Interviews</h3>
              <p className="text-xs text-gray-400 mt-0.5">{interviews.length} scheduled</p>
            </div>
            <button onClick={() => navigate("/applications")} className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-0.5 shrink-0">
              View all <ChevronRight size={14} />
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar size={32} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No interviews scheduled</p>
              <p className="text-xs text-gray-300 mt-0.5">Apply to jobs to get interview opportunities</p>
            </div>
          ) : (
            <div className="space-y-2">
              {interviews.map((iv) => (
                <div key={iv._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer gap-3" onClick={() => navigate("/applications")}>
                  {/* Left: Icon + Job Title/Mode */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{iv.job?.title}</p>
                      <p className="text-xs text-gray-400 capitalize truncate">{iv.mode || "TBD"}</p>
                    </div>
                  </div>
                  {/* Right: Date + Time (shrink-protected) */}
                  <div className="shrink-0 text-right text-xs text-gray-500">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock size={13} />
                      <span>
                        {new Date(iv.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {new Date(iv.scheduledAt).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">Saved Jobs</h3>
              <p className="text-xs text-gray-400 mt-0.5">{savedJobsList.length} saved</p>
            </div>
            <button onClick={() => navigate("/jobs")} className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-0.5 shrink-0">
              Browse jobs <ChevronRight size={14} />
            </button>
          </div>

          {savedJobsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bookmark size={32} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No saved jobs yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Browse jobs and save your favorites</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedJobsList.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer gap-3" onClick={() => navigate(`/jobs/${job._id}`)}>
                  {/* Left: Icon + Title/Location/Salary */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <Briefcase size={16} className="text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{job.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} />
                          <span className="truncate">{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                          <DollarSign size={11} />
                          ₹{(job.salary / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Strength */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800">Profile Strength</h3>
            <p className="text-xs text-gray-400 mt-0.5">Complete your profile to increase visibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Chart */}
          <div className="flex flex-col items-center">
            <div className="w-44 h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={75}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #F3F4F6",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{profilePercent}%</span>
                <span className="text-xs text-gray-400 mt-0.5">Complete</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="mt-5 h-9 px-4 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Complete Profile
            </button>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5">
            {checks.map((check) => (
              <div key={check.key} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    check.done ? "bg-green-500" : "border-2 border-gray-200"
                  }`}
                >
                  {check.done && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm ${check.done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;