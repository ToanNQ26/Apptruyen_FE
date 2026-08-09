
import { useEffect, useState } from "react";
import { Search, Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/user.service";

import type {
  GetUsersParams,
  User,
} from "../../dto/UserDTO";

import { useAuthStore } from "../../stores/auth.store";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] =
    useState<GetUsersParams["role"]>("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  const currentUser = useAuthStore(
    (state) => state.user
  );

  // =========================
  // GET USERS
  // =========================

  const fetchUsers = async () => {
    try {
      if (!currentUser) return;

      setLoading(true);

      const result = await getAllUsers({
        page,
        limit,
        search,
        role,
      });

      setUsers(result.users);
      setTotalPages(result.pagination.totalPages);
      setTotalUsers(result.pagination.total);
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, currentUser]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setPage(1);
    fetchUsers();
  };

  // =========================
  // UPDATE ROLE
  // =========================

  const handleUpdateRole = async (
    userId: string,
    newRole:
      | "user"
      | "uploader"
      | "admin"
  ) => {
    try {
      setUpdatingUserId(userId);

      await updateUserRole(
        userId,
        newRole
      );

      setUsers((prev) =>
        prev.map((item) =>
          item._id === userId
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );

      await Swal.fire({
        title: "Cập nhật thành công",
        text: "Quyền người dùng đã được cập nhật.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error(
        "Failed to update user role:",
        error
      );

      await Swal.fire({
        title: "Cập nhật thất bại",
        text: "Không thể thay đổi quyền người dùng.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (
    targetUser: User
  ) => {
    // Không cho admin tự xóa chính mình
    if (targetUser._id === currentUser?._id) {
      await Swal.fire({
        title: "Không thể xóa",
        text: "Bạn không thể tự xóa tài khoản đang đăng nhập.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    // Confirm
    const result = await Swal.fire({
      title: "Xóa người dùng?",
      html: `
        Bạn có chắc muốn xóa tài khoản
        <strong>${targetUser.name}</strong>?
        <br />
        <span style="color: #94a3b8; font-size: 14px;">
          ${targetUser.email}
        </span>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa người dùng",
      cancelButtonText: "Hủy",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingUserId(targetUser._id);

      await deleteUser(targetUser._id);

      // Xóa user khỏi UI
      setUsers((prev) =>
        prev.filter(
          (item) =>
            item._id !== targetUser._id
        )
      );

      setTotalUsers(
        (prev) => Math.max(0, prev - 1)
      );

      await Swal.fire({
        title: "Đã xóa!",
        text: `Đã xóa người dùng "${targetUser.name}".`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );

      await Swal.fire({
        title: "Xóa thất bại",
        text: "Không thể xóa người dùng. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Quản lý người dùng
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Quản lý tài khoản và quyền của người dùng.
        </p>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-3 md:flex-row">

          {/* Search */}

          <form
            onSubmit={handleSearch}
            className="relative flex-1"
          >
            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-500
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Tìm theo tên hoặc email..."
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                py-2.5
                pl-10
                pr-4
                text-sm
                text-white
                outline-none
                transition
                focus:border-blue-500
              "
            />
          </form>

          {/* Role filter */}

          <div className="relative">
            <select
              value={role}
              onChange={(e) => {
                setRole(
                  e.target.value as GetUsersParams["role"]
                );

                setPage(1);
              }}
              className="
                h-11
                min-w-37.5
                appearance-none
                rounded-xl
                border
                border-slate-800
                bg-slate-950
                px-4
                pr-9
                text-sm
                text-slate-300
                outline-none
                transition
                hover:border-slate-700
                focus:border-blue-500
              "
            >
              <option value="">
                Tất cả
              </option>

              <option value="user">
                User
              </option>

              <option value="uploader">
                Uploader
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            <svg
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-500
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =========================
          USER TABLE
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

        {/* Total */}

        <div className="border-b border-slate-800 px-5 py-4">
          <p className="text-sm text-slate-400">
            Tổng cộng{" "}
            <span className="font-medium text-white">
              {totalUsers}
            </span>{" "}
            người dùng
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          </div>
        ) : users.length === 0 ? (

          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            Không tìm thấy người dùng.
          </div>

        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5">

              <thead>
                <tr
                  className="
                    border-b
                    border-slate-800
                    text-left
                    text-xs
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  <th className="px-5 py-4">
                    Người dùng
                  </th>

                  <th className="px-5 py-4">
                    Email
                  </th>

                  <th className="px-5 py-4">
                    Quyền
                  </th>

                  <th className="px-5 py-4">
                    Ngày đăng ký
                  </th>

                  <th className="px-5 py-4 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => {
                  const isUpdating =
                    updatingUserId === item._id;

                  const isDeleting =
                    deletingUserId === item._id;

                  const isCurrentUser =
                    item._id === currentUser?._id;

                  return (
                    <tr
                      key={item._id}
                      className="
                        border-b
                        border-slate-800/70
                        transition
                        hover:bg-slate-800/30
                      "
                    >

                      {/* User */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              bg-slate-800
                              text-sm
                              font-medium
                              text-slate-300
                            "
                          >
                            {item.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {item.name}
                            </p>

                            {isCurrentUser && (
                              <span className="text-xs text-blue-400">
                                Bạn
                              </span>
                            )}
                          </div>

                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {item.email}
                      </td>

                      {/* Role */}

                      <td className="px-5 py-4">

                        <div className="relative inline-block">

                          <select
                            value={item.role}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleUpdateRole(
                                item._id,
                                e.target.value as
                                  | "user"
                                  | "uploader"
                                  | "admin"
                              )
                            }
                            className={`
                              h-9
                              min-w-30
                              appearance-none
                              rounded-lg
                              border
                              px-3
                              pr-8
                              text-xs
                              font-medium
                              outline-none
                              transition

                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              ${
                                item.role === "admin"
                                  ? `
                                    border-red-500/20
                                    bg-red-500/10
                                    text-red-400
                                    focus:border-red-500
                                  `
                                  : item.role === "uploader"
                                  ? `
                                    border-blue-500/20
                                    bg-blue-500/10
                                    text-blue-400
                                    focus:border-blue-500
                                  `
                                  : `
                                    border-slate-700
                                    bg-slate-800/60
                                    text-slate-400
                                    focus:border-slate-600
                                  `
                              }
                            `}
                          >
                            <option value="user">
                              User
                            </option>

                            <option value="uploader">
                              Uploader
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>

                          {isUpdating ? (
                            <Loader2
                              className="
                                pointer-events-none
                                absolute
                                right-2
                                top-1/2
                                h-3.5
                                w-3.5
                                -translate-y-1/2
                                animate-spin
                              "
                            />
                          ) : (
                            <svg
                              className="
                                pointer-events-none
                                absolute
                                right-2
                                top-1/2
                                h-3.5
                                w-3.5
                                -translate-y-1/2
                                text-slate-500
                              "
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}

                        </div>
                      </td>

                      {/* Created At */}

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          disabled={
                            isCurrentUser ||
                            isDeleting ||
                            isUpdating
                          }
                          onClick={() =>
                            handleDeleteUser(item)
                          }
                          title={
                            isCurrentUser
                              ? "Không thể xóa tài khoản đang đăng nhập"
                              : "Xóa người dùng"
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-red-400
                            transition
                            hover:border-red-500/40
                            hover:bg-red-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}

                          Xóa
                        </button>

                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* =========================
            PAGINATION
        ========================= */}

        {!loading && users.length > 0 && (
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-800
              px-5
              py-4
            "
          >
            <span className="text-sm text-slate-500">
              Trang {page} / {totalPages}
            </span>

            <div className="flex items-center gap-2">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (prev) => prev - 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-slate-700
                  px-3
                  py-1.5
                  text-sm
                  text-slate-300
                  transition
                  hover:bg-slate-800
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Trước
              </button>

              <button
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(
                    (prev) => prev + 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-slate-700
                  px-3
                  py-1.5
                  text-sm
                  text-slate-300
                  transition
                  hover:bg-slate-800
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Sau
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
