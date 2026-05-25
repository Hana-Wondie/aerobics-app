import styles from "./CustomerSchedule.module.css";

function CustomerSchedule() {
  const morningSchedule = [
    {
      day: "Monday, Wednesday, Friday",
      time: "12:00 - 2:00",
    },
    {
      day: "Tuesday, Thursday",
      time: "12:00 - 3:00",
    },
    {
      day: "Saturday",
      time: "12:00 - 3:50",
    },
  ];

  const afternoonSchedule = [
    {
      day: "Monday - Friday",
      time: "12:00 - 1:00",
    },
    {
      day: "Saturday",
      time: "No Afternoon Session",
    },
  ];

  return (
    <div className={styles.page} id="myschedule">
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Weekly Training Schedule</h1>

        <p>
          Your structured training plan designed for consistency, discipline,
          and progress.
        </p>
      </div>

      {/* SCHEDULE GRID */}
      <div className={styles.container}>
        {/* MORNING */}
        <div className={styles.card}>
          <h2>Morning Sessions</h2>

          {morningSchedule.map((item, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.day}>{item.day}</span>

              <span className={styles.time}>{item.time}</span>
            </div>
          ))}
        </div>

        {/* AFTERNOON */}
        <div className={styles.card}>
          <h2>Afternoon Sessions</h2>

          {afternoonSchedule.map((item, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.day}>{item.day}</span>

              <span className={styles.time}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerSchedule;
