import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  BookMarked,
  UserCheck,
  Clock,
  Eye,
  Loader2,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import {
  getDashboardStats,
  type DashboardStats,
} from "../../services/admin.service";

import { useAuthStore } from "../../stores/auth.store";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAuthStore((state) => state.user);

  const checkPower =
    user?.role === "admin";

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardStats();

        setStats(response.result);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // =========================
  // Không có quyền
  // =========================

  if (!checkPower) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-center">
          <h2 className="text-lg font-semibold text-red-300">
            Bạn không có quyền truy cập
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Chỉ admin mới có quyền truy cập vào trang này
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Đang tải thống kê...
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // =========================
  // Stat cards
  // =========================

  const statCards = [
    {
      title: "Người dùng",
      value: stats.totalUsers,
      icon: Users,
      description: "Tổng số tài khoản",
    },
    {
      title: "Truyện",
      value: stats.totalStories,
      icon: BookOpen,
      description: "Tổng số truyện",
    },
    {
      title: "Chapter",
      value: stats.totalChapters,
      icon: BookMarked,
      description: "Tổng số chapter",
    },
    {
      title: "Cộng tác viên",
      value: stats.totalContributors,
      icon: UserCheck,
      description: "Đang là uploader",
    },
    {
      title: "Đơn chờ duyệt",
      value: stats.pendingApplications,
      icon: Clock,
      description: "Đơn đăng ký cộng tác viên",
    },
    {
      title: "Lượt xem",
      value: stats.totalViews,
      icon: Eye,
      description: "Tổng lượt xem truyện",
    },
  ];

  // =========================
  // Chart - Truyện đăng
  // =========================

  const storyChartData = {
    labels: stats.storyStats.map((item) => item.date),

    datasets: [
      {
        label: "Truyện đăng",
        data: stats.storyStats.map((item) => item.count),

        tension: 0.3,
        borderColor: "#3b82f6",
        borderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,
      },
    ],
  };

  // =========================
  // Chart - Lượt đọc
  // =========================

  const viewChartData = {
    labels: stats.viewStats.map((item) => item.date),

    datasets: [
      {
        label: "Lượt đọc",
        data: stats.viewStats.map((item) => item.count),

        tension: 0.3,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,
      },
    ],
  };

  // =========================
  // Chart options
  // =========================

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
        },
      },

      tooltip: {
        mode: "index" as const,

        intersect: false,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#64748b",
        },

        grid: {
          color: "rgba(148, 163, 184, 0.08)",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#64748b",
        },

        grid: {
          color: "rgba(148, 163, 184, 0.08)",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <p className="text-sm font-medium text-blue-400">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Tổng quan hoạt động của hệ thống.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {item.value.toLocaleString()}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Truyện đăng trong tuần */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Truyện đăng trong 7 ngày
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Số lượng truyện được đăng theo từng ngày.
            </p>
          </div>

          <div className="h-72">
            <Line
              data={storyChartData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Lượt đọc trong tuần */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Lượt đọc trong 7 ngày
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Số lượt đọc truyện theo từng ngày.
            </p>
          </div>

          <div className="h-72">
            <Line
              data={viewChartData}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* ================= PENDING APPLICATIONS ================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Đơn đăng ký cộng tác viên
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Các đơn đang chờ quản trị viên xử lý.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-4xl font-bold text-white">
            {stats.pendingApplications}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            đơn đang chờ duyệt
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;