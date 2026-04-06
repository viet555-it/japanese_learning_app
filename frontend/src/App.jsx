import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/Home";
import Kana from "./pages/Kana";
import Vocab from "./pages/Vocab";
import Kanji from "./pages/Kanji";
import ProgressPage from './pages/Progress/index.jsx';
import LoginPage from "./pages/Authentication/LoginPage";
import SignUpPage from "./pages/Authentication/SignUpPage";
import { useAuth } from "./context/AuthContext";
import GlobalEffects from "./components/effects/GlobalEffects";
import PreferencesPage from "./pages/Preferences/PreferencesPage";
import FeedbackPage from "./pages/Feedback/FeedbackPage";

// Training Pages — rendered outside MainLayout for true full-screen
import TrainingSetup from "./pages/Training/TrainingSetup";
import TrainingPlay from "./pages/Training/TrainingPlay";
import TrainingStats from "./pages/Training/TrainingStats";

// Route wrapper: redirect to login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Route wrapper: redirect to app if already authenticated
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  // Training routes: full-screen, no sidebar, no mobile topbar
  const isTraining = location.pathname.startsWith("/training/");

  if (isHome) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    );
  }

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><SignUpPage /></GuestRoute>} />
      </Routes>
    );
  }

  // Training pages: protected but rendered WITHOUT MainLayout
  if (isTraining) {
    return (
      <ProtectedRoute>
        <Routes>
          <Route path="/training/setup" element={<TrainingSetup />} />
          <Route path="/training/play" element={<TrainingPlay />} />
          <Route path="/training/stats" element={<TrainingStats />} />
        </Routes>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          <Route path="/kana" element={<Kana />} />
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <>
      <GlobalEffects />
      <AppContent />
    </>
  );
}

export default App;