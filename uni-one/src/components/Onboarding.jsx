import { useState } from "react";
import { INTERESTS } from "../data";

// Онбординг первокурсника: «Ты только что поступил?» + выбор интересов
// для поиска «своих» (снижение социального барьера из презентации).
export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]);

  const toggle = (id) =>
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  return (
    <div className="onb">
      <div className="onb-hero">
        <span className="blob" style={{ width: 120, height: 120, top: -30, left: -30 }} />
        <span className="blob" style={{ width: 80, height: 80, bottom: -20, right: 20 }} />
        <div className="plane">✈️</div>
        <h1>
          Uni<span className="dot">·</span>one
        </h1>
        <p>Вся внеучебная жизнь университета — в одном месте</p>
      </div>

      {step === 0 && (
        <>
          <div className="onb-step-title">Привет! Ты только поступил? 👋</div>
          <div className="onb-step-sub">
            Никого не нужно искать и спрашивать. Покажем, что интересного
            происходит уже на этой неделе, и поможем найти своих по интересам —
            ещё до первой встречи в аудитории.
          </div>

          <div className="newbie-banner" style={{ marginTop: 8 }}>
            <span className="spark">🎉</span>
            <h3>Что внутри</h3>
            <p>
              📅 Афиша всех событий и кружков
              <br />
              🤝 Сообщества по интересам и чаты
              <br />
              🏆 Достижения за активность в универе
            </p>
          </div>

          <div className="onb-footer">
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Поехали →
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div className="onb-step-title">Что тебе интересно?</div>
          <div className="onb-step-sub">
            Выбери хотя бы 3 — подберём события и сообщества, где ты найдёшь
            «своих».
          </div>

          <div className="interests-grid">
            {INTERESTS.map((it) => {
              const sel = picked.includes(it.id);
              return (
                <button
                  key={it.id}
                  className={`interest ${sel ? "selected" : ""}`}
                  onClick={() => toggle(it.id)}
                >
                  <span style={{ fontSize: 20 }}>{it.emoji}</span>
                  {it.label}
                  {sel && <span className="check">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="onb-footer">
            <div className="onb-count">
              {picked.length < 3
                ? `Выбери ещё ${3 - picked.length}`
                : `Выбрано: ${picked.length} 🎯`}
            </div>
            <button
              className="btn btn-primary"
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
  );
}
