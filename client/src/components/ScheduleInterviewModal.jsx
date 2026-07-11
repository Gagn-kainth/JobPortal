import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Button from "./Button";

const ScheduleInterviewModal = ({ application, onClose, onScheduled }) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [mode, setMode] = useState("Video");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/interviews", {
        applicationId: application._id,
        scheduledAt,
        mode,
        notes,
      });
      toast.success("Interview scheduled, candidate notified");
      onScheduled();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to schedule");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Schedule Interview</h3>
        <p className="text-sm text-gray-500">
          {application.candidate?.name} — {application.job?.title}
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option>Video</option>
            <option>Phone</option>
            <option>In-person</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit">Schedule</Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterviewModal;