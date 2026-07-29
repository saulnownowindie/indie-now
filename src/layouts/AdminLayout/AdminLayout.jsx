import "./AdminLayout.css";

import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminHeader />

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}