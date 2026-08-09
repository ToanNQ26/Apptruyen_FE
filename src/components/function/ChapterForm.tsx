import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { addChapter } from "../../services/chapter.service";

interface ChapterImage {
  id: string;
  file: File;
  preview: string;
}

interface ChapterFormProps {
  storyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChapterForm = ({
  storyId,
  onSuccess,
  onCancel,
}: ChapterFormProps) => {
  const [chapterNumber, setChapterNumber] =
    useState("");

  const [title, setTitle] = useState("");

  const [images, setImages] = useState<
    ChapterImage[]
  >([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // =========================
  // Cleanup preview
  // =========================

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  // =========================
  // Chọn ảnh
  // =========================

  const handleImagesChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) return;

    setError("");

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError(
        `"${invalidFile.name}" không phải file ảnh.`
      );
      return;
    }

    const newImages: ChapterImage[] =
      files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((prev) => [
      ...prev,
      ...newImages,
    ]);

    e.target.value = "";
  };

  // =========================
  // Xóa ảnh
  // =========================

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find(
        (item) => item.id === id
      );

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter(
        (item) => item.id !== id
      );
    });
  };

  // =========================
  // Xóa tất cả
  // =========================

  const removeAllImages = () => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setImages([]);
  };

  // =========================
  // Di chuyển ảnh
  // =========================

  const moveImage = (
    index: number,
    direction: "up" | "down"
  ) => {
    const newImages = [...images];

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= newImages.length
    ) {
      return;
    }

    [
      newImages[index],
      newImages[targetIndex],
    ] = [
      newImages[targetIndex],
      newImages[index],
    ];

    setImages(newImages);
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

    if (!storyId) {
      setError("Không tìm thấy ID của truyện.");
      return;
    }

    const parsedChapterNumber =
      Number(chapterNumber);

    if (
      !chapterNumber.trim() ||
      !Number.isInteger(
        parsedChapterNumber
      ) ||
      parsedChapterNumber <= 0
    ) {
      setError(
        "Số chapter phải là số nguyên lớn hơn 0."
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Vui lòng nhập tên chapter."
      );
      return;
    }

    if (images.length === 0) {
      setError(
        "Vui lòng chọn ít nhất một ảnh."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await addChapter(
        storyId,
        parsedChapterNumber,
        title.trim(),
        images.map(
          (image) => image.file
        )
      );

      setSuccess(
        `Đã thêm Chapter ${parsedChapterNumber} thành công!`
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err: any) {
      console.error(
        "Create chapter error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể tạo chapter. Vui lòng thử lại.";

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-160px)] bg-slate-900 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        {/* Header */}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-800/80 shadow-2xl shadow-black/20">
          <div className="border-b border-slate-700 bg-linear-to-r from-orange-500/20 via-slate-800 to-slate-800 px-6 py-8 sm:px-8">

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={onCancel}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30">
                <Upload size={28} />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  Quản lý chapter
                </p>

                <h1 className="text-2xl font-semibold text-white">
                  Thêm chapter
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Thêm một chapter mới cho truyện
                </p>
              </div>

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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Thông tin chapter */}

          <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Thông tin chapter
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Nhập thông tin cơ bản của chapter
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Số chapter{" "}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  min="1"
                  value={chapterNumber}
                  onChange={(e) =>
                    setChapterNumber(
                      e.target.value
                    )
                  }
                  placeholder="Ví dụ: 1"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tên chapter{" "}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Ví dụ:Chương 1: Cuộc gặp gỡ đầu tiên"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500"
                />
              </div>

            </div>
          </section>

          {/* Ảnh */}

          <section className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 shadow-2xl shadow-black/20 sm:p-8">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Ảnh chapter
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Chọn nhiều ảnh và sắp xếp theo thứ tự đọc
                </p>
              </div>

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={removeAllImages}
                  className="self-start rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  Xóa tất cả
                </button>
              )}

            </div>

            {/* Upload */}

            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-8 text-center transition hover:border-orange-500/50 hover:bg-slate-900">

              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                <ImagePlus size={28} />
              </div>

              <span className="text-sm font-medium text-slate-200">
                Chọn ảnh chapter
              </span>

              <span className="mt-2 text-xs text-slate-500">
                Có thể chọn nhiều ảnh cùng lúc
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImagesChange
                }
                className="hidden"
              />
            </label>

            {/* Counter */}

            {images.length > 0 && (
              <div className="mt-5 flex items-center justify-between border-b border-slate-700 pb-4">

                <span className="text-sm text-slate-400">
                  Đã chọn{" "}
                  <span className="font-semibold text-orange-400">
                    {images.length}
                  </span>{" "}
                  ảnh
                </span>

                <span className="text-xs text-slate-500">
                  Thứ tự upload sẽ là thứ tự đọc
                </span>

              </div>
            )}

            {/* Preview */}

            {images.length > 0 && (
              <div className="mt-5 space-y-3">

                {images.map(
                  (image, index) => (
                    <div
                      key={image.id}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-3 transition hover:border-slate-600"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-sm font-semibold text-orange-400">
                        {index + 1}
                      </div>

                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                        <img
                          src={image.preview}
                          alt={`Page ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                          {image.file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {(
                            image.file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">

                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            moveImage(
                              index,
                              "up"
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            images.length - 1
                          }
                          onClick={() =>
                            moveImage(
                              index,
                              "down"
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              image.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>
                  )
                )}

              </div>
            )}
          </section>

          {/* Submit */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
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
                  Đăng chapter
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </section>
  );
};

export default ChapterForm;