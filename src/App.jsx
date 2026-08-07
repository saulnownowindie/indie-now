import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout/PublicLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

/* Público */

import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import Reels from "./pages/Reels/Reels";
import Sessions from "./pages/Sessions/Sessions";
import MerchPage from "./pages/Merch/Merch";

/* Admin */

import Login from "./pages/admin/Login/Login";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import AdminNews from "./pages/admin/News/News";
import AdminSessions from "./pages/admin/Sessions/Sessions";
import AdminReels from "./pages/admin/Reels/Reels";
import AdminMerch from "./pages/admin/Merch/Merch";
import Configuracion from "./pages/admin/Configuracion/Configuracion";
import Categories from "./pages/admin/Categories/Categories";

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/sesiones" element={<Sessions />} />
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

        <Route path="settings" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}
