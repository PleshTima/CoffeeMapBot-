import Icon from "./Icon";
import SmartImg from "./SmartImg";
import {
  ME,
  banner,
  avatar,
  goingContacts,
  groupsForEvent,
  CONTACTS,
} from "../data";

// Экран деталей мероприятия: инфо, кто идёт, компании, чат.
export default function EventDetail({
  event,
  going,
  onToggle,
  onBack,
  onOpenChat,
  onOpenPerson,
  onJoinGroup,
  onCreateGroup,
  joinedGroups = [],
}) {
  const count = event.going + (going ? 1 : 0);
  const people = goingContacts(event.id);
  const groups = groupsForEvent(event.id);
  const photoOf = (id) => CONTACTS.find((c) => c.id === id)?.photo;

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

        <div className="detail-body" style={{ paddingBottom: 120 }}>
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

          <div className="detail-section">О мероприятии</div>
          <div className="detail-text">{event.desc}</div>

          {/* Кто идёт */}
          <div className="detail-section">Кто идёт · {count}</div>
          <div className="going-people">
            {people.map((c) => (
              <button
                className="gp"
                key={c.id}
                onClick={() => onOpenPerson?.(c)}
              >
                <SmartImg src={c.photo} alt={c.name} />
                <span>{c.name}</span>
              </button>
            ))}
            {event.attendees.map((n) => (
              <div className="gp" key={n}>
                <SmartImg src={avatar(n)} alt="" />
                <span style={{ color: "var(--muted)" }}>гость</span>
              </div>
            ))}
          </div>

          {/* Пойти компанией */}
          <div className="detail-section between">
            <span>👥 Пойти компанией</span>
            <button className="mini-btn" onClick={() => onCreateGroup?.(event)}>
              + Собрать
            </button>
          </div>
          {groups.length === 0 && (
            <div className="muted-row">
              Пока никто не собрал компанию. Будь первым!
            </div>
          )}
          {groups.map((g) => {
            const joined = joinedGroups.includes(g.id);
            const need = Math.max(0, g.needed - (joined ? 1 : 0));
            return (
              <div className="group-card" key={g.id}>
                <div className="group-main">
                  <div className="group-name">{g.name}</div>
                  <div className="group-avatars">
                    {g.memberIds.map((id) => (
                      <SmartImg key={id} src={photoOf(id)} alt="" />
                    ))}
                    {joined && <SmartImg src={ME.photo} alt="Вы" />}
                  </div>
                  <div className="group-need">
                    {need > 0 ? `нужно ещё ${need}` : "компания собрана 🎉"}
                  </div>
                </div>
                <button
                  className={`group-join ${joined ? "joined" : ""}`}
                  onClick={() => onJoinGroup?.(g.id)}
                >
                  {joined ? "✓ Вы в компании" : "Присоединиться"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-cta two">
        <button
          className="cta-chat"
          onClick={() => onOpenChat?.(event)}
          aria-label="Чат мероприятия"
        >
          <Icon name="chat" size={20} />
        </button>
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
