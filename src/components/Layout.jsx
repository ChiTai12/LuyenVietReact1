import { Link, NavLink, useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getLocalStorageSize, cleanupLocalStorage } from "../utils/storage";
import {
  FiHeart,
  FiHome,
  FiPlusCircle,
  FiUser,
  FiSearch,
  FiCompass,
  FiLogOut,
  FiDatabase,
} from "react-icons/fi";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const {
    categories,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    currentUser,
    logout,
    isAuthenticated,
  } = useApp();

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Hàm hiển thị thông tin localStorage
  function showStorageInfo() {
    const storageInfo = getLocalStorageSize();
    alert(`Thông tin localStorage:\nDung lượng: ${storageInfo.totalSizeMB}MB\nSố keys: ${storageInfo.keysCount}`);
  }

  // Hàm cleanup localStorage
  function handleCleanup() {
    if (confirm('Bạn có chắc muốn dọn dẹp localStorage? Điều này sẽ xóa một số dữ liệu cũ.')) {
      cleanupLocalStorage();
      alert('Đã dọn dẹp localStorage thành công!');
      window.location.reload(); // Reload để cập nhật UI
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand">
            Tin Tức 24H
          </Link>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FiHome /> <span>Trang chủ</span>
            </NavLink>
            <NavLink
              to="/dang-bai"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FiPlusCircle /> <span>Đăng bài</span>
            </NavLink>
            <NavLink
              to="/kham-pha"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FiCompass /> <span>Khám phá</span>
            </NavLink>
            <NavLink
              to="/yeu-thich"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FiHeart /> <span>Yêu thích</span>
            </NavLink>
            <NavLink
              to="/ho-so"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <FiUser /> <span>Hồ sơ</span>
            </NavLink>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <form className="search" onSubmit={handleSubmit}>
            <div className="search-input">
              <FiSearch />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tất cả">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </form>
          
          {/* Storage management buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={showStorageInfo}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
              }}
              title="Xem thông tin localStorage"
            >
              <FiDatabase />
            </button>
            <button
              onClick={handleCleanup}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
              }}
              title="Dọn dẹp localStorage"
            >
              🧹
            </button>
          </div>
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--muted)",
            }}
          >
            <span>Xin chào, {currentUser.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              title="Đăng xuất"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        © {new Date().getFullYear()} Tin Tức 24H
      </footer>
    </div>
  );
}
