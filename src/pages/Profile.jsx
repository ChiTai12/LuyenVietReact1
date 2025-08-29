import { useId, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import {
  FiUser,
  FiCamera,
  FiSave,
  FiEdit3,
  FiX,
  FiHeart,
  FiMessageCircle,
  FiFileText,
  FiTrendingUp,
  FiCalendar,
  FiSettings,
  FiCheck,
} from "react-icons/fi";

export default function Profile() {
  const { currentUser, updateUser } = useApp();
  const { notify } = useToast();
  const [name, setName] = useState(currentUser.name || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode for testing
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const nameId = useId();

  function handleUpload(e) {
    console.log("Upload triggered:", e.target.files);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      notify("File quá lớn. Vui lòng chọn file dưới 5MB", "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      notify("Vui lòng chọn file ảnh hợp lệ", "error");
      return;
    }
    console.log("Processing file:", file.name, file.size);
    const reader = new FileReader();
    reader.onload = () => {
      console.log("File loaded, setting preview");
      setPreviewUrl(String(reader.result));
      setAvatarUrl(String(reader.result));
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      notify("Vui lòng nhập tên hiển thị", "error");
      return;
    }
    setIsLoading(true);

    // Nếu là Google user, cập nhật cả thông tin Google
    const updatedUserData = {
      name: name.trim() || "Khách",
      avatarUrl: avatarUrl,
    };

    // Nếu user đăng nhập bằng Google, thông báo là đồng bộ với Google
    if (currentUser.isGoogleUser) {
      setTimeout(() => {
        updateUser(updatedUserData);
        notify("Đã cập nhật hồ sơ Google thành công! ✨", "success");
        setIsEditing(false);
        setIsLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        updateUser(updatedUserData);
        notify("Đã lưu hồ sơ thành công!", "success");
        setIsEditing(false);
        setIsLoading(false);
      }, 800);
    }
  }

  function handleEdit() {
    setIsEditing(true);
    setPreviewUrl(avatarUrl);
    console.log("Edit mode activated:", { currentUser, isEditing: true });
  }

  function handleCancel() {
    setName(currentUser.name || "");
    setAvatarUrl(currentUser.avatarUrl || "");
    setPreviewUrl("");
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveAvatar() {
    setAvatarUrl("");
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="profile-container">
      {/* Left Green Brand Area */}
      <div className="profile-sidebar-left">
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <FiUser size={80} color="rgba(255, 255, 255, 0.8)" />
          </div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              margin: "0 0 12px 0",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Tin Tức 24H
          </h2>
          <p
            style={{
              fontSize: "16px",
              margin: "0 0 32px 0",
              opacity: "0.9",
              lineHeight: "1.6",
            }}
          >
            Nền tảng tin tức hàng đầu Việt Nam, cập nhật tin tức mới nhất 24/7
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <FiCheck size={20} />
              <span>Tin tức nóng hổi</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <FiCheck size={20} />
              <span>Cập nhật liên tục</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <FiCheck size={20} />
              <span>Nội dung chất lượng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Profile Form */}
      <div className="profile-content">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                {previewUrl || avatarUrl ? (
                  <img
                    className="profile-avatar"
                    src={previewUrl || avatarUrl}
                    alt={name}
                  />
                ) : (
                  <div className="profile-avatar placeholder">
                    <FiUser size={48} />
                  </div>
                )}
                {isEditing && (
                  <>
                    {(previewUrl || avatarUrl) && (
                      <button
                        className="avatar-remove-btn"
                        onClick={handleRemoveAvatar}
                        type="button"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="profile-info">
                <h1 className="profile-title">Hồ sơ cá nhân</h1>
                <p className="profile-subtitle">
                  Cập nhật thông tin cá nhân của bạn
                </p>
                {currentUser.isGoogleUser && (
                  <div className="google-account-badge">
                    <span className="google-icon">🔗</span>
                    <span>Kết nối với Google</span>
                  </div>
                )}
                {!isEditing && (
                  <div className="profile-status">
                    <div className="status-badge">
                      <FiCheck size={16} />
                      <span>Hồ sơ đã cập nhật</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-section">
              <h2 className="section-title">
                <FiUser size={20} />
                Thông tin cơ bản
              </h2>

              <div className="form-group">
                <label htmlFor={nameId} className="form-label">
                  <FiUser size={16} />
                  Tên hiển thị
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hiển thị của bạn"
                  className="form-input"
                  disabled={!isEditing}
                  maxLength={50}
                />
                <div className="input-counter">{name.length}/50 ký tự</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiCamera size={16} />
                  Ảnh đại diện
                </label>
                <div className="file-upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="file-input"
                    disabled={!isEditing}
                  />
                  <div className="file-upload-content">
                    <FiCamera size={32} />
                    <span>Chọn ảnh đại diện</span>
                    <small>JPG, PNG hoặc GIF (tối đa 5MB)</small>
                    <div className="upload-hint">
                      Kéo thả ảnh vào đây hoặc click để chọn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn btn-primary edit-btn"
                >
                  <FiEdit3 size={18} />
                  Chỉnh sửa hồ sơ
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary cancel-btn"
                    disabled={isLoading}
                  >
                    <FiX size={18} />
                    Hủy bỏ
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FiUser size={24} />
              </div>
              <div className="stat-number">0</div>
              <div className="stat-label">Bài viết</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FiCamera size={24} />
              </div>
              <div className="stat-number">0</div>
              <div className="stat-label">Bình luận</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FiCheck size={24} />
              </div>
              <div className="stat-number">0</div>
              <div className="stat-label">Yêu thích</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
