import styles from "./AdminHero.module.css";

function AdminHero() {
  const admin = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <section className={styles.hero}>
      {/* BACKGROUND OVERLAY */}
      <div className={styles.overlay}></div>

      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <span className={styles.badge}>Admin Control Panel</span>

          <h1 className={styles.title}>
            Welcome Back, {admin.name || admin.full_name || "Admin"} 👋
          </h1>

          <p className={styles.subtitle}>
            Manage your gym system efficiently. Review payments, verify
            receipts, monitor members, and keep everything running smoothly.
          </p>

          {/* ADMIN ACTION CARDS */}
          <div className={styles.stats}>
            <div className={styles.card}>
              <h3>Payment Screenshots</h3>
              <p>View and approve user payment receipts instantly</p>
            </div>

            <div className={styles.card}>
              <h3>All Members</h3>
              <p>View active, expired, and pending members list</p>
            </div>

            <div className={styles.card}>
              <h3>Membership Control</h3>
              <p>Activate or renew user memberships easily</p>
            </div>

            <div className={styles.card}>
              <h3>System Overview</h3>
              <p>Track overall gym performance and activity status</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminHero;
