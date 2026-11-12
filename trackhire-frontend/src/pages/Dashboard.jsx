import { useState, useEffect } from "react";
import api from "../api/axios";
import AddApplicationModal from "../components/AddApplicationModal";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const { showToast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const requestDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/applications/${confirmDeleteId}`);
      fetchApplications();
      showToast("Application deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete application", "error");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    const map = {
      Applied: "bg-amber-100 text-amber-700",
      "OA Round": "bg-purple-100 text-purple-700",
      Interview: "bg-emerald-100 text-emerald-700",
      Offer: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F3F1FB] dark:bg-gray-900 p-8 transition-colors page-fade">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button
          onClick={() => { setEditingApp(null); setModalOpen(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add Application
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Applied</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Interviews</p>
          <p className="text-2xl font-bold text-emerald-600">
            {applications.filter((a) => a.status === "Interview").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Offers</p>
          <p className="text-2xl font-bold text-green-700">
            {applications.filter((a) => a.status === "Offer").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Rejected</p>
          <p className="text-2xl font-bold text-red-500">
            {applications.filter((a) => a.status === "Rejected").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-6 py-3">Company</th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-6 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-6 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-6 py-3">Date Applied</th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.company}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{app.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {new Date(app.date_applied).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => { setEditingApp(app); setModalOpen(true); }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                  onClick={() => requestDelete(app.id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  Delete
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchApplications}
        editingApp={editingApp}
      />
      <ConfirmDialog
        isOpen={confirmDeleteId !== null}
        title="Delete application?"
        message="This action can't be undone. Are you sure you want to delete this application?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default Dashboard;
