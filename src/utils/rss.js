// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.codetabs.com/v1/proxy?quest=",
];

function extractFirstImageFromHtml(html) {
  if (!html) return "";
  const imgMatch = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return imgMatch ? imgMatch[1] : "";
}

export async function fetchRssItems(feedUrl, category = "") {
  let lastError = null;

  // Luôn thử lại từ proxy đầu tiên mỗi lần fetch
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyUrl = CORS_PROXIES[i] + encodeURIComponent(feedUrl);
    try {
      // Không set User-Agent vì nhiều proxy sẽ chặn
      const resp = await fetch(proxyUrl, {
        timeout: 10000,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const result = parseRssText(text, feedUrl, category);
      return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `Tất cả proxy CORS đều thất bại. Lỗi cuối: ${lastError?.message}`
  );
}

function parseRssText(text, feedUrl, category) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  const sourceTitle =
    xml.querySelector("channel > title")?.textContent?.trim() || "Nguồn";
  const items = Array.from(xml.querySelectorAll("item")).map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.textContent || "";
    const enclosure =
      item.querySelector("enclosure")?.getAttribute("url") || "";
    const pubDate =
      item.querySelector("pubDate")?.textContent?.trim() ||
      new Date().toISOString();
    const thumb = enclosure || extractFirstImageFromHtml(description);
    const excerpt = description
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
    // Try to map external content to app categories (best-effort)
    const mappedCategory = mapExternalCategory(
      category,
      sourceTitle,
      title,
      description
    );

    return {
      id: `ext_${btoa(unescape(encodeURIComponent(link))).slice(0, 16)}`,
      isExternal: true,
      title,
      url: link,
      thumbnailUrl: thumb,
      excerpt,
      createdAt: pubDate,
      category: mappedCategory || sourceTitle,
      source: sourceTitle,
    };
  });
  return { sourceTitle, items };
}

// Lightweight keyword-based mapper: map external feed content to one of the
// in-app categories. This is intentionally simple and heuristic-based.
function mapExternalCategory(
  providedCategory,
  sourceTitle,
  title,
  description
) {
  // If the importer already passed a category and it looks reasonable, use it
  if (
    providedCategory &&
    providedCategory.trim() &&
    providedCategory !== "Nguồn"
  ) {
    return providedCategory;
  }

  const text = `${sourceTitle} ${title} ${description}`.toLowerCase();

  const mapping = [
    {
      cat: "Công nghệ",
      keywords: [
        "công ngh",
        "tech",
        "ai",
        "chatgpt",
        "openai",
        "phần mềm",
        "công nghệ",
      ],
    },
    {
      cat: "Kinh doanh",
      keywords: [
        "bất động sản",
        "bđs",
        "kinh doanh",
        "doanh nghiệp",
        "thị trường",
        "tài chính",
        "ngân hàng",
      ],
    },
    {
      cat: "Thể thao",
      keywords: [
        "bóng đá",
        "world cup",
        "thể thao",
        "vòng chung kết",
        "fifa",
        "cầu thủ",
      ],
    },
    {
      cat: "Giải trí",
      keywords: [
        "phim",
        "trailer",
        "giải trí",
        "âm nhạc",
        "hàng giải trí",
        "showbiz",
      ],
    },
  ];

  for (const m of mapping) {
    for (const kw of m.keywords) {
      if (text.includes(kw)) return m.cat;
    }
  }

  // No match — return null so caller can fallback to sourceTitle
  return null;
}
