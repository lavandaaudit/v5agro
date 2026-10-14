# 📦 AGRO.MAGAZ — Пакет оновлень (v4.9)

**Дата:** 2026-10-14
**Гілка:** `main` → комітити у ваш репозиторій `lavandaaudit/agro_aaa`

---

## ⚠️ Проблема, яку виправлено

### Чому новини не оновлювались 2 дні?

`data/news_feed.json` — це статичний файл, який лежить у репозиторії на GitHub Pages.
Він оновлювався **тільки вручну** (коли ви запускали парсер локально на своєму комп'ютері).
Останнє оновлення було `2026-10-11T18:30 UTC` — три дні тому.

GitHub Pages не вміє запускати серверний код, тому без GitHub Action News Parser
ніколи б не оновився автоматично.

---

## ✅ Що зроблено

### 1. Новий парсер новин — `scripts/news_parser.py`

Повністю переписаний Python-парсер, який збирає новини з **15 джерел**:

**Україномовні (UA):**
- `latifundist.com/rss` (прямий RSS)
- `superagronom.com/rss` (прямий RSS)
- `elevatorist.com/rss` (прямий RSS)
- 6 пошукових стрічок Google News UA (агро, АПК, зерно, експорт, фінанси, агротех, сівба)
- 5 тематичних стрічок Google News UA (date-sorted)

**Англомовні (EN):**
- 8 тематичних стрічок Google News EN (date-sorted)
- 5 пошукових стрічок Google News EN
- `brownfieldagnews.com/feed/` (прямий RSS)
- `feeds.feedburner.com/agriculture` (прямий RSS)

**Особливості парсера:**
- Паралельне завантаження (6 потоків)
- Дедуплікація по MD5-хешу нормалізованого заголовка
- Фільтр за останні 24 години
- Розумна категоризація за ключовими словами
- Зворотна сумісність зі схемою `app.js` (поля не змінені)
- Працює без API-ключів, тільки стандартні RSS

**Результат локального тесту (2026-10-14 09:37 UTC):**
- **UA:** 28 новин за 24 год (було 21 у старому файлі)
- **EN:** 80 новин за 24 год (було 76)
- Найсвіжіша новина: 0.05 год тому (3 хв тому)

### 2. GitHub Action — `.github/workflows/update-news.yml`

Запускається **щогодини** (о 5-й хвилині кожної години), виконує парсер,
комітить оновлений `data/news_feed.json` у репозиторій. GitHub Pages
автоматично redeploy-не сайт зі свіжими новинами.

Особливості:
- `cron: '5 * * * *'` — щогодинна автоматична parsedb
- `workflow_dispatch` — ручний запуск з кнопки в Actions tab
- Python 3.12 + `feedparser`
- Skip-коміт, якщо новини не змінились (економить історію)
- Step Summary у Actions UI — видно скільки новин спарсилось
- `concurrency: cancel-in-progress: false` — не перериває попередній запуск

### 3. Шапка зроблена меншою та вужчою — `index.css`

Змінені значення (старі → нові):

| Елемент | Параметр | Було | Стало |
|---------|----------|------|-------|
| `.app-header` | padding | `16px 28px` | `8px 18px` |
| `.app-header` | gap | `15px` | `10px` |
| `.brand` | gap | `16px` | `10px` |
| `.brand .logo` | font-size | `1.8rem` | `1.4rem` |
| `.brand-tagline` | padding-left | `14px` | `10px` |
| `.brand-tagline` | gap | `2px` | `1px` |
| **`.brand-sub`** (MARKET INTELLIGENCE...) | **font-size** | `0.72rem` | **`0.62rem`** |
| **`.brand-badge`** (**ULTIMATE PRO v4.8**) | **font-size** | `0.62rem` | **`0.52rem`** |
| `.brand-badge` | padding | `2px 6px` | `1px 5px` |
| `.nbu-rate-pill` | padding | `8px 18px` | `5px 12px` |
| `.nbu-rate-pill` | font-size | `0.85rem` | `0.75rem` |
| `.nbu-title` | font-size | `0.75rem` | `0.65rem` |
| `.status-indicator` | gap | `18px` | `12px` |
| `.verified-badge` | padding | `6px 12px` | `4px 9px` |
| `.verified-badge` | font-size | `0.72rem` | `0.62rem` |
| `.pulse-box` | font-size | `0.8rem` | `0.7rem` |
| `.pulse` | size | `8px` | `6px` |
| `.clock-box` | font-size | `0.95rem` | `0.78rem` |
| `.clock-box` | padding | `6px 14px` | `4px 10px` |
| `.app-header` (mobile) | padding | `16px` | `8px 12px` |

Все інше — **без змін**. Тicker, навігація, головна сітка, лабораторія,
агромагаз, ситуативний центр — не зачеплено.

---

## 🚀 Як розгорнути

### Крок 1. Скопіюйте файли у ваш локальний клон репозиторію

```bash
# У вашому локальному клоні репо lavandaaudit/agro_aaa:
cp /home/z/my-project/download/agro_aaa_release/index.css  ./index.css
cp /home/z/my-project/download/agro_aaa_release/scripts/news_parser.py  ./scripts/news_parser.py
cp /home/z/my-project/download/agro_aaa_release/data/news_feed.json  ./data/news_feed.json
mkdir -p .github/workflows
cp /home/z/my-project/download/agro_aaa_release/.github/workflows/update-news.yml  .github/workflows/update-news.yml
```

### Крок 2. Закомітьте та запуште

```bash
git add index.css scripts/news_parser.py data/news_feed.json .github/workflows/
git commit -m "📰 news: hourly auto-refresh + smaller header UI"
git push origin main
```

### Крок 3. Активуйте GitHub Action

1. Відкрийте https://github.com/lavandaaudit/agro_aaa/actions
2. Знайдіть workflow **"📰 Agro News Refresh"**
3. Якщо GitHub попросить — натисніть "Enable workflows"
4. Натисніть **"Run workflow"** → перший запуск буде через ~30 секунд
5. Перевірте, що `data/news_feed.json` оновився в репо

### Крок 4. Перевірте сайт

Через 1-2 хв після push GitHub Pages redeploy-не сайт.
Відкрийте https://lavandaaudit.github.io/agro_aaa/ — новини будуть свіжі,
шапка менша та вужча, `ULTIMATE PRO v4.8` менший шрифтом.

---

## 📊 Оцінка проекту (агро-ааа)

### Сильні сторони ✅

1. **Архітектура "zero-build"** — чистий vanilla JS + Leaflet + Chart.js.
   Швидко завантажується, немає фреймворкових оверхедів.
2. **Реальна інтеграція з API** — НБУ, Open-Meteo, NASA POWER, CAMS Air,
   GloFAS. Немає `Math.random()` симуляцій бізнес-даних.
3. **Професійна агрономічна лабораторія** — 5 вкладок телеметрії,
   радар ризиків, NDVI, пошаровий стан ґрунту — це level enterprise-агро-продукту.
4. **Інтерактивна мапа Leaflet** — 25 областей з flyTo анімацією.
5. **Локалізація** — UA + EN стрічки з автоперекладом Google Translate.
6. **Дизайн-система** — Obsidian Glassmorphism з неоновими акцентами,
   послідовна палітра.

### Слабкі сторони ⚠️

1. **Розмір `app.js` — 140 KB / 2555 рядків** — один монолітний файл.
   Рекомендую розбити на модулі (nbu.js, news.js, map.js, store.js, sitcenter.js).
2. **Немає CDN-кешування** — кожен відкритий запис новини повторно
   завантажує `news_feed.json` (нині ~70KB). Варто додати `Cache-Control: max-age=1800`.
3. **`data/news_feed.json` не було automated** — ✅ ВИПРАВЛЕНО в цьому патчі.
4. **3 з 5 прямих RSS-джерел UA повертають 403** — AgroPortal, APK-Inform,
   AgroNews блокують не-браузерні запити. Парсер вже має fallback на Google News.
5. **Немає `manifest.json` та PWA** — сайт можна зробити installable на
   мобільних за ~30 рядків маніфесту.
6. **Немає sitemap.xml / robots.txt** — для SEO-індексації Google Search Console.
7. **Клієнтський переклад через googleapis.com** — безкоштовний ендпоінт може
   почати rate-limitити при трафіку > 1000 унікальних заголовків/добу.
   Варто перенести переклад у server-side GitHub Action (якщо потрібно).

### Пріоритетні рекомендації

| Пріоритет | Задача | Складність |
|-----------|--------|------------|
| 🔴 High | Auto-refresh новин (GitHub Action) | ✅ Готово |
| 🔴 High | Шапка менша (UX) | ✅ Готово |
| 🟡 Med | Розбити `app.js` на модулі | 4-6 год |
| 🟡 Med | Додати `manifest.json` + PWA | 1-2 год |
| 🟡 Med | `Cache-Control` headers через `.github/workflows/` | 30 хв |
| 🟢 Low | Sitemap + robots.txt для SEO | 20 хв |
| 🟢 Low | Server-side переклад EN→UA в GitHub Action | 2-3 год |
| 🟢 Low | Тести для парсера (pytest) | 2 год |

---

## 📁 Структура файлів цього патчу

```
agro_aaa_release/
├── index.css                                    ← ОНОВЛЕНО (менша шапка)
├── index.html                                   ← без змін
├── app.js                                       ← без змін
├── data/
│   └── news_feed.json                           ← ОНОВЛЕНО (28 UA + 80 EN, свіжі)
├── scripts/
│   └── news_parser.py                           ← НОВИЙ (15 джерел, 24h фільтр)
└── .github/
    └── workflows/
        └── update-news.yml                      ← НОВИЙ (щогодинна автоматизація)
```

---

## 🛠 Як локально запустити парсер (для тесту)

```bash
cd agro_aaa
pip install feedparser
python3 scripts/news_parser.py
# Output: data/news_feed.json
```

Парсер виводить статистику по кожному джерелу + top-5 новин кожною мовою.
