import Icon from "./Icon";
import SmartImg from "./SmartImg";

// Экран «Пары» — все совпадения.
export default function Matches({ matches, onMessage, onOpen }) {
  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">Пары</div>
        <div className="head-actions">
          <Icon name="sliders" size={22} />
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="empty">
          Пока нет пар 💔
          <br />
          Лайкай анкеты на «Главной» — взаимные лайки появятся здесь.
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m) => (
            <div className="match-card" key={m.id}>
              <SmartImg
                src={m.photo}
                alt={m.name}
                onClick={() => onOpen?.(m)}
                style={{ cursor: "pointer" }}
              />
              <div className="scrim" />
              {m.isNew && <span className="match-new">НОВЫЙ МЭТЧ</span>}
              <div className="match-meta">
                <div className="match-name">
                  {m.name}
                  {m.age ? `, ${m.age}` : ""}
                </div>
                <div className="match-fac">{m.faculty}</div>
                <button className="match-msg" onClick={() => onMessage(m)}>
                  Написать
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
