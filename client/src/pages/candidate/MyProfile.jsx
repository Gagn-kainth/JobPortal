import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    api.get("/auth/profile").then((res) => setProfile(res.data.user));
  }, []);

  const saveDetails = async () => {
    try {
      await api.put("/auth/details", { skills: profile.skills });
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setProfile({
      ...profile,
      skills: [...(profile.skills || []), skillInput.trim()],
    });
    setSkillInput("");
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

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="bg-white rounded-xl p-6 mt-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Basic Info</h3>
          <p className="text-sm text-gray-500">
            {profile.name} · {profile.email}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {(profile.skills || []).map((skill, i) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              className="border rounded-lg px-3 py-2 text-sm flex-1"
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Resume</h3>
          <input type="file" accept=".pdf,.doc,.docx" onChange={uploadResume} />
        </div>

        <Button onClick={saveDetails}>Save Changes</Button>
      </div>
    </div>
  );
};

export default MyProfile;
