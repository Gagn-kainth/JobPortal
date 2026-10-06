import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import {
  User,
  Send,
  Calendar,
  Bookmark,
  Clock,
  ChevronRight,
  Briefcase,
  MapPin,
  DollarSign,
  Check,
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
      <p className="text-sm text-gray-500 mt-1">
        Welcome back, here's your overview
      </p>

      {/* Stat Cards - responsive: 2 cols on mobile, 4 on larger screens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          icon={User}
          value={`${profilePercent}%`}
          label="Profile Complete"
          to="/profile"
          color="orange"
        />
        <StatCard
          icon={Send}
          value={data.totalApplied}
          label="Active Applications"
          to="/applications"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          value={interviews.length}
          label="Upcoming Interviews"
          to="/applications"
          color="purple"
        />
        <StatCard
          icon={Bookmark}
          value={savedJobsList.length}
          label="Saved Jobs"
          to="/jobs"
          color="green"
        />
      </div>

      {/* Main Content - stack on mobile, side-by-side on md+ */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">
                Upcoming Interviews
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {interviews.length} scheduled
              </p>
            </div>

            <button
              onClick={() => navigate("/applications")}
              className="text-xs text-orange-500 font-medium 
      flex items-center gap-1 shrink-0
      px-3 py-2 rounded-lg
      hover:bg-orange-50 hover:text-orange-600
      transition-all"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          {interviews.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                <Calendar size={26} className="text-purple-300" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                No interviews scheduled
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Apply to jobs to get interview opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((iv) => (
                <div
                  key={iv._id}
                  onClick={() => navigate("/applications")}
                  className="group flex items-center justify-between
          p-3.5 rounded-xl
          border border-gray-100
          bg-gray-50/40
          hover:bg-white
          hover:border-purple-200
          hover:shadow-sm
          transition-all duration-200
          cursor-pointer
          gap-4"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl
              bg-purple-100
              flex items-center justify-center
              shrink-0
              group-hover:bg-purple-500
              transition-colors duration-200"
                    >
                      <Calendar
                        size={17}
                        className="text-purple-600 group-hover:text-white transition-colors"
                      />
                    </div>

                    {/* Job info */}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {iv.job?.title || "Interview"}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 capitalize truncate">
                          {iv.mode || "TBD"}
                        </span>

                        <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />

                        <span className="text-[11px] text-green-500 font-medium">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Date */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock size={13} className="text-purple-400" />

                        <span className="text-xs font-medium text-gray-600">
                          {new Date(iv.scheduledAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <span className="block text-[11px] text-gray-400 mt-1">
                        {new Date(iv.scheduledAt).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div
                      className="w-7 h-7 rounded-lg
              flex items-center justify-center
              text-gray-300
              group-hover:text-purple-500
              group-hover:bg-purple-50
              transition-all"
                    >
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">Saved Jobs</h3>

              <p className="text-xs text-gray-400 mt-0.5">
                {savedJobsList.length} saved
              </p>
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="text-xs text-green-600 font-medium
                          flex items-center gap-1 shrink-0
                          px-3 py-2 rounded-lg
                          hover:bg-green-50 hover:text-green-700
                          transition-all"
            >
              Browse jobs
              <ChevronRight size={14} />
            </button>
          </div>

          {savedJobsList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                <Bookmark size={26} className="text-green-300" />
              </div>

              <p className="text-sm font-medium text-gray-500">
                No saved jobs yet
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Browse jobs and save your favorites
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedJobsList.map((job) => (
                <div
                  key={job._id}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="group flex items-center justify-between
                              p-3.5 rounded-xl
                              border border-gray-100
                              bg-gray-50/40
                              hover:bg-white
                              hover:border-green-200
                              hover:shadow-sm
                              transition-all duration-200
                              cursor-pointer
                              gap-4"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Job Icon */}
                    <div
                      className="w-10 h-10 rounded-xl
                                bg-green-100
                                flex items-center justify-center
                                shrink-0
                                group-hover:bg-green-500
                                transition-colors duration-200"
                    >
                      <Briefcase
                        size={17}
                        className="text-green-600
                                group-hover:text-white
                                transition-colors"
                      />
                    </div>

                    {/* Job Info */}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {job.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Location */}
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 min-w-0">
                          <MapPin size={11} className="shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </span>

                        {/* Divider */}
                        <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />

                        {/* Salary */}
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                          <DollarSign size={11} />₹
                          {(job.salary / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className="w-8 h-8 rounded-lg
                              flex items-center justify-center
                              text-gray-300
                              group-hover:text-green-600
                              group-hover:bg-green-50
                              transition-all shrink-0"
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Strength */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800">Profile Strength</h3>

            <p className="text-xs text-gray-400 mt-0.5">
              Complete your profile to increase visibility
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[11px] font-medium text-orange-600">
              {profilePercent < 100 ? "Almost there" : "Completed"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Progress */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={68}
                    outerRadius={82}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    cornerRadius={8}
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

              {/* Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800 tracking-tight">
                  {profilePercent}%
                </span>

                <span className="text-xs text-gray-400 mt-1">
                  Profile Complete
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="mt-5 h-10 px-5 rounded-xl
        bg-orange-500 text-white text-sm font-medium
        hover:bg-orange-600
        hover:shadow-md hover:shadow-orange-100
        active:scale-95
        transition-all"
            >
              {profilePercent === 100 ? "View Profile" : "Complete Profile"}
            </button>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            {checks.map((check) => (
              <div
                key={check.key}
                className={`flex items-center justify-between
          p-3 rounded-xl border transition-all
          ${
            check.done
              ? "bg-green-50/50 border-green-100"
              : "bg-gray-50/50 border-gray-100"
          }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Check */}
                  <div
                    className={`w-7 h-7 rounded-lg
              flex items-center justify-center
              shrink-0 transition-all
              ${
                check.done ? "bg-green-500" : "bg-white border border-gray-200"
              }`}
                  >
                    {check.done && (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm truncate
              ${check.done ? "text-gray-700 font-medium" : "text-gray-400"}`}
                  >
                    {check.label}
                  </span>
                </div>

                {/* Status */}
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide
            ${check.done ? "text-green-600" : "text-gray-300"}`}
                >
                  {check.done ? "Done" : "Pending"}
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
