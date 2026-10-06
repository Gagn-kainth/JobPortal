import { useProfile } from "../../hooks/useProfile";
import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoSection from "../../components/profile/PersonalInfoSection";
import OnlinePresenceSection from "../../components/profile/OnlinePresenceSection";
import EducationSection from "../../components/profile/EducationSection";
import SkillsSection from "../../components/profile/SkillsSection";
import ResumeSection from "../../components/profile/ResumeSection";
import { Pencil, Save } from "lucide-react";

const MyProfile = () => {
  const {
    profile,
    isEditing,
    setIsEditing,
    handleChange,
    saveDetails,
    addSkill,
    removeSkill,
    addSchool,
    removeSchool,
    uploadResume,
    uploadAvatar,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

          <p className="text-sm text-gray-500 mt-1">
            Keep your profile up to date
          </p>
        </div>

        {/* Edit / Save */}
        <button
          onClick={() => (isEditing ? saveDetails() : setIsEditing(true))}
          className={`h-10 px-5 rounded-xl text-sm font-medium
                      flex items-center justify-center gap-2
                      transition-all duration-200
                      ${
                        isEditing
                          ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md hover:scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:scale-105"
                      }`}
        >
          {isEditing ? (
            <>
              <Save size={16} />
              Save Changes
            </>
          ) : (
            <>
              <Pencil size={16} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Main Profile Card */}
      <div
        className="mt-6 bg-white rounded-2xl shadow-sm
                   border border-gray-100 overflow-hidden"
      >
        {/* Profile Header */}
        <ProfileHeader profile={profile} onAvatarUpload={uploadAvatar} />

        <div className="p-5 sm:p-6 space-y-6">
          {/* Personal Information */}
          <section
            className="rounded-2xl border border-gray-100
                       bg-gray-50/50 p-5
                       transition-all duration-200
                       hover:bg-orange-50/40
                       hover:border-orange-100"
          >
            <PersonalInfoSection
              profile={profile}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </section>

          {/* Online Presence */}
          <section
            className="rounded-2xl border border-gray-100
                       bg-gray-50/50 p-5
                       transition-all duration-200
                       hover:bg-orange-50/40
                       hover:border-orange-100"
          >
            <OnlinePresenceSection
              profile={profile}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </section>

          {/* Education */}
          <section
            className="rounded-2xl border border-gray-100
                       bg-gray-50/50 p-5
                       transition-all duration-200
                       hover:bg-orange-50/40
                       hover:border-orange-100"
          >
            <EducationSection
              education={profile.education}
              isEditing={isEditing}
              onAdd={addSchool}
              onRemove={removeSchool}
            />
          </section>

          {/* Skills */}
          <section
            className="rounded-2xl border border-gray-100
                       bg-gray-50/50 p-5
                       transition-all duration-200
                       hover:bg-orange-50/40
                       hover:border-orange-100"
          >
            <SkillsSection
              skills={profile.skills}
              isEditing={isEditing}
              onAdd={addSkill}
              onRemove={removeSkill}
            />
          </section>

          {/* Resume */}
          <section
            className="rounded-2xl border border-gray-100
                       bg-gray-50/50 p-5
                       transition-all duration-200
                       hover:bg-orange-50/40
                       hover:border-orange-100"
          >
            <ResumeSection
              resumeUrl={profile.resumeUrl}
              onUpload={uploadResume}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
