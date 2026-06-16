import { useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import MiniEvent from "./MiniEvent";
import Sheet from "./Sheet";
import { ME, catIcon, catLabel, LEVELS, BADGES, ONB_INTERESTS } from "../data";

function statusOf(n) {
  if (n >= 5) return "🎉 Душа компании";
  if (n >= 3) return "🧭 Исследователь";
  if (n >= 1) return "🌱 Активист";
  return "🆕 Новичок";
}

const intById = (id) => ONB_INTERESTS.find((i) => i.id === id);

// Экран «Профиль».
export default function Profile({
  stats,
  goingEvents = [],
  xp = 0,
  interests = [],
  onToggleInterest,
  circleSummary,
  onOpenContacts,
  onBack,
  onOpenEvent,
}) {
  const s = stats || ME.stats;
  const [editing, setEditing] = useState(false);
  const myInterests = interests.map(intById).filter(Boolean);
  const goingCount = goingEvents.length;
  const badgeState = { goingCount, friends: s.friends, matches: s.matches };
  let level = 1;
  while (level < LEVELS.length && xp >= LEVELS[level]) level++;
  const prev = LEVELS[level - 1] ?? 0;
  const next = LEVELS[level] ?? LEVELS[LEVELS.length - 1];
  const pct = Math.min(100, Math.round(((xp - prev) / Math.max(1, next - prev)) * 100));
  return (
    <div className="screen" style={{ paddingTop: onBack ? 0 : 50 }}>
      {onBack && (
        <div className="detail-head" style={{ padding: "56px 0 4px" }}>
          <button className="back" onClick={onBack} aria-label="Назад">
            <Icon name="back" size={22} />
          </button>
          <span className="h-title">Профиль</span>
        </div>
      )}
      <div className="profile-top">
        <div className="ring profile-ring">
          <SmartImg src={ME.photo} alt={ME.name} />
        </div>
        <div className="profile-name">
          {ME.name}, {ME.age}
        </div>
        <div className="uni-badge">
          <span className="logo">🎓</span>
          {ME.uni} · {ME.faculty} · {ME.course}
        </div>
      </div>

      <div className="stats">
        <div className="stat-box">
          <div className="ico">
            <Icon name="heartFill" size={26} />
          </div>
          <div className="label">Лайки</div>
          <div className="num">{s.likes}</div>
        </div>
        <div className="stat-box">
          <div className="ico">
            <Icon name="sparkles" size={26} />
          </div>
          <div className="label">Мэтчи</div>
          <div className="num">{s.matches}</div>
        </div>
        <div className="stat-box">
          <div className="ico">
            <Icon name="users" size={26} />
          </div>
          <div className="label">Друзья</div>
          <div className="num">{s.friends}</div>
        </div>
      </div>

      {/* Геймификация */}
      <div className="level-card">
        <div className="level-top">
          <span className="level-status">{statusOf(goingCount)}</span>
          <span className="level-xp">
            {xp} XP · ур. {level}
          </span>
        </div>
        <div className="level-bar">
          <div style={{ width: `${pct}%` }} />
        </div>
        <div className="level-hint">
          {next > xp
            ? `До уровня ${level + 1}: ${next - xp} XP`
            : "Максимальный уровень 🏆"}
        </div>
      </div>

      <div className="badges-grid">
        {BADGES.map((b) => {
          const earned = b.test(badgeState);
          return (
            <div className={`badge ${earned ? "" : "locked"}`} key={b.id}>
              <div className="b-emoji">{earned ? b.icon : "🔒"}</div>
              <div className="b-label">{b.label}</div>
            </div>
          );
        })}
      </div>

      {onOpenContacts && (
        <button className="circle-cta" onClick={onOpenContacts}>
          <span className="cc-left">
            <Icon name="users" size={22} />
            <span>
              <div className="cc-title">Круг общения</div>
              <div className="cc-sub">{circleSummary}</div>
            </span>
          </span>
          <Icon name="chevron" size={20} />
        </button>
      )}

      <div className="about-card">
        <div className="about-head">
          <Icon name="heartFill" size={18} /> О себе
        </div>
        <p>{ME.bio}</p>
      </div>

      <div className="interests-head">
        <span className="star">
          <Icon name="star" size={20} />
        </span>
        Интересы
        {onToggleInterest && (
          <button className="edit-link" onClick={() => setEditing(true)}>
            Изменить
          </button>
        )}
      </div>
      <div className="interest-chips">
        {myInterests.length === 0 && (
          <span className="chip-orange" onClick={() => setEditing(true)}>
            ＋ Добавить интересы
          </span>
        )}
        {myInterests.map((it) => (
          <span className="chip-orange" key={it.id}>
            <span>{it.emoji}</span>
            {it.label}
          </span>
        ))}
      </div>

      <div className="interests-head">
        <span className="star">🎟️</span>
        Форматы мероприятий
      </div>
      <div className="interest-chips">
        {ME.eventInterests.map((id) => (
          <span className="chip-orange" key={id}>
            <span>{catIcon(id)}</span>
            {catLabel(id)}
          </span>
        ))}
      </div>

      <div className="interests-head">
        <span className="star">
          <Icon name="calendar" size={20} />
        </span>
        Я иду ({goingEvents.length})
      </div>
      {goingEvents.length === 0 ? (
        <div
          className="detail-text"
          style={{ padding: "4px 2px 8px" }}
        >
          Пока никуда не записаны. Загляните во вкладку «Мероприятия» 👀
        </div>
      ) : (
        goingEvents.map((e) => (
          <MiniEvent
            key={e.id}
            event={e}
            onClick={onOpenEvent ? () => onOpenEvent(e) : undefined}
          />
        ))
      )}

      <button className="btn-edit" onClick={() => setEditing(true)}>
        <Icon name="edit" size={20} /> Редактировать профиль
      </button>

      {editing && (
        <Sheet title="Мои интересы" onClose={() => setEditing(false)}>
          {ONB_INTERESTS.map((it) => {
            const on = interests.includes(it.id);
            return (
              <button
                key={it.id}
                className={`interest-toggle ${on ? "on" : ""}`}
                onClick={() => onToggleInterest?.(it.id)}
              >
                <span style={{ fontSize: 20 }}>{it.emoji}</span>
                {it.label}
                <span className="tg">{on ? "✓" : "＋"}</span>
              </button>
            );
          })}
        </Sheet>
      )}
    </div>
  );
}
