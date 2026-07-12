import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import { getLocalHistories } from "../services/local.history.service";
import { HistoryCard } from "../components/ui/HistoryCard";
import { useAuth } from "../contexts/authContext";
import { getHistoryStory } from "../services/history.service";
import type { HistoryPopulated } from "../dto/historyPopulated";
import { Link } from "react-router-dom";

const HistoryPage = () => {

  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"device" | "account">(
    "device"
  );
  const [accountHistory, setAccountHistory] = useState<HistoryPopulated[]>([]);
  const [storyLocal, setStoryLocal] = useState(getLocalHistories());

  useEffect(() => {
  if (!isLoggedIn) return;

  const fetchAccountHistory = async () => {
    try {
      const res = await getHistoryStory();
      setAccountHistory(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAccountHistory();
}, [isLoggedIn]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="flex items-center gap-4 text-3xl font-bold text-white mb-8">
        <Book size={32} />
        Truyện đã đọc
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#2d333b]">
        <button
          onClick={() => setActiveTab("device")}
          className={`
            px-5 py-3
            font-medium
            transition
            border-b-2
            ${
              activeTab === "device"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-white"
            }
          `}
        >
          Từ thiết bị
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`
            px-5 py-3
            font-medium
            transition
            border-b-2
            ${
              activeTab === "account"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-white"
            }
          `}
        >
          Theo tài khoản
        </button>
      </div>

      {/* Device History */}
      {activeTab === "device" && (
        <div className="">
          <h3 className="text-xl font-semibold text-white mb-6">
            Lịch sử đọc trên thiết bị này
          </h3>
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-6
            "
          >
            {storyLocal.map((history) => (
              <HistoryCard
                key={history.chapterId}
                title={history.title}
                slug={history.slug}
                coverUrl={history.coverUrl}
                chapterNumber={history.chapterNumber}
              />
            ))}
          </div>
        </div>
      )}

      {/* Account History */}
      {activeTab === "account" && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">
            Lịch sử đọc theo tài khoản
          </h3>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-6
            "
          >
            {!isLoggedIn ? (
  <p className="text-gray-400">
    Vui lòng{" "}
    <Link
      to="/dang-nhap"
      className="text-orange-400 hover:underline"
    >
      đăng nhập
    </Link>{" "}
    để xem lịch sử đọc.
  </p>
) : accountHistory.length === 0 ? (
  <p className="text-gray-400">
    Bạn chưa có lịch sử đọc nào.
  </p>
) : (
  accountHistory.map((history) => (
    <HistoryCard
      key={history._id}
      title={history.story.title}
      slug={history.story.slug}
      coverUrl={history.story.coverUrl}
      chapterNumber={history.chapter.chapterNumber}
    />
  ))
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;