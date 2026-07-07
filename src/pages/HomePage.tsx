import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import RankingSidebar from "../components/ui/RankingSidebar";
import * as storyService from "../services/story.service";
import type { Story } from "../models/story.model";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import Pagination from "../components/ui/Pagination";
import LoadingLayout from "../components/ui/LoadingLayout";
import StoryCard from "../components/ui/StoryCard";
import * as viewDaily from "../services/viewdaily.service";

function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef<any | null>(null);
  const [rankingTab, setRankingTab] = useState<"month" | "week" | "day">("month");
  const [rankingStories, setRankingStories] = useState<Story[]>([]);
  const [hotStories, setHotStories] = useState<Story[]>([]);
  
  const handleSearch = (value:string) => { 
    setPage(1);
    clearTimeout(searchRef.current!);
    searchRef.current = setTimeout(()=>{
        setSearchText(value);
    },500);
  }

  useEffect(() => {
    fetchRanking();
  }, [rankingTab]);

  const fetchRanking = async () => {
    try {
      setLoading(true);

      let res;

      switch (rankingTab) {
        case "month":
          res = await viewDaily.getTopMonthly();
          setHotStories(res.result);
          break;

        case "week":
          res = await viewDaily.getTopWeekly();
          break;

        case "day":
          res = await viewDaily.getTopDaily();
          break;
      }
      setRankingStories(res.result);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await storyService.getListStory({ page, search: searchText });
        setStories(response.result.stories);
        setTotalPages(response.result.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page, searchText]);


  return (
    <div className="container ">
      <input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        placeholder="Nhập truyện bạn muốn tìm ở đây!"
        className="
          bg-gray-800
          text-white
          placeholder:text-gray-500
          border border-gray-700
          focus:outline-none
          focus:ring-2
          focus:ring-orange-500
          w-full
          h-12
          rounded-lg
          px-4
          mb-8
        "
      />
    <LoadingLayout loading={loading}>
      <>
      {/* HOT */}
        <section className="mb-10">
          <div className="flex items-center gap-2 text-orange-500 mb-4">
            <span className="font-bold text-lg">TRUYỆN HOT</span>

          <Flame size={20} fill="currentColor" />
        </div>

        <Swiper
          modules={[Autoplay]}
          loop
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {hotStories.map((story) => (
            <SwiperSlide key={story._id}>
              <Link
                to={`/truyen/${story.slug}`}
                className="
                  relative
                  block
                  overflow-hidden
                  rounded-xl
                  group
                "
              >
                <img
                  src={story.coverUrl ?? "https://placehold.co/250x350"}
                  alt={story.title}
                  className="
                    w-full
                    h-60
                    object-cover
                    transition
                    duration-300
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    bg-linear-to-t
                    from-black
                    to-transparent
                    p-3
                  "
                >
                  <h3 className="text-white font-semibold">{story.title}</h3>

                  <p className="text-orange-400 text-sm">
                    {story.views.toLocaleString()} views
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* NEW UPDATE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="order-2 lg:order-1 col-span-1 lg:col-span-2">
          <section>
            <h2 className="section-title">Truyện mới cập nhật</h2>

            <div className="comic-grid">
              {stories.map((story) => (
                <StoryCard story={story} key={story._id}/>
              ))}
            </div>
          </section>
        </div>

        <div className="order-1 lg:order-2 col-span-1">
          <RankingSidebar stories={rankingStories} activeTab={rankingTab} onTabChange={setRankingTab} />
        </div>
      </div>

      {/* pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
    </LoadingLayout>
    </div>
  );
}

export default HomePage;
