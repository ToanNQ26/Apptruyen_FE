import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import { getListStory } from "../services/story.service";
import type { Story } from "../models/story.model";
import LoadingLayout from "../components/ui/LoadingLayout";
import type { Genre } from "../models/genre.model";
import { getAllGenres } from "../services/genre.service";
import InputLayout from "../components/ui/InputLayout";
import {  useSearchParams } from "react-router-dom";
import StoryCard from "../components/ui/StoryCard";

const sortMap: Record<string, string> = {
  "Mới nhất": "newest",
  "Cũ nhất": "oldest",
  "Lượt xem cao nhất": "views",
  "Theo dõi nhiều nhất": "followers",
};

const sortLabelMap: Record<string, string> = {
  newest: "Mới nhất",
  oldest: "Cũ nhất",
  views: "Lượt xem cao nhất",
  followers: "Theo dõi nhiều nhất",
};

const statuses = [
  { label: "Tất cả", value: "all" },
  { label: "Đang tiến hành", value: "ongoing" },
  { label: "Đã hoàn thành", value: "completed" },
];

export default function SearchPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openSort, setOpenSort] = useState(false);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [keyword, setKeyword] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const sort = searchParams.get("sort") || "newest";
  const [openGenre, setOpenGenre] = useState(false);
  const genreIds =
    searchParams.get("genres")?.split(",").filter(Boolean) || [];

  // derive selected genres từ genreIds (FIX)
  const selectedGenres = genres.filter((g) =>
    genreIds.includes(g._id)
  );

  const toggleGenre = (genreId: string) => {
    const params = new URLSearchParams(searchParams);

    const current =
      params.get("genres")?.split(",").filter(Boolean) || [];

    const updated = current.includes(genreId)
      ? current.filter((id) => id !== genreId)
      : [...current, genreId];

    if (updated.length) {
      params.set("genres", updated.join(","));
    } else {
      params.delete("genres");
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await getAllGenres();
        setGenres(res.result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGenres();
  }, []);

  // fetch stories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getListStory({
          page,
          status: status === "all" ? "" : status,
          genres: genreIds.join(","),
          sort,
        });

        setStories(res.result.stories);
        setTotalPages(res.result.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, status, sort, searchParams]);

  return (
    <div className="container bg-[#0b1220] text-white px-6 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Tìm kiếm truyện
      </h1>

      <div className="flex gap-6 max-sm:gap-0  max-sm:flex-col-reverse">
        {/* LEFT */}
        <div className="w-[70%] max-sm:w-full">
          {/* STATUS */}
          <div className="mb-4">
            <p className="section-title">Trạng thái</p>

            <div className="flex flex-1 gap-2 max-sm:justify-center ">
              {statuses.map((st) => (
                <button
                  key={st.value}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("status", st.value);
                    params.set("page", "1");
                    setSearchParams(params);
                  }}
                  className={`px-3 py-1 rounded border text-sm max-sm:texl-xs max-sm:px-2 transition
                    ${
                      status === st.value
                        ? "bg-blue-600 border-blue-500"
                        : "bg-[#111a2e] border-gray-700"
                    }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4 ">
            <p className="max-sm:hidden" >
              Kết quả:{" "}
              <span className="text-blue-400 font-bold">
                {stories.length}
              </span>
            </p>

            {/* SORT */}
            <div className="w-full">
              <p className="mb-4 sm:hidden">Sắp xếp theo:</p>
              <div className="relative w-60 max-sm:w-full ml-auto">
                <button
                  onClick={() => setOpenSort(!openSort)}
                  className="w-full flex justify-between items-center bg-[#111a2e] px-4 py-2 rounded-lg border border-gray-700"
                >
                  {sortLabelMap[sort]}
                  <ChevronDown size={16} />
                </button>

                {openSort && (
                  <div className="absolute mt-2 w-full bg-[#111a2e] border border-gray-700 rounded-lg z-10">
                    {Object.keys(sortMap).map((o) => (
                      <button
                        key={o}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set("sort", sortMap[o]);
                          params.set("page", "1");
                          setSearchParams(params);
                          setOpenSort(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-600"
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STORIES */}
          <LoadingLayout loading={loading}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stories.map((s) => (
                <StoryCard story = {s}/>
              ))}
            </div>
          </LoadingLayout>
        </div>

        {/* RIGHT FILTER */}
        <div className="w-[30%] max-sm:w-full">
          <div className="flex items-center justify-between mb-4">
            <h2>Thể loại</h2>

            <span className="px-2 py-0.5 rounded-md text-xs text-blue-300 bg-blue-500/15 border border-blue-500/20">
              Đã chọn: {selectedGenres.length}
            </span>
          </div>
          
          <div className="relative sm:hidden mb-4">
            <button
              onClick={() => setOpenGenre(!openGenre)}
              className="w-full flex items-center justify-between
                        bg-[#111a2e]
                        border border-gray-700
                        rounded-lg
                        px-4 py-2"
            >
              <span>
                {selectedGenres.length
                  ? `${selectedGenres.length} thể loại`
                  : "Chọn thể loại"}
              </span>

              <ChevronDown
                className={`transition ${
                  openGenre ? "rotate-180" : ""
                }`}
                size={18}
              />
            </button>

            {openGenre && (
              <div
                className="
                absolute
                left-0
                mt-2
                w-full
                max-h-80
                overflow-y-auto
                rounded-xl
                bg-[#111a2e]
                border border-gray-700
                shadow-xl
                z-50
                p-3"
              >
                <InputLayout
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm thể loại..."
                />

                <div className="mt-3 flex flex-col gap-2">
                  {filteredGenres.map((g) => {
                    const active = genreIds.includes(g._id);

                    return (
                      <button
                        key={g._id}
                        onClick={() => toggleGenre(g._id)}
                        className={`
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2
                          rounded-lg
                          transition
                          ${
                            active
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-800"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                        />

                        <span>{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="max-sm:hidden">
            <InputLayout
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm thể loại..."
            />
          </div>

          {/* selected */}
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedGenres.map((g) => (
                <button
                  key={g._id}
                  onClick={() => toggleGenre(g._id)}
                  className="bg-blue-600 px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {g.name}
                  <X size={12} />
                </button>
              ))}
            </div>
          )}

          {/* full list */}
          <div className="grid grid-cols-2 gap-2 max-sm:hidden">
            {filteredGenres.map((g) => {
              const active = genreIds.includes(g._id);

              return (
                <button
                  key={g._id}
                  onClick={() => toggleGenre(g._id)}
                  className={`px-3 py-1 rounded border text-xs transition
                    ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-[#111a2e] border-gray-700 text-gray-300"
                    }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(newPage));
          setSearchParams(params);
        }}
      />
    </div>
  );
}