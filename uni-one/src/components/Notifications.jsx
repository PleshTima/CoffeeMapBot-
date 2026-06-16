import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { NOTIFICATIONS } from "../data";

const FALLBACK = {
  like: { icon: "heartFill", color: "var(--orange)" },
  match: { icon: "sparkles", color: "var(--pink)" },
  event: { icon: "calendar", color: "var(--blue)" },
  message: { icon: "chat", color: "var(--blue)" },
  friend: { icon: "users", color: "var(--green)" },
};

// Экран уведомлений (открывается push'ем). Сверху — мэтчи.
export default function Notifications({ matches = [], onBack, onOpenMatch }) {
  // Мэтчи как уведомления
  const matchNotifs = matches.map((m) => ({
    id: `mn-${m.id}`,
    type: "match",
    text: `У вас новый мэтч с ${m.name}!`,
    time: m.isNew ? "только что" : "недавно",
    photo: m.photo,
    person: m,
  }));

  const all = [...matchNotifs, ...NOTIFICATIONS];

  return (
    <>
      <div className="detail-head" style={{ background: "var(--elev)" }}>
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
        <span className="h-title">Уведомления</span>
      </div>

      <div className="detail-scroll" style={{ padding: "0 18px 30px" }}>
        {all.map((n) => {
          const fb = FALLBACK[n.type] || FALLBACK.message;
          return (
            <div
              className="notif"
              key={n.id}
              onClick={n.person && onOpenMatch ? () => onOpenMatch(n.person) : undefined}
              style={n.person && onOpenMatch ? { cursor: "pointer" } : undefined}
            >
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
