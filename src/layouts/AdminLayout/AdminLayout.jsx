import "./AdminLayout.css";

import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader/AdminHeader";
import RouteFallback from "../../components/RouteFallback/RouteFallback";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div className="admin-layout">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div
        className={`admin-backdrop${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <main className="admin-main">
        <AdminHeader onMenuClick={() => setMenuOpen(true)} />

        <div className="admin-content">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}