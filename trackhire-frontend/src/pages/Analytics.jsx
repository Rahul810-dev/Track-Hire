import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import api from "../api/axios";

const STATUS_COLORS = {
  Applied: "#F59E0B",
  "OA Round": "#7C3AED",
  Interview: "#10B981",
  Offer: "#059669",
  Rejected: "#EF4444",
};

const INSIGHT_ICONS = ["✦", "↗", "◎", "⚡"];

function Analytics() {
  const [insights, setInsights] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    try {
      setLoading(true);
      const res = await api.get("/insights");
      setInsights(res.data.insights || [res.data.insight]);
      setStatusCounts(res.data.statusCounts || {});
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setInsights(["Failed to load insights. Try again later."]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ name: status, value: count }));

  return (
    <div className="min-h-screen bg-[#F3F1FB] dark:bg-gray-900 p-8 transition-colors page-fade">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personalized analysis of your application patterns</p>
        </div>
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Refresh Insights"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" />
          </svg>
          Analyzing your application data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:col-span-1">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Status Breakdown</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{total} total applications</p>

            {total === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 py-12 text-center">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.name] || "#9CA3AF"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Insight cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                  {INSIGHT_ICONS[i % INSIGHT_ICONS.length]}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;