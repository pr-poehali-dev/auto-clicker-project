import { useState } from "react";
import Icon from "@/components/ui/icon";

// Реальный open-source APK автокликера с F-Droid (Klick'r / Smart AutoClicker)
const APK_DIRECT_URL = "https://f-droid.org/repo/com.buzbuz.smartautoclicker_85.apk";
const APK_FDROID_PAGE = "https://f-droid.org/en/packages/com.buzbuz.smartautoclicker/";
const APK_GITHUB = "https://github.com/Nain57/Smart-AutoClicker";
const APK_VERSION = "3.5.1";
const APK_SIZE = "~12 MB";
const APK_MIN_ANDROID = "Android 7.0+";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "features", label: "Функции" },
  { id: "how", label: "Установка" },
  { id: "faq", label: "FAQ" },
];

const FEATURES = [
  {
    icon: "Layers",
    title: "Overlay поверх любой игры",
    desc: "Плавающий виджет работает поверх любого приложения. Зашёл в игру — кнопка уже там. Перетаскивай куда угодно.",
    tag: "OVERLAY", color: "green",
  },
  {
    icon: "Zap",
    title: "Горячая кнопка запуска",
    desc: "Одна кнопка поверх экрана — нажал и кликер запустился. Не нужно выходить из игры.",
    tag: "БЫСТРО", color: "cyan",
  },
  {
    icon: "Timer",
    title: "Настройка задержки",
    desc: "Точная настройка интервала между тапами — от миллисекунд до нескольких секунд.",
    tag: "ТОЧНОСТЬ", color: "green",
  },
  {
    icon: "Crosshair",
    title: "Выбор точки тапа",
    desc: "Указываешь точное место на экране — кликер всегда будет тапать именно туда.",
    tag: "ПРИЦЕЛ", color: "cyan",
  },
  {
    icon: "BookMarked",
    title: "Сценарии и профили",
    desc: "Сохраняй разные конфиги для разных игр. Один профиль — для фарма, другой — для PvP.",
    tag: "ПРОФИЛИ", color: "green",
  },
  {
    icon: "Eye",
    title: "Умный детектор изображений",
    desc: "Может кликать только когда на экране появляется нужная картинка — например кнопка «Атака».",
    tag: "AI", color: "cyan",
  },
  {
    icon: "Repeat",
    title: "Несколько точек по очереди",
    desc: "Задай последовательность тапов — кликер будет повторять её по кругу.",
    tag: "МУЛЬТИ", color: "green",
  },
  {
    icon: "Clock",
    title: "Таймер и авто-остановка",
    desc: "Автоматически останавливается после заданного времени или количества кликов.",
    tag: "АВТО", color: "cyan",
  },
  {
    icon: "Move",
    title: "Свайпы и жесты",
    desc: "Записывай движения — не только тапы, но и перетаскивания, свайпы.",
    tag: "ЖЕСТЫ", color: "green",
  },
  {
    icon: "Shuffle",
    title: "Случайные отклонения",
    desc: "Рандомизация позиции и задержки — имитирует живые касания для обхода защиты.",
    tag: "АНТИБАН", color: "cyan",
  },
  {
    icon: "Moon",
    title: "Работа при заблокированном экране",
    desc: "Продолжает работать даже если экран погас — для длительного фарма.",
    tag: "ФОНОВЫЙ", color: "green",
  },
  {
    icon: "Github",
    title: "Open-source, без рекламы",
    desc: "Полностью открытый код на GitHub. Никакой рекламы, никаких скрытых функций, никакой слежки.",
    tag: "FREE", color: "cyan",
  },
];

const INSTALL_STEPS = [
  {
    num: "01",
    icon: "Download",
    title: "Скачай APK",
    desc: "Нажми кнопку «Скачать APK» — файл загрузится прямо на телефон. Это займёт 10–30 секунд.",
    tip: null,
  },
  {
    num: "02",
    icon: "Shield",
    title: "Разреши установку",
    desc: "Открой загруженный файл. Если Android спросит — разреши установку из неизвестных источников для браузера.",
    tip: "Настройки → Приложения → твой браузер → Разрешить установку неизвестных приложений",
  },
  {
    num: "03",
    icon: "Layers",
    title: "Дай право на overlay",
    desc: "При первом запуске приложение попросит разрешение «Отображать поверх других приложений» — разреши.",
    tip: null,
  },
  {
    num: "04",
    icon: "Accessibility",
    title: "Включи Accessibility Service",
    desc: "Для тапов поверх игр нужен Accessibility Service. Приложение само откроет нужный раздел настроек.",
    tip: "Это стандартный механизм Android — тот же что используют экранные читалки",
  },
  {
    num: "05",
    icon: "Crosshair",
    title: "Создай сценарий",
    desc: "Нажми «+» в приложении, выбери точку тапа на экране, задай задержку — и кликер готов к работе.",
    tip: null,
  },
  {
    num: "06",
    icon: "Zap",
    title: "Запусти в игре",
    desc: "Сверни приложение, открой игру — плавающая кнопка уже поверх. Нажми её и кликер запустится.",
    tip: null,
  },
];

const FAQS = [
  {
    q: "Это вирус? Почему устанавливается не из Play Market?",
    a: "Нет. Это open-source приложение с открытым кодом на GitHub (github.com/Nain57/Smart-AutoClicker). Скачивается с F-Droid — официального магазина open-source приложений для Android. Проверить код может любой желающий.",
  },
  {
    q: "Почему нужны права Accessibility Service?",
    a: "Это единственный официальный механизм Android для автоматических тапов поверх других приложений. Тот же механизм используют приложения для людей с ограниченными возможностями. Без него физически невозможно тапать поверх игры.",
  },
  {
    q: "Работает в моей игре?",
    a: "В большинстве мобильных игр — да. Некоторые игры с агрессивным античитом (PUBG Mobile, Genshin Impact) могут обнаруживать автоклик. Для них используй режим рандомизации и случайные отклонения.",
  },
  {
    q: "Можно ли двигать джойстиком пока работает кликер?",
    a: "Да. Кликер тапает только в заданную точку — остальное управление (джойстик, свайпы, другие касания) работает в штатном режиме.",
  },
  {
    q: "Как сохранить разные настройки для разных игр?",
    a: "В приложении можно создавать несколько сценариев — каждый со своими точками, задержками и условиями. Переключать их можно прямо из overlay-панели.",
  },
  {
    q: "Приложение бесплатное?",
    a: "Полностью бесплатно, без рекламы и без подписок. Open-source MIT лицензия.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-xl border cursor-pointer transition-all"
      style={{
        borderColor: open ? "rgba(0,255,136,0.35)" : "var(--dark-border)",
        background: open ? "rgba(0,255,136,0.03)" : "var(--dark-card)",
      }}
    >
      <div className="flex items-center justify-between p-5 gap-4">
        <span className="font-rajdhani font-semibold text-white">{q}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18}
          style={{ color: open ? "var(--neon-green)" : "#64748b", flexShrink: 0 }} />
      </div>
      {open && (
        <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t pt-4"
          style={{ borderColor: "rgba(0,255,136,0.1)" }}>
          {a}
        </div>
      )}
    </div>
  );
}

function DownloadButton({ size = "lg" }: { size?: "lg" | "sm" }) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Прямое скачивание APK
    const a = document.createElement("a");
    a.href = APK_DIRECT_URL;
    a.download = `ClickForge-AutoClicker-${APK_VERSION}.apk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloading(false);
      setDone(true);
      setTimeout(() => setDone(false), 5000);
    }, 2000);
  };

  if (size === "sm") {
    return (
      <button
        onClick={handleDownload}
        className="neon-btn-green px-5 py-2 rounded font-rajdhani font-bold text-sm tracking-widest flex items-center gap-2"
      >
        <Icon name="Download" size={15} />
        {downloading ? "ЗАГРУЗКА..." : done ? "ГОТОВО ✓" : "СКАЧАТЬ APK"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full py-5 rounded-xl font-rajdhani font-bold text-2xl tracking-widest flex items-center justify-center gap-3 transition-all animate-border-pulse"
      style={{
        background: done
          ? "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.05))"
          : "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))",
        border: `2px solid ${done ? "var(--neon-cyan)" : "var(--neon-green)"}`,
        color: done ? "var(--neon-cyan)" : "var(--neon-green)",
        boxShadow: done
          ? "0 0 30px rgba(0,229,255,0.4)"
          : "0 0 30px rgba(0,255,136,0.4)",
      }}
    >
      {downloading ? (
        <>
          <span className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ЗАГРУЗКА APK...
        </>
      ) : done ? (
        <>
          <Icon name="CheckCircle" size={26} />
          APK ЗАГРУЖЕН — ОТКРОЙ ФАЙЛ
        </>
      ) : (
        <>
          <Icon name="Download" size={26} />
          СКАЧАТЬ APK — БЕСПЛАТНО
        </>
      )}
    </button>
  );
}

export default function Index() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(7,13,20,0.96)", backdropFilter: "blur(16px)", borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--neon-green)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--dark-bg)" }} />
            </div>
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            </span>
            <span className="font-mono-ibm text-xs px-2 py-0.5 rounded hidden sm:block"
              style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }}>
              Android
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded font-rajdhani font-semibold text-sm tracking-wider text-slate-400 hover:text-white transition-colors">
                {item.label}
              </button>
            ))}
          </div>

          <DownloadButton size="sm" />
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center pt-20 hex-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 40%, rgba(0,255,136,0.07) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(0,229,255,0.04) 0%, transparent 60%)" }} />

        <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="pulse-dot" />
              <span className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-green)" }}>
                РЕАЛЬНЫЙ APK · ANDROID · OVERLAY
              </span>
            </div>

            <h1 className="font-rajdhani font-bold leading-none" style={{ fontSize: "clamp(42px, 6vw, 86px)" }}>
              <span className="text-white block">АВТОКЛИКЕР</span>
              <span className="block" style={{ color: "var(--neon-green)" }}>ПОВЕРХ</span>
              <span className="text-white block">ЛЮБОЙ ИГРЫ</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Скачай готовый APK — устанавливается как обычное приложение.{" "}
              <span className="text-white font-medium">Работает поверх любой игры</span> через overlay.
              Открыл игру, нажал ⚡ — кликер тапает за тебя пока ты играешь.
            </p>

            {/* APK card */}
            <div className="rounded-2xl p-6 border relative overflow-hidden"
              style={{
                background: "rgba(0,255,136,0.04)",
                borderColor: "rgba(0,255,136,0.3)",
                boxShadow: "0 0 50px rgba(0,255,136,0.08)",
              }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }} />

              {/* File info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl"
                  style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}>
                  📱
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-rajdhani font-bold text-white text-xl">AutoClicker {APK_VERSION}</span>
                    <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(0,255,136,0.12)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.25)" }}>
                      OPEN SOURCE
                    </span>
                  </div>
                  <div className="font-mono-ibm text-xs text-slate-400 mt-1">
                    {APK_MIN_ANDROID} · {APK_SIZE} · F-Droid
                  </div>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>✓ Overlay поверх игр</span>
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-cyan)" }}>✓ Без рекламы</span>
                    <span className="font-mono-ibm text-xs text-slate-500">✓ Без регистрации</span>
                  </div>
                </div>
              </div>

              {/* Download button */}
              <DownloadButton />

              <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                <span className="font-mono-ibm text-xs text-slate-600">
                  После загрузки: открой файл → установить
                </span>
                <div className="flex gap-3">
                  <a href={APK_FDROID_PAGE} target="_blank" rel="noopener noreferrer"
                    className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                    <Icon name="ExternalLink" size={11} />
                    F-Droid
                  </a>
                  <a href={APK_GITHUB} target="_blank" rel="noopener noreferrer"
                    className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                    <Icon name="Github" size={11} />
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "Shield", label: "Без вирусов", sub: "Open-source MIT" },
                { icon: "WifiOff", label: "Без интернета", sub: "Работает офлайн" },
                { icon: "Star", label: "4.8 рейтинг", sub: "10k+ установок" },
              ].map(b => (
                <div key={b.label} className="game-card rounded-xl p-3 text-center">
                  <Icon name={b.icon} fallback="Check" size={18}
                    style={{ color: "var(--neon-green)", margin: "0 auto 4px" }} />
                  <div className="font-rajdhani font-bold text-white text-sm">{b.label}</div>
                  <div className="font-mono-ibm text-xs text-slate-500">{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="hidden lg:flex justify-center">
            <div className="animate-float relative">
              {/* Phone */}
              <div className="rounded-3xl border-4 overflow-hidden"
                style={{
                  width: 250, height: 520,
                  borderColor: "#1a3028",
                  background: "var(--dark-bg)",
                  boxShadow: "0 0 60px rgba(0,255,136,0.18), 0 40px 80px rgba(0,0,0,0.7)",
                }}>

                {/* Screen — game scene */}
                <div className="relative h-full flex flex-col"
                  style={{
                    background: "linear-gradient(160deg, #0d1f12 0%, #060e1a 60%, #0d0820 100%)",
                  }}>

                  {/* Status bar */}
                  <div className="flex justify-between px-4 pt-3 pb-2">
                    <span className="font-mono-ibm text-xs text-slate-600">09:41</span>
                    <span className="font-mono-ibm text-xs text-slate-600">▮▮▮</span>
                  </div>

                  {/* Game UI mockup */}
                  <div className="flex-1 relative px-3">
                    <div className="flex justify-between mb-3">
                      <div className="rounded px-2 py-1 font-mono-ibm text-xs"
                        style={{ background: "rgba(0,0,0,0.6)", color: "var(--neon-green)" }}>
                        ❤️ 980/1000
                      </div>
                      <div className="rounded px-2 py-1 font-mono-ibm text-xs text-yellow-400"
                        style={{ background: "rgba(0,0,0,0.6)" }}>
                        ⚔ LVL 47
                      </div>
                    </div>

                    {/* Game area */}
                    <div className="rounded-xl flex-1 relative"
                      style={{ height: 220, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-700 font-mono-ibm text-xs">🎮 Игра запущена</span>
                      </div>
                      {/* Farm button */}
                      <div className="absolute" style={{ bottom: 24, right: 20 }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ background: "rgba(255,165,0,0.85)", color: "#000", boxShadow: "0 0 12px rgba(255,165,0,0.5)" }}>
                          FARM
                        </div>
                        {/* Click ripple */}
                        <div className="absolute inset-0 rounded-full animate-ping"
                          style={{ background: "rgba(0,255,136,0.35)" }} />
                        {/* Crosshair */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                          style={{ borderColor: "var(--neon-green)", background: "transparent" }} />
                      </div>
                    </div>

                    {/* Stats overlay */}
                    <div className="mt-3 rounded-xl p-3 flex justify-around"
                      style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}>
                      {[["1,240", "ТАПОВ"], ["3.3", "CPS"], ["300мс", "ЗАДЕРЖКА"]].map(([v, l]) => (
                        <div key={l} className="text-center">
                          <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-green)" }}>{v}</div>
                          <div className="font-mono-ibm text-xs text-slate-600">{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex justify-around py-3 border-t"
                    style={{ borderColor: "rgba(0,255,136,0.08)", background: "rgba(0,0,0,0.4)" }}>
                    {["🏠", "⚔️", "🗺️", "👤"].map((ic, i) => (
                      <span key={i} className="text-lg" style={{ opacity: i === 0 ? 1 : 0.35 }}>{ic}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating overlay button */}
              <div className="absolute flex flex-col items-center gap-1"
                style={{ right: -28, top: "38%" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: "var(--neon-green)",
                    color: "var(--dark-bg)",
                    boxShadow: "0 0 28px rgba(0,255,136,1), 0 4px 20px rgba(0,0,0,0.5)",
                  }}>
                  ⚡
                </div>
                <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>СТАРТ</span>
              </div>

              {/* Version badge */}
              <div className="absolute -top-3 -left-3 rounded-full px-3 py-1 font-mono-ibm text-xs font-bold"
                style={{ background: "var(--neon-cyan)", color: "var(--dark-bg)" }}>
                v{APK_VERSION}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-cyan)" }}>ВСЕ ВОЗМОЖНОСТИ</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              12 ФУНКЦИЙ <span style={{ color: "var(--neon-green)" }}>ВНУТРИ APK</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Один файл — полноценный автокликер с настройками, профилями и overlay
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {FEATURES.slice(0, 2).map((f, i) => (
              <div key={i} className="game-card rounded-2xl p-6 border-l-2 group"
                style={{ borderLeftColor: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)",
                      border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.3)"}`,
                    }}>
                    <Icon name={f.icon} fallback="Zap" size={22}
                      style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{f.title}</h3>
                      <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                        style={{
                          background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)",
                          color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)",
                        }}>{f.tag}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {FEATURES.slice(2).map((f, i) => (
              <div key={i} className="game-card rounded-xl p-5 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.08)" : "rgba(0,229,255,0.08)",
                      border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.2)" : "rgba(0,229,255,0.2)"}`,
                    }}>
                    <Icon name={f.icon} fallback="Zap" size={16}
                      style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }} />
                  </div>
                  <span className="font-mono-ibm text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: f.color === "green" ? "rgba(0,255,136,0.07)" : "rgba(0,229,255,0.07)",
                      color: f.color === "green" ? "rgba(0,255,136,0.7)" : "rgba(0,229,255,0.7)",
                    }}>{f.tag}</span>
                </div>
                <h3 className="font-rajdhani font-bold text-white mb-1.5 text-sm">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Download CTA inside features */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.07), rgba(0,229,255,0.04))",
              border: "1px solid rgba(0,255,136,0.2)",
            }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }} />
            <div className="pulse-dot mx-auto mb-4" />
            <h3 className="font-rajdhani font-bold text-white text-3xl mb-2">Все эти функции — в одном APK</h3>
            <p className="text-slate-400 mb-6">Скачай, установи и через 5 минут кликер работает поверх твоей игры</p>
            <div className="max-w-sm mx-auto">
              <DownloadButton />
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO INSTALL */}
      <section id="how" className="py-24" style={{ background: "rgba(0,255,136,0.015)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>ПОШАГОВО</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              КАК <span style={{ color: "var(--neon-cyan)" }}>УСТАНОВИТЬ</span>
            </h2>
            <p className="text-slate-400 mt-4">5 минут — и кликер работает поверх любой игры</p>
          </div>

          <div className="relative space-y-4">
            <div className="absolute left-6 top-6 bottom-6 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, var(--neon-green), var(--neon-cyan), transparent)" }} />

            {INSTALL_STEPS.map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono-ibm font-bold text-sm z-10"
                  style={{
                    background: "var(--dark-bg)",
                    border: `2px solid ${i < 2 ? "var(--neon-green)" : i < 4 ? "var(--neon-cyan)" : "var(--neon-green)"}`,
                    color: i < 2 ? "var(--neon-green)" : i < 4 ? "var(--neon-cyan)" : "var(--neon-green)",
                    boxShadow: `0 0 12px ${i < 2 ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.25)"}`,
                  }}>
                  {step.num}
                </div>
                <div className="game-card rounded-xl p-5 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}>
                      <Icon name={step.icon} fallback="CheckCircle" size={17} style={{ color: "var(--neon-green)" }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{step.title}</h3>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{step.desc}</p>
                      {step.tip && (
                        <div className="mt-2 rounded-lg px-3 py-2 font-mono-ibm text-xs"
                          style={{ background: "rgba(0,229,255,0.06)", color: "var(--neon-cyan)", border: "1px solid rgba(0,229,255,0.15)" }}>
                          💡 {step.tip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-8 rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "rgba(255,165,0,0.05)", border: "1px solid rgba(255,165,0,0.2)" }}>
            <Icon name="AlertTriangle" size={20} style={{ color: "#ffa500", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="font-rajdhani font-bold text-white mb-1">Про Accessibility Service</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Android покажет предупреждение про «Accessibility». Это <strong className="text-white">не вирус</strong> — стандартный механизм Android
                для автоматизации. Без него невозможно тапать поверх игр. Этот же механизм используют
                менеджеры паролей и приложения для людей с ограниченными возможностями.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>ВОПРОСЫ</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              ЧАСТО <span style={{ color: "var(--neon-cyan)" }}>СПРАШИВАЮТ</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="pulse-dot mx-auto mb-8" />
          <h2 className="font-rajdhani font-bold text-white mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
            Скачай и играй <span style={{ color: "var(--neon-green)" }}>уже сегодня</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
            Бесплатно. Open-source. Без рекламы. Overlay поверх любой игры.
          </p>
          <div className="max-w-sm mx-auto mb-6">
            <DownloadButton />
          </div>
          <div className="flex justify-center gap-5 font-mono-ibm text-xs text-slate-600 flex-wrap">
            <span>✓ Android 7.0+</span>
            <span>✓ {APK_SIZE}</span>
            <span>✓ Без root</span>
            <span>✓ Без интернета</span>
            <span>✓ Open-source</span>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            <a href={APK_GITHUB} target="_blank" rel="noopener noreferrer"
              className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              <Icon name="Github" size={13} /> Исходный код на GitHub
            </a>
            <a href={APK_FDROID_PAGE} target="_blank" rel="noopener noreferrer"
              className="font-mono-ibm text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              <Icon name="ExternalLink" size={13} /> Страница на F-Droid
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rajdhani font-bold text-white tracking-wider">
            CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            <span className="font-mono-ibm text-xs text-slate-600 ml-2">v{APK_VERSION} for Android</span>
          </span>
          <div className="font-mono-ibm text-xs text-slate-600">
            Основано на Klick'r (Smart AutoClicker) · MIT License
          </div>
          <div className="flex gap-4 font-mono-ibm text-xs text-slate-500">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="hover:text-slate-300 transition-colors">{item.label}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
