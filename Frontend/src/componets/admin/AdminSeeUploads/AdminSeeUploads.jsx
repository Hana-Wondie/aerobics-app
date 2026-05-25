import { useEffect, useState } from "react";
import styles from "./AdminSeeUploads.module.css";

function AdminSeeUploads() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH RECEIPTS
  const fetchUploads = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/payments`);

      const data = await res.json();

      setUploads(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // DELETE RECEIPT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this uploaded receipt?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/payments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setUploads((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete upload");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading uploads...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.badge}>Payment Uploads</span>

        <h1 className={styles.title}>Customer Payment Receipts</h1>

        <p className={styles.description}>
          Review all uploaded payment screenshots submitted by customers for
          membership approval.
        </p>
      </div>

      <div className={styles.grid}>
        {uploads.length > 0 ? (
          uploads.map((upload) => (
            <div key={upload.id} className={styles.card}>
              <div className={styles.top}>
                <div>
                  <h3 className={styles.userName}>{upload.full_name}</h3>

                  <p className={styles.email}>{upload.email}</p>
                </div>

                <span className={styles.status}>{upload.status}</span>
              </div>

              <div className={styles.imageWrapper}>
                <img
                  src={upload.screenshot_url}
                  alt="Receipt"
                  className={styles.image}
                />
              </div>

              <div className={styles.bottom}>
                <p className={styles.date}>
                  Uploaded: {new Date(upload.created_at).toLocaleDateString()}
                </p>

                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(upload.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No uploads found</div>
        )}
      </div>
    </div>
  );
}

export default AdminSeeUploads;
