import { Link2, Globe, Code2 } from "lucide-react";

const inputClass = "w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10";

const OnlinePresenceSection = ({ profile, isEditing, onChange }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Online Presence</h3>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">LinkedIn</label>
        <div className="relative">
          <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.linkedin || ""} onChange={(e) => onChange("linkedin", e.target.value)} disabled={!isEditing} placeholder="linkedin.com/in/username" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Portfolio</label>
        <div className="relative">
          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.portfolio || ""} onChange={(e) => onChange("portfolio", e.target.value)} disabled={!isEditing} placeholder="yoursite.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">GitHub</label>
        <div className="relative">
          <Code2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.github || ""} onChange={(e) => onChange("github", e.target.value)} disabled={!isEditing} placeholder="github.com/username" className={inputClass} />
        </div>
      </div>
    </div>
  </div>
);

export default OnlinePresenceSection;