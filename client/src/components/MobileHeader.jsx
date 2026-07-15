const MobileHeader = ({ onMenuToggle }) => {
    return (
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <button 
          onClick={onMenuToggle}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-xl">🧳</span>
          <span className="font-bold text-lg">TalentPath</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-600">
            <BellIcon className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            GS
          </div>
        </div>
      </header>
    );
  };