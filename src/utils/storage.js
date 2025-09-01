export function readJSON(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function writeJSON(key, value) {
  try {
    // Kiểm tra dung lượng localStorage trước khi lưu
    if (key === "posts" && Array.isArray(value)) {
      // Ước tính dung lượng của posts
      const estimatedSize = JSON.stringify(value).length;
      if (estimatedSize > 4 * 1024 * 1024) {
        // 4MB
        console.warn("Posts data quá lớn, có thể gây lỗi localStorage");
        // Xóa các bài viết cũ để giảm dung lượng
        const cleanedPosts = value.slice(-20); // Giữ 20 bài viết gần nhất
        localStorage.setItem(key, JSON.stringify(cleanedPosts));
        return;
      }
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Lỗi khi lưu vào localStorage");
    // Nếu localStorage đầy, thử cleanup
    cleanupLocalStorage();
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Vẫn không thể lưu sau khi cleanup");
    }
  }
}

// Hàm cleanup localStorage
export function cleanupLocalStorage() {
  try {
    const keys = Object.keys(localStorage);
    let totalSize = 0;

    // Tính tổng dung lượng
    keys.forEach((key) => {
      totalSize += localStorage.getItem(key)?.length || 0;
    });

    // Nếu vượt quá 4MB, xóa dữ liệu cũ
    if (totalSize > 4 * 1024 * 1024) {
      console.log("Cleaning up localStorage...");

      // Xóa posts cũ (giữ 10 bài gần nhất)
      const posts = readJSON("posts", []);
      if (posts.length > 10) {
        const cleanedPosts = posts.slice(-10);
        localStorage.setItem("posts", JSON.stringify(cleanedPosts));
        console.log("Đã xóa posts cũ, giữ lại", cleanedPosts.length, "bài");
      }

      // Xóa favorites cũ
      const favorites = readJSON("favorites", []);
      if (favorites.length > 50) {
        const cleanedFavorites = favorites.slice(-50);
        localStorage.setItem("favorites", JSON.stringify(cleanedFavorites));
        console.log(
          "Đã xóa favorites cũ, giữ lại",
          cleanedFavorites.length,
          "item"
        );
      }
    }
  } catch {
    console.error("Lỗi khi cleanup localStorage");
  }
}

// Hàm kiểm tra dung lượng localStorage
export function getLocalStorageSize() {
  try {
    let totalSize = 0;
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      totalSize += localStorage.getItem(key)?.length || 0;
    });

    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      keysCount: keys.length,
    };
  } catch {
    return { totalSize: 0, totalSizeMB: "0", keysCount: 0 };
  }
}

// Hàm xóa hoàn toàn localStorage
export function clearLocalStorage() {
  try {
    localStorage.clear();
    console.log("Đã xóa toàn bộ localStorage");
  } catch {
    console.error("Lỗi khi xóa localStorage");
  }
}

// Hàm dọn dẹp toàn diện giống 'Clear storage' trong DevTools
// options: { reload: boolean } - nếu true thì reload trang sau khi xóa
export async function clearAllStorage(options = { reload: false }) {
  const { reload } = options;
  try {
    // localStorage + sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log("Đã xóa localStorage và sessionStorage");
    } catch {
      console.warn("Không thể xóa local/session storage");
    }

    // Cookies: set expiration in the past for all cookies
    try {
      const cookies = document.cookie
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean);
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // set cookie expired for root path
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        // also try without path
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      });
      console.log("Đã xóa cookies (cố gắng)");
    } catch {
      console.warn("Không thể xóa cookies");
    }

    // Cache Storage (Service Worker caches)
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log("Đã xóa CacheStorage:", cacheNames);
      }
    } catch {
      console.warn("Không thể xóa CacheStorage");
    }

    // IndexedDB: try standardized .databases() first, fallback to best-effort
    try {
      if ("indexedDB" in window) {
        if (indexedDB.databases) {
          const dbs = await indexedDB.databases();
          await Promise.all(
            dbs.map((db) => db.name && indexedDB.deleteDatabase(db.name))
          );
          console.log(
            "Đã xóa IndexedDB databases:",
            dbs.map((d) => d.name)
          );
        } else {
          // Older browsers: attempt to delete known app DB names if any
          // (best effort - no standardized API)
          console.log(
            "indexedDB.databases() không hỗ trợ trên trình duyệt này"
          );
        }
      }
    } catch {
      console.warn("Không thể xóa IndexedDB");
    }

    // Unregister service workers
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
        console.log("Đã unregister service workers");
      }
    } catch {
      console.warn("Không thể unregister service workers");
    }

    // Optional: reload so the app initializes from empty storage (like DevTools clear)
    if (reload) {
      // small delay so logs flush
      setTimeout(() => {
        try {
          window.location.reload(true);
        } catch {
          window.location.reload();
        }
      }, 150);
    }

    return true;
  } catch (error) {
    console.error("Lỗi khi thực hiện clearAllStorage:", error);
    return false;
  }
}

// Xóa các key tạm, KHÔNG xóa `posts` hoặc `users`
// options: { clearFavorites: boolean }
export function clearTempStorage(options = { clearFavorites: false }) {
  const { clearFavorites } = options;
  try {
    // Keys considered temporary
    const tempKeys = ["is_authenticated", "favorite_external_items"];
    if (clearFavorites) tempKeys.push("favorites");

    tempKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        console.warn(`Không thể xóa key ${k}:`);
      }
    });

    console.log("Đã xóa các key tạm:", tempKeys);
    return true;
  } catch (error) {
    console.error("Lỗi khi clearTempStorage:", error);
    return false;
  }
}
