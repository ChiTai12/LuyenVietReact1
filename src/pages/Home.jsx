import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import PostCard from "../components/PostCard";
import CategoryChips from "../components/CategoryChips";
import { FiTrendingUp, FiClock, FiUsers } from "react-icons/fi";

export default function Home() {
  const { posts, searchKeyword, selectedCategory } = useApp();

  const filtered = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return posts.filter((p) => {
      const matchKeyword =
        !keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.excerpt?.toLowerCase().includes(keyword) ||
        p.content?.toLowerCase().includes(keyword);
      const matchCategory =
        selectedCategory === "Tất cả" || p.category === selectedCategory;
      return matchKeyword && matchCategory;
    });
  }, [posts, searchKeyword, selectedCategory]);

  // Sắp xếp theo thời gian tạo (mới nhất trước)
  const sortedPosts = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [filtered]);

  // Phân chia bài viết
  const featuredPosts = sortedPosts.slice(0, 3); // 3 bài mới nhất
  const remainingPosts = sortedPosts.slice(3); // Các bài còn lại

  return (
    <>
      {/* Category Chips - Clean and modern */}
      <CategoryChips />

      {/* Latest News Section - Simplified and beautiful */}
      <div style={{ marginBottom: "40px" }}>
        <div
          className="latest-header"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            padding: "16px 28px",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "32px",
            borderRadius: "12px",
            display: "inline-block",
            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
            border: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>
            Tin tức mới nhất
          </span>
        </div>

        <div className="grid">
          {featuredPosts.length === 0 ? (
            <div className="empty" style={{ gridColumn: "1 / -1" }}>
              <FiTrendingUp
                size={48}
                style={{ marginBottom: "16px", opacity: 0.5 }}
              />
              <div>Không có bài viết mới nào</div>
              <small style={{ display: "block", marginTop: "8px" }}>
                Thử chọn danh mục khác
              </small>
            </div>
          ) : (
            featuredPosts.map((post) => (
              <PostCard key={`featured-${post.id}`} post={post} />
            ))
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {remainingPosts.length > 0 && (
        <div>
          <div
            className="other-posts-header"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              padding: "16px 28px",
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "32px",
              borderRadius: "12px",
              display: "inline-block",
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
              border: "none",
            }}
          >
            Bài viết khác ({remainingPosts.length})
          </div>

          <div className="grid grid-compact">
            {remainingPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no posts at all */}
      {sortedPosts.length === 0 && (
        <div
          className="empty"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <FiTrendingUp
            size={64}
            style={{ marginBottom: "24px", opacity: 0.3 }}
          />
          <h3 style={{ margin: "0 0 12px 0", color: "#6b7280" }}>
            Không có bài viết phù hợp
          </h3>
          <p style={{ margin: 0, color: "#9ca3af" }}>
            {selectedCategory !== "Tất cả"
              ? `Không tìm thấy bài viết trong danh mục "${selectedCategory}"`
              : "Thử thay đổi từ khóa tìm kiếm"}
          </p>
        </div>
      )}
    </>
  );
}
