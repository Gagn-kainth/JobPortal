const Sidebar = ({ isOpen, onClose }) => {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block  // Always visible on desktop
        `}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🧳</span>
              <span className="font-bold text-xl">TalentPath</span>
            </div>
            
            <button 
              onClick={onClose}
              className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-900/50 text-orange-400 rounded-lg">
                <span>⊞</span> Overview
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg">
                <span>🧳</span> My Jobs
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg">
                <span>👥</span> Applicants
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg">
                <span>➕</span> Post a Job
              </a>
            </nav>
          </div>
        </aside>
      </>
    );
  };