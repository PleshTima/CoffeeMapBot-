#!/usr/bin/env python3
# Генерация диаграмм для слайдов исследования Uni-one (модельные данные).
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import rcParams

rcParams["font.family"] = "DejaVu Sans"
rcParams["font.size"] = 12

OUT = os.path.join(os.path.dirname(__file__), "charts")
os.makedirs(OUT, exist_ok=True)

ORANGE = "#f5512f"
BLUE = "#2f6bff"
PINK = "#f6a8c8"
GREEN = "#2fd07a"
GREY = "#c9ccd4"
INK = "#1c2230"

def save(fig, name):
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, name), dpi=150, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)

def pct_labels(ax, bars, vals, horizontal=False):
    for b, v in zip(bars, vals):
        if horizontal:
            ax.text(b.get_width() + 1, b.get_y() + b.get_height() / 2,
                    f"{v}%", va="center", fontweight="bold", color=INK)
        else:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 1,
                    f"{v}%", ha="center", fontweight="bold", color=INK)

# 1. Ступень обучения (pie)
fig, ax = plt.subplots(figsize=(5, 5))
ax.pie([64, 36], labels=["1 курс бакалавриата\nи абитуриенты", "1 курс\nмагистратуры"],
       autopct=lambda p: f"{p:.0f}%\n({round(p/100*45)} чел.)",
       colors=[BLUE, ORANGE], startangle=90,
       wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2),
       textprops=dict(color=INK, fontweight="bold"))
ax.set_title("Кто опрошен (n = 45)", fontweight="bold", fontsize=15, color=INK)
save(fig, "01_respondents_stage.png")

# 2. Иногородние (pie)
fig, ax = plt.subplots(figsize=(5, 5))
ax.pie([60, 40], labels=["Иногородние", "Из Москвы"],
       autopct=lambda p: f"{p:.0f}%", colors=[ORANGE, GREY], startangle=90,
       wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2),
       textprops=dict(color=INK, fontweight="bold"))
ax.set_title("Откуда приехали учиться", fontweight="bold", fontsize=15, color=INK)
save(fig, "02_respondents_origin.png")

# 3. Насколько сложно находить друзей (bar)
fig, ax = plt.subplots(figsize=(7, 4.2))
labels = ["Очень\nсложно", "Скорее\nсложно", "Нейтрально", "Легко"]
vals = [38, 33, 16, 13]
bars = ax.bar(labels, vals, color=[ORANGE, "#ff8a5c", GREY, GREEN])
pct_labels(ax, bars, vals)
ax.set_ylim(0, 50)
ax.set_title("Насколько легко находить новых друзей в вузе",
             fontweight="bold", color=INK)
ax.spines[["top", "right"]].set_visible(False)
ax.set_ylabel("% респондентов")
save(fig, "03_friends_difficulty.png")

# 4. Барьеры для знакомства (horizontal bar)
fig, ax = plt.subplots(figsize=(7.5, 4))
labels = ["Стеснение / страх\nпервого шага", "Нет повода и места", "Мало времени",
          "Уже сложившиеся\nкомпании"]
vals = [42, 27, 18, 13]
y = range(len(labels))
bars = ax.barh(y, vals, color=BLUE)
ax.set_yticks(y); ax.set_yticklabels(labels)
ax.invert_yaxis()
pct_labels(ax, bars, vals, horizontal=True)
ax.set_xlim(0, 50)
ax.set_title("Главный барьер для знакомства", fontweight="bold", color=INK)
ax.spines[["top", "right"]].set_visible(False)
save(fig, "04_barriers.png")

# 5. Источники информации о событиях (horizontal bar)
fig, ax = plt.subplots(figsize=(7.5, 4))
labels = ["Чаты / Telegram", "От друзей", "Никак / случайно", "Стенды в корпусе"]
vals = [40, 27, 18, 15]
y = range(len(labels))
bars = ax.barh(y, vals, color=PINK)
ax.set_yticks(y); ax.set_yticklabels(labels)
ax.invert_yaxis()
pct_labels(ax, bars, vals, horizontal=True)
ax.set_xlim(0, 50)
ax.set_title("Откуда узнают о внеучебной жизни\n(инфо разрознена)",
             fontweight="bold", color=INK)
ax.spines[["top", "right"]].set_visible(False)
save(fig, "05_info_sources.png")

# 6. Ключевые метрики (horizontal bar)
fig, ax = plt.subplots(figsize=(8, 4.8))
labels = [
    "Сложно находить друзей",
    "Испытывали одиночество",
    "Инфо о событиях разрознена",
    "«Не с кем пойти» на событие",
    "За связку знакомства + события",
    "Поставили бы приложение",
    "Нужна фича «позвать вместе»",
]
vals = [71, 76, 69, 44, 56, 78, 71]
colors = [ORANGE, ORANGE, ORANGE, ORANGE, BLUE, GREEN, BLUE]
y = range(len(labels))
bars = ax.barh(y, vals, color=colors)
ax.set_yticks(y); ax.set_yticklabels(labels)
ax.invert_yaxis()
pct_labels(ax, bars, vals, horizontal=True)
ax.set_xlim(0, 100)
ax.set_title("Ключевые цифры исследования", fontweight="bold", fontsize=15, color=INK)
ax.spines[["top", "right"]].set_visible(False)
save(fig, "06_key_metrics.png")

# 7. Намерение установить (stacked single bar)
fig, ax = plt.subplots(figsize=(8, 2.6))
parts = [("Точно да", 38, GREEN), ("Скорее да", 40, "#7fb0ff"),
         ("Вряд ли", 22, GREY)]
left = 0
for label, v, c in parts:
    ax.barh(0, v, left=left, color=c)
    ax.text(left + v / 2, 0, f"{label}\n{v}%", ha="center", va="center",
            fontweight="bold", color=INK)
    left += v
ax.set_xlim(0, 100); ax.set_yticks([])
ax.set_title("«Установил(а) бы такое приложение?»  →  78% позитивно",
             fontweight="bold", color=INK)
ax.spines[["top", "right", "left", "bottom"]].set_visible(False)
ax.set_xticks([])
save(fig, "07_install_intent.png")

# 8. Находки теста прототипа (horizontal bar)
fig, ax = plt.subplots(figsize=(8.5, 5))
labels = [
    "Звёздочка непонятна (= суперлайк?)",
    "Неясно, с чего начать / что умеет",
    "Хотели менять интересы",
    "Фильтры — нужен мультивыбор",
    "Не видно, кто из друзей идёт",
    "Вкладка «Пары» лишняя/пустая",
    "В свайпе нет «общего» с человеком",
    "Хотели ходить компанией",
]
vals = [36, 31, 27, 22, 20, 18, 18, 16]
y = range(len(labels))
bars = ax.barh(y, vals, color="#e0556e")
ax.set_yticks(y); ax.set_yticklabels(labels)
ax.invert_yaxis()
pct_labels(ax, bars, vals, horizontal=True)
ax.set_xlim(0, 45)
ax.set_title("Что нашли на тесте прототипа (% упомянувших)",
             fontweight="bold", fontsize=14, color=INK)
ax.spines[["top", "right"]].set_visible(False)
save(fig, "08_prototype_findings.png")

print("Готово. Файлы в", OUT)
