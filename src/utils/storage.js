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
    if (key === 'posts' && Array.isArray(value)) {
      // Ước tính dung lượng của posts
      const estimatedSize = JSON.stringify(value).length;
      if (estimatedSize > 4 * 1024 * 1024) { // 4MB
        console.warn('Posts data quá lớn, có thể gây lỗi localStorage');
        // Xóa các bài viết cũ để giảm dung lượng
        const cleanedPosts = value.slice(-20); // Giữ 20 bài viết gần nhất
        localStorage.setItem(key, JSON.stringify(cleanedPosts));
        return;
      }
    }
    
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Lỗi khi lưu vào localStorage:', error);
    // Nếu localStorage đầy, thử cleanup
    cleanupLocalStorage();
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (retryError) {
      console.error('Vẫn không thể lưu sau khi cleanup:', retryError);
    }
  }
}

// Hàm cleanup localStorage
export function cleanupLocalStorage() {
  try {
    const keys = Object.keys(localStorage);
    let totalSize = 0;
    
    // Tính tổng dung lượng
    keys.forEach(key => {
      totalSize += localStorage.getItem(key)?.length || 0;
    });
    
    // Nếu vượt quá 4MB, xóa dữ liệu cũ
    if (totalSize > 4 * 1024 * 1024) {
      console.log('Cleaning up localStorage...');
      
      // Xóa posts cũ (giữ 10 bài gần nhất)
      const posts = readJSON('posts', []);
      if (posts.length > 10) {
        const cleanedPosts = posts.slice(-10);
        localStorage.setItem('posts', JSON.stringify(cleanedPosts));
        console.log('Đã xóa posts cũ, giữ lại', cleanedPosts.length, 'bài');
      }
      
      // Xóa favorites cũ
      const favorites = readJSON('favorites', []);
      if (favorites.length > 50) {
        const cleanedFavorites = favorites.slice(-50);
        localStorage.setItem('favorites', JSON.stringify(cleanedFavorites));
        console.log('Đã xóa favorites cũ, giữ lại', cleanedFavorites.length, 'item');
      }
    }
  } catch (error) {
    console.error('Lỗi khi cleanup localStorage:', error);
  }
}

// Hàm kiểm tra dung lượng localStorage
export function getLocalStorageSize() {
  try {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      totalSize += localStorage.getItem(key)?.length || 0;
    });
    
    return {
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      keysCount: keys.length
    };
  } catch (error) {
    return { totalSize: 0, totalSizeMB: '0', keysCount: 0 };
  }
}

// Hàm xóa hoàn toàn localStorage
export function clearLocalStorage() {
  try {
    localStorage.clear();
    console.log('Đã xóa toàn bộ localStorage');
  } catch (error) {
    console.error('Lỗi khi xóa localStorage:', error);
  }
}
