import "./App.css";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import News from "./pages/News/News";
import Reels from "./pages/Reels/Reels";
import Sessions from "./pages/Sessions/Sessions";
import MerchPage from "./pages/Merch/Merch";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/noticias" element={<News />} />

        <Route path="/reels" element={<Reels />} />

        <Route path="/sesiones" element={<Sessions />} />

        <Route path="/merch" element={<MerchPage />} />
      </Routes>

      <Footer />
    </>
  );
}