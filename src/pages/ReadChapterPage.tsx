import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  House,
  ChevronLeft,
  ChevronRight,
  Undo2,
  ChevronDown,
} from "lucide-react";

function ReadChapterPage() {
  const { slug, chapterNumber } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<Story>();
  const [listChapter, setListChapter] = useState<Chapter[]>();
  const [showTopNav, setShowTopNav] = useState(false);
  const [enableFloatingNav, setEnableFloatingNav] = useState(false);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
  const { isLoggedIn } = useAuth();
  const [chapterId, setChapterId] = useState<string>();

  const navigate = useNavigate();

  const currentIndex = useMemo(() => {
    return Number(chapterNumber);
  }, [chapterNumber]);

  const nextChapter = useMemo(() => {
    const nextIndex = currentIndex + 1;
    if (!listChapter) {
      return null;
    }
    if (listChapter.length + 1 > nextIndex) {
      return nextIndex;
    }
    return null;
  }, [listChapter, currentIndex]);

  const dropdownDirectionUp = enableFloatingNav && !showTopNav;

  useEffect(() => {
    if (!slug || !chapterNumber) return;

    localStorage.setItem(`reading_${slug}`, chapterNumber);
  }, [slug, chapterNumber]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        chapterDropdownOpen &&
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setChapterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [chapterDropdownOpen]);

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
      w-screen
      sm:w-full
      max-w-225
      z-50
      transition-all
      duration-300
      ${
        enableFloatingNav
          ? `fixed left-1/2 -translate-x-1/2 ${
              showTopNav ? "top-0" : "bottom-0"
            }`
          : "relative mx-auto"
      }
    `}
        >
          <div
            className="
        flex
        items-center
        overflow-hidden
        border
        border-[#2d333b]
        bg-[#161b22]/90
        backdrop-blur-xl
        shadow-lg
        sm:shadow-[0_10px_40px_rgba(0,0,0,0.55)]
      "
          >
            {/* HOME */}
            <Link
              to="/"
              className="
          flex
          h-12
          w-12
          items-center
          justify-center
          bg-[#21262d]
          text-blue-400
          transition
          hover:bg-[#30363d]
          hover:text-blue-300
          sm:h-14
          sm:w-17.5
        "
            >
              <House className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            {/* PREVIOUS */}
            <button
              disabled={currentIndex <= 1}
              onClick={() => {
                if (currentIndex <= 1) return;
                navigate(`/truyen/${slug}/chuong/${currentIndex - 1}`);
              }}
              className="
          flex
          h-12
          w-11
          items-center
          justify-center
          bg-[#21262d]
          text-red-400
          transition
          hover:bg-[#30363d]
          hover:text-red-300
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-[#21262d]
          sm:h-14
          sm:w-15
        "
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* SELECT */}
            <div className="relative flex-1">
              <select
                value={chapterNumber}
                onChange={(e) => {
                  navigate(`/truyen/${slug}/chuong/${e.target.value}`);
                }}
                className="
                h-12
                w-full
                cursor-pointer
                appearance-none
                bg-transparent
                px-3
                pr-10
                text-sm
                font-medium
                text-gray-200
                outline-none
                sm:h-14
                sm:px-5
                sm:pr-12
                sm:text-base
              "
                  >
                {listChapter?.map((chapter) => (
                  <option
                    key={chapter._id}
                    value={chapter.chapterNumber}
                    className="bg-[#161b22] text-gray-200"
                  >
                    Chapter {chapter.chapterNumber}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:right-4">
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            {/* NEXT */}
            <button
              disabled={!nextChapter}
              onClick={() => {
                if (!nextChapter) return;
                navigate(`/truyen/${slug}/chuong/${nextChapter}`);
              }}
              className="
          flex
          h-12
          w-11
          items-center
          justify-center
          bg-[#21262d]
          text-green-400
          transition
          hover:bg-[#30363d]
          hover:text-green-300
          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-[#21262d]
          sm:h-14
          sm:w-15
        "
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* BACK */}
            <Link
              to={`/truyen/${slug}`}
              className="
          flex
          h-12
          w-12
          items-center
          justify-center
          bg-[#21262d]
          text-yellow-400
          transition
          hover:bg-[#30363d]
          hover:text-yellow-300
          sm:h-14
          sm:w-17.5
        "
            >
              <Undo2 className="h-5 w-5 sm:h-6 sm:w-6" />
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
          <div className="mt-8 mb-4 flex gap-3 w-full sm:justify-center">
            <Link
              to={
                currentIndex > 1
                  ? `/truyen/${slug}/chuong/${currentIndex - 1}`
                  : `#`
              }
              className="
                flex flex-1 items-center justify-center gap-2
                rounded-xl
                bg-cyan-500
                px-5 py-3
                text-sm font-medium text-white
                transition
                hover:bg-cyan-400
                border border-cyan-500/20
                sm:flex-none
                sm:px-6
                sm:text-base
                "
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Chapter trước</span>
            </Link>

            <Link
              to={nextChapter ? `/truyen/${slug}/chuong/${nextChapter}` : `#`}
              className="
                flex flex-1 items-center justify-center gap-2
                rounded-xl
                bg-cyan-500
                px-5 py-3
                text-sm font-medium text-white
                transition
                hover:bg-cyan-400
                border border-cyan-500/20
                sm:flex-none
                sm:px-6
                sm:text-base
                "
            >
              <span>Chapter sau</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <Comments chapterId={chapterId} storyId={story?._id!} />
      </LoadingLayout>
    </div>
  );
}

export default ReadChapterPage;
