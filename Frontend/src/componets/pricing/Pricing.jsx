import styles from "./Pricing.module.css";
import { useNavigate } from "react-router-dom";
function Pricing() {
    const navigate = useNavigate();
  const plans = [
    {
      id: 1,
      title: "Daily Plan",
      price: "50",
      period: "per day",
      features: [
        "1 Training Session",
        "Access to Gym",
        "Basic Guidance",
        "Morning or Afternoon",
      ],
    },
    {
      id: 2,
      title: "Monthly Plan",
      price: "900",
      period: "per month",
      features: [
        "Unlimited Sessions",
        "Full Program Access",
        "Personal Guidance",
        "Progress Tracking",
      ],
    },
  ];

  return (
    <section className={styles.pricing} id="pricing">
      {/* HEADER */}
      <div className={styles.header}>
        <span className={styles.badge}>Pricing</span>

        <h2 className={styles.title}>Choose Your Fitness Plan</h2>

        <p className={styles.subtitle}>
          Flexible pricing options designed for both daily trainees and
          long-term members.
        </p>
      </div>

      {/* CARDS */}
      <div className={styles.grid}>
        {plans.map((plan) => (
          <div key={plan.id} className={styles.card}>
            <h3 className={styles.planTitle}>{plan.title}</h3>

            <div className={styles.price}>
              ${plan.price}
              <span>{plan.period}</span>
            </div>

            <ul className={styles.features}>
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <button
              className={styles.button}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
