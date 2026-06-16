import { useMemo, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import {
  EVENTS,
  EVENT_CATEGORIES,
  catIcon,
  catLabel,
  banner,
  avatar,
  CLOSE_CIRCLES,
} from "../data";

// Множественные быстрые фильтры
const QUICK = [
  { id: "today", label: "Сегодня" },
  { id: "online", label: "Онлайн" },
  { id: "friends", label: "С друзьями" },
];

// Экран «Мероприятия» — AI-поиск, мультифильтры, друзья, лента событий.
export default function Events({ going, onToggle, onOpen, contacts = [] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState({}); // множественный выбор
  const [cat, setCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (id) => setActive((a) => ({ ...a, [id]: !a[id] }));

  // близкие контакты, идущие на событие
  const friendsOf = useMemo(() => {
    const close = contacts.filter((c) => CLOSE_CIRCLES.includes(c.circle));
    return (eventId) => close.filter((c) => c.events?.includes(eventId));
  }, [contacts]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((e) => {
      if (active.today && !e.today) return false;
      if (active.online && !e.online) return false;
      if (active.friends && friendsOf(e.id).length === 0) return false;
      if (cat && e.category !== cat) return false;
      if (q && !`${e.title} ${e.place} ${e.category}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [query, active, cat, friendsOf]);

  // «Где друзья сегодня»
  const friendsToday = useMemo(
    () => EVENTS.filter((e) => e.today && friendsOf(e.id).length > 0),
    [friendsOf]
  );

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

      {/* Множественные фильтры */}
      <div className="filters">
        {QUICK.map((f) => (
          <button
            key={f.id}
            className={`pill ${active[f.id] ? "active" : ""}`}
            onClick={() => toggle(f.id)}
          >
            {active[f.id] && "✓ "}
            {f.label}
          </button>
        ))}
      </div>

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

      {/* Где друзья сегодня */}
      {friendsToday.length > 0 && !active.today && !active.online && !cat && !query && (
        <>
          <div className="section-row">
            <span className="section-label">👀 Где твои друзья сегодня</span>
          </div>
          <div className="friends-today">
            {friendsToday.map((e) => {
              const fr = friendsOf(e.id);
              return (
                <button
                  className="ft-card"
                  key={e.id}
                  onClick={() => onOpen?.(e)}
                >
                  <SmartImg src={banner(e.seed)} alt={e.title} />
                  <div className="ft-scrim" />
                  <div className="ft-info">
                    <div className="ft-friends">
                      {fr.slice(0, 3).map((c) => (
                        <SmartImg key={c.id} src={c.photo} alt={c.name} />
                      ))}
                    </div>
                    <div className="ft-title">{e.title}</div>
                    <div className="ft-meta">
                      {fr.map((c) => c.name).join(", ")} · {e.time}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {list.length === 0 && (
        <div className="empty">По запросу ничего не нашлось 🤖</div>
      )}

      {list.map((e) => {
        const isGoing = going.includes(e.id);
        const count = e.going + (isGoing ? 1 : 0);
        const fr = friendsOf(e.id);
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
                {catIcon(e.category)} {catLabel(e.category)}
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

              {fr.length > 0 && (
                <div className="friends-going">
                  <div className="attendees">
                    {fr.slice(0, 3).map((c) => (
                      <SmartImg key={c.id} className="av" src={c.photo} />
                    ))}
                  </div>
                  <span>
                    💚 {fr.length === 1 ? `${fr[0].name} идёт` : `${fr.length} друзей идут`}
                  </span>
                </div>
              )}

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
