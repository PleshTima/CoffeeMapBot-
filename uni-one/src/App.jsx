import { useEffect, useRef, useState } from "react";
import Icon from "./components/Icon";
import SmartImg from "./components/SmartImg";
import StatusBar from "./components/StatusBar";
import PushScreen from "./components/PushScreen";
import Onboarding from "./components/Onboarding";
import Discover from "./components/Discover";
import Events from "./components/Events";
import Messages from "./components/Messages";
import ChatThread from "./components/ChatThread";
import EventChat from "./components/EventChat";
import Profile from "./components/Profile";
import EventDetail from "./components/EventDetail";
import PersonDetail from "./components/PersonDetail";
import Notifications from "./components/Notifications";
import Contacts from "./components/Contacts";
import EventPicker from "./components/EventPicker";
import { ME, PEOPLE, CONTACTS, CIRCLES, eventById } from "./data";

const STORAGE_KEY = "uni-one-v7";

const seedPerson = (p, isNew) => ({
  id: p.id,
  name: p.name,
  age: p.age,
  faculty: p.faculty,
  course: p.course,
  photo: p.photo,
  bio: p.bio,
  interests: p.interests,
  distance: p.distance,
  events: p.events,
  isNew,
});
const SEED_MATCHES = PEOPLE.filter((p) => p.likesYou).map((p) => seedPerson(p, false));

const TABS = [
  { id: "discover", label: "Главная", icon: "home" },
  { id: "events", label: "Мероприятия", icon: "calendar" },
  { id: "messages", label: "Сообщения", icon: "chat" },
  { id: "profile", label: "Профиль", icon: "user" },
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
      onboarded: false,
      interests: [],
      going: [],
      added: [],
      matches: SEED_MATCHES,
      stats: ME.stats,
      circles: {},
      folders: [],
      xp: 60,
      joinedGroups: [],
    };
  });

  const [tab, setTab] = useState("discover");
  const [stack, setStack] = useState([]);
  const [matchPopup, setMatchPopup] = useState(null);
  const [invitePerson, setInvitePerson] = useState(null);
  const [toast, setToast] = useState(null);
  const keyRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const contacts = CONTACTS.map((c) => ({
    ...c,
    circle: state.circles[c.id] || c.circle,
  }));

  // ===== Навигационный стек =====
  const push = (screen) =>
    setStack((s) => [...s, { ...screen, key: ++keyRef.current, closing: false }]);
  const pop = () =>
    setStack((s) =>
      s.map((x, i) => (i === s.length - 1 ? { ...x, closing: true } : x))
    );
  const removeByKey = (key) => setStack((s) => s.filter((x) => x.key !== key));

  // ===== Действия =====
  const finishOnboarding = (interests) =>
    setState((s) => ({ ...s, onboarded: true, interests }));

  const toggleInterest = (id) =>
    setState((s) => ({
      ...s,
      interests: s.interests.includes(id)
        ? s.interests.filter((x) => x !== id)
        : [...s.interests, id],
    }));

  const registerMatch = (person, popup = true) => {
    setState((s) =>
      s.matches.some((m) => m.id === person.id)
        ? s
        : {
            ...s,
            matches: [seedPerson(person, true), ...s.matches],
            stats: { ...s.stats, matches: s.stats.matches + 1 },
          }
    );
    if (popup) setMatchPopup(person);
  };

  const onDecision = (dir, person) => {
    if (dir !== "like") return;
    if (person.likesYou) registerMatch(person);
    else showToast("❤️ Лайк отправлен");
  };

  const toggleEvent = (id) => {
    const has = state.going.includes(id);
    setState((s) => ({
      ...s,
      going: has ? s.going.filter((x) => x !== id) : [...s.going, id],
      xp: has ? s.xp : s.xp + 25,
    }));
    if (!has) showToast("🎟️ Записались! +25 XP");
  };

  const toggleGroup = (gid) => {
    const has = state.joinedGroups.includes(gid);
    setState((s) => ({
      ...s,
      joinedGroups: has
        ? s.joinedGroups.filter((x) => x !== gid)
        : [...s.joinedGroups, gid],
      xp: has ? s.xp : s.xp + 10,
    }));
    if (!has) showToast("👥 Вы в компании! +10 XP");
  };

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

  const setCircle = (id, circle) =>
    setState((s) => ({ ...s, circles: { ...s.circles, [id]: circle } }));
  const createFolder = (name, addId) =>
    setState((s) => ({
      ...s,
      folders: [
        ...s.folders,
        { id: `f${Date.now()}`, name, memberIds: addId ? [addId] : [] },
      ],
    }));
  const toggleFolderMember = (folderId, contactId) =>
    setState((s) => ({
      ...s,
      folders: s.folders.map((f) =>
        f.id !== folderId
          ? f
          : {
              ...f,
              memberIds: f.memberIds.includes(contactId)
                ? f.memberIds.filter((x) => x !== contactId)
                : [...f.memberIds, contactId],
            }
      ),
    }));

  const openChat = (chat) => push({ type: "chat", data: chat });
  const openEventChat = (event) => push({ type: "eventchat", data: event });
  const openPerson = (person) => push({ type: "person", data: person });
  const openEvent = (event) => push({ type: "event", data: event });
  const openContacts = () => push({ type: "contacts" });

  const createGroup = (event) => {
    showToast(`Компания на «${event.title}» создана 🎉`);
    openEventChat(event);
  };

  const pickInviteEvent = (event) => {
    const p = invitePerson;
    setInvitePerson(null);
    if (!p) return;
    registerMatch(p, false);
    openChat({ id: p.id, name: p.name, photo: p.photo, invite: event });
    showToast(`🎟️ Приглашение для ${p.name} отправлено`);
  };

  const goingEvents = state.going.map(eventById).filter(Boolean);
  const hasNew = state.matches.some((m) => m.isNew);
  const circleSummary = CIRCLES.map(
    (c) => `${c.icon} ${contacts.filter((x) => x.circle === c.id).length}`
  ).join("   ");

  // ===== Рендер push-экрана =====
  const renderPush = (item) => {
    switch (item.type) {
      case "event":
        return (
          <EventDetail
            event={item.data}
            going={state.going.includes(item.data.id)}
            onToggle={toggleEvent}
            onBack={pop}
            onOpenChat={openEventChat}
            onOpenPerson={openPerson}
            onJoinGroup={toggleGroup}
            onCreateGroup={createGroup}
            joinedGroups={state.joinedGroups}
          />
        );
      case "eventchat":
        return <EventChat event={item.data} onBack={pop} />;
      case "person": {
        const matched = state.matches.some((m) => m.id === item.data.id);
        return (
          <PersonDetail
            person={item.data}
            going={state.going}
            onBack={pop}
            onLike={
              matched
                ? undefined
                : item.data.likesYou
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
            onInvite={(p) => {
              pop();
              setInvitePerson(p);
            }}
            onOpenEvent={openEvent}
          />
        );
      }
      case "chat":
        return <ChatThread chat={item.data} onBack={pop} />;
      case "notifications":
        return (
          <Notifications
            matches={state.matches}
            going={state.going}
            onBack={pop}
            onOpenMatch={(p) => {
              pop();
              openPerson(p);
            }}
            onOpenEvent={(e) => {
              pop();
              openEvent(e);
            }}
          />
        );
      case "contacts":
        return (
          <Contacts
            contacts={contacts}
            folders={state.folders}
            onSetCircle={setCircle}
            onCreateFolder={createFolder}
            onToggleFolderMember={toggleFolderMember}
            onOpenPerson={openPerson}
            onBack={pop}
          />
        );
      case "profile":
        return (
          <Profile
            stats={state.stats}
            goingEvents={goingEvents}
            xp={state.xp}
            interests={state.interests}
            onToggleInterest={toggleInterest}
            circleSummary={circleSummary}
            onOpenContacts={openContacts}
            onBack={pop}
            onOpenEvent={openEvent}
          />
        );
      default:
        return null;
    }
  };

  if (!state.onboarded) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <div className="stage">
      <div className="phone">
        <StatusBar />

        {tab === "discover" && (
          <Discover
            onProfile={() => setTab("profile")}
            onDecision={onDecision}
            onOpen={openPerson}
            onInvite={setInvitePerson}
            going={state.going}
          />
        )}
        {tab === "events" && (
          <Events
            going={state.going}
            onToggle={toggleEvent}
            onOpen={openEvent}
            contacts={contacts}
          />
        )}
        {tab === "messages" && (
          <Messages
            matches={state.matches}
            onOpenMatch={openPerson}
            onOpenChat={openChat}
            added={state.added}
            onAdd={addFriend}
            onBell={() => push({ type: "notifications" })}
            hasNew={hasNew}
          />
        )}
        {tab === "profile" && (
          <Profile
            stats={state.stats}
            goingEvents={goingEvents}
            xp={state.xp}
            interests={state.interests}
            onToggleInterest={toggleInterest}
            circleSummary={circleSummary}
            onOpenContacts={openContacts}
            onOpenEvent={openEvent}
          />
        )}

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

        {invitePerson && (
          <EventPicker
            personName={invitePerson.name}
            onPick={pickInviteEvent}
            onClose={() => setInvitePerson(null)}
          />
        )}

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
              onClick={() => setTab(t.id)}
            >
              <Icon name={t.icon} size={24} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
