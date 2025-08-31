import { useEffect, useMemo, useState } from "react";
import { fetchRssItems } from "../utils/rss";
import { FiExternalLink, FiRefreshCw, FiShare2 } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { shareLink } from "../utils/share";
import { useToast } from "../context/ToastContext";

const FEEDS = [
  {
    name: "VnExpress - Tin mới nhất",
    url: "https://vnexpress.net/rss/tin-moi-nhat.rss",
    category: "Tin tức",
  },
];

function ExternalCard({ item }) {
  const { notify } = useToast();

  return (
    <article className="explore-card">
      {item.thumbnailUrl && (
        <div className="explore-card-image">
          <a href={item.url} target="_blank" rel="noreferrer">
            <img src={item.thumbnailUrl} alt={item.title} />
          </a>
        </div>
      )}
      <div className="explore-card-content">
        <div className="explore-meta">
          <span className="explore-category">{item.category}</span>
          <span className="explore-time">
            {new Date(item.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <h3 className="explore-title">
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.title}
          </a>
        </h3>

        <p className="explore-excerpt">{item.excerpt}</p>

        <div className="explore-actions">
          <span className="explore-source">{item.source}</span>
          <div className="explore-buttons">
            <button
              className="explore-btn"
              onClick={async () => {
                const r = await shareLink(item.url, item.title);
                if (r.ok)
                  notify(
                    r.method === "webshare"
                      ? "Đã mở chia sẻ hệ thống"
                      : "Đã copy link"
                  );
              }}
              title="Chia sẻ"
            >
              <FiShare2 />
            </button>
            <a
              className="explore-btn"
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title="Đọc bài gốc"
            >
              <FiExternalLink />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Explore() {
  const { selectedCategory } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState(() => {
    // Load from cache first
    const cached = localStorage.getItem("explore-cache");
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return data;
        }
      } catch {
        // Invalid cache, ignore
      }
    }
    return [];
  });

  const feedsToUse = useMemo(() => FEEDS, []);

  async function load() {
    try {
      setLoading(true);
      setError("");

      // Load only first feed for speed
      const result = await fetchRssItems(
        feedsToUse[0].url,
        feedsToUse[0].category
      );
      const newItems = result.items.slice(0, 20); // Limit to 20 items for speed

      // Cache the result
      localStorage.setItem(
        "explore-cache",
        JSON.stringify({
          data: newItems,
          timestamp: Date.now(),
        })
      );

      setItems(newItems);
    } catch (error) {
      console.warn("RSS feed error:", error);

      // Fallback: Load mock data if RSS fails
      const mockItems = [
        {
          id: "mock_1",
          title: "🚀 Tin tức đang được tải từ VnExpress...",
          excerpt:
            "Đang thử kết nối với nhiều proxy CORS khác nhau để tải tin tức mới nhất.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
          url: "https://vnexpress.net",
          category: "Tin tức",
          createdAt: new Date().toISOString(),
          source: "VnExpress",
        },
        {
          id: "mock_2",
          title: "⚡ Hệ thống đang tối ưu tốc độ tải",
          excerpt:
            "Chúng tôi đang sử dụng multiple CORS proxies và cache để mang đến trải nghiệm tốt nhất.",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
          url: "#",
          category: "Công nghệ",
          createdAt: new Date().toISOString(),
          source: "Hệ thống",
        },
      ];

      setItems(mockItems);
      setError(
        "⚠️ Đang thử kết nối lại với RSS. Vui lòng nhấn 'Làm mới' sau vài giây hoặc kiểm tra kết nối mạng."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearCache() {
    localStorage.removeItem("explore-cache");
    setItems([]);
    alert('🗑️ Đã xóa cache! Nhấn "Làm mới" để fetch lại từ RSS');
  }

  useEffect(() => {
    // Only load if no cached data
    if (items.length === 0) {
      load();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    if (!selectedCategory || selectedCategory === "Tất cả") return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="explore-container">
      <div className="explore-header">
        <div className="explore-title-section">
          <h1 className="explore-title">Khám phá</h1>
          <p className="explore-subtitle">Tin tức mới nhất từ VnExpress</p>
        </div>
        <div className="explore-actions">
          <button
            onClick={load}
            disabled={loading}
            className={`explore-refresh-btn ${loading ? "loading" : ""}`}
          >
            <FiRefreshCw className={loading ? "spinning" : ""} />
            {loading ? "Đang tải..." : "Làm mới"}
          </button>

          <button onClick={clearCache} className="explore-clear-cache-btn">
            🗑️ Xóa Cache
          </button>
        </div>
      </div>

      {error && (
        <div
          className="explore-error"
          style={{
            color: "red",
            background: "#fffbe7",
            border: "1px solid #fbbf24",
            padding: 16,
            borderRadius: 8,
            margin: "16px 0",
          }}
        >
          <p style={{ marginBottom: 8 }}>
            <b>Lỗi tải tin tức:</b> {error}
          </p>
          <button onClick={load} className="explore-retry-btn">
            Thử lại
          </button>
        </div>
      )}

      <div className="explore-grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="explore-skeleton">
              <div className="skeleton-image" />
              <div className="skeleton-content">
                <div className="skeleton-meta" />
                <div className="skeleton-title" />
                <div className="skeleton-excerpt" />
                <div className="skeleton-footer" />
              </div>
            </div>
          ))}
        {!loading &&
          filtered.map((item) => <ExternalCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
