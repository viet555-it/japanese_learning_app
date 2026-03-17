import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/Home";
import Kana from "./pages/Kana";
import Vocab from "./pages/Vocab";
import Kanji from "./pages/Kanji";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return isHome ? (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  ) : (
    <MainLayout>
      <Routes>
        <Route path="/kana" element={<Kana />} />
        <Route path="/vocab" element={<Vocab />} />
        <Route path="/kanji" element={<Kanji />} />
      </Routes>
    </MainLayout>
  );
}

export default App;