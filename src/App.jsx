import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Explore from "./pages/Explore";
import Login from "./pages/Login"; // Thêm import
import ToastHost from "./components/ToastHost";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dang-bai" element={<CreatePost />} />
                    <Route path="/kham-pha" element={<Explore />} />
                    <Route path="/yeu-thich" element={<Favorites />} />
                    <Route path="/ho-so" element={<Profile />} />
                    <Route path="/bai-viet/:id" element={<PostDetail />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
          <ToastHost />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
