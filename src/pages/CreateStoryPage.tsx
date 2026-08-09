import {
  useEffect,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Image as ImageIcon,
  Plus,
  Loader2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

import { createStory } from "../services/story.service";
import {  getAllGenres } from "../services/genre.service";
import { useAuthStore } from "../stores/auth.store";

interface Genre {
  _id: string;
  name: string;
}

interface CreateStoryForm {
  title: string;
  author: string;
  description: string;
  storyType: string;
  storyLanguage: string;
  isColor: boolean;
  direction: string;
  status: string;
  genres: string[];
  tags: string[];
}

const CreateStoryPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateStoryForm>({
    title: "",
    author: "",
    description: "",
    storyType: "Manga",
    storyLanguage: "Vietnamese",
    isColor: false,
    direction: "right-to-left",
    status: "ongoing",
    genres: [],
    tags: [],
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useAuthStore((state) => state.user);

  const checkpower =
    user?.role === "admin" ||
    user?.role === "uploader";
  // =========================
  // Lấy danh sách genre
  // =========================

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);

        const response = await getAllGenres();

        /*
         * Tùy ApiResponse của bạn mà sửa dòng này.
         *
         * Ví dụ API trả:
         * {
         *   result: [...]
         * }
         */
        setGenres(response.result || []);
      } catch (err: any) {
        console.error("Get genres error:", err);

        setError(
          err?.response?.data?.message ||
            "Không thể tải danh sách thể loại."
        );
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // =========================
  // Cleanup preview
  // =========================

  useEffect(() => {

    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  // =========================
  // Input
  // =========================

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Cover
  // =========================

  const handleCoverChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ảnh bìa không được vượt quá 5MB.");
      return;
    }

    setError("");

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCover(null);
    setCoverPreview("");
  };

  // =========================
  // Genre
  // =========================

  const toggleGenre = (genreId: string) => {
    setForm((prev) => {
      const exists = prev.genres.includes(genreId);

      return {
        ...prev,
        genres: exists
          ? prev.genres.filter(
              (id) => id !== genreId
            )
          : [...prev.genres, genreId],
      };
    });
  };

  // =========================
  // Tags
  // =========================

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (form.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (item) => item !== tag
      ),
    }));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // =========================
  // Validate
  // =========================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Vui lòng nhập tên truyện.";
    }

    if (!form.storyType) {
      return "Vui lòng chọn loại truyện.";
    }

    if (!cover) {
      return "Vui lòng chọn ảnh bìa.";
    }

    return "";
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!cover) return;

    try {
      setIsSubmitting(true);

      const response = await createStory({
        ...form,
        cover,
      });

      console.log("Created story:", response);

      setSuccess("Đăng truyện thành công!");

      setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
            });
      }, 1000);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể đăng truyện. Vui lòng thử lại.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }
  if (!checkpower) {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-center">
        <h2 className="text-lg font-semibold text-red-300">
          Bạn không có quyền đăng truyện
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Chỉ cộng tác viên và quản trị viên mới có thể đăng truyện.
        </p>
      </div>
    </div>
  );
}

return (
  <section className="min-h-[calc(100vh-160px)] bg-slate-900 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-6xl flex-col gap-6">

      {/* Header */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-800/80 shadow-2xl shadow-black/20">
        <div className="border-b border-slate-700 bg-linear-to-r from-orange-500/20 via-slate-800 to-slate-800 px-6 py-8 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30">
              <Upload size={28} />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Quản lý truyện
              </p>

              <h1 className="text-2xl font-semibold text-white">
                Đăng truyện mới
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Thêm một bộ truyện mới vào hệ thống
              </p>
            </div>
            <Link
              to="/my-stories"
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
            >
              <BookOpen className="h-4 w-4" />
              Truyện của tôi
            </Link>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <X size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* =========================
            Thông tin cơ bản
        ========================= */}
        <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Thông tin cơ bản
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Nhập những thông tin chính của bộ truyện
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">

            {/* Cover */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ảnh bìa{" "}
                <span className="text-red-400">*</span>
              </label>

              <div className="relative aspect-3/4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">

                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-slate-200 transition hover:bg-red-500"
                    >
                      <X size={17} />
                    </button>
                  </>
                ) : (
                  <label className="flex h-full cursor-pointer flex-col items-center justify-center px-5 text-center transition hover:bg-slate-800">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                      <ImageIcon size={28} />
                    </div>

                    <span className="text-sm font-medium text-slate-200">
                      Chọn ảnh bìa
                    </span>

                    <span className="mt-2 text-xs text-slate-500">
                      PNG, JPG tối đa 5MB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic fields */}
            <div className="space-y-5">

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tên truyện{" "}
                  <span className="text-red-400">*</span>
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Nhập tên truyện"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tác giả
                </label>

                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Nhập tên tác giả"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Mô tả
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Nhập mô tả cho bộ truyện..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

            </div>
          </div>
        </section>

        {/* =========================
            Thiết lập truyện
        ========================= */}
        <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Thiết lập truyện
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Cấu hình loại, ngôn ngữ và trạng thái của truyện
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Story type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Loại truyện
              </label>

              <select
                name="storyType"
                value={form.storyType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
              >
                <option value="Manga">Manga</option>
                <option value="Manhua">Manhua</option>
                <option value="Manhwa">Manhwa</option>
                <option value="Webtoon">Webtoon</option>
                <option value="Comic">Comic</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Ngôn ngữ
              </label>

              <select
                name="storyLanguage"
                value={form.storyLanguage}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
              >
                <option value="Vietnamese">
                  Vietnamese
                </option>
                <option value="English">
                  English
                </option>
                <option value="Chinese">
                  Chinese
                </option>
                <option value="Korean">
                  Korean
                </option>
                <option value="Japanese">
                  Japanese
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Trạng thái
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
              >
                <option value="ongoing">
                  Đang tiến hành
                </option>

                <option value="completed">
                  Hoàn thành
                </option>
              </select>
            </div>

            {/* Direction */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Hướng đọc
              </label>

              <select
                name="direction"
                value={form.direction}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
              >
                <option value="right-to-left">
                  Phải → Trái
                </option>

                <option value="left-to-right">
                  Trái → Phải
                </option>
              </select>
            </div>
          </div>

          {/* Color */}
          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isColor}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isColor: e.target.checked,
                }))
              }
              className="h-4 w-4 accent-orange-500"
            />

            <span className="text-sm text-slate-300">
              Truyện có màu
            </span>
          </label>
        </section>

        {/* =========================
            Genres
        ========================= */}
        <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Thể loại
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Chọn một hoặc nhiều thể loại cho truyện
            </p>
          </div>

          {loadingGenres ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2
                size={17}
                className="animate-spin text-orange-400"
              />
              Đang tải thể loại...
            </div>
          ) : genres.length === 0 ? (
            <p className="text-sm text-slate-500">
              Chưa có thể loại nào.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const selected =
                  form.genres.includes(genre._id);

                return (
                  <button
                    key={genre._id}
                    type="button"
                    onClick={() =>
                      toggleGenre(genre._id)
                    }
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                        : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================
            Tags
        ========================= */}
        <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Tags
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Thêm các từ khóa giúp phân loại và tìm kiếm truyện
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) =>
                setTagInput(e.target.value)
              }
              onKeyDown={handleTagKeyDown}
              placeholder="Ví dụ: system"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
            />

            <button
              type="button"
              onClick={addTag}
              className="flex shrink-0 items-center justify-center rounded-xl bg-orange-500 px-4 text-white transition hover:bg-orange-600"
            >
              <Plus size={19} />
            </button>
          </div>

          {form.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-300"
                >
                  #{tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                    className="ml-1 text-slate-500 transition hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            Submit
        ========================= */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting || loadingGenres}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Đang đăng...
              </>
            ) : (
              <>
                <Upload size={17} />
                Đăng truyện
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  </section>
);


};

export default CreateStoryPage;