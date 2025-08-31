import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addPost, categories, currentUser } = useApp();
  const { notify } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const titleId = useId();
  const catId = useId();
  const thumbId = useId();

  // Validation states
  const isFormValid = title.trim().length >= 5 && content.trim().length >= 50;

  // Default thumbnails per category (hoisted so preview can use it)
  const getDefaultThumbnail = (category) => {
    const defaultImages = {
      "Công nghệ":
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop&crop=center",
      "Kinh doanh":
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      "Thể thao":
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&crop=center",
      "Giải trí":
        "https://images.unsplash.com/photo-1489599511914-e83737003ea2?w=800&h=600&fit=crop&crop=center",
    };
    return (
      defaultImages[category] ||
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center"
    );
  };

  // Hàm nén ảnh
  function compressImage(file) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Tính toán kích thước mới (giữ tỷ lệ, max width 800px)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Vẽ ảnh đã resize
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển thành base64 với chất lượng 0.7 (70%)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB", { type: "error" });
      return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      notify("Vui lòng chọn file ảnh hợp lệ", { type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Nén ảnh trước khi lưu
        const compressedImage = await compressImage(file);
        setThumbnailUrl(compressedImage);
        notify("Ảnh đã được tải lên và nén thành công!");
      } catch (error) {
        console.error("Lỗi nén ảnh:", error);
        notify("Có lỗi xảy ra khi xử lý ảnh", { type: "error" });
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      notify("Vui lòng nhập đầy đủ tiêu đề và nội dung", { type: "error" });
      return;
    }

    const id = `${Date.now()}`;

    // Tạo excerpt thông minh từ nội dung
    const cleanContent = content.trim();
    let excerpt = "";

    // Lấy câu đầu tiên hoặc 120 ký tự đầu
    const firstSentence = cleanContent.split(".")[0];
    if (firstSentence.length <= 120) {
      excerpt = firstSentence + (cleanContent.includes(".") ? "." : "");
    } else {
      excerpt = cleanContent.slice(0, 120);
      // Cắt tại từ cuối cùng hoàn chỉnh
      const lastSpace = excerpt.lastIndexOf(" ");
      if (lastSpace > 80) {
        excerpt = excerpt.slice(0, lastSpace);
      }
    }

    // Xử lý tags thông minh
    const tagsArray = tags.trim()
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag && tag.length >= 2)
          .slice(0, 6) // Giới hạn tối đa 6 tags
      : [];

    // Đảm bảo có ảnh bìa (dùng ảnh mặc định theo category nếu không có)
    const getDefaultThumbnail = (category) => {
      const defaultImages = {
        "Công nghệ":
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop&crop=center",
        "Kinh doanh":
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
        "Thể thao":
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&crop=center",
        "Giải trí":
          "https://images.unsplash.com/photo-1489599511914-e83737003ea2?w=800&h=600&fit=crop&crop=center",
      };
      return (
        defaultImages[category] ||
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center"
      );
    };

    const finalThumbnailUrl = thumbnailUrl || getDefaultThumbnail(category);

    addPost({
      id,
      title: title.trim(),
      category,
      content: cleanContent,
      excerpt,
      thumbnailUrl: finalThumbnailUrl,
      tags: tagsArray,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl || "https://i.pravatar.cc/150?img=9",
      },
      comments: [],
    });

    notify("Đăng bài thành công!");
    navigate(`/bai-viet/${id}`);
  }

  return (
    <div className="create-post-container">
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Đăng bài viết mới</h1>
          <p className="form-description">
            Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng
          </p>
        </div>

        <div className="create-post-group">
          <label htmlFor={titleId}>
            Tiêu đề <span className="required">*</span>
          </label>
          <input
            id={titleId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn"
            required
          />
          <small className="form-hint">
            Tiêu đề nên rõ ràng, hấp dẫn và ít nhất 5 ký tự (
            {title.trim().length}/5)
          </small>
        </div>

        <div className="create-post-group">
          <label htmlFor={catId}>
            Chuyên mục <span className="required">*</span>
          </label>
          <select
            id={catId}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="create-post-group">
          <label htmlFor={thumbId}>Ảnh bìa</label>
          <input
            id={thumbId}
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
          <small className="form-hint">
            Ảnh bìa giúp bài viết thu hút hơn. Kích thước tối đa: 5MB
          </small>
          {thumbnailUrl && (
            <div className="preview-container">
              <img className="preview" src={thumbnailUrl} alt="preview" />
              <button
                type="button"
                className="remove-image"
                onClick={() => setThumbnailUrl("")}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="create-post-group">
          <label>
            Nội dung <span className="required">*</span>
          </label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết nội dung chi tiết cho bài viết của bạn. Hãy chia sẻ thông tin hữu ích và chính xác..."
            required
          />
          <small className="form-hint">
            Nội dung chi tiết ít nhất 50 ký tự ({content.trim().length}/50)
          </small>
        </div>

        <div className="create-post-group">
          <label>Tags (từ khóa)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="AI, công nghệ, lập trình, khoa học"
          />
          <small className="form-hint">
            Nhập các từ khóa liên quan, cách nhau bằng dấu phẩy. Tối đa 6 tags.
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Hủy
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Ẩn preview" : "Xem preview"}
          </button>
          <button type="submit" className="btn-primary" disabled={!isFormValid}>
            Đăng bài
          </button>
        </div>

        {showPreview && (
          <div className="preview-section">
            <h3>Preview bài viết</h3>
            <div className="post-card preview-card">
              <img
                src={thumbnailUrl || getDefaultThumbnail(category)}
                alt="preview"
                className="post-thumbnail"
              />
              <div className="post-content">
                <h4 className="post-title">{title}</h4>
                <p className="post-excerpt">
                  {content.trim().slice(0, 120)}...
                </p>
                <div className="post-tags">
                  {tags
                    .split(",")
                    .filter((tag) => tag.trim())
                    .slice(0, 6)
                    .map((tag, index) => (
                      <span key={index} className="tag">
                        {tag.trim().toLowerCase()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
