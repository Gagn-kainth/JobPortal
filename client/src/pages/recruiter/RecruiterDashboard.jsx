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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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

  if (!data)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const totalApplicants = data.applicantsPerJob.reduce(
    (a, j) => a + j.count,
    0
  );
  const hiredCount =
    data.statusBreakdown.find((s) => s._id === "Hired")?.count || 0;

  const pieData = data.statusBreakdown.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back, here's your overview</p>

      <div className="grid grid-cols-4 gap-4 mt-6">
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

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Status Distribution - Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-1">Status Distribution</h3>
          <p className="text-xs text-gray-400 mb-6">Breakdown of all applicants</p>
          <div className="h-64">
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
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#9CA3AF"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #F3F4F6",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[entry.name] }}
                />
                <span className="text-xs text-gray-500">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Upcoming Interviews</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {interviews.length} scheduled
              </p>
            </div>
            <button
              onClick={() => navigate("/applicants")}
              className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar size={32} className="text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No interviews scheduled</p>
              <p className="text-xs text-gray-300 mt-0.5">
                Shortlist candidates to schedule interviews
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {interviews.map((iv) => (
                <div
                  key={iv._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/applicants`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-orange-600">
                        {iv.candidate?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {iv.candidate?.name}
                      </p>
                      <p className="text-xs text-gray-400">{iv.job?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={13} />
                    {new Date(iv.scheduledAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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