import { useEffect, useState } from "react";

// Контейнер push-экрана: въезжает справа, по закрытию уезжает обратно.
export default function PushScreen({ closing, onExited, children }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cls = `push ${closing ? "closing" : entered ? "entered" : ""}`;

  return (
    <div
      className={cls}
      onTransitionEnd={(e) => {
        if (closing && e.propertyName === "transform") onExited?.();
      }}
    >
      {children}
    </div>
  );
}
