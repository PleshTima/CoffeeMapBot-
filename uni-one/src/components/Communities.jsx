import { useMemo, useState } from "react";
import { COMMUNITIES } from "../data";

// Модуль «Сообщества по интересам»: поиск «своих» по хобби,
// тематические группы и чаты (обеспечение первичного контакта).
export default function Communities({ user, joined, onJoin }) {
  const [query, setQuery] = useState("");
  const [onlyMatch, setOnlyMatch] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMMUNITIES.map((c) => ({
      ...c,
      match: c.tags.some((t) => user.interests.includes(t)),
    }))
      .filter(
        (c) =>
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.desc.toLowerCase().includes(q)) &&
          (!onlyMatch || c.match)
      )
      // Сначала сообщества, совпадающие с интересами пользователя
      .sort((a, b) => Number(b.match) - Number(a.match));
  }, [query, onlyMatch, user.interests]);

  return (
    <div className="screen">
      <div className="section-title" style={{ marginTop: 18 }}>
        Сообщества
      </div>
      <div className="section-sub">
        Найди «своих» по интересам и начни общение онлайн ещё до очной встречи.
      </div>

      <input
        className="search-input"
        placeholder="🔎 Поиск по интересам и хобби…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chips" style={{ marginTop: 10 }}>
        <button
          className={`chip ${onlyMatch ? "active" : ""}`}
          onClick={() => setOnlyMatch((v) => !v)}
        >
          🎯 Под мои интересы
        </button>
      </div>

      {list.length === 0 && (
        <div className="empty">Ничего не нашлось — попробуй другой запрос 🔍</div>
      )}

      {list.map((c) => (
        <div className="community-card" key={c.id}>
          <div className="community-head">
            <div>
              <span className="community-name">{c.name}</span>
              {c.match && <span className="match-tag">ТВОЯ ТЕМА</span>}
            </div>
            <span className="online-dot">
              <i /> {c.online} онлайн
            </span>
          </div>

          <div className="community-desc">{c.desc}</div>
          <div className="last-msg">💬 {c.lastMsg}</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <span className="members">
              👥 {c.members + (joined.includes(c.id) ? 1 : 0)} участников
            </span>
            <button
              className={`btn ${joined.includes(c.id) ? "btn-success" : "btn-ghost"}`}
              style={{ width: "auto", padding: "10px 18px" }}
              onClick={() => onJoin(c.id)}
            >
              {joined.includes(c.id) ? "✓ Вы в группе" : "Вступить"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
