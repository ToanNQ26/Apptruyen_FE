import { Link, NavLink } from "react-router-dom";
import {LogOut,LogIn,UserPlus,User,ChevronDown,Menu,X} from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import type { Genre } from "../../models/genre.model";
import * as GenreService from "../../services/genre.service";
import { useNavigate } from "react-router-dom";




function Header() {
  
  const {user , isLoggedIn, logout} = useAuth();

  const [genre, setGenre] = useState<Genre[]>([]);
  const [hoverGenre, setHoverGenre] = useState<Genre | null>(null);
  const [openGenre, setOpenGenre] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
  if (window.innerWidth < 1024) {
    setMobileMenuOpen(false);
    if (isLoggedIn) {
      navigate("/ho-so");
    } else {
      navigate("/dang-nhap");
    }
    return;
  } else if(window.innerWidth <= 1280)  {
    setOpenUserMenu((prev) => !prev);
  }
  return;  
};

  useEffect(() => {
    const fectGenre = async () => {
      const res = await GenreService.getAllGenres();
      setGenre(res.result)
    }
    fectGenre();
  },[])


  return (
    <header className="header">
      <div className="container header-inner flex-wrap">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            Truyen<span>Hay</span>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-white lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-1 gap-5 ">
          <nav className="nav items-center justify-center mx-auto">
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/theo-doi">Theo dõi</NavLink>
            <NavLink to="/lich-su">Lịch sử</NavLink>
            <div
              className="relative z-100 group flex items-center justify-center"
              onMouseLeave={() => setOpenGenre(false)}
            >
              <button
                onClick={() => setOpenGenre((prev) => !prev)}
                className="
                    flex items-center justify-center gap-1
                    text-white
                    hover:text-orange-400
                    transition
                    min-h-10
                  "
              >
                Thể loại
                <ChevronDown
                  size={16}
                  className={`
                      transition-transform duration-200
                      ${openGenre ? "rotate-180" : ""}
                      group-hover:rotate-180
                    `}
                />
              </button>

              <div
                className={`
                  mt-10
                  transition-all duration-200

                  ${openGenre ? "block" : "hidden"}

                  xl:block
                  xl:opacity-0
                  xl:invisible
                  xl:translate-y-2
                  xl:scale-95
                  xl:group-hover:opacity-100
                  xl:group-hover:visible
                  xl:group-hover:translate-y-0
                  xl:group-hover:scale-100
                `}
              >
                <div
                  className="
                    absolute xl:left-1/2 -translate-x-1/2
                    max-sm:-left-21
                    border-size
                    w-[calc(100vw-2rem)]
                    sm:w-[calc(100vw-4rem)]
                    sm:left-1
                    xl:w-212.5
                    bg-slate-800
                    border border-slate-700
                    rounded-xl
                    shadow-2xl
                    p-5
                  "
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 sm:gap-4 xl:gap-x-6 sm:gap-y-2 ">
                    {genre.map((g) => (
                      <Link
                        key={g._id}
                        to={`/tim-kiem?genres=${g._id}`}
                        onMouseEnter={() => setHoverGenre(g)}
                        className="
                          px-2 py-1
                          rounded-md
                          text-slate-200
                          min-w-0
                          hover:bg-slate-700
                          hover:text-orange-400

                          transition
                        "
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-slate-700 mt-4 pt-3 min-h-18">
                    {hoverGenre ? (
                      <>
                        <h4 className="font-semibold text-orange-400">
                          {hoverGenre.name}
                        </h4>

                        <p className="text-sm text-slate-400 mt-1">
                          {hoverGenre.description}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Di chuột vào một thể loại để xem mô tả.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <NavLink to="/xep-hang">Xếp hạng</NavLink>
            <NavLink to="/tim-kiem">Tìm truyện</NavLink>
          </nav>

          <div className="relative groupm ">
            <button
              onClick={handleUserClick}
              className="
                flex items-center gap-2
                bg-gray-800 border border-gray-700
                text-white
                px-4 py-2
                rounded-xl
                whitespace-nowrap
                transition
                hover:bg-gray-700
                hover:border-orange-500
              "
            >
              <span>👤</span>
              {user?.name ?? "Tài khoản"}
              <ChevronDown
                size={14}
                className={`
                  transition-transform duration-200
                  ${openUserMenu ? "lg:rotate-180" : ""}
                  sm:group-hover:rotate-180
                `}
              />
            </button>

            <div
              className={`
              absolute
              left-0
              top-full
              w-48

              bg-gray-900
              border border-gray-700
              rounded-xl
              shadow-2xl
              overflow-hidden
              z-50

              transition-all duration-200

              ${
                openUserMenu
                  ? "block"
                  : "hidden"
              }

              lg:group-hover:block
              max-lg:opacity-0
              max-lg:invisible
              max-lg:translate-y-2

              lg:group-hover:opacity-100
              lg:group-hover:visible
              lg:group-hover:translate-y-0
            `}
            >
              {isLoggedIn ? (
                <>
                  <Link
                    to="/ho-so"
                    className="
                  group
                  flex items-center gap-3
                  px-4 py-3
                  text-white
                  hover:bg-gray-800
                  hover:text-orange-500
                  transition
                "
                  >
                    <User size={17} className="text-violet-500" />
                    Hồ sơ
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="
                  flex w-full items-center gap-3
                  px-4 py-3
                  text-white
                  hover:bg-gray-800
                  hover:text-orange-500
                  transition
                "
                  >
                    <LogOut size={17} className="text-violet-500" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/dang-nhap"
                    className="
                  flex items-center gap-3
                  px-4 py-3
                  text-white
                  hover:bg-gray-800
                  hover:text-orange-500
                  transition
                "
                  >
                    <LogIn size={17} className="text-violet-500" />
                    Đăng nhập
                  </Link>

                  <Link
                    onClick={() => localStorage.removeItem("token")}
                    to="/dang-ky"
                    className="
                  flex items-center gap-3
                  px-4 py-3
                  text-white
                  hover:bg-gray-800
                  hover:text-orange-500
                  transition
                "
                  >
                    <UserPlus size={17} className="text-violet-500" />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 lg:hidden">
          <div className="container py-4 flex flex-col gap-3">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">Trang chủ</NavLink>
              <NavLink to="/theo-doi" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">Theo dõi</NavLink>
              <NavLink to="/lich-su" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">Lịch sử</NavLink>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setMobileGenreOpen((prev) => !prev)}
                  className="mb-2 flex w-full items-center justify-between text-sm font-semibold"
                >
                  <span>Thể loại</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileGenreOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileGenreOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {genre.map((g) => (
                      <Link
                        key={g._id}
                        to={`/tim-kiem?genres=${g._id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-2 text-sm text-slate-200 text-center transition hover:border-orange-500 hover:bg-slate-700 hover:text-orange-400"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <NavLink to="/xep-hang" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">Xếp hạng</NavLink>
              <NavLink to="/tim-kiem" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">Tìm truyện</NavLink>
            </nav>

            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link to="/ho-so" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">
                    <User size={17} className="text-violet-500" />
                    Hồ sơ
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-white hover:bg-slate-800 hover:text-orange-400"
                  >
                    <LogOut size={17} className="text-violet-500" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dang-nhap" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">
                    <LogIn size={17} className="text-violet-500" />
                    Đăng nhập
                  </Link>
                  <Link to="/dang-ky" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-slate-800 hover:text-orange-400">
                    <UserPlus size={17} className="text-violet-500" />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;