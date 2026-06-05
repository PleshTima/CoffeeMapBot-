import { useMemo, useState } from "react";
import { EVENTS, CATEGORIES, catById } from "../data";

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDay(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Модуль «Афиша»: единый календарь событий с фильтрами по теме
// и записью в один клик (централизация информационного потока).
export default function Afisha({ user, registered, onRegister, onToggleNewbie }) {
  const [cat, setCat] = useState("all");
  const [onlyNewbies, setOnlyNewbies] = useState(false);

  const filtered = useMemo(() => {
    return EVENTS.filter(
      (e) =>
        (cat === "all" || e.category === cat) &&
        (!onlyNewbies || e.forNewbies)
    );
  }, [cat, onlyNewbies]);

  // Группировка по дням для календарного вида
  const byDay = useMemo(() => {
    const map = {};
    for (const e of filtered) {
      (map[e.date] = map[e.date] || []).push(e);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="screen">
      <div className="newbie-banner">
        <span className="spark">📅</span>
        <h3>Привет, {user.name}! Вот что интересного на этой неделе</h3>
        <p>
          {EVENTS.filter((e) => e.forNewbies).length} событий открыты для
          новичков — записаться можно в один клик.
        </p>
      </div>

      <div className="section-title">Афиша</div>

      <div className="chips">
        <button
          className={`chip ${onlyNewbies ? "active" : ""}`}
          onClick={() => setOnlyNewbies((v) => !v)}
        >
          ⭐ Для новичков
        </button>
        <button
          className={`chip ${cat === "all" ? "active" : ""}`}
          onClick={() => setCat("all")}
        >
          Все темы
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`chip ${cat === c.id ? "active" : ""}`}
            onClick={() => setCat(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {byDay.length === 0 && (
        <div className="empty">Под этот фильтр пока ничего нет 🤷</div>
      )}

      {byDay.map(([day, events]) => (
        <div key={day}>
          <div className="day-label">{formatDay(day)}</div>
          {events.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              registered={registered.includes(e.id)}
              onRegister={() => onRegister(e.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function EventCard({ event, registered, onRegister }) {
  const cat = catById(event.category);
  const taken = registered ? event.taken + 1 : event.taken;
  const pct = Math.min(100, Math.round((taken / event.spots) * 100));

  return (
    <div className="card">
      <div className="event-top">
        <span className="cat-badge" style={{ background: cat.color }}>
          {cat.icon} {cat.label}
        </span>
        {event.forNewbies && <span className="newbie-tag">ДЛЯ НОВИЧКОВ</span>}
      </div>

      <div className="event-title">{event.title}</div>
      <div className="event-org">{event.org}</div>
      <div className="event-desc">{event.desc}</div>

      <div className="event-meta">
        <span>🕒 {event.time}</span>
        <span>📍 {event.place}</span>
      </div>

      <div className="spots-bar">
        <div style={{ width: `${pct}%` }} />
      </div>
      <div className="spots-label">
        {taken} / {event.spots} записались
      </div>

      <button
        className={`btn ${registered ? "btn-success" : "btn-primary"}`}
        onClick={onRegister}
      >
        {registered ? "✓ Вы записаны — отменить" : "Записаться в один клик"}
      </button>
    </div>
  );
}
