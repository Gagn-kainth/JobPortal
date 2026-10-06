import {
  LayoutDashboard,
  Briefcase,
  Users,
  PlusCircle,
  X,
  UserCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "My Jobs",
      icon: Briefcase,
    },
    {
      label: "Applicants",
      icon: Users,
    },
    {
      label: "Post a Job",
      icon: PlusCircle,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64
          bg-slate-950 text-white
          border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl
                         bg-orange-500
                         flex items-center justify-center
                         shadow-lg shadow-orange-500/20"
            >
              <Briefcase size={21} />
            </div>

            <div>
              <h1 className="font-bold text-xl tracking-tight">
                Talent<span className="text-orange-500">Path</span>
              </h1>

              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Recruiter
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="md:hidden ml-auto p-2 rounded-lg
                       text-gray-400
                       hover:text-white
                       hover:bg-white/5
                       transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Workspace
          </p>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  onClick={onClose}
                  className={`
                    group relative
                    flex items-center gap-3
                    px-3.5 py-3
                    rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      item.active
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10"
                        : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                    }
                  `}
                >
                  <Icon
                    size={19}
                    className={
                      item.active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-orange-400"
                    }
                  />

                  <span>{item.label}</span>

                  {item.active && (
                    <ChevronRight
                      size={16}
                      className="ml-auto text-orange-100"
                    />
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/5">
          {/* Profile */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl
                       hover:bg-white/5
                       transition-colors cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-full
                         bg-orange-500/15
                         flex items-center justify-center"
            >
              <UserCircle size={20} className="text-orange-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-200 truncate">
                Recruiter
              </p>

              <p className="text-xs text-gray-500 truncate">Manage account</p>
            </div>
          </div>

          {/* Logout */}
          <button
            className="w-full mt-2
                       flex items-center gap-3
                       px-3.5 py-3
                       rounded-xl
                       text-sm text-gray-400
                       hover:bg-red-500/10
                       hover:text-red-400
                       transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
