import { Link } from "react-router-dom";

type Props = {
  title?: string;
  slug?: string;
  coverUrl?: string;
  chapterNumber?: number;
};

export function HistoryCard({
  title,
  slug,
  coverUrl,
  chapterNumber,
}: Props) {
  return (
    <Link
      to={`/truyen/${slug}/chuong/${chapterNumber}`}
      className="
        block
        bg-[#111a2e]
        rounded-xl
        p-4
        border
        border-gray-800
        hover:border-orange-500
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="h-40 rounded-lg mb-3 overflow-hidden bg-gray-800">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold text-white line-clamp-2">
        {title}
      </h3>

      <p className="mt-2 text-orange-400 text-sm">
        Đọc tiếp chap {chapterNumber}
      </p>
    </Link>
  );
}