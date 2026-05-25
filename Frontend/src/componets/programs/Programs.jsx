import styles from "./Programs.module.css";
import { useNavigate } from "react-router-dom";
function Programs() {
    const navigate = useNavigate();
  const programs = [
    {
      id: 1,
      title: "Weight Loss",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
      description:
        "Burn calories, reduce body fat, and improve your overall health with high-intensity workouts.",
    },

    {
      id: 2,
      title: "Cardio Training",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
      description:
        "Increase stamina and improve heart health through effective cardio-focused exercises.",
    },

    {
      id: 3,
      title: "Strength Training",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      description:
        "Build strength, improve endurance, and develop a stronger physique with guided training.",
    },

    {
      id: 4,
      title: "Muscle Gain",
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      description:
        "Gain lean muscle mass using progressive workouts and structured fitness routines.",
    },

    {
      id: 5,
      title: "Morning Fitness",
      image:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
      description:
        "Start your day energized with motivational morning training sessions and stretching.",
    },

    {
      id: 6,
      title: "Afternoon Sessions",
      image:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
      description:
        "Flexible afternoon sessions designed for consistency, performance, and body transformation.",
    },
  ];

  return (
    <section className={styles.programs} id="programs">
      {/* TOP */}

      <div className={styles.top}>
        <span className={styles.badge}>Our Programs</span>

        <h2 className={styles.title}>
          Fitness Programs Designed
          <br />
          For Every Goal
        </h2>

        <p className={styles.description}>
          Explore our professional training programs built to help you improve
          strength, endurance, flexibility, and overall fitness performance.
        </p>
      </div>

      {/* CARDS */}

      <div className={styles.grid}>
        {programs.map((program) => (
          <div className={styles.card} key={program.id}>
            {/* IMAGE */}

            <div className={styles.imageWrapper}>
              <img
                src={program.image}
                alt={program.title}
                className={styles.image}
              />
            </div>

            {/* CONTENT */}

            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{program.title}</h3>

              <p className={styles.cardDescription}>{program.description}</p>

              <button
                className={styles.button}
                onClick={() => navigate("/signup")}
              >
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Programs;
