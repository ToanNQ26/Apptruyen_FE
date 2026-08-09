import { useEffect, useState, type FormEvent } from "react";

import { Search, Loader2, Trash2, Pencil, Eye, X } from "lucide-react";

import Swal from "sweetalert2";

import {
  getListStory,
  updateStory,
  deleteStory,
} from "../../services/story.service";

import type { Story } from "../../models/story.model";

import { useAuthStore } from "../../stores/auth.store";

// =========================
// TYPES
// =========================

type StoryType = Story["storyType"];
type StoryStatus = Story["status"];
type StoryLanguage = Story["storyLanguage"];
type StoryDirection = Story["direction"];

type EditStoryForm = {
  title: string;
  author: string;
  description: string;
  storyType: StoryType;
  storyLanguage: StoryLanguage;
  isColor: boolean;
  direction: StoryDirection;
  status: StoryStatus;
};

// =========================
// COMPONENT
// =========================

export default function StoryPage() {
  // =========================
  // DATA
  // =========================

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FILTER
  // =========================

  const [search, setSearch] = useState("");
  const [storyType, setStoryType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("updated");

  // Search thực tế chỉ được áp dụng
  // sau khi người dùng submit form
  const [appliedSearch, setAppliedSearch] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(1);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);
  const [totalStories, setTotalStories] = useState(0);

  // =========================
  // EDIT
  // =========================

  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState<EditStoryForm>({
    title: "",
    author: "",
    description: "",
    storyType: "Manga",
    storyLanguage: "Vietnamese",
    isColor: false,
    direction: "right-to-left",
    status: "ongoing",
  });

  // =========================
  // DELETE
  // =========================

  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);

  const currentUser = useAuthStore((state) => state.user);

  // =========================
  // GET STORIES
  // =========================

  const fetchStories = async () => {
    try {
      setLoading(true);

      const response = await getListStory({
        page,
        limit,
        search: appliedSearch.trim() || undefined,
        storyType: storyType || undefined,
        status: status || undefined,
        sort,
      });

      const result = response.result;

      setStories(result.stories);
      setTotalStories(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch stories:", error);

      await Swal.fire({
        title: "Lỗi",
        text: "Không thể tải danh sách truyện.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH WHEN FILTER/PAGE CHANGES
  // =========================

  useEffect(() => {
    if (!currentUser) {
      setStories([]);
      setTotalStories(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    fetchStories();
  }, [page, appliedSearch, storyType, status, sort, currentUser]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextSearch = search.trim();

    setPage(1);
    setAppliedSearch(nextSearch);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEditStory = (story: Story) => {
    setEditingStory(story);

    setEditForm({
      title: story.title || "",
      author: story.author || "",
      description: story.description || "",
      storyType: story.storyType,
      storyLanguage: story.storyLanguage || "Vietnamese",
      isColor: story.isColor ?? false,
      direction: story.direction || "right-to-left",
      status: story.status || "ongoing",
    });
  };

  // =========================
  // UPDATE FORM
  // =========================

  const handleEditField = <K extends keyof EditStoryForm>(
    field: K,
    value: EditStoryForm[K],
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // UPDATE STORY
  // =========================

  const handleUpdateStory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingStory) return;

    try {
      setSaving(true);

      await updateStory(editingStory._id, editForm);

      setEditingStory(null);

      await fetchStories();

      await Swal.fire({
        title: "Thành công!",
        text: "Đã cập nhật thông tin truyện.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error("Failed to update story:", error);

      await Swal.fire({
        title: "Cập nhật thất bại",
        text: "Không thể cập nhật truyện. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE STORY
  // =========================

  const handleDeleteStory = async (story: Story) => {
    const result = await Swal.fire({
      title: "Xóa truyện?",
      html: `
        Bạn có chắc muốn xóa
        <strong>${story.title}</strong>?
        <br />
        <span style="
          color: #94a3b8;
          font-size: 14px;
        ">
          Thao tác này không thể hoàn tác.
        </span>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa truyện",
      cancelButtonText: "Hủy",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingStoryId(story._id);

      await deleteStory(story._id);

      const remainingStories = stories.filter((item) => item._id !== story._id);

      setStories(remainingStories);

      setTotalStories((prev) => Math.max(0, prev - 1));

      await Swal.fire({
        title: "Đã xóa!",
        text: `Đã xóa truyện "${story.title}".`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });

      // Nếu xóa item cuối cùng của trang
      // và không phải trang đầu tiên
      if (remainingStories.length === 0 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        // Nếu vẫn còn dữ liệu thì reload
        // để đồng bộ total/pagination
        await fetchStories();
      }
    } catch (error) {
      console.error("Failed to delete story:", error);

      await Swal.fire({
        title: "Xóa thất bại",
        text: "Không thể xóa truyện. Vui lòng thử lại.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDeletingStoryId(null);
    }
  };

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = (value: string) => {
    switch (value) {
      case "ongoing":
        return "Đang tiến hành";

      case "completed":
        return "Đã hoàn thành";

      case "hiatus":
        return "Tạm ngưng";

      default:
        return value;
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (value: string) => {
    switch (value) {
      case "ongoing":
        return "bg-emerald-500/10 text-emerald-400";

      case "completed":
        return "bg-blue-500/10 text-blue-400";

      case "hiatus":
        return "bg-amber-500/10 text-amber-400";

      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-6">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <h1 className="text-2xl font-semibold text-white">Quản lý truyện</h1>

        <p className="mt-1 text-sm text-slate-400">
          Quản lý danh sách và nội dung truyện.
        </p>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          {/* Search */}

          <form onSubmit={handleSearch} className="relative flex-1">
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên truyện..."
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

          {/* Story Type */}

          <div className="relative">
            <select
              value={storyType}
              onChange={(e) => {
                setStoryType(e.target.value);
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
              <option value="">Tất cả loại</option>

              <option value="Manga">Manga</option>

              <option value="Manhua">Manhua</option>

              <option value="Manhwa">Manhwa</option>

              <option value="Webtoon">Webtoon</option>

              <option value="Comic">Comic</option>
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

          {/* Status */}

          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="
                h-11
                min-w-40
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
              <option value="">Tất cả trạng thái</option>

              <option value="ongoing">Đang tiến hành</option>

              <option value="completed">Đã hoàn thành</option>

              <option value="hiatus">Tạm ngưng</option>
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

          {/* Sort */}

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="
                h-11
                min-w-40
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
              <option value="updated">Cập nhật gần đây</option>

              <option value="newest">Mới nhất</option>

              <option value="oldest">Cũ nhất</option>

              <option value="views">Lượt đọc nhiều</option>

              <option value="followers">Theo dõi nhiều</option>
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
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        {/* Total */}

        <div className="border-b border-slate-800 px-5 py-4">
          <p className="text-sm text-slate-400">
            Tổng cộng{" "}
            <span className="font-medium text-white">{totalStories}</span>{" "}
            truyện
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          </div>
        ) : stories.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            Không tìm thấy truyện.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250">
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
                  <th className="px-5 py-4">Truyện</th>

                  <th className="px-5 py-4">Loại</th>

                  <th className="px-5 py-4">Trạng thái</th>

                  <th className="px-5 py-4">Lượt đọc</th>

                  <th className="px-5 py-4">Cập nhật</th>

                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {stories.map((story) => {
                  const isDeleting = deletingStoryId === story._id;

                  return (
                    <tr
                      key={story._id}
                      className="
                        border-b
                        border-slate-800/70
                        transition
                        hover:bg-slate-800/30
                      "
                    >
                      {/* Story */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={story.coverUrl}
                            alt={story.title}
                            className="
                              h-14
                              w-10
                              rounded-md
                              bg-slate-800
                              object-cover
                            "
                          />

                          <div className="min-w-0">
                            <p
                              className="
                                max-w-65
                                truncate
                                font-medium
                                text-white
                              "
                            >
                              {story.title}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                              "
                            >
                              {story.author || "Chưa rõ tác giả"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}

                      <td className="px-5 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-slate-500/10
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-slate-400
                          "
                        >
                          {story.storyType}
                        </span>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            ${getStatusClass(story.status)}
                          `}
                        >
                          {getStatusLabel(story.status)}
                        </span>
                      </td>

                      {/* Views */}

                      <td
                        className="
                          px-5
                          py-4
                          text-sm
                          text-slate-400
                        "
                      >
                        {(story.views ?? 0).toLocaleString("vi-VN")}
                      </td>

                      {/* Updated */}

                      <td
                        className="
                          px-5
                          py-4
                          text-sm
                          text-slate-400
                        "
                      >
                        {new Date(story.updatedAt).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* View */}

                          {/* <button
                            type="button"
                            title="Xem truyện"
                            className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-700
                              bg-slate-800/50
                              p-2
                              text-slate-400
                              transition
                              hover:bg-slate-800
                              hover:text-white
                            "
                          >
                            <Eye className="h-4 w-4" />
                          </button> */}

                          {/* Edit */}

                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={() => handleEditStory(story)}
                            className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-blue-500/20
                              bg-blue-500/10
                              p-2
                              text-blue-400
                              transition
                              hover:border-blue-500/40
                              hover:bg-blue-500/20
                            "
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            title="Xóa truyện"
                            disabled={isDeleting}
                            onClick={() => handleDeleteStory(story)}
                            className="
                              inline-flex
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-red-500/20
                              bg-red-500/10
                              p-2
                              text-red-400
                              transition
                              hover:border-red-500/40
                              hover:bg-red-500/20
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            {isDeleting ? (
                              <Loader2
                                className="
                                  h-4
                                  w-4
                                  animate-spin
                                "
                              />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
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

        {!loading && stories.length > 0 && (
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
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
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
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
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

      {/* =========================
          EDIT MODAL
      ========================= */}

      {editingStory && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
          "
          onMouseDown={() => {
            if (!saving) {
              setEditingStory(null);
            }
          }}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              shadow-2xl
            "
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-800
                px-6
                py-4
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-white
                  "
                >
                  Chỉnh sửa truyện
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Cập nhật thông tin của truyện.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => setEditingStory(null)}
                className="
                  rounded-lg
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-800
                  hover:text-white
                  disabled:opacity-40
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleUpdateStory} className="space-y-5 p-6">
              {/* Title */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Tên truyện
                </label>

                <input
                  value={editForm.title}
                  onChange={(e) => handleEditField("title", e.target.value)}
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* Author */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Tác giả
                </label>

                <input
                  value={editForm.author}
                  onChange={(e) => handleEditField("author", e.target.value)}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-2.5
                    text-sm
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* Story Type + Status */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-300
                    "
                  >
                    Loại truyện
                  </label>

                  <select
                    value={editForm.storyType}
                    onChange={(e) =>
                      handleEditField("storyType", e.target.value as StoryType)
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-950
                      px-4
                      py-2.5
                      text-sm
                      text-slate-300
                      outline-none
                      focus:border-blue-500
                    "
                  >
                    <option value="Manga">Manga</option>

                    <option value="Manhua">Manhua</option>

                    <option value="Manhwa">Manhwa</option>

                    <option value="Webtoon">Webtoon</option>

                    <option value="Comic">Comic</option>
                  </select>
                </div>

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-300
                    "
                  >
                    Trạng thái
                  </label>

                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      handleEditField("status", e.target.value as StoryStatus)
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-950
                      px-4
                      py-2.5
                      text-sm
                      text-slate-300
                      outline-none
                      focus:border-blue-500
                    "
                  >
                    <option value="ongoing">Đang tiến hành</option>

                    <option value="completed">Đã hoàn thành</option>

                    <option value="hiatus">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              {/* Language + Direction */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-300
                    "
                  >
                    Ngôn ngữ
                  </label>

                  <input
                    value={editForm.storyLanguage}
                    onChange={(e) =>
                      handleEditField(
                        "storyLanguage",
                        e.target.value as StoryLanguage,
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-950
                      px-4
                      py-2.5
                      text-sm
                      text-white
                      outline-none
                      focus:border-blue-500
                    "
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-slate-300
                    "
                  >
                    Hướng đọc
                  </label>

                  <select
                    value={editForm.direction}
                    onChange={(e) =>
                      handleEditField(
                        "direction",
                        e.target.value as StoryDirection,
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-950
                      px-4
                      py-2.5
                      text-sm
                      text-slate-300
                      outline-none
                      focus:border-blue-500
                    "
                  >
                    <option value="right-to-left">Phải → Trái</option>

                    <option value="left-to-right">Trái → Phải</option>

                    <option value="vertical">Dọc</option>
                  </select>
                </div>
              </div>

              {/* Is Color */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-4
                  py-3
                "
              >
                <input
                  type="checkbox"
                  checked={editForm.isColor}
                  onChange={(e) => handleEditField("isColor", e.target.checked)}
                  className="
                    h-4
                    w-4
                    accent-blue-500
                  "
                />

                <span
                  className="
                    text-sm
                    text-slate-300
                  "
                >
                  Truyện màu
                </span>
              </label>

              {/* Description */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Mô tả
                </label>

                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    handleEditField("description", e.target.value)
                  }
                  rows={5}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    focus:border-blue-500
                  "
                />
              </div>

              {/* Buttons */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  border-t
                  border-slate-800
                  pt-5
                "
              >
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditingStory(null)}
                  className="
                    rounded-xl
                    border
                    border-slate-700
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-slate-300
                    transition
                    hover:bg-slate-800
                    disabled:opacity-50
                  "
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {saving && (
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />
                  )}

                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
