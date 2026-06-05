import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { banner, avatar } from "../data";

// Экран деталей мероприятия (открывается push'ем).
export default function EventDetail({ event, going, onToggle, onBack }) {
  const count = event.going + (going ? 1 : 0);
  return (
    <>
      <div className="detail-head on-image">
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
      </div>

      <div className="detail-scroll">
        <div className="detail-hero">
          <SmartImg src={banner(event.seed)} alt={event.title} />
          <div className="scrim" />
        </div>

        <div className="detail-body" style={{ paddingBottom: 110 }}>
          <div className="detail-title">{event.title}</div>

          <div className="info-row">
            <span className="ic">
              <Icon name="calendar" size={20} />
            </span>
            <div>
              <div className="k">Дата и время</div>
              <div className="v">
                {event.date} · {event.time}
              </div>
            </div>
          </div>
          <div className="info-row">
            <span className="ic">
              <Icon name="pin" size={20} />
            </span>
            <div>
              <div className="k">Место</div>
              <div className="v">{event.place}</div>
            </div>
          </div>
          <div className="info-row">
            <span className="ic">
              <Icon name="users" size={20} />
            </span>
            <div>
              <div className="k">Участники</div>
              <div className="v">{count} студентов идут</div>
            </div>
          </div>

          <div className="detail-section">О мероприятии</div>
          <div className="detail-text">{event.desc}</div>

          <div className="detail-section">Кто идёт</div>
          <div className="attendees">
            {event.attendees.map((n) => (
              <SmartImg key={n} className="av" src={avatar(n)} />
            ))}
            <span className="more">+{count - event.attendees.length}</span>
            <span className="going-label">и ещё много студентов</span>
          </div>
        </div>
      </div>

      <div className="detail-cta">
        <button
          className={`btn-rsvp ${going ? "done" : ""}`}
          onClick={() => onToggle(event.id)}
        >
          {going ? (
            <>✓ Вы идёте</>
          ) : (
            <>
              Записаться <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </div>
    </>
  );
}
