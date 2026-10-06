import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";

import {
  Briefcase,
  Users,
  Calendar,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";

import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Pending: "#F59E0B",
  Reviewed: "#3B82F6",
  Shortlisted: "#8B5CF6",
  Interviewed: "#6366F1",
  Rejected: "#EF4444",
  Hired: "#10B981",
};

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const fetchData = async () => {
    try {
      const [dashRes, interviewRes] = await Promise.all([
        api.get("/dashboard/recruiter"),
        api.get("/interviews/recruiter"),
      ]);

      setData(dashRes.data);
      setInterviews(interviewRes.data);
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalApplicants = data.applicantsPerJob.reduce(
    (a, j) => a + j.count,
    0
  );

  const hiredCount =
    data.statusBreakdown.find((s) => s._id === "Hired")?.count || 0;

  const pieData = data.statusBreakdown.map((s) => ({
    name: s._id,
    value: s.count,
    fill: COLORS[s._id] || "#9CA3AF",
  }));

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="text-sm text-gray-500 mt-1">
        Welcome back, here's your overview
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          icon={Briefcase}
          value={data.jobsPosted}
          label="Active Jobs"
          to="/my-jobs"
          color="orange"
        />

        <StatCard
          icon={Users}
          value={totalApplicants}
          label="Total Applicants"
          to="/applicants"
          color="blue"
        />

        <StatCard
          icon={Calendar}
          value={interviews.length}
          label="Interviews Scheduled"
          to="/applicants"
          color="purple"
        />

        <StatCard
          icon={Award}
          value={hiredCount}
          label="Hired This Month"
          to="/applicants"
          color="green"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-semibold text-gray-800">
                Status Distribution
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Breakdown of all applicants
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Users size={17} className="text-orange-500" />
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                />

                <Tooltip
                  cursor={false}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2.5 mt-3 justify-center">
            {pieData.map((entry) => (
              <div
                key={entry.name}
                className="
                  flex items-center gap-1.5
                  px-2.5 py-1.5
                  rounded-lg
                  bg-gray-50
                  border border-gray-100
                  hover:bg-orange-50
                  hover:border-orange-100
                  transition-all duration-200
                "
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: entry.fill,
                  }}
                />

                <span className="text-xs font-medium text-gray-600">
                  {entry.name}
                </span>

                <span className="text-xs font-semibold text-gray-800">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-w-0 hover:border-orange-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800">
                Upcoming Interviews
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {interviews.length} scheduled
              </p>
            </div>

            <button
              onClick={() => navigate("/applicants")}
              className="
                text-xs text-orange-500 font-medium
                hover:text-orange-600
                flex items-center gap-0.5 shrink-0
                hover:translate-x-0.5
                transition-all duration-200
              "
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <Calendar size={22} className="text-orange-400" />
              </div>

              <p className="text-sm font-medium text-gray-600">
                No interviews scheduled
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Shortlist candidates to schedule interviews
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {interviews.map((iv) => (
                <div
                  key={iv._id}
                  onClick={() => navigate("/applicants")}
                  className="
                    group flex items-center justify-between
                    p-3 rounded-xl gap-3 cursor-pointer
                    bg-gray-50/50
                    border border-transparent
                    hover:bg-orange-50
                    hover:border-orange-100
                    hover:shadow-sm
                    hover:scale-[1.01]
                    transition-all duration-200
                  "
                >
                  {/* Avatar + Candidate */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="
                        w-10 h-10 rounded-xl
                        bg-orange-100
                        flex items-center justify-center shrink-0
                        group-hover:bg-orange-500
                        group-hover:scale-105
                        transition-all duration-200
                      "
                    >
                      <span
                        className="
                          text-xs font-bold
                          text-orange-600
                          group-hover:text-white
                          transition-colors duration-200
                        "
                      >
                        {iv.candidate?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "?"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate group-hover:text-orange-700 transition-colors">
                        {iv.candidate?.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {iv.job?.title}
                      </p>
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 justify-end text-xs font-medium text-gray-600">
                      <Clock
                        size={13}
                        className="text-orange-400 group-hover:text-orange-500 transition-colors"
                      />

                      <span>
                        {new Date(iv.scheduledAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400 block mt-1">
                      {new Date(iv.scheduledAt).toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
