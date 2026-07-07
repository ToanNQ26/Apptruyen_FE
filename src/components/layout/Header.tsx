import { Link, NavLink } from "react-router-dom";
import {LogOut,LogIn,UserPlus,User,ChevronDown} from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import type { Genre } from "../../models/genre.model";
import * as GenreService from "../../services/genre.service";

function Header() {
  
  const {user , isLoggedIn, logout} = useAuth();

  const [genre, setGenre] = useState<Genre[]>([]);
  const [hoverGenre, setHoverGenre] = useState<Genre | null>(null);

  useEffect(() => {
    const fectGenre = async () => {
      const res = await GenreService.getAllGenres();
      setGenre(res.result)
    }
    fectGenre();
  },[])


  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          Truyen<span>Hay</span>
        </Link>

        <nav className="nav">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/theo-doi">Theo dõi</NavLink>
          <NavLink to="/lich-su">Lịch sử</NavLink>
          <div className="relative group">
            <button
              className="
                flex items-center gap-1
                text-white
                hover:text-orange-400
                transition
              "
            >
              Thể loại

              <ChevronDown
                size={16}
                className="
                  transition-transform duration-200
                  group-hover:rotate-180
                "
              />
            </button>

            <div
              className="
                absolute top-full left-1/2 -translate-x-1/2
                pt-3
                z-50

                opacity-0 invisible
                translate-y-2 scale-95

                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0
                group-hover:scale-100

                transition-all duration-200
              "
            >
              <div
                className="
                  w-212.5
                  bg-slate-800
                  border border-slate-700
                  rounded-xl
                  shadow-2xl
                  p-5
                "
              >
                <div className="grid grid-cols-5 gap-x-6 gap-y-2">
                  {genre.map((g) => (
                    <Link
                      key={g._id}
                      to={`/tim-kiem?genres=${g._id}`}
                      onMouseEnter={() => setHoverGenre(g)}
                      className="
                        px-2 py-1
                        rounded-md
                        text-slate-200

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

        <div className="relative group">

          <button
            className="
              flex items-center gap-2
              bg-gray-800 border border-gray-700
              text-white
              px-4 py-2
              rounded-xl
              transition
              hover:bg-gray-700
              hover:border-orange-500
            "
          >
            <span>👤</span>
            {user?.name ?? "Tài khoản"}
            <ChevronDown
              size={14}
              className="
                transition-transform
                group-hover:rotate-180
              "
            />
          </button>

          <div
            className="
              absolute right-0 top-full mt-3
              w-48
              bg-gray-900
              border border-gray-700
              rounded-xl
              shadow-2xl
              overflow-hidden
              opacity-0 invisible translate-y-2
              transition-all duration-200
              group-hover:opacity-100
              group-hover:visible
              group-hover:translate-y-0
              z-50
            "
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
             <User size={17} className="text-violet-500"/>
             Hồ sơ
            </Link>

            <Link
              onClick={logout}
              to="/"
              className="
                flex items-center gap-3
                px-4 py-3
                text-white
                hover:bg-gray-800
                hover:text-orange-500
                transition
              "
            >
              <LogOut size={17} className="text-violet-500"/>
               Đăng xuất
            </Link>
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
    </header>
  );
}

export default Header;