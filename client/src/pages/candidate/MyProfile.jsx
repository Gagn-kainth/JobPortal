import { useProfile } from "../../hooks/useProfile";
import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoSection from "../../components/profile/PersonalInfoSection";
import OnlinePresenceSection from "../../components/profile/OnlinePresenceSection";
import EducationSection from "../../components/profile/EducationSection";
import SkillsSection from "../../components/profile/SkillsSection";
import ResumeSection from "../../components/profile/ResumeSection";

const MyProfile = () => {
  const {
    profile, isEditing, setIsEditing, handleChange, saveDetails,
    addSkill, removeSkill, addSchool, removeSchool, uploadResume, uploadAvatar,
  } = useProfile();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Keep your profile up to date</p>
        </div>
        <button
          onClick={() => (isEditing ? saveDetails() : setIsEditing(true))}
          className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
            isEditing ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProfileHeader profile={profile} onAvatarUpload={uploadAvatar} />
        <div className="p-6 space-y-8">
          <PersonalInfoSection profile={profile} isEditing={isEditing} onChange={handleChange} />
          <OnlinePresenceSection profile={profile} isEditing={isEditing} onChange={handleChange} />
          <EducationSection education={profile.education} isEditing={isEditing} onAdd={addSchool} onRemove={removeSchool} />
          <SkillsSection skills={profile.skills} isEditing={isEditing} onAdd={addSkill} onRemove={removeSkill} />
          <ResumeSection resumeUrl={profile.resumeUrl} onUpload={uploadResume} />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;