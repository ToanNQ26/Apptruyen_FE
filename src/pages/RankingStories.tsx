import { useSearchParams } from "react-router-dom";
import { BookOpen, Clock3, Eye, Heart, Sparkles, TrendingUp } from "lucide-react";
import RankingSidebar from "../components/ui/RankingSidebar";
import type { SafeStory, Story } from "../models/story.model";
import { useState, useEffect } from "react";
import * as viewRank from "../services/viewdaily.service";
import LoadingLayout from "../components/ui/LoadingLayout";

type RankingTab = "day" | "week" | "month";

const emptyStory: SafeStory = {
  _id: "empty",
  title: "Chưa có truyện",
  description: "Đang cập nhật...",
  coverUrl: "https://placehold.co/600x400",
  views: 0,
  followersCount: 0,
  status: "ongoing",
  storyType: "None",
  genres: [],
  tags: [],
  commentCount: 0,
  storyLanguage: "vi",
  isColor: false,
  direction: "left-to-right",
};

const RankingStories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab: RankingTab = tab === "day" || tab === "week" || tab === "month" ? tab : "month";
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [featuredStory, setFeaturedStory] = useState<Story | null>(null);


  const handleTabChange = (tab: RankingTab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {

    const fetchStories = async () => {
      setLoading(true);
      try {
        let res;
        switch (activeTab) {
          case "day":
            res = await viewRank.getTopDaily(limit);
            break;
          case "week":
            res = await viewRank.getTopWeekly(limit);
            break;
          case "month":
          default:
            res = await viewRank.getTopMonthly(limit);
            break;
        }

        const data = res.result ?? [];

        setStories(data);
        setFeaturedStory(data[0] ?? emptyStory);
      } catch (err) {
        console.error(err);
      } finally {
          setLoading(false);
      }
    };
    fetchStories();
  }, [activeTab, limit]);
  return (
    <LoadingLayout loading={loading}>
           <div className="container min-h-screen bg-[#0b1220]  px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur">
          <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                <Sparkles size={16} />
                Bảng xếp hạng truyện nổi bật
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                  Khám phá những truyện hot nhất của tuần
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Bảng xếp hạng truyện nổi bật được cập nhật liên tục theo lượt xem và mức độ yêu thích của độc giả. Khám phá ngay những tác phẩm đang thịnh hành và đừng bỏ lỡ các bộ truyện được cộng đồng đánh giá cao nhất.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {(["day", "week", "month"] as RankingTab[]).map((tabKey) => {
                  const label = tabKey === "day" ? "Top ngày" : tabKey === "week" ? "Top tuần" : "Top tháng";
                  const active = activeTab === tabKey;

                  return (
                    <button
                      key={tabKey}
                      onClick={() => handleTabChange(tabKey)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                          : "border border-white/10 bg-slate-800/80 text-slate-300 hover:border-cyan-400/40 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Lượt xem</p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <Eye size={16} className="text-cyan-400" />
                    {featuredStory?.views?.toLocaleString() ?? "0"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Theo dõi</p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <Heart size={16} className="text-rose-400" />
                    {featuredStory?.followersCount?.toLocaleString() ?? "0"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trạng thái</p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <Clock3 size={16} className="text-amber-400" />
                    {featuredStory?.status === "ongoing" ? "Đang ra" : "Hoàn thành"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-linear-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent p-4">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80">
                <img src={featuredStory?.coverUrl ?? "https://placehold.co/600x400"} alt={featuredStory?.title ?? "Truyện"} className="h-56 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-2 text-sm text-cyan-200">
                    <TrendingUp size={16} />
                    Truyện dẫn đầu hiện tại
                  </div>
                  <h2 className="text-xl font-bold text-white">{featuredStory?.title ?? "Truyện"}</h2>
                  <p className="text-sm leading-6 text-slate-400">{featuredStory?.description ?? "Đang cập nhật nội dung..."}</p>
                  <div className="flex flex-wrap gap-2">
                    {(featuredStory?.genres ?? []).slice(0, 2).map((genre) => (
                      <span key={genre._id} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Danh sách xếp hạng</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Top truyện nổi bật {activeTab === "day" ? "hôm nay" : activeTab === "week" ? "tuần này" : "tháng này"}</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                <BookOpen size={16} className="text-amber-400" />
                {stories.length} truyện
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {stories.map((story, index) => (
                <article
                  key={story._id}
                  className="group rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base font-semibold text-white">{story.title}</h4>
                      <p className="mt-1 text-sm text-slate-400">{story.storyType} • {story.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành"}</p>
                    </div>
                  </div>

                  <img src={story.coverUrl} alt={story.title} className="mt-4 h-40 w-full rounded-xl object-cover" />

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye size={14} className="text-cyan-400" />
                      {story.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-rose-400" />
                      {story.followersCount.toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <RankingSidebar stories={stories} activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-slate-300 shadow-2xl backdrop-blur">
                <h3 className="text-lg font-semibold text-white">Hiển thị dữ liệu</h3>

                <p className="mt-2 text-sm text-slate-400">
                    Giới hạn hiển thị <span className="text-white font-semibold">{limit}</span> truyện
                </p>

                <button
                    onClick={() => setLimit(prev => prev + 10)}
                    className="mt-4 w-full rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                    Xem thêm 
                </button>

                <button
                    onClick={() => setLimit(10)}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 py-2 text-sm text-white hover:bg-white/10"
                >
                    Thu gọn
                </button>
                </div>
          </div>
        </div>
      </div>
    </div>
    </LoadingLayout>
  );
};

export default RankingStories;