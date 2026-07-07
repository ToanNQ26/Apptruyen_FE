import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Story } from "../models/story.model";
import * as followService from "../services/follow.service";
import LoadingLayout from "../components/ui/LoadingLayout";
import Pagination from "../components/ui/Pagination";
import { BookMarked } from "lucide-react";

function FollowPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");



  useEffect(() => {
    
    setIsLoggedIn(!!token);

    if (!token) {
      setLoading(false);
      return;
    }

    loadFollowedStories();
  }, [page]);

  const loadFollowedStories = async () => {
    try {
      setLoading(true);
      const response = await followService.getUserFollows(page, 12);

        setStories(response.result.stories || []);

        setTotalPages(response.result.totalPages || 1);
    } catch (error) {
      console.error("Error loading followed stories:", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (storyId: string, storyTitle: string) => {
    try {
      await followService.unfollowStory(storyId);
        setStories(stories.filter((story) => story._id !== storyId));
    } catch (error) {
      console.error("Error unfollowing story:", error);
      alert("Lỗi khi bỏ follow truyện");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-[#111a2e] border border-blue-500  rounded-2xl p-10 text-center shadow-xl shadow-blue-400">

            <h2 className="text-2xl font-bold text-white mb-3">
              Chưa đăng nhập
            </h2>

            <p className="text-slate-400 leading-relaxed mb-8">
              Đăng nhập để theo dõi truyện yêu thích, nhận thông báo chap mới
              và đồng bộ lịch sử đọc trên mọi thiết bị.
            </p>

            <button
              onClick={() => navigate("/dang-nhap")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition"
            >
              🔑 Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
  <LoadingLayout loading={loading}>
    <div className="container mx-auto px-4 py-8 min-h-screen ">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 ">
        <BookMarked size={28}/>Truyện đang theo dõi
        </h1>

        {stories.length > 0 && (
          <span className="text-slate-400 text-sm">
            {stories.length} truyện
          </span>
        )}
      </div>

      {stories.length === 0 ? (
        <div className="bg-[#0f1c38] rounded-xl border border-slate-800 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>

          <h2 className="text-xl font-semibold text-white mb-2">
            Chưa theo dõi truyện nào
          </h2>

          <p className="text-slate-400 mb-6">
            Theo dõi truyện để nhận thông báo chap mới.
          </p>

          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition"
          >
            Khám phá truyện
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-10">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-[#0f1c38] rounded-lg overflow-hidden border border-slate-800 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <Link to={`/truyen/${story.slug}`}>
                  <div className="aspect-3/4 overflow-hidden">
                    <img
                      src={
                        story.coverUrl ||
                        "https://via.placeholder.com/300x400"
                      }
                      alt={story.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 min-h-10">
                      {story.title}
                    </h3>

                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      {story.author && (
                        <p className="truncate">
                          ✍ {story.author}
                        </p>
                      )}

                      <p>
                        {story.status === "ongoing"
                          ? "🟢 Đang tiến hành"
                          : story.status === "completed"
                          ? "🔵 Hoàn thành"
                          : "🟡 Tạm dừng"}
                      </p>

                      <p>
                        👁 {story.views?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() =>
                    handleUnfollow(story._id, story.title)
                  }
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                >
                  ❤️ Bỏ theo dõi
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  </LoadingLayout>
);
}

export default FollowPage;