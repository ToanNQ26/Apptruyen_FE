import { Link } from "react-router-dom";
import * as followService from "../../services/follow.service";
import { useEffect, useState } from "react";

const statusMap: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Đã hoàn thành",
};

export type ComicDetailProps = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genres: string[];
  views: number;
  status?: string;
};

function ComicDetail({
  id,
  slug,
  title,
  author,
  description,
  coverUrl,
  genres,
  views,
  status,
}: ComicDetailProps) {

  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginNotice, setShowLoginNotice] =useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {

    async function loadFollowStatus() {

      if (!token) return;

      try {

        const res =
          await followService.checkFollow(id);

        setIsFollowed(
          res.result.isFollowed
        );

      } catch (error) {
        console.error(error);
      }
    }

    loadFollowStatus();

  }, [id, token]);

  const handleFollow = async () => {

  if (!token) {

    setShowLoginNotice(true);

    setTimeout(() => {
      setShowLoginNotice(false);
    }, 2500);

    return;
  }

  try {

    setLoading(true);

    if (isFollowed) {

      await followService.unfollowStory(id);
      setIsFollowed(false);

    } else {

      await followService.followStory(id);
      setIsFollowed(true);

    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">

      {/* TOP SECTION */}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Cover */}

        <div className="shrink-0 mx-auto lg:mx-0">
          <img
            src={coverUrl}
            alt={title}
            className="w-full max-w-70 rounded-2xl object-cover shadow-xl shadow-black/20 md:max-w-[320px]"
          />
        </div>

        {/* Info */}

        <div className="flex-1">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl max-xl:text-center">
              {title}
            </h1>

            <button
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white shadow-lg shadow-blue-500/20 active:scale-95"
              onClick={handleFollow}
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : isFollowed
                  ? "❤️ Đã theo dõi"
                  : "🤍 Theo dõi"}
            </button>
          </div>

          <div className="space-y-4 text-gray-300">
            <p className="text-base sm:text-lg">
              <span className="font-semibold text-white">Tác giả:</span>{" "}
              {author}
            </p>

            <div className="flex  gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <span className="font-semibold text-white">Trạng thái:</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  status === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {statusMap[status || ""] || "Không xác định"}
              </span>
            </div>

            <p className="text-base sm:text-lg">
              <span className="font-semibold text-white">Lượt xem:</span>{" "}
              {views.toLocaleString()}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white">Thể loại:</span>
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}

          <div className="mt-6 rounded-3xl bg-zinc-900/70 p-5 text-gray-300">
            <h2 className="mb-3 text-lg font-semibold text-white">Giới thiệu:</h2>
            <p className="leading-7 text-gray-300">
              {description}
            </p>
          </div>

        </div>

      </div>

      {
        showLoginNotice && (

          <div className="
            fixed
            top-18
            right-6
            z-50

            px-5
            py-4

            rounded-xl

            bg-zinc-900/95
            border
            border-zinc-700

            text-zinc-200
            shadow-2xl
            shadow-black/40

            animate-pulse
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <span className="text-yellow-400">
                ⚠️
              </span>

              <p className="
                text-sm
                font-medium
              ">
                Hãy đăng nhập để sử dụng
                chức năng này
              </p>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default ComicDetail;