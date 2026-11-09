"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * agent-thread-screen (Classic) – a self-contained React 19 component.
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
  ].filter(
    (el) =>
      !el.closest("[inert],[hidden]") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden" &&
      (!event.currentTarget.matches('[role="menu"]') || el.closest('[role="menu"]') === event.currentTarget),
  );
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
  gap = side === "right" ? 10 : 8,
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
  gap?: number;
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
        height = Math.min(menu.offsetHeight, maxHeight);
      let x = side === "right" ? a.right + gap : align === "end" ? a.right - width : a.left;
      let y =
        side === "top"
          ? a.top - height - gap
          : side === "right"
            ? align === "end"
              ? a.bottom - height
              : a.top
            : a.bottom + gap;
      if (side === "bottom" && y + height > bottomEdge && a.top - height - gap >= topEdge) y = a.top - height - gap;
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
  }, [anchor, root, side, align, gap]);
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

/** `logo` renders in a small tile instead of `icon`; `keywords` only widen the search. Separate `shortcut` keys with spaces, such as "⌘ 1" or "G H". */
export type CommandMenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  logo?: ReactNode;
  keywords?: string;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
};
export type CommandMenuGroup = { id: string; label: string; commands: CommandMenuItem[] };
export type CommandMenuProps = {
  groups?: CommandMenuGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onRun?: (id: string) => void;
  placeholder?: string;
  /** Render the searchable list in place, without a modal backdrop. */
  inline?: boolean;
  className?: string;
};

const defaultCommands: CommandMenuGroup[] = [
  {
    id: "suggestions",
    label: "Suggestions",
    commands: [
      { id: "email", label: "Write an email", description: "Gmail", shortcut: "1" },
      { id: "assistant", label: "Ask assistant", description: "Summaries, drafts, answers", shortcut: "2" },
      { id: "task", label: "Create a task", description: "Tasks", shortcut: "3" },
      { id: "document", label: "New document", shortcut: "N" },
    ],
  },
  {
    id: "general",
    label: "General",
    commands: [
      { id: "invite", label: "Invite teammates", shortcut: "I" },
      { id: "upload", label: "Upload files", shortcut: "U" },
      { id: "appearance", label: "Change appearance" },
    ],
  },
];

/** Search grouped commands with roving focus, shortcuts, a focus trap and focus restoration. */
export function CommandMenu({
  groups = defaultCommands,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onClose,
  onRun,
  placeholder = "Type a command or search…",
  inline = false,
  className,
}: CommandMenuProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const source = (Array.isArray(groups) ? groups : []).filter(Boolean);
  const shown = source
    .map((group) => ({
      ...group,
      commands: (Array.isArray(group.commands) ? group.commands : []).filter(
        (command) =>
          command &&
          `${command.label} ${command.description ?? ""} ${command.keywords ?? ""}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
      ),
    }))
    .filter((group) => group.commands.length);
  const commands = shown.flatMap((group) => group.commands).filter((command) => !command.disabled);
  const index = Math.min(selected, Math.max(0, commands.length - 1));
  const close = () => {
    setOpen(false);
    onClose?.();
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  const run = (command: CommandMenuItem) => {
    command.onSelect?.();
    onRun?.(command.id);
    if (!inline) close();
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    input.current?.focus({ preventScroll: true });
    setQuery("");
    setSelected(0);
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      }
    };
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("keydown", escape, true);
      if (!inline && previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, inline]);
  useEffect(() => {
    panel.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [index, query]);
  if (!open) return null;
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const next =
      event.key === "ArrowDown"
        ? (index + 1) % commands.length
        : event.key === "ArrowUp"
          ? (index - 1 + commands.length) % commands.length
          : event.key === "Home" && !query
            ? 0
            : event.key === "End" && !query
              ? commands.length - 1
              : null;
    if (next !== null && commands.length) {
      event.preventDefault();
      setSelected(next);
      return;
    }
    if (event.key === "Enter" && commands[index]) {
      event.preventDefault();
      run(commands[index]);
    }
    if (event.key === "Tab" && !inline) {
      event.preventDefault();
      setSelected((index + (event.shiftKey ? commands.length - 1 : 1)) % Math.max(1, commands.length));
      input.current?.focus();
    }
    if ((event.metaKey || event.ctrlKey) && /^[1-9]$/.test(event.key)) {
      const command = commands.find((item) => item.shortcut === event.key);
      if (command) {
        event.preventDefault();
        run(command);
      }
    }
  };
  return (
    <div className={["ui-cm", className].filter(Boolean).join(" ")} data-inline={inline || undefined} onKeyDown={onKey}>
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      {!inline && (
        <button type="button" className="ui-cm__backdrop" aria-label="Close search" tabIndex={-1} onClick={close} />
      )}
      <div
        ref={panel}
        className="ui-cm__panel"
        role={inline ? undefined : "dialog"}
        aria-modal={!inline || undefined}
        aria-label="Search"
      >
        <div className="ui-cm__search">
          <Icon name="search" size={19} />
          <input
            ref={input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder={placeholder}
            role="combobox"
            aria-label="Search commands"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={commands[index] ? `${id}-${commands[index].id}` : undefined}
          />
          <button type="button" onClick={close} aria-label="Close search">
            <kbd>Esc</kbd>
          </button>
        </div>
        <div className="ui-cm__list" id={`${id}-list`} role="listbox" aria-label="Commands">
          {shown.map((group) => (
            <div role="group" aria-labelledby={`${id}-${group.id}-label`} className="ui-cm__group" key={group.id}>
              <div className="ui-cm__label" id={`${id}-${group.id}-label`}>
                {group.label}
              </div>
              {group.commands.map((command) => (
                <button
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={commands[index]?.id === command.id}
                  disabled={command.disabled}
                  id={`${id}-${command.id}`}
                  className="ui-cm__item"
                  key={command.id}
                  onPointerMove={() =>
                    setSelected(
                      Math.max(
                        0,
                        commands.findIndex((item) => item.id === command.id),
                      ),
                    )
                  }
                  onClick={() => run(command)}
                >
                  <span
                    className="ui-cm__icon"
                    onErrorCapture={(event) => {
                      if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                    }}
                  >
                    {command.icon ?? command.logo ?? (
                      <Icon
                        name={
                          command.id === "email"
                            ? "document"
                            : command.id === "assistant"
                              ? "spark"
                              : command.id === "task"
                                ? "tasks"
                                : "folder"
                        }
                      />
                    )}
                  </span>
                  <span className="ui-cm__text">
                    <span dir="auto">{command.label}</span>
                    {command.description && <small dir="auto">{command.description}</small>}
                  </span>
                  {command.shortcut && (
                    <kbd>
                      {/^[1-9]$/.test(command.shortcut) ? "⌘ " : ""}
                      {command.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
          {!commands.length && (
            <p className="ui-cm__empty" role="status">
              No commands found for “{query}”.
            </p>
          )}
        </div>
        <footer className="ui-cm__foot">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to select
          </span>
          <span>
            <kbd>⌘ K</kbd> to open
          </span>
        </footer>
      </div>
    </div>
  );
}

export type AppRailItem = { label: string; icon?: ReactNode; count?: number; disabled?: boolean; section?: string };
export type AppChat = { id: string; title: string; project?: string; pinned?: boolean; unread?: boolean };
export type AppShellUser = { name: string; email?: string; avatar?: string };
const defaultAppShellLabels = {
  sidebar: "Sidebar",
  openSidebar: "Open sidebar",
  closeSidebar: "Close sidebar",
  collapseSidebar: "Collapse sidebar",
  expandSidebar: "Expand sidebar",
  resizeSidebar: "Resize sidebar",
  panelTitle: "Artifacts",
  openPanel: (title: string) => `Open ${title.toLowerCase()}`,
  closePanel: (title: string) => `Close ${title.toLowerCase()}`,
  resizePanel: (title: string) => `Resize ${title.toLowerCase()}`,
  apps: "Apps",
  unreadCount: (label: string, count: number) => `${label}, ${count} unread`,
  search: "Search",
  searchHint: "Search (⌘K)",
  searchPlaceholder: "Search…",
  workspace: "Workspace",
  conversations: "Conversations",
  newChat: "New chat",
  chats: "Chats",
  pinned: "Pinned",
  projects: "Projects",
  allProjects: "All projects",
  noProject: "No project",
  projectName: "Project name",
  createProject: "Create project",
  newProject: "New project",
  moveToProject: "Move to project",
  empty: "No chats yet. Start a new conversation.",
  chatName: "Chat name",
  unread: "Unread",
  options: (title: string) => `Options for ${title}`,
  pin: (title: string, pinned: boolean) => `${pinned ? "Unpin" : "Pin"} ${title}`,
  account: "Account",
  language: "Language",
  appearance: "Appearance",
  theme: (value: "light" | "dark" | "system") => value.charAt(0).toUpperCase() + value.slice(1),
  action: (action: string) => action,
  goTo: "Go to",
  copied: "Conversation title copied",
  copyFailed: "Couldn't copy. Please try again.",
};
export type AppShellLabels = typeof defaultAppShellLabels;
export type AppShellProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  /** Replace the navigation column, retaining the aside, resizer and drawer. null hides its contents. */
  sidebar?: ReactNode;
  /** Content above the account button in the built-in sidebar. */
  sidebarFooter?: ReactNode;
  /** A row above main and panel. No row is added for undefined or null. */
  header?: ReactNode;
  labels?: Partial<AppShellLabels>;
  workspace?: string;
  user?: AppShellUser;
  rail?: false | { items: AppRailItem[]; bottom?: AppRailItem[]; active?: string };
  active?: string;
  defaultActive?: string;
  onActiveChange?: (label: string) => void;
  onNavigate?: (label: string) => void;
  /** A regular application navigation sidebar, instead of the project/chat list. */
  navigation?: AppRailItem[];
  /** Retain project/chat history below the regular navigation. */
  showChatHistory?: boolean;
  /** Replace the shell's default command-search groups with application-specific commands. */
  commands?: CommandMenuGroup[];
  /** Offer “Ask assistant about …” as the first search result for any query. */
  onAsk?: (query: string) => void;
  /** Register the built-in Mod+K listener. Disable when the application owns its command palette. */
  globalShortcut?: boolean;
  sidebarCollapsed?: boolean;
  defaultSidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  chats?: AppChat[];
  defaultChats?: AppChat[];
  onChatsChange?: (chats: AppChat[]) => void;
  activeChat?: string;
  defaultActiveChat?: string;
  onOpenChat?: (id: string) => void;
  onNewChat?: () => void;
  onChatAction?: (action: string, id: string) => void;
  projects?: string[];
  defaultProjects?: string[];
  onProjectsChange?: (projects: string[]) => void;
  project?: string;
  defaultProject?: string;
  onProjectChange?: (project: string) => void;
  sidebarWidth?: number;
  defaultSidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  /** Application-specific limits, shared by layout, pointer/keyboard resizing and ARIA. */
  sidebarBounds?: { min: number; max: number };
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  panel?: ReactNode;
  panelTitle?: string;
  panelOpen?: boolean;
  defaultPanelOpen?: boolean;
  onPanelOpenChange?: (open: boolean) => void;
  panelWidth?: number;
  defaultPanelWidth?: number;
  onPanelWidthChange?: (width: number) => void;
  panelBounds?: { min: number; max: number };
  theme?: "light" | "dark" | "system";
  defaultTheme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
  layout?: "inset" | "flat";
};

export const defaultChatProjects = ["Summer collection", "Brand", "Hiring", "Research"];
export const defaultChats: AppChat[] = [
  { id: "fabric", title: "Best fabric for a summer overshirt", project: "Summer collection" },
  { id: "colors", title: "Colour names for the linen line", project: "Summer collection" },
  { id: "sizing", title: "Size chart for relaxed fits", project: "Summer collection" },
  { id: "tone", title: "Tone of voice, in five rules", project: "Brand", pinned: true },
  { id: "designer", title: "Interview questions for a designer", project: "Hiring" },
  { id: "suppliers", title: "Linen suppliers in Portugal", project: "Research", unread: true },
  { id: "returns", title: "Why people return shirts", project: "Research" },
  { id: "trip", title: "Packing list for Lisbon" },
  { id: "email", title: "Reply to the agency" },
];
export const defaultChatRail = {
  items: [
    { label: "Chats", icon: <Icon name="chat" size={19} /> },
    { label: "Tasks", icon: <Icon name="tasks" size={19} /> },
    { label: "Runs", icon: <Icon name="play" size={19} /> },
    { label: "Folders", icon: <Icon name="folder" size={19} /> },
    { label: "Integrations", icon: <Icon name="plug" size={19} /> },
  ],
  bottom: [
    { label: "Notifications", icon: <Icon name="bell" size={19} />, count: 2 },
    { label: "Settings", icon: <Icon name="settings" size={19} /> },
  ],
  active: "Chats",
};

const wsGlyphs = {
  invite: (
    <>
      <path d="M3 20.5c.3-3.7 3.3-6.8 7-7 .3 0 .6 0 1-.1l1 .1c.7 0 1.4.2 2 .4" />
      <path d="M18 15.5v6M21 18.5h-6" />
      <circle cx="11" cy="6.5" r="4" />
    </>
  ),
  settings: (
    <>
      <path d="M21.32 7.14 20.82 6.28C20.45 5.64 20.26 5.31 19.95 5.18 19.63 5.05 19.27 5.16 18.55 5.36L17.33 5.7C16.87 5.81 16.39 5.75 15.97 5.53L15.64 5.34C15.28 5.11 15 4.77 14.85 4.37L14.51 3.38C14.29 2.72 14.18 2.39 13.92 2.2 13.66 2.01 13.31 2.01 12.62 2.01H11.51C10.81 2.01 10.46 2.01 10.2 2.2 9.94 2.39 9.83 2.72 9.61 3.38L9.28 4.37C9.12 4.77 8.85 5.11 8.49 5.34L8.15 5.53C7.73 5.75 7.25 5.81 6.79 5.7L5.57 5.36C4.86 5.16 4.5 5.05 4.18 5.18 3.86 5.31 3.67 5.64 3.3 6.28L2.81 7.14C2.46 7.75 2.28 8.05 2.32 8.38 2.35 8.7 2.58 8.96 3.05 9.48L4.08 10.63C4.34 10.95 4.52 11.51 4.52 12.01 4.52 12.51 4.34 13.06 4.08 13.38L3.05 14.54C2.58 15.06 2.35 15.32 2.32 15.64 2.28 15.96 2.46 16.27 2.81 16.87L3.3 17.73C3.67 18.38 3.86 18.7 4.18 18.83 4.5 18.96 4.86 18.86 5.57 18.66L6.79 18.31C7.25 18.21 7.73 18.27 8.15 18.48L8.49 18.68C8.85 18.91 9.12 19.24 9.28 19.64L9.61 20.64C9.83 21.3 9.94 21.63 10.2 21.82 10.46 22.01 10.81 22.01 11.51 22.01H12.62C13.31 22.01 13.66 22.01 13.92 21.82 14.18 21.63 14.29 21.3 14.51 20.64L14.85 19.64C15 19.24 15.28 18.91 15.64 18.68L15.97 18.48C16.39 18.27 16.87 18.21 17.33 18.31L18.55 18.66C19.27 18.86 19.63 18.96 19.95 18.83 20.26 18.7 20.45 18.38 20.82 17.73L21.32 16.87C21.67 16.27 21.84 15.96 21.81 15.64 21.77 15.32 21.54 15.06 21.07 14.54L20.04 13.38C19.79 13.06 19.61 12.51 19.61 12.01 19.61 11.51 19.79 10.95 20.04 10.63L21.07 9.48C21.54 8.96 21.77 8.7 21.81 8.38 21.84 8.05 21.67 7.75 21.32 7.14Z" />
      <circle cx="12.02" cy="12" r="3.5" />
    </>
  ),
  analytics: (
    <>
      <path d="M7 17v-4M12 17V7M17 17v-6" />
      <path d="M2.5 12c0-4.48 0-6.72 1.39-8.11S7.52 2.5 12 2.5s6.72 0 8.11 1.39S21.5 7.52 21.5 12s0 6.72-1.39 8.11S16.48 21.5 12 21.5s-6.72 0-8.11-1.39S2.5 16.48 2.5 12Z" />
    </>
  ),
  billing: (
    <>
      <path d="M2 12c0-3.54 0-5.31 1.05-6.49.17-.19.36-.36.56-.52C4.86 4 6.74 4 10.5 4h3c3.76 0 5.64 0 6.89.99.2.16.39.33.56.52C22 6.69 22 8.46 22 12s0 5.31-1.05 6.49c-.17.19-.36.36-.56.52-1.25.99-3.13.99-6.89.99h-3c-3.76 0-5.64 0-6.89-.99-.2-.16-.39-.33-.56-.52C2 17.31 2 15.54 2 12ZM10 16h1.5M14.5 16H18M2 9h20" />
    </>
  ),
  usage: (
    <>
      <path d="M4.32 19.68C3 18.36 3 16.24 3 12s0-6.36 1.32-7.68S7.76 3 12 3s6.36 0 7.68 1.32S21 7.76 21 12s0 6.36-1.32 7.68S16.24 21 12 21s-6.36 0-7.68-1.32Z" />
      <path d="m7 14 2.79-2.79a1 1 0 0 1 1.42 0l1.58 1.58a1 1 0 0 0 1.42 0L17 10" />
    </>
  ),
  members: (
    <>
      <path d="M18.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM8 11a3 3 0 0 1 0-6M14.5 14C9.81 14 7 16.5 7 19c0 1.1.84 2 1.88 2h11.25c1.03 0 1.87-.9 1.87-2 0-2.5-2.81-5-7.5-5ZM4 20h-.5C2.67 20 2 19.23 2 18.28c0-1.61 1.27-3.22 3.5-3.92" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8.25h.01" />
    </>
  ),
  docs: (
    <>
      <path d="M15.5 7h-7M12.5 11h-4M20 22H6a2 2 0 0 1 0-4h14V6c0-1.89 0-2.83-.59-3.41C18.83 2 17.89 2 16 2h-6C7.17 2 5.76 2 4.88 2.88 4 3.76 4 5.17 4 8v12M19.5 18s-1 .76-1 2 1 2 1 2" />
    </>
  ),
  changelog: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4l2 2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.91 2.06C12.73 12.03 12 12.67 12 13.5M12 16.75h.01" />
    </>
  ),
  switch: (
    <>
      <path d="M20 17H4M17 14s3 2.21 3 3-3 3-3 3M5 7h15M7 4S4 6.21 4 7s3 3 3 3" />
    </>
  ),
  language: (
    <>
      <path d="M5 5.83h6M7.7 5.83V5M9.5 5.83c-.32 1.13-.98 2.2-1.74 3.14M5.84 11c.61-.56 1.3-1.25 1.92-2.03M7.76 8.97c-.38-.45-.92-1.18-1.08-1.51M7.76 8.97l1.16 1.2M13.5 19l2.5-6 2.5 6M14.33 17h3.34M14 10V8c0-2.83 0-4.24-.88-5.12S10.83 2 8 2s-4.24 0-5.12.88S2 5.17 2 8s0 4.24.88 5.12S5.17 14 8 14h2" />
      <rect x="10" y="10" width="12" height="12" rx="4" />
      <path d="M4 16.5c0 1.4 0 2.1.34 2.61.15.22.33.41.55.55.5.34 1.21.34 2.61.34M20 7.5c0-1.4 0-2.1-.34-2.61a2 2 0 0 0-.55-.55C18.61 4 17.9 4 16.5 4" />
    </>
  ),
  appearance: (
    <>
      <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12s4.48 10 10 10c.84 0 2 .12 2-1 0-.61-.32-1.08-.63-1.55-.46-.68-.92-1.36-.37-2.45.67-1.33 1.78-1.33 3.48-1.33.85 0 1.85 0 3.02-.17 2.1-.3 2.5-1.59 2.5-3.5Z" />
      <circle cx="9.5" cy="8.5" r="1.5" />
      <circle cx="16.5" cy="9.5" r="1.5" />
      <path d="M7 15h.01" />
    </>
  ),
  system: (
    <>
      <path d="M8 21h8M10 21c.83 0 1.5-.67 1.5-1.5V17h1v2.5c0 .83.67 1.5 1.5 1.5M12 17v4" />
      <rect x="2" y="3" width="20" height="14" rx="5" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v1.5M12 20.5V22M19.07 19.07l-1.06-1.06M5.99 5.99 4.93 4.93M22 12h-1.5M3.5 12H2M19.07 4.93l-1.06 1.06M5.99 18.01l-1.06 1.06" />
    </>
  ),
  dark: <path d="M21.5 14.08a8.56 8.56 0 0 1-12.58-7.56c0-1.45.36-2.82 1-4.02A9.63 9.63 0 1 0 21.5 14.08Z" />,
  integrations: (
    <>
      <path d="M15.5 2v4M8.5 6V2M6 7.61C5.94 6.74 6.64 6 7.53 6h8.94c.89 0 1.59.74 1.53 1.61l-.19 2.38a10 10 0 0 1-1.68 4.79l-.6.88a3.08 3.08 0 0 1-2.55 1.34h-1.96a3.08 3.08 0 0 1-2.55-1.34l-.6-.88a10 10 0 0 1-1.68-4.79ZM12 17v5M11 9h2" />
    </>
  ),
  download: (
    <>
      <path d="M16.95 12.18c.25.63-.44 1.39-1.82 2.91-1.46 1.6-2.21 2.4-3.13 2.41-.92-.01-1.67-.81-3.13-2.41-1.38-1.52-2.07-2.28-1.82-2.91.3-.64 1.19-.68 2.95-.68V5c0-.47 0-.7.05-.89a1.5 1.5 0 0 1 1.06-1.06C11.3 3 11.53 3 12 3s.7 0 .89.05a1.5 1.5 0 0 1 1.06 1.06c.05.19.05.42.05.89v6.5c1.76 0 2.65.04 2.95.68ZM5 21h14" />
    </>
  ),
  logout: (
    <>
      <path d="M15.5 8.04c-.04-1.16-.18-1.89-.64-2.45-.65-.82-1.77-1.07-4-1.58l-1-.23c-3.4-.77-5.09-1.16-6.23-.27C2.5 4.4 2.5 6.13 2.5 9.57v4.86c0 3.44 0 5.17 1.13 6.06 1.14.89 2.83.5 6.23-.27l1-.23c2.23-.51 3.35-.76 4-1.58.46-.56.6-1.29.64-2.45M18.5 9.01s3 2.21 3 3-3 3-3 3M21 12.01H8.5" />
    </>
  ),
  plus: <path d="M12 4v16M20 12H4" />,
  check: <path d="m5 14 3.5 3.5L19 6.5" />,
  next: <path d="M9 6s6 4.42 6 6-6 6-6 6" />,
};
function WsGlyph({ name, size = 15 }: { name: keyof typeof wsGlyphs; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {wsGlyphs[name]}
    </svg>
  );
}
const assistantSpark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="ui-as-spark" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#7C5CFF" />
        <stop offset="1" stopColor="#2F9BFF" />
      </linearGradient>
    </defs>
    <path
      fill="url(#ui-as-spark)"
      d="M12 2.5c.6 3.9 2.1 6.4 4.4 7.6 1.1.6 2.4.9 4.1 1.1v1.6c-4.6.6-7.3 3-8.5 8.7h-1.6c-.6-3.9-2.1-6.4-4.4-7.6-1.1-.6-2.4-.9-4.1-1.1v-1.6c4.6-.6 7.3-3 8.5-8.7z"
    />
  </svg>
);
const foldText = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
function SearchMatch({ text, query }: { text: string; query: string }) {
  const folded = foldText(text),
    needle = foldText(query),
    at = needle && folded.length === text.length ? folded.indexOf(needle) : -1;
  return at < 0 ? (
    <>{text}</>
  ) : (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  );
}

/** The shell's ⌘K search: grouped commands with a sliding highlight, Tab between groups and an optional “Ask assistant” row. The first five visible “suggestions” run with Mod+1–5. */
function ShellSearch({
  groups,
  placeholder,
  onRun,
  onAsk,
  onClose,
}: {
  groups: CommandMenuGroup[];
  placeholder: string;
  onRun: (command: CommandMenuItem) => void;
  onAsk?: (query: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState(""),
    [selectedKey, setSelectedKey] = useState<string | null>(null),
    [lit, setLit] = useState(true);
  const [pill, setPill] = useState<{ y: number; h: number } | null>(null),
    [height, setHeight] = useState(0);
  const input = useRef<HTMLInputElement>(null),
    list = useRef<HTMLDivElement>(null),
    inner = useRef<HTMLDivElement>(null),
    reveal = useRef(false),
    id = useId();
  const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";
  const q = query.trim(),
    needle = foldText(q);
  const shown: { id: string; label: string; commands: (CommandMenuItem & { key: string })[] }[] = (
    Array.isArray(groups) ? groups : []
  )
    .filter(Boolean)
    .map((group) => ({
      ...group,
      commands: (Array.isArray(group.commands) ? group.commands : [])
        .filter(
          (command) =>
            command &&
            (!needle ||
              foldText(`${command.label} ${command.description ?? ""} ${command.keywords ?? ""}`).includes(needle)),
        )
        .map((command, index) => ({
          ...command,
          key: `${group.id}:${command.id}`,
          shortcut: group.id === "suggestions" && index < 5 ? `⌘ ${index + 1}` : command.shortcut,
        })),
    }))
    .filter((group) => group.commands.length);
  if (q && onAsk)
    shown.unshift({
      id: "ask",
      label: "Assistant",
      commands: [
        { id: "ask", key: "ask", label: `Ask assistant about “${q}”`, logo: assistantSpark, onSelect: () => onAsk(q) },
      ],
    });
  const flat = shown.flatMap((group) => group.commands).filter((command) => !command.disabled);
  const selected = flat.find((command) => command.key === selectedKey) ?? flat[0];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    input.current?.focus({ preventScroll: true });
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  useLayoutEffect(() => {
    const box = list.current,
      row = box?.querySelector<HTMLElement>(`[data-key="${CSS.escape(selected?.key ?? "")}"]`);
    if (!box || !row) {
      setPill(null);
      return;
    }
    setPill({ y: row.offsetTop, h: row.offsetHeight });
    if (!reveal.current) return;
    reveal.current = false;
    const label = row.previousElementSibling?.classList.contains("ui-as__cmd-label")
      ? (row.previousElementSibling as HTMLElement).offsetHeight
      : 0;
    const top = row.offsetTop - 8 - label,
      bottom = row.offsetTop + row.offsetHeight + 8;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight;
  }, [selected?.key, flat.length]);
  useLayoutEffect(() => {
    const box = list.current,
      content = inner.current;
    if (!box || !content) return;
    const measure = () => {
      const style = getComputedStyle(box);
      setHeight(
        Math.min(
          content.offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
          parseFloat(style.maxHeight) || Infinity,
        ),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  const move = (step: number) => {
    if (!flat.length || !selected) return;
    reveal.current = true;
    setLit(true);
    const target = flat[(flat.indexOf(selected) + step + flat.length) % flat.length];
    if (target) setSelectedKey(target.key);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      move(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Enter" && selected) {
      event.preventDefault();
      onRun(selected);
    } else if (event.key === "Tab") {
      event.preventDefault();
      if (shown.length < 2) return;
      const current = shown.findIndex((group) => group.commands.some((command) => command.key === selected?.key));
      const next = event.shiftKey ? (current <= 0 ? shown.length - 1 : current - 1) : (current + 1) % shown.length;
      const target = shown[next]?.commands.find((command) => !command.disabled);
      if (target) {
        reveal.current = true;
        setLit(true);
        setSelectedKey(target.key);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (query) {
        setQuery("");
        setSelectedKey(null);
      } else onClose();
    } else if ((event.metaKey || event.ctrlKey) && /^[1-9]$/.test(event.key)) {
      const command = flat.find((item) => item.shortcut?.split(" ").at(-1) === event.key);
      if (command) {
        event.preventDefault();
        onRun(command);
      }
    }
  };
  return (
    <div
      className="ui-as__cmd"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ui-as__cmd-card">
        <label className="ui-as__cmd-search">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7.25" cy="7.25" r="4.75" />
            <path d="m13.5 13.5-2.9-2.9" />
          </svg>
          <input
            ref={input}
            value={query}
            dir="auto"
            placeholder={placeholder}
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={selected ? `${id}-${selected.key}` : undefined}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedKey(null);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="ui-as__cmd-enter" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M12.5 4v3a2 2 0 0 1-2 2h-7M6 6.5 3.5 9 6 11.5" />
            </svg>
          </kbd>
        </label>
        <div
          ref={list}
          id={`${id}-list`}
          className="ui-as__cmd-list"
          role="listbox"
          aria-label="Commands"
          style={height ? { height } : undefined}
          onMouseLeave={() => setLit(false)}
        >
          {pill && (
            <span
              className="ui-as__cmd-pill"
              data-lit={lit || undefined}
              style={{ transform: `translateY(${pill.y}px)`, height: pill.h }}
              aria-hidden="true"
            />
          )}
          <div ref={inner}>
            {shown.map((group) => (
              <div role="group" aria-label={group.label} className="ui-as__cmd-group" key={group.id}>
                {group.id !== "ask" && group.label && (
                  <span className="ui-as__cmd-label" dir="auto">
                    {group.label}
                  </span>
                )}
                {group.commands.map((command) => {
                  const keys = command.shortcut
                    ?.split(" ")
                    .filter(Boolean)
                    .map((key) => (key === "⌘" ? mod : key));
                  return (
                    <button
                      type="button"
                      role="option"
                      tabIndex={-1}
                      id={`${id}-${command.key}`}
                      data-key={command.key}
                      aria-selected={command.key === selected?.key}
                      disabled={command.disabled}
                      className="ui-as__cmd-item"
                      key={command.key}
                      onMouseMove={() => {
                        setLit(true);
                        if (command.key !== selected?.key && !command.disabled) setSelectedKey(command.key);
                      }}
                      onClick={() => onRun(command)}
                    >
                      <span className={command.logo ? "ui-as__cmd-logo" : "ui-as__cmd-icon"}>
                        {command.logo ?? command.icon ?? (
                          <Icon
                            name={
                              command.id.startsWith("chat:")
                                ? "chat"
                                : command.id.startsWith("project:")
                                  ? "folder"
                                  : command.id === "new-chat"
                                    ? "compose"
                                    : "document"
                            }
                          />
                        )}
                      </span>
                      <span className="ui-as__cmd-text">
                        <span className="ui-as__cmd-name" dir="auto" title={command.label}>
                          <SearchMatch text={command.label} query={q} />
                        </span>
                        {command.description && (
                          <span className="ui-as__cmd-hint" dir="auto" title={command.description}>
                            <SearchMatch text={command.description} query={q} />
                          </span>
                        )}
                      </span>
                      {keys?.length ? (
                        <span className="ui-as__cmd-keys" aria-hidden="true">
                          {keys.map((key, index) => (
                            <kbd key={index}>{key}</kbd>
                          ))}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
            {!flat.length && (
              <p className="ui-as__cmd-empty" role="status">
                No results for “{q}”
              </p>
            )}
          </div>
        </div>
        <footer className="ui-as__cmd-foot">
          <span>
            <kbd>Tab</kbd> to jump between sections
          </span>
          <span>
            <span className="ui-as__cmd-keys">
              <kbd>{mod}</kbd>
              <kbd>K</kbd>
            </span>
            to open
          </span>
        </footer>
      </div>
    </div>
  );
}

/** A resizable application shell with optional icon rail, project/chat navigation and an artifact panel. */
export function AppShell({
  sidebar: sidebarContent,
  sidebarFooter,
  header,
  labels: labelsProp,
  workspace = "Fieldwork",
  user = { name: "Alex Morgan", email: "alex@fieldwork.com" },
  rail = false,
  active: activeProp,
  defaultActive = "Chats",
  onActiveChange,
  onNavigate,
  navigation,
  showChatHistory = false,
  commands: commandGroupsProp,
  onAsk,
  globalShortcut = true,
  sidebarCollapsed: collapsedProp,
  defaultSidebarCollapsed = false,
  onSidebarCollapsedChange,
  chats: chatsProp,
  defaultChats: initialChats = defaultChats,
  onChatsChange,
  activeChat: activeChatProp,
  defaultActiveChat = "fabric",
  onOpenChat,
  onNewChat,
  onChatAction,
  projects: projectsProp,
  defaultProjects = defaultChatProjects,
  onProjectsChange,
  project: projectProp,
  defaultProject = "",
  onProjectChange,
  sidebarWidth: sidebarWidthProp,
  defaultSidebarWidth = 272,
  onSidebarWidthChange,
  sidebarBounds = { min: 200, max: 420 },
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = false,
  onSidebarOpenChange,
  panel,
  panelTitle: panelTitleProp,
  panelOpen: panelOpenProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  panelWidth: panelWidthProp,
  defaultPanelWidth = 455,
  onPanelWidthChange,
  panelBounds = { min: 300, max: 640 },
  theme: themeProp,
  defaultTheme = "system",
  onThemeChange,
  layout = "inset",
  children,
  className,
  onKeyDown,
  style,
  ...rest
}: AppShellProps) {
  const labels = { ...defaultAppShellLabels, ...labelsProp };
  const panelTitle = panelTitleProp ?? labels.panelTitle;
  const [collapsed, setCollapsed] = useControllable(collapsedProp, defaultSidebarCollapsed, onSidebarCollapsedChange);
  const [chats, setChats] = useControllable(chatsProp, initialChats, onChatsChange);
  const [projects, setProjects] = useControllable(projectsProp, defaultProjects, onProjectsChange);
  const [project, setProject] = useControllable(projectProp, defaultProject, onProjectChange);
  const [activeChat, setActiveChat] = useControllable(activeChatProp, defaultActiveChat, onOpenChat);
  const [active, setActive] = useControllable(activeProp, defaultActive, onActiveChange);
  const [sidebarWidthValue, setSidebarWidth] = useControllable(
    sidebarWidthProp,
    defaultSidebarWidth,
    onSidebarWidthChange,
  );
  const [panelWidthValue, setPanelWidth] = useControllable(panelWidthProp, defaultPanelWidth, onPanelWidthChange);
  const sidebarWidth = clamp(safeNumber(sidebarWidthValue, 272), sidebarBounds.min, sidebarBounds.max);
  const panelWidth = clamp(safeNumber(panelWidthValue, 455), panelBounds.min, panelBounds.max);
  const [sidebarOpen, setSidebarOpen] = useControllable(sidebarOpenProp, defaultSidebarOpen, onSidebarOpenChange);
  const [panelOpen, setPanelOpen] = useControllable(panelOpenProp, defaultPanelOpen, onPanelOpenChange);
  const [theme, setTheme] = useControllable(themeProp, defaultTheme, onThemeChange);
  const [systemDark, setSystemDark] = useState(false),
    [narrow, setNarrow] = useState(false),
    [searchOpen, setSearchOpen] = useState(false);
  const [folders, setFolders] = useState<string[]>(() => (projectsProp ?? defaultProjects).slice(0, 1));
  const [menu, setMenu] = useState<"workspace" | "account" | "projects" | "chat" | "chat-project" | null>(null);
  const [wsOpen, setWsOpen] = useState<string | null>(null);
  useEffect(() => setWsOpen(null), [menu]);
  const [menuChat, setMenuChat] = useState<string | null>(null),
    [renaming, setRenaming] = useState<string | null>(null),
    [renameValue, setRenameValue] = useState("");
  const [addingProject, setAddingProject] = useState(false),
    [newProject, setNewProject] = useState("");
  const [language, setLanguage] = useState("English"),
    [notice, setNotice] = useState(""),
    [brokenAvatar, setBrokenAvatar] = useState(false),
    [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    sidebar = useRef<HTMLElement>(null),
    panelRef = useRef<HTMLElement>(null),
    anchor = useRef<HTMLElement>(null),
    renameRef = useRef<HTMLInputElement>(null),
    sideOpenRef = useRef<HTMLButtonElement>(null),
    panelOpenRef = useRef<HTMLButtonElement>(null);
  const cleanupDrag = useRef<(() => void) | null>(null),
    narrowRef = useRef<boolean | null>(null);
  const id = useId();
  const list = (Array.isArray(chats) ? chats : []).filter(Boolean),
    projectList = (Array.isArray(projects) ? projects : []).filter(Boolean);
  const shown = project ? list.filter((chat) => chat.project === project) : list;
  const currentMenuChat = list.find((chat) => chat.id === menuChat);
  const hasPanel = panel != null,
    railWidth = rail ? 52 : 0;
  const iconSidebar = !!navigation && !rail && sidebarContent === undefined;
  const userAvatar =
    user.avatar && !brokenAvatar ? (
      <img src={user.avatar} alt="" onError={() => setBrokenAvatar(true)} />
    ) : (
      initials(user.name)
    );
  const visiblePanel = hasPanel && panelOpen;
  const drawer = narrow && (sidebarOpen || visiblePanel);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => setBrokenAvatar(false), [user.avatar]);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const next = entry.contentRect.width < 900;
      if (next !== narrowRef.current) {
        narrowRef.current = next;
        setNarrow(next);
        if (next) {
          setPanelOpen(false);
          setSidebarOpen(false);
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (renaming) {
      renameRef.current?.focus();
      renameRef.current?.select();
    }
  }, [renaming]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => () => cleanupDrag.current?.(), []);
  const live = useRef({ narrow, sidebarOpen, panelOpen, root: root.current });
  live.current = { narrow, sidebarOpen, panelOpen, root: root.current };
  const closeDrawer = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
      sideOpenRef.current?.focus();
    } else {
      setPanelOpen(false);
      panelOpenRef.current?.focus();
    }
  };
  const closeDrawerRef = useRef(closeDrawer);
  closeDrawerRef.current = closeDrawer;
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      const state = live.current;
      const inside = state.root?.contains(document.activeElement) || document.activeElement === document.body;
      if (!inside || event.defaultPrevented) return;
      if (globalShortcut && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (event.key === "Escape" && state.narrow && (state.sidebarOpen || state.panelOpen)) {
        event.preventDefault();
        closeDrawerRef.current();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [globalShortcut]);
  useEffect(() => {
    if (!drawer) return;
    const area = sidebarOpen ? sidebar.current : panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusable =
      'a[href],button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]';
    area?.querySelector<HTMLElement>(focusable)?.focus({ preventScroll: true });
    const trap = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab" || menu || searchOpen) return;
      const items = [...(area?.querySelectorAll<HTMLElement>(focusable) ?? [])].filter(
        (item) =>
          item.tabIndex >= 0 &&
          !item.closest("[inert],[hidden]") &&
          item.getClientRects().length &&
          getComputedStyle(item).visibility !== "hidden",
      );
      const first = items[0],
        last = items.at(-1);
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [drawer, sidebarOpen]);
  const navigate = (label: string) => {
    setActive(label);
    onNavigate?.(label);
    if (narrow) setSidebarOpen(false);
  };
  const openChat = (chat: AppChat) => {
    setActiveChat(chat.id);
    if (chat.project && !folders.includes(chat.project)) setFolders([...folders, chat.project]);
    if (project && chat.project !== project) setProject(chat.project ?? "");
    if (chat.unread) setChats(list.map((item) => (item.id === chat.id ? { ...item, unread: false } : item)));
    if (narrow) setSidebarOpen(false);
  };
  const selectProject = (name: string) => {
    setProject(name);
    if (name) setFolders([name]);
    else {
      const activeProject = list.find((chat) => chat.id === activeChat)?.project;
      if (activeProject && !folders.includes(activeProject)) setFolders([...folders, activeProject]);
    }
  };
  const trigger = (kind: NonNullable<typeof menu>, chatId?: string) => ({
    onClick: (event: ReactMouseEvent<HTMLButtonElement>) => {
      anchor.current = event.currentTarget;
      setMenuChat(chatId ?? null);
      setMenu(menu === kind && menuChat === (chatId ?? null) ? null : kind);
      setAddingProject(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        anchor.current = event.currentTarget;
        setMenuChat(chatId ?? null);
        setMenu(kind);
      }
    },
  });
  const changeChat = (id: string, patch: Partial<AppChat>) =>
    setChats(list.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat)));
  const pinChat = (chat: AppChat) => {
    changeChat(chat.id, { pinned: !chat.pinned });
    onChatAction?.(chat.pinned ? "unpin" : "pin", chat.id);
  };
  const rename = () => {
    if (renaming && renameValue.trim()) {
      changeChat(renaming, { title: renameValue.trim() });
      onChatAction?.("rename", renaming);
    }
    setRenaming(null);
  };
  const chatAction = (action: string) => {
    const chat = currentMenuChat;
    if (!chat) return;
    if (action === "rename") {
      setRenaming(chat.id);
      setRenameValue(chat.title);
    } else if (action === "pin") pinChat(chat);
    else if (action === "unread") changeChat(chat.id, { unread: true });
    else if (action === "project") {
      setMenu("chat-project");
      return;
    } else if (action === "archive") {
      const remaining = list.filter((item) => item.id !== chat.id);
      setChats(remaining);
      if (activeChat === chat.id) setActiveChat(remaining[0]?.id ?? "");
    } else if (action === "copy") {
      navigator.clipboard
        ?.writeText(chat.title)
        .then(() => setNotice(labels.copied))
        .catch(() => setNotice(labels.copyFailed));
    }
    if (action !== "rename" && action !== "pin") onChatAction?.(action, chat.id);
    setMenu(null);
    anchor.current?.focus({ preventScroll: true });
  };
  const resize = (edge: "sidebar" | "panel", event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const target = event.currentTarget,
      start = event.clientX;
    const initial = edge === "sidebar" ? safeNumber(sidebarWidth, 272) : safeNumber(panelWidth, 455);
    const previousCursor = document.body.style.cursor,
      previousSelect = document.body.style.userSelect;
    target.setPointerCapture(event.pointerId);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    setDragging(true);
    const move = (event: PointerEvent) => {
      const width = root.current?.clientWidth ?? 1600;
      const value = initial + (event.clientX - start) * (edge === "sidebar" ? 1 : -1);
      if (edge === "sidebar")
        setSidebarWidth(
          clamp(
            value,
            sidebarBounds.min,
            Math.max(
              sidebarBounds.min,
              Math.min(sidebarBounds.max, width - railWidth - (visiblePanel ? panelWidth : 0) - 280),
            ),
          ),
        );
      else
        setPanelWidth(
          clamp(
            value,
            panelBounds.min,
            Math.max(panelBounds.min, Math.min(panelBounds.max, width - sidebarWidth - railWidth - 280)),
          ),
        );
    };
    const stop = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", stop);
      target.removeEventListener("pointercancel", stop);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelect;
      setDragging(false);
      cleanupDrag.current = null;
    };
    cleanupDrag.current?.();
    cleanupDrag.current = stop;
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", stop);
    target.addEventListener("pointercancel", stop);
  };
  const resizeKey = (edge: "sidebar" | "panel", event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const value = edge === "sidebar" ? sidebarWidth : panelWidth;
    const bounds = edge === "sidebar" ? sidebarBounds : panelBounds;
    const next =
      event.key === "Home"
        ? bounds.min
        : event.key === "End"
          ? bounds.max
          : value + (event.key === "ArrowRight" ? 10 : -10) * (edge === "panel" ? -1 : 1);
    if (edge === "sidebar") setSidebarWidth(clamp(next, bounds.min, bounds.max));
    else setPanelWidth(clamp(next, bounds.min, bounds.max));
  };
  const row = (chat: AppChat, nested = false) => (
    <div
      className="ui-as__chat-row"
      key={chat.id}
      data-active={chat.id === activeChat || undefined}
      data-nested={nested || undefined}
    >
      {renaming === chat.id ? (
        <input
          ref={renameRef}
          className="ui-as__rename"
          aria-label={labels.chatName}
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          onBlur={rename}
          onKeyDown={(event) => {
            if (event.key === "Enter") rename();
            if (event.key === "Escape") {
              event.stopPropagation();
              setRenaming(null);
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="ui-as__chat-link"
          aria-current={chat.id === activeChat ? "page" : undefined}
          title={chat.title}
          onClick={() => openChat(chat)}
        >
          <span dir="auto">{chat.title}</span>
          {chat.unread && <i className="ui-as__unread" aria-label={labels.unread} />}
        </button>
      )}
      <span className="ui-as__chat-tools">
        <button
          type="button"
          aria-label={labels.options(chat.title)}
          aria-haspopup="menu"
          aria-expanded={menu === "chat" && menuChat === chat.id}
          aria-controls={menu === "chat" && menuChat === chat.id ? `${id}-menu` : undefined}
          {...trigger("chat", chat.id)}
        >
          <Icon name="more" size={14} />
        </button>
        <button
          type="button"
          aria-label={labels.pin(chat.title, !!chat.pinned)}
          aria-pressed={!!chat.pinned}
          onClick={() => pinChat(chat)}
        >
          <Icon name={chat.pinned ? "unpin" : "pin"} size={14} />
        </button>
      </span>
    </div>
  );
  const menuAction = (label: string) => {
    onNavigate?.(label);
    setMenu(null);
    anchor.current?.focus({ preventScroll: true });
  };
  const wsItem = (label: string, icon: keyof typeof wsGlyphs) => (
    <button type="button" role="menuitem" className="ui-as__wsm-item" key={label} onClick={() => menuAction(label)}>
      <WsGlyph name={icon} />
      <span className="ui-as__wsm-label" title={label}>
        {labels.action(label)}
      </span>
    </button>
  );
  const wsSub = (label: string, icon: keyof typeof wsGlyphs, items: ReactNode) => (
    <span className="ui-as__wsm-sub" data-open={wsOpen === label || undefined}>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={wsOpen === label}
        className="ui-as__wsm-item"
        onClick={() => setWsOpen(wsOpen === label ? null : label)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            const panel = event.currentTarget.nextElementSibling;
            setWsOpen(label);
            requestAnimationFrame(() => panel?.querySelector<HTMLElement>("button")?.focus());
          }
        }}
      >
        <WsGlyph name={icon} />
        <span className="ui-as__wsm-label" title={label}>
          {labels.action(label)}
        </span>
        <WsGlyph name="next" size={14} />
      </button>
      <span
        className="ui-as__wsm-panel"
        role="menu"
        aria-label={label}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setWsOpen(null);
            (event.currentTarget.previousElementSibling as HTMLElement | null)?.focus();
          } else moveMenuFocus(event);
        }}
      >
        {items}
      </span>
    </span>
  );
  const commandGroups: CommandMenuGroup[] =
    commandGroupsProp ??
    (navigation
      ? [
          {
            id: "workspace",
            label: labels.workspace,
            commands: navigation.map((item) => ({
              id: `navigate:${item.label}`,
              label: item.label,
              icon: item.icon,
              disabled: item.disabled,
              onSelect: () => navigate(item.label),
            })),
          },
        ]
      : [
          ...defaultCommands,
          {
            id: "go-to",
            label: labels.goTo,
            commands: [
              { id: "new-chat", label: labels.newChat, onSelect: onNewChat },
              ...projectList.map((name) => ({
                id: `project:${name}`,
                label: name,
                onSelect: () => {
                  setProject(name);
                  setFolders([name]);
                },
              })),
              ...list.map((chat) => ({ id: `chat:${chat.id}`, label: chat.title, onSelect: () => openChat(chat) })),
            ],
          },
        ]);
  return (
    <div
      {...rest}
      ref={root}
      className={["ui-as", className].filter(Boolean).join(" ")}
      data-overlay-boundary=""
      data-theme={theme === "system" ? (systemDark ? "dark" : undefined) : theme}
      data-layout={layout === "flat" ? "flat" : "inset"}
      data-rail={!!rail || undefined}
      data-navigation={iconSidebar || undefined}
      data-sidebar-open={sidebarOpen || undefined}
      data-sidebar-collapsed={collapsed || undefined}
      data-panel-open={visiblePanel || undefined}
      data-dragging={dragging || undefined}
      style={
        {
          "--ui-as-sidebar-width": `${clamp(safeNumber(sidebarWidth, 272), sidebarBounds.min, sidebarBounds.max)}px`,
          "--ui-as-panel-width": `${clamp(safeNumber(panelWidth, 455), panelBounds.min, panelBounds.max)}px`,
          "--ui-as-rail-width": `${railWidth}px`,
          ...style,
        } as CSSProperties
      }
      onKeyDown={onKeyDown}
    >
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <div className="ui-as__app" data-header={header != null || undefined}>
        <button
          ref={sideOpenRef}
          type="button"
          className="ui-as__drawer-trigger ui-as__open-side"
          aria-label={labels.openSidebar}
          aria-expanded={sidebarOpen}
          aria-controls={`${id}-sidebar`}
          onClick={() => {
            if (narrow) {
              setSidebarOpen(true);
              setPanelOpen(false);
            } else setCollapsed(false);
          }}
        >
          <Icon name="panel" />
        </button>
        {hasPanel && (
          <button
            ref={panelOpenRef}
            type="button"
            className="ui-as__drawer-trigger ui-as__open-panel"
            aria-label={labels.openPanel(panelTitle)}
            aria-expanded={visiblePanel}
            aria-controls={`${id}-panel`}
            onClick={() => {
              setPanelOpen(!panelOpen);
              setSidebarOpen(false);
            }}
          >
            <Icon name="panel" />
          </button>
        )}
        {drawer && (
          <button
            type="button"
            className="ui-as__scrim"
            aria-label={sidebarOpen ? labels.closeSidebar : labels.closePanel(panelTitle)}
            tabIndex={-1}
            onClick={closeDrawer}
          />
        )}
        <aside
          ref={sidebar}
          className="ui-as__side"
          id={`${id}-sidebar`}
          aria-label={labels.sidebar}
          inert={narrow ? !sidebarOpen : collapsed && !iconSidebar}
        >
          {rail && (
            <nav className="ui-as__rail" aria-label={labels.apps}>
              <button
                type="button"
                className="ui-as__logo"
                aria-label={workspace}
                title={workspace}
                aria-haspopup="menu"
                aria-expanded={menu === "workspace"}
                aria-controls={menu === "workspace" ? `${id}-menu` : undefined}
                {...trigger("workspace")}
              >
                {initials(workspace).slice(0, 1)}
              </button>
              <span className="ui-as__rail-line" />
              {rail.items.filter(Boolean).map((item) => (
                <button
                  type="button"
                  className="ui-as__rail-item"
                  key={item.label}
                  aria-label={item.label}
                  title={item.label}
                  aria-current={(activeProp ?? rail.active ?? active) === item.label ? "page" : undefined}
                  disabled={item.disabled}
                  onClick={() => navigate(item.label)}
                  onErrorCapture={(event) => {
                    if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                  }}
                >
                  {item.icon ?? <Icon name="chat" size={19} />}
                </button>
              ))}
              <span className="ui-as__rail-space" />
              {rail.bottom?.filter(Boolean).map((item) => (
                <button
                  type="button"
                  className="ui-as__rail-item"
                  key={item.label}
                  aria-label={item.count ? labels.unreadCount(item.label, item.count) : item.label}
                  title={item.label}
                  disabled={item.disabled}
                  onClick={() => navigate(item.label)}
                >
                  {item.icon ?? <Icon name="settings" size={19} />}{" "}
                  {!!item.count && <i className="ui-as__notification-dot" />}
                </button>
              ))}
              <button
                type="button"
                className="ui-as__user"
                aria-label={user.name}
                title={user.name}
                aria-haspopup="menu"
                aria-expanded={menu === "account"}
                aria-controls={menu === "account" ? `${id}-menu` : undefined}
                {...trigger("account")}
              >
                {user.avatar && !brokenAvatar ? (
                  <img src={user.avatar} alt="" onError={() => setBrokenAvatar(true)} />
                ) : (
                  initials(user.name)
                )}
              </button>
            </nav>
          )}
          <div
            className="ui-as__side-col"
            data-navigation={!!navigation || undefined}
            data-history={showChatHistory || undefined}
          >
            {sidebarContent !== undefined ? (
              sidebarContent
            ) : (
              <>
                {navigation ? (
                  <div className="ui-as__navigation">
                    <header className="ui-as__nav-head">
                      <button
                        type="button"
                        className="ui-as__nav-workspace"
                        aria-label={workspace}
                        aria-haspopup="menu"
                        aria-expanded={menu === "workspace"}
                        {...trigger("workspace")}
                      >
                        <span>{initials(workspace).slice(0, 1)}</span>
                        <strong>{workspace}</strong>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M18 9s-4.42 6-6 6-6-6-6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="ui-as__icon-btn"
                        aria-label={collapsed && !narrow ? labels.expandSidebar : labels.collapseSidebar}
                        onClick={() => (narrow ? setSidebarOpen(false) : setCollapsed(!collapsed))}
                      >
                        <Icon name="panel" />
                      </button>
                    </header>
                    <button
                      type="button"
                      className="ui-as__nav-search"
                      aria-label={labels.search}
                      aria-haspopup="dialog"
                      aria-expanded={searchOpen}
                      onClick={() => setSearchOpen(true)}
                    >
                      <Icon name="search" size={14} />
                      <span>{labels.searchPlaceholder}</span>
                      <kbd>⌘K</kbd>
                    </button>
                    <nav className="ui-as__nav-items" aria-label={labels.workspace}>
                      {navigation.map((item, index) => (
                        <div key={item.label}>
                          {item.section && navigation[index - 1]?.section !== item.section && (
                            <div className="ui-as__nav-section">{item.section}</div>
                          )}
                          <button
                            type="button"
                            className="ui-as__nav-item"
                            aria-label={item.label}
                            aria-current={active === item.label ? "page" : undefined}
                            disabled={item.disabled}
                            onClick={() => {
                              if (showChatHistory && item.label === labels.newChat) onNewChat?.();
                              navigate(item.label);
                            }}
                          >
                            <span
                              className="ui-as__nav-icon"
                              aria-hidden="true"
                              onErrorCapture={(event) => {
                                if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                              }}
                            >
                              {item.icon ?? <Icon name="document" size={16} />}
                            </span>
                            <span>{item.label}</span>
                            {item.count != null && item.count > 0 && <small>{item.count}</small>}
                          </button>
                        </div>
                      ))}
                    </nav>
                  </div>
                ) : (
                  <header className="ui-as__side-head">
                    <button
                      type="button"
                      className="ui-as__project"
                      aria-haspopup="menu"
                      aria-expanded={menu === "projects"}
                      aria-controls={menu === "projects" ? `${id}-menu` : undefined}
                      {...trigger("projects")}
                    >
                      <span title={project || labels.allProjects}>{project || labels.allProjects}</span>
                      <Icon name="chevron" size={12} />
                    </button>
                    <button
                      type="button"
                      className="ui-as__icon-btn"
                      aria-label={labels.search}
                      title={labels.searchHint}
                      onClick={() => setSearchOpen(true)}
                    >
                      <Icon name="search" />
                    </button>
                    <button
                      type="button"
                      className="ui-as__mobile-close ui-as__icon-btn"
                      aria-label={labels.closeSidebar}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon name="panel" />
                    </button>
                  </header>
                )}
                {(!navigation || showChatHistory) && (
                  <nav className="ui-as__chat-nav" aria-label={labels.conversations}>
                    {!navigation && (
                      <button
                        type="button"
                        className="ui-as__new-chat"
                        onClick={() => {
                          onNewChat?.();
                          if (narrow) setSidebarOpen(false);
                        }}
                      >
                        <Icon name="compose" size={16} />
                        {labels.newChat}
                      </button>
                    )}
                    {shown.some((chat) => chat.pinned) && (
                      <div className="ui-as__group">
                        <h2>{labels.pinned}</h2>
                        {shown.filter((chat) => chat.pinned).map((chat) => row(chat))}
                      </div>
                    )}
                    <div className="ui-as__group">
                      <h2>{labels.projects}</h2>
                      {projectList
                        .filter((name) => !project || name === project)
                        .map((name) => (
                          <div key={name}>
                            <button
                              type="button"
                              className="ui-as__folder"
                              aria-expanded={folders.includes(name)}
                              aria-controls={`${id}-folder-${encodeURIComponent(name)}`}
                              onClick={() =>
                                setFolders(
                                  folders.includes(name) ? folders.filter((item) => item !== name) : [...folders, name],
                                )
                              }
                            >
                              <Icon name={folders.includes(name) ? "folder-open" : "folder"} size={16} />
                              <span title={name}>{name}</span>
                              <span className="ui-as__folder-chevron">
                                <Icon name="chevron" size={12} />
                              </span>
                            </button>
                            <div
                              className="ui-as__folder-wrap"
                              data-open={folders.includes(name)}
                              id={`${id}-folder-${encodeURIComponent(name)}`}
                              inert={!folders.includes(name)}
                            >
                              <div>
                                {shown
                                  .filter((chat) => chat.project === name && !chat.pinned)
                                  .map((chat) => row(chat, true))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {shown.some((chat) => !chat.project && !chat.pinned) && (
                      <div className="ui-as__group">
                        <h2>{labels.chats}</h2>
                        {shown.filter((chat) => !chat.project && !chat.pinned).map((chat) => row(chat))}
                      </div>
                    )}
                    {!shown.length && <p className="ui-as__empty">{labels.empty}</p>}
                  </nav>
                )}
                {sidebarFooter}
                {!rail && (
                  <button
                    type="button"
                    className="ui-as__account-row"
                    aria-label={user.name}
                    aria-haspopup="menu"
                    aria-expanded={menu === "account"}
                    {...trigger("account")}
                  >
                    <span className="ui-as__user-initials">{userAvatar}</span>
                    <span>{user.name}</span>
                    <Icon name="chevron" size={12} />
                  </button>
                )}
              </>
            )}
          </div>
        </aside>
        <div
          className="ui-as__resizer"
          role="separator"
          aria-label={labels.resizeSidebar}
          aria-orientation="vertical"
          aria-valuemin={sidebarBounds.min}
          aria-valuemax={sidebarBounds.max}
          aria-valuenow={Math.round(sidebarWidth)}
          aria-controls={`${id}-sidebar`}
          tabIndex={narrow || collapsed ? -1 : 0}
          onPointerDown={(event) => resize("sidebar", event)}
          onKeyDown={(event) => resizeKey("sidebar", event)}
        />
        {header != null && (
          <div className="ui-as__header" inert={!!drawer}>
            {header}
          </div>
        )}
        <main className="ui-as__main" inert={!!drawer}>
          {children}
        </main>
        {hasPanel && (
          <>
            <div
              className="ui-as__resizer ui-as__panel-resizer"
              role="separator"
              aria-label={labels.resizePanel(panelTitle)}
              aria-orientation="vertical"
              aria-valuemin={panelBounds.min}
              aria-valuemax={panelBounds.max}
              aria-valuenow={Math.round(panelWidth)}
              aria-controls={`${id}-panel`}
              tabIndex={visiblePanel && !narrow ? 0 : -1}
              onPointerDown={(event) => resize("panel", event)}
              onKeyDown={(event) => resizeKey("panel", event)}
            />
            <aside
              ref={panelRef}
              className="ui-as__panel"
              id={`${id}-panel`}
              aria-label={panelTitle}
              inert={!visiblePanel || (narrow && sidebarOpen)}
            >
              {panel}
            </aside>
          </>
        )}
      </div>
      {menu && (
        <FloatingMenu
          key={menu}
          anchor={anchor}
          root={root}
          className={
            menu === "workspace" || menu === "account"
              ? `ui-as__menu ui-as__ws-menu${menu === "account" ? " ui-as__account-menu" : ""}`
              : "ui-as__menu"
          }
          id={`${id}-menu`}
          label={
            menu === "chat"
              ? labels.options(currentMenuChat?.title ?? "")
              : menu === "projects"
                ? labels.projects
                : menu === "workspace"
                  ? workspace
                  : labels.account
          }
          side={
            menu === "account" ? (rail ? "right" : "top") : menu === "workspace" && !navigation ? "right" : "bottom"
          }
          align={menu === "account" && rail ? "end" : "start"}
          gap={
            menu === "account" && rail
              ? 12
              : menu === "account" || (menu === "workspace" && !!navigation)
                ? 6
                : undefined
          }
          onClose={() => setMenu(null)}
        >
          {menu === "workspace" && (
            <>
              {wsItem("Invite people", "invite")}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsItem("Workspace settings", "settings")}
              {wsItem("Analytics", "analytics")}
              {wsItem("Billing", "billing")}
              {wsItem("Usage & limits", "usage")}
              {wsItem("Members", "members")}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsSub(
                "Learn more",
                "info",
                <>
                  {wsItem("Documentation", "docs")}
                  {wsItem("Changelog", "changelog")}
                  {wsItem("Help & feedback", "help")}
                </>,
              )}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsSub(
                "Switch workspace",
                "switch",
                <>
                  {[
                    [workspace, "Pro · 8 members"],
                    ["Personal", "Free"],
                  ]
                    .filter((entry, index, all) => all.findIndex((other) => other[0] === entry[0]) === index)
                    .map(([name, plan]) => (
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={name === workspace}
                        className="ui-as__wsm-item"
                        data-rich=""
                        key={name}
                        onClick={() => menuAction(`Switch workspace: ${name}`)}
                      >
                        <span className="ui-as__wsm-label" title={name}>
                          <span>{name}</span>
                          <small>{plan}</small>
                        </span>
                        {name === workspace && <WsGlyph name="check" size={14} />}
                      </button>
                    ))}
                  <span className="ui-as__wsm-sep" role="separator" />
                  {wsItem("Create workspace", "plus")}
                </>,
              )}
            </>
          )}
          {menu === "projects" && (
            <>
              <div className="ui-as__menu-label">{labels.projects}</div>
              {["", ...projectList].map((name) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={project === name}
                  key={name}
                  onClick={() => {
                    selectProject(name);
                    setMenu(null);
                    anchor.current?.focus();
                  }}
                >
                  {name || labels.allProjects}
                  {project === name && <Icon name="check" size={13} />}
                </button>
              ))}
              {addingProject ? (
                <form
                  className="ui-as__project-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const name = newProject.trim();
                    if (!name) return;
                    if (!projectList.includes(name)) setProjects([...projectList, name]);
                    setProject(name);
                    setFolders([name]);
                    setMenu(null);
                    setAddingProject(false);
                    setNewProject("");
                  }}
                >
                  <input
                    autoFocus
                    aria-label={labels.projectName}
                    placeholder={labels.projectName}
                    value={newProject}
                    onChange={(event) => setNewProject(event.target.value)}
                  />
                  <button type="submit" aria-label={labels.createProject}>
                    <Icon name="check" size={14} />
                  </button>
                </form>
              ) : (
                <button type="button" role="menuitem" data-divider="" onClick={() => setAddingProject(true)}>
                  <Icon name="plus" size={14} />
                  {labels.newProject}
                </button>
              )}
            </>
          )}
          {menu === "account" && (
            <>
              <div className="ui-as__menu-user">
                <span className="ui-as__user-initials">{userAvatar}</span>
                <span>
                  <strong>{user.name}</strong>
                  {user.email && <small>{user.email}</small>}
                </span>
              </div>
              {wsSub(
                labels.language,
                "language",
                <>
                  {(
                    [
                      [
                        "English",
                        <>
                          <rect width="20" height="14" fill="#012169" />
                          <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="2.8" />
                          <path d="M0 0 20 14M20 0 0 14" stroke="#c8102e" />
                          <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.2" />
                          <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.4" />
                        </>,
                      ],
                      [
                        "Deutsch",
                        <>
                          <rect width="20" height="4.67" fill="#1f1f1f" />
                          <rect y="4.67" width="20" height="4.67" fill="#dd0000" />
                          <rect y="9.33" width="20" height="4.67" fill="#ffce00" />
                        </>,
                      ],
                      [
                        "Français",
                        <>
                          <rect width="6.67" height="14" fill="#002395" />
                          <rect x="6.67" width="6.67" height="14" fill="#fff" />
                          <rect x="13.33" width="6.67" height="14" fill="#ed2939" />
                        </>,
                      ],
                      [
                        "Español",
                        <>
                          <rect width="20" height="14" fill="#aa151b" />
                          <rect y="3.5" width="20" height="7" fill="#f1bf00" />
                        </>,
                      ],
                    ] as const
                  ).map(([label, flag]) => (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={language === label}
                      className="ui-as__wsm-item"
                      key={label}
                      onClick={() => {
                        setLanguage(label);
                        menuAction(`Language: ${label}`);
                      }}
                    >
                      <svg className="ui-as__wsm-flag" viewBox="0 0 20 14" aria-hidden="true">
                        {flag}
                      </svg>
                      <span className="ui-as__wsm-label">{label}</span>
                      {language === label && <WsGlyph name="check" size={14} />}
                    </button>
                  ))}
                </>,
              )}
              {wsSub(
                labels.appearance,
                "appearance",
                <>
                  {(["system", "light", "dark"] as const).map((value) => (
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={theme === value}
                      className="ui-as__wsm-item"
                      key={value}
                      onClick={() => {
                        setTheme(value);
                        setMenu(null);
                        anchor.current?.focus();
                      }}
                    >
                      <WsGlyph name={value} />
                      <span className="ui-as__wsm-label">{labels.theme(value)}</span>
                      {theme === value && <WsGlyph name="check" size={14} />}
                    </button>
                  ))}
                </>,
              )}
              {wsItem("Integrations", "integrations")}
              {wsItem("Settings", "settings")}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsItem("Download apps", "download")}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsItem("Changelog", "changelog")}
              {wsSub(
                "Learn more",
                "info",
                <>
                  {wsItem("Documentation", "docs")}
                  {wsItem("Help & feedback", "help")}
                </>,
              )}
              <span className="ui-as__wsm-sep" role="separator" />
              {wsItem("Log out", "logout")}
            </>
          )}
          {menu === "chat" &&
            currentMenuChat &&
            (
              [
                ["rename", "Rename", "⌥⌘R"],
                ["pin", currentMenuChat.pinned ? "Unpin" : "Pin", "⌥⌘P"],
                ["unread", "Mark as unread", "⇧⌘U"],
                ["project", "Project", "›"],
                ["share", "Share", ""],
                ["copy", "Copy", ""],
                ["window", "Open in new window", ""],
                ["archive", "Archive", "⇧⌘A"],
              ] as const
            ).map(([action, label, shortcut], index) => (
              <button
                type="button"
                role="menuitem"
                key={action}
                data-divider={index === 4 || index === 6 || index === 7 || undefined}
                onClick={() => chatAction(action)}
              >
                {labels.action(label)}
                <kbd>{shortcut}</kbd>
              </button>
            ))}
          {menu === "chat-project" && currentMenuChat && (
            <>
              <div className="ui-as__menu-label">{labels.moveToProject}</div>
              {["", ...projectList].map((name) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={(currentMenuChat.project ?? "") === name}
                  key={name}
                  onClick={() => {
                    changeChat(currentMenuChat.id, { project: name || undefined });
                    setMenu(null);
                    onChatAction?.("project", currentMenuChat.id);
                  }}
                >
                  {name || labels.noProject}
                  {(currentMenuChat.project ?? "") === name && <Icon name="check" size={13} />}
                </button>
              ))}
            </>
          )}
        </FloatingMenu>
      )}
      {searchOpen && (
        <ShellSearch
          groups={commandGroups}
          placeholder="Type a command or search…"
          onAsk={onAsk}
          onClose={() => setSearchOpen(false)}
          onRun={(command) => {
            setSearchOpen(false);
            if (command.onSelect) command.onSelect();
            else if (command.id !== "new-chat") onNavigate?.(command.id);
          }}
        />
      )}
      <span className="ui-as__sr" role="status" aria-live="polite">
        {notice}
      </span>
    </div>
  );
}

export type ArtifactFolderEntry = {
  name: string;
  size?: string;
  bytes?: number;
  modified?: string;
  kind?: "document" | "table" | "code" | "image" | "folder";
};
export type ArtifactFolderSort = { key: "name" | "size" | "modified"; direction: "asc" | "desc" };
export type ArtifactFolderProps = {
  name?: string;
  entries?: ArtifactFolderEntry[];
  defaultEntries?: ArtifactFolderEntry[];
  onEntriesChange?: (entries: ArtifactFolderEntry[]) => void;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (names: string[]) => void;
  view?: "list" | "icons";
  defaultView?: "list" | "icons";
  onViewChange?: (view: "list" | "icons") => void;
  sort?: ArtifactFolderSort;
  defaultSort?: ArtifactFolderSort;
  onSortChange?: (sort: ArtifactFolderSort) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onOpen?: (entry: ArtifactFolderEntry) => void;
  className?: string;
};

/** A searchable folder with list/icon views, sorting, selection and native keyboard/context-menu actions. */
export function ArtifactFolder({
  name = "Folder",
  entries: entriesProp,
  defaultEntries = [],
  onEntriesChange,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  view: viewProp,
  defaultView = "list",
  onViewChange,
  sort: sortProp,
  defaultSort = { key: "name", direction: "asc" },
  onSortChange,
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onOpen,
  className,
}: ArtifactFolderProps) {
  const [entries, setEntries] = useControllable(entriesProp, defaultEntries, onEntriesChange),
    [selected, setSelected] = useControllable(selectedProp, defaultSelected, onSelectedChange),
    [view, setView] = useControllable(viewProp, defaultView, onViewChange),
    [sort, setSort] = useControllable(sortProp, defaultSort, onSortChange),
    [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
  const [menu, setMenu] = useState<string | null>(null),
    [renaming, setRenaming] = useState<string | null>(null),
    [draft, setDraft] = useState(""),
    [focusName, setFocusName] = useState(""),
    [notice, setNotice] = useState("");
  const root = useRef<HTMLDivElement>(null),
    anchor = useRef<HTMLElement>(null),
    renameInput = useRef<HTMLInputElement>(null),
    id = useId();
  const list = (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .slice()
    .sort((a, b) => {
      const value =
        sort.key === "size"
          ? (a.bytes ?? 0) - (b.bytes ?? 0)
          : String(sort.key === "modified" ? (a.modified ?? "") : a.name).localeCompare(
              String(sort.key === "modified" ? (b.modified ?? "") : b.name),
              undefined,
              { numeric: true },
            );
      return value * (sort.direction === "desc" ? -1 : 1);
    });
  useEffect(() => {
    if (renaming) renameInput.current?.select();
  }, [renaming]);
  const open = (entry: ArtifactFolderEntry) => onOpen?.(entry);
  const restoreFocus = (name: string) => {
    setFocusName(name);
    requestAnimationFrame(() => {
      const rows = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-folder-name]") ?? [])];
      rows.find((row) => row.dataset.folderName === name)?.focus({ preventScroll: true });
    });
  };
  const changeSort = (key: ArtifactFolderSort["key"]) =>
    setSort({ key, direction: sort.key === key && sort.direction === "asc" ? "desc" : "asc" });
  const context = (el: HTMLElement, names: string[]) => {
    anchor.current = el;
    setSelected(names);
    setMenu(names[0] ?? null);
  };
  const rename = () => {
    const entry = entries.find((item) => item.name === menu);
    if (!entry) return;
    setDraft(entry.name);
    setRenaming(entry.name);
    setMenu(null);
  };
  const commit = () => {
    const value = draft.trim();
    if (renaming && value && !entries.some((entry) => entry.name === value && entry.name !== renaming)) {
      setEntries(entries.map((entry) => (entry.name === renaming ? { ...entry, name: value } : entry)));
      setSelected([value]);
      setNotice(`Renamed to ${value}`);
    }
    setRenaming(null);
    restoreFocus(value || renaming || "");
  };
  const remove = () => {
    setEntries(entries.filter((entry) => !selected.includes(entry.name)));
    setNotice(`${selected.length} ${selected.length === 1 ? "item" : "items"} removed`);
    setSelected([]);
    setMenu(null);
  };
  const duplicate = () => {
    const extra = entries
      .filter((entry) => selected.includes(entry.name))
      .map((entry) => {
        let n = 1;
        let next = `${entry.name} copy`;
        while (entries.some((item) => item.name === next)) next = `${entry.name} copy ${++n}`;
        return { ...entry, name: next };
      });
    setEntries([...entries, ...extra]);
    setMenu(null);
    setNotice("Items duplicated");
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>, entry: ArtifactFolderEntry) => {
    const index = list.indexOf(entry),
      next =
        event.key === "ArrowDown" || (view === "icons" && event.key === "ArrowRight")
          ? Math.min(list.length - 1, index + 1)
          : event.key === "ArrowUp" || (view === "icons" && event.key === "ArrowLeft")
            ? Math.max(0, index - 1)
            : event.key === "Home"
              ? 0
              : event.key === "End"
                ? list.length - 1
                : null;
    if (next !== null) {
      event.preventDefault();
      setSelected([list[next].name]);
      root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')[next]?.focus();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      open(entry);
    }
    if (event.key === "F2") {
      event.preventDefault();
      setSelected([entry.name]);
      setDraft(entry.name);
      setRenaming(entry.name);
    }
    if (event.key === "Delete") {
      event.preventDefault();
      setEntries(entries.filter((item) => !selected.includes(item.name) && item.name !== entry.name));
      setSelected([]);
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setSelected(list.map((item) => item.name));
    }
    if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
      event.preventDefault();
      context(event.currentTarget, selected.includes(entry.name) ? selected : [entry.name]);
    }
  };
  return (
    <div ref={root} className={["ui-afd", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <div className="ui-afd__toolbar">
        <button type="button" aria-label="Back" disabled>
          <Icon name="chevron" size={14} />
        </button>
        <button type="button" aria-label="Forward" disabled>
          <Icon name="chevron" size={14} />
        </button>
        <strong dir="auto">{name}</strong>
        <button type="button" aria-label="As list" aria-pressed={view !== "icons"} onClick={() => setView("list")}>
          <Icon name="row" size={14} />
        </button>
        <button type="button" aria-label="As icons" aria-pressed={view === "icons"} onClick={() => setView("icons")}>
          <Icon name="column" size={14} />
        </button>
        <button
          type="button"
          aria-label="Sort by"
          aria-haspopup="menu"
          aria-expanded={menu === "__sort"}
          onClick={(event) => {
            anchor.current = event.currentTarget;
            setMenu(menu === "__sort" ? null : "__sort");
          }}
        >
          <Icon name="sort" size={14} />
        </button>
      </div>
      <label className="ui-afd__search">
        <Icon name="search" size={13} />
        <input
          aria-label={`Search ${name}`}
          placeholder={`Search ${name}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {view !== "icons" && (
        <div className="ui-afd__columns">
          {(["name", "size", "modified"] as const).map((field) => (
            <button
              type="button"
              key={field}
              aria-label={`${field[0].toUpperCase() + field.slice(1)}${sort.key === field ? `, sorted ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
              onClick={() => changeSort(field)}
            >
              {field[0].toUpperCase() + field.slice(1)}
              {sort.key === field && <span aria-hidden="true">{sort.direction === "asc" ? "⌃" : "⌄"}</span>}
            </button>
          ))}
        </div>
      )}
      <div
        className="ui-afd__items"
        data-view={view === "icons" ? "icons" : "list"}
        role="listbox"
        aria-label={`${name} files`}
        aria-multiselectable="true"
      >
        {list.map((entry) =>
          renaming === entry.name ? (
            <div className="ui-afd__rename" key={entry.name}>
              <Icon name="document" size={14} />
              <input
                ref={renameInput}
                aria-label="File name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={commit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commit();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setRenaming(null);
                    restoreFocus(renaming ?? "");
                  }
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              role="option"
              aria-selected={selected.includes(entry.name)}
              tabIndex={
                entry.name === (list.some((item) => item.name === focusName) ? focusName : list[0]?.name) ? 0 : -1
              }
              data-folder-name={entry.name}
              onFocus={() => setFocusName(entry.name)}
              className="ui-afd__item"
              key={entry.name}
              aria-label={`${entry.name}${entry.size ? `, ${entry.size}` : ""}`}
              onClick={(event) =>
                setSelected(
                  event.metaKey || event.ctrlKey
                    ? selected.includes(entry.name)
                      ? selected.filter((name) => name !== entry.name)
                      : [...selected, entry.name]
                    : [entry.name],
                )
              }
              onDoubleClick={() => open(entry)}
              onKeyDown={(event) => key(event, entry)}
              onContextMenu={(event) => {
                event.preventDefault();
                context(event.currentTarget, selected.includes(entry.name) ? selected : [entry.name]);
              }}
            >
              <span className="ui-afd__name">
                <span
                  data-kind={
                    entry.kind ??
                    (entry.name.endsWith(".csv") ? "table" : /\.(json|ya?ml)$/.test(entry.name) ? "code" : "document")
                  }
                >
                  <Icon
                    name={entry.kind === "folder" ? "folder" : entry.name.endsWith(".csv") ? "table" : "document"}
                    size={14}
                  />
                </span>
                <span title={entry.name} dir="auto">
                  {entry.name}
                </span>
              </span>
              <span>{entry.size ?? "—"}</span>
              <span>{entry.modified ?? "—"}</span>
            </button>
          ),
        )}
      </div>
      {!list.length && <p className="ui-afd__empty">{query ? "No matching files" : "This folder is empty"}</p>}
      <footer>
        {list.length} {list.length === 1 ? "item" : "items"}
        {selected.length ? ` · ${selected.length} selected` : ""}
      </footer>
      {menu && (
        <FloatingMenu
          anchor={anchor}
          root={root}
          id={`${id}-menu`}
          label={menu === "__sort" ? "Sort files" : "File actions"}
          className="ui-afd__menu"
          onClose={() => setMenu(null)}
        >
          {menu === "__sort" ? (
            (["name", "size", "modified"] as const).map((field) => (
              <button
                type="button"
                role="menuitemradio"
                aria-checked={sort.key === field}
                key={field}
                onClick={() => {
                  changeSort(field);
                  setMenu(null);
                }}
              >
                {field[0].toUpperCase() + field.slice(1)}
                {sort.key === field && <Icon name="check" size={13} />}
              </button>
            ))
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  const entry = entries.find((entry) => entry.name === menu);
                  if (entry) open(entry);
                  setMenu(null);
                }}
              >
                Open
                <Icon name="arrow" size={13} />
              </button>
              <button type="button" role="menuitem" onClick={rename}>
                Rename<kbd>F2</kbd>
              </button>
              <button type="button" role="menuitem" onClick={duplicate}>
                Duplicate
              </button>
              <button type="button" role="menuitem" data-danger="" onClick={remove}>
                Delete
                <Icon name="trash" size={13} />
              </button>
            </>
          )}
        </FloatingMenu>
      )}
      <span role="status" className="ui-afd__sr">
        {notice}
      </span>
    </div>
  );
}

export type ArtifactImageViewerProps = {
  src: string;
  name?: string;
  alt?: string;
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
};

/** A contained image preview with zoom, fit and download controls and a readable error fallback. */
export function ArtifactImageViewer({
  src,
  name = "Image",
  alt = name,
  zoom: zoomProp,
  defaultZoom = 1,
  onZoomChange,
  className,
}: ArtifactImageViewerProps) {
  const [zoom, setZoom] = useControllable(zoomProp, defaultZoom, onZoomChange),
    [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const scale = clamp(safeNumber(zoom, 1), 0.25, 4);
  return (
    <div className={["ui-aiv", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <div className="ui-aiv__toolbar">
        <button
          type="button"
          aria-label="Zoom out"
          disabled={scale <= 0.25}
          onClick={() => setZoom(Math.max(0.25, scale - 0.25))}
        >
          −
        </button>
        <button type="button" aria-label="Fit image" onClick={() => setZoom(1)}>
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={scale >= 4}
          onClick={() => setZoom(Math.min(4, scale + 0.25))}
        >
          +
        </button>
        <a href={src} download={name} aria-label={`Download ${name}`}>
          <Icon name="download" size={14} />
        </a>
      </div>
      <div className="ui-aiv__canvas">
        {failed ? (
          <p role="status">The image could not be loaded.</p>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            style={{ width: `${scale * 100}%`, maxWidth: scale <= 1 ? "100%" : "none" }}
          />
        )}
      </div>
    </div>
  );
}

export type ArtifactNumberFormat = "General" | "Number" | "Currency" | "Percent";
export type ArtifactTable = {
  kind: "table";
  name: string;
  rows: string[][];
  updated?: string;
  columnWidths?: number[];
  boldCells?: string[];
  formats?: Record<string, ArtifactNumberFormat>;
};
export type ArtifactDocument = { kind: "document"; name: string; content: string; html?: string; updated?: string };
export type ArtifactCode = { kind: "code"; name: string; content: string; language?: string; updated?: string };
export type ArtifactDirectory = { kind: "folder"; name: string; entries: ArtifactFolderEntry[]; updated?: string };
export type ArtifactImage = { kind: "image"; name: string; src: string; alt?: string; updated?: string };
export type ArtifactFile = ArtifactTable | ArtifactDocument | ArtifactCode | ArtifactDirectory | ArtifactImage;
export type ArtifactWorkspaceTab = { id: string; label: string; icon?: ReactNode; content: ReactNode };
export type ArtifactWorkspaceProps = {
  files?: ArtifactFile[];
  defaultFiles?: ArtifactFile[];
  onFilesChange?: (files: ArtifactFile[]) => void;
  openFiles?: string[];
  defaultOpenFiles?: string[];
  onOpenFilesChange?: (names: string[]) => void;
  activeFile?: string;
  defaultActiveFile?: string;
  onActiveFileChange?: (name: string) => void;
  onClose?: () => void;
  closeLabel?: string;
  onNewTab?: () => void;
  onOpenFile?: (name: string) => void;
  /** Additional tabs, such as a task detail view. File tabs remain open alongside them. */
  tabs?: ArtifactWorkspaceTab[];
  className?: string;
};

export const defaultArtifacts: ArtifactFile[] = [
  {
    kind: "table",
    name: "fabric-comparison.csv",
    updated: "Just now",
    rows: [
      ["Fabric", "Weight (gsm)", "Breathes", "Creases", "Price / m"],
      ["Linen", "150–190", "Best", "A lot", "€14"],
      ["Linen-cotton 55/45", "160–180", "Very well", "Some", "€11"],
      ["Cotton poplin", "110–130", "Well", "Little", "€8"],
      ["Cotton seersucker", "140–160", "Very well", "Hardly", "€10"],
    ],
  },
  {
    kind: "document",
    name: "sources.md",
    updated: "Just now",
    content:
      "# Sources\n\nSix pages the assistant read for this answer, with what it took from each.\n\n- Textile Exchange – Preferred Fiber Report: linen’s water and pesticide use\n- The Fabric Store – Linen weights explained: 150–190 gsm for shirts\n- Merchant & Mills – Linen-cotton blends: fewer creases, softer from the start\n- Hemp & Linen Institute – Moisture regain of flax vs. cotton\n- Permanent Style – Seersucker in summer tailoring\n- Reddit r/malefashionadvice – How linen shirts age after a summer",
  },
];

/** Tabbed, editable files with a spreadsheet, rich text documents, undo/redo and a file chooser. */
export function ArtifactWorkspace({
  files: filesProp,
  defaultFiles = defaultArtifacts,
  onFilesChange,
  openFiles: openProp,
  defaultOpenFiles,
  onOpenFilesChange,
  activeFile: activeProp,
  defaultActiveFile,
  onActiveFileChange,
  onClose,
  closeLabel = "Close artifacts",
  onNewTab,
  onOpenFile,
  tabs: extraTabs = [],
  className,
}: ArtifactWorkspaceProps) {
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange);
  const [opened, setOpened] = useControllable(
    openProp,
    defaultOpenFiles ?? (filesProp ?? defaultFiles).map((file) => file.name),
    onOpenFilesChange,
  );
  const [active, setActive] = useControllable(
    activeProp,
    defaultActiveFile ?? defaultOpenFiles?.[0] ?? (filesProp ?? defaultFiles)[0]?.name ?? "",
    onActiveFileChange,
  );
  const [query, setQuery] = useState("");
  const [historyVersion, setHistoryVersion] = useState(0);
  const histories = useRef<Record<string, { past: ArtifactFile[]; future: ArtifactFile[] }>>({});
  const tabs = useRef<HTMLDivElement>(null);
  const id = useId();
  const list = (Array.isArray(files) ? files : []).filter(Boolean);
  const names = opened.filter(
    (name) => list.some((file) => file.name === name) || extraTabs.some((tab) => tab.id === name),
  );
  const currentName = names.includes(active) ? active : (names[0] ?? "");
  const file = active === "__new" ? undefined : list.find((item) => item.name === currentName);
  const extraTab = active === "__new" ? undefined : extraTabs.find((tab) => tab.id === currentName);
  const history = file ? histories.current[file.name] : undefined;
  const update = (next: ArtifactFile, nextList = list) => {
    const old = list.find((item) => item.name === next.name);
    if (!old || JSON.stringify(old) === JSON.stringify(next)) return;
    const history = (histories.current[next.name] ??= { past: [], future: [] });
    history.past = [...history.past.slice(-49), old];
    history.future = [];
    setFiles(nextList.map((item) => (item.name === next.name ? next : item)));
    setHistoryVersion(historyVersion + 1);
  };
  const updateDirectory = (directory: ArtifactDirectory, entries: ArtifactFolderEntry[]) => {
    const removed = directory.entries.filter((entry) => !entries.some((next) => next.name === entry.name));
    const added = entries.filter((entry) => !directory.entries.some((previous) => previous.name === entry.name));
    let nextList = list;
    if (directory.entries.length === entries.length && removed.length === 1 && added.length === 1) {
      nextList = list.map((item) => (item.name === removed[0].name ? { ...item, name: added[0].name } : item));
      setOpened(opened.map((name) => (name === removed[0].name ? added[0].name : name)));
    }
    update({ ...directory, entries }, nextList);
  };
  const travel = (direction: "undo" | "redo") => {
    if (!file) return;
    const history = histories.current[file.name];
    if (!history) return;
    const source = direction === "undo" ? history.past : history.future;
    const previous = source.pop();
    if (!previous) return;
    (direction === "undo" ? history.future : history.past).push(file);
    setFiles(list.map((item) => (item.name === file.name ? previous : item)));
    setHistoryVersion(historyVersion + 1);
  };
  const open = (name: string) => {
    if (!list.some((item) => item.name === name)) {
      const source = list.find((item) => item.name === name.replace(/ copy(?: \d+)?$/, ""));
      const entry = file?.kind === "folder" ? file.entries.find((entry) => entry.name === name) : undefined;
      const next: ArtifactFile = source
        ? { ...source, name }
        : entry?.kind === "folder"
          ? { kind: "folder", name, entries: [] }
          : entry?.kind === "table"
            ? { kind: "table", name, rows: [[""]] }
            : entry?.kind === "code"
              ? { kind: "code", name, content: "" }
              : { kind: "document", name, content: `# ${name}\n\n` };
      setFiles([...list, next]);
    }
    if (!names.includes(name)) setOpened([...names, name]);
    setActive(name);
    onOpenFile?.(name);
  };
  const close = (name: string) => {
    const remaining = names.filter((item) => item !== name);
    setOpened(remaining);
    const next = currentName === name ? remaining[Math.min(names.indexOf(name), remaining.length - 1)] : currentName;
    if (currentName === name) setActive(next ?? "__new");
    if (remaining.length && tabs.current?.contains(document.activeElement))
      requestAnimationFrame(() => {
        const buttons = [...(tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])];
        buttons
          .find((button) => button.id === `${id}-${encodeURIComponent(next ?? "")}`)
          ?.focus({ preventScroll: true });
      });
  };
  const create = (kind: "table" | "document") => {
    const extension = kind === "table" ? "csv" : "md";
    let index = 1;
    while (list.some((item) => item.name === `Untitled ${index}.${extension}`)) index++;
    const name = `Untitled ${index}.${extension}`;
    const next: ArtifactFile =
      kind === "table"
        ? { kind, name, rows: [[""]], updated: "Just now" }
        : { kind, name, content: "# Untitled\n\n", updated: "Just now" };
    setFiles([...list, next]);
    setOpened([...names, name]);
    setActive(name);
  };
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, name: string) => {
    const index = names.indexOf(name);
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % names.length
        : event.key === "ArrowLeft"
          ? (index - 1 + names.length) % names.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? names.length - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      setActive(names[next]);
      tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
    }
    if (event.key === "Delete") {
      event.preventDefault();
      close(name);
    }
  };
  return (
    <section
      className={["ui-aw", className].filter(Boolean).join(" ")}
      aria-label="File workspace"
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !isEditing(event.target)) {
          event.preventDefault();
          travel(event.shiftKey ? "redo" : "undo");
        }
      }}
    >
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <header className="ui-aw__bar">
        <div ref={tabs} className="ui-aw__tabs" role="tablist" aria-label="Open files">
          {names.map((name) => (
            <div
              className="ui-aw__tab-wrap"
              key={name}
              data-active={(currentName === name && active !== "__new") || undefined}
            >
              <button
                type="button"
                role="tab"
                aria-selected={currentName === name && active !== "__new"}
                aria-controls={`${id}-pane`}
                id={`${id}-${encodeURIComponent(name)}`}
                tabIndex={currentName === name && active !== "__new" ? 0 : -1}
                className="ui-aw__tab"
                title={extraTabs.find((tab) => tab.id === name)?.label ?? name}
                onClick={() => setActive(name)}
                onKeyDown={(event) => tabKey(event, name)}
              >
                <span aria-hidden="true">
                  {extraTabs.find((tab) => tab.id === name)?.icon ?? (
                    <Icon
                      name={list.find((item) => item.name === name)?.kind === "table" ? "table" : "document"}
                      size={14}
                    />
                  )}
                </span>
                <span>{extraTabs.find((tab) => tab.id === name)?.label ?? name}</span>
              </button>
              <button
                type="button"
                className="ui-aw__tab-close"
                aria-label={`Close ${extraTabs.find((tab) => tab.id === name)?.label ?? name}`}
                onClick={() => close(name)}
              >
                <Icon name="close" size={10} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ui-aw__tool"
          aria-label="New tab"
          title="New tab"
          onClick={() => (onNewTab ? onNewTab() : setActive("__new"))}
        >
          <Icon name="plus" size={16} />
        </button>
        {onClose && (
          <button type="button" className="ui-aw__tool ui-aw__collapse" aria-label={closeLabel} onClick={onClose}>
            <Icon name="panel" />
          </button>
        )}
      </header>
      <div
        className="ui-aw__pane"
        id={`${id}-pane`}
        role="tabpanel"
        aria-labelledby={file || extraTab ? `${id}-${encodeURIComponent(currentName)}` : undefined}
        aria-label={file || extraTab ? undefined : "Open a file"}
      >
        {extraTab ? (
          extraTab.content
        ) : file ? (
          <>
            <header className="ui-aw__heading">
              <span className="ui-aw__file-icon" data-kind={file.kind}>
                <Icon
                  name={
                    file.kind === "table"
                      ? "table"
                      : file.kind === "folder"
                        ? "folder"
                        : file.kind === "image"
                          ? "image"
                          : "document"
                  }
                  size={16}
                />
              </span>
              <span>
                <strong title={file.name}>{file.name}</strong>
                <small>
                  {file.kind === "folder"
                    ? `${(file.updated ?? "").replace(/\s*·\s*\d+\s+items?$/, "")}${file.updated ? " · " : ""}${file.entries.length} ${file.entries.length === 1 ? "item" : "items"}`
                    : (file.updated ?? "Just now")}
                </small>
              </span>
            </header>
            {file.kind === "folder" ? (
              <ArtifactFolder
                name={file.name}
                entries={file.entries}
                onEntriesChange={(entries) => updateDirectory(file, entries)}
                onOpen={(entry) => open(entry.name)}
              />
            ) : file.kind === "image" ? (
              <ArtifactImageViewer key={file.name} src={file.src} name={file.name} alt={file.alt} />
            ) : file.kind === "code" ? (
              <WorkspaceCodeEditor file={file} onChange={update} />
            ) : file.kind === "table" ? (
              <SpreadsheetEditor
                key={file.name}
                file={file}
                onChange={update}
                onUndo={() => travel("undo")}
                onRedo={() => travel("redo")}
                canUndo={!!history?.past.length}
                canRedo={!!history?.future.length}
              />
            ) : (
              <DocumentEditor
                key={file.name}
                file={file}
                onChange={update}
                onUndo={() => travel("undo")}
                onRedo={() => travel("redo")}
                canUndo={!!history?.past.length}
                canRedo={!!history?.future.length}
              />
            )}
          </>
        ) : (
          <div className="ui-aw__start">
            <Icon name="document" size={28} />
            <h2>What would you like to open?</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Find a file"
              placeholder="Search files…"
            />
            <div className="ui-aw__create">
              <button type="button" onClick={() => create("document")}>
                <Icon name="document" />
                New document
              </button>
              <button type="button" onClick={() => create("table")}>
                <Icon name="table" />
                New spreadsheet
              </button>
            </div>
            <p className="ui-aw__start-label">Files in this conversation</p>
            {list
              .filter((item) => item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
              .map((item) => (
                <button type="button" className="ui-aw__file-row" key={item.name} onClick={() => open(item.name)}>
                  <Icon name={item.kind === "table" ? "table" : "document"} />
                  <span>{item.name}</span>
                  <Icon name="arrow" size={13} />
                </button>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WorkspaceCodeEditor({ file, onChange }: { file: ArtifactCode; onChange: (file: ArtifactFile) => void }) {
  const [notice, setNotice] = useState("");
  const lines = useRef<HTMLPreElement>(null);
  const download = () => {
    const url = URL.createObjectURL(new Blob([file.content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="ui-aw__code">
      <div className="ui-aw__toolbar">
        <span className="ui-aw__code-language">{file.language ?? "Plain text"}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.writeText(file.content)
              .then(() => setNotice("Copied"))
              .catch(() => setNotice("Couldn't copy"));
          }}
        >
          <Icon name="copy" size={13} />
          Copy
        </button>
        <button type="button" onClick={download}>
          <Icon name="download" size={13} />
          Download
        </button>
      </div>
      <div className="ui-aw__code-body">
        <pre ref={lines} aria-hidden="true">
          {file.content
            .split("\n")
            .map((_, index) => index + 1)
            .join("\n")}
        </pre>
        <textarea
          aria-label={`${file.name}, code`}
          value={file.content}
          spellCheck={false}
          onScroll={(event) => {
            if (lines.current) lines.current.scrollTop = event.currentTarget.scrollTop;
          }}
          onChange={(event) => onChange({ ...file, content: event.target.value, updated: "Just now" })}
        />
      </div>
      <span className="ui-aw__code-notice" role="status">
        {notice}
      </span>
    </div>
  );
}

function WorkspaceToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  pressed,
}: {
  icon: IconName;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      className="ui-aw__tool"
      aria-label={label}
      title={label}
      disabled={disabled}
      aria-pressed={pressed}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}

function columnName(index: number): string {
  return index >= 26
    ? columnName(Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26))
    : String.fromCharCode(65 + index);
}
function SpreadsheetEditor({
  file,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  file: ArtifactTable;
  onChange: (file: ArtifactFile) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [cell, setCell] = useState({ row: 1, column: 0 });
  const [editing, setEditing] = useState<"cell" | "formula" | false>(false),
    [draft, setDraft] = useState("");
  const [reference, setReference] = useState("A2");
  const [widths, setWidths] = useState<number[]>(file.columnWidths ?? []);
  const widthsRef = useRef(widths);
  const bold = file.boldCells ?? [];
  const [menu, setMenu] = useState<"format" | "delete" | null>(null);
  const root = useRef<HTMLDivElement>(null),
    grid = useRef<HTMLTableElement>(null),
    editInput = useRef<HTMLInputElement>(null),
    formatRef = useRef<HTMLButtonElement>(null),
    deleteRef = useRef<HTMLButtonElement>(null);
  const resizeCleanup = useRef<(() => void) | null>(null),
    id = useId();
  const rows = Array.isArray(file.rows) ? file.rows : [];
  const rowCount = Math.max(9, rows.length),
    columnCount = Math.max(7, ...rows.map((row) => row.length));
  const value = String(rows[cell.row]?.[cell.column] ?? "");
  const address = `${columnName(cell.column)}${cell.row + 1}`;
  const format = file.formats?.[address] ?? "General";
  const setBold = (next: string[]) => onChange({ ...file, boldCells: next });
  const setFormat = (next: ArtifactNumberFormat) =>
    onChange({ ...file, formats: { ...file.formats, [address]: next } });
  useEffect(() => {
    const next = file.columnWidths ?? [];
    widthsRef.current = next;
    setWidths(next);
  }, [file.columnWidths]);
  useEffect(() => {
    setReference(address);
    if (!editing) setDraft(value);
  }, [address, value, editing]);
  useEffect(() => {
    if (editing === "cell") {
      editInput.current?.focus();
      editInput.current?.select();
    }
  }, [editing]);
  useEffect(() => () => resizeCleanup.current?.(), []);
  const select = (row: number, column: number, focus = true) => {
    const next = { row: clamp(row, 0, rowCount - 1), column: clamp(column, 0, columnCount - 1) };
    setCell(next);
    setEditing(false);
    if (focus)
      grid.current
        ?.querySelector<HTMLElement>(`[data-cell="${next.row}:${next.column}"]`)
        ?.focus({ preventScroll: false });
  };
  const write = (text: string, row = cell.row, column = cell.column) => {
    const next = rows.map((row) => [...row]);
    while (next.length <= row) next.push([]);
    while (next[row].length <= column) next[row].push("");
    next[row][column] = text;
    onChange({ ...file, rows: next, updated: "Just now" });
  };
  const commit = () => {
    if (draft !== value) write(draft);
    setEditing(false);
  };
  const begin = (text = value) => {
    setDraft(text);
    setEditing("cell");
  };
  const sort = (reverse: boolean) => {
    const [header = [], ...data] = rows;
    onChange({
      ...file,
      rows: [
        header,
        ...data.sort(
          (a, b) =>
            String(a[cell.column] ?? "").localeCompare(String(b[cell.column] ?? ""), undefined, { numeric: true }) *
            (reverse ? -1 : 1),
        ),
      ],
    });
  };
  const modify = (action: "row" | "column" | "delete-row" | "delete-column") => {
    const next = rows.map((row) => [...row]);
    if (action === "row") {
      while (next.length < cell.row) next.push([]);
      next.splice(cell.row, 0, Array(columnCount).fill(""));
    }
    if (action === "column") next.forEach((row) => row.splice(cell.column, 0, ""));
    if (action === "delete-row") next.splice(cell.row, 1);
    if (action === "delete-column") next.forEach((row) => row.splice(cell.column, 1));
    onChange({ ...file, rows: next });
    setMenu(null);
  };
  const key = (event: KeyboardEvent<HTMLTableCellElement>) => {
    if (editing || event.nativeEvent.isComposing) return;
    const next =
      event.key === "ArrowDown"
        ? [cell.row + 1, cell.column]
        : event.key === "ArrowUp"
          ? [cell.row - 1, cell.column]
          : event.key === "ArrowRight" || (event.key === "Tab" && !event.shiftKey)
            ? [cell.row, cell.column + 1]
            : event.key === "ArrowLeft" || (event.key === "Tab" && event.shiftKey)
              ? [cell.row, cell.column - 1]
              : event.key === "Home"
                ? [event.ctrlKey ? 0 : cell.row, 0]
                : event.key === "End"
                  ? [event.ctrlKey ? rowCount - 1 : cell.row, columnCount - 1]
                  : null;
    if (next) {
      event.preventDefault();
      select(next[0], next[1]);
    } else if (event.key === "Enter" || event.key === "F2") {
      event.preventDefault();
      begin();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      write("");
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      begin(event.key);
    }
  };
  const startResize = (event: ReactPointerEvent<HTMLButtonElement>, column: number) => {
    event.preventDefault();
    const target = event.currentTarget,
      x = event.clientX,
      start = widths[column] ?? (column === 0 ? 128 : column === 1 ? 102 : column >= 5 ? 70 : 80);
    target.setPointerCapture(event.pointerId);
    const move = (event: PointerEvent) => {
      const next = [...widthsRef.current];
      next[column] = clamp(start + event.clientX - x, 55, 500);
      widthsRef.current = next;
      setWidths(next);
    };
    const stop = (event?: PointerEvent) => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", stop);
      target.removeEventListener("pointercancel", stop);
      if (event?.type === "pointerup") onChange({ ...file, columnWidths: widthsRef.current });
      resizeCleanup.current = null;
    };
    resizeCleanup.current?.();
    resizeCleanup.current = stop;
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", stop);
    target.addEventListener("pointercancel", stop);
  };
  const formatted = (text: string, address: string) => {
    const format = file.formats?.[address] ?? "General";
    const number = Number(text);
    if (!text.trim() || !Number.isFinite(number) || format === "General") return text;
    return format === "Percent"
      ? `${number * 100}%`
      : format === "Currency"
        ? new Intl.NumberFormat("en", { style: "currency", currency: "EUR" }).format(number)
        : number.toFixed(2);
  };
  return (
    <div ref={root} className="ui-aw__sheet">
      <div className="ui-aw__toolbar" role="toolbar" aria-label="Spreadsheet tools">
        <WorkspaceToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={onUndo} />
        <WorkspaceToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={onRedo} />
        <span className="ui-aw__divider" />
        <WorkspaceToolbarButton
          icon="bold"
          label="Bold"
          pressed={bold.includes(address)}
          onClick={() => setBold(bold.includes(address) ? bold.filter((item) => item !== address) : [...bold, address])}
        />
        <button
          ref={formatRef}
          type="button"
          className="ui-aw__format"
          aria-haspopup="menu"
          aria-expanded={menu === "format"}
          aria-controls={menu === "format" ? `${id}-menu` : undefined}
          onClick={() => setMenu(menu === "format" ? null : "format")}
        >
          <span>Aa</span>
          {format}
          <Icon name="chevron" size={10} />
        </button>
        <span className="ui-aw__divider" />
        <WorkspaceToolbarButton
          icon="sort"
          label={`Sort A to Z by ${columnName(cell.column)}`}
          onClick={() => sort(false)}
        />
        <WorkspaceToolbarButton
          icon="sort"
          label={`Sort Z to A by ${columnName(cell.column)}`}
          onClick={() => sort(true)}
        />
        <span className="ui-aw__divider" />
        <WorkspaceToolbarButton icon="row" label="Insert row above" onClick={() => modify("row")} />
        <WorkspaceToolbarButton icon="column" label="Insert column left" onClick={() => modify("column")} />
        <button
          ref={deleteRef}
          type="button"
          className="ui-aw__tool"
          aria-label="Delete"
          title="Delete"
          aria-haspopup="menu"
          aria-expanded={menu === "delete"}
          aria-controls={menu === "delete" ? `${id}-menu` : undefined}
          onClick={() => setMenu(menu === "delete" ? null : "delete")}
        >
          <Icon name="trash" />
        </button>
      </div>
      <div className="ui-aw__formula">
        <input
          aria-label="Cell reference – type one to go there"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          onBlur={() => setReference(address)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            const match = /^([a-z]+)([1-9]\d*)$/i.exec(reference.trim());
            if (match) {
              const column =
                [...match[1].toUpperCase()].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
              select(Number(match[2]) - 1, column);
            } else setReference(address);
          }}
        />
        <span aria-hidden="true">fx</span>
        <input
          aria-label={`Contents of ${address}`}
          value={editing ? draft : value}
          onFocus={() => {
            setDraft(value);
          }}
          onChange={(event) => {
            setEditing("formula");
            setDraft(event.target.value);
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
              select(cell.row + 1, cell.column);
            }
            if (event.key === "Escape") {
              setDraft(value);
              setEditing(false);
              select(cell.row, cell.column);
            }
          }}
        />
      </div>
      <div className="ui-aw__grid-wrap">
        <table
          ref={grid}
          className="ui-aw__grid"
          role="grid"
          aria-label={file.name}
          aria-rowcount={rowCount + 1}
          aria-colcount={columnCount + 1}
        >
          <colgroup>
            <col style={{ width: 30 }} />
            {Array.from({ length: columnCount }, (_, column) => (
              <col key={column} style={{ width: widths[column] ?? (column === 0 ? 128 : column === 1 ? 102 : 80) }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="ui-aw__corner" />
              {Array.from({ length: columnCount }, (_, column) => (
                <th scope="col" key={column} data-selected={column === cell.column || undefined}>
                  {columnName(column)}
                  <button
                    type="button"
                    className="ui-aw__col-resize"
                    aria-label={`Resize column ${columnName(column)}`}
                    onPointerDown={(event) => startResize(event, column)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        event.preventDefault();
                        const next = [...widths];
                        next[column] = clamp(
                          (widths[column] ?? (column === 0 ? 128 : column === 1 ? 102 : column >= 5 ? 70 : 80)) +
                            (event.key === "ArrowLeft" ? -10 : 10),
                          55,
                          500,
                        );
                        widthsRef.current = next;
                        setWidths(next);
                        onChange({ ...file, columnWidths: next });
                      }
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, row) => (
              <tr key={row}>
                <th scope="row" data-selected={row === cell.row || undefined}>
                  {row + 1}
                </th>
                {Array.from({ length: columnCount }, (_, column) => (
                  <td
                    key={column}
                    role="gridcell"
                    aria-label={`${columnName(column)}${row + 1}${rows[row]?.[column] ? `: ${rows[row][column]}` : ""}`}
                    aria-selected={cell.row === row && cell.column === column}
                    tabIndex={cell.row === row && cell.column === column ? 0 : -1}
                    data-cell={`${row}:${column}`}
                    data-bold={row === 0 || bold.includes(`${columnName(column)}${row + 1}`) || undefined}
                    onFocus={() => {
                      if (row !== cell.row || column !== cell.column) {
                        setCell({ row, column });
                        setEditing(false);
                      }
                    }}
                    onPointerDown={(event) => {
                      if (!(event.target instanceof HTMLInputElement)) event.currentTarget.focus();
                    }}
                    onDoubleClick={() => begin()}
                    onKeyDown={key}
                    onCopy={(event) => {
                      event.clipboardData.setData("text/plain", String(rows[row]?.[column] ?? ""));
                      event.preventDefault();
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                      const next = rows.map((row) => [...row]);
                      const pasted = event.clipboardData
                        .getData("text/plain")
                        .replace(/\r/g, "")
                        .replace(/\n$/, "")
                        .split("\n")
                        .map((line) => line.split("\t"));
                      pasted.forEach((line, offset) => {
                        while (next.length <= row + offset) next.push([]);
                        line.forEach((text, index) => {
                          next[row + offset][column + index] = text;
                        });
                      });
                      onChange({ ...file, rows: next });
                    }}
                  >
                    {editing === "cell" && cell.row === row && cell.column === column ? (
                      <input
                        ref={editInput}
                        className="ui-aw__cell-input"
                        aria-label={`Edit ${address}`}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onBlur={commit}
                        onKeyDown={(event) => {
                          event.stopPropagation();
                          if (event.key === "Enter" || event.key === "Tab") {
                            event.preventDefault();
                            commit();
                            select(
                              cell.row + (event.key === "Enter" ? (event.shiftKey ? -1 : 1) : 0),
                              cell.column + (event.key === "Tab" ? (event.shiftKey ? -1 : 1) : 0),
                            );
                          }
                          if (event.key === "Escape") {
                            setEditing(false);
                            setDraft(value);
                            select(cell.row, cell.column);
                          }
                        }}
                      />
                    ) : (
                      formatted(String(rows[row]?.[column] ?? ""), `${columnName(column)}${row + 1}`)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ui-aw__sheet-status" role="status" aria-live="polite">
        {editing ? `Editing ${address}` : ""}
      </div>
      {menu && (
        <FloatingMenu
          anchor={menu === "format" ? formatRef : deleteRef}
          root={root}
          className="ui-aw__menu"
          id={`${id}-menu`}
          label={menu === "format" ? "Number format" : "Delete cells"}
          onClose={() => setMenu(null)}
        >
          {menu === "format" ? (
            (["General", "Number", "Currency", "Percent"] as const).map((option) => (
              <button
                type="button"
                role="menuitemradio"
                aria-checked={format === option}
                key={option}
                onClick={() => {
                  setFormat(option);
                  setMenu(null);
                }}
              >
                {option}
                {format === option && <Icon name="check" size={13} />}
              </button>
            ))
          ) : (
            <>
              <button type="button" role="menuitem" onClick={() => modify("delete-row")}>
                Delete row {cell.row + 1}
              </button>
              <button type="button" role="menuitem" onClick={() => modify("delete-column")}>
                Delete column {columnName(cell.column)}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  write("");
                  setMenu(null);
                }}
              >
                Clear cell
              </button>
            </>
          )}
        </FloatingMenu>
      )}
    </div>
  );
}

function safeDocumentFragment(html: string): DocumentFragment {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const fragment = document.createDocumentFragment();
  const allowed = new Set([
    "P",
    "DIV",
    "BR",
    "H1",
    "H2",
    "H3",
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "A",
    "CODE",
    "PRE",
  ]);
  const copy = (source: Node, target: Node) => {
    if (source.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(source.textContent ?? ""));
      return;
    }
    if (!(source instanceof Element) || ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG"].includes(source.tagName)) return;
    const element = document.createElement(allowed.has(source.tagName) ? source.tagName.toLowerCase() : "span");
    if (source.tagName === "A" && /^(https?:|mailto:|#)/i.test(source.getAttribute("href") ?? "")) {
      element.setAttribute("href", source.getAttribute("href")!);
      element.setAttribute("rel", "noopener noreferrer");
    }
    source.childNodes.forEach((child) => copy(child, element));
    target.appendChild(element);
  };
  parsed.body.childNodes.forEach((child) => copy(child, fragment));
  return fragment;
}

function DocumentEditor({
  file,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  file: ArtifactDocument;
  onChange: (file: ArtifactFile) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const editor = useRef<HTMLDivElement>(null),
    last = useRef("");
  const [link, setLink] = useState<string | null>(null),
    [style, setStyle] = useState("Text");
  const selection = useRef<Range | null>(null);
  useLayoutEffect(() => {
    const el = editor.current;
    if (!el) return;
    const key = file.html ?? file.content;
    if (key === last.current) return;
    last.current = key;
    if (file.html) {
      el.replaceChildren(safeDocumentFragment(file.html));
      return;
    }
    const fragment = document.createDocumentFragment();
    let list: HTMLUListElement | null = null;
    for (const line of file.content.split("\n")) {
      if (!line.trim()) {
        list = null;
        continue;
      }
      if (line.startsWith("- ")) {
        if (!list) {
          list = document.createElement("ul");
          fragment.appendChild(list);
        }
        const item = document.createElement("li");
        item.textContent = line.slice(2);
        list.appendChild(item);
      } else {
        list = null;
        const match = /^(#{1,3})\s+(.*)/.exec(line);
        const block = document.createElement(match ? `h${match[1].length}` : "p");
        block.textContent = match ? match[2] : line;
        fragment.appendChild(block);
      }
    }
    if (!fragment.childNodes.length) fragment.appendChild(document.createElement("p"));
    el.replaceChildren(fragment);
  }, [file.name, file.content, file.html]);
  const emit = () => {
    const el = editor.current;
    if (!el) return;
    last.current = el.innerHTML;
    onChange({ ...file, content: el.innerText, html: el.innerHTML, updated: "Just now" });
  };
  const format = (command: string, value?: string) => {
    editor.current?.focus();
    document.execCommand(command, false, value);
    emit();
  };
  const wordCount = file.content.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div className="ui-aw__document">
      <div className="ui-aw__toolbar" role="toolbar" aria-label="Document formatting">
        <WorkspaceToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={onUndo} />
        <WorkspaceToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={onRedo} />
        <span className="ui-aw__divider" />
        <select
          className="ui-aw__text-style"
          aria-label="Text style"
          value={style}
          onChange={(event) => {
            setStyle(event.target.value);
            format(
              "formatBlock",
              event.target.value === "Text" ? "p" : event.target.value === "Heading 1" ? "h1" : "h2",
            );
          }}
        >
          <option>Text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
        </select>
        <WorkspaceToolbarButton icon="bold" label="Bold" onClick={() => format("bold")} />
        <WorkspaceToolbarButton icon="italic" label="Italic" onClick={() => format("italic")} />
        <WorkspaceToolbarButton icon="underline" label="Underline" onClick={() => format("underline")} />
        <WorkspaceToolbarButton
          icon="link"
          label="Insert link"
          onClick={() => {
            const current = window.getSelection();
            selection.current = current?.rangeCount ? current.getRangeAt(0).cloneRange() : null;
            setLink("");
          }}
        />
        <WorkspaceToolbarButton icon="tasks" label="Bulleted list" onClick={() => format("insertUnorderedList")} />
      </div>
      {link !== null && (
        <form
          className="ui-aw__link-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (/^(https?:\/\/|mailto:)/i.test(link)) {
              const current = window.getSelection();
              editor.current?.focus();
              if (selection.current && current) {
                current.removeAllRanges();
                current.addRange(selection.current);
              }
              format("createLink", link);
              setLink(null);
            }
          }}
        >
          <input
            autoFocus
            aria-label="Link URL"
            type="url"
            placeholder="https://…"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setLink(null);
                editor.current?.focus();
              }
            }}
          />
          <button type="submit">Apply</button>
          <button type="button" aria-label="Cancel link" onClick={() => setLink(null)}>
            <Icon name="close" size={12} />
          </button>
        </form>
      )}
      <div
        ref={editor}
        className="ui-aw__doc"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={`${file.name}, document`}
        spellCheck
        onInput={emit}
        onPaste={(event) => {
          event.preventDefault();
          document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          emit();
        }}
      />
      <footer className="ui-aw__doc-status">
        {wordCount} words · {file.content.length} characters
      </footer>
    </div>
  );
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
      <style href="ui-agent-thread-screen" precedence="default">
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
  const approval = approvalOptions.find((option) => option.id === rawApproval) ?? approvalOptions[0]!;
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
      <style href="ui-agent-thread-screen" precedence="default">
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
      <style href="ui-agent-thread-screen" precedence="default">
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
      <style href="ui-agent-thread-screen" precedence="default">
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
                    onClick={() => setActiveId(list[(activeIndex - 1 + list.length) % list.length]!.id)}
                  >
                    <Icon name="chevron" size={10} />
                  </button>
                  <span>{labels.page(activeIndex + 1, list.length)}</span>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => setActiveId(list[(activeIndex + 1) % list.length]!.id)}
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
      <style href="ui-agent-thread-screen" precedence="default">
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
      <style href="ui-agent-thread-screen" precedence="default">
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
      <style href="ui-agent-thread-screen" precedence="default">
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
      <style href="ui-agent-thread-screen" precedence="default">
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
    ] as const) {
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
                  ask: { id: "queue", question: defaultThreadDecisions[0]!.question, task: "Ingest pipeline" },
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
      updateDecisions([...decisionsRef.current, defaultThreadDecisions[0]!]);
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
      <style href="ui-agent-thread-screen" precedence="default">
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
                        list[messageIndex - 1]!.role === "user" ||
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

export type ThreadTaskDetail = {
  goal?: string;
  project?: string;
  started?: string;
  steps?: { label: string; done?: boolean }[];
  history?: string[];
  artifacts?: string[];
  decided?: { question: string; answer: string; at?: number }[];
};
export type TaskDetailsProps = {
  task: ThreadTask;
  detail?: ThreadTaskDetail;
  decision?: { id: string; question: string };
  onDecide?: (id: string) => void;
  onOpenFile?: (name: string) => void;
  onShow?: (id: string) => void;
  className?: string;
};

/** The task tab in the work area: status, steps, history, artifacts and earlier decisions. */
export function TaskDetails({
  task,
  detail = {},
  decision,
  onDecide,
  onOpenFile,
  onShow,
  className,
}: TaskDetailsProps) {
  return (
    <section className={["ui-td", className].filter(Boolean).join(" ")} aria-label={task.title}>
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <h2 className="ui-td__sr">{task.title}</h2>
      {detail.goal && (
        <p className="ui-td__goal" dir="auto">
          {detail.goal}
        </p>
      )}
      <dl className="ui-td__meta">
        <div>
          <dt>Status</dt>
          <dd>
            <span data-done={task.done || undefined}>
              <Icon name={task.done ? "check" : "play"} size={14} />
            </span>
            {task.status}
            {task.steps && (
              <small>
                {task.steps.done}/{task.steps.total}
              </small>
            )}
          </dd>
        </div>
        {detail.project && (
          <div>
            <dt>Project</dt>
            <dd>{detail.project}</dd>
          </div>
        )}
        {detail.started && (
          <div>
            <dt>Started</dt>
            <dd>{detail.started}</dd>
          </div>
        )}
      </dl>
      {decision && (
        <button type="button" className="ui-td__waiting" onClick={() => onDecide?.(decision.id)}>
          <span>Needs you</span>
          {decision.question}
          <Icon name="arrow" size={13} />
        </button>
      )}
      {detail.steps && detail.steps.length > 0 && (
        <section className="ui-td__section">
          <h3>Steps</h3>
          <ol className="ui-td__steps">
            {detail.steps.map((step, index) => (
              <li
                key={`${step.label}-${index}`}
                data-done={step.done || undefined}
                data-active={(!step.done && detail.steps?.findIndex((item) => !item.done) === index) || undefined}
              >
                <span aria-hidden="true">{step.done && <Icon name="check" size={10} />}</span>
                <span dir="auto">{step.label}</span>
                <span className="ui-td__sr">
                  {step.done
                    ? ", done"
                    : detail.steps?.findIndex((item) => !item.done) === index
                      ? ", in progress"
                      : ""}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {detail.history && detail.history.length > 0 && (
        <section className="ui-td__section">
          <h3>What happened so far</h3>
          <ul className="ui-td__history">
            {detail.history.map((line, index) => (
              <li key={index} dir="auto">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}
      {detail.artifacts && detail.artifacts.length > 0 && (
        <section className="ui-td__section">
          <h3>Artifacts</h3>
          <div className="ui-td__files">
            {detail.artifacts.map((name) => (
              <button type="button" key={name} onClick={() => onOpenFile?.(name)}>
                <Icon name="document" size={13} />
                {name}
              </button>
            ))}
          </div>
        </section>
      )}
      {detail.decided && detail.decided.length > 0 && (
        <section className="ui-td__section">
          <h3>Decided</h3>
          {detail.decided.map((item, index) => (
            <div className="ui-td__answer" key={index}>
              <Icon name="check" size={13} />
              <span>
                <strong dir="auto">{item.question}</strong>
                <small dir="auto">{item.answer}</small>
              </span>
            </div>
          ))}
        </section>
      )}
      <footer>
        <button type="button" disabled={!onShow} onClick={() => onShow?.(task.id)}>
          Show in Tasks
          <Icon name="chevron" size={12} />
        </button>
      </footer>
    </section>
  );
}

export const defaultThreadTaskDetails: Record<string, ThreadTaskDetail> = {
  dashboard: {
    goal: "A usage dashboard Northwind's team opens every morning.",
    project: "Northwind",
    started: "Tue, Oct 28",
    steps: [{ label: "Usage page", done: true }, { label: "Empty state" }, { label: "Alerts page" }],
    history: [
      "Drew three empty states for you to pick from",
      "Usage page shipped with daily bars",
      "Northwind opened it 31 times this week",
    ],
    decided: [{ question: "Which chart for the usage page?", answer: "Bars" }],
  },
  api: {
    goal: "Move our own applications to the new API without breaking existing clients.",
    project: "Platform",
    started: "Mon, Oct 27",
    steps: [
      { label: "Compatibility layer", done: true },
      { label: "Move our own apps" },
      { label: "Move partners" },
      { label: "Retire old endpoints" },
    ],
    history: ["Compatibility layer is live", "Started moving our own apps"],
    artifacts: ["ingest-design.md"],
  },
  ingest: {
    goal: "Bring the ingest pipeline to staging, then run a smoke test before production.",
    project: "Northwind",
    started: "Tue, Nov 4",
    steps: [
      { label: "Design the pipeline", done: true },
      { label: "Run the load test", done: true },
      { label: "Pick a queue" },
      { label: "Deploy to staging" },
    ],
    history: ["Load test passed at 20k events per minute", "Staging cluster is ready"],
    artifacts: ["load-test-results.csv", "ingest-design.md", "deploy.yaml"],
  },
  weekly: {
    goal: "Send Northwind a concise weekly progress update.",
    project: "Northwind",
    steps: [{ label: "Draft the update", done: true }, { label: "Review and send" }],
    artifacts: ["weekly-update.md"],
  },
  auth: {
    goal: "Make authentication easier to maintain.",
    project: "Platform",
    steps: [
      { label: "Refactor", done: true },
      { label: "Stage", done: true },
    ],
    history: ["Merged and on staging"],
  },
  usage: {
    goal: "Show the team how their usage changes over time.",
    project: "Northwind",
    steps: [
      { label: "Design", done: true },
      { label: "Build", done: true },
      { label: "Ship", done: true },
    ],
    history: ["Shipped to Northwind"],
  },
  docs: {
    goal: "Publish the first four Evalkit guides.",
    project: "Evalkit",
    steps: [
      { label: "Write", done: true },
      { label: "Review", done: true },
      { label: "Publish", done: true },
    ],
    history: ["Published with four guides"],
  },
};
const threadTaskCatalog: Record<string, ThreadTask> = {
  dashboard: {
    id: "dashboard",
    title: "Client dashboard",
    status: "Drawing the empty states",
    steps: { done: 1, total: 3 },
  },
  api: {
    id: "api",
    title: "API migration",
    status: "Moving our own apps",
    steps: { done: 1, total: 4 },
    tone: "active",
  },
  ingest: { id: "ingest", title: "Ingest pipeline", status: "Picking a queue", steps: { done: 2, total: 4 } },
  weekly: { id: "weekly", title: "Weekly update", status: "Ready for review", steps: { done: 1, total: 2 } },
  auth: {
    id: "auth",
    title: "Auth refactor",
    status: "Merged and on staging",
    steps: { done: 2, total: 2 },
    done: true,
  },
  usage: { id: "usage", title: "Usage page", status: "Shipped to Northwind", steps: { done: 3, total: 3 }, done: true },
  docs: {
    id: "docs",
    title: "Docs site",
    status: "Published with four guides",
    steps: { done: 3, total: 3 },
    done: true,
  },
};
export const threadScreenArtifacts: ArtifactFile[] = [
  {
    kind: "table",
    name: "load-test-results.csv",
    updated: "Just now",
    rows: [
      ["Events / min", "p95 (ms)", "Errors", "Result"],
      ["10000", "54", "0.01%", "Passed"],
      ["20000", "96", "0.02%", "Passed"],
      ["30000", "142", "0.08%", "Backlog"],
    ],
  },
  {
    kind: "document",
    name: "ingest-design.md",
    updated: "Just now",
    content:
      "# Ingest pipeline\n\nNorthwind needs a durable ingest service with predictable latency during bursts.\n\n## Constraints\n\n- Handle 20,000 events per minute\n- Keep p95 under 100 ms\n- Preserve events across deploys\n\n## Rollout\n\nDeploy to staging, run the smoke test, then review before production.",
  },
  {
    kind: "code",
    name: "deploy.yaml",
    language: "YAML",
    updated: "Just now",
    content:
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: northwind-ingest\nspec:\n  replicas: 2\n  template:\n    spec:\n      containers:\n        - name: ingest\n          image: northwind/ingest:staging\n          env:\n            - name: QUEUE\n              value: kafka\n",
  },
  {
    kind: "document",
    name: "weekly-update.md",
    updated: "Just now",
    content:
      "# Weekly update\n\nIngest is ready for staging. The dashboard empty states are in review, and the API migration is moving forward.\n\nNext: confirm the queue, deploy and run the smoke test.",
  },
];
const dashboardDecision: ThreadDecision = {
  id: "empty-state",
  kind: "pick",
  taskId: "dashboard",
  task: "Client dashboard",
  question: "Which empty state for the dashboard?",
  options: [
    { id: "illustration", title: "Illustration", wireframe: "illustration" },
    { id: "checklist", title: "Setup checklist", recommended: true, wireframe: "checklist" },
    { id: "data", title: "Sample data", wireframe: "data" },
  ],
};
const sampleTime = (hour: number, minute: number) => Date.UTC(2026, 10, 8, hour, minute);

function threadScreenMessages(preset: ThreadPreset): AgentMessage[] {
  const base: AgentMessage[] = [
    {
      id: "morning",
      role: "user",
      at: sampleTime(9, 12),
      text: "Morning. Northwind first this week – the ingest pipeline, the client dashboard and the weekly update. Keep the API migration moving on the side.",
    },
    {
      id: "plan",
      role: "agent",
      at: sampleTime(9, 12),
      parts: [
        {
          kind: "tools",
          id: "brief-tools",
          tools: [
            { id: "brief", label: "Read the Northwind brief", status: "done", duration: 800 },
            { id: "tasks", label: "Looked through the open tasks", status: "done", duration: 1400 },
            { id: "history", label: "Read last week's thread", status: "done", duration: 2100 },
          ],
        },
        {
          kind: "text",
          text: "On it. I split it into four tasks and started them side by side – you'll only hear from me when something needs a decision.",
        },
        { kind: "task", task: threadTaskCatalog.dashboard },
        { kind: "task", task: threadTaskCatalog.api },
      ],
    },
    { id: "load-question", role: "user", at: sampleTime(11, 52), text: "How did the ingest load test go?" },
    {
      id: "load-answer",
      role: "agent",
      at: sampleTime(11, 52),
      parts: [
        {
          kind: "tools",
          id: "load-tools",
          tools: [
            { id: "read-load", label: "Read load-test-results.csv", status: "done", duration: 600 },
            { id: "compare-load", label: "Compared it with last week's run", status: "done", duration: 1100 },
          ],
        },
        {
          kind: "text",
          text: "It passed at 20k events a minute: p95 stayed under 100 ms and errors at 0.02%. Past 30k it starts to fall behind – well above Northwind's bursts.",
        },
        { kind: "artifacts", names: ["load-test-results.csv", "ingest-design.md"] },
      ],
    },
  ];
  if (preset === "live") return base;
  if (preset === "away" || preset === "scrolled")
    return [
      ...base,
      {
        id: "away-completed",
        role: "agent",
        at: sampleTime(12, 22),
        parts: [
          {
            kind: "text",
            text: "While you were out: the auth refactor is merged and on staging, the usage page shipped to Northwind, and the Evalkit docs are published.",
          },
          ...["auth", "usage", "docs"].map((id) => ({ kind: "task" as const, task: threadTaskCatalog[id] })),
        ],
      },
      {
        id: "away-questions",
        role: "agent",
        at: sampleTime(12, 24),
        parts: [
          { kind: "text", text: "Two things need you before I can go on." },
          {
            kind: "decision",
            ask: { id: "empty-state", question: dashboardDecision.question, task: "Client dashboard" },
          },
          {
            kind: "decision",
            ask: { id: "weekly", question: defaultThreadDecisions[1].question, task: "Weekly update" },
          },
        ],
      },
    ];
  const stage: AgentMessage = {
    id: "staging",
    role: "agent",
    at: sampleTime(13, 1),
    parts: [
      {
        kind: "tools",
        id: "stage-tools",
        tools: [
          { id: "design", label: "Read ingest-design.md", status: "done", duration: 1200 },
          { id: "cluster", label: "Checked the staging cluster", status: "done", duration: 2600 },
          { id: "queue-tools", label: "Compared Kafka, SQS and a Postgres queue", status: "done", duration: 4200 },
        ],
      },
      {
        kind: "text",
        text: "Staging is ready and the load test holds. One thing I can't decide for you: which queue the service runs on. Kafka keeps a day of events to replay after a bad deploy; SQS is less to run but can't replay. I'd pick Kafka.",
      },
      { kind: "task", task: threadTaskCatalog.ingest },
      { kind: "decision", ask: { id: "queue", question: defaultThreadDecisions[0].question, task: "Ingest pipeline" } },
      {
        kind: "text",
        text: "Once you've picked, I'll deploy to staging and run the smoke test. The deploy plan is ready:",
      },
      { kind: "artifacts", names: ["deploy.yaml", "ingest-design.md"] },
    ],
  };
  const question: AgentMessage = {
    id: "stage-question",
    role: "user",
    at: sampleTime(13, 0),
    text: "Good. Get ingest onto staging today – and tell me what you need from me.",
  };
  if (preset === "offline")
    return [
      ...base,
      question,
      {
        ...stage,
        streaming: true,
        parts: stage
          .parts!.slice(0, 2)
          .map((part) =>
            part.kind === "text"
              ? {
                  ...part,
                  text: "Staging is ready and the load test holds. One thing I can't decide for you: which queue the service runs on.",
                }
              : part,
          ),
      },
      {
        id: "offline-message",
        role: "user",
        at: sampleTime(13, 2),
        text: "Use Kafka if replay holds up – I'll confirm after lunch.",
        status: "queued",
      },
    ];
  if (preset === "error")
    return [
      ...base,
      question,
      {
        ...stage,
        parts: [
          {
            kind: "tools",
            id: "failed-tools",
            tools: [
              { id: "read", label: "Read ingest-design.md", status: "done", duration: 1200 },
              {
                id: "cluster",
                label: "Checked the staging cluster",
                status: "failed",
                duration: 30000,
                error: "Timed out after 30s",
              },
              { id: "compare", label: "Compared Kafka, SQS and a Postgres queue", status: "done", duration: 4200 },
            ],
          },
          {
            kind: "error",
            text: "Couldn't reach the staging cluster – the check timed out after 30 seconds.",
            retry: true,
          },
        ],
      },
      {
        id: "failed-message",
        role: "user",
        at: sampleTime(13, 3),
        text: "Also send Dana the load test numbers.",
        status: "failed",
      },
    ];
  return [...base, question, stage];
}

export type AgentThreadScreenProps = Omit<AppShellProps, "children" | "panel" | "navigation" | "title"> &
  Omit<AgentThreadProps, "className" | "mode" | "simulate" | "onSend" | "decisionRequest" | "labels"> & {
    /** labels configures the shell; threadLabels configures the embedded thread. */
    threadLabels?: AgentThreadProps["labels"];
    simulate?: ThreadPreset | false;
    onSend?: (text: string, attachments: ThreadAttachment[]) => void;
    tasks?: Record<string, ThreadTaskDetail>;
    defaultTasks?: Record<string, ThreadTaskDetail>;
    onTasksChange?: (tasks: Record<string, ThreadTaskDetail>) => void;
    onShowTask?: (id: string) => void;
    files?: ArtifactFile[];
    defaultFiles?: ArtifactFile[];
    onFilesChange?: (files: ArtifactFile[]) => void;
    openFiles?: string[];
    defaultOpenFiles?: string[];
    onOpenFilesChange?: (names: string[]) => void;
    activeFile?: string;
    defaultActiveFile?: string;
    onActiveFileChange?: (name: string) => void;
  };

/** A complete orchestrator thread, including single navigation sidebar and tabbed task/artifact workspace. */
export function AgentThreadScreen({
  managed = false,
  stopping,
  renderMessageContent,
  timeline,
  threadLabels,
  formatTime,
  messages: messagesProp,
  defaultMessages,
  onMessagesChange,
  onSend,
  onStop,
  onRetry,
  title = "Today",
  assistantName = "Orchestrator",
  running: runningProp,
  decisions: decisionsProp,
  defaultDecisions,
  onDecisionsChange,
  onDecide,
  onLater,
  folded,
  defaultFolded,
  onFoldedChange,
  connection,
  defaultConnection,
  onConnectionChange,
  onReconnect,
  lastSeen,
  defaultLastSeen,
  onLastSeenChange,
  awayAfter,
  onMarkRead,
  uploads,
  defaultUploads,
  onUploadsChange,
  upload,
  transcribe,
  composerProps,
  composer,
  simulate: simulateProp,
  onOpenTask,
  onOpenInbox,
  onOpenFile,
  onShowTask,
  tasks: tasksProp,
  defaultTasks,
  onTasksChange,
  files: filesProp,
  defaultFiles,
  onFilesChange,
  openFiles: openProp,
  defaultOpenFiles = [],
  onOpenFilesChange,
  activeFile: activeProp,
  defaultActiveFile = "",
  onActiveFileChange,
  panelOpen: panelProp,
  defaultPanelOpen = false,
  onPanelOpenChange,
  onNavigate,
  className,
  ...shellProps
}: AgentThreadScreenProps) {
  const running = runningProp ?? (managed ? { running: 0, needs: 0 } : { running: 9, needs: 5 });
  const validPresets: ThreadPreset[] = [
    "live",
    "decision",
    "scrolled",
    "offline",
    "uploading",
    "dictating",
    "away",
    "error",
  ];
  const preset = typeof simulateProp === "string" && validPresets.includes(simulateProp) ? simulateProp : "live";
  const demo =
    managed || simulateProp === false
      ? false
      : (simulateProp ?? (messagesProp === undefined && onSend === undefined ? "live" : false));
  const [messages, setMessages] = useControllable(
    managed ? (messagesProp ?? []) : messagesProp,
    defaultMessages ?? threadScreenMessages(preset),
    onMessagesChange,
  );
  const initialDecisions = managed
    ? []
    : (defaultDecisions ??
      (preset === "decision"
        ? defaultThreadDecisions
        : preset === "away" || preset === "scrolled"
          ? [dashboardDecision, defaultThreadDecisions[1]]
          : preset === "uploading" || preset === "dictating"
            ? [defaultThreadDecisions[0]]
            : []));
  const [decisions, setDecisions] = useControllable(
    managed ? (decisionsProp ?? []) : decisionsProp,
    initialDecisions,
    onDecisionsChange,
  );
  const [tasks, setTasks] = useControllable(
    tasksProp,
    managed ? {} : (defaultTasks ?? defaultThreadTaskDetails),
    onTasksChange,
  );
  const [files, setFiles] = useControllable(
    filesProp,
    managed ? [] : (defaultFiles ?? threadScreenArtifacts),
    onFilesChange,
  );
  const [opened, setOpened] = useControllable(openProp, defaultOpenFiles, onOpenFilesChange);
  const [activeFile, setActiveFile] = useControllable(activeProp, defaultActiveFile, onActiveFileChange);
  const [panelOpen, setPanelOpen] = useControllable(panelProp, defaultPanelOpen, onPanelOpenChange);
  const [taskId, setTaskId] = useState("");
  const taskArea = useRef<HTMLDivElement>(null);
  const [answeredCount, setAnsweredCount] = useState(0),
    [focusRequest, setFocusRequest] = useState<{ id: string; sequence: number } | undefined>();
  const needsBaseline = useRef({ needs: running.needs, answered: 0 });
  if (needsBaseline.current.needs !== running.needs)
    needsBaseline.current = { needs: running.needs, answered: answeredCount };
  const currentTask =
    messages
      .flatMap(
        (message) =>
          message.parts
            ?.filter((part): part is Extract<AgentMessagePart, { kind: "task" }> => part.kind === "task")
            .map((part) => part.task) ?? [],
      )
      .filter((task) => task.id === taskId)
      .at(-1) ?? (managed ? undefined : threadTaskCatalog[taskId]);
  const openFile = (name: string) => {
    if (!files.some((file) => file.name === name)) {
      onOpenFile?.(name);
      return;
    }
    if (!opened.includes(name)) setOpened([...opened, name]);
    setActiveFile(name);
    setPanelOpen(true);
    onOpenFile?.(name);
  };
  const openTask = (id: string) => {
    setTaskId(id);
    if (!opened.includes("task")) setOpened([...opened, "task"]);
    setActiveFile("task");
    setPanelOpen(true);
    onOpenTask?.(id);
  };
  const focusDecision = (id: string) => {
    if (taskArea.current?.closest("[data-overlay-boundary]")?.querySelector("main[inert]")) setPanelOpen(false);
    setFocusRequest((previous) => ({ id, sequence: (previous?.sequence ?? 0) + 1 }));
  };
  const decide = (id: string, answer: ThreadDecisionAnswer) => {
    if (managed) {
      onDecide?.(id, answer);
      return;
    }
    const decision = decisions.find((decision) => decision.id === id);
    setAnsweredCount((count) => count + 1);
    if (decision?.taskId) {
      const previous = tasks[decision.taskId] ?? {};
      const label =
        answer === "approve"
          ? "Approved"
          : answer === "decline"
            ? "Declined"
            : (answer.text ?? decision.options?.find((option) => option.id === answer.option)?.title ?? "Answered");
      setTasks({
        ...tasks,
        [decision.taskId]: {
          ...previous,
          decided: [{ question: decision.question, answer: label, at: Date.now() }, ...(previous.decided ?? [])],
        },
      });
    }
    onDecide?.(id, answer);
  };
  const initialUploads: ThreadUpload[] = managed
    ? []
    : (defaultUploads ??
      (preset === "offline"
        ? [
            {
              id: "saved-voice",
              name: "Voice note",
              kind: "voice",
              seconds: 12,
              size: 192000,
              progress: 1,
              state: "waiting",
            },
          ]
        : preset === "uploading"
          ? [
              { id: "video", name: "standup-nov-7.mov", size: 48000000, progress: 0.2, state: "uploading" },
              { id: "metrics", name: "q4-metrics.csv", size: 94000, progress: 0, state: "failed" },
            ]
          : []));
  const navigation: AppRailItem[] = [
    { label: "Thread", icon: <Icon name="chat" /> },
    {
      label: "Inbox",
      icon: <Icon name="inbox" />,
      count: Math.max(
        0,
        safeNumber(running.needs, decisions.length) - (answeredCount - needsBaseline.current.answered),
      ),
    },
    { label: "Tasks", icon: <Icon name="tasks" /> },
    { label: "Memory", icon: <Icon name="memory" /> },
    { label: "Settings", icon: <Icon name="settings" />, section: "Workspace" },
  ];
  return (
    <AppShell
      {...shellProps}
      defaultActive={shellProps.defaultActive ?? "Thread"}
      className={["ui-tsr", className].filter(Boolean).join(" ")}
      navigation={navigation}
      onNavigate={onNavigate}
      panelOpen={panelOpen}
      onPanelOpenChange={setPanelOpen}
      panelTitle="Artifacts"
      panel={
        <ArtifactWorkspace
          files={files}
          onFilesChange={setFiles}
          openFiles={opened}
          onOpenFilesChange={setOpened}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
          onClose={() => setPanelOpen(false)}
          tabs={
            currentTask
              ? [
                  {
                    id: "task",
                    label: currentTask.title,
                    icon: <Icon name="tasks" size={14} />,
                    content: (
                      <div ref={taskArea} className="ui-tsr__task-area">
                        <TaskDetails
                          task={currentTask}
                          detail={tasks[taskId]}
                          decision={decisions.find((decision) => decision.taskId === taskId)}
                          onDecide={focusDecision}
                          onOpenFile={openFile}
                          onShow={(id) => (onShowTask ? onShowTask(id) : onNavigate?.("Tasks"))}
                        />
                      </div>
                    ),
                  },
                ]
              : []
          }
        />
      }
    >
      <style href="ui-agent-thread-screen" precedence="default">
        {css}
      </style>
      <AgentThread
        managed={managed}
        stopping={stopping}
        renderMessageContent={renderMessageContent}
        timeline={timeline}
        labels={threadLabels}
        formatTime={formatTime}
        decisionRequest={focusRequest}
        mode="orchestrator"
        title={title}
        assistantName={assistantName}
        messages={messages}
        onMessagesChange={setMessages}
        running={running}
        decisions={decisions}
        onDecisionsChange={setDecisions}
        onDecide={decide}
        onLater={onLater}
        folded={folded}
        defaultFolded={defaultFolded ?? (!managed && ["scrolled", "uploading", "dictating"].includes(preset))}
        onFoldedChange={onFoldedChange}
        connection={connection}
        defaultConnection={defaultConnection ?? (!managed && preset === "offline" ? "offline" : undefined)}
        onConnectionChange={onConnectionChange}
        onReconnect={onReconnect}
        lastSeen={lastSeen}
        defaultLastSeen={defaultLastSeen ?? (!managed && preset === "away" ? sampleTime(12, 4) : undefined)}
        onLastSeenChange={onLastSeenChange}
        awayAfter={awayAfter}
        onMarkRead={onMarkRead}
        uploads={uploads}
        defaultUploads={initialUploads}
        onUploadsChange={onUploadsChange}
        upload={upload}
        transcribe={transcribe}
        onOpenTask={openTask}
        onOpenFile={openFile}
        onOpenInbox={onOpenInbox}
        onNavigate={onNavigate}
        onStop={onStop}
        onRetry={onRetry}
        simulate={demo}
        composer={composer}
        composerProps={{ placeholder: composerProps?.labels?.placeholder ?? "Ask for anything…", ...composerProps }}
        onSend={(text, options) =>
          onSend?.(
            text,
            options.attachments.map((file) => ({ ...file, kind: "file" })),
          )
        }
      />
    </AppShell>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-cm {
  --ui-cm-card: #fff;
  --ui-cm-ink: rgba(0, 0, 0, 0.88);
  --ui-cm-text: rgba(0, 0, 0, 0.61);
  --ui-cm-muted: rgba(0, 0, 0, 0.45);
  --ui-cm-line: rgba(0, 0, 0, 0.06);
  --ui-cm-fill: rgba(0, 0, 0, 0.04);
  --ui-cm-focus: rgba(0, 96, 226, 0.35);
  --ui-cm-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 24px 80px -20px rgba(0, 0, 0, 0.24);
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  align-items: start;
  justify-items: center;
  padding: clamp(24px, 12vh, 120px) 16px 24px;
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-cm-ink);
  -webkit-font-smoothing: antialiased;
  container-type: inline-size;
}
.ui-cm,
.ui-cm *,
.ui-cm *::before,
.ui-cm *::after {
  box-sizing: border-box;
}
.ui-cm button,
.ui-cm input {
  font: inherit;
  color: inherit;
}
.ui-cm button {
  border: 0;
  cursor: pointer;
  background: none;
}
.ui-cm button:focus-visible {
  outline: 2px solid var(--ui-cm-focus);
  outline-offset: -2px;
}
.ui-cm button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cm__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2) !important;
  animation: ui-cm-fade 180ms both;
}
.ui-cm__panel {
  width: min(560px, 100%);
  max-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  background: var(--ui-cm-card);
  box-shadow: var(--ui-cm-shadow);
  overflow: hidden;
  animation: ui-cm-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-cm__search {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 16px;
  border-bottom: 0.5px solid var(--ui-cm-line);
  color: var(--ui-cm-muted);
}
.ui-cm__search input {
  flex: 1;
  width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--ui-cm-ink);
  font-size: 15px;
}
.ui-cm__search input::placeholder {
  color: var(--ui-cm-muted);
}
.ui-cm kbd {
  font: 11px/1.5 inherit;
  font-family: inherit;
  color: var(--ui-cm-muted);
  padding: 1px 4px;
  border: 0.5px solid var(--ui-cm-line);
  border-radius: 4px;
  white-space: nowrap;
}
.ui-cm__list {
  overflow: auto;
  overscroll-behavior: contain;
  max-height: min(540px, 65vh);
  padding: 6px;
}
.ui-cm__group + .ui-cm__group {
  margin-top: 8px;
}
.ui-cm__label {
  padding: 9px 10px 5px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ui-cm-muted);
}
.ui-cm__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  text-align: left;
  padding: 8px 10px;
  border-radius: 7px;
  transition: background-color 120ms;
}
.ui-cm__item[aria-selected="true"] {
  background: var(--ui-cm-fill);
}
.ui-cm__item:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-cm__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 7px;
  color: var(--ui-cm-muted);
  box-shadow: 0 0 0 0.5px var(--ui-cm-line);
}
.ui-cm__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-cm__text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-cm__text small {
  font-size: 11px;
  color: var(--ui-cm-muted);
}
.ui-cm__foot {
  display: flex;
  gap: 18px;
  padding: 11px 16px;
  border-top: 0.5px solid var(--ui-cm-line);
  font-size: 11px;
  color: var(--ui-cm-muted);
}
.ui-cm__foot span:last-child {
  margin-left: auto;
}
.ui-cm__empty {
  padding: 32px 16px;
  color: var(--ui-cm-muted);
  text-align: center;
  overflow-wrap: anywhere;
}
.ui-cm[data-inline] {
  position: relative;
  inset: auto;
  padding: 0;
  display: block;
}
.ui-cm[data-inline] .ui-cm__panel {
  width: 100%;
}
@keyframes ui-cm-fade {
  from {
    opacity: 0;
  }
}
@keyframes ui-cm-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}
@container (max-width:400px) {
  .ui-cm__foot {
    gap: 10px;
  }
  .ui-cm__foot span:last-child {
    display: none;
  }
  .ui-cm__search {
    padding-inline: 12px;
  }
  .ui-cm__panel {
    border-radius: 10px;
  }
}
@media (pointer: coarse) {
  .ui-cm__item {
    min-height: 52px;
  }
  .ui-cm__search {
    min-height: 60px;
  }
  .ui-cm__search button {
    min-width: 36px;
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cm,
  .ui-cm * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cm {
  --ui-cm-card: #1c1c1e;
  --ui-cm-ink: rgba(255, 255, 255, 0.9);
  --ui-cm-text: rgba(255, 255, 255, 0.62);
  --ui-cm-muted: rgba(255, 255, 255, 0.46);
  --ui-cm-line: rgba(255, 255, 255, 0.08);
  --ui-cm-fill: rgba(255, 255, 255, 0.08);
  --ui-cm-focus: rgba(77, 141, 255, 0.5);
  --ui-cm-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 24px 80px -20px rgba(0, 0, 0, 0.6);
}

.ui-as__side-col[data-history] > .ui-as__navigation {
  flex: none;
}
.ui-as__side-col[data-history] > .ui-as__chat-nav {
  padding-top: 0;
  padding-bottom: 16px;
}
@container ui-as (min-width:900px) {
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__chat-nav {
    visibility: hidden;
  }
}
.ui-as__app[data-header] {
  grid-template-rows: auto minmax(0, 1fr);
}
.ui-as__header {
  grid-column: 3/-1;
  grid-row: 1;
  min-width: 0;
}
.ui-as__app[data-header] > .ui-as__side,
.ui-as__app[data-header] > .ui-as__side + .ui-as__resizer {
  grid-row: 1/-1;
}
.ui-as__app[data-header] > .ui-as__main,
.ui-as__app[data-header] > .ui-as__panel,
.ui-as__app[data-header] > .ui-as__panel-resizer {
  grid-row: 2;
}
@container ui-as (max-width:899.99px) {
  .ui-as__header {
    grid-column: 1/-1;
  }
}
.ui-as:has(.ui-as__side-col[data-navigation]) .ui-as__main {
  border-radius: 12px;
  border-left: 0.5px solid var(--ui-as-line);
}
.ui-as__side-col[data-navigation] {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  margin: 0;
  padding: 10px 8px 8px 10px;
  line-height: 1.4286;
  overflow: hidden;
}
.ui-as__navigation {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}
.ui-as__nav-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  height: 28px;
  min-height: 28px;
  margin-bottom: 12px;
}
.ui-as__nav-workspace {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  height: 30px;
  padding: 0 6px;
  border-radius: 8px;
  text-align: left;
}
.ui-as__nav-workspace:hover,
.ui-as__account-row:hover {
  background: rgba(0, 0, 0, 0.03);
}
.ui-as__nav-workspace > span {
  display: grid;
  place-items: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-right: 1px;
  background: var(--ui-as-card);
  border-radius: 5px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 1px 1px rgba(0, 0, 0, 0.12);
  font-size: 10.5px;
  font-weight: 500;
  transition: opacity 140ms ease;
}
.ui-as__nav-workspace > strong {
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-as__nav-workspace > svg {
  color: var(--ui-as-muted);
}
.ui-as__nav-search {
  display: flex;
  align-items: center;
  flex: none;
  gap: 8px;
  width: 100%;
  height: 30px;
  border-radius: 8px !important;
  padding: 0 6px 0 8px !important;
  background: var(--ui-as-card) !important;
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  color: var(--ui-as-muted) !important;
  margin-bottom: 12px;
  text-align: left;
  font-size: 13px !important;
}
.ui-as__nav-search > span {
  flex: 1;
}
.ui-as__nav-search kbd {
  font: 10px/1.4 inherit;
  font-family: inherit;
  border: 0.5px solid var(--ui-as-line);
  padding: 1px 3px;
  border-radius: 3px;
  color: var(--ui-as-faint);
}
.ui-as__nav-items {
  overflow: auto;
  min-height: 0;
}
.ui-as__nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  border-radius: 7px;
  text-align: left;
  padding: 0 8px !important;
  color: var(--ui-as-text) !important;
}
.ui-as__nav-item:hover,
.ui-as__nav-item[aria-current="page"] {
  background: var(--ui-as-fill) !important;
  color: var(--ui-as-ink) !important;
}
.ui-as__nav-icon {
  display: flex;
  color: var(--ui-as-muted);
}
.ui-as__nav-item > small {
  font-size: 11px;
  color: var(--ui-as-faint);
  font-variant-numeric: tabular-nums;
  margin-left: auto;
}
.ui-as__nav-section {
  font-size: 12px;
  color: var(--ui-as-faint);
  padding: 18px 8px 4px;
}
.ui-as__side-col[data-navigation] .ui-as__account-row {
  flex: none;
  height: 34px;
  min-height: 34px;
  padding: 0 6px;
  gap: 7px;
  border-radius: 8px;
  font-size: 13px !important;
  font-weight: 500;
  margin-top: auto;
}
.ui-as__side-col[data-navigation] .ui-as__user-initials {
  width: 21px;
  height: 21px;
  font-size: 9px;
  color: var(--ui-as-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-as__side-col[data-navigation] .ui-as__account-row > svg {
  color: var(--ui-as-faint);
}
.ui-as .ui-as__nav-workspace:active:not(:disabled),
.ui-as .ui-as__account-row:active:not(:disabled),
.ui-as .ui-as__wsm-item:active:not(:disabled) {
  transform: none;
}
.ui-as[data-sidebar-collapsed] .ui-as__app {
  grid-template-columns: 0 0 minmax(0, 1fr) 0 0;
  padding-left: 8px;
}
.ui-as[data-sidebar-collapsed][data-panel-open] .ui-as__app {
  grid-template-columns: 0 0 minmax(0, 1fr) 4px var(--ui-as-panel-width);
}
.ui-as[data-sidebar-collapsed] .ui-as__side {
  visibility: hidden;
  pointer-events: none;
}
.ui-as[data-sidebar-collapsed] .ui-as__main {
  border-radius: 12px;
}
.ui-as[data-sidebar-collapsed] .ui-as__open-side {
  display: grid;
}
.ui-as[data-sidebar-collapsed] .ui-as__side + .ui-as__resizer {
  visibility: hidden;
}
@container ui-as (min-width:900px) {
  .ui-as[data-navigation] .ui-as__app {
    transition-duration: 420ms;
  }
  .ui-as[data-navigation] .ui-as__side {
    overflow: hidden;
  }
  .ui-as[data-navigation] .ui-as__side-col {
    flex: none;
    width: var(--ui-as-sidebar-width);
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__app {
    grid-template-columns: 48px 0 minmax(0, 1fr) 0 0;
    padding-left: 0;
  }
  .ui-as[data-navigation][data-sidebar-collapsed][data-panel-open] .ui-as__app {
    grid-template-columns: 48px 0 minmax(0, 1fr) 4px var(--ui-as-panel-width);
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__side {
    visibility: visible;
    pointer-events: auto;
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__open-side {
    display: none;
  }
  .ui-as[data-navigation][data-sidebar-collapsed]
    :is(
      .ui-as__nav-workspace > strong,
      .ui-as__nav-workspace > svg,
      .ui-as__nav-search > span,
      .ui-as__nav-search > kbd,
      .ui-as__nav-item > span:not(.ui-as__nav-icon),
      .ui-as__nav-item > small,
      .ui-as__account-row > span:nth-child(2),
      .ui-as__account-row > svg
    ) {
    display: none;
  }
  .ui-as[data-navigation][data-sidebar-collapsed]
    :is(.ui-as__nav-workspace, .ui-as__nav-search, .ui-as__nav-item, .ui-as__account-row) {
    width: fit-content;
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__nav-search {
    padding-right: 8px !important;
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__nav-section {
    color: transparent;
    white-space: nowrap;
    overflow: hidden;
    background: linear-gradient(var(--ui-as-line), var(--ui-as-line)) 0 50% / 28px 0.5px no-repeat;
  }
  .ui-as[data-navigation][data-sidebar-collapsed] .ui-as__nav-head > .ui-as__icon-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    opacity: 0;
    transition: opacity 140ms ease;
  }
  .ui-as[data-navigation][data-sidebar-collapsed]:has(.ui-as__side:hover, .ui-as__nav-head :focus-visible)
    .ui-as__nav-head
    > .ui-as__icon-btn {
    opacity: 1;
  }
  .ui-as[data-navigation][data-sidebar-collapsed]:has(.ui-as__side:hover, .ui-as__nav-head :focus-visible)
    .ui-as__nav-workspace
    > span {
    opacity: 0;
  }
}
@container ui-as (max-width:899.99px) {
  .ui-as[data-sidebar-collapsed] .ui-as__app,
  .ui-as[data-sidebar-collapsed][data-panel-open] .ui-as__app {
    grid-template-columns: minmax(0, 1fr);
  }
  .ui-as[data-sidebar-open] .ui-as__side {
    visibility: visible;
    pointer-events: auto;
  }
  .ui-as .ui-as__side-col[data-navigation] {
    padding: 8px;
  }
}
@media (pointer: coarse) {
  .ui-as__nav-item,
  .ui-as__nav-search {
    min-height: 36px;
  }
}
.ui-as {
  --ui-as-page: #f8f8f8;
  --ui-as-card: #fff;
  --ui-as-side: #fcfcfc;
  --ui-as-ink: rgba(0, 0, 0, 0.88);
  --ui-as-text: rgba(0, 0, 0, 0.61);
  --ui-as-muted: rgba(0, 0, 0, 0.45);
  --ui-as-faint: rgba(0, 0, 0, 0.27);
  --ui-as-line: rgba(0, 0, 0, 0.06);
  --ui-as-fill: rgba(0, 0, 0, 0.04);
  --ui-as-accent: #0060e2;
  --ui-as-focus: rgba(0, 96, 226, 0.35);
  --ui-as-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-as-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  container: ui-as / inline-size;
  overflow: hidden;
  background: var(--ui-as-page);
  color: var(--ui-as-ink);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ui-as,
.ui-as *,
.ui-as *::before,
.ui-as *::after {
  box-sizing: border-box;
}
.ui-as button,
.ui-as input {
  font: inherit;
  color: inherit;
}
.ui-as button {
  cursor: pointer;
  border: 0;
  background: none;
}
.ui-as button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-as button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-as button:focus-visible,
.ui-as input:focus-visible,
.ui-as [role="separator"]:focus-visible {
  outline: 2px solid var(--ui-as-focus);
  outline-offset: -2px;
}
.ui-as__app {
  display: grid;
  grid-template-columns: calc(var(--ui-as-sidebar-width) + var(--ui-as-rail-width)) 0 minmax(0, 1fr) 0 0;
  height: 100%;
  padding: 8px 8px 8px 0;
  transition: grid-template-columns 400ms var(--ui-as-ease);
}
.ui-as[data-panel-open] .ui-as__app {
  grid-template-columns: calc(var(--ui-as-sidebar-width) + var(--ui-as-rail-width)) 0 minmax(0, 1fr) 4px var(
      --ui-as-panel-width
    );
}
.ui-as[data-dragging] .ui-as__app {
  transition: none;
}
.ui-as__side {
  display: flex;
  min-width: 0;
  min-height: 0;
  margin-block: -8px;
  position: relative;
}
.ui-as__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 52px;
  flex: none;
  padding: 12px 0 16px;
}
.ui-as__logo {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
  background: var(--ui-as-card) !important;
  border-radius: 10px;
  box-shadow:
    0 0 0 0.5px var(--ui-as-line),
    0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 12px !important;
  font-weight: 500 !important;
}
.ui-as__rail-line {
  height: 0.5px;
  width: 20px;
  background: var(--ui-as-line);
  margin: 0 0 6px;
}
.ui-as__rail-item {
  display: grid;
  place-items: center;
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  margin-bottom: 0;
  border-radius: 10px;
  color: var(--ui-as-muted) !important;
}
.ui-as__rail-item:hover,
.ui-as__rail-item[aria-current="page"] {
  background: var(--ui-as-fill);
  color: var(--ui-as-ink) !important;
}
.ui-as__rail-space {
  flex: 1;
}
.ui-as__notification-dot {
  position: absolute;
  right: 6px;
  top: 7px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ui-as-accent);
  box-shadow: 0 0 0 2px var(--ui-as-page);
}
.ui-as__user {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin-top: 6px;
  border-radius: 50%;
  font-size: 9px !important;
  font-weight: 500 !important;
  color: var(--ui-as-accent) !important;
  background: rgba(0, 96, 226, 0.08) !important;
  overflow: hidden;
}
.ui-as__user img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ui-as__side-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-block: 8px;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  background: var(--ui-as-side);
  padding: 8px 10px;
  overflow: hidden;
}
.ui-as__side-head {
  display: flex;
  align-items: center;
  min-height: 32px;
  gap: 4px;
  padding-left: 6px;
}
.ui-as__project {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  flex: 1;
  height: 30px;
  text-align: left;
  font-weight: 500 !important;
  padding: 0;
}
.ui-as__project > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-as__project > svg {
  color: var(--ui-as-muted);
}
.ui-as__icon-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  color: var(--ui-as-muted) !important;
  border-radius: 6px;
}
.ui-as__icon-btn:hover {
  background: var(--ui-as-fill);
}
.ui-as__chat-nav {
  overflow: auto;
  min-height: 0;
  flex: 1;
  margin-inline: -1px;
  padding-top: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-as-line) transparent;
}
.ui-as__new-chat {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  padding: 0 7px;
  text-align: left;
  color: var(--ui-as-text) !important;
  border-radius: 7px;
}
.ui-as__new-chat:hover {
  background: var(--ui-as-fill);
}
.ui-as__new-chat svg {
  color: var(--ui-as-muted);
}
.ui-as__group {
  margin-top: 12px;
}
.ui-as__group h2 {
  font-size: 12px;
  font-weight: 400;
  color: var(--ui-as-faint);
  padding: 0 7px;
  margin: 0 0 4px;
  line-height: 20px;
}
.ui-as__chat-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 30px;
  border-radius: 7px;
  color: var(--ui-as-text);
}
.ui-as__chat-row[data-active],
.ui-as__chat-row:hover {
  background: var(--ui-as-fill);
}
.ui-as__chat-row[data-active] {
  color: var(--ui-as-ink);
}
.ui-as__chat-link {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
  height: 30px;
  padding: 0 7px;
  text-align: left;
}
.ui-as__chat-link > span {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-as__chat-row[data-nested] .ui-as__chat-link {
  padding-left: 29px;
}
.ui-as__chat-tools {
  display: flex;
  align-items: center;
  gap: 1px;
  position: absolute;
  right: 3px;
  opacity: 0;
  visibility: hidden;
  background: var(--ui-as-side);
  border-radius: 5px;
  transition: opacity 120ms;
}
.ui-as__chat-tools button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: var(--ui-as-muted);
}
.ui-as__chat-tools button:hover {
  background: var(--ui-as-fill);
  color: var(--ui-as-ink);
}
.ui-as__chat-row:hover .ui-as__chat-tools,
.ui-as__chat-row:focus-within .ui-as__chat-tools {
  opacity: 1;
  visibility: visible;
}
.ui-as__chat-row:hover .ui-as__chat-link,
.ui-as__chat-row:focus-within .ui-as__chat-link {
  padding-right: 54px;
}
.ui-as__unread {
  display: block;
  flex: none;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ui-as-accent);
}
.ui-as__folder {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
  min-height: 30px;
  padding: 0 7px;
  text-align: left;
  color: var(--ui-as-text) !important;
  border-radius: 7px;
}
.ui-as__folder:hover {
  background: var(--ui-as-fill);
}
.ui-as__folder > span:first-of-type {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-as__folder > svg {
  color: var(--ui-as-muted);
}
.ui-as__folder-chevron {
  display: flex;
  opacity: 0;
  transition: transform 300ms var(--ui-as-ease);
}
.ui-as__folder:hover .ui-as__folder-chevron,
.ui-as__folder:focus-visible .ui-as__folder-chevron {
  opacity: 1;
}
.ui-as__folder[aria-expanded="true"] .ui-as__folder-chevron {
  transform: rotate(180deg);
}
.ui-as__folder-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-as-ease);
}
.ui-as__folder-wrap[data-open="true"] {
  grid-template-rows: 1fr;
}
.ui-as__folder-wrap > div {
  overflow: hidden;
  min-height: 0;
}
.ui-as__main {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-radius: 0 12px 12px 0;
  background: var(--ui-as-card);
  border-block: 0.5px solid var(--ui-as-line);
  border-right: 0.5px solid var(--ui-as-line);
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  z-index: 1;
}
.ui-as__resizer {
  position: relative;
  width: 6px;
  z-index: 25;
  margin-left: -3px;
  cursor: col-resize;
  touch-action: none;
  outline: none;
}
.ui-as__resizer::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 45%;
  height: 32px;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-as-faint);
  opacity: 0;
  transition: opacity 160ms;
}
.ui-as__resizer:hover::after,
.ui-as__resizer:focus-visible::after {
  opacity: 1;
}
.ui-as__panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-radius: 12px;
  border: 0.5px solid var(--ui-as-line);
  background: var(--ui-as-card);
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 200ms,
    visibility 200ms;
}
.ui-as[data-panel-open] .ui-as__panel {
  visibility: visible;
  opacity: 1;
}
.ui-as__drawer-trigger {
  display: none;
  place-items: center;
  position: absolute;
  z-index: 5;
  top: 16px;
  width: 28px;
  height: 28px;
  color: var(--ui-as-muted) !important;
  border-radius: 6px;
}
.ui-as__open-side {
  left: 16px;
}
.ui-as__open-panel {
  right: 16px;
}
.ui-as:not([data-panel-open]) .ui-as__open-panel {
  display: grid;
}
.ui-as__mobile-close {
  display: none;
}
.ui-as__scrim {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.28) !important;
  animation: ui-as-fade 220ms both;
}
.ui-as__menu {
  width: 240px;
  max-width: calc(100% - 16px);
  overflow: auto;
  overscroll-behavior: contain;
  background: var(--ui-as-card);
  padding: 5px;
  border-radius: 12px;
  box-shadow: var(--ui-as-shadow);
  animation: ui-as-pop 230ms var(--ui-as-ease);
}
.ui-as__menu > button {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  width: 100%;
  min-height: 32px;
  padding: 6px 9px;
  text-align: left;
  border-radius: 6px;
  font-size: 12px;
}
.ui-as__menu > button:hover {
  background: var(--ui-as-fill);
}
.ui-as__menu > button[data-divider] {
  margin-top: 5px;
  position: relative;
}
.ui-as__menu > button[data-divider]::before {
  content: "";
  position: absolute;
  top: -3px;
  left: 4px;
  right: 4px;
  border-top: 0.5px solid var(--ui-as-line);
}
.ui-as__menu > button > span {
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--ui-as-muted);
}
.ui-as__menu kbd {
  font-size: 10px;
  font-family: inherit;
  color: var(--ui-as-faint);
}
.ui-as__menu-label {
  font-size: 11px;
  color: var(--ui-as-muted);
  padding: 7px 9px 4px;
}
.ui-as__menu-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 9px 12px;
  border-bottom: 0.5px solid var(--ui-as-line);
  margin-bottom: 4px;
}
.ui-as__menu-user > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-as__menu-user strong {
  font-weight: 500;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-as__menu-user small {
  font-size: 11px;
  color: var(--ui-as-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-as__user-initials {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: none;
  background: var(--ui-as-fill);
  color: var(--ui-as-text);
  font-size: 11px;
}
.ui-as__project-form {
  display: flex;
  gap: 4px;
  padding: 6px;
}
.ui-as__project-form input,
.ui-as__rename {
  background: var(--ui-as-card);
  border: 1px solid var(--ui-as-focus);
  border-radius: 5px;
  padding: 4px 6px;
  min-width: 0;
  width: 100%;
  font-size: 12px !important;
}
.ui-as__rename {
  margin-inline: 5px;
  z-index: 1;
}
.ui-as__account-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 5px;
  min-width: 0;
  font-size: 12px !important;
}
.ui-as__account-row > span:nth-child(2) {
  flex: 1;
  text-align: left;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-as__empty {
  font-size: 12px;
  color: var(--ui-as-muted);
  padding: 10px 7px;
}
.ui-as__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-as[data-layout="flat"] .ui-as__app {
  padding: 0;
  grid-template-columns: calc(var(--ui-as-sidebar-width) + var(--ui-as-rail-width)) 0 minmax(0, 1fr) 0 0;
}
.ui-as[data-layout="flat"][data-panel-open] .ui-as__app {
  grid-template-columns: calc(var(--ui-as-sidebar-width) + var(--ui-as-rail-width)) 0 minmax(0, 1fr) 1px var(
      --ui-as-panel-width
    );
}
.ui-as[data-layout="flat"] .ui-as__side {
  margin: 0;
}
.ui-as[data-layout="flat"] .ui-as__side-col {
  margin: 0;
  border-radius: 0;
}
.ui-as[data-layout="flat"] .ui-as__main,
.ui-as[data-layout="flat"] .ui-as__panel {
  border-radius: 0;
}
@keyframes ui-as-pop {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}
@keyframes ui-as-fade {
  from {
    opacity: 0;
  }
}
@container ui-as (max-width:899.99px) {
  .ui-as .ui-as__app,
  .ui-as[data-panel-open] .ui-as__app,
  .ui-as[data-layout="flat"] .ui-as__app {
    grid-template-columns: minmax(0, 1fr);
    padding: 8px;
  }
  .ui-as .ui-as__side {
    position: absolute;
    inset: 0 auto 0 0;
    width: min(320px, calc(100% - 40px));
    margin: 0;
    background: var(--ui-as-page);
    border-radius: 0 18px 18px 0;
    z-index: 40;
    transform: translateX(calc(-100% - 24px));
    transition: transform 380ms var(--ui-as-ease);
    visibility: hidden;
  }
  .ui-as[data-sidebar-open] .ui-as__side {
    transform: none;
    visibility: visible;
  }
  .ui-as .ui-as__side-col {
    margin: 0;
    padding: 8px 10px 10px 4px;
    background: none;
    border-radius: 0;
    box-shadow: none;
  }
  .ui-as .ui-as__main {
    border-radius: 12px;
  }
  .ui-as .ui-as__drawer-trigger {
    display: grid;
  }
  .ui-as .ui-as__resizer {
    display: none;
  }
  .ui-as .ui-as__mobile-close {
    display: grid;
  }
  .ui-as .ui-as__panel {
    position: absolute;
    inset: 0 0 0 auto;
    width: min(360px, calc(100% - 32px));
    z-index: 40;
    border-radius: 18px 0 0 18px;
    transform: translateX(calc(100% + 24px));
    transition:
      transform 380ms var(--ui-as-ease),
      visibility 380ms,
      opacity 200ms;
  }
  .ui-as[data-panel-open] .ui-as__panel {
    transform: none;
  }
  .ui-as .ui-as__chat-tools {
    visibility: visible;
    opacity: 0;
  }
  .ui-as .ui-as__chat-row:focus-within .ui-as__chat-tools,
  .ui-as .ui-as__chat-row:hover .ui-as__chat-tools {
    opacity: 1;
  }
}
@media (pointer: coarse) {
  .ui-as__rail-item {
    width: 36px;
    height: 36px;
  }
  .ui-as__chat-link,
  .ui-as__folder,
  .ui-as__new-chat {
    min-height: 36px;
    height: 36px;
  }
  .ui-as__menu > button {
    min-height: 40px;
  }
  .ui-as__icon-btn {
    width: 34px;
    height: 34px;
  }
  .ui-as__chat-tools {
    opacity: 1;
    visibility: visible;
  }
  .ui-as__chat-tools button {
    height: 30px;
    width: 26px;
  }
  .ui-as__chat-link {
    padding-right: 58px;
  }
  .ui-as__chat-row[data-nested] .ui-as__chat-link {
    padding-right: 58px;
  }
  .ui-as__user {
    width: 30px;
    height: 30px;
  }
  .ui-as__rename {
    font-size: 16px !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-as,
  .ui-as *,
  .ui-as *::after {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-as,
.ui-as[data-theme="dark"] {
  --ui-as-page: #111113;
  --ui-as-card: #1c1c1e;
  --ui-as-side: #18181a;
  --ui-as-ink: rgba(255, 255, 255, 0.9);
  --ui-as-text: rgba(255, 255, 255, 0.62);
  --ui-as-muted: rgba(255, 255, 255, 0.46);
  --ui-as-faint: rgba(255, 255, 255, 0.3);
  --ui-as-line: rgba(255, 255, 255, 0.08);
  --ui-as-fill: rgba(255, 255, 255, 0.06);
  --ui-as-accent: #4d8dff;
  --ui-as-focus: rgba(77, 141, 255, 0.5);
  --ui-as-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}
.ui-as__menu.ui-as__ws-menu {
  --ui-as-wsm-hover: rgba(0, 0, 0, 0.03);
  --ui-as-wsm-ring: rgba(0, 0, 0, 0.1);
  display: grid;
  align-content: start;
  gap: 1px;
  width: 240px;
  padding: 4px;
  overflow: visible;
  box-shadow:
    0 0 0 0.5px var(--ui-as-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  transform-origin: top left;
  animation: ui-as-wsm-pop 220ms var(--ui-as-ease);
}
.ui-as__menu .ui-as__wsm-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;
  width: 100%;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.4286;
  color: var(--ui-as-text);
  text-align: left;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}
.ui-as__menu .ui-as__wsm-item[data-rich] {
  min-height: 44px;
  padding: 6px 10px;
}
.ui-as__wsm-item > svg {
  flex: none;
  color: var(--ui-as-muted);
}
.ui-as__wsm-item > svg:last-child:not(:first-child) {
  margin-left: auto;
  color: var(--ui-as-ink);
}
.ui-as__wsm-sub .ui-as__wsm-item > svg:last-child:not(:first-child) {
  color: var(--ui-as-faint);
}
.ui-as__menu .ui-as__wsm-label {
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: inherit;
  text-overflow: ellipsis;
}
.ui-as__menu .ui-as__wsm-item[data-rich] .ui-as__wsm-label {
  display: grid;
  gap: 1px;
}
.ui-as__wsm-label > * {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-as__wsm-label small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-as-faint);
}
.ui-as__menu .ui-as__wsm-item:hover,
.ui-as__menu .ui-as__wsm-item:focus-visible,
.ui-as__menu .ui-as__wsm-sub:is(:hover, :focus-within, [data-open]) > .ui-as__wsm-item {
  background: var(--ui-as-wsm-hover);
  color: var(--ui-as-ink);
}
.ui-as__wsm-item[aria-checked="true"] {
  color: var(--ui-as-ink);
  font-weight: 500;
}
.ui-as__wsm-item[aria-checked="true"] small {
  font-weight: 400;
}
.ui-as__wsm-sep {
  display: block;
  height: 1px;
  margin: 4px 6px;
  background: var(--ui-as-line);
}
.ui-as__wsm-sub {
  position: relative;
  display: block;
}
.ui-as__wsm-panel {
  position: absolute;
  z-index: 1;
  top: -4px;
  left: calc(100% + 4px);
  display: grid;
  gap: 1px;
  width: 240px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow:
    0 0 0 0.5px var(--ui-as-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 120ms ease,
    visibility 0s 120ms;
}
.ui-as__wsm-panel::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -8px;
  width: 8px;
}
.ui-as__wsm-sub:is(:hover, [data-open]) > .ui-as__wsm-panel {
  opacity: 1;
  visibility: visible;
  transition: opacity 120ms ease;
}
@keyframes ui-as-wsm-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
.ui-as__menu.ui-as__account-menu {
  width: calc(var(--ui-as-sidebar-width) - 18px);
  transform-origin: bottom left;
  animation-name: ui-as-account-pop;
}
.ui-as[data-sidebar-collapsed] .ui-as__account-menu {
  width: calc(var(--ui-as-sidebar-width) - 20px);
}
.ui-as[data-rail] .ui-as__account-menu {
  width: 244px;
}
.ui-as__account-menu .ui-as__menu-user {
  padding: 8px 10px 10px;
  margin-bottom: 3px;
  border-bottom: 1px solid var(--ui-as-line);
}
.ui-as__account-menu .ui-as__menu-user strong {
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
}
.ui-as__account-menu .ui-as__menu-user small {
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}
.ui-as__account-menu .ui-as__user-initials {
  color: var(--ui-as-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-as__account-menu .ui-as__wsm-panel {
  width: 100%;
}
.ui-as__user-initials {
  overflow: hidden;
}
.ui-as__user-initials > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ui-as__wsm-flag {
  width: 16px;
  height: 11px;
  border-radius: 2px;
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
}
@keyframes ui-as-account-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
}
@container ui-as (max-width:899.99px) {
  .ui-as:not([data-rail]) .ui-as__account-menu {
    width: calc(min(320px, 100% - 40px) - 16px);
  }
}
@container ui-as (max-width:600px) {
  .ui-as__wsm-panel,
  .ui-as__account-menu .ui-as__wsm-panel {
    position: static;
    display: none;
    width: auto;
    margin: 2px 0 4px;
    padding: 0 0 0 14px;
    border-radius: 0;
    background: none;
    box-shadow: none;
    transition: none;
  }
  .ui-as__wsm-panel::before {
    display: none;
  }
  .ui-as__wsm-sub[data-open] > .ui-as__wsm-panel {
    display: grid;
  }
}
@media (pointer: coarse) {
  .ui-as__menu .ui-as__wsm-item {
    min-height: 40px;
  }
}
:where(.dark, [data-theme="dark"]) .ui-as__menu.ui-as__ws-menu {
  --ui-as-wsm-hover: rgba(255, 255, 255, 0.05);
  --ui-as-wsm-ring: rgba(255, 255, 255, 0.14);
}
:where(.dark, [data-theme="dark"]) :is(.ui-as__nav-workspace, .ui-as__account-row):hover {
  background: rgba(255, 255, 255, 0.05);
}
.ui-as__cmd {
  --ui-as-cmd-strong: #000;
  --ui-as-cmd-icon: rgba(0, 0, 0, 0.447);
  --ui-as-cmd-ring: rgba(0, 0, 0, 0.1);
  --ui-as-cmd-active: rgba(0, 0, 0, 0.06);
  --ui-as-cmd-tile: #fff;
  --ui-as-cmd-mark: rgba(0, 96, 226, 0.12);
  --ui-as-cmd-caret: rgba(0, 96, 226, 0.765);
  --ui-as-cmd-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: min(12vh, 96px) 16px 16px;
  background: rgba(0, 0, 0, 0.12);
  animation: ui-as-fade 200ms ease both;
}
.ui-as__cmd-card {
  container-type: inline-size;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow: var(--ui-as-cmd-shadow);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-as-ink);
  animation: ui-as-cmd-in 260ms var(--ui-as-ease) both;
}
@keyframes ui-as-cmd-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
}
.ui-as__cmd-search {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 12px 0 14px;
  border-bottom: 0.5px solid var(--ui-as-line);
  cursor: text;
}
.ui-as__cmd-search > svg {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--ui-as-cmd-icon);
  stroke-width: 1.1;
  stroke-linecap: round;
}
.ui-as .ui-as__cmd-search input {
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-as-ink);
  caret-color: var(--ui-as-cmd-caret);
  outline: none;
}
.ui-as__cmd-search input::placeholder {
  color: var(--ui-as-faint);
}
.ui-as__cmd kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  box-shadow: inset 0 0 0 0.5px var(--ui-as-cmd-ring);
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-as-muted);
  transition: color 140ms ease;
}
.ui-as__cmd .ui-as__cmd-enter {
  padding: 0 4px;
  color: var(--ui-as-cmd-icon);
}
.ui-as__cmd-enter svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-as__cmd-list {
  position: relative;
  max-height: 360px;
  padding: 0 4px 4px;
  overflow-y: auto;
  scrollbar-width: thin;
  transition: height 320ms var(--ui-as-ease);
}
.ui-as__cmd-group {
  display: flex;
  flex-direction: column;
}
.ui-as__cmd-group:first-child:not(:has(.ui-as__cmd-label)) {
  padding-top: 4px;
}
.ui-as__cmd-label {
  padding: 10px 8px 4px;
  overflow-wrap: anywhere;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--ui-as-muted);
}
.ui-as__cmd-pill {
  position: absolute;
  top: 0;
  left: 4px;
  right: 4px;
  border-radius: 6px;
  background: var(--ui-as-cmd-active);
  opacity: 0;
  transition:
    transform 90ms ease-out,
    height 90ms ease-out,
    opacity 140ms ease;
}
.ui-as__cmd-pill[data-lit] {
  opacity: 1;
}
.ui-as .ui-as__cmd-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 6px;
  text-align: start;
}
.ui-as .ui-as__cmd-item:active:not(:disabled) {
  transform: none;
}
.ui-as .ui-as__cmd-item:focus-visible {
  outline: none;
}
.ui-as__cmd-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 5px;
  background: var(--ui-as-cmd-tile);
  box-shadow:
    0 0 0 0.5px var(--ui-as-cmd-ring),
    0 1px 1px -1px rgba(0, 0, 0, 0.1);
  color: var(--ui-as-cmd-strong);
}
.ui-as__cmd-logo svg {
  width: 12px;
  height: 12px;
}
.ui-as__cmd-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: var(--ui-as-cmd-icon);
  transition: color 140ms ease;
}
.ui-as__cmd-icon svg {
  width: 16px;
  height: 16px;
}
.ui-as__cmd-item[aria-selected="true"] .ui-as__cmd-icon {
  color: var(--ui-as-ink);
}
.ui-as__cmd-text {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.ui-as__cmd-name,
.ui-as__cmd-hint {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-as__cmd-name {
  color: var(--ui-as-ink);
}
.ui-as__cmd-hint {
  color: var(--ui-as-muted);
}
.ui-as__cmd mark {
  border-radius: 3px;
  background: var(--ui-as-cmd-mark);
  color: inherit;
}
.ui-as__cmd-keys {
  display: inline-flex;
  flex: none;
  gap: 2px;
}
.ui-as__cmd-item[aria-selected="true"] kbd {
  color: var(--ui-as-text);
}
.ui-as__cmd-empty {
  margin: 0;
  padding: 12px 8px;
  color: var(--ui-as-muted);
}
.ui-as__cmd-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-top: 0.5px solid var(--ui-as-line);
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-as-muted);
}
.ui-as__cmd-foot > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
}
@container (max-width:480px) {
  .ui-as__cmd-item .ui-as__cmd-keys,
  .ui-as__cmd-foot,
  .ui-as__cmd .ui-as__cmd-enter,
  .ui-as__cmd-hint {
    display: none;
  }
  .ui-as .ui-as__cmd-item {
    height: 40px;
  }
}
@media (hover: none) and (pointer: coarse) {
  .ui-as .ui-as__cmd-item {
    height: 44px;
  }
  .ui-as__cmd-search {
    height: 52px;
  }
}
:where(.dark, [data-theme="dark"]) .ui-as__cmd {
  background: rgba(0, 0, 0, 0.45);
  --ui-as-cmd-strong: #fff;
  --ui-as-cmd-icon: rgba(255, 255, 255, 0.5);
  --ui-as-cmd-ring: rgba(255, 255, 255, 0.12);
  --ui-as-cmd-active: rgba(255, 255, 255, 0.08);
  --ui-as-cmd-tile: #2a2a2d;
  --ui-as-cmd-mark: rgba(77, 141, 255, 0.24);
  --ui-as-cmd-caret: #4d8dff;
  --ui-as-cmd-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}

.ui-afd {
  --ui-afd-card: #fff;
  --ui-afd-ink: rgba(0, 0, 0, 0.88);
  --ui-afd-text: rgba(0, 0, 0, 0.61);
  --ui-afd-muted: rgba(0, 0, 0, 0.45);
  --ui-afd-faint: rgba(0, 0, 0, 0.27);
  --ui-afd-line: rgba(0, 0, 0, 0.06);
  --ui-afd-fill: rgba(0, 0, 0, 0.04);
  --ui-afd-focus: #0060e2;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  min-height: 0;
  width: 100%;
  padding: 0 16px;
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-afd-ink);
  container: ui-afd / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-afd,
.ui-afd *,
.ui-afd *::before,
.ui-afd *::after {
  box-sizing: border-box;
}
.ui-afd button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-afd button:disabled {
  opacity: 0.3;
  cursor: default;
}
.ui-afd button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-afd button:focus-visible {
  outline: 2px solid var(--ui-afd-focus);
  outline-offset: -2px;
}
.ui-afd__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  flex: none;
}
.ui-afd__toolbar > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-afd-muted);
}
.ui-afd__toolbar > button:first-child {
  rotate: 90deg;
}
.ui-afd__toolbar > button:nth-child(2) {
  rotate: -90deg;
}
.ui-afd__toolbar > button[aria-pressed="true"],
.ui-afd__toolbar > button:hover:not(:disabled) {
  background: var(--ui-afd-fill);
}
.ui-afd__toolbar > strong {
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
}
.ui-afd__search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  border: 0.5px solid var(--ui-afd-line);
  border-radius: 6px;
  padding: 0 8px;
  margin: 8px 0 6px;
  color: var(--ui-afd-faint);
  flex: none;
}
.ui-afd__search input {
  width: 0;
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  font: inherit;
  color: var(--ui-afd-ink);
  background: none;
}
.ui-afd__search:focus-within {
  border-color: var(--ui-afd-muted);
}
.ui-afd__search input::placeholder {
  color: var(--ui-afd-faint);
}
.ui-afd__columns,
.ui-afd__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px 72px;
  gap: 4px;
  align-items: center;
}
.ui-afd__columns {
  height: 26px;
  flex: none;
  border-bottom: 0.5px solid var(--ui-afd-line);
}
.ui-afd__columns button {
  display: flex;
  gap: 3px;
  font-size: 12px;
  text-align: left;
  color: var(--ui-afd-muted);
  padding: 0 8px;
}
.ui-afd__columns button:not(:first-child) {
  justify-content: flex-end;
}
.ui-afd__items {
  overflow: auto;
  min-height: 0;
  max-height: 100%;
  flex: 1;
}
.ui-afd__item {
  width: 100%;
  height: 30px;
  padding: 0 8px;
  text-align: left;
  border-bottom: 0.5px solid var(--ui-afd-line) !important;
  border-radius: 3px;
}
.ui-afd__item:hover,
.ui-afd__item[aria-selected="true"] {
  background: var(--ui-afd-fill);
}
.ui-afd__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ui-afd__name > span:first-child {
  display: flex;
  color: #2989df;
  flex: none;
}
.ui-afd__name > [data-kind="table"] {
  color: #44ad76 !important;
}
.ui-afd__name > [data-kind="code"] {
  color: #ed9540 !important;
}
.ui-afd__name > [data-kind="folder"] {
  color: #e8b000 !important;
}
.ui-afd__name > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-afd__item > span:not(:first-child) {
  font-size: 12px;
  color: var(--ui-afd-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ui-afd__items[data-view="icons"] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  align-content: start;
  gap: 8px;
  padding-block: 10px;
}
.ui-afd__items[data-view="icons"] .ui-afd__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 94px;
  border: 0 !important;
  gap: 3px;
  border-radius: 8px;
}
.ui-afd__items[data-view="icons"] .ui-afd__name {
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}
.ui-afd__items[data-view="icons"] .ui-afd__name svg {
  width: 28px;
  height: 28px;
}
.ui-afd__items[data-view="icons"] .ui-afd__item > span:not(:first-child) {
  display: none;
}
.ui-afd__rename {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px;
}
.ui-afd__rename input {
  min-width: 0;
  flex: 1;
  font: inherit;
  color: inherit;
  background: var(--ui-afd-card);
  border: 0.5px solid var(--ui-afd-muted);
  border-radius: 4px;
  outline: none;
}
.ui-afd footer {
  padding: 8px 0;
  font-size: 12px;
  text-align: center;
  border-top: 0.5px solid var(--ui-afd-line);
  color: var(--ui-afd-faint);
  font-variant-numeric: tabular-nums;
  flex: none;
}
.ui-afd__empty {
  text-align: center;
  font-size: 12px;
  padding: 24px;
  color: var(--ui-afd-muted);
}
.ui-afd__menu {
  width: 200px;
  overflow: auto;
  padding: 5px;
  border-radius: 10px;
  background: var(--ui-afd-card);
  box-shadow:
    0 0 0 0.5px var(--ui-afd-line),
    0 6px 20px rgba(0, 0, 0, 0.12);
}
.ui-afd__menu button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 32px;
  padding: 5px 8px;
  text-align: left;
  border-radius: 5px;
  font-size: 12px;
}
.ui-afd__menu button:hover {
  background: var(--ui-afd-fill);
}
.ui-afd__menu [data-danger] {
  color: #e5484d;
}
.ui-afd__menu kbd {
  font:
    10px ui-monospace,
    monospace;
  color: var(--ui-afd-muted);
}
.ui-afd__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@container ui-afd (max-width:300px) {
  .ui-afd__columns,
  .ui-afd__item {
    grid-template-columns: minmax(0, 1fr) 58px;
  }
  .ui-afd__columns > button:last-child,
  .ui-afd__item > span:last-child {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-afd__item,
  .ui-afd__toolbar > button,
  .ui-afd__menu button {
    min-height: 36px;
  }
  .ui-afd__search {
    height: 36px;
  }
  .ui-afd__search input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-afd,
  .ui-afd * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-afd {
  --ui-afd-card: #1c1c1e;
  --ui-afd-ink: rgba(255, 255, 255, 0.9);
  --ui-afd-text: rgba(255, 255, 255, 0.62);
  --ui-afd-muted: rgba(255, 255, 255, 0.46);
  --ui-afd-faint: rgba(255, 255, 255, 0.3);
  --ui-afd-line: rgba(255, 255, 255, 0.08);
  --ui-afd-fill: rgba(255, 255, 255, 0.06);
  --ui-afd-focus: #4d8dff;
}

.ui-aiv {
  --ui-aiv-card: #fff;
  --ui-aiv-ink: rgba(0, 0, 0, 0.88);
  --ui-aiv-muted: rgba(0, 0, 0, 0.45);
  --ui-aiv-line: rgba(0, 0, 0, 0.06);
  --ui-aiv-fill: rgba(0, 0, 0, 0.025);
  --ui-aiv-focus: #0060e2;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  color: var(--ui-aiv-ink);
  font:
    12px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-aiv,
.ui-aiv * {
  box-sizing: border-box;
}
.ui-aiv__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-bottom: 0.5px solid var(--ui-aiv-line);
  flex: none;
}
.ui-aiv button,
.ui-aiv a {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  border: 0;
  border-radius: 5px;
  color: var(--ui-aiv-muted);
  background: none;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
}
.ui-aiv a {
  margin-left: auto;
}
.ui-aiv button:hover,
.ui-aiv a:hover {
  background: var(--ui-aiv-fill);
}
.ui-aiv button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-aiv :is(button, a):focus-visible {
  outline: 2px solid var(--ui-aiv-focus);
  outline-offset: -2px;
}
.ui-aiv :is(button, a):active {
  transform: scale(0.97);
}
.ui-aiv__canvas {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: var(--ui-aiv-fill);
}
.ui-aiv img {
  display: block;
  height: auto;
  flex: none;
  border-radius: 6px;
  box-shadow: 0 0 0 0.5px var(--ui-aiv-line);
}
.ui-aiv__canvas p {
  color: var(--ui-aiv-muted);
}
@media (pointer: coarse) {
  .ui-aiv button,
  .ui-aiv a {
    min-width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-aiv,
  .ui-aiv * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-aiv {
  --ui-aiv-card: #1c1c1e;
  --ui-aiv-ink: rgba(255, 255, 255, 0.9);
  --ui-aiv-muted: rgba(255, 255, 255, 0.46);
  --ui-aiv-line: rgba(255, 255, 255, 0.08);
  --ui-aiv-fill: rgba(255, 255, 255, 0.025);
  --ui-aiv-focus: #4d8dff;
}

.ui-aw__code {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}
.ui-aw__code .ui-aw__toolbar {
  gap: 12px;
}
.ui-aw__code-language {
  margin-right: auto;
  font-size: 11px;
  color: var(--ui-aw-muted);
}
.ui-aw__code .ui-aw__toolbar button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ui-aw-muted);
  min-height: 28px;
}
.ui-aw__code-body {
  display: flex;
  flex: 1;
  min-height: 180px;
  border-top: 0.5px solid var(--ui-aw-line);
}
.ui-aw__code-body pre,
.ui-aw__code-body textarea {
  font:
    12px/1.8 ui-monospace,
    "SF Mono",
    Menlo,
    monospace;
  tab-size: 2;
  padding: 12px;
  white-space: pre;
  margin: 0;
}
.ui-aw__code-body pre {
  color: var(--ui-aw-faint);
  background: var(--ui-aw-fill);
  text-align: right;
  overflow: hidden;
  width: 44px;
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-aw__code-body textarea {
  background: none;
  resize: none;
  border: 0;
  outline: none;
  flex: 1;
  min-width: 0;
  color: var(--ui-aw-ink);
  overflow: auto;
}
.ui-aw__code-notice {
  font-size: 11px;
  padding: 4px 12px;
  color: var(--ui-aw-muted);
  min-height: 22px;
}
.ui-aw {
  --ui-aw-card: #fff;
  --ui-aw-ink: rgba(0, 0, 0, 0.88);
  --ui-aw-text: rgba(0, 0, 0, 0.61);
  --ui-aw-muted: rgba(0, 0, 0, 0.45);
  --ui-aw-faint: rgba(0, 0, 0, 0.27);
  --ui-aw-line: rgba(0, 0, 0, 0.06);
  --ui-aw-fill: rgba(0, 0, 0, 0.025);
  --ui-aw-focus: rgba(0, 96, 226, 0.35);
  --ui-aw-selection: rgba(0, 96, 226, 0.1);
  --ui-aw-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--ui-aw-card);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-aw-ink);
  container: ui-aw / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-aw,
.ui-aw *,
.ui-aw *::before,
.ui-aw *::after {
  box-sizing: border-box;
}
.ui-aw :where(button, input, select) {
  font: inherit;
  color: inherit;
}
.ui-aw :where(button) {
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-aw button:disabled {
  opacity: 0.35;
  cursor: default;
}
.ui-aw button:focus-visible,
.ui-aw input:focus-visible,
.ui-aw select:focus-visible,
.ui-aw__doc:focus-visible {
  outline: 2px solid var(--ui-aw-focus);
  outline-offset: -2px;
}
.ui-aw button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-aw__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  padding: 6px;
  border-bottom: 0.5px solid var(--ui-aw-line);
  flex: none;
  background: var(--ui-aw-fill);
}
.ui-aw__tabs {
  display: flex;
  gap: 4px;
  min-width: 0;
  overflow: auto;
  scrollbar-width: none;
}
.ui-aw__tab-wrap {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 8px;
  min-width: 0;
  flex-shrink: 0;
  color: var(--ui-aw-muted);
}
.ui-aw__tab-wrap[data-active] {
  background: var(--ui-aw-card);
  box-shadow: 0 0 0 0.5px var(--ui-aw-line);
  color: var(--ui-aw-ink);
}
.ui-aw__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 166px;
  height: 30px;
  padding: 0 24px 0 9px;
  text-align: left;
  font-size: 12px !important;
}
.ui-aw__tab span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.ui-aw__tab-close {
  display: grid;
  place-items: center;
  position: absolute;
  right: 4px;
  top: 7px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--ui-aw-muted) !important;
}
.ui-aw__tab-close:hover {
  background: var(--ui-aw-fill);
}
.ui-aw__collapse {
  margin-left: auto;
}
.ui-aw__tool {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  color: var(--ui-aw-muted) !important;
  padding: 0;
}
.ui-aw__tool:hover,
.ui-aw__tool[aria-pressed="true"] {
  background: var(--ui-aw-fill);
}
.ui-aw__pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.ui-aw__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  padding: 16px 18px 10px;
}
.ui-aw__heading > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-aw__heading strong {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-aw__heading small {
  font-size: 11px;
  color: var(--ui-aw-muted);
}
.ui-aw__file-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--ui-aw-fill);
  color: #2989df;
}
.ui-aw__file-icon[data-kind="table"] {
  color: #1a9a52;
}
.ui-aw__sheet {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  position: relative;
}
.ui-aw__toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 36px;
  padding: 0 12px 8px;
  flex: none;
  overflow-x: auto;
  scrollbar-width: none;
}
.ui-aw__divider {
  width: 1px;
  height: 14px;
  flex: none;
  background: var(--ui-aw-line);
  margin-inline: 3px;
}
.ui-aw__format {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  white-space: nowrap;
  color: var(--ui-aw-text) !important;
  padding: 0 4px;
}
.ui-aw__format > span {
  color: var(--ui-aw-muted);
  font-size: 12px;
}
.ui-aw__formula {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 10px 18px 10px;
  height: 28px;
  flex: none;
  border: 0.5px solid var(--ui-aw-line);
  border-radius: 5px;
  overflow: hidden;
}
.ui-aw__formula input {
  border: 0;
  outline: none;
  background: none;
  padding: 0 8px;
  min-width: 0;
  flex: 1;
  font-size: 12px;
}
.ui-aw__formula input:first-child {
  width: 62px;
  flex: none;
  text-align: center;
  font-variant-numeric: tabular-nums;
  border-right: 0.5px solid var(--ui-aw-line);
}
.ui-aw__formula > span {
  font-style: italic;
  font-size: 12px;
  color: var(--ui-aw-faint);
  padding-left: 8px;
}
.ui-aw__grid-wrap {
  overflow: auto;
  min-height: 0;
  overscroll-behavior: contain;
}
.ui-aw__grid {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
}
.ui-aw__grid th,
.ui-aw__grid td {
  border-right: 0.5px solid var(--ui-aw-line);
  border-bottom: 0.5px solid var(--ui-aw-line);
  padding: 4px 8px;
  height: 26px;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  font-weight: 400;
}
.ui-aw__grid thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 26px;
  text-align: center;
  font-size: 10px;
  color: var(--ui-aw-muted);
  background: var(--ui-aw-card);
}
.ui-aw__grid th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  width: 30px;
  text-align: center;
  padding-inline: 4px;
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--ui-aw-muted);
  background: var(--ui-aw-card);
}
.ui-aw__grid thead th:first-child {
  z-index: 3;
}
.ui-aw__grid [data-bold] {
  font-weight: 500;
}
.ui-aw__grid th[data-selected] {
  background: var(--ui-aw-selection);
  color: var(--ui-aw-ink);
}
.ui-aw__grid td[aria-selected="true"] {
  outline: 2px solid var(--ui-aw-muted);
  outline-offset: -2px;
  overflow: visible;
  z-index: 1;
}
.ui-aw__grid td[aria-selected="true"]::after {
  content: "";
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 5px;
  height: 5px;
  background: var(--ui-aw-muted);
  border: 1px solid var(--ui-aw-card);
}
.ui-aw__grid td:focus {
  outline: 2px solid var(--ui-aw-muted);
  outline-offset: -2px;
}
.ui-aw__cell-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--ui-aw-card);
  border: 0;
  outline: 2px solid var(--ui-aw-focus);
  padding: 2px 8px;
}
.ui-aw__col-resize {
  position: absolute;
  inset: 0 -3px 0 auto;
  width: 7px;
  cursor: col-resize !important;
  touch-action: none;
  padding: 0;
}
.ui-aw__col-resize:hover {
  background: var(--ui-aw-selection);
}
.ui-aw__sheet-status {
  margin-top: auto;
  padding: 6px 16px;
  min-height: 28px;
  color: var(--ui-aw-faint);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}
.ui-aw__document {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.ui-aw__text-style {
  max-width: 92px;
  height: 28px;
  background: none;
  border: 0;
  color: var(--ui-aw-muted) !important;
  cursor: pointer;
  font-size: 12px !important;
}
.ui-aw__doc {
  padding: 8px 18px 20px;
  outline: none;
  overflow: auto;
  min-height: 220px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-aw-text);
  overflow-wrap: anywhere;
}
.ui-aw__doc h1,
.ui-aw__doc h2,
.ui-aw__doc h3 {
  font-weight: 500;
  color: var(--ui-aw-ink);
  margin: 0 0 10px;
  line-height: 1.4;
}
.ui-aw__doc h1 {
  font-size: 20px;
}
.ui-aw__doc h2 {
  font-size: 17px;
}
.ui-aw__doc h3 {
  font-size: 15px;
}
.ui-aw__doc p {
  margin: 0 0 10px;
}
.ui-aw__doc ul,
.ui-aw__doc ol {
  padding-left: 21px;
  margin: 0 0 10px;
}
.ui-aw__doc li {
  padding-left: 0;
  margin-bottom: 3px;
}
.ui-aw__doc li::marker {
  color: var(--ui-aw-faint);
}
.ui-aw__doc b,
.ui-aw__doc strong {
  font-weight: 600;
}
.ui-aw__doc a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ui-aw__doc-status {
  padding: 8px 18px;
  border-top: 0.5px solid var(--ui-aw-line);
  font-size: 11px;
  letter-spacing: 0.025em;
  color: var(--ui-aw-faint);
  font-variant-numeric: tabular-nums;
}
.ui-aw__link-form {
  display: flex;
  gap: 6px;
  padding: 6px 18px;
}
.ui-aw__link-form input {
  min-width: 0;
  flex: 1;
  background: none;
  border: 1px solid var(--ui-aw-line);
  border-radius: 4px;
  padding: 4px;
}
.ui-aw__link-form button {
  font-size: 12px;
  color: var(--ui-aw-text);
}
.ui-aw__menu {
  min-width: 180px;
  padding: 5px;
  overflow: auto;
  background: var(--ui-aw-card);
  box-shadow: var(--ui-aw-shadow);
  border-radius: 9px;
  animation: ui-aw-in 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ui-aw__menu button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
  width: 100%;
  border-radius: 5px;
  padding: 6px 9px;
  text-align: left;
  font-size: 12px;
}
.ui-aw__menu button:hover {
  background: var(--ui-aw-fill);
}
.ui-aw__start {
  padding: 32px 24px;
  overflow: auto;
  color: var(--ui-aw-muted);
}
.ui-aw__start h2 {
  font-size: 17px;
  font-weight: 500;
  color: var(--ui-aw-ink);
}
.ui-aw__start > input {
  width: 100%;
  background: none;
  border: 1px solid var(--ui-aw-line);
  padding: 9px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.ui-aw__create {
  display: flex;
  gap: 8px;
}
.ui-aw__create button {
  display: flex;
  gap: 6px;
  align-items: center;
  text-align: left;
  padding: 8px;
  background: var(--ui-aw-fill);
  border-radius: 7px;
  font-size: 11px;
}
.ui-aw__start-label {
  font-size: 11px;
  margin-top: 26px;
}
.ui-aw__file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 2px;
  text-align: left;
  font-size: 12px !important;
}
.ui-aw__file-row > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.ui-aw__file-row:hover {
  color: var(--ui-aw-ink);
}
@keyframes ui-aw-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
@container ui-aw (max-width:360px) {
  .ui-aw__heading {
    padding-inline: 12px;
  }
  .ui-aw__toolbar {
    padding-inline: 10px;
  }
  .ui-aw__formula {
    margin-inline: 12px;
  }
  .ui-aw__doc {
    padding-inline: 12px;
  }
  .ui-aw__tab {
    max-width: 140px;
  }
}
@media (pointer: coarse) {
  .ui-aw__tool {
    width: 34px;
    height: 34px;
  }
  .ui-aw__tab {
    height: 34px;
  }
  .ui-aw__tab-close {
    top: 9px;
  }
  .ui-aw__grid td {
    height: 32px;
  }
  .ui-aw__menu button {
    min-height: 40px;
  }
  .ui-aw__col-resize {
    width: 11px;
  }
  .ui-aw__formula input,
  .ui-aw__cell-input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-aw,
  .ui-aw * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-aw {
  --ui-aw-card: #1c1c1e;
  --ui-aw-ink: rgba(255, 255, 255, 0.9);
  --ui-aw-text: rgba(255, 255, 255, 0.62);
  --ui-aw-muted: rgba(255, 255, 255, 0.46);
  --ui-aw-faint: rgba(255, 255, 255, 0.3);
  --ui-aw-line: rgba(255, 255, 255, 0.08);
  --ui-aw-fill: rgba(255, 255, 255, 0.025);
  --ui-aw-focus: rgba(77, 141, 255, 0.5);
  --ui-aw-selection: rgba(77, 141, 255, 0.16);
  --ui-aw-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}

.ui-aw__file-icon[data-kind="folder"] {
  color: #e8b000;
}
.ui-aw__file-icon[data-kind="code"] {
  color: #ed9540;
}
.ui-aw__file-icon[data-kind="image"] {
  color: #a651f0;
}

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

.ui-td {
  --ui-td-card: #fff;
  --ui-td-ink: rgba(0, 0, 0, 0.88);
  --ui-td-text: rgba(0, 0, 0, 0.61);
  --ui-td-muted: rgba(0, 0, 0, 0.45);
  --ui-td-faint: rgba(0, 0, 0, 0.27);
  --ui-td-line: rgba(0, 0, 0, 0.06);
  --ui-td-fill: rgba(0, 0, 0, 0.025);
  --ui-td-focus: rgba(0, 96, 226, 0.35);
  height: 100%;
  overflow: auto;
  padding: 18px;
  color: var(--ui-td-ink);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-td / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-td,
.ui-td *,
.ui-td *::before,
.ui-td *::after {
  box-sizing: border-box;
}
.ui-td button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-td button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-td button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-td button:focus-visible {
  outline: 2px solid var(--ui-td-focus);
  outline-offset: 2px;
}
.ui-td__goal {
  color: var(--ui-td-text);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 22px;
  overflow-wrap: anywhere;
}
.ui-td__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 0 22px;
  font-size: 12px;
}
.ui-td__meta > div {
  display: flex;
  gap: 16px;
}
.ui-td__meta dt {
  width: 60px;
  flex: none;
  color: var(--ui-td-muted);
}
.ui-td__meta dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  min-width: 0;
}
.ui-td__meta dd > span {
  display: flex;
  color: #e8a20c;
}
.ui-td__meta dd > span[data-done] {
  color: #1a9a52;
}
.ui-td__meta small {
  font-size: 12px;
  color: var(--ui-td-faint);
  font-variant-numeric: tabular-nums;
}
.ui-td__section {
  margin: 0 0 22px;
}
.ui-td__section h3 {
  font-size: 12px;
  font-weight: 400;
  color: var(--ui-td-muted);
  margin: 0 0 8px;
}
.ui-td__steps {
  padding: 10px 0;
  margin: 0;
  list-style: none;
  background: var(--ui-td-fill);
  border-radius: 10px;
}
.ui-td__steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 5px 0;
  color: var(--ui-td-muted);
  font-size: 12px;
  min-height: 28px;
}
.ui-td__steps li > span:first-child {
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--ui-td-line);
  color: #fff;
  flex: none;
}
.ui-td__steps li[data-done] > span:first-child {
  background: #0095ff;
  border-color: #0095ff;
}
.ui-td__steps li[data-active] {
  color: var(--ui-td-ink);
}
.ui-td__steps li[data-active] > span:first-child {
  border-color: #0095ff;
  background: rgba(0, 149, 255, 0.13);
}
.ui-td__history {
  margin: 0;
  padding-left: 15px;
  font-size: 12px;
  line-height: 1.8;
  color: var(--ui-td-text);
}
.ui-td__history li::marker {
  color: var(--ui-td-faint);
}
.ui-td__history li:first-child {
  color: var(--ui-td-ink);
}
.ui-td__answer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 11px;
  box-shadow: 0 0 0 0.5px var(--ui-td-line);
  margin-bottom: 6px;
}
.ui-td__answer > svg {
  color: #1a9a52;
}
.ui-td__answer > span {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.ui-td__answer strong {
  font-size: 12px;
  font-weight: 400;
  overflow-wrap: anywhere;
}
.ui-td__answer small {
  font-size: 11px;
  color: var(--ui-td-muted);
}
.ui-td__files {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ui-td__files button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  padding: 5px 7px;
  background: var(--ui-td-fill);
  border-radius: 5px;
}
.ui-td > footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0;
}
.ui-td > footer button {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 28px;
  font-size: 12px;
  color: var(--ui-td-muted);
}
.ui-td > footer button svg {
  rotate: -90deg;
}
.ui-td__waiting {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  text-align: left;
  background: var(--ui-td-fill) !important;
  border-radius: 9px;
  margin-bottom: 18px;
  font-size: 12px !important;
}
.ui-td__waiting > span {
  font-size: 10px;
  color: #b47a06;
  white-space: nowrap;
}
.ui-td__waiting > svg {
  margin-left: auto;
}
.ui-td__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}
@container ui-td (max-width:320px) {
  .ui-td__meta > div {
    gap: 8px;
  }
  .ui-td__meta dt {
    width: 52px;
  }
}
@media (pointer: coarse) {
  .ui-td button {
    min-height: 36px;
  }
  .ui-td__steps li {
    min-height: 34px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-td,
  .ui-td * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-td {
  --ui-td-card: #1c1c1e;
  --ui-td-ink: rgba(255, 255, 255, 0.9);
  --ui-td-text: rgba(255, 255, 255, 0.62);
  --ui-td-muted: rgba(255, 255, 255, 0.46);
  --ui-td-faint: rgba(255, 255, 255, 0.3);
  --ui-td-line: rgba(255, 255, 255, 0.08);
  --ui-td-fill: rgba(255, 255, 255, 0.04);
  --ui-td-focus: rgba(77, 141, 255, 0.5);
}

.ui-tsr {
  min-height: 480px;
}
.ui-tsr__task-area {
  height: 100%;
  min-height: 0;
}
.ui-tsr .ui-th__head {
  z-index: 2;
}
.ui-tsr .ui-th__foot {
  z-index: 3;
}
@media (prefers-reduced-motion: reduce) {
  .ui-tsr {
    scroll-behavior: auto;
  }
}
.ui-afd {
  --ui-afd-ink: #171717;
  --ui-afd-text: #404040;
  --ui-afd-muted: #737373;
  --ui-afd-faint: #b5b5b5;
  --ui-afd-line: #e5e5e5;
  --ui-afd-fill: #f5f5f5;
  --ui-afd-focus: #2f6bff;
  font-size: 14px;
}
.ui-afd__item {
  height: 36px;
}
.ui-afd__search {
  border-width: 1px;
  height: 32px;
}
.ui-aiv {
  --ui-aiv-ink: #171717;
  --ui-aiv-muted: #737373;
  --ui-aiv-line: #e5e5e5;
  --ui-aiv-fill: #fafafa;
  --ui-aiv-focus: #2f6bff;
}
.ui-aiv button,
.ui-aiv a {
  min-width: 32px;
  height: 32px;
}
:where(.dark, [data-theme="dark"]) .ui-afd {
  --ui-afd-card: #232326;
  --ui-afd-ink: #ededed;
  --ui-afd-text: #c4c4c4;
  --ui-afd-muted: #8f8f8f;
  --ui-afd-faint: #6b6b70;
  --ui-afd-line: rgba(255, 255, 255, 0.1);
  --ui-afd-fill: #2a2a2d;
  --ui-afd-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-aiv {
  --ui-aiv-card: #232326;
  --ui-aiv-ink: #ededed;
  --ui-aiv-muted: #8f8f8f;
  --ui-aiv-line: rgba(255, 255, 255, 0.1);
  --ui-aiv-fill: #2a2a2d;
  --ui-aiv-focus: #6b95ff;
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
.ui-td {
  --ui-td-ink: #171717;
  --ui-td-text: #404040;
  --ui-td-muted: #737373;
  --ui-td-faint: #b5b5b5;
  --ui-td-line: #e5e5e5;
  --ui-td-fill: #f5f5f5;
  --ui-td-focus: #2f6bff;
  font-size: 14px;
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
:where(.dark, [data-theme="dark"]) .ui-td {
  --ui-td-card: #232326;
  --ui-td-ink: #ededed;
  --ui-td-text: #c4c4c4;
  --ui-td-muted: #8f8f8f;
  --ui-td-line: rgba(255, 255, 255, 0.1);
  --ui-td-fill: #2a2a2d;
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
.ui-cm {
  --ui-cm-ink: #171717;
  --ui-cm-text: #404040;
  --ui-cm-muted: #737373;
  --ui-cm-line: #e5e5e5;
  --ui-cm-fill: #f5f5f5;
  --ui-cm-focus: #2f6bff;
  font-size: 14px;
}
.ui-cm__panel {
  border: 1px solid var(--ui-cm-line);
  border-radius: 18px;
}
.ui-cm__item {
  min-height: 52px;
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
.ui-aw {
  --ui-aw-ink: #171717;
  --ui-aw-text: #404040;
  --ui-aw-muted: #737373;
  --ui-aw-faint: #b5b5b5;
  --ui-aw-line: #e5e5e5;
  --ui-aw-fill: #fafafa;
  --ui-aw-focus: #2f6bff;
  font-size: 14px;
}
.ui-aw__bar {
  border-bottom: 1px solid var(--ui-aw-line);
}
.ui-aw__grid th,
.ui-aw__grid td {
  border-width: 1px;
}
.ui-aw__tool {
  width: 30px;
  height: 30px;
}
.ui-as {
  --ui-as-page: #f0f0f0;
  --ui-as-side: #f7f7f7;
  --ui-as-ink: #171717;
  --ui-as-text: #404040;
  --ui-as-muted: #737373;
  --ui-as-faint: #b5b5b5;
  --ui-as-line: #e5e5e5;
  --ui-as-fill: #ededed;
  --ui-as-focus: #2f6bff;
  font-size: 14px;
}
.ui-as__main,
.ui-as__panel {
  box-shadow:
    0 0 0 1px var(--ui-as-line),
    0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-as__chat-link,
.ui-as__folder,
.ui-as__new-chat {
  height: 32px;
  min-height: 32px;
}
.ui-as__side-col {
  border-radius: 16px 0 0 16px;
}
.ui-as__main {
  border-radius: 0 16px 16px 0;
}
.ui-as__panel {
  border-radius: 16px;
}
.ui-as__menu {
  border: 1px solid var(--ui-as-line);
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
:where(.dark, [data-theme="dark"]) .ui-as,
.ui-as[data-theme="dark"] {
  --ui-as-page: #111113;
  --ui-as-card: #232326;
  --ui-as-side: #161618;
  --ui-as-ink: #ededed;
  --ui-as-text: #c4c4c4;
  --ui-as-muted: #8f8f8f;
  --ui-as-faint: #6b6b70;
  --ui-as-line: rgba(255, 255, 255, 0.1);
  --ui-as-fill: #2a2a2d;
  --ui-as-focus: #6b95ff;
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
:where(.dark, [data-theme="dark"]) .ui-aw {
  --ui-aw-card: #232326;
  --ui-aw-ink: #ededed;
  --ui-aw-text: #c4c4c4;
  --ui-aw-muted: #8f8f8f;
  --ui-aw-faint: #6b6b70;
  --ui-aw-line: rgba(255, 255, 255, 0.1);
  --ui-aw-fill: #2a2a2d;
  --ui-aw-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-cm {
  --ui-cm-card: #232326;
  --ui-cm-ink: #ededed;
  --ui-cm-text: #c4c4c4;
  --ui-cm-muted: #8f8f8f;
  --ui-cm-line: rgba(255, 255, 255, 0.1);
  --ui-cm-fill: #2a2a2d;
  --ui-cm-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-ta {
  --ui-ta-card: #232326;
  --ui-ta-ink: #ededed;
  --ui-ta-text: #8f8f8f;
  --ui-ta-faint: #6b6b70;
  --ui-ta-focus: #6b95ff;
}

`;
