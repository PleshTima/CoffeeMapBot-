// Uni-one — мок-данные прототипа (дейтинг/нетворкинг для студентов).
// Фото подгружаются с pravatar.cc / picsum.photos — при отсутствии сети
// показывается градиентный фон-заглушка.

export const avatar = (n) => `https://i.pravatar.cc/600?img=${n}`;
export const banner = (seed) =>
  `https://picsum.photos/seed/${seed}/900/600`;

// Текущий пользователь (профиль)
export const ME = {
  name: "Анна Соколова",
  age: 20,
  uni: "МГУ",
  faculty: "ВМК",
  course: "3 курс",
  photo: avatar(47),
  bio: "Люблю решать сложные задачи и искать красивые алгоритмы не только в коде, но и в жизни. Обожаю походы в кино и прогулки по Москве. Всегда за новые знакомства и интересные разговоры!",
  interests: ["Программирование", "Кино", "Спорт", "Музыка"],
  stats: { likes: 124, matches: 38, friends: 12 },
};

// Анкеты для свайпов (экран «Главная»)
export const PEOPLE = [
  {
    id: "p1",
    name: "Максим",
    age: 21,
    faculty: "ВМК",
    course: "3 курс",
    distance: "500 м",
    photo: avatar(12),
    verified: true,
    likesYou: true,
    bio: "Пишу на Python и играю в футбол по выходным. Ищу компанию на хакатоны и вечерний кофе.",
    interests: ["Программирование", "Кофе", "Футбол", "Музыка", "Путешествия", "Кино"],
  },
  {
    id: "p2",
    name: "Лиза",
    age: 19,
    faculty: "Журфак",
    course: "2 курс",
    distance: "1.2 км",
    photo: avatar(45),
    verified: false,
    likesYou: false,
    bio: "Снимаю на плёнку, обожаю старое кино и уютные книжные. Расскажи мне свой любимый фильм.",
    interests: ["Кино", "Фотография", "Литература", "Кофе"],
  },
  {
    id: "p3",
    name: "Игорь",
    age: 22,
    faculty: "Физфак",
    course: "4 курс",
    distance: "300 м",
    photo: avatar(15),
    verified: true,
    likesYou: true,
    bio: "Физик-теоретик, шахматист и меломан. За интеллектуальные споры до утра.",
    interests: ["Наука", "Шахматы", "Музыка", "Спорт"],
  },
  {
    id: "p4",
    name: "Саша",
    age: 20,
    faculty: "Экономфак",
    course: "3 курс",
    distance: "800 м",
    photo: avatar(32),
    verified: false,
    likesYou: false,
    bio: "Запускаю свой стартап и бегаю по утрам. Практикую английский — let's chat!",
    interests: ["Стартапы", "Английский", "Бег", "Кофе"],
  },
  {
    id: "p5",
    name: "Настя",
    age: 19,
    faculty: "Истфак",
    course: "1 курс",
    distance: "2.1 км",
    photo: avatar(20),
    verified: true,
    likesYou: true,
    bio: "Первокурсница, влюблена в искусство и путешествия. Покажи мне любимые места Москвы!",
    interests: ["Искусство", "Путешествия", "Музыка", "Кино"],
  },
  {
    id: "p6",
    name: "Дима",
    age: 23,
    faculty: "Мехмат",
    course: "магистратура",
    distance: "650 м",
    photo: avatar(33),
    verified: false,
    likesYou: false,
    bio: "Математик с гитарой. Катаюсь на велике по набережным и варю отличный кофе.",
    interests: ["Математика", "Гитара", "Велоспорт", "Кофе"],
  },
];

// Мероприятия (экран «Мероприятия»)
export const EVENTS = [
  {
    id: "e1",
    title: "Вечер настолок МГУ",
    badge: "hot",
    date: "7 июня",
    time: "18:00",
    place: "Кампус МГУ, клубная зона",
    going: 42,
    seed: "boardgames",
    today: true,
    online: false,
    attendees: [12, 45, 15],
    desc: "Самый тёплый вечер недели! Манчкин, Каркассон, Codenames и десятки других игр. Приходи один или с друзьями — мы поможем собрать компанию за столом. Чай и печеньки за счёт клуба.",
  },
  {
    id: "e2",
    title: "Хакатон «Цифровой МГУ»",
    badge: "new",
    date: "14 июня",
    time: "10:00",
    place: "Физический факультет МГУ",
    going: 120,
    seed: "hackathon",
    today: false,
    online: false,
    attendees: [32, 33, 20],
    desc: "48 часов, чтобы собрать продукт мечты. Призовой фонд, менторы из IT-компаний и нетворкинг с лучшими студентами. Регистрируйся командой или найди сокомандников прямо здесь.",
  },
  {
    id: "e3",
    title: "Speed Dating МГУ",
    badge: "new",
    date: "21 июня",
    time: "19:00",
    place: "Студенческий центр МГУ",
    going: 61,
    seed: "speeddating",
    today: false,
    online: false,
    attendees: [47, 45, 20],
    desc: "5 минут на знакомство — и дальше решаешь ты. Лёгкий формат, приятная атмосфера и реальный шанс встретить своего человека из соседнего корпуса.",
  },
  {
    id: "e4",
    title: "English Speaking Club",
    badge: null,
    date: "Сегодня",
    time: "19:00",
    place: "Онлайн · Zoom",
    going: 28,
    seed: "english",
    today: true,
    online: true,
    attendees: [15, 12, 32],
    desc: "Разговорный клуб для любого уровня. Обсуждаем кино, путешествия и науку на английском в дружелюбной обстановке. Ссылка на Zoom придёт после записи.",
  },
  {
    id: "e5",
    title: "Кинопоказ под открытым небом",
    badge: "hot",
    date: "9 июня",
    time: "21:30",
    place: "Парк МГУ",
    going: 87,
    seed: "cinema",
    today: false,
    online: false,
    attendees: [20, 33, 45],
    desc: "Большой экран, пледы, попкорн и звёздное небо. В программе — культовая классика. Бери друзей или знакомься с новыми прямо на пледе рядом.",
  },
];

// Диалоги (экран «Сообщения»)
export const CHATS = [
  {
    id: "c1",
    name: "Настя",
    photo: avatar(20),
    last: "Привет! Как прошёл твой день?",
    time: "14:30",
    unread: 2,
    online: true,
  },
  {
    id: "c2",
    name: "Дима",
    photo: avatar(33),
    last: "Ты на лекции по программированию?",
    time: "12:45",
    unread: 1,
    online: true,
  },
  {
    id: "c3",
    name: "Катя",
    photo: avatar(44),
    last: "Спасибо за рекомендации! 🙌",
    time: "11:20",
    unread: 0,
    online: true,
  },
  {
    id: "c4",
    name: "Артём",
    photo: avatar(13),
    last: "Давай завтра после пар?",
    time: "Вчера",
    unread: 3,
    online: false,
  },
];

// Стартовые сообщения в открытом диалоге
export const THREAD = {
  c1: [
    { from: "them", text: "Привет! Как прошёл твой день?", time: "14:30" },
    { from: "me", text: "Привет! Отлично, сдала проект 🎉", time: "14:32" },
    { from: "them", text: "Поздравляю! Отметим на вечере настолок?", time: "14:33" },
  ],
  c2: [
    { from: "them", text: "Ты на лекции по программированию?", time: "12:45" },
    { from: "me", text: "Да, во втором ряду 👋", time: "12:50" },
  ],
  c3: [{ from: "them", text: "Спасибо за рекомендации! 🙌", time: "11:20" }],
  c4: [{ from: "them", text: "Давай завтра после пар?", time: "Вчера" }],
};

// «Новые мэтчи» — лента сверху в Сообщениях
export const NEW_MATCHES = [
  { id: "m1", name: "Аня", photo: avatar(49) },
  { id: "m2", name: "Игорь", photo: avatar(15) },
  { id: "m3", name: "Лиза", photo: avatar(45) },
  { id: "m4", name: "Максим", photo: avatar(12) },
  { id: "m5", name: "Саша", photo: avatar(32) },
];

// «Поиск знакомых» — рекомендации
export const SUGGESTIONS = [
  {
    id: "s1",
    name: "Виктория Смирнова",
    faculty: "Факультет журналистики",
    mutual: 12,
    photos: [49, 45, 20],
    photo: avatar(26),
  },
  {
    id: "s2",
    name: "Егор Кузнецов",
    faculty: "Факультет информатики",
    mutual: 8,
    photos: [12, 15, 33],
    photo: avatar(51),
  },
];

// Уведомления (экран открывается по колокольчику)
export const NOTIFICATIONS = [
  { id: "n1", type: "like", text: "Максим лайкнул вашу анкету", time: "5 мин назад", photo: avatar(12) },
  { id: "n2", type: "match", text: "У вас новый мэтч с Игорем!", time: "1 ч назад", photo: avatar(15) },
  { id: "n3", type: "event", text: "Завтра «Вечер настолок МГУ» в 18:00", time: "3 ч назад", photo: null },
  { id: "n4", type: "message", text: "Настя отправила вам сообщение", time: "Вчера", photo: avatar(20) },
  { id: "n5", type: "friend", text: "Егор принял вашу заявку в друзья", time: "Вчера", photo: avatar(51) },
];
