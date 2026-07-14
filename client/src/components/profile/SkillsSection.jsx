import { useState } from "react";
import { X } from "lucide-react";
import Button from "../Button";

const SkillsSection = ({ skills, isEditing, onAdd, onRemove }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleAdd = () => {
    onAdd(skillInput);
    setSkillInput("");
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Skills</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {(skills || []).map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-medium">
            {skill}
            {isEditing && (
              <button onClick={() => onRemove(i)} className="ml-0.5 hover:text-orange-800">
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
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a skill and press Enter"
            className="h-10 px-3 rounded-lg border border-gray-200 text-sm flex-1 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
          />
          <Button onClick={handleAdd} className="h-10">Add</Button>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;