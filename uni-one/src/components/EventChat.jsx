import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { EVENT_THREAD, goingContacts } from "../data";

// Групповой чат мероприятия — знакомимся до встречи.
export default function EventChat({ event, onBack }) {
  const people = goingContacts(event.id);
  const [messages, setMessages] = useState(
    () => EVENT_THREAD[event.id]?.slice() || []
  );
  const [text, setText] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "me", text: t, time: "сейчас" }]);
    setText("");
    const who = people[Math.floor(Math.random() * people.length)];
    if (who)
      setTimeout(
        () =>
          setMessages((m) => [
            ...m,
            { from: who.name, photo: who.photo, text: "О, отлично! Тоже буду 🙌", time: "сейчас" },
          ]),
        1000
      );
  };

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="icon-btn" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={24} />
        </button>
        <div className="ev-chat-ava">💬</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="thread-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {event.title}
          </div>
          <div className="thread-status" style={{ color: "var(--muted)" }}>
            {event.going} идут · групповой чат
          </div>
        </div>
      </div>

      <div className="thread-body" ref={bodyRef}>
        <div className="ev-chat-note">
          🎟️ Чат участников «{event.title}». Познакомьтесь до встречи!
        </div>
        {messages.map((m, i) =>
          m.from === "me" ? (
            <div className="bubble me" key={i}>
              {m.text}
              <span className="t">{m.time}</span>
            </div>
          ) : (
            <div className="group-msg" key={i}>
              <SmartImg className="gm-ava" src={m.photo} alt={m.from} />
              <div>
                <div className="gm-name">{m.from}</div>
                <div className="bubble them">
                  {m.text}
                  <span className="t">{m.time}</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="thread-input">
        <input
          placeholder="Написать участникам…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="send-btn" onClick={send} aria-label="Отправить">
          <Icon name="send" size={20} />
        </button>
      </div>
    </div>
  );
}
