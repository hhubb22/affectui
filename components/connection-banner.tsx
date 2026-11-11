"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * connection-banner (Classic) – a self-contained React 19 component.
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

export type ThreadConnection = "online" | "offline" | "reconnecting";
const defaultConnectionBannerLabels = {
  backOnline: "Back online",
  lost: "Connection lost – reconnecting…",
  reconnecting: "Reconnecting…",
  retry: "Retry now",
  retryIn: (seconds: number) => `Retrying in ${seconds}s`,
};
export type ConnectionBannerLabels = typeof defaultConnectionBannerLabels;
export type ConnectionBannerProps = {
  connection?: ThreadConnection;
  defaultConnection?: ThreadConnection;
  onConnectionChange?: (connection: ThreadConnection) => void;
  onReconnect?: () => void | Promise<void>;
  retryIn?: number;
  backOnline?: boolean;
  /** Disable the built-in retry clock when a parent supplies its own connection manager. */
  managed?: boolean;
  labels?: Partial<ConnectionBannerLabels>;
  className?: string;
};

function useThreadConnection({
  connection,
  defaultConnection,
  onConnectionChange,
  onReconnect,
  managed = false,
}: Omit<ConnectionBannerProps, "className">) {
  const [internal, setInternal] = useState<ThreadConnection>(defaultConnection ?? "online");
  const [retrying, setRetrying] = useState(false),
    [attempt, setAttempt] = useState(0),
    [retryIn, setRetryIn] = useState(5),
    [backOnline, setBackOnline] = useState(false);
  const forced = useRef(defaultConnection === "offline"),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    mounted = useRef(true);
  const callbacks = useRef({ connection, onReconnect, onConnectionChange, managed });
  callbacks.current = { connection, onReconnect, onConnectionChange, managed };
  const base = managed
    ? (connection ?? "online")
    : connection && ["online", "offline", "reconnecting"].includes(connection)
      ? connection
      : internal;
  const status: ThreadConnection = !managed && retrying && base !== "online" ? "reconnecting" : base;
  const current = useRef(status);
  current.current = status;
  const setConnection = (next: ThreadConnection) => {
    if (callbacks.current.connection === undefined) setInternal(next);
    callbacks.current.onConnectionChange?.(next);
  };
  const reconnect = (manual = true) => {
    if (current.current === "reconnecting") return;
    if (managed) {
      onReconnect?.();
      return;
    }
    setRetrying(true);
    Promise.resolve()
      .then(() => callbacks.current.onReconnect?.())
      .then(
        () => true,
        () => false,
      )
      .then((succeeded) => {
        if (!mounted.current || callbacks.current.managed) return;
        timer.current = setTimeout(() => {
          if (!mounted.current || callbacks.current.managed) return;
          if (manual && succeeded) forced.current = false;
          if (succeeded && callbacks.current.connection === undefined && navigator.onLine && !forced.current)
            setConnection("online");
          setRetrying(false);
          setAttempt((value) => value + 1);
        }, 1100);
      });
  };
  const reconnectRef = useRef(reconnect);
  reconnectRef.current = reconnect;
  useEffect(() => {
    mounted.current = true;
    if (managed) {
      setRetrying(false);
      return () => {
        mounted.current = false;
      };
    }
    const online = () => {
      forced.current = false;
      if (callbacks.current.connection === undefined) setConnection("online");
    };
    const offline = () => {
      if (callbacks.current.connection === undefined) setConnection("offline");
    };
    if (!navigator.onLine) offline();
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [managed]);
  useEffect(() => {
    if (managed || status !== "offline") return;
    const seconds = [5, 10, 20, 30][Math.min(attempt, 3)]!;
    const deadline = Date.now() + seconds * 1000;
    setRetryIn(seconds);
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRetryIn(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        reconnectRef.current(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [managed, status, attempt]);
  const previous = useRef(base);
  useEffect(() => {
    const was = previous.current;
    previous.current = base;
    if (managed || base !== "online" || was === "online") return;
    setAttempt(0);
    setBackOnline(true);
    const timeout = setTimeout(() => setBackOnline(false), 1800);
    return () => clearTimeout(timeout);
  }, [managed, base]);
  return { status, retryIn, backOnline, reconnect: () => reconnect(true) };
}

/** Connection feedback with an optional browser-driven retry clock. */
export function ConnectionBanner({
  connection,
  defaultConnection,
  onConnectionChange,
  onReconnect,
  retryIn: suppliedRetry,
  backOnline: suppliedBack,
  managed = false,
  labels: labelsProp,
  className,
}: ConnectionBannerProps) {
  const labels = { ...defaultConnectionBannerLabels, ...labelsProp };
  const state = useThreadConnection({ managed, connection, defaultConnection, onConnectionChange, onReconnect });
  const status = managed ? (connection ?? "online") : state.status;
  const back = suppliedBack ?? (!managed && state.backOnline);
  if (status === "online" && !back) return null;
  return (
    <div
      className={["ui-cn", className].filter(Boolean).join(" ")}
      data-status={status}
      role="status"
      aria-live="polite"
    >
      <style href="ui-connection-banner" precedence="default">
        {css}
      </style>
      <div className="ui-cn__pill">
        <span className="ui-cn__mark">
          {status === "online" ? (
            <Icon name="check" size={14} />
          ) : (
            <span className="ui-cn__spinner" aria-hidden="true" />
          )}
        </span>
        <span className="ui-cn__text">{status === "online" ? labels.backOnline : labels.lost}</span>
        {status !== "online" && (
          <>
            <span className="ui-cn__timer">
              {status === "reconnecting"
                ? labels.reconnecting
                : !managed || suppliedRetry !== undefined
                  ? labels.retryIn(suppliedRetry ?? state.retryIn)
                  : null}
            </span>
            <button type="button" disabled={status === "reconnecting"} onClick={state.reconnect}>
              {labels.retry}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-cn {
  --ui-cn-card: #fff;
  --ui-cn-text: rgba(0, 0, 0, 0.61);
  --ui-cn-muted: rgba(0, 0, 0, 0.45);
  --ui-cn-line: rgba(0, 0, 0, 0.06);
  --ui-cn-fill: rgba(0, 0, 0, 0.04);
  --ui-cn-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  justify-content: center;
  width: 100%;
  color: var(--ui-cn-text);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-cn__pill {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  max-width: 100%;
  padding: 0 4px 0 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ui-cn-text) 6%, var(--ui-cn-card));
  white-space: nowrap;
  animation: ui-cn-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-cn__pill:not(:has(button)) {
  padding-right: 12px;
}
.ui-cn__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-cn,
.ui-cn *,
.ui-cn *::before,
.ui-cn *::after {
  box-sizing: border-box;
}
.ui-cn__mark {
  display: flex;
  color: #e8a20c;
}
.ui-cn[data-status="online"] .ui-cn__mark {
  color: #1a9a52;
}
.ui-cn__timer {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--ui-cn-muted);
  font-size: 11px;
}
.ui-cn button {
  height: 24px;
  flex: none;
  background: none;
  border: 0;
  border-radius: 999px;
  padding: 0 8px;
  font: inherit;
  color: var(--ui-cn-text);
  cursor: pointer;
}
.ui-cn button:hover {
  background: var(--ui-cn-fill);
}
.ui-cn button:disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-cn button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cn button:focus-visible {
  outline: 2px solid var(--ui-cn-focus);
  outline-offset: 2px;
}
@keyframes ui-cn-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
@container (max-width:560px) {
  .ui-cn__pill {
    max-width: calc(100% - 104px);
  }
  .ui-cn__timer {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-cn button {
    height: 36px;
  }
  .ui-cn__pill {
    height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cn,
  .ui-cn * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cn {
  --ui-cn-card: #1c1c1e;
  --ui-cn-text: rgba(255, 255, 255, 0.62);
  --ui-cn-muted: rgba(255, 255, 255, 0.46);
  --ui-cn-line: rgba(255, 255, 255, 0.08);
  --ui-cn-fill: rgba(255, 255, 255, 0.08);
  --ui-cn-focus: rgba(77, 141, 255, 0.5);
}

.ui-cn__spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--ui-cn-line);
  border-top-color: var(--ui-cn-muted);
  animation: ui-cn-spin 900ms linear infinite;
}
@keyframes ui-cn-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cn__spinner {
    animation: none;
  }
}
.ui-cn {
  --ui-cn-text: #404040;
  --ui-cn-muted: #737373;
  --ui-cn-line: #e5e5e5;
  --ui-cn-fill: #f5f5f5;
  --ui-cn-focus: #2f6bff;
  font-size: 13px;
}
.ui-cn button {
  height: 32px;
  border-width: 1px;
}
:where(.dark, [data-theme="dark"]) .ui-cn {
  --ui-cn-card: #232326;
  --ui-cn-text: #c4c4c4;
  --ui-cn-muted: #8f8f8f;
  --ui-cn-line: rgba(255, 255, 255, 0.1);
  --ui-cn-fill: #2a2a2d;
}

`;
