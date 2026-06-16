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
              Uni<span className="dot">·</span>one
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
                  onClick={() => onFinish(picked)}
                >
                  Открыть Uni-one
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
