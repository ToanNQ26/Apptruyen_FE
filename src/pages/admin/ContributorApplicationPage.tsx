import { useEffect, useState } from "react";
import {
  Check,
  X,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Mail,
  CalendarDays,
  FileText,
  AlertCircle,
} from "lucide-react";

import {
  getContributorApplications,
  getContributorApplicationById,
  approveContributorApplication,
  rejectContributorApplication,
  type ContributorApplication,
  type ContributorApplicationStatus,
} from "../../services/contributer.service";

/**
 * =========================
 * STATUS CONFIG
 * =========================
 */

const statusConfig: Record<
  ContributorApplicationStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Chờ duyệt",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },

  APPROVED: {
    label: "Đã duyệt",
    className: "border-green-500/20 bg-green-500/10 text-green-400",
  },

  REJECTED: {
    label: "Từ chối",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

/**
 * =========================
 * PAGE
 * =========================
 */

const ContributorApplicationsPage = () => {
  const [applications, setApplications] = useState<ContributorApplication[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState<ContributorApplicationStatus | "">(
    "PENDING",
  );

  /**
   * Chi tiết đơn
   */
  const [selectedApplication, setSelectedApplication] =
    useState<ContributorApplication | null>(null);

  const [loadingDetail, setLoadingDetail] = useState(false);

  /**
   * Loading khi approve/reject
   */
  const [processing, setProcessing] = useState(false);

  /**
   * Modal xác nhận duyệt
   */
  const [showApproveModal, setShowApproveModal] = useState(false);

  /**
   * Modal từ chối
   */
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");

  /**
   * =========================
   * LOAD APPLICATIONS
   * =========================
   */

  const loadApplications = async () => {
    try {
      setLoading(true);

      const result = await getContributorApplications({
        page,
        limit,
        status: status || undefined,
      });

      setApplications(result.applications);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn đăng ký:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [page, status]);

  /**
   * =========================
   * VIEW DETAIL
   * =========================
   */

  const handleViewDetail = async (id: string) => {
    try {
      setLoadingDetail(true);

      const application = await getContributorApplicationById(id);

      setSelectedApplication(application);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn đăng ký:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * =========================
   * APPROVE
   * =========================
   */

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      setProcessing(true);

      await approveContributorApplication(selectedApplication._id);

      setShowApproveModal(false);
      setSelectedApplication(null);

      await loadApplications();
    } catch (error) {
      console.error("Lỗi khi duyệt đơn:", error);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * =========================
   * REJECT
   * =========================
   */

  const handleReject = async () => {
    if (!selectedApplication) return;

    const reason = rejectionReason.trim();

    if (!reason) return;

    try {
      setProcessing(true);

      await rejectContributorApplication(selectedApplication._id, reason);

      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason("");

      await loadApplications();
    } catch (error) {
      console.error("Lỗi khi từ chối đơn:", error);
    } finally {
      setProcessing(false);
    }
  };

  /**
   * =========================
   * STATUS
   * =========================
   */

  const handleStatusChange = (value: ContributorApplicationStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  /**
   * =========================
   * FORMAT DATE
   * =========================
   */

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * =========================
   * CLOSE DETAIL
   * =========================
   */

  const closeDetail = () => {
    if (processing) return;

    setSelectedApplication(null);
  };

  /**
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Duyệt cộng tác viên
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Quản lý và xét duyệt đơn đăng ký cộng tác viên.
            </p>
          </div>

          <select
            value={status}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as ContributorApplicationStatus | "",
              )
            }
            className="
              rounded-xl
              border border-slate-700
              bg-slate-800
              px-4 py-2.5
              text-sm text-slate-200
              outline-none
              transition
              hover:border-slate-600
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          >
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
            <option value="">Tất cả</option>
          </select>
        </div>

        {/* =====================================================
            APPLICATION LIST
        ====================================================== */}

        <div className="space-y-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                <FileText className="h-6 w-6 text-slate-500" />
              </div>

              <p className="text-sm font-medium text-slate-300">
                Không có đơn đăng ký
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Hiện chưa có đơn nào ở trạng thái này.
              </p>
            </div>
          ) : (
            applications.map((application) => {
              const user =
                typeof application.userId === "object"
                  ? application.userId
                  : null;

              const config = statusConfig[application.status];

              return (
                <div
                  key={application._id}
                  className="
                    rounded-2xl
                    border border-slate-800
                    bg-slate-900
                    p-4
                    shadow-lg
                    transition
                    hover:border-slate-700
                    hover:bg-slate-900/80
                    sm:p-5
                  "
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* USER */}

                    <div className="flex min-w-0 items-center gap-4">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-slate-800"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800">
                          <UserRound className="h-5 w-5 text-slate-500" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-sm font-semibold text-slate-100">
                            {user?.name || "Người dùng"}
                          </h2>

                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5 py-1
                              text-[11px]
                              font-medium
                              ${config.className}
                            `}
                          >
                            {config.label}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />

                            {user?.email || "—"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* INTRODUCTION */}

                    <div className="hidden max-w-md flex-1 lg:block">
                      <p className="mb-1 text-xs font-medium text-slate-500">
                        Giới thiệu
                      </p>

                      <p className="truncate text-sm text-slate-400">
                        {application.introduction ||
                          "Không có nội dung giới thiệu."}
                      </p>
                    </div>

                    {/* ACTION */}

                    <button
                      onClick={() => handleViewDetail(application._id)}
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border border-slate-700
                        bg-slate-800
                        px-4 py-2.5
                        text-sm
                        font-medium
                        text-slate-200
                        transition
                        hover:border-slate-600
                        hover:bg-slate-700
                      "
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {!loading && applications.length > 0 && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 shadow-lg">
            <p className="text-xs text-slate-500 sm:text-sm">
              Trang <span className="font-medium text-slate-300">{page}</span> /{" "}
              <span className="font-medium text-slate-300">{totalPages}</span>
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  border border-slate-700
                  bg-slate-800
                  text-slate-400
                  transition
                  hover:bg-slate-700
                  hover:text-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  border border-slate-700
                  bg-slate-800
                  text-slate-400
                  transition
                  hover:bg-slate-700
                  hover:text-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          DETAIL MODAL
      ====================================================== */}

      {(selectedApplication || loadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            {loadingDetail ? (
              <div className="flex h-72 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
              </div>
            ) : selectedApplication ? (
              <>
                {/* MODAL HEADER */}

                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Chi tiết đơn đăng ký
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Thông tin người đăng ký và nội dung đơn.
                    </p>
                  </div>

                  <button
                    onClick={closeDetail}
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      text-slate-500
                      transition
                      hover:bg-slate-800
                      hover:text-slate-200
                    "
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* MODAL BODY */}

                <div className="space-y-6 px-6 py-6">
                  {(() => {
                    const user =
                      typeof selectedApplication.userId === "object"
                        ? selectedApplication.userId
                        : null;

                    const config = statusConfig[selectedApplication.status];

                    return (
                      <>
                        {/* USER */}

                        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-800"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                              <UserRound className="h-6 w-6 text-slate-500" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-100">
                              {user?.name || "Người dùng"}
                            </h3>

                            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                              <Mail className="h-3.5 w-3.5" />

                              {user?.email || "—"}
                            </p>
                          </div>

                          <div className="ml-auto">
                            <span
                              className={`
                                rounded-full
                                border
                                px-3 py-1.5
                                text-xs
                                font-medium
                                ${config.className}
                              `}
                            >
                              {config.label}
                            </span>
                          </div>
                        </div>

                        {/* DATE */}

                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <CalendarDays className="h-4 w-4 text-slate-500" />

                          <span>
                            Ngày đăng ký:{" "}
                            <span className="font-medium text-slate-300">
                              {formatDate(selectedApplication.createdAt)}
                            </span>
                          </span>
                        </div>

                        {/* INTRODUCTION */}

                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />

                            <p className="text-sm font-medium text-slate-300">
                              Nội dung giới thiệu
                            </p>
                          </div>

                          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
                              {selectedApplication.introduction ||
                                "Không có nội dung."}
                            </p>
                          </div>
                        </div>

                        {/* REJECTION REASON */}

                        {selectedApplication.status === "REJECTED" &&
                          selectedApplication.rejectionReason && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400" />

                                <p className="text-sm font-medium text-red-400">
                                  Lý do từ chối
                                </p>
                              </div>

                              <p className="whitespace-pre-wrap text-sm leading-6 text-red-400/80">
                                {selectedApplication.rejectionReason}
                              </p>
                            </div>
                          )}
                      </>
                    );
                  })()}
                </div>

                {/* MODAL FOOTER */}

                {selectedApplication.status === "PENDING" && (
                  <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
                    <button
                      disabled={processing}
                      onClick={() => {
                        setRejectionReason("");
                        setShowRejectModal(true);
                      }}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border border-red-500/20
                        bg-red-500/5
                        px-4 py-2.5
                        text-sm
                        font-medium
                        text-red-400
                        transition
                        hover:bg-red-500/10
                        disabled:opacity-50
                      "
                    >
                      <X className="h-4 w-4" />
                      Từ chối
                    </button>

                    <button
                      disabled={processing}
                      onClick={() => setShowApproveModal(true)}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4 py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-500
                        disabled:opacity-50
                      "
                    >
                      <Check className="h-4 w-4" />
                      Duyệt đơn
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* =====================================================
          APPROVE CONFIRM MODAL
      ====================================================== */}

      {showApproveModal && selectedApplication && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <Check className="h-6 w-6 text-blue-400" />
              </div>

              <h2 className="text-center text-lg font-semibold text-white">
                Duyệt đơn đăng ký?
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-slate-400">
                Sau khi duyệt, người dùng sẽ được cấp quyền cộng tác viên và có
                thể đăng truyện.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button
                disabled={processing}
                onClick={() => setShowApproveModal(false)}
                className="
                  rounded-xl
                  border border-slate-700
                  bg-slate-800
                  px-4 py-2.5
                  text-sm
                  font-medium
                  text-slate-300
                  transition
                  hover:bg-slate-700
                  disabled:opacity-50
                "
              >
                Hủy
              </button>

              <button
                disabled={processing}
                onClick={handleApprove}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4 py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-500
                  disabled:opacity-50
                "
              >
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REJECT MODAL
      ====================================================== */}

      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="font-semibold text-white">
                  Từ chối đơn đăng ký
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Nhập lý do để người dùng biết vì sao đơn bị từ chối.
                </p>
              </div>

              <button
                onClick={() => setShowRejectModal(false)}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-slate-200
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}

            <div className="p-6">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Nhập lý do từ chối..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-slate-700
                  bg-slate-950/50
                  p-3
                  text-sm
                  leading-6
                  text-slate-300
                  outline-none
                  transition
                  placeholder:text-slate-600
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />

              <div className="mt-2 flex justify-between">
                {!rejectionReason.trim() ? (
                  <p className="text-xs text-red-400">Vui lòng nhập lý do.</p>
                ) : (
                  <span />
                )}

                <p className="text-xs text-slate-600">
                  {rejectionReason.length}/1000
                </p>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-4">
              <button
                disabled={processing}
                onClick={() => setShowRejectModal(false)}
                className="
                  rounded-xl
                  border border-slate-700
                  bg-slate-800
                  px-4 py-2.5
                  text-sm
                  font-medium
                  text-slate-300
                  transition
                  hover:bg-slate-700
                  disabled:opacity-50
                "
              >
                Hủy
              </button>

              <button
                disabled={processing || !rejectionReason.trim()}
                onClick={handleReject}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4 py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-red-500
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributorApplicationsPage;
