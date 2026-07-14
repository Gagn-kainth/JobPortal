import { useState } from "react";
import { GraduationCap, X, Plus } from "lucide-react";

const EducationSection = ({ education, isEditing, onAdd, onRemove }) => {
  const [schoolInput, setSchoolInput] = useState({ school: "", degree: "", year: "" });

  const handleAdd = () => {
    onAdd(schoolInput);
    setSchoolInput({ school: "", degree: "", year: "" });
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Education</h3>
      <div className="space-y-3">
        {(education || []).map((edu, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.degree} · {edu.year}</p>
              </div>
            </div>
            {isEditing && (
              <button onClick={() => onRemove(i)} className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="mt-3 p-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
          <div className="grid grid-cols-3 gap-2">
            <input value={schoolInput.school} onChange={(e) => setSchoolInput((p) => ({ ...p, school: e.target.value }))} placeholder="School/University" className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400" />
            <input value={schoolInput.degree} onChange={(e) => setSchoolInput((p) => ({ ...p, degree: e.target.value }))} placeholder="Degree" className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400" />
            <input value={schoolInput.year} onChange={(e) => setSchoolInput((p) => ({ ...p, year: e.target.value }))} placeholder="Year" className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <button onClick={handleAdd} className="mt-2 flex items-center gap-1.5 text-xs text-orange-500 font-medium hover:text-orange-600">
            <Plus size={14} /> Add Education
          </button>
        </div>
      )}
    </div>
  );
};

export default EducationSection;