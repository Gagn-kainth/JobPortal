import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { MapPin, DollarSign, Clock } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mt-2">
        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
        <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
        <span className="flex items-center gap-1"><Clock size={14} /> {job.jobType}</span>
      </div>
      <p className="mt-4 text-gray-700">{job.description}</p>
      {job.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.requirements.map((req, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{req}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDetails;