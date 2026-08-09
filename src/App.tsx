import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./stores/auth.store";
import { useEffect } from "react";
import refreshApi from "./services/refreshapi";
import { getUserInfo } from "./services/user.service";
import toast, {Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function App() {
  const authExpired = useAuthStore(
    state => state.authExpired
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (authExpired) {
      toast.error("Phiên đăng nhập đã hết hạn");
      navigate("/dang-nhap", { replace: true });
      useAuthStore.getState().setAuthExpired(false);
    }
  }, [authExpired]);

  useEffect(() => {

    async function initAuth() {
      try {
        const res = await refreshApi.post('/refresh');

        useAuthStore
          .getState()
          .setAccessToken(res.data.result.accessToken);
        const user = await getUserInfo();

        useAuthStore
          .getState()
          .setUser(user.result);

      } catch (err: any) {

          const code = err.response?.data?.code;
          if (
              code === 1104
          ) {
  
              useAuthStore.getState().setAuthExpired(true);
          }

          useAuthStore.getState().logout();
      }
    }

    initAuth();

  }, []);

  return (
     <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  )
}

export default App;