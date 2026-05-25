import { useEffect, useState } from "react";
import styles from "./CustomerAttendance.module.css";

function CustomerAttendance() {
  const API_URL = import.meta.env.VITE_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  // FETCH ATTENDANCE
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/attendance/${user.id}`);

      const data = await res.json();

      const formatted = {};

      days.forEach((day) => {
        formatted[day] = false;
      });

      data.forEach((item) => {
        formatted[item.day_name] = item.completed;
      });

      setAttendance(formatted);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // TOGGLE ATTENDANCE
  const toggleDay = async (day) => {
    const updated = !attendance[day];

    try {
      await fetch(`${API_URL}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          day_name: day,
          completed: updated,
        }),
      });

      setAttendance((prev) => ({
        ...prev,
        [day]: updated,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // STATS
  const completedDays = Object.values(attendance).filter((v) => v).length;

  const remainingDays = days.length - completedDays;

  const percentage = Math.round((completedDays / days.length) * 100);

  const streak = completedDays;

  if (loading) {
    return <p className={styles.loading}>Loading attendance...</p>;
  }

  return (
    <div className={styles.page} id="attendance">
      {/* HERO */}
      <div className={styles.hero}>
        <div>
          <h1>Workout Progress Tracker</h1>

          <p>
            Track your gym consistency, complete weekly sessions, and improve
            your fitness journey.
          </p>
        </div>

        <div className={styles.percentBox}>
          <h2>{percentage}%</h2>
          <span>Weekly Progress</span>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{completedDays}</h3>
          <p>Completed Days</p>
        </div>

        <div className={styles.statCard}>
          <h3>{remainingDays}</h3>
          <p>Remaining Days</p>
        </div>

        <div className={styles.statCard}>
          <h3>{streak}</h3>
          <p>Workout Streak</p>
        </div>
      </div>

      {/* DAYS */}
      <div className={styles.grid}>
        {days.map((day) => (
          <div
            key={day}
            className={attendance[day] ? styles.completedCard : styles.card}
          >
            <h3>{day}</h3>

            <p>
              {attendance[day]
                ? "Workout completed successfully."
                : "Mark this workout as completed."}
            </p>

            <button
              onClick={() => toggleDay(day)}
              className={
                attendance[day] ? styles.completedBtn : styles.pendingBtn
              }
            >
              {attendance[day] ? "Completed" : "Mark Complete"}
            </button>
          </div>
        ))}
      </div>

      {/* MOTIVATION */}
      <div className={styles.motivation}>
        {percentage === 100 ? (
          <h2>Excellent work! You completed all workouts this week.</h2>
        ) : (
          <h2>Stay consistent and keep improving your progress.</h2>
        )}
      </div>
    </div>
  );
}

export default CustomerAttendance;
