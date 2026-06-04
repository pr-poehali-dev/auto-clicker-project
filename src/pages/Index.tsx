import { useState } from "react";
import Icon from "@/components/ui/icon";

// Klick'r (Smart AutoClicker) — open-source автокликер для Android
// GitHub: https://github.com/Nain57/Smart-AutoClicker
const APK_URL = "https://github.com/Nain57/Smart-AutoClicker/releases/latest/download/klickr-release.apk";
const APP_NAME = "Klick'r";
const APP_VERSION = "4.x";
const APP_ANDROID = "Android 8.0+";
const APP_SIZE = "~15 MB";

const FEATURES = [
  { icon: "Layers",     color: "green", tag: "OVERLAY",  title: "Работает поверх любой игры",     desc: "Плавающая кнопка всегда на экране. Открыл игру — кнопка уже сверху. Нажал ⚡ — кликер запустился, ты продолжаешь играть." },
  { icon: "Crosshair",  color: "cyan",  tag: "ПРИЦЕЛ",   title: "Выбор точки тапа",                desc: "Указываешь точное место на экране — там кликер будет тапать. Можно добавить несколько точек." },
  { icon: "Timer",      color: "green", tag: "СКОРОСТЬ",  title: "Любая задержка",                  desc: "От миллисекунд до нескольких секунд. Слайдер + ручной ввод. Точно настраиваешь скорость тапов." },
  { icon: "Move",       color: "cyan",  tag: "ЖЕСТЫ",    title: "Свайпы и жесты",                  desc: "Записывай движения пальца — перетаскивания, свайпы, круговые движения, не только тапы." },
  { icon: "Eye",        color: "green", tag: "УМНЫЙ",    title: "Клик по картинке",                desc: "Кликает только когда на экране появляется нужный элемент — кнопка, иконка, монета." },
  { icon: "BookMarked", color: "cyan",  tag: "ПРОФИЛИ",  title: "Сценарии и профили",              desc: "Сохраняй разные конфиги для разных игр. Переключай одним тапом из overlay-панели." },
  { icon: "Shuffle",    color: "green", tag: "АНТИБАН",  title: "Рандомизация",                    desc: "Случайные отклонения позиции и задержки — имитирует живые касания, обходит защиту игр." },
  { icon: "Clock",      color: "cyan",  tag: "АВТО-СТОП","title": "Авто-остановка",                desc: "Остановится сам после нужного количества тапов или через заданное время." },
  { icon: "Repeat",     color: "green", tag: "МУЛЬТИ",   title: "Несколько точек по очереди",      desc: "Задай последовательность тапов — кликер будет повторять её по кругу снова и снова." },
  { icon: "Moon",       color: "cyan",  tag: "ФОНОВЫЙ",  title: "Работа при выключенном экране",   desc: "Продолжает работать даже если экран погас. Для длительного фарма." },
  { icon: "Github",     color: "green", tag: "FREE",     title: "Open-source, без рекламы",        desc: "Открытый код на GitHub. Никакой рекламы, никаких подписок, никакой слежки." },
  { icon: "Zap",        color: "cyan",  tag: "БЫСТРО",   title: "Горячая кнопка старт/стоп",       desc: "Не нужно выходить из игры — плавающая кнопка поверх экрана в одно нажатие." },
];

const STEPS = [
  { n: "01", icon: "Download",      title: "Скачай APK",                   color: "green",
    desc: "Нажми кнопку «Скачать APK». Файл (~15 MB) загрузится в папку «Загрузки».",
    tip: null },
  { n: "02", icon: "FolderOpen",    title: "Открой загруженный файл",      color: "green",
    desc: "Зайди в «Загрузки» → найди klickr-release.apk → нажми на файл.",
    tip: null },
  { n: "03", icon: "Shield",        title: "Разреши установку",            color: "cyan",
    desc: "Android спросит разрешение. Нажми «Настройки» → включи «Разрешить из этого источника» → вернись и нажми «Установить».",
    tip: "Это стандартная процедура для приложений не из Play Market" },
  { n: "04", icon: "Layers",        title: "Дай право overlay",            color: "cyan",
    desc: "При первом запуске нажми «Разрешить отображение поверх других приложений» — без этого кнопка не будет видна в игре.",
    tip: null },
  { n: "05", icon: "Accessibility", title: "Включи Accessibility",         color: "green",
    desc: "Приложение попросит включить Accessibility Service — это нужно для самих тапов. Нажми «Открыть настройки» → найди Klick'r → включи.",
    tip: "Тот же механизм используют менеджеры паролей — это безопасно" },
  { n: "06", icon: "PlusCircle",    title: "Создай сценарий",              color: "green",
    desc: "Нажми «+» в приложении → выбери точку на экране → задай задержку → сохрани.",
    tip: null },
  { n: "07", icon: "Gamepad2",      title: "Открой игру и запусти",        color: "cyan",
    desc: "Сверни приложение → открой игру → нажми плавающую кнопку ⚡ поверх экрана → кликер работает, ты играешь.",
    tip: null },
];

const FAQS = [
  { q: "Это вирус? Почему не из Play Market?",
    a: "Это open-source приложение с открытым кодом на GitHub (проект Smart AutoClicker / Klick'r). Скачивается напрямую с GitHub Releases — официально и безопасно. Проверить код может любой." },
  { q: "Зачем нужен Accessibility Service?",
    a: "Это единственный официальный механизм Android для автоматических тапов поверх других приложений. Без него физически невозможно тапать поверх игры. Тот же механизм — у менеджеров паролей и приложений для людей с ОВЗ." },
  { q: "Мешает ли кликер управлению джойстиком?",
    a: "Нет. Кликер тапает только в заданную точку. Джойстик, свайпы и все остальные касания работают в обычном режиме — они не пересекаются." },
  { q: "Работает ли в моей игре?",
    a: "В большинстве Android-игр — да. В играх с жёстким античитом (PUBG Mobile, Genshin) может обнаруживаться. Для этого есть режим рандомизации." },
  { q: "Приложение бесплатное?",
    a: "Полностью бесплатно. Без рекламы, без подписки, без in-app покупок. MIT-лицензия." },
  { q: "Как настроить под разные игры?",
    a: "Создай несколько сценариев — каждый со своими точками и задержками. Переключай прямо из плавающей панели поверх игры." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} className="rounded-xl border cursor-pointer transition-all"
      style={{ borderColor: open ? "rgba(0,255,136,0.35)" : "var(--dark-border)", background: open ? "rgba(0,255,136,0.03)" : "var(--dark-card)" }}>
      <div className="flex items-center justify-between p-5 gap-4">
        <span className="font-rajdhani font-semibold text-white">{q}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: open ? "var(--neon-green)" : "#64748b", flexShrink: 0 }} />
      </div>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t pt-4" style={{ borderColor: "rgba(0,255,136,0.1)" }}>
          {a}
        </div>
      )}
    </div>
  );
}

function DownloadBtn({ variant = "primary" }: { variant?: "primary" | "nav" | "secondary" }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const go = () => {
    if (state !== "idle") return;
    setState("loading");
    const a = document.createElement("a");
    a.href = APK_URL;
    a.setAttribute("download", `klickr-autoclicker-${APP_VERSION}.apk`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => { setState("done"); setTimeout(() => setState("idle"), 6000); }, 1800);
  };

  if (variant === "nav") return (
    <button onClick={go}
      className="neon-btn-green px-5 py-2 rounded font-rajdhani font-bold text-sm tracking-widest flex items-center gap-2 transition-all">
      <Icon name={state === "done" ? "CheckCircle" : "Download"} size={15} />
      {state === "loading" ? "ЗАГРУЗКА..." : state === "done" ? "СКАЧАНО ✓" : "СКАЧАТЬ APK"}
    </button>
  );

  if (variant === "secondary") return (
    <button onClick={go}
      className="w-full py-3.5 rounded-xl font-rajdhani font-bold text-lg tracking-wider flex items-center justify-center gap-2 transition-all border"
      style={{ borderColor: state === "done" ? "var(--neon-cyan)" : "var(--neon-green)", color: state === "done" ? "var(--neon-cyan)" : "var(--neon-green)", background: "transparent" }}>
      <Icon name={state === "done" ? "CheckCircle" : "Download"} size={20} />
      {state === "loading" ? "ЗАГРУЗКА..." : state === "done" ? "APK ЗАГРУЖЕН ✓" : "СКАЧАТЬ APK"}
    </button>
  );

  return (
    <button onClick={go}
      className="w-full py-5 rounded-2xl font-rajdhani font-bold text-2xl tracking-widest flex items-center justify-center gap-3 transition-all"
      style={{
        background: state === "done"
          ? "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(0,229,255,0.05))"
          : "linear-gradient(135deg, rgba(0,255,136,0.18), rgba(0,255,136,0.05))",
        border: `2px solid ${state === "done" ? "var(--neon-cyan)" : "var(--neon-green)"}`,
        color: state === "done" ? "var(--neon-cyan)" : "var(--neon-green)",
        boxShadow: state === "done" ? "0 0 32px rgba(0,229,255,0.35)" : "0 0 32px rgba(0,255,136,0.35)",
      }}>
      {state === "loading"
        ? <><span className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> ЗАГРУЗКА APK...</>
        : state === "done"
        ? <><Icon name="CheckCircle" size={28} /> ОТКРОЙ ФАЙЛ В «ЗАГРУЗКАХ»</>
        : <><Icon name="Download" size={28} /> СКАЧАТЬ APK — БЕСПЛАТНО</>}
    </button>
  );
}

export default function Index() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b"
        style={{ background: "rgba(7,13,20,0.96)", backdropFilter: "blur(16px)", borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--neon-green)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--dark-bg)" }} />
            </div>
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              AUTO<span style={{ color: "var(--neon-green)" }}>CLICK</span>
            </span>
            <span className="font-mono-ibm text-xs px-2 py-0.5 rounded hidden sm:block"
              style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }}>Android</span>
          </div>

          <div className="hidden md:flex gap-1">
            {[["home","Главная"],["features","Функции"],["how","Установка"],["faq","FAQ"]].map(([id,l]) => (
              <button key={id} onClick={() => go(id)}
                className="px-4 py-2 rounded font-rajdhani font-semibold text-sm tracking-wider text-slate-400 hover:text-white transition-colors">{l}</button>
            ))}
          </div>
          <DownloadBtn variant="nav" />
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section id="home" className="min-h-screen flex items-center pt-20 hex-bg relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2/3 h-full"
            style={{ background: "radial-gradient(ellipse at 85% 35%, rgba(0,255,136,0.07) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2"
            style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(0,229,255,0.04) 0%, transparent 60%)" }} />
        </div>

        <div className="max-w-6xl mx-auto px-5 py-16 grid lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <div className="pulse-dot" />
              <span className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-green)" }}>
                РЕАЛЬНЫЙ APK · OVERLAY · ANDROID 8.0+
              </span>
            </div>

            <h1 className="font-rajdhani font-bold leading-none" style={{ fontSize: "clamp(44px, 6.5vw, 90px)" }}>
              <span className="text-white block">КЛИКАЕТ</span>
              <span style={{ color: "var(--neon-green)" }} className="block">ПОВЕРХ</span>
              <span className="text-white block">ИГРЫ</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Скачай APK → установи как обычное приложение → открой игру →{" "}
              <span className="text-white font-medium">плавающая кнопка ⚡ уже поверх экрана</span>.
              Нажал — кликер тапает за тебя. Джойстик и управление работают в обычном режиме.
            </p>

            {/* Download card */}
            <div className="rounded-2xl p-6 border relative overflow-hidden"
              style={{ background: "rgba(0,255,136,0.04)", borderColor: "rgba(0,255,136,0.28)", boxShadow: "0 0 50px rgba(0,255,136,0.07)" }}>
              <div className="absolute top-0 inset-x-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }} />

              {/* App info row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl"
                  style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)" }}>⚡</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-rajdhani font-bold text-white text-xl">{APP_NAME} AutoClicker</span>
                    <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(0,255,136,0.12)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.2)" }}>
                      OPEN SOURCE
                    </span>
                  </div>
                  <div className="font-mono-ibm text-xs text-slate-500 mt-1">{APP_ANDROID} · {APP_SIZE} · Без рекламы</div>
                  <div className="flex gap-4 mt-1.5 flex-wrap">
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>✓ Overlay поверх игр</span>
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-cyan)" }}>✓ Без root</span>
                    <span className="font-mono-ibm text-xs text-slate-500">✓ Без регистрации</span>
                  </div>
                </div>
              </div>

              <DownloadBtn />

              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                <span className="font-mono-ibm text-xs text-slate-600">После загрузки: открой файл → установить</span>
                <a href="https://github.com/Nain57/Smart-AutoClicker" target="_blank" rel="noopener noreferrer"
                  className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                  <Icon name="Github" size={12} /> GitHub
                </a>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "Shield",  title: "Без вирусов",    sub: "Open-source код" },
                { icon: "WifiOff", title: "Офлайн",         sub: "Не нужен интернет" },
                { icon: "Zap",     title: "Не мешает игре", sub: "Overlay отдельно" },
              ].map(b => (
                <div key={b.title} className="game-card rounded-xl p-3 text-center">
                  <Icon name={b.icon} fallback="Check" size={18} style={{ color: "var(--neon-green)", margin: "0 auto 6px" }} />
                  <div className="font-rajdhani font-bold text-white text-sm leading-tight">{b.title}</div>
                  <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="animate-float relative" style={{ marginRight: 24 }}>
              <div className="rounded-3xl border-4 overflow-hidden relative"
                style={{ width: 245, height: 510, borderColor: "#183025", background: "var(--dark-bg)", boxShadow: "0 0 60px rgba(0,255,136,0.18), 0 40px 80px rgba(0,0,0,0.7)" }}>
                {/* Screen */}
                <div className="h-full flex flex-col"
                  style={{ background: "linear-gradient(160deg,#0d1f12 0%,#060e1a 55%,#0d0820 100%)" }}>

                  {/* Status bar */}
                  <div className="flex justify-between px-4 pt-3 pb-1">
                    <span className="font-mono-ibm text-xs text-slate-700">09:41</span>
                    <span className="font-mono-ibm text-xs text-slate-700">▮▮▮ 100%</span>
                  </div>

                  {/* Game UI */}
                  <div className="flex-1 px-3 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="rounded px-2 py-1 font-mono-ibm text-xs" style={{ background:"rgba(0,0,0,0.6)", color:"var(--neon-green)" }}>❤️ 980/1000</div>
                      <div className="rounded px-2 py-1 font-mono-ibm text-xs text-yellow-400" style={{ background:"rgba(0,0,0,0.6)" }}>⚔ LVL 47</div>
                    </div>
                    <div className="rounded-xl relative flex-1 min-h-0"
                      style={{ background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.05)" }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-700 font-mono-ibm text-xs">🎮 Игра запущена</span>
                      </div>
                      {/* FARM button with ripple */}
                      <div className="absolute" style={{ bottom:22, right:18 }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ background:"rgba(255,165,0,0.85)", color:"#000", boxShadow:"0 0 12px rgba(255,165,0,0.6)" }}>
                          FARM
                        </div>
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ background:"rgba(0,255,136,0.3)" }} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2" style={{ borderColor:"var(--neon-green)" }} />
                      </div>
                      {/* Second point */}
                      <div className="absolute" style={{ top:20, left:20 }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                          style={{ border:"2px dashed rgba(0,229,255,0.6)", color:"var(--neon-cyan)" }}>2</div>
                      </div>
                    </div>
                    {/* Stats strip */}
                    <div className="rounded-xl py-2 px-3 flex justify-around"
                      style={{ background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.12)" }}>
                      {[["1240","ТАПОВ"],["3.3","CPS"],["300мс","ЗАДЕРЖКА"]].map(([v,l])=>(
                        <div key={l} className="text-center">
                          <div className="font-rajdhani font-bold text-sm" style={{ color:"var(--neon-green)" }}>{v}</div>
                          <div className="font-mono-ibm text-xs text-slate-600">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="flex justify-around py-2 border-t mt-2"
                    style={{ borderColor:"rgba(0,255,136,0.07)", background:"rgba(0,0,0,0.4)" }}>
                    {["🏠","⚔️","🗺️","👤"].map((ic,i)=>(
                      <span key={i} className="text-base" style={{ opacity:i===0?1:0.35 }}>{ic}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating overlay button */}
              <div className="absolute flex flex-col items-center gap-1" style={{ right:-30, top:"38%" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{ background:"var(--neon-green)", color:"var(--dark-bg)", boxShadow:"0 0 28px rgba(0,255,136,0.9), 0 4px 16px rgba(0,0,0,0.5)", fontWeight:"bold" }}>
                  ⚡
                </div>
                <span className="font-mono-ibm text-xs font-bold" style={{ color:"var(--neon-green)" }}>КЛИК!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color:"var(--neon-cyan)" }}>ЧТО УМЕЕТ</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize:"clamp(36px,5vw,62px)" }}>
              12 ФУНКЦИЙ <span style={{ color:"var(--neon-green)" }}>В ОДНОМ APK</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-lg mx-auto">
              Один файл — полноценный автокликер. Не мешает играть, работает поверх любого приложения.
            </p>
          </div>

          {/* Big 2 */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {FEATURES.slice(0,2).map((f,i)=>(
              <div key={i} className="game-card rounded-2xl p-6 border-l-2 group"
                style={{ borderLeftColor: f.color==="green" ? "var(--neon-green)" : "var(--neon-cyan)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: f.color==="green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)", border:`1px solid ${f.color==="green"?"rgba(0,255,136,0.3)":"rgba(0,229,255,0.3)"}` }}>
                    <Icon name={f.icon} fallback="Zap" size={22} style={{ color: f.color==="green" ? "var(--neon-green)" : "var(--neon-cyan)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{f.title}</h3>
                      <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                        style={{ background: f.color==="green"?"rgba(0,255,136,0.1)":"rgba(0,229,255,0.1)", color: f.color==="green"?"var(--neon-green)":"var(--neon-cyan)" }}>
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {FEATURES.slice(2).map((f,i)=>(
              <div key={i} className="game-card rounded-xl p-5 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: f.color==="green"?"rgba(0,255,136,0.08)":"rgba(0,229,255,0.08)", border:`1px solid ${f.color==="green"?"rgba(0,255,136,0.2)":"rgba(0,229,255,0.2)"}` }}>
                    <Icon name={f.icon} fallback="Zap" size={16} style={{ color: f.color==="green"?"var(--neon-green)":"var(--neon-cyan)" }} />
                  </div>
                  <span className="font-mono-ibm text-xs px-1.5 py-0.5 rounded"
                    style={{ background: f.color==="green"?"rgba(0,255,136,0.07)":"rgba(0,229,255,0.07)", color: f.color==="green"?"rgba(0,255,136,0.7)":"rgba(0,229,255,0.7)" }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-rajdhani font-bold text-white mb-1.5 text-sm">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Mid CTA */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{ background:"linear-gradient(135deg,rgba(0,255,136,0.07),rgba(0,229,255,0.04))", border:"1px solid rgba(0,255,136,0.18)" }}>
            <div className="absolute top-0 inset-x-0 h-px" style={{ background:"linear-gradient(90deg,transparent,var(--neon-green),transparent)" }} />
            <div className="pulse-dot mx-auto mb-4" />
            <h3 className="font-rajdhani font-bold text-white text-3xl mb-2">Всё это — в одном APK файле</h3>
            <p className="text-slate-400 mb-6">Скачай, установи и через 5 минут кликер работает поверх твоей игры</p>
            <div className="max-w-sm mx-auto"><DownloadBtn variant="secondary" /></div>
          </div>
        </div>
      </section>

      {/* ── HOW TO INSTALL ───────────────────────────────────── */}
      <section id="how" className="py-24" style={{ background:"rgba(0,255,136,0.012)" }}>
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color:"var(--neon-green)" }}>ПОШАГОВАЯ ИНСТРУКЦИЯ</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize:"clamp(32px,5vw,58px)" }}>
              КАК <span style={{ color:"var(--neon-cyan)" }}>УСТАНОВИТЬ</span>
            </h2>
            <p className="text-slate-400 mt-4">5 минут — и кликер работает поверх твоей игры</p>
          </div>

          <div className="relative space-y-4">
            <div className="absolute left-6 top-6 bottom-6 w-px hidden md:block"
              style={{ background:"linear-gradient(to bottom, var(--neon-green), var(--neon-cyan), transparent)" }} />

            {STEPS.map((s,i)=>(
              <div key={i} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono-ibm font-bold text-sm z-10"
                  style={{ background:"var(--dark-bg)", border:`2px solid ${s.color==="green"?"var(--neon-green)":"var(--neon-cyan)"}`, color: s.color==="green"?"var(--neon-green)":"var(--neon-cyan)", boxShadow:`0 0 14px ${s.color==="green"?"rgba(0,255,136,0.3)":"rgba(0,229,255,0.25)"}` }}>
                  {s.n}
                </div>
                <div className="game-card rounded-xl p-5 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background:"rgba(0,255,136,0.06)", border:"1px solid rgba(0,255,136,0.14)" }}>
                      <Icon name={s.icon} fallback="CheckCircle" size={17} style={{ color:"var(--neon-green)" }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{s.title}</h3>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{s.desc}</p>
                      {s.tip && (
                        <div className="mt-2 rounded-lg px-3 py-2 font-mono-ibm text-xs"
                          style={{ background:"rgba(0,229,255,0.06)", color:"var(--neon-cyan)", border:"1px solid rgba(0,229,255,0.15)" }}>
                          💡 {s.tip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl p-5 flex gap-4 items-start"
            style={{ background:"rgba(255,165,0,0.05)", border:"1px solid rgba(255,165,0,0.2)" }}>
            <Icon name="AlertTriangle" size={20} style={{ color:"#ffa500", flexShrink:0, marginTop:2 }} />
            <div>
              <div className="font-rajdhani font-bold text-white mb-1">Почему Android показывает предупреждения?</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Overlay и Accessibility — стандартные разрешения Android. Их запрашивают менеджеры паролей,
                переводчики экрана, читалки. Klick'r — open-source, код открыт на GitHub, вирусов нет.
                Предупреждение появляется для <em>любого</em> APK не из Play Market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color:"var(--neon-green)" }}>ВОПРОСЫ</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize:"clamp(32px,5vw,56px)" }}>
              ЧАСТО <span style={{ color:"var(--neon-cyan)" }}>СПРАШИВАЮТ</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f,i)=><FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="pulse-dot mx-auto mb-8" />
          <h2 className="font-rajdhani font-bold text-white mb-3" style={{ fontSize:"clamp(32px,5vw,56px)" }}>
            Скачай и попробуй <span style={{ color:"var(--neon-green)" }}>прямо сейчас</span>
          </h2>
          <p className="text-slate-400 mb-8 text-lg">Бесплатно. Open-source. Overlay поверх любой игры. Без root.</p>
          <div className="mb-5"><DownloadBtn /></div>
          <div className="flex justify-center gap-5 font-mono-ibm text-xs text-slate-600 flex-wrap">
            <span>✓ Android 8.0+</span>
            <span>✓ {APP_SIZE}</span>
            <span>✓ Без root</span>
            <span>✓ Без рекламы</span>
            <span>✓ Open-source</span>
          </div>
          <div className="mt-5">
            <a href="https://github.com/Nain57/Smart-AutoClicker" target="_blank" rel="noopener noreferrer"
              className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
              <Icon name="Github" size={13} /> Исходный код на GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="py-6 border-t" style={{ borderColor:"var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-rajdhani font-bold text-white tracking-wider">
            AUTO<span style={{ color:"var(--neon-green)" }}>CLICK</span>
            <span className="font-mono-ibm text-xs text-slate-600 ml-2">на базе Klick'r · MIT</span>
          </span>
          <span className="font-mono-ibm text-xs text-slate-600">Android 8.0+ · Без root · Без рекламы</span>
          <div className="flex gap-4 font-mono-ibm text-xs text-slate-500">
            {[["home","Главная"],["features","Функции"],["how","Установка"],["faq","FAQ"]].map(([id,l])=>(
              <button key={id} onClick={()=>go(id)} className="hover:text-slate-300 transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
