import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { FiExternalLink } from 'react-icons/fi'

export default function Favorites() {
  const { posts, favorites, favoriteExternalItems } = useApp()
  const favInternal = posts.filter(p => favorites.has(p.id))
  const favExternal = Object.values(favoriteExternalItems)
  const hasAny = favInternal.length + favExternal.length > 0
  return (
    <div className="grid">
      {!hasAny && <div className="empty">Chưa có bài yêu thích</div>}
      {favInternal.map(p => <PostCard key={p.id} post={p} />)}
      {favExternal.map(item => (
        <article key={item.id} className="post-card">
          {item.thumbnailUrl && (
            <a href={item.url} className="thumb" target="_blank" rel="noreferrer">
              <img src={item.thumbnailUrl} alt={item.title} />
            </a>
          )}
          <div className="post-content">
            <div className="post-meta">
              <span className="category">{item.category}</span>
              <a className="fav" href={item.url} target="_blank" rel="noreferrer" title="Mở nguồn">
                <FiExternalLink />
              </a>
            </div>
            <h3 className="post-title">
              <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
            </h3>
            <p className="excerpt">{item.excerpt}</p>
            <div className="author-row">
              <div className="author-meta">
                <span className="name">{item.source}</span>
                <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}


