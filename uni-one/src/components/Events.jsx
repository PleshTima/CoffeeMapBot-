import { useMemo, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { EVENTS, banner, avatar } from "../data";

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "today", label: "Сегодня" },
  { id: "mgu", label: "МГУ" },
  { id: "online", label: "Онлайн" },
];

// Экран «Мероприятия».
export default function Events({ going, onToggle }) {
  const [filter, setFilter] = useState("all");

  const list = useMemo(
    () =>
      EVENTS.filter((e) => {
        if (filter === "today") return e.today;
        if (filter === "online") return e.online;
        if (filter === "mgu") return e.place.includes("МГУ");
        return true;
      }),
    [filter]
  );

  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">Мероприятия</div>
        <div className="head-actions">
          <Icon name="bell" size={24} />
          <Icon name="search" size={24} />
        </div>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`pill ${filter === f.id ? "active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 && <div className="empty">Тут пока пусто 🤷</div>}

      {list.map((e) => {
        const isGoing = going.includes(e.id);
        const count = e.going + (isGoing ? 1 : 0);
        return (
          <div className="event-card" key={e.id}>
            <div className="event-banner">
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
            </div>

            <div className="event-body">
              <div className="event-title">{e.title}</div>
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
