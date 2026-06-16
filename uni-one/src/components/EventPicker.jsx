import Sheet from "./Sheet";
import SmartImg from "./SmartImg";
import { EVENTS, banner, catIcon, catLabel } from "../data";

// Выбор мероприятия, чтобы позвать человека вместе (уникальная фича).
export default function EventPicker({ personName, onPick, onClose }) {
  return (
    <Sheet
      title={personName ? `Позвать ${personName} на…` : "Выбрать мероприятие"}
      onClose={onClose}
    >
      {EVENTS.map((e) => (
        <button
          key={e.id}
          className="pick-row"
          onClick={() => onPick(e)}
        >
          <SmartImg src={banner(e.seed)} alt={e.title} />
          <div className="pick-main">
            <div className="pick-title">{e.title}</div>
            <div className="pick-meta">
              {catIcon(e.category)} {catLabel(e.category)} · {e.date} · {e.time}
            </div>
          </div>
          <span className="pick-go">🎟️</span>
        </button>
      ))}
    </Sheet>
  );
}
