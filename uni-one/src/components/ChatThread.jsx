import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import { THREAD } from "../data";

// Экран открытого диалога.
export default function ChatThread({ chat, onBack }) {
  const [messages, setMessages] = useState(
    () => THREAD[chat.id] || [{ from: "them", text: "Привет! 👋", time: "сейчас" }]
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
    // Авто-ответ для оживления демо
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "them", text: "Звучит здорово! 😊", time: "сейчас" },
      ]);
    }, 900);
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
        {messages.map((m, i) => (
          <div className={`bubble ${m.from}`} key={i}>
            {m.text}
            <span className="t">{m.time}</span>
          </div>
        ))}
      </div>

      <div className="thread-input">
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
    </div>
  );
}
