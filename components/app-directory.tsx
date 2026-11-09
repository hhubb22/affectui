"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

/*
 * app-directory (Classic) – a self-contained React 19 component.
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

function initials(name: string) {
  return String(name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  official?: boolean;
  icon?: ReactNode;
  background?: string;
};
export type IntegrationCardProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  integration: Integration;
  connected?: boolean;
  defaultConnected?: boolean;
  onConnectedChange?: (connected: boolean) => void;
  busy?: boolean;
  disabled?: boolean;
  error?: string;
};

function IntegrationLogo({ integration }: { integration: Integration }) {
  return (
    <span
      className="ui-icd__logo"
      aria-hidden="true"
      style={integration.background ? { background: integration.background, boxShadow: "none" } : undefined}
      onErrorCapture={(event) => {
        if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
      }}
    >
      {integration.icon ?? initials(integration.name)}
    </span>
  );
}

/** One service, its official badge, and a connect/disconnect action. No network calls. */
export function IntegrationCard({
  integration,
  connected: connectedProp,
  defaultConnected = false,
  onConnectedChange,
  busy = false,
  disabled = false,
  error,
  className,
  ...rest
}: IntegrationCardProps) {
  const [connected, setConnected] = useControllable(connectedProp, defaultConnected, onConnectedChange);
  const id = useId();
  return (
    <div {...rest} className={["ui-icd", className].filter(Boolean).join(" ")}>
      <style href="ui-app-directory" precedence="default">
        {css}
      </style>
      <IntegrationLogo integration={integration} />
      <span className="ui-icd__text">
        <span className="ui-icd__name">
          <span title={integration.name}>{integration.name}</span>
          {integration.official && (
            <span className="ui-icd__badge" title="Official" aria-label="Official integration">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 2 3 2 4 .5.5 4 2.5 3.5-2.5 3.5-.5 4-4 .5-3 2-3-2-4-.5-.5-4L2 12l2.5-3.5.5-4L9 4Z" />
                <path d="m8.5 12 2 2 5-5" />
              </svg>
            </span>
          )}
        </span>
        <span className="ui-icd__description" title={integration.description}>
          {integration.description}
        </span>
        {error && (
          <span className="ui-icd__error" role="alert" id={`${id}-error`}>
            {error}
          </span>
        )}
      </span>
      <button
        type="button"
        className="ui-icd__action"
        data-state={busy ? "busy" : connected ? "on" : "off"}
        aria-label={`${connected ? "Disconnect" : "Connect"} ${integration.name}`}
        aria-busy={busy || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        title={busy ? "Connecting…" : connected ? "Connected – click to disconnect" : "Connect"}
        disabled={disabled || busy}
        onClick={() => setConnected(!connected)}
      >
        {busy ? (
          <span className="ui-icd__spinner" />
        ) : (
          <span key={String(connected)} className="ui-icd__glyph">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={connected ? "M5 14L8.5 17.5L19 6.5" : "M12 4V20M20 12H4"} />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
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
      <style href="ui-app-directory" precedence="default">
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

// Sample copy and SVG logos transcribed from the recorded public preview. Logos belong to their owners.
export const defaultIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Get alerts in your channels and act on them without leaving the conversation.",
    category: "Popular",
    official: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#E01E5A"
          d="M5.04 15.17a2.53 2.53 0 0 1-2.52 2.52A2.53 2.53 0 0 1 0 15.17a2.53 2.53 0 0 1 2.52-2.53h2.52zm1.27 0a2.53 2.53 0 0 1 2.53-2.53 2.53 2.53 0 0 1 2.52 2.53v6.31A2.53 2.53 0 0 1 8.84 24a2.53 2.53 0 0 1-2.53-2.52z"
        ></path>
        <path
          fill="#36C5F0"
          d="M8.84 5.04a2.53 2.53 0 0 1-2.53-2.52A2.53 2.53 0 0 1 8.84 0a2.53 2.53 0 0 1 2.52 2.52v2.52zm0 1.27a2.53 2.53 0 0 1 2.52 2.53 2.53 2.53 0 0 1-2.52 2.52H2.52A2.53 2.53 0 0 1 0 8.84a2.53 2.53 0 0 1 2.52-2.53z"
        ></path>
        <path
          fill="#2EB67D"
          d="M18.96 8.84a2.53 2.53 0 0 1 2.52-2.53A2.53 2.53 0 0 1 24 8.84a2.53 2.53 0 0 1-2.52 2.52h-2.52zm-1.27 0a2.53 2.53 0 0 1-2.53 2.52 2.53 2.53 0 0 1-2.52-2.52V2.52A2.53 2.53 0 0 1 15.16 0a2.53 2.53 0 0 1 2.53 2.52z"
        ></path>
        <path
          fill="#ECB22E"
          d="M15.16 18.96a2.53 2.53 0 0 1 2.53 2.52A2.53 2.53 0 0 1 15.16 24a2.53 2.53 0 0 1-2.52-2.52v-2.52zm0-1.27a2.53 2.53 0 0 1-2.52-2.53 2.53 2.53 0 0 1 2.52-2.52h6.32A2.53 2.53 0 0 1 24 15.16a2.53 2.53 0 0 1-2.52 2.53z"
        ></path>
      </svg>
    ),
  },
  {
    id: "notion",
    name: "Notion",
    description: "Turn records into pages and keep project docs in sync both ways.",
    category: "Popular",
    official: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"></path>
      </svg>
    ),
  },
  {
    id: "linear",
    name: "Linear",
    description: "Create issues from customer feedback and track them to release.",
    category: "Popular",
    official: true,
    background: "rgb(94, 106, 210)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"></path>
      </svg>
    ),
  },
  {
    id: "figma",
    name: "Figma",
    description: "Preview designs inline and link frames to the work they belong to.",
    category: "Popular",
    official: true,
    icon: (
      <svg viewBox="0 0 38 57" aria-hidden="true">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" fill="#1ABCFE"></path>
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" fill="#0ACF83"></path>
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" fill="#FF7262"></path>
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" fill="#F24E1E"></path>
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" fill="#A259FF"></path>
      </svg>
    ),
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link pull requests and see deploy status next to every task.",
    category: "Popular",
    official: true,
    background: "rgb(23, 23, 23)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
      </svg>
    ),
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Keep contacts, companies and deals matched across both tools.",
    category: "Popular",
    official: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="#FF7A59" aria-hidden="true">
        <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"></path>
      </svg>
    ),
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Sync customers, invoices and subscriptions in real time.",
    category: "Popular",
    official: true,
    background: "rgb(99, 91, 255)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"></path>
      </svg>
    ),
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect 6,000 apps with no-code workflows and triggers.",
    category: "Popular",
    official: true,
    background: "rgb(255, 79, 0)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M4.157 0A4.151 4.151 0 0 0 0 4.161v15.678A4.151 4.151 0 0 0 4.157 24h15.682A4.152 4.152 0 0 0 24 19.839V4.161A4.152 4.152 0 0 0 19.839 0H4.157Zm10.61 8.761h.03a.577.577 0 0 1 .23.038.585.585 0 0 1 .201.124.63.63 0 0 1 .162.431.612.612 0 0 1-.162.435.58.58 0 0 1-.201.128.58.58 0 0 1-.23.042.529.529 0 0 1-.235-.042.585.585 0 0 1-.332-.328.559.559 0 0 1-.038-.235.613.613 0 0 1 .17-.431.59.59 0 0 1 .405-.162Zm2.853 1.572c.03.004.061.004.095.004.325-.011.646.064.937.219.238.144.431.355.552.609.128.279.189.582.185.888v.193a2 2 0 0 1 0 .219h-2.498c.003.227.075.45.204.642a.78.78 0 0 0 .646.265.714.714 0 0 0 .484-.136.642.642 0 0 0 .23-.318l.915.257a1.398 1.398 0 0 1-.28.537c-.14.159-.321.284-.521.355a2.234 2.234 0 0 1-.836.136 1.923 1.923 0 0 1-1.001-.245 1.618 1.618 0 0 1-.665-.703 2.221 2.221 0 0 1-.227-1.036 1.95 1.95 0 0 1 .48-1.398 1.9 1.9 0 0 1 1.3-.488Zm-9.607.023c.162.004.325.026.48.079.207.065.4.174.563.314.26.302.393.692.366 1.088v2.276H8.53l-.109-.711h-.065c-.064.163-.155.31-.272.439a1.122 1.122 0 0 1-.374.264 1.023 1.023 0 0 1-.453.083 1.334 1.334 0 0 1-.866-.264.965.965 0 0 1-.329-.801.993.993 0 0 1 .076-.431 1.02 1.02 0 0 1 .242-.363 1.478 1.478 0 0 1 1.043-.303h.952v-.181a.696.696 0 0 0-.136-.454.553.553 0 0 0-.438-.154.695.695 0 0 0-.378.086.48.48 0 0 0-.193.254l-.99-.144a1.26 1.26 0 0 1 .257-.563c.14-.174.321-.302.533-.378.261-.091.54-.136.82-.129.053-.003.106-.007.163-.007Zm4.384.007c.174 0 .347.038.506.114.182.083.34.211.458.374.257.423.377.911.351 1.406a2.53 2.53 0 0 1-.355 1.448 1.148 1.148 0 0 1-1.009.517c-.204 0-.401-.045-.582-.136a1.052 1.052 0 0 1-.48-.457 1.298 1.298 0 0 1-.114-.234h-.045l.004 1.784h-1.059v-4.713h.904l.117.805h.057c.068-.208.177-.401.328-.56a1.129 1.129 0 0 1 .843-.344h.076v-.004Zm7.559.084h.903l.113.805h.053a1.37 1.37 0 0 1 .235-.484.813.813 0 0 1 .313-.242.82.82 0 0 1 .39-.076h.234v1.051h-.401a.662.662 0 0 0-.313.008.623.623 0 0 0-.272.155.663.663 0 0 0-.174.26.683.683 0 0 0-.027.314v1.875h-1.054v-3.666Zm-17.515.003h3.262v.896L3.73 13.104l.034.113h1.973l.042.9H2.4v-.9l1.931-1.754-.045-.117H2.441v-.896Zm11.815 0h1.055v3.659h-1.055V10.45Zm3.443.684.019.016a.69.69 0 0 0-.351.045.756.756 0 0 0-.287.204c-.11.155-.174.336-.189.522h1.545c-.034-.526-.257-.787-.74-.787h.003Zm-5.718.163c-.026 0-.057 0-.083.004a.78.78 0 0 0-.31.053.746.746 0 0 0-.257.189 1.016 1.016 0 0 0-.204.695v.064c-.015.257.057.507.204.711a.634.634 0 0 0 .253.196.638.638 0 0 0 .314.061.644.644 0 0 0 .578-.265c.14-.223.204-.48.189-.74a1.216 1.216 0 0 0-.181-.711.677.677 0 0 0-.503-.257Zm-4.509 1.266a.464.464 0 0 0-.268.102.373.373 0 0 0-.114.276c0 .053.008.106.027.155a.375.375 0 0 0 .087.132.576.576 0 0 0 .397.11v.004a.863.863 0 0 0 .563-.182.573.573 0 0 0 .211-.457v-.14h-.903Z"></path>
      </svg>
    ),
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Mirror bases as tables and keep fields in sync automatically.",
    category: "Popular",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#18BFFF" aria-hidden="true">
        <path d="M11.992 1.966c-.434 0-.87.086-1.28.257L1.779 5.917c-.503.208-.49.908.012 1.116l8.982 3.558a3.266 3.266 0 0 0 2.454 0l8.982-3.558c.503-.196.503-.908.012-1.116l-8.957-3.694a3.255 3.255 0 0 0-1.272-.257zM23.4 8.056a.589.589 0 0 0-.222.045l-10.012 3.877a.612.612 0 0 0-.38.564v8.896a.6.6 0 0 0 .821.552L23.62 18.1a.583.583 0 0 0 .38-.551V8.653a.6.6 0 0 0-.6-.596zM.676 8.095a.644.644 0 0 0-.48.19C.086 8.396 0 8.53 0 8.69v8.355c0 .442.515.737.908.54l6.27-3.006.307-.147 2.969-1.436c.466-.22.43-.908-.061-1.092L.883 8.138a.57.57 0 0 0-.207-.044z"></path>
      </svg>
    ),
  },
  {
    id: "jira",
    name: "Jira",
    description: "Sync issues, statuses and assignees with your Jira projects.",
    category: "Popular",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#0052CC" aria-hidden="true">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z"></path>
      </svg>
    ),
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Pick files from Drive and preview them without downloading.",
    category: "Google",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#1FA463" aria-hidden="true">
        <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z"></path>
      </svg>
    ),
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "See upcoming meetings with every contact in one timeline.",
    category: "Google",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#4285F4" aria-hidden="true">
        <path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"></path>
      </svg>
    ),
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Attribute signups to the campaigns and pages that brought them.",
    category: "Google",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#E37400" aria-hidden="true">
        <path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z"></path>
      </svg>
    ),
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Start meetings from any record and save the recording link.",
    category: "Communication",
    official: false,
    background: "rgb(11, 92, 255)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z"></path>
      </svg>
    ),
  },
  {
    id: "discord",
    name: "Discord",
    description: "Post updates to community channels when something ships.",
    category: "Communication",
    official: false,
    background: "rgb(88, 101, 242)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
      </svg>
    ),
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "See conversations next to the customer and reply from one place.",
    category: "Communication",
    official: false,
    background: "rgb(31, 141, 237)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.658 1.343 3 3 3h18c1.658 0 3-1.342 3-3V3c0-1.657-1.342-3-3-3zm-5.801 4.399c0-.44.36-.8.802-.8.44 0 .8.36.8.8v10.688c0 .442-.36.801-.8.801-.443 0-.802-.359-.802-.801V4.399zM11.2 3.994c0-.44.357-.799.8-.799s.8.359.8.799v11.602c0 .44-.357.8-.8.8s-.8-.36-.8-.8V3.994zm-4 .405c0-.44.359-.8.799-.8.443 0 .802.36.802.8v10.688c0 .442-.36.801-.802.801-.44 0-.799-.359-.799-.801V4.399zM3.199 6c0-.442.36-.8.802-.8.44 0 .799.358.799.8v7.195c0 .441-.359.8-.799.8-.443 0-.802-.36-.802-.8V6zM20.52 18.202c-.123.105-3.086 2.593-8.52 2.593-5.433 0-8.397-2.486-8.521-2.593-.335-.288-.375-.792-.086-1.128.285-.334.79-.375 1.125-.09.047.041 2.693 2.211 7.481 2.211 4.848 0 7.456-2.186 7.479-2.207.334-.289.839-.25 1.128.086.289.336.25.84-.086 1.128zm.281-5.007c0 .441-.36.8-.801.8-.441 0-.801-.36-.801-.8V6c0-.442.361-.8.801-.8.441 0 .801.357.801.8v7.195z"></path>
      </svg>
    ),
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Log booked meetings and the answers people gave when booking.",
    category: "Communication",
    official: false,
    background: "rgb(0, 107, 255)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 0 1 0-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301Zm.005-3.237c.399 0 .794-.036 1.179-.11-.002-.004-.002-.01-.002-.014-.073-.414-.193-.823-.349-1.218.731-.12 1.407-.396 1.986-.819 0-.004-.005-.013-.005-.018-.331-1.085-.832-2.101-1.489-3.03-.649-.915-1.435-1.719-2.331-2.395-1.867-1.398-4.088-2.138-6.428-2.138-1.448 0-2.855.28-4.175.841-1.273.543-2.423 1.315-3.407 2.299S2.878 6.552 2.341 7.83c-.557 1.324-.842 2.726-.842 4.175 0 1.448.281 2.855.842 4.174.542 1.274 1.314 2.423 2.298 3.407s2.129 1.761 3.407 2.299c1.324.556 2.727.841 4.175.841 2.34 0 4.561-.74 6.428-2.137a10.815 10.815 0 0 0 2.331-2.396c.652-.929 1.158-1.949 1.489-3.03 0-.004.005-.014.005-.018-.579-.423-1.255-.699-1.986-.819.161-.395.276-.804.349-1.218.005-.009.005-.014.005-.023.869.166 1.692.506 2.404 1.035.685.505.552 1.075.446 1.416C22.184 20.437 17.619 24 12.221 24c-6.625 0-12-5.375-12-12s5.37-12 12-12c5.398 0 9.963 3.563 11.471 8.464.106.341.239.915-.446 1.421-.717.529-1.535.873-2.404 1.034.128.716.128 1.45 0 2.166-.387-.074-.782-.11-1.182-.11-4.184 0-3.968 2.823-6.736 2.823h-1.029c-1.899 0-3.15-1.357-3.15-3.095v-1.411c0-1.738 1.251-3.094 3.15-3.094h1.034c2.768 0 2.552 2.823 6.731 2.827Z"></path>
      </svg>
    ),
  },
  {
    id: "typeform",
    name: "Typeform",
    description: "Create records from form answers the moment they come in.",
    category: "Communication",
    official: false,
    background: "rgb(38, 38, 39)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M15.502 13.035c-.5 0-.756-.411-.756-.917 0-.505.252-.894.756-.894.513 0 .756.407.756.894-.004.515-.261.917-.756.917Zm-4.888-1.81c.292 0 .414.17.414.317 0 .357-.365.514-1.126.536 0-.442.253-.854.712-.854Zm-3.241 1.81c-.473 0-.67-.384-.67-.917 0-.527.202-.894.67-.894.477 0 .702.38.702.894 0 .537-.234.917-.702.917Zm-3.997-2.334h-.738l1.224 2.808c-.234.519-.36.648-.522.648-.171 0-.333-.138-.45-.259l-.324.43c.22.232.522.366.832.366.387 0 .685-.224.856-.626l1.413-3.371h-.725l-.738 2.012-.828-2.008Zm19.553.523c.36 0 .432.246.432.823v1.516H24v-1.914c0-.689-.473-.988-.91-.988-.386 0-.742.241-.94.688a.901.901 0 0 0-.891-.688c-.365 0-.73.232-.927.666v-.626h-.64v2.857h.64v-1.22c0-.617.324-1.114.765-1.114.36 0 .427.246.427.823v1.516h.64l-.005-1.225c0-.617.329-1.114.77-1.114Zm-5.1-.523h-.324v2.857h.639v-1.095c0-.693.306-1.163.76-1.163.118 0 .217.005.325.05l.099-.676c-.081-.009-.153-.018-.225-.018-.45 0-.774.309-.964.707V10.7h-.31Zm-2.327-.045c-.846 0-1.418.644-1.418 1.458 0 .845.58 1.475 1.418 1.475.85 0 1.431-.648 1.431-1.475-.004-.818-.594-1.458-1.431-1.458Zm-4.852 2.38c-.333 0-.581-.17-.685-.515.847-.036 1.675-.242 1.675-.988 0-.43-.423-.872-1.03-.872-.82 0-1.374.666-1.374 1.457 0 .828.545 1.476 1.36 1.476.567 0 .927-.228 1.21-.559l-.31-.42c-.329.335-.531.42-.846.42Zm-3.151-2.38c-.324 0-.648.188-.774.483v-.438h-.64v3.98h.64v-1.422c.135.205.445.34.72.34.85 0 1.3-.631 1.3-1.48-.004-.841-.445-1.463-1.246-1.463Zm-4.483-1.1H0v.622h1.18v3.38h.67v-3.38h1.166v-.622Zm9.502 1.145h-.383v.572h.383v2.285h.639v-2.285h.621v-.572h-.621v-.447c0-.286.117-.385.382-.385.1 0 .19.027.311.068l.144-.537c-.117-.067-.351-.094-.504-.094-.612 0-.972.367-.972 1.002v.393Z"></path>
      </svg>
    ),
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Attach files from Dropbox and keep shared folders linked.",
    category: "Communication",
    official: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="#0061FF" aria-hidden="true">
        <path d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"></path>
      </svg>
    ),
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    description: "Send product events and build reports from real usage.",
    category: "Communication",
    official: false,
    background: "rgb(120, 86, 255)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M6.967 9.996h3.053c-.763-.477-1.048-1.145-1.431-2.384L7.443 3.366C6.919 1.458 6.49.551 4.39.551H.004v1.145h.621c1.286 0 1.431.477 1.814 1.908L3.44 7.326c.524 1.814 1.337 2.67 3.53 2.67h-.003Zm7.06 0h3.053c2.194 0 2.956-.86 3.484-2.67l1.001-3.722c.382-1.431.57-1.908 1.814-1.908H24V.551h-4.34c-2.146 0-2.576.86-3.053 2.815l-1.145 4.246c-.384 1.286-.673 1.907-1.435 2.384Zm-4.007 4.008h4.007V9.996H10.02v4.008ZM0 23.449h4.39c2.1 0 2.529-.907 3.053-2.815l1.146-4.246c.383-1.239.668-1.907 1.431-2.384H6.967c-2.194 0-3.007.86-3.531 2.67l-1.001 3.722c-.383 1.431-.524 1.907-1.814 1.907H0v1.146Zm19.65 0h4.343v-1.146h-.622c-1.239 0-1.431-.476-1.814-1.907l-1.001-3.722c-.524-1.814-1.286-2.67-3.483-2.67h-3.046c.762.477 1.041 1.098 1.424 2.384l1.145 4.246c.477 1.955.907 2.815 3.054 2.815Z"></path>
      </svg>
    ),
  },
  {
    id: "make",
    name: "Make",
    description: "Build visual multi-step automations with branches and filters.",
    category: "Communication",
    official: false,
    background: "rgb(109, 0, 204)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M13.38 3.498c-.27 0-.511.19-.566.465L9.85 18.986a.578.578 0 0 0 .453.678l4.095.826a.58.58 0 0 0 .682-.455l2.963-15.021a.578.578 0 0 0-.453-.678l-4.096-.826a.589.589 0 0 0-.113-.012zm-5.876.098a.576.576 0 0 0-.516.318L.062 17.697a.575.575 0 0 0 .256.774l3.733 1.877a.578.578 0 0 0 .775-.258l6.926-13.781a.577.577 0 0 0-.256-.776L7.762 3.658a.571.571 0 0 0-.258-.062zm11.74.115a.576.576 0 0 0-.576.576v15.426c0 .318.258.578.576.578h4.178a.58.58 0 0 0 .578-.578V4.287a.578.578 0 0 0-.578-.576Z"></path>
      </svg>
    ),
  },
  {
    id: "paddle",
    name: "Paddle",
    description: "Handle checkout, tax and subscriptions as merchant of record.",
    category: "Communication",
    official: false,
    background: "rgb(253, 221, 53)",
    icon: (
      <svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
        <path d="M2.363 7.904v.849a3.95 3.95 0 0 1 3.65 2.425c.198.476.3.987.299 1.502h.791c0-1.04.416-2.037 1.157-2.772a3.962 3.962 0 0 1 2.792-1.149V7.91a3.959 3.959 0 0 1-3.65-2.425 3.893 3.893 0 0 1-.299-1.502h-.791c0 1.04-.416 2.037-1.157 2.772a3.96 3.96 0 0 1-2.792 1.149M13.105 2.51H6.312V0h6.793c4.772 0 8.532 3.735 8.532 8.314 0 4.58-3.76 8.314-8.532 8.314H9.156V24H6.312v-9.882h6.793c3.319 0 5.688-2.352 5.688-5.804 0-3.451-2.37-5.804-5.688-5.804"></path>
      </svg>
    ),
  },
];

export type IntegrationFilter = "All" | "Connected" | "Available";
export type AppDirectoryProps = {
  integrations?: Integration[];
  connected?: string[];
  defaultConnected?: string[];
  onConnectedChange?: (ids: string[]) => void;
  /** Optional application connection action. A rejection preserves the previous state and shows an error. */
  onConnectionChange?: (integration: Integration, connected: boolean) => void | Promise<void>;
  filter?: IntegrationFilter;
  defaultFilter?: IntegrationFilter;
  onFilterChange?: (filter: IntegrationFilter) => void;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  requestProps?: IntegrationRequestProps;
  className?: string;
};

/** Searchable, grouped app directory. Controlled connections stay caller-owned; omitted actions use the recorded demo delay. */
export function AppDirectory({
  integrations = defaultIntegrations,
  connected: connectedProp,
  defaultConnected = ["slack"],
  onConnectedChange,
  onConnectionChange,
  filter: filterProp,
  defaultFilter = "All",
  onFilterChange,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  requestProps,
  className,
}: AppDirectoryProps) {
  const [connected, setConnected] = useControllable(connectedProp, defaultConnected, onConnectedChange);
  const [filter, setFilter] = useControllable(filterProp, defaultFilter, onFilterChange);
  const [search, setSearch] = useControllable(searchProp, defaultSearch, onSearchChange);
  const [expanded, setExpanded] = useState<string[]>([]),
    [busy, setBusy] = useState<string[]>([]),
    [errors, setErrors] = useState<Record<string, string>>({});
  const connections = useRef(connected),
    pending = useRef(new Set<string>()),
    alive = useRef(true),
    tabs = useRef<HTMLDivElement>(null),
    id = useId();
  const [pill, setPill] = useState({ x: 0, width: 0 });
  connections.current = connected;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useLayoutEffect(() => {
    const el = tabs.current;
    if (!el) return;
    const update = () => {
      const active = el.querySelector<HTMLElement>('[aria-selected="true"]');
      if (active) setPill({ x: active.offsetLeft, width: active.offsetWidth });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [filter]);
  const toggle = async (integration: Integration, next: boolean) => {
    if (pending.current.has(integration.id)) return;
    pending.current.add(integration.id);
    setBusy([...pending.current]);
    setErrors((current) => ({ ...current, [integration.id]: "" }));
    try {
      if (onConnectionChange) await onConnectionChange(integration, next);
      else if (next) await new Promise((resolve) => setTimeout(resolve, 950));
      if (!alive.current) return;
      const updated = next
        ? [...new Set([...connections.current, integration.id])]
        : connections.current.filter((value) => value !== integration.id);
      if (connectedProp === undefined) connections.current = updated;
      setConnected(updated);
    } catch (failure) {
      if (alive.current)
        setErrors((current) => ({
          ...current,
          [integration.id]: failure instanceof Error ? failure.message : "Couldn't update connection. Try again.",
        }));
    } finally {
      pending.current.delete(integration.id);
      if (alive.current) setBusy([...pending.current]);
    }
  };
  const query = search.trim().toLocaleLowerCase();
  const matches = integrations.filter(
    (integration) =>
      (!query ||
        `${integration.name} ${integration.description} ${integration.category}`.toLocaleLowerCase().includes(query)) &&
      (filter === "Connected"
        ? connected.includes(integration.id)
        : filter === "Available"
          ? !connected.includes(integration.id)
          : true),
  );
  const categories = [...new Set(matches.map((integration) => integration.category))];
  const filters: IntegrationFilter[] = ["All", "Connected", "Available"];
  return (
    <div className={["ui-apd", className].filter(Boolean).join(" ")}>
      <style href="ui-app-directory" precedence="default">
        {css}
      </style>
      <h1>Integrations</h1>
      <p className="ui-apd__subtitle">Connect the tools your team already uses and work with them right in the chat.</p>
      <div className="ui-apd__bar">
        <div
          ref={tabs}
          className="ui-apd__tabs"
          role="tablist"
          aria-label="Integration status"
          onKeyDown={(event) => {
            const index = filters.indexOf(filter),
              next =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : -1;
            if (next < 0) return;
            event.preventDefault();
            const value = filters[next]!;
            setFilter(value);
            tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
          }}
        >
          <span
            className="ui-apd__pill"
            aria-hidden="true"
            style={{ transform: `translateX(${pill.x}px)`, width: pill.width }}
          />
          {filters.map((value) => (
            <button
              type="button"
              role="tab"
              key={value}
              id={`${id}-${value}`}
              aria-selected={filter === value}
              aria-controls={`${id}-results`}
              tabIndex={filter === value ? 0 : -1}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="ui-apd__right">
          <label className="ui-apd__search">
            <Icon name="search" size={16} />
            <input
              type="search"
              aria-label="Search integrations"
              placeholder="Search integrations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button type="button" aria-label="Clear" onClick={() => setSearch("")}>
                <Icon name="close" size={13} />
              </button>
            )}
          </label>
          <IntegrationRequest {...requestProps} />
        </div>
      </div>
      <div id={`${id}-results`} role="tabpanel" aria-labelledby={`${id}-${filter}`}>
        {categories.length ? (
          categories.map((category, index) => {
            const apps = matches.filter((integration) => integration.category === category),
              showAll = !!query || expanded.includes(category),
              visible = showAll ? apps : apps.slice(0, 6),
              hidden = apps.slice(6);
            const more = `${hidden
              .slice(0, 2)
              .map((app) => app.name)
              .join(", ")}${hidden.length > 2 ? ` and ${hidden.length - 2} more` : ""}`;
            return (
              <section
                key={`${filter}:${query}:${category}`}
                className="ui-apd__section"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <h2>{category}</h2>
                <div className="ui-apd__grid">
                  {visible.map((integration, appIndex) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      connected={connected.includes(integration.id)}
                      busy={busy.includes(integration.id)}
                      error={errors[integration.id]}
                      onConnectedChange={(next) => {
                        void toggle(integration, next);
                      }}
                      className={showAll && appIndex >= 6 ? "ui-apd__revealed" : undefined}
                    />
                  ))}
                </div>
                {!showAll && hidden.length > 0 && (
                  <button
                    type="button"
                    className="ui-apd__more"
                    aria-label={more}
                    onClick={() => setExpanded((current) => [...current, category])}
                  >
                    <span className="ui-apd__logos" aria-hidden="true">
                      {hidden.slice(0, 3).map((integration) => (
                        <IntegrationLogo key={integration.id} integration={integration} />
                      ))}
                    </span>
                    <span>{more}</span>
                    <Icon name="chevron" size={15} />
                  </button>
                )}
              </section>
            );
          })
        ) : (
          <div className="ui-apd__empty" role="status">
            <span>
              <Icon name="plug" size={23} />
            </span>
            <b>No integrations found</b>
            <p>Try a different search or filter, or request the tool you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-icd {
  --ui-icd-card: #fff;
  --ui-icd-ink: rgba(0, 0, 0, 0.88);
  --ui-icd-text: rgba(0, 0, 0, 0.61);
  --ui-icd-muted: rgba(0, 0, 0, 0.45);
  --ui-icd-faint: rgba(0, 0, 0, 0.27);
  --ui-icd-line: rgba(0, 0, 0, 0.06);
  --ui-icd-hover: #fafafa;
  --ui-icd-focus: rgba(0, 96, 226, 0.7);
  --ui-icd-danger: #e5484d;
  --ui-icd-shadow: 0 0 0 0.5px var(--ui-icd-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-icd-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 58px;
  padding: 9px 8px;
  margin-inline: -8px;
  border-radius: 12px;
  color: var(--ui-icd-ink);
  font:
    400 13px/18px Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 140ms;
}
.ui-icd,
.ui-icd *,
.ui-icd *::before,
.ui-icd *::after {
  box-sizing: border-box;
}
.ui-icd__logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--ui-icd-card, #fff);
  box-shadow: var(--ui-icd-shadow, 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.05));
  color: var(--ui-icd-text, rgba(0, 0, 0, 0.61));
  font-size: 11px;
  font-weight: 500;
}
.ui-icd__logo svg,
.ui-icd__logo img {
  display: block;
  width: 17px;
  height: 17px;
  object-fit: contain;
}
.ui-icd__text {
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.ui-icd__name {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
}
.ui-icd__name > span:first-child {
  overflow: hidden;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-icd__badge {
  display: grid;
  flex: none;
  color: var(--ui-icd-faint);
}
.ui-icd__description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-icd-muted);
}
.ui-icd__error {
  font-size: 12px;
  color: var(--ui-icd-danger);
  overflow-wrap: anywhere;
}
.ui-icd .ui-icd__action {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--ui-icd-card);
  box-shadow: var(--ui-icd-shadow);
  color: var(--ui-icd-text);
  cursor: pointer;
  transition:
    box-shadow 140ms,
    background-color 160ms,
    color 160ms;
}
.ui-icd__action[data-state="on"] {
  background: var(--ui-icd-ink);
  box-shadow: none;
  color: var(--ui-icd-card);
}
.ui-icd__action:disabled {
  cursor: default;
}
.ui-icd__action:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-icd__action:focus-visible {
  outline: 2px solid var(--ui-icd-focus);
  outline-offset: 2px;
}
.ui-icd__glyph {
  display: grid;
  animation: ui-icd-pop 260ms var(--ui-icd-ease);
}
.ui-icd__spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--ui-icd-line);
  border-top-color: var(--ui-icd-ink);
  border-radius: 50%;
  animation: ui-icd-spin 700ms linear infinite;
}
@media (hover: hover) and (pointer: fine) {
  .ui-icd:hover {
    background: var(--ui-icd-hover);
  }
  .ui-icd__action:hover:not(:disabled) {
    box-shadow:
      0 0 0 1px var(--ui-icd-line),
      0 1px 2px rgba(0, 0, 0, 0.05);
    color: var(--ui-icd-ink);
  }
  .ui-icd__action[data-state="on"]:hover {
    background: color-mix(in srgb, var(--ui-icd-ink) 86%, var(--ui-icd-card));
    color: var(--ui-icd-card);
  }
}
@keyframes ui-icd-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes ui-icd-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (pointer: coarse) {
  .ui-icd .ui-icd__action {
    width: 32px;
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-icd,
  .ui-icd * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-icd {
  --ui-icd-card: #1c1c1e;
  --ui-icd-ink: rgba(255, 255, 255, 0.9);
  --ui-icd-text: rgba(255, 255, 255, 0.62);
  --ui-icd-muted: rgba(255, 255, 255, 0.45);
  --ui-icd-faint: rgba(255, 255, 255, 0.28);
  --ui-icd-line: rgba(255, 255, 255, 0.1);
  --ui-icd-hover: #202023;
  --ui-icd-focus: #4d8dff;
  --ui-icd-danger: #ff6369;
  --ui-icd-shadow: 0 0 0 0.5px var(--ui-icd-line), 0 1px 2px rgba(0, 0, 0, 0.4);
}

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

.ui-apd {
  --ui-apd-card: #fff;
  --ui-apd-ink: rgba(0, 0, 0, 0.88);
  --ui-apd-strong: #000;
  --ui-apd-text: rgba(0, 0, 0, 0.61);
  --ui-apd-muted: rgba(0, 0, 0, 0.45);
  --ui-apd-line: rgba(0, 0, 0, 0.06);
  --ui-apd-chip: rgba(0, 0, 0, 0.04);
  --ui-apd-select: rgba(0, 0, 0, 0.055);
  --ui-apd-frame: rgba(0, 0, 0, 0.02);
  --ui-apd-focus: rgba(0, 96, 226, 0.7);
  --ui-apd-ease: cubic-bezier(0.22, 1, 0.36, 1);
  container: ui-apd / inline-size;
  width: min(957px, calc(100% - 64px));
  margin: 0 auto;
  padding: 40px 0 64px;
  min-width: 0;
  color: var(--ui-apd-ink);
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
.ui-apd,
.ui-apd *,
.ui-apd *::before,
.ui-apd *::after {
  box-sizing: border-box;
}
.ui-apd h1 {
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.24px;
  color: var(--ui-apd-strong);
}
.ui-apd__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-apd-text);
}
.ui-apd button,
.ui-apd input {
  font-family: inherit;
}
.ui-apd__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 5;
  margin: 14px -16px 0;
  padding: 26px 16px 12px;
  background: var(--ui-apd-card);
}
.ui-apd__bar::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 32px;
  background: linear-gradient(to bottom, var(--ui-apd-card), transparent);
  pointer-events: none;
}
.ui-apd__tabs {
  position: relative;
  display: flex;
  gap: 8px;
  flex: none;
}
.ui-apd__pill {
  position: absolute;
  top: 0;
  left: 0;
  height: 28px;
  border-radius: 6px;
  background: var(--ui-apd-select);
  transition:
    transform 340ms var(--ui-apd-ease),
    width 340ms var(--ui-apd-ease);
}
.ui-apd__tabs button {
  position: relative;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: none;
  box-shadow: inset 0 0 0 0.5px var(--ui-apd-line);
  font-size: 13px;
  color: var(--ui-apd-text);
  cursor: pointer;
  transition: color 140ms;
}
.ui-apd__tabs button[aria-selected="true"] {
  color: var(--ui-apd-ink);
}
.ui-apd__right {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.ui-apd__search {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 254px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--ui-apd-card);
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 1px 1px -1px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
  color: var(--ui-apd-muted);
  transition: box-shadow 140ms;
}
.ui-apd__search:focus-within {
  box-shadow: 0 0 0 1px var(--ui-apd-focus);
}
.ui-apd__search input {
  flex: 1;
  width: 0;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: none;
  color: var(--ui-apd-ink);
  font-size: 13px;
  line-height: 20px;
  text-overflow: ellipsis;
}
.ui-apd__search input::-webkit-search-cancel-button {
  display: none;
}
.ui-apd__search input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.ui-apd__search button {
  display: grid;
  place-items: center;
  flex: none;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  color: var(--ui-apd-muted);
  cursor: pointer;
}
.ui-apd button:focus-visible {
  outline: 2px solid var(--ui-apd-focus);
  outline-offset: 2px;
}
.ui-apd__tabs button:active,
.ui-apd__more:active {
  transform: scale(0.97);
}
.ui-apd__section {
  margin-top: 38px;
  animation: ui-apd-rise 420ms var(--ui-apd-ease) both;
}
.ui-apd__section + .ui-apd__section {
  margin-top: 46px;
}
.ui-apd h2 {
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
}
.ui-apd__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 32px;
  margin-top: 12px;
}
.ui-apd__revealed {
  animation: ui-apd-rise 420ms var(--ui-apd-ease) both;
}
.ui-apd__more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  margin-top: 8px;
  padding: 4px 8px 4px 4px;
  border: 0;
  border-radius: 10px;
  background: none;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-apd-text);
  cursor: pointer;
  transition: background-color 140ms;
}
.ui-apd__more > span:nth-child(2) {
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-apd__more > svg {
  rotate: -90deg;
  color: var(--ui-apd-muted);
}
.ui-apd__logos {
  display: flex;
  flex: none;
  gap: 3px;
  padding: 3px;
  border-radius: 9px;
  background: var(--ui-apd-card);
  box-shadow:
    0 0 0 0.5px var(--ui-apd-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-apd__logos .ui-icd__logo {
  width: 20px;
  height: 20px;
  border-radius: 6px;
}
.ui-apd__logos .ui-icd__logo svg {
  width: 12px;
  height: 12px;
}
.ui-apd__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  padding: 48px 24px 52px;
  border-radius: 12px;
  background: var(--ui-apd-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-apd-line);
  text-align: center;
}
.ui-apd__empty > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--ui-apd-chip);
  color: var(--ui-apd-muted);
}
.ui-apd__empty b {
  margin-top: 16px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.ui-apd__empty p {
  max-width: 430px;
  margin: 4px 0 0;
  color: var(--ui-apd-muted);
  text-wrap: balance;
}
@keyframes ui-apd-rise {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@media (hover: hover) and (pointer: fine) {
  .ui-apd__tabs button:hover {
    color: var(--ui-apd-ink);
  }
  .ui-apd__more:hover,
  .ui-apd__search button:hover {
    background: var(--ui-apd-chip);
  }
}
@container ui-apd (max-width:696px) {
  .ui-apd__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@container ui-as (max-width:900px) {
  .ui-apd {
    width: calc(100% - 48px);
  }
}
@container ui-as (max-width:600px) {
  .ui-apd {
    width: calc(100% - 32px);
    padding: 52px 0 48px;
  }
}
@container ui-apd (max-width:536px) {
  .ui-apd__bar {
    flex-wrap: wrap;
    gap: 10px;
    margin: 8px -12px 0;
    padding: 18px 12px 10px;
  }
  .ui-apd__tabs {
    gap: 6px;
  }
  .ui-apd__right {
    display: contents;
  }
  .ui-apd__search {
    order: 3;
    width: 100%;
  }
  .ui-apd__bar > .ui-apd__right > .ui-irq {
    margin-left: auto;
  }
  .ui-apd__section {
    margin-top: 30px;
  }
  .ui-apd__section + .ui-apd__section {
    margin-top: 36px;
  }
  .ui-apd__more {
    flex-wrap: wrap;
    text-align: left;
  }
}
@media (pointer: coarse) {
  .ui-apd__tabs button,
  .ui-apd__pill,
  .ui-apd__search {
    height: 34px;
  }
  .ui-apd__search input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-apd,
  .ui-apd *,
  .ui-apd *::before,
  .ui-apd *::after {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-apd {
  --ui-apd-card: #1c1c1e;
  --ui-apd-ink: rgba(255, 255, 255, 0.9);
  --ui-apd-strong: #fff;
  --ui-apd-text: rgba(255, 255, 255, 0.62);
  --ui-apd-muted: rgba(255, 255, 255, 0.45);
  --ui-apd-line: rgba(255, 255, 255, 0.08);
  --ui-apd-chip: rgba(255, 255, 255, 0.06);
  --ui-apd-select: rgba(255, 255, 255, 0.08);
  --ui-apd-frame: rgba(255, 255, 255, 0.03);
  --ui-apd-focus: #4d8dff;
}
:where(.dark, [data-theme="dark"]) .ui-apd__search input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.ui-icd {
  --ui-icd-ink: #171717;
  --ui-icd-text: #404040;
  --ui-icd-muted: #737373;
  --ui-icd-faint: #b5b5b5;
  --ui-icd-line: #e5e5e5;
  --ui-icd-focus: #2f6bff;
  --ui-icd-shadow: 0 0 0 1px var(--ui-icd-line), 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-icd .ui-icd__action {
  width: 32px;
  height: 32px;
  border-radius: 10px;
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
.ui-apd {
  --ui-apd-ink: #171717;
  --ui-apd-text: #404040;
  --ui-apd-muted: #737373;
  --ui-apd-line: #e5e5e5;
  --ui-apd-chip: #f5f5f5;
  --ui-apd-focus: #2f6bff;
}
:where(.dark, [data-theme="dark"]) .ui-icd {
  --ui-icd-card: #232326;
  --ui-icd-ink: #ededed;
  --ui-icd-text: #c4c4c4;
  --ui-icd-muted: #8f8f8f;
  --ui-icd-line: rgba(255, 255, 255, 0.1);
  --ui-icd-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-irq {
  --ui-irq-card: #232326;
  --ui-irq-ink: #ededed;
  --ui-irq-muted: #8f8f8f;
  --ui-irq-line: rgba(255, 255, 255, 0.1);
  --ui-irq-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-apd {
  --ui-apd-card: #232326;
  --ui-apd-ink: #ededed;
  --ui-apd-strong: #fff;
  --ui-apd-text: #c4c4c4;
  --ui-apd-muted: #8f8f8f;
  --ui-apd-line: rgba(255, 255, 255, 0.1);
  --ui-apd-chip: #2a2a2d;
  --ui-apd-focus: #6b95ff;
}

`;
