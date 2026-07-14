import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, LogOut, Mail, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import LoadingLayout from "../components/ui/LoadingLayout";
import { getUserInfo, updatePassword, updateUserInfo } from "../services/user.service";
import type { User } from "../models";

type MessageState = {
  type: "success" | "error";
  text: string;
};

const InfoUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileMessage, setProfileMessage] = useState<MessageState | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<MessageState | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setProfileMessage(null);
        const response = await getUserInfo();
        const userData = response?.result;

        if (userData) {
          setUser(userData);
          setProfileForm({
            name: userData.name || "",
            email: userData.email || "",
          });
        }
      } catch {
        setProfileMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setProfileMessage(null);
      await updateUserInfo(profileForm);
      setUser((prev) => (prev ? { ...prev, name: profileForm.name, email: profileForm.email } : prev));
      setProfileMessage({ type: "success", text: "Cập nhật thông tin thành công." });
      
    } catch {
      setProfileMessage({ type: "error", text: "Cập nhật thông tin thất bại. Vui lòng thử lại." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordMessage(null);
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công." });
    } catch {
      setPasswordMessage({ type: "error", text: "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại." });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/dang-nhap");
  };

  const joinedDate = user?.createdAt
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "—";

  return (
    <LoadingLayout loading={loading}>
      <section className="min-h-[calc(100vh-160px)] bg-slate-900 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-800/80 shadow-2xl shadow-black/20">
            <div className="border-b border-slate-700 bg-linear-to-r from-orange-500/20 via-slate-800 to-slate-800 px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30">
                    <UserCircle2 size={34} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Tài khoản của bạn</p>
                    <h1 className="text-2xl font-semibold text-white">{user?.name || "Người dùng"}</h1>
                    <p className="mt-1 text-sm text-slate-400">{user?.email || "Đang tải email..."}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2 text-orange-400">
                      <ShieldCheck size={16} />
                      <span className="font-medium">Bảo mật tài khoản</span>
                    </div>
                    <p className="mt-2 text-slate-400">Tham gia từ {joinedDate}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            

            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Thông tin cá nhân</h2>
                    <p className="text-sm text-slate-400">Cập nhật tên và email của bạn</p>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 text-center">
                    Cá nhân
                  </span>
                </div>

                {profileMessage && (
                    <div
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm mb-3 ${
                        profileMessage.type === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/40 bg-red-500/10 text-red-300"
                    }`}
                    >
                    {profileMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{profileMessage.text}</span>
                    </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Tên hiển thị</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                      <UserCircle2 size={18} className="mr-2 text-slate-500" />
                      <input
                        value={profileForm.name}
                        required
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Nhập tên của bạn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                      <Mail size={18} className="mr-2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>

              <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-white">Đổi mật khẩu</h2>
                  <p className="text-sm text-slate-400">Bảo vệ tài khoản bằng mật khẩu mới</p>
                </div>

                {passwordMessage && (
                    <div
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm mb-3 ${
                        passwordMessage.type === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/40 bg-red-500/10 text-red-300"
                    }`}
                    >
                    {passwordMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{passwordMessage.text}</span>
                    </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Mật khẩu hiện tại</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                      <Lock size={18} className="mr-2 text-slate-500" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        required
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="ml-2 text-slate-400 transition hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Mật khẩu mới</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                      <Lock size={18} className="mr-2 text-slate-500" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        required
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="ml-2 text-slate-400 transition hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Xác nhận mật khẩu</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                      <Lock size={18} className="mr-2 text-slate-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        required
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="ml-2 text-slate-400 transition hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lock size={16} />
                  {savingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LoadingLayout>
  );
};

export default InfoUserPage;