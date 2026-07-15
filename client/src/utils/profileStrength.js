export const calculateProfileStrength = (profile) => {
    const checks = [
      { key: "basicInfo", label: "Basic Info", done: !!(profile.name && profile.email && profile.phone) },
      { key: "bio", label: "Bio", done: !!profile.bio },
      { key: "location", label: "Location", done: !!profile.location },
      { key: "skills", label: "Skills & Tags", done: (profile.skills || []).length > 0 },
      { key: "education", label: "Education", done: (profile.education || []).length > 0 },
      { key: "resume", label: "Resume Upload", done: !!profile.resumeUrl },
      { key: "profilePic", label: "Profile Photo", done: !!profile.profilePic },
      { key: "portfolio", label: "Portfolio Link", done: !!(profile.portfolio || profile.linkedin || profile.github) },
    ];
  
    const completedCount = checks.filter((c) => c.done).length;
    const percent = Math.round((completedCount / checks.length) * 100);
  
    return { checks, percent };
  };