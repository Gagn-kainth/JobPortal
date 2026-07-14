import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data.user);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveDetails = async () => {
    try {
      const { skills, education, bio, phone, location, linkedin, portfolio, github } = profile;
      await api.put("/auth/details", { skills, education, bio, phone, location, linkedin, portfolio, github });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const addSkill = (skill) => {
    if (!skill.trim()) return;
    setProfile((prev) => ({ ...prev, skills: [...(prev.skills || []), skill.trim()] }));
  };

  const removeSkill = (index) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addSchool = (school) => {
    if (!school.school.trim()) return;
    setProfile((prev) => ({ ...prev, education: [...(prev.education || []), { ...school }] }));
  };

  const removeSchool = (index) => {
    setProfile((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post("/auth/resume", formData);
      toast.success("Resume uploaded");
      fetchProfile();
    } catch {
      toast.error("Upload failed");
    }
  };

  const uploadAvatar = async (file) => {
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

  return {
    profile, isEditing, setIsEditing, handleChange, saveDetails,
    addSkill, removeSkill, addSchool, removeSchool, uploadResume, uploadAvatar,
  };
};