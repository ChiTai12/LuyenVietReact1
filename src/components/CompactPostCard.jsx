import { FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function CompactPostCard({ post }) {
  const { users } = useApp();
  const authorFromUsers = users
    ? users.find((u) => String(u.id) === String(post.author?.id))
    : null;
  const normalize = (s) =>
    s
      ? s
          .toString()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase()
          .trim()
      : "";
  const authorByName =
    !authorFromUsers && users && post.author?.name
      ? users.find((u) => {
          const a = normalize(post.author.name);
          const b = normalize(u.name);
          if (!a || !b) return false;
          return (
            a === b ||
            a.includes(b) ||
            b.includes(a) ||
            b.split(/\s+/)[0] === a.split(/\s+/)[0]
          );
        })
      : null;
  const author = authorFromUsers || authorByName || post.author || {};
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
              {author?.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="compact-author-avatar"
                />
              ) : (
                <div className="compact-author-avatar placeholder"></div>
              )}
              <span className="compact-author-name">
                {author?.name || "Ẩn danh"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
