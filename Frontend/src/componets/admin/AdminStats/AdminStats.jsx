import { useEffect, useState } from "react";
import styles from "./AdminStats.module.css";

function AdminStats() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    uploads: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/stats`);
        const data = await res.json();

        setStats({
          users: data.users,
          admins: data.admins,
          uploads: data.uploads,
        });
      } catch (err) {
        console.log("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>System Overview</h2>

      <p className={styles.subtitle}>
        Real-time statistics of your gym management system
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Admins</h3>
          <p>{stats.admins}</p>
        </div>

        <div className={styles.card}>
          <h3>Payment Uploads</h3>
          <p>{stats.uploads}</p>
        </div>
      </div>
    </section>
  );
}

export default AdminStats;
