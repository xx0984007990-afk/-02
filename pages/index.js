import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Home() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [wishes, setWishes] = useState([]);
  const [message, setMessage] = useState("");

  async function loadWishes() {
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    setWishes(data || []);
  }

  useEffect(() => {
    loadWishes();
  }, []);

  async function sendWish(e) {
    e.preventDefault();

    if (!name || !content) {
      setMessage("請填寫名字與願望");
      return;
    }

    const { error } = await supabase.from("wishes").insert([
      {
        name,
        content,
        status: "pending",
      },
    ]);

    if (error) {
      setMessage("送出失敗");
      return;
    }

    setName("");
    setContent("");
    setMessage("發願成功，等待審核後會出現在樹上");
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="left">
          <h1>發願樹</h1>
          <h2>讓願望被看見，讓世界被改變</h2>
          <p>
            每一份發願，都是一顆種子。經過審核後，願望會化作樹上的光點，
            在發願樹上發光。
          </p>

          <form onSubmit={sendWish} className="form">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="寫下你的願望"
              rows={4}
            />
            <button type="submit">送出發願</button>
          </form>

          {message && <div className="message">{message}</div>}
        </div>

        <div className="treeArea">
          <div className="tree">
            <div className="canopy"></div>
            <div className="trunk"></div>

            {wishes.length === 0 ? (
              <div className="empty">目前沒有已審核的願望</div>
            ) : (
              wishes.slice(0, 9).map((wish, index) => (
                <div
                  key={wish.id}
                  className="wishNode"
                  style={{
                    left: `${20 + (index % 3) * 28}%`,
                    top: `${18 + Math.floor(index / 3) * 24}%`,
                    animationDelay: `${index * 0.4}s`,
                  }}
                >
                  <strong>{wish.name}</strong>
                  <span>{wish.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 70% 20%, rgba(255, 215, 120, 0.25), transparent 25%),
            linear-gradient(180deg, #07110c 0%, #102015 55%, #080806 100%);
          color: #fff5d9;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow: hidden;
        }

        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 24px;
          padding: 60px;
          align-items: center;
        }

        .left {
          z-index: 2;
        }

        h1 {
          font-size: 88px;
          margin: 0;
          color: #f8dc96;
          line-height: 1;
        }

        h2 {
          font-size: 28px;
          color: #ffe09a;
          line-height: 1.5;
        }

        p {
          line-height: 1.9;
          color: rgba(255, 245, 217, 0.9);
        }

        .form {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        input,
        textarea {
          border: 1px solid rgba(255, 220, 150, 0.25);
          border-radius: 14px;
          padding: 14px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.92);
          color: #1f160c;
        }

        button {
          border: none;
          border-radius: 14px;
          padding: 14px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(180deg, #f3cd72, #d9ab4c);
          color: #24170b;
        }

        .message {
          margin-top: 14px;
          color: #ffd97e;
          font-weight: 700;
        }

        .treeArea {
          position: relative;
          height: 720px;
        }

        .tree {
          position: relative;
          width: 100%;
          height: 100%;
          animation: sway 7s ease-in-out infinite;
        }

        .canopy {
          position: absolute;
          left: 50%;
          top: 8%;
          transform: translateX(-50%);
          width: 620px;
          height: 360px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 40%, rgba(255, 230, 140, 0.9), rgba(255, 200, 70, 0.25) 35%, rgba(34, 96, 45, 0.95) 70%);
          filter: drop-shadow(0 0 40px rgba(255, 205, 90, 0.25));
        }

        .trunk {
          position: absolute;
          left: 50%;
          bottom: 6%;
          transform: translateX(-50%);
          width: 120px;
          height: 430px;
          border-radius: 70px 70px 30px 30px;
          background:
            linear-gradient(180deg, #7a5332 0%, #412716 55%, #201109 100%);
          box-shadow: inset 0 0 18px rgba(255, 210, 90, 0.25);
        }

        .trunk::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 20px;
          width: 8px;
          height: 360px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #fff0af, #f5a81c);
          box-shadow: 0 0 20px rgba(255, 200, 80, 0.7);
          animation: flow 3s linear infinite;
        }

        .wishNode {
          position: absolute;
          width: 150px;
          min-height: 120px;
          border-radius: 50%;
          padding: 20px;
          text-align: center;
          background:
            radial-gradient(circle at 30% 30%, rgba(255, 240, 180, 0.35), rgba(212, 154, 46, 0.82) 58%, rgba(92, 56, 17, 0.96) 100%);
          border: 1px solid rgba(255, 230, 150, 0.4);
          box-shadow: 0 0 35px rgba(255, 204, 82, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          animation: float 5s ease-in-out infinite;
        }

        .wishNode strong {
          color: #fff4c8;
        }

        .wishNode span {
          font-size: 14px;
          line-height: 1.5;
        }

        .empty {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          color: rgba(255, 245, 217, 0.75);
          font-weight: 700;
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes flow {
          0% {
            opacity: 0.2;
            transform: translateX(-50%) translateY(40px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
            transform: translateX(-50%) translateY(-40px);
          }
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 32px;
          }

          h1 {
            font-size: 58px;
          }

          .treeArea {
            height: 620px;
          }

          .canopy {
            width: 420px;
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}
