"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * agent-thread (Classic) – a self-contained React 19 component.
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

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useMorph(value: string) {
  const ref = useRef<HTMLButtonElement>(null);
  const previous = useRef<number | null>(null);
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    animation.current?.cancel();
    const width = el.getBoundingClientRect().width;
    if (
      previous.current !== null &&
      Math.abs(previous.current - width) > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animation.current = el.animate([{ width: `${previous.current}px` }, { width: `${width}px` }], {
        duration: 480,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      });
    }
    previous.current = width;
    return () => animation.current?.cancel();
  }, [value]);
  return ref;
}

function moveMenuFocus(event: KeyboardEvent<HTMLElement>) {
  if ((event.target as HTMLElement).matches("input,textarea")) return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),[role="option"][tabindex]'),
  ].filter((el) => !el.closest("[inert],[hidden]") && el.getClientRects().length > 0);
  const index = items.indexOf(document.activeElement as HTMLElement);
  const next =
    event.key === "ArrowDown"
      ? (index + 1) % items.length
      : event.key === "ArrowUp"
        ? (index - 1 + items.length) % items.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : null;
  if (next === null || !items.length) return;
  event.preventDefault();
  items[next]?.focus();
}

function FloatingMenu({
  anchor,
  root,
  children,
  onClose,
  className,
  id,
  label,
  side = "bottom",
  align = "start",
}: {
  anchor: RefObject<HTMLElement | null>;
  root: RefObject<HTMLElement | null>;
  children: ReactNode;
  onClose: () => void;
  className: string;
  id: string;
  label: string;
  side?: "top" | "bottom" | "right";
  align?: "start" | "end";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 400 });
  useLayoutEffect(() => {
    const update = () => {
      const origin = root.current,
        target = anchor.current,
        menu = ref.current;
      if (!origin || !target || !menu) return;
      const a = target.getBoundingClientRect(),
        r = origin.getBoundingClientRect();
      const boundary = origin.closest<HTMLElement>("[data-overlay-boundary]")?.getBoundingClientRect();
      const leftEdge = Math.max(8, (boundary?.left ?? 0) + 8),
        rightEdge = Math.min(window.innerWidth - 8, (boundary?.right ?? window.innerWidth) - 8);
      const topEdge = Math.max(8, (boundary?.top ?? 0) + 8),
        bottomEdge = Math.min(window.innerHeight - 8, (boundary?.bottom ?? window.innerHeight) - 8);
      const maxHeight = Math.max(80, bottomEdge - topEdge);
      const width = menu.offsetWidth,
        height = Math.min(menu.scrollHeight, maxHeight);
      let x = side === "right" ? a.right + 10 : align === "end" ? a.right - width : a.left;
      let y = side === "top" ? a.top - height - 8 : side === "right" ? a.top : a.bottom + 8;
      if (side === "bottom" && y + height > bottomEdge && a.top - height - 8 >= topEdge) y = a.top - height - 8;
      x = Math.max(leftEdge, Math.min(x, rightEdge - width));
      y = Math.max(topEdge, Math.min(y, bottomEdge - height));
      setPosition({ left: x - r.left + origin.scrollLeft, top: y - r.top + origin.scrollTop, maxHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchor, root, side, align]);
  useEffect(() => {
    const target = anchor.current;
    ref.current
      ?.querySelector<HTMLElement>('[aria-checked="true"],input,button:not(:disabled)')
      ?.focus({ preventScroll: true });
    const dismiss = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node) && !anchor.current?.contains(event.target as Node))
        closeRef.current();
    };
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        target?.focus({ preventScroll: true });
      }
      if (event.key === "Tab") {
        closeRef.current();
        target?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", dismiss, true);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss, true);
      document.removeEventListener("keydown", key, true);
    };
  }, [anchor]);
  return (
    <div
      ref={ref}
      id={id}
      className={className}
      role="menu"
      aria-label={label}
      style={{ position: "absolute", ...position, zIndex: 50 }}
      onKeyDown={moveMenuFocus}
    >
      {children}
    </div>
  );
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

function durationLabel(ms: number) {
  return `${(Math.max(0, Number.isFinite(ms) ? ms : 0) / 1000).toFixed(1)}s`;
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

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input,textarea,select,[contenteditable="true"]');
}

export type ToolActivityItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  status: "running" | "done" | "failed" | "stopped";
  startedAt?: number;
  duration?: number;
  error?: string;
};

const defaultToolActivityLabels = {
  retry: "Retry",
  running: (count: number) => `Running ${count === 1 ? "a tool" : `${count} tools in parallel`}`,
  stopped: (done: number, count: number) => `Stopped · ${done} of ${count} ran`,
  completed: (count: number, failed: number, duration: string) =>
    `Ran ${count} ${count === 1 ? "tool" : "tools"} · ${failed ? `${failed} failed` : duration}`,
  duration: durationLabel,
};
export type ToolActivityLabels = typeof defaultToolActivityLabels;
export type ToolActivityProps = {
  labels?: Partial<ToolActivityLabels>;
  tools: ToolActivityItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRetry?: (id: string) => void;
  className?: string;
};

/** A quiet, collapsible tool trace; active calls expand and count time, finished calls settle into one line. */
export function ToolActivity({
  tools: rawTools,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onRetry,
  labels: labelsProp,
  className,
}: ToolActivityProps) {
  const labels = { ...defaultToolActivityLabels, ...labelsProp };
  const tools = (Array.isArray(rawTools) ? rawTools : []).filter(Boolean);
  const running = tools.some((tool) => tool.status === "running");
  const failed = tools.filter((tool) => tool.status === "failed").length;
  const [manual, setManual] = useState<boolean | undefined>(defaultOpen);
  const [settling, setSettling] = useState(false);
  const wasRunning = useRef(running);
  const [now, setNow] = useState(0);
  const id = useId();
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    const finished = wasRunning.current && !running;
    wasRunning.current = running;
    if (!finished) return;
    setSettling(true);
    const timer = window.setTimeout(() => setSettling(false), 650);
    return () => window.clearTimeout(timer);
  }, [running]);
  const open = openProp ?? manual ?? (running || settling || failed > 0);
  const elapsed = (tool: ToolActivityItem) =>
    tool.status === "running"
      ? Math.max(0, (now || tool.startedAt || 0) - (tool.startedAt ?? now))
      : (tool.duration ?? 0);
  const total = Math.max(0, ...tools.map(elapsed));
  const stopped = tools.some((tool) => tool.status === "stopped");
  const label = running
    ? labels.running(tools.length)
    : stopped
      ? labels.stopped(tools.filter((tool) => tool.status === "done").length, tools.length)
      : labels.completed(tools.length, failed, labels.duration(total));
  return (
    <div
      className={["ui-ta", className].filter(Boolean).join(" ")}
      data-open={open}
      data-state={running ? "running" : failed ? "failed" : "done"}
    >
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      <button
        type="button"
        className="ui-ta__head"
        aria-expanded={open}
        aria-controls={`${id}-tools`}
        onClick={() => {
          if (openProp === undefined) setManual(!open);
          onOpenChange?.(!open);
        }}
      >
        <span className="ui-ta__status" data-spinning={running || undefined}>
          <Icon name={running ? "play" : failed ? "warning" : "check"} size={14} />
        </span>
        <span className="ui-ta__title" data-text={label} data-shimmer={running || undefined}>
          {label}
        </span>
        <span className="ui-ta__chevron">
          <Icon name="chevron" size={12} />
        </span>
      </button>
      <div id={`${id}-tools`} className="ui-ta__wrap" inert={!open}>
        <ul className="ui-ta__list">
          {tools.map((tool, index) => {
            const status = ["running", "done", "failed", "stopped"].includes(tool.status) ? tool.status : "done";
            return (
              <li
                className="ui-ta__tool"
                data-status={status}
                key={tool.id}
                style={{ "--ui-ta-index": index } as CSSProperties}
              >
                <span className="ui-ta__mark" data-spinning={status === "running" || undefined}>
                  <Icon
                    name={
                      status === "running"
                        ? "play"
                        : status === "failed"
                          ? "warning"
                          : status === "stopped"
                            ? "stop"
                            : "check"
                    }
                    size={12}
                  />
                </span>
                <span
                  className="ui-ta__icon"
                  onErrorCapture={(event) => {
                    if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                  }}
                >
                  {tool.icon ?? <Icon name={index ? "globe" : "search"} size={13} />}
                </span>
                <span className="ui-ta__label" dir="auto" title={tool.error ?? tool.label}>
                  {tool.label}
                  {tool.error && <small>{tool.error}</small>}
                </span>
                <span className="ui-ta__time">{labels.duration(elapsed(tool))}</span>
                {status === "failed" && onRetry && (
                  <button type="button" className="ui-ta__retry" onClick={() => onRetry(tool.id)}>
                    {labels.retry}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export type ChatComposerModel = { id: string; name: string; provider?: string; icon?: ReactNode; description?: string };
export type ChatComposerApproval = "request" | "auto" | "full";
export type ChatComposerAttachment = { id: string; name: string; size?: number; file?: File };
export type ChatComposerSendOptions = {
  model: string;
  approval: ChatComposerApproval;
  planMode: boolean;
  attachments: ChatComposerAttachment[];
};
export type ChatComposerProps = {
  /** Sending emits an intent without clearing the draft/attachments. Voice services stay caller-owned. */
  managed?: boolean;
  labels?: Partial<ChatComposerLabels>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (message: string, options: ChatComposerSendOptions) => void;
  placeholder?: string;
  models?: ChatComposerModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  approval?: ChatComposerApproval;
  defaultApproval?: ChatComposerApproval;
  onApprovalChange?: (approval: ChatComposerApproval) => void;
  planMode?: boolean;
  defaultPlanMode?: boolean;
  onPlanModeChange?: (enabled: boolean) => void;
  attachments?: ChatComposerAttachment[];
  defaultAttachments?: ChatComposerAttachment[];
  onAttachmentsChange?: (attachments: ChatComposerAttachment[]) => void;
  onAction?: (action: string) => void;
  /** Optional speech service. Without one, recorded audio is attached as a voice note. */
  transcribe?: (audio: Blob, signal: AbortSignal) => Promise<string>;
  disabled?: boolean;
  busy?: boolean;
  /** Keep typing and attaching available while a parent waits for uploads. */
  sendDisabled?: boolean;
  showAttachments?: boolean;
  /** Optional footer, rendered below the input card. */
  footer?: ReactNode;
  /** Replace the entire toolbar and its built-in actions/Enter shortcut. null hides it. */
  toolbar?: ReactNode;
  /** Positioned above the textarea, e.g. a caller-owned slash listbox. */
  overlay?: ReactNode;
  textareaProps?: Omit<ComponentPropsWithRef<"textarea">, "value" | "defaultValue" | "onChange">;
  className?: string;
};

const composerModels: ChatComposerModel[] = [
  { id: "auto", name: "Auto", description: "Choose the best model for this task" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic" },
  { id: "claude-opus", name: "Claude Opus", provider: "Anthropic" },
  { id: "claude-haiku", name: "Claude Haiku", provider: "Anthropic" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI" },
  { id: "gpt-5-mini", name: "GPT-5 mini", provider: "OpenAI" },
];
const approvalOptions: { id: ChatComposerApproval; label: string; description: string; icon: IconName }[] = [
  {
    id: "request",
    label: "Request approval",
    description: "Always ask before editing outside files or using the internet",
    icon: "hand",
  },
  { id: "auto", label: "Approve for me", description: "Only ask for potentially unsafe actions", icon: "check" },
  {
    id: "full",
    label: "Full access",
    description: "Unrestricted access to the internet and all files on your computer",
    icon: "spark",
  },
];
const defaultChatComposerLabels = {
  attachments: "Attachments",
  removeAttachment: (name: string) => `Remove ${name}`,
  composer: "Message composer",
  message: "Message",
  placeholder: "Ask anything – it searches the web",
  transcribing: "Transcribing…",
  add: "Add",
  plan: "Plan",
  voiceRecording: "Voice recording",
  discardRecording: "Discard recording",
  useRecording: "Use recording",
  voiceInput: "Voice input",
  send: "Send message",
  dismiss: "Dismiss message",
  attachFiles: "Attach files",
  permissions: "Permissions",
  models: "Models",
  connectApps: "Connect apps",
  addToChat: "Add to the chat",
  files: "Files and folders",
  connected: (count: number) => `${count} connected`,
  goal: "Goal",
  goalDescription: "Set a goal to keep working toward",
  planMode: "Plan mode",
  planDescription: (enabled: boolean) => (enabled ? "Turn off plan mode" : "Turn on plan mode"),
  skill: "Record a skill",
  draw: "Draw",
  drawDescription: "Sketch a drawing",
  plugins: "Plugins",
  documents: "Documents",
  documentsDescription: "Create and edit documents",
  pdf: "PDF",
  pdfDescription: "Read, create and verify PDFs",
  webSearch: "Web search",
  approval: (id: ChatComposerApproval) => approvalOptions.find((option) => option.id === id)!.label,
  approvalDescription: (id: ChatComposerApproval) => approvalOptions.find((option) => option.id === id)!.description,
  voiceUnavailable: "Voice recording is unavailable in this browser.",
  transcriptionFailed: "Couldn't transcribe this recording. Please try again.",
  microphoneDenied: "Microphone access was declined. You can still type a message.",
  recordingFailed: "Couldn't start recording.",
  voiceNote: "Voice note.webm",
};
export type ChatComposerLabels = typeof defaultChatComposerLabels;

/** A compact composer with keyboard submission, animated model/permission controls and attachment/voice input. */
export function ChatComposer({
  managed = false,
  labels: labelsProp,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  placeholder,
  models = composerModels,
  model: modelProp,
  defaultModel = "auto",
  onModelChange,
  approval: approvalProp,
  defaultApproval = "request",
  onApprovalChange,
  planMode: planProp,
  defaultPlanMode = false,
  onPlanModeChange,
  attachments: attachmentsProp,
  defaultAttachments = [],
  onAttachmentsChange,
  onAction,
  transcribe,
  disabled = false,
  busy = false,
  sendDisabled = false,
  showAttachments = true,
  footer,
  toolbar,
  overlay,
  textareaProps,
  className,
}: ChatComposerProps) {
  const labels = { ...defaultChatComposerLabels, ...labelsProp };
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [model, setModel] = useControllable(modelProp, defaultModel, onModelChange);
  const [rawApproval, setApproval] = useControllable(approvalProp, defaultApproval, onApprovalChange);
  const approval = approvalOptions.find((option) => option.id === rawApproval) ?? approvalOptions[0];
  const [plan, setPlan] = useControllable(planProp, defaultPlanMode, onPlanModeChange);
  const [attachments, setAttachments] = useControllable(attachmentsProp, defaultAttachments, onAttachmentsChange);
  const [menu, setMenu] = useState<"model" | "approval" | "add" | "apps" | null>(null);
  const [connected, setConnected] = useState(["Web search"]);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    fileInput = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null),
    modelRef = useMorph(model),
    approvalRef = useMorph(approval.id);
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    recordingAction = useRef(false);
  const chunks = useRef<Blob[]>([]),
    mounted = useRef(true),
    pending = useRef<AbortController | null>(null);
  const voiceEnabled = !managed && toolbar === undefined;
  const voiceEnabledRef = useRef(voiceEnabled);
  voiceEnabledRef.current = voiceEnabled;
  const textareaRef = textareaProps?.ref;
  const mergedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      input.current = node;
      if (typeof textareaRef === "function") {
        const cleanup = textareaRef(node);
        return () => {
          input.current = null;
          if (cleanup) cleanup();
          else textareaRef(null);
        };
      }
      if (textareaRef) textareaRef.current = node;
      return () => {
        input.current = null;
        if (textareaRef) textareaRef.current = null;
      };
    },
    [textareaRef],
  );
  const id = useId();
  const list = (Array.isArray(models) ? models : []).filter(Boolean);
  const selectedModel = list.find((item) => item.id === model) ?? list[0];
  const blocked = disabled || !!textareaProps?.disabled || !!textareaProps?.readOnly || busy || transcribing;
  const canSend = !blocked && !sendDisabled && (!!value.trim() || attachments.length > 0);
  useLayoutEffect(() => {
    const el = input.current;
    if (el) {
      el.style.height = "0px";
      el.style.height = `${Math.min(180, Math.max(40, el.scrollHeight))}px`;
    }
  }, [value]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);
  useEffect(() => {
    if (toolbar !== undefined) setMenu(null);
    if (!voiceEnabled) {
      pending.current?.abort();
      recordingAction.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
      setRecording(false);
      setTranscribing(false);
    }
  }, [toolbar, voiceEnabled]);
  const send = () => {
    if (toolbar !== undefined || !canSend) return;
    onSend?.(value.trim(), {
      model: selectedModel?.id ?? "auto",
      approval: approval.id,
      planMode: plan,
      attachments: [...attachments],
    });
    if (!managed) {
      setValue("");
      setAttachments([]);
    }
    setMenu(null);
    input.current?.focus();
  };
  const attachFiles = (files: FileList | File[] | null) => {
    if (!files) return;
    setAttachments([
      ...attachments,
      ...Array.from(files).map((file, index) => ({
        id: `${id}-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        file,
      })),
    ]);
    input.current?.focus();
  };
  const stopRecording = (use: boolean) => {
    recordingAction.current = use;
    if (recorder.current?.state === "recording") recorder.current.stop();
    setRecording(false);
    input.current?.focus();
  };
  const startRecording = async () => {
    if (blocked || !voiceEnabled) return;
    setError("");
    setMenu(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        setError(labels.voiceUnavailable);
        return;
      }
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || !voiceEnabledRef.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      chunks.current = [];
      recordingAction.current = false;
      const next = new MediaRecorder(media);
      recorder.current = next;
      next.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      next.onstop = async () => {
        media.getTracks().forEach((track) => track.stop());
        if (!mounted.current || !voiceEnabledRef.current || !recordingAction.current) return;
        const blob = new Blob(chunks.current, { type: next.mimeType || "audio/webm" });
        if (!transcribe) {
          const file = new File([blob], labels.voiceNote, { type: blob.type });
          attachFiles([file]);
          return;
        }
        const controller = new AbortController();
        pending.current = controller;
        setTranscribing(true);
        try {
          const text = await transcribe(blob, controller.signal);
          if (mounted.current && !controller.signal.aborted)
            setValue(`${value.trimEnd()}${value.trim() ? " " : ""}${text}`);
        } catch {
          if (mounted.current && !controller.signal.aborted) setError(labels.transcriptionFailed);
        } finally {
          if (mounted.current) setTranscribing(false);
        }
      };
      next.start();
      setRecordingSeconds(0);
      setRecording(true);
    } catch (reason) {
      if (mounted.current)
        setError(
          reason instanceof DOMException && reason.name === "NotAllowedError"
            ? labels.microphoneDenied
            : labels.recordingFailed,
        );
    }
  };
  const chooseAction = (action: string) => {
    if (action === "files") fileInput.current?.click();
    if (action === "plan") setPlan(!plan);
    if (action === "apps") {
      setMenu("apps");
      return;
    }
    onAction?.(action);
    setMenu(null);
    input.current?.focus();
  };
  const anchor = menu === "model" ? modelRef : menu === "approval" ? approvalRef : addRef;
  const toggle = (next: typeof menu) => setMenu(menu === next ? null : next);
  const triggerKey = (next: typeof menu) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      setMenu(next);
    }
  };
  return (
    <div
      ref={root}
      className={["ui-cc", className].filter(Boolean).join(" ")}
      data-menu-open={!!menu || undefined}
      data-recording={recording || undefined}
      data-disabled={disabled || undefined}
    >
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      {overlay !== undefined && <div className="ui-cc__overlay">{overlay}</div>}
      {showAttachments && attachments.length > 0 && (
        <ul className="ui-cc__attachments" aria-label={labels.attachments}>
          {attachments.map((file) => (
            <li key={file.id}>
              <Icon name="document" size={14} />
              <span title={file.name}>{file.name}</span>
              <button
                type="button"
                disabled={disabled}
                aria-label={labels.removeAttachment(file.name)}
                onClick={() => setAttachments(attachments.filter((item) => item.id !== file.id))}
              >
                <Icon name="close" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <section
        className="ui-cc__body"
        aria-label={labels.composer}
        aria-busy={transcribing || busy}
        onKeyDown={(event) => {
          if (!event.defaultPrevented && event.key === "Escape" && recording) {
            event.preventDefault();
            stopRecording(false);
          }
        }}
      >
        <textarea
          aria-label={labels.message}
          placeholder={transcribing ? labels.transcribing : (placeholder ?? labels.placeholder)}
          dir="auto"
          rows={2}
          {...textareaProps}
          ref={mergedRef}
          className={["ui-cc__message", textareaProps?.className].filter(Boolean).join(" ")}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled || textareaProps?.disabled}
          readOnly={recording || transcribing || textareaProps?.readOnly}
          onKeyDown={(event) => {
            textareaProps?.onKeyDown?.(event);
            if (
              !event.defaultPrevented &&
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing &&
              !event.repeat &&
              toolbar === undefined
            ) {
              event.preventDefault();
              send();
            }
          }}
        />
        {toolbar !== undefined ? (
          toolbar
        ) : (
          <div className="ui-cc__tools">
            <div className="ui-cc__group" inert={recording}>
              <button
                ref={addRef}
                type="button"
                className="ui-cc__icon-btn"
                aria-label={labels.add}
                disabled={blocked}
                aria-haspopup="menu"
                aria-expanded={menu === "add" || menu === "apps"}
                aria-controls={menu === "add" || menu === "apps" ? `${id}-menu` : undefined}
                onKeyDown={triggerKey("add")}
                onClick={() => toggle("add")}
              >
                <Icon name="plus" />
              </button>
              <button
                ref={approvalRef}
                type="button"
                className="ui-cc__approval"
                data-tone={approval.id}
                disabled={blocked}
                aria-haspopup="menu"
                aria-expanded={menu === "approval"}
                aria-controls={menu === "approval" ? `${id}-menu` : undefined}
                onKeyDown={triggerKey("approval")}
                onClick={() => toggle("approval")}
              >
                <span className="ui-cc__face" key={approval.id}>
                  <Icon name={approval.icon} size={14} />
                  <span>{labels.approval(approval.id)}</span>
                </span>
              </button>
              {plan && <span className="ui-cc__plan">{labels.plan}</span>}
            </div>
            {recording ? (
              <div className="ui-cc__recording" role="group" aria-label={labels.voiceRecording}>
                <span className="ui-cc__timer">
                  {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, "0")}
                </span>
                <span className="ui-cc__wave" aria-hidden="true">
                  {Array.from({ length: 22 }, (_, index) => (
                    <i
                      key={index}
                      style={{ height: `${4 + ((index * 7) % 14)}px`, animationDelay: `${index * -71}ms` }}
                    />
                  ))}
                </span>
                <button
                  type="button"
                  className="ui-cc__icon-btn"
                  aria-label={labels.discardRecording}
                  onClick={() => stopRecording(false)}
                >
                  <Icon name="close" />
                </button>
                <button
                  type="button"
                  className="ui-cc__send"
                  aria-label={labels.useRecording}
                  onClick={() => stopRecording(true)}
                >
                  <Icon name="check" />
                </button>
              </div>
            ) : (
              <div className="ui-cc__group ui-cc__group--end">
                {selectedModel && (
                  <button
                    ref={modelRef}
                    type="button"
                    className="ui-cc__model"
                    disabled={blocked}
                    aria-haspopup="menu"
                    aria-expanded={menu === "model"}
                    aria-controls={menu === "model" ? `${id}-menu` : undefined}
                    onKeyDown={triggerKey("model")}
                    onClick={() => toggle("model")}
                  >
                    <span
                      className="ui-cc__face"
                      key={selectedModel.id}
                      onErrorCapture={(event) => {
                        if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                      }}
                    >
                      {selectedModel.icon}
                      <span title={selectedModel.name}>{selectedModel.name}</span>
                    </span>
                    <Icon name="chevron" size={12} />
                  </button>
                )}
                <button
                  type="button"
                  className="ui-cc__icon-btn"
                  aria-label={labels.voiceInput}
                  disabled={blocked || !voiceEnabled}
                  onClick={startRecording}
                >
                  <Icon name="mic" />
                </button>
                <button
                  type="button"
                  className="ui-cc__send"
                  aria-label={labels.send}
                  disabled={!canSend}
                  onClick={send}
                >
                  <Icon name="send" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
      {footer && <div className="ui-cc__footer">{footer}</div>}
      {error && (
        <p className="ui-cc__error" role="alert">
          {error}
          <button type="button" aria-label={labels.dismiss} onClick={() => setError("")}>
            <Icon name="close" size={12} />
          </button>
        </p>
      )}
      {toolbar === undefined && (
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          disabled={blocked}
          aria-label={labels.attachFiles}
          onChange={(event) => {
            attachFiles(event.target.files);
            event.target.value = "";
          }}
        />
      )}
      {toolbar === undefined && menu && (
        <FloatingMenu
          key={menu}
          anchor={anchor}
          root={root}
          className="ui-cc__menu"
          id={`${id}-menu`}
          label={
            menu === "approval"
              ? labels.permissions
              : menu === "model"
                ? labels.models
                : menu === "apps"
                  ? labels.connectApps
                  : labels.addToChat
          }
          side="top"
          align={menu === "model" ? "end" : "start"}
          onClose={() => setMenu(null)}
        >
          {menu === "model" && (
            <>
              <div className="ui-cc__menu-title">{labels.models}</div>
              {list.map((item) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedModel?.id === item.id}
                  className="ui-cc__option"
                  key={item.id}
                  onClick={() => {
                    setModel(item.id);
                    setMenu(null);
                    modelRef.current?.focus();
                  }}
                >
                  <span
                    className="ui-cc__option-logo"
                    aria-hidden="true"
                    onErrorCapture={(event) => {
                      if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                    }}
                  >
                    {item.icon ??
                      (item.id === "auto" ? (
                        <Icon name="spark" />
                      ) : (
                        <span>{initials(item.provider ?? item.name).slice(0, 1)}</span>
                      ))}
                  </span>
                  <span className="ui-cc__option-text">
                    <span>{item.name}</span>
                    {item.description && <small>{item.description}</small>}
                  </span>
                  {selectedModel?.id === item.id && <Icon name="check" size={14} />}
                </button>
              ))}
            </>
          )}
          {menu === "approval" && (
            <>
              <div className="ui-cc__menu-title">{labels.permissions}</div>
              {approvalOptions.map((item) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={approval.id === item.id}
                  className="ui-cc__option"
                  key={item.id}
                  onClick={() => {
                    setApproval(item.id);
                    setMenu(null);
                    approvalRef.current?.focus();
                  }}
                >
                  <span className="ui-cc__option-logo" aria-hidden="true">
                    <Icon name={item.icon} />
                  </span>
                  <span className="ui-cc__option-text">
                    <span>{labels.approval(item.id)}</span>
                    <small>{labels.approvalDescription(item.id)}</small>
                  </span>
                  {approval.id === item.id && <Icon name="check" size={14} />}
                </button>
              ))}
            </>
          )}
          {menu === "add" && (
            <>
              <div className="ui-cc__menu-title">{labels.add}</div>
              {(
                [
                  ["files", labels.files, "", "document"],
                  ["apps", labels.connectApps, labels.connected(connected.length), "plug"],
                  ["goal", labels.goal, labels.goalDescription, "tasks"],
                  ["plan", labels.planMode, labels.planDescription(plan), "compose"],
                  ["skill", labels.skill, "", "play"],
                  ["draw", labels.draw, labels.drawDescription, "compose"],
                ] as const
              ).map(([action, label, description, icon]) => (
                <button
                  type="button"
                  role={action === "plan" ? "menuitemcheckbox" : "menuitem"}
                  aria-checked={action === "plan" ? plan : undefined}
                  className="ui-cc__option"
                  key={action}
                  onClick={() => chooseAction(action)}
                >
                  <span className="ui-cc__option-logo" aria-hidden="true">
                    <Icon name={icon} />
                  </span>
                  <span className="ui-cc__option-text">
                    <span>{label}</span>
                    {description && <small>{description}</small>}
                  </span>
                  {action === "plan" && plan && <Icon name="check" size={14} />}
                </button>
              ))}
              <div className="ui-cc__menu-title">{labels.plugins}</div>
              {(
                [
                  ["document", labels.documents, labels.documentsDescription],
                  ["pdf", labels.pdf, labels.pdfDescription],
                ] as const
              ).map(([action, label, description]) => (
                <button
                  type="button"
                  role="menuitem"
                  className="ui-cc__option"
                  key={action}
                  onClick={() => chooseAction(action)}
                >
                  <span className="ui-cc__option-logo" aria-hidden="true">
                    <Icon name="document" />
                  </span>
                  <span className="ui-cc__option-text">
                    <span>{label}</span>
                    <small>{description}</small>
                  </span>
                </button>
              ))}
            </>
          )}
          {menu === "apps" && (
            <>
              <div className="ui-cc__menu-title">{labels.connectApps}</div>
              {["Web search", "Google Drive", "Gmail", "Notion"].map((app) => (
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={connected.includes(app)}
                  className="ui-cc__option"
                  key={app}
                  onClick={() => {
                    setConnected(
                      connected.includes(app) ? connected.filter((item) => item !== app) : [...connected, app],
                    );
                    onAction?.(`connect:${app}`);
                  }}
                >
                  <Icon name={app === "Web search" ? "globe" : "plug"} />
                  <span className="ui-cc__option-text">{app === "Web search" ? labels.webSearch : app}</span>
                  {connected.includes(app) && <Icon name="check" size={14} />}
                </button>
              ))}
            </>
          )}
        </FloatingMenu>
      )}
    </div>
  );
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
      <style href="ui-agent-thread" precedence="default">
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

export type ThreadDecisionOption = {
  id: string;
  title: string;
  summary?: string;
  recommended?: boolean;
  wireframe?: "illustration" | "checklist" | "data" | ReactNode;
};
export type ThreadDecision = {
  id: string;
  kind?: "decision" | "pick" | "approval";
  question: string;
  task: string;
  taskId?: string;
  options?: ThreadDecisionOption[];
  facts?: { label: string; value: string }[];
  allowCustomAnswer?: boolean;
  status?: "awaiting" | "submitting" | "answered" | "expired";
  error?: string;
  answer?: ThreadDecisionAnswer;
  disabled?: boolean;
};
export type ThreadDecisionAnswer = { option?: string; text?: string } | "approve" | "decline";
const defaultDecisionDockLabels = {
  needsYou: "Needs you",
  submitting: "Submitting…",
  answered: "Answered",
  expired: "Expired",
  approved: "Approved",
  declined: "Declined",
  approve: "Approve",
  decline: "Decline",
  later: "Later",
  show: "Show",
  previous: "Previous decision",
  next: "Next decision",
  recommended: "Recommended",
  customAnswer: "Something else",
  customPlaceholder: "Something else…",
  sendCustomAnswer: "Send custom answer",
  waiting: (count: number) => `${count} ${count === 1 ? "decision" : "decisions"} waiting`,
  page: (index: number, count: number) => `${index} of ${count}`,
};
export type DecisionDockLabels = typeof defaultDecisionDockLabels;
function threadDecisionAnswerLabel(
  decision: ThreadDecision,
  answer: ThreadDecisionAnswer,
  labels: Pick<DecisionDockLabels, "approved" | "declined" | "answered">,
) {
  return answer === "approve"
    ? labels.approved
    : answer === "decline"
      ? labels.declined
      : (answer.text ?? decision.options?.find((option) => option.id === answer.option)?.title ?? labels.answered);
}
export type DecisionDockProps = {
  /** Emit answer intents only; decisions and confirmation remain caller-owned. */
  managed?: boolean;
  labels?: Partial<DecisionDockLabels>;
  decisions?: ThreadDecision[];
  defaultDecisions?: ThreadDecision[];
  onDecisionsChange?: (decisions: ThreadDecision[]) => void;
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  folded?: boolean;
  defaultFolded?: boolean;
  onFoldedChange?: (folded: boolean) => void;
  onAnswer?: (id: string, answer: ThreadDecisionAnswer) => void;
  onLater?: (id: string) => void;
  /** Increment to reveal the dock, focus its first option and pulse the card. */
  focusRequest?: number;
  className?: string;
};

export const defaultThreadDecisions: ThreadDecision[] = [
  {
    id: "queue",
    taskId: "ingest",
    task: "Ingest pipeline",
    question: "Which queue should the ingest service use?",
    options: [
      {
        id: "kafka",
        title: "Kafka",
        summary: "A durable log – a day of events to replay after a bad deploy",
        recommended: true,
      },
      { id: "sqs", title: "SQS", summary: "Managed, nothing to run – but no replay" },
      {
        id: "postgres",
        title: "Postgres queue",
        summary: "The database you already have – won't keep up with the bursts",
      },
      { id: "nats", title: "NATS JetStream", summary: "Light, with replay – a smaller community" },
    ],
  },
  {
    id: "weekly",
    kind: "approval",
    taskId: "weekly",
    task: "Weekly update",
    question: "Send the weekly update to Northwind?",
    facts: [
      { label: "To", value: "Dana Reyes, Northwind" },
      { label: "Subject", value: "Week 45: ingest is live, dashboard in review" },
      { label: "Body", value: "Ingest runs on staging and took Tuesday's spike without losing an event…" },
    ],
  },
];

/** Decisions live above the composer, with list/tile choices, approvals, a pager and a separate custom answer. */
export function DecisionDock({
  managed = false,
  labels: labelsProp,
  decisions: decisionsProp,
  defaultDecisions = [],
  onDecisionsChange,
  activeId: activeProp,
  defaultActiveId = "",
  onActiveIdChange,
  folded: foldedProp,
  defaultFolded = false,
  onFoldedChange,
  onAnswer,
  onLater,
  focusRequest = 0,
  className,
}: DecisionDockProps) {
  const labels = { ...defaultDecisionDockLabels, ...labelsProp };
  const [decisions, setDecisions] = useControllable(
    managed ? (decisionsProp ?? []) : decisionsProp,
    defaultDecisions,
    onDecisionsChange,
  );
  const [activeId, setActiveId] = useControllable(activeProp, defaultActiveId, onActiveIdChange);
  const [folded, setFolded] = useControllable(foldedProp, defaultFolded, onFoldedChange);
  const [custom, setCustom] = useState(""),
    [focused, setFocused] = useState(0);
  const root = useRef<HTMLDivElement>(null),
    customInput = useRef<HTMLInputElement>(null),
    previous = useRef<ThreadDecision | null>(null);
  const id = useId();
  const list = (Array.isArray(decisions) ? decisions : []).filter(Boolean);
  const current = list.find((decision) => decision.id === activeId) ?? list[0];
  if (current) previous.current = current;
  const decision = current ?? previous.current;
  const approval = decision?.kind === "approval";
  const legacyApproval = approval && decision?.options === undefined;
  const options: ThreadDecisionOption[] = legacyApproval
    ? [
        { id: "approve", title: labels.approve },
        { id: "decline", title: labels.decline },
      ]
    : (decision?.options ?? []).filter(Boolean);
  const status = decision?.status ?? "awaiting";
  const disabled = !!decision?.disabled || status !== "awaiting";
  const allowCustom = decision?.allowCustomAnswer !== false;
  const rows = options.length + (allowCustom ? 1 : 0);
  const activeIndex = current ? list.findIndex((item) => item.id === current.id) : 0;
  const submit = (value: ThreadDecisionAnswer) => {
    if (!current || folded || disabled) return;
    onAnswer?.(current.id, value);
    if (!managed) {
      setDecisions(list.filter((item) => item.id !== current.id));
      setActiveId("");
      setCustom("");
    }
  };
  const answer = (index: number) => {
    if (!current || folded || disabled) return;
    if (index === options.length && allowCustom) {
      setFocused(index);
      customInput.current?.focus();
      return;
    }
    const option = options[index];
    if (!option) return;
    submit(legacyApproval ? (option.id === "approve" ? "approve" : "decline") : { option: option.id });
  };
  const answerCustom = () => {
    if (allowCustom && custom.trim()) submit({ text: custom.trim() });
  };
  const later = () => {
    if (!current) return;
    setFolded(true);
    onLater?.(current.id);
  };
  const actions = useRef({ answer, later, folded, current });
  actions.current = { answer, later, folded, current };
  useEffect(() => {
    setCustom("");
    setFocused(0);
  }, [current?.id]);
  useEffect(() => {
    setFocused((index) => Math.min(index, Math.max(0, rows - 1)));
  }, [rows]);
  useEffect(() => {
    if (!focusRequest || !current) return;
    setFolded(false);
    const frame = requestAnimationFrame(() =>
      root.current?.querySelector<HTMLElement>('[role="option"]')?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusRequest]);
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      const state = actions.current;
      if (root.current?.closest("[inert]")) return;
      if (
        document.activeElement === document.body &&
        document.querySelector("[data-decision-shortcuts]:not([data-empty]):not([data-folded])") !== root.current
      )
        return;
      if (
        !state.current ||
        state.folded ||
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditing(event.target)
      )
        return;
      const area = root.current?.closest("[data-thread-shortcuts]") ?? root.current;
      if (document.activeElement !== document.body && !area?.contains(document.activeElement)) return;
      if (/^[1-9]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        if (index < rows) {
          event.preventDefault();
          state.answer(index);
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [rows]);
  if (!decision) return null;
  const focus = (index: number) => {
    setFocused(index);
    if (index === options.length) customInput.current?.focus();
    else root.current?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus();
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing || event.repeat) {
      if (event.key === "Enter" || event.key === " ") event.preventDefault();
      return;
    }
    if (event.key === "Escape" && !folded) {
      event.preventDefault();
      event.stopPropagation();
      later();
      return;
    }
    if (disabled || !rows || event.defaultPrevented || isEditing(event.target)) return;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? (focused + 1) % rows
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? (focused - 1 + rows) % rows
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? rows - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      focus(next);
    }
  };
  return (
    <div
      ref={root}
      data-decision-shortcuts=""
      className={["ui-dd", className].filter(Boolean).join(" ")}
      data-empty={!current || undefined}
      data-folded={folded || undefined}
      data-status={status}
      data-kind={approval ? "approval" : decision.kind === "pick" ? "pick" : "decision"}
      onKeyDown={keyboard}
    >
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      {folded && current && (
        <div className="ui-dd__folded">
          <span className="ui-dd__dot" />
          {labels.waiting(list.length)}
          <button
            type="button"
            aria-expanded="false"
            aria-controls={`${id}-card`}
            onClick={() => {
              setFolded(false);
              requestAnimationFrame(() =>
                root.current
                  ?.querySelector<HTMLElement>("[role=option]:not(:disabled)")
                  ?.focus({ preventScroll: true }),
              );
            }}
          >
            {labels.show}
          </button>
        </div>
      )}
      <div className="ui-dd__collapse" inert={folded || !current} aria-hidden={folded || !current}>
        <div className="ui-dd__clip">
          <section
            id={`${id}-card`}
            className="ui-dd__card"
            role="group"
            aria-labelledby={`${id}-question`}
            aria-describedby={decision.error ? `${id}-error` : undefined}
            aria-busy={status === "submitting"}
            data-pulse={focusRequest || undefined}
            key={decision.id}
          >
            <header className="ui-dd__head">
              <span className="ui-dd__tag">{status === "awaiting" ? labels.needsYou : labels[status]}</span>
              <span className="ui-dd__task" title={decision.task}>
                {decision.task}
              </span>
              {list.length > 1 && (
                <span className="ui-dd__pager">
                  <button
                    type="button"
                    aria-label={labels.previous}
                    onClick={() => setActiveId(list[(activeIndex - 1 + list.length) % list.length].id)}
                  >
                    <Icon name="chevron" size={10} />
                  </button>
                  <span>{labels.page(activeIndex + 1, list.length)}</span>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => setActiveId(list[(activeIndex + 1) % list.length].id)}
                  >
                    <Icon name="chevron" size={10} />
                  </button>
                </span>
              )}
              <button
                type="button"
                className="ui-dd__later"
                aria-expanded="true"
                aria-controls={`${id}-card`}
                onClick={later}
              >
                {labels.later}
              </button>
            </header>
            <p className="ui-dd__question" id={`${id}-question`} dir="auto">
              {decision.question}
            </p>
            {approval && decision.facts && (
              <dl className="ui-dd__facts">
                {decision.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd dir="auto" title={fact.value}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div role="status" aria-live="polite">
              {status === "answered"
                ? decision.answer === undefined
                  ? labels.answered
                  : threadDecisionAnswerLabel(decision, decision.answer, labels)
                : status === "awaiting"
                  ? null
                  : labels[status]}
            </div>
            {decision.error && (
              <p className="ui-dd__error" id={`${id}-error`} role="alert">
                {decision.error}
              </p>
            )}
            {status !== "answered" && status !== "expired" && (
              <>
                <div className="ui-dd__choices" role="listbox" aria-label={decision.question} aria-disabled={disabled}>
                  {options.map((option, index) => (
                    <button
                      type="button"
                      role="option"
                      disabled={disabled}
                      aria-selected={focused === index}
                      tabIndex={focused === index ? 0 : -1}
                      aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                      className="ui-dd__option"
                      key={option.id}
                      onFocus={() => setFocused(index)}
                      onClick={() => answer(index)}
                    >
                      {decision.kind === "pick" && (
                        <span
                          className="ui-dd__wire"
                          aria-hidden="true"
                          data-wire={
                            typeof option.wireframe === "string"
                              ? option.wireframe
                              : index === 0
                                ? "illustration"
                                : index === 1
                                  ? "checklist"
                                  : "data"
                          }
                        >
                          {typeof option.wireframe === "object" ? (
                            option.wireframe
                          ) : (
                            <svg viewBox="0 0 200 80" fill="none" aria-hidden="true">
                              <rect x="40" width="120" height="80" rx="8" fill="var(--ui-dd-card)" />
                              <g fill="var(--ui-dd-faint)">
                                {(option.wireframe ??
                                  (index === 0 ? "illustration" : index === 1 ? "checklist" : "data")) ===
                                "illustration" ? (
                                  <>
                                    <rect x="88" y="16" width="24" height="20" rx="4" />
                                    <rect x="74" y="44" width="52" height="3" rx="1.5" />
                                    <rect x="82" y="51" width="36" height="2" rx="1" opacity=".6" />
                                    <rect x="91" y="60" width="18" height="6" rx="2" />
                                  </>
                                ) : (option.wireframe ?? (index === 1 ? "checklist" : "data")) === "checklist" ? (
                                  <>
                                    <rect x="52" y="10" width="43" height="4" rx="2" />
                                    <rect x="52" y="18" width="31" height="3" rx="1.5" opacity=".6" />
                                    <rect x="52" y="25" width="94" height="1" opacity=".4" />
                                    <circle cx="56" cy="37" r="3" />
                                    <rect x="64" y="34" width="58" height="5" rx="2.5" />
                                    <g opacity=".45">
                                      <circle cx="56" cy="51" r="3" />
                                      <rect x="64" y="49" width="45" height="3" rx="1.5" />
                                      <circle cx="56" cy="64" r="3" />
                                      <rect x="64" y="62" width="54" height="3" rx="1.5" />
                                    </g>
                                  </>
                                ) : (
                                  <>
                                    <rect x="52" y="12" width="50" height="12" rx="6" />
                                    <g opacity=".45">
                                      <rect x="56" y="51" width="9" height="17" rx="2" />
                                      <rect x="72" y="39" width="9" height="29" rx="2" />
                                      <rect x="88" y="28" width="9" height="40" rx="2" />
                                      <rect x="104" y="42" width="9" height="26" rx="2" />
                                      <rect x="120" y="22" width="9" height="46" rx="2" />
                                    </g>
                                  </>
                                )}
                              </g>
                            </svg>
                          )}
                        </span>
                      )}
                      <span className="ui-dd__number">{index + 1}</span>
                      <span className="ui-dd__text">
                        <strong dir="auto">{option.title}</strong>
                        {option.summary && <small dir="auto">{option.summary}</small>}
                      </span>
                      {option.recommended && <span className="ui-dd__recommended">{labels.recommended}</span>}
                    </button>
                  ))}
                </div>
                {allowCustom && (
                  <form
                    className="ui-dd__custom"
                    onSubmit={(event) => {
                      event.preventDefault();
                      answerCustom();
                    }}
                  >
                    <span className="ui-dd__number">{rows}</span>
                    <input
                      ref={customInput}
                      disabled={disabled}
                      aria-label={labels.customAnswer}
                      placeholder={labels.customPlaceholder}
                      value={custom}
                      onFocus={() => setFocused(options.length)}
                      onChange={(event) => setCustom(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.nativeEvent.isComposing || event.repeat) {
                          if (event.key === "Enter") event.preventDefault();
                          return;
                        }
                        if (event.key === "Escape") {
                          event.preventDefault();
                          event.stopPropagation();
                          later();
                        }
                      }}
                    />
                    {custom.trim() && (
                      <button type="submit" disabled={disabled} aria-label={labels.sendCustomAnswer}>
                        <Icon name="send" size={14} />
                      </button>
                    )}
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
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
    const seconds = [5, 10, 20, 30][Math.min(attempt, 3)];
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
      <style href="ui-agent-thread" precedence="default">
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
      <style href="ui-agent-thread" precedence="default">
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

export type ThreadAttachment = {
  id: string;
  name: string;
  size?: number;
  kind?: "file" | "voice";
  file?: File;
  seconds?: number;
};
export type ThreadUpload = ThreadAttachment & {
  progress: number;
  state: "uploading" | "paused" | "done" | "failed" | "transcribing" | "waiting";
};
const defaultThreadUploadsLabels = {
  attachments: "Attachments",
  transcriptionFailed: "Transcription failed",
  uploadFailed: "Upload failed",
  retry: "Retry",
  retryFile: (name: string) => `Retry ${name}`,
  waiting: "Saved – will transcribe when you're back online",
  transcribing: "Transcribing…",
  paused: "Paused – waiting for connection",
  uploading: (name: string) => `Uploading ${name}`,
  remove: (name: string, uploading: boolean) => `${uploading ? "Cancel upload" : "Remove"} ${name}`,
  size: (bytes: number) =>
    bytes >= 1e6
      ? `${Math.round(bytes / 1e6)} MB`
      : bytes >= 1000
        ? `${Math.round(bytes / 1000)} KB`
        : `${Math.max(0, bytes)} B`,
};
export type ThreadUploadsLabels = typeof defaultThreadUploadsLabels;
export type ThreadUploadsProps = {
  uploads: ThreadUpload[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  labels?: Partial<ThreadUploadsLabels>;
  className?: string;
};

/** Upload progress, paused transfers, retryable failures and voice notes waiting for a connection. */
export function ThreadUploads({
  uploads: rawUploads,
  onRemove,
  onRetry,
  labels: labelsProp,
  className,
}: ThreadUploadsProps) {
  const labels = { ...defaultThreadUploadsLabels, ...labelsProp };
  const uploads = (Array.isArray(rawUploads) ? rawUploads : []).filter(Boolean);
  return (
    <ul className={["ui-up", className].filter(Boolean).join(" ")} aria-label={labels.attachments}>
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      {uploads.map((upload) => {
        const status = ["uploading", "paused", "done", "failed", "transcribing", "waiting"].includes(upload.state)
          ? upload.state
          : "done";
        const progress = clamp(safeNumber(upload.progress, 0), 0, 1);
        const size = upload.size === undefined ? "" : labels.size(upload.size);
        return (
          <li
            key={upload.id}
            className="ui-up__file"
            data-state={status}
            data-kind={upload.kind === "voice" ? "voice" : undefined}
          >
            <span
              className="ui-up__icon"
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
            <span className="ui-up__info">
              <strong title={upload.name} dir="auto">
                {upload.name}
                {upload.kind === "voice" && upload.seconds != null
                  ? ` · ${Math.floor(upload.seconds / 60)}:${String(upload.seconds % 60).padStart(2, "0")}`
                  : ""}
              </strong>
              <span className="ui-up__status">
                {status === "failed" ? (
                  <>
                    {upload.kind === "voice" ? labels.transcriptionFailed : labels.uploadFailed} ·{" "}
                    <button
                      type="button"
                      disabled={!onRetry}
                      aria-label={labels.retryFile(upload.name)}
                      onClick={() => onRetry?.(upload.id)}
                    >
                      {labels.retry}
                    </button>
                  </>
                ) : status === "waiting" ? (
                  labels.waiting
                ) : status === "transcribing" ? (
                  labels.transcribing
                ) : status === "paused" ? (
                  `${labels.paused}${size ? ` · ${size}` : ""}`
                ) : status === "uploading" ? (
                  `${Math.round(progress * 100)}%${size ? ` · ${size}` : ""}`
                ) : (
                  size
                )}
              </span>
              {(status === "uploading" || status === "paused") && (
                <span
                  className="ui-up__bar"
                  role="progressbar"
                  aria-label={labels.uploading(upload.name)}
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
              disabled={!onRemove}
              className="ui-up__remove"
              aria-label={labels.remove(upload.name, status === "uploading" || status === "paused")}
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

const defaultThreadVoiceInputLabels = { dictating: "Dictating", discard: "Discard recording", done: "Done" };
export type ThreadVoiceInputLabels = typeof defaultThreadVoiceInputLabels;
export type ThreadVoiceInputProps = {
  seconds: number;
  onDiscard: () => void;
  onDone: () => void;
  labels?: Partial<ThreadVoiceInputLabels>;
  className?: string;
};
/** Preview-friendly dictation controls, also useful with a caller-owned recorder. */
export function ThreadVoiceInput({ seconds, onDiscard, onDone, labels: labelsProp, className }: ThreadVoiceInputProps) {
  const labels = { ...defaultThreadVoiceInputLabels, ...labelsProp };
  const value = Math.max(0, Math.floor(safeNumber(seconds, 0)));
  return (
    <div
      className={["ui-up", "ui-up__voice", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={labels.dictating}
    >
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      <button type="button" aria-label={labels.discard} onClick={onDiscard}>
        <Icon name="close" size={16} />
      </button>
      <span className="ui-up__red-dot" />
      <span className="ui-up__wave" aria-hidden="true">
        {Array.from({ length: 56 }, (_, index) => (
          <i key={index} style={{ height: `${3 + ((index * 7) % 17)}px`, animationDelay: `${index * -83}ms` }} />
        ))}
      </span>
      <span className="ui-up__time">
        {Math.floor(value / 60)}:{String(value % 60).padStart(2, "0")}
      </span>
      <button type="button" aria-label={labels.done} onClick={onDone}>
        <Icon name="check" size={16} />
      </button>
    </div>
  );
}

export type ThreadPreset = "live" | "decision" | "scrolled" | "offline" | "uploading" | "dictating" | "away" | "error";
export type AgentMessagePart =
  | { kind: "text"; text: string }
  | { kind: "tools"; id: string; tools: (ToolActivityItem & { ms?: number })[] }
  | { kind: "task"; task: ThreadTask }
  | { kind: "decision"; ask: { id: string; question: string; task?: string; kind?: string } }
  | { kind: "artifacts"; names: string[] }
  | { kind: "error"; text: string; retry?: boolean };
export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "agent";
  text?: string;
  at?: number;
  parts?: AgentMessagePart[];
  tools?: ToolActivityItem[];
  files?: string[];
  attachments?: { name: string; size?: number }[];
  streaming?: boolean;
  stopped?: boolean;
  status?: "sent" | "sending" | "queued" | "failed";
  answer?: { id: string; question: string };
};
const defaultAgentThreadLabels = {
  conversation: "Conversation",
  emptyTitle: "What can I help you with?",
  emptyDescription: "Ask a question, explore an idea, or bring a file.",
  createdFiles: "Created files",
  youSaid: "You said:",
  youAnswered: "You answered:",
  answerContext: (question: string) => `Answered: ${question}`,
  asked: (question: string) => `Asked: ${question}`,
  answeredBelow: "answered below",
  waiting: "waiting",
  inInbox: "in Inbox",
  retry: "Retry",
  sendFailed: "Couldn't send",
  queued: "Waiting to send",
  sending: "Sending…",
  stop: "Stop",
  stopping: "Stopping…",
  stopped: "Stopped",
  responseStopped: "Response stopped",
  responseComplete: "Response complete",
  queuedAnnouncement: "Waiting to send – it goes out when you're back online",
  uploadFailed: (name: string) => `Upload failed: ${name}`,
  voiceSaved: "Voice note saved – it will transcribe when you're back online",
  voiceNote: "Voice note",
  answeredAnnouncement: (answer: string) => `Answered: ${answer}`,
  laterAnnouncement: "Later – the decision waits above the composer",
  markedRead: "Marked as read",
  running: "running",
  runningTasks: (count: number) => `${count} tasks running – open Tasks`,
  needsYou: (count: number) => `need${count === 1 ? "s" : ""} you`,
  waitingQuestions: (count: number, dock: boolean) =>
    `${count} questions waiting – ${dock ? "show the decision" : "open Inbox"}`,
  latest: "Back to latest",
  newLines: (count: number) => `${count} new lines`,
  jumpToLatest: (count: number, streaming: boolean) =>
    `Jump to latest${count ? `, ${count} new lines` : ""}${streaming ? ", still writing" : ""}`,
};
export type AgentThreadLabels = typeof defaultAgentThreadLabels & {
  decisions?: Partial<DecisionDockLabels>;
  connection?: Partial<ConnectionBannerLabels>;
  uploads?: Partial<ThreadUploadsLabels>;
  voice?: Partial<ThreadVoiceInputLabels>;
  away?: Partial<AwaySummaryLabels>;
  tools?: Partial<ToolActivityLabels>;
  task?: Partial<ThreadTaskCardLabels>;
};
export type AgentThreadProps = {
  /** Caller owns all business state. default* fixtures and simulate are ignored. */
  managed?: boolean;
  /** A stop intent is pending; do not infer that tools have stopped. */
  stopping?: boolean;
  renderMessageContent?: (message: AgentMessage, defaultContent: ReactNode) => ReactNode;
  /** Replaces the message list and its scrolling/log semantics; undefined keeps the built-in timeline. */
  timeline?: ReactNode;
  labels?: Partial<AgentThreadLabels>;
  formatTime?: (timestamp: number) => string;
  messages?: AgentMessage[];
  defaultMessages?: AgentMessage[];
  onMessagesChange?: (messages: AgentMessage[]) => void;
  title?: string;
  assistantName?: string;
  mode?: "chat" | "orchestrator";
  onSend?: (message: string, options: ChatComposerSendOptions) => void;
  onStop?: () => void;
  onRetry?: (id: string) => void;
  onOpenFile?: (name: string) => void;
  onNavigate?: (label: string) => void;
  onOpenTask?: (id: string) => void;
  onOpenInbox?: (id?: string) => void;
  running?: { running: number; needs: number };
  decisions?: ThreadDecision[];
  defaultDecisions?: ThreadDecision[];
  onDecisionsChange?: (decisions: ThreadDecision[]) => void;
  onDecide?: (id: string, answer: ThreadDecisionAnswer) => void;
  onLater?: (id: string) => void;
  decisionRequest?: { id: string; sequence: number };
  folded?: boolean;
  defaultFolded?: boolean;
  onFoldedChange?: (folded: boolean) => void;
  connection?: ThreadConnection;
  defaultConnection?: ThreadConnection;
  onConnectionChange?: (connection: ThreadConnection) => void;
  onReconnect?: () => void | Promise<void>;
  lastSeen?: number;
  defaultLastSeen?: number;
  onLastSeenChange?: (at: number | undefined) => void;
  awayAfter?: number;
  onMarkRead?: () => void;
  uploads?: ThreadUpload[];
  defaultUploads?: ThreadUpload[];
  onUploadsChange?: (uploads: ThreadUpload[]) => void;
  upload?: (file: File, progress: (progress: number) => void, signal: AbortSignal) => Promise<void>;
  transcribe?: (clip: ThreadAttachment) => Promise<string>;
  composerProps?: Omit<ChatComposerProps, "onSend">;
  composer?: ReactNode;
  simulate?: boolean | ThreadPreset;
  className?: string;
};

export const defaultAgentMessages: AgentMessage[] = [
  {
    id: "fabric-question",
    role: "user",
    text: "What's the best fabric for a summer overshirt – linen, cotton or a blend?",
  },
  {
    id: "fabric-answer",
    role: "assistant",
    at: Date.UTC(2026, 10, 8, 10, 48),
    tools: [
      { id: "web", label: "Searched the web for “linen vs cotton breathability”", status: "done", duration: 1400 },
      { id: "read", label: "Read 6 pages", status: "done", duration: 3100 },
      { id: "compare", label: "Compared weights, creasing and price", status: "done", duration: 900 },
    ],
    text: "Linen breathes best – it pulls moisture off the skin and dries fast, which is why it feels cool on a hot day. The trade-off is creasing: a pure linen overshirt looks lived-in after an hour.\n\nFor an overshirt I'd take a linen-cotton blend around 55/45 at 160–180 gsm: it keeps most of the coolness, creases far less and is soft from the first wear. Pure linen if the relaxed look is the point; seersucker if it has to look sharp all day.",
    files: ["fabric-comparison.csv", "sources.md"],
  },
  { id: "weight-question", role: "user", text: "Which weight for a shirt you can wear open over a T-shirt?" },
  {
    id: "weight-answer",
    role: "assistant",
    at: Date.UTC(2026, 10, 8, 10, 52),
    tools: [
      { id: "weight", label: "Searched the web for “overshirt fabric weight gsm”", status: "done", duration: 1200 },
    ],
    text: "Go a little heavier than a shirt: 180–200 gsm. It hangs straight when it's open, doesn't cling to the T-shirt underneath and still breathes – under 160 gsm it starts to look like a shirt you forgot to button.",
  },
];

/** A conversation that preserves decisions, uploads and queued messages across interrupted connections. */
export function AgentThread({
  managed = false,
  stopping = false,
  renderMessageContent,
  timeline,
  labels: labelsProp,
  formatTime = defaultThreadFormatTime,
  messages: messagesProp,
  defaultMessages = defaultAgentMessages,
  onMessagesChange,
  title = "Best fabric for a summer overshirt",
  assistantName = "Assistant",
  mode = "chat",
  onSend,
  onStop,
  onRetry,
  onOpenFile,
  onNavigate,
  onOpenTask,
  onOpenInbox,
  running,
  decisions: decisionsProp,
  defaultDecisions = [],
  onDecisionsChange,
  onDecide,
  onLater,
  decisionRequest,
  folded: foldedProp,
  defaultFolded = false,
  onFoldedChange,
  connection,
  defaultConnection,
  onConnectionChange,
  onReconnect,
  lastSeen: lastSeenProp,
  defaultLastSeen,
  onLastSeenChange,
  awayAfter = 5,
  onMarkRead,
  uploads: uploadsProp,
  defaultUploads = [],
  onUploadsChange,
  upload,
  transcribe,
  composerProps,
  composer,
  simulate: simulateProp = messagesProp === undefined && onSend === undefined,
  className,
}: AgentThreadProps) {
  const simulate = !managed && simulateProp;
  const labels = { ...defaultAgentThreadLabels, ...labelsProp };
  const decisionLabels = { ...defaultDecisionDockLabels, ...labels.decisions };
  const [messages, setMessages] = useControllable(
    managed ? (messagesProp ?? []) : messagesProp,
    defaultMessages,
    onMessagesChange,
  );
  const [decisions, setDecisions] = useControllable(
    managed ? (decisionsProp ?? []) : decisionsProp,
    defaultDecisions,
    onDecisionsChange,
  );
  const [folded, setFolded] = useControllable(foldedProp, defaultFolded, onFoldedChange);
  const [uploads, setUploads] = useControllable(
    managed ? (uploadsProp ?? []) : uploadsProp,
    defaultUploads,
    onUploadsChange,
  );
  const [draft, setDraft] = useControllable(
    composerProps?.value,
    composerProps?.defaultValue ?? "",
    composerProps?.onValueChange,
  );
  const [lastSeen, setLastSeen] = useControllable<number | undefined>(
    lastSeenProp,
    managed ? undefined : defaultLastSeen,
    onLastSeenChange,
  );
  const [readReceipt, setReadReceipt] = useState<number | undefined>();
  const [localRunning, setLocalRunning] = useState(false),
    [away, setAway] = useState(false),
    [newCount, setNewCount] = useState(0),
    [announcement, setAnnouncement] = useState("");
  const [localAnswers, setAnswers] = useState<Record<string, string>>({}),
    [activeDecision, setActiveDecision] = useState(""),
    [focusRequest, setFocusRequest] = useState(0);
  const answers: Record<string, string> = managed
    ? Object.fromEntries([
        ...decisions
          .filter((decision) => decision.status === "answered")
          .map((decision) => [
            decision.id,
            decision.answer === undefined
              ? decisionLabels.answered
              : threadDecisionAnswerLabel(decision, decision.answer, decisionLabels),
          ]),
        ...messages
          .filter((message) => message.answer)
          .map((message) => [message.answer!.id, message.text ?? decisionLabels.answered]),
      ])
    : localAnswers;
  const [voicePreview, setVoicePreview] = useState(simulate === "dictating"),
    [voiceSeconds, setVoiceSeconds] = useState(0);
  const root = useRef<HTMLElement>(null),
    scroll = useRef<HTMLDivElement>(null),
    column = useRef<HTMLDivElement>(null),
    unreadBoundary = useRef<HTMLDivElement>(null),
    follow = useRef(simulate !== "scrolled");
  const messageRef = useRef(messages),
    decisionsRef = useRef(decisions),
    uploadsRef = useRef(uploads),
    draftRef = useRef(draft);
  messageRef.current = messages;
  decisionsRef.current = decisions;
  uploadsRef.current = uploads;
  draftRef.current = draft;
  const managedRef = useRef(managed);
  managedRef.current = managed;
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set()),
    generation = useRef(0),
    sequence = useRef(0),
    mounted = useRef(true);
  const deliveryTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const controllers = useRef<Map<string, AbortController>>(new Map()),
    transcribing = useRef<Set<string>>(new Set()),
    delivered = useRef<Set<string>>(new Set());
  const connectionState = useThreadConnection({
    managed,
    connection,
    defaultConnection,
    onConnectionChange,
    onReconnect,
  });
  const connectionRef = useRef(connectionState.status);
  connectionRef.current = connectionState.status;
  const reduced = useReducedMotion();
  const list = (Array.isArray(messages) ? messages : []).filter(Boolean);
  const streaming =
    (!managed && localRunning) ||
    list.some(
      (message) =>
        message.streaming ||
        message.tools?.some((tool) => tool.status === "running") ||
        message.parts?.some((part) => part.kind === "tools" && part.tools.some((tool) => tool.status === "running")),
    );
  const update = (fn: (messages: AgentMessage[]) => AgentMessage[]) => {
    if (managedRef.current) return;
    const next = fn(messageRef.current);
    messageRef.current = next;
    setMessages(next);
  };
  const updateUploads = (fn: (uploads: ThreadUpload[]) => ThreadUpload[]) => {
    if (managedRef.current) return;
    const next = fn(uploadsRef.current);
    uploadsRef.current = next;
    setUploads(next);
  };
  const updateDecisions = (next: ThreadDecision[]) => {
    if (managedRef.current) return;
    decisionsRef.current = next;
    setDecisions(next);
  };
  const schedule = (callback: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      if (mounted.current && !managedRef.current) callback();
    }, ms);
    timers.current.add(timer);
    return timer;
  };
  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  };
  const pause = (ms: number, token: number) =>
    new Promise<boolean>((resolve) => {
      let remaining = ms;
      const tick = () => {
        if (!mounted.current || token !== generation.current) {
          resolve(false);
          return;
        }
        if (connectionRef.current === "online") remaining -= 50;
        if (remaining <= 0) resolve(true);
        else schedule(tick, 50);
      };
      schedule(tick, Math.min(50, ms));
    });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current++;
      clearTimers();
      deliveryTimers.current.forEach((timer) => clearTimeout(timer));
      controllers.current.forEach((controller) => controller.abort());
    };
  }, []);
  useEffect(() => {
    if (!managed) return;
    generation.current++;
    clearTimers();
    controllers.current.forEach((controller) => controller.abort());
    controllers.current.clear();
    setVoicePreview(false);
  }, [managed]);
  const builtInTimeline = timeline === undefined;
  useLayoutEffect(() => {
    const el = scroll.current;
    if (!el) return;
    if (follow.current) el.scrollTop = el.scrollHeight;
    else setNewCount((count) => count + 1);
  }, [messages, builtInTimeline]);
  useEffect(() => {
    const el = scroll.current,
      content = column.current;
    if (!el || !content) return;
    const observer = new ResizeObserver(() => {
      if (follow.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(content);
    observer.observe(el);
    return () => observer.disconnect();
  }, [builtInTimeline]);
  const latest = () => {
    follow.current = true;
    setAway(false);
    setNewCount(0);
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  };
  const stop = () => {
    if (stopping) return;
    if (managed) {
      onStop?.();
      return;
    }
    generation.current++;
    clearTimers();
    setLocalRunning(false);
    const stoppedTool = (tool: ToolActivityItem) =>
      tool.status === "running"
        ? { ...tool, status: "stopped" as const, duration: Math.max(0, Date.now() - (tool.startedAt ?? Date.now())) }
        : tool;
    update((messages) =>
      messages.map((message) =>
        message.role !== "user" &&
        (message.streaming ||
          message.tools?.some((tool) => tool.status === "running") ||
          message.parts?.some((part) => part.kind === "tools" && part.tools.some((tool) => tool.status === "running")))
          ? {
              ...message,
              streaming: false,
              stopped: true,
              tools: message.tools?.map(stoppedTool),
              parts: message.parts?.map((part) =>
                part.kind === "tools" ? { ...part, tools: part.tools.map(stoppedTool) } : part,
              ),
            }
          : message,
      ),
    );
    onStop?.();
    setAnnouncement(labels.responseStopped);
  };
  const streamText = async (id: string, text: string, token: number, append = false) => {
    const words = text.match(/\S+\s*/g) ?? [];
    const initial = append ? (messageRef.current.find((message) => message.id === id)?.text ?? "") : "";
    for (let count = 0; count < words.length;) {
      if (!(await pause(reduced ? 20 : 60, token))) return false;
      count += reduced ? 4 : 2;
      update((messages) =>
        messages.map((message) =>
          message.id === id ? { ...message, text: initial + words.slice(0, count).join(""), streaming: true } : message,
        ),
      );
    }
    return true;
  };
  const reply = async (text: string) => {
    const token = generation.current,
      id = `reply-${Date.now()}-${++sequence.current}`;
    setLocalRunning(true);
    if (!(await pause(550, token))) return;
    update((messages) => [
      ...messages,
      {
        id,
        role: "assistant",
        at: Date.now(),
        streaming: true,
        tools: [
          {
            id: `${id}-search`,
            label:
              mode === "orchestrator"
                ? "Checked the current tasks and project notes"
                : `Searched the web for “${text.slice(0, 48)}${text.length > 48 ? "…" : ""}”`,
            status: "running",
            startedAt: Date.now(),
          },
        ],
      },
    ]);
    if (!(await pause(1300, token))) return;
    update((messages) =>
      messages.map((message) =>
        message.id === id
          ? { ...message, tools: message.tools?.map((tool) => ({ ...tool, status: "done", duration: 1300 })) }
          : message,
      ),
    );
    const response =
      mode === "orchestrator"
        ? "I've checked the project notes and the current tasks. I'll keep the work moving and bring the next decision back here when I need your input."
        : "Here's what I found: the sources agree on the main point, and the comparison sheet has the numbers side by side. Want me to turn it into a short brief for the supplier?";
    if (!(await streamText(id, response, token))) return;
    update((messages) => messages.map((message) => (message.id === id ? { ...message, streaming: false } : message)));
    setLocalRunning(false);
    setAnnouncement(labels.responseComplete);
  };
  const defaults = (): ChatComposerSendOptions => ({
    model: composerProps?.model ?? "auto",
    approval: composerProps?.approval ?? "request",
    planMode: composerProps?.planMode ?? false,
    attachments: [],
  });
  const pending = useRef<Map<string, ChatComposerSendOptions>>(new Map());
  const send = (text: string, options: ChatComposerSendOptions) => {
    if (managed) {
      onSend?.(text, options);
      return;
    }
    const id = `message-${Date.now()}-${++sequence.current}`;
    const online = connectionRef.current === "online";
    update((messages) => [
      ...messages,
      {
        id,
        role: "user",
        text,
        at: Date.now(),
        status: online ? "sent" : "queued",
        attachments: options.attachments.map((file) => ({ name: file.name, size: file.size })),
      },
    ]);
    updateUploads((uploads) => uploads.filter((file) => file.kind === "voice" && file.state !== "done"));
    latest();
    if (!online) {
      pending.current.set(id, options);
      setAnnouncement(labels.queuedAnnouncement);
      return;
    }
    delivered.current.add(id);
    onSend?.(text, options);
    if (simulate) {
      if (streaming) stop();
      void reply(text);
    }
  };
  const deliveryRef = useRef({ onSend, simulate });
  deliveryRef.current = { onSend, simulate };
  useEffect(() => {
    if (managed || connectionState.status !== "online") return;
    const queued = messageRef.current.filter(
      (message) => message.role === "user" && message.status === "queued" && !delivered.current.has(message.id),
    );
    queued.forEach((message) => delivered.current.add(message.id));
    if (!queued.length) return;
    update((messages) =>
      messages.map((message) =>
        queued.some((item) => item.id === message.id) ? { ...message, status: "sending" } : message,
      ),
    );
    const deliveryTimer = setTimeout(() => {
      deliveryTimers.current.delete(deliveryTimer);
      if (!mounted.current) return;
      if (connectionRef.current !== "online") {
        queued.forEach((message) => delivered.current.delete(message.id));
        update((messages) =>
          messages.map((message) =>
            queued.some((item) => item.id === message.id) ? { ...message, status: "queued" } : message,
          ),
        );
        return;
      }
      update((messages) =>
        messages.map((message) =>
          queued.some((item) => item.id === message.id) ? { ...message, status: "sent" } : message,
        ),
      );
      queued.forEach((message) => {
        const options = pending.current.get(message.id) ?? defaults();
        pending.current.delete(message.id);
        if (!message.answer) deliveryRef.current.onSend?.(message.text ?? "", options);
      });
      if (deliveryRef.current.simulate && queued.some((message) => !message.answer)) {
        update((messages) =>
          messages.map((message) => (message.streaming ? { ...message, streaming: false } : message)),
        );
        void reply(queued.at(-1)?.text ?? "");
      }
    }, 600);
    deliveryTimers.current.add(deliveryTimer);
    return () => {
      clearTimeout(deliveryTimer);
      deliveryTimers.current.delete(deliveryTimer);
      queued.forEach((message) => delivered.current.delete(message.id));
    };
  }, [managed, connectionState.status]);
  const startUpload = (item: ThreadUpload) => {
    if (managed || !upload || !item.file || controllers.current.has(item.id) || connectionRef.current !== "online")
      return;
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return;
        return upload(
          item.file!,
          (progress) => {
            if (!controller.signal.aborted && mounted.current)
              updateUploads((files) =>
                files.map((file) =>
                  file.id === item.id
                    ? { ...file, progress: clamp(safeNumber(progress, 0), 0, 1), state: "uploading" }
                    : file,
                ),
              );
          },
          controller.signal,
        );
      })
      .then(() => {
        if (!controller.signal.aborted && mounted.current)
          updateUploads((files) =>
            files.map((file) => (file.id === item.id ? { ...file, state: "done", progress: 1 } : file)),
          );
      })
      .catch(() => {
        if (!controller.signal.aborted && mounted.current) {
          updateUploads((files) => files.map((file) => (file.id === item.id ? { ...file, state: "failed" } : file)));
          setAnnouncement(labels.uploadFailed(item.name));
        }
      })
      .finally(() => {
        if (controllers.current.get(item.id) === controller) controllers.current.delete(item.id);
      });
  };
  const attach = (files: ChatComposerAttachment[]) => {
    const added: ThreadUpload[] = files
      .filter((file) => !uploadsRef.current.some((item) => item.id === file.id))
      .map((file) => ({
        ...file,
        kind: "file",
        progress: 0,
        state: connectionRef.current === "online" ? "uploading" : "paused",
      }));
    if (added.length) {
      updateUploads((files) => [...files, ...added]);
      added.forEach(startUpload);
    }
    composerProps?.onAttachmentsChange?.(files);
  };
  const removeUpload = (id: string) => {
    controllers.current.get(id)?.abort();
    controllers.current.delete(id);
    updateUploads((files) => files.filter((file) => file.id !== id));
  };
  const retryUpload = (id: string) => {
    const file = uploadsRef.current.find((file) => file.id === id);
    if (!file) return;
    if (file.kind === "voice") {
      updateUploads((files) => files.map((file) => (file.id === id ? { ...file, state: "waiting" } : file)));
      return;
    }
    const next: ThreadUpload = {
      ...file,
      progress: 0,
      state: connectionRef.current === "online" ? "uploading" : "paused",
    };
    updateUploads((files) => files.map((file) => (file.id === id ? next : file)));
    startUpload(next);
  };
  const uploading = uploads.some((file) => file.state === "uploading" || file.state === "paused");
  useEffect(() => {
    if (managed || !uploading || upload) return;
    const interval = setInterval(
      () =>
        updateUploads((files) =>
          files.map((file) => {
            if (file.state !== "uploading" && file.state !== "paused") return file;
            if (connectionRef.current !== "online") return { ...file, state: "paused" };
            const progress = Math.min(1, file.progress + 600000 / Math.max(1, file.size ?? 1));
            return { ...file, progress, state: progress >= 1 ? "done" : "uploading" };
          }),
        ),
      200,
    );
    return () => clearInterval(interval);
  }, [managed, uploading, upload]);
  useEffect(() => {
    if (managed || !upload) return;
    if (connectionState.status === "online") {
      uploadsRef.current
        .filter((file) => file.kind !== "voice" && (file.state === "paused" || file.state === "uploading"))
        .forEach(startUpload);
      return;
    }
    controllers.current.forEach((controller) => controller.abort());
    controllers.current.clear();
    if (uploadsRef.current.some((file) => file.kind !== "voice" && file.state === "uploading"))
      updateUploads((files) =>
        files.map((file) =>
          file.kind !== "voice" && file.state === "uploading" ? { ...file, state: "paused" } : file,
        ),
      );
  }, [managed, connectionState.status, upload]);
  const transcribeClip = async (clip: ThreadAttachment) => {
    if (transcribe) return transcribe(clip);
    if (!simulate) throw new Error("Provide a transcribe callback to process saved voice notes.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return "Also send Dana the load test numbers.";
  };
  const voice = async (blob: Blob, signal: AbortSignal) => {
    const clip: ThreadUpload = {
      id: `voice-${Date.now()}`,
      name: labels.voiceNote,
      size: blob.size,
      kind: "voice",
      file: new File([blob], "Voice note.webm", { type: blob.type }),
      progress: 1,
      seconds: Math.max(1, voiceSeconds),
      state: "waiting",
    };
    if (connectionRef.current !== "online") {
      updateUploads((files) => [...files, clip]);
      setAnnouncement(labels.voiceSaved);
      return "";
    }
    const text = await transcribeClip(clip);
    return signal.aborted ? "" : text;
  };
  useEffect(() => {
    if (managed || connectionState.status !== "online") return;
    uploads
      .filter((file) => file.kind === "voice" && file.state === "waiting" && !transcribing.current.has(file.id))
      .forEach((clip) => {
        transcribing.current.add(clip.id);
        updateUploads((files) =>
          files.map((file) => (file.id === clip.id ? { ...file, state: "transcribing" } : file)),
        );
        transcribeClip(clip)
          .then((text) => {
            if (!mounted.current || managedRef.current || !uploadsRef.current.some((file) => file.id === clip.id))
              return;
            setDraft(`${draftRef.current.trimEnd()}${draftRef.current.trim() ? " " : ""}${text}`);
            updateUploads((files) => files.filter((file) => file.id !== clip.id));
          })
          .catch(() => {
            if (mounted.current)
              updateUploads((files) =>
                files.map((file) => (file.id === clip.id ? { ...file, state: "failed" } : file)),
              );
          })
          .finally(() => transcribing.current.delete(clip.id));
      });
  }, [managed, connectionState.status, uploads]);
  useEffect(() => {
    if (!voicePreview) return;
    const timer = setInterval(() => setVoiceSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [voicePreview]);
  const finishVoicePreview = () => {
    setVoicePreview(false);
    const clip: ThreadUpload = {
      id: `voice-preview-${Date.now()}`,
      name: labels.voiceNote,
      kind: "voice",
      seconds: Math.max(1, voiceSeconds),
      size: Math.max(1, voiceSeconds) * 16000,
      progress: 1,
      state: "waiting",
    };
    updateUploads((files) => [...files, clip]);
  };
  const openInbox = (id?: string) => (onOpenInbox ? onOpenInbox(id) : onNavigate?.("Inbox"));
  const showDecision = (id?: string) => {
    if (id && answers[id]) {
      root.current
        ?.querySelector(`[data-answer="${CSS.escape(id)}"]`)
        ?.scrollIntoView({ block: "center", behavior: reduced ? "auto" : "smooth" });
      return;
    }
    if (!decisionsRef.current.length || (id && !decisionsRef.current.some((decision) => decision.id === id))) {
      openInbox(id);
      return;
    }
    if (id) setActiveDecision(id);
    setFolded(false);
    setFocusRequest((value) => value + 1);
  };
  useEffect(() => {
    if (decisionRequest) showDecision(decisionRequest.id);
  }, [decisionRequest]);
  const answered = (id: string, answer: ThreadDecisionAnswer) => {
    const decision = decisionsRef.current.find((item) => item.id === id);
    if (!decision) return;
    if (managed) {
      onDecide?.(id, answer);
      return;
    }
    const text = threadDecisionAnswerLabel(decision, answer, decisionLabels);
    setAnswers((previous) => ({ ...previous, [id]: text }));
    update((messages) => [
      ...messages,
      {
        id: `answer-${Date.now()}-${++sequence.current}`,
        role: "user",
        at: Date.now(),
        text,
        answer: { id, question: decision.question },
        status: connectionRef.current === "online" ? "sent" : "queued",
      },
    ]);
    latest();
    onDecide?.(id, answer);
    setAnnouncement(labels.answeredAnnouncement(text));
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true }),
    );
    if (simulate && connectionRef.current === "online") {
      schedule(() => {
        update((messages) => [
          ...messages,
          {
            id: `ack-${Date.now()}`,
            role: "agent",
            at: Date.now(),
            parts: [
              {
                kind: "text",
                text:
                  answer === "decline"
                    ? "Understood. I'll keep the draft here until you're ready."
                    : `Got it – ${text}. I'll take it from here.`,
              },
            ],
          },
        ]);
      }, 450);
      if (decision.taskId === "ingest")
        schedule(
          () =>
            update((messages) =>
              messages.map((message) => ({
                ...message,
                parts: message.parts?.map((part) =>
                  part.kind === "task" && part.task.id === "ingest"
                    ? {
                        ...part,
                        task: {
                          ...part.task,
                          status: "Deployed to staging · smoke test passed",
                          done: true,
                          steps: { done: 4, total: 4 },
                        },
                      }
                    : part,
                ),
              })),
            ),
          1800,
        );
    }
  };
  const later = (id: string) => {
    onLater?.(id);
    setAnnouncement(labels.laterAnnouncement);
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus({ preventScroll: true }),
    );
  };
  const read = () => {
    if (managed) {
      onMarkRead?.();
      return;
    }
    setReadReceipt(lastSeen);
    setLastSeen(undefined);
    onMarkRead?.();
    setAnnouncement(labels.markedRead);
  };
  const boundaryIndex =
    lastSeen != null && lastSeen !== readReceipt ? list.findIndex((message) => (message.at ?? 0) > lastSeen) : -1;
  const after = boundaryIndex >= 0 ? list.slice(boundaryIndex) : [];
  const completedTasks = new Map<string, ThreadTask>();
  after.forEach((message) =>
    message.parts?.forEach((part) => {
      if (part.kind === "task" && part.task.done) completedTasks.set(part.task.id, part.task);
    }),
  );
  const awayDecisions = after
    .flatMap(
      (message) =>
        message.parts
          ?.filter((part): part is Extract<AgentMessagePart, { kind: "decision" }> => part.kind === "decision")
          .map((part) => part.ask) ?? [],
    )
    .filter(
      (decision, index, all) => !answers[decision.id] && all.findIndex((item) => item.id === decision.id) === index,
    );
  useLayoutEffect(() => {
    if (boundaryIndex < 0) return;
    let disposed = false;
    const position = () => {
      if (disposed || !unreadBoundary.current || !scroll.current) return;
      follow.current = false;
      const viewport = scroll.current;
      const top =
        unreadBoundary.current.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
      viewport.scrollTop = Math.max(0, top - 20);
      setAway(true);
    };
    position();
    void document.fonts?.ready.then(position);
    return () => {
      disposed = true;
    };
  }, [lastSeen, builtInTimeline]);
  useEffect(() => {
    if (managed) return;
    let hiddenAt = 0;
    const visibility = () => {
      if (document.hidden) hiddenAt = Date.now();
      else if (hiddenAt && Date.now() - hiddenAt >= Math.max(0, awayAfter) * 60000) setLastSeen(hiddenAt);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [managed, awayAfter]);
  const shortcutActions = useRef({ latest, streaming, stop, voicePreview, builtInTimeline });
  shortcutActions.current = { latest, streaming, stop, voicePreview, builtInTimeline };
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isEditing(event.target)) return;
      if (document.activeElement !== document.body && !root.current?.contains(document.activeElement)) return;
      if (event.key === "End" && shortcutActions.current.builtInTimeline) {
        event.preventDefault();
        shortcutActions.current.latest();
      }
      if (event.key === "/") {
        event.preventDefault();
        root.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const liveStory = async () => {
    const token = generation.current,
      id = "ingest-story";
    setLocalRunning(true);
    if (!(await pause(900, token))) return;
    update((messages) => [
      ...messages,
      {
        id: "staging-question",
        role: "user",
        at: Date.now(),
        text: "Good. Get ingest onto staging today – and tell me what you need from me.",
      },
    ]);
    if (!(await pause(450, token))) return;
    const toolLabels = [
      "Read ingest-design.md",
      "Checked the staging cluster",
      "Compared Kafka, SQS and a Postgres queue",
    ];
    update((messages) => [
      ...messages,
      {
        id,
        role: "agent",
        at: Date.now(),
        streaming: true,
        parts: [
          {
            kind: "tools",
            id: "stage-tools",
            tools: toolLabels.map((label, index) => ({
              id: `stage-${index}`,
              label,
              status: "running",
              startedAt: Date.now(),
            })),
          },
        ],
      },
    ]);
    for (const [index, wait, duration] of [
      [0, 1200, 1200],
      [1, 1400, 2600],
      [2, 1600, 4200],
    ]) {
      if (!(await pause(wait, token))) return;
      update((messages) =>
        messages.map((message) =>
          message.id === id
            ? {
                ...message,
                parts: message.parts?.map((part) =>
                  part.kind === "tools"
                    ? {
                        ...part,
                        tools: part.tools.map((tool, position) =>
                          position === index ? { ...tool, status: "done", duration } : tool,
                        ),
                      }
                    : part,
                ),
              }
            : message,
        ),
      );
    }
    if (!(await pause(700, token))) return;
    if (
      !(await streamText(
        id,
        "Staging is ready and the load test holds. One thing I can't decide for you: which queue the service runs on. Kafka keeps a day of events to replay after a bad deploy; SQS is less to run but can't replay. I'd pick Kafka.",
        token,
      ))
    )
      return;
    update((messages) =>
      messages.map((message) =>
        message.id === id
          ? {
              ...message,
              streaming: false,
              parts: [
                ...(message.parts ?? []),
                {
                  kind: "task",
                  task: {
                    id: "ingest",
                    title: "Ingest pipeline",
                    status: "Picking a queue",
                    steps: { done: 2, total: 4 },
                  },
                },
                {
                  kind: "decision",
                  ask: { id: "queue", question: defaultThreadDecisions[0].question, task: "Ingest pipeline" },
                },
                {
                  kind: "text",
                  text: "Once you've picked, I'll deploy to staging and run the smoke test. The deploy plan is ready:",
                },
                { kind: "artifacts", names: ["deploy.yaml", "ingest-design.md"] },
              ],
            }
          : message,
      ),
    );
    if (!decisionsRef.current.some((decision) => decision.id === "queue"))
      updateDecisions([...decisionsRef.current, defaultThreadDecisions[0]]);
    setFolded(false);
    setLocalRunning(false);
  };
  useEffect(() => {
    if (simulate === "live") void liveStory();
    if (simulate === "scrolled") {
      follow.current = false;
      const frame = requestAnimationFrame(() => {
        if (scroll.current)
          scroll.current.scrollTop = Math.max(0, scroll.current.scrollHeight - scroll.current.clientHeight - 280);
        setAway(true);
        setNewCount(12);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);
  const retry = (id: string) => {
    onRetry?.(id);
    if (managed || !simulate) return;
    const failed = messageRef.current.find((message) => message.id === id);
    if (!failed) return;
    if (failed.role === "user") {
      const options = defaults();
      update((messages) =>
        messages.map((message) =>
          message.id === id ? { ...message, status: connectionRef.current === "online" ? "sent" : "queued" } : message,
        ),
      );
      if (connectionRef.current === "online") {
        onSend?.(failed.text ?? "", options);
        void reply(failed.text ?? "");
      }
      return;
    }
    update((messages) =>
      messages.map((message) =>
        message.id === id
          ? {
              ...message,
              streaming: true,
              parts: message.parts
                ?.filter((part) => part.kind !== "error")
                .map((part) =>
                  part.kind === "tools"
                    ? {
                        ...part,
                        tools: part.tools.map((tool) =>
                          tool.status === "failed" ? { ...tool, status: "running", startedAt: Date.now() } : tool,
                        ),
                      }
                    : part,
                ),
            }
          : message,
      ),
    );
    const token = generation.current;
    void (async () => {
      if (!(await pause(1600, token))) return;
      update((messages) =>
        messages.map((message) =>
          message.id === id
            ? {
                ...message,
                streaming: false,
                parts: [
                  ...(message.parts?.map((part) =>
                    part.kind === "tools"
                      ? {
                          ...part,
                          tools: part.tools.map((tool) =>
                            tool.status === "running" ? { ...tool, status: "done" as const, duration: 1600 } : tool,
                          ),
                        }
                      : part,
                  ) ?? []),
                  {
                    kind: "text",
                    text: "The staging cluster answers again – the check passed, so we're good to deploy once you've picked a queue.",
                  },
                ],
              }
            : message,
        ),
      );
    })();
  };
  const needsBaseline = useRef({ needs: running?.needs, answered: 0 });
  if (needsBaseline.current.needs !== running?.needs)
    needsBaseline.current = { needs: running?.needs, answered: Object.keys(answers).length };
  const needs = Math.max(
    0,
    safeNumber(
      running?.needs,
      decisions.filter(
        (decision) => !decision.status || decision.status === "awaiting" || decision.status === "submitting",
      ).length,
    ) - (managed ? 0 : Object.keys(answers).length - needsBaseline.current.answered),
  );
  const fileChips = (names: string[]) => (
    <div className="ui-th__files" aria-label={labels.createdFiles}>
      {names.map((name) => (
        <button type="button" key={name} className="ui-th__file" title={name} onClick={() => onOpenFile?.(name)}>
          <span
            data-kind={name.endsWith(".csv") ? "table" : /\.(ya?ml|json|tsx?|js)$/.test(name) ? "code" : "document"}
          >
            <Icon name={name.endsWith(".csv") ? "table" : "document"} size={12} />
          </span>
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
  const textPart = (text: string, caret: boolean) => (
    <div className="ui-th__text" dir="auto">
      {text.split(/\n{2,}/).map((paragraph, index, paragraphs) => (
        <p key={index}>
          {paragraph}
          {caret && index === paragraphs.length - 1 && <span className="ui-th__caret" aria-hidden="true" />}
        </p>
      ))}
    </div>
  );
  const completedUploads = uploads.filter((file) => file.state === "done" && file.kind !== "voice");
  const blockedUpload = !managed && uploads.some((file) => file.kind !== "voice" && file.state !== "done");
  const content = (message: AgentMessage, defaultContent: ReactNode) =>
    renderMessageContent ? renderMessageContent(message, defaultContent) : defaultContent;
  return (
    <section
      ref={root}
      data-thread-shortcuts=""
      className={["ui-th", className].filter(Boolean).join(" ")}
      data-orchestrator={mode === "orchestrator" || undefined}
      aria-label={title}
      onKeyDown={(event) => {
        if (event.defaultPrevented || event.repeat || event.nativeEvent.isComposing) return;
        if (event.key === "Escape" && voicePreview) {
          event.preventDefault();
          setVoicePreview(false);
        } else if (event.key === "Escape" && streaming) {
          event.preventDefault();
          stop();
        }
      }}
    >
      <style href="ui-agent-thread" precedence="default">
        {css}
      </style>
      <header className="ui-th__head">
        <h1 className="ui-th__sr">{title}</h1>
        {running && (
          <div className="ui-th__summary">
            <button
              type="button"
              aria-label={labels.runningTasks(running.running)}
              onClick={() => onNavigate?.("Tasks")}
            >
              <i className="ui-th__running-dot" />
              {Math.max(0, safeNumber(running.running, 0))}
              <span>{labels.running}</span>
            </button>
            {needs > 0 && (
              <>
                <span className="ui-th__summary-separator">·</span>
                <button
                  type="button"
                  aria-label={labels.waitingQuestions(needs, decisions.length > 0)}
                  onClick={() => showDecision()}
                >
                  <i className="ui-th__needs-dot" />
                  {needs}
                  <span>{labels.needsYou(needs)}</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>
      <ConnectionBanner
        managed
        labels={labels.connection}
        connection={connectionState.status}
        retryIn={managed ? undefined : connectionState.retryIn}
        backOnline={!managed && connectionState.backOnline}
        onReconnect={connectionState.reconnect}
      />
      <div className="ui-th__body">
        {!builtInTimeline ? (
          timeline
        ) : (
          <>
            <div
              ref={scroll}
              className="ui-th__scroll"
              onScroll={() => {
                const el = scroll.current;
                if (!el) return;
                const pinned = el.scrollHeight - el.clientHeight - el.scrollTop < 40;
                follow.current = pinned;
                setAway(!pinned);
                if (pinned) setNewCount(0);
              }}
            >
              <div
                ref={column}
                className="ui-th__column"
                role="log"
                aria-label={labels.conversation}
                aria-live="polite"
                aria-relevant="additions"
                aria-busy={streaming}
              >
                {!list.length && (
                  <div className="ui-th__empty">
                    <span className="ui-th__empty-icon">
                      <Icon name="spark" size={26} />
                    </span>
                    <h2>{labels.emptyTitle}</h2>
                    <p>{labels.emptyDescription}</p>
                  </div>
                )}
                {list.map((message, messageIndex) => (
                  <div className="ui-th__message" data-message-id={message.id} key={message.id}>
                    {messageIndex === boundaryIndex && (
                      <div ref={unreadBoundary} className="ui-th__unread-boundary">
                        <AwaySummary
                          labels={labels.away}
                          formatTime={formatTime}
                          tasks={[...completedTasks.values()]}
                          decisions={awayDecisions}
                          since={lastSeen}
                          onOpenTask={(id) => (onOpenTask ? onOpenTask(id) : onNavigate?.("Tasks"))}
                          onOpenDecision={showDecision}
                          onOpenTasks={() => onNavigate?.("Tasks")}
                          onOpenInbox={() => openInbox()}
                          onMarkRead={read}
                        />
                      </div>
                    )}
                    {message.role === "user" ? (
                      <div
                        className="ui-th__user"
                        data-status={message.status ?? "sent"}
                        data-answer={message.answer?.id}
                      >
                        <span className="ui-th__sr">{message.answer ? labels.youAnswered : labels.youSaid}</span>
                        {message.answer && (
                          <span className="ui-th__answer-context" title={message.answer.question}>
                            {labels.answerContext(message.answer.question)}
                          </span>
                        )}
                        {content(
                          message,
                          <>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="ui-th__attachments">
                                {message.attachments.map((file, index) => (
                                  <span key={`${file.name}-${index}`}>
                                    <Icon name="document" size={14} />
                                    {file.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.text && (
                              <p className="ui-th__bubble" dir="auto">
                                {message.text}
                              </p>
                            )}
                          </>,
                        )}
                        {message.status && message.status !== "sent" && (
                          <span className="ui-th__send-status">
                            {message.status === "failed" ? (
                              <>
                                <Icon name="warning" size={12} />
                                {labels.sendFailed} ·{" "}
                                <button type="button" onClick={() => retry(message.id)}>
                                  {labels.retry}
                                </button>
                              </>
                            ) : message.status === "queued" ? (
                              labels.queued
                            ) : (
                              labels.sending
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="ui-th__assistant" data-streaming={message.streaming || undefined}>
                        {messageIndex === 0 ||
                        list[messageIndex - 1].role === "user" ||
                        messageIndex === boundaryIndex ? (
                          <div className="ui-th__who">
                            <span
                              className="ui-th__avatar"
                              data-busy={message.streaming || undefined}
                              aria-hidden="true"
                            >
                              {[0, 2, 4, 6, 8].map((pixel, index) => (
                                <i
                                  key={pixel}
                                  style={{
                                    gridArea: `${Math.floor(pixel / 3) + 1}/${(pixel % 3) + 1}`,
                                    animationDelay: `${index * 130}ms`,
                                  }}
                                />
                              ))}
                            </span>
                            <span>{assistantName}</span>
                            {message.at != null && Number.isFinite(message.at) && (
                              <time dateTime={new Date(message.at).toISOString()}>{formatTime(message.at)}</time>
                            )}
                          </div>
                        ) : (
                          <span className="ui-th__sr">{assistantName}:</span>
                        )}
                        {content(
                          message,
                          <>
                            {message.tools && message.tools.length > 0 && (
                              <ToolActivity
                                labels={labels.tools}
                                tools={message.tools}
                                onRetry={mode === "chat" && onRetry ? () => retry(message.id) : undefined}
                              />
                            )}
                            {message.parts
                              ?.slice(0, 1)
                              .map(
                                (part) =>
                                  part.kind === "tools" && (
                                    <ToolActivity
                                      labels={labels.tools}
                                      key={part.id}
                                      tools={part.tools.map((tool) => ({
                                        ...tool,
                                        duration: tool.duration ?? tool.ms,
                                      }))}
                                    />
                                  ),
                              )}
                            {message.text && textPart(message.text, !!message.streaming)}
                            {message.parts?.map((part, index) =>
                              index === 0 && part.kind === "tools" ? null : (
                                <div className="ui-th__part" key={`${part.kind}-${index}`}>
                                  {part.kind === "tools" ? (
                                    <ToolActivity
                                      labels={labels.tools}
                                      tools={part.tools.map((tool) => ({
                                        ...tool,
                                        duration: tool.duration ?? tool.ms,
                                      }))}
                                    />
                                  ) : part.kind === "text" ? (
                                    textPart(
                                      part.text,
                                      !!message.streaming && index === message.parts!.length - 1 && !message.text,
                                    )
                                  ) : part.kind === "task" ? (
                                    <ThreadTaskCard
                                      labels={labels.task}
                                      task={part.task}
                                      onOpen={(id) => (onOpenTask ? onOpenTask(id) : onNavigate?.("Tasks"))}
                                    />
                                  ) : part.kind === "artifacts" ? (
                                    fileChips(part.names)
                                  ) : part.kind === "decision" ? (
                                    <button
                                      type="button"
                                      className="ui-th__asked"
                                      onClick={() => showDecision(part.ask.id)}
                                    >
                                      <i data-answered={!!answers[part.ask.id] || undefined} />
                                      <span>{labels.asked(part.ask.question)}</span>
                                      <small>
                                        ·{" "}
                                        {answers[part.ask.id]
                                          ? labels.answeredBelow
                                          : decisions.some((decision) => decision.id === part.ask.id)
                                            ? labels.waiting
                                            : labels.inInbox}
                                      </small>
                                    </button>
                                  ) : (
                                    <div className="ui-th__error" role="status">
                                      <Icon name="warning" size={14} />
                                      <span dir="auto">{part.text}</span>
                                      {part.retry && (
                                        <button type="button" onClick={() => retry(message.id)}>
                                          {labels.retry}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                            {message.files && fileChips(message.files)}
                          </>,
                        )}
                        {message.stopped && (
                          <span className="ui-th__stopped">
                            <Icon name="stop" size={11} />
                            {labels.stopped}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {away && boundaryIndex < 0 && (
              <button
                type="button"
                className="ui-th__jump"
                aria-label={labels.jumpToLatest(newCount, streaming)}
                aria-keyshortcuts="End"
                onClick={latest}
              >
                <Icon name="arrow" size={14} />
                {newCount ? labels.newLines(newCount) : labels.latest}
                {streaming && <span className="ui-th__jump-live" />}
              </button>
            )}
          </>
        )}
      </div>
      <footer className="ui-th__foot">
        <div className="ui-th__foot-column">
          <div className="ui-th__dock-slot" data-visible={decisions.length > 0 || undefined}>
            <DecisionDock
              managed={managed}
              labels={labels.decisions}
              decisions={decisions}
              onDecisionsChange={updateDecisions}
              activeId={activeDecision}
              onActiveIdChange={setActiveDecision}
              folded={folded}
              onFoldedChange={setFolded}
              onAnswer={answered}
              onLater={later}
              focusRequest={focusRequest}
            />
          </div>
          {(uploads.length > 0 || voicePreview || streaming) && (
            <div className="ui-th__above">
              {uploads.length > 0 && (
                <div className="ui-th__upload-slot">
                  <ThreadUploads
                    labels={labels.uploads}
                    uploads={uploads}
                    onRemove={managed ? undefined : removeUpload}
                    onRetry={managed ? undefined : retryUpload}
                  />
                </div>
              )}
              {voicePreview && (
                <div className="ui-th__upload-slot">
                  <ThreadVoiceInput
                    labels={labels.voice}
                    seconds={voiceSeconds}
                    onDiscard={() => setVoicePreview(false)}
                    onDone={finishVoicePreview}
                  />
                </div>
              )}
              {streaming && !voicePreview && (
                <button
                  type="button"
                  className="ui-th__stop"
                  disabled={stopping}
                  aria-busy={stopping}
                  onClick={stop}
                  aria-keyshortcuts={stopping ? undefined : "Escape"}
                >
                  <Icon name="stop" size={12} />
                  {stopping ? labels.stopping : labels.stop}
                </button>
              )}
            </div>
          )}
          {composer ?? (
            <ChatComposer
              {...composerProps}
              managed={managed || composerProps?.managed}
              models={composerProps?.models ?? (mode === "orchestrator" ? [] : undefined)}
              value={draft}
              onValueChange={setDraft}
              attachments={!managed && mode === "orchestrator" ? completedUploads : composerProps?.attachments}
              onAttachmentsChange={!managed && mode === "orchestrator" ? attach : composerProps?.onAttachmentsChange}
              showAttachments={!managed && mode === "orchestrator" ? false : composerProps?.showAttachments}
              sendDisabled={blockedUpload || composerProps?.sendDisabled}
              transcribe={
                managed
                  ? undefined
                  : mode === "orchestrator" && (transcribe || simulate)
                    ? voice
                    : composerProps?.transcribe
              }
              onSend={send}
            />
          )}
        </div>
      </footer>
      <span role="status" aria-live="polite" className="ui-th__sr">
        {announcement}
      </span>
    </section>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-ta {
  --ui-ta-ink: rgba(0, 0, 0, 0.88);
  --ui-ta-text: rgba(0, 0, 0, 0.45);
  --ui-ta-faint: rgba(0, 0, 0, 0.27);
  --ui-ta-line: rgba(0, 0, 0, 0.06);
  --ui-ta-ok: #1a9a52;
  --ui-ta-danger: #e5484d;
  --ui-ta-focus: rgba(0, 96, 226, 0.35);
  --ui-ta-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ta-text);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ta,
.ui-ta *,
.ui-ta *::before,
.ui-ta *::after {
  box-sizing: border-box;
}
.ui-ta button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ta button:focus-visible {
  outline: 2px solid var(--ui-ta-focus);
  outline-offset: 2px;
}
.ui-ta button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ta__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0;
  text-align: left;
}
.ui-ta__status,
.ui-ta__mark {
  display: flex;
  align-items: center;
  color: var(--ui-ta-ok);
}
.ui-ta[data-state="failed"] .ui-ta__status,
.ui-ta__tool[data-status="failed"] .ui-ta__mark {
  color: var(--ui-ta-danger);
}
.ui-ta__title {
  position: relative;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-ta__chevron {
  display: flex;
  opacity: 0;
  transition:
    transform 280ms var(--ui-ta-ease),
    opacity 160ms;
}
.ui-ta__head:hover .ui-ta__chevron,
.ui-ta__head:focus-visible .ui-ta__chevron {
  opacity: 1;
}
.ui-ta[data-open="true"] .ui-ta__chevron {
  transform: rotate(180deg);
}
.ui-ta__wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 360ms var(--ui-ta-ease);
}
.ui-ta[data-open="true"] .ui-ta__wrap {
  grid-template-rows: 1fr;
}
.ui-ta__list {
  overflow: hidden;
  min-height: 0;
  list-style: none;
  padding: 0 0 0 4px;
  margin: 0;
}
.ui-ta__tool {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  position: relative;
  padding: 2px 0 2px 17px;
  opacity: 0;
  transform: translateY(-5px);
  transition:
    opacity 200ms,
    transform 320ms var(--ui-ta-ease);
  transition-delay: calc(var(--ui-ta-index) * 35ms);
}
.ui-ta[data-open="true"] .ui-ta__tool {
  opacity: 1;
  transform: none;
}
.ui-ta__tool::before {
  content: "";
  position: absolute;
  left: 1px;
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--ui-ta-line);
}
.ui-ta__mark {
  position: absolute;
  left: -5px;
  background: var(--ui-ta-card, #fff);
}
.ui-ta__icon {
  display: flex;
  color: var(--ui-ta-faint);
}
.ui-ta__label {
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
}
.ui-ta__label small {
  display: block;
  color: var(--ui-ta-danger);
  font-size: 12px;
}
.ui-ta__time {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-ta-faint);
}
.ui-ta__retry {
  font-size: 12px !important;
  text-decoration: underline;
}
.ui-ta [data-spinning] svg {
  animation: ui-ta-spin 1s linear infinite;
  color: var(--ui-ta-text);
}
.ui-ta__title[data-shimmer]::after {
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  color: transparent;
  background: linear-gradient(100deg, transparent 25%, var(--ui-ta-ink) 50%, transparent 75%);
  background-size: 240% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ui-ta-shimmer 2s linear infinite;
}
@keyframes ui-ta-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ui-ta-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@container (max-width:320px) {
  .ui-ta__tool {
    gap: 6px;
  }
  .ui-ta__time {
    font-size: 10px;
  }
}
@media (pointer: coarse) {
  .ui-ta__head {
    min-height: 36px;
  }
  .ui-ta__tool {
    min-height: 34px;
  }
  .ui-ta__retry {
    min-height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ta *,
  .ui-ta *::after {
    animation: none !important;
    transition: none !important;
  }
  .ui-ta__tool {
    transform: none;
  }
  .ui-ta__title[data-shimmer]::after {
    display: none;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ta {
  --ui-ta-ink: rgba(255, 255, 255, 0.9);
  --ui-ta-text: rgba(255, 255, 255, 0.46);
  --ui-ta-faint: rgba(255, 255, 255, 0.3);
  --ui-ta-line: rgba(255, 255, 255, 0.08);
  --ui-ta-card: #1c1c1e;
  --ui-ta-ok: #3ec27a;
  --ui-ta-danger: #ff6369;
  --ui-ta-focus: rgba(77, 141, 255, 0.5);
}

.ui-cc__overlay {
  position: absolute;
  bottom: 100%;
  inset-inline: 0;
  z-index: 21;
}
.ui-cc {
  --ui-cc-card: #fff;
  --ui-cc-tray: rgba(0, 0, 0, 0.035);
  --ui-cc-ink: rgba(0, 0, 0, 0.88);
  --ui-cc-text: rgba(0, 0, 0, 0.61);
  --ui-cc-muted: rgba(0, 0, 0, 0.45);
  --ui-cc-faint: rgba(0, 0, 0, 0.27);
  --ui-cc-line: rgba(0, 0, 0, 0.06);
  --ui-cc-fill: rgba(0, 0, 0, 0.04);
  --ui-cc-focus: rgba(0, 96, 226, 0.35);
  --ui-cc-danger: #e5484d;
  --ui-cc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-cc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  width: 100%;
  position: relative;
  container: ui-cc / inline-size;
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-cc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-cc,
.ui-cc *,
.ui-cc *::before,
.ui-cc *::after {
  box-sizing: border-box;
}
.ui-cc button,
.ui-cc textarea {
  font: inherit;
  color: inherit;
}
.ui-cc button {
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-cc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-cc button:focus-visible,
.ui-cc textarea:focus-visible {
  outline: 2px solid var(--ui-cc-focus);
  outline-offset: 2px;
}
.ui-cc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cc__body {
  padding: 14px 12px 10px;
  border-radius: 18px;
  background: var(--ui-cc-card);
  box-shadow: 0 0 0 0.5px var(--ui-cc-line);
}
.ui-cc__body:focus-within {
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.16);
}
.ui-cc__message {
  display: block;
  resize: none;
  width: 100%;
  min-height: 44px;
  max-height: 180px;
  padding: 0 2px;
  border: 0;
  outline: none !important;
  background: transparent;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-cc__message::placeholder {
  color: var(--ui-cc-muted);
}
.ui-cc__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 28px;
  margin-top: 10px;
}
.ui-cc__group {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.ui-cc__group--end {
  margin-left: auto;
}
.ui-cc__icon-btn,
.ui-cc__send {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--ui-cc-muted) !important;
  transition:
    background-color 150ms,
    transform 180ms;
}
.ui-cc__icon-btn:hover {
  background: var(--ui-cc-fill);
}
.ui-cc__approval,
.ui-cc__model {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  max-width: 190px;
  min-width: 0;
  height: 28px;
  border-radius: 6px;
  padding: 0 6px;
  overflow: hidden;
  transition: background-color 150ms;
}
.ui-cc__approval {
  color: var(--ui-cc-muted) !important;
}
.ui-cc__approval[data-tone="full"] {
  color: var(--ui-cc-danger) !important;
}
.ui-cc__approval:hover,
.ui-cc__model:hover {
  background: var(--ui-cc-fill);
}
.ui-cc__face {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  animation: ui-cc-morph 360ms var(--ui-cc-ease);
}
.ui-cc__face > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-cc__send {
  background: var(--ui-cc-ink) !important;
  color: var(--ui-cc-card) !important;
}
.ui-cc__send:disabled {
  background: var(--ui-cc-fill) !important;
  color: var(--ui-cc-muted) !important;
  opacity: 1;
}
.ui-cc__plan {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  color: var(--ui-cc-muted);
  background: var(--ui-cc-fill);
}
.ui-cc__menu {
  width: 300px;
  max-width: calc(100vw - 24px);
  overflow: auto;
  overscroll-behavior: contain;
  padding: 5px;
  border-radius: 12px;
  background: var(--ui-cc-card);
  box-shadow: var(--ui-cc-shadow);
  animation: ui-cc-pop 240ms var(--ui-cc-ease);
}
.ui-cc__menu-title {
  padding: 8px 9px 5px;
  color: var(--ui-cc-muted);
  font-size: 11px;
}
.ui-cc__option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 36px;
  border-radius: 7px;
  padding: 7px 9px;
  text-align: left;
}
.ui-cc__option:hover,
.ui-cc__option:focus-visible {
  background: var(--ui-cc-fill);
}
.ui-cc__option-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  color: var(--ui-cc-muted);
}
.ui-cc__option-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-cc__option-text > span {
  font-weight: 500;
}
.ui-cc__option-text small {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-cc-muted);
  margin-top: 2px;
  overflow-wrap: anywhere;
}
.ui-cc__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0 0 8px;
  list-style: none;
}
.ui-cc__attachments li {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 200px;
  background: var(--ui-cc-fill);
  padding: 5px 6px 5px 8px;
  border-radius: 7px;
  font-size: 11px;
}
.ui-cc__attachments li > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-cc__attachments button {
  display: grid;
  place-items: center;
  padding: 2px;
}
.ui-cc__error {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ui-cc-danger);
  margin: 8px 0 0;
}
.ui-cc__error button {
  margin-left: auto;
}
.ui-cc__footer {
  padding: 10px 6px;
  color: var(--ui-cc-muted);
  font-size: 12px;
}
.ui-cc__recording {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex: 1;
  position: absolute;
  left: 12px;
  right: 12px;
  background: var(--ui-cc-card);
  height: 28px;
}
.ui-cc__timer {
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--ui-cc-muted);
}
.ui-cc__wave {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  padding-inline: 6px;
}
.ui-cc__wave i {
  display: block;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-cc-text);
  animation: ui-cc-wave 650ms ease-in-out infinite alternate;
}
.ui-cc[data-menu-open] {
  z-index: 20;
}
@keyframes ui-cc-wave {
  to {
    transform: scaleY(0.25);
  }
}
@keyframes ui-cc-morph {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(25%);
  }
}
@keyframes ui-cc-pop {
  from {
    opacity: 0;
    transform: translateY(5px) scale(0.98);
  }
}
@container ui-cc (max-width:420px) {
  .ui-cc__approval {
    max-width: 138px;
  }
  .ui-cc__model {
    max-width: 110px;
  }
  .ui-cc__body {
    padding: 12px 10px 8px;
  }
  .ui-cc__group {
    gap: 2px;
  }
}
@container ui-cc (max-width:340px) {
  .ui-cc__approval {
    max-width: 28px;
    padding: 0 6px;
  }
  .ui-cc__approval .ui-cc__face > span {
    display: none;
  }
  .ui-cc__plan {
    display: none;
  }
  .ui-cc__model {
    max-width: 105px;
  }
}
@media (pointer: coarse) {
  .ui-cc__icon-btn,
  .ui-cc__send {
    width: 34px;
    height: 34px;
  }
  .ui-cc__approval,
  .ui-cc__model {
    height: 34px;
  }
  .ui-cc__tools,
  .ui-cc__recording {
    min-height: 34px;
  }
  .ui-cc__option {
    min-height: 44px;
  }
  .ui-cc__message {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cc,
  .ui-cc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cc {
  --ui-cc-card: #1c1c1e;
  --ui-cc-tray: #161618;
  --ui-cc-ink: rgba(255, 255, 255, 0.9);
  --ui-cc-text: rgba(255, 255, 255, 0.62);
  --ui-cc-muted: rgba(255, 255, 255, 0.46);
  --ui-cc-faint: rgba(255, 255, 255, 0.3);
  --ui-cc-line: rgba(255, 255, 255, 0.1);
  --ui-cc-fill: rgba(255, 255, 255, 0.08);
  --ui-cc-focus: rgba(77, 141, 255, 0.5);
  --ui-cc-danger: #ff6369;
  --ui-cc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}

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

.ui-dd__choices {
  max-height: min(48vh, 420px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.ui-dd button:disabled,
.ui-dd input:disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-dd__error {
  margin: 0;
  padding: 4px;
  color: #e5484d;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.ui-dd__text strong {
  overflow-wrap: anywhere;
}
.ui-dd {
  --ui-dd-card: #fff;
  --ui-dd-tray: #f0f0f0;
  --ui-dd-ink: rgba(0, 0, 0, 0.88);
  --ui-dd-muted: rgba(0, 0, 0, 0.45);
  --ui-dd-faint: rgba(0, 0, 0, 0.27);
  --ui-dd-line: rgba(0, 0, 0, 0.06);
  --ui-dd-fill: rgba(0, 0, 0, 0.04);
  --ui-dd-focus: rgba(0, 96, 226, 0.35);
  --ui-dd-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  width: 100%;
  font:
    13px/1.45 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-dd-ink);
  container: ui-dd / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-dd,
.ui-dd *,
.ui-dd *::before,
.ui-dd *::after {
  box-sizing: border-box;
}
.ui-dd button,
.ui-dd input {
  font: inherit;
  color: inherit;
}
.ui-dd button {
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-dd button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-dd button:focus-visible,
.ui-dd input:focus-visible {
  outline: 2px solid var(--ui-dd-focus);
  outline-offset: -2px;
}
.ui-dd__collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition:
    grid-template-rows 380ms var(--ui-dd-ease),
    opacity 180ms;
}
.ui-dd[data-folded] .ui-dd__collapse,
.ui-dd[data-empty] .ui-dd__collapse {
  grid-template-rows: 0fr;
  opacity: 0;
}
.ui-dd__clip {
  min-height: 0;
  overflow: clip;
  overflow-clip-margin: 1px;
  padding: 0;
}
.ui-dd__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 18px;
  padding: 10px 8px 6px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
  animation: ui-dd-in 260ms var(--ui-dd-ease) both;
}
.ui-dd__head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 4px;
  margin-bottom: 0;
  font-size: 12px;
  color: var(--ui-dd-muted);
}
.ui-dd__tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
  flex: none;
}
.ui-dd__task {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-dd__pager {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-dd__pager button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 22px;
  border-radius: 4px;
  color: var(--ui-dd-muted);
}
.ui-dd__pager button:first-child svg {
  rotate: 90deg;
}
.ui-dd__pager button:last-child svg {
  rotate: -90deg;
}
.ui-dd__later {
  font-size: 12px !important;
  border-radius: 4px;
  padding: 3px 6px;
}
.ui-dd__later:hover,
.ui-dd__pager button:hover {
  background: var(--ui-dd-fill);
}
.ui-dd__question {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  margin: 0;
  padding: 0 4px;
  overflow-wrap: anywhere;
}
.ui-dd__choices {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ui-dd__option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: 100%;
  min-height: 36px;
  text-align: left;
  padding: 4px 8px 4px 4px;
  border-radius: 8px;
  position: relative;
}
.ui-dd__option:hover,
.ui-dd__option:focus-visible {
  background: var(--ui-dd-fill);
}
.ui-dd__number {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  background: var(--ui-dd-fill);
  color: var(--ui-dd-muted);
  border-radius: 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-dd__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0;
}
.ui-dd__text strong {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}
.ui-dd__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-dd-muted);
  overflow-wrap: anywhere;
}
.ui-dd__recommended {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--ui-dd-fill);
  color: var(--ui-dd-muted);
  white-space: nowrap;
}
.ui-dd__custom {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 4px 8px 4px 4px;
}
.ui-dd__custom input {
  width: 0;
  flex: 1;
  background: none;
  border: 0;
  outline: none;
  padding: 0;
  line-height: 20px;
  min-width: 0;
}
.ui-dd__custom input::placeholder {
  color: var(--ui-dd-faint);
}
.ui-dd__custom button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background: var(--ui-dd-fill);
}
.ui-dd__facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 6px;
  font-size: 13px;
}
.ui-dd__facts > div {
  display: flex;
  gap: 12px;
}
.ui-dd__facts dt {
  color: var(--ui-dd-muted);
  width: 60px;
  flex: none;
}
.ui-dd__facts dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-dd__folded {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  font-size: 12px;
  color: var(--ui-dd-muted);
  padding: 0 8px 0 14px;
  border-radius: 18px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
}
.ui-dd__folded button {
  padding: 4px 7px;
  border-radius: 5px;
  font-size: 12px;
}
.ui-dd__folded button:hover {
  background: var(--ui-dd-fill);
}
.ui-dd__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-dd[data-kind="pick"] .ui-dd__choices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.ui-dd[data-kind="pick"] .ui-dd__option {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  border-radius: 10px;
}
.ui-dd[data-kind="pick"] .ui-dd__option .ui-dd__number {
  margin-left: 2px;
}
.ui-dd[data-kind="pick"] .ui-dd__recommended {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
}
.ui-dd__wire {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  grid-column: 1/-1;
  height: 92px;
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 0.5px var(--ui-dd-line);
  background: var(--ui-dd-fill);
  overflow: hidden;
}
.ui-dd__card[data-pulse] {
  animation: ui-dd-pulse 550ms ease both;
}
@keyframes ui-dd-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@keyframes ui-dd-pulse {
  30% {
    background: var(--ui-dd-fill);
  }
}
@container ui-dd (max-width:440px) {
  .ui-dd__recommended {
    font-size: 9px;
  }
  .ui-dd__option {
    gap: 7px;
  }
  .ui-dd__text small {
    font-size: 11px;
  }
  .ui-dd__card {
    padding: 10px;
  }
  .ui-dd[data-kind="pick"] .ui-dd__choices {
    gap: 5px;
  }
}
@media (pointer: coarse) {
  .ui-dd__option {
    min-height: 44px;
  }
  .ui-dd__custom {
    min-height: 40px;
  }
  .ui-dd__custom input {
    font-size: 16px;
  }
  .ui-dd__pager button,
  .ui-dd__later {
    min-width: 32px;
    min-height: 36px;
  }
  .ui-dd__folded button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-dd,
  .ui-dd * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-dd {
  --ui-dd-card: #1c1c1e;
  --ui-dd-tray: #161618;
  --ui-dd-ink: rgba(255, 255, 255, 0.9);
  --ui-dd-muted: rgba(255, 255, 255, 0.46);
  --ui-dd-faint: rgba(255, 255, 255, 0.3);
  --ui-dd-line: rgba(255, 255, 255, 0.08);
  --ui-dd-fill: rgba(255, 255, 255, 0.08);
  --ui-dd-focus: rgba(77, 141, 255, 0.5);
}

.ui-dd__wire > svg {
  display: block;
  width: 100%;
  height: 100%;
}

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

.ui-up {
  --ui-up-card: #fff;
  --ui-up-ink: rgba(0, 0, 0, 0.88);
  --ui-up-muted: rgba(0, 0, 0, 0.45);
  --ui-up-faint: rgba(0, 0, 0, 0.27);
  --ui-up-line: rgba(0, 0, 0, 0.06);
  --ui-up-fill: rgba(0, 0, 0, 0.025);
  --ui-up-accent: #0060e2;
  --ui-up-focus: rgba(0, 96, 226, 0.35);
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
  color: var(--ui-up-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-up,
.ui-up *,
.ui-up *::before,
.ui-up *::after {
  box-sizing: border-box;
}
.ui-up button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-up button:focus-visible {
  outline: 2px solid var(--ui-up-focus);
  outline-offset: 2px;
}
.ui-up button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-up__file {
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
  box-shadow: 0 0 0 0.5px var(--ui-up-line);
  background: var(--ui-up-fill);
  animation: ui-up-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-up__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--ui-up-fill);
  color: var(--ui-up-muted);
}
.ui-up__icon[data-kind="voice"] {
  color: #a367d1;
}
.ui-up__icon[data-kind="video"] {
  color: #db5e9d;
}
.ui-up__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-up__info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0;
}
.ui-up__info strong {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-up__status {
  font-size: 11px;
  line-height: 16px;
  color: var(--ui-up-muted);
  font-variant-numeric: tabular-nums;
}
.ui-up__status button {
  font-size: 11px;
  text-decoration: underline;
  padding: 0;
}
.ui-up__file[data-state="failed"] .ui-up__status {
  color: #e5484d;
}
.ui-up__remove {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  color: var(--ui-up-muted) !important;
}
.ui-up__remove:hover {
  background: var(--ui-up-fill);
}
.ui-up__bar {
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  display: block;
  height: 2px;
  border-radius: 2px;
  background: var(--ui-up-fill);
  overflow: hidden;
  margin-top: 3px;
}
.ui-up__bar > span {
  display: block;
  transform-origin: left;
  width: 100%;
  height: 100%;
  background: var(--ui-up-accent);
  transition: transform 200ms linear;
}
.ui-up__file[data-state="paused"] .ui-up__bar > span {
  background: var(--ui-up-faint);
}
.ui-up__voice {
  flex-wrap: nowrap;
  align-items: center;
  padding: 4px 6px;
  gap: 8px;
  border-radius: 14px;
  height: 36px;
  background: var(--ui-up-card);
  box-shadow: 0 0 0 0.5px var(--ui-up-line);
}
.ui-up__voice > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-up-muted);
}
.ui-up__voice > button:hover {
  background: var(--ui-up-fill);
}
.ui-up__red-dot {
  width: 5px;
  height: 5px;
  background: #e5484d;
  border-radius: 50%;
  animation: ui-up-pulse 1s ease-in-out infinite;
}
.ui-up__wave {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: flex-start;
  height: 20px;
  overflow: hidden;
}
.ui-up__wave i {
  display: block;
  flex: none;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-up-accent);
  animation: ui-up-wave 600ms ease-in-out infinite alternate;
}
.ui-up__time {
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--ui-up-muted);
}
@keyframes ui-up-wave {
  to {
    transform: scaleY(0.2);
  }
}
@keyframes ui-up-pulse {
  50% {
    opacity: 0.3;
  }
}
@keyframes ui-up-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@container (max-width:400px) {
  .ui-up__file {
    max-width: 100%;
  }
}
@media (pointer: coarse) {
  .ui-up__remove,
  .ui-up__voice > button {
    width: 36px;
    height: 36px;
  }
  .ui-up__status button {
    min-height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-up,
  .ui-up * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-up {
  --ui-up-card: #1c1c1e;
  --ui-up-ink: rgba(255, 255, 255, 0.9);
  --ui-up-muted: rgba(255, 255, 255, 0.46);
  --ui-up-faint: rgba(255, 255, 255, 0.3);
  --ui-up-line: rgba(255, 255, 255, 0.08);
  --ui-up-fill: rgba(255, 255, 255, 0.04);
  --ui-up-accent: #4d8dff;
  --ui-up-focus: rgba(77, 141, 255, 0.5);
}

.ui-up__file[data-kind="voice"] {
  max-width: 380px;
}
.ui-up__file[data-kind="voice"][data-state="waiting"] {
  padding-block: 6px;
}
.ui-up__file[data-kind="voice"] .ui-up__status {
  white-space: normal;
}

.ui-th[data-orchestrator] {
  position: relative;
}
.ui-th[data-orchestrator] > .ui-cn {
  position: absolute;
  inset: 8px 0 auto;
  z-index: 4;
  pointer-events: none;
}
.ui-th[data-orchestrator] .ui-th__head {
  position: absolute;
  inset: 0 0 auto;
  z-index: 2;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 58px 0 24px;
}
.ui-th__title {
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}
.ui-th__summary {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-th-muted);
  font-variant-numeric: tabular-nums;
}
.ui-th__summary button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  min-height: 28px;
  border-radius: 5px;
  padding: 3px;
}
.ui-th__summary button:hover {
  background: var(--ui-th-fill);
}
.ui-th__summary-separator {
  color: var(--ui-th-faint);
}
.ui-th__running-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #13b8a6;
}
.ui-th__needs-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-th[data-orchestrator] .ui-th__scroll {
  padding-top: 56px;
  padding-bottom: 8px;
  mask-image: linear-gradient(transparent, #000 20px);
}
.ui-th[data-orchestrator] .ui-th__bubble {
  max-width: 80%;
}
.ui-th__part {
  margin-top: 12px;
}
.ui-th__part:has(.ui-tk) + .ui-th__part:has(.ui-tk) {
  margin-top: 8px;
}
.ui-th__part > .ui-th__files {
  margin-top: 0;
}
.ui-th__part > .ui-th__text {
  margin: 0;
}
.ui-th__asked {
  margin: -2px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 !important;
  min-height: 28px;
  border-radius: 6px;
  text-align: left;
  font-size: 13px !important;
  color: var(--ui-th-muted) !important;
}
.ui-th__asked:hover {
  background: var(--ui-th-fill);
}
.ui-th__asked > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-th__asked > i {
  width: 6px;
  height: 6px;
  margin: 0 4px;
  background: #e8a20c;
  border-radius: 50%;
  flex: none;
}
.ui-th__asked > i[data-answered] {
  background: #1a9a52;
}
.ui-th__asked > small {
  font-size: 11px;
  color: var(--ui-th-faint);
  flex: none;
}
.ui-th__error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5484d;
  font-size: 12px;
  padding: 7px 0;
}
.ui-th__error > span {
  flex: 1;
  overflow-wrap: anywhere;
}
.ui-th__error button {
  font-size: 12px;
  text-decoration: underline;
}
.ui-th__answer-context {
  font-size: 11px;
  color: var(--ui-th-muted);
  max-width: 80%;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-th__dock-slot[data-visible] {
  margin-bottom: 16px;
}
.ui-th__upload-slot {
  flex: 1;
  min-width: 0;
}
.ui-th[data-orchestrator] .ui-th__above {
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 2px;
  margin-bottom: 8px;
}
.ui-th__jump-live {
  width: 5px;
  height: 5px;
  background: #13b8a6;
  border-radius: 50%;
  animation: ui-th-caret 1.2s ease infinite;
}
.ui-th__unread-boundary {
  position: relative;
  margin-bottom: 18px;
}
.ui-th[data-orchestrator] .ui-th__foot {
  padding-top: 4px;
}
.ui-th[data-orchestrator] .ui-th__foot-column > .ui-cc {
  margin-top: 8px;
}
.ui-th[data-orchestrator] .ui-th__foot-column:has(.ui-th__dock-slot[data-visible]) > .ui-cc {
  margin-top: 0;
}
@container ui-th (max-width:900px) {
  .ui-th__summary {
    display: none;
  }
}
@container ui-th (max-width:560px) {
  .ui-th[data-orchestrator] .ui-th__scroll {
    padding-inline: 12px;
  }
  .ui-th[data-orchestrator] .ui-th__foot {
    padding-inline: 12px;
  }
  .ui-th[data-orchestrator] .ui-th__bubble {
    max-width: 88%;
  }
  .ui-th__asked {
    flex-wrap: wrap;
  }
  .ui-th__asked > span {
    white-space: normal;
    flex: 1;
  }
  .ui-th__asked > small {
    margin-left: 12px;
  }
}

.ui-th {
  --ui-th-card: #fff;
  --ui-th-ink: rgba(0, 0, 0, 0.88);
  --ui-th-text: rgba(0, 0, 0, 0.61);
  --ui-th-muted: rgba(0, 0, 0, 0.45);
  --ui-th-faint: rgba(0, 0, 0, 0.27);
  --ui-th-fill: rgba(0, 0, 0, 0.04);
  --ui-th-line: rgba(0, 0, 0, 0.06);
  --ui-th-focus: rgba(0, 96, 226, 0.35);
  --ui-th-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  position: relative;
  background: var(--ui-th-card);
  border-radius: inherit;
  container: ui-th / inline-size;
  font:
    14px/1.6 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-th-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-th,
.ui-th *,
.ui-th *::before,
.ui-th *::after {
  box-sizing: border-box;
}
.ui-th :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-th button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-th button:focus-visible {
  outline: 2px solid var(--ui-th-focus);
  outline-offset: 2px;
}
.ui-th__head {
  height: 32px;
  flex: none;
}
.ui-th__body {
  flex: 1;
  min-height: 0;
  position: relative;
}
.ui-th__scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 24px 32px 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-th-line) transparent;
  overflow-anchor: none;
}
.ui-th__column {
  max-width: 680px;
  margin-inline: auto;
  min-width: 0;
}
.ui-th__user {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin: 0 0 24px;
  animation: ui-th-in 420ms var(--ui-th-ease) both;
}
.ui-th__bubble {
  max-width: 94%;
  margin: 0;
  padding: 8px 14px;
  border-radius: 18px;
  background: var(--ui-th-fill);
  line-height: 22.4px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.ui-th__assistant {
  margin-bottom: 24px;
  animation: ui-th-in 420ms var(--ui-th-ease) both;
}
.ui-th__who {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
  font-size: 13px;
  line-height: 20.8px;
  margin-bottom: 12px;
}
.ui-th__who time {
  font-size: 11px;
  color: var(--ui-th-faint);
  font-variant-numeric: tabular-nums;
}
.ui-th__avatar {
  display: grid;
  grid-template-columns: repeat(3, 3px);
  grid-template-rows: repeat(3, 3px);
  gap: 2px;
  width: 15px;
  height: 15px;
  flex: none;
  align-content: center;
}
.ui-th__avatar i {
  background: #a654ff;
  width: 3px;
  height: 3px;
}
.ui-th__avatar[data-busy] i {
  animation: ui-th-pixel 1.25s ease-in-out infinite;
}
.ui-th__assistant > .ui-ta {
  margin-bottom: 12px;
}
.ui-th__text p {
  margin: 0 0 12px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.ui-th__text p:last-child {
  margin-bottom: 0;
}
.ui-th__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.ui-th__file {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 240px;
  height: 26px;
  padding: 3px 8px !important;
  background: var(--ui-th-fill) !important;
  border-radius: 6px;
  font-size: 12px !important;
}
.ui-th__file > span:first-child {
  display: flex;
  color: #2989df;
}
.ui-th__file > span[data-kind="table"] {
  color: #1a9a52;
}
.ui-th__file > span[data-kind="code"] {
  color: #eb9238;
}
.ui-th__file > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-th__file:hover {
  box-shadow: 0 0 0 0.5px var(--ui-th-line);
}
.ui-th__foot {
  padding: 12px 32px 20px;
  position: relative;
  flex: none;
}
.ui-th__foot-column {
  width: 100%;
  max-width: 680px;
  margin-inline: auto;
}
.ui-th__above {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}
.ui-th__stop {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 3px 12px !important;
  border-radius: 20px;
  font-size: 12px !important;
  background: var(--ui-th-card) !important;
  box-shadow:
    0 0 0 0.5px var(--ui-th-line),
    0 2px 6px rgba(0, 0, 0, 0.04);
  animation: ui-th-in 200ms both;
}
.ui-th__stop:hover {
  background: var(--ui-th-fill) !important;
}
.ui-th__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  background: var(--ui-th-ink);
  vertical-align: -2px;
  animation: ui-th-caret 1s steps(2) infinite;
}
.ui-th__stopped,
.ui-th__send-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ui-th-muted);
  margin-top: 8px;
}
.ui-th__send-status button {
  font-size: inherit;
  text-decoration: underline;
}
.ui-th__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  margin-bottom: 7px;
}
.ui-th__attachments > span {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--ui-th-fill);
  border-radius: 7px;
  padding: 5px 8px;
  font-size: 12px;
}
.ui-th__jump {
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  bottom: 12px;
  left: 50%;
  translate: -50% 0;
  min-height: 30px;
  padding: 4px 12px !important;
  border-radius: 20px;
  background: var(--ui-th-card) !important;
  box-shadow:
    0 0 0 0.5px var(--ui-th-line),
    0 3px 14px rgba(0, 0, 0, 0.06);
  font-size: 12px !important;
  white-space: nowrap;
  z-index: 2;
}
.ui-th__jump svg {
  rotate: 90deg;
}
.ui-th__empty {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--ui-th-muted);
}
.ui-th__empty-icon {
  color: #a654ff;
  margin-bottom: 12px;
}
.ui-th__empty h2 {
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--ui-th-ink);
  margin: 0 0 8px;
}
.ui-th__empty p {
  font-size: 13px;
  margin: 0;
}
.ui-th__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@keyframes ui-th-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@keyframes ui-th-pixel {
  50% {
    opacity: 0.2;
  }
}
@keyframes ui-th-caret {
  50% {
    opacity: 0;
  }
}
@container ui-th (max-width:600px) {
  .ui-th__scroll {
    padding-inline: 24px;
  }
  .ui-th__foot {
    padding-inline: 24px;
  }
  .ui-th__bubble {
    max-width: 96%;
  }
}
@container ui-th (max-width:400px) {
  .ui-th__scroll {
    padding: 20px 16px 12px;
  }
  .ui-th__foot {
    padding: 12px 12px 14px;
  }
  .ui-th__bubble {
    padding: 8px 12px;
  }
  .ui-th__user {
    margin-bottom: 20px;
  }
  .ui-th__assistant {
    margin-bottom: 26px;
  }
  .ui-th__empty h2 {
    font-size: 21px;
  }
}
@media (pointer: coarse) {
  .ui-th__file {
    height: 32px;
  }
  .ui-th__stop {
    min-height: 36px;
  }
  .ui-th__jump {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-th,
  .ui-th * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .ui-th__caret {
    opacity: 0.45;
  }
}
:where(.dark, [data-theme="dark"]) .ui-th {
  --ui-th-card: #1c1c1e;
  --ui-th-ink: rgba(255, 255, 255, 0.9);
  --ui-th-text: rgba(255, 255, 255, 0.62);
  --ui-th-muted: rgba(255, 255, 255, 0.46);
  --ui-th-faint: rgba(255, 255, 255, 0.3);
  --ui-th-fill: rgba(255, 255, 255, 0.06);
  --ui-th-line: rgba(255, 255, 255, 0.08);
  --ui-th-focus: rgba(77, 141, 255, 0.5);
}

@container ui-th (max-width:560px) {
  .ui-th:has(> .ui-cn) .ui-th__summary {
    visibility: hidden;
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
.ui-dd {
  --ui-dd-ink: #171717;
  --ui-dd-muted: #737373;
  --ui-dd-faint: #b5b5b5;
  --ui-dd-line: #e5e5e5;
  --ui-dd-fill: #f5f5f5;
  --ui-dd-focus: #2f6bff;
}
.ui-dd__clip {
  padding: 6px;
  background: var(--ui-dd-tray);
  border-radius: 22px;
}
.ui-dd__card {
  border: 1px solid var(--ui-dd-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-dd__option {
  min-height: 44px;
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
.ui-up {
  --ui-up-ink: #171717;
  --ui-up-muted: #737373;
  --ui-up-faint: #b5b5b5;
  --ui-up-line: #e5e5e5;
  --ui-up-fill: #f5f5f5;
  --ui-up-focus: #2f6bff;
}
.ui-up__file {
  border: 1px solid var(--ui-up-line);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
:where(.dark, [data-theme="dark"]) .ui-tk {
  --ui-tk-card: #232326;
  --ui-tk-ink: #ededed;
  --ui-tk-muted: #8f8f8f;
  --ui-tk-line: rgba(255, 255, 255, 0.1);
  --ui-tk-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-dd {
  --ui-dd-card: #232326;
  --ui-dd-ink: #ededed;
  --ui-dd-muted: #8f8f8f;
  --ui-dd-faint: #6b6b70;
  --ui-dd-line: rgba(255, 255, 255, 0.1);
  --ui-dd-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-cn {
  --ui-cn-card: #232326;
  --ui-cn-text: #c4c4c4;
  --ui-cn-muted: #8f8f8f;
  --ui-cn-line: rgba(255, 255, 255, 0.1);
  --ui-cn-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-ay {
  --ui-ay-card: #232326;
  --ui-ay-ink: #ededed;
  --ui-ay-muted: #8f8f8f;
  --ui-ay-line: rgba(255, 255, 255, 0.1);
  --ui-ay-fill: #2a2a2d;
}
:where(.dark, [data-theme="dark"]) .ui-up {
  --ui-up-card: #232326;
  --ui-up-ink: #ededed;
  --ui-up-muted: #8f8f8f;
  --ui-up-line: rgba(255, 255, 255, 0.1);
  --ui-up-fill: #2a2a2d;
}
.ui-ta {
  --ui-ta-ink: #171717;
  --ui-ta-text: #737373;
  --ui-ta-faint: #b5b5b5;
  --ui-ta-line: #e5e5e5;
  --ui-ta-ok: #1f8a4c;
  --ui-ta-focus: #2f6bff;
  font-size: 14px;
}
.ui-cc {
  --ui-cc-ink: #171717;
  --ui-cc-text: #404040;
  --ui-cc-muted: #737373;
  --ui-cc-faint: #b5b5b5;
  --ui-cc-tray: #f0f0f0;
  --ui-cc-fill: #f5f5f5;
  --ui-cc-line: #e5e5e5;
  --ui-cc-focus: #2f6bff;
  padding: 6px;
  border-radius: 22px;
  background: var(--ui-cc-tray);
  font-size: 14px;
}
.ui-cc__body {
  border: 1px solid var(--ui-cc-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-cc__send {
  background: linear-gradient(#323137, #201e25) !important;
  color: #fff !important;
  box-shadow:
    0 0 0 1px #0d0d0d,
    inset 0 1px rgba(255, 255, 255, 0.12);
}
.ui-cc__send:disabled {
  box-shadow: none;
  background: var(--ui-cc-fill) !important;
  color: var(--ui-cc-muted) !important;
}
.ui-cc__icon-btn,
.ui-cc__send {
  width: 32px;
  height: 32px;
}
.ui-cc__approval,
.ui-cc__model {
  height: 32px;
}
.ui-cc__menu {
  border: 1px solid var(--ui-cc-line);
  border-radius: 14px;
}
.ui-th {
  --ui-th-ink: #171717;
  --ui-th-text: #404040;
  --ui-th-muted: #737373;
  --ui-th-faint: #b5b5b5;
  --ui-th-line: #e5e5e5;
  --ui-th-fill: #f5f5f5;
  --ui-th-focus: #2f6bff;
}
:where(.dark, [data-theme="dark"]) .ui-cc {
  --ui-cc-card: #232326;
  --ui-cc-tray: #161618;
  --ui-cc-ink: #ededed;
  --ui-cc-text: #c4c4c4;
  --ui-cc-muted: #8f8f8f;
  --ui-cc-faint: #6b6b70;
  --ui-cc-line: rgba(255, 255, 255, 0.1);
  --ui-cc-fill: #2a2a2d;
  --ui-cc-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-th {
  --ui-th-card: #232326;
  --ui-th-ink: #ededed;
  --ui-th-text: #c4c4c4;
  --ui-th-muted: #8f8f8f;
  --ui-th-faint: #6b6b70;
  --ui-th-fill: #2a2a2d;
  --ui-th-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-ta {
  --ui-ta-card: #232326;
  --ui-ta-ink: #ededed;
  --ui-ta-text: #8f8f8f;
  --ui-ta-faint: #6b6b70;
  --ui-ta-focus: #6b95ff;
}

`;
