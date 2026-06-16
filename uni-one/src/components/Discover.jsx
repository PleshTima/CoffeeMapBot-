import { useRef, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { PEOPLE, eventById } from "../data";

// Экран «Главная» — свайп-знакомства (drag + кнопки).
export default function Discover({ onProfile, onDecision, onOpen }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [exit, setExit] = useState(null); // 'like' | 'nope'
  const start = useRef(null);

  const person = PEOPLE[index];
  const next = PEOPLE[index + 1];

  const finish = (dir) => {
    setExit(dir);
    const decided = person;
    setTimeout(() => {
      setExit(null);
      setDrag({ x: 0, y: 0, active: false });
      setIndex((i) => i + 1);
      onDecision(dir, decided);
    }, 280);
  };

  const onDown = (e) => {
    if (exit) return;
    start.current = { x: e.clientX, y: e.clientY };
    setDrag((d) => ({ ...d, active: true }));
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!start.current) return;
    setDrag({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
      active: true,
    });
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (drag.x > 110) finish("like");
    else if (drag.x < -110) finish("nope");
    else {
      // Малое перемещение = тап → открыть профиль анкеты
      if (Math.abs(drag.x) < 8 && Math.abs(drag.y) < 8) onOpen?.(person);
      setDrag({ x: 0, y: 0, active: false });
    }
  };

  // Трансформ верхней карточки
  let tx = drag.x;
  let rot = drag.x / 18;
  if (exit === "like") {
    tx = 600;
    rot = 25;
  } else if (exit === "nope") {
    tx = -600;
    rot = -25;
  }
  const topStyle = {
    transform: `translate(${tx}px, ${drag.y * 0.25}px) rotate(${rot}deg)`,
    transition: drag.active ? "none" : "transform 0.28s ease",
  };
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 90));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 90));

  return (
    <div className="screen">
      <div className="discover-top">
        <button className="icon-btn" onClick={onProfile} aria-label="Профиль">
          <Icon name="user" size={24} />
        </button>
        <div className="flame-logo">
          <span style={{ color: "var(--orange)" }}>
            <Icon name="flame" size={26} />
          </span>
        </div>
        <button className="icon-btn" aria-label="Фильтры">
          <Icon name="sliders" size={22} />
        </button>
      </div>

      <div className="deck">
        {!person && (
          <div className="deck-empty">
            <div>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
              Анкеты на сегодня закончились!
              <br />
              Загляни позже — появятся новые.
            </div>
          </div>
        )}

        {next && <Card person={next} />}
        {person && (
          <Card
            person={person}
            style={topStyle}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            likeOpacity={likeOpacity}
            nopeOpacity={nopeOpacity}
          />
        )}
      </div>

      {person && (
        <>
          <div className="swipe-actions">
            <button className="round-btn nope" onClick={() => finish("nope")}>
              <Icon name="x" size={28} stroke={2.5} />
            </button>
            <button className="round-btn star" onClick={() => finish("like")}>
              <Icon name="star" size={24} />
            </button>
            <button className="round-btn like" onClick={() => finish("like")}>
              <Icon name="heartFill" size={28} />
            </button>
          </div>
          <div className="swipe-hint">← Свайпайте влево или вправо →</div>
        </>
      )}
    </div>
  );
}

function Card({ person, style, likeOpacity = 0, nopeOpacity = 0, ...handlers }) {
  return (
    <div className="swipe-card" style={style} {...handlers}>
      <SmartImg src={person.photo} alt={person.name} />
      <div className="scrim" />

      <div className="stamp like" style={{ opacity: likeOpacity }}>
        LIKE
      </div>
      <div className="stamp nope" style={{ opacity: nopeOpacity }}>
        NOPE
      </div>

      <div className="card-distance">
        <Icon name="pin" size={14} /> {person.distance}
      </div>

      <div className="card-info">
        <div className="card-name">
          {person.name}, {person.age}
          {person.verified && (
            <span style={{ color: "var(--blue)" }}>
              <Icon name="heartFill" size={18} />
            </span>
          )}
        </div>
        <div className="card-sub">
          {person.faculty} · {person.course}
        </div>
        {person.events?.length > 0 && (
          <div className="card-events">
            <span className="tk">🎟️</span>
            Идёт на «{eventById(person.events[0])?.title}»
            {person.events.length > 1 && ` +${person.events.length - 1}`}
          </div>
        )}
        <div className="card-chips">
          {person.interests.map((it) => (
            <span className="chip-pink" key={it}>
              {it}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
