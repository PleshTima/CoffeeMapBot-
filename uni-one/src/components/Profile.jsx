import { EVENTS, COMMUNITIES, LEVELS, INTERESTS } from "../data";

// Профиль с геймификацией: XP, уровни, ачивки, идентика «свой-чужой»
// (снижение тревожности и вовлечение из презентации).
export default function Profile({ user, registered, joined }) {
  const nextThreshold = LEVELS[user.level] ?? LEVELS[LEVELS.length - 1];
  const prevThreshold = LEVELS[user.level - 1] ?? 0;
  const span = Math.max(1, nextThreshold - prevThreshold);
  const pct = Math.min(
    100,
    Math.round(((user.xp - prevThreshold) / span) * 100)
  );

  const myInterests = INTERESTS.filter((i) => user.interests.includes(i.id));

  return (
    <div className="screen">
      <div className="profile-hero">
        <div className="avatar">{user.name[0]}</div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-status">
          {user.isNewbie ? "🌱 Первокурсник · " : "🎓 Студент · "}
          {user.joinedDays} дн. в Uni-one
        </div>

        <div className="level-row">
          <span>Уровень {user.level}</span>
          <span>
            {user.xp} / {nextThreshold} XP
          </span>
        </div>
        <div className="level-bar">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="num">{registered.length}</div>
          <div className="cap">записей на события</div>
        </div>
        <div className="stat">
          <div className="num">{joined.length}</div>
          <div className="cap">сообществ</div>
        </div>
        <div className="stat">
          <div className="num">{user.badges.filter((b) => b.earned).length}</div>
          <div className="cap">ачивок</div>
        </div>
      </div>

      <div className="section-title">Достижения</div>
      <div className="badges-grid">
        {user.badges.map((b) => (
          <div key={b.id} className={`badge ${b.earned ? "" : "locked"}`}>
            <div className="emoji">{b.earned ? b.icon : "🔒"}</div>
            <div className="label">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Мои интересы</div>
      <div className="chips" style={{ flexWrap: "wrap", overflow: "visible" }}>
        {myInterests.map((i) => (
          <span key={i.id} className="chip active">
            {i.emoji} {i.label}
          </span>
        ))}
      </div>

      {registered.length > 0 && (
        <>
          <div className="section-title">Я иду на события</div>
          {EVENTS.filter((e) => registered.includes(e.id)).map((e) => (
            <div className="card" key={e.id} style={{ padding: "12px 16px" }}>
              <div className="event-title" style={{ margin: 0, fontSize: 15 }}>
                {e.title}
              </div>
              <div className="event-meta" style={{ margin: "6px 0 0" }}>
                <span>🕒 {e.time}</span>
                <span>📍 {e.place}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {joined.length > 0 && (
        <>
          <div className="section-title">Мои сообщества</div>
          {COMMUNITIES.filter((c) => joined.includes(c.id)).map((c) => (
            <div className="card" key={c.id} style={{ padding: "12px 16px" }}>
              <div className="event-title" style={{ margin: 0, fontSize: 15 }}>
                {c.name}
              </div>
              <div className="members" style={{ marginTop: 4 }}>
                💬 {c.lastMsg}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
