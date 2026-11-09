"use client";

import { type ReactNode } from "react";

/*
 * away-summary (Classic) – a self-contained React 19 component.
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
  pin: <path d="m9 3 10 10-4 1-3 4-3-3-6 6M8 4l12 12M8 4l-2 7 7 7" />,
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {iconPaths[name] ?? iconPaths.document}
    </svg>
  );
}

function defaultThreadFormatTime(at: number) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(at);
}

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export type ThreadTask = {
  id: string;
  title: string;
  status: string;
  steps?: { done: number; total: number };
  done?: boolean;
  tone?: "active" | "waiting" | "done" | "error";
};
const defaultThreadTaskCardLabels = {
  open: "Open",
  steps: (done: number, total: number) => `${done} of ${total} steps`,
  openTask: (title: string, status: string, steps: string) => `Open ${title} – ${status}${steps ? `, ${steps}` : ""}`,
};
export type ThreadTaskCardLabels = typeof defaultThreadTaskCardLabels;
export type ThreadTaskCardProps = {
  task: ThreadTask;
  onOpen?: (id: string) => void;
  labels?: Partial<ThreadTaskCardLabels>;
  className?: string;
};

/** A compact task mention; opening it keeps the conversation in place. */
export function ThreadTaskCard({ task, onOpen, labels: labelsProp, className }: ThreadTaskCardProps) {
  const labels = { ...defaultThreadTaskCardLabels, ...labelsProp };
  const tone = task.done
    ? "done"
    : ["active", "waiting", "done", "error"].includes(task.tone ?? "")
      ? task.tone
      : "waiting";
  const total = Math.max(0, safeNumber(task.steps?.total, 0));
  const done = clamp(safeNumber(task.steps?.done, 0), 0, total);
  return (
    <div className={["ui-tk", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-away-summary" precedence="default">
        {css}
      </style>
      <span className="ui-tk__mark" aria-hidden="true">
        {tone === "done" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
            <circle cx="8" cy="8" r="4.5" fill="currentColor" />
          </svg>
        ) : tone === "error" ? (
          <Icon name="warning" size={14} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
            <path d="M8 3v5l-2.5 4.3A5 5 0 0 0 8 3Z" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="ui-tk__text">
        <strong dir="auto" title={task.title}>
          {task.title}
        </strong>
        <small dir="auto" title={task.status}>
          {task.status}
        </small>
      </span>
      {task.steps && (
        <span className="ui-tk__count" aria-label={labels.steps(done, total)}>
          {done}/{total}
        </span>
      )}
      <button
        type="button"
        disabled={!onOpen}
        onClick={() => onOpen?.(task.id)}
        aria-label={labels.openTask(task.title, task.status, task.steps ? labels.steps(done, total) : "")}
      >
        {labels.open}
      </button>
    </div>
  );
}

const defaultAwaySummaryLabels = {
  title: "While you were away",
  counts: (done: number, needs: number) => `${done} done · ${needs} need you`,
  needsYou: "Needs you",
  openTasks: "Open Tasks",
  openInbox: "Open Inbox",
  newSince: (time: string) => `New since ${time}`,
  newActivity: "New activity",
  markRead: "Mark as read",
};
export type AwaySummaryLabels = typeof defaultAwaySummaryLabels;
export type AwaySummaryProps = {
  labels?: Partial<AwaySummaryLabels>;
  formatTime?: (timestamp: number) => string;
  tasks?: ThreadTask[];
  decisions?: { id: string; question: string }[];
  since?: number;
  onOpenTask?: (id: string) => void;
  onOpenDecision?: (id: string) => void;
  onOpenTasks?: () => void;
  onOpenInbox?: () => void;
  onMarkRead?: () => void;
  className?: string;
};

/** A return-to-thread summary, followed by the unread boundary and a mark-as-read action. */
export function AwaySummary({
  labels: labelsProp,
  formatTime = defaultThreadFormatTime,
  tasks = [],
  decisions = [],
  since,
  onOpenTask,
  onOpenDecision,
  onOpenTasks,
  onOpenInbox,
  onMarkRead,
  className,
}: AwaySummaryProps) {
  const labels = { ...defaultAwaySummaryLabels, ...labelsProp };
  const done = tasks.filter((task) => task.done);
  return (
    <div className={["ui-ay", className].filter(Boolean).join(" ")}>
      <style href="ui-away-summary" precedence="default">
        {css}
      </style>
      <section className="ui-ay__card" aria-label={labels.title}>
        <header>
          <span className="ui-ay__title">{labels.title}</span>
          <span className="ui-ay__counts">{labels.counts(done.length, decisions.length)}</span>
        </header>
        <div className="ui-ay__rows">
          {done.map((task) => (
            <button type="button" className="ui-ay__row" key={task.id} onClick={() => onOpenTask?.(task.id)}>
              <span className="ui-ay__check">
                <Icon name="check" size={13} />
              </span>
              <strong dir="auto">{task.title}</strong>
              <small dir="auto">{task.status}</small>
            </button>
          ))}
          {decisions.map((decision) => (
            <button
              type="button"
              className="ui-ay__row"
              data-question=""
              key={decision.id}
              onClick={() => onOpenDecision?.(decision.id)}
            >
              <span className="ui-ay__dot" />
              <strong dir="auto">{decision.question}</strong>
              <small>{labels.needsYou}</small>
            </button>
          ))}
        </div>
        <footer>
          {onOpenTasks && (
            <button type="button" onClick={onOpenTasks}>
              {labels.openTasks}
              <Icon name="arrow" size={12} />
            </button>
          )}
          {onOpenInbox && (
            <button type="button" onClick={onOpenInbox}>
              {labels.openInbox}
              <Icon name="arrow" size={12} />
            </button>
          )}
        </footer>
      </section>
      {(since != null || onMarkRead) && (
        <div className="ui-ay__boundary">
          <span>
            {since != null && Number.isFinite(since) ? labels.newSince(formatTime(since)) : labels.newActivity}
          </span>
          {onMarkRead && (
            <button type="button" onClick={onMarkRead}>
              <Icon name="check" size={11} />
              {labels.markRead}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-tk {
  --ui-tk-card: #fff;
  --ui-tk-ink: rgba(0, 0, 0, 0.88);
  --ui-tk-muted: rgba(0, 0, 0, 0.45);
  --ui-tk-faint: rgba(0, 0, 0, 0.27);
  --ui-tk-line: rgba(0, 0, 0, 0.06);
  --ui-tk-fill: rgba(0, 0, 0, 0.025);
  --ui-tk-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px;
  background: var(--ui-tk-card);
  border-radius: 12px;
  box-shadow: 0 0 0 0.5px var(--ui-tk-line);
  font:
    13px/1.45 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tk-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tk-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tk,
.ui-tk *,
.ui-tk *::before,
.ui-tk *::after {
  box-sizing: border-box;
}
.ui-tk__mark {
  display: flex;
  flex: none;
  color: #e8a20c;
}
.ui-tk[data-tone="active"] .ui-tk__mark {
  color: #ff7c3c;
}
.ui-tk[data-tone="done"] .ui-tk__mark {
  color: #0095ff;
}
.ui-tk[data-tone="error"] .ui-tk__mark {
  color: #e5484d;
}
.ui-tk__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-tk__text strong {
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}
.ui-tk__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tk-muted);
}
.ui-tk__text > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-tk__count {
  font-size: 12px;
  color: var(--ui-tk-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tk button {
  font: inherit;
  font-size: 12px;
  background: none;
  border: 0;
  border-radius: 6px;
  color: var(--ui-tk-muted);
  height: 28px;
  padding: 0 6px;
  cursor: pointer;
  flex: none;
}
.ui-tk button:hover {
  background: var(--ui-tk-fill);
  color: var(--ui-tk-ink);
}
.ui-tk button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tk button:focus-visible {
  outline: 2px solid var(--ui-tk-focus);
  outline-offset: 2px;
}
.ui-tk button:active:not(:disabled) {
  transform: scale(0.97);
}
@keyframes ui-tk-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container (max-width:320px) {
  .ui-tk__text small {
    font-size: 11px;
  }
  .ui-tk__count {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tk {
    min-height: 56px;
  }
  .ui-tk button {
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tk,
  .ui-tk * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tk {
  --ui-tk-card: #1c1c1e;
  --ui-tk-ink: rgba(255, 255, 255, 0.9);
  --ui-tk-muted: rgba(255, 255, 255, 0.46);
  --ui-tk-faint: rgba(255, 255, 255, 0.3);
  --ui-tk-line: rgba(255, 255, 255, 0.08);
  --ui-tk-fill: rgba(255, 255, 255, 0.04);
  --ui-tk-focus: rgba(77, 141, 255, 0.5);
}

.ui-ay {
  --ui-ay-card: #fff;
  --ui-ay-ink: rgba(0, 0, 0, 0.88);
  --ui-ay-muted: rgba(0, 0, 0, 0.45);
  --ui-ay-faint: rgba(0, 0, 0, 0.27);
  --ui-ay-line: rgba(0, 0, 0, 0.06);
  --ui-ay-fill: rgba(0, 0, 0, 0.025);
  --ui-ay-focus: rgba(0, 96, 226, 0.35);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ay-ink);
  width: 100%;
  container: ui-ay / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-ay-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ay,
.ui-ay *,
.ui-ay *::before,
.ui-ay *::after {
  box-sizing: border-box;
}
.ui-ay button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ay button:focus-visible {
  outline: 2px solid var(--ui-ay-focus);
  outline-offset: -2px;
}
.ui-ay button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ay__card {
  border-radius: 14px;
  background: var(--ui-ay-card);
  box-shadow: 0 0 0 0.5px var(--ui-ay-line);
  padding: 12px;
}
.ui-ay__card > header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px 10px;
}
.ui-ay__title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
}
.ui-ay__title svg {
  color: var(--ui-ay-muted);
}
.ui-ay__counts {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ay-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ay__rows {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ui-ay__row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 30px;
  text-align: left;
  padding: 5px 3px;
  border-radius: 5px;
}
.ui-ay__row:hover {
  background: var(--ui-ay-fill);
}
.ui-ay__row strong {
  font-size: 12px;
  font-weight: 400;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ay__row small {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ay-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ay__row > svg {
  color: var(--ui-ay-faint);
  flex: none;
}
.ui-ay__check {
  display: flex;
  color: #1a9a52;
}
.ui-ay__dot {
  width: 5px;
  height: 5px;
  margin: 0 4px;
  flex: none;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-ay__card > footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}
.ui-ay__card > footer button {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 24px;
  font-size: 11px;
  color: var(--ui-ay-muted);
  padding: 3px;
  border-radius: 4px;
}
.ui-ay__boundary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0;
  color: var(--ui-ay-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ui-ay__boundary::before,
.ui-ay__boundary::after {
  content: "";
  height: 0.5px;
  background: var(--ui-ay-line);
  flex: 1;
}
.ui-ay__boundary button {
  font-size: 11px;
  color: var(--ui-ay-muted);
  padding: 3px;
  border-radius: 4px;
}
@keyframes ui-ay-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container ui-ay (max-width:420px) {
  .ui-ay__row {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }
  .ui-ay__row strong {
    flex: 1;
  }
  .ui-ay__row small {
    flex-basis: calc(100% - 24px);
    margin-left: 20px;
    order: 4;
  }
  .ui-ay__card > header {
    flex-wrap: wrap;
  }
  .ui-ay__counts {
    margin-left: 22px;
  }
}
@media (pointer: coarse) {
  .ui-ay__row {
    min-height: 36px;
  }
  .ui-ay__card > footer button,
  .ui-ay__boundary button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ay,
  .ui-ay * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ay {
  --ui-ay-card: #1c1c1e;
  --ui-ay-ink: rgba(255, 255, 255, 0.9);
  --ui-ay-muted: rgba(255, 255, 255, 0.46);
  --ui-ay-faint: rgba(255, 255, 255, 0.3);
  --ui-ay-line: rgba(255, 255, 255, 0.08);
  --ui-ay-fill: rgba(255, 255, 255, 0.04);
  --ui-ay-focus: rgba(77, 141, 255, 0.5);
}

.ui-ay__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px 8px;
  border-radius: 12px;
}
.ui-ay__card > header {
  align-items: baseline;
  gap: 8px;
  padding: 0 6px 2px;
}
.ui-ay__counts {
  margin-left: 0;
  font-size: 12px;
}
.ui-ay__rows {
  gap: 0;
}
.ui-ay__row {
  height: 32px;
  min-height: 32px;
  gap: 10px;
  padding: 0 6px;
}
.ui-ay__row strong {
  font-size: 13px;
  flex: 0 1 auto;
}
.ui-ay__row small {
  font-size: 12px;
  margin-left: 0;
  flex: 0 100 auto;
}
.ui-ay__row[data-question] small {
  margin-left: auto;
  flex: none;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
}
.ui-ay__card > footer {
  justify-content: flex-start;
  gap: 4px;
  margin-top: 0;
  padding-top: 2px;
}
.ui-ay__card > footer button {
  font-size: 12px;
  padding: 3px 6px;
  min-height: 28px;
}
.ui-ay__check {
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid #0095ff;
  border-radius: 50%;
}
.ui-ay__check > svg {
  display: none;
}
.ui-ay__check:after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0095ff;
}
.ui-ay__boundary:before {
  order: 0;
}
.ui-ay__boundary > span {
  order: 1;
}
.ui-ay__boundary:after {
  order: 2;
}
.ui-ay__boundary > button {
  order: 3;
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (pointer: coarse) {
  .ui-ay__row {
    height: auto;
    min-height: 36px;
  }
  .ui-ay__card > footer button {
    min-height: 36px;
  }
}
.ui-tk {
  --ui-tk-ink: #171717;
  --ui-tk-muted: #737373;
  --ui-tk-faint: #b5b5b5;
  --ui-tk-line: #e5e5e5;
  --ui-tk-fill: #f5f5f5;
  --ui-tk-focus: #2f6bff;
  min-height: 56px;
  border: 1px solid var(--ui-tk-line);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 14px;
}
.ui-tk button {
  height: 32px;
}
.ui-ay {
  --ui-ay-ink: #171717;
  --ui-ay-muted: #737373;
  --ui-ay-faint: #b5b5b5;
  --ui-ay-line: #e5e5e5;
  --ui-ay-fill: #f5f5f5;
  --ui-ay-focus: #2f6bff;
}
.ui-ay__card {
  border: 1px solid var(--ui-ay-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
:where(.dark, [data-theme="dark"]) .ui-tk {
  --ui-tk-card: #232326;
  --ui-tk-ink: #ededed;
  --ui-tk-muted: #8f8f8f;
  --ui-tk-line: rgba(255, 255, 255, 0.1);
  --ui-tk-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-ay {
  --ui-ay-card: #232326;
  --ui-ay-ink: #ededed;
  --ui-ay-muted: #8f8f8f;
  --ui-ay-line: rgba(255, 255, 255, 0.1);
  --ui-ay-fill: #2a2a2d;
}

`;
