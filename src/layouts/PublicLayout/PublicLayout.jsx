import { Outlet } from "react-router-dom";

import "./PublicLayout.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function PublicLayout() {
  return (
    <>
      <Header />

      <main className="public-layout">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}