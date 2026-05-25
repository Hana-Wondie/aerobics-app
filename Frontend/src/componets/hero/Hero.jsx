import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      {/* OVERLAY */}
      <div className={styles.overlay}></div>

      {/* CONTENT */}
      <div className={styles.content}>
        <span className={styles.badge}>#1 Fitness Training Program</span>

        <h1 className={styles.title}>
          Transform Your Body
          <br />
          Build Your Confidence
        </h1>

        <p className={styles.description}>
          Join professional fitness training sessions designed to help you lose
          weight, gain muscle, improve endurance, and become the best version of
          yourself. Morning and afternoon programs available from Monday to
          Saturday.
        </p>

        {/* BUTTONS */}
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/signup")}
          >
            Join Now
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => {
              const section = document.getElementById("schedule");

              if (section) {
                section.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            View Schedule
          </button>
        </div>

        {/* STATS */}
        <div className={styles.stats}>
          

          <div className={styles.statCard}>
            <h2>6 Days</h2>
            <p>Weekly Training</p>
          </div>

          <div className={styles.statCard}>
            <h2>2 Sessions</h2>
            <p>Morning & Afternoon</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
