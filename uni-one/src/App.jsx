import { useEffect, useState } from "react";
import Onboarding from "./components/Onboarding";
import Afisha from "./components/Afisha";
import Communities from "./components/Communities";
import Profile from "./components/Profile";
import { INITIAL_USER, LEVELS } from "./data";

const STORAGE_KEY = "uni-one-state";

const TABS = [
  { id: "afisha", label: "Афиша", icon: "📅" },
  { id: "communities", label: "Сообщества", icon: "🤝" },
  { id: "profile", label: "Профиль", icon: "👤" },
];

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore corrupted storage */
    }
    return {
      onboarded: false,
      user: INITIAL_USER,
      registered: [],
      joined: [],
    };
  });

  const [tab, setTab] = useState("afisha");
  const [toast, setToast] = useState(null);

  // Сохраняем прогресс между перезагрузками (прототип без бэкенда).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // Начисление XP с авто-апгрейдом уровня и выдачей ачивок.
  const award = (user, xpDelta, badgeId) => {
    let xp = Math.max(0, user.xp + xpDelta);
    let level = user.level;
    while (level < LEVELS.length && xp >= LEVELS[level]) level++;
    const badges = user.badges.map((b) =>
      b.id === badgeId ? { ...b, earned: true } : b
    );
    return { ...user, xp, level, badges };
  };

  const finishOnboarding = (interests) => {
    setState((s) => ({
      ...s,
      onboarded: true,
      user: { ...s.user, interests },
    }));
  };

  const toggleRegister = (eventId) => {
    setState((s) => {
      const has = s.registered.includes(eventId);
      const registered = has
        ? s.registered.filter((id) => id !== eventId)
        : [...s.registered, eventId];
      let user = s.user;
      if (!has) {
        user = award(user, 30, "b_first_event");
        if (registered.length >= 3) user = award(user, 0, "b_streak");
        showToast("🎟️ Запись подтверждена! +30 XP");
      }
      return { ...s, registered, user };
    });
  };

  const toggleJoin = (communityId) => {
    setState((s) => {
      const has = s.joined.includes(communityId);
      const joined = has
        ? s.joined.filter((id) => id !== communityId)
        : [...s.joined, communityId];
      let user = s.user;
      if (!has) {
        user = award(user, 20, "b_community");
        showToast("🤝 Добро пожаловать в сообщество! +20 XP");
      }
      return { ...s, joined, user };
    });
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      onboarded: false,
      user: INITIAL_USER,
      registered: [],
      joined: [],
    });
    setTab("afisha");
  };

  if (!state.onboarded) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <div className="phone">
      <div className="appbar">
        <div className="appbar-row">
          <div>
            <div className="brand">
              Uni<span className="dot">·</span>one
            </div>
            <div className="subtitle">социализация студентов</div>
          </div>
          <div
            className="xp-chip"
            onClick={resetDemo}
            title="Сбросить демо"
            style={{ cursor: "pointer" }}
          >
            ⚡ {state.user.xp} XP · ур. {state.user.level}
          </div>
        </div>
      </div>

      {tab === "afisha" && (
        <Afisha
          user={state.user}
          registered={state.registered}
          onRegister={toggleRegister}
        />
      )}
      {tab === "communities" && (
        <Communities
          user={state.user}
          joined={state.joined}
          onJoin={toggleJoin}
        />
      )}
      {tab === "profile" && (
        <Profile
          user={state.user}
          registered={state.registered}
          joined={state.joined}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="ico">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
