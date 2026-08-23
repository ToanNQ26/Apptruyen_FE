import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BookMarked,
} from "lucide-react";

import { getMyStories,deleteStory } from "../services/story.service";
import type { Story } from "../models/story.model";
import StoryManageCard from "../components/ui/StoryManage";
import { useIsLoggedIn } from "../stores/auth.store";
import Swal from "sweetalert2";

const MyStoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isLoggedIn = useIsLoggedIn();

  const limit = 12;

  const fetchMyStories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyStories({
        page,
        limit,
      });

      const result = response.result;

      setStories(result.stories);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách truyện.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (story: Story) => {
  const result = await Swal.fire({
    title: "Xóa truyện?",
    text: `Bạn có chắc muốn xóa "${story.title}" không?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {

    await deleteStory(story._id);

    setStories((prev) =>
      prev.filter((item) => item._id !== story._id)
    );

    await Swal.fire({
      title: "Đã xóa!",
      text: "Truyện đã được xóa thành công.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);

    Swal.fire({
      title: "Xóa thất bại",
      text: "Không thể xóa truyện.",
      icon: "error",
    });
  } finally {
  }
};


  useEffect(() => {
    fetchMyStories();
  }, [page,isLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BookMarked className="h-6 w-6 text-blue-400" />

              <h1 className="text-2xl font-bold">
                Truyện của tôi
              </h1>
            </div>

            <p className="text-sm text-slate-400">
              Quản lý những truyện bạn đã đăng trên website.
            </p>
          </div>

          <Link
            to="/dang-truyen"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Đăng truyện
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-75 items-center justify-center">
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải danh sách truyện...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && stories.length === 0 && (
          <div className="flex min-h-87.5 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 px-6 text-center">
            <div className="mb-4 rounded-full bg-slate-800 p-4">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>

            <h2 className="mb-2 text-lg font-semibold">
              Bạn chưa đăng truyện nào
            </h2>

            <p className="mb-5 max-w-md text-sm text-slate-400">
              Hãy đăng truyện đầu tiên của bạn để bắt đầu xây dựng
              thư viện truyện.
            </p>

            <Link
              to="/dang-truyen"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Đăng truyện
            </Link>
          </div>
        )}

        {/* Story list */}
{!loading && !error && stories.length > 0 && (
  <>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stories.map((story) => (
        <StoryManageCard
          key={story._id}
          story={story}
          onDelete={handleDelete}
        />
      ))}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Trước
        </button>

        <span className="px-3 text-sm text-slate-400">
          Trang {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    )}
  </>
)}
      </div>
    </div>
  );
};

export default MyStoriesPage;