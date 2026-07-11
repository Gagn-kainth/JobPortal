import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutGrid,
  Search,
  FileText,
  User,
  Briefcase,
  Users,
  Plus,
  LogOut,
  Bell,
} from "lucide-react";
import Button from "../components/Button";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const isRecruiter = user?.role === "recruiter";

  const candidateLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutGrid },
    { to: "/jobs", label: "Find Jobs", icon: Search },
    { to: "/applications", label: "My Applications", icon: FileText },
    { to: "/profile", label: "My Profile", icon: User },
  ];

  const recruiterLinks = [
    { to: "/dashboard", label: "Overview", icon: LayoutGrid },
    { to: "/my-jobs", label: "My Jobs", icon: Briefcase },
    { to: "/applicants", label: "Applicants", icon: Users },
    { to: "/post-job", label: "Post a Job", icon: Plus },
  ];

  const links = isRecruiter ? recruiterLinks : candidateLinks;

  return (
    <div className="flex min-h-screen bg-[#f5f0e8]">
      <aside className="w-64 bg-[#1a1d29] text-white flex flex-col">
        <div className="p-6 flex items-center gap-2 font-bold text-lg">
          <Briefcase className="text-orange-500" /> TalentPath
        </div>
        <div className="px-6 py-3 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">
              {isRecruiter ? "Recruiter Account" : "Job Seeker"}
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-gray-300 hover:text-white transition-colors duration-200 border-t border-white/10"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className="flex-1">
        <header className="flex justify-end items-center gap-4 px-8 py-4 bg-[#f5f0e8]">
          <Bell size={20} />
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
            {user?.name?.[0]}
          </div>
        </header>
        <div className="px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
