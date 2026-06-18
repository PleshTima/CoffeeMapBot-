#!/usr/bin/env bash
# Скачивает реальные фото (аватары + баннеры) во время CI-сборки.
# Раннер GitHub Actions имеет интернет, поэтому фото попадают в бандл.
# Если скачать не удалось — остаётся уже закоммиченная картинка-заглушка.
set -u
cd "$(dirname "$0")/.." || exit 1   # -> папка uni-one

AV=(12 13 15 20 26 32 33 44 45 47 49 51)
EV=(boardgames99 hackathon42 speeddating7 english23 cinema15 party88 \
    basketball3 ailecture jazz11 karaoke5 networking8 artexpo running9 quiz44)

mkdir -p src/assets/av src/assets/ev

dl() { # $1 url, $2 out
  for i in 1 2 3; do
    if curl -fsSL -m 30 "$1" -o "$2.tmp" && [ -s "$2.tmp" ] \
       && file "$2.tmp" | grep -qiE 'image|JPEG|PNG'; then
      mv "$2.tmp" "$2"
      return 0
    fi
    sleep 2
  done
  rm -f "$2.tmp"
  echo "WARN: не удалось скачать $1 — оставляю заглушку"
  return 0
}

echo "Скачиваю аватары…"
for n in "${AV[@]}"; do dl "https://i.pravatar.cc/400?img=$n" "src/assets/av/$n.jpg"; done
echo "Скачиваю баннеры событий…"
for s in "${EV[@]}"; do dl "https://picsum.photos/seed/$s/800/500" "src/assets/ev/$s.jpg"; done
echo "Готово."
