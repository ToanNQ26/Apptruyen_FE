import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { logout as logoutApi } from "../../services/auth.service";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logoutApi(); 
    clearAuth();
    navigate("/dang-nhap");
  };

  const menuItems = [
    {
      label: "Dashboard",
      to: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Người dùng",
      to: "/admin/users",
      icon: Users,
    },
    {
      label: "Quản lý truyện",
      to: "/admin/stories",
      icon: BookOpen,
    },
    {
      label: "Duyệt cộng tác viên",
      to: "/admin/contributor-applications",
      icon: UserCheck,
    },
  ];


  

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-3">
          <p className="text-sm font-semibold text-white">
            Admin Panel
          </p>

          <p className="text-xs text-slate-500">
            Quản trị hệ thống
          </p>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div>
            <h1 className="font-semibold text-white">
              Admin Panel
            </h1>

            <p className="text-xs text-slate-500">
              Quản trị hệ thống
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin info */}
        <div className="border-b border-slate-800 p-4">
          <div className="rounded-xl bg-slate-800/70 px-3 py-3">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || "Administrator"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {user?.email}
            </p>

            <span className="mt-2 inline-flex rounded-md bg-orange-500/10 px-2 py-1 text-[11px] font-medium text-orange-400">
              Administrator
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Quản lý
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang truyện
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;