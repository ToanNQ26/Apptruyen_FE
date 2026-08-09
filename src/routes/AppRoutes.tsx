import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import HomePage from "../pages/HomePage";
import ComicDetailPage from "../pages/ComicDetailPage";
import ReadChapterPage from "../pages/ReadChapterPage";
import SearchPage from "../pages/SearchPage";
import CategoryPage from "../pages/CategoryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import FollowPage from "../pages/FollowPage";
import HistoryPage from "../pages/HistoryPage";
import RankingStories from "../pages/RankingStories";
import InforUserPage from "../pages/InforUserPage";
import CreateStoryPage from "../pages/CreateStoryPage";
import AddChapterPage from "../pages/AddChapterPage";
import MyStoriesPage from "../pages/MyStoriesPage";
import AdminLayout from "../components/adminlayout/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserPage from "../pages/admin/Userpage";
import StoryPage from "../pages/admin/StoryPage";
import ContributorApplicationsPage from "../pages/admin/ContributorApplicationPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/truyen/:slug" element={<ComicDetailPage />} />
        <Route
          path="/truyen/:slug/chuong/:chapterNumber"
          element={<ReadChapterPage />}
        />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="/the-loai/:slug" element={<CategoryPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/theo-doi" element={<FollowPage />} />
        <Route path="/lich-su" element={<HistoryPage />} />
        <Route path="/xep-hang" element={<RankingStories />} />
        <Route path="/ho-so" element={<InforUserPage />} />
        <Route path="/dang-truyen" element={<CreateStoryPage />} />
        <Route
          path="/dang-truyen/:storyId/chapters/create"
          element={<AddChapterPage />}
        />
        <Route path="/my-stories" element={<MyStoriesPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin">
          {/* Dashboard */}
          <Route index element={<AdminDashboardPage />} />

          {/* Users */}
          <Route path="users" element={<UserPage />} />

          {/* Stories */}
          <Route path="stories" element={<StoryPage />} />

          {/* Contributor applications */}
          <Route
            path="contributor-applications"
            element={<ContributorApplicationsPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
