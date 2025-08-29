// Multiple CORS proxies for fallback
const CORS_PROXIES = [
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.codetabs.com/v1/proxy?quest=",
];

let currentProxyIndex = 0;

function extractFirstImageFromHtml(html) {
  if (!html) return "";
  const imgMatch = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return imgMatch ? imgMatch[1] : "";
}

export async function fetchRssItems(feedUrl, category = "") {
  let lastError = null;

  // Try each proxy until one works
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl =
        CORS_PROXIES[currentProxyIndex] + encodeURIComponent(feedUrl);
      console.log(`Trying proxy ${currentProxyIndex + 1}:`, proxyUrl);

      const resp = await fetch(proxyUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; NewsApp/1.0)",
        },
        timeout: 10000, // 10 second timeout
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const text = await resp.text();

      // Successfully got data, keep using this proxy
      const result = parseRssText(text, feedUrl, category);
      console.log(`✅ Success with proxy ${currentProxyIndex + 1}`);
      return result;
    } catch (error) {
      console.warn(`❌ Proxy ${currentProxyIndex + 1} failed:`, error.message);
      lastError = error;

      // Try next proxy
      currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
    }
  }

  // All proxies failed, throw last error
  throw new Error(`All CORS proxies failed. Last error: ${lastError?.message}`);
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
    return {
      id: `ext_${btoa(unescape(encodeURIComponent(link))).slice(0, 16)}`,
      isExternal: true,
      title,
      url: link,
      thumbnailUrl: thumb,
      excerpt,
      createdAt: pubDate,
      category: category || sourceTitle,
      source: sourceTitle,
    };
  });
  return { sourceTitle, items };
}
