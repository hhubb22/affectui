"use client";

import { type ReactNode } from "react";

/*
 * thread-uploads (Clean) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export type ThreadAttachment = {
  id: string;
  name: string;
  size: number;
  kind?: "file" | "voice";
  file?: File;
  seconds?: number;
};
export type ThreadUpload = ThreadAttachment & {
  progress: number;
  state: "uploading" | "paused" | "done" | "failed" | "transcribing" | "waiting";
};
export type ThreadUploadsProps = {
  uploads: ThreadUpload[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
};

/** Upload progress, paused transfers, retryable failures and voice notes waiting for a connection. */
export function ThreadUploads({ uploads: rawUploads, onRemove, onRetry, className }: ThreadUploadsProps) {
  const uploads = (Array.isArray(rawUploads) ? rawUploads : []).filter(Boolean);
  const size = (bytes: number) =>
    bytes >= 1e6
      ? `${Math.round(bytes / 1e6)} MB`
      : bytes >= 1000
        ? `${Math.round(bytes / 1000)} KB`
        : `${Math.max(0, bytes)} B`;
  return (
    <ul className={["ui-upc", className].filter(Boolean).join(" ")} aria-label="Attachments">
      <style href="ui-thcread-uploads-clean" precedence="default">
        {css}
      </style>
      {uploads.map((upload) => {
        const status = ["uploading", "paused", "done", "failed", "transcribing", "waiting"].includes(upload.state)
          ? upload.state
          : "done";
        const progress = clamp(safeNumber(upload.progress, 0), 0, 1);
        return (
          <li
            key={upload.id}
            className="ui-upc__file"
            data-state={status}
            data-kind={upload.kind === "voice" ? "voice" : undefined}
          >
            <span
              className="ui-upc__icon"
              data-kind={
                upload.kind === "voice"
                  ? "voice"
                  : /\.(mov|mp4|webm)$/i.test(upload.name)
                    ? "video"
                    : /\.(csv|xlsx?)$/i.test(upload.name)
                      ? "table"
                      : "file"
              }
            >
              <Icon
                name={
                  upload.kind === "voice"
                    ? "mic"
                    : /\.(mov|mp4|webm)$/i.test(upload.name)
                      ? "video"
                      : /\.(csv|xlsx?)$/i.test(upload.name)
                        ? "table"
                        : "document"
                }
                size={14}
              />
            </span>
            <span className="ui-upc__info">
              <strong title={upload.name} dir="auto">
                {upload.name}
                {upload.kind === "voice" && upload.seconds != null
                  ? ` · ${Math.floor(upload.seconds / 60)}:${String(upload.seconds % 60).padStart(2, "0")}`
                  : ""}
              </strong>
              <span className="ui-upc__status">
                {status === "failed" ? (
                  <>
                    {upload.kind === "voice" ? "Transcription failed" : "Upload failed"} ·{" "}
                    <button type="button" aria-label={`Retry ${upload.name}`} onClick={() => onRetry?.(upload.id)}>
                      Retry
                    </button>
                  </>
                ) : status === "waiting" ? (
                  "Saved – will transcribe when you're back online"
                ) : status === "transcribing" ? (
                  "Transcribing…"
                ) : status === "paused" ? (
                  `Paused – waiting for connection · ${size(upload.size)}`
                ) : status === "uploading" ? (
                  `${Math.round(progress * 100)}% · ${size(upload.size)}`
                ) : (
                  size(upload.size)
                )}
              </span>
              {(status === "uploading" || status === "paused") && (
                <span
                  className="ui-upc__bar"
                  role="progressbar"
                  aria-label={`Uploading ${upload.name}`}
                  aria-valuenow={Math.round(progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ transform: `scaleX(${progress})` }} />
                </span>
              )}
            </span>
            <button
              type="button"
              className="ui-upc__remove"
              aria-label={`${status === "uploading" || status === "paused" ? "Cancel upload" : "Remove"} ${upload.name}`}
              onClick={() => onRemove?.(upload.id)}
            >
              <Icon name="close" size={12} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export type ThreadVoiceInputProps = { seconds: number; onDiscard: () => void; onDone: () => void; className?: string };
/** Preview-friendly dictation controls, also useful with a caller-owned recorder. */
export function ThreadVoiceInput({ seconds, onDiscard, onDone, className }: ThreadVoiceInputProps) {
  const value = Math.max(0, Math.floor(safeNumber(seconds, 0)));
  return (
    <div
      className={["ui-upc", "ui-upc__voice", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Dictating"
    >
      <style href="ui-thcread-uploads-clean" precedence="default">
        {css}
      </style>
      <button type="button" aria-label="Discard recording" onClick={onDiscard}>
        <Icon name="close" size={16} />
      </button>
      <span className="ui-upc__red-dot" />
      <span className="ui-upc__wave" aria-hidden="true">
        {Array.from({ length: 56 }, (_, index) => (
          <i key={index} style={{ height: `${3 + ((index * 7) % 17)}px`, animationDelay: `${index * -83}ms` }} />
        ))}
      </span>
      <span className="ui-upc__time">
        {Math.floor(value / 60)}:{String(value % 60).padStart(2, "0")}
      </span>
      <button type="button" aria-label="Done" onClick={onDone}>
        <Icon name="check" size={16} />
      </button>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-upc {
  --ui-upc-card: #fff;
  --ui-upc-ink: rgba(0, 0, 0, 0.88);
  --ui-upc-muted: rgba(0, 0, 0, 0.45);
  --ui-upc-faint: rgba(0, 0, 0, 0.27);
  --ui-upc-line: rgba(0, 0, 0, 0.06);
  --ui-upc-fill: rgba(0, 0, 0, 0.025);
  --ui-upc-accent: #0060e2;
  --ui-upc-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  font:
    12px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-upc-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-upc,
.ui-upc *,
.ui-upc *::before,
.ui-upc *::after {
  box-sizing: border-box;
}
.ui-upc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-upc button:focus-visible {
  outline: 2px solid var(--ui-upc-focus);
  outline-offset: 2px;
}
.ui-upc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-upc__file {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  min-width: 0;
  max-width: 280px;
  flex: none;
  min-height: 40px;
  padding: 4px 4px 4px 6px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 0 0.5px var(--ui-upc-line);
  background: var(--ui-upc-fill);
  animation: ui-upc-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-upc__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--ui-upc-fill);
  color: var(--ui-upc-muted);
}
.ui-upc__icon[data-kind="voice"] {
  color: #a367d1;
}
.ui-upc__icon[data-kind="video"] {
  color: #db5e9d;
}
.ui-upc__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-upc__info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0;
}
.ui-upc__info strong {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-upc__status {
  font-size: 11px;
  line-height: 16px;
  color: var(--ui-upc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-upc__status button {
  font-size: 11px;
  text-decoration: underline;
  padding: 0;
}
.ui-upc__file[data-state="failed"] .ui-upc__status {
  color: #e5484d;
}
.ui-upc__remove {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  color: var(--ui-upc-muted) !important;
}
.ui-upc__remove:hover {
  background: var(--ui-upc-fill);
}
.ui-upc__bar {
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  display: block;
  height: 2px;
  border-radius: 2px;
  background: var(--ui-upc-fill);
  overflow: hidden;
  margin-top: 3px;
}
.ui-upc__bar > span {
  display: block;
  transform-origin: left;
  width: 100%;
  height: 100%;
  background: var(--ui-upc-accent);
  transition: transform 200ms linear;
}
.ui-upc__file[data-state="paused"] .ui-upc__bar > span {
  background: var(--ui-upc-faint);
}
.ui-upc__voice {
  flex-wrap: nowrap;
  align-items: center;
  padding: 4px 6px;
  gap: 8px;
  border-radius: 14px;
  height: 36px;
  background: var(--ui-upc-card);
  box-shadow: 0 0 0 0.5px var(--ui-upc-line);
}
.ui-upc__voice > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-upc-muted);
}
.ui-upc__voice > button:hover {
  background: var(--ui-upc-fill);
}
.ui-upc__red-dot {
  width: 5px;
  height: 5px;
  background: #e5484d;
  border-radius: 50%;
  animation: ui-upc-pulse 1s ease-in-out infinite;
}
.ui-upc__wave {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: flex-start;
  height: 20px;
  overflow: hidden;
}
.ui-upc__wave i {
  display: block;
  flex: none;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-upc-accent);
  animation: ui-upc-wave 600ms ease-in-out infinite alternate;
}
.ui-upc__time {
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--ui-upc-muted);
}
@keyframes ui-upc-wave {
  to {
    transform: scaleY(0.2);
  }
}
@keyframes ui-upc-pulse {
  50% {
    opacity: 0.3;
  }
}
@keyframes ui-upc-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@container (max-width:400px) {
  .ui-upc__file {
    max-width: 100%;
  }
}
@media (pointer: coarse) {
  .ui-upc__remove,
  .ui-upc__voice > button {
    width: 36px;
    height: 36px;
  }
  .ui-upc__status button {
    min-height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-upc,
  .ui-upc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-upc {
  --ui-upc-card: #1c1c1e;
  --ui-upc-ink: rgba(255, 255, 255, 0.9);
  --ui-upc-muted: rgba(255, 255, 255, 0.46);
  --ui-upc-faint: rgba(255, 255, 255, 0.3);
  --ui-upc-line: rgba(255, 255, 255, 0.08);
  --ui-upc-fill: rgba(255, 255, 255, 0.04);
  --ui-upc-accent: #4d8dff;
  --ui-upc-focus: rgba(77, 141, 255, 0.5);
}

.ui-upc__file[data-kind="voice"] {
  max-width: 380px;
}
.ui-upc__file[data-kind="voice"][data-state="waiting"] {
  padding-block: 6px;
}
.ui-upc__file[data-kind="voice"] .ui-upc__status {
  white-space: normal;
}

`;
