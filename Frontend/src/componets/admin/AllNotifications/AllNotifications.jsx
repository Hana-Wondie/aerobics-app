import { useEffect, useState } from "react";
import styles from "./AllNotifications.module.css";

function AllNotifications() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ALL NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/notifications`);
      const data = await res.json();

      setNotifications(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this notification?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/notifications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>All Notifications</h1>

      <div className={styles.grid}>
        {notifications.map((n) => (
          <div key={n.id} className={styles.card}>
            {/* TITLE (ONLY IF EXISTS) */}
            {n.title && <h3 className={styles.titleText}>{n.title}</h3>}

            {/* MESSAGE (ONLY IF EXISTS) */}
            {n.message && <p className={styles.messageText}>{n.message}</p>}

            {/* IMAGES (ONLY IF EXISTS) */}
            {n.images && n.images.length > 0 && (
              <div className={styles.imageWrapper}>
                {n.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={styles.image}
                    alt="notification"
                  />
                ))}
              </div>
            )}

            {/* VIDEO (ONLY IF EXISTS) */}
            {n.video && (
              <video controls className={styles.video}>
                <source src={n.video} />
              </video>
            )}

            {/* DELETE */}
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(n.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllNotifications;
