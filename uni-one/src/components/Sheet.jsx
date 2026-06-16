import { useEffect, useState } from "react";

// Нижняя «шторка» (bottom sheet) с анимацией выезда снизу.
export default function Sheet({ title, onClose, children }) {
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => setClosing(true);

  return (
    <div
      className={`sheet-backdrop ${entered && !closing ? "show" : ""}`}
      onClick={close}
    >
      <div
        className={`sheet ${entered && !closing ? "up" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          if (closing && e.propertyName === "transform") onClose();
        }}
      >
        <div className="sheet-grip" />
        {title && <div className="sheet-title">{title}</div>}
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
