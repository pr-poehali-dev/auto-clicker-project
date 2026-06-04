import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ClickPoint {
  id: string;
  x: number; // percentage
  y: number;
  label: string;
}

interface Profile {
  id: string;
  name: string;
  delayMs: number;
  randomize: boolean;
  randomRange: number;
  clickMode: "single" | "double" | "long";
  points: ClickPoint[];
  autoStop: boolean;
  stopAfterCount: number;
  stopAfterSeconds: number;
  multiMode: "sequence" | "simultaneous";
  swipeEnabled: boolean;
  sound: boolean;
  vibration: boolean;
  overlayOpacity: number;
  hotkey: string;
}

type AppScreen = "clicker" | "profiles" | "settings" | "stats";

const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Основной",
  delayMs: 300,
  randomize: false,
  randomRange: 15,
  clickMode: "single",
  points: [{ id: "p1", x: 50, y: 60, label: "Цель 1" }],
  autoStop: false,
  stopAfterCount: 1000,
  stopAfterSeconds: 300,
  multiMode: "sequence",
  swipeEnabled: false,
  sound: false,
  vibration: true,
  overlayOpacity: 90,
  hotkey: "vol+",
};

const CLICK_MODES = [
  { id: "single", label: "Одиночный", icon: "MousePointer" },
  { id: "double", label: "Двойной", icon: "Mouse" },
  { id: "long", label: "Долгий", icon: "Hand" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function vibrate(ms = 30) {
  if ("vibrate" in navigator) navigator.vibrate(ms);
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem("cf_profiles", JSON.stringify(profiles));
}

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem("cf_profiles");
    return raw ? JSON.parse(raw) : [DEFAULT_PROFILE];
  } catch {
    return [DEFAULT_PROFILE];
  }
}

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem("cf_stats") || "{}");
  } catch {
    return {};
  }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Toggle({ value, onChange, color = "green" }: { value: boolean; onChange: (v: boolean) => void; color?: "green" | "cyan" }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? (color === "green" ? "var(--neon-green)" : "var(--neon-cyan)") : "#334155" }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow"
        style={{ left: value ? "calc(100% - 20px)" : 4 }}
      />
    </button>
  );
}

function Slider({
  value, onChange, min, max, step = 1, label, unit = "", color = "green"
}: {
  value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number;
  label: string; unit?: string; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-mono-ibm text-xs text-slate-400">{label}</span>
        <span className="font-mono-ibm text-xs font-bold" style={{ color: color === "cyan" ? "var(--neon-cyan)" : "var(--neon-green)" }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ "--range-progress": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

// ─── Clicker Screen ─────────────────────────────────────────────────────────

function ClickerScreen({ profile, onUpdate }: { profile: Profile; onUpdate: (p: Profile) => void }) {
  const [running, setRunning] = useState(false);
  const [taps, setTaps] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [addingPoint, setAddingPoint] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayPos, setOverlayPos] = useState({ x: 16, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapAreaRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const tapCount = useRef(0);

  const doRipple = useCallback((x: number, y: number) => {
    const id = ++rippleId.current;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  }, []);

  const startClicker = useCallback(() => {
    if (running) return;
    setRunning(true);
    tapCount.current = 0;
    if (profile.vibration) vibrate(40);

    // Timer
    timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);

    const tick = () => {
      const points = profile.points.length > 0 ? profile.points : [{ x: 50, y: 60, id: "x", label: "" }];

      if (profile.multiMode === "simultaneous") {
        points.forEach(pt => doRipple(pt.x, pt.y));
      } else {
        const pt = points[tapCount.current % points.length];
        doRipple(pt.x, pt.y);
      }

      tapCount.current++;
      setTaps(tapCount.current);
      if (profile.vibration) vibrate(15);

      // Auto stop
      if (profile.autoStop && tapCount.current >= profile.stopAfterCount) {
        stopClicker();
      }
    };

    let delay = profile.delayMs;
    if (profile.randomize) {
      const variance = delay * (profile.randomRange / 100);
      delay = delay - variance + Math.random() * variance * 2;
    }

    intervalRef.current = setInterval(tick, Math.max(10, delay));
  }, [running, profile, doRipple]);

  const stopClicker = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (profile.vibration) vibrate([20, 30, 20]);

    // Save stats
    const stats = loadStats();
    const today = new Date().toDateString();
    stats[today] = (stats[today] || 0) + tapCount.current;
    localStorage.setItem("cf_stats", JSON.stringify(stats));
  }, [profile.vibration]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto stop by time
  useEffect(() => {
    if (running && profile.autoStop && sessionTime >= profile.stopAfterSeconds) {
      stopClicker();
    }
  }, [sessionTime, running, profile.autoStop, profile.stopAfterSeconds, stopClicker]);

  const toggle = () => running ? stopClicker() : startClicker();

  const handleAreaTap = (e: React.TouchEvent | React.MouseEvent) => {
    if (!tapAreaRef.current || addingPoint) return;
    const rect = tapAreaRef.current.getBoundingClientRect();
    let cx: number, cy: number;
    if ("touches" in e) {
      cx = e.touches[0].clientX; cy = e.touches[0].clientY;
    } else {
      cx = e.clientX; cy = e.clientY;
    }
    const x = ((cx - rect.left) / rect.width) * 100;
    const y = ((cy - rect.top) / rect.height) * 100;
    const id = Date.now().toString();
    const newPoint: ClickPoint = { id, x: Math.round(x), y: Math.round(y), label: `Цель ${profile.points.length + 1}` };
    onUpdate({ ...profile, points: [...profile.points, newPoint] });
    setAddingPoint(false);
  };

  const removePoint = (id: string) => {
    onUpdate({ ...profile, points: profile.points.filter(p => p.id !== id) });
  };

  // Overlay drag
  const handleOverlayDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: clientX - overlayPos.x, y: clientY - overlayPos.y };
  };

  useEffect(() => {
    const move = (e: TouchEvent | MouseEvent) => {
      if (!dragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      setOverlayPos({
        x: Math.max(0, Math.min(window.innerWidth - 56, clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 56, clientY - dragOffset.current.y)),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchend", up);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const cps = profile.delayMs > 0 ? (1000 / profile.delayMs).toFixed(1) : "0";

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--dark-bg)" }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--dark-border)" }}>
        <div>
          <div className="font-rajdhani font-bold text-white text-lg leading-none">{profile.name}</div>
          <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{cps} CPS · {profile.delayMs}мс</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{
              background: running ? "var(--neon-green)" : "#475569",
              boxShadow: running ? "0 0 8px var(--neon-green)" : "none",
            }} />
            <span className="font-mono-ibm text-xs" style={{ color: running ? "var(--neon-green)" : "#475569" }}>
              {running ? "РАБОТАЕТ" : "СТОП"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-0 border-b" style={{ borderColor: "var(--dark-border)" }}>
        {[
          { v: taps.toLocaleString(), l: "ТАПОВ" },
          { v: fmt(sessionTime), l: "ВРЕМЯ" },
          { v: cps, l: "CPS" },
        ].map(({ v, l }) => (
          <div key={l} className="py-3 text-center border-r last:border-r-0" style={{ borderColor: "var(--dark-border)" }}>
            <div className="font-rajdhani font-bold text-xl" style={{ color: "var(--neon-green)" }}>{v}</div>
            <div className="font-mono-ibm text-xs text-slate-500">{l}</div>
          </div>
        ))}
      </div>

      {/* Tap area */}
      <div
        ref={tapAreaRef}
        className="flex-1 relative overflow-hidden"
        style={{ background: "rgba(0,255,136,0.01)", cursor: addingPoint ? "crosshair" : "default" }}
        onTouchStart={addingPoint ? handleAreaTap : undefined}
        onClick={addingPoint ? handleAreaTap : undefined}
      >
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
            backgroundSize: "10% 10%"
          }}
        />

        {/* Center hint */}
        {profile.points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Icon name="Crosshair" size={32} style={{ color: "rgba(0,255,136,0.2)", margin: "0 auto 8px" }} />
              <div className="font-mono-ibm text-xs text-slate-600">Нажми «+» чтобы добавить точку тапа</div>
            </div>
          </div>
        )}

        {addingPoint && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="rounded-xl px-6 py-3 font-rajdhani font-bold text-base"
              style={{ background: "rgba(0,229,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }}
            >
              🎯 Тапни по экрану — там будет кликать
            </div>
          </div>
        )}

        {/* Click points */}
        {profile.points.map((pt, i) => (
          <div key={pt.id} className="absolute"
            style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%, -50%)", zIndex: 5 }}
          >
            <div className="relative group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-rajdhani font-bold text-sm"
                style={{
                  background: running ? "rgba(0,255,136,0.2)" : "rgba(0,255,136,0.1)",
                  border: `2px solid ${running ? "var(--neon-green)" : "rgba(0,255,136,0.4)"}`,
                  color: "var(--neon-green)",
                  boxShadow: running ? "0 0 12px rgba(0,255,136,0.5)" : "none",
                }}
              >
                {i + 1}
              </div>
              {running && (
                <div className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: "rgba(0,255,136,0.3)" }}
                />
              )}
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "#ef4444", color: "white" }}
                onClick={(e) => { e.stopPropagation(); removePoint(pt.id); }}
              >×</button>
              <div className="absolute top-11 left-1/2 -translate-x-1/2 font-mono-ibm text-xs text-slate-500 whitespace-nowrap">
                {pt.x},{pt.y}
              </div>
            </div>
          </div>
        ))}

        {/* Ripples */}
        {ripples.map(rp => (
          <div key={rp.id} className="absolute pointer-events-none rounded-full"
            style={{
              left: `${rp.x}%`, top: `${rp.y}%`,
              width: 12, height: 12,
              transform: "translate(-50%, -50%)",
              background: "rgba(0,255,136,0.8)",
              animation: "cf-ripple 0.7s ease-out forwards",
            }}
          />
        ))}

        {/* Add point button */}
        <button
          onClick={() => setAddingPoint(!addingPoint)}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all"
          style={{
            background: addingPoint ? "var(--neon-cyan)" : "rgba(0,255,136,0.1)",
            border: `1px solid ${addingPoint ? "var(--neon-cyan)" : "rgba(0,255,136,0.3)"}`,
            color: addingPoint ? "var(--dark-bg)" : "var(--neon-green)",
          }}
        >
          {addingPoint ? "✕" : "+"}
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3 border-t" style={{ borderColor: "var(--dark-border)" }}>
        {/* Delay */}
        <Slider
          value={profile.delayMs} min={10} max={5000} step={10}
          label="ЗАДЕРЖКА" unit="мс"
          onChange={(v) => onUpdate({ ...profile, delayMs: v })}
        />

        {/* Main button */}
        <button
          onClick={toggle}
          className="w-full py-4 rounded-xl font-rajdhani font-bold text-2xl tracking-widest transition-all"
          style={{
            background: running
              ? "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.05))"
              : "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.05))",
            border: `2px solid ${running ? "var(--neon-cyan)" : "var(--neon-green)"}`,
            color: running ? "var(--neon-cyan)" : "var(--neon-green)",
            boxShadow: running
              ? "0 0 30px rgba(0,229,255,0.3)"
              : "0 0 30px rgba(0,255,136,0.3)",
          }}
        >
          {running ? "⏹ ОСТАНОВИТЬ" : "⚡ ЗАПУСТИТЬ"}
        </button>

        {/* Quick toggles */}
        <div className="flex gap-2">
          {[
            { key: "randomize", label: "Рандом", icon: "Shuffle" },
            { key: "vibration", label: "Вибро", icon: "Vibrate" },
            { key: "autoStop", label: "Авто-стоп", icon: "Clock" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onUpdate({ ...profile, [key]: !profile[key as keyof Profile] })}
              className="flex-1 py-2 rounded-lg flex flex-col items-center gap-1 border transition-all"
              style={{
                borderColor: profile[key as keyof Profile] ? "rgba(0,255,136,0.4)" : "var(--dark-border)",
                background: profile[key as keyof Profile] ? "rgba(0,255,136,0.06)" : "transparent",
              }}
            >
              <Icon name={icon} fallback="Zap" size={14}
                style={{ color: profile[key as keyof Profile] ? "var(--neon-green)" : "#475569" }}
              />
              <span className="font-mono-ibm text-xs"
                style={{ color: profile[key as keyof Profile] ? "var(--neon-green)" : "#475569" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating overlay button */}
      {showOverlay && (
        <div
          className="fixed z-50 select-none"
          style={{ left: overlayPos.x, top: overlayPos.y }}
          onTouchStart={handleOverlayDragStart}
          onMouseDown={handleOverlayDragStart}
        >
          <button
            onClick={(e) => { e.stopPropagation(); if (!dragging) toggle(); }}
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl transition-all active:scale-95"
            style={{
              background: running ? "var(--neon-cyan)" : "var(--neon-green)",
              color: "var(--dark-bg)",
              boxShadow: running
                ? "0 0 24px rgba(0,229,255,0.9), 0 4px 20px rgba(0,0,0,0.5)"
                : "0 0 24px rgba(0,255,136,0.9), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {running ? "⏹" : "⚡"}
          </button>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono-ibm text-xs whitespace-nowrap"
            style={{ color: running ? "var(--neon-cyan)" : "var(--neon-green)" }}
          >
            {running ? taps : "тап"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cf-ripple {
          0% { width: 12px; height: 12px; opacity: 1; }
          100% { width: 60px; height: 60px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Profiles Screen ─────────────────────────────────────────────────────────

function ProfilesScreen({
  profiles, activeId, onSelect, onAdd, onDelete, onRename
}: {
  profiles: Profile[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--dark-border)" }}>
        <div className="font-rajdhani font-bold text-white text-xl">Профили</div>
        <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{profiles.length} сохранённых конфигов</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {profiles.map(p => (
          <div key={p.id} className="rounded-xl border p-4 transition-all"
            style={{
              borderColor: p.id === activeId ? "rgba(0,255,136,0.5)" : "var(--dark-border)",
              background: p.id === activeId ? "rgba(0,255,136,0.04)" : "var(--dark-card)",
              boxShadow: p.id === activeId ? "0 0 16px rgba(0,255,136,0.1)" : "none",
            }}
          >
            {editing === p.id ? (
              <div className="flex gap-2 mb-3">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm font-rajdhani font-semibold text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,136,0.3)" }}
                  autoFocus
                />
                <button
                  onClick={() => { onRename(p.id, editName); setEditing(null); }}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{ background: "var(--neon-green)", color: "var(--dark-bg)" }}
                >✓</button>
                <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg text-sm text-slate-400"
                  style={{ border: "1px solid var(--dark-border)" }}>✕</button>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {p.id === activeId && <div className="pulse-dot" style={{ width: 6, height: 6 }} />}
                  <span className="font-rajdhani font-bold text-white">{p.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(p.id); setEditName(p.name); }}
                    className="w-7 h-7 rounded flex items-center justify-center"
                    style={{ color: "#64748b" }}>
                    <Icon name="Pencil" size={13} />
                  </button>
                  {profiles.length > 1 && (
                    <button onClick={() => onDelete(p.id)}
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ color: "#64748b" }}>
                      <Icon name="Trash2" size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { l: "Задержка", v: `${p.delayMs}мс` },
                { l: "CPS", v: (1000 / p.delayMs).toFixed(1) },
                { l: "Точек", v: String(p.points.length) },
              ].map(({ l, v }) => (
                <div key={l} className="rounded-lg p-2 text-center"
                  style={{ background: "rgba(0,0,0,0.3)" }}>
                  <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-green)" }}>{v}</div>
                  <div className="font-mono-ibm text-xs text-slate-500">{l}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap mb-3">
              {p.randomize && <span className="font-mono-ibm text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,229,255,0.1)", color: "var(--neon-cyan)" }}>Рандом</span>}
              {p.autoStop && <span className="font-mono-ibm text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,255,136,0.08)", color: "var(--neon-green)" }}>Авто-стоп</span>}
              {p.vibration && <span className="font-mono-ibm text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>Вибро</span>}
              <span className="font-mono-ibm text-xs px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>{p.clickMode}</span>
            </div>

            <button
              onClick={() => onSelect(p.id)}
              className="w-full py-2.5 rounded-lg font-rajdhani font-bold text-sm tracking-wider transition-all"
              style={{
                background: p.id === activeId ? "var(--neon-green)" : "rgba(0,255,136,0.08)",
                color: p.id === activeId ? "var(--dark-bg)" : "var(--neon-green)",
                border: `1px solid ${p.id === activeId ? "transparent" : "rgba(0,255,136,0.2)"}`,
              }}
            >
              {p.id === activeId ? "✓ АКТИВЕН" : "ВЫБРАТЬ"}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t" style={{ borderColor: "var(--dark-border)" }}>
        <button
          onClick={onAdd}
          className="w-full py-3 rounded-xl font-rajdhani font-bold text-base tracking-wider flex items-center justify-center gap-2 neon-btn-green"
        >
          <Icon name="Plus" size={18} />
          НОВЫЙ ПРОФИЛЬ
        </button>
      </div>
    </div>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────

function SettingsScreen({ profile, onUpdate }: { profile: Profile; onUpdate: (p: Profile) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--dark-border)" }}>
        <div className="font-rajdhani font-bold text-white text-xl">Настройки</div>
        <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{profile.name}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Click mode */}
        <div>
          <div className="font-mono-ibm text-xs text-slate-400 mb-3 tracking-widest">РЕЖИМ КЛИКА</div>
          <div className="grid grid-cols-3 gap-2">
            {CLICK_MODES.map(m => (
              <button key={m.id} onClick={() => onUpdate({ ...profile, clickMode: m.id as Profile["clickMode"] })}
                className="py-3 rounded-xl flex flex-col items-center gap-1 border transition-all"
                style={{
                  borderColor: profile.clickMode === m.id ? "var(--neon-cyan)" : "var(--dark-border)",
                  background: profile.clickMode === m.id ? "rgba(0,229,255,0.08)" : "transparent",
                  color: profile.clickMode === m.id ? "var(--neon-cyan)" : "#475569",
                }}
              >
                <Icon name={m.icon} fallback="MousePointer" size={18} />
                <span className="font-mono-ibm text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timing */}
        <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
          <div className="font-mono-ibm text-xs text-slate-400 tracking-widest">ТАЙМИНГ</div>
          <Slider value={profile.delayMs} onChange={v => onUpdate({ ...profile, delayMs: v })}
            min={10} max={10000} step={10} label="ЗАДЕРЖКА" unit="мс" />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-rajdhani font-semibold text-white text-sm">Рандомизация</div>
              <div className="font-mono-ibm text-xs text-slate-500">Случайное отклонение</div>
            </div>
            <Toggle value={profile.randomize} onChange={v => onUpdate({ ...profile, randomize: v })} />
          </div>
          {profile.randomize && (
            <Slider value={profile.randomRange} onChange={v => onUpdate({ ...profile, randomRange: v })}
              min={1} max={50} step={1} label="ОТКЛОНЕНИЕ" unit="%" color="cyan" />
          )}
        </div>

        {/* Multi mode */}
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
          <div className="font-mono-ibm text-xs text-slate-400 tracking-widest">РЕЖИМ ТОЧЕК</div>
          {(["sequence", "simultaneous"] as const).map(mode => (
            <button key={mode} onClick={() => onUpdate({ ...profile, multiMode: mode })}
              className="w-full py-2.5 px-4 rounded-lg text-left flex items-center justify-between border transition-all"
              style={{
                borderColor: profile.multiMode === mode ? "rgba(0,255,136,0.4)" : "var(--dark-border)",
                background: profile.multiMode === mode ? "rgba(0,255,136,0.05)" : "transparent",
              }}
            >
              <div>
                <div className="font-rajdhani font-semibold text-sm text-white">
                  {mode === "sequence" ? "По очереди" : "Одновременно"}
                </div>
                <div className="font-mono-ibm text-xs text-slate-500">
                  {mode === "sequence" ? "Тапает каждую точку поочерёдно" : "Мультитач — все точки разом"}
                </div>
              </div>
              {profile.multiMode === mode && (
                <Icon name="CheckCircle" size={18} style={{ color: "var(--neon-green)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Auto stop */}
        <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
          <div className="flex items-center justify-between">
            <div className="font-mono-ibm text-xs text-slate-400 tracking-widest">АВТО-СТОП</div>
            <Toggle value={profile.autoStop} onChange={v => onUpdate({ ...profile, autoStop: v })} />
          </div>
          {profile.autoStop && (
            <>
              <Slider value={profile.stopAfterCount} onChange={v => onUpdate({ ...profile, stopAfterCount: v })}
                min={10} max={50000} step={10} label="ПОСЛЕ ТАПОВ" unit="" />
              <Slider value={profile.stopAfterSeconds} onChange={v => onUpdate({ ...profile, stopAfterSeconds: v })}
                min={10} max={3600} step={10} label="ЧЕРЕЗ СЕКУНД" unit="с" color="cyan" />
            </>
          )}
        </div>

        {/* Feedback */}
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
          <div className="font-mono-ibm text-xs text-slate-400 tracking-widest mb-1">ОБРАТНАЯ СВЯЗЬ</div>
          {([
            { key: "vibration", label: "Вибрация", desc: "Вибрировать при запуске и остановке" },
            { key: "sound", label: "Звук", desc: "Звуковой сигнал при тапе" },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-rajdhani font-semibold text-white text-sm">{label}</div>
                <div className="font-mono-ibm text-xs text-slate-500">{desc}</div>
              </div>
              <Toggle value={!!profile[key]} onChange={v => onUpdate({ ...profile, [key]: v })} color="cyan" />
            </div>
          ))}
        </div>

        {/* Overlay opacity */}
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
          <div className="font-mono-ibm text-xs text-slate-400 tracking-widest">OVERLAY КНОПКА</div>
          <Slider value={profile.overlayOpacity} onChange={v => onUpdate({ ...profile, overlayOpacity: v })}
            min={20} max={100} step={5} label="ПРОЗРАЧНОСТЬ" unit="%" color="cyan" />
          <div className="font-mono-ibm text-xs text-slate-500">
            Перетаскивай кнопку ⚡ в любое место экрана
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Stats Screen ─────────────────────────────────────────────────────────────

function StatsScreen() {
  const stats = loadStats();
  const entries = Object.entries(stats).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  const total = entries.reduce((s, [, v]) => s + (v as number), 0);
  const today = new Date().toDateString();
  const todayVal = (stats[today] as number) || 0;
  const best = entries.length > 0 ? Math.max(...entries.map(([, v]) => v as number)) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--dark-border)" }}>
        <div className="font-rajdhani font-bold text-white text-xl">Статистика</div>
        <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">История тапов</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: total.toLocaleString(), l: "Всего тапов", color: "var(--neon-green)" },
            { v: todayVal.toLocaleString(), l: "Сегодня", color: "var(--neon-cyan)" },
            { v: best.toLocaleString(), l: "Рекорд дня", color: "#bf00ff" },
          ].map(({ v, l, color }) => (
            <div key={l} className="game-card rounded-xl p-3 text-center">
              <div className="font-rajdhani font-bold text-xl" style={{ color }}>{v}</div>
              <div className="font-mono-ibm text-xs text-slate-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="BarChart3" size={40} style={{ color: "rgba(0,255,136,0.15)", margin: "0 auto 12px" }} />
            <div className="font-mono-ibm text-xs text-slate-600">Статистика появится после первого запуска</div>
          </div>
        ) : (
          <div>
            <div className="font-mono-ibm text-xs text-slate-400 mb-3 tracking-widest">ПО ДНЯМ</div>
            <div className="space-y-2">
              {entries.map(([date, count]) => {
                const pct = best > 0 ? ((count as number) / best) * 100 : 0;
                return (
                  <div key={date} className="rounded-xl border p-3" style={{ borderColor: "var(--dark-border)", background: "var(--dark-card)" }}>
                    <div className="flex justify-between mb-2">
                      <span className="font-rajdhani font-semibold text-white text-sm">{date}</span>
                      <span className="font-mono-ibm text-sm font-bold" style={{ color: "var(--neon-green)" }}>
                        {(count as number).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--dark-border)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--neon-green), var(--neon-cyan))" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => { localStorage.removeItem("cf_stats"); window.location.reload(); }}
          className="w-full py-3 rounded-xl font-rajdhani font-semibold text-sm text-slate-500 border transition-colors hover:text-slate-300"
          style={{ borderColor: "var(--dark-border)" }}
        >
          Сбросить статистику
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function ClickerApp() {
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeProfileId, setActiveProfileId] = useState(loadProfiles()[0]?.id ?? "default");
  const [screen, setScreen] = useState<AppScreen>("clicker");

  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? profiles[0];

  const updateProfile = (updated: Profile) => {
    const next = profiles.map(p => p.id === updated.id ? updated : p);
    setProfiles(next);
    saveProfiles(next);
  };

  const addProfile = () => {
    const id = Date.now().toString();
    const newP: Profile = {
      ...DEFAULT_PROFILE,
      id,
      name: `Профиль ${profiles.length + 1}`,
      points: [],
    };
    const next = [...profiles, newP];
    setProfiles(next);
    saveProfiles(next);
    setActiveProfileId(id);
    setScreen("clicker");
  };

  const deleteProfile = (id: string) => {
    const next = profiles.filter(p => p.id !== id);
    setProfiles(next);
    saveProfiles(next);
    if (activeProfileId === id) setActiveProfileId(next[0].id);
  };

  const renameProfile = (id: string, name: string) => {
    updateProfile({ ...profiles.find(p => p.id === id)!, name });
  };

  const NAV = [
    { id: "clicker", label: "Кликер", icon: "Crosshair" },
    { id: "profiles", label: "Профили", icon: "BookMarked" },
    { id: "settings", label: "Настройки", icon: "Settings" },
    { id: "stats", label: "Статы", icon: "BarChart3" },
  ] as const;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--dark-bg)", maxWidth: 480, margin: "0 auto" }}>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1"
        style={{ background: "var(--dark-bg)" }}>
        <span className="font-rajdhani font-bold text-sm tracking-wider"
          style={{ color: "var(--neon-green)" }}>
          CLICK<span className="text-white">FORGE</span>
        </span>
        <div className="flex items-center gap-3 font-mono-ibm text-xs text-slate-500">
          <span>{new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}</span>
          <span style={{ color: activeProfile.name.length > 0 ? "var(--neon-green)" : "#475569" }}>
            {activeProfile.name}
          </span>
        </div>
      </div>

      {/* Screen */}
      <div className="flex-1 overflow-hidden">
        {screen === "clicker" && (
          <ClickerScreen profile={activeProfile} onUpdate={updateProfile} />
        )}
        {screen === "profiles" && (
          <ProfilesScreen
            profiles={profiles}
            activeId={activeProfileId}
            onSelect={(id) => { setActiveProfileId(id); setScreen("clicker"); }}
            onAdd={addProfile}
            onDelete={deleteProfile}
            onRename={renameProfile}
          />
        )}
        {screen === "settings" && (
          <SettingsScreen profile={activeProfile} onUpdate={updateProfile} />
        )}
        {screen === "stats" && <StatsScreen />}
      </div>

      {/* Bottom nav */}
      <div className="flex border-t" style={{ borderColor: "var(--dark-border)", background: "rgba(7,13,20,0.98)" }}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className="flex-1 py-3 flex flex-col items-center gap-1 transition-all"
            style={{ color: screen === item.id ? "var(--neon-green)" : "#475569" }}
          >
            <Icon name={item.icon} fallback="Circle" size={20} />
            <span className="font-mono-ibm text-xs">{item.label}</span>
            {screen === item.id && (
              <div className="w-4 h-0.5 rounded-full" style={{ background: "var(--neon-green)" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
