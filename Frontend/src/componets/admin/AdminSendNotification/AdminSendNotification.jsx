import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./AdminSendNotification.module.css";

function AdminSendNotification() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  // upload file
 const uploadFile = async (file, folder) => {
   const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

   const { error } = await supabase.storage.from(folder).upload(fileName, file);

   if (error) throw error;

   const { data } = supabase.storage.from(folder).getPublicUrl(fileName);

   return data.publicUrl; // MUST BE THIS
 };

  const handleSend = async () => {
    setLoading(true);

    try {
      let imageUrls = [];
      let videoUrl = null;

      // upload images
      for (let img of images) {
        const url = await uploadFile(img, "notifications");
        imageUrls.push(url);
      }

      // upload video
      if (video) {
        videoUrl = await uploadFile(video, "notifications");
      }

      // send to backend
      const res = await fetch(`${API_URL}/api/admin/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || null,
          message: message || null,
          images: imageUrls,
          video: videoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send");
      }

      alert("Notification sent!");

      setTitle("");
      setMessage("");
      setImages([]);
      setVideo(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error sending notification");
    }

    setLoading(false);
  };

  return (
    <div className={styles.section}>
      <h2>Send Notification</h2>

      {/* TITLE (OPTIONAL) */}
      <input
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* MESSAGE (OPTIONAL) */}
      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* IMAGE UPLOAD */}
      <div className={styles.uploadBox}>
        <label>Upload Images (optional)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />
      </div>

      {/* VIDEO UPLOAD */}
      <div className={styles.uploadBox}>
        <label>Upload Video (optional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />
      </div>

      {/* BUTTONS */}
      <div className={styles.btnGroup}>
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send Notification"}
        </button>

        <button
          onClick={() => navigate("/admin/notifications")}
          className={styles.secondaryBtn}
        >
          See All Notifications
        </button>
      </div>
    </div>
  );
}

export default AdminSendNotification;
