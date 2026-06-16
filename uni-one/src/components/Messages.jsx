import { useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { CHATS, SUGGESTIONS, avatar } from "../data";

// Экран «Сообщения»: мэтчи сторис-лентой, чаты, поиск знакомых.
export default function Messages({
  matches,
  onOpenMatch,
  onOpenChat,
  added,
  onAdd,
  onBell,
  hasNew,
}) {
  const [query, setQuery] = useState("");

  const chats = CHATS.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">Сообщения</div>
        <div className="head-actions">
          <button
            className="icon-btn"
            onClick={onBell}
            aria-label="Уведомления"
            style={{ position: "relative" }}
          >
            <Icon name="bell" size={24} />
            {hasNew && <span className="notif-dot" />}
          </button>
        </div>
      </div>

      <div className="search-wrap">
        <Icon name="search" size={20} />
        <input
          className="search"
          placeholder="Поиск по сообщениям и людям"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Мэтчи — сторис-лентой */}
      <div className="section-row">
        <span className="section-label pink">Новые мэтчи</span>
        <span className="see-all">{matches.length}</span>
      </div>
      <div className="stories">
        {matches.map((m) => (
          <button
            className="story"
            key={m.id}
            onClick={() => onOpenMatch(m)}
          >
            <div className={`story-ring ${m.isNew ? "" : "seen"}`}>
              <SmartImg src={m.photo} alt={m.name} />
              {m.isNew && <span className="story-new">NEW</span>}
            </div>
            <div className="story-name">{m.name}</div>
          </button>
        ))}
        {matches.length === 0 && (
          <div className="empty" style={{ padding: "20px 10px" }}>
            Лайкай анкеты — мэтчи появятся здесь
          </div>
        )}
      </div>

      {/* Чаты */}
      <div style={{ marginTop: 6 }}>
        {chats.map((c) => (
          <button
            key={c.id}
            className="chat-item"
            style={{ width: "100%", textAlign: "left" }}
            onClick={() => onOpenChat(c)}
          >
            <div className="chat-ava">
              <SmartImg src={c.photo} alt={c.name} />
              {c.online && <span className="on" />}
            </div>
            <div className="chat-main">
              <div className="chat-top">
                <span className="chat-name">{c.name}</span>
                <span className="chat-time">{c.time}</span>
              </div>
              <div className="chat-last">{c.last}</div>
            </div>
            {c.unread > 0 && <span className="unread">{c.unread}</span>}
          </button>
        ))}
      </div>

      {/* Поиск знакомых */}
      <div className="section-row">
        <span className="section-label blue">Поиск знакомых</span>
        <span className="see-all">
          Все <Icon name="chevron" size={16} />
        </span>
      </div>
      {SUGGESTIONS.map((s) => (
        <div className="suggest-card" key={s.id}>
          <SmartImg className="face" src={s.photo} alt={s.name} />
          <div className="suggest-main">
            <div className="suggest-name">{s.name}</div>
            <div className="suggest-fac">{s.faculty}</div>
            <div className="mutual">
              {s.photos.map((n) => (
                <SmartImg key={n} src={avatar(n)} />
              ))}
              <span className="plus">+{s.mutual}</span>
            </div>
          </div>
          <button
            className={`btn-add ${added.includes(s.id) ? "added" : ""}`}
            onClick={() => onAdd(s.id)}
          >
            {added.includes(s.id) ? "✓ Заявка" : "Добавить+"}
          </button>
        </div>
      ))}
    </div>
  );
}
