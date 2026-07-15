import { useEffect, useState, useRef } from "react";
import { Bell, Calendar, X } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const NotificationBell = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchInterviews = async () => {
    try {
      const endpoint = user?.role === "recruiter" ? "/interviews/recruiter" : "/interviews/my";
      const res = await api.get(endpoint);
      setInterviews(res.data);
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    fetchInterviews();
    const interval = setInterval(fetchInterviews, 30000);
    return () => clearInterval(interval);
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingCount = interviews.filter((iv) => new Date(iv.scheduledAt) > new Date()).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`
          relative w-10 h-10 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${open ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-500"}
        `}
      >
        <Bell size={20} />
        {upcomingCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-[#f5f0eb]" />
        )}
      </button>

      {open && (
        <div 
          className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          style={{ 
            right: '1rem', 
            width: '18rem',
            maxWidth: 'calc(100vw - 2rem)'
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-gray-800">Notifications</h4>
              {upcomingCount > 0 && (
                <span className="text-xs font-medium text-orange-500">{upcomingCount} new</span>
              )}
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {interviews.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
            ) : (
              interviews.map((iv) => (
                <div 
                  key={iv._id} 
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Calendar size={15} className="text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                      Interview scheduled: {iv.job?.title}
                      {iv.candidate?.name && ` with ${iv.candidate.name}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(iv.scheduledAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;