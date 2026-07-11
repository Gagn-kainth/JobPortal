import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { User, Send, Calendar, Bookmark } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const fetchData = async () => {
    const [dashRes, interviewRes] = await Promise.all([
      api.get("/dashboard/candidate"),
      api.get("/interviews/my"),
    ]);
    setData(dashRes.data);
    setInterviews(interviewRes.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  const profilePercent = 65; 
  const chartData = [
    { name: "Complete", value: profilePercent },
    { name: "Remaining", value: 100 - profilePercent },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard icon={User} value={`${profilePercent}%`} label="Profile Complete" to="/profile" color="orange" />
        <StatCard icon={Send} value={data.totalApplied} label="Active Applications" to="/applications" color="blue" />
        <StatCard icon={Calendar} value={interviews.length} label="Upcoming Interviews" to="/applications" color="purple" />
        <StatCard icon={Bookmark} value={data.savedJobsCount} label="Saved Jobs" to="/jobs" color="green" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Upcoming Interviews</h3>
          {interviews.length === 0 ? (
            <p className="text-sm text-gray-400">No interviews scheduled</p>
          ) : (
            <div className="space-y-3">
              {interviews.map((iv) => (
                <div key={iv._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">{iv.job?.title}</p>
                    <p className="text-xs text-gray-500">{iv.mode}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(iv.scheduledAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-4 self-start">Profile Strength</h3>
          <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={55} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#f97316" />
                  <Cell fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{profilePercent}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;