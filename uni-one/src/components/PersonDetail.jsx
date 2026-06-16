import Icon from "./Icon";
import SmartImg from "./SmartImg";
import MiniEvent from "./MiniEvent";
import { eventById } from "../data";

// Экран профиля человека / пары (открывается push'ем).
export default function PersonDetail({
  person,
  onBack,
  onLike,
  onMessage,
  onInvite,
  onOpenEvent,
  going = [],
}) {
  const events = (person.events || []).map(eventById).filter(Boolean);
  const common = (person.events || [])
    .filter((id) => going.includes(id))
    .map(eventById)
    .filter(Boolean);
  return (
    <>
      <div className="detail-head on-image">
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
      </div>

      <div className="detail-scroll">
        <div className="person-hero">
          <SmartImg src={person.photo} alt={person.name} />
          <div className="scrim" />
          <div className="ov">
            <div className="nm">
              {person.name}
              {person.age ? `, ${person.age}` : ""}
              {person.verified && (
                <span style={{ color: "var(--blue)" }}>
                  <Icon name="heartFill" size={20} />
                </span>
              )}
            </div>
            <div className="fc">
              {person.faculty}
              {person.course ? ` · ${person.course}` : ""}
            </div>
          </div>
        </div>

        <div style={{ padding: "0 20px 30px" }}>
          {common.length > 0 && (
            <div className="common-banner">
              🔥 У вас {common.length}{" "}
              {common.length === 1 ? "общее мероприятие" : "общих мероприятия"}:{" "}
              {common.map((e) => e.title).join(", ")}
            </div>
          )}
          {person.distance && (
            <div className="info-row">
              <span className="ic">
                <Icon name="pin" size={20} />
              </span>
              <div>
                <div className="k">Рядом</div>
                <div className="v">{person.distance} от вас</div>
              </div>
            </div>
          )}

          {person.bio && (
            <>
              <div className="detail-section">О себе</div>
              <div className="detail-text">{person.bio}</div>
            </>
          )}

          {person.interests?.length > 0 && (
            <>
              <div className="detail-section">Интересы</div>
              <div className="interest-chips">
                {person.interests.map((it) => (
                  <span className="chip-orange" key={it}>
                    {it}
                  </span>
                ))}
              </div>
            </>
          )}

          {events.length > 0 && (
            <>
              <div className="detail-section">🎟️ Куда идёт</div>
              {events.map((e) => (
                <MiniEvent
                  key={e.id}
                  event={e}
                  onClick={onOpenEvent ? () => onOpenEvent(e) : undefined}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="person-actions">
        {onLike && (
          <button className="like" onClick={() => onLike(person)}>
            <Icon name="heartFill" size={18} /> Лайк
          </button>
        )}
        {onInvite && (
          <button className="invite" onClick={() => onInvite(person)}>
            <Icon name="star" size={18} /> Позвать
          </button>
        )}
        {onMessage && (
          <button className="msg" onClick={() => onMessage(person)}>
            <Icon name="chat" size={18} /> Написать
          </button>
        )}
      </div>
    </>
  );
}
