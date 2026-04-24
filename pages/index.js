import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [message, setMessage] = useState("");

  async function loadWishes() {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("讀取願望失敗");
      return;
    }

    setWishes(data || []);
  }

  useEffect(() => {
    loadWishes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !content.trim()) {
      setMessage("請輸入姓名和願望內容");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("wishes").insert([
      {
        name: name.trim(),
        content: content.trim(),
        status: "pending"
      }
    ]);

    setLoading(false);

    if (error) {
      setMessage("送出失敗");
      return;
    }

    setName("");
    setContent("");
    setMessage("發願成功，已送出");
    loadWishes();
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 40, fontFamily: "system-ui" }}>
      <h1>發願樹網站 🌳</h1>
      <p>寫下你的願望，並存進 Supabase。</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的名字"
          style={{ padding: 12, fontSize: 16 }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="寫下你的願望"
          rows={4}
          style={{ padding: 12, fontSize: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          {loading ? "送出中..." : "送出發願"}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}

      <hr style={{ margin: "32px 0" }} />

      <h2>願望列表</h2>

      <div style={{ display: "grid", gap: 12 }}>
        {wishes.length === 0 ? (
          <p>目前還沒有願望</p>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 16,
                background: "#fafafa"
              }}
            >
              <strong>{wish.name}</strong>
              <p style={{ margin: "8px 0 0" }}>{wish.content}</p>
              <small style={{ color: "#666" }}>狀態：{wish.status}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
