import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import EventPicker from "./EventPicker";
import { THREAD, banner, catIcon, catLabel } from "../data";

// Экран открытого диалога + уникальная фича «позвать на мероприятие».
export default function ChatThread({ chat, onBack }) {
  const [messages, setMessages] = useState(() => {
    const base = THREAD[chat.id]
      ? [...THREAD[chat.id]]
      : [{ from: "them", text: "Привет! 👋", time: "сейчас" }];
    if (chat.invite)
      base.push({ from: "me", type: "invite", event: chat.invite, time: "сейчас" });
    return base;
  });
  const [text, setText] = useState("");
  const [picking, setPicking] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages, picking]);

  const reply = (msg, delay = 900) =>
    setTimeout(() => setMessages((m) => [...m, msg]), delay);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "me", text: t, time: "сейчас" }]);
    setText("");
    reply({ from: "them", text: "Звучит здорово! 😊", time: "сейчас" });
  };

  const sendInvite = (event) => {
    setPicking(false);
    setMessages((m) => [...m, { from: "me", type: "invite", event, time: "сейчас" }]);
    reply({ from: "them", text: "С удовольствием, давай сходим! 🎉", time: "сейчас" }, 1100);
  };

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="icon-btn" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={24} />
        </button>
        <SmartImg src={chat.photo} alt={chat.name} />
        <div>
          <div className="thread-name">{chat.name}</div>
          <div className="thread-status">в сети</div>
        </div>
      </div>

      <div className="thread-body" ref={bodyRef}>
        {messages.map((m, i) =>
          m.type === "invite" ? (
            <div className={`invite-bubble ${m.from}`} key={i}>
              <div className="invite-head">🎟️ Приглашение на мероприятие</div>
              <div className="invite-card">
                <SmartImg src={banner(m.event.seed)} alt={m.event.title} />
                <div className="invite-info">
                  <div className="invite-title">{m.event.title}</div>
                  <div className="invite-meta">
                    {catIcon(m.event.category)} {catLabel(m.event.category)} ·{" "}
                    {m.event.date} · {m.event.time}
                  </div>
                </div>
              </div>
              <div className="invite-text">Пойдём вместе? 💫</div>
              <span className="t">{m.time}</span>
            </div>
          ) : (
            <div className={`bubble ${m.from}`} key={i}>
              {m.text}
              <span className="t">{m.time}</span>
            </div>
          )
        )}
      </div>

      <div className="thread-input">
        <button
          className="star-btn"
          onClick={() => setPicking(true)}
          aria-label="Позвать на мероприятие"
        >
          <Icon name="star" size={20} />
        </button>
        <input
          placeholder="Сообщение…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="send-btn" onClick={send} aria-label="Отправить">
          <Icon name="send" size={20} />
        </button>
      </div>

      {picking && (
        <EventPicker
          personName={chat.name}
          onPick={sendInvite}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}
