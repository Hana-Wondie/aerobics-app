import styles from "./Schedule.module.css";

function Schedule() {
  const morningSchedule = [
    {
      days: "Monday, Wednesday, Friday",
      time: "12:00 - 2:00",
    },
    {
      days: "Tuesday, Thursday",
      time: "12:00 - 3:00",
    },
    {
      days: "Saturday",
      time: "12:00 - 3:50",
    },
  ];

  const afternoonSchedule = [
    {
      days: "Monday - Friday",
      time: "12:00 - 1:00",
    },
    {
      days: "Saturday",
      time: "No Afternoon Session",
    },
  ];

  return (
    <section className={styles.schedule} id="schedule">
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.badge}>Weekly Schedule</span>

        <h2 className={styles.title}>Training Schedule Overview</h2>

        <p className={styles.subtitle}>
          Our training sessions are structured to give you consistency and
          maximum results throughout the week.
        </p>
      </div>

      {/* CONTENT */}
      <div className={styles.container}>
        {/* MORNING */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Morning Sessions</h3>

          {morningSchedule.map((item, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.days}>{item.days}</span>

              <span className={styles.time}>{item.time}</span>
            </div>
          ))}
        </div>

        {/* AFTERNOON */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Afternoon Sessions</h3>

          {afternoonSchedule.map((item, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.days}>{item.days}</span>

              <span className={styles.time}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Schedule;
