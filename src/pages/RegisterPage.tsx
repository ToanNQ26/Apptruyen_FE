import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../services/register.service";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setErrorMessage("");

      const response = await Register({
        name,
        email,
        password,
      });

      console.log(response);

      navigate("/dang-nhap", {
        state: {
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        },
      });
    } catch (error) {
      console.error(error);

      setErrorMessage("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-slate-900 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleRegister}>
          <h2 className="mb-2 text-center text-2xl sm:text-3xl font-bold text-white">
            Đăng ký
          </h2>

          <p className="mb-8 text-center text-sm sm:text-base text-slate-400">
            Chào mừng bạn đến với Truyen
            <span className="font-semibold text-orange-500">
              Hay
            </span>
          </p>

          {errorMessage && (
            <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Nhập tên"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="Nhập email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Mật khẩu
            </label>

            <input
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          <button
            type="submit"
            className="mb-5 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Đăng ký
          </button>

          <p className="text-center text-sm text-slate-400">
            Bạn đã có tài khoản? Nhấn vào{" "}
            <Link
              className="text-orange-500 hover:text-orange-400"
              to="/dang-nhap"
            >
              đây
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default RegisterPage;