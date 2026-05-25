import styles from "./CustomerHero.module.css";
import { useNavigate } from "react-router-dom";

function CustomerHero() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // SCROLL FUNCTION
  const handleScroll = (id) => {
    // stay on same page
    setTimeout(() => {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <section className={styles.hero}>
      {/* BACKGROUND GLOW */}
      <div className={styles.bgGlow}></div>

      {/* CONTENT */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome Back, {user.name || "Member"} 👋
        </h1>

        <p className={styles.subtitle}>
          Stay consistent with your training, track your progress, and manage
          your membership all in one place.
        </p>

        {/* QUICK ACTION BUTTONS (ALL SCROLL) */}
        <div className={styles.buttons}>
          <button onClick={() => handleScroll("myschedule")}>
            My Schedule
          </button>

          <button onClick={() => handleScroll("attendance")}>
            My Attendance
          </button>

          <button onClick={() => handleScroll("membership")}>
            My Membership
          </button>

          <button onClick={() => handleScroll("uploadreceipt")}>
            Upload Receipt
          </button>

          <button onClick={() => handleScroll("notifications")}>
            My Notifications
          </button>
        </div>
      </div>

      {/* RIGHT SIDE CARD */}
      <div className={styles.card}>
        <h3>Today’s Focus</h3>

        <p>
          Push your limits today. Consistency is what creates transformation.
        </p>

        <div className={styles.stats}>
          <div>
            <h4>6</h4>
            <span>Days Plan</span>
          </div>

          <div>
            <h4>2</h4>
            <span>Sessions</span>
          </div>

          <div>
            <h4>100%</h4>
            <span>Commitment</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerHero;
