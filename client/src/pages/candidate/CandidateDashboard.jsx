import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { User, Send, Calendar, Bookmark } from "lucide-react";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/candidate").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard icon={User} value="65%" label="Profile Complete" />
        <StatCard icon={Send} value={data.totalApplied} label="Active Applications" />
        <StatCard icon={Calendar} value="3" label="Upcoming Interviews" />
        <StatCard icon={Bookmark} value={data.savedJobsCount} label="Saved Jobs" />
      </div>
    </div>
  );
};

export default CandidateDashboard;