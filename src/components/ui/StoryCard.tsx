import { Link } from "react-router-dom";
import type { Story } from "../../models/story.model";

type Props = {
  story: Story;
};

function StoryCard({ story }: Props) {
  return (
    <Link
      to={`/truyen/${story.slug}`}
      className="block bg-[#111a2e] rounded-xl p-4 border border-gray-800 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-40 rounded-lg mb-3 overflow-hidden bg-gray-800">
        {story.coverUrl ? (
          <img
            src={story.coverUrl}
            alt={story.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h3 className="font-semibold mb-2 text-white line-clamp-2">
        {story.title}
      </h3>

      <div className="flex flex-wrap gap-1 mb-2">
        {story.genres?.map((g) => (
          <span
            key={g._id}
            className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded"
          >
            {g.name}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-400 flex justify-between">
        <span>👁 {story.views}</span>
        <span>❤️ {story.followersCount}</span>
      </div>
    </Link>
  );
}

export default StoryCard;