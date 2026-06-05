// Имитация статус-бара iPhone (время, сеть, батарея) — для макета.
export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.5c2.6 0 5 1 6.8 2.7l1.2-1.3A11 11 0 0 0 8.5.5 11 11 0 0 0 .5 3.9l1.2 1.3A9.5 9.5 0 0 1 8.5 2.5Z" />
          <path d="M8.5 6c1.5 0 2.9.6 3.9 1.6l1.2-1.3A7.4 7.4 0 0 0 8.5 4a7.4 7.4 0 0 0-5.1 2.3l1.2 1.3A5.4 5.4 0 0 1 8.5 6Z" />
          <path d="M8.5 9.4 10.6 7A3 3 0 0 0 8.5 6 3 3 0 0 0 6.4 7l2.1 2.4Z" />
        </svg>
        <span className="sb-bat">
          <i />
        </span>
      </span>
    </div>
  );
}
