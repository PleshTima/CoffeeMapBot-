import { useEffect, useRef, useState } from "react";
import Icon from "./components/Icon";
import SmartImg from "./components/SmartImg";
import StatusBar from "./components/StatusBar";
import PushScreen from "./components/PushScreen";
import Discover from "./components/Discover";
import Events from "./components/Events";
import Matches from "./components/Matches";
import Messages from "./components/Messages";
import ChatThread from "./components/ChatThread";
import Profile from "./components/Profile";
import EventDetail from "./components/EventDetail";
import PersonDetail from "./components/PersonDetail";
import Notifications from "./components/Notifications";
import { ME, PEOPLE } from "./data";

const STORAGE_KEY = "uni-one-v3";

// Стартовые пары (взаимные лайки) — чтобы экран «Пары» не был пустым.
const SEED_MATCHES = PEOPLE.filter((p) => p.likesYou).map((p) => ({
  id: p.id,
  name: p.name,
  age: p.age,
  faculty: p.faculty,
  course: p.course,
  photo: p.photo,
  bio: p.bio,
  interests: p.interests,
  distance: p.distance,
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
    return { going: [], added: [], matches: SEED_MATCHES, stats: ME.stats };
  });

  const [tab, setTab] = useState("discover");
  const [stack, setStack] = useState([]); // навигационный стек push-экранов
  const [matchPopup, setMatchPopup] = useState(null);
  const [toast, setToast] = useState(null);
  const keyRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // ===== Навигационный стек =====
  const push = (screen) =>
    setStack((s) => [...s, { ...screen, key: ++keyRef.current, closing: false }]);
  const pop = () =>
    setStack((s) =>
      s.map((x, i) => (i === s.length - 1 ? { ...x, closing: true } : x))
    );
  const removeByKey = (key) =>
    setStack((s) => s.filter((x) => x.key !== key));

  // ===== Действия =====
  const registerMatch = (person) => {
    setState((s) => ({
      ...s,
      matches: [
        {
          id: person.id,
          name: person.name,
          age: person.age,
          faculty: person.faculty,
          course: person.course,
          photo: person.photo,
          bio: person.bio,
          interests: person.interests,
          distance: person.distance,
          isNew: true,
        },
        ...s.matches.filter((m) => m.id !== person.id),
      ],
      stats: { ...s.stats, matches: s.stats.matches + 1 },
    }));
    setMatchPopup(person);
  };

  const onDecision = (dir, person) => {
    if (dir !== "like") return;
    if (person.likesYou) registerMatch(person);
    else showToast("❤️ Лайк отправлен");
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
        : {
            ...s,
            added: [...s.added, id],
            stats: { ...s.stats, friends: s.stats.friends + 1 },
          }
    );

  const openChat = (chat) => push({ type: "chat", data: chat });

  // ===== Рендер push-экрана по типу =====
  const renderPush = (item) => {
    switch (item.type) {
      case "event":
        return (
          <EventDetail
            event={item.data}
            going={state.going.includes(item.data.id)}
            onToggle={toggleEvent}
            onBack={pop}
          />
        );
      case "person":
        return (
          <PersonDetail
            person={item.data}
            onBack={pop}
            onLike={
              item.data.likesYou
                ? (p) => {
                    pop();
                    registerMatch(p);
                  }
                : () => {
                    pop();
                    showToast("❤️ Лайк отправлен");
                  }
            }
            onMessage={(p) => {
              pop();
              openChat({ id: p.id, name: p.name, photo: p.photo });
            }}
          />
        );
      case "chat":
        return <ChatThread chat={item.data} onBack={pop} />;
      case "notifications":
        return <Notifications onBack={pop} />;
      case "profile":
        return <Profile stats={state.stats} onBack={pop} />;
      default:
        return null;
    }
  };

  return (
    <div className="stage">
      <div className="phone">
        <StatusBar />

        {tab === "discover" && (
          <Discover
            onProfile={() => push({ type: "profile" })}
            onDecision={onDecision}
            onOpen={(p) => push({ type: "person", data: p })}
          />
        )}
        {tab === "events" && (
          <Events
            going={state.going}
            onToggle={toggleEvent}
            onOpen={(e) => push({ type: "event", data: e })}
            onBell={() => push({ type: "notifications" })}
          />
        )}
        {tab === "matches" && (
          <Matches
            matches={state.matches}
            onMessage={(m) => openChat({ id: m.id, name: m.name, photo: m.photo })}
            onOpen={(m) => push({ type: "person", data: m })}
          />
        )}
        {tab === "messages" && (
          <Messages onOpenChat={openChat} added={state.added} onAdd={addFriend} />
        )}
        {tab === "profile" && <Profile stats={state.stats} />}

        {/* Push-экраны поверх вкладок */}
        {stack.map((item) => (
          <PushScreen
            key={item.key}
            closing={item.closing}
            onExited={() => removeByKey(item.key)}
          >
            {renderPush(item)}
          </PushScreen>
        ))}

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
                const c = {
                  id: matchPopup.id,
                  name: matchPopup.name,
                  photo: matchPopup.photo,
                };
                setMatchPopup(null);
                openChat(c);
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
              onClick={() => {
                setTab(t.id);
              }}
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
    </div>
  );
}
