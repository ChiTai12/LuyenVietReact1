import { useApp } from "../context/AppContext";

export default function CategoryChips() {
  const { categories, selectedCategory, setSelectedCategory } = useApp();
  const defaultCats = ["Công nghệ", "Kinh doanh", "Thể thao", "Giải trí"];
  const cats = categories && categories.length ? categories : defaultCats;
  // dedupe categories (case-insensitive) to avoid duplicate chips
  const normalized = cats.map((c) => c.trim());
  const uniqueCats = Array.from(
    normalized
      .reduce((acc, c) => acc.set(c.toLowerCase(), c), new Map())
      .values()
  );
  const all = ["Tất cả", ...uniqueCats];
  return (
    <div className="chips-bar">
      {all.map((cat) => (
        <button
          key={cat}
          className={`chip ${selectedCategory === cat ? "active" : ""}`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
