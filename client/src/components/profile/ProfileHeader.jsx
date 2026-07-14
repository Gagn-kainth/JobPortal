import { useRef } from "react";
import { Camera } from "lucide-react";
import Avatar from "../Avatar";

const ProfileHeader = ({ profile, onAvatarUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            name={profile.name}
            imageUrl={profile.profilePic ? `${import.meta.env.VITE_API_URL}${profile.profilePic}` : null}
            size="lg"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Change photo"
          >
            <Camera size={12} className="text-gray-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && onAvatarUpload(e.target.files[0])}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{profile.name}</h2>
          <p className="text-sm text-gray-500">
            {profile.bio ? profile.bio.slice(0, 60) + "..." : "Add a bio to tell recruiters about yourself"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;