import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const ADMIN_PASSWORD = "delin1234";

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false);
  const [password, setPassword] = useState("");
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
    if (isLogin) loadWishes();
  }, [isLogin]);

  function handleLogin(e) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setIsLogin(true);
      setMessage("");
    } else {
      setMessage("密碼錯誤");
    }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("wishes")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage("更新失敗：" + error.message);
      return;
    }

    setMessage("狀態已更新");
    loadWishes();
  }

  if (!isLogin) {
    return (
      <div style={{ maxWidth: 420, margin: "80px auto", padding: 40, fontFamily: "system-ui" }}>
        <h1>管理員登入</h1>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <input
            type="password"
            placeholder="請輸入管理員密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 12, fontSize: 16 }}
          />
          <button type="submit" style={{ padding: 12, fontSize: 16 }}>
            登入後台
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 40, fontFamily: "system-ui" }}>
      <h1>發願審核後台</h1>
      <p>管理員可審核學生送出的發願內容。</p>

      <button onClick={() => setIsLogin(false)}>登出</button>

      {message && <p>{message}</p>}

      {wishes.length === 0 ? (
        <p>目前沒有願望</p>
      ) : (
        wishes.map((wish) => (
          <div
            key={wish.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              background: "#fafafa"
            }}
          >
            <h3>{wish.name}</h3>
            <p>{wish.content}</p>
            <p>目前狀態：{wish.status}</p>

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
        ))
      )}
    </div>
  );
}
