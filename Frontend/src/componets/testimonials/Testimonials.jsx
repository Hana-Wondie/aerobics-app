import styles from "./Testimonials.module.css";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Abebe K.",
      role: "Weight Loss Client",
      message:
        "I lost 12kg in just 2 months. The training schedule is very organized and the coach is extremely supportive.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sara T.",
      role: "Muscle Gain Client",
      message:
        "The muscle gain program completely changed my body. I feel stronger, healthier, and more confident.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Daniel M.",
      role: "Fitness Beginner",
      message:
        "As a beginner, I was nervous at first. But the trainers made everything simple and easy to follow.",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ];

  return (
    <section className={styles.testimonials} id="testimonials">
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.badge}>Testimonials</span>

        <h2 className={styles.title}>
          What Our Members Say About Their Transformation
        </h2>

        <p className={styles.subtitle}>
          Real stories from real members who achieved their fitness goals
          through our structured training programs.
        </p>
      </div>

      {/* CARDS */}
      <div className={styles.grid}>
        {testimonials.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.top}>
              <img src={t.image} alt={t.name} className={styles.avatar} />

              <div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </div>
            </div>

            <p className={styles.message}>“{t.message}”</p>

            <div className={styles.stars}>★★★★★</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
