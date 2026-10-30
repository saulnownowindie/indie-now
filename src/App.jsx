import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout/PublicLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import RouteFallback from "./components/RouteFallback/RouteFallback";

/* Público */

import Home from "./pages/Home/Home";

const News = lazy(() => import("./pages/News/News"));
const NewsDetail = lazy(() => import("./pages/News/NewsDetail"));
const Reviews = lazy(() => import("./pages/Reviews/Reviews"));
const MustSee = lazy(() => import("./pages/MustSee/MustSee"));
const Reels = lazy(() => import("./pages/Reels/Reels"));
const Sessions = lazy(() => import("./pages/Sessions/Sessions"));
const MerchPage = lazy(() => import("./pages/Merch/Merch"));

/* Admin */

const AdminLayout = lazy(
  () => import("./layouts/AdminLayout/AdminLayout"),
);
const Login = lazy(() => import("./pages/admin/Login/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard/Dashboard"));
const AdminNews = lazy(() => import("./pages/admin/News/News"));
const AdminSessions = lazy(
  () => import("./pages/admin/Sessions/Sessions"),
);
const AdminReels = lazy(() => import("./pages/admin/Reels/Reels"));
const AdminMerch = lazy(() => import("./pages/admin/Merch/Merch"));
const AdminPlaylists = lazy(
  () => import("./pages/admin/Playlists/Playlists"),
);
const Configuracion = lazy(
  () => import("./pages/admin/Configuracion/Configuracion"),
);
const Categories = lazy(
  () => import("./pages/admin/Categories/Categories"),
);

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Sitio público */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/noticias/:slug" element={<NewsDetail />} />
          <Route path="/resenas" element={<Reviews />} />
          <Route path="/sesiones" element={<Sessions />} />
          <Route path="/no-podes-perderte" element={<MustSee />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/merch" element={<MerchPage />} />
        </Route>

        {/* Login */}

        <Route path="/admin/login" element={<Login />} />

        {/* Panel */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="categories" element={<Categories />} />
          <Route index element={<Dashboard />} />

          <Route path="news" element={<AdminNews />} />

          <Route path="sessions" element={<AdminSessions />} />

          <Route path="reels" element={<AdminReels />} />

          <Route path="merch" element={<AdminMerch />} />

          <Route path="playlists" element={<AdminPlaylists />} />

          <Route path="settings" element={<Configuracion />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
