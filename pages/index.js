import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error) {
        setWishes(data);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 50 }}>
      <h1>願望列表</h1>

      {wishes.length === 0 && <p>目前沒有已審核的願望</p>}

      {wishes.map((w) => (
        <div key={w.id} style={{ marginBottom: 20 }}>
          <h3>{w.name}</h3>
          <p>{w.content}</p>
        </div>
      ))}
    </div>
  );
}
