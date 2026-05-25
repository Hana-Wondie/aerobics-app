import { useEffect, useState } from "react";
import styles from "./CustomerNotifications.module.css";

function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${user.id}`,
      );

      const data = await res.json();

      // get read notifications
      const readRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/read-list/${user.id}`,
      );

      const readData = await readRes.json();

      const updated = data.map((notification) => ({
        ...notification,
        is_read: readData.includes(notification.id),
      }));

      setNotifications(updated);
    } catch (err) {
      console.log(err);
    }
  };

  // MARK READ
  const handleMarkRead = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/read/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
          }),
        },
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Notifications</h1>

      <div className={styles.grid}>
        {notifications.map((notification) => (
          <div key={notification.id} className={styles.card}>
            {notification.title && <h3>{notification.title}</h3>}

            {notification.message && <p>{notification.message}</p>}

            {/* IMAGES */}
            {notification.images && notification.images.length > 0 && (
              <div className={styles.imageWrapper}>
                {notification.images.map((img, i) => (
                  <img key={i} src={img} className={styles.image} alt="" />
                ))}
              </div>
            )}

            {/* VIDEO */}
            {notification.video_url && (
              <video controls className={styles.video}>
                <source src={notification.video_url} />
              </video>
            )}

            {!notification.is_read ? (
              <button onClick={() => handleMarkRead(notification.id)}>
                Mark as Read
              </button>
            ) : (
              <button disabled>Already Read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerNotifications;
