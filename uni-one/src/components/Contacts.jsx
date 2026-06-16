import { useState } from "react";
import Icon from "./Icon";
import SmartImg from "./SmartImg";
import Sheet from "./Sheet";
import { CIRCLES, eventById } from "../data";

const ORDER = ["friend", "pal", "acq"];

// Экран «Круг общения»: классификация контактов + свои папки.
export default function Contacts({
  contacts,
  folders,
  onSetCircle,
  onCreateFolder,
  onToggleFolderMember,
  onOpenPerson,
  onBack,
}) {
  const [folderFor, setFolderFor] = useState(null); // контакт, для которого выбираем папку

  const cycleCircle = (c) =>
    onSetCircle(c.id, ORDER[(ORDER.indexOf(c.circle) + 1) % ORDER.length]);

  const createFolder = () => {
    const name = window.prompt("Название папки (например, «Сокомандники»)");
    if (name && name.trim()) onCreateFolder(name.trim());
  };

  const Row = ({ c }) => {
    const circle = CIRCLES.find((x) => x.id === c.circle) || CIRCLES[2];
    const ev = c.events?.length ? eventById(c.events[0]) : null;
    return (
      <div className="contact-row">
        <SmartImg
          className="contact-ava"
          src={c.photo}
          alt={c.name}
          onClick={() => onOpenPerson(c)}
          style={{ cursor: "pointer" }}
        />
        <div className="contact-main" onClick={() => onOpenPerson(c)}>
          <div className="contact-name">
            {c.name}
            {c.age ? `, ${c.age}` : ""}
          </div>
          <div className="contact-sub">
            {ev ? `🎟️ ${ev.title}` : c.faculty}
          </div>
        </div>
        <button
          className="circle-chip"
          style={{ color: circle.color, borderColor: circle.color }}
          onClick={() => cycleCircle(c)}
          title="Сменить круг"
        >
          {circle.icon} {circle.label}
        </button>
        <button
          className="folder-btn"
          onClick={() => setFolderFor(c)}
          aria-label="В папку"
        >
          <Icon name="plus-folder" size={20} />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="detail-head" style={{ background: "var(--elev)" }}>
        <button className="back" onClick={onBack} aria-label="Назад">
          <Icon name="back" size={22} />
        </button>
        <span className="h-title">Круг общения</span>
      </div>

      <div className="detail-scroll" style={{ padding: "0 18px 30px" }}>
        {CIRCLES.map((circle) => {
          const members = contacts.filter((c) => c.circle === circle.id);
          return (
            <div key={circle.id}>
              <div className="circle-head">
                <span>{circle.icon}</span> {circle.label}
                <span className="circle-count">{members.length}</span>
              </div>
              {members.length === 0 ? (
                <div className="muted-row">Пока пусто</div>
              ) : (
                members.map((c) => <Row key={c.id} c={c} />)
              )}
            </div>
          );
        })}

        <div className="circle-head between">
          <span>
            📁 Мои папки <span className="circle-count">{folders.length}</span>
          </span>
          <button className="mini-btn" onClick={createFolder}>
            + Создать
          </button>
        </div>
        {folders.length === 0 ? (
          <div className="muted-row">
            Создайте свою папку, чтобы группировать людей по-своему
          </div>
        ) : (
          folders.map((f) => (
            <div className="folder-card" key={f.id}>
              <div className="folder-top">
                <span className="folder-name">📁 {f.name}</span>
                <span className="circle-count">{f.memberIds.length}</span>
              </div>
              {f.memberIds.length > 0 ? (
                <div className="folder-avatars">
                  {f.memberIds.map((id) => {
                    const c = contacts.find((x) => x.id === id);
                    return c ? (
                      <SmartImg key={id} src={c.photo} alt={c.name} />
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="muted-row" style={{ padding: "6px 0 0" }}>
                  Добавьте людей кнопкой 📁 рядом с контактом
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {folderFor && (
        <Sheet
          title={`Добавить ${folderFor.name} в папку`}
          onClose={() => setFolderFor(null)}
        >
          {folders.length === 0 && (
            <div className="muted-row" style={{ marginBottom: 10 }}>
              Папок пока нет — создайте первую.
            </div>
          )}
          {folders.map((f) => {
            const inside = f.memberIds.includes(folderFor.id);
            return (
              <button
                key={f.id}
                className="folder-pick"
                onClick={() => onToggleFolderMember(f.id, folderFor.id)}
              >
                <span>📁 {f.name}</span>
                <span className={`check ${inside ? "on" : ""}`}>
                  {inside ? "✓" : ""}
                </span>
              </button>
            );
          })}
          <button
            className="folder-pick create"
            onClick={() => {
              const name = window.prompt("Название новой папки");
              if (name && name.trim()) onCreateFolder(name.trim(), folderFor.id);
            }}
          >
            ＋ Новая папка
          </button>
        </Sheet>
      )}
    </>
  );
}
