import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { shareLink } from "../utils/share";
import { useToast } from "../context/useToast";
import PostCard from "../components/PostCard";

export default function PostDetail() {
  const { id } = useParams();
  const { posts, addComment, currentUser, categories, users } = useApp();
  const post = useMemo(
    () => posts.find((p) => String(p.id) === String(id)),
    [posts, id]
  );
  const [text, setText] = useState("");
  const { notify } = useToast();

  // Lấy các bài viết liên quan (cùng category, loại trừ bài hiện tại)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
  }, [posts, post]);

  // Lấy các bài viết mới nhất (loại trừ bài hiện tại)
  const latestPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.id !== post.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [posts, post]);

  if (!post) return <div className="empty">Bài viết không tồn tại</div>;

  function handleAddComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const comment = {
      id: `${post.id}_${Date.now()}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    addComment(post.id, comment);
    setText("");
  }

  return (
    <div className="post-detail-container">
      {/* Main Content - Left Column */}
      <div className="post-detail-main">
        <article className="post-detail">
          {/* Category Badge */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="post-category-badge">{post.category}</div>
          </div>

          {/* Title */}
          <h1 className="post-detail-title">{post.title}</h1>

          {/* Meta Information */}
          <div className="post-detail-meta">
            <span className="post-date">
              Đăng lúc {new Date(post.createdAt).toLocaleString("vi-VN")}
            </span>
            <button
              onClick={async () => {
                const r = await shareLink(window.location.href, post.title);
                if (r.ok)
                  notify(
                    r.method === "webshare"
                      ? "Đã mở chia sẻ hệ thống"
                      : "Đã copy link"
                  );
              }}
              className="share-btn"
            >
              Chia sẻ
            </button>
          </div>

          {/* Thumbnail Image */}
          {post.thumbnailUrl && (
            <img
              className="detail-thumb"
              src={post.thumbnailUrl}
              alt={post.title}
            />
          )}

          {/* (badge shown above) */}

          {/* Content */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: post.content?.replace(/\n/g, "<br/>"),
            }}
          />

          {/* Comments Section */}
          <section className="comments">
            <h2 className="comments-title">Bình luận của bạn</h2>
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Viết bình luận..."
                rows={4}
                className="comment-textarea"
              />
              <button type="submit" className="comment-submit-btn">
                Bình Luận
              </button>
            </form>

            <div className="comment-list">
              {(post.comments || [])
                .slice()
                .reverse()
                .map((c, i) => {
                  // Resolve the latest author info by user id when possible so
                  // profile updates (avatar/name) reflect in existing comments.
                  const authorFromUsers = users
                    ? users.find((u) => String(u.id) === String(c.author?.id))
                    : null;
                  // If no id match, try to match by name (case-insensitive) to
                  // handle cases where the same person exists under different ids.
                  // better name-based matching: normalize (remove diacritics),
                  // lowercase, trim and check equality or substring matches so
                  // "Kuribo Nguyễn" and "Kuribo Nguyễn NE" can match.
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
                    !authorFromUsers && users && c.author?.name
                      ? users.find((u) => {
                          const a = normalize(c.author.name);
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
                  const author =
                    authorFromUsers || authorByName || c.author || {};
                  return (
                    <div
                      className="comment"
                      key={c.id || `${post.id}_comment_${i}_${String(c.createdAt || Date.now())}`}
                    >
                      {author.avatarUrl ? (
                        <img
                          className="avatar"
                          src={author.avatarUrl}
                          alt={author.name}
                        />
                      ) : (
                        <div className="avatar placeholder">
                          {author.name?.[0] || "A"}
                        </div>
                      )}
                      <div className="bubble">
                        <div className="meta">
                          <span className="name">
                            {author.name || "Ẩn danh"}
                          </span>
                          <span className="date">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text">{c.text}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </article>
      </div>

      {/* Sidebar - Right Column */}
      <div className="post-detail-sidebar">
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Bài viết liên quan</h3>
            <div className="sidebar-posts">
              {relatedPosts.map((relatedPost) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Latest Posts */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Tin tức mới nhất</h3>
          <div className="sidebar-posts">
            {latestPosts.map((latestPost) => (
              <PostCard key={latestPost.id} post={latestPost} compact={true} />
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Chuyên mục phổ biến</h3>
          <div className="sidebar-categories">
            {(categories && categories.length
              ? Array.from(
                  categories
                    .map((c) => c.trim())
                    .reduce((m, s) => {
                      const key = s.toLowerCase();
                      if (!m.has(key)) m.set(key, s);
                      return m;
                    }, new Map())
                    .values()
                )
              : ["Công nghệ", "Kinh doanh", "Thể thao", "Giải trí"]
            ).map((category) => (
              <div key={category} className="sidebar-category-item">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
