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

// Экран уведомлений (открывается push'ем по колокольчику).
export default function Notifications({ onBack }) {
  return (
    <>
      <div className="detail-head" style={{ background: "var(--elev)" }}>
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
        <span className="h-title">Уведомления</span>
      </div>

      <div className="detail-scroll" style={{ padding: "0 18px 30px" }}>
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
