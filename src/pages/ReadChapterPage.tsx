import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getChapterByChapterNumber,
  getListChapter,
} from "../services/chapter.service";
import { getStoryBySlug } from "../services/story.service";
import type { Story } from "../models/story.model";
import type { Chapter } from "../models";
import LoadingLayout from "../components/ui/LoadingLayout";
import { addHistoryStory } from "../services/history.service";
import { useAuth } from "../contexts/authContext";
import { addLocalHistory } from "../services/local.history.service";
import { increaseView } from "../services/viewdaily.service";
import Comments from "../components/ui/Comment";

function ReadChapterPage() {
  const { slug, chapterNumber } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<Story>();
  const [listChapter, setListChapter] = useState<Chapter[]>();
  const [showTopNav, setShowTopNav] = useState(false);
  const [enableFloatingNav, setEnableFloatingNav] = useState(false);
  const { isLoggedIn } = useAuth();
  const [chapterId, setChapterId] = useState<string >();

  const navigate = useNavigate();

  useEffect(() => {
    if (!slug || !chapterNumber) return;

    localStorage.setItem(`reading_${slug}`, chapterNumber);
  }, [slug, chapterNumber]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // vị trí navbar xuất hiện ban đầu
      const triggerPoint = 220;

      setEnableFloatingNav(currentY > triggerPoint);

      if (currentY < lastScrollY) {
        setShowTopNav(true);
      } else {
        setShowTopNav(false);
      }

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchListChapter = async () => {
      try {
        if (!story) return;
        const res = await getListChapter(story?._id);
        setListChapter(res.result);
      } catch (err) {
        console.log("Lỗi khi lấy danh sách chapter", err);
      }
    };
    fetchListChapter();
  }, [story]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const storyRes = await getStoryBySlug(slug!);
        await increaseView(storyRes.result._id);
        console.log(storyRes.result._id);
        const res = await getChapterByChapterNumber(slug!, chapterNumber!);
        setChapterId(res.result._id);
        setStory(storyRes.result);
        const chapter: Chapter = res.result;
        setImages(chapter.images || []);

        const storyData = storyRes.result;

        const historyData = {
          storyId: chapter.story,
          slug: storyData.slug,
          title: storyData.title,
          coverUrl: storyData.coverUrl,
          chapterId: chapter._id,
          chapterNumber: chapter.chapterNumber,
          updatedAt: Date.now(),
        };
        if (isLoggedIn) {
          await addHistoryStory(chapter.story, chapter._id);
        } else {
          addLocalHistory(historyData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [slug, chapterNumber]);

  return (
    <div className="  min-h-screen bg-gray-800 text-gray-200">
      {/* Header */}
      <div className="bg-[#161a22]/95 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-xl md:text-3xl font-bold text-white text-center">
            {story?.title}
          </h1>

          <p className="text-sm text-gray-400 text-center mt-2">
            Chapter {chapterNumber}
          </p>
        </div>
      </div>

      {/* Chapter Navbar */}
      <div className="flex justify-center">
        <div
          className={`

          w-[95%]
          max-w-225

          z-50
          transition-all
          duration-300

          ${
            enableFloatingNav
              ? `fixed ${showTopNav ? "top-0" : "bottom-0"}`
              : `relative mx-auto `
          }
        `}
        >
          <div
            className="
            flex
            items-center
            overflow-hidden

            bg-[#161b22]/90
            backdrop-blur-xl

            border
            border-[#2d333b]

            shadow-[0_10px_40px_rgba(0,0,0,0.55)]
          "
          >
            {/* HOME */}

            <Link
              to="/"
              className="
              w-17.5
              h-14

              flex
              items-center
              justify-center

              bg-[#21262d]
              hover:bg-[#30363d]

              text-blue-400
              hover:text-blue-300

              text-xl
              transition-all
            "
            >
              🏠
            </Link>

            {/* PREVIOUS */}

            <button
              className="
              w-15
              h-14

              flex
              items-center
              justify-center

              bg-[#21262d]
              hover:bg-[#30363d]

              text-red-400
              hover:text-red-300

              text-2xl
              transition-all
            "
            >
              ❮
            </button>

            {/* SELECT */}

            <div className="flex-1 relative">
              <select
                value={chapterNumber}
                onChange={(e) => {
                  navigate(`/truyen/${slug}/chuong/${e.target.value}`);
                }}
                className="
                w-full
                h-14

                appearance-none
                bg-transparent

                text-gray-200
                text-[17px]
                font-medium

                px-5
                pr-12

                outline-none
                cursor-pointer
              "
              >
                {listChapter?.map((chapter) => (
                  <option
                    key={chapter._id}
                    value={chapter.chapterNumber}
                    className="
                    bg-[#161b22]
                    text-gray-200
                  "
                  >
                    Chapter {chapter.chapterNumber}
                  </option>
                ))}
              </select>

              <div
                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2

                text-gray-400
                pointer-events-none
              "
              >
                ▼
              </div>
            </div>

            {/* NEXT */}

            <button
              className="
              w-15
              h-14

              flex
              items-center
              justify-center

              bg-[#21262d]
              hover:bg-[#30363d]

              text-green-400
              hover:text-green-300

              text-2xl
              transition-all
            "
            >
              ❯
            </button>

            {/* BACK */}

            <Link
              to={`/truyen/${slug}`}
              className="
              w-17.5
              h-14

              flex
              items-center
              justify-center

              bg-[#21262d]
              hover:bg-[#30363d]

              text-yellow-400
              hover:text-yellow-300

              text-xl
              transition-all
            "
            >
              ↩
            </Link>
          </div>
        </div>
      </div>

      {/* Reader */}
      <LoadingLayout loading={loading}>
        <div className="max-w-5xl mx-auto ">
          {images.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              Không có ảnh chapter.
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Page ${index + 1}`}
                  loading="lazy"
                  className="
                    w-full
                    max-w-225
                    object-contain
                    shadow-xl
                    bg-[#161a22]
                  "
                />
              ))}
            </div>
          )}
        </div>
        <Comments chapterId={chapterId} storyId={story?._id!} />
      </LoadingLayout>
    </div>
  );
}

export default ReadChapterPage;
