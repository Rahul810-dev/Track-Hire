import { useState, useEffect } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

function AddApplicationModal({ isOpen, onClose, onSuccess, editingApp }) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    date_applied: new Date().toISOString().split("T")[0],
    company_type: "",
    notes: "",
  });

  useEffect(() => {
    if (editingApp) {
      setForm({
        company: editingApp.company || "",
        role: editingApp.role || "",
        status: editingApp.status || "Applied",
        date_applied: editingApp.date_applied?.split("T")[0] || "",
        company_type: editingApp.company_type || "",
        notes: editingApp.notes || "",
      });
    } else {
      setForm({
        company: "",
        role: "",
        status: "Applied",
        date_applied: new Date().toISOString().split("T")[0],
        company_type: "",
        notes: "",
      });
    }
  }, [editingApp, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!form.company.trim()) return;
    try {
      if (editingApp) {
        await api.put(`/applications/${editingApp.id}`, form);
        showToast("Application updated");
      } else {
        await api.post("/applications", form);
        showToast("Application added");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to save application", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[480px] shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {editingApp ? "Edit Application" : "Add Application"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="company"
            placeholder="Company *"
            value={form.company}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Applied</option>
            <option>OA Round</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input
            name="date_applied"
            type="date"
            value={form.date_applied}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="company_type"
            placeholder="Company Type"
            value={form.company_type}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddApplicationModal;