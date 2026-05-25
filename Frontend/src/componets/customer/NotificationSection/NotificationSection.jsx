import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationSection.module.css";

function NotificationSection() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // all notifications
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${user.id}`,
      );

      const notifications = await res.json();

      // read notifications
      const readRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/read-list/${user.id}`,
      );

      const readIds = await readRes.json();

      const unread = notifications.filter(
        (n) => !readIds.includes(n.id),
      ).length;

      setUnreadCount(unread);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.content}>
          <span className={styles.badge} id="notifications">
            🔔 Notifications Center
          </span>

          <h2 className={styles.title}>Stay Updated With Gym Announcements</h2>

          <p className={styles.description}>
            Receive updates, videos, workout tips, membership reminders, and
            announcements directly from the admin.
          </p>

          <button
            className={styles.button}
            onClick={() => navigate("/dashboard/notifications")}
          >
            See Notifications
            {unreadCount > 0 && (
              <span className={styles.count}>{unreadCount}</span>
            )}
          </button>
        </div>

        {/* RIGHT */}
        <div className={styles.rightCard}>
          <div className={styles.iconWrapper}>🔔</div>

          <h3>Latest Updates</h3>

          <p>Stay connected with everything happening in your gym journey.</p>

          <div className={styles.stats}>
            <div>
              <h4>{unreadCount}</h4>
              <span>Unread</span>
            </div>

            <div>
              <h4>24/7</h4>
              <span>Updates</span>
            </div>

            <div>
              <h4>100%</h4>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotificationSection;
