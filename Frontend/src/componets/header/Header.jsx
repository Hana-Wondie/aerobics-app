import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const handleScroll = (id) => {
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);

    setMenuOpen(false);
  };

  let user = null;

  try {
    const userData = localStorage.getItem("user");

    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* LEFT SIDE */}
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/"}
          className={styles.logoSection}
        >
          <div className={styles.logoWrapper}>
            <svg className={styles.logoIcon} viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="#10B981" />

              <path
                d="M20 36c4-10 20-10 24 0"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle cx="24" cy="24" r="4" fill="white" />

              <circle cx="40" cy="24" r="4" fill="white" />
            </svg>
          </div>

          <h2 className={styles.logoText}>
            Fit<span>Flow</span>
          </h2>
        </Link>

        {/* HAMBURGER */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* CENTER NAVIGATION */}
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ""}`}>
          <button
            onClick={() => handleScroll("programs")}
            className={styles.navLink}
          >
            Programs
          </button>

          <button
            onClick={() => handleScroll("schedule")}
            className={styles.navLink}
          >
            Schedule
          </button>

          <button
            onClick={() => handleScroll("pricing")}
            className={styles.navLink}
          >
            Pricing
          </button>

          <button
            onClick={() => handleScroll("about")}
            className={styles.navLink}
          >
            About
          </button>

          <button
            onClick={() => handleScroll("testimonials")}
            className={styles.navLink}
          >
            Testimonials
          </button>

          <button
            onClick={() => handleScroll("contact")}
            className={styles.navLink}
          >
            Contact
          </button>
        </nav>

        {/* RIGHT SIDE */}
        <div
          className={`${styles.authSection} ${menuOpen ? styles.active : ""}`}
        >
          {!user ? (
            <>
              <Link
                to="/login"
                className={styles.loginBtn}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={styles.joinBtn}
                onClick={() => setMenuOpen(false)}
              >
                Join Now
              </Link>
            </>
          ) : (
            <>
              <span className={styles.welcome}>
                Hi {user.full_name || user.name}
              </span>

              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
