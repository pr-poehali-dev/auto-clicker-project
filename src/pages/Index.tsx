import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "features", label: "Функции" },
  { id: "how", label: "Установка" },
  { id: "faq", label: "FAQ" },
];

const ALL_FEATURES = [
  { icon: "Layers", title: "Overlay поверх игры", desc: "Плавающая кнопка ⚡ всегда на экране — открываешь любую игру, кликер уже поверх. Перетаскивай куда угодно.", tag: "OVERLAY", color: "green" },
  { icon: "Zap", title: "Горячая кнопка", desc: "Одна большая кнопка запускает и останавливает кликер без открытия меню. Тапни ⚡ — и поехали.", tag: "БЫСТРО", color: "cyan" },
  { icon: "Timer", title: "Задержка 10мс–10с", desc: "Слайдер + точный ввод. Быстрый фарм или медленный режим — любая скорость.", tag: "ТОЧНОСТЬ", color: "green" },
  { icon: "Crosshair", title: "До 10 точек тапа", desc: "Тапни в режиме «+» — кликер запомнит координаты. Удаляй, добавляй точки в любой момент.", tag: "ПРИЦЕЛ", color: "cyan" },
  { icon: "BookMarked", title: "Профили", desc: "Сохраняй готовые конфиги: «Фарм», «PvP», «Тихий». Переключай одним тапом.", tag: "ПРОФИЛИ", color: "green" },
  { icon: "Shuffle", title: "Рандомизация", desc: "Случайное отклонение позиции и задержки ±1–50%. Имитирует живые касания.", tag: "АНТИБАН", color: "cyan" },
  { icon: "BarChart3", title: "Статистика", desc: "История тапов по дням, рекорды, CPS. Всё сохраняется на телефоне.", tag: "СТАТЫ", color: "green" },
  { icon: "Clock", title: "Авто-стоп", desc: "Задай количество тапов или время — кликер остановится сам.", tag: "АВТО", color: "cyan" },
  { icon: "Repeat", title: "Мультиточечный режим", desc: "По очереди (1→2→3) или одновременно все точки — мультитач.", tag: "МУЛЬТИ", color: "green" },
  { icon: "Hand", title: "Режимы клика", desc: "Одиночный, двойной или долгий тап — выбирай под любую игру.", tag: "РЕЖИМ", color: "cyan" },
  { icon: "Moon", title: "Работает в фоне", desc: "Закрой приложение — кликер продолжает работать через overlay.", tag: "ФОНОВЫЙ", color: "green" },
  { icon: "Vibrate", title: "Вибрация", desc: "Тактильный отклик при запуске и остановке. Никаких сомнений — работает!", tag: "ОТКЛИК", color: "cyan" },
];

const INSTALL_STEPS = [
  { num: "01", title: "Открой приложение", desc: "Нажми «Открыть приложение» на этой странице. Оно откроется в браузере.", icon: "Smartphone" },
  { num: "02", title: "Добавь на экран", desc: "В браузере: меню (⋮) → «Добавить на главный экран» → «Установить». Теперь это приложение на твоём телефоне.", icon: "PlusSquare" },
  { num: "03", title: "Запусти с экрана", desc: "Найди иконку ClickForge на рабочем столе. Запускается как обычное приложение — без браузера.", icon: "Play" },
  { num: "04", title: "Добавь точки тапа", desc: "На экране кликера нажми «+» → тапни в нужное место → точка сохранена.", icon: "Crosshair" },
  { num: "05", title: "Нажми ⚡ и играй", desc: "Горячая кнопка запустит кликер. Переключись в игру — кнопка останется поверх.", icon: "Zap" },
];

const FAQS = [
  { q: "Это реальное приложение?", a: "Да! PWA (Progressive Web App) — современный стандарт приложений. Устанавливается с браузера, работает как нативное приложение, не требует магазина. Chrome на Android поддерживает полностью." },
  { q: "Кликер мешает управлению в игре?", a: "Нет. Кнопка ⚡ работает поверх всего, тапы кликера не перехватывают жесты — джойстик, свайпы и движения работают в штатном режиме." },
  { q: "Данные сохраняются?", a: "Все профили и статистика хранятся локально на устройстве. Никаких серверов, никакой регистрации — всё приватно." },
  { q: "Работает без интернета?", a: "После установки — да. Service Worker кэширует приложение, оно работает полностью офлайн." },
  { q: "Сколько профилей можно создать?", a: "Сколько угодно. Каждый профиль хранит свои точки, задержку, режим, авто-стоп и другие настройки." },
  { q: "Как переместить кнопку ⚡?", a: "Зажми и тащи кнопку в любое место экрана. Она сохранит позицию." },
];

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl border cursor-pointer transition-all"
      style={{ borderColor: open ? "rgba(0,255,136,0.3)" : "var(--dark-border)", background: open ? "rgba(0,255,136,0.03)" : "var(--dark-card)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5">
        <span className="font-rajdhani font-semibold text-white pr-4">{q}</span>
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

export default function Index() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(7,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/app" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--neon-green)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--dark-bg)" }} />
            </div>
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            </span>
            <span className="font-mono-ibm text-xs px-2 py-0.5 rounded hidden sm:block"
              style={{ background: "rgba(0,255,136,0.1)", color: "var(--neon-green)" }}>PWA</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded font-rajdhani font-semibold text-sm tracking-wider text-slate-400 hover:text-white transition-colors">
                {item.label}
              </button>
            ))}
          </div>
          <a href="/app" className="neon-btn-green px-5 py-2 rounded font-rajdhani font-bold text-sm tracking-widest">
            ОТКРЫТЬ ПРИЛОЖЕНИЕ →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center pt-20 hex-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 40%, rgba(0,255,136,0.06) 0%, transparent 60%)" }} />
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="pulse-dot" />
              <span className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-green)" }}>
                АВТОКЛИКЕР · ANDROID · БЕСПЛАТНО
              </span>
            </div>
            <h1 className="font-rajdhani font-bold leading-none" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
              <span className="text-white block">ТАПАЙ САМ.</span>
              <span className="block" style={{ color: "var(--neon-green)" }}>ПОКА ТЫ</span>
              <span className="text-white block">ИГРАЕШЬ.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Полноценное приложение прямо в браузере. Устанавливается на телефон как APK —{" "}
              <span className="text-white font-medium">без Google Play, без рекламы</span>. Профили, overlay-кнопка, статистика.
            </p>

            {/* Download card */}
            <div className="rounded-2xl p-6 border relative overflow-hidden"
              style={{ background: "rgba(0,255,136,0.04)", borderColor: "rgba(0,255,136,0.25)", boxShadow: "0 0 40px rgba(0,255,136,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }} />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)" }}>⚡</div>
                <div>
                  <div className="font-rajdhani font-bold text-white text-xl">ClickForge v2.4</div>
                  <div className="font-mono-ibm text-xs text-slate-400">PWA · Android + iOS · Офлайн · Бесплатно</div>
                  <div className="flex gap-3 mt-1.5 flex-wrap">
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-green)" }}>✓ 12 функций</span>
                    <span className="font-mono-ibm text-xs" style={{ color: "var(--neon-cyan)" }}>✓ Без регистрации</span>
                    <span className="font-mono-ibm text-xs text-slate-500">✓ Данные на устройстве</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a href="/app"
                  className="py-4 rounded-xl font-rajdhani font-bold text-lg tracking-wider flex items-center justify-center gap-2 neon-btn-green animate-border-pulse">
                  <Icon name="Smartphone" size={20} />
                  ОТКРЫТЬ
                </a>
                <button onClick={handleInstall}
                  className="py-4 rounded-xl font-rajdhani font-bold text-lg tracking-wider flex items-center justify-center gap-2 neon-btn-cyan">
                  <Icon name="Download" size={20} />
                  {installed ? "УСТАНОВЛЕНО ✓" : "УСТАНОВИТЬ"}
                </button>
              </div>
              <div className="mt-3 text-center font-mono-ibm text-xs text-slate-600">
                «Установить» → «Добавить на главный экран» → иконка на рабочем столе
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[{ v: "12+", l: "функций" }, { v: "10мс", l: "мин. задержка" }, { v: "∞", l: "профилей" }].map(s => (
                <div key={s.l} className="game-card rounded-xl p-3 text-center">
                  <div className="font-rajdhani font-bold text-2xl neon-text-green">{s.v}</div>
                  <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hidden lg:flex justify-center">
            <div className="animate-float relative">
              <div className="rounded-3xl border-4 overflow-hidden relative"
                style={{ width: 240, height: 500, borderColor: "#1e3a2a", background: "var(--dark-bg)", boxShadow: "0 0 60px rgba(0,255,136,0.2), 0 40px 80px rgba(0,0,0,0.6)" }}>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex justify-between px-4 pt-3 pb-1">
                    <span className="font-rajdhani font-bold text-xs tracking-wider" style={{ color: "var(--neon-green)" }}>CLICK<span className="text-white">FORGE</span></span>
                    <span className="font-mono-ibm text-xs text-slate-500">Основной</span>
                  </div>
                  <div className="grid grid-cols-3 border-y text-center" style={{ borderColor: "var(--dark-border)" }}>
                    {[["4,821", "ТАПОВ"], ["02:14", "ВРЕМЯ"], ["3.3", "CPS"]].map(([v, l]) => (
                      <div key={l} className="py-2 border-r last:border-r-0" style={{ borderColor: "var(--dark-border)" }}>
                        <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-green)" }}>{v}</div>
                        <div className="font-mono-ibm text-xs text-slate-600">{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 relative"
                    style={{ backgroundImage: "linear-gradient(rgba(0,255,136,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.07) 1px, transparent 1px)", backgroundSize: "10% 10%" }}>
                    <div className="absolute" style={{ left: "55%", top: "55%", transform: "translate(-50%,-50%)" }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-rajdhani font-bold text-sm"
                        style={{ border: "2px solid var(--neon-green)", color: "var(--neon-green)", background: "rgba(0,255,136,0.1)" }}>1</div>
                      <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,255,136,0.2)" }} />
                    </div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "var(--neon-green)" }}>+</div>
                  </div>
                  <div className="p-3 border-t space-y-2" style={{ borderColor: "var(--dark-border)" }}>
                    <div className="rounded py-2 text-center font-rajdhani font-bold text-base"
                      style={{ background: "rgba(0,255,136,0.15)", border: "1px solid var(--neon-green)", color: "var(--neon-green)" }}>⏹ ОСТАНОВИТЬ</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Рандом", "Вибро", "Авто-стоп"].map(l => (
                        <div key={l} className="py-1.5 rounded text-center font-mono-ibm text-xs"
                          style={{ border: "1px solid var(--dark-border)", color: "#475569" }}>{l}</div>
                      ))}
                    </div>
                  </div>
                  <div className="flex border-t" style={{ borderColor: "var(--dark-border)", background: "rgba(7,13,20,0.98)" }}>
                    {["⊕", "📋", "⚙", "📊"].map((ic, i) => (
                      <div key={i} className="flex-1 py-2 text-center text-sm" style={{ color: i === 0 ? "var(--neon-green)" : "#334155" }}>{ic}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ right: -20, top: "35%", background: "var(--neon-green)", color: "var(--dark-bg)", boxShadow: "0 0 24px rgba(0,255,136,0.9)" }}>⚡</div>
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
              12 ФУНКЦИЙ <span style={{ color: "var(--neon-green)" }}>В ОДНОМ ПРИЛОЖЕНИИ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {ALL_FEATURES.slice(0, 2).map((f, i) => (
              <div key={i} className="game-card rounded-2xl p-6 border-l-2 relative overflow-hidden group"
                style={{ borderLeftColor: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)", border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.25)" : "rgba(0,229,255,0.25)"}` }}>
                    <Icon name={f.icon} fallback="Zap" size={22} style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-rajdhani font-bold text-white text-lg">{f.title}</h3>
                      <span className="font-mono-ibm text-xs px-2 py-0.5 rounded"
                        style={{ background: f.color === "green" ? "rgba(0,255,136,0.1)" : "rgba(0,229,255,0.1)", color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}>{f.tag}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_FEATURES.slice(2).map((f, i) => (
              <div key={i} className="game-card rounded-xl p-5 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: f.color === "green" ? "rgba(0,255,136,0.08)" : "rgba(0,229,255,0.08)", border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.2)" : "rgba(0,229,255,0.2)"}` }}>
                    <Icon name={f.icon} fallback="Zap" size={16} style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }} />
                  </div>
                  <span className="font-mono-ibm text-xs px-1.5 py-0.5 rounded"
                    style={{ background: f.color === "green" ? "rgba(0,255,136,0.07)" : "rgba(0,229,255,0.07)", color: f.color === "green" ? "rgba(0,255,136,0.7)" : "rgba(0,229,255,0.7)" }}>{f.tag}</span>
                </div>
                <h3 className="font-rajdhani font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTALL */}
      <section id="how" className="py-24" style={{ background: "rgba(0,255,136,0.015)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>ПОШАГОВО</div>
            <h2 className="font-rajdhani font-bold text-white" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
              КАК <span style={{ color: "var(--neon-cyan)" }}>УСТАНОВИТЬ</span>
            </h2>
            <p className="text-slate-400 mt-4">2 минуты — и кликер на рабочем столе телефона</p>
          </div>
          <div className="relative space-y-4">
            <div className="absolute left-6 top-8 bottom-8 w-px hidden md:block"
              style={{ background: "linear-gradient(to bottom, var(--neon-green), var(--neon-cyan), transparent)" }} />
            {INSTALL_STEPS.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono-ibm font-bold text-sm z-10"
                  style={{ background: "var(--dark-bg)", border: `2px solid ${i < 2 ? "var(--neon-green)" : "var(--neon-cyan)"}`, color: i < 2 ? "var(--neon-green)" : "var(--neon-cyan)", boxShadow: `0 0 12px ${i < 2 ? "rgba(0,255,136,0.3)" : "rgba(0,229,255,0.3)"}` }}>
                  {step.num}
                </div>
                <div className="game-card rounded-xl p-5 flex-1 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.15)" }}>
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="pulse-dot mx-auto mb-8" />
          <h2 className="font-rajdhani font-bold text-white mb-4" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
            Попробуй прямо <span style={{ color: "var(--neon-green)" }}>сейчас</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
            Открой приложение, добавь на экран — и кликер уже в кармане
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/app"
              className="neon-btn-green px-10 py-4 rounded-xl font-rajdhani font-bold text-xl tracking-widest flex items-center justify-center gap-3 animate-border-pulse">
              <Icon name="Smartphone" size={22} />
              ОТКРЫТЬ ПРИЛОЖЕНИЕ
            </a>
            <button onClick={handleInstall}
              className="neon-btn-cyan px-10 py-4 rounded-xl font-rajdhani font-bold text-xl tracking-widest flex items-center justify-center gap-3">
              <Icon name="Download" size={22} />
              {installed ? "УСТАНОВЛЕНО ✓" : "НА ЭКРАН"}
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-5 font-mono-ibm text-xs text-slate-600 flex-wrap">
            <span>✓ Android + iOS</span>
            <span>✓ Без регистрации</span>
            <span>✓ Офлайн</span>
            <span>✓ Данные на устройстве</span>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rajdhani font-bold text-white tracking-wider">
            CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            <span className="font-mono-ibm text-xs text-slate-600 ml-2">v2.4 PWA</span>
          </span>
          <div className="font-mono-ibm text-xs text-slate-600">Для личного использования · Android + iOS</div>
          <div className="flex gap-4 font-mono-ibm text-xs text-slate-500">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="hover:text-slate-300 transition-colors">{item.label}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* Install modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowInstallModal(false); }}>
          <div className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: "var(--dark-card)", border: "1px solid rgba(0,255,136,0.3)", boxShadow: "0 0 40px rgba(0,255,136,0.15)" }}>
            <button onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400"
              style={{ background: "rgba(255,255,255,0.05)" }}>✕</button>
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-rajdhani font-bold text-white text-xl mb-1">Установить на телефон</h3>
            <p className="text-slate-400 text-sm mb-5">Инструкция для Chrome на Android:</p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", t: "Открой приложение", d: "Нажми кнопку ниже или зайди по прямой ссылке" },
                { n: "2", t: "Меню браузера", d: "Три точки (⋮) в правом верхнем углу Chrome" },
                { n: "3", t: "Добавить на экран", d: "«Добавить на главный экран» или «Установить приложение»" },
                { n: "4", t: "Подтверди", d: "Нажми «Установить» — иконка появится на рабочем столе" },
              ].map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-mono-ibm text-xs font-bold"
                    style={{ background: "rgba(0,255,136,0.15)", color: "var(--neon-green)" }}>{s.n}</div>
                  <div>
                    <div className="font-rajdhani font-semibold text-white text-sm">{s.t}</div>
                    <div className="font-mono-ibm text-xs text-slate-500">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/app"
              className="w-full py-3 rounded-xl font-rajdhani font-bold text-base tracking-wider flex items-center justify-center gap-2 neon-btn-green">
              ОТКРЫТЬ ПРИЛОЖЕНИЕ →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
