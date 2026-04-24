import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Admin() {
  const [wishes, setWishes] = useState([]);
  const [message, setMessage] = useState("");

  async function loadWishes() {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("讀取失敗");
      return;
    }

    setWishes(data || []);
  }

  useEffect(() => {
    loadWishes();
  }, []);

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("wishes")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage("更新失敗");
      return;
    }

    setMessage("狀態已更新");
    loadWishes();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40, fontFamily: "system-ui" }}>
      <h1>發願審核後台</h1>
      <p>審核學生送出的發願內容。</p>

      {message && <p>{message}</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {wishes.map((wish) => (
          <div key={wish.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <strong>{wish.name}</strong>
            <p>{wish.content}</p>
            <p>狀態：{wish.status}</p>

            <button onClick={() => updateStatus(wish.id, "approved")}>
              通過
            </button>

            <button
              onClick={() => updateStatus(wish.id, "rejected")}
              style={{ marginLeft: 8 }}
            >
              退件
            </button>

            <button
              onClick={() => updateStatus(wish.id, "pending")}
              style={{ marginLeft: 8 }}
            >
              改回待審
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
