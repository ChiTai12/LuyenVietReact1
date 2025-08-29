import { FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CompactPostCard({ post }) {
  return (
    <Link
      to={`/bai-viet/${post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="compact-post-card">
        {/* Thumbnail */}
        <div className="compact-thumb-container">
          {post.thumbnailUrl && (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="compact-thumb"
            />
          )}
        </div>

        {/* Content */}
        <div className="compact-content">
          {/* Category */}
          <div
            className={`compact-category ${post.category
              ?.toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {post.category}
          </div>

          {/* Title */}
          <h4 className="compact-title">{post.title}</h4>

          {/* Meta info */}
          <div className="compact-meta">
            <div className="compact-time">
              <FiClock size={12} />
              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  : "N/A"}
              </span>
            </div>

            {/* Author */}
            <div className="compact-author">
              {post.author?.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="compact-author-avatar"
                />
              ) : (
                <div className="compact-author-avatar placeholder"></div>
              )}
              <span className="compact-author-name">
                {post.author?.name || "Ẩn danh"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
