import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login, google } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { getUserInfo } from '../services/user.service';
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await login({ email, password });
      setAccessToken(data.result.accessToken);

      const user = await getUserInfo();
      setUser(user.result);

      navigate('/');
    } catch (error : any ) {
      const err = error.response?.status;
      if (err === 401) {
        setErrorMessage('Email hoặc mật khẩu không đúng');
      } else {
        setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (
  credentialResponse: CredentialResponse
) => {
  if (!credentialResponse.credential) {
    return;
  }

  try {
    const res = await google(credentialResponse.credential);

    // Lưu access token
    setAccessToken(res.result.accessToken);

    // Cập nhật user, chuyển trang,...
    const user = await getUserInfo();
    setUser(user.result);

    navigate('/');
  } catch (err) {
    console.error(err);
  }
};


  return (
    <section className="min-h-[calc(100vh-160px)] bg-slate-900 flex items-center justify-center px-4 py-16">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Đăng nhập
        </h2>

        <p className="text-center text-slate-400 mb-8">
          Chào mừng bạn quay lại Truyen<span className="text-orange-500 font-semibold">Hay</span>
        </p>

        {location.state?.message && (
        <p className="text-green-500 text-center mb-4">
          {location.state.message}
        </p>
       )}

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            placeholder="Nhập email"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 mb-3"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleGoogleSuccess(credentialResponse);
          }}
          onError={() => {
            setErrorMessage("Đăng nhập thất bại!");
          }}
          size="large"
          width="100%"
        />

        <p className="mt-6 text-center text-sm text-slate-400">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="font-medium text-orange-500 hover:text-orange-400">
            Đăng ký
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;