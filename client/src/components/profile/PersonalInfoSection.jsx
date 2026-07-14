import { User, Mail, Phone, MapPin } from "lucide-react";

const inputClass = "w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10";

const PersonalInfoSection = ({ profile, isEditing, onChange }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.name || ""} onChange={(e) => onChange("name", e.target.value)} disabled={!isEditing} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.email || ""} disabled className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-100 text-gray-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.phone || ""} onChange={(e) => onChange("phone", e.target.value)} disabled={!isEditing} placeholder="Phone number" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={profile.location || ""} onChange={(e) => onChange("location", e.target.value)} disabled={!isEditing} placeholder="City, State" className={inputClass} />
        </div>
      </div>
    </div>
    <div className="mt-4">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
      <textarea
        value={profile.bio || ""}
        onChange={(e) => onChange("bio", e.target.value)}
        disabled={!isEditing}
        placeholder="Tell recruiters about yourself..."
        rows={3}
        className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 resize-none"
      />
    </div>
  </div>
);

export default PersonalInfoSection;