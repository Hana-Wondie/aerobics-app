import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  ////////////////// INPUT //////////////////

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  ////////////////// SUBMIT //////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    const { full_name, email, password, phone, gender, age } = form;

    ////////////////// VALIDATION //////////////////

    if (!full_name || !email || !password) {
      setError("Required fields missing");

      setLoading(false);

      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          full_name,
          email,
          password,
          phone,
          gender,
          age,
        }),
      });

      const data = await res.json();

      ////////////////// FAILED //////////////////

      if (!res.ok) {
        setError(data.message || "Signup failed");

        setLoading(false);

        return;
      }

      ////////////////// SAVE TOKEN //////////////////

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      ////////////////// REDIRECT //////////////////

      navigate("/dashboard");
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
          <h1 className={styles.heroTitle}>Start Your Journey</h1>

          <p className={styles.heroText}>
            Join our fitness training community and achieve your dream body with
            professional guidance.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create Account</h2>

          <p className={styles.subtitle}>
            Begin your fitness transformation today
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* FULL NAME */}

            <div className={styles.inputGroup}>
              <label>Full Name</label>

              <input
                name="full_name"
                type="text"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* EMAIL */}

            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                name="email"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* PHONE */}

            <div className={styles.inputGroup}>
              <label>Phone Number</label>

              <input
                name="phone"
                type="text"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* GENDER */}

            <div className={styles.inputGroup}>
              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Select Gender</option>

                <option value="male">Male</option>

                <option value="female">Female</option>
              </select>
            </div>

            {/* AGE */}

            <div className={styles.inputGroup}>
              <label>Age</label>

              <input
                name="age"
                type="number"
                placeholder="Enter age"
                value={form.age}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            {/* PASSWORD */}

            <div className={styles.inputGroup}>
              <label>Password</label>

              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {/* BUTTON */}

            <button className={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Join Now"}
            </button>
          </form>

          <p className={styles.bottomText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
