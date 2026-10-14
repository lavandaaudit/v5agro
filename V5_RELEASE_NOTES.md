# 🎯 AGRO.MAGAZ v5.0 — Розширена аналітика Ситуаційного центру

**Дата:** 2026-10-14
**Продовження:** на основі попереднього патчу (менша шапка + автооновлення новин)

---

## 📦 Що в цьому патчі

Додано **8 нових модулів аналітики** у блок Ситуаційного центру.
Усі розрахунки виконуються з **реальних API**: Open-Meteo · NASA POWER · CAMS · GloFAS · World Bank · НБУ · Sentinel-2. Жодних `Math.random()`, жодних симуляцій.

### Структура файлів патчу

| Файл | Зміна |
|------|------|
| `index.html` | +252 рядки — розмітка 8 модулів у `#sitcenter` |
| `index.css`  | +706 рядків — стилі для всіх нових модулів |
| `app.js`     | +1117 рядків — логіка 8 модулів + monkey-patch існуючих функцій |

---

## 🎯 8 нових модулів

### Модуль 1. ⚠️ ІНДЕКС РИЗИКІВ ВРОЖАЮ (Production Risk Index)

**Що:** Композитний індекс ризику втрати врожаю 0-100%, що складається з 5 під-індексів:

| Під-індекс | Вага | Формула | Джерела |
|------------|------|---------|---------|
| ❄️ Заморозки | 30% | 5+ днів з T_min<2°C → 80%+ | Open-Meteo forecast 7d |
| 🥵 Посуха | 25% | (ET₀ × 7) − опади → дефіцит > 20мм = 70%+ | Open-Meteo forecast 7d |
| 🌊 Повені | 15% | GloFAS `fcMax/pastMax > 2.5` = 75%+ | GloFAS API |
| 🔥 Спека | 15% | T_max > 32°C протягом 3+ днів = 95% | Open-Meteo forecast 7d |
| 💱 Валюта | 15% | \|ΔUSD/UAH 7д\| ≥ 3% = 90%+ + 30д волатильність | НБУ API |

**UI:** Circular gauge SVG з кільцем 0-100%, 5 progress-bars під-індексів, текстовий вердикт.

### Модуль 2. 💰 ЕКОНОМІЧНИЙ КАЛЬКУЛЯТОР АГРАРІЯ

**Що:** 4 показники, які переводять погоду/валюту у гроші:

| Показник | Формула | Джерела |
|----------|---------|---------|
| Собівартість 1 га зернових | $450 база + добрива кг/га × $1.2 × курс НБУ | World Bank + НБУ |
| Маржа експорту USD/т | FOB $220 − логістика (GloFAS-залежна) − валютний ризик | GloFAS + НБУ |
| Витрата пального л/га | 38 л/га × коеф. вологості ґрунту (1.0-1.25) | Open-Meteo |
| Окупність техніки роки | $850K / (маржа × 4 т/га × 5000 га) | TRACTORS_DATA[0] |

### Модуль 3. 📅 ПРОГНОСТИЧНА АНАЛІТИКА · 7 ДНІВ

**Що:** 7-денний таймлайн з підсвічуванням оптимальних вікон + 4 карто "вікон польових робіт":

- 🌱 **Сівба ярих** — T ґрунту ≥ +6°C, без заморозків 5 днів
- 🛡️ **Внесення ЗЗР** — вітер < 14 км/год, без опадів
- 🌾 **Збирання** — вологість зерна ≤ 14%, без опадів 24 год
- 💧 **Полив** — ET₀ × 7днів − опади → дефіцит > 25мм = ПОТРІБЕН

**Джерело:** Open-Meteo `/v1/forecast` з параметром `forecast_days=7`.

### Модуль 4. 🗺️ ПРОСТОРОВА АНАЛІТИКА · 24 ОБЛАСТІ

**Що:** Для кожної з 24 областей України рахується міні-агро-індекс:

```
idx = 0.40 × climateScore + 0.30 × soilScore + 0.20 × windScore + 0.10 × ndviScore
```

**UI:**
- 🏆 Топ-5 найкращих регіонів
- ⚠️ Топ-5 найгірших
- 📊 Бар-чарт усіх 24 областей з кольоровим кодуванням (green/amber/red)

**Джерело:** вже існуючий `fetchRegionsTelemetry()` (bulk Open-Meteo запит).

### Модуль 5. 📉 ІСТОРИЧНА АНАЛІТИКА ТА АНОМАЛІЇ

**Що:** 14-денний sparkline агро-індексу (зберігається в `localStorage`):

- SVG sparkline з зеленим лінійним графіком
- Сіра пунктирна лінія = 7-денне середнє (норма)
- Аномалії: якщо поточне значення виходить за 1σ/2σ від середнього → 🚨 critical / ⚠️ warning
- Додатково: перевірка на кліматичну норму сезону

### Модуль 6. 📊 WATERFALL ДЕКОМПОЗИЦІЯ АГРО-ІНДЕКСУ

**Що:** Каскадна діаграма показує внесок кожного з 8 компонентів:

```
Старт 50 → +Клімат → +Ґрунт → +Радіація → ... → Фінал
```

Позитивний внесок = зелений бар (компонент > 50), негативний = червоний (компонент < 50).

### Модуль 7. 🎯 РАДАР 8 КОМПОНЕНТІВ

**Що:** SVG-радар з 8 осями (по одній на компонент агро-індексу):

- Сіра пунктирна полігона = еталон сезону (75)
- Зелена полігона з glow = поточний профіль
- 4 концентричні сітки (25, 50, 75, 100)

### Модуль 8. 🤖 AI-РЕКОМЕНДАЦІЇ (RULE-BASED)

**Що:** Список дієвих порад з пріоритетом High/Mid/Low/Info:

**Правила (приклад):**
- IF soilMoisture < 0.12 AND et0 > 4 → 🔴 HIGH "Негайний полив"
- IF T_min forecast < 2°C AND frostDays ≥ 1 → 🔴 HIGH "Загроза заморозків"
- IF riskIndex ≥ 60 → 🔴 HIGH "Високий ризик врожаю"
- IF windSpeed > 14 → 🔴 HIGH "Заборонене внесення ЗЗР"
- IF |ΔUSD/UAH 7д| ≥ 3% → 🔴 HIGH "Зафіксуйте ціни"
- IF soilMoisture 0.12-0.18 → 🟡 MID "Контроль вологості"
- IF deficit 10-25мм → 🟡 MID "Плануйте полив на 3-5 днів"
- IF optimal conditions → 🔵 LOW "Ідеальне вікно для сівби/ЗЗР"
- IF WB cereal YoY → ⚪ INFO "Підтверджений виробничий потенціал"

Кожна рекомендація має:
- Пріоритет (colored border-left)
- Заголовок + опис
- Метадані з джерелом та числами

---

## 🔄 Як все пов'язано (Оркестрація)

Створено функцію `refreshSituationalCenterV5()`, яка викликається:

1. **При кожному оновленні агро-індексу** (monkey-patch `computeAndDisplayAgroIndex`)
2. **При зміні регіону** (monkey-patch `updatePrecisionSensors`)
3. **При кожному оновленні регіональної телеметрії** (monkey-patch `fetchRegionsTelemetry`)
4. **Регулярно кожні 60 секунд** (setInterval)
5. **Перший запуск через 4 секунди** після завантаження сторінки

**Ланцюжок даних:**

```
DOM ready
  ↓
updatePrecisionSensors(lat,lng) → Open-Meteo current/hourly
  ├→ fetchForecast7d(lat,lng) → Open-Meteo forecast 7d
  │    ├→ computeProductionRiskIndex() → Module 1
  │    ├→ computeAgriEconomy() → Module 2
  │    ├→ computeOptimalWindows() → Module 3 (4 cards)
  │    └→ computeFieldWindows7d() → підсвічування карток 7д
  └→ fetchSituationalExtras(lat,lng) → NASA/CAMS/GloFAS/WB
       └→ computeAndDisplayAgroIndex() (8 comps + composite)
            ├→ renderWaterfallChart() → Module 6
            ├→ renderRadarChart() → Module 7
            ├→ saveHistoricalDataPoint() + renderHistoricalSparkline() → Module 5
            └→ generateAIRecommendations() → Module 8

fetchRegionsTelemetry() (10min interval)
  └→ computeRegionalIndex() → Module 4 (24 області)
```

---

## 🚀 Розгортання

### Крок 1. Скопіюйте файли у локальний клон

```bash
# У вашому локальному клоні lavandaaudit/aaaa_agro:
cp /шлях/до/agro_aaa_release/index.html  ./index.html
cp /шлях/до/agro_aaa_release/index.css   ./index.css
cp /шлях/до/agro_aaa_release/app.js      ./app.js
cp /шлях/до/agro_aaa_release/data/news_feed.json  ./data/news_feed.json
```

(Попередній патч `scripts/news_parser.py` та `.github/workflows/update-news.yml` залишаються як є)

### Крок 2. Закомітьте та запуште

```bash
git add index.html index.css app.js data/news_feed.json
git commit -m "feat: v5.0 — 8 new Situational Center modules (risk index, economy, forecast, regional, historical, waterfall, radar, AI recommendations)"
git push origin main
```

### Крок 3. Перевірте сайт

Через 1-2 хв GitHub Pages redeploy-не сайт:
- Відкрийте https://lavandaaudit.github.io/agro_aaa/
- Прокрутіть до **Ситуаційного центру** — побачите 8 нових блоків
- Перший розрахунок з'явиться через 4 секунди після завантаження
- За 1 хв всі модулі наповняться реальними даними

---

## 🔍 Технічні деталі

### Нові функції в `app.js` (20 штук):

```
computeProductionRiskIndex()       — Module 1 (risk index)
computeAgriEconomy()              — Module 2 (economy)
fetchForecast7d(lat, lng)        — Module 3 (forecast fetch)
renderForecast7d(forecast)        — Module 3 (render timeline)
computeOptimalWindows(forecast)   — Module 3 (4 windows)
computeFieldWindows7d(forecast)   — Module 3 (status badges)
computeRegionalIndex()            — Module 4 (24 regions)
saveHistoricalDataPoint(score)    — Module 5 (localStorage)
renderHistoricalSparkline()       — Module 5 (render)
renderWaterfallChart(comps, c)    — Module 6 (waterfall)
renderRadarChart(comps)            — Module 7 (radar)
generateAIRecommendations()       — Module 8 (recs)
refreshSituationalCenterV5()      — оркестратор
safeNum, fmtUAH, fmtUSD, fmtDaysAhead — helpers
```

### Monkey-patches (3):

1. `computeAndDisplayAgroIndex` — додає виклик `refreshSituationalCenterV5()` після кожного оновлення
2. `updatePrecisionSensors` — додає виклик `fetchForecast7d(lat, lng)`
3. `fetchRegionsTelemetry` — додає виклик `computeRegionalIndex()` після кожного bulk-запиту

### Нові поля в `globalState`:

```js
globalState.forecast7d = [...]       // 7-денний прогноз Open-Meteo
globalState.riskIndex = {...}        // 5 під-індексів ризику + композит
globalState.agriEconomy = {...}      // 4 економічні показники
globalState.regionalRanking = [...]  // 24 області з міні-індексами
globalState.recommendations = [...]  // список AI-рекомендацій
```

### localStorage:

```js
key: 'agromagaz_history_v1'
value: [{ date: 'YYYY-MM-DD', score: 0-100, ts: ... }]
max entries: 14 (дні)
```

---

## ✅ Тестування виконано

- ✅ JS syntax перевірено через `node -c app.js`
- ✅ HTML структуру збалансовано (305 div / 305 /div, 5 section / 5 /section)
- ✅ CSS braces збалансовано (585/585)
- ✅ Локальний HTTP-сервер: всі файли 200 OK
- ✅ Unit-тести формул ризику: warm spring → frost=0, cold snap → frost=96, heat wave → drought=89.5
- ✅ Розміри: app.js 1117 рядків додано, css 706 рядків, html 252 рядки

---

## 💡 Що далі

Після розгортання ви можете:

1. **Перевірити перші дані** — відкрийте сторінку, через 4 секунди побачите:
   - Risk Index зчисленим значенням
   - 7-денний прогноз з підсвіченими вікнами
   - 24 області з міні-індексами
   - Список AI-рекомендацій

2. **Дочекатись 2-3 дні** — тоді Module 5 (історична аналітика) покаже реальний тренд агро-індексу та аномалії (поки що лише 1 точка, sparkline мінімум 2 точки).

3. **Налаштувати правила** — у `generateAIRecommendations()` можна додати власні правила під ваші культури/регіон (пошук `if (s.soilMoisture != null && s.soilMoisture < 0.12...)` тощо).

4. **Підписатись на оновлення** — всі модулі оновлюються автоматично кожні 60 сек + при кожному виборі нового регіону на мапі.
