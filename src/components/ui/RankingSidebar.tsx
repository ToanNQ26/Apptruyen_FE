import { Eye } from "lucide-react";
import type { Story } from "../../models";
import { Link } from "react-router-dom";

interface Props {
  stories: Story[];
  activeTab: "month" | "week" | "day";
  onTabChange: (tab: "month" | "week" | "day") => void;
}

function getRankColor(rank: number) {
  if (rank === 1) return "text-sky-500";
  if (rank === 2) return "text-green-500";
  if (rank === 3) return "text-orange-500";

  return "text-zinc-500";
}

export default function RankingSidebar({
  stories,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <aside className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Tabs */}

      <div className="grid grid-cols-3 text-center text-sm">
        <button
          onClick={() => onTabChange("month")}
          className={`
            py-3 transition
            ${
              activeTab === "month"
                ? "bg-zinc-800 text-white border-b-2 border-purple-500"
                : "text-zinc-400 hover:text-white"
            }
          `}
        >
          Top Tháng
        </button>

        <button
          onClick={() => onTabChange("week")}
          className={`
            py-3 transition
            ${
              activeTab === "week"
                ? "bg-zinc-800 text-white border-b-2 border-purple-500"
                : "text-zinc-400 hover:text-white"
            }
          `}
        >
          Top Tuần
        </button>

        <button
          onClick={() => onTabChange("day")}
          className={`
            py-3 transition
            ${
              activeTab === "day"
                ? "bg-zinc-800 text-white border-b-2 border-purple-500"
                : "text-zinc-400 hover:text-white"
            }
          `}
        >
          Top Ngày
        </button>
      </div>

      {/* List */}

      <div>
        {stories?.map((story, index) => {
          const rank = index + 1;

          return (
            <Link
              key={story._id}
              to = {`/truyen/${story.slug}`} 
              className="
                flex
                gap-3
                p-4
                border-b
                border-zinc-800
                hover:bg-zinc-800/50
                transition
              "
            >
              {/* Rank */}

              <div
                className={`
                  min-w-9.5
                  text-3xl
                  font-bold
                  ${getRankColor(rank)}
                `}
              >
                {String(rank).padStart(2, "0")}
              </div>

              {/* Cover */}

              <img
                src={story.coverUrl ?? "https://placehold.co/80x110"}
                alt={story.title}
                className="
                  w-14
                  h-18.5
                  object-cover
                  rounded
                "
              />

              {/* Info */}

              <div className="flex-1 min-w-0">
                <h3 className="truncate text-white text-sm font-medium">
                  {story.title}
                </h3>

                <p className="text-zinc-400 text-sm mt-1">{story.storyType}</p>

                <div className="flex items-center gap-1 text-zinc-500 text-sm mt-2">
                  <Eye size={14} />
                  {story.views.toLocaleString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
