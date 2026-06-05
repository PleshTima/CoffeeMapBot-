import { useEffect, useState } from "react";
import Icon from "./components/Icon";
import SmartImg from "./components/SmartImg";
import Discover from "./components/Discover";
import Events from "./components/Events";
import Matches from "./components/Matches";
import Messages from "./components/Messages";
import ChatThread from "./components/ChatThread";
import Profile from "./components/Profile";
import { ME, PEOPLE } from "./data";

const STORAGE_KEY = "uni-one-v2";

// Стартовые пары (взаимные лайки) — чтобы экран «Пары» не был пустым.
const SEED_MATCHES = PEOPLE.filter((p) => p.likesYou).map((p) => ({
  id: p.id,
  name: p.name,
  age: p.age,
  faculty: p.faculty,
  photo: p.photo,
  isNew: false,
}));

const TABS = [
  { id: "discover", label: "Главная", icon: "home" },
  { id: "events", label: "Мероприятия", icon: "calendar" },
  { id: "matches", label: "Пары", icon: "heart" },
  { id: "messages", label: "Сообщения", icon: "chat" },
];

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return {
      going: [],
      added: [],
      matches: SEED_MATCHES,
      stats: ME.stats,
    };
  });

  const [tab, setTab] = useState("discover");
  const [chat, setChat] = useState(null);
  const [matchPopup, setMatchPopup] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Решение по свайпу
  const onDecision = (dir, person) => {
    if (dir !== "like") return;
    if (person.likesYou) {
      setState((s) => ({
        ...s,
        matches: [
          { id: person.id, name: person.name, age: person.age, faculty: person.faculty, photo: person.photo, isNew: true },
          ...s.matches.filter((m) => m.id !== person.id),
        ],
        stats: { ...s.stats, matches: s.stats.matches + 1 },
      }));
      setMatchPopup(person);
    } else {
      showToast("❤️ Лайк отправлен");
    }
  };

  const toggleEvent = (id) =>
    setState((s) => ({
      ...s,
      going: s.going.includes(id)
        ? s.going.filter((x) => x !== id)
        : [...s.going, id],
    }));

  const addFriend = (id) =>
    setState((s) =>
      s.added.includes(id)
        ? s
        : { ...s, added: [...s.added, id], stats: { ...s.stats, friends: s.stats.friends + 1 } }
    );

  // Полноэкранный чат поверх всего
  if (chat) {
    return <ChatThread chat={chat} onBack={() => setChat(null)} />;
  }

  return (
    <div className="phone">
      {tab === "discover" && (
        <Discover onProfile={() => setTab("profile")} onDecision={onDecision} />
      )}
      {tab === "events" && (
        <Events going={state.going} onToggle={toggleEvent} />
      )}
      {tab === "matches" && (
        <Matches matches={state.matches} onMessage={setChat} />
      )}
      {tab === "messages" && (
        <Messages
          onOpenChat={setChat}
          added={state.added}
          onAdd={addFriend}
        />
      )}
      {tab === "profile" && <Profile stats={state.stats} />}

      {toast && <div className="toast">{toast}</div>}

      {matchPopup && (
        <div className="match-overlay">
          <div className="match-title">Это мэтч! 🎉</div>
          <div className="match-sub">
            Вы с {matchPopup.name} понравились друг другу
          </div>
          <div className="match-faces">
            <SmartImg className="mf" src={ME.photo} alt="Вы" />
            <SmartImg className="mf" src={matchPopup.photo} alt={matchPopup.name} />
          </div>
          <button
            className="btn-rsvp"
            onClick={() => {
              const c = { id: matchPopup.id, name: matchPopup.name, photo: matchPopup.photo };
              setMatchPopup(null);
              setChat(c);
            }}
          >
            Написать сообщение
          </button>
          <button className="ghost" onClick={() => setMatchPopup(null)}>
            Продолжить свайпать
          </button>
        </div>
      )}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon
              name={tab === t.id && t.id === "matches" ? "heartFill" : t.icon}
              size={24}
            />
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
