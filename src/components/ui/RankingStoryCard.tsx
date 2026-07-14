import { Eye, Heart } from "lucide-react";
import { memo } from "react";
import type { Story } from "../../models/story.model";
import { Link } from "react-router-dom";

type Props = {
  story: Story;
  index: number;
};

const RankingStoryCard = memo(({ story, index }: Props) => {
  return (
    <Link to={`/truyen/${story.slug}`}>
  <article
    className="
      group
      rounded-xl sm:rounded-2xl
      border border-white/10
      bg-slate-950/70
      p-3 sm:p-4
      transition
      hover:-translate-y-1
      hover:border-cyan-400/40
    "
  >
    <div className="flex gap-2 sm:gap-3">
      <div
        className="
          flex
          h-8 w-8
          sm:h-10 sm:w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-linear-to-br
          from-cyan-500
          to-blue-600
          text-xs sm:text-sm
          font-black
          text-white
        "
      >
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm sm:text-base font-semibold text-white">
          {story.title}
        </h4>

        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          {story.storyType} •{" "}
          {story.status === "ongoing"
            ? "Đang cập nhật"
            : "Hoàn thành"}
        </p>
      </div>
    </div>

    <img
      src={story.coverUrl}
      alt={story.title}
      className="
        mt-3 sm:mt-4
        h-32 sm:h-40
        w-full
        rounded-lg sm:rounded-xl
        object-cover
      "
    />

    <div
      className="
        mt-3
        flex
        items-center
        justify-between
        text-xs sm:text-sm
        text-slate-400
      "
    >
      <span className="flex items-center gap-1">
        <Eye
          size={14}
          className="text-cyan-400 sm:w-3.5 sm:h-3.5 w-3 h-3"
        />
        {story.views.toLocaleString()}
      </span>

      <span className="flex items-center gap-1">
        <Heart
          size={14}
          className="text-rose-400 sm:w-3.5 sm:h-3.5 w-3 h-3"
        />
        {story.followersCount.toLocaleString()}
      </span>
    </div>
  </article>
</Link>
  );
});

export default RankingStoryCard;