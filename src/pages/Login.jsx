import { useState, useId, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/useToast";
import { FiUser, FiLock, FiMail } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const { login, register, users, updateUser } = useApp();
  const { notify } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for animations
  const phoneRef = useRef(null);
  const avatarRef = useRef(null);
  const plantsRef = useRef(null);
  const googleButtonRef = useRef(null);

  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();

  // Google Login Setup
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id:
            "687748128579-2k7uul5cl10ffn90kkvqfa67uvg85fl2.apps.googleusercontent.com", // Client ID mới của bạn
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    };

    // Đợi Google script load
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogleLoaded);
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, []);

  // Handle Google Login Response
  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);

      // Decode JWT token từ Google
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const userObject = JSON.parse(jsonPayload);

      // Tạo user data từ Google
      const googleUser = {
        id: userObject.sub,
        name: userObject.name,
        email: userObject.email,
        avatarUrl: userObject.picture,
        isGoogleUser: true,
      };

      // Try to find an existing user by email or id to avoid overwriting a
      // previously uploaded avatar. Prefer an existing avatar over Google's
      // picture when present.
      const existingByEmail = users?.find((u) => u.email === userObject.email);
      const existingById = users?.find(
        (u) => String(u.id) === String(userObject.sub)
      );
      const existing = existingByEmail || existingById || null;

      const mergedUser = existing
        ? {
            ...existing,
            ...googleUser,
            // prefer existing avatar if user had uploaded one
            avatarUrl: existing.avatarUrl || googleUser.avatarUrl,
            isGoogleUser: true,
          }
        : googleUser;

      // Login with merged user object so we don't clobber a custom avatar.
      const success = await login(userObject.email, "google_auth", mergedUser);

      if (success) {
        // Persist merged info to app state (users/posts) so render-time lookups find it.
        try {
          updateUser(mergedUser);
        } catch (err) {
          // non-fatal
          console.error("Failed to persist merged Google user:", err);
        }

        notify(`Chào mừng ${mergedUser.name}! Đăng nhập Google thành công! 🎉`);
        navigate("/");
      } else {
        notify("Đăng nhập Google thất bại", { type: "error" });
      }
    } catch (error) {
      console.error("Google login error:", error);
      notify("Có lỗi xảy ra khi đăng nhập Google", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Animation effects (giữ nguyên code cũ)
  useEffect(() => {
    const phone = phoneRef.current;
    const avatar = avatarRef.current;
    const plants = plantsRef.current?.children;

    if (!phone || !avatar || !plants) return;

    // Phone floating animation
    let phoneAngle = 0;
    const animatePhone = () => {
      phoneAngle += 0.02;
      const y = Math.sin(phoneAngle) * 15;
      const rotateY = Math.sin(phoneAngle * 0.5) * 8;
      phone.style.transform = `translateY(${y}px) rotateY(${rotateY}deg) perspective(1000px)`;
      requestAnimationFrame(animatePhone);
    };
    animatePhone();

    // Avatar pulsing animation
    let avatarScale = 1;
    let avatarDirection = 1;
    const animateAvatar = () => {
      avatarScale += avatarDirection * 0.005;
      if (avatarScale >= 1.15) avatarDirection = -1;
      if (avatarScale <= 1) avatarDirection = 1;

      avatar.style.transform = `scale(${avatarScale})`;
      avatar.style.boxShadow = `0 ${20 + avatarScale * 10}px ${
        40 + avatarScale * 20
      }px rgba(16, 185, 129, ${0.3 + avatarScale * 0.2})`;
      requestAnimationFrame(animateAvatar);
    };
    animateAvatar();

    // Plants orbiting animation
    let plantsAngle = 0;
    const animatePlants = () => {
      plantsAngle += 0.01;
      Array.from(plants).forEach((plant, index) => {
        const radius = 200 + index * 50;
        const speed = 0.5 + index * 0.3;
        const x = Math.cos(plantsAngle * speed + index * 2) * radius;
        const y = Math.sin(plantsAngle * speed + index * 2) * radius;
        const scale = 1 + Math.sin(plantsAngle * 2 + index) * 0.2;

        plant.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        plant.style.opacity = 0.4 + Math.sin(plantsAngle + index) * 0.2;
      });
      requestAnimationFrame(animatePlants);
    };
    animatePlants();

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = phone.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / window.innerHeight) * 20;
      const rotateY = (mouseX / window.innerWidth) * 20;

      phone.style.transition = "transform 0.1s ease";
      phone.style.transform += ` rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      phone.style.transition = "transform 0.5s ease";
    };

    phone.addEventListener("mousemove", handleMouseMove);
    phone.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      phone.removeEventListener("mousemove", handleMouseMove);
      phone.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Form submission handlers
  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      notify("Vui lòng điền đầy đủ thông tin", { type: "error" });
      return;
    }
    if (!isLogin && !email.trim()) {
      notify("Vui lòng nhập email", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const success = await login(username.trim(), password);
        if (success) {
          notify("Đăng nhập thành công!");
          navigate("/");
        } else {
          notify("Tên đăng nhập hoặc mật khẩu không đúng", { type: "error" });
        }
      } else {
        const success = await register(username.trim(), email.trim(), password);
        if (success) {
          notify("Đăng ký thành công!");
          navigate("/");
        } else {
          notify("Tên đăng nhập đã tồn tại", { type: "error" });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      notify("Có lỗi xảy ra", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-illustration">
        <div
          ref={phoneRef}
          className="phone-mockup"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease",
            cursor: "pointer",
          }}
        >
          <div
            ref={avatarRef}
            className="person-avatar"
            style={{ transition: "all 0.3s ease" }}
          >
            <FiUser size={40} />
          </div>
        </div>
        <div ref={plantsRef} className="plants">
          <div
            className="plant plant-1"
            style={{ transition: "all 0.3s ease" }}
          ></div>
          <div
            className="plant plant-2"
            style={{ transition: "all 0.3s ease" }}
          ></div>
          <div
            className="plant plant-3"
            style={{ transition: "all 0.3s ease" }}
          ></div>
        </div>
      </div>

      <div className="login-card">
        <div>
          <FiUser size={24} />
        </div>

        <h1 className="welcome-title">WELCOME</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor={usernameId}>Username</label>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                id={usernameId}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor={emailId}>Email</label>
              <div className="input-group">
                <FiMail className="input-icon" />
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor={passwordId}>Password</label>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                id={passwordId}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                disabled={loading}
              />
            </div>
          </div>

          {isLogin && (
            <div className="forgot-password">
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "LOGIN" : "REGISTER"}
          </button>
        </form>

        <div className="divider">
          <span>hoặc</span>
        </div>

        {/* Google Sign-in Button - Đây là nơi Google sẽ render button thật */}
        <div ref={googleButtonRef} style={{ width: "100%" }}></div>

        <div className="toggle-mode">
          <span>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-btn"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
