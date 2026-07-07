import { Link } from "react-router-dom";
import type { Chapter } from "../../models";

type Props = {
  slug?: string;
  chapters: Chapter[];
};



const ChapterUI = ({
  slug,
  chapters,
}: Props) => {
  
  const continueChapter = slug
  ? localStorage.getItem(`reading_${slug}`)
  : null;
  return (
    <div className="container mx-auto mt-16 px-4">

  {/* HEADER */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

    <div>
      <h2 className="text-3xl font-bold text-white">
        Danh sách chương
      </h2>

      <p className="text-gray-400 mt-2">
        {chapters.length} chương
      </p>
    </div>

    <div className="flex gap-3">

      <Link
        to={`/truyen/${slug}/chuong/1`}
        className="
          px-5 py-3
          rounded-xl
          bg-[#1b2437]
          hover:bg-blue-500
          text-white
          font-semibold
          transition-all duration-300
          shadow-lg shadow-blue-500/20
        "
      >
      Đọc từ đầu
      </Link>

      <Link
        to={`/truyen/${slug}/chuong/${chapters.length}`}
        className="
          px-5 py-3
          rounded-xl
          bg-[#1b2437]
          hover:bg-blue-500
          text-white
          font-semibold
          transition-all duration-300
          shadow-lg shadow-blue-500/20
        "
      >
        Đọc mới nhất
      </Link>

      <Link
        to={`/truyen/${slug}/chuong/${continueChapter || 1}`}
        className="
          px-5 py-3
          rounded-xl
          bg-[#1b2437]
          hover:bg-blue-500
          text-white
          font-semibold
          transition-all duration-300
          shadow-lg shadow-blue-500/20
        "
      >
         Đọc tiếp
      </Link>

    </div>
  </div>

  {/* LIST CHAPTERS */}
  <div className="space-y-4">

    {chapters.map((chapter) => (

      <Link
        key={chapter._id}
        to={`/truyen/${slug}/chuong/${chapter.chapterNumber}`}
        className="
          group
          block
          rounded-2xl
          border border-[#263149]
          bg-gradient-to-r
          from-[#182135]
          to-[#1e2940]

          hover:from-[#1d2942]
          hover:to-[#263757]

          hover:border-blue-500
          hover:shadow-xl
          hover:shadow-blue-500/10

          transition-all duration-300
          overflow-hidden
        "
      >

        <div className="flex justify-between items-center p-5">

          <div>

            <h3
              className="
                text-white
                font-semibold
                text-lg
                group-hover:text-blue-400
                transition
              "
            >
              {chapter.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Chapter {chapter.chapterNumber}
            </p>

          </div>

          <div className="flex items-center gap-5">

            <span className="text-sm text-gray-500">
              {new Date(chapter.createdAt)
                .toLocaleDateString("vi-VN")}
            </span>

            <span
              className="
                text-gray-500
                text-xl
                group-hover:text-blue-400
                group-hover:translate-x-1
                transition-all
              "
            >
              →
            </span>

          </div>

        </div>

      </Link>

    ))}

  </div>

</div>
  );
};

export default ChapterUI;