import "./App.css";

import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout/PublicLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import Reels from "./pages/Reels/Reels";
import Sessions from "./pages/Sessions/Sessions";
import MerchPage from "./pages/Merch/Merch";
import Login from "./pages/admin/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/noticias" element={<News />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/sesiones" element={<Sessions />} />
        <Route path="/merch" element={<MerchPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />

        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
