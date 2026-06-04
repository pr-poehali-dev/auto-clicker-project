import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "features", label: "Функции" },
  { id: "how", label: "Установка" },
  { id: "faq", label: "FAQ" },
];

const ALL_FEATURES = [
  {
    icon: "Layers",
    title: "Overlay поверх игры",
    desc: "Плавающая кнопка всегда на экране. Открываешь любую игру — кликер уже работает сверху, как Discord overlay.",
    tag: "OVERLAY",
    color: "green",
  },
  {
    icon: "Zap",
    title: "Горячая кнопка",
    desc: "Одна большая кнопка поверх всего — нажал и кликер запустился/остановился без открытия меню.",
    tag: "БЫСТРО",
    color: "cyan",
  },
  {
    icon: "Timer",
    title: "Настройка задержки",
    desc: "От 1мс до 60 секунд между тапами. Слайдер + ручной ввод. Работает с любой частотой обновления экрана.",
    tag: "ТОЧНОСТЬ",
    color: "green",
  },
  {
    icon: "Crosshair",
    title: "Выбор точки тапа",
    desc: "Тапни по экрану в режиме выбора — кликер запомнит координаты X/Y. Можно задать несколько точек.",
    tag: "ПРИЦЕЛ",
    color: "cyan",
  },
  {
    icon: "BookMarked",
    title: "Профили кликеров",
    desc: "Сохраняй готовые конфиги — «Фарм золота», «Быстрый PvP», «Тихий режим». Переключай за 1 тап.",
    tag: "ПРОФИЛИ",
    color: "green",
  },
  {
    icon: "Shuffle",
    title: "Рандомизация",
    desc: "Случайное отклонение позиции и задержки ±20%. Имитирует живые касания, обходит античит.",
    tag: "АНТИБАН",
    color: "cyan",
  },
  {
    icon: "BarChart3",
    title: "Счётчик в реальном времени",
    desc: "CPS (тапов в секунду), общий счётчик тапов, время работы — всё на плавающей панели.",
    tag: "СТАТЫ",
    color: "green",
  },
  {
    icon: "Clock",
    title: "Таймер и авто-стоп",
    desc: "Задай сколько тапов сделать или через сколько минут остановиться. Уснул — кликер сам выключится.",
    tag: "АВТО",
    color: "cyan",
  },
  {
    icon: "Repeat",
    title: "Мультиточечный режим",
    desc: "До 10 точек по очереди или одновременно. Для игр где нужно тапать по нескольким кнопкам.",
    tag: "МУЛЬТИ",
    color: "green",
  },
  {
    icon: "Move",
    title: "Свайп-паттерны",
    desc: "Записывай не просто тап, а движение пальца — свайп, перетаскивание, круговое движение.",
    tag: "СВАЙП",
    color: "cyan",
  },
  {
    icon: "Moon",
    title: "Работа в фоне",
    desc: "Кликер продолжает работать когда телефон заблокирован (на Android без root при включённом Accessibility).",
    tag: "ФОНОВЫЙ",
    color: "green",
  },
  {
    icon: "Palette",
    title: "Тёмная тема overlay",
    desc: "Настрой прозрачность и цвет панели — от почти невидимой до яркой. Не мешает видеть игру.",
    tag: "UI",
    color: "cyan",
  },
];

const INSTALL_STEPS = [
  {
    num: "01",
    title: "Скачай APK",
    desc: "Нажми кнопку «Скачать APK» ниже. Файл ~8MB, загружается за секунды.",
    icon: "Download",
  },
  {
    num: "02",
    title: "Разреши установку",
    desc: "Открой APK → Настройки → «Установка из неизвестных источников» → Разрешить для браузера.",
    icon: "Shield",
  },
  {
    num: "03",
    title: "Дай права Accessibility",
    desc: "При первом запуске приложение попросит права Accessibility Service — это нужно для тапов поверх игр.",
    icon: "Accessibility",
  },
  {
    num: "04",
    title: "Разреши overlay",
    desc: "«Отображать поверх других приложений» → найди ClickForge → включи. Теперь кнопка будет везде.",
    icon: "Layers",
  },
  {
    num: "05",
    title: "Настрой и играй",
    desc: "Открой игру, нажми плавающую кнопку ⚡ — появится панель. Тапни «Выбрать точку» → кликни по нужному месту.",
    icon: "Gamepad2",
  },
];

const FAQS = [
  {
    q: "Кликер не мешает управлению?",
    a: "Нет. Accessibility Service тапает в заданную точку независимо от твоих жестов. Ты двигаешь джойстиком, свайпаешь — кликер продолжает тапать своё место.",
  },
  {
    q: "Нужен root?",
    a: "Нет! Работает без root через стандартный Android Accessibility Service. Тот же механизм используют приложения для людей с ограниченными возможностями.",
  },
  {
    q: "Работает в любой игре?",
    a: "В большинстве Android-игр — да. Некоторые игры с агрессивным античитом (как PUBG Mobile) могут блокировать Accessibility. Для таких есть режим рандомизации.",
  },
  {
    q: "Что такое профили?",
    a: "Это сохранённые наборы настроек. Например: «Фарм» — 500мс, точка на кнопке фарма; «PvP» — 80мс, несколько точек. Переключаешь одним тапом.",
  },
  {
    q: "Сколько точек можно задать?",
    a: "До 10 точек тапа. Можно выбрать режим: по очереди (1→2→3→...) или одновременно (мультитач).",
  },
  {
    q: "Телефон разрядится быстрее?",
    a: "Незначительно. Приложение очень лёгкое (~8MB). Если беспокоит — используй таймер авто-остановки.",
  },
];

function PhoneMockup() {
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState(0);
  const [delay, setDelay] = useState(300);

  const toggle = () => {
    setRunning((r) => {
      if (!r) {
        const iv = setInterval(() => setTaps((t) => t + 1), delay);
        (window as unknown as Record<string, unknown>).__clickerInterval = iv;
      } else {
        clearInterval((window as unknown as Record<string, unknown>).__clickerInterval as ReturnType<typeof setInterval>);
      }
      return !r;
    });
  };

  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      {/* Phone frame */}
      <div className="relative rounded-3xl border-4 overflow-hidden"
        style={{
          borderColor: "#1e3a2a",
          background: "#0a0f14",
          boxShadow: "0 0 60px rgba(0,255,136,0.2), 0 40px 80px rgba(0,0,0,0.6)",
          height: 420,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-xl z-10"
          style={{ background: "#0a0f14" }}
        />

        {/* Game screen bg */}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #0d1f12 0%, #071020 60%, #0d0814 100%)",
            backgroundImage: "radial-gradient(ellipse at 30% 60%, rgba(0,255,136,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Fake game UI */}
        <div className="absolute inset-0 p-4 pt-8">
          <div className="flex justify-between items-start mb-3">
            <div className="rounded px-2 py-1 font-mono-ibm text-xs" style={{ background: "rgba(0,0,0,0.5)", color: "#00ff88" }}>
              LVL 47
            </div>
            <div className="rounded px-2 py-1 font-mono-ibm text-xs text-yellow-400" style={{ background: "rgba(0,0,0,0.5)" }}>
              ⚔ 12,440 HP
            </div>
          </div>

          {/* Game area */}
          <div className="rounded-xl flex items-center justify-center relative"
            style={{ height: 180, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,136,0.1)" }}
          >
            <span className="text-slate-600 font-mono-ibm text-xs text-center px-4">
              🎮 игра запущена
            </span>
            {/* Target point */}
            <div className="absolute" style={{ bottom: 30, right: 30 }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(255,165,0,0.8)", color: "#000", fontSize: 10 }}
              >
                FARM
              </div>
              {running && (
                <div className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: "rgba(0,255,136,0.4)" }}
                />
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-3 rounded-lg p-2 flex justify-around"
            style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)" }}
          >
            <div className="text-center">
              <div className="font-mono-ibm font-bold text-sm" style={{ color: "#00ff88" }}>{taps}</div>
              <div className="font-mono-ibm text-xs text-slate-500">тапов</div>
            </div>
            <div className="text-center">
              <div className="font-mono-ibm font-bold text-sm" style={{ color: "#00e5ff" }}>{(1000 / delay).toFixed(1)}</div>
              <div className="font-mono-ibm text-xs text-slate-500">CPS</div>
            </div>
            <div className="text-center">
              <div className="font-mono-ibm font-bold text-sm text-white">{delay}мс</div>
              <div className="font-mono-ibm text-xs text-slate-500">задержка</div>
            </div>
          </div>

          {/* Mini delay slider */}
          <div className="mt-3">
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full"
              style={{ "--range-progress": `${((delay - 50) / 1950) * 100}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around py-2 border-t"
          style={{ background: "rgba(7,13,20,0.95)", borderColor: "rgba(0,255,136,0.1)" }}
        >
          {["🏠", "⚙️", "📋"].map((icon, i) => (
            <div key={i} className="p-2 rounded-lg text-sm" style={{ opacity: i === 0 ? 1 : 0.4 }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* Floating overlay button */}
      <button
        onClick={toggle}
        className="absolute z-20 flex items-center justify-center rounded-full font-rajdhani font-bold text-sm transition-all"
        style={{
          width: 52,
          height: 52,
          right: -16,
          top: 120,
          background: running ? "var(--neon-cyan)" : "var(--neon-green)",
          color: "var(--dark-bg)",
          boxShadow: running
            ? "0 0 20px rgba(0,229,255,0.8), 0 4px 16px rgba(0,0,0,0.4)"
            : "0 0 20px rgba(0,255,136,0.8), 0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {running ? "⏹" : "⚡"}
      </button>

      {/* Label */}
      <div className="absolute font-mono-ibm text-xs"
        style={{ right: 44, top: 133, color: "var(--neon-green)", whiteSpace: "nowrap" }}
      >
        {running ? "СТОП" : "СТАРТ"}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-lg border cursor-pointer transition-all"
      style={{
        borderColor: open ? "rgba(0,255,136,0.3)" : "var(--dark-border)",
        background: open ? "rgba(0,255,136,0.03)" : "var(--dark-card)",
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5">
        <span className="font-rajdhani font-semibold text-white">{q}</span>
        <Icon
          name={open ? "ChevronUp" : "ChevronDown"}
          size={18}
          style={{ color: open ? "var(--neon-green)" : "#64748b", flexShrink: 0 }}
        />
      </div>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t pt-4"
          style={{ borderColor: "rgba(0,255,136,0.1)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

const Index = () => {
  const [navOpen, setNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(7,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--dark-border)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--neon-green)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--dark-bg)" }}></div>
            </div>
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            </span>
            <span className="font-mono-ibm text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }}>
              Android
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded font-rajdhani font-semibold text-sm tracking-wider text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); scrollTo("home"); }}
            className="neon-btn-green px-5 py-2 rounded font-rajdhani font-bold text-sm tracking-widest"
          >
            ↓ СКАЧАТЬ APK
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center pt-20 hex-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 40%, rgba(0,255,136,0.06) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(0,229,255,0.04) 0%, transparent 60%)" }}
        />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-16">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <div className="pulse-dot"></div>
              <span className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-green)" }}>
                ANDROID АВТОКЛИКЕР
              </span>
            </div>

            <h1 className="font-rajdhani font-bold leading-none" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              <span className="text-white block">ТАПАЙ САМ.</span>
              <span className="block" style={{ color: "var(--neon-green)" }}>ПОКА ТЫ</span>
              <span className="text-white block">ИГРАЕШЬ.</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Плавающая кнопка <span className="text-white font-medium">поверх любой игры</span>. Выбери точку тапа, настрой задержку — кликер работает пока ты двигаешь джойстиком и проходишь игру.
            </p>

            {/* APK download card */}
            <div className="rounded-xl p-5 border relative overflow-hidden"
              style={{
                background: "rgba(0,255,136,0.05)",
                borderColor: "rgba(0,255,136,0.25)",
                boxShadow: "0 0 30px rgba(0,255,136,0.08)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }}
              />
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.3)" }}
                >
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <div className="font-rajdhani font-bold text-white text-lg">ClickForge v2.4</div>
                  <div className="font-mono-ibm text-xs text-slate-400 mt-0.5">Android 8.0+ · ~8.2 MB · Без root</div>
                  <div className="flex gap-3 mt-1">
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>✓ Бесплатно</span>
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-cyan)" }}>✓ Без рекламы</span>
                    <span className="font-mono-ibm text-xs text-slate-500">✓ Без регистрации</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 py-3 rounded-lg font-rajdhani font-bold text-base tracking-wider flex items-center justify-center gap-2 neon-btn-green animate-border-pulse">
                  <Icon name="Download" size={18} />
                  СКАЧАТЬ APK
                </button>
                <button className="px-4 py-3 rounded-lg border font-rajdhani font-semibold text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
                  style={{ borderColor: "var(--dark-border)" }}
                  onClick={() => scrollTo("how")}
                >
                  <Icon name="BookOpen" size={16} />
                  Инструкция
                </button>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { v: "12+", l: "функций" },
                { v: "1мс", l: "мин. задержка" },
                { v: "10", l: "точек тапа" },
              ].map((s) => (
                <div key={s.l} className="text-center game-card rounded-lg p-3">
                  <div className="font-rajdhani font-bold text-2xl neon-text-green">{s.v}</div>
                  <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="animate-float">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-cyan)" }}>
              ВСЕ ВОЗМОЖНОСТИ
            </div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              12 ФУНКЦИЙ <span style={{ color: "var(--neon-green)" }}>В ОДНОМ APK</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Один файл — всё внутри. Никаких подписок, никакой рекламы, никакого интернета.
            </p>
          </div>

          {/* Big 2 features */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {ALL_FEATURES.slice(0, 2).map((f, i) => (
              <div key={i} className="game-card rounded-xl p-6 border-l-2 relative overflow-hidden group"
                style={{ borderLeftColor: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: f.color === "green" ? "rgba(0,255,136,0.04)" : "rgba(0,229,255,0.04)", transform: "translate(30%, -30%)" }}
                />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)",
                      border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.25)" : "rgba(0,229,255,0.25)"}`,
                    }}
                  >
                    <Icon name={f.icon} fallback="Zap" size={22}
                      style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{f.title}</h3>
                      <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                        style={{
                          background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)",
                          color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)",
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid of remaining */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_FEATURES.slice(2).map((f, i) => (
              <div key={i} className="game-card rounded-xl p-5 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.08)" : "rgba(0,229,255,0.08)",
                      border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.2)" : "rgba(0,229,255,0.2)"}`,
                    }}
                  >
                    <Icon name={f.icon} fallback="Zap" size={16}
                      style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}
                    />
                  </div>
                  <span className="font-mono-ibm text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.07)" : "rgba(0,229,255,0.07)",
                      color: f.color === "green" ? "rgba(0,255,136,0.7)" : "rgba(0,229,255,0.7)",
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-rajdhani font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO INSTALL */}
      <section id="how" className="py-24" style={{ background: "rgba(0,255,136,0.015)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>
              ПОШАГОВО
            </div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              КАК <span style={{ color: "var(--neon-cyan)" }}>УСТАНОВИТЬ</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-lg mx-auto">
              5 минут — и кликер работает поверх любой игры
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, var(--neon-green), var(--neon-cyan), transparent)" }}
            />

            <div className="space-y-5">
              {INSTALL_STEPS.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono-ibm font-bold text-sm z-10"
                    style={{
                      background: "var(--dark-bg)",
                      border: `2px solid ${i < 2 ? "var(--neon-green)" : i < 4 ? "var(--neon-cyan)" : "var(--neon-green)"}`,
                      color: i < 2 ? "var(--neon-green)" : i < 4 ? "var(--neon-cyan)" : "var(--neon-green)",
                      boxShadow: `0 0 12px ${i < 2 ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.3)"}`,
                    }}
                  >
                    {step.num}
                  </div>
                  <div className="game-card rounded-xl p-5 flex-1 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}
                    >
                      <Icon name={step.icon} fallback="CheckCircle" size={18} style={{ color: "var(--neon-green)" }} />
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-white text-lg">{step.title}</h3>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning note */}
          <div className="mt-10 rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "rgba(255,165,0,0.05)", border: "1px solid rgba(255,165,0,0.2)" }}
          >
            <Icon name="AlertTriangle" size={20} style={{ color: "#ffa500", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="font-rajdhani font-bold text-white mb-1">Важно про Accessibility Service</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Android спросит разрешение на «Accessibility Service» — это стандартный механизм автоматизации, не вирус. Без него приложение физически не может тапать поверх других приложений. Разреши только для ClickForge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OVERLAY SHOWCASE */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(0,229,255,0.04) 50%, rgba(191,0,255,0.03) 100%)",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), var(--neon-cyan), transparent)" }}
            />

            <div className="p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-cyan)" }}>
                  OVERLAY ПАНЕЛЬ
                </div>
                <h3 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                  Панель управления <span style={{ color: "var(--neon-green)" }}>всегда рядом</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Плавающая мини-панель поверх игры. Перетаскивай куда удобно, сворачивай в точку, разворачивай одним тапом.
                </p>
                <div className="space-y-3">
                  {[
                    "⚡ Горячая кнопка старт/стоп — всегда поверх экрана",
                    "📊 Счётчик тапов и CPS прямо на панели",
                    "🎯 Переключение профилей без открытия меню",
                    "🔲 Регулировка прозрачности — от 20% до 100%",
                    "↔️ Перетаскивание в любое место экрана",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--neon-green)" }}></div>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay mockup */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Fake game bg */}
                  <div className="rounded-2xl w-64 h-80 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-slate-700 font-mono-ibm text-sm">🎮 Ваша игра</span>
                  </div>

                  {/* Overlay panel */}
                  <div className="absolute rounded-xl p-3 w-44"
                    style={{
                      top: 20, right: -20,
                      background: "rgba(7,13,20,0.92)",
                      border: "1px solid rgba(0,255,136,0.4)",
                      boxShadow: "0 0 20px rgba(0,255,136,0.15), 0 8px 24px rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-rajdhani font-bold text-white text-xs tracking-wider">CLICKFORGE</span>
                      <div className="flex gap-1">
                        <div className="pulse-dot" style={{ width: 6, height: 6 }}></div>
                        <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>ON</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      {[["ПРОФИЛЬ", "Фарм золота"], ["CPS", "3.3"], ["ТАПОВ", "4,821"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="font-mono-ibm text-xs text-slate-500">{k}</span>
                          <span className="font-mono-ibm text-xs font-bold" style={{ color: "var(--neon-green)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="rounded py-1.5 text-center font-rajdhani font-bold text-xs"
                        style={{ background: "var(--neon-green)", color: "var(--dark-bg)" }}>
                        ⏹ СТОП
                      </div>
                      <div className="rounded py-1.5 text-center font-rajdhani font-bold text-xs text-slate-500"
                        style={{ border: "1px solid var(--dark-border)" }}>
                        ⚙️ ЕЩЁ
                      </div>
                    </div>
                  </div>

                  {/* Floating dot button */}
                  <div className="absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{
                      bottom: 20, left: -16,
                      background: "var(--neon-green)",
                      color: "var(--dark-bg)",
                      boxShadow: "0 0 20px rgba(0,255,136,0.7)",
                    }}
                  >
                    ⚡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24" style={{ background: "rgba(0,229,255,0.01)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>
              ВОПРОСЫ
            </div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              ЧАСТО <span style={{ color: "var(--neon-cyan)" }}>СПРАШИВАЮТ</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="pulse-dot mx-auto mb-8"></div>
          <h2 className="font-rajdhani font-bold text-white mb-4" style={{ fontSize: "clamp(32px, 5vw, 64px)" }}>
            Скачай и попробуй <span style={{ color: "var(--neon-green)" }}>прямо сейчас</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
            Бесплатно. Без регистрации. Без рекламы. Один APK — все функции.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="neon-btn-green px-10 py-4 rounded-xl font-rajdhani font-bold text-xl tracking-widest flex items-center gap-3 animate-border-pulse">
              <Icon name="Download" size={22} />
              СКАЧАТЬ APK — БЕСПЛАТНО
            </button>
            <button
              className="px-8 py-4 rounded-xl font-rajdhani font-semibold text-base text-slate-400 hover:text-white transition-colors flex items-center gap-2 border"
              style={{ borderColor: "var(--dark-border)" }}
              onClick={() => scrollTo("how")}
            >
              <Icon name="BookOpen" size={18} />
              Инструкция по установке
            </button>
          </div>
          <div className="mt-8 flex justify-center gap-6 font-mono-ibm text-xs text-slate-600">
            <span>✓ Android 8.0+</span>
            <span>✓ Без root</span>
            <span>✓ ~8.2 MB</span>
            <span>✓ Без интернета</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rajdhani font-bold text-white tracking-wider">
            CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            <span className="font-mono-ibm text-xs text-slate-600 ml-2">v2.4 for Android</span>
          </span>
          <div className="font-mono-ibm text-xs text-slate-600">
            Только для личного использования · Android 8.0+
          </div>
          <div className="flex gap-4 font-mono-ibm text-xs text-slate-500">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="hover:text-slate-300 transition-colors">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
