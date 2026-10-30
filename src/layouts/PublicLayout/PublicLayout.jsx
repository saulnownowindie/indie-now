import "./PublicLayout.css";

import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import RouteFallback from "../../components/RouteFallback/RouteFallback";

export default function PublicLayout() {
  return (
    <>
      <Header />

      <Suspense fallback={<RouteFallback />}>
        <main className="public-layout">
          <Outlet />
        </main>

        <Footer />
      </Suspense>
    </>
  );
}
