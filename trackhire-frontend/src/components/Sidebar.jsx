import { useNavigate, useLocation } from "react-router-dom";
import { formatYear } from "../utils/formatYear";

function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItem = (path, label, icon) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-medium"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        {icon} {label}
      </button>
    );
  };

  return (
    <>
      <aside
        className={`min-h-screen bg-[#FAFAF8] dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-5 flex flex-col fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "w-56" : "w-0 p-0 border-r-0"
        }`}
      >
        <div className={`flex items-center gap-2 mb-8 px-1 pl-12 whitespace-nowrap transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-white text-xs font-bold">TH</span>
          </div>
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white">TrackHire</span>
        </div>

        <nav className={`flex flex-col gap-1 flex-1 whitespace-nowrap transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}>
          {navItem("/", "Dashboard", "⊞")}
          {navItem("/analytics", "AI Insights", "✦")}
          {navItem("/settings", "Settings", "⚙")}
        </nav>

        <div className={`flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800 px-1 py-2 transition-opacity duration-200 whitespace-nowrap ${open ? "opacity-100" : "opacity-0"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.name || "Guest"}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{formatYear(user.year, user.course)}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 left-4 z-50 w-9 h-9 bg-[#FAFAF8] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
    </>
  );
}

export default Sidebar;