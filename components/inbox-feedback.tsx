"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * inbox-feedback (Classic) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export type InboxConfirmationProps = { answer?: string; message?: string; className?: string };
/** The sent state: a short check draw followed by the answer that was sent. */
export function InboxConfirmation({
  answer,
  message = "Sent – it'll take it from here",
  className,
}: InboxConfirmationProps) {
  return (
    <div className={["ui-ibf", "ui-ibf__sent", className].filter(Boolean).join(" ")}>
      <style href="ui-inbox-feedback" precedence="default">
        {css}
      </style>
      <svg className="ui-ibf__mark" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="ui-ibf__ring" cx="12" cy="12" r="12" />
        <path className="ui-ibf__tick" pathLength="1" d="m6.5 12 3.5 3.5 7.5-7.5" />
      </svg>
      <span className="ui-ibf__text">
        <strong>{message}</strong>
        {answer && (
          <span dir="auto" title={answer}>
            {answer}
          </span>
        )}
      </span>
    </div>
  );
}
export type InboxEmptyStateProps = {
  running?: number;
  variant?: "open" | "done";
  title?: string;
  description?: string;
  tasksLabel?: string;
  onOpenTasks?: () => void;
  focusRequest?: number;
  className?: string;
};
/** The end of the queue, with a keyboard focus target and a route back to Tasks. */
export function InboxEmptyState({
  running = 3,
  variant = "open",
  title,
  description,
  tasksLabel = "View tasks",
  onOpenTasks,
  focusRequest,
  className,
}: InboxEmptyStateProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusRequest) {
      const frame = requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }
  }, [focusRequest]);
  return (
    <div className={["ui-ibf", "ui-ibf__empty", className].filter(Boolean).join(" ")}>
      <style href="ui-inbox-feedback" precedence="default">
        {css}
      </style>
      <svg className="ui-ibf__empty-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="m10 18 5 5 11-11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 ref={heading} tabIndex={-1}>
        {title ?? (variant === "done" ? "No answers yet" : "You're all caught up")}
      </h2>
      <p>
        {description ??
          (variant === "done"
            ? "Your answers will appear here."
            : `${Math.max(0, safeNumber(running, 0))} ${running === 1 ? "task is" : "tasks are"} still running.`)}
      </p>
      {variant !== "done" && onOpenTasks && (
        <button type="button" onClick={onOpenTasks}>
          {tasksLabel}
          <Icon name="arrow" size={13} />
        </button>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-ibf {
  --ui-ibf-card: #fff;
  --ui-ibf-ink: rgba(0, 0, 0, 0.88);
  --ui-ibf-muted: rgba(0, 0, 0, 0.45);
  --ui-ibf-fill: rgba(0, 0, 0, 0.04);
  --ui-ibf-line: rgba(0, 0, 0, 0.06);
  --ui-ibf-focus: rgba(0, 96, 226, 0.7);
  --ui-ibf-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ibf-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibf,
.ui-ibf *,
.ui-ibf *::before,
.ui-ibf *::after {
  box-sizing: border-box;
}
.ui-ibf__sent {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ui-ibf-fade 240ms both;
}
.ui-ibf__mark {
  width: 24px;
  height: 24px;
  flex: none;
  overflow: visible;
}
.ui-ibf__ring {
  fill: var(--ui-ibf-fill);
  stroke: none;
  transform-origin: center;
  animation: ui-ibf-pop 420ms var(--ui-ibf-ease) both;
}
.ui-ibf__tick {
  fill: none;
  stroke: var(--ui-ibf-ink);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ui-ibf-draw 420ms var(--ui-ibf-ease) 160ms forwards;
}
.ui-ibf__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 2px;
}
.ui-ibf__text strong {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  animation: ui-ibf-rise 360ms var(--ui-ibf-ease) 120ms both;
}
.ui-ibf__text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-ibf-muted);
  animation: ui-ibf-rise 360ms var(--ui-ibf-ease) 200ms both;
}
.ui-ibf__empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  text-align: center;
  padding: 40px 24px 80px;
  animation: ui-ibf-rise 480ms var(--ui-ibf-ease) both;
}
.ui-ibf__empty-mark {
  width: 36px;
  height: 36px;
  color: var(--ui-ibf-muted);
}
.ui-ibf__empty h2 {
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  outline: none;
}
.ui-ibf__empty p {
  margin: 2px 0 20px;
  color: var(--ui-ibf-muted);
  font-size: 13px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
}
.ui-ibf__empty button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-ibf-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibf-line);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-ibf-ink);
  cursor: pointer;
}
.ui-ibf__empty button:active {
  transform: scale(0.97);
}
.ui-ibf__empty button:focus-visible {
  outline: 2px solid var(--ui-ibf-focus);
  outline-offset: 2px;
}
@keyframes ui-ibf-fade {
  from {
    opacity: 0;
  }
}
@keyframes ui-ibf-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
}
@keyframes ui-ibf-draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes ui-ibf-rise {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}
@media (pointer: coarse) {
  .ui-ibf__empty button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibf,
  .ui-ibf * {
    animation: none !important;
    transition: none !important;
  }
  .ui-ibf__tick {
    stroke-dashoffset: 0;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibf {
  --ui-ibf-card: #1c1c1e;
  --ui-ibf-ink: rgba(255, 255, 255, 0.9);
  --ui-ibf-muted: rgba(255, 255, 255, 0.46);
  --ui-ibf-fill: rgba(255, 255, 255, 0.06);
  --ui-ibf-line: rgba(255, 255, 255, 0.08);
  --ui-ibf-focus: rgba(77, 141, 255, 0.8);
}
.ui-ibf {
  --ui-ibf-ink: #171717;
  --ui-ibf-muted: #737373;
  --ui-ibf-fill: #f5f5f5;
  --ui-ibf-line: #e5e5e5;
  --ui-ibf-focus: #2f6bff;
}
.ui-ibf__empty button {
  height: 32px;
  border-radius: 8px;
  box-shadow:
    0 0 0 1px var(--ui-ibf-line),
    0 1px 2px rgba(0, 0, 0, 0.06);
}
:where(.dark, [data-theme="dark"]) .ui-ibf {
  --ui-ibf-card: #232326;
  --ui-ibf-ink: #ededed;
  --ui-ibf-text: #c4c4c4;
  --ui-ibf-muted: #8f8f8f;
  --ui-ibf-faint: #6b6b70;
  --ui-ibf-line: rgba(255, 255, 255, 0.1);
  --ui-ibf-fill: #2a2a2d;
  --ui-ibf-focus: #6b95ff;
}

`;
