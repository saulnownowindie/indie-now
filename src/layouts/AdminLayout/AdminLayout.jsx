import "./AdminLayout.css";

import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader/AdminHeader";
import RouteFallback from "../../components/RouteFallback/RouteFallback";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
