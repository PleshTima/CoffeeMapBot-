import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { ME } from "../data";

const INTEREST_ICON = {
  Программирование: "</>",
  Кино: "🎬",
  Спорт: "🏋",
  Музыка: "🎵",
};

// Экран «Профиль».
export default function Profile({ stats, onBack }) {
  const s = stats || ME.stats;
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
      </div>
      <div className="interest-chips">
        {ME.interests.map((it) => (
          <span className="chip-orange" key={it}>
            <span>{INTEREST_ICON[it] || "•"}</span>
            {it}
          </span>
        ))}
      </div>

      <button className="btn-edit">
        <Icon name="edit" size={20} /> Редактировать профиль
      </button>
    </div>
  );
}
