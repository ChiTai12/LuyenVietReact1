import { Link } from "react-router-dom";
import { FiClock, FiHeart, FiMessageCircle, FiUser } from "react-icons/fi";
import { useApp } from "../context/AppContext";

// Helper function để cắt ngắn text
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

export default function PostCard({ post, compact = false }) {
  const { favorites, toggleFavorite, users } = useApp();
  const isFavorited = favorites.has(post.id);

  // Xử lý content - cắt ngắn cho hiển thị
  const displayContent = truncateText(
    post.content || post.excerpt,
    compact ? 60 : 100
  );

  const authorFromUsers = users
    ? users.find((u) => String(u.id) === String(post.author?.id))
    : null;
  const authorByName =
    !authorFromUsers && users && post.author?.name
      ? users.find(
          (u) =>
            u.name &&
            post.author?.name &&
            u.name.toLowerCase() === post.author.name.toLowerCase()
        )
      : null;
  const author = authorFromUsers || authorByName || post.author || {};

  return (
    <Link
      to={`/bai-viet/${post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className={`post-card ${compact ? "post-card--compact" : ""}`}>
        {post.thumbnailUrl && (
          <div className="post-image">
            <img src={post.thumbnailUrl} alt={post.title} />
          </div>
        )}
        <div className="post-content">
          {!compact && <div className="post-category">{post.category}</div>}
          <h3 className="post-title">{post.title}</h3>
          <p className="post-description">{displayContent}</p>

          {/* Tags Section - chỉ hiển thị khi KHÔNG compact */}
          {!compact && post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="tag tags-overflow">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="post-meta">
            <div className="post-time">
              <FiClock size={14} />
              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>

            <div className="post-footer">
              <div className="author-info">
                {author?.avatarUrl ? (
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="author-avatar"
                  />
                ) : (
                  <div className="author-avatar placeholder">
                    <FiUser size={12} />
                  </div>
                )}
                <span className="author-name">{author?.name || "Ẩn danh"}</span>
              </div>

              <div className="post-actions">
                <div className="comments-count">
                  <FiMessageCircle size={14} />
                  <span>{post.comments?.length || 0}</span>
                </div>
                <button
                  className={`favorite-btn ${isFavorited ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(post.id);
                  }}
                >
                  <FiHeart
                    size={16}
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
