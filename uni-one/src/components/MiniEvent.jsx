import SmartImg from "./SmartImg";
import { banner, catIcon, catLabel } from "../data";

// Компактная карточка мероприятия (в профиле человека и в своём профиле).
export default function MiniEvent({ event, onClick }) {
  return (
    <div
      className="mini-event"
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      <SmartImg src={banner(event.seed)} alt={event.title} />
      <div className="me-main">
        <div className="me-title">{event.title}</div>
        <div className="me-meta">
          <span className="me-cat">{catIcon(event.category)}</span>
          {catLabel(event.category)} · {event.date} · {event.time}
        </div>
      </div>
    </div>
  );
}
