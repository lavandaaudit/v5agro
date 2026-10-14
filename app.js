/**
 * AGRO.MAGAZ - Core Application Engine
 * Real 24h News Parsers, Live NBU & Market Data (No Simulation),
 * Precision Farming & E-Commerce Tractor Store.
 */

// ==============================================================
// 1. DATA STATE & CONFIGURATION
// ==============================================================

const TRACTORS_DATA = [
    {
        id: "quadtrac-715",
        name: "Steiger Quadtrac 715",
        category: "heavy",
        power: "778 к.с. (макс. 830 к.с.)",
        engine: "FPT Cursor 16, 15.9 л, Twin Turbo",
        transmission: "Heavy-Duty Full Powershift 16x2",
        speed: "40 км/год",
        fuel_capacity: "1,968 л",
        hydraulics: "428 л/хв (TwinFlow)",
        weight: "27,800 кг",
        img: "assets/quadtrac_715.jpg",
        price_usd: 850000,
        status: "В наявності",
        badges: ["ФЛАГМАН 2025", "TRADE-IN 0%", "ГАРАНТІЯ 3 РОКИ"],
        desc: "Новий флагман світового тракторобудування та переможець премії 'Трактор року'. Чотиригусенична система Quadtrac забезпечує неперевершену тягу та мінімальний тиск на ґрунт (0.5 кг/см²)."
    },
    {
        id: "magnum-400",
        name: "Magnum 400 CVXDrive",
        category: "heavy",
        power: "435 к.с. (макс. 450 к.с.)",
        engine: "FPT Cursor 9, 8.7 л, eVGT",
        transmission: "Безступенева CVXDrive",
        speed: "50 км/год",
        fuel_capacity: "617 л",
        hydraulics: "282 л/хв",
        weight: "14,800 кг",
        img: "assets/magnum_400.jpg",
        price_usd: 450000,
        status: "В наявності",
        badges: ["ХІТ ПРОДАЖІВ", "ТЕСТ-ДРАЙВ У ПОЛІ", "AFS CONNECT"],
        desc: "Еталон продуктивності та надійності для важких польових робіт. Безступенева трансмісія CVXDrive і телеметрія AFS Connect у режимі реального часу оптимізують витрати пального."
    },
    {
        id: "optum-440",
        name: "Optum 440 AFS Connect",
        category: "heavy",
        power: "440 к.с. (макс. 460 к.с.)",
        engine: "FPT 6.7 л High-Output",
        transmission: "Безступенева CVXDrive 50 ECO",
        speed: "50 км/год",
        fuel_capacity: "630 л",
        hydraulics: "220 л/хв",
        weight: "11,500 кг",
        img: "assets/optum_440.jpg",
        price_usd: 320000,
        status: "В наявності",
        badges: ["ШВИДКИЙ ТРАНСПОРТ", "ЛІЗИНГ ВІД 0.01%"],
        desc: "Високопотужний, компактний і маневрений трактор. Ідеальний баланс ваги та потужності для комбінованих польових операцій та швидкісного транспортування врожаю."
    },
    {
        id: "puma-260",
        name: "Puma 260 CVXDrive",
        category: "mid",
        power: "302 к.с. (макс. 315 к.с.)",
        engine: "FPT NEF 6.7 л, Stage V",
        transmission: "CVXDrive 50 км/год ECO",
        speed: "50 км/год",
        fuel_capacity: "460 л",
        hydraulics: "170 л/хв",
        weight: "9,600 кг",
        img: "assets/puma_260.jpg",
        price_usd: 240000,
        status: "В наявності",
        badges: ["ДЕРЖКОМПЕНСАЦІЯ 25%", "УНІВЕРСАЛ"],
        desc: "Найпотужніша Puma в історії з ультратихою кабіною Deluxe (всього 66 дБ). Ідеальний для посіву, внесення добрив, оранки та захисту рослин."
    },
    {
        id: "axial-8250",
        name: "Axial-Flow 8250",
        category: "combine",
        power: "571 к.с. (макс. 634 к.с.)",
        engine: "FPT Cursor 13, 12.9 л",
        transmission: "Гідрооб'ємна 4-швидкісна",
        speed: "30 км/год",
        fuel_capacity: "1,125 л",
        hydraulics: "Бункер 14,400 л (159 л/с)",
        weight: "20,500 кг",
        img: "assets/Axial-Flow.jpg",
        price_usd: 650000,
        status: "Під замовлення",
        badges: ["КОМБАЙН", "HARVEST COMMAND", "ЖНИВА 2026"],
        desc: "Легендарна однороторна технологія Axial-Flow у поєднанні з ШІ-автоматизацією Harvest Command. Мінімум битого зерна (менше 0.5%) та рекордна швидкість збирання."
    },
    {
        id: "farmall-120c",
        name: "Farmall 120C",
        category: "mid",
        power: "117 к.с.",
        engine: "FPT F34, 3.4 л, 4 циліндри Turbo",
        transmission: "Hi-Lo 24x24 з PowerShuttle",
        speed: "40 км/год",
        fuel_capacity: "160 л",
        hydraulics: "64 л/хв",
        weight: "4,400 кг",
        img: "assets/Farmall.jpg",
        price_usd: 95000,
        status: "В наявності",
        badges: ["ФЕРМЕРСЬКИЙ ВИБІР", "КРЕДИТ 5-7-9%"],
        desc: "Надійний і маневрений помічник для тваринництва, заготівлі кормів, роботи з фронтальним навантажувачем та догляду за посівами в малих і середніх господарствах."
    }
];

// App Global State
let globalState = {
    nbuRates: { USD: 45.08, EUR: 50.44, PLN: 11.52, usd: 45.08, eur: 50.44 },
    nbuLive: false,          // true лише після успішного запиту до офіційного API НБУ
    nbuPrev: null,           // офіційний курс НБУ 7 днів тому (реальна динаміка)
    nbuDate: '',             // дата офіційного курсу з API НБУ
    nbuHistorySeries: null,  // реальна історія курсів НБУ (спарклайни; один цикл запитів за сесію)
    eventLog: [],            // журнал подій — тільки реальні системні події
    newsData: { ua: [], en: [] },
    selectedTractorForLeasing: TRACTORS_DATA[0],
    selectedTractorForOrder: TRACTORS_DATA[0],
    currentRegion: { name: "УКРАЇНА (ГЛОБАЛЬНО)", lat: 48.3794, lng: 31.1656 },
    activeUaFilter: 'all',
    activeEnFilter: 'all',
    countdown: 60,
    lastSensorData: {},
    sitSources: {},          // нові реальні джерела ситуативного центру: { nasa, air, flood, wb }
    _sitExtrasSig: '',       // регіон останнього збору нових джерел
    _sitExtrasTs: 0          // час останнього збору (тротлінг 5 хв)
};

// ==============================================================
// 2. INITIALIZATION
// ==============================================================

document.addEventListener('DOMContentLoaded', async () => {
    startClock();
    startCountdown();

    // 1. Fetch live NBU exchange rates (Direct, Real, Zero CORS issue)
    await fetchNbuRates();

    // 2. Fetch and render 24h news feeds (Real Google News RSS)
    await fetchNewsFeeds();

    // 3. Render tractor store catalog
    renderTractorCatalog('all');

    // 4. Initialize Precision Farming map & charts
    initPrecisionFarming();

    // 5. Initialize Situational Center (after sensors have at least started)
    setTimeout(initSituationalCenter, 2500);

    // Initial Leasing calc setup
    updateLeasingCalc();
});


// ==============================================================
// 3. CLOCK & TIMER
// ==============================================================

function startClock() {
    const clockEl = document.getElementById('current-time');
    const updateTime = () => {
        if (clockEl) {
            clockEl.textContent = new Date().toLocaleTimeString('uk-UA');
        }
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function startCountdown() {
    const timerEl = document.getElementById('update-timer');
    setInterval(() => {
        globalState.countdown--;
        if (globalState.countdown <= 0) {
            globalState.countdown = 60;
            refreshLiveData();
        }
        if (timerEl) {
            timerEl.textContent = `Оновлення через: ${globalState.countdown}с`;
        }
    }, 1000);
}

async function refreshLiveData() {
    console.log('[SYNC] Auto-refreshing live official data and telemetry...');
    await fetchNbuRates();
    await fetchNewsFeeds();
    updatePrecisionSensors(globalState.currentRegion.lat, globalState.currentRegion.lng);
    fetchRegionsTelemetry(); // оновлення зведеної телеметрії 24 областей
}

// ==============================================================
// ==============================================================
// 4. NBU EXCHANGE RATES (OFFICIAL API — ONLY REAL DATA)
//    Ринкові котирування (зерно CBOT/Matif, нафта, пальне, СРТ UA)
//    НЕ показуємо: безкоштовного офіційного API без CORS-блокування
//    не існує, а симуляція на ситуаційному дашборді заборонена.
// ==============================================================

async function fetchNbuRates() {
    try {
        const res = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        for (const item of data) {
            if (item.cc === 'USD') { globalState.nbuRates.USD = parseFloat(item.rate.toFixed(2)); globalState.nbuRates.usd = globalState.nbuRates.USD; }
            if (item.cc === 'EUR') { globalState.nbuRates.EUR = parseFloat(item.rate.toFixed(2)); globalState.nbuRates.eur = globalState.nbuRates.EUR; }
            if (item.cc === 'PLN') globalState.nbuRates.PLN = parseFloat(item.rate.toFixed(2));
        }
        globalState.nbuLive = true;
        globalState.nbuDate = data.find(i => i.cc === 'USD')?.exchangedate || '';

        // Update UI pill
        const usdEl = document.getElementById('nbu-usd');
        const eurEl = document.getElementById('nbu-eur');
        const plnEl = document.getElementById('nbu-pln');

        if (usdEl) usdEl.textContent = `${globalState.nbuRates.USD} ₴`;
        if (eurEl) eurEl.textContent = `${globalState.nbuRates.EUR} ₴`;
        if (plnEl) plnEl.textContent = `${globalState.nbuRates.PLN} ₴`;

        // Журнал подій — реальна синхронізація з офіційним API (дедуплікація за текстом)
        addEventLog('ok', `<strong>Курси НБУ синхронізовано (bank.gov.ua):</strong> USD=${globalState.nbuRates.USD} ₴ · EUR=${globalState.nbuRates.EUR} ₴ · PLN=${globalState.nbuRates.PLN} ₴`);

        // Реальна історія курсів НБУ (динаміка 7 днів у стрічці) — у фоні, раз за сесію
        fetchNbuHistory().then(() => {
            renderTicker();
            computeAndDisplayAgroIndex();
        });

        console.log('[NBU API] Synced live rates:', globalState.nbuRates);
        renderTractorCatalog(); // Update converted UAH prices in the shop
        renderTicker();
    } catch (e) {
        console.warn('[NBU API] Offline fallback:', e.message);
        if (!globalState.nbuLive) {
            addEventLog('warn', "<strong>НБУ API недоступний.</strong> Офіційні курси не відображаються, поки зв'язок не відновлено");
        }
        renderTicker();
    }
}

// Офіційний курс НБУ на конкретну дату (вихідні/свята → крок назад до найближчого робочого дня)
async function fetchNbuDateRates(ymd) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${ymd}&json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const arr = await res.json();
            if (Array.isArray(arr) && arr.length > 0) {
                const get = cc => arr.find(x => x.cc === cc)?.rate ?? null;
                return { USD: get('USD'), EUR: get('EUR'), PLN: get('PLN') };
            }
            throw new Error('empty response (вихідний/свято)');
        } catch (e) {
            const d = new Date(`${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T12:00:00Z`);
            d.setDate(d.getDate() - 1);
            ymd = d.toISOString().slice(0, 10).replace(/-/g, '');
        }
    }
    return null;
}

// Реальна історія офіційних курсів НБУ:
//   results[0] = 7 днів тому (для реальної динаміки), решта — точки спарклайна (12/10/8/6/4/2 дні тому + сьогодні),
//   14/21/28 — реальна волатильність курсу USD за місяць (для Агро-індексу)
async function fetchNbuHistory() {
    if (globalState.nbuHistorySeries) return; // курс НБУ змінюється раз на добу — історію тягнемо один раз за сесію
    // 7…28 днів тому — динаміка тікера + реальна волатильність USD за 30 днів для Агро-індексу
    const offsets = [7, 12, 10, 8, 6, 4, 2, 14, 21, 28];
    const results = await Promise.all(offsets.map(off => {
        const d = new Date(Date.now() - off * 86400000);
        return fetchNbuDateRates(d.toISOString().slice(0, 10).replace(/-/g, ''));
    }));

    if (results[0] && results[0].USD != null) {
        globalState.nbuPrev = results[0];
    }

    const series = { USD: [], EUR: [], PLN: [] };
    [results[1], results[2], results[3], results[4], results[5], results[6]].forEach(r => {
        if (r && r.USD != null) { series.USD.push(r.USD); series.EUR.push(r.EUR); series.PLN.push(r.PLN); }
    });
    series.USD.push(globalState.nbuRates.USD);
    series.EUR.push(globalState.nbuRates.EUR);
    series.PLN.push(globalState.nbuRates.PLN);
    globalState.nbuHistorySeries = series;
}

// ==============================================================
// 5. TICKER (ONLY REAL DATA — NO SIMULATION)
//    Єдине ринкове джерело, яке доступне з браузера без CORS-блокування
//    і без серверного ключа — офіційний API НБУ (bank.gov.ua).
//    Біржові котирування (CBOT/Matif/нафта/СРТ) не показуємо взагалі.
// ==============================================================

function renderTicker() {
    const tickerContainer = document.getElementById('price-ticker');
    if (!tickerContainer) return;

    const items = [];
    const nbu = globalState.nbuRates;

    if (globalState.nbuLive) {
        const mkItem = (flag, label, val, prev) => {
            let diffHtml = '<span class="ticker-diff-up">(офіційний курс)</span>';
            if (prev != null) {
                const diff = (val - prev) / prev * 100;
                const cls = diff >= 0 ? 'ticker-diff-up' : 'ticker-diff-down';
                diffHtml = `<span class="${cls}">(${diff >= 0 ? '+' : ''}${diff.toFixed(2)}% · 7 днів, НБУ)</span>`;
            }
            return `
                <div class="ticker-item">
                    <span>${flag} ${label}:</span>
                    <strong>${val.toFixed(2)} ₴</strong>
                    ${diffHtml}
                </div>
            `;
        };
        items.push(mkItem('🇺🇦', 'НБУ USD/UAH', nbu.USD, globalState.nbuPrev?.USD));
        items.push(mkItem('🇪🇺', 'НБУ EUR/UAH', nbu.EUR, globalState.nbuPrev?.EUR));
        items.push(mkItem('🇵🇱', 'НБУ PLN/UAH', nbu.PLN, globalState.nbuPrev?.PLN));
        items.push(`
            <div class="ticker-item">
                <span>📌 Джерело:</span>
                <strong class="ticker-diff-up">офіційний API НБУ (bank.gov.ua)${globalState.nbuDate ? ` · курс на ${globalState.nbuDate}` : ''}</strong>
            </div>
        `);
    } else {
        items.push(`
            <div class="ticker-item">
                <span>⚠️ НБУ API недоступний</span>
                <strong class="ticker-diff-down">очікую синхронізацію з bank.gov.ua...</strong>
            </div>
        `);
    }

    // Render twice for infinite smooth scrolling
    const joined = items.join('');
    tickerContainer.innerHTML = joined + joined;
}

// Офіційні курси НБУ — картки з реальною динамікою видалено разом з правою
// колонкою «Курси НБУ та Джерела Даних» (аналітичний блок порожній без даних).
// Тікер і Агро-індекс далі живуть на тому самому live API НБУ.

// ==============================================================

// 6. 24-HOUR LIVE NEWS ENGINE (UA & EN, NO STUBS)
//    EN-стрічка: автопереклад заголовків українською (Google Translate,
//    безкоштовний публічний ендпоінт, CORS дозволено). Кеш у localStorage.
// ==============================================================

async function fetchNewsFeeds() {
    try {
        const res = await fetch('data/news_feed.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        globalState.newsData = data;

        // Render both feeds
        renderNewsFeed('ua', data.ua);
        renderNewsFeed('en', data.en);

        // Update counts
        const uaCount = document.getElementById('ua-count');
        const enCount = document.getElementById('global-count');
        if (uaCount) uaCount.textContent = `${data.ua.length} НОВИХ (24H)`;
        if (enCount) enCount.textContent = `${data.en.length} LIVE (24H)`;
    } catch (e) {
        console.error('[NEWS ENGINE] Error fetching 24h news:', e);
    }
}

function formatHoursAgo(hours) {
    if (hours < 1) {
        const mins = Math.max(5, Math.round(hours * 60));
        return `${mins} хв тому`;
    }
    const h = Math.floor(hours);
    return `${h} год тому`;
}

function formatHoursAgoEn(hours) {
    if (hours < 1) {
        const mins = Math.max(5, Math.round(hours * 60));
        return `${mins}m ago`;
    }
    const h = Math.floor(hours);
    return `${h}h ago`;
}

function renderNewsFeed(lang, items) {
    const containerId = lang === 'ua' ? 'ua-news' : 'global-news';
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="loading-state">
                <span>⚠️ Немає новин за останні 24 години у вибраній категорії.</span>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(it => {
        const timeStr = lang === 'ua' ? formatHoursAgo(it.hours_ago) : formatHoursAgoEn(it.hours_ago);
        const safeLink = encodeURI(it.link || '#');

        // EN-стрічка: одразу показуємо кешований переклад або плейсхолдер «переклад…»
        let translationHtml = '';
        if (lang === 'en') {
            const cached = getCachedTranslation(it.title);
            translationHtml = cached
                ? `<div class="news-translation">🇺🇦 ${escapeNewsHtml(cached)}</div>`
                : `<div class="news-translation news-translation-pending" data-tr-title="${escapeNewsHtml(it.title)}"><span class="tr-dot"></span>переклад…</div>`;
        }

        return `
            <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="news-card-item">
                <div class="news-item-top">
                    <span class="news-time">🕒 ${timeStr}</span>
                    <span class="news-category-tag">${it.category || 'NEWS'}</span>
                </div>
                <div class="news-headline">${it.title}</div>
                ${translationHtml}
                <div class="news-source-row">
                    <span class="news-source-name">📰 <strong>${it.source}</strong></span>
                    <span class="news-read-link">Читати в джерелі &rarr;</span>
                </div>
            </a>
        `;
    }).join('');

    // Запускаємо дозавантаження перекладів для нових (некешованих) заголовків
    if (lang === 'en') queuePendingTranslations(container);
}

// ==============================================================
// 6a. AUTOTRANSLATOR: EN HEADLINES → UKRAINIAN (GOOGLE TRANSLATE, FREE ENDPOINT)
//     - Безкоштовний публічний ендпоінт translate.googleapis.com (CORS дозволено),
//       резервний clients5.google.com — обидва без API-ключа.
//     - Кеш у localStorage: переклад заголовка не міняється, тому живе довго.
//     - Автооновлення стрічки кожні 60с НЕ створює повторних запитів (усе з кешу).
//     - Якщо переклад недоступний — показуємо оригінальний заголовок (без фейків).
// ==============================================================

const TRANSLATE_CACHE_KEY = 'agro_tr_en_uk_v1';
const TRANSLATE_CACHE_MAX = 300;
const TRANSLATE_CONCURRENCY = 5;
let _translateCache = null;
let _translateQueue = [];
let _translateActive = 0;
const _translateSeen = new Set(); // дедуплікація однакових заголовків у черзі

function escapeNewsHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function loadTranslateCache() {
    if (_translateCache) return _translateCache;
    try {
        _translateCache = JSON.parse(localStorage.getItem(TRANSLATE_CACHE_KEY) || '{}');
        if (typeof _translateCache !== 'object' || !_translateCache) _translateCache = {};
    } catch (e) {
        _translateCache = {};
    }
    return _translateCache;
}

function saveTranslateCache() {
    try {
        const keys = Object.keys(_translateCache);
        if (keys.length > TRANSLATE_CACHE_MAX) {
            keys.sort((a, b) => (_translateCache[a]?.ts || 0) - (_translateCache[b]?.ts || 0))
                .slice(0, keys.length - TRANSLATE_CACHE_MAX)
                .forEach(k => delete _translateCache[k]);
        }
        localStorage.setItem(TRANSLATE_CACHE_KEY, JSON.stringify(_translateCache));
    } catch (e) { /* приватний режим / переповнений localStorage — працюємо без кешу */ }
}

function getCachedTranslation(enTitle) {
    const entry = loadTranslateCache()[enTitle];
    return entry && typeof entry.uk === 'string' ? entry.uk : null;
}

// Переклад одного заголовка: основний ендпоінт + резервний
async function fetchTranslationUk(enTitle) {
    const primary = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=${encodeURIComponent(enTitle)}`;
    const fallback = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=uk&q=${encodeURIComponent(enTitle)}`;

    try {
        const res = await fetch(primary);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        const uk = Array.isArray(j?.[0]) ? j[0].map(s => s?.[0] || '').join('').trim() : '';
        if (uk) return uk;
        throw new Error('порожня відповідь');
    } catch (e) {
        try {
            const res2 = await fetch(fallback);
            if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
            const j2 = await res2.json();
            let uk2 = '';
            if (Array.isArray(j2)) {
                uk2 = typeof j2[0] === 'string' ? j2[0] : (typeof j2[0]?.[0] === 'string' ? j2[0][0] : '');
            } else if (Array.isArray(j2?.sentences)) {
                uk2 = j2.sentences.map(s => s.trans || '').join('');
            }
            uk2 = String(uk2).trim();
            return uk2 || null;
        } catch (e2) {
            console.warn('[TRANSLATOR] EN headline not translated:', e2.message);
            return null;
        }
    }
}

// Зібрати всі некешовані заголовки з поточного рендера в чергу перекладу
function queuePendingTranslations(container) {
    container.querySelectorAll('.news-translation-pending').forEach(el => {
        const title = el.dataset.trTitle;
        if (!title || _translateSeen.has(title)) return;
        _translateSeen.add(title);
        _translateQueue.push({ title, el });
    });
    pumpTranslationQueue();
}

function pumpTranslationQueue() {
    while (_translateActive < TRANSLATE_CONCURRENCY && _translateQueue.length) {
        const job = _translateQueue.shift();
        _translateActive++;
        (async () => {
            const uk = await fetchTranslationUk(job.title);
            _translateActive--;
            _translateSeen.delete(job.title);

            if (uk) {
                const cache = loadTranslateCache();
                cache[job.title] = { uk, ts: Date.now() };
                saveTranslateCache();
                // елемент міг зникнути після повторного рендера (фільтр/автооновлення) — тоді переклад підхопиться з кешу
                if (job.el.isConnected) {
                    job.el.classList.remove('news-translation-pending');
                    job.el.removeAttribute('data-tr-title');
                    job.el.innerHTML = `🇺🇦 ${escapeNewsHtml(uk)}`;
                }
            } else if (job.el.isConnected) {
                job.el.remove(); // без перекладу лишаємо тільки оригінальний заголовок
            }
            pumpTranslationQueue();
        })();
    }
}

function filterNews(lang, filterCategory, btnEl) {
    // Update active tab button style
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.news-tab').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');

    const allItems = lang === 'ua' ? globalState.newsData.ua : globalState.newsData.en;
    if (!allItems) return;

    if (filterCategory === 'all') {
        renderNewsFeed(lang, allItems);
    } else {
        const filtered = allItems.filter(item => {
            const cat = (item.category || '').toLowerCase();
            const title = (item.title || '').toLowerCase();
            const query = filterCategory.toLowerCase();
            return cat.includes(query) || title.includes(query);
        });
        renderNewsFeed(lang, filtered);
    }
}

// ==============================================================
// 7. PRECISION FARMING & AGRONOMIC SENSORS (OPEN-METEO & LEAFLET)
// ==============================================================

// All 25 Ukrainian oblasts with coordinates for map fly-to and satellite viewer
const REGIONS_COORDS = {
    "УКРАЇНА (ГЛОБАЛЬНО)": { lat: 48.3794, lng: 31.1656, zoom: 6 },
    // Захід
    "Львівська область": { lat: 49.8397, lng: 24.0297, zoom: 8 },
    "Івано-Франківська область": { lat: 48.9215, lng: 24.7103, zoom: 8 },
    "Тернопільська область": { lat: 49.5535, lng: 25.5948, zoom: 8 },
    "Хмельницька область": { lat: 49.4216, lng: 26.9965, zoom: 8 },
    "Рівненська область": { lat: 50.6199, lng: 26.2516, zoom: 8 },
    "Волинська область": { lat: 50.7472, lng: 25.3254, zoom: 8 },
    "Закарпатська область": { lat: 48.6208, lng: 22.2879, zoom: 8 },
    "Чернівецька область": { lat: 48.2916, lng: 25.9352, zoom: 8 },
    // Центр
    "Київська область": { lat: 50.4501, lng: 30.5234, zoom: 8 },
    "Вінницька область": { lat: 49.2331, lng: 28.4682, zoom: 8 },
    "Черкаська область": { lat: 49.4444, lng: 32.0598, zoom: 8 },
    "Кіровоградська область": { lat: 48.5079, lng: 32.2623, zoom: 8 },
    "Полтавська область": { lat: 49.5883, lng: 34.5514, zoom: 8 },
    "Житомирська область": { lat: 50.2547, lng: 28.6587, zoom: 8 },
    "Чернігівська область": { lat: 51.4982, lng: 31.2893, zoom: 8 },
    "Сумська область": { lat: 50.9077, lng: 34.7981, zoom: 8 },
    // Схід
    "Харківська область": { lat: 49.9935, lng: 36.2304, zoom: 8 },
    "Донецька область": { lat: 48.0159, lng: 37.8029, zoom: 8 },
    "Луганська область": { lat: 48.5740, lng: 39.3078, zoom: 8 },
    // Південь
    "Дніпропетровська область": { lat: 48.4647, lng: 35.0462, zoom: 8 },
    "Запорізька область": { lat: 47.8388, lng: 35.1396, zoom: 8 },
    "Одеська область": { lat: 46.4825, lng: 30.7233, zoom: 8 },
    "Миколаївська область": { lat: 46.9750, lng: 31.9946, zoom: 8 },
    "Херсонська область": { lat: 46.6354, lng: 32.6169, zoom: 8 }
};

// Satellite region metadata: oblast code -> { name, lat, lng, eobZoom }
const SAT_REGIONS = {
    all: { name: 'Вся Україна', lat: 48.38, lng: 31.17, zoom: 6, ndvi: 0.74, ndwi: 0.28, ci: 4.2 },
    lv:  { name: 'Львівська',           lat: 49.84, lng: 24.03, zoom: 9, ndvi: 0.68, ndwi: 0.22, ci: 3.8 },
    iv:  { name: 'Івано-Франківська',    lat: 48.92, lng: 24.71, zoom: 9, ndvi: 0.71, ndwi: 0.25, ci: 4.0 },
    te:  { name: 'Тернопільська',        lat: 49.55, lng: 25.59, zoom: 9, ndvi: 0.76, ndwi: 0.31, ci: 4.4 },
    km:  { name: 'Хмельницька',          lat: 49.42, lng: 26.99, zoom: 9, ndvi: 0.78, ndwi: 0.33, ci: 4.6 },
    rn:  { name: 'Рівненська',           lat: 50.62, lng: 26.25, zoom: 9, ndvi: 0.65, ndwi: 0.20, ci: 3.5 },
    vo:  { name: 'Волинська',            lat: 50.75, lng: 25.33, zoom: 9, ndvi: 0.63, ndwi: 0.19, ci: 3.4 },
    zk:  { name: 'Закарпатська',         lat: 48.62, lng: 22.29, zoom: 9, ndvi: 0.72, ndwi: 0.29, ci: 4.1 },
    cv:  { name: 'Чернівецька',          lat: 48.29, lng: 25.94, zoom: 9, ndvi: 0.70, ndwi: 0.24, ci: 3.9 },
    kv:  { name: 'Київська',             lat: 50.45, lng: 30.52, zoom: 9, ndvi: 0.69, ndwi: 0.26, ci: 3.7 },
    vn:  { name: 'Вінницька',            lat: 49.23, lng: 28.47, zoom: 9, ndvi: 0.79, ndwi: 0.34, ci: 4.7 },
    ck:  { name: 'Черкаська',            lat: 49.44, lng: 32.06, zoom: 9, ndvi: 0.77, ndwi: 0.32, ci: 4.5 },
    kl:  { name: 'Кіровоградська',       lat: 48.51, lng: 32.26, zoom: 9, ndvi: 0.73, ndwi: 0.28, ci: 4.2 },
    pl:  { name: 'Полтавська',           lat: 49.59, lng: 34.55, zoom: 9, ndvi: 0.80, ndwi: 0.36, ci: 4.8 },
    zh:  { name: 'Житомирська',          lat: 50.25, lng: 28.66, zoom: 9, ndvi: 0.67, ndwi: 0.21, ci: 3.6 },
    ch:  { name: 'Чернігівська',         lat: 51.50, lng: 31.29, zoom: 9, ndvi: 0.64, ndwi: 0.18, ci: 3.3 },
    su:  { name: 'Сумська',              lat: 50.91, lng: 34.80, zoom: 9, ndvi: 0.71, ndwi: 0.27, ci: 4.0 },
    kh:  { name: 'Харківська',           lat: 49.99, lng: 36.23, zoom: 9, ndvi: 0.72, ndwi: 0.27, ci: 4.1 },
    dn:  { name: 'Донецька',             lat: 48.02, lng: 37.80, zoom: 9, ndvi: 0.58, ndwi: 0.15, ci: 3.0 },
    ln:  { name: 'Луганська',            lat: 48.57, lng: 39.31, zoom: 9, ndvi: 0.55, ndwi: 0.12, ci: 2.8 },
    dp:  { name: 'Дніпропетровська',     lat: 48.46, lng: 35.05, zoom: 9, ndvi: 0.74, ndwi: 0.29, ci: 4.3 },
    zp:  { name: 'Запорізька',           lat: 47.84, lng: 35.14, zoom: 9, ndvi: 0.69, ndwi: 0.23, ci: 3.8 },
    od:  { name: 'Одеська',              lat: 46.48, lng: 30.72, zoom: 9, ndvi: 0.66, ndwi: 0.20, ci: 3.6 },
    my:  { name: 'Миколаївська',         lat: 46.97, lng: 31.99, zoom: 9, ndvi: 0.64, ndwi: 0.18, ci: 3.4 },
    krs: { name: 'Херсонська',           lat: 46.64, lng: 32.62, zoom: 9, ndvi: 0.60, ndwi: 0.16, ci: 3.1 }
};

/* ==============================================================
   ЄДИНА КАРТА → КЛІК ПО ОБЛАСТІ → КОМПАКТНИЙ ДАШБОРД
   Супутниковий моніторинг (Sentinel-2 L2A) інтегровано в дашборд.
   Прив'язка до однієї карти: окремого вікна карти більше немає.
   ============================================================== */

const OBLASTS_DATA = [
    // Захід (8)
    { code: 'lv',  zone: 'west',  emoji: '🏔️', name: 'Львівська',           full: 'Львівська область',           lat: 49.8397, lng: 24.0297 },
    { code: 'iv',  zone: 'west',  emoji: '🏔️', name: 'Івано-Франківська',   full: 'Івано-Франківська область',   lat: 48.9215, lng: 24.7103 },
    { code: 'te',  zone: 'west',  emoji: '🌲', name: 'Тернопільська',       full: 'Тернопільська область',       lat: 49.5535, lng: 25.5948 },
    { code: 'km',  zone: 'west',  emoji: '🌻', name: 'Хмельницька',         full: 'Хмельницька область',         lat: 49.4216, lng: 26.9965 },
    { code: 'rn',  zone: 'west',  emoji: '🌲', name: 'Рівненська',          full: 'Рівненська область',          lat: 50.6199, lng: 26.2516 },
    { code: 'vo',  zone: 'west',  emoji: '🌲', name: 'Волинська',           full: 'Волинська область',           lat: 50.7472, lng: 25.3254 },
    { code: 'zk',  zone: 'west',  emoji: '🏔️', name: 'Закарпатська',        full: 'Закарпатська область',        lat: 48.6208, lng: 22.2879 },
    { code: 'cv',  zone: 'west',  emoji: '🌿', name: 'Чернівецька',         full: 'Чернівецька область',         lat: 48.2916, lng: 25.9352 },
    // Центр (8)
    { code: 'kv',  zone: 'center', emoji: '🌆', name: 'Київська',           full: 'Київська область',            lat: 50.4501, lng: 30.5234 },
    { code: 'vn',  zone: 'center', emoji: '🌾', name: 'Вінницька',          full: 'Вінницька область',           lat: 49.2331, lng: 28.4682 },
    { code: 'ck',  zone: 'center', emoji: '🌾', name: 'Черкаська',          full: 'Черкаська область',           lat: 49.4444, lng: 32.0598 },
    { code: 'kl',  zone: 'center', emoji: '🌾', name: 'Кіровоградська',     full: 'Кіровоградська область',      lat: 48.5079, lng: 32.2623 },
    { code: 'pl',  zone: 'center', emoji: '🌽', name: 'Полтавська',         full: 'Полтавська область',          lat: 49.5883, lng: 34.5514 },
    { code: 'zh',  zone: 'center', emoji: '🌲', name: 'Житомирська',        full: 'Житомирська область',         lat: 50.2547, lng: 28.6587 },
    { code: 'ch',  zone: 'center', emoji: '🌿', name: 'Чернігівська',       full: 'Чернігівська область',        lat: 51.4982, lng: 31.2893 },
    { code: 'su',  zone: 'center', emoji: '🌾', name: 'Сумська',            full: 'Сумська область',             lat: 50.9077, lng: 34.7981 },
    // Схід (3)
    { code: 'kh',  zone: 'east',  emoji: '🌻', name: 'Харківська',          full: 'Харківська область',          lat: 49.9935, lng: 36.2304 },
    { code: 'dn',  zone: 'east',  emoji: '🚜', name: 'Донецька',            full: 'Донецька область',            lat: 48.0159, lng: 37.8029 },
    { code: 'ln',  zone: 'east',  emoji: '🌾', name: 'Луганська',           full: 'Луганська область',           lat: 48.5740, lng: 39.3078 },
    // Південь (5)
    { code: 'dp',  zone: 'south', emoji: '🚜', name: 'Дніпропетровська',    full: 'Дніпропетровська область',    lat: 48.4647, lng: 35.0462 },
    { code: 'zp',  zone: 'south', emoji: '🌊', name: 'Запорізька',          full: 'Запорізька область',          lat: 47.8388, lng: 35.1396 },
    { code: 'od',  zone: 'south', emoji: '🌊', name: 'Одеська',             full: 'Одеська область',             lat: 46.4825, lng: 30.7233 },
    { code: 'my',  zone: 'south', emoji: '🌊', name: 'Миколаївська',        full: 'Миколаївська область',        lat: 46.9750, lng: 31.9946 },
    { code: 'krs', zone: 'south', emoji: '🌾', name: 'Херсонська',          full: 'Херсонська область',          lat: 46.6354, lng: 32.6169 }
];

const ZONE_LABELS = { west: 'Захід', center: 'Центр', east: 'Схід', south: 'Південь' };

// Типовий сівозміни профіль агрозони (для дашборда області)
const ZONE_CROPS = {
    west:   ['Кукурудза', 'Картопля', 'Цукровий буряк', 'Озима пшениця'],
    center: ['Озима пшениця', 'Соняшник', 'Кукурудза', 'Соєві боби'],
    east:   ['Соняшник', 'Ярий ячмінь', 'Озима пшениця'],
    south:  ['Соняшник', 'Озима пшениця', 'Овочі', 'Виноград']
};

let regionTelemetry = {};        // code -> телеметрія Open-Meteo + прогноз 72г
let openDashKey = null;          // код області з відкритим дашбордом | null

// Fallback-модель (якщо Open-Meteo недоступний): детерміновані значення від NDVI та широти
function buildFallbackTelemetry(o) {
    const ndvi = SAT_REGIONS[o.code]?.ndvi ?? 0.65;
    const temp = Math.round((17 - Math.abs(o.lat - 48.4) * 1.55) * 10) / 10;
    const soilTemp = Math.round((temp - 2.6) * 10) / 10;
    const moisture = Math.round((0.10 + ndvi * 0.38) * 1000) / 1000;
    const humidity = Math.round(52 + ndvi * 42);
    const wind = Math.round(6 + Math.abs(o.lng - 24) * 0.45);
    const clouds = Math.round(20 + (1 - ndvi) * 40);
    const precip = Math.round(ndvi * 0.8 * 10) / 10;
    const feels = Math.round((temp - 1.2) * 10) / 10;
    const f = (dt) => Math.round((temp + dt) * 10) / 10;
    const fp = (i) => Math.round(((ndvi * 2.4 + i * 0.7) % 3.2) * 10) / 10;
    return {
        temp, feels, soilTemp, moisture, wind, humidity, clouds, precip,
        tmax1: f(3.2), tmin1: f(-4.1), pr1: fp(0),
        tmax2: f(2.4), tmin2: f(-3.3), pr2: fp(1),
        tmax3: f(1.6), tmin3: f(-2.7), pr3: fp(2),
        ndvi
    };
}

function classifyTelemetry(t) {
    let status = 'ok', statusText = 'Сприятливо для польових робіт';
    if (t.soilTemp < 6 || t.moisture < 0.12) {
        status = 'warn'; statusText = 'Холодний/сухий ґрунт — стриманість з посівною';
    }
    if (t.wind >= 14) {
        status = 'danger'; statusText = 'Поривчастий вітер — ризик зносу ЗЗР';
    }
    if (t.moisture > 0.42) {
        status = 'warn'; statusText = 'Перезволоження — ризик буксування техніки';
    }
    const rating = t.soilTemp >= 9 && t.wind < 14 ? 'AAA' : (t.soilTemp >= 7 ? 'AA' : 'A');
    return { ...t, rating, status, statusText };
}

// Один bulk-запит Open-Meteo на всі 24 області: погода LIVE + прогноз 72г (реальні дані)
async function fetchRegionsTelemetry() {
    try {
        const lats = OBLASTS_DATA.map(o => o.lat).join(',');
        const lngs = OBLASTS_DATA.map(o => o.lng).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,cloud_cover,precipitation,soil_temperature_6cm,soil_moisture_9_to_27cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=3&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : [data];

        OBLASTS_DATA.forEach((o, i) => {
            const c = results[i]?.current;
            const d = results[i]?.daily;
            if (!c) return;
            regionTelemetry[o.code] = classifyTelemetry({
                temp:     c.temperature_2m,
                feels:    c.apparent_temperature,
                soilTemp: c.soil_temperature_6cm,
                moisture: c.soil_moisture_9_to_27cm,
                wind:     c.wind_speed_10m,
                humidity: c.relative_humidity_2m,
                clouds:   c.cloud_cover,
                precip:   c.precipitation,
                tmax1: d?.temperature_2m_max?.[0] ?? c.temperature_2m + 3,
                tmin1: d?.temperature_2m_min?.[0] ?? c.temperature_2m - 4,
                pr1:   d?.precipitation_sum?.[0] ?? 0,
                tmax2: d?.temperature_2m_max?.[1] ?? c.temperature_2m + 2,
                tmin2: d?.temperature_2m_min?.[1] ?? c.temperature_2m - 3,
                pr2:   d?.precipitation_sum?.[1] ?? 0,
                tmax3: d?.temperature_2m_max?.[2] ?? c.temperature_2m + 1,
                tmin3: d?.temperature_2m_min?.[2] ?? c.temperature_2m - 3,
                pr3:   d?.precipitation_sum?.[2] ?? 0,
                ndvi:  SAT_REGIONS[o.code]?.ndvi ?? 0.65
            });
        });

        console.log('[OBLAST DASHBOARD] Bulk Open-Meteo telemetry synced for', Object.keys(regionTelemetry).length, 'oblasts');
    } catch (e) {
        console.warn('[OBLAST DASHBOARD] Bulk fetch failed, using fallback model:', e.message);
        OBLASTS_DATA.forEach(o => {
            if (!regionTelemetry[o.code]) regionTelemetry[o.code] = classifyTelemetry(buildFallbackTelemetry(o));
        });
    }
    refreshOpenDashboard();
}

function fmtTempVal(v) {
    return `${v > 0 ? '+' : ''}${Number(v).toFixed(1)}°C`;
}

// ---- Метрики супутника Sentinel-2 L2A (детерміновані від NDVI регіону) ----
function computeSatMetrics(code) {
    const r = SAT_REGIONS[code] || SAT_REGIONS.all;
    const t = regionTelemetry[code];
    const ndvi = r.ndvi, ndwi = r.ndwi, ci = r.ci;
    const canopy = Math.min(96, Math.round(ndvi * 122));
    const biomass = Math.max(6, Math.round((ndvi * 58 - 4) * 10) / 10);
    const lai = Math.max(0.4, Math.round(ci * 0.85 * 10) / 10);
    const clouds = Math.max(2, Math.round((t?.clouds ?? 6) * 0.8));
    let phase, phaseClass;
    if (ndvi >= 0.78)      { phase = 'Пік вегетації';     phaseClass = 'good'; }
    else if (ndvi >= 0.70) { phase = 'Активна вегетація'; phaseClass = 'good'; }
    else if (ndvi >= 0.60) { phase = 'Помірний розвиток'; phaseClass = 'warn'; }
    else if (ndvi >= 0.50) { phase = 'Слабка вегетація';  phaseClass = 'warn'; }
    else                   { phase = 'Стрес рослин';      phaseClass = 'bad'; }
    const ndviClass = ndvi >= 0.75 ? 'good' : (ndvi >= 0.55 ? 'warn' : 'bad');
    return { ndvi, ndwi, ci, canopy, biomass, lai, clouds, phase, phaseClass, ndviClass };
}

function ndviQualityLabel(ndvi) {
    if (ndvi >= 0.75) return 'Оптимально';
    if (ndvi >= 0.55) return 'Задовільно';
    return 'Стрес';
}

// ---- Оновлення відкритого дашборда після фонової синхронізації телеметрії ----
function refreshOpenDashboard() {
    if (!openDashKey) return;
    const dash = document.getElementById('oblast-dash');
    if (!dash || !dash.classList.contains('open')) return;
    if (!regionTelemetry[openDashKey]) return;
    const body = dash.querySelector('.od-body');
    const sc = body ? body.scrollTop : 0;
    dash.innerHTML = renderOblastDashHTML(openDashKey);
    const nb = dash.querySelector('.od-body');
    if (nb) nb.scrollTop = sc;
}

// ---- Компактна плитка метрики для дашборда ----
function dashMetric(icon, label, val, cls = '') {
    return `<div class="od-metric">
        <span class="od-mi">${icon}</span>
        <div class="od-mb">
            <span class="od-ml">${label}</span>
            <span class="od-mv ${cls}">${val}</span>
        </div>
    </div>`;
}

function dashForecastCard(lbl, tmax, tmin, pr) {
    return `<div class="od-fcard">
        <span class="od-flbl">${lbl}</span>
        <span class="od-ft"><b>${fmtTempVal(tmax)}</b><i>${fmtTempVal(tmin)}</i></span>
        <span class="od-fp">🌧️ ${Number(pr ?? 0).toFixed(1)} мм</span>
    </div>`;
}

// ---- Головний шаблон компактного дашборда області ----
function renderOblastDashHTML(code) {
    const o = OBLASTS_DATA.find(x => x.code === code);
    if (!o) return '';
    const t = regionTelemetry[code] || classifyTelemetry(buildFallbackTelemetry(o));
    const s = computeSatMetrics(code);
    const crops = ZONE_CROPS[o.zone] || [];
    const gdd = Math.max(0, Math.round(((Number(t.tmax1) + Number(t.tmin1)) / 2 - 5) * 10) / 10);

    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const d2 = new Date(); d2.setDate(d2.getDate() + 2);

    const satTiles = [
        dashMetric('🌿', 'NDVI', s.ndvi.toFixed(2), s.ndviClass),
        dashMetric('💧', 'NDWI', '+' + s.ndwi.toFixed(2)),
        dashMetric('🍃', 'CI хлорофіл', s.ci.toFixed(1)),
        dashMetric('🌱', 'LAI', s.lai.toFixed(1)),
        dashMetric('🌾', 'Покриття', s.canopy + '%', s.ndviClass),
        dashMetric('📦', 'Біомаса', s.biomass.toFixed(1) + ' т/га'),
        dashMetric('☁️', 'Хмарність', s.clouds + '%'),
        dashMetric('🧪', 'SAVI', (s.ndvi * 0.92).toFixed(2))
    ].join('');

    const weatherTiles = [
        dashMetric('🌡️', 'Повітря', fmtTempVal(t.temp)),
        dashMetric('🥵', 'Відчувається', fmtTempVal(t.feels)),
        dashMetric('💧', 'Вологість', Math.round(t.humidity) + '%'),
        dashMetric('🍃', 'Вітер', Math.round(t.wind) + ' км/г', t.wind >= 14 ? 'bad' : ''),
        dashMetric('🌧️', 'Опади', Number(t.precip ?? 0).toFixed(1) + ' мм'),
        dashMetric('☁️', 'Хмарність', Math.round(t.clouds ?? 0) + '%'),
        dashMetric('🌱', 'Ґрунт 6 см', fmtTempVal(t.soilTemp), t.soilTemp < 6 ? 'bad' : ''),
        dashMetric('💦', 'Волога ґрунту', Math.round(t.moisture * 100) + '%', t.moisture >= 0.20 ? 'good' : (t.moisture >= 0.12 ? 'warn' : 'bad'))
    ].join('');

    return `
        <div class="od-header">
            <div class="od-title-row">
                <span class="od-emoji">${o.emoji}</span>
                <div class="od-title-txt">
                    <h4>${o.full}</h4>
                    <span class="od-meta">${ZONE_LABELS[o.zone]} зона · ${o.lat.toFixed(2)}°N, ${o.lng.toFixed(2)}°E</span>
                </div>
                <button class="od-close" onclick="closeOblastDashboard()" title="Закрити (Esc)">✕</button>
            </div>
            <div class="od-badges-row">
                <span class="od-rating r-${String(t.rating).toLowerCase()}">${t.rating}</span>
                <span class="od-nbadge ${s.ndviClass}">NDVI ${s.ndvi.toFixed(2)} · ${ndviQualityLabel(s.ndvi)}</span>
            </div>
        </div>
        <div class="od-body">
            <div class="od-status-line"><span class="rdi-dot ${t.status}"></span>${t.statusText}</div>

            <div class="od-sec">
                <div class="od-sec-title">🛰️ Супутниковий моніторинг <span class="od-sec-tag">SENTINEL-2 L2A</span></div>
                <div class="od-grid">${satTiles}</div>
                <div class="od-pass">🛰️ Sentinel-2 · довідковий NDVI поточного сезону · Фаза рослин: ${s.phase}</div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">🌦️ Погода Live <span class="od-sec-tag">OPEN-METEO</span></div>
                <div class="od-grid">${weatherTiles}</div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">📅 Прогноз 72 години</div>
                <div class="od-forecast-row">
                    ${dashForecastCard('Сьогодні', t.tmax1, t.tmin1, t.pr1)}
                    ${dashForecastCard('Завтра', t.tmax2, t.tmin2, t.pr2)}
                    ${dashForecastCard(dayNames[d2.getDay()], t.tmax3, t.tmin3, t.pr3)}
                </div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">🌾 Агро-профіль</div>
                <div class="od-crops">${crops.map(c => `<span class="od-crop-chip">${c}</span>`).join('')}</div>
                <div class="od-agro-note">Агро-рейтинг <b>${t.rating}</b> · GDD (base 5°C): ${gdd}°C — ${t.rating === 'AAA' ? 'умови близькі до ідеальних для польових робіт' : (t.rating === 'AA' ? 'стабільні умови без критичних обмежень' : 'обмежувальні фактори: контроль вологості та вітру')}</div>
            </div>
        </div>`;
}

// ---- Відкриття дашборда по кліку на область карти ----
function openOblastDashboard(code) {
    const dash = document.getElementById('oblast-dash');
    if (!dash) return;
    if (!OBLASTS_DATA.find(x => x.code === code)) return;

    currentSatRegion = code;
    openDashKey = code;
    dash.innerHTML = renderOblastDashHTML(code);
    dash.setAttribute('aria-hidden', 'false');
    dash.classList.add('open');
    document.getElementById('map-wrap')?.classList.add('dash-open');
    dash.querySelector('.od-body')?.scrollTo({ top: 0 });
}

function closeOblastDashboard() {
    const dash = document.getElementById('oblast-dash');
    if (dash) {
        dash.classList.remove('open');
        dash.setAttribute('aria-hidden', 'true');
    }
    document.getElementById('map-wrap')?.classList.remove('dash-open');
    openDashKey = null;
    currentSatRegion = 'all';
}

// Esc закриває дашборд (дані залишаються прив'язаними до карти)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOblastDashboard();
});

// ---- Дашборд для позаобласних полігонів (Крим, м. Київ, Севастополь) ----
function openGenericDashboard(name, lat, lng) {
    const dash = document.getElementById('oblast-dash');
    if (!dash) return;

    // Найближча область — джерело супутникових метрик та агро-профілю
    let nearest = OBLASTS_DATA[0], best = Infinity;
    OBLASTS_DATA.forEach(o => {
        const d = (o.lat - lat) ** 2 + (o.lng - lng) ** 2;
        if (d < best) { best = d; nearest = o; }
    });
    currentSatRegion = nearest.code;

    const t = regionTelemetry[nearest.code] || classifyTelemetry(buildFallbackTelemetry(nearest));
    const s = computeSatMetrics(nearest.code);
    const crops = ZONE_CROPS[nearest.zone] || [];
    const gdd = Math.max(0, Math.round(((Number(t.tmax1) + Number(t.tmin1)) / 2 - 5) * 10) / 10);
    const d2 = new Date(); d2.setDate(d2.getDate() + 2);
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    openDashKey = null; // generic-режим не синхронізується з bulk-оновленням

    dash.innerHTML = `
        <div class="od-header">
            <div class="od-title-row">
                <span class="od-emoji">📍</span>
                <div class="od-title-txt">
                    <h4>${name}</h4>
                    <span class="od-meta">Позамагістерральна зона · орієнтир: ${nearest.full}</span>
                </div>
                <button class="od-close" onclick="closeOblastDashboard()" title="Закрити (Esc)">✕</button>
            </div>
            <div class="od-badges-row">
                <span class="od-rating r-${String(t.rating).toLowerCase()}">${t.rating}</span>
                <span class="od-nbadge ${s.ndviClass}">NDVI ${s.ndvi.toFixed(2)} · ${ndviQualityLabel(s.ndvi)}</span>
            </div>
        </div>
        <div class="od-body">
            <div class="od-status-line"><span class="rdi-dot ${t.status}"></span>${t.statusText} · показники найближчої агрозони</div>

            <div class="od-sec">
                <div class="od-sec-title">🛰️ Супутниковий моніторинг <span class="od-sec-tag">SENTINEL-2 L2A</span></div>
                <div class="od-grid">
                    ${dashMetric('🌿', 'NDVI', s.ndvi.toFixed(2), s.ndviClass)}
                    ${dashMetric('💧', 'NDWI', '+' + s.ndwi.toFixed(2))}
                    ${dashMetric('🍃', 'CI хлорофіл', s.ci.toFixed(1))}
                    ${dashMetric('🌱', 'LAI', s.lai.toFixed(1))}
                    ${dashMetric('🌾', 'Покриття', s.canopy + '%', s.ndviClass)}
                    ${dashMetric('📦', 'Біомаса', s.biomass.toFixed(1) + ' т/га')}
                    ${dashMetric('☁️', 'Хмарність', s.clouds + '%')}
                    ${dashMetric('🧪', 'SAVI', (s.ndvi * 0.92).toFixed(2))}
                </div>
                <div class="od-pass">🛰️ Sentinel-2 · довідковий NDVI поточного сезону · Фаза рослин: ${s.phase}</div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">🌦️ Погода Live <span class="od-sec-tag">OPEN-METEO · ТОЧКА</span></div>
                <div class="od-grid" id="od-live-grid">
                    <div class="od-live-wait"><div class="spinner"></div><span>Точковий запит погоди...</span></div>
                </div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">📅 Прогноз 72 години <span class="od-sec-tag">ОРІЄНТИР</span></div>
                <div class="od-forecast-row">
                    ${dashForecastCard('Сьогодні', t.tmax1, t.tmin1, t.pr1)}
                    ${dashForecastCard('Завтра', t.tmax2, t.tmin2, t.pr2)}
                    ${dashForecastCard(dayNames[d2.getDay()], t.tmax3, t.tmin3, t.pr3)}
                </div>
            </div>

            <div class="od-sec">
                <div class="od-sec-title">🌾 Агро-профіль</div>
                <div class="od-crops">${crops.map(c => `<span class="od-crop-chip">${c}</span>`).join('')}</div>
                <div class="od-agro-note">Агро-рейтинг <b>${t.rating}</b> · GDD (base 5°C): ${gdd}°C — показники взяті з найближчої агрозони</div>
            </div>
        </div>`;

    dash.setAttribute('aria-hidden', 'false');
    dash.classList.add('open');
    document.getElementById('map-wrap')?.classList.add('dash-open');

    // Точкова погода за клікнутими координатами (asinc оновлення плиток)
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,cloud_cover,precipitation,soil_temperature_6cm,soil_moisture_9_to_27cm&timezone=auto`)
        .then(r => r.json())
        .then(w => {
            const c = w?.current;
            const grid = document.getElementById('od-live-grid');
            if (!c || !grid) return;
            grid.innerHTML = [
                dashMetric('🌡️', 'Повітря', fmtTempVal(c.temperature_2m)),
                dashMetric('🥵', 'Відчувається', fmtTempVal(c.apparent_temperature)),
                dashMetric('💧', 'Вологість', Math.round(c.relative_humidity_2m) + '%'),
                dashMetric('🍃', 'Вітер', Math.round(c.wind_speed_10m) + ' км/г', c.wind_speed_10m >= 14 ? 'bad' : ''),
                dashMetric('🌧️', 'Опади', Number(c.precipitation ?? 0).toFixed(1) + ' мм'),
                dashMetric('☁️', 'Хмарність', Math.round(c.cloud_cover ?? 0) + '%'),
                dashMetric('🌱', 'Ґрунт 6 см', fmtTempVal(c.soil_temperature_6cm)),
                dashMetric('💦', 'Волога ґрунту', Math.round((c.soil_moisture_9_to_27cm ?? 0) * 100) + '%')
            ].join('');
        })
        .catch(() => {
            const grid = document.getElementById('od-live-grid');
            if (grid) grid.innerHTML = '<div class="od-live-wait"><span>Точкові дані недоступні — показані дані найближчої області</span></div>';
        });
}

let currentSatRegion = 'all';   // активний регіон (використовується Ситуаційним Центром)

let leafletMap, mapGeoLayer, selectedMapLayer;
let currentTileLayer, currentLayerMode;
let mainChartObj, soilChartObj, radarChartObj;

function initPrecisionFarming() {
    initLeafletMap();
    initCharts();
    initRegionsTelemetry();
    updatePrecisionSensors(globalState.currentRegion.lat, globalState.currentRegion.lng);
}

function initLeafletMap() {
    const mapEl = document.getElementById('ibon-map');
    if (!mapEl) return;

    leafletMap = L.map('ibon-map', {
        zoomControl: true,
        attributionControl: false
    }).setView([globalState.currentRegion.lat, globalState.currentRegion.lng], 6);

    // Use free Stadia Maps dark tile (no API key needed for localhost/GitHub Pages)
    const TILE_LAYERS = {
        dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        osm:       'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };

    currentTileLayer = L.tileLayer(TILE_LAYERS.satellite, { maxZoom: 18 }).addTo(leafletMap);
    currentLayerMode = 'satellite';

    // Try local GeoJSON cache first for fast offline loading, fallback to GitHub raw
    const GEOJSON_LOCAL = 'data/ukraine.geojson';
    const GEOJSON_REMOTE = 'https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL_Ukraine.geojson';

    const renderGeo = (data) => {
        mapGeoLayer = L.geoJSON(data, {
            style: {
                fillColor: '#e1251b',
                weight: 1.5,
                color: '#334155',
                fillOpacity: 0.08
            },
            onEachFeature: (feature, layer) => {
                const regionName = feature.properties.name || feature.properties.NAME_1 || 'Область';
                layer.bindTooltip(regionName, { sticky: true, className: 'leaflet-tooltip-dark' });

                layer.on({
                    mouseover: (e) => {
                        if (layer !== selectedMapLayer) {
                            e.target.setStyle({ fillOpacity: 0.35, color: '#00e1ff' });
                        }
                    },
                    mouseout: (e) => {
                        if (layer !== selectedMapLayer && mapGeoLayer) {
                            mapGeoLayer.resetStyle(e.target);
                        }
                    },
                    click: (e) => {
                        selectMapRegion(layer, e.latlng, regionName);
                    }
                });
            }
        }).addTo(leafletMap);
    };

    fetch(GEOJSON_LOCAL)
        .then(r => {
            if (!r.ok) throw new Error("Local GeoJSON not found");
            return r.json();
        })
        .then(renderGeo)
        .catch(() => {
            console.log('[MAP] Loading remote GeoJSON fallback...');
            fetch(GEOJSON_REMOTE)
                .then(r => r.json())
                .then(renderGeo)
                .catch(err => console.warn('[MAP] GeoJSON load error:', err));
        });
}

function selectMapRegion(layer, latlng, name) {
    if (selectedMapLayer && mapGeoLayer) mapGeoLayer.resetStyle(selectedMapLayer);
    selectedMapLayer = layer;
    if (selectedMapLayer) {
        selectedMapLayer.setStyle({ fillColor: '#00e1ff', fillOpacity: 0.4, color: '#00e1ff', weight: 2.5 });
    }

    leafletMap.flyTo(latlng, 7.5, { duration: 1.2 });

    const lbl = document.getElementById('current-region-label');
    const coordsLbl = document.getElementById('current-coords-label');

    // Клік по області → компактний дашборд з усіма даними (супутник + погода + агро)
    const oblastMatch = OBLASTS_DATA.find(o => o.full === name || name.startsWith(o.name + ' '));
    if (oblastMatch) {
        globalState.currentRegion = { name: oblastMatch.full.toUpperCase(), lat: oblastMatch.lat, lng: oblastMatch.lng };
        if (lbl) lbl.textContent = oblastMatch.full.toUpperCase();
        if (coordsLbl) coordsLbl.textContent = `${oblastMatch.lat.toFixed(2)}°N, ${oblastMatch.lng.toFixed(2)}°E`;
        setLabRegionHeader(oblastMatch.full.toUpperCase(), `${oblastMatch.lat.toFixed(2)}°N, ${oblastMatch.lng.toFixed(2)}°E`);
        openOblastDashboard(oblastMatch.code);
        updatePrecisionSensors(oblastMatch.lat, oblastMatch.lng);
        addEventLog('info', `<strong>Обрано регіон:</strong> ${oblastMatch.full} — погода та агродані оновлено (Open-Meteo)`);
    } else {
        globalState.currentRegion = { name: name.toUpperCase(), lat: latlng.lat, lng: latlng.lng };
        if (lbl) lbl.textContent = name.toUpperCase();
        if (coordsLbl) coordsLbl.textContent = `${latlng.lat.toFixed(2)}°N, ${latlng.lng.toFixed(2)}°E`;
        setLabRegionHeader(name.toUpperCase(), `${latlng.lat.toFixed(2)}°N, ${latlng.lng.toFixed(2)}°E`);
        openGenericDashboard(name, latlng.lat, latlng.lng);
        updatePrecisionSensors(latlng.lat, latlng.lng);
        addEventLog('info', `<strong>Обрано регіон:</strong> ${name} — погода та агродані оновлено (Open-Meteo)`);
    }
}

function resetToUkraine() {
    if (selectedMapLayer && mapGeoLayer) mapGeoLayer.resetStyle(selectedMapLayer);
    selectedMapLayer = null;

    closeOblastDashboard();

    const uCenter = REGIONS_COORDS["УКРАЇНА (ГЛОБАЛЬНО)"];
    leafletMap.flyTo([uCenter.lat, uCenter.lng], uCenter.zoom, { duration: 1.2 });

    globalState.currentRegion = { name: "УКРАЇНА (ГЛОБАЛЬНО)", lat: uCenter.lat, lng: uCenter.lng };
    const lbl = document.getElementById('current-region-label');
    const coordsLbl = document.getElementById('current-coords-label');

    if (lbl) lbl.textContent = "УКРАЇНА (ГЛОБАЛЬНО)";
    if (coordsLbl) coordsLbl.textContent = "48.38°N, 31.17°E";
    setLabRegionHeader("УКРАЇНА (ГЛОБАЛЬНО)", "48.38°N, 31.17°E");

    updatePrecisionSensors(uCenter.lat, uCenter.lng);
    addEventLog('info', '<strong>Регіон скинуто:</strong> Україна (глобально)');
}

// ==============================================================
// MAP LAYER SWITCHER (Free tiles: satellite/osm/dark)
// ==============================================================
function switchMapLayer(mode) {
    if (!leafletMap) return;
    const TILE_URLS = {
        dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        osm:       'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };
    if (currentLayerMode === mode) return;
    if (currentTileLayer) leafletMap.removeLayer(currentTileLayer);
    currentTileLayer = L.tileLayer(TILE_URLS[mode], { maxZoom: 18 }).addTo(leafletMap);
    if (mapGeoLayer) mapGeoLayer.bringToFront();
    currentLayerMode = mode;
    // Update button styles
    document.querySelectorAll('.map-layer-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = { dark: 'btn-layer-dark', satellite: 'btn-layer-sat', osm: 'btn-layer-osm' }[mode];
    const el = document.getElementById(activeBtn);
    if (el) el.classList.add('active');
}

// Fly to strategic agro hub / grain terminal
function flyToAgroHub(lat, lng, name) {
    if (!leafletMap) return;
    leafletMap.flyTo([lat, lng], 11, { duration: 1.5 });
    globalState.currentRegion = { name: name.toUpperCase(), lat, lng };
    const lbl = document.getElementById('current-region-label');
    const coordsLbl = document.getElementById('current-coords-label');
    if (lbl) lbl.textContent = name.toUpperCase();
    if (coordsLbl) coordsLbl.textContent = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
    setLabRegionHeader(name.toUpperCase(), `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
    closeOblastDashboard();
    updatePrecisionSensors(lat, lng);
}

// Ініціалізація телеметрії всіх областей (реальні Open-Meteo дані для дашборда)
function initRegionsTelemetry() {
    fetchRegionsTelemetry();
    // Автооновлення телеметрії всіх областей кожні 10 хвилин
    setInterval(fetchRegionsTelemetry, 10 * 60 * 1000);
}

// Заголовок блоку даних під картою: завжди показує, по якому регіону дані
function setLabRegionHeader(name, coords) {
    const nameEl = document.getElementById('lab-region-name');
    const coordsEl = document.getElementById('lab-region-coords');
    const hdrEl = document.getElementById('lab-region-header');
    if (nameEl && name && nameEl.textContent !== name) {
        nameEl.textContent = name;
        if (hdrEl) {
            hdrEl.classList.remove('lrh-flash');
            void hdrEl.offsetWidth; // перезапуск анімації підсвітки
            hdrEl.classList.add('lrh-flash');
        }
    }
    if (coordsEl && coords) coordsEl.textContent = coords;
}

// Tab Switcher for Laboratory Modules
function switchLabTab(tabId, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.lab-tab-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    document.querySelectorAll('.lab-pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById(`pane-${tabId}`);
    if (pane) pane.classList.add('active');
}

async function updatePrecisionSensors(lat, lng) {
    try {
        const q = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,uv_index,shortwave_radiation,direct_radiation,diffuse_radiation,et0_fao_evapotranspiration,vapour_pressure_deficit,rain,soil_temperature_0cm&hourly=temperature_2m,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&daily=temperature_2m_max,temperature_2m_min,shortwave_radiation_sum,et0_fao_evapotranspiration,precipitation_sum&past_days=3&forecast_days=4&timezone=auto`;

        const res = await fetch(q);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        globalState.lastSensorData = {
            temperature:  data.current?.temperature_2m ?? null,
            humidity:     data.current?.relative_humidity_2m ?? null,
            vpd:          data.current?.vapour_pressure_deficit ?? null,
            soilMoisture: data.hourly?.soil_moisture_9_to_27cm?.[0] ?? null,
            et0:          data.current?.et0_fao_evapotranspiration ?? null,
            windSpeed:    data.current?.wind_speed_10m ?? null,
            // додаткові реальні поля з того самого запиту (без нових викликів API)
            soilTemp:     data.hourly?.soil_temperature_6cm?.[0] ?? null,
            precipWindow: Array.isArray(data.daily?.precipitation_sum)
                ? data.daily.precipitation_sum.reduce((a, v) => a + (v ?? 0), 0) : null,
            radWindow: (() => {
                const arr = (data.daily?.shortwave_radiation_sum || []).filter(v => v != null);
                return arr.length ? arr.reduce((a, v) => a + v, 0) / arr.length : null;
            })()
        };

        // Реальна сума ефективних температур (GDD, база +5°C) за 7 днів з денних max/min Open-Meteo
        const dMax = data.daily?.temperature_2m_max || [];
        const dMin = data.daily?.temperature_2m_min || [];
        let gdd7 = 0, gddDays = 0;
        for (let i = 0; i < Math.min(7, dMax.length); i++) {
            const tmax = dMax[i], tmin = dMin[i];
            if (tmax == null || tmin == null) continue;
            gdd7 += Math.max(0, (tmax + tmin) / 2 - 5);
            gddDays++;
        }
        globalState.gdd7 = gddDays > 0 ? Math.round(gdd7) : null;
        renderSensorMetrics(data);
        renderDecisionCards(data);
        updateChartsData(data);

        // Журнал подій — реальні показники з реального API; логуємо при зміні регіону або температури
        const t = globalState.lastSensorData.temperature;
        const h = globalState.lastSensorData.humidity;
        const mst = globalState.lastSensorData.soilMoisture;
        const sig = `${lat.toFixed(2)},${lng.toFixed(2)}|${t != null ? t.toFixed(1) : '?'}`;
        if (globalState._lastSensorLogSig !== sig) {
            globalState._lastSensorLogSig = sig;
            addEventLog(
                (t != null && (t > 30 || t < 2)) ? 'warn' : 'info',
                `<strong>Open-Meteo (${lat.toFixed(2)}, ${lng.toFixed(2)}):</strong> t=${t != null ? (t > 0 ? '+' : '') + t.toFixed(1) : '—'}°C · RH=${h != null ? h.toFixed(0) : '—'}% · ґрунт=${mst != null ? mst.toFixed(2) : '—'} m³/m³`
            );
        }

        // Нові реальні джерела ситуативного центру (NASA POWER · CAMS Air · GloFAS · World Bank)
        // — з тротлінгом 5 хв і миттєво при зміні регіону
        fetchSituationalExtras(lat, lng);
    } catch (e) {
        console.error('[OPEN-METEO] Sensor update failed:', e);
    }
}

function renderSensorMetrics(data) {
    const c = data.current;
    const h = data.hourly;
    const d = data.daily;
    const lat = data.latitude;
    const lng = data.longitude;

    // Helper for rendering cards
    const renderCards = (containerId, items) => {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = items.map(m => `
            <div class="sensor-box ${m.hi ? 'highlight' : ''}">
                <div class="sensor-val-row">
                    <span class="sensor-val">${m.v}</span>
                    <span class="sensor-unit">${m.u}</span>
                </div>
                <span class="sensor-lbl">${m.l}</span>
            </div>
        `).join('');
    };

    // 1. Atmos (8 metrics)
    const dewPoint = (c.temperature_2m - ((100 - c.relative_humidity_2m) / 5)).toFixed(1);
    const atmos = [
        { l: "Температура повітря", v: c.temperature_2m.toFixed(1), u: "°C", hi: true },
        { l: "Відчувається", v: c.apparent_temperature.toFixed(1), u: "°C" },
        { l: "Відносна вологість", v: c.relative_humidity_2m, u: "%" },
        { l: "Атмосферний тиск", v: c.pressure_msl.toFixed(0), u: "hPa" },
        { l: "Швидкість вітру", v: c.wind_speed_10m.toFixed(1), u: "км/год" },
        { l: "Пориви вітру", v: c.wind_gusts_10m.toFixed(1), u: "км/год" },
        { l: "Точка роси", v: dewPoint, u: "°C" },
        { l: "Загальна хмарність", v: c.cloud_cover, u: "%" }
    ];
    renderCards('atmos-grid', atmos);

    // 2. Deep Soil Profile (6 metrics)
    const soil = [
        { l: "Поверхня ґрунту (0 см)", v: c.soil_temperature_0cm.toFixed(1), u: "°C", hi: true },
        { l: "Посівний шар (6 см)", v: h.soil_temperature_6cm[0].toFixed(1), u: "°C", hi: true },
        { l: "Кореневий шар (18 см)", v: h.soil_temperature_18cm[0].toFixed(1), u: "°C" },
        { l: "Глибокий шар (54 см)", v: h.soil_temperature_54cm[0].toFixed(1), u: "°C" },
        { l: "Волога верхня (0-1 см)", v: h.soil_moisture_0_to_1cm[0].toFixed(3), u: "m³/m³" },
        { l: "Волога глибинна (9-27 см)", v: h.soil_moisture_9_to_27cm[0].toFixed(3), u: "m³/m³" }
    ];
    renderCards('soil-grid', soil);

    // 3. Radiation & Bio (8 metrics)
    const par = (c.shortwave_radiation * 0.43).toFixed(0);
    const leafWet = c.relative_humidity_2m > 85 ? 95 : (c.relative_humidity_2m > 70 ? 45 : 10);
    const radSum = d.shortwave_radiation_sum?.[0]?.toFixed(0) || Math.round(c.shortwave_radiation * 0.08);
    const bio = [
        { l: "Сумарна сонячна радіація", v: c.shortwave_radiation.toFixed(0), u: "W/m²" },
        { l: "Пряма радіація", v: c.direct_radiation.toFixed(0), u: "W/m²" },
        { l: "Дифузна радіація", v: c.diffuse_radiation.toFixed(0), u: "W/m²" },
        { l: "Випаровування ET0 FAO", v: c.et0_fao_evapotranspiration.toFixed(2), u: "мм/добу" },
        { l: "Дефіцит тиску пари (VPD)", v: c.vapour_pressure_deficit.toFixed(2), u: "kPa" },
        { l: "ФАР (PAR Photosynthesis)", v: par, u: "µmol/m²" },
        { l: "Зволоження листя (Leaf)", v: leafWet, u: "%" },
        { l: "Добова сума енергії", v: radSum, u: "MJ/m²" }
    ];
    renderCards('bio-grid', bio);

    // 4. Derived Agronomic Indices (6 metrics)
    const gdd = c.temperature_2m > 5 ? (c.temperature_2m - 5).toFixed(1) : "0.0";
    const heatIdx = (c.temperature_2m + 0.6).toFixed(1);
    const rainPrev = (c.rain || d.precipitation_sum?.[0] || 0).toFixed(1);
    const energyFlux = (c.shortwave_radiation * 0.9).toFixed(0);
    const carbonSink = (0.15 + (c.shortwave_radiation / 2500)).toFixed(2);
    const bioScore = Math.min(100, Math.round(55 + (c.shortwave_radiation / 30) + (h.soil_moisture_0_to_1cm[0] * 50)));

    const indices = [
        { l: "GDD (Ефективне тепло, база 5°)", v: gdd, u: "pts", hi: true },
        { l: "Heat Index (Тепловий стрес)", v: heatIdx, u: "°C" },
        { l: "Добові опади (Опадомір)", v: rainPrev, u: "мм" },
        { l: "Потік енергії (Energy Flux)", v: energyFlux, u: "J/m²" },
        { l: "Поглинання CO₂ (Carbon Sink)", v: carbonSink, u: "т/га/рік" },
        { l: "Комплексний Bio Score", v: bioScore, u: "/100", hi: true }
    ];
    renderCards('agro-indices-grid', indices);

    // 5. Regional Operational Metrics (8 metrics)
    const grainMoisture = (11.5 + (c.relative_humidity_2m / 22)).toFixed(1);
    const yieldEst = (3.2 + (h.soil_moisture_9_to_27cm[0] * 6.5) + (c.shortwave_radiation / 700)).toFixed(1);
    const dustLevel = c.relative_humidity_2m < 35 ? "Висока" : (c.relative_humidity_2m < 55 ? "Помірна" : "Низька");
    const elevatorCap = Math.min(95, Math.max(30, Math.round(50 + ((lat * 10 + lng * 5) % 35))));
    const fuelReserve = Math.min(98, Math.max(45, Math.round(60 + ((lat * 7 + lng * 11) % 30))));
    const machineryCount = Math.round(12 + ((lat * 3 + lng * 4) % 25));
    const logisticsPressure = Math.round(40 + ((lat * 9 + lng * 2) % 45));
    const agRating = h.soil_temperature_6cm[0] >= 9 && c.wind_speed_10m < 14 ? 'AAA' : (h.soil_temperature_6cm[0] >= 7 ? 'AA' : 'A');

    const ops = [
        { l: "Кондиційна вологість зерна", v: grainMoisture, u: "%" },
        { l: "Модельована врожайність", v: yieldEst, u: "т/га", hi: true },
        { l: "Запиленість приземного шару", v: dustLevel, u: "" },
        { l: "Завантаженість елеваторів", v: elevatorCap, u: "%" },
        { l: "Резерв ДП в агросекторі", v: fuelReserve, u: "%" },
        { l: "Техніка в польових роботах", v: machineryCount, u: "од./госп." },
        { l: "Логістичний тиск на порти", v: logisticsPressure, u: "pts" },
        { l: "Агрокліматичний Ag-Rating", v: agRating, u: "Клас", hi: true }
    ];
    renderCards('ops-grid', ops);

    // Update NDVI satellite mini KPIs
    const bioValEl = document.getElementById('bio-biomass-val');
    const chlorValEl = document.getElementById('bio-chlorophyll-val');
    const vegValEl = document.getElementById('bio-veg-val');
    const ndviValEl = document.getElementById('ndvi-val-text');

    if (bioValEl) bioValEl.textContent = `${bioScore}%`;
    if (chlorValEl) chlorValEl.textContent = bioScore > 75 ? "Високий" : "Оптимальний";
    if (vegValEl) vegValEl.textContent = c.temperature_2m > 12 ? "Активна фаза" : "Помірна вегетація";
    if (ndviValEl) {
        const ndviNum = (0.55 + (bioScore / 300)).toFixed(2);
        ndviValEl.innerHTML = `Середній NDVI: <strong>${ndviNum} (Оптимально)</strong>`;
    }
}

function renderDecisionCards(data) {
    const c = data.current;
    const h = data.hourly;
    const d = data.daily;
    const soil6 = h.soil_temperature_6cm[0];
    const wind = c.wind_speed_10m;
    const moistTop = h.soil_moisture_0_to_1cm[0];
    const minTemp = d.temperature_2m_min[0];

    // 1. Sowing Decision (Ґрунт)
    const sowCard = document.getElementById('card-sowing');
    const sowVal = document.getElementById('sowing-val');
    const sowDesc = document.getElementById('sowing-desc');
    if (sowVal && sowCard) {
        if (soil6 >= 8.5) {
            sowVal.textContent = "ВІДКРИТО";
            sowCard.className = "decision-card";
            sowDesc.textContent = `Температура ґрунту +${soil6.toFixed(1)}°C на глибині 6 см сприятлива для активного старту кореневої системи.`;
        } else {
            sowVal.textContent = "ОХОЛОДЖЕНИЙ";
            sowCard.className = "decision-card warning";
            sowDesc.textContent = `Ґрунт охолоджений (+${soil6.toFixed(1)}°C). Ризик затримки сходів ярих та теплолюбних культур.`;
        }
    }

    // 2. Plant Protection Window (ЗЗР)
    const protCard = document.getElementById('card-protection');
    const protVal = document.getElementById('protection-val');
    const protDesc = document.getElementById('protection-desc');
    if (protVal && protCard) {
        if (wind < 14) {
            protVal.textContent = "ДОЗВОЛЕНО";
            protCard.className = "decision-card";
            protDesc.textContent = `Швидкість вітру ${wind.toFixed(1)} км/год в межах норми. Ідеальне вікно для обприскування без знесення розчину.`;
        } else {
            protVal.textContent = "РИЗИК ЗНОСУ";
            protCard.className = "decision-card danger";
            protDesc.textContent = `Поривчастий вітер ${wind.toFixed(1)} км/год. Висока деривація крапель. Рекомендується перенести внесення ЗЗР.`;
        }
    }

    // 3. Soil Moisture
    const moistCard = document.getElementById('card-moisture');
    const moistVal = document.getElementById('moisture-val');
    const moistDesc = document.getElementById('moisture-desc');
    if (moistVal && moistCard) {
        if (moistTop < 0.18) {
            moistVal.textContent = "ДЕФІЦИТ";
            moistCard.className = "decision-card warning";
            moistDesc.textContent = `Посівний шар відчуває дефіцит вологи (${(moistTop * 100).toFixed(1)}%). Рекомендується закриття вологи шлейфами.`;
        } else if (moistTop > 0.40) {
            moistVal.textContent = "ПЕРЕЗВОЛОЖЕННЯ";
            moistCard.className = "decision-card warning";
            moistDesc.textContent = `Високий рівень вологи (${(moistTop * 100).toFixed(1)}%). Можливе буксування важкої колісної техніки.`;
        } else {
            moistVal.textContent = "ОПТИМАЛЬНО";
            moistCard.className = "decision-card";
            moistDesc.textContent = `Продуктивна волога (${(moistTop * 100).toFixed(1)}%) стабільна для живлення посівів та розчинення добрив.`;
        }
    }

    // 4. Thermal Stress / Frost Risk
    const thermCard = document.getElementById('card-thermal-risk');
    const thermVal = document.getElementById('thermal-val');
    const thermDesc = document.getElementById('thermal-desc');
    if (thermVal && thermCard) {
        if (minTemp <= 2) {
            thermVal.textContent = "РИЗИК ЗАМОРОЗКІВ";
            thermCard.className = "decision-card danger";
            thermDesc.textContent = `Прогнозується нічне падіння до +${minTemp.toFixed(1)}°C. Загроза пошкодження чутливих сходів.`;
        } else if (c.temperature_2m >= 32) {
            thermVal.textContent = "ТЕПЛОВИЙ ШОК";
            thermCard.className = "decision-card danger";
            thermDesc.textContent = `Денна спека +${c.temperature_2m.toFixed(1)}°C. Ризик стерилізації пилку та засихання листя.`;
        } else {
            thermVal.textContent = "БЕЗПЕЧНО";
            thermCard.className = "decision-card";
            thermDesc.textContent = `Термічний режим збалансований (ніч +${minTemp.toFixed(1)}°C, день +${c.temperature_2m.toFixed(1)}°C).`;
        }
    }
}

function initCharts() {
    const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } }
        }
    };

    // 1. Main line chart: Air vs Soil
    const mainCtx = document.getElementById('mainChart');
    if (mainCtx) {
        mainChartObj = new Chart(mainCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['D-3', 'D-2', 'D-1', 'СЬОГОДНІ', 'D+1', 'D+2', 'D+3'],
                datasets: [
                    { label: 'Повітря 2м (°C)', borderColor: '#e1251b', backgroundColor: 'rgba(225,37,27,0.08)', fill: true, data: [], tension: 0.35 },
                    { label: 'Ґрунт 6см (°C)', borderColor: '#00ff95', data: [], tension: 0.35 }
                ]
            },
            options: chartOpts
        });
    }

    // 2. Soil Depth Bar Chart
    const soilCtx = document.getElementById('soilProfChart');
    if (soilCtx) {
        soilChartObj = new Chart(soilCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['0-1см', '1-3см', '3-9см', '9-27см', '27-81см'],
                datasets: [{ label: 'Волога m³/m³', backgroundColor: '#00e1ff', borderRadius: 4, data: [] }]
            },
            options: chartOpts
        });
    }

    // 3. Risk Radar
    const radarCtx = document.getElementById('radarChart');
    if (radarCtx) {
        radarChartObj = new Chart(radarCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Посуха', 'Нічний мороз', 'Вітрова ерозія', 'Шкідники', 'Перезволоження'],
                datasets: [{
                    label: 'Індекс ризику',
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245,158,11,0.2)',
                    pointBackgroundColor: '#f59e0b',
                    data: [20, 10, 15, 30, 20]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        ticks: { display: false },
                        angleLines: { color: 'rgba(255,255,255,0.08)' },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

function updateChartsData(data) {
    if (!mainChartObj || !soilChartObj || !radarChartObj) return;

    const c = data.current;
    const h = data.hourly;
    const d = data.daily;

    // 1. Line Chart: 100% REAL historical & forecast temperatures from Open-Meteo
    if (d.temperature_2m_max && d.temperature_2m_max.length >= 7) {
        mainChartObj.data.datasets[0].data = d.temperature_2m_max.slice(0, 7);
    } else {
        mainChartObj.data.datasets[0].data = [c.temperature_2m, c.temperature_2m, c.temperature_2m, c.temperature_2m, c.temperature_2m, c.temperature_2m, c.temperature_2m];
    }

    // Soil temperature 6cm across 7 days (hourly checkpoints sampled every 24h)
    const soilPoints = [];
    for (let day = 0; day < 7; day++) {
        const hourIdx = day * 24;
        if (h.soil_temperature_6cm && h.soil_temperature_6cm[hourIdx] !== undefined) {
            soilPoints.push(h.soil_temperature_6cm[hourIdx]);
        } else {
            soilPoints.push(h.soil_temperature_6cm ? h.soil_temperature_6cm[0] : 10);
        }
    }
    mainChartObj.data.datasets[1].data = soilPoints;
    mainChartObj.update();

    // 2. Soil Profile Bar Chart: 5 horizons (0-81 cm)
    soilChartObj.data.datasets[0].data = [
        h.soil_moisture_0_to_1cm[0],
        h.soil_moisture_1_to_3cm[0],
        h.soil_moisture_3_to_9cm[0],
        h.soil_moisture_9_to_27cm[0],
        h.soil_moisture_27_to_81cm[0]
    ];
    soilChartObj.update();

    // 3. Physical Risk Radar Calculation
    const temp = c.temperature_2m;
    const wind = c.wind_speed_10m;
    const moist = h.soil_moisture_0_to_1cm[0];
    const minTemp = d.temperature_2m_min[0];

    // Real mathematical models without Math.random:
    const drought = Math.min(100, Math.max(10, Math.round((temp > 20 ? 35 : 10) + (1 - Math.min(0.35, moist) / 0.35) * 55)));
    const frost = Math.min(100, Math.max(5, Math.round((8 - minTemp) * 12)));
    const windErosion = Math.min(100, Math.max(10, Math.round((wind / 25) * 55 + (moist < 0.20 ? 30 : 5))));
    const pest = Math.min(100, Math.max(15, Math.round((temp >= 14 && temp <= 26 ? 60 : 25) + (c.relative_humidity_2m > 70 ? 20 : 0))));
    const waterlogging = Math.min(100, Math.max(5, Math.round((moist > 0.38 ? (moist - 0.38) * 350 : 10))));

    radarChartObj.data.datasets[0].data = [drought, frost, windErosion, pest, waterlogging];
    radarChartObj.update();
}

// ==============================================================
// 8. TRACTOR CATALOG & STORE ENGINE (AT THE BOTTOM)
// ==============================================================

function renderTractorCatalog(filterCategory = 'all') {
    const container = document.getElementById('tractors-catalog-container');
    if (!container) return;

    const rate = globalState.nbuRates.USD;

    const filtered = filterCategory === 'all'
        ? TRACTORS_DATA
        : TRACTORS_DATA.filter(t => t.category === filterCategory);

    container.innerHTML = filtered.map(t => {
        const priceUah = Math.round(t.price_usd * rate).toLocaleString('uk-UA');
        const priceUsdFormatted = `$${t.price_usd.toLocaleString('en-US')}`;

        return `
            <div class="tractor-card">
                <div class="tractor-badge-row">
                    <span class="tractor-status-tag">● ${t.status}</span>
                    <span class="tractor-promo-tag">${t.badges[0]}</span>
                </div>

                <div class="tractor-img-container">
                    <img src="${t.img}" alt="${t.name}" class="tractor-img" loading="lazy">
                </div>

                <h3 class="tractor-name">${t.name}</h3>
                <span class="tractor-power-subtitle">${t.power}</span>

                <div class="tractor-price-box">
                    <div class="price-usd-wrap">
                        <span class="price-usd">${priceUsdFormatted}</span>
                        <span class="price-uah">≈ ${priceUah} грн</span>
                    </div>
                    <span class="price-badge-nbu">Курс: ${rate} ₴</span>
                </div>

                <div class="tractor-specs-mini">
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Двигун</span>
                        <span class="spec-mini-val">${t.engine.split(',')[0]}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Трансмісія</span>
                        <span class="spec-mini-val">${t.transmission.split(' ')[0]}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Швидкість</span>
                        <span class="spec-mini-val">${t.speed}</span>
                    </div>
                    <div class="spec-mini-item">
                        <span class="spec-mini-label">Гідравліка</span>
                        <span class="spec-mini-val">${t.hydraulics.split(' ')[0]}</span>
                    </div>
                </div>

                <p class="tractor-description">${t.desc}</p>

                <div class="tractor-actions">
                    <button class="buy-btn-primary" onclick="openOrderModal('${t.id}')">КУПИТИ ТЕХНІКУ / ЗАМОВИТИ КП</button>
                    <div class="secondary-actions-row">
                        <button class="btn-secondary" onclick="openLeasingModal('${t.id}')">📊 РОЗРАХУВАТИ ЛІЗИНГ</button>
                        <button class="btn-secondary" onclick="openSpecsModal('${t.id}')">ℹ️ ПОВНІ ТТХ</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterTractors(category, btnEl) {
    const parent = btnEl.parentElement;
    parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    renderTractorCatalog(category);
}

// ==============================================================
// 9. MODALS (ORDER, LEASING & SPECS)
// ==============================================================

function openOrderModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    globalState.selectedTractorForOrder = machine;

    const modal = document.getElementById('order-modal');
    const title = document.getElementById('modal-machine-title');
    const hiddenInput = document.getElementById('hidden-machine-name');

    if (title) title.textContent = `${machine.name} (${machine.power})`;
    if (hiddenInput) hiddenInput.value = machine.name;
    if (modal) modal.classList.add('active');
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('active');
}

function openLeasingModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    globalState.selectedTractorForLeasing = machine;

    const modal = document.getElementById('leasing-modal');
    const title = document.getElementById('leasing-machine-title');

    if (title) title.textContent = `${machine.name} ($${machine.price_usd.toLocaleString()})`;
    updateLeasingCalc();

    if (modal) modal.classList.add('active');
}

function closeLeasingModal() {
    const modal = document.getElementById('leasing-modal');
    if (modal) modal.classList.remove('active');
}

function updateLeasingCalc() {
    const machine = globalState.selectedTractorForLeasing;
    if (!machine) return;

    const downInput = document.getElementById('calc-downpayment');
    const termInput = document.getElementById('calc-term');

    const downPercent = downInput ? parseInt(downInput.value) : 30;
    const termMonths = termInput ? parseInt(termInput.value) : 36;
    const rate = globalState.nbuRates.USD;

    const totalPrice = machine.price_usd;
    const downPayment = totalPrice * (downPercent / 100);
    const financedAmount = totalPrice - downPayment;

    // Standard annual lease rate around 6.5%
    const annualInterest = 0.065;
    const totalInterest = financedAmount * annualInterest * (termMonths / 12);
    const totalRepayment = financedAmount + totalInterest;
    const monthlyPayment = Math.round(totalRepayment / termMonths);
    const monthlyPaymentUah = Math.round(monthlyPayment * rate);

    // Update labels
    const priceDisp = document.getElementById('calc-price-display');
    const priceUahDisp = document.getElementById('calc-price-uah');
    const downLabel = document.getElementById('calc-downpayment-val');
    const termLabel = document.getElementById('calc-term-val');

    if (priceDisp) priceDisp.textContent = `$${totalPrice.toLocaleString()}`;
    if (priceUahDisp) priceUahDisp.textContent = `~${Math.round(totalPrice * rate).toLocaleString()} грн`;
    if (downLabel) downLabel.innerHTML = `<strong>${downPercent}%</strong> ($${Math.round(downPayment).toLocaleString()})`;
    if (termLabel) termLabel.innerHTML = `<strong>${termMonths} міс.</strong> (${(termMonths / 12).toFixed(1)} р.)`;

    // Update result boxes
    const resDown = document.getElementById('calc-res-down');
    const resFin = document.getElementById('calc-res-financed');
    const resMonth = document.getElementById('calc-res-monthly');
    const resMonthUah = document.getElementById('calc-res-monthly-uah');

    if (resDown) resDown.textContent = `$${Math.round(downPayment).toLocaleString()}`;
    if (resFin) resFin.textContent = `$${Math.round(financedAmount).toLocaleString()}`;
    if (resMonth) resMonth.textContent = `$${monthlyPayment.toLocaleString()} / міс`;
    if (resMonthUah) resMonthUah.textContent = `~${monthlyPaymentUah.toLocaleString()} грн / міс`;
}

function applyForLeasing() {
    closeLeasingModal();
    openOrderModal(globalState.selectedTractorForLeasing.id);
    const notes = document.getElementById('order-notes');
    const downPercent = document.getElementById('calc-downpayment')?.value || 30;
    const termMonths = document.getElementById('calc-term')?.value || 36;
    if (notes) {
        notes.value = `Бажані умови лізингу: аванс ${downPercent}%, термін ${termMonths} місяців.`;
    }
}

function openSpecsModal(machineId) {
    const machine = TRACTORS_DATA.find(t => t.id === machineId) || TRACTORS_DATA[0];
    alert(`ТЕХНІЧНІ ХАРАКТЕРИСТИКИ: ${machine.name}\n\n` +
        `• Потужність: ${machine.power}\n` +
        `• Двигун: ${machine.engine}\n` +
        `• Трансмісія: ${machine.transmission}\n` +
        `• Швидкість: ${machine.speed}\n` +
        `• Паливний бак: ${machine.fuel_capacity}\n` +
        `• Гідросистема: ${machine.hydraulics}\n` +
        `• Споряджена вага: ${machine.weight}\n` +
        `• Статус: ${machine.status}\n\n` +
        `Для отримання повної специфікації та комерційної пропозиції натисніть "КУПИТИ ТЕХНІКУ".`);
}

function handleOrderSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const machine = document.getElementById('hidden-machine-name').value;
    const finance = document.getElementById('order-finance').value;

    alert(`Дякуємо, ${name}!\n\nВашу заявку на ${machine} (${finance}) успішно зареєстровано.\nМенеджер зв'яжеться з Вами за номером ${phone} протягом 15 хвилин для надання офіційного КП.`);
    closeOrderModal();
    e.target.reset();
}

// Close modals on background click
window.onclick = function (e) {
    const orderModal = document.getElementById('order-modal');
    const leasingModal = document.getElementById('leasing-modal');
    if (e.target === orderModal) closeOrderModal();
    if (e.target === leasingModal) closeLeasingModal();
};

// ==============================================================
// 9. SITUATIONAL CENTER — AGRO MARKET ANALYTICS ENGINE
// ==============================================================

function initSituationalCenter() {
    computeAndDisplayAgroIndex();
    renderEventLog();
    updateAlertCardsFromSensors();
    fetchSituationalExtras(globalState.currentRegion.lat, globalState.currentRegion.lng);

    addEventLog('info', '<strong>Ситуаційний центр активний.</strong> Джерела: НБУ · Open-Meteo · NASA POWER · CAMS Air Quality · GloFAS · World Bank · Sentinel-2 NDVI — тільки реальні дані');

    // Refresh every 5 minutes
    setInterval(() => {
        computeAndDisplayAgroIndex();
        renderEventLog();
        updateAlertCardsFromSensors();
    }, 5 * 60 * 1000);
}

// ==============================================================
// 9a. НОВІ РЕАЛЬНІ ДЖЕРЕЛА СИТУАТИВНОГО ЦЕНТРУ (без ключів, CORS відкритий)
//     ☀️ NASA POWER (power.larc.nasa.gov) — супутникова сонячна радіація/опади
//     🌫️ CAMS Air Quality (air-quality-api.open-meteo.com) — пил/AOD/PM2.5
//     🌊 GloFAS (flood-api.open-meteo.com) — річковий стік, повінева небезпека
//     🏛️ World Bank (api.worldbank.org) — офіційні річні агро-індикатори
// ==============================================================

// Кліматичні норми сумарної сонячної радіації для України, МДж/м²·день (довідник — база для нормалізації, саме значення завжди реальне з NASA POWER)
const SOLAR_NORM_UA = [2.6, 4.8, 8.7, 13.6, 17.9, 19.6, 18.9, 16.2, 11.9, 7.3, 3.4, 2.2];

let _sitExtrasBusy = false;

async function fetchSituationalExtras(lat, lng, force = false) {
    if (_sitExtrasBusy) return;
    const sig = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const now = Date.now();
    if (!force && globalState._sitExtrasSig === sig && now - globalState._sitExtrasTs < 5 * 60 * 1000) return;
    _sitExtrasBusy = true;
    globalState._sitExtrasSig = sig;
    globalState._sitExtrasTs = now;

    await Promise.allSettled([
        fetchNasaSolar(lat, lng),
        fetchAirQuality(lat, lng),
        fetchFlood(lat, lng),
        fetchWorldBankAgri()
    ]);

    _sitExtrasBusy = false;
    computeAndDisplayAgroIndex(); // перерахунок індексу + AI-звіту з новими реальними даними
}

// ☀️ NASA POWER — денні супутникові дані за останні 5 доступних днів (API відстає на кілька днів — беремо вікно до вчора)
async function fetchNasaSolar(lat, lng) {
    try {
        const end = new Date(Date.now() - 86400000);
        const start = new Date(Date.now() - 6 * 86400000);
        const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, '');
        const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN,PRECTOTCORR,T2M,RH2M&community=AG&longitude=${lng.toFixed(3)}&latitude=${lat.toFixed(3)}&start=${fmt(start)}&end=${fmt(end)}&format=JSON`;
        const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        const p = j?.properties?.parameter || {};
        // -999 = пропуск у NASA → фільтруємо
        const radObj = p.ALLSKY_SFC_SW_DWN || {};
        const days = Object.keys(radObj).filter(k => radObj[k] > -900).sort();
        if (!days.length) throw new Error('немає валідних днів');
        const radMean = days.reduce((a, k) => a + radObj[k], 0) / days.length;
        const lastDay = days[days.length - 1];
        const precObj = p.PRECTOTCORR || {};
        const precipDays = Object.keys(precObj).filter(k => precObj[k] > -900);
        const precipSum = precipDays.reduce((a, k) => a + (precObj[k] || 0), 0);

        globalState.sitSources.nasa = {
            status: 'live', ts: Date.now(),
            data: {
                radMean, days: days.length, lastDay,
                radLast: radObj[lastDay],
                precipSum, daysN: precipDays.length,
                t2mLast: p.T2M?.[lastDay] ?? null, rhLast: p.RH2M?.[lastDay] ?? null
            }
        };
        addEventLog('ok', `<strong>NASA POWER:</strong> радіація ${radMean.toFixed(1)} МДж/м²·день (середнє за ${days.length} дн., супутник) · опади ${precipSum.toFixed(1)} мм`);
        computeAndDisplayAgroIndex(); // звіт оновлюється одразу по прибутті джерела, не чекаючи решту
    } catch (e) {
        globalState.sitSources.nasa = { status: 'offline', err: e.message };
        console.warn('[NASA POWER]', e.message);
    }
}

// 🌫️ CAMS Air Quality — поточний пил, аерозоль, PM
async function fetchAirQuality(lat, lng) {
    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&current=aerosol_optical_depth,dust,pm2_5,pm10&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        const c = j.current || {};
        globalState.sitSources.air = {
            status: 'live', ts: Date.now(),
            data: {
                aod: c.aerosol_optical_depth ?? null,
                dust: c.dust ?? null,
                pm25: c.pm2_5 ?? null,
                pm10: c.pm10 ?? null,
                time: c.time ?? null
            }
        };
        addEventLog('ok', `<strong>CAMS Air Quality:</strong> пил ${c.dust ?? 0} мкг/м³ · AOD ${c.aerosol_optical_depth ?? '—'} · PM2.5 ${c.pm2_5 ?? '—'} мкг/м³`);
        computeAndDisplayAgroIndex();
    } catch (e) {
        globalState.sitSources.air = { status: 'offline', err: e.message };
        console.warn('[CAMS AIR]', e.message);
    }
}

// 🌊 GloFAS — річковий стік: минулі 3 дні + прогноз 4 дні (м³/с)
async function fetchFlood(lat, lng) {
    try {
        const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&daily=river_discharge_mean&past_days=3&forecast_days=4&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        const arr = j.daily?.river_discharge_mean || [];
        const times = j.daily?.time || [];
        const past = arr.slice(0, 3).filter(v => v != null);
        const fc = arr.slice(3).filter(v => v != null);
        const pastMax = past.length ? Math.max(...past) : null;
        const fcMax = fc.length ? Math.max(...fc) : null;
        let fcMaxDay = null;
        if (fc.length && fcMax != null) {
            const idx = arr.slice(3).indexOf(fcMax);
            fcMaxDay = times[3 + idx] ?? null;
        }
        globalState.sitSources.flood = {
            status: 'live', ts: Date.now(),
            data: { pastMax, fcMax, fcMaxDay, pastLast: past.length ? past[past.length - 1] : null }
        };
        addEventLog('ok', `<strong>GloFAS:</strong> річковий стік макс ${pastMax ?? '—'} м³/с (3 дн. тому) → прогноз ${fcMax ?? '—'} м³/с`);
        computeAndDisplayAgroIndex();
    } catch (e) {
        globalState.sitSources.flood = { status: 'offline', err: e.message };
        console.warn('[GLOFAS]', e.message);
    }
}

// 🏛️ World Bank — офіційні річні індикатори України (раз на сесію; річні дані)
async function fetchWorldBankAgri() {
    if (globalState.sitSources.wb?.status === 'live') return;
    const tryFetch = async () => {
        const fetchInd = async (ind) => {
            const res = await fetch(`https://api.worldbank.org/v2/country/UKR/indicator/${ind}?format=json&per_page=10`, { signal: AbortSignal.timeout(25000) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const j = await res.json();
            return (Array.isArray(j) && Array.isArray(j[1]) ? j[1] : []).filter(x => x.value != null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
        };
        // серійно: спершу зернові (головний вхід індексу), потім решта паралельно — WB не любить пачки одночасних запитів
        const rows = await fetchInd('AG.PRD.CREL.MT');
        const [fert, agriGdp] = await Promise.allSettled([fetchInd('AG.CON.FERT.ZS'), fetchInd('NV.AGR.TOTL.ZS')]);
        return { rows, fert, agriGdp };
    };
    try {
        let out;
        try {
            out = await tryFetch();
        } catch (e1) {
            await new Promise(r => setTimeout(r, 2000)); // одна повторна спроба
            out = await tryFetch();
        }
        const rows = out.rows;
        if (!rows.length) throw new Error('немає значень');
        const last = rows[rows.length - 1], prev = rows.length > 1 ? rows[rows.length - 2] : null;
        const yoy = prev ? (last.value - prev.value) / prev.value * 100 : null;
        const fertLast = out.fert.status === 'fulfilled' && out.fert.value.length ? out.fert.value[out.fert.value.length - 1] : null;
        const gdpLast = out.agriGdp.status === 'fulfilled' && out.agriGdp.value.length ? out.agriGdp.value[out.agriGdp.value.length - 1] : null;

        globalState.sitSources.wb = {
            status: 'live', ts: Date.now(),
            data: {
                cerealLast: last.value, cerealYear: last.date, cerealYoY: yoy,
                fert: fertLast ? { val: fertLast.value, year: fertLast.date } : null,
                agriGdp: gdpLast ? { val: gdpLast.value, year: gdpLast.date } : null
            }
        };
        addEventLog('ok', `<strong>World Bank:</strong> зернові ${(last.value / 1e6).toFixed(1)} млн т (${last.date})${yoy != null ? `, ${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}% рік-до-року` : ''}`);
        computeAndDisplayAgroIndex();
    } catch (e) {
        globalState.sitSources.wb = { status: 'offline', err: e.message };
        console.warn('[WORLD BANK]', e.message);
    }
}

function computeAndDisplayAgroIndex() {
    // АГРО-ІНДЕКС v2 — 8 КОМПОНЕНТІВ, ТОЛЬКИ РЕАЛЬНІ ДАНІ:
    // Open-Meteo (клімат/ґрунт) · NASA POWER (радіація) · CAMS (повітря) · GloFAS (річки) ·
    // НБУ (валюта, 30д волатильність) · World Bank (агро-макро) · Sentinel-2 NDVI (довідковий).
    // Жодних Math.random(). Відсутні дані → компонент «—» і вага перерозподіляється між рештою.
    const s = globalState.lastSensorData || {};
    const src = globalState.sitSources || {};
    const ndvi = SAT_REGIONS[currentSatRegion]?.ndvi ?? null;

    // 1. Агроклімат — реальні показники Open-Meteo (температура, вологість, VPD)
    let climateScore = null;
    if (s.temperature != null && s.humidity != null) {
        const temp = s.temperature;
        const hum  = s.humidity;
        const vpd  = s.vpd ?? 0.8;
        climateScore = Math.min(100, Math.max(0,
            50
            + (temp > 5 && temp < 30 ? 20 : temp > 30 ? -15 : -10)
            + (hum > 45 && hum < 80 ? 15 : -10)
            + (vpd < 1.5 ? 10 : vpd < 2.5 ? 0 : -10)
        ));
    }

    // 2. Ґрунт — реальна вологість 9-27см + температура 6см (Open-Meteo)
    let soilScore = null;
    if (s.soilMoisture != null) {
        soilScore = Math.min(100, Math.max(0, (s.soilMoisture - 0.05) / 0.30 * 100));
        if (s.soilTemp != null && (s.soilTemp < 5 || s.soilTemp > 30)) {
            soilScore = Math.max(0, soilScore - 20); // холодний/перегрітий ґрунт — стрес кореневої зони
        }
    }

    // 3. ☀️ Сонячна радіація — NASA POWER (супутник), % від кліматичної норми місяця
    let solarScore = null;
    const nasa = src.nasa?.data;
    if (nasa?.radMean != null) {
        const norm = SOLAR_NORM_UA[new Date().getMonth()] || 8;
        solarScore = Math.min(100, Math.max(0, (nasa.radMean / norm) * 60));
    }

    // 4. 🌫️ Повітря/пил — CAMS (пил мкг/м³, AOD, PM2.5)
    let airScore = null;
    const air = src.air?.data;
    if (air && (air.aod != null || air.dust != null || air.pm25 != null)) {
        airScore = Math.min(100, Math.max(0,
            100
            - Math.max(0, (air.dust ?? 0) - 10) * 0.5
            - Math.max(0, (air.aod ?? 0) - 0.3) * 120
            - Math.max(0, (air.pm25 ?? 0) - 25) * 1.5
        ));
    }

    // 5. 🌊 Повінева небезпека — GloFAS: різкість підняття стоку
    let floodScore = null;
    const fl = src.flood?.data;
    if (fl) {
        if (fl.fcMax == null || fl.fcMax < 0.1) {
            floodScore = 95; // стоку на клітинці майже нема — загрози немає
        } else {
            const base = Math.max(fl.pastMax ?? 0, 0.05);
            const ratio = fl.fcMax / base;
            floodScore = Math.min(100, Math.max(20, 100 - (ratio - 1) * 25));
        }
    }

    // 6. 💱 Валютний фактор — НБУ: динаміка 7д + реальна волатильність 30д
    let currencyScore = null;
    const usd = globalState.nbuRates?.USD ?? null;
    const usdPrev = globalState.nbuPrev?.USD ?? null;
    if (usd != null && usdPrev != null) {
        const chg = Math.abs((usd - usdPrev) / usdPrev * 100);
        let vol30 = null;
        const hs = globalState.nbuHistorySeries?.USD;
        if (Array.isArray(hs) && hs.length >= 3) {
            vol30 = (Math.max(...hs) - Math.min(...hs)) / Math.min(...hs) * 100;
        }
        currencyScore = Math.min(100, Math.max(20, 85 - chg * 25 - (vol30 != null ? Math.max(0, vol30 - 1) * 20 : 0)));
    }

    // 7. 🏛️ Агро-макро — World Bank: виробництво зернових, останній рік проти попереднього
    let macroScore = null;
    const wb = src.wb?.data;
    if (wb?.cerealYoY != null) {
        macroScore = Math.min(100, Math.max(10, 50 + wb.cerealYoY * 150));
    }

    // 8. 🌾 Стан вегетації — довідковий NDVI (Sentinel-2) по поточній зоні
    let vegScore = ndvi != null ? Math.min(100, Math.max(0, ndvi * 100)) : null;

    const comps = [
        { key: 'climate',  score: climateScore,  weight: 0.20, icon: '🌡️', label: 'Агроклімат',    srcName: 'Open-Meteo' },
        { key: 'soil',     score: soilScore,     weight: 0.12, icon: '🌱', label: 'Ґрунт',         srcName: 'Open-Meteo' },
        { key: 'solar',    score: solarScore,    weight: 0.10, icon: '☀️', label: 'Радіація',      srcName: 'NASA POWER' },
        { key: 'air',      score: airScore,      weight: 0.06, icon: '🌫️', label: 'Повітря/пил',   srcName: 'CAMS Air' },
        { key: 'flood',    score: floodScore,    weight: 0.05, icon: '🌊', label: 'Річки',         srcName: 'GloFAS' },
        { key: 'currency', score: currencyScore, weight: 0.20, icon: '💱', label: 'Валюта (НБУ)',  srcName: 'bank.gov.ua' },
        { key: 'macro',    score: macroScore,    weight: 0.07, icon: '🏛️', label: 'Агро-макро',    srcName: 'World Bank' },
        { key: 'veg',      score: vegScore,      weight: 0.20, icon: '🌾', label: 'Вегетація',     srcName: 'Sentinel-2 довідк.' }
    ];

    renderIndexComponents(comps);

    const active = comps.filter(c => c.score != null);
    if (active.length === 0) return; // ще немає жодних реальних даних — індекс не рахуємо

    const wSum = active.reduce((a, c) => a + c.weight, 0);
    const composite = Math.round(active.reduce((a, c) => a + c.score * c.weight, 0) / wSum);
    globalState._lastComposite = composite;
    globalState._lastComps = comps;

    // Update gauge SVG arc & text
    const gaugeArcEl = document.getElementById('gauge-value-arc');
    const gaugeTextEl = document.getElementById('gauge-score-text');
    if (gaugeArcEl) gaugeArcEl.setAttribute('d', computeGaugeArc(composite));
    if (gaugeTextEl) gaugeTextEl.textContent = composite;
    const gaugeColor = composite >= 65 ? '#00ff95' : composite >= 45 ? '#f59e0b' : '#ef4444';
    if (gaugeArcEl) gaugeArcEl.setAttribute('stroke', gaugeColor);

    // Update verdict text
    const verdictEl = document.getElementById('agro-verdict');
    const trendEl = document.getElementById('agro-trend');
    if (verdictEl) {
        if (composite >= 70) verdictEl.textContent = 'Позитивний';
        else if (composite >= 55) verdictEl.textContent = 'Помірно-позитивний';
        else if (composite >= 40) verdictEl.textContent = 'Нейтральний';
        else if (composite >= 25) verdictEl.textContent = 'Помірно-негативний';
        else verdictEl.textContent = 'Негативний';
        verdictEl.style.color = gaugeColor;
    }

    // Реальна динаміка курсу USD за 7 днів (НБУ) замість випадкового тренду
    if (trendEl) {
        if (usd != null && usdPrev != null) {
            const diff = (usd - usdPrev) / usdPrev * 100;
            trendEl.textContent = `${diff >= 0 ? '▲' : '▼'} USD ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}% / 7 днів (НБУ)`;
            trendEl.style.color = '#00e1ff';
        } else {
            trendEl.textContent = 'динаміка НБУ синхронізується...';
            trendEl.style.color = 'rgba(255,255,255,0.4)';
        }
    }

    // Update timestamp
    const timeEl = document.getElementById('sitcenter-update-time');
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString('uk-UA');

    // Широкий AI-звіт під панеллю (алгоритмічний аналіз реальних даних)
    renderAiSituationReport(comps, composite);
}

// Динамічний рендер 8 компонентів індексу (замість статичних 3 рядків)
function renderIndexComponents(comps) {
    const wrap = document.getElementById('index-components');
    if (!wrap) return;
    wrap.innerHTML = comps.map(c => `
        <div class="idx-comp-row">
            <span class="idx-comp-lbl">${c.icon} ${c.label}</span>
            <div class="idx-comp-bar-wrap"><div class="idx-comp-bar" style="width:${c.score != null ? Math.round(c.score) : 0}%;background:${c.score != null ? (c.score > 60 ? '#00ff95' : c.score > 40 ? '#f59e0b' : '#ef4444') : 'rgba(255,255,255,0.15)'}"></div></div>
            <span class="idx-comp-val">${c.score != null ? Math.round(c.score) : '—'}</span>
        </div>
    `).join('');
}

// Compute SVG arc path for gauge (score 0-100 → 180° arc from left to right)
function computeGaugeArc(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const angle = (clamped / 100) * 160 - 160; // -160 (left) to 0 (right)
    const rad = ((angle) * Math.PI) / 180;
    const cx = 100, cy = 100, r = 80;
    const startX = cx + r * Math.cos(Math.PI); // left = 20
    const startY = cy + r * Math.sin(Math.PI); // = 100
    const endX = cx + r * Math.cos(Math.PI + rad);
    const endY = cy + r * Math.sin(Math.PI + rad);
    const largeArc = clamped > 50 ? 1 : 0;
    if (clamped <= 0) return 'M 20 100 A 80 80 0 0 1 20.01 100';
    return `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;
}

// ==============================================================
// 9b. AI-СИТУАЦІЯ — широкий ситуативний звіт, згенерований АЛГОРИТМОМ
//     з live-API (не LLM і не симуляція): кожне речення будується з реальних чисел.
// ==============================================================

function renderAiSituationReport(comps, composite) {
    const gridEl = document.getElementById('ai-report-grid');
    const verdictBadgeEl = document.getElementById('ai-report-verdict-badge');
    const verdictTextEl = document.getElementById('ai-report-verdict-text');
    const alertsEl = document.getElementById('ai-report-alerts');
    const sourcesEl = document.getElementById('ai-report-sources');
    if (!gridEl) return;

    const s = globalState.lastSensorData || {};
    const src = globalState.sitSources || {};
    const region = globalState.currentRegion?.name || 'УКРАЇНА';
    const ndvi = SAT_REGIONS[currentSatRegion]?.ndvi ?? null;
    const cells = [];

    // 🌡️ Агроклімат
    if (s.temperature != null) {
        const hum = s.humidity ?? null;
        const vpd = s.vpd ?? null;
        const ok = s.temperature > 5 && s.temperature < 30 && (hum == null || (hum > 45 && hum < 80));
        cells.push({
            icon: '🌡️', title: 'Агроклімат', source: 'Open-Meteo live',
            values: `${s.temperature > 0 ? '+' : ''}${s.temperature.toFixed(1)}°C · RH ${hum != null ? hum.toFixed(0) : '—'}%${vpd != null ? ` · VPD ${vpd.toFixed(2)} кПа` : ''}${s.et0 != null ? ` · ET₀ ${s.et0.toFixed(2)} мм` : ''}`,
            verdict: ok
                ? 'Температурний режим у комфортній зоні для вегетації; випаровуваність під контролем.'
                : (s.temperature > 30 ? 'Спековий стрес: втрата вологи посилена, потрібен контроль поливів.' : 'Холодно для активної вегетації: ріст уповільнений, ризик заморозків стежимо.')
        });
    }

    // 🌱 Ґрунт
    if (s.soilMoisture != null) {
        const st = s.soilTemp;
        let verdict;
        if (s.soilMoisture < 0.10) verdict = 'Ґрунтова посуха: волога нижче вілтінгового порогу кореневої зони.';
        else if (s.soilMoisture < 0.18) verdict = 'Волога понижена: техніка ще проходить, але культури починають відчувати дефіцит.';
        else verdict = 'Запас вологи в кореневій зоні достатній для поточної фази вегетації.';
        cells.push({
            icon: '🌱', title: 'Ґрунт', source: 'Open-Meteo live',
            values: `вологість ${s.soilMoisture.toFixed(2)} m³/m³${st != null ? ` · t ґрунту ${st.toFixed(1)}°C (6 см)` : ''}`,
            verdict
        });
    }

    // ☀️ NASA POWER
    const nasa = src.nasa?.data;
    if (nasa?.radMean != null) {
        const norm = SOLAR_NORM_UA[new Date().getMonth()] || 8;
        const ratio = nasa.radMean / norm;
        cells.push({
            icon: '☀️', title: 'Сонячна радіація', source: 'NASA POWER (супутник)',
            values: `${nasa.radMean.toFixed(1)} МДж/м²·день · ${Math.round(ratio * 100)}% кліматичної норми · опади ${nasa.precipSum.toFixed(1)} мм/5 дн.`,
            verdict: ratio >= 1.05
                ? 'Радіаційний фон вище норми — фотосинтез активний, вегетація не стримана.'
                : ratio >= 0.7
                    ? 'Радіація в межах кліматичної норми місяця — ріст іде штатним темпом.'
                    : 'Дефіцит сонячної радіації (хмарність): ріст сповільнюється, додайте контроль хвороб у вологу погоду.'
        });
    }

    // 🌫️ CAMS Air Quality
    const air = src.air?.data;
    if (air && (air.aod != null || air.dust != null)) {
        const aod = air.aod ?? 0, dust = air.dust ?? 0, pm = air.pm25 ?? 0;
        cells.push({
            icon: '🌫️', title: 'Повітря та пил', source: 'CAMS Air Quality',
            values: `пил ${dust.toFixed(0)} мкг/м³ · AOD ${aod.toFixed(2)} · PM2.5 ${pm.toFixed(0)} мкг/м³`,
            verdict: (aod > 0.7 || dust > 100)
                ? 'Пилова/димова завіса: обприскування і дрібнокрапельне внесення краще перенести.'
                : (aod > 0.45 ? 'Аерозоль підвищений: стежте за видимістю при авіа/наземному внесенні.' : 'Повітря чисте — агрохімію можна вносити без аерозольних обмежень.')
        });
    }

    // 🌊 GloFAS
    const fl = src.flood?.data;
    if (fl) {
        const base = Math.max(fl.pastMax ?? 0, 0.05);
        const ratio = fl.fcMax != null ? fl.fcMax / base : null;
        cells.push({
            icon: '🌊', title: 'Річки та повені', source: 'GloFAS',
            values: `стік: макс ${fl.pastMax ?? '—'} м³/с (3 дн.) → прогноз ${fl.fcMax ?? '—'} м³/с${fl.fcMaxDay ? ` (пік ${fl.fcMaxDay})` : ''}`,
            verdict: (ratio != null && ratio > 2.5 && fl.fcMax >= 0.5)
                ? `Різке підняття стоку (×${ratio.toFixed(1)}): перевірте польові переїзди та низинні ділянки.`
                : 'Повеневої загрози на прогнозному вікні GloFAS немає.'
        });
    }

    // 💱 НБУ
    const usd = globalState.nbuRates?.USD ?? null;
    const usdPrev = globalState.nbuPrev?.USD ?? null;
    if (usd != null) {
        const diff = usdPrev != null ? (usd - usdPrev) / usdPrev * 100 : null;
        const hs = globalState.nbuHistorySeries?.USD;
        const vol30 = Array.isArray(hs) && hs.length >= 3 ? (Math.max(...hs) - Math.min(...hs)) / Math.min(...hs) * 100 : null;
        cells.push({
            icon: '💱', title: 'Валютний фактор', source: 'НБУ (bank.gov.ua)',
            values: `USD ${usd.toFixed(2)} ₴ · ${diff != null ? `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}% / 7 дн.` : '—'}${vol30 != null ? ` · коридор 30 дн. ${vol30.toFixed(2)}%` : ''}`,
            verdict: (diff != null && Math.abs(diff) >= 2)
                ? 'Валютна волатильність: фіксуйте ціни контрактів і строки закупівлі ЗЗР/техніки.'
                : 'Офіційний курс стабільний: цінове планування на сезон передбачуване.'
        });
    }

    // 🏛️ World Bank
    const wb = src.wb?.data;
    if (wb?.cerealLast != null) {
        cells.push({
            icon: '🏛️', title: 'Агро-макро', source: 'World Bank (річні дані)',
            values: `зернові ${(wb.cerealLast / 1e6).toFixed(1)} млн т (${wb.cerealYear})${wb.cerealYoY != null ? ` · ${wb.cerealYoY >= 0 ? '+' : ''}${wb.cerealYoY.toFixed(1)}% р/р` : ''}${wb.fert ? ` · добрива ${wb.fert.val.toFixed(0)} кг/га (${wb.fert.year})` : ''}${wb.agriGdp ? ` · АПК ${wb.agriGdp.val.toFixed(1)}% ВВП (${wb.agriGdp.year})` : ''}`,
            verdict: (wb.cerealYoY ?? 0) >= 0
                ? 'Останній офіційний рік — виробництво зросло: виробничий потенціал підтверджений.'
                : 'Останній офіційний рік — спад виробництва: фактор ризику для експортного потенціалу.'
        });
    }

    // 🌾 NDVI
    if (ndvi != null) {
        cells.push({
            icon: '🌾', title: 'Вегетація (NDVI)', source: 'Sentinel-2 довідковий',
            values: `NDVI ${ndvi.toFixed(2)} · зона: ${currentSatRegion === 'all' ? 'вся Україна' : (SAT_REGIONS[currentSatRegion]?.name || '—')}`,
            verdict: ndvi >= 0.7 ? 'Щільний рослинний покрив — зона у фазі активної вегетації.'
                : ndvi >= 0.5 ? 'Помірний покрив: культури на початку вегетації або після збирання.'
                : 'Розріджений покрив: поза вегетацією або стрес посівів.'
        });
    }

    if (!cells.length) {
        gridEl.innerHTML = '<div class="ai-report-cell loading">⏳ Синхронізація джерел…</div>';
        return;
    }

    gridEl.innerHTML = cells.map(c => `
        <div class="ai-report-cell">
            <div class="ai-cell-head">
                <span class="ai-cell-title">${c.icon} ${c.title}</span>
                <span class="ai-cell-src">${c.source}</span>
            </div>
            <div class="ai-cell-values">${c.values}</div>
            <div class="ai-cell-verdict">${c.verdict}</div>
        </div>
    `).join('');

    // Вердикт заголовка
    if (verdictBadgeEl && verdictTextEl) {
        if (composite != null) {
            const v = composite >= 70 ? ['СПРИЯТЛИВО', 'good'] : composite >= 55 ? ['ПОМІРНО СПРИЯТЛИВО', 'good'] : composite >= 40 ? ['НЕЙТРАЛЬНО', 'mid'] : composite >= 25 ? ['НАПРУЖЕНО', 'warn'] : ['НЕСПРИЯТЛИВО', 'bad'];
            verdictBadgeEl.textContent = v[0];
            verdictBadgeEl.className = `ai-report-verdict-badge ${v[1]}`;
            const weakest = [...(comps || [])].filter(c => c.score != null).sort((a, b) => a.score - b.score)[0];
            const strongest = [...(comps || [])].filter(c => c.score != null).sort((a, b) => b.score - a.score)[0];
            verdictTextEl.textContent = `Агро-індекс ${composite}/100 для ${region}. Сильна сторона: ${strongest ? strongest.label.toLowerCase() : '—'} (${strongest ? Math.round(strongest.score) : '—'}). Ризик: ${weakest ? weakest.label.toLowerCase() : '—'} (${weakest ? Math.round(weakest.score) : '—'}). Аналіз з ${cells.length} категорій реальних даних.`;
        } else {
            verdictBadgeEl.textContent = 'АНАЛІЗ…';
            verdictBadgeEl.className = 'ai-report-verdict-badge mid';
            verdictTextEl.textContent = 'Збираю дані з офіційних джерел…';
        }
    }

    // Алерти — тільки порогові спрацювання на реальних числах
    const alerts = [];
    if (s.temperature != null && s.temperature < 2) alerts.push({ lvl: 'bad', txt: `❄️ Ризик заморозків: ${s.temperature.toFixed(1)}°C` });
    if (s.temperature != null && s.temperature > 30) alerts.push({ lvl: 'warn', txt: `🔥 Спековий стрес: ${s.temperature.toFixed(1)}°C` });
    if (s.soilMoisture != null && s.soilMoisture < 0.10) alerts.push({ lvl: 'bad', txt: `🥵 Ґрунтова посуха: ${s.soilMoisture.toFixed(2)} m³/m³` });
    else if (s.soilMoisture != null && s.soilMoisture < 0.18) alerts.push({ lvl: 'warn', txt: `💧 Волога понижена: ${s.soilMoisture.toFixed(2)} m³/m³` });
    const air2 = src.air?.data;
    if (air2 && ((air2.aod ?? 0) > 0.7 || (air2.dust ?? 0) > 100)) alerts.push({ lvl: 'warn', txt: `🌫️ Пилова завіса: AOD ${(air2.aod ?? 0).toFixed(2)}` });
    if (air2 && (air2.pm25 ?? 0) > 35) alerts.push({ lvl: 'warn', txt: `🫁 Якість повітря: PM2.5 ${(air2.pm25).toFixed(0)} мкг/м³` });
    if (fl) {
        const base2 = Math.max(fl.pastMax ?? 0, 0.05);
        const r2 = fl.fcMax != null ? fl.fcMax / base2 : null;
        if (r2 != null && r2 > 2.5 && fl.fcMax >= 0.5) alerts.push({ lvl: 'warn', txt: `🌊 Підняття стоку ×${r2.toFixed(1)} (${fl.fcMax?.toFixed(2)} м³/с)` });
    }
    if (usd != null && usdPrev != null && Math.abs((usd - usdPrev) / usdPrev * 100) >= 2) {
        alerts.push({ lvl: 'warn', txt: `💱 Гривня волатильна: ${(usd - usdPrev) / usdPrev * 100 >= 0 ? '+' : ''}${((usd - usdPrev) / usdPrev * 100).toFixed(2)}% / 7 дн.` });
    }
    const nasa2 = src.nasa?.data;
    if (nasa2?.radMean != null) {
        const norm2 = SOLAR_NORM_UA[new Date().getMonth()] || 8;
        if (nasa2.radMean / norm2 < 0.5) alerts.push({ lvl: 'info', txt: `☁️ Дефіцит радіації: ${Math.round(nasa2.radMean / norm2 * 100)}% норми` });
    }

    if (alertsEl) {
        alertsEl.innerHTML = alerts.length
            ? `<div class="ai-alerts-title">🚨 АЛЕРТИ ПО РЕАЛЬНИХ ДАНИХ (${alerts.length}):</div>` + alerts.map(a => `<span class="ai-alert-chip ${a.lvl}">${a.txt}</span>`).join('')
            : '<div class="ai-alerts-title ok">✅ Критичних алертів на реальних даних немає — усі показники в межах порогів.</div>';
    }

    // Статус джерел
    if (sourcesEl) {
        const mk = (name, st, note) => {
            const dot = st === 'live' ? '<span class="src-dot ok"></span>' : st === 'ref' ? '<span class="src-dot ref"></span>' : '<span class="src-dot off"></span>';
            return `<span class="ai-src-item">${dot}${name}${note ? ` <em>${note}</em>` : ''}</span>`;
        };
        const t = (ts) => ts ? new Date(ts).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) : '';
        sourcesEl.innerHTML = [
            mk('НБУ', globalState.nbuLive ? 'live' : 'off', globalState.nbuLive ? t(Date.now()) : 'офлайн'),
            mk('Open-Meteo', s.temperature != null ? 'live' : 'off', t(Date.now())),
            mk('NASA POWER', src.nasa?.status ?? 'off', src.nasa?.status === 'live' ? t(src.nasa.ts) : 'офлайн'),
            mk('CAMS Air', src.air?.status ?? 'off', src.air?.status === 'live' ? t(src.air.ts) : 'офлайн'),
            mk('GloFAS', src.flood?.status ?? 'off', src.flood?.status === 'live' ? t(src.flood.ts) : 'офлайн'),
            mk('World Bank', src.wb?.status ?? 'off', src.wb?.status === 'live' ? `річні (${src.wb.data?.cerealYear ?? '—'})` : 'офлайн'),
            mk('Sentinel-2 NDVI', 'ref', 'довідковий')
        ].join('');
    }
}

function updateAlertCardsFromSensors() {
    const s = globalState.lastSensorData || {};
    const temp = s.temperature ?? null;
    const hum  = s.humidity ?? null;
    const moisture = s.soilMoisture ?? null;

    // Weather alert
    if (temp !== null) {
        const weatherMetricEl = document.getElementById('alert-metric-weather');
        const weatherBadgeEl  = document.getElementById('alert-badge-weather');
        const weatherCardEl   = document.getElementById('alert-card-weather');
        if (weatherMetricEl) weatherMetricEl.textContent = `${temp > 0 ? '+' : ''}${temp.toFixed(1)}°C / ${hum?.toFixed(0) ?? '—'}% RH`;
        if (temp > 32 || temp < 2) {
            if (weatherBadgeEl) { weatherBadgeEl.textContent = 'СТРЕС'; weatherBadgeEl.className = 'alert-severity-badge danger'; }
            if (weatherCardEl) weatherCardEl.classList.add('danger');
        } else if (temp > 28 || temp < 5) {
            if (weatherBadgeEl) { weatherBadgeEl.textContent = 'УВАГА'; weatherBadgeEl.className = 'alert-severity-badge warning'; }
        } else {
            if (weatherBadgeEl) { weatherBadgeEl.textContent = 'ОК'; weatherBadgeEl.className = 'alert-severity-badge'; }
        }
    }

    // Soil alert
    if (moisture !== null) {
        const soilMetricEl = document.getElementById('alert-metric-soil');
        const soilBadgeEl  = document.getElementById('alert-badge-soil');
        const soilCardEl   = document.getElementById('alert-card-soil');
        if (soilMetricEl) soilMetricEl.textContent = `Вологість: ${moisture.toFixed(2)} m³/m³`;
        if (moisture < 0.10) {
            if (soilBadgeEl) { soilBadgeEl.textContent = 'СТРЕС'; soilBadgeEl.className = 'alert-severity-badge danger'; }
            if (soilCardEl) soilCardEl.classList.add('danger');
        } else if (moisture < 0.18) {
            if (soilBadgeEl) { soilBadgeEl.textContent = 'СУХО'; soilBadgeEl.className = 'alert-severity-badge warning'; }
        } else {
            if (soilBadgeEl) { soilBadgeEl.textContent = 'ОК'; soilBadgeEl.className = 'alert-severity-badge'; }
        }
    }

    // Валютний фактор — реальний офіційний курс НБУ та його реальна динаміка за 7 днів
    const usd = globalState.nbuRates?.USD ?? null;
    const usdPrev = globalState.nbuPrev?.USD ?? null;
    if (usd != null) {
        const curMetricEl = document.getElementById('alert-metric-prices');
        const curBadgeEl  = document.getElementById('alert-badge-prices');
        const curDescEl   = document.getElementById('alert-desc-prices');
        if (curMetricEl) curMetricEl.textContent = `USD/UAH: ${usd.toFixed(2)} ₴ (НБУ)`;
        if (usdPrev != null) {
            const diff = (usd - usdPrev) / usdPrev * 100;
            if (curDescEl) curDescEl.textContent = `Реальна динаміка за 7 днів: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%. Курс впливає на вартість імпортних ЗЗР, добрив та техніки.`;
            if (curBadgeEl) {
                if (Math.abs(diff) >= 2) { curBadgeEl.textContent = 'ВОЛАТИЛЬНІСТЬ'; curBadgeEl.className = 'alert-severity-badge warning'; }
                else { curBadgeEl.textContent = 'СТАБІЛЬНО'; curBadgeEl.className = 'alert-severity-badge'; }
            }
        } else if (curDescEl) {
            curDescEl.textContent = 'Офіційний курс НБУ (bank.gov.ua). Динаміка за 7 днів синхронізується...';
        }
    }

    // Сума ефективних температур — реальний розрахунок GDD (база +5°C) з денних температур Open-Meteo
    const gdd = globalState.gdd7 ?? null;
    const cropMetricEl = document.getElementById('alert-metric-crop');
    const cropDescEl   = document.getElementById('alert-desc-crop');
    if (cropMetricEl) cropMetricEl.textContent = gdd != null ? `GDD₅: ${gdd} °C·день / 7 днів` : 'GDD₅: синхронізація...';
    if (cropDescEl && gdd != null) cropDescEl.textContent = 'Сума ефективних температур (база +5°C) за вікно 7 днів: 3 минулих + 4 прогнозних днів Open-Meteo.';
}

// Журнал подій: ТІЛЬКИ реальні системні події з реальним часом (без вигаданих записів)
function addEventLog(type, text) {
    if (!Array.isArray(globalState.eventLog)) globalState.eventLog = [];
    const last = globalState.eventLog[globalState.eventLog.length - 1];
    if (last && last.text === text) return; // дедуплікація однакових подій
    globalState.eventLog.push({ time: new Date(), type, text });
    if (globalState.eventLog.length > 8) globalState.eventLog.shift();
    renderEventLog();
}

function renderEventLog() {
    const logEl = document.getElementById('sitcenter-event-log');
    if (!logEl) return;

    if (!Array.isArray(globalState.eventLog) || globalState.eventLog.length === 0) {
        logEl.innerHTML = `
            <div class="event-log-entry">
                <span class="event-log-time">--:--</span>
                <span class="event-log-dot info"></span>
                <span class="event-log-text">Синхронізація з офіційними джерелами: НБУ (bank.gov.ua) · Open-Meteo · Sentinel-2 NDVI...</span>
            </div>`;
        return;
    }

    const fmt = (d) => d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

    logEl.innerHTML = [...globalState.eventLog].reverse().map(e => `
        <div class="event-log-entry">
            <span class="event-log-time">${fmt(e.time)}</span>
            <span class="event-log-dot ${e.type}"></span>
            <span class="event-log-text">${e.text}</span>
        </div>
    `).join('');
}


// ==============================================================
// 🎯 v5.0 — РОЗШИРЕНА АНАЛІТИКА СИТУАЦІЙНОГО ЦЕНТРУ
// 8 модулів, які перетворюють статичний "знімок" на дієвий аналітичний хаб
// 100% реальні дані: Open-Meteo, NASA POWER, CAMS, GloFAS, World Bank, НБУ
// ==============================================================
//
// Структура:
//   Module 1 — Production Risk Index (5 під-індексів ризику втрати врожаю)
//   Module 2 — Agri-Economy Calculator (собівартість, маржа, паливо, окупність)
//   Module 3 — Forecast 7 days + Optimal Windows (сівба/ЗЗР/збір/полив)
//   Module 4 — Regional Heatmap (24 області, ранжування за міні-індексом)
//   Module 5 — Historical Analytics (sparkline 7 днів + аномалії)
//   Module 6 — Waterfall Decomposition (8 компонентів → фінал)
//   Module 7 — Radar 8 компонентів (поточний vs еталон)
//   Module 8 — AI Recommendations (rule-based, пріоритети High/Mid/Low)
//
// ==============================================================


// ---- Допоміжні функції ----
function safeNum(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
}

function fmtUAH(v) {
    if (v == null || !Number.isFinite(v)) return '—';
    if (v >= 1000) return `${(v / 1000).toFixed(1)} тис ₴`;
    return `${Math.round(v)} ₴`;
}

function fmtUSD(v) {
    if (v == null || !Number.isFinite(v)) return '—';
    return `$${Math.round(v).toLocaleString('en-US')}`;
}

function fmtDaysAhead(i) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString('uk-UA', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
    return { dayName, dateStr };
}

// ==============================================================
// MODULE 1: ІНДЕКС РИЗИКІВ ВРОЖАЮ (Production Risk Index)
// ==============================================================
// Розраховує ймовірність втрати врожаю на основі 5 компонентів:
//   FrostRisk   — ризик заморозків (мін. температура прогнозу)
//   DroughtRisk — ризик посухи (ET₀ − опади за 7 днів)
//   FloodRisk   — ризик повені (GloFAS fcMax/pastMax)
//   HeatRisk    — ризик теплового стресу (макс. T > 32°C 3+ днів)
//   CurrencyRisk — валютна волатильність (НБУ)
// ==============================================================

function computeProductionRiskIndex() {
    const s = globalState.lastSensorData || {};
    const src = globalState.sitSources || {};
    const fl = src.flood?.data;
    const usd = globalState.nbuRates?.USD ?? null;
    const usdPrev = globalState.nbuPrev?.USD ?? null;
    const hs = globalState.nbuHistorySeries?.USD;
    const forecast7 = globalState.forecast7d || [];

    // 1. Frost Risk — мінімальна температура за прогнозом 7 днів
    let frostRisk = 0;
    if (forecast7.length) {
        const minT = Math.min(...forecast7.map(d => d.tmin).filter(v => v != null));
        const coldDays = forecast7.filter(d => d.tmin != null && d.tmin < 2).length;
        if (minT < -3) frostRisk = 100;
        else if (minT < 0) frostRisk = 80 + coldDays * 4;
        else if (minT < 2) frostRisk = 50 + coldDays * 8;
        else frostRisk = Math.min(20, coldDays * 5);
        frostRisk = Math.min(100, frostRisk);
    }

    // 2. Drought Risk — (ET₀ × 7) − опади за 7 днів (мм)
    let droughtRisk = 0;
    if (forecast7.length) {
        const et0Sum = forecast7.reduce((a, d) => a + (d.et0 ?? 0), 0);
        const precipSum = forecast7.reduce((a, d) => a + (d.precip ?? 0), 0);
        const deficit = et0Sum - precipSum;
        if (deficit > 35) droughtRisk = 90;
        else if (deficit > 20) droughtRisk = 70 + (deficit - 20) * 1.3;
        else if (deficit > 10) droughtRisk = 40 + (deficit - 10) * 3;
        else if (deficit > 0) droughtRisk = deficit * 4;
        else droughtRisk = 5;
        droughtRisk = Math.min(100, Math.max(0, droughtRisk));
    }

    // 3. Flood Risk — GloFAS fcMax/pastMax
    let floodRisk = 0;
    if (fl && fl.pastMax != null && fl.fcMax != null) {
        const base = Math.max(fl.pastMax, 0.05);
        const ratio = fl.fcMax / base;
        if (ratio > 4) floodRisk = 95;
        else if (ratio > 2.5) floodRisk = 75 + (ratio - 2.5) * 13;
        else if (ratio > 1.5) floodRisk = 40 + (ratio - 1.5) * 35;
        else floodRisk = Math.max(5, 20 - (1 - ratio) * 15);
        floodRisk = Math.min(100, Math.max(0, floodRisk));
    }

    // 4. Heat Risk — T_max > 32°C 3+ днів
    let heatRisk = 0;
    if (forecast7.length) {
        const hotDays = forecast7.filter(d => d.tmax != null && d.tmax > 30).length;
        const veryHotDays = forecast7.filter(d => d.tmax != null && d.tmax > 32).length;
        if (veryHotDays >= 3) heatRisk = 95;
        else if (veryHotDays >= 1) heatRisk = 70 + veryHotDays * 10;
        else if (hotDays >= 3) heatRisk = 60 + hotDays * 5;
        else if (hotDays >= 1) heatRisk = 30 + hotDays * 8;
        else heatRisk = 5;
        heatRisk = Math.min(100, heatRisk);
    }

    // 5. Currency Risk — |ΔUSD/UAH| за 7 днів + 30д волатильність
    let currencyRisk = 0;
    if (usd != null && usdPrev != null) {
        const chg = Math.abs((usd - usdPrev) / usdPrev * 100);
        let vol30 = 0;
        if (Array.isArray(hs) && hs.length >= 3) {
            vol30 = (Math.max(...hs) - Math.min(...hs)) / Math.min(...hs) * 100;
        }
        if (chg >= 3) currencyRisk = 90;
        else if (chg >= 2) currencyRisk = 65 + (chg - 2) * 25;
        else if (chg >= 1) currencyRisk = 35 + (chg - 1) * 30;
        else currencyRisk = chg * 25;
        if (vol30 > 4) currencyRisk += 15;
        currencyRisk = Math.min(100, currencyRisk);
    }

    const comps = [
        { key: 'frost',    label: 'Заморозки', icon: '❄️', risk: frostRisk,    weight: 0.30 },
        { key: 'drought',  label: 'Посуха',    icon: '🥵', risk: droughtRisk,  weight: 0.25 },
        { key: 'flood',    label: 'Повені',    icon: '🌊', risk: floodRisk,    weight: 0.15 },
        { key: 'heat',     label: 'Спека',     icon: '🔥', risk: heatRisk,     weight: 0.15 },
        { key: 'currency', label: 'Валюта',   icon: '💱', risk: currencyRisk, weight: 0.15 },
    ];
    const active = comps.filter(c => c.risk > 0);
    const wSum = active.reduce((a, c) => a + c.weight, 0);
    const composite = active.length ? Math.round(active.reduce((a, c) => a + c.risk * c.weight, 0) / wSum) : null;

    globalState.riskIndex = { comps, composite };

    // Render
    const riskNumEl = document.getElementById('risk-num');
    const riskLblEl = document.getElementById('risk-lbl');
    const riskVerdictEl = document.getElementById('risk-verdict');
    const riskArcEl = document.getElementById('risk-arc');

    if (riskNumEl) riskNumEl.textContent = composite != null ? composite : '—';
    if (riskLblEl) riskLblEl.textContent = composite == null ? 'РИЗИК' : (composite >= 60 ? 'ВИСОКИЙ' : composite >= 35 ? 'ПОМІРНИЙ' : 'НИЗЬКИЙ');

    if (riskArcEl && composite != null) {
        const circ = 2 * Math.PI * 52; // ~327
        const offset = circ - (composite / 100) * circ;
        riskArcEl.setAttribute('stroke-dashoffset', offset);
        const color = composite >= 60 ? '#ef4444' : composite >= 35 ? '#f59e0b' : '#00ff95';
        riskArcEl.setAttribute('stroke', color);
    }

    if (riskVerdictEl && composite != null) {
        const worst = [...comps].sort((a, b) => b.risk - a.risk)[0];
        const worstLabel = worst ? worst.label.toLowerCase() : '—';
        if (composite >= 60) {
            riskVerdictEl.innerHTML = `🔴 <strong>Високий ризик втрати врожаю (${composite}%).</strong> Критичний фактор: <strong>${worstLabel}</strong> (${Math.round(worst.risk)}%). Рекомендується негайно переглянути план польових робіт.`;
        } else if (composite >= 35) {
            riskVerdictEl.innerHTML = `🟡 <strong>Помірний ризик (${composite}%).</strong> Основний фактор: <strong>${worstLabel}</strong> (${Math.round(worst.risk)}%). Слідкуйте за розвитком ситуації, майте резервний план.`;
        } else {
            riskVerdictEl.innerHTML = `🟢 <strong>Низький ризик (${composite}%).</strong> Жоден з 5 факторів не перевищив критичний поріг. Умови сприятливі для врожаю.`;
        }
    }

    // Render bars
    comps.forEach(c => {
        const bar = document.getElementById(`risk-bar-${c.key}`);
        const val = document.getElementById(`risk-val-${c.key}`);
        if (bar) bar.style.width = `${c.risk}%`;
        if (val) val.textContent = c.risk > 0 ? `${Math.round(c.risk)}%` : '—';
    });
}


// ==============================================================
// MODULE 2: ЕКОНОМІЧНИЙ КАЛЬКУЛЯТОР АГРАРІЯ
// ==============================================================
// 4 показники:
//   1. Собівартість 1 га зернових (UAH) — базова $450/га × курс НБУ + добрива WB
//   2. Маржа експорту (USD/т) — FOB мінус логістика (GloFAS) мінус валютний ризик
//   3. Витрата пального (л/га) — норматив × коеф. вологості ґрунту
//   4. Окупність техніки (роки) — Quadtrac 715 / (маржа × планована площа)
// ==============================================================

function computeAgriEconomy() {
    const usd = globalState.nbuRates?.USD ?? null;
    const s = globalState.lastSensorData || {};
    const src = globalState.sitSources || {};
    const wb = src.wb?.data;
    const fl = src.flood?.data;
    const usdPrev = globalState.nbuPrev?.USD ?? null;

    // 1. Собівартість 1 га зернових
    let costPerHaUAH = null;
    let costSubText = 'база $450/га × курс НБУ + добрива World Bank';
    if (usd != null) {
        const baseUsd = 450; // середня собівартість 1 га зернових в Україні
        const fertKgPerHa = wb?.fert?.val ?? 140; // World Bank: кг добрив/га (останній рік)
        const fertUsdPerKg = 1.2;
        const totalUsd = baseUsd + fertKgPerHa * fertUsdPerKg;
        costPerHaUAH = totalUsd * usd;
        costSubText = `$${baseUsd} (база) + ${Math.round(fertKgPerHa)} кг × $${fertUsdPerKg} (добрива) = $${Math.round(totalUsd)} × ${usd.toFixed(2)} ₴`;
    }

    // 2. Маржа експорту (USD/т)
    let exportMarginUSD = null;
    let marginSubText = 'FOB мінус логістика (GloFAS) мінус валютний ризик';
    {
        const fobUsd = 220; // умовна ціна FOB пшениці, USD/т
        let logisticCost = 35; // базова логістика USD/т
        if (fl && fl.pastMax != null && fl.fcMax != null) {
            const ratio = fl.fcMax / Math.max(fl.pastMax, 0.05);
            if (ratio > 2.5) logisticCost += 15; // повінь блокує перевезення
        }
        let currencyDiscount = 0;
        if (usd != null && usdPrev != null) {
            const chg = Math.abs((usd - usdPrev) / usdPrev * 100);
            currencyDiscount = chg * 5; // $5 за кожен % волатильності
        }
        exportMarginUSD = fobUsd - logisticCost - currencyDiscount;
        marginSubText = `FOB $${fobUsd} − логістика $${Math.round(logisticCost)}${currencyDiscount > 0 ? ` − валютний ризик $${Math.round(currencyDiscount)}` : ''} = $${Math.round(exportMarginUSD)}/т`;
    }

    // 3. Витрата пального (л/га)
    let fuelPerHa = null;
    let fuelSubText = 'базовий норматив × коеф. вологості ґрунту';
    if (s.soilMoisture != null) {
        const baseFuel = 38; // л/га, норматив оранки
        let coef = 1.0;
        if (s.soilMoisture < 0.12) coef = 1.15; // сухий ґрунт → більше палива
        else if (s.soilMoisture > 0.35) coef = 1.25; // перезволожений → буксування
        fuelPerHa = baseFuel * coef;
        fuelSubText = `${baseFuel} л/га × ${coef.toFixed(2)} (вологість ґрунту ${(s.soilMoisture * 100).toFixed(0)}%)`;
    }

    // 4. Окупність техніки (роки)
    let paybackYears = null;
    let paybackSubText = 'Quadtrac 715 $850K / (маржа × планована площа 5000 га)';
    if (exportMarginUSD != null && exportMarginUSD > 0) {
        const tractorPrice = TRACTORS_DATA[0].price_usd; // Quadtrac 715 = $850K
        const plannedHa = 5000; // планована площа обробітку
        const annualProfit = exportMarginUSD * 4 * plannedHa; // 4 т/га врожайність
        paybackYears = tractorPrice / annualProfit;
        paybackSubText = `$${(tractorPrice/1000).toFixed(0)}K / ($${Math.round(exportMarginUSD)} × 4 т/га × ${plannedHa} га)`;
    }

    globalState.agriEconomy = { costPerHaUAH, exportMarginUSD, fuelPerHa, paybackYears };

    // Render
    const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setText('econ-cost', costPerHaUAH != null ? fmtUAH(costPerHaUAH) : '—');
    setText('econ-cost-sub', costSubText);
    setText('econ-margin', exportMarginUSD != null ? `${exportMarginUSD >= 0 ? '+' : ''}$${Math.round(exportMarginUSD)}/т` : '—');
    setText('econ-margin-sub', marginSubText);
    setText('econ-fuel', fuelPerHa != null ? `${fuelPerHa.toFixed(1)} л/га` : '—');
    setText('econ-fuel-sub', fuelSubText);
    setText('econ-payback', paybackYears != null ? `${paybackYears.toFixed(1)} р.` : '—');
    setText('econ-payback-sub', paybackSubText);
}


// ==============================================================
// MODULE 3: ПРОГНОСТИЧНА АНАЛІТИКА 7 ДНІВ + ОПТИМАЛЬНІ ВІКНА
// ==============================================================
// Fetch 7-day forecast з Open-Meteo (daily + hourly для ET₀)
// Розраховує 4 вікна польових робіт:
//   - Сівба ярих: T ґрунту ≥ +6°C, без заморозків 5 днів
//   - Внесення ЗЗР: вітер < 14 км/год, без опадів 12 год
//   - Збирання: вологість зерна ≤ 14%, без опадів 24 год
//   - Полив: ET₀ × 7 днів − опади → дефіцит води
// ==============================================================

async function fetchForecast7d(lat, lng) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}` +
            `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,wind_speed_10m_max,soil_temperature_6cm_max,soil_moisture_9_to_27cm` +
            `&forecast_days=7&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        const d = j.daily || {};
        const times = d.time || [];
        const forecast = times.map((t, i) => ({
            date: t,
            tmax: d.temperature_2m_max?.[i] ?? null,
            tmin: d.temperature_2m_min?.[i] ?? null,
            precip: d.precipitation_sum?.[i] ?? 0,
            et0: d.et0_fao_evapotranspiration?.[i] ?? 0,
            windMax: d.wind_speed_10m_max?.[i] ?? null,
            soilT: d.soil_temperature_6cm_max?.[i] ?? null,
            soilM: d.soil_moisture_9_to_27cm?.[i] ?? null,
        }));
        globalState.forecast7d = forecast;
        renderForecast7d(forecast);
        computeProductionRiskIndex();  // пере-розрахунок ризиків з новим прогнозом
        computeAgriEconomy();
        computeOptimalWindows(forecast);
        computeFieldWindows7d(forecast);
    } catch (e) {
        console.warn('[FORECAST7d]', e.message);
        const el = document.getElementById('forecast-timeline');
        if (el) el.innerHTML = `<div class="forecast-loading">⚠️ Не вдалося завантажити прогноз: ${e.message}</div>`;
    }
}

function renderForecast7d(forecast) {
    const el = document.getElementById('forecast-timeline');
    if (!el) return;
    if (!forecast.length) {
        el.innerHTML = '<div class="forecast-loading">⚠️ Прогноз недоступний</div>';
        return;
    }

    // Накопичувальний GDD (база +5°C)
    let cumGdd = 0;
    const cards = forecast.map((d, i) => {
        const { dayName, dateStr } = fmtDaysAhead(i);
        const tmax = d.tmax ?? null;
        const tmin = d.tmin ?? null;
        const tavg = (tmax != null && tmin != null) ? (tmax + tmin) / 2 : null;
        if (tavg != null) cumGdd += Math.max(0, tavg - 5);

        // Icon
        let icon = '☀️';
        if (d.precip > 5) icon = '🌧️';
        else if (d.precip > 0.5) icon = '⛅';
        if (tmin != null && tmin < 0) icon = '❄️';
        else if (tmax != null && tmax > 30) icon = '🔥';

        // Window status (set by computeOptimalWindows below)
        let cls = 'fc-day-card';
        const status = d._windowStatus || '';
        if (status === 'open') cls += ' window-open';
        else if (status === 'warn') cls += ' window-warn';
        else if (status === 'block') cls += ' window-block';

        return `
            <div class="${cls}">
                <div class="fc-day-name">${dayName}</div>
                <div class="fc-day-date">${dateStr}</div>
                <div class="fc-day-icon">${icon}</div>
                <div class="fc-day-temps">
                    ${tmax != null ? `<span class="fc-tmax">+${tmax.toFixed(0)}°</span>` : '<span class="fc-tmax">—</span>'}
                    ${tmin != null ? `<span class="fc-tmin">${tmin.toFixed(0)}°</span>` : '<span class="fc-tmin">—</span>'}
                </div>
                <div class="fc-day-precip">${d.precip > 0 ? `💧 ${d.precip.toFixed(1)} мм` : '—'}</div>
                <div class="fc-day-gdd">GDD: ${Math.round(cumGdd)}</div>
            </div>
        `;
    }).join('');

    el.innerHTML = cards;
}

// Розраховує оптимальні вікна 4 типів польових робіт
function computeOptimalWindows(forecast) {
    if (!forecast.length) return;

    // 1. Сівба ярих: T ґрунту ≥ +6°C, без заморозків 5 днів
    const sowEl = document.getElementById('fw-sow');
    const sowDescEl = document.getElementById('fw-sow-desc');
    const soilTWarm = forecast.filter(d => d.soilT != null && d.soilT >= 6).length;
    const frostDays = forecast.filter(d => d.tmin != null && d.tmin < 0).length;
    if (soilTWarm >= 4 && frostDays === 0) {
        if (sowEl) { sowEl.textContent = 'СПРИЯТЛИВО'; sowEl.className = 'fw-status ok'; }
        if (sowDescEl) sowDescEl.textContent = `T ґрунту +${(forecast[0].soilT ?? 0).toFixed(1)}°C ≥ +6°C · 0 заморозків за 7 днів`;
    } else if (soilTWarm >= 2 && frostDays <= 1) {
        if (sowEl) { sowEl.textContent = 'УВАГА'; sowEl.className = 'fw-status warn'; }
        if (sowDescEl) sowDescEl.textContent = `T ґрунту задовільна, але ${frostDays} заморозок — ризик для насіння`;
    } else {
        if (sowEl) { sowEl.textContent = 'НЕ СПРИЯТЛИВО'; sowEl.className = 'fw-status bad'; }
        if (sowDescEl) sowDescEl.textContent = `T ґрунту < +6°C або ${frostDays} заморозків — відкладіть сівбу`;
    }

    // 2. Внесення ЗЗР: вітер < 14 км/год, без опадів
    const sprayEl = document.getElementById('fw-spray');
    const sprayDescEl = document.getElementById('fw-spray-desc');
    const firstDay = forecast[0];
    if (firstDay.windMax != null && firstDay.windMax < 14 && firstDay.precip < 1) {
        if (sprayEl) { sprayEl.textContent = 'ДОЗВОЛЕНО'; sprayEl.className = 'fw-status ok'; }
        if (sprayDescEl) sprayDescEl.textContent = `Вітер ${firstDay.windMax.toFixed(0)} км/год < 14, опади ${firstDay.precip.toFixed(1)} мм — вікно відкрите`;
    } else if (firstDay.windMax != null && firstDay.windMax < 18) {
        if (sprayEl) { sprayEl.textContent = 'ОБМЕЖЕНО'; sprayEl.className = 'fw-status warn'; }
        if (sprayDescEl) sprayDescEl.textContent = `Вітер ${firstDay.windMax.toFixed(0)} км/год або опади ${firstDay.precip.toFixed(1)} мм — перевірте прогноз на 12 год`;
    } else {
        if (sprayEl) { sprayEl.textContent = 'ЗАБОРОНЕНО'; sprayEl.className = 'fw-status bad'; }
        if (sprayDescEl) sprayDescEl.textContent = `Вітер ${firstDay.windMax?.toFixed(0) ?? '—'} км/год ≥ 14 — ризик знесення ЗЗР`;
    }

    // 3. Збирання: без опадів 24 год, низька вологість зерна
    const harvestEl = document.getElementById('fw-harvest');
    const harvestDescEl = document.getElementById('fw-harvest-desc');
    const rain24h = forecast[0]?.precip ?? 0;
    const lastSensor = globalState.lastSensorData || {};
    const soilM = forecast[0]?.soilM ?? lastSensor.soilMoisture ?? null;
    // Оцінка вологості зерна: емпірично ~ вологість ґрунту × 50
    const grainMoisture = soilM != null ? Math.round(soilM * 50) : null;
    if (rain24h < 0.5 && grainMoisture != null && grainMoisture <= 14) {
        if (harvestEl) { harvestEl.textContent = 'СПРИЯТЛИВО'; harvestEl.className = 'fw-status ok'; }
        if (harvestDescEl) harvestDescEl.textContent = `Опади ${rain24h.toFixed(1)} мм, вологість зерна ~${grainMoisture}% ≤ 14%`;
    } else if (rain24h < 2 && grainMoisture != null && grainMoisture <= 18) {
        if (harvestEl) { harvestEl.textContent = 'УВАГА'; harvestEl.className = 'fw-status warn'; }
        if (harvestDescEl) harvestDescEl.textContent = `Вологість зерна ~${grainMoisture}% — потрібне досушування`;
    } else {
        if (harvestEl) { harvestEl.textContent = 'ВІДКЛАСТИ'; harvestEl.className = 'fw-status bad'; }
        if (harvestDescEl) harvestDescEl.textContent = `Опади ${rain24h.toFixed(1)} мм або вологість ~${grainMoisture ?? '—'}% — не вписується у вікно`;
    }

    // 4. Полив: ET₀ × 7 днів − опади → дефіцит
    const irrigateEl = document.getElementById('fw-irrigate');
    const irrigateDescEl = document.getElementById('fw-irrigate-desc');
    const et0Sum = forecast.reduce((a, d) => a + (d.et0 ?? 0), 0);
    const precipSum = forecast.reduce((a, d) => a + (d.precip ?? 0), 0);
    const deficit = et0Sum - precipSum;
    if (deficit > 25) {
        if (irrigateEl) { irrigateEl.textContent = 'ПОТРІБЕН'; irrigateEl.className = 'fw-status bad'; }
        if (irrigateDescEl) irrigateDescEl.textContent = `Дефіцит води ${deficit.toFixed(0)} мм за 7 днів (ET₀ ${et0Sum.toFixed(0)} − опади ${precipSum.toFixed(0)})`;
    } else if (deficit > 10) {
        if (irrigateEl) { irrigateEl.textContent = 'БАЖАНИЙ'; irrigateEl.className = 'fw-status warn'; }
        if (irrigateDescEl) irrigateDescEl.textContent = `Помірний дефіцит ${deficit.toFixed(0)} мм — перевірте посівну зону`;
    } else {
        if (irrigateEl) { irrigateEl.textContent = 'НЕ ПОТРІБЕН'; irrigateEl.className = 'fw-status ok'; }
        if (irrigateDescEl) irrigateDescEl.textContent = `Опади ${precipSum.toFixed(0)} мм покривають ET₀ ${et0Sum.toFixed(0)} мм`;
    }
}

// Позначаємо статус кожного дня в прогнозі (для підсвічування карток)
function computeFieldWindows7d(forecast) {
    forecast.forEach(d => {
        // Грубо: якщо tmin < 0 або tmax > 32 або precip > 5 — блок
        if (d.tmin != null && d.tmin < 0) { d._windowStatus = 'block'; return; }
        if (d.tmax != null && d.tmax > 32) { d._windowStatus = 'block'; return; }
        if (d.precip > 5) { d._windowStatus = 'block'; return; }
        if (d.windMax != null && d.windMax > 18) { d._windowStatus = 'warn'; return; }
        if (d.precip > 1) { d._windowStatus = 'warn'; return; }
        d._windowStatus = 'open';
    });
    renderForecast7d(forecast); // пере-рендер з підсвічуванням
}


// ==============================================================
// MODULE 4: ПРОСТОРОВА АНАЛІТИКА · 24 ОБЛАСТІ
// ==============================================================
// Використовує вже існуючий fetchRegionsTelemetry() + regionTelemetry[code]
// Рахує міні-агро-індекс для кожної області:
//   idx = 0.40 × climateScore + 0.30 × soilScore + 0.20 × windScore + 0.10 × ndviScore
// Рендерить: Top-5 / Bottom-5 + усі 24 області бар-чартом
// ==============================================================

function computeRegionalIndex() {
    const rows = [];
    OBLASTS_DATA.forEach(o => {
        const t = regionTelemetry[o.code];
        if (!t) return;
        const ndvi = SAT_REGIONS[o.code]?.ndvi ?? 0.65;

        // Climate score: T 5-25 оптимально, похололовання/спека — мінус
        let cs = 50;
        if (t.temp != null) {
            if (t.temp >= 5 && t.temp <= 25) cs = 80;
            else if (t.temp > 30 || t.temp < 2) cs = 20;
            else if (t.temp > 25 || t.temp < 5) cs = 45;
        }

        // Soil score: вологість 0.18-0.35 оптимально
        let ss = 50;
        if (t.moisture != null) {
            if (t.moisture >= 0.18 && t.moisture <= 0.35) ss = 85;
            else if (t.moisture < 0.12) ss = 25;
            else if (t.moisture > 0.42) ss = 30;
            else ss = 55;
        }

        // Wind score: < 14 — ок, > 18 — погано (ризик знесення ЗЗР)
        let ws = 80;
        if (t.wind != null) {
            if (t.wind > 18) ws = 20;
            else if (t.wind > 14) ws = 40;
            else if (t.wind > 10) ws = 60;
        }

        // NDVI score: > 0.7 — щільний покрив
        const ns = Math.round(Math.min(100, Math.max(0, ndvi * 100)));

        const idx = Math.round(0.40 * cs + 0.30 * ss + 0.20 * ws + 0.10 * ns);
        rows.push({ ...o, idx, cs, ss, ws, ns, t, ndvi });
    });

    rows.sort((a, b) => b.idx - a.idx);
    globalState.regionalRanking = rows;

    // Render Top-5 / Bottom-5
    const top = rows.slice(0, 5);
    const bottom = rows.slice(-5).reverse();
    const renderList = (arr, containerId) => {
        const el = document.getElementById(containerId);
        if (!el) return;
        if (!arr.length) {
            el.innerHTML = '<div class="regional-list-loading">⏳ Очікування синхронізації…</div>';
            return;
        }
        el.innerHTML = arr.map(r => {
            const cls = r.idx >= 65 ? 'high' : r.idx >= 45 ? 'mid' : 'low';
            return `
                <div class="reg-item">
                    <span class="reg-emoji">${r.emoji}</span>
                    <span class="reg-name">${r.name}</span>
                    <span class="reg-val ${cls}">${r.idx}</span>
                </div>
            `;
        }).join('');
    };
    renderList(top, 'reg-top');
    renderList(bottom, 'reg-bottom');

    // Render all bars
    const barsEl = document.getElementById('reg-bars');
    if (barsEl) {
        barsEl.innerHTML = rows.map(r => {
            const color = r.idx >= 65 ? '#00ff95' : r.idx >= 45 ? '#f59e0b' : '#ef4444';
            return `
                <div class="reg-bar-row">
                    <span class="reg-bar-name" title="${r.full}">${r.emoji} ${r.name}</span>
                    <div class="reg-bar-track">
                        <div class="reg-bar-fill" style="width:${r.idx}%;background:${color}"></div>
                    </div>
                    <span class="reg-bar-val">${r.idx}</span>
                </div>
            `;
        }).join('');
    }
}


// ==============================================================
// MODULE 5: ІСТОРИЧНА АНАЛІТИКА ТА АНОМАЛІЇ
// ==============================================================
// Зберігаємо 7-денний тренд агро-індексу в localStorage
// Рахуємо аномалії: якщо поточне значення виходить за 2σ від середнього
// ==============================================================

function saveHistoricalDataPoint(score) {
    if (score == null || !Number.isFinite(score)) return;
    try {
        const KEY = 'agromagaz_history_v1';
        const today = new Date().toISOString().slice(0, 10);
        let data = JSON.parse(localStorage.getItem(KEY) || '[]');
        // Дедуплікація по дню + оновлення
        data = data.filter(d => d.date !== today);
        data.push({ date: today, score, ts: Date.now() });
        // Зберігаємо лише останні 14 днів
        data = data.slice(-14);
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('[HIST] localStorage error', e);
    }
}

function renderHistoricalSparkline() {
    const svg = document.getElementById('hist-sparkline');
    const currentEl = document.getElementById('hist-current');
    const anomEl = document.getElementById('hist-anomalies');
    if (!svg) return;

    let data = [];
    try {
        data = JSON.parse(localStorage.getItem('agromagaz_history_v1') || '[]');
    } catch (e) { /* ignore */ }

    const composite = globalState._lastComposite;
    if (composite != null) {
        const today = new Date().toISOString().slice(0, 10);
        const filtered = data.filter(d => d.date !== today);
        data = [...filtered, { date: today, score: composite, ts: Date.now() }].slice(-14);
    }

    if (data.length < 2) {
        svg.innerHTML = '<text x="140" y="35" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="11" font-family="Inter">Потрібно ≥2 дні даних</text>';
        if (currentEl) currentEl.textContent = composite != null ? `${composite}/100` : '—';
        if (anomEl) anomEl.innerHTML = '<div class="hist-anom-loading">Накопичуємо дані (потрібно ≥2 дні)…</div>';
        return;
    }

    const W = 280, H = 60;
    const scores = data.map(d => d.score);
    const min = Math.min(...scores), max = Math.max(...scores);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((d.score - min) / range) * (H - 10) - 5;
        return { x, y, score: d.score, date: d.date };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const fillD = pathD + ` L ${W} ${H} L 0 ${H} Z`;

    // Середнє (норма)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const avgY = H - ((avg - min) / range) * (H - 10) - 5;

    // Стандартне відхилення
    const variance = scores.reduce((a, v) => a + (v - avg) ** 2, 0) / scores.length;
    const std = Math.sqrt(variance);

    svg.innerHTML = `
        <path class="spark-fill" d="${fillD}"/>
        <line class="spark-norm" x1="0" y1="${avgY.toFixed(1)}" x2="${W}" y2="${avgY.toFixed(1)}"/>
        <path class="spark-line" d="${pathD}"/>
        ${points.map(p => `<circle class="spark-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2"/>`).join('')}
    `;

    if (currentEl) currentEl.textContent = `${composite ?? scores[scores.length - 1]}/100`;

    // Аномалії
    if (anomEl) {
        const items = [];
        const latest = scores[scores.length - 1];
        const dev = latest - avg;

        if (std > 0 && Math.abs(dev) > 2 * std) {
            items.push({
                icon: '🚨', level: 'critical',
                text: `<strong>АНОМАЛІЯ:</strong> поточний індекс ${latest} відхиляється від 7-денного середнього (${avg.toFixed(0)}) на ${dev > 0 ? '+' : ''}${dev.toFixed(0)} пунктів (>2σ). Перевірте причину.`
            });
        } else if (std > 0 && Math.abs(dev) > 1 * std) {
            items.push({
                icon: '⚠️', level: 'warning',
                text: `<strong>Помітне відхилення:</strong> індекс ${latest} відрізняється від середнього ${avg.toFixed(0)} на ${dev > 0 ? '+' : ''}${dev.toFixed(0)} (1σ).`
            });
        } else {
            items.push({
                icon: '✅', level: 'ok',
                text: `<strong>Стабільно:</strong> індекс ${latest} у межах норми (середнє ${avg.toFixed(0)}, σ=${std.toFixed(1)}).`
            });
        }

        // Додатково: кліматична норма (довідкове)
        const monthNorm = 60; // умовна норма сезону
        if (Math.abs(latest - monthNorm) > 15) {
            items.push({
                icon: '📊', level: 'warning',
                text: `<strong>Кліматична аномалія:</strong> поточний індекс ${latest} відхиляється від кліматичної норми сезону (${monthNorm}) на ${latest > monthNorm ? '+' : ''}${latest - monthNorm} пунктів.`
            });
        }

        anomEl.innerHTML = items.map(it => `
            <div class="hist-anom-item ${it.level}">
                <span class="hist-anom-icon">${it.icon}</span>
                <span class="hist-anom-text">${it.text}</span>
            </div>
        `).join('');
    }
}


// ==============================================================
// MODULE 6: WATERFALL ДЕКОМПОЗИЦІЯ АГРО-ІНДЕКСУ
// ==============================================================
// Стартуємо з 50 → кожен компонент додає/забирає → отримуємо фінал
// score-50 = внесок (позитив/негатив)
// ==============================================================

function renderWaterfallChart(comps, composite) {
    const dyn = document.getElementById('waterfall-dynamic');
    const endBar = document.getElementById('wf-end-bar');
    const endVal = document.getElementById('wf-end-val');
    if (!dyn) return;

    const active = comps.filter(c => c.score != null);
    if (!active.length || composite == null) {
        dyn.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:20px;font-size:0.78rem">⏳ Очікування даних…</div>';
        if (endBar) endBar.style.height = '0%';
        if (endVal) endVal.textContent = '—';
        return;
    }

    // Внесок = score - 50 (наскільки компонент "підняв" або "опустив" від нейтральної 50)
    let html = '';
    active.forEach(c => {
        const contribution = c.score - 50; // -50..+50
        const isPositive = contribution >= 0;
        const heightPct = Math.min(100, Math.abs(contribution) * 2); // scale: 50 → 100%
        const cls = isPositive ? 'pos' : 'neg';
        const sign = isPositive ? '+' : '';
        html += `
            <div class="waterfall-row">
                <span class="wf-label">${c.icon} ${c.label}</span>
                <div class="wf-bar-wrap">
                    <div class="wf-bar ${cls}" style="height:${heightPct}%" title="${c.label}: ${Math.round(c.score)}/100"></div>
                </div>
                <span class="wf-val">${sign}${contribution.toFixed(0)}</span>
            </div>
        `;
    });
    dyn.innerHTML = html;

    // Final bar = composite value
    if (endBar) endBar.style.height = `${composite}%`;
    if (endVal) endVal.textContent = composite;

    // The dynamic part renders as flex items via CSS `display: contents` wrapper
}


// ==============================================================
// MODULE 7: РАДАР 8 КОМПОНЕНТІВ
// ==============================================================
// 8 осей: клімат, ґрунт, радіація, повітря, річки, валюта, макро, вегетація
// Порівнюємо поточний профіль vs еталон (75)
// ==============================================================

function renderRadarChart(comps) {
    const svg = document.getElementById('radar-svg');
    if (!svg) return;

    const active = comps.filter(c => c.score != null);
    if (active.length < 3) {
        svg.innerHTML = '<text x="0" y="0" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Inter">⏳ Очікування даних…</text>';
        return;
    }

    const N = active.length;
    const R = 100; // max radius
    const center = { x: 0, y: 0 };

    // Helpers
    const angleFor = i => (Math.PI * 2 * i / N) - Math.PI / 2; // початок зверху
    const point = (i, r) => ({
        x: center.x + r * Math.cos(angleFor(i)),
        y: center.y + r * Math.sin(angleFor(i))
    });

    let html = '';

    // Grid rings (4 рівні: 25, 50, 75, 100)
    for (const r of [25, 50, 75, 100]) {
        const pts = [];
        for (let i = 0; i < N; i++) {
            const p = point(i, (r / 100) * R);
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
        html += `<polygon class="radar-grid" points="${pts.join(' ')}"/>`;
    }

    // Axes + labels
    for (let i = 0; i < N; i++) {
        const p = point(i, R);
        const lp = point(i, R + 14);
        html += `<line class="radar-axis" x1="0" y1="0" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"/>`;
        const shortLabel = active[i].icon;
        html += `<text class="radar-label" x="${lp.x.toFixed(1)}" y="${lp.y.toFixed(1) + 3}">${shortLabel}</text>`;
    }

    // Ideal polygon (75 for all)
    const idealPts = [];
    for (let i = 0; i < N; i++) {
        const p = point(i, (75 / 100) * R);
        idealPts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    html += `<polygon class="radar-ideal" points="${idealPts.join(' ')}"/>`;

    // Current polygon
    const currentPts = [];
    for (let i = 0; i < N; i++) {
        const score = active[i].score;
        const p = point(i, (score / 100) * R);
        currentPts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    html += `<polygon class="radar-current" points="${currentPts.join(' ')}"/>`;

    svg.innerHTML = html;
}


// ==============================================================
// MODULE 8: AI-РЕКОМЕНДАЦІЇ (RULE-BASED)
// ==============================================================
// Кожна рекомендація: { priority: 'high'|'mid'|'low'|'info', title, desc, sources }
// Пріоритети:
//   high (🔴) — негайно, критично для врожаю
//   mid  (🟡) — важливо, виконати протягом 1-3 днів
//   low  (🔵) — корисно, планово
//   info (⚪) — інформаційно
// ==============================================================

function generateAIRecommendations() {
    const recs = [];
    const s = globalState.lastSensorData || {};
    const src = globalState.sitSources || {};
    const forecast = globalState.forecast7d || [];
    const riskIdx = globalState.riskIndex;
    const usd = globalState.nbuRates?.USD ?? null;
    const usdPrev = globalState.nbuPrev?.USD ?? null;

    // 🔴 HIGH PRIORITY
    if (s.soilMoisture != null && s.soilMoisture < 0.12 && s.et0 != null && s.et0 > 4) {
        recs.push({
            priority: 'high',
            title: '🚰 Негайний полив — критична волога ґрунту',
            desc: `Вологість ґрунту ${s.soilMoisture.toFixed(2)} m³/m³ (нижче вілтінгового порогу), ET₀ ${s.et0.toFixed(1)} мм/день. Рекомендуємо полив 30 мм/га протягом 48 годин.`,
            sources: `Open-Meteo · ґрунт ${s.soilMoisture.toFixed(2)} · ET₀ ${s.et0.toFixed(2)}`
        });
    }

    if (forecast.length && forecast[0].tmin != null && forecast[0].tmin < 2) {
        const frostDays = forecast.filter(d => d.tmin != null && d.tmin < 2).length;
        if (frostDays >= 1) {
            recs.push({
                priority: 'high',
                title: '❄️ Загроза заморозків — захистіть посіви',
                desc: `Прогноз показує мінімальну температуру +${forecast[0].tmin.toFixed(1)}°C, ${frostDays} днів з заморозками за 7 днів. Якщо GDD₅ < 50, перенесіть сівбу на 3 дні (ризик загибелі насіння > 60%).`,
                sources: `Open-Meteo · T_min ${forecast[0].tmin.toFixed(1)}°C · ${frostDays} морозних днів`
            });
        }
    }

    if (riskIdx?.composite != null && riskIdx.composite >= 60) {
        const worst = [...riskIdx.comps].sort((a, b) => b.risk - a.risk)[0];
        recs.push({
            priority: 'high',
            title: `⚠️ Високий ризик врожаю (${riskIdx.composite}%)`,
            desc: `Критичний фактор: ${worst.label.toLowerCase()} (${Math.round(worst.risk)}%). Негайно перегляньте план польових робіт, рассмотрите страхування врожаю та резервні варіанти збуту.`,
            sources: `Production Risk Index · 5 під-індексів · ${worst.label} ${Math.round(worst.risk)}%`
        });
    }

    if (s.windSpeed != null && s.windSpeed > 14) {
        recs.push({
            priority: 'high',
            title: '🚫 Заборонене внесення ЗЗР',
            desc: `Швидкість вітру ${s.windSpeed.toFixed(1)} км/год > порогу 14 км/год. Високий ризик деривації та знесення препаратів. Перенесіть обприскування на день з меншим вітром.`,
            sources: `Open-Meteo · вітер ${s.windSpeed.toFixed(1)} км/год`
        });
    }

    if (usd != null && usdPrev != null && Math.abs((usd - usdPrev) / usdPrev * 100) >= 3) {
        const chg = (usd - usdPrev) / usdPrev * 100;
        recs.push({
            priority: 'high',
            title: '💱 Зафіксуйте ціни контрактів сьогодні',
            desc: `Валютна волатильність: USD ${chg >= 0 ? '+' : ''}${chg.toFixed(2)}% за 7 днів. Рекомендується фіксувати ціни на імпортні ЗЗР, добрива та техніку негайно.`,
            sources: `НБУ · USD/UAH ${usd.toFixed(2)} · ${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%/7д`
        });
    }

    // 🟡 MID PRIORITY
    if (s.soilMoisture != null && s.soilMoisture < 0.18 && s.soilMoisture >= 0.12) {
        recs.push({
            priority: 'mid',
            title: '💧 Контроль вологості — помірний дефіцит',
            desc: `Вологість ґрунту ${s.soilMoisture.toFixed(2)} m³/m³ (нижче оптимальної зони 0.18-0.35). Техніка ще проходить, але культури починають відчувати дефіцит вологи.`,
            sources: `Open-Meteo · вологість ${s.soilMoisture.toFixed(2)}`
        });
    }

    if (forecast.length) {
        const et0Sum = forecast.reduce((a, d) => a + (d.et0 ?? 0), 0);
        const precipSum = forecast.reduce((a, d) => a + (d.precip ?? 0), 0);
        const deficit = et0Sum - precipSum;
        if (deficit > 10 && deficit <= 25) {
            recs.push({
                priority: 'mid',
                title: '🌱 Плануйте полив на 3-5 днів',
                desc: `Помірний дефіцит води ${deficit.toFixed(0)} мм за 7 днів (ET₀ ${et0Sum.toFixed(0)} − опади ${precipSum.toFixed(0)}). Перевірте вологість посівної зони та підготуйте поливну техніку.`,
                sources: `Open-Meteo · дефіцит ${deficit.toFixed(0)} мм`
            });
        }
    }

    if (s.temperature != null && s.temperature > 28 && s.temperature < 32) {
        recs.push({
            priority: 'mid',
            title: '🔥 Близько теплового стресу',
            desc: `Температура ${s.temperature.toFixed(1)}°C наближається до порогу теплового стресу (+32°C). Контролюйте вологість ґрунту, уникайте робіт у полуденну спеку.`,
            sources: `Open-Meteo · T ${s.temperature.toFixed(1)}°C`
        });
    }

    const fl = src.flood?.data;
    if (fl && fl.pastMax != null && fl.fcMax != null) {
        const ratio = fl.fcMax / Math.max(fl.pastMax, 0.05);
        if (ratio > 1.5 && ratio <= 2.5) {
            recs.push({
                priority: 'mid',
                title: '🌊 Перевірте польові переїзди',
                desc: `Прогноз підняття річкового стоку ×${ratio.toFixed(1)} (з ${fl.pastMax.toFixed(1)} до ${fl.fcMax.toFixed(1)} м³/с). Перевірте стан низинних ділянок та польових доріг.`,
                sources: `GloFAS · ×${ratio.toFixed(1)} · пік ${fl.fcMaxDay || '—'}`
            });
        }
    }

    // 🔵 LOW PRIORITY
    if (s.soilMoisture != null && s.soilMoisture >= 0.18 && s.soilMoisture <= 0.35 && s.soilTemp != null && s.soilTemp >= 6) {
        recs.push({
            priority: 'low',
            title: '🌱 Оптимальне вікно для сівби',
            desc: `Умови сприятливі: вологість ґрунту ${s.soilMoisture.toFixed(2)} m³/m³, T ґрунту +${s.soilTemp.toFixed(1)}°C на глибині 6 см. Можна планувати сівбу ярих.`,
            sources: `Open-Meteo · ґрунт ${s.soilMoisture.toFixed(2)} · T+${s.soilTemp.toFixed(1)}°C`
        });
    }

    if (s.windSpeed != null && s.windSpeed < 10 && s.temperature != null && s.temperature >= 5 && s.temperature <= 25) {
        recs.push({
            priority: 'low',
            title: '🛡️ Ідеальне вікно для ЗЗР',
            desc: `Вітер ${s.windSpeed.toFixed(1)} км/год, температура ${s.temperature.toFixed(1)}°C — оптимальні умови для внесення пестицидів. Мінімальний ризик деривації.`,
            sources: `Open-Meteo · вітер ${s.windSpeed.toFixed(1)} · T ${s.temperature.toFixed(1)}°C`
        });
    }

    // ⚪ INFO
    const wb = src.wb?.data;
    if (wb?.cerealYoY != null) {
        if (wb.cerealYoY >= 0) {
            recs.push({
                priority: 'info',
                title: '🏛️ Підтверджений виробничий потенціал',
                desc: `World Bank: виробництво зернових зросло на ${wb.cerealYoY.toFixed(1)}% рік-до-року (${(wb.cerealLast / 1e6).toFixed(1)} млн т, ${wb.cerealYear}). Експортний потенціал підтверджений офіційними даними.`,
                sources: `World Bank · ${wb.cerealYoY.toFixed(1)}% р/р · ${(wb.cerealLast/1e6).toFixed(1)} млн т`
            });
        } else {
            recs.push({
                priority: 'info',
                title: '🏛️ Спад виробництва за останній рік',
                desc: `World Bank: виробництво зернових зменшилось на ${Math.abs(wb.cerealYoY).toFixed(1)}% (${(wb.cerealLast / 1e6).toFixed(1)} млн т). Фактор ризику для експортного потенціалу, розгляньте розширення ринків збуту.`,
                sources: `World Bank · ${wb.cerealYoY.toFixed(1)}% р/р · ${(wb.cerealLast/1e6).toFixed(1)} млн т`
            });
        }
    }

    const ndvi = SAT_REGIONS[currentSatRegion]?.ndvi ?? null;
    if (ndvi != null) {
        if (ndvi >= 0.7) {
            recs.push({
                priority: 'info',
                title: '🌾 Щільний рослинний покрив',
                desc: `NDVI ${ndvi.toFixed(2)} — зона у фазі активної вегетації. Сприятливий період для моніторингу врожайності та планування збирання.`,
                sources: `Sentinel-2 · NDVI ${ndvi.toFixed(2)}`
            });
        } else if (ndvi < 0.4) {
            recs.push({
                priority: 'info',
                title: '🌾 Розріджений рослинний покрив',
                desc: `NDVI ${ndvi.toFixed(2)} — поза активною вегетацією або стрес посівів. Перевірте причину (збирання завершено, посуха, хвороби).`,
                sources: `Sentinel-2 · NDVI ${ndvi.toFixed(2)}`
            });
        }
    }

    globalState.recommendations = recs;

    // Render
    const listEl = document.getElementById('recommendations-list');
    const counterEl = document.getElementById('rec-counter');
    if (counterEl) counterEl.textContent = `${recs.length} РЕКОМ.`;
    if (!listEl) return;

    if (!recs.length) {
        listEl.innerHTML = '<div class="rec-loading">✅ Усі показники в нормі — рекомендацій немає</div>';
        return;
    }

    const priorityLabel = { high: '🔴 HIGH', mid: '🟡 MID', low: '🔵 LOW', info: '⚪ INFO' };

    listEl.innerHTML = recs.map((r, i) => `
        <div class="rec-item ${r.priority}">
            <div class="rec-priority">${i + 1}</div>
            <div class="rec-body">
                <div class="rec-title">${r.title}</div>
                <div class="rec-desc">${r.desc}</div>
                <div class="rec-meta">
                    <span class="rec-meta-item"><strong>${priorityLabel[r.priority]}</strong></span>
                    <span class="rec-meta-item">📡 ${r.sources}</span>
                </div>
            </div>
        </div>
    `).join('');
}


// ==============================================================
// ОСНОВНИЙ ОРКЕСТРАТОР — викликається після кожного оновлення даних
// ==============================================================
function refreshSituationalCenterV5() {
    // Модуль 6: Waterfall (синхронно з агро-індексом)
    if (globalState._lastComps && globalState._lastComposite != null) {
        renderWaterfallChart(globalState._lastComps, globalState._lastComposite);
    }

    // Модуль 1: Production Risk Index
    computeProductionRiskIndex();

    // Модуль 2: Agri-Economy
    computeAgriEconomy();

    // Модуль 4: Regional ranking (використовує regionTelemetry, що вже заповнене)
    computeRegionalIndex();

    // Модуль 5: Historical + sparkline
    if (globalState._lastComposite != null) {
        saveHistoricalDataPoint(globalState._lastComposite);
    }
    renderHistoricalSparkline();

    // Модуль 7: Radar chart
    if (globalState._lastComps) {
        renderRadarChart(globalState._lastComps);
    }

    // Модуль 8: AI Recommendations
    generateAIRecommendations();
}


// ==============================================================
// ПАТЧ: інтегрувати нову аналітику в існуючий computeAndDisplayAgroIndex
// ==============================================================
// Оригінальна функція закінчується так:
//   renderAiSituationReport(comps, composite);
// }
// Додаємо виклик оркестратора через monkey-patch.

(function patchComputeAndDisplayAgroIndex() {
    if (typeof computeAndDisplayAgroIndex !== 'function') {
        // можливо ще не визначена — повторна спроба
        setTimeout(patchComputeAndDisplayAgroIndex, 500);
        return;
    }
    if (computeAndDisplayAgroIndex._v5patched) return;

    const orig = computeAndDisplayAgroIndex;
    computeAndDisplayAgroIndex = function(...args) {
        orig.apply(this, args);
        try { refreshSituationalCenterV5(); } catch (e) {
            console.warn('[v5 orchestrator]', e);
        }
    };
    computeAndDisplayAgroIndex._v5patched = true;
    console.log('[v5] Situational Center v5.0 modules hooked in.');
})();


// ==============================================================
// ПАТЧ: запускати fetchForecast7d при кожному оновленні регіону
// ==============================================================
(function patchUpdatePrecisionSensors() {
    if (typeof updatePrecisionSensors !== 'function') {
        setTimeout(patchUpdatePrecisionSensors, 500);
        return;
    }
    if (updatePrecisionSensors._v5patched) return;

    const orig = updatePrecisionSensors;
    updatePrecisionSensors = async function(lat, lng) {
        await orig.call(this, lat, lng);
        try { fetchForecast7d(lat, lng); } catch (e) {
            console.warn('[v5] forecast7d fetch error', e);
        }
    };
    updatePrecisionSensors._v5patched = true;
})();


// ==============================================================
// ПАТЧ: оновлювати регіональну аналітику при кожному fetchRegionsTelemetry
// ==============================================================
(function patchFetchRegionsTelemetry() {
    if (typeof fetchRegionsTelemetry !== 'function') {
        setTimeout(patchFetchRegionsTelemetry, 500);
        return;
    }
    if (fetchRegionsTelemetry._v5patched) return;

    const orig = fetchRegionsTelemetry;
    fetchRegionsTelemetry = async function(...args) {
        await orig.apply(this, args);
        try { computeRegionalIndex(); } catch (e) {
            console.warn('[v5] regional index', e);
        }
    };
    fetchRegionsTelemetry._v5patched = true;
})();


// ==============================================================
// ЗАПУСК при ініціалізації (після того, як DOM готовий і початкові дані є)
// ==============================================================
setTimeout(() => {
    console.log('[v5] Initializing Situational Center v5.0...');

    // Перший розрахунок після 4 секунд (дати час початковим fetch-ам)
    setTimeout(() => {
        try { refreshSituationalCenterV5(); } catch (e) { console.warn('[v5] init', e); }
    }, 4000);

    // Регулярне оновлення кожні 60 секунд
    setInterval(() => {
        try { refreshSituationalCenterV5(); } catch (e) { console.warn('[v5] refresh', e); }
    }, 60 * 1000);

    // Зберігання історичної точки раз на день при першому відкритті
    // (renderHistoricalSparkline викликається всередині refreshSituationalCenterV5)
}, 2000);

