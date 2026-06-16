import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { NOTIFICATIONS, ACTIVITY, eventById, goingContacts } from "../data";

const FALLBACK = {
  like: { icon: "heartFill", color: "var(--orange)" },
  match: { icon: "sparkles", color: "var(--pink)" },
  event: { icon: "calendar", color: "var(--blue)" },
  message: { icon: "chat", color: "var(--blue)" },
  friend: { icon: "users", color: "var(--green)" },
};

// Экран «Активность»: напоминания, лента друзей, мэтчи, уведомления.
export default function Notifications({
  matches = [],
  going = [],
  onBack,
  onOpenMatch,
  onOpenEvent,
}) {
  // Умные напоминания: события, куда я иду, где будут друзья
  const reminders = going
    .map(eventById)
    .filter(Boolean)
    .map((e) => ({ event: e, friends: goingContacts(e.id) }))
    .filter((r) => r.friends.length > 0);

  const matchNotifs = matches.slice(0, 6).map((m) => ({
    id: `mn-${m.id}`,
    text: `У вас мэтч с ${m.name}!`,
    time: m.isNew ? "только что" : "недавно",
    photo: m.photo,
    person: m,
  }));

  return (
    <>
      <div className="detail-head" style={{ background: "var(--elev)" }}>
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
        <span className="h-title">Активность</span>
      </div>

      <div className="detail-scroll" style={{ padding: "0 18px 30px" }}>
        {reminders.length > 0 && (
          <>
            <div className="feed-head">⏰ Напоминания</div>
            {reminders.map((r) => (
              <button
                className="reminder"
                key={r.event.id}
                onClick={() => onOpenEvent?.(r.event)}
              >
                <span className="rem-ic">📅</span>
                <div className="ntext">
                  Скоро «{r.event.title}» в {r.event.time} — там будут{" "}
                  {r.friends.length}{" "}
                  {r.friends.length === 1 ? "твой друг" : "твоих друзей"}
                  <div className="rem-faces">
                    {r.friends.slice(0, 4).map((c) => (
                      <SmartImg key={c.id} src={c.photo} alt={c.name} />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {matchNotifs.length > 0 && (
          <>
            <div className="feed-head">💞 Мэтчи</div>
            {matchNotifs.map((n) => (
              <div
                className="notif"
                key={n.id}
                onClick={n.person && onOpenMatch ? () => onOpenMatch(n.person) : undefined}
                style={n.person && onOpenMatch ? { cursor: "pointer" } : undefined}
              >
                <SmartImg className="nic" src={n.photo} alt="" />
                <div className="ntext">
                  {n.text}
                  <div className="ntime">{n.time}</div>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="feed-head">📰 Лента друзей</div>
        {ACTIVITY.map((a) => (
          <div className="notif" key={a.id}>
            <SmartImg className="nic" src={a.photo} alt={a.name} />
            <div className="ntext">
              <b>{a.name}</b> {a.action} <b>«{a.target}»</b>
              <div className="ntime">{a.time}</div>
            </div>
          </div>
        ))}

        <div className="feed-head">🔔 Уведомления</div>
        {NOTIFICATIONS.map((n) => {
          const fb = FALLBACK[n.type] || FALLBACK.message;
          return (
            <div className="notif" key={n.id}>
              {n.photo ? (
                <SmartImg className="nic" src={n.photo} alt="" />
              ) : (
                <span className="nic" style={{ color: fb.color }}>
                  <Icon name={fb.icon} size={22} />
                </span>
              )}
              <div className="ntext">
                {n.text}
                <div className="ntime">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
