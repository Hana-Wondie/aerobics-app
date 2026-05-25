import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ================= INPUT =================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    const { email, password } = form;

    ////////////////// VALIDATION //////////////////

    if (!email || !password) {
      setError("All fields are required");

      setLoading(false);

      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      ////////////////// LOGIN FAILED //////////////////

      if (!res.ok) {
        setError(data.message || "Login failed");

        setLoading(false);

        return;
      }

      ////////////////// SAVE TOKEN //////////////////

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      ////////////////// REDIRECT //////////////////

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);

      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <div className={styles.overlay}>
          <h1 className={styles.heroTitle}>Transform Your Body</h1>

          <p className={styles.heroText}>
            Stay consistent with your training, track your membership, and
            achieve your fitness goals.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome Back</h2>

          <p className={styles.subtitle}>
            Login to continue your fitness journey
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>

              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button className={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles.bottomText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Join Now</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
