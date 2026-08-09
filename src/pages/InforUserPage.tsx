import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  UserCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import LoadingLayout from "../components/ui/LoadingLayout";
import {
  getUserInfo,
  updatePassword,
  updateUserInfo,
} from "../services/user.service";

import type { User } from "../models";
import { useAuthStore, useIsLoggedIn } from "../stores/auth.store";

import {
  createContributorApplication,
  getMyContributorApplication,
} from "../services/contributer.service";

import type { ContributorApplication } from "../services/contributer.service";

import toast from "react-hot-toast";
import { logout } from "../services/auth.service";

type MessageState = {
  type: "success" | "error";
  text: string;
};

type ContributorTab = "register" | "status";

const InfoUserPage = () => {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================= */

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [profileMessage, setProfileMessage] = useState<MessageState | null>(
    null,
  );

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  /* =========================
     PASSWORD
  ========================= */

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState<MessageState | null>(
    null,
  );

  /* =========================
     CONTRIBUTOR
  ========================= */

  const [introduction, setIntroduction] = useState("");

  const [submittingApplication, setSubmittingApplication] = useState(false);

  const [applicationMessage, setApplicationMessage] =
    useState<MessageState | null>(null);

  const [contributorTab, setContributorTab] =
    useState<ContributorTab>("register");

  const [contributorApplication, setContributorApplication] =
    useState<ContributorApplication | null>(null);

  const [loadingApplication, setLoadingApplication] = useState(false);

  const isLoggedIn = useIsLoggedIn();

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!isLoggedIn) {
          setLoading(false);
          return;
        }

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

          if (userData.role === "uploader") {
            toast.success("Bạn đã có thể đăng truyện tại TruyenHay.com");
          }
        }
      } catch (err) {
        console.error(err);

        setProfileMessage({
          type: "error",
          text: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [isLoggedIn]);

  /* =========================
     LOAD CONTRIBUTOR APPLICATION
  ========================= */

  const loadContributorApplication = async () => {
    try {
      setLoadingApplication(true);

      const application = await getMyContributorApplication();

      setContributorApplication(application);
    } catch (error) {
      console.error("Không thể tải đơn đăng ký cộng tác viên:", error);
    } finally {
      setLoadingApplication(false);
    }
  };

  /* =========================
     PROFILE
  ========================= */

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setProfileMessage(null);

      await updateUserInfo(profileForm);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: profileForm.name,
              email: profileForm.email,
            }
          : prev,
      );

      setProfileMessage({
        type: "success",
        text: "Cập nhật thông tin thành công.",
      });
    } catch {
      setProfileMessage({
        type: "error",
        text: "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  /* =========================
     PASSWORD
  ========================= */

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
      });

      return;
    }

    try {
      setSavingPassword(true);
      setPasswordMessage(null);

      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage({
        type: "success",
        text: "Đổi mật khẩu thành công.",
      });
    } catch {
      setPasswordMessage({
        type: "error",
        text: "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  /* =========================
     CONTRIBUTOR APPLICATION
  ========================= */

  const handleApplicationSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubmittingApplication(true);
      setApplicationMessage(null);

      await createContributorApplication(introduction);

      setIntroduction("");

      // Lấy lại đơn vừa tạo
      const application = await getMyContributorApplication();

      setContributorApplication(application);

      setApplicationMessage({
        type: "success",
        text: "Đã gửi đơn đăng ký cộng tác viên thành công.",
      });

      // Chuyển sang tab tình trạng
      setContributorTab("status");
    } catch (err) {
      console.error(err);

      setApplicationMessage({
        type: "error",
        text: "Gửi đơn thất bại. Vui lòng thử lại.",
      });
    } finally {
      setSubmittingApplication(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    await logout();
    useAuthStore.getState().logout();
    navigate("/dang-nhap");
  };

  /* =========================
     DATE
  ========================= */

  const joinedDate = user?.createdAt
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "—";

  /* =========================
     CONTRIBUTOR STATUS
  ========================= */

  const getContributorStatusText = () => {
    if (!contributorApplication) {
      return "";
    }

    switch (contributorApplication.status) {
      case "PENDING":
        return "Đang chờ duyệt";

      case "APPROVED":
        return "Đã được duyệt";

      case "REJECTED":
        return "Đã bị từ chối";

      default:
        return "";
    }
  };

  const getContributorStatusClass = () => {
    if (!contributorApplication) {
      return "";
    }

    switch (contributorApplication.status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "";
    }
  };

  return (
    <LoadingLayout loading={loading}>
      <section className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">
            <div className="p-6 lg:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Tài khoản của bạn</p>

                  <h1 className="mt-1 text-2xl font-bold text-white">
                    {user?.name || "Người dùng"}
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    {user?.email || "Đang tải email..."}
                  </p>
                </div>

                {(user?.role === "uploader" || user?.role === "admin") && (
                  <button
                    type="button"
                    onClick={() => navigate("/dang-truyen")}
                    className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Đăng truyện
                  </button>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-orange-400">
                    <ShieldCheck size={16} />
                    <span className="font-medium">Bảo mật tài khoản</span>
                  </div>

                  <p className="mt-2 text-slate-400">
                    Tham gia từ {joinedDate}
                  </p>
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

          {/* =========================
              PROFILE + PASSWORD
          ========================= */}

          <div className="grid gap-6 p-0 lg:grid-cols-[1.1fr_0.9fr]">
            {/* PROFILE */}

            <form
              onSubmit={handleProfileSubmit}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Thông tin cá nhân
                  </h2>

                  <p className="text-sm text-slate-400">
                    Cập nhật tên và email của bạn
                  </p>
                </div>

                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 text-center">
                  Cá nhân
                </span>
              </div>

              {profileMessage && (
                <div
                  className={`mb-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                    profileMessage.type === "success"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300"
                  }`}
                >
                  {profileMessage.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}

                  <span>{profileMessage.text}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Tên hiển thị
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                    <UserCircle2 size={18} className="mr-2 text-slate-500" />

                    <input
                      value={profileForm.name}
                      required
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                    <Mail size={18} className="mr-2 text-slate-500" />

                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
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

            {/* PASSWORD */}

            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5"
            >
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                  Đổi mật khẩu
                </h2>

                <p className="text-sm text-slate-400">
                  Bảo vệ tài khoản bằng mật khẩu mới
                </p>
              </div>

              {passwordMessage && (
                <div
                  className={`mb-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                    passwordMessage.type === "success"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}

                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Mật khẩu hiện tại
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                    <Lock size={18} className="mr-2 text-slate-500" />

                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      required
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="ml-2 text-slate-400 transition hover:text-white"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Mật khẩu mới
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                    <Lock size={18} className="mr-2 text-slate-500" />

                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      required
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="Nhập mật khẩu mới"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="ml-2 text-slate-400 transition hover:text-white"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Xác nhận mật khẩu
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-3">
                    <Lock size={18} className="mr-2 text-slate-500" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      required
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="Nhập lại mật khẩu mới"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="ml-2 text-slate-400 transition hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
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

          {/* =========================
              CONTRIBUTOR APPLICATION
          ========================= */}

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Đăng ký cộng tác viên
              </h2>

              <p className="text-sm text-slate-400">
                Gửi đơn để trở thành cộng tác viên của hệ thống.
              </p>
            </div>

            {/* TABS */}

            <div className="mb-6 flex border-b border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setContributorTab("register");
                  setApplicationMessage(null);
                }}
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  contributorTab === "register"
                    ? "text-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Đăng ký
                {contributorTab === "register" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setContributorTab("status");
                  void loadContributorApplication();
                }}
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  contributorTab === "status"
                    ? "text-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tình trạng đơn
                {contributorApplication?.status === "PENDING" && (
                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                )}
                {contributorTab === "status" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500" />
                )}
              </button>
            </div>

            {/* =========================
                TAB ĐĂNG KÝ
            ========================= */}

            {contributorTab === "register" && (
              <form onSubmit={handleApplicationSubmit}>
                {applicationMessage && (
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                      applicationMessage.type === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/40 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {applicationMessage.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}

                    <span>{applicationMessage.text}</span>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Giới thiệu bản thân
                  </label>

                  <textarea
                    required
                    rows={6}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    placeholder="Ví dụ: Tôi có kinh nghiệm dịch truyện, biên tập nội dung hoặc mong muốn đóng góp cho cộng đồng..."
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingApplication}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShieldCheck size={18} />

                  {submittingApplication ? "Đang gửi..." : "Gửi đơn đăng ký"}
                </button>
              </form>
            )}

            {/* =========================
                TAB TÌNH TRẠNG
            ========================= */}

            {contributorTab === "status" && (
              <div>
                {loadingApplication ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-600 border-t-orange-500" />

                    <span className="ml-3 text-sm text-slate-400">
                      Đang tải tình trạng đơn...
                    </span>
                  </div>
                ) : !contributorApplication ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-8 text-center">
                    <ShieldCheck size={36} className="mx-auto text-slate-600" />

                    <p className="mt-3 text-sm text-slate-300">
                      Bạn chưa gửi đơn đăng ký cộng tác viên.
                    </p>

                    <button
                      type="button"
                      onClick={() => setContributorTab("register")}
                      className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* STATUS */}

                    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {contributorApplication.status === "PENDING" && (
                            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
                              <Clock3 size={22} />
                            </div>
                          )}

                          {contributorApplication.status === "APPROVED" && (
                            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                              <CheckCircle2 size={22} />
                            </div>
                          )}

                          {contributorApplication.status === "REJECTED" && (
                            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                              <XCircle size={22} />
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-slate-400">
                              Trạng thái đơn
                            </p>

                            <p className="mt-1 font-semibold text-white">
                              {getContributorStatusText()}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${getContributorStatusClass()}`}
                        >
                          {contributorApplication.status}
                        </span>
                      </div>

                      {contributorApplication.status === "PENDING" && (
                        <p className="mt-4 text-sm leading-6 text-slate-400">
                          Đơn đăng ký của bạn đang được quản trị viên xem xét.
                          Vui lòng chờ phản hồi.
                        </p>
                      )}

                      {contributorApplication.status === "APPROVED" && (
                        <p className="mt-4 text-sm leading-6 text-emerald-300/80">
                          Chúc mừng! Bạn đã trở thành cộng tác viên. Bạn có thể
                          bắt đầu đăng truyện trên hệ thống.
                        </p>
                      )}

                      {contributorApplication.status === "REJECTED" && (
                        <p className="mt-4 text-sm leading-6 text-red-300/80">
                          Đơn đăng ký của bạn chưa được chấp thuận. Bạn có thể
                          xem lý do từ chối bên dưới.
                        </p>
                      )}
                    </div>

                    {/* INTRODUCTION */}

                    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
                      <p className="mb-3 text-sm font-medium text-slate-300">
                        Nội dung đơn đăng ký
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {contributorApplication.introduction ||
                          "Không có nội dung."}
                      </p>
                    </div>

                    {/* REJECTION REASON */}

                    {contributorApplication.status === "REJECTED" &&
                      contributorApplication.rejectionReason && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                          <div className="flex items-center gap-2 text-red-300">
                            <XCircle size={18} />

                            <p className="text-sm font-medium">Lý do từ chối</p>
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-200/80">
                            {contributorApplication.rejectionReason}
                          </p>
                        </div>
                      )}

                    {/* DATE */}

                    <div className="flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:justify-between">
                      <span>
                        Ngày gửi:{" "}
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(contributorApplication.createdAt))}
                      </span>

                      {contributorApplication.reviewedAt && (
                        <span>
                          Ngày xử lý:{" "}
                          {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(
                            new Date(contributorApplication.reviewedAt),
                          )}
                        </span>
                      )}
                    </div>

                    {/* RE-SUBMIT */}

                    {contributorApplication.status === "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => {
                          setIntroduction(
                            contributorApplication.introduction || "",
                          );

                          setApplicationMessage(null);
                          setContributorTab("register");
                        }}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Gửi lại đơn
                      </button>
                    )}

                    {/* APPROVED */}

                    {contributorApplication.status === "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => navigate("/dang-truyen")}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Bắt đầu đăng truyện
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </LoadingLayout>
  );
};

export default InfoUserPage;
