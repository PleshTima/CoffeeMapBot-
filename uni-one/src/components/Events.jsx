import { useMemo, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { EVENTS, EVENT_CATEGORIES, catIcon, banner, avatar } from "../data";

const QUICK = [
  { id: "all", label: "Все" },
  { id: "today", label: "Сегодня" },
  { id: "online", label: "Онлайн" },
];

// Экран «Мероприятия» — AI-поиск, фильтры по категориям, лента событий.
export default function Events({ going, onToggle, onOpen }) {
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState("all");
  const [cat, setCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((e) => {
      if (quick === "today" && !e.today) return false;
      if (quick === "online" && !e.online) return false;
      if (cat && e.category !== cat) return false;
      if (q && !`${e.title} ${e.place} ${e.category}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [query, quick, cat]);

  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">Мероприятия</div>
        <div className="head-actions">
          <button
            className={`icon-btn ${showFilters || cat ? "filter-on" : ""}`}
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Фильтры"
          >
            <Icon name="sliders" size={24} />
          </button>
        </div>
      </div>

      {/* AI-поиск */}
      <div className="ai-search">
        <span className="ai-badge">
          <Icon name="sparkles" size={16} /> ИИ
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Спросите ИИ: куда сходить сегодня?"
        />
        <Icon name="search" size={20} />
      </div>

      {/* Быстрые фильтры */}
      <div className="filters">
        {QUICK.map((f) => (
          <button
            key={f.id}
            className={`pill ${quick === f.id ? "active" : ""}`}
            onClick={() => setQuick(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Категории (по кнопке фильтра) */}
      {showFilters && (
        <div className="filters cat-row">
          <button
            className={`pill ${!cat ? "active" : ""}`}
            onClick={() => setCat(null)}
          >
            Любая тема
          </button>
          {EVENT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`pill ${cat === c.id ? "active" : ""}`}
              onClick={() => setCat(cat === c.id ? null : c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 && (
        <div className="empty">По запросу ничего не нашлось 🤖</div>
      )}

      {list.map((e) => {
        const isGoing = going.includes(e.id);
        const count = e.going + (isGoing ? 1 : 0);
        return (
          <div className="event-card" key={e.id}>
            <div
              className="event-banner"
              onClick={() => onOpen?.(e)}
              style={{ cursor: "pointer" }}
            >
              <SmartImg src={banner(e.seed)} alt={e.title} />
              <div className="scrim" />
              {e.badge && (
                <span className={`event-badge ${e.badge}`}>
                  {e.badge === "hot" ? (
                    <>
                      <Icon name="flame" size={13} /> ГОРЯЧО
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size={13} /> НОВОЕ
                    </>
                  )}
                </span>
              )}
              <span className="event-cat">
                {catIcon(e.category)} {e.category && cap(e.category)}
              </span>
            </div>

            <div className="event-body">
              <div
                className="event-title"
                onClick={() => onOpen?.(e)}
                style={{ cursor: "pointer" }}
              >
                {e.title}
              </div>
              <div className="event-row date">
                <Icon name="calendar" size={17} /> {e.date} · {e.time}
              </div>
              <div className="event-row">
                <Icon name="pin" size={17} /> {e.place}
              </div>

              <div className="event-foot">
                <div className="attendees">
                  {e.attendees.map((n) => (
                    <SmartImg key={n} className="av" src={avatar(n)} />
                  ))}
                  <span className="more">+{count - e.attendees.length}</span>
                  <span className="going-label">{count} идут</span>
                </div>
              </div>

              <button
                className={`btn-rsvp ${isGoing ? "done" : ""}`}
                onClick={() => onToggle(e.id)}
              >
                {isGoing ? (
                  <>✓ Вы идёте</>
                ) : (
                  <>
                    Записаться <Icon name="arrow" size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const LABELS = {
  party: "Вечеринка",
  networking: "Нетворкинг",
  lecture: "Лекция",
  sport: "Спорт",
  music: "Музыка",
  culture: "Культура",
  it: "IT",
  games: "Игры",
};
const cap = (id) => LABELS[id] || id;
