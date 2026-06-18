import { useState } from "react";
import { ONB_INTERESTS, EVENTS, banner } from "../data";
import SmartImg from "./SmartImg";

// Онбординг первокурсника: приветствие + выбор интересов + что на неделе.
export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]);
  const weekly = EVENTS.filter((e) => e.today || e.badge).slice(0, 3);

  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="stage">
      <div className="phone">
        <div className="onb">
          <div className="onb-hero">
            <div className="plane">✈️</div>
            <h1>
              Подружимся<span className="dot">?</span>
            </h1>
            <p>Знакомства и события университета в одном месте</p>
          </div>

          {step === 0 && (
            <>
              <div className="onb-title">Привет! Ты только поступил? 👋</div>
              <div className="onb-sub">
                Покажем, что интересного происходит уже на этой неделе, и
                поможем найти своих по интересам — ещё до первой пары.
              </div>

              <div className="onb-week">
                {weekly.map((e) => (
                  <div className="onb-week-card" key={e.id}>
                    <SmartImg src={banner(e.seed)} alt={e.title} />
                    <div className="scrim" />
                    <div className="onb-week-info">
                      <span className="onb-week-when">
                        {e.date} · {e.time}
                      </span>
                      <span className="onb-week-title">{e.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="onb-footer">
                <button className="btn-onb" onClick={() => setStep(1)}>
                  Поехали →
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="onb-title">Что тебе интересно?</div>
              <div className="onb-sub">
                Выбери хотя бы 3 — подберём события и людей, где ты найдёшь
                «своих».
              </div>

              <div className="onb-interests">
                {ONB_INTERESTS.map((it) => {
                  const sel = picked.includes(it.id);
                  return (
                    <button
                      key={it.id}
                      className={`onb-chip ${sel ? "sel" : ""}`}
                      onClick={() => toggle(it.id)}
                    >
                      <span>{it.emoji}</span> {it.label}
                      {sel && <span className="ok">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="onb-footer">
                <div className="onb-count">
                  {picked.length < 3
                    ? `Выбери ещё ${3 - picked.length}`
                    : `Отлично, выбрано: ${picked.length} 🎯`}
                </div>
                <button
                  className="btn-onb"
                  disabled={picked.length < 3}
                  style={{ opacity: picked.length < 3 ? 0.5 : 1 }}
                  onClick={() => setStep(2)}
                >
                  Далее →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="onb-title">Как тут всё устроено 🧭</div>
              <div className="onb-sub">
                Коротко о главном — а дальше разберёшься по ходу.
              </div>

              <div className="tour">
                {TOUR.map((t) => (
                  <div className="tour-row" key={t.title}>
                    <div className="tour-ic">{t.icon}</div>
                    <div>
                      <div className="tour-title">{t.title}</div>
                      <div className="tour-sub">{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="onb-footer">
                <button className="btn-onb" onClick={() => onFinish(picked)}>
                  Понятно, начать! 🚀
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const TOUR = [
  { icon: "🔥", title: "Свайпай знакомства", sub: "Листай влево/вправо или жми ✕ и ❤. Взаимный лайк — это мэтч." },
  { icon: "⭐", title: "Зови на мероприятие", sub: "Звёздочка на свайпе и в чате — пригласить пойти вместе." },
  { icon: "🎟️", title: "Мероприятия", sub: "Фильтры, AI-поиск, запись в один клик и групповой чат события." },
  { icon: "👥", title: "Круг общения", sub: "Дели людей на друзей/приятелей/знакомых и свои папки." },
  { icon: "🏆", title: "Достижения", sub: "Получай XP и бейджи за активность и новые знакомства." },
];
