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
      setMessage("讀取失敗：" + error.message);
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
      setMessage("更新失敗：" + error.message);
      return;
    }

    setMessage("已更新");
    loadWishes();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>審核後台</h1>

      {message && <p>{message}</p>}

      {wishes.map((w) => (
        <div key={w.id} style={{ marginBottom: 20 }}>
          <h3>{w.name}</h3>
          <p>{w.content}</p>
          <p>狀態：{w.status}</p>

          <button onClick={() => updateStatus(w.id, "approved")}>
            通過
          </button>

          <button
            onClick={() => updateStatus(w.id, "rejected")}
            style={{ marginLeft: 10 }}
          >
            退件
          </button>
        </div>
      ))}
    </div>
  );
}
