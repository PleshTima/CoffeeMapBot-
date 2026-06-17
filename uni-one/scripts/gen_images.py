#!/usr/bin/env python3
"""Генерация локальных картинок (аватары + баннеры событий) для офлайн-сборки.
Без внешних зависимостей по сети — всё вшивается в single-file."""
import os
import hashlib
import colorsys
from PIL import Image, ImageDraw

HERE = os.path.dirname(__file__)
AV_DIR = os.path.join(HERE, "..", "src", "assets", "av")
EV_DIR = os.path.join(HERE, "..", "src", "assets", "ev")
os.makedirs(AV_DIR, exist_ok=True)
os.makedirs(EV_DIR, exist_ok=True)

AVATARS = [12, 13, 15, 20, 26, 32, 33, 44, 45, 47, 49, 51]
# seed -> (эмодзи-глиф не рисуем, только цветовой тон по hash)
EVENT_SEEDS = [
    "boardgames99", "hackathon42", "speeddating7", "english23", "cinema15",
    "party88", "basketball3", "ailecture", "jazz11", "karaoke5",
    "networking8", "artexpo", "running9", "quiz44",
]


def h(s):
    return int(hashlib.md5(str(s).encode()).hexdigest(), 16)


def hsl(hue, s, l):
    r, g, b = colorsys.hls_to_rgb(hue, l, s)
    return (int(r * 255), int(g * 255), int(b * 255))


def gradient(w, h_, c1, c2):
    # строим маленький диагональный градиент и растягиваем (гладко и быстро)
    sw, sh = 32, 32
    small = Image.new("RGB", (sw, sh))
    px = small.load()
    for y in range(sh):
        for x in range(sw):
            t = ((x / sw) + (y / sh)) / 2
            px[x, y] = (
                int(c1[0] + (c2[0] - c1[0]) * t),
                int(c1[1] + (c2[1] - c1[1]) * t),
                int(c1[2] + (c2[2] - c1[2]) * t),
            )
    return small.resize((w, h_), Image.BICUBIC)


def make_avatar(n):
    hue = (h(n) % 360) / 360.0
    c1 = hsl(hue, 0.55, 0.55)
    c2 = hsl((hue + 0.08) % 1.0, 0.6, 0.38)
    size = 400
    img = gradient(size, size, c1, c2).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    white = (255, 255, 255, 235)
    # голова
    hr = size * 0.16
    cx, cy = size / 2, size * 0.40
    d.ellipse([cx - hr, cy - hr, cx + hr, cy + hr], fill=white)
    # плечи
    sw_ = size * 0.30
    d.ellipse([cx - sw_, size * 0.60, cx + sw_, size * 1.15], fill=white)
    img.save(os.path.join(AV_DIR, f"{n}.jpg"), quality=82, optimize=True)


def make_banner(seed):
    hue = (h(seed) % 360) / 360.0
    c1 = hsl(hue, 0.5, 0.42)
    c2 = hsl((hue + 0.12) % 1.0, 0.55, 0.22)
    w, ht = 800, 500
    img = gradient(w, ht, c1, c2).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    # абстрактные полупрозрачные круги для «живости»
    rnd = h(seed)
    for i in range(5):
        rnd = h(rnd)
        r = 60 + (rnd % 160)
        x = (h(rnd + 1) % w)
        y = (h(rnd + 2) % ht)
        a = 18 + (h(rnd + 3) % 30)
        col = hsl(((hue + (i * 0.07)) % 1.0), 0.6, 0.7) + (a,)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    img.save(os.path.join(EV_DIR, f"{seed}.jpg"), quality=78, optimize=True)


for n in AVATARS:
    make_avatar(n)
for s in EVENT_SEEDS:
    make_banner(s)

av = sum(os.path.getsize(os.path.join(AV_DIR, f)) for f in os.listdir(AV_DIR))
ev = sum(os.path.getsize(os.path.join(EV_DIR, f)) for f in os.listdir(EV_DIR))
print(f"Аватары: {len(AVATARS)} ({av // 1024} КБ) · Баннеры: {len(EVENT_SEEDS)} ({ev // 1024} КБ)")
