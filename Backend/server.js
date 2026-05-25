const multer = require("multer");
const path = require("path");

require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ================= POSTGRES CONNECTION =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ================= INIT DATABASE =================
const initDB = async () => {
  try {
    // ================= TEST CONNECTION =================
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected");

    // ================= ENABLE UUID EXTENSION =================
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // ================= PROFILES =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        full_name text NOT NULL,

        email text UNIQUE NOT NULL,

        phone text,

        gender text,

        age integer,

        password text NOT NULL,

        role text DEFAULT 'customer'
        CHECK (role IN ('admin', 'customer')),

        profile_image text,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now()
      );
    `);
    // ================= USER READ NOTIFICATIONS =================
    await pool.query(`
  CREATE TABLE IF NOT EXISTS user_read_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

    notification_id uuid REFERENCES admin_notifications(id) ON DELETE CASCADE,

    created_at timestamp with time zone DEFAULT now(),

    UNIQUE(user_id, notification_id)
  );
`);

    // ================= INSERT DEFAULT ADMIN =================
    const adminPassword = await bcrypt.hash("admin123", 10);

    await pool.query(
      `
      INSERT INTO profiles (
        full_name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      `,
      ["Main Admin", "admin@gmail.com", adminPassword, "admin"],
    );

    // ================= MEMBERSHIPS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        start_date date NOT NULL,

        end_date date NOT NULL,

        status text DEFAULT 'active'
        CHECK (
          status IN (
            'active',
            'expired',
            'pending_approval'
          )
        ),

        expired_days integer DEFAULT 0,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= PAYMENTS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        membership_id uuid REFERENCES memberships(id) ON DELETE CASCADE,

        screenshot_url text NOT NULL,

        note text,

        status text DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'approved',
            'rejected'
          )
        ),

        approved_by uuid REFERENCES profiles(id),

        approved_at timestamp with time zone,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= SCHEDULES =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        day_name text NOT NULL
        CHECK (
          day_name IN (
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday'
          )
        ),

        session text NOT NULL
        CHECK (
          session IN (
            'morning',
            'afternoon'
          )
        ),

        start_time time NOT NULL,

        end_time time NOT NULL,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= WEEKLY COMPLETIONS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS weekly_completions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        schedule_id uuid REFERENCES schedules(id) ON DELETE CASCADE,

        completion_date date NOT NULL,

        is_completed boolean DEFAULT false,

        week_number integer NOT NULL,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now(),

        UNIQUE(user_id, schedule_id, completion_date)
      );
    `);

    // ================= WEEKLY PERCENTAGES =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS weekly_percentages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        week_number integer NOT NULL,

        completed_count integer DEFAULT 0,

        total_count integer DEFAULT 0,

        percentage numeric(5,2) DEFAULT 0,

        created_at timestamp with time zone DEFAULT now(),

        updated_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= USER NOTIFICATIONS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        title text,

        message text,

        image_url text,

        is_read boolean DEFAULT false,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= ADMIN NOTIFICATIONS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        title text,

        message text,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= ADMIN NOTIFICATION IMAGES =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_notification_images (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        notification_id uuid REFERENCES admin_notifications(id) ON DELETE CASCADE,

        image_url text NOT NULL,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= MEMBERSHIP HISTORY =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS membership_history (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

        old_start_date date NOT NULL,

        old_end_date date NOT NULL,

        renewed_start_date date NOT NULL,

        renewed_end_date date NOT NULL,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= TESTIMONIALS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        user_name text NOT NULL,

        user_image text,

        message text NOT NULL,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= CUSTOMER ATTENDANCE =================
    await pool.query(`
  CREATE TABLE IF NOT EXISTS attendance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,

    day_name text NOT NULL,

    completed boolean DEFAULT false,

    week_number integer NOT NULL,

    created_at timestamp with time zone DEFAULT now(),

    UNIQUE(user_id, day_name, week_number)
  );
`);

    // ================= PROGRAMS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        title text NOT NULL,

        description text,

        image_url text,

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    // ================= PRICING PLANS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        title text NOT NULL,

        price numeric(10,2) NOT NULL,

        duration text,

        features text[],

        created_at timestamp with time zone DEFAULT now()
      );
    `);

    console.log("All tables initialized successfully");
  } catch (err) {
    console.error("DB Init Error:", err);
    process.exit(1);
  }
};

// ================= START SERVER =================
const startServer = async () => {
  await initDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

//////////////////// AUTH MIDDLEWARE ////////////////////

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

//////////////////// ADMIN CHECK ////////////////////

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

//////////////////// REGISTER ////////////////////

app.post("/api/register", async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      gender,
      age,
    } = req.body;

    ////////////////// VALIDATION //////////////////

    if (
      !full_name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    ////////////////// CHECK EXISTING USER //////////////////

    const existingUser = await pool.query(
      `
      SELECT * FROM profiles
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    ////////////////// HASH PASSWORD //////////////////

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    ////////////////// CREATE USER //////////////////

    const userResult = await pool.query(
      `
      INSERT INTO profiles (
        full_name,
        email,
        password,
        phone,
        gender,
        age,
        role
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING *
      `,
      [
        full_name,
        email,
        hashedPassword,
        phone || null,
        gender || null,
        age || null,
        "customer",
      ]
    );

    const newUser = userResult.rows[0];

    ////////////////// CREATE MEMBERSHIP //////////////////
    // 30 DAYS MEMBERSHIP

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(endDate.getDate() + 30);

    await pool.query(
      `
      INSERT INTO memberships (
        user_id,
        start_date,
        end_date,
        status
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        newUser.id,
        startDate,
        endDate,
        "active",
      ]
    );

    ////////////////// CREATE TOKEN //////////////////

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      full_name: newUser.full_name,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    ////////////////// RESPONSE //////////////////

    res.status(201).json({
      message: "Registration successful",
      token,
      user: payload,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

//////////////////// LOGIN ////////////////////

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    ////////////////// VALIDATION //////////////////

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    ////////////////// FIND USER //////////////////

    const result = await pool.query(
      `
      SELECT * FROM profiles
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    ////////////////// CHECK PASSWORD //////////////////

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    ////////////////// CREATE JWT //////////////////

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    ////////////////// RESPONSE //////////////////

    res.json({
      message: "Login successful",
      token,
      user: payload,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

//////////////////// GET CURRENT USER ////////////////////

app.get(
  "/api/me",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          id,
          full_name,
          email,
          phone,
          gender,
          age,
          role,
          profile_image,
          created_at
        FROM profiles
        WHERE id = $1
        `,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

//////////////////// CUSTOMER MEMBERSHIP ////////////////////

app.get(
  "/api/my-membership",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT *
        FROM memberships
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "No membership found",
        });
      }

      const membership = result.rows[0];

      ////////////////// CALCULATE REMAINING DAYS //////////////////

      const today = new Date();

      const endDate = new Date(
        membership.end_date
      );

      const diffTime =
        endDate.getTime() - today.getTime();

      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      let membershipMessage = "";

      if (diffDays >= 0) {
        membershipMessage =
          `${diffDays} days left`;
      } else {
        membershipMessage =
          `Expired ${Math.abs(diffDays)} days ago`;
      }

      res.json({
        membership,
        membershipMessage,
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

//////////////////// ADMIN GET ALL USERS ////////////////////

app.get(
  "/api/admin/users",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          profiles.id,
          profiles.full_name,
          profiles.email,
          profiles.phone,
          profiles.gender,
          profiles.age,
          memberships.start_date,
          memberships.end_date,
          memberships.status
        FROM profiles
        LEFT JOIN memberships
        ON profiles.id = memberships.user_id
        WHERE profiles.role = 'customer'
        ORDER BY profiles.created_at DESC
        `
      );

      res.json(result.rows);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

//////////////////// ADMIN EXPIRED USERS ////////////////////

app.get(
  "/api/admin/expired-users",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          profiles.id,
          profiles.full_name,
          profiles.email,
          memberships.start_date,
          memberships.end_date
        FROM profiles
        INNER JOIN memberships
        ON profiles.id = memberships.user_id
        WHERE memberships.end_date < CURRENT_DATE
        `
      );

      res.json(result.rows);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

app.post("/api/payments", async (req, res) => {
  try {
    const { user_id, screenshot_url } = req.body;

    if (!user_id || !screenshot_url) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO payments (user_id, screenshot_url, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [user_id, screenshot_url],
    );

    res.json({
      message: "Payment submitted",
      payment: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CUSTOMER GET NOTIFICATIONS =================
app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const notificationsResult = await pool.query(`
      SELECT *
      FROM admin_notifications
      ORDER BY created_at DESC
    `);

    const notifications = notificationsResult.rows;

    // attach images
    for (let notification of notifications) {
      const imagesResult = await pool.query(
        `
        SELECT image_url
        FROM admin_notification_images
        WHERE notification_id = $1
        `,
        [notification.id]
      );

      notification.images = imagesResult.rows.map(
        (img) => img.image_url
      );
    }

    res.json(notifications);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= MARK NOTIFICATION AS READ =================
app.put("/api/notifications/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    await pool.query(
      `
      INSERT INTO user_read_notifications (
        user_id,
        notification_id
      )
      VALUES ($1, $2)
      ON CONFLICT (user_id, notification_id)
      DO NOTHING
      `,
      [user_id, id]
    );

    res.json({
      message: "Marked as read",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= ADMIN STATS =================
app.get("/api/admin/stats", async (req, res) => {
  try {
    // total users
    const usersResult = await pool.query(
      "SELECT COUNT(*) FROM profiles WHERE role = 'customer'"
    );

    // total admins
    const adminsResult = await pool.query(
      "SELECT COUNT(*) FROM profiles WHERE role = 'admin'"
    );

    // total uploaded receipts
    const uploadsResult = await pool.query(
      "SELECT COUNT(*) FROM payments"
    );

    res.json({
      users: parseInt(usersResult.rows[0].count),
      admins: parseInt(adminsResult.rows[0].count),
      uploads: parseInt(uploadsResult.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ================= ADMIN SEND NOTIFICATION =================
app.post("/api/admin/notifications", async (req, res) => {
  try {
    const { title, message, images, video } = req.body;

    // insert notification
    const result = await pool.query(
      `INSERT INTO admin_notifications (title, message, video_url)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [title, message, video || null]
    );

    const notificationId = result.rows[0].id;

    // insert images
    if (images && images.length > 0) {
      for (let img of images) {
        await pool.query(
          `INSERT INTO admin_notification_images (notification_id, image_url)
           VALUES ($1, $2)`,
          [notificationId, img]
        );
      }
    }

    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/notifications", async (req, res) => {
  try {
    const notificationsResult = await pool.query(`
      SELECT *
      FROM admin_notifications
      ORDER BY created_at DESC
    `);

    const notifications = notificationsResult.rows;

    // attach images to each notification
    for (let n of notifications) {
      const imagesResult = await pool.query(
        `
        SELECT image_url
        FROM admin_notification_images
        WHERE notification_id = $1
        `,
        [n.id],
      );

      n.images = imagesResult.rows.map((img) => img.image_url);
    }

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/admin/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM admin_notifications WHERE id=$1", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET USER READ NOTIFICATIONS =================
app.get("/api/notifications/read-list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT notification_id
      FROM user_read_notifications
      WHERE user_id = $1
      `,
      [userId]
    );

    const ids = result.rows.map(
      (item) => item.notification_id
    );

    res.json(ids);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= ADMIN GET ALL PAYMENTS =================
app.get("/api/admin/payments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        payments.*,
        profiles.full_name,
        profiles.email
      FROM payments
      INNER JOIN profiles
      ON payments.user_id = profiles.id
      ORDER BY payments.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ================= DELETE PAYMENT =================
app.delete("/api/admin/payments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM payments
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: "Payment deleted",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

function getWeekNumber() {
  // Ethiopia timezone
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Africa/Addis_Ababa",
    }),
  );

  const firstDay = new Date(now.getFullYear(), 0, 1);

  const pastDays = (now - firstDay) / 86400000;

  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

// ================= GET USER ATTENDANCE =================
app.get("/api/attendance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const currentWeek = getWeekNumber();

    const result = await pool.query(
      `
      SELECT *
      FROM attendance
      WHERE user_id = $1
      AND week_number = $2
      `,
      [userId, currentWeek]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= MARK ATTENDANCE =================
app.post("/api/attendance", async (req, res) => {
  try {
    const {
      user_id,
      day_name,
      completed,
    } = req.body;

   const currentWeek = getWeekNumber();

    const existing = await pool.query(
      `
      SELECT *
      FROM attendance
      WHERE user_id = $1
      AND day_name = $2
      AND week_number = $3
      `,
      [user_id, day_name, currentWeek]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `
        UPDATE attendance
        SET completed = $1
        WHERE user_id = $2
        AND day_name = $3
        AND week_number = $4
        `,
        [
          completed,
          user_id,
          day_name,
          currentWeek,
        ]
      );
    } else {
      await pool.query(
        `
        INSERT INTO attendance (
          user_id,
          day_name,
          completed,
          week_number
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          user_id,
          day_name,
          completed,
          currentWeek,
        ]
      );
    }

    res.json({
      message: "Attendance updated",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});