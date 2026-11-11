"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/*
 * schedule-board (Clean) – a self-contained React 19 component.
 * Inline SVGs and scoped styles are included; no other local files or packages are required.
 * Maintained in scripts/chat-rail; run npm run generate after changes.
 */

type IconName =
  | "terminal"
  | "image"
  | "inbox"
  | "memory"
  | "video"
  | "chat"
  | "tasks"
  | "play"
  | "pause"
  | "repeat"
  | "calendar"
  | "shield"
  | "chart"
  | "folder"
  | "folder-open"
  | "plug"
  | "bell"
  | "settings"
  | "search"
  | "compose"
  | "chevron"
  | "check"
  | "close"
  | "plus"
  | "more"
  | "pin"
  | "unpin"
  | "panel"
  | "mic"
  | "send"
  | "hand"
  | "globe"
  | "table"
  | "document"
  | "undo"
  | "redo"
  | "bold"
  | "italic"
  | "underline"
  | "link"
  | "sort"
  | "row"
  | "column"
  | "trash"
  | "copy"
  | "download"
  | "arrow"
  | "stop"
  | "warning"
  | "spark";

const iconPaths: Record<IconName, ReactNode> = {
  chat: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-8.5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 11h.01M12 11h.01M16 11h.01" />
    </>
  ),
  tasks: (
    <>
      <path d="m3 6 1.5 1.5L8 4M11 6h10M3 13l1.5 1.5L8 11M11 13h10M4 20h3M11 20h10" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6Z" />,
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  "folder-open": (
    <>
      <path d="M3 10V7a2 2 0 0 1 2-2h5l2 2h7v3M3 12h18l-3 9H2Z" />
    </>
  ),
  plug: (
    <>
      <path d="M8 3v5M16 3v5M6 8h12v4a6 6 0 0 1-12 0ZM12 18v4" />
    </>
  ),
  bell: (
    <>
      <path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4ZM9 20a3 3 0 0 0 6 0" />
    </>
  ),
  settings: (
    <>
      <path d="m10 3-1 3-3 1-3 3 2 3v3l3 2 2 3h4l1-3 3-1 3-3-2-3V8l-3-2-2-3Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  compose: (
    <>
      <path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7M9 15l1-5L18 2l4 4-8 8Z" />
    </>
  ),
  chevron: <path d="m8 10 4 4 4-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 4v16M4 12h16" />,
  more: (
    <>
      <circle cx="5" cy="12" r=".7" />
      <circle cx="12" cy="12" r=".7" />
      <circle cx="19" cy="12" r=".7" />
    </>
  ),
  pin: (
    <g strokeWidth="1.9">
      <path d="M3 21L8 16" />
      <path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" />
    </g>
  ),
  unpin: (
    <g strokeWidth="1.9">
      <path d="M7.5 8C6.95863 8.1281 6.49932 8.14239 5.99268 8.45891C5.07234 9.03388 4.85108 9.71674 5.08821 10.7612C5.94028 14.5139 9.48599 18.0596 13.2388 18.9117C14.2834 19.1489 14.9661 18.928 15.5416 18.0077C15.8411 17.5288 15.8716 17.0081 16 16.5" />
      <path d="M12 7.79915C12.1776 7.77794 12.3182 7.74034 12.4295 7.68235C13.3997 7.17686 13.9291 5.53361 14.4498 4.60009C14.9311 3.73715 15.1718 3.30567 15.7379 3.10227C16.3041 2.89888 16.6448 3.02205 17.3262 3.26839C18.9197 3.8445 20.1555 5.08032 20.7316 6.6738C20.9779 7.35521 21.1011 7.69591 20.8977 8.26204C20.6943 8.82817 20.2628 9.06884 19.3999 9.55018C18.4608 10.074 16.7954 10.6108 16.2905 11.5898C16.2345 11.6983 16.1978 11.8327 16.1769 12" />
      <path d="M3 21L8 16" />
      <path d="M3 3L21 21" />
    </g>
  ),
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M15 4v16M18 8v3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M9 22h6" />
    </>
  ),
  send: <path d="M12 20V4m-7 7 7-7 7 7" />,
  hand: (
    <>
      <path d="M8 12V5a2 2 0 0 1 4 0v7M12 6a2 2 0 0 1 4 0v6M16 8a2 2 0 0 1 4 0v7a7 7 0 0 1-12 5l-5-6a2 2 0 0 1 3-3l2 2M8 8a2 2 0 0 0-4 0v5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M5 7h14M5 17h14" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 14h18M9 9v11M15 9v11" />
    </>
  ),
  inbox: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 12h5l2 3h4l2-3h5" />
    </>
  ),
  memory: (
    <>
      <path d="M12 4c-2-4-7-2-7 1-3 0-4 5-1 7-2 3 0 6 3 6v3h4V9M12 4c2-4 7-2 7 1 3 0 4 5 1 7 2 3 0 6-3 6v3h-4V9M7 6c4-1 5 3 2 4M17 6c-4-1-5 3-2 4M5 12c3-1 5 1 4 4M19 12c-3-1-5 1-4 4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="12" height="14" rx="3" />
      <path d="m15 9 6-3v12l-6-3Z" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 17 6-6 4 4 3-3 5 5" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l5 5v13H6ZM14 3v5h5M9 12h7M9 16h5" />
    </>
  ),
  undo: <path d="M4 11a8 8 0 1 1 2 8M4 4v7h7" />,
  redo: <path d="M20 11a8 8 0 1 0-2 8M20 4v7h-7" />,
  bold: <path d="M7 3h6a5 5 0 0 1 0 9H7Zm0 9h7a5 5 0 0 1 0 9H7Z" />,
  italic: <path d="M10 3h10M4 21h10M15 3 9 21" />,
  underline: (
    <>
      <path d="M6 3v8a6 6 0 0 0 12 0V3M4 22h16" />
    </>
  ),
  link: (
    <>
      <path
        d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"
        transform="translate(2 0) scale(.83 1)"
      />
    </>
  ),
  sort: <path d="M7 3v18m-4-4 4 4 4-4M14 5h7M14 10h5M14 15h3" />,
  row: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M12 5v2m-1-1h2" />
    </>
  ),
  column: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M5 12h2m-1-1v2" />
    </>
  ),
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),
  download: <path d="M12 3v13m-5-5 5 5 5-5M4 18v4h16v-4" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  warning: (
    <>
      <path d="m12 3 10 18H2ZM12 9v5M12 17h.01" />
    </>
  ),
  spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />,
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {iconPaths[name] ?? iconPaths.document}
    </svg>
  );
}

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input,textarea,select,[contenteditable="true"]');
}

export type AgentScheduleTone =
  "purple" | "orange" | "teal" | "blue" | "amber" | "pink" | "green" | "gray" | (string & {});
export type AgentScheduleOutcome = "done" | "needs" | "failed";
export type AgentScheduleHistoryEntry = {
  id?: string;
  at: number;
  outcome: AgentScheduleOutcome;
  summary: string;
  cost?: number;
  action?: ReactNode;
};
export type AgentSchedule = {
  id: string;
  name: string;
  project?: string;
  tone?: AgentScheduleTone;
  prompt?: string;
  cadence: string;
  panelCadence?: string;
  runs: number[];
  nextRunNode?: ReactNode;
  duration?: number;
  paused?: boolean;
  running?: boolean;
  cost?: number;
  facts?: { label: string; value: ReactNode }[];
  history?: AgentScheduleHistoryEntry[];
};
export type AgentSchedulesLabels = {
  schedules?: string;
  listHeading?: string;
  aroundNow?: string;
  now?: string;
  runningNow?: string;
  next?: string;
  nothingNext?: string;
  more?: string;
  less?: string;
  activity?: string;
  perTen?: string;
  perTenOne?: string;
  paused?: string;
  pause?: string;
  resume?: string;
  panelPause?: string;
  panelResume?: string;
  runNow?: string;
  skip?: string;
  skipped?: string;
  restore?: string;
  nextRuns?: string;
  lastRuns?: string;
  perRun?: string;
  what?: string;
  details?: string;
  done?: string;
  needs?: string;
  failed?: string;
  noRuns?: string;
  noSchedule?: string;
  noScheduleText?: string;
  empty?: string;
  emptyText?: string;
};

const defaultAgentScheduleLabels: Required<AgentSchedulesLabels> = {
  schedules: "Schedules",
  listHeading: "Schedules",
  aroundNow: "Around now",
  now: "Now",
  runningNow: "Running now",
  next: "Next",
  nothingNext: "Nothing else in the next 8 hours",
  more: "Show all",
  less: "Show less",
  activity: "Agent activity",
  perTen: "actions / 10 min",
  perTenOne: "action / 10 min",
  paused: "Paused",
  pause: "Pause",
  resume: "Resume",
  panelPause: "Pause",
  panelResume: "Resume",
  runNow: "Run now",
  skip: "Skip",
  skipped: "Skipped",
  restore: "Restore",
  nextRuns: "Next runs",
  lastRuns: "Last runs",
  perRun: "per run",
  what: "What it does",
  details: "Details",
  done: "Done",
  needs: "Needs you",
  failed: "Failed",
  noRuns: "No runs yet",
  noSchedule: "Nothing open",
  noScheduleText: "Pick a schedule to see its next runs and how the last ones went.",
  empty: "No schedules yet",
  emptyText: "Ask your agent in the Thread to do something every day, week or month – it shows up here.",
};

const SCHEDULE_MIN = 60000;
const SCHEDULE_HOUR = 60 * SCHEDULE_MIN;
const SCHEDULE_DAY = 24 * SCHEDULE_HOUR;
const scheduleTones: Record<string, string> = {
  purple: "var(--ui-agsc-c-purple)",
  orange: "var(--ui-agsc-c-orange)",
  teal: "var(--ui-agsc-c-teal)",
  blue: "var(--ui-agsc-c-blue)",
  amber: "var(--ui-agsc-c-amber)",
  pink: "var(--ui-agsc-c-pink)",
  green: "var(--ui-agsc-c-green)",
  gray: "var(--ui-agsc-c-gray)",
};
const scheduleTone = (tone?: string) =>
  tone ? (scheduleTones[tone] ?? tone) : (scheduleTones.gray ?? "rgba(0,0,0,.3)");
const scheduleClock = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false });
const scheduleWeekday = new Intl.DateTimeFormat("en", { weekday: "short" });
const scheduleMonthDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const scheduleCurrency = new Intl.NumberFormat("en", { style: "currency", currency: "EUR" });
const scheduleCurrencyCompact = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function scheduleStartOfDay(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function scheduleWhen(at: number, now: number) {
  const diff = Math.round((scheduleStartOfDay(at) - scheduleStartOfDay(now)) / SCHEDULE_DAY);
  const day =
    diff === 0
      ? "Today"
      : diff === 1
        ? "Tomorrow"
        : diff === -1
          ? "Yesterday"
          : Math.abs(diff) < 7
            ? scheduleWeekday.format(at)
            : scheduleMonthDay.format(at);
  return `${day} ${scheduleClock.format(at)}`;
}
function scheduleRelative(at: number, now: number) {
  const minutes = Math.round((at - now) / SCHEDULE_MIN);
  const abs = Math.abs(minutes);
  const unit =
    abs < 1
      ? "now"
      : abs < 60
        ? `${abs} min`
        : abs < 2880
          ? `${Math.round(abs / 60)} h`
          : `${Math.round(abs / 1440)} days`;
  return abs < 1 ? (at > now ? "in a moment" : "just now") : minutes > 0 ? `in ${unit}` : `${unit} ago`;
}
function scheduleSkipKey(id: string, at: number) {
  return `${id}@${at}`;
}
function scheduleNextRun(schedule: AgentSchedule, now: number, skipped: readonly string[]) {
  if (schedule.paused) return undefined;
  return schedule.runs
    .filter((at) => at > now && !skipped.includes(scheduleSkipKey(schedule.id, at)))
    .sort((a, b) => a - b)[0];
}
function scheduleActivityAt(at: number, schedules: readonly AgentSchedule[]) {
  const slot = at / (10 * SCHEDULE_MIN);
  let rate = 1.3 + 0.45 * Math.sin(slot * 0.7) + 0.25 * Math.sin(slot * 1.9 + 1) + 0.12 * Math.sin(slot * 4.3 + 2);
  for (const s of schedules) {
    for (const runAt of s.runs) {
      const span = Math.max(s.duration ?? 0, 25 * SCHEDULE_MIN);
      if (at >= runAt && at <= runAt + span) {
        rate += (3 + Math.min(6, (s.cost ?? 0.3) * 1.6)) * Math.sin((Math.PI * (at - runAt)) / span);
      }
    }
  }
  return Math.max(0.2, rate);
}
function scheduleSpline(points: readonly (readonly [number, number])[]) {
  return points
    .map(([x, y], index) => {
      if (index === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
      const p0 = points[Math.max(0, index - 2)] ?? [x, y];
      const p1 = points[index - 1] ?? [x, y];
      const p2 = points[Math.min(points.length - 1, index + 1)] ?? [x, y];
      const c1x = p1[0] + (x - p0[0]) / 6;
      const c1y = p1[1] + (y - p0[1]) / 6;
      const c2x = x - (p2[0] - p1[0]) / 6;
      const c2y = y - (p2[1] - p1[1]) / 6;
      return `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join("");
}
function mergeScheduleLabels(labels?: AgentSchedulesLabels): Required<AgentSchedulesLabels> {
  const merged = { ...defaultAgentScheduleLabels, ...labels };
  if (!labels?.listHeading && labels?.schedules) merged.listHeading = labels.schedules;
  if (!labels?.panelPause && labels?.pause) merged.panelPause = labels.pause;
  if (!labels?.panelResume && labels?.resume) merged.panelResume = labels.resume;
  return merged;
}

function ScheduleSkel({
  width,
  height = 10,
  radius = 4,
  className,
}: {
  width: number | string;
  height?: number | string;
  radius?: number;
  className?: string;
}) {
  return (
    <span
      className={["ui-agsc__skel", className].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

function ScheduleAroundNow({
  schedules,
  now,
  skipped,
  labels,
  onOpen,
}: {
  schedules: readonly AgentSchedule[];
  now: number;
  skipped: readonly string[];
  labels: Required<AgentSchedulesLabels>;
  onOpen: (id: string) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const headingId = useId();
  const [width, setWidth] = useState(600);

  useLayoutEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    setWidth(Math.max(240, el.clientWidth));
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.max(240, Math.round(entry.contentRect.width)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const start = now - 4 * SCHEDULE_HOUR;
  const end = now + 8 * SCHEDULE_HOUR;
  const xAt = (ms: number) => ((ms - start) / (end - start)) * width;
  const marks = schedules
    .flatMap((s) =>
      s.runs
        .filter(
          (at) => at >= start && at <= end && !skipped.includes(scheduleSkipKey(s.id, at)) && !(s.paused && at > now),
        )
        .map((at) => {
          const span = s.duration ?? 0;
          const state = at > now ? ("next" as const) : now - at < span ? ("running" as const) : ("ran" as const);
          return {
            s,
            t: at,
            state,
            failed: Boolean(
              s.history?.some((entry) => Math.abs(entry.at - at) < SCHEDULE_MIN && entry.outcome === "failed"),
            ),
            progress: state === "running" && span > 0 ? (now - at) / span : state === "ran" ? 1 : 0,
          };
        }),
    )
    .sort((a, b) => a.t - b.t);

  const running = marks.filter((m) => m.state === "running");
  const upcoming = marks.find((m) => m.state === "next");
  const samples: number[] = [];
  const step = width < 520 ? 20 * SCHEDULE_MIN : 10 * SCHEDULE_MIN;
  for (let ms = Math.ceil(start / step) * step; ms < now; ms += step) samples.push(ms);
  const boost = running.reduce(
    (sum, m) => sum + 5 * Math.min(1, (now - m.t) / 1500) * (1 - Math.max(0, (m.progress - 0.85) / 0.15)),
    0,
  );
  const values = [
    ...samples.map((ms) => scheduleActivityAt(ms, schedules)),
    scheduleActivityAt(now, schedules) + boost,
  ];
  const peak = Math.max(8, ...values) * 1.15;
  const yAt = (v: number) => 114 - (v / peak) * 76;
  const grids = [0.25, 0.5, 0.75].map((ratio) => 114 - ratio * 104);
  const points = [...samples, now].map((ms, index) => [xAt(ms), yAt(values[index] ?? 1)] as const);
  const linePath = scheduleSpline(points);
  const firstPt = points[0] ?? [0, 114];
  const headPt = points[points.length - 1] ?? [width, 114];
  const areaPath = `${linePath}L${headPt[0].toFixed(1)},114L${firstPt[0].toFixed(1)},114Z`;
  const currentRate = Math.round(values[values.length - 1] ?? 1);

  const ticks: number[] = [];
  const hourStep = width < 420 ? 4 : 2;
  const tickBase = new Date(start);
  tickBase.setMinutes(0, 0, 0);
  for (let ms = tickBase.getTime() + SCHEDULE_HOUR; ms < end; ms += SCHEDULE_HOUR) {
    if (new Date(ms).getHours() % hourStep === 0) ticks.push(ms);
  }
  const flipChip = headPt[0] + 190 > width && headPt[0] > width / 2;
  const chipWidth = Math.max(80, Math.min(220, flipChip ? headPt[0] - 14 : width - headPt[0] - 14));
  const firstRunning = running[0];

  return (
    <section className="ui-agsc__section" aria-labelledby={headingId}>
      <h2 id={headingId} className="ui-agsc__label">
        {labels.aroundNow}
      </h2>
      <div className="ui-agsc__card ui-agsc__line">
        <div className="ui-agsc__line-top">
          <span>{labels.activity}</span>
          <span className="ui-agsc__num">
            <b>{currentRate}</b> {currentRate === 1 ? labels.perTenOne : labels.perTen}
          </span>
        </div>
        <div ref={chartRef} className="ui-agsc__chart">
          <svg width={width} height={136} viewBox={`0 0 ${width} 136`} aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--ui-agsc-blue)" stopOpacity="0.14" />
                <stop offset="1" stopColor="var(--ui-agsc-blue)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {grids.map((y) => (
              <line key={y} className="ui-agsc__chart-grid" x1="0" x2={width} y1={y} y2={y} />
            ))}
            <line className="ui-agsc__chart-base" x1="0" x2={width} y1={114} y2={114} />
            {marks.map((m) => (
              <g
                key={`${m.s.id}@${m.t}`}
                className="ui-agsc__marker"
                data-state={m.state}
                data-failed={m.failed || undefined}
                style={{ "--ui-agsc-tone": scheduleTone(m.s.tone) } as CSSProperties}
              >
                <line x1={xAt(m.t)} x2={xAt(m.t)} y1={32} y2={114} />
                {m.state === "next" ? (
                  <circle cx={xAt(m.t)} cy={32} r="3" />
                ) : (
                  <rect x={xAt(m.t) - 2.5} y={29.5} width="5" height="5" rx="1" />
                )}
              </g>
            ))}
            <path className="ui-agsc__chart-area" d={areaPath} style={{ fill: `url(#${gradientId})` }} />
            <path className="ui-agsc__chart-line" d={linePath} />
            <circle className="ui-agsc__chart-glow" cx={headPt[0]} cy={headPt[1]} r="9" />
            <circle className="ui-agsc__chart-head" cx={headPt[0]} cy={headPt[1]} r="3.5" />
            {ticks.map((ms) => (
              <text key={ms} className="ui-agsc__tick" x={xAt(ms)} y={132} textAnchor="middle">
                {scheduleClock.format(ms)}
              </text>
            ))}
          </svg>
          {marks.map((m) => (
            <button
              key={`b-${m.s.id}@${m.t}`}
              type="button"
              className="ui-agsc__mark"
              style={{ left: xAt(m.t), top: 32 }}
              aria-label={`${m.s.name}, ${scheduleClock.format(m.t)}, ${
                m.state === "running"
                  ? `${labels.runningNow}, ${Math.round(m.progress * 100)}%`
                  : m.state === "ran"
                    ? m.failed
                      ? labels.failed
                      : labels.done
                    : scheduleRelative(m.t, now)
              }`}
              title={`${m.s.name} · ${scheduleClock.format(m.t)}`}
              onClick={() => onOpen(m.s.id)}
            />
          ))}
          {firstRunning && (
            <span
              className="ui-agsc__chip"
              data-flip={flipChip || undefined}
              style={{ left: headPt[0], top: Math.max(4, headPt[1] - 46), maxWidth: chipWidth }}
              aria-hidden="true"
            >
              <span className="ui-agsc__live" />
              <span className="ui-agsc__chip-name">{firstRunning.s.name}</span>
              <span className="ui-agsc__num ui-agsc__faint">{Math.round(firstRunning.progress * 100)}%</span>
            </span>
          )}
        </div>
        <p className="ui-agsc__line-say" role="status">
          {firstRunning ? (
            <>
              <span className="ui-agsc__live" aria-hidden="true" />
              <b>{labels.runningNow}:</b>
              <span className="ui-agsc__line-name">{running.map((m) => m.s.name).join(", ")}</span>
              <span className="ui-agsc__num ui-agsc__faint">· {Math.round(firstRunning.progress * 100)}%</span>
            </>
          ) : upcoming ? (
            <>
              <b>{labels.next}:</b>
              <span className="ui-agsc__line-name">{upcoming.s.name}</span>
              <span className="ui-agsc__num ui-agsc__faint">
                · {scheduleClock.format(upcoming.t)}, {scheduleRelative(upcoming.t, now)}
              </span>
            </>
          ) : (
            <span className="ui-agsc__faint">{labels.nothingNext}</span>
          )}
        </p>
      </div>
    </section>
  );
}

function SchedulePromptExcerpt({ text, labels }: { text: string; labels: Required<AgentSchedulesLabels> }) {
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);

  return (
    <div className="ui-agsc__prompt-wrap">
      <blockquote ref={ref} className="ui-agsc__prompt" data-open={open || undefined} dir="auto">
        {text}
      </blockquote>
      {(clamped || open) && (
        <button type="button" className="ui-agsc__link" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? labels.less : labels.more}
        </button>
      )}
    </div>
  );
}

export type ScheduleBoardProps = {
  schedules: AgentSchedule[];
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onPause?: (id: string, paused: boolean) => void;
  skipped?: string[];
  labels?: AgentSchedulesLabels;
  loading?: boolean;
  now?: number;
  headerAction?: ReactNode;
  banner?: ReactNode;
  editor?: ReactNode;
  showTimeline?: boolean;
  shortcuts?: boolean;
  notice?: string;
  className?: string;
};

/** Schedule timeline around now and interactive schedule list with pause switches and J/K navigation. */
export function ScheduleBoard({
  schedules: rawSchedules,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  onSelect,
  onPause,
  skipped = [],
  labels: rawLabels,
  loading = false,
  now: nowProp,
  headerAction,
  banner,
  editor,
  showTimeline = true,
  shortcuts = true,
  notice,
  className,
}: ScheduleBoardProps) {
  const schedules = (Array.isArray(rawSchedules) ? rawSchedules : []).filter(Boolean);
  const labels = mergeScheduleLabels(rawLabels);
  const [selected, setSelected] = useControllable<string | null>(
    selectedProp,
    defaultSelected ?? schedules[0]?.id ?? null,
    onSelectedChange,
  );
  const [clock, setClock] = useState(() => Date.now());
  const now = safeNumber(nowProp, clock);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listHeadingId = useId();

  const hasLiveWindow =
    !loading &&
    nowProp === undefined &&
    schedules.some((s) => !s.paused && s.runs.some((at) => at > now - (s.duration ?? 0) && at < now + 30000));

  useEffect(() => {
    if (loading || nowProp !== undefined) return;
    if (!hasLiveWindow) {
      const id = window.setInterval(() => setClock(Date.now()), 20000);
      return () => window.clearInterval(id);
    }
    let frame = 0;
    let last = 0;
    const tick = (ts: number) => {
      if (ts - last > 50) {
        last = ts;
        setClock(Date.now());
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [hasLiveWindow, loading, nowProp]);

  const sorted = [...schedules].sort(
    (a, b) =>
      (scheduleNextRun(a, now, skipped) ?? Number.POSITIVE_INFINITY) -
      (scheduleNextRun(b, now, skipped) ?? Number.POSITIVE_INFINITY),
  );
  const activeCount = schedules.filter((s) => !s.paused).length;

  const choose = (id: string) => {
    setSelected(id);
    onSelect?.(id);
  };

  const moveFocus = (delta: 1 | -1) => {
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>(".ui-agsc__row-main") ?? [])];
    if (!buttons.length) return;
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const target =
      current < 0
        ? (buttons.find((el) => el.dataset.id === selected) ?? buttons[0])
        : buttons[clamp(current + delta, 0, buttons.length - 1)];
    target?.focus();
  };

  const keyHandler = useRef<(event: WindowEventMap["keydown"]) => void>(() => {});
  keyHandler.current = (event: WindowEventMap["keydown"]) => {
    if (!shortcuts || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.isComposing)
      return;
    const active = document.activeElement;
    if (
      (active && active !== document.body && !rootRef.current?.contains(active)) ||
      isEditing(active) ||
      (active as HTMLElement | null)?.closest('[role="menu"],[role="dialog"],[role="alertdialog"],[role="listbox"]')
    )
      return;
    const k = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (k === "j" || k === "k") {
      event.preventDefault();
      moveFocus(k === "j" ? 1 : -1);
    }
  };

  useEffect(() => {
    if (!shortcuts) return;
    const listener = (e: WindowEventMap["keydown"]) => keyHandler.current(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [shortcuts]);

  return (
    <div ref={rootRef} className={["ui-agsc", className].filter(Boolean).join(" ")}>
      <style href="ui-schedule-board-clean" precedence="default">
        {css}
      </style>
      <header className="ui-agsc__head">
        <div className="ui-agsc__head-main">
          <h1 className="ui-agsc__title">{labels.schedules}</h1>
          {!loading && schedules.length > 0 && (
            <span className="ui-agsc__num ui-agsc__faint">
              {activeCount} / {schedules.length}
            </span>
          )}
        </div>
        {headerAction && <div className="ui-agsc__head-actions">{headerAction}</div>}
      </header>
      <div className="ui-agsc__scroll">
        <div className="ui-agsc__page">
          {banner}
          {editor}
          {loading ? (
            <>
              {showTimeline && (
                <section className="ui-agsc__section" aria-label={labels.aroundNow}>
                  <h2 className="ui-agsc__label">{labels.aroundNow}</h2>
                  <div className="ui-agsc__card ui-agsc__line" data-skel="">
                    <div className="ui-agsc__line-top">
                      <span>{labels.activity}</span>
                      <ScheduleSkel width={88} height={8} />
                    </div>
                    <div className="ui-agsc__chart ui-agsc__skel-chart">
                      <ScheduleSkel width="100%" height="100%" radius={6} />
                    </div>
                    <ScheduleSkel width={220} height={10} />
                  </div>
                </section>
              )}
              <section className="ui-agsc__section" aria-label={labels.listHeading}>
                <h2 className="ui-agsc__label">{labels.listHeading}</h2>
                <div className="ui-agsc__rows" data-skel="">
                  {[124, 96, 140, 112, 104].map((w, idx) => (
                    <div key={idx} className="ui-agsc__row">
                      <div className="ui-agsc__row-main">
                        <ScheduleSkel width={8} height={8} radius={2} />
                        <span className="ui-agsc__row-text">
                          <ScheduleSkel width={w} height={10} />
                          <ScheduleSkel width={[132, 176, 148, 160, 120][idx] ?? 140} height={10} />
                        </span>
                        <span className="ui-agsc__row-next">
                          <ScheduleSkel width={112} height={10} />
                        </span>
                      </div>
                      <ScheduleSkel width={30} height={18} radius={9} />
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : schedules.length === 0 ? (
            !editor && (
              <div className="ui-agsc__card ui-agsc__empty">
                <div className="ui-agsc__empty-body">
                  <p className="ui-agsc__empty-title">{labels.empty}</p>
                  {labels.emptyText && <p className="ui-agsc__empty-text">{labels.emptyText}</p>}
                </div>
              </div>
            )
          ) : (
            <>
              {showTimeline && (
                <ScheduleAroundNow schedules={schedules} now={now} skipped={skipped} labels={labels} onOpen={choose} />
              )}
              <section className="ui-agsc__section" aria-labelledby={listHeadingId}>
                <h2 id={listHeadingId} className="ui-agsc__label">
                  {labels.listHeading}
                </h2>
                <ul
                  ref={listRef}
                  className="ui-agsc__rows"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      e.preventDefault();
                      moveFocus(e.key === "ArrowDown" ? 1 : -1);
                    }
                  }}
                >
                  {sorted.map((s) => {
                    const next = scheduleNextRun(s, now, skipped);
                    const latest = s.history?.[0];
                    const outcomeText = latest
                      ? latest.outcome === "done"
                        ? labels.done
                        : latest.outcome === "needs"
                          ? labels.needs
                          : labels.failed
                      : null;
                    const isSelected = s.id === selected;
                    return (
                      <li
                        key={s.id}
                        className="ui-agsc__row"
                        data-selected={isSelected || undefined}
                        data-paused={s.paused || undefined}
                        style={{ "--ui-agsc-tone": scheduleTone(s.tone) } as CSSProperties}
                      >
                        <button
                          type="button"
                          className="ui-agsc__row-main"
                          data-id={s.id}
                          aria-current={isSelected || undefined}
                          aria-label={`${s.name}, ${s.cadence}, ${
                            s.paused ? labels.paused : next ? `next ${scheduleWhen(next, now)}` : ""
                          }${outcomeText ? `, last run ${outcomeText}` : ""}`}
                          onClick={() => choose(s.id)}
                        >
                          <span className="ui-agsc__row-mark" aria-hidden="true" />
                          <span className="ui-agsc__row-text">
                            <span className="ui-agsc__row-name" dir="auto" title={s.name}>
                              {s.name}
                            </span>
                            <span className="ui-agsc__row-cadence" dir="auto" title={s.cadence}>
                              {s.cadence}
                            </span>
                            <span className="ui-agsc__row-nextline ui-agsc__num" aria-hidden="true">
                              {s.paused
                                ? labels.paused
                                : next
                                  ? `${scheduleWhen(next, now)} · ${scheduleRelative(next, now)}`
                                  : ""}
                            </span>
                          </span>
                          <span className="ui-agsc__row-next ui-agsc__num">
                            {s.paused ? (
                              <span className="ui-agsc__faint">{labels.paused}</span>
                            ) : next ? (
                              <>
                                <span>{scheduleWhen(next, now)}</span>
                                <span className="ui-agsc__faint ui-agsc__row-rel">{scheduleRelative(next, now)}</span>
                              </>
                            ) : null}
                          </span>
                          <span className="ui-agsc__row-last">
                            {latest && outcomeText && (
                              <span className="ui-agsc__badge" data-outcome={latest.outcome}>
                                {outcomeText}
                              </span>
                            )}
                          </span>
                          {s.cost != null && (
                            <span className="ui-agsc__row-cost ui-agsc__num" title={scheduleCurrency.format(s.cost)}>
                              {s.cost >= 1000
                                ? scheduleCurrencyCompact.format(s.cost)
                                : scheduleCurrency.format(s.cost)}
                            </span>
                          )}
                        </button>
                        {onPause && (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={!s.paused}
                            aria-label={`${s.name}: ${s.paused ? labels.resume : labels.pause}`}
                            className="ui-agsc__switch"
                            onClick={() => onPause(s.id, !s.paused)}
                          >
                            <span className="ui-agsc__switch-knob" aria-hidden="true" />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
      {notice != null && (
        <p className="ui-agsc__sr" role="status" aria-live="polite">
          {notice}
        </p>
      )}
    </div>
  );
}

export type ScheduleInspectorProps = {
  schedule?: AgentSchedule | null;
  onPause?: (paused: boolean) => void;
  onRunNow?: () => void;
  onSkip?: (at: number) => void;
  skipped?: string[];
  labels?: AgentSchedulesLabels;
  loading?: boolean;
  runDisabled?: boolean;
  actionsDisabled?: boolean;
  extraActions?: ReactNode;
  error?: ReactNode;
  now?: number;
  className?: string;
};

/** Right-rail schedule inspector with Run now, Pause/Resume, prompt excerpt, upcoming triggers, and run history. */
export function ScheduleInspector({
  schedule,
  onPause,
  onRunNow,
  onSkip,
  skipped = [],
  labels: rawLabels,
  loading = false,
  runDisabled,
  actionsDisabled = false,
  extraActions,
  error,
  now = Date.now(),
  className,
}: ScheduleInspectorProps) {
  const labels = mergeScheduleLabels(rawLabels);

  if (loading) {
    return (
      <div className={["ui-agsc__panel", className].filter(Boolean).join(" ")} data-skel="">
        <style href="ui-schedule-board-clean" precedence="default">
          {css}
        </style>
        <div className="ui-agsc__panel-head">
          <ScheduleSkel width={8} height={8} radius={2} className="ui-agsc__skel-mark" />
          <span className="ui-agsc__panel-titles">
            <ScheduleSkel width={136} height={12} />
            <ScheduleSkel width={184} height={8} />
          </span>
        </div>
        <div className="ui-agsc__panel-acts">
          <ScheduleSkel width={92} height={28} radius={6} />
          <ScheduleSkel width={72} height={28} radius={6} />
        </div>
        <section className="ui-agsc__section">
          <h3 className="ui-agsc__label">{labels.what}</h3>
          <ScheduleSkel width="96%" height={10} />
          <ScheduleSkel width="72%" height={10} />
        </section>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className={["ui-agsc__panel", "ui-agsc__panel--empty", className].filter(Boolean).join(" ")}>
        <style href="ui-schedule-board-clean" precedence="default">
          {css}
        </style>
        <div className="ui-agsc__empty-body">
          <p className="ui-agsc__empty-title">{labels.noSchedule}</p>
          <p className="ui-agsc__empty-text">{labels.noScheduleText}</p>
        </div>
      </div>
    );
  }

  const upcoming = schedule.runs
    .filter((at) => at > now)
    .sort((a, b) => a - b)
    .slice(0, 5);
  const history = (schedule.history ?? []).slice(0, 5);
  const isRunning = schedule.running ?? schedule.runs.some((at) => at <= now && now - at < (schedule.duration ?? 0));
  const disableRun = runDisabled !== undefined ? runDisabled : isRunning || actionsDisabled;

  return (
    <div
      className={["ui-agsc__panel", className].filter(Boolean).join(" ")}
      style={{ "--ui-agsc-tone": scheduleTone(schedule.tone) } as CSSProperties}
      aria-label={schedule.name}
    >
      <style href="ui-schedule-board-clean" precedence="default">
        {css}
      </style>
      <div className="ui-agsc__panel-head">
        <span className="ui-agsc__row-mark" aria-hidden="true" data-paused={schedule.paused || undefined} />
        <span className="ui-agsc__panel-titles">
          <h2 className="ui-agsc__panel-title" dir="auto">
            {schedule.name}
          </h2>
          <span className="ui-agsc__panel-sub" dir="auto">
            <Icon name="repeat" size={12} />
            <span>
              {schedule.panelCadence ?? schedule.cadence}
              {schedule.project ? ` · ${schedule.project}` : ""}
            </span>
          </span>
        </span>
      </div>

      <div className="ui-agsc__panel-acts">
        {onRunNow && (
          <button type="button" className="ui-agsc__btn ui-agsc__btn--dark" disabled={disableRun} onClick={onRunNow}>
            <Icon name="play" size={14} />
            <span>{isRunning && runDisabled === undefined ? labels.runningNow : labels.runNow}</span>
          </button>
        )}
        {onPause && (
          <button
            type="button"
            className="ui-agsc__btn"
            disabled={actionsDisabled}
            onClick={() => onPause(!schedule.paused)}
          >
            <Icon name={schedule.paused ? "play" : "pause"} size={14} />
            <span>{schedule.paused ? labels.panelResume : labels.panelPause}</span>
          </button>
        )}
        {extraActions}
        {schedule.cost != null && (
          <span className="ui-agsc__faint ui-agsc__num ui-agsc__panel-cost">
            {scheduleCurrency.format(schedule.cost)} {labels.perRun}
          </span>
        )}
      </div>

      {error != null && (
        <div className="ui-agsc__panel-error" role="alert">
          {error}
        </div>
      )}

      {schedule.facts && schedule.facts.length > 0 && (
        <section className="ui-agsc__section" aria-label={labels.details}>
          <h3 className="ui-agsc__label">{labels.details}</h3>
          <dl className="ui-agsc__card ui-agsc__facts">
            {schedule.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd dir="auto">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {schedule.prompt && (
        <section className="ui-agsc__section" aria-label={labels.what}>
          <h3 className="ui-agsc__label">{labels.what}</h3>
          <SchedulePromptExcerpt text={schedule.prompt} labels={labels} />
        </section>
      )}

      <section className="ui-agsc__section" aria-label={labels.nextRuns}>
        <h3 className="ui-agsc__label">{labels.nextRuns}</h3>
        {schedule.paused ? (
          <p className="ui-agsc__note">{labels.paused}</p>
        ) : schedule.nextRunNode ? (
          <div className="ui-agsc__card ui-agsc__list">
            <div className="ui-agsc__list-single">{schedule.nextRunNode}</div>
          </div>
        ) : upcoming.length > 0 ? (
          <ul className="ui-agsc__card ui-agsc__list">
            {upcoming.map((at) => {
              const isSkipped = skipped.includes(scheduleSkipKey(schedule.id, at));
              return (
                <li key={at} data-skipped={isSkipped || undefined}>
                  <span className="ui-agsc__list-when ui-agsc__num">{scheduleWhen(at, now)}</span>
                  <span className="ui-agsc__faint ui-agsc__num">
                    {isSkipped ? labels.skipped : scheduleRelative(at, now)}
                  </span>
                  {onSkip && (
                    <button
                      type="button"
                      className="ui-agsc__link"
                      aria-label={`${isSkipped ? labels.restore : labels.skip}: ${scheduleWhen(at, now)}`}
                      onClick={() => onSkip(at)}
                    >
                      {isSkipped ? (
                        <>
                          <Icon name="undo" size={12} />
                          {labels.restore}
                        </>
                      ) : (
                        labels.skip
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="ui-agsc__note">{labels.noRuns}</p>
        )}
      </section>

      <section className="ui-agsc__section" aria-label={labels.lastRuns}>
        <h3 className="ui-agsc__label">{labels.lastRuns}</h3>
        {history.length > 0 ? (
          <ul className="ui-agsc__card ui-agsc__history">
            {history.map((entry, idx) => (
              <li key={entry.id ?? `${entry.at}-${idx}`}>
                <span className="ui-agsc__history-text">
                  <span className="ui-agsc__history-summary" dir="auto" title={entry.summary}>
                    {entry.summary}
                  </span>
                  <span className="ui-agsc__faint ui-agsc__num">
                    {scheduleWhen(entry.at, now)}
                    {entry.cost == null ? "" : ` · ${scheduleCurrency.format(entry.cost)}`}
                  </span>
                </span>
                {entry.action}
                <span className="ui-agsc__badge" data-outcome={entry.outcome}>
                  {entry.outcome === "done" ? labels.done : entry.outcome === "needs" ? labels.needs : labels.failed}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ui-agsc__note">{labels.noRuns}</p>
        )}
      </section>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-agsc,
.ui-agsc__panel {
  --ui-agsc-card: #fff;
  --ui-agsc-panel: #fcfcfc;
  --ui-agsc-ink: rgba(0, 0, 0, 0.88);
  --ui-agsc-text: rgba(0, 0, 0, 0.61);
  --ui-agsc-muted: rgba(0, 0, 0, 0.45);
  --ui-agsc-faint: rgba(0, 0, 0, 0.27);
  --ui-agsc-line: rgba(0, 0, 0, 0.06);
  --ui-agsc-chip-bg: rgba(0, 0, 0, 0.04);
  --ui-agsc-hover: rgba(0, 0, 0, 0.025);
  --ui-agsc-focus: rgba(0, 96, 226, 0.7);
  --ui-agsc-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ui-agsc-card-shadow:
    0 0 0 0.5px var(--ui-agsc-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-agsc-blue: #0190fe;
  --ui-agsc-c-purple: #a651f0;
  --ui-agsc-c-orange: #f28a2e;
  --ui-agsc-c-teal: #13b3a0;
  --ui-agsc-c-blue: #0190fe;
  --ui-agsc-c-amber: #e8b000;
  --ui-agsc-c-pink: #ee3e9e;
  --ui-agsc-c-green: #5fc88a;
  --ui-agsc-c-gray: rgba(0, 0, 0, 0.3);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-agsc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-agsc,
.ui-agsc *,
.ui-agsc *::before,
.ui-agsc *::after,
.ui-agsc__panel,
.ui-agsc__panel *,
.ui-agsc__panel *::before,
.ui-agsc__panel *::after {
  box-sizing: border-box;
}
:is(.ui-agsc, .ui-agsc__panel) :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
:is(.ui-agsc, .ui-agsc__panel) :focus-visible {
  outline: 2px solid var(--ui-agsc-focus);
  outline-offset: 2px;
}
.ui-agsc {
  position: relative;
  container: ui-agsc / inline-size;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--ui-agsc-panel);
}
.ui-agsc__num {
  font-variant-numeric: tabular-nums;
}
.ui-agsc__faint {
  color: var(--ui-agsc-faint);
}
.ui-agsc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-agsc__head {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 48px;
  padding: 0 16px 0 20px;
  box-shadow: inset 0 -0.5px 0 var(--ui-agsc-line);
  font-size: 13px;
}
.ui-agsc__head-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.ui-agsc__head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.ui-agsc__title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-agsc-ink);
}
.ui-agsc__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-agsc-line) transparent;
}
.ui-agsc__page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 48px;
}
.ui-agsc__section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}
.ui-agsc__label {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-agsc-muted);
}
.ui-agsc__card {
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-agsc-card);
  box-shadow: var(--ui-agsc-card-shadow);
}
.ui-agsc__empty {
  display: grid;
  place-items: center;
  padding: 40px 16px;
}
.ui-agsc__empty-body {
  display: grid;
  gap: 4px;
  max-width: 360px;
  text-align: center;
}
.ui-agsc__empty-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-agsc-ink);
}
.ui-agsc__empty-text {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-muted);
}
.ui-agsc__line {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
}
.ui-agsc__line-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--ui-agsc-muted);
}
.ui-agsc__line-top b {
  font-weight: 500;
  color: var(--ui-agsc-ink);
}
.ui-agsc__chart {
  position: relative;
  contain: inline-size;
}
.ui-agsc__chart svg {
  display: block;
  overflow: visible;
}
.ui-agsc__chart-grid {
  stroke: var(--ui-agsc-line);
  stroke-width: 1;
  opacity: 0.4;
}
.ui-agsc__chart-base {
  stroke: var(--ui-agsc-line);
  stroke-width: 1;
}
.ui-agsc__chart-line {
  fill: none;
  stroke: var(--ui-agsc-blue);
  stroke-width: 1.75;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.ui-agsc__chart-head {
  fill: var(--ui-agsc-blue);
  stroke: var(--ui-agsc-card);
  stroke-width: 1.5;
}
.ui-agsc__chart-glow {
  fill: var(--ui-agsc-blue);
  opacity: 0.18;
  transform-box: fill-box;
  transform-origin: center;
  animation: ui-agsc-glow 2200ms ease-in-out infinite;
}
.ui-agsc__tick {
  font:
    400 11px "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  fill: var(--ui-agsc-faint);
}
.ui-agsc__marker line {
  stroke: var(--ui-agsc-tone);
  stroke-width: 1;
  opacity: 0.55;
}
.ui-agsc__marker rect {
  fill: var(--ui-agsc-tone);
}
.ui-agsc__marker[data-failed] line {
  stroke: #f04438;
  opacity: 0.8;
}
.ui-agsc__marker[data-failed] rect {
  fill: #f04438;
}
.ui-agsc__marker[data-state="next"] line {
  stroke-dasharray: 2 3;
  opacity: 0.45;
}
.ui-agsc__marker[data-state="next"] circle {
  fill: var(--ui-agsc-card);
  stroke: var(--ui-agsc-tone);
  stroke-width: 1.5;
}
.ui-agsc__marker[data-state="running"] line {
  opacity: 0.9;
}
.ui-agsc__mark {
  position: absolute;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  padding: 0;
  border-radius: 6px;
}
.ui-agsc__mark:hover {
  background: color-mix(in srgb, var(--ui-agsc-ink) 6%, transparent);
}
.ui-agsc__mark:focus-visible {
  outline-offset: -2px;
}
.ui-agsc__chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
  padding: 3px 9px 3px 8px;
  border-radius: 7px;
  background: var(--ui-agsc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-agsc-line),
    0 6px 16px -6px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-agsc-ink);
  white-space: nowrap;
  transform: translateX(10px);
  animation: ui-agsc-chip 320ms var(--ui-agsc-out) both;
  pointer-events: none;
}
.ui-agsc__chip[data-flip] {
  transform: translateX(calc(-100% - 10px));
}
.ui-agsc__chip-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.ui-agsc__line-say {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-text);
  white-space: nowrap;
}
.ui-agsc__line-say b {
  font-weight: 500;
  color: var(--ui-agsc-ink);
}
.ui-agsc__line-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-agsc__live {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ui-agsc-blue);
  animation: ui-agsc-blink 1200ms ease-in-out infinite;
}
.ui-agsc__rows {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  margin: 0 -10px;
  padding: 0;
  list-style: none;
}
.ui-agsc__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 10px;
  border-radius: 10px;
  transition: background-color 140ms ease;
}
.ui-agsc__row:hover {
  background: var(--ui-agsc-hover);
}
.ui-agsc__row[data-selected] {
  background: color-mix(in srgb, var(--ui-agsc-ink) 4%, var(--ui-agsc-card));
}
.ui-agsc__row-main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 42px;
  padding: 0 0 0 12px;
  border-radius: 10px;
  text-align: left;
}
.ui-agsc__row-main:focus-visible {
  outline-offset: -2px;
}
.ui-agsc__row-mark {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--ui-agsc-tone);
}
.ui-agsc__row[data-paused] .ui-agsc__row-mark,
.ui-agsc__row-mark[data-paused] {
  background: none;
  box-shadow: inset 0 0 0 1.5px var(--ui-agsc-tone);
}
.ui-agsc__row-text {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.ui-agsc__row-name {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-agsc-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-agsc__row[data-paused] .ui-agsc__row-name {
  color: var(--ui-agsc-text);
}
.ui-agsc__row-cadence {
  flex: 0 100 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-agsc__row-nextline {
  display: none;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-agsc-ink);
}
.ui-agsc__row-next {
  display: flex;
  flex: none;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;
  width: 184px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-ink);
  white-space: nowrap;
}
.ui-agsc__row-rel {
  font-size: 12px;
}
.ui-agsc__row-last {
  display: flex;
  flex: none;
  justify-content: flex-end;
  width: 78px;
}
.ui-agsc__row-cost {
  flex: none;
  width: 60px;
  white-space: nowrap;
  font-size: 12px;
  color: var(--ui-agsc-muted);
  text-align: right;
}
.ui-agsc__badge {
  flex: none;
  padding: 0 6px;
  border-radius: 4px;
  background: var(--ui-agsc-chip-bg);
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  color: var(--ui-agsc-muted);
  white-space: nowrap;
}
.ui-agsc__badge[data-outcome="needs"] {
  background: rgba(255, 156, 0, 0.14);
  color: #b25e00;
}
.ui-agsc__badge[data-outcome="failed"] {
  background: color-mix(in srgb, #f04438 13%, var(--ui-agsc-card));
  color: #c4320a;
}
.ui-agsc__switch {
  position: relative;
  flex: none;
  width: 30px;
  height: 18px;
  padding: 0;
  border-radius: 9px;
  background: color-mix(in srgb, var(--ui-agsc-ink) 16%, var(--ui-agsc-card));
  transition: background-color 200ms ease;
}
.ui-agsc__switch[aria-checked="true"] {
  background: var(--ui-agsc-blue);
}
.ui-agsc__switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 240ms var(--ui-agsc-out);
}
.ui-agsc__switch[aria-checked="true"] .ui-agsc__switch-knob {
  transform: translateX(12px);
}
.ui-agsc__btn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px 0 8px;
  border-radius: 6px;
  background: var(--ui-agsc-card);
  box-shadow: var(--ui-agsc-card-shadow);
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-agsc-ink);
  text-decoration: none;
  white-space: nowrap;
  transition:
    box-shadow 140ms ease,
    filter 140ms ease,
    opacity 140ms ease,
    transform 140ms ease;
}
.ui-agsc__btn:hover {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.06);
}
.ui-agsc__btn > svg {
  flex: none;
  color: var(--ui-agsc-muted);
}
.ui-agsc__btn--dark {
  background: var(--ui-agsc-ink);
  box-shadow: none;
  color: var(--ui-agsc-card);
}
.ui-agsc__btn--dark > svg {
  color: inherit;
}
.ui-agsc__btn--dark:hover {
  box-shadow: none;
  filter: brightness(1.15);
}
.ui-agsc__btn:disabled {
  opacity: 0.5;
  cursor: default;
  filter: none;
}
.ui-agsc__btn:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-agsc__panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  min-height: 0;
  padding: 16px 18px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  container: ui-agsc-panel / inline-size;
}
.ui-agsc__panel--empty {
  display: grid;
  min-height: 240px;
  place-items: center;
}
.ui-agsc__panel :focus-visible {
  outline-offset: -2px;
}
.ui-agsc__panel-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.ui-agsc__panel-head .ui-agsc__row-mark {
  margin-top: 7px;
}
.ui-agsc__panel-titles {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.ui-agsc__panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  color: var(--ui-agsc-ink);
  overflow-wrap: anywhere;
}
.ui-agsc__panel-sub {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-agsc-muted);
}
.ui-agsc__panel-sub > svg {
  flex: none;
}
.ui-agsc__panel-sub > span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-agsc__panel-acts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: -6px;
}
.ui-agsc__panel-cost {
  margin-left: auto;
  font-size: 12px;
}
.ui-agsc__panel-error {
  margin-top: -6px;
  font-size: 13px;
  line-height: 20px;
  color: #c4320a;
}
.ui-agsc__facts {
  padding: 4px 12px;
}
.ui-agsc__facts > div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  column-gap: 10px;
  align-items: center;
  min-height: 34px;
  font-size: 12px;
}
.ui-agsc__facts > div + div {
  box-shadow: inset 0 0.5px 0 var(--ui-agsc-line);
}
.ui-agsc__facts dt {
  color: var(--ui-agsc-muted);
}
.ui-agsc__facts dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-agsc-ink);
}
.ui-agsc__prompt-wrap {
  display: grid;
  justify-items: start;
  gap: 4px;
}
.ui-agsc__prompt-wrap .ui-agsc__link {
  margin-left: 2px;
}
.ui-agsc__prompt:not([data-open]) {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
.ui-agsc__prompt {
  margin: 0;
  padding-left: 10px;
  box-shadow: inset 2px 0 0 var(--ui-agsc-line);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-text);
  overflow-wrap: anywhere;
  white-space: pre-line;
}
.ui-agsc__list {
  padding: 2px 12px;
}
.ui-agsc__list li,
.ui-agsc__list-single {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  font-size: 13px;
}
.ui-agsc__list li + li {
  box-shadow: inset 0 0.5px 0 var(--ui-agsc-line);
}
.ui-agsc__list-when {
  color: var(--ui-agsc-ink);
}
.ui-agsc__list li[data-skipped] .ui-agsc__list-when {
  color: var(--ui-agsc-faint);
  text-decoration: line-through;
}
.ui-agsc__list li > .ui-agsc__faint {
  flex: 1;
  font-size: 12px;
}
.ui-agsc__link {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--ui-agsc-muted);
  text-decoration: none;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-agsc__link:hover {
  background: var(--ui-agsc-chip-bg);
  color: var(--ui-agsc-ink);
}
.ui-agsc__history {
  padding: 2px 12px;
}
.ui-agsc__history li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}
.ui-agsc__history li + li {
  box-shadow: inset 0 0.5px 0 var(--ui-agsc-line);
}
.ui-agsc__history-text {
  display: grid;
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
}
.ui-agsc__history-summary {
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-agsc-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-agsc__note {
  margin: 0;
  font-size: 13px;
  color: var(--ui-agsc-faint);
}
:is(.ui-agsc, .ui-agsc__panel) [data-skel] {
  pointer-events: none;
}
.ui-agsc__skel {
  display: inline-block;
  background: var(--ui-agsc-chip-bg);
  animation: ui-agsc-blink 1400ms ease-in-out infinite;
}
.ui-agsc__skel-mark {
  margin-top: 7px;
}
.ui-agsc__skel-chart {
  height: 136px;
  padding: 10px 0 22px;
}
@container ui-asc (max-width:899.99px) {
  .ui-agsc__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@container ui-agsc (max-width:639.99px) {
  .ui-agsc__page {
    padding: 16px 16px 40px;
    gap: 24px;
  }
  .ui-agsc__row-cost,
  .ui-agsc__row-last,
  .ui-agsc__row-rel {
    display: none;
  }
  .ui-agsc__row-next {
    width: auto;
  }
}
@container ui-agsc (max-width:439.99px) {
  .ui-agsc__row-main {
    min-height: 56px;
    padding: 8px 0 8px 12px;
  }
  .ui-agsc__row-main > .ui-agsc__row-mark {
    align-self: flex-start;
    margin-top: 6px;
  }
  .ui-agsc__row-text {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .ui-agsc__row-cadence,
  .ui-agsc__row-nextline {
    font-size: 12px;
    line-height: 16px;
  }
  .ui-agsc__row-next {
    display: none;
  }
  .ui-agsc__row-nextline {
    display: block;
  }
}
@keyframes ui-agsc-glow {
  0%,
  100% {
    transform: scale(0.7);
    opacity: 0.25;
  }
  50% {
    transform: scale(1.25);
    opacity: 0.08;
  }
}
@keyframes ui-agsc-chip {
  from {
    opacity: 0;
  }
}
@keyframes ui-agsc-blink {
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-agsc,
  .ui-agsc *,
  .ui-agsc__panel,
  .ui-agsc__panel * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
@media (pointer: coarse) {
  .ui-agsc__btn,
  .ui-agsc__link {
    min-height: 36px;
  }
  .ui-agsc__switch {
    width: 40px;
    height: 24px;
    border-radius: 12px;
  }
  .ui-agsc__switch-knob {
    width: 20px;
    height: 20px;
  }
  .ui-agsc__switch[aria-checked="true"] .ui-agsc__switch-knob {
    transform: translateX(16px);
  }
}
:where(.dark, [data-theme="dark"]) :is(.ui-agsc, .ui-agsc__panel) {
  --ui-agsc-card: #1c1c1e;
  --ui-agsc-panel: #161618;
  --ui-agsc-ink: rgba(255, 255, 255, 0.9);
  --ui-agsc-text: rgba(255, 255, 255, 0.62);
  --ui-agsc-muted: rgba(255, 255, 255, 0.46);
  --ui-agsc-faint: rgba(255, 255, 255, 0.3);
  --ui-agsc-line: rgba(255, 255, 255, 0.08);
  --ui-agsc-chip-bg: rgba(255, 255, 255, 0.06);
  --ui-agsc-hover: rgba(255, 255, 255, 0.03);
  --ui-agsc-focus: rgba(77, 141, 255, 0.8);
  --ui-agsc-card-shadow: 0 0 0 0.5px var(--ui-agsc-line), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --ui-agsc-blue: #4fb0fe;
  --ui-agsc-c-purple: #b98af0;
  --ui-agsc-c-orange: #f2a15c;
  --ui-agsc-c-teal: #4fc3b4;
  --ui-agsc-c-blue: #4fb0fe;
  --ui-agsc-c-amber: #e6c24d;
  --ui-agsc-c-pink: #f06db5;
  --ui-agsc-c-green: #7dcf9f;
  --ui-agsc-c-gray: rgba(255, 255, 255, 0.32);
}
:where(.dark, [data-theme="dark"]) .ui-agsc__badge[data-outcome="needs"] {
  color: #ffb35c;
}
:where(.dark, [data-theme="dark"]) .ui-agsc__badge[data-outcome="failed"] {
  color: #ff8a7a;
}
:where(.dark, [data-theme="dark"]) .ui-agsc__panel-error {
  color: #ff8a7a;
}

`;
