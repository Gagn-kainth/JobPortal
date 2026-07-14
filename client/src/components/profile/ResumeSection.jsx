import { FileText } from "lucide-react";

const ResumeSection = ({ resumeUrl, onUpload }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resume</h3>
    <div className="flex items-center gap-4">
      <div className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
          <FileText size={18} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{resumeUrl ? "Resume uploaded" : "No resume on file"}</p>
          <p className="text-xs text-gray-400">{resumeUrl ? "PDF or DOCX" : "Upload your latest resume"}</p>
        </div>
      </div>
      <label className="cursor-pointer">
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} className="hidden" />
        <span className="h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center">
          {resumeUrl ? "Replace" : "Upload"}
        </span>
      </label>
    </div>
  </div>
);

export default ResumeSection;