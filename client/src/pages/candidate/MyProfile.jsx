import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import {
  Camera,
  Plus,
  X,
  GraduationCap,
  Code2,
  Link2,
  Globe,
  Phone,
  MapPin,
  Mail,
  User,
  FileText,
} from "lucide-react";
const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [schoolInput, setSchoolInput] = useState({
    school: "",
    degree: "",
    year: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data.user);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveDetails = async () => {
    try {
      const {
        skills,
        education,
        bio,
        phone,
        location,
        linkedin,
        portfolio,
        github,
      } = profile;
      await api.put("/auth/details", {
        skills,
        education,
        bio,
        phone,
        location,
        linkedin,
        portfolio,
        github,
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProfile((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()],
    }));
    setSkillInput("");
  };

  const removeSkill = (index) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addSchool = () => {
    if (!schoolInput.school.trim()) return;
    setProfile((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...schoolInput }],
    }));
    setSchoolInput({ school: "", degree: "", year: "" });
  };

  const removeSchool = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post("/auth/resume", formData);
      toast.success("Resume uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      await api.post("/auth/avatar", formData);
      toast.success("Photo updated");
      fetchProfile();
    } catch {
      toast.error("Photo upload failed");
    }
  };

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
          <p className="text-sm text-gray-500 mt-1">
            Keep your profile up to date
          </p>
        </div>
        <button
          onClick={() => (isEditing ? saveDetails() : setIsEditing(true))}
          className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
            isEditing
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with Avatar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar
                name={profile.name}
                imageUrl={
                  profile.profilePic
                    ? `${import.meta.env.VITE_API_URL}${profile.profilePic}`
                    : null
                }
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
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{profile.name}</h2>
              <p className="text-sm text-gray-500">
                {profile.bio
                  ? profile.bio.slice(0, 60) + "..."
                  : "Add a bio to tell recruiters about yourself"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.email || ""}
                    disabled
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-100 text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Phone number"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, State"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Bio
              </label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!isEditing}
                placeholder="Tell recruiters about yourself..."
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 resize-none"
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Online Presence
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  LinkedIn
                </label>
                <div className="relative">
                  <Link2
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    disabled={!isEditing}
                    placeholder="linkedin.com/in/username"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Portfolio
                </label>
                <div className="relative">
                  <Globe
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.portfolio || ""}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    disabled={!isEditing}
                    placeholder="yoursite.com"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  GitHub
                </label>
                <div className="relative">
                  <Code2
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={profile.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    disabled={!isEditing}
                    placeholder="github.com/username"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Education
            </h3>
            <div className="space-y-3">
              {(profile.education || []).map((edu, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <GraduationCap size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {edu.school}
                      </p>
                      <p className="text-xs text-gray-500">
                        {edu.degree} · {edu.year}
                      </p>
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeSchool(i)}
                      className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-3 p-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={schoolInput.school}
                    onChange={(e) =>
                      setSchoolInput((p) => ({ ...p, school: e.target.value }))
                    }
                    placeholder="School/University"
                    className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    value={schoolInput.degree}
                    onChange={(e) =>
                      setSchoolInput((p) => ({ ...p, degree: e.target.value }))
                    }
                    placeholder="Degree"
                    className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    value={schoolInput.year}
                    onChange={(e) =>
                      setSchoolInput((p) => ({ ...p, year: e.target.value }))
                    }
                    placeholder="Year"
                    className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
                <button
                  onClick={addSchool}
                  className="mt-2 flex items-center gap-1.5 text-xs text-orange-500 font-medium hover:text-orange-600"
                >
                  <Plus size={14} /> Add Education
                </button>
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {(profile.skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(i)}
                      className="ml-0.5 hover:text-orange-800"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill and press Enter"
                  className="h-10 px-3 rounded-lg border border-gray-200 text-sm flex-1 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                />
                <Button onClick={addSkill} className="h-10">
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Resume */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Resume
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <FileText size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {profile.resumeUrl
                      ? "Resume uploaded"
                      : "No resume on file"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {profile.resumeUrl
                      ? "PDF or DOCX"
                      : "Upload your latest resume"}
                  </p>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={uploadResume}
                  className="hidden"
                />
                <span className="h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center">
                  {profile.resumeUrl ? "Replace" : "Upload"}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
