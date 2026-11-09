"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * integration-request (Classic) – a self-contained React 19 component.
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

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

export type IntegrationRequestProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Resolve to confirm delivery, reject to retain the draft with an error. No built-in network request. */
  onRequest?: (name: string) => void | Promise<void>;
  className?: string;
};

/** Anchored request form, with keyboard dismissal, focus restoration and async feedback. */
export function IntegrationRequest({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onRequest,
  className,
}: IntegrationRequestProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [name, setName] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  const [offset, setOffset] = useState(0);
  const root = useRef<HTMLDivElement>(null),
    popover = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    input = useRef<HTMLInputElement>(null),
    pending = useRef(false),
    alive = useRef(true),
    id = useId();
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (root.current && popover.current)
        setOffset(Math.min(0, root.current.getBoundingClientRect().right - popover.current.offsetWidth - 16));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: WindowEventMap["keydown"]) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", key, true);
    };
  }, [open, openProp, onOpenChange]);
  return (
    <div ref={root} className={["ui-irq", className].filter(Boolean).join(" ")}>
      <style href="ui-integration-request" precedence="default">
        {css}
      </style>
      <button
        ref={trigger}
        type="button"
        className="ui-irq__button"
        aria-expanded={open}
        aria-controls={`${id}-dialog`}
        onClick={() => setOpen(!open)}
      >
        <Icon name="plus" size={14} />
        <span>Request</span>
      </button>
      {open && (
        <div
          ref={popover}
          className="ui-irq__popover"
          style={{ right: offset }}
          id={`${id}-dialog`}
          role="dialog"
          aria-labelledby={`${id}-title`}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const tool = name.trim();
              if (!tool || pending.current) return;
              pending.current = true;
              setBusy(true);
              setError("");
              try {
                await onRequest?.(tool);
                if (!alive.current) return;
                setSent(true);
                setName("");
                setOpen(false);
                trigger.current?.focus({ preventScroll: true });
              } catch (failure) {
                if (alive.current)
                  setError(failure instanceof Error ? failure.message : "Couldn't send your request. Try again.");
              } finally {
                pending.current = false;
                if (alive.current) setBusy(false);
              }
            }}
          >
            <b id={`${id}-title`}>Request an integration</b>
            <span>Which tool should we add next?</span>
            <input
              ref={input}
              aria-label="Tool name"
              placeholder="e.g. Pipedrive"
              value={name}
              disabled={busy}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
            />
            {error && (
              <span role="alert" className="ui-irq__error" id={`${id}-error`}>
                {error}
              </span>
            )}
            <button
              type="submit"
              className="ui-irq__button"
              disabled={!name.trim() || busy}
              aria-busy={busy || undefined}
            >
              {busy ? "Sending…" : "Send request"}
            </button>
          </form>
        </div>
      )}
      <span className="ui-irq__status" role="status">
        {sent ? "Request sent" : ""}
      </span>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-irq {
  --ui-irq-card: #fff;
  --ui-irq-ink: rgba(0, 0, 0, 0.88);
  --ui-irq-muted: rgba(0, 0, 0, 0.45);
  --ui-irq-line: rgba(0, 0, 0, 0.08);
  --ui-irq-focus: rgba(0, 96, 226, 0.7);
  --ui-irq-danger: #e5484d;
  --ui-irq-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  display: inline-flex;
  flex: none;
  color: var(--ui-irq-ink);
  font:
    400 13px/20px Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ui-irq,
.ui-irq *,
.ui-irq *::before,
.ui-irq *::after {
  box-sizing: border-box;
}
.ui-irq .ui-irq__button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  max-width: 100%;
  padding: 0 8px 0 6px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-irq-ink);
  color: var(--ui-irq-card);
  font-family: inherit;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 140ms,
    opacity 140ms,
    transform 160ms var(--ui-irq-ease);
}
.ui-irq__button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-irq__button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-irq__button:focus-visible,
.ui-irq input:focus-visible {
  outline: 2px solid var(--ui-irq-focus);
  outline-offset: 2px;
}
.ui-irq__popover {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  right: 0;
  width: min(260px, calc(100vw - 48px));
  padding: 14px;
  border-radius: 12px;
  background: var(--ui-irq-card);
  box-shadow:
    0 0 0 0.5px var(--ui-irq-line),
    0 12px 28px -10px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transform-origin: top right;
  animation: ui-irq-popover 220ms var(--ui-irq-ease);
}
.ui-irq form {
  display: grid;
  gap: 6px;
}
.ui-irq b {
  font-size: 13px;
  font-weight: 500;
}
.ui-irq form > span {
  font-size: 12.5px;
  color: var(--ui-irq-muted);
}
.ui-irq input {
  width: 100%;
  min-width: 0;
  height: 32px;
  margin: 6px 0 4px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: var(--ui-irq-card);
  box-shadow:
    0 0 0 0.5px var(--ui-irq-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  color: var(--ui-irq-ink);
  font: inherit;
}
.ui-irq input::placeholder {
  color: var(--ui-irq-muted);
}
.ui-irq form > .ui-irq__error {
  color: var(--ui-irq-danger);
  overflow-wrap: anywhere;
}
.ui-irq__status {
  position: absolute;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  overflow: hidden;
}
@keyframes ui-irq-popover {
  from {
    transform: scale(0.96) translateY(-4px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@media (hover: hover) and (pointer: fine) {
  .ui-irq__button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--ui-irq-ink) 90%, var(--ui-irq-card));
  }
}
@media (pointer: coarse) {
  .ui-irq .ui-irq__button {
    height: 32px;
  }
  .ui-irq input {
    height: 36px;
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-irq * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-irq {
  --ui-irq-card: #1c1c1e;
  --ui-irq-ink: rgba(255, 255, 255, 0.9);
  --ui-irq-muted: rgba(255, 255, 255, 0.45);
  --ui-irq-line: rgba(255, 255, 255, 0.1);
  --ui-irq-focus: #4d8dff;
  --ui-irq-danger: #ff6369;
}
.ui-irq {
  --ui-irq-ink: #171717;
  --ui-irq-muted: #737373;
  --ui-irq-line: #e5e5e5;
  --ui-irq-focus: #2f6bff;
}
.ui-irq .ui-irq__button {
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(#323137, #201e25);
  color: #fff;
}
.ui-irq__popover {
  border: 1px solid var(--ui-irq-line);
  border-radius: 14px;
}
:where(.dark, [data-theme="dark"]) .ui-irq {
  --ui-irq-card: #232326;
  --ui-irq-ink: #ededed;
  --ui-irq-muted: #8f8f8f;
  --ui-irq-line: rgba(255, 255, 255, 0.1);
  --ui-irq-focus: #6b95ff;
}

`;
