"use client";

import { type ReactNode } from "react";

/*
 * away-summary (Clean) – a self-contained React 19 component.
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
    <div className={["ui-tkc", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-awcay-summary-clean" precedence="default">
        {css}
      </style>
      <span className="ui-tkc__mark" aria-hidden="true">
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
      <span className="ui-tkc__text">
        <strong dir="auto" title={task.title}>
          {task.title}
        </strong>
        <small dir="auto" title={task.status}>
          {task.status}
        </small>
      </span>
      {task.steps && (
        <span className="ui-tkc__count" aria-label={labels.steps(done, total)}>
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
    <div className={["ui-ayc", className].filter(Boolean).join(" ")}>
      <style href="ui-awcay-summary-clean" precedence="default">
        {css}
      </style>
      <section className="ui-ayc__card" aria-label={labels.title}>
        <header>
          <span className="ui-ayc__title">{labels.title}</span>
          <span className="ui-ayc__counts">{labels.counts(done.length, decisions.length)}</span>
        </header>
        <div className="ui-ayc__rows">
          {done.map((task) => (
            <button type="button" className="ui-ayc__row" key={task.id} onClick={() => onOpenTask?.(task.id)}>
              <span className="ui-ayc__check">
                <Icon name="check" size={13} />
              </span>
              <strong dir="auto">{task.title}</strong>
              <small dir="auto">{task.status}</small>
            </button>
          ))}
          {decisions.map((decision) => (
            <button
              type="button"
              className="ui-ayc__row"
              data-question=""
              key={decision.id}
              onClick={() => onOpenDecision?.(decision.id)}
            >
              <span className="ui-ayc__dot" />
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
        <div className="ui-ayc__boundary">
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
.ui-tkc {
  --ui-tkc-card: #fff;
  --ui-tkc-ink: rgba(0, 0, 0, 0.88);
  --ui-tkc-muted: rgba(0, 0, 0, 0.45);
  --ui-tkc-faint: rgba(0, 0, 0, 0.27);
  --ui-tkc-line: rgba(0, 0, 0, 0.06);
  --ui-tkc-fill: rgba(0, 0, 0, 0.025);
  --ui-tkc-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px;
  background: var(--ui-tkc-card);
  border-radius: 12px;
  box-shadow: 0 0 0 0.5px var(--ui-tkc-line);
  font:
    13px/1.45 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tkc-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tkc-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tkc,
.ui-tkc *,
.ui-tkc *::before,
.ui-tkc *::after {
  box-sizing: border-box;
}
.ui-tkc__mark {
  display: flex;
  flex: none;
  color: #e8a20c;
}
.ui-tkc[data-tone="active"] .ui-tkc__mark {
  color: #ff7c3c;
}
.ui-tkc[data-tone="done"] .ui-tkc__mark {
  color: #0095ff;
}
.ui-tkc[data-tone="error"] .ui-tkc__mark {
  color: #e5484d;
}
.ui-tkc__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-tkc__text strong {
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}
.ui-tkc__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tkc-muted);
}
.ui-tkc__text > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-tkc__count {
  font-size: 12px;
  color: var(--ui-tkc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tkc button {
  font: inherit;
  font-size: 12px;
  background: none;
  border: 0;
  border-radius: 6px;
  color: var(--ui-tkc-muted);
  height: 28px;
  padding: 0 6px;
  cursor: pointer;
  flex: none;
}
.ui-tkc button:hover {
  background: var(--ui-tkc-fill);
  color: var(--ui-tkc-ink);
}
.ui-tkc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tkc button:focus-visible {
  outline: 2px solid var(--ui-tkc-focus);
  outline-offset: 2px;
}
.ui-tkc button:active:not(:disabled) {
  transform: scale(0.97);
}
@keyframes ui-tkc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container (max-width:320px) {
  .ui-tkc__text small {
    font-size: 11px;
  }
  .ui-tkc__count {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tkc {
    min-height: 56px;
  }
  .ui-tkc button {
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tkc,
  .ui-tkc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tkc {
  --ui-tkc-card: #1c1c1e;
  --ui-tkc-ink: rgba(255, 255, 255, 0.9);
  --ui-tkc-muted: rgba(255, 255, 255, 0.46);
  --ui-tkc-faint: rgba(255, 255, 255, 0.3);
  --ui-tkc-line: rgba(255, 255, 255, 0.08);
  --ui-tkc-fill: rgba(255, 255, 255, 0.04);
  --ui-tkc-focus: rgba(77, 141, 255, 0.5);
}

.ui-ayc {
  --ui-ayc-card: #fff;
  --ui-ayc-ink: rgba(0, 0, 0, 0.88);
  --ui-ayc-muted: rgba(0, 0, 0, 0.45);
  --ui-ayc-faint: rgba(0, 0, 0, 0.27);
  --ui-ayc-line: rgba(0, 0, 0, 0.06);
  --ui-ayc-fill: rgba(0, 0, 0, 0.025);
  --ui-ayc-focus: rgba(0, 96, 226, 0.35);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ayc-ink);
  width: 100%;
  container: ui-ayc / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-ayc-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ayc,
.ui-ayc *,
.ui-ayc *::before,
.ui-ayc *::after {
  box-sizing: border-box;
}
.ui-ayc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ayc button:focus-visible {
  outline: 2px solid var(--ui-ayc-focus);
  outline-offset: -2px;
}
.ui-ayc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ayc__card {
  border-radius: 14px;
  background: var(--ui-ayc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ayc-line);
  padding: 12px;
}
.ui-ayc__card > header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px 10px;
}
.ui-ayc__title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
}
.ui-ayc__title svg {
  color: var(--ui-ayc-muted);
}
.ui-ayc__counts {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ayc__rows {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ui-ayc__row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 30px;
  text-align: left;
  padding: 5px 3px;
  border-radius: 5px;
}
.ui-ayc__row:hover {
  background: var(--ui-ayc-fill);
}
.ui-ayc__row strong {
  font-size: 12px;
  font-weight: 400;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ayc__row small {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ayc__row > svg {
  color: var(--ui-ayc-faint);
  flex: none;
}
.ui-ayc__check {
  display: flex;
  color: #1a9a52;
}
.ui-ayc__dot {
  width: 5px;
  height: 5px;
  margin: 0 4px;
  flex: none;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-ayc__card > footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}
.ui-ayc__card > footer button {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 24px;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  padding: 3px;
  border-radius: 4px;
}
.ui-ayc__boundary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0;
  color: var(--ui-ayc-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ui-ayc__boundary::before,
.ui-ayc__boundary::after {
  content: "";
  height: 0.5px;
  background: var(--ui-ayc-line);
  flex: 1;
}
.ui-ayc__boundary button {
  font-size: 11px;
  color: var(--ui-ayc-muted);
  padding: 3px;
  border-radius: 4px;
}
@keyframes ui-ayc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container ui-ayc (max-width:420px) {
  .ui-ayc__row {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }
  .ui-ayc__row strong {
    flex: 1;
  }
  .ui-ayc__row small {
    flex-basis: calc(100% - 24px);
    margin-left: 20px;
    order: 4;
  }
  .ui-ayc__card > header {
    flex-wrap: wrap;
  }
  .ui-ayc__counts {
    margin-left: 22px;
  }
}
@media (pointer: coarse) {
  .ui-ayc__row {
    min-height: 36px;
  }
  .ui-ayc__card > footer button,
  .ui-ayc__boundary button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ayc,
  .ui-ayc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ayc {
  --ui-ayc-card: #1c1c1e;
  --ui-ayc-ink: rgba(255, 255, 255, 0.9);
  --ui-ayc-muted: rgba(255, 255, 255, 0.46);
  --ui-ayc-faint: rgba(255, 255, 255, 0.3);
  --ui-ayc-line: rgba(255, 255, 255, 0.08);
  --ui-ayc-fill: rgba(255, 255, 255, 0.04);
  --ui-ayc-focus: rgba(77, 141, 255, 0.5);
}

.ui-ayc__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px 8px;
  border-radius: 12px;
}
.ui-ayc__card > header {
  align-items: baseline;
  gap: 8px;
  padding: 0 6px 2px;
}
.ui-ayc__counts {
  margin-left: 0;
  font-size: 12px;
}
.ui-ayc__rows {
  gap: 0;
}
.ui-ayc__row {
  height: 32px;
  min-height: 32px;
  gap: 10px;
  padding: 0 6px;
}
.ui-ayc__row strong {
  font-size: 13px;
  flex: 0 1 auto;
}
.ui-ayc__row small {
  font-size: 12px;
  margin-left: 0;
  flex: 0 100 auto;
}
.ui-ayc__row[data-question] small {
  margin-left: auto;
  flex: none;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
}
.ui-ayc__card > footer {
  justify-content: flex-start;
  gap: 4px;
  margin-top: 0;
  padding-top: 2px;
}
.ui-ayc__card > footer button {
  font-size: 12px;
  padding: 3px 6px;
  min-height: 28px;
}
.ui-ayc__check {
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid #0095ff;
  border-radius: 50%;
}
.ui-ayc__check > svg {
  display: none;
}
.ui-ayc__check:after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0095ff;
}
.ui-ayc__boundary:before {
  order: 0;
}
.ui-ayc__boundary > span {
  order: 1;
}
.ui-ayc__boundary:after {
  order: 2;
}
.ui-ayc__boundary > button {
  order: 3;
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (pointer: coarse) {
  .ui-ayc__row {
    height: auto;
    min-height: 36px;
  }
  .ui-ayc__card > footer button {
    min-height: 36px;
  }
}

`;
