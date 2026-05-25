import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import styles from "./CustomerUploadReceipt.module.css";

function CustomerUploadReceipt() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    // ✅ IMAGE VALIDATION
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    setLoading(true);

    try {
      // ✅ UNIQUE FILE NAME
      const fileName = `${Date.now()}_${file.name}`;

      // ✅ UPLOAD TO SUPABASE STORAGE
      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      // ✅ ERROR CHECK
      if (error) {
        console.log(error);
        alert(error.message);
        setLoading(false);
        return;
      }

      // ✅ GET PUBLIC URL
      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      console.log("Uploaded URL:", imageUrl);

      // ✅ SAVE TO BACKEND DATABASE
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          screenshot_url: imageUrl,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Database save failed");
      }

      // ✅ SUCCESS
      alert("Receipt uploaded successfully!");

      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container} id="uploadreceipt">
      <h2 className={styles.title}>Upload Payment Receipt</h2>

      <p className={styles.subtitle}>
        Upload screenshot of your payment receipt for membership approval.
      </p>

      <div className={styles.uploadBox}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {file && (
        <div className={styles.preview}>
          <img src={URL.createObjectURL(file)} alt="Preview" />
        </div>
      )}

      <button
        className={styles.button}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Receipt"}
      </button>
    </div>
  );
}

export default CustomerUploadReceipt;
