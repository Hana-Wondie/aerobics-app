import styles from "./Footer.module.css";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* BRAND */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            Fit<span>Flow</span>
          </h2>

          <p>
            Transform your body, improve your health, and stay consistent with
            structured fitness training from Monday to Saturday.
          </p>
        </div>

        {/* LINKS */}
        <div className={styles.links}>
          <h3>Quick Links</h3>

          <button onClick={() => handleScroll("programs")}>Programs</button>

          <button onClick={() => handleScroll("schedule")}>Schedule</button>

          <button onClick={() => handleScroll("pricing")}>Pricing</button>

          <button onClick={() => handleScroll("about")}>About</button>

          <button onClick={() => handleScroll("testimonials")}>
            Testimonials
          </button>
        </div>

        {/* CONTACT INFO */}
        <div className={styles.contact}>
          <h3>Contact</h3>

          <p>📍 Addis Ababa, Ethiopia</p>
          <p>📞 +251 900 000 000</p>
          <p>📧 fitness@example.com</p>
          <p>🕒 Mon - Sat: 6AM - 8PM</p>
        </div>

        {/* SOCIAL */}
        <div className={styles.social}>
          <h3>Follow Us</h3>

          <div className={styles.socialIcons}>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Telegram</span>
            <span>YouTube</span>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} FitFlow. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
