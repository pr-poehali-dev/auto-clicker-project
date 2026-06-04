import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "generator", label: "Генератор" },
  { id: "demo", label: "Демо" },
  { id: "features", label: "Функции" },
];

const FEATURES = [
  {
    icon: "Timer",
    title: "Настройка задержки",
    desc: "От 1мс до 10 секунд между кликами. Идеальная точность для любой игры.",
    color: "green",
  },
  {
    icon: "Layers",
    title: "Overlay-режим",
    desc: "Работает поверх экрана — настрой точку клика в игре, не прерывая сессию.",
    color: "cyan",
  },
  {
    icon: "Gamepad2",
    title: "Не мешает управлению",
    desc: "Джойстик, клавиатура, мышь работают без задержек параллельно с кликером.",
    color: "green",
  },
  {
    icon: "Crosshair",
    title: "Точка прицеливания",
    desc: "Визуальный маркер с точными координатами X/Y на экране.",
    color: "cyan",
  },
  {
    icon: "Zap",
    title: "Горячие клавиши",
    desc: "Запуск и остановка кликера без переключения из игры.",
    color: "green",
  },
  {
    icon: "BarChart3",
    title: "Статистика кликов",
    desc: "Счётчик кликов в реальном времени, CPS (кликов в секунду).",
    color: "cyan",
  },
  {
    icon: "Shuffle",
    title: "Рандомизация",
    desc: "Случайные отклонения в задержке и позиции для обхода защиты игры.",
    color: "green",
  },
  {
    icon: "Clock",
    title: "Таймер остановки",
    desc: "Автоматическая остановка через заданное время или количество кликов.",
    color: "cyan",
  },
];

const DELAY_PRESETS = [
  { label: "Молния", ms: 50, desc: "50мс" },
  { label: "Быстро", ms: 200, desc: "200мс" },
  { label: "Средне", ms: 500, desc: "500мс" },
  { label: "Медленно", ms: 1000, desc: "1с" },
  { label: "Стелс", ms: 2500, desc: "2.5с" },
];

const CLICK_MODES = [
  { id: "single", label: "Одиночный", icon: "MousePointer" },
  { id: "double", label: "Двойной", icon: "Mouse" },
  { id: "right", label: "Правая кнопка", icon: "MousePointerClick" },
];

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const count = useCountUp(value);
  return (
    <div className="text-center">
      <div className="font-rajdhani text-4xl font-bold neon-text-green">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-1 font-mono-ibm">{label}</div>
    </div>
  );
}

function DemoClickerWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [delay, setDelay] = useState(500);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setClicks((c) => c + 1);
        const id = ++rippleIdRef.current;
        setRipples((r) => [...r, { id, x: pos.x, y: pos.y }]);
        setTimeout(() => {
          setRipples((r) => r.filter((rp) => rp.id !== id));
        }, 600);
      }, delay);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, delay, pos]);

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.round(x), y: Math.round(y) });
  };

  const cps = delay > 0 ? (1000 / delay).toFixed(1) : "∞";

  return (
    <div className="game-card rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-rajdhani text-xl font-bold text-white">Живое демо</h3>
        <div className="flex items-center gap-2">
          <div className={`pulse-dot ${isRunning ? "" : "opacity-30"}`}></div>
          <span className="font-mono-ibm text-xs text-slate-400">{isRunning ? "АКТИВЕН" : "СТОП"}</span>
        </div>
      </div>

      <div
        ref={areaRef}
        onClick={handleAreaClick}
        className="relative w-full h-48 rounded-md border border-dashed cursor-crosshair overflow-hidden"
        style={{ borderColor: "var(--dark-border)", background: "rgba(0,255,136,0.02)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-slate-600 font-mono-ibm text-xs">Кликни чтобы переместить цель</span>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
            backgroundSize: "20% 20%"
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: "var(--neon-green)" }}></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "var(--neon-green)" }}></div>
            <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 border"
              style={{ borderColor: "var(--neon-green)", boxShadow: "0 0 8px var(--neon-green)" }}
            ></div>
          </div>
        </div>
        {ripples.map((rp) => (
          <div
            key={rp.id}
            className="absolute pointer-events-none rounded-full border"
            style={{
              left: `${rp.x}%`,
              top: `${rp.y}%`,
              width: 20,
              height: 20,
              transform: "translate(-50%, -50%)",
              borderColor: "var(--neon-green)",
              animation: "ripple-out 0.6s ease-out forwards",
            }}
          />
        ))}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="font-mono-ibm text-xs text-slate-400">ЗАДЕРЖКА</span>
          <span className="font-mono-ibm text-xs neon-text-green">{delay}мс ({cps} CPS)</span>
        </div>
        <input
          type="range"
          min={50}
          max={3000}
          step={50}
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full"
          style={{ "--range-progress": `${((delay - 50) / 2950) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono-ibm text-xs text-slate-600">50мс</span>
          <span className="font-mono-ibm text-xs text-slate-600">3с</span>
        </div>
      </div>

      <div className="flex gap-4 font-mono-ibm text-sm">
        <div className="flex-1 game-card rounded p-2 text-center">
          <div className="neon-text-green font-bold text-lg">{clicks}</div>
          <div className="text-slate-500 text-xs">КЛИКОВ</div>
        </div>
        <div className="flex-1 game-card rounded p-2 text-center">
          <div className="neon-text-cyan font-bold text-lg">{cps}</div>
          <div className="text-slate-500 text-xs">CPS</div>
        </div>
        <div className="flex-1 game-card rounded p-2 text-center">
          <div className="text-white font-bold text-lg">{pos.x},{pos.y}</div>
          <div className="text-slate-500 text-xs">X,Y</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-3 rounded font-rajdhani font-bold text-base tracking-wider transition-all ${isRunning ? "neon-btn-cyan" : "neon-btn-green"}`}
        >
          {isRunning ? "⏹ СТОП" : "▶ СТАРТ"}
        </button>
        <button
          onClick={() => { setClicks(0); setIsRunning(false); }}
          className="px-4 py-3 rounded border font-rajdhani font-semibold text-sm text-slate-400 transition-all hover:border-slate-500 hover:text-slate-300 flex items-center"
          style={{ borderColor: "var(--dark-border)" }}
        >
          <Icon name="RotateCcw" size={16} />
        </button>
      </div>
    </div>
  );
}

function GeneratorWidget() {
  const [delay, setDelay] = useState(200);
  const [selectedPreset, setSelectedPreset] = useState(1);
  const [clickMode, setClickMode] = useState("single");
  const [randomize, setRandomize] = useState(false);
  const [hotkey, setHotkey] = useState("F6");
  const [autoStop, setAutoStop] = useState(false);
  const [stopAfter, setStopAfter] = useState(1000);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handlePreset = (idx: number, ms: number) => {
    setSelectedPreset(idx);
    setDelay(ms);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const cps = (1000 / delay).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono-ibm text-xs text-slate-400 mb-3 tracking-widest">БЫСТРЫЕ ПРЕСЕТЫ</div>
        <div className="grid grid-cols-5 gap-2">
          {DELAY_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i, p.ms)}
              className={`py-2 px-1 rounded text-center transition-all border font-rajdhani font-semibold text-sm`}
              style={{
                borderColor: selectedPreset === i ? "var(--neon-green)" : "var(--dark-border)",
                background: selectedPreset === i ? "rgba(0,255,136,0.12)" : "transparent",
                color: selectedPreset === i ? "var(--neon-green)" : "#94a3b8",
                boxShadow: selectedPreset === i ? "0 0 12px rgba(0,255,136,0.25)" : "none",
              }}
            >
              <div>{p.label}</div>
              <div className="font-mono-ibm text-xs opacity-70">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="game-card rounded-lg p-5">
        <div className="flex justify-between mb-3">
          <span className="font-rajdhani font-semibold text-white">Задержка между кликами</span>
          <span className="font-mono-ibm text-sm neon-text-green">{delay}мс · {cps} CPS</span>
        </div>
        <input
          type="range"
          min={1}
          max={10000}
          step={1}
          value={delay}
          onChange={(e) => { setDelay(Number(e.target.value)); setSelectedPreset(-1); }}
          className="w-full"
          style={{ "--range-progress": `${(delay / 10000) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between mt-2">
          <span className="font-mono-ibm text-xs text-slate-600">1мс (супер-быстро)</span>
          <span className="font-mono-ibm text-xs text-slate-600">10с (медленно)</span>
        </div>
      </div>

      <div>
        <div className="font-mono-ibm text-xs text-slate-400 mb-3 tracking-widest">РЕЖИМ КЛИКА</div>
        <div className="grid grid-cols-3 gap-3">
          {CLICK_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setClickMode(m.id)}
              className="py-3 rounded flex flex-col items-center gap-1 border transition-all font-rajdhani font-semibold text-sm"
              style={{
                borderColor: clickMode === m.id ? "var(--neon-cyan)" : "var(--dark-border)",
                background: clickMode === m.id ? "rgba(0,229,255,0.1)" : "transparent",
                color: clickMode === m.id ? "var(--neon-cyan)" : "#94a3b8",
                boxShadow: clickMode === m.id ? "0 0 12px rgba(0,229,255,0.2)" : "none",
              }}
            >
              <Icon name={m.icon} fallback="Mouse" size={18} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="game-card rounded-lg p-4 cursor-pointer select-none"
          onClick={() => setRandomize(!randomize)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-rajdhani font-semibold text-white text-sm">Рандомизация</span>
            <div className="w-9 h-5 rounded-full transition-all relative"
              style={{ background: randomize ? "var(--neon-green)" : "#334155" }}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${randomize ? "left-4" : "left-0.5"}`}></div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Случайное отклонение ±15%</p>
        </div>

        <div
          className="game-card rounded-lg p-4 cursor-pointer select-none"
          onClick={() => setAutoStop(!autoStop)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-rajdhani font-semibold text-white text-sm">Авто-стоп</span>
            <div className="w-9 h-5 rounded-full transition-all relative"
              style={{ background: autoStop ? "var(--neon-cyan)" : "#334155" }}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoStop ? "left-4" : "left-0.5"}`}></div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Остановить после N кликов</p>
        </div>
      </div>

      {autoStop && (
        <div className="game-card rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="font-mono-ibm text-xs text-slate-400">ОСТАНОВИТЬ ПОСЛЕ</span>
            <span className="font-mono-ibm text-xs neon-text-cyan">{stopAfter} кликов</span>
          </div>
          <input
            type="range"
            min={10}
            max={10000}
            step={10}
            value={stopAfter}
            onChange={(e) => setStopAfter(Number(e.target.value))}
            className="w-full"
            style={{ "--range-progress": `${((stopAfter - 10) / 9990) * 100}%` } as React.CSSProperties}
          />
        </div>
      )}

      <div className="game-card rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="font-rajdhani font-semibold text-white">Горячая клавиша</div>
          <div className="text-xs text-slate-500 mt-0.5">Запуск/стоп без переключения</div>
        </div>
        <div className="flex gap-2">
          {["F6", "F7", "F8", "INS"].map((k) => (
            <button
              key={k}
              onClick={() => setHotkey(k)}
              className="px-3 py-1.5 rounded text-xs font-mono-ibm font-bold border transition-all"
              style={{
                borderColor: hotkey === k ? "var(--neon-green)" : "var(--dark-border)",
                background: hotkey === k ? "rgba(0,255,136,0.12)" : "transparent",
                color: hotkey === k ? "var(--neon-green)" : "#64748b",
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-4 rounded-lg font-rajdhani font-bold text-xl tracking-widest transition-all neon-btn-green relative overflow-hidden"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-3">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ГЕНЕРАЦИЯ...
          </span>
        ) : generated ? (
          <span className="flex items-center justify-center gap-2">
            <Icon name="CheckCircle" size={20} />
            СКАЧАТЬ ПРИЛОЖЕНИЕ
          </span>
        ) : (
          "⚡ СГЕНЕРИРОВАТЬ КЛИКЕР"
        )}
      </button>

      {generated && (
        <div className="rounded-lg p-4 border text-sm font-mono-ibm"
          style={{ borderColor: "rgba(0,255,136,0.3)", background: "rgba(0,255,136,0.05)", color: "var(--neon-green)" }}
        >
          ✓ AutoClicker_v1.exe готов · Задержка: {delay}мс · Режим: {clickMode} · Хоткей: {hotkey}
        </div>
      )}
    </div>
  );
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
        style={scrolled ? {
          background: "rgba(7,13,20,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--dark-border)"
        } : {}}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--neon-green)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "var(--dark-bg)" }}></div>
            </div>
            <span className="font-rajdhani font-bold text-xl text-white tracking-wider">
              CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-4 py-2 rounded font-rajdhani font-semibold text-sm tracking-wider transition-all"
                style={{
                  background: activeSection === item.id ? "var(--neon-green)" : "transparent",
                  color: activeSection === item.id ? "var(--dark-bg)" : "#94a3b8",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("generator")}
            className="neon-btn-green px-5 py-2 rounded font-rajdhani font-bold text-sm tracking-widest"
          >
            СОЗДАТЬ
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 hex-bg">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="pulse-dot"></div>
              <span className="font-mono-ibm text-xs tracking-widest" style={{ color: "var(--neon-green)" }}>
                АВТОКЛИКЕР ДЛЯ ГЕЙМЕРОВ
              </span>
            </div>

            <h1 className="font-rajdhani font-bold leading-none" style={{ fontSize: "clamp(48px, 7vw, 96px)" }}>
              <span className="text-white block">СОЗДАЙ</span>
              <span className="block" style={{ color: "var(--neon-green)" }}>КЛИКЕР</span>
              <span className="text-white block">ЗА 30 СЕК</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Настрой задержку, выбери точку — и кликер работает{" "}
              <span className="text-white font-medium">поверх экрана</span>, пока ты управляешь джойстиком и играешь в своём ритме.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => scrollTo("generator")}
                className="neon-btn-green px-8 py-4 rounded-lg font-rajdhani font-bold text-lg tracking-widest animate-border-pulse"
              >
                ⚡ СОЗДАТЬ КЛИКЕР
              </button>
              <button
                onClick={() => scrollTo("demo")}
                className="neon-btn-cyan px-8 py-4 rounded-lg font-rajdhani font-bold text-lg tracking-widest"
              >
                СМОТРЕТЬ ДЕМО
              </button>
            </div>

            <div className="flex gap-8 pt-4 border-t" style={{ borderColor: "var(--dark-border)" }}>
              <StatCard value={50000} label="Загрузок" suffix="+" />
              <StatCard value={8} label="Функций" />
              <StatCard value={99} label="Без задержек" suffix="%" />
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block animate-float">
            <div className="relative">
              <div className="rounded-xl border p-6 relative scan-line"
                style={{
                  background: "rgba(13,21,32,0.9)",
                  borderColor: "var(--neon-green)",
                  boxShadow: "0 0 40px rgba(0,255,136,0.15), 0 0 80px rgba(0,255,136,0.05)"
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-rajdhani font-bold text-white tracking-wider">CLICKFORGE OVERLAY</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--neon-green)" }}></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "СТАТУС", value: "АКТИВЕН", color: "var(--neon-green)" },
                    { label: "ЗАДЕРЖКА", value: "200мс", color: "var(--neon-cyan)" },
                    { label: "РЕЖИМ", value: "ОДИНОЧНЫЙ", color: "white" },
                    { label: "ХОТКЕЙ", value: "F6", color: "white" },
                    { label: "КЛИКОВ", value: "14,832", color: "var(--neon-green)" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--dark-border)" }}>
                      <span className="font-mono-ibm text-xs text-slate-500">{row.label}</span>
                      <span className="font-mono-ibm text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: "var(--dark-border)" }}>
                  <div className="rounded py-2 text-center font-rajdhani font-bold text-sm"
                    style={{ background: "rgba(0,255,136,0.15)", color: "var(--neon-green)", border: "1px solid var(--neon-green)" }}>
                    ▶ СТАРТ
                  </div>
                  <div className="rounded py-2 text-center font-rajdhani font-bold text-sm text-slate-500"
                    style={{ border: "1px solid var(--dark-border)" }}>
                    ⏹ СТОП
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 rounded-full px-4 py-2 font-mono-ibm text-xs font-bold"
                style={{ background: "var(--neon-cyan)", color: "var(--dark-bg)" }}
              >
                OVERLAY
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-lg px-4 py-2 font-mono-ibm text-xs"
                style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)", color: "var(--neon-green)" }}
              >
                5 CPS · 0 задержек
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GENERATOR */}
      <section id="generator" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-cyan)" }}>
              ШАГ 1 — НАСТРОЙКА
            </div>
            <h2 className="font-rajdhani font-bold text-5xl text-white">
              ГЕНЕРАТОР <span style={{ color: "var(--neon-green)" }}>КЛИКЕРА</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Настрой параметры под свою игру и получи готовое приложение с overlay-режимом
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GeneratorWidget />
            </div>

            <div className="space-y-4">
              <div className="game-card rounded-lg p-5 border-l-2" style={{ borderLeftColor: "var(--neon-green)" }}>
                <h4 className="font-rajdhani font-bold text-white mb-2 flex items-center gap-2">
                  <Icon name="Shield" size={16} style={{ color: "var(--neon-green)" }} />
                  Overlay-режим
                </h4>
                <p className="text-sm text-slate-400">
                  Приложение работает поверх любой игры. Ты видишь его UI, но оно не перехватывает ввод — джойстик и клавиатура работают как всегда.
                </p>
              </div>

              <div className="game-card rounded-lg p-5 border-l-2" style={{ borderLeftColor: "var(--neon-cyan)" }}>
                <h4 className="font-rajdhani font-bold text-white mb-2 flex items-center gap-2">
                  <Icon name="MousePointerClick" size={16} style={{ color: "var(--neon-cyan)" }} />
                  Как выбрать точку
                </h4>
                <p className="text-sm text-slate-400">
                  Запусти приложение, нажми «Выбрать точку», кликни в нужное место на экране — кликер запомнит координаты.
                </p>
              </div>

              <div className="game-card rounded-lg p-5 border-l-2" style={{ borderLeftColor: "var(--neon-green)" }}>
                <h4 className="font-rajdhani font-bold text-white mb-2 flex items-center gap-2">
                  <Icon name="Keyboard" size={16} style={{ color: "var(--neon-green)" }} />
                  Горячие клавиши
                </h4>
                <p className="text-sm text-slate-400">
                  Нажми F6 (или выбранную клавишу) — кликер старт/стоп без переключения окна.
                </p>
              </div>

              <div className="rounded-lg p-4 font-mono-ibm text-xs"
                style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "var(--neon-green)" }}>
                  <Icon name="Terminal" size={12} />
                  <span>СИСТЕМНЫЕ ТРЕБОВАНИЯ</span>
                </div>
                <div className="text-slate-500 space-y-1">
                  <div>✓ Windows 10/11</div>
                  <div>✓ .NET 4.8+</div>
                  <div>✓ Разрешение от 720p</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="py-24" style={{ background: "rgba(0,255,136,0.015)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-green)" }}>
              ИНТЕРАКТИВНО
            </div>
            <h2 className="font-rajdhani font-bold text-5xl text-white">
              ДЕМО <span style={{ color: "var(--neon-cyan)" }}>В БРАУЗЕРЕ</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Попробуй прямо сейчас — перемести прицел, выбери скорость и нажми СТАРТ
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <DemoClickerWidget />

            <div className="space-y-6">
              <div className="font-rajdhani font-bold text-2xl text-white">
                Как это работает <span style={{ color: "var(--neon-green)" }}>в реальном приложении?</span>
              </div>

              {[
                { step: "01", title: "Запускаешь приложение", desc: "Маленькое окно поверх экрана — как Discord overlay. Не мешает игре.", icon: "Play" },
                { step: "02", title: "Выбираешь точку клика", desc: "Кликаешь на нужное место — например, кнопку фарма. Кликер запоминает координаты.", icon: "Crosshair" },
                { step: "03", title: "Нажимаешь F6", desc: "Без переключения окна. Кликер начинает работать — джойстик и движение не заедают.", icon: "Zap" },
                { step: "04", title: "Играешь как обычно", desc: "Кликер делает своё дело, ты двигаешься, атакуешь — всё параллельно.", icon: "Gamepad2" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono-ibm font-bold text-sm"
                    style={{ background: "rgba(0,255,136,0.08)", color: "var(--neon-green)", border: "1px solid rgba(0,255,136,0.2)" }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className="font-rajdhani font-bold text-white text-lg flex items-center gap-2">
                      <Icon name={item.icon} fallback="Zap" size={16} style={{ color: "var(--neon-green)" }} />
                      {item.title}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="font-mono-ibm text-xs tracking-widest mb-3" style={{ color: "var(--neon-purple)" }}>
              ВОЗМОЖНОСТИ
            </div>
            <h2 className="font-rajdhani font-bold text-5xl text-white">
              ВСЕ <span style={{ color: "var(--neon-green)" }}>ФУНКЦИИ</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Всё что нужно геймеру — в одном компактном приложении
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {FEATURES.map((f, i) => (
              <div key={i} className="game-card rounded-lg p-5 group cursor-default">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{
                    background: f.color === "green" ? "rgba(0,255,136,0.08)" : "rgba(0,229,255,0.08)",
                    border: `1px solid ${f.color === "green" ? "rgba(0,255,136,0.2)" : "rgba(0,229,255,0.2)"}`,
                  }}
                >
                  <Icon
                    name={f.icon}
                    fallback="Zap"
                    size={20}
                    style={{ color: f.color === "green" ? "var(--neon-green)" : "var(--neon-cyan)" }}
                  />
                </div>
                <h3 className="font-rajdhani font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl p-10 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.07) 0%, rgba(0,229,255,0.04) 100%)",
              border: "1px solid rgba(0,255,136,0.2)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--neon-green), transparent)" }}
            />
            <div className="pulse-dot mx-auto mb-6"></div>
            <h3 className="font-rajdhani font-bold text-4xl text-white mb-3">Готов к запуску?</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Настрой кликер под свою игру — займёт меньше минуты
            </p>
            <button
              onClick={() => scrollTo("generator")}
              className="neon-btn-green px-12 py-4 rounded-lg font-rajdhani font-bold text-xl tracking-widest"
            >
              ⚡ СОЗДАТЬ КЛИКЕР СЕЙЧАС
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-rajdhani font-bold text-lg text-white tracking-wider">
            CLICK<span style={{ color: "var(--neon-green)" }}>FORGE</span>
            <span className="font-mono-ibm text-xs text-slate-600 ml-2">v1.0</span>
          </span>
          <div className="font-mono-ibm text-xs text-slate-600">
            Только для Windows · Для личного использования
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

      <style>{`
        @keyframes ripple-out {
          0% { width: 20px; height: 20px; opacity: 1; }
          100% { width: 80px; height: 80px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Index;