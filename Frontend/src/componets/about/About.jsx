import styles from "./About.module.css";

function About() {
  return (
    <section className={styles.about} id="about">
      {/* LEFT IMAGE */}
      <div className={styles.imageSection}>
        <div className={styles.overlay}></div>
      </div>

      {/* RIGHT CONTENT */}
      <div className={styles.content}>
        <span className={styles.badge}>About Us</span>

        <h2 className={styles.title}>
          We Help You Build a Stronger, Healthier Version of Yourself
        </h2>

        <p className={styles.description}>
          Our fitness training program is designed to help individuals of all
          levels achieve real, sustainable results. Whether you want to lose
          weight, gain muscle, or improve your daily energy, we provide
          structured training sessions from Monday to Saturday with both morning
          and afternoon schedules.
        </p>

        <p className={styles.description}>
          We focus on discipline, consistency, and personal growth. Every member
          gets access to guided workouts, progress tracking, and a supportive
          training environment that keeps you motivated every step of the way.
        </p>

        {/* FEATURES */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>Professional Training</h3>
            <p>Guided workouts designed for all fitness levels.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Flexible Schedule</h3>
            <p>Morning and afternoon sessions available daily.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement and stay consistent.</p>
          </div>
        </div>

        {/* STATS */}
        <div className={styles.stats}>
          <div>
            <h3>50+</h3>
            <p>Active Members</p>
          </div>

          <div>
            <h3>6 Days</h3>
            <p>Weekly Training</p>
          </div>

          <div>
            <h3>100%</h3>
            <p>Commitment Focus</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
