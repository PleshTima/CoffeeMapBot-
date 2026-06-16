// Набор линейных иконок (SVG) в стиле макетов.
const paths = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />,
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="3" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-7.5-4.8-9.7-9.2C.9 8.4 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4 3.2 0 4.6 3.4 3.2 6.3C19.5 15.7 12 20.5 12 20.5Z" />
  ),
  heartFill: (
    <path
      d="M12 20.5s-7.5-4.8-9.7-9.2C.9 8.4 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4 3.2 0 4.6 3.4 3.2 6.3C19.5 15.7 12 20.5 12 20.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  chat: <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </>
  ),
  flame: (
    <path
      d="M12 2c1 3-2 4-2 7 0 1.5 1 2.5 2 2.5S16 11 15 8c2 1.5 4 4 4 7a7 7 0 0 1-14 0c0-3 2-5 3-7 .5 2 2 2.5 2 1 0-2-1-3 0-5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  star: (
    <path
      d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  sparkles: (
    <path
      d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3ZM19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9L19 14Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M21 20c0-2.6-1.5-4.6-4-5.2" />
    </>
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  back: <path d="M15 18l-6-6 6-6" />,
  edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />,
  "plus-folder": (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M12 11v5M9.5 13.5h5" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export default function Icon({ name, size = 24, stroke = 2, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
