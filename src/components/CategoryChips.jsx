import { useApp } from '../context/AppContext'

export default function CategoryChips() {
  const { categories, selectedCategory, setSelectedCategory } = useApp()
  const all = ['Tất cả', ...categories]
  return (
    <div className="chips-bar">
      {all.map(cat => (
        <button
          key={cat}
          className={`chip ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}


