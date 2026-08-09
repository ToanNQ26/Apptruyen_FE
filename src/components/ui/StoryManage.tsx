import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Story } from "../../models/story.model";
import toast from "react-hot-toast";

interface StoryMangaCardProps {
  story: Story;
  onDelete?: (story: Story) => void;
}



const StoryManageCard = ({
  story,
  onDelete,
}: StoryMangaCardProps) => {

  const handleEdit = () => {
    toast.success("Tính năng chỉnh sửa truyện sẽ sớm được cập nhật.");
  };
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition hover:-translate-y-1 hover:border-slate-700"
    >
      {/* Cover */}
      <div className="relative aspect-3/4 overflow-hidden bg-slate-800">
        <img
          src={story.coverUrl}
          alt={story.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />

        {/* Status */}
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
              story.status === "ongoing"
                ? "bg-emerald-500/80 text-white"
                : story.status === "completed"
                ? "bg-blue-500/80 text-white"
                : "bg-amber-500/80 text-white"
            }`}
          >
            {story.status === "ongoing"
              ? "Đang tiến hành"
              : story.status === "completed"
              ? "Hoàn thành"
              : "Tạm dừng"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2
          className="truncate text-base font-semibold text-white"
          title={story.title}
        >
          {story.title}
        </h2>

        {/* Story info */}
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <span>{story.storyType}</span>

          <span>•</span>

          <span>
            {story.views?.toLocaleString() ?? 0} lượt xem
          </span>
        </div>

        {/* Genres */}
        {story.genres && story.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {story.genres.slice(0, 3).map((genre) => (
              <span
                key={genre._id}
                className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-300"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Chỉnh sửa
          </button>

          <Link
            to={`/dang-truyen/${story._id}/chapters/create`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm chapter
          </Link>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete?.(story)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa truyện
        </button>
      </div>
    </div>
  );
};

export default StoryManageCard;