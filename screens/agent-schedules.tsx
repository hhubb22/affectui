"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * agent-schedules (Classic) – a self-contained React 19 component.
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

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
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
      <style href="ui-agent-schedules" precedence="default">
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
export type AppShellWorkspace = { id: string; name: string; subtitle?: string };
export type AppShellMenuItem =
  | {
      kind?: "item";
      id?: string;
      label: string;
      icon?: ReactNode;
      danger?: boolean;
      disabled?: boolean;
      onSelect?: () => void;
    }
  | { kind: "separator"; id?: string };
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
  workspaceId?: string;
  workspaces?: AppShellWorkspace[];
  onSelectWorkspace?: (id: string) => void;
  onCreateWorkspace?: () => void;
  workspaceMenuItems?: AppShellMenuItem[];
  user?: AppShellUser | null;
  accountMenuItems?: AppShellMenuItem[];
  showLanguageMenu?: boolean;
  showAppearanceMenu?: boolean;
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
  workspaceId,
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  workspaceMenuItems,
  user = { name: "Alex Morgan", email: "alex@fieldwork.com" },
  accountMenuItems,
  showLanguageMenu = true,
  showAppearanceMenu = true,
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
  useEffect(() => {
    if (!user && menu === "account") setMenu(null);
  }, [user, menu]);
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
  const userAvatar = user ? (
    user.avatar && !brokenAvatar ? (
      <img src={user.avatar} alt="" onError={() => setBrokenAvatar(true)} />
    ) : (
      initials(user.name)
    )
  ) : null;
  const visiblePanel = hasPanel && panelOpen;
  const drawer = narrow && (sidebarOpen || visiblePanel);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => setBrokenAvatar(false), [user?.avatar]);
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
  const customMenuItem = (item: AppShellMenuItem, index: number) =>
    item.kind === "separator" ? (
      <span className="ui-as__wsm-sep" role="separator" key={item.id ?? `sep-${index}`} />
    ) : (
      <button
        type="button"
        role="menuitem"
        className="ui-as__wsm-item"
        data-danger={item.danger || undefined}
        disabled={item.disabled}
        key={item.id ?? item.label}
        onClick={() => {
          setMenu(null);
          anchor.current?.focus({ preventScroll: true });
          if (item.onSelect) item.onSelect();
          else onNavigate?.(item.label);
        }}
      >
        {item.icon}
        <span className="ui-as__wsm-label" title={item.label}>
          {labels.action(item.label)}
        </span>
      </button>
    );
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
  const switchWorkspaceMenu = workspaces
    ? workspaces.length > 0 || onCreateWorkspace
      ? wsSub(
          "Switch workspace",
          "switch",
          <>
            {workspaces.map((item) => {
              const checked = workspaceId !== undefined ? item.id === workspaceId : item.name === workspace;
              return (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={checked}
                  className="ui-as__wsm-item"
                  data-rich={item.subtitle ? "" : undefined}
                  key={item.id}
                  onClick={() => {
                    if (onSelectWorkspace) {
                      setMenu(null);
                      anchor.current?.focus({ preventScroll: true });
                      onSelectWorkspace(item.id);
                    } else menuAction(`Switch workspace: ${item.name}`);
                  }}
                >
                  <span className="ui-as__wsm-label" title={item.name}>
                    {item.subtitle ? (
                      <>
                        <span>{item.name}</span>
                        <small>{item.subtitle}</small>
                      </>
                    ) : (
                      item.name
                    )}
                  </span>
                  {checked && <WsGlyph name="check" size={14} />}
                </button>
              );
            })}
            {onCreateWorkspace && (
              <>
                {workspaces.length > 0 && <span className="ui-as__wsm-sep" role="separator" />}
                <button
                  type="button"
                  role="menuitem"
                  className="ui-as__wsm-item"
                  onClick={() => {
                    setMenu(null);
                    anchor.current?.focus({ preventScroll: true });
                    onCreateWorkspace();
                  }}
                >
                  <WsGlyph name="plus" />
                  <span className="ui-as__wsm-label" title="Create workspace">
                    {labels.action("Create workspace")}
                  </span>
                </button>
              </>
            )}
          </>,
        )
      : null
    : wsSub(
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
          {onCreateWorkspace ? (
            <button
              type="button"
              role="menuitem"
              className="ui-as__wsm-item"
              onClick={() => {
                setMenu(null);
                anchor.current?.focus({ preventScroll: true });
                onCreateWorkspace();
              }}
            >
              <WsGlyph name="plus" />
              <span className="ui-as__wsm-label" title="Create workspace">
                {labels.action("Create workspace")}
              </span>
            </button>
          ) : (
            wsItem("Create workspace", "plus")
          )}
        </>,
      );
  const hasWorkspaceMenu = workspaceMenuItems ? workspaceMenuItems.length > 0 || !!switchWorkspaceMenu : true;
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
      <style href="ui-agent-schedules" precedence="default">
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
                aria-haspopup={hasWorkspaceMenu ? "menu" : undefined}
                aria-expanded={hasWorkspaceMenu ? menu === "workspace" : undefined}
                aria-controls={menu === "workspace" ? `${id}-menu` : undefined}
                {...(hasWorkspaceMenu ? trigger("workspace") : {})}
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
              {user && (
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
                  {userAvatar}
                </button>
              )}
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
                        aria-haspopup={hasWorkspaceMenu ? "menu" : undefined}
                        aria-expanded={hasWorkspaceMenu ? menu === "workspace" : undefined}
                        {...(hasWorkspaceMenu ? trigger("workspace") : {})}
                      >
                        <span>{initials(workspace).slice(0, 1)}</span>
                        <strong>{workspace}</strong>
                        {hasWorkspaceMenu && (
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
                        )}
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
                {!rail && user && (
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
          {menu === "workspace" &&
            (workspaceMenuItems ? (
              <>
                {workspaceMenuItems.map(customMenuItem)}
                {workspaceMenuItems.length > 0 && switchWorkspaceMenu && (
                  <span className="ui-as__wsm-sep" role="separator" />
                )}
                {switchWorkspaceMenu}
              </>
            ) : (
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
                {switchWorkspaceMenu}
              </>
            ))}
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
          {menu === "account" && user && (
            <>
              <div className="ui-as__menu-user">
                <span className="ui-as__user-initials">{userAvatar}</span>
                <span>
                  <strong>{user.name}</strong>
                  {user.email && <small>{user.email}</small>}
                </span>
              </div>
              {showLanguageMenu &&
                wsSub(
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
              {showAppearanceMenu &&
                wsSub(
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
              {accountMenuItems ? (
                accountMenuItems.map(customMenuItem)
              ) : (
                <>
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
    if (next !== null && list[next]) {
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
      <style href="ui-agent-schedules" precedence="default">
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
              aria-label={`${field.charAt(0).toUpperCase() + field.slice(1)}${sort.key === field ? `, sorted ${sort.direction === "asc" ? "ascending" : "descending"}` : ""}`}
              onClick={() => changeSort(field)}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
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
                {field.charAt(0).toUpperCase() + field.slice(1)}
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
      <style href="ui-agent-schedules" precedence="default">
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
    const [removedEntry] = removed,
      [addedEntry] = added;
    let nextList = list;
    if (
      directory.entries.length === entries.length &&
      removed.length === 1 &&
      added.length === 1 &&
      removedEntry &&
      addedEntry
    ) {
      nextList = list.map((item) => (item.name === removedEntry.name ? { ...item, name: addedEntry.name } : item));
      setOpened(opened.map((name) => (name === removedEntry.name ? addedEntry.name : name)));
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
    if (next !== null && names[next] !== undefined) {
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
      <style href="ui-agent-schedules" precedence="default">
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
    const target = next[row]!; // The loop fills through the nonnegative selection row.
    while (target.length <= column) target.push("");
    target[column] = text;
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
    const next: [number, number] | null =
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
            if (match && match[1] && match[2]) {
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
                        const target = next[row + offset]!;
                        /* The loop fills through this nonnegative destination row. */ line.forEach((text, index) => {
                          target[column + index] = text;
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
        // Both captures participate in every match; the heading text may be empty.
        const block = document.createElement(match ? `h${match[1]!.length}` : "p");
        block.textContent = match ? match[2]! : line;
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

export type WorkspaceToolKind = "terminal" | "browser" | "notes";
export type WorkspaceSource = {
  id?: string;
  name: string;
  description?: string;
  artifact?: string;
  kind?: "folder" | "table" | "document" | "code" | "image";
  icon?: ReactNode;
};
export type WorkspaceStartProps = {
  suggested?: WorkspaceSource[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onOpenSource?: (source: WorkspaceSource) => void;
  onOpenTool?: (tool: WorkspaceToolKind) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
};

/** A new work-area tab: search or enter a URL, launch a tool, or open a suggested artifact. */
export function WorkspaceStart({
  suggested = [],
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onOpenSource,
  onOpenTool,
  onOpenUrl,
  className,
}: WorkspaceStartProps) {
  const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
  const sources = suggested.filter((source) =>
    `${source.name} ${source.description ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const tools: { kind: WorkspaceToolKind; label: string; hint: string; icon: IconName }[] = [
    { kind: "terminal", label: "Terminal", hint: "⌃`", icon: "terminal" },
    { kind: "browser", label: "Browser", hint: "⌘⇧B", icon: "globe" },
    { kind: "notes", label: "Notes", hint: "⌘⇧N", icon: "compose" },
  ];
  return (
    <section className={["ui-wst", className].filter(Boolean).join(" ")} aria-label="New workspace tab">
      <style href="ui-agent-schedules" precedence="default">
        {css}
      </style>
      <form
        className="ui-wst__search"
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim()) onOpenUrl?.(query.trim());
        }}
      >
        <Icon name="search" size={14} />
        <input
          aria-label="Search or enter URL"
          placeholder="Search or enter URL"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
      <h2>Tools</h2>
      <div className="ui-wst__card">
        {tools
          .filter((tool) => tool.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
          .map((tool) => (
            <button type="button" className="ui-wst__tool" key={tool.kind} onClick={() => onOpenTool?.(tool.kind)}>
              <span className="ui-wst__icon">
                <Icon name={tool.icon} size={15} />
              </span>
              <span>{tool.label}</span>
              <kbd>{tool.hint}</kbd>
            </button>
          ))}
      </div>
      <h2>Suggested</h2>
      <div className="ui-wst__card">
        {sources.map((source) => (
          <button
            type="button"
            className="ui-wst__source"
            key={source.id ?? source.artifact ?? source.name}
            onClick={() => onOpenSource?.(source)}
          >
            <span
              className="ui-wst__icon"
              data-kind={source.kind}
              onErrorCapture={(event) => {
                if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
              }}
            >
              {source.icon ?? (
                <Icon
                  name={source.kind === "folder" ? "folder" : source.kind === "table" ? "table" : "document"}
                  size={15}
                />
              )}
            </span>
            <span>
              <strong dir="auto" title={source.name}>
                {source.name}
              </strong>
              {source.description && <small dir="auto">{source.description}</small>}
            </span>
          </button>
        ))}
        {sources.length === 0 && <p className="ui-wst__empty">No matching sources</p>}
      </div>
    </section>
  );
}

export type WorkspaceToolProps = {
  kind: WorkspaceToolKind;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  lines?: string[];
  defaultLines?: string[];
  onLinesChange?: (lines: string[]) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
};

/** Frontend tool surfaces; connect onOpenUrl or replace this tab with the application's real tools. */
export function WorkspaceTool({
  kind: rawKind,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  lines: linesProp,
  defaultLines = ["Fieldwork", "Type help to see available commands."],
  onLinesChange,
  onOpenUrl,
  className,
}: WorkspaceToolProps) {
  const kind = ["terminal", "browser", "notes"].includes(rawKind) ? rawKind : "notes";
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange),
    [lines, setLines] = useControllable(linesProp, defaultLines, onLinesChange);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);
  const run = () => {
    const command = value.trim();
    if (!command) return;
    setValue("");
    if (command === "clear") {
      setLines([]);
      return;
    }
    const result =
      command === "help"
        ? "Commands: help, pwd, ls, echo <text>, clear"
        : command === "pwd"
          ? "/workspace/fieldwork"
          : command === "ls"
            ? "Northwind  Platform  Evalkit"
            : command.startsWith("echo ")
              ? command.slice(5)
              : `${command.split(" ")[0]}: command not found. Type help for available commands.`;
    setLines([...lines, `$ ${command}`, result]);
  };
  return (
    <section
      className={["ui-wst", "ui-wst__tool-pane", className].filter(Boolean).join(" ")}
      data-tool={kind}
      aria-label={kind === "terminal" ? "Terminal" : kind === "browser" ? "Browser" : "Notes"}
    >
      <style href="ui-agent-schedules" precedence="default">
        {css}
      </style>
      {kind === "notes" ? (
        <textarea
          aria-label="Notes"
          placeholder="Write a note…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : kind === "terminal" ? (
        <>
          <div className="ui-wst__terminal-output" ref={output} role="log" aria-live="polite">
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <form
            className="ui-wst__command"
            onSubmit={(event) => {
              event.preventDefault();
              run();
            }}
          >
            <span aria-hidden="true">$</span>
            <input
              aria-label="Terminal command"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </>
      ) : (
        <>
          <form
            className="ui-wst__search"
            onSubmit={(event) => {
              event.preventDefault();
              if (value.trim()) onOpenUrl?.(value.trim());
            }}
          >
            <Icon name="globe" size={14} />
            <input
              aria-label="Browser address"
              placeholder="Search or enter URL"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <button type="submit" aria-label="Open URL">
              <Icon name="arrow" size={14} />
            </button>
          </form>
          <div className="ui-wst__browser-home">
            <Icon name="globe" size={36} />
            <h2>Browser</h2>
            <p>Enter an address to open it.</p>
          </div>
        </>
      )}
    </section>
  );
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
  purple: "var(--ui-ags-c-purple)",
  orange: "var(--ui-ags-c-orange)",
  teal: "var(--ui-ags-c-teal)",
  blue: "var(--ui-ags-c-blue)",
  amber: "var(--ui-ags-c-amber)",
  pink: "var(--ui-ags-c-pink)",
  green: "var(--ui-ags-c-green)",
  gray: "var(--ui-ags-c-gray)",
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
      className={["ui-ags__skel", className].filter(Boolean).join(" ")}
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
    <section className="ui-ags__section" aria-labelledby={headingId}>
      <h2 id={headingId} className="ui-ags__label">
        {labels.aroundNow}
      </h2>
      <div className="ui-ags__card ui-ags__line">
        <div className="ui-ags__line-top">
          <span>{labels.activity}</span>
          <span className="ui-ags__num">
            <b>{currentRate}</b> {currentRate === 1 ? labels.perTenOne : labels.perTen}
          </span>
        </div>
        <div ref={chartRef} className="ui-ags__chart">
          <svg width={width} height={136} viewBox={`0 0 ${width} 136`} aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--ui-ags-blue)" stopOpacity="0.14" />
                <stop offset="1" stopColor="var(--ui-ags-blue)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {grids.map((y) => (
              <line key={y} className="ui-ags__chart-grid" x1="0" x2={width} y1={y} y2={y} />
            ))}
            <line className="ui-ags__chart-base" x1="0" x2={width} y1={114} y2={114} />
            {marks.map((m) => (
              <g
                key={`${m.s.id}@${m.t}`}
                className="ui-ags__marker"
                data-state={m.state}
                data-failed={m.failed || undefined}
                style={{ "--ui-ags-tone": scheduleTone(m.s.tone) } as CSSProperties}
              >
                <line x1={xAt(m.t)} x2={xAt(m.t)} y1={32} y2={114} />
                {m.state === "next" ? (
                  <circle cx={xAt(m.t)} cy={32} r="3" />
                ) : (
                  <rect x={xAt(m.t) - 2.5} y={29.5} width="5" height="5" rx="1" />
                )}
              </g>
            ))}
            <path className="ui-ags__chart-area" d={areaPath} style={{ fill: `url(#${gradientId})` }} />
            <path className="ui-ags__chart-line" d={linePath} />
            <circle className="ui-ags__chart-glow" cx={headPt[0]} cy={headPt[1]} r="9" />
            <circle className="ui-ags__chart-head" cx={headPt[0]} cy={headPt[1]} r="3.5" />
            {ticks.map((ms) => (
              <text key={ms} className="ui-ags__tick" x={xAt(ms)} y={132} textAnchor="middle">
                {scheduleClock.format(ms)}
              </text>
            ))}
          </svg>
          {marks.map((m) => (
            <button
              key={`b-${m.s.id}@${m.t}`}
              type="button"
              className="ui-ags__mark"
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
              className="ui-ags__chip"
              data-flip={flipChip || undefined}
              style={{ left: headPt[0], top: Math.max(4, headPt[1] - 46), maxWidth: chipWidth }}
              aria-hidden="true"
            >
              <span className="ui-ags__live" />
              <span className="ui-ags__chip-name">{firstRunning.s.name}</span>
              <span className="ui-ags__num ui-ags__faint">{Math.round(firstRunning.progress * 100)}%</span>
            </span>
          )}
        </div>
        <p className="ui-ags__line-say" role="status">
          {firstRunning ? (
            <>
              <span className="ui-ags__live" aria-hidden="true" />
              <b>{labels.runningNow}:</b>
              <span className="ui-ags__line-name">{running.map((m) => m.s.name).join(", ")}</span>
              <span className="ui-ags__num ui-ags__faint">· {Math.round(firstRunning.progress * 100)}%</span>
            </>
          ) : upcoming ? (
            <>
              <b>{labels.next}:</b>
              <span className="ui-ags__line-name">{upcoming.s.name}</span>
              <span className="ui-ags__num ui-ags__faint">
                · {scheduleClock.format(upcoming.t)}, {scheduleRelative(upcoming.t, now)}
              </span>
            </>
          ) : (
            <span className="ui-ags__faint">{labels.nothingNext}</span>
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
    <div className="ui-ags__prompt-wrap">
      <blockquote ref={ref} className="ui-ags__prompt" data-open={open || undefined} dir="auto">
        {text}
      </blockquote>
      {(clamped || open) && (
        <button type="button" className="ui-ags__link" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
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
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>(".ui-ags__row-main") ?? [])];
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
    <div ref={rootRef} className={["ui-ags", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-schedules" precedence="default">
        {css}
      </style>
      <header className="ui-ags__head">
        <div className="ui-ags__head-main">
          <h1 className="ui-ags__title">{labels.schedules}</h1>
          {!loading && schedules.length > 0 && (
            <span className="ui-ags__num ui-ags__faint">
              {activeCount} / {schedules.length}
            </span>
          )}
        </div>
        {headerAction && <div className="ui-ags__head-actions">{headerAction}</div>}
      </header>
      <div className="ui-ags__scroll">
        <div className="ui-ags__page">
          {banner}
          {editor}
          {loading ? (
            <>
              {showTimeline && (
                <section className="ui-ags__section" aria-label={labels.aroundNow}>
                  <h2 className="ui-ags__label">{labels.aroundNow}</h2>
                  <div className="ui-ags__card ui-ags__line" data-skel="">
                    <div className="ui-ags__line-top">
                      <span>{labels.activity}</span>
                      <ScheduleSkel width={88} height={8} />
                    </div>
                    <div className="ui-ags__chart ui-ags__skel-chart">
                      <ScheduleSkel width="100%" height="100%" radius={6} />
                    </div>
                    <ScheduleSkel width={220} height={10} />
                  </div>
                </section>
              )}
              <section className="ui-ags__section" aria-label={labels.listHeading}>
                <h2 className="ui-ags__label">{labels.listHeading}</h2>
                <div className="ui-ags__rows" data-skel="">
                  {[124, 96, 140, 112, 104].map((w, idx) => (
                    <div key={idx} className="ui-ags__row">
                      <div className="ui-ags__row-main">
                        <ScheduleSkel width={8} height={8} radius={2} />
                        <span className="ui-ags__row-text">
                          <ScheduleSkel width={w} height={10} />
                          <ScheduleSkel width={[132, 176, 148, 160, 120][idx] ?? 140} height={10} />
                        </span>
                        <span className="ui-ags__row-next">
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
              <div className="ui-ags__card ui-ags__empty">
                <div className="ui-ags__empty-body">
                  <p className="ui-ags__empty-title">{labels.empty}</p>
                  {labels.emptyText && <p className="ui-ags__empty-text">{labels.emptyText}</p>}
                </div>
              </div>
            )
          ) : (
            <>
              {showTimeline && (
                <ScheduleAroundNow schedules={schedules} now={now} skipped={skipped} labels={labels} onOpen={choose} />
              )}
              <section className="ui-ags__section" aria-labelledby={listHeadingId}>
                <h2 id={listHeadingId} className="ui-ags__label">
                  {labels.listHeading}
                </h2>
                <ul
                  ref={listRef}
                  className="ui-ags__rows"
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
                        className="ui-ags__row"
                        data-selected={isSelected || undefined}
                        data-paused={s.paused || undefined}
                        style={{ "--ui-ags-tone": scheduleTone(s.tone) } as CSSProperties}
                      >
                        <button
                          type="button"
                          className="ui-ags__row-main"
                          data-id={s.id}
                          aria-current={isSelected || undefined}
                          aria-label={`${s.name}, ${s.cadence}, ${
                            s.paused ? labels.paused : next ? `next ${scheduleWhen(next, now)}` : ""
                          }${outcomeText ? `, last run ${outcomeText}` : ""}`}
                          onClick={() => choose(s.id)}
                        >
                          <span className="ui-ags__row-mark" aria-hidden="true" />
                          <span className="ui-ags__row-text">
                            <span className="ui-ags__row-name" dir="auto" title={s.name}>
                              {s.name}
                            </span>
                            <span className="ui-ags__row-cadence" dir="auto" title={s.cadence}>
                              {s.cadence}
                            </span>
                            <span className="ui-ags__row-nextline ui-ags__num" aria-hidden="true">
                              {s.paused
                                ? labels.paused
                                : next
                                  ? `${scheduleWhen(next, now)} · ${scheduleRelative(next, now)}`
                                  : ""}
                            </span>
                          </span>
                          <span className="ui-ags__row-next ui-ags__num">
                            {s.paused ? (
                              <span className="ui-ags__faint">{labels.paused}</span>
                            ) : next ? (
                              <>
                                <span>{scheduleWhen(next, now)}</span>
                                <span className="ui-ags__faint ui-ags__row-rel">{scheduleRelative(next, now)}</span>
                              </>
                            ) : null}
                          </span>
                          <span className="ui-ags__row-last">
                            {latest && outcomeText && (
                              <span className="ui-ags__badge" data-outcome={latest.outcome}>
                                {outcomeText}
                              </span>
                            )}
                          </span>
                          {s.cost != null && (
                            <span className="ui-ags__row-cost ui-ags__num" title={scheduleCurrency.format(s.cost)}>
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
                            className="ui-ags__switch"
                            onClick={() => onPause(s.id, !s.paused)}
                          >
                            <span className="ui-ags__switch-knob" aria-hidden="true" />
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
        <p className="ui-ags__sr" role="status" aria-live="polite">
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
      <div className={["ui-ags__panel", className].filter(Boolean).join(" ")} data-skel="">
        <style href="ui-agent-schedules" precedence="default">
          {css}
        </style>
        <div className="ui-ags__panel-head">
          <ScheduleSkel width={8} height={8} radius={2} className="ui-ags__skel-mark" />
          <span className="ui-ags__panel-titles">
            <ScheduleSkel width={136} height={12} />
            <ScheduleSkel width={184} height={8} />
          </span>
        </div>
        <div className="ui-ags__panel-acts">
          <ScheduleSkel width={92} height={28} radius={6} />
          <ScheduleSkel width={72} height={28} radius={6} />
        </div>
        <section className="ui-ags__section">
          <h3 className="ui-ags__label">{labels.what}</h3>
          <ScheduleSkel width="96%" height={10} />
          <ScheduleSkel width="72%" height={10} />
        </section>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className={["ui-ags__panel", "ui-ags__panel--empty", className].filter(Boolean).join(" ")}>
        <style href="ui-agent-schedules" precedence="default">
          {css}
        </style>
        <div className="ui-ags__empty-body">
          <p className="ui-ags__empty-title">{labels.noSchedule}</p>
          <p className="ui-ags__empty-text">{labels.noScheduleText}</p>
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
      className={["ui-ags__panel", className].filter(Boolean).join(" ")}
      style={{ "--ui-ags-tone": scheduleTone(schedule.tone) } as CSSProperties}
      aria-label={schedule.name}
    >
      <style href="ui-agent-schedules" precedence="default">
        {css}
      </style>
      <div className="ui-ags__panel-head">
        <span className="ui-ags__row-mark" aria-hidden="true" data-paused={schedule.paused || undefined} />
        <span className="ui-ags__panel-titles">
          <h2 className="ui-ags__panel-title" dir="auto">
            {schedule.name}
          </h2>
          <span className="ui-ags__panel-sub" dir="auto">
            <Icon name="repeat" size={12} />
            <span>
              {schedule.panelCadence ?? schedule.cadence}
              {schedule.project ? ` · ${schedule.project}` : ""}
            </span>
          </span>
        </span>
      </div>

      <div className="ui-ags__panel-acts">
        {onRunNow && (
          <button type="button" className="ui-ags__btn ui-ags__btn--dark" disabled={disableRun} onClick={onRunNow}>
            <Icon name="play" size={14} />
            <span>{isRunning && runDisabled === undefined ? labels.runningNow : labels.runNow}</span>
          </button>
        )}
        {onPause && (
          <button
            type="button"
            className="ui-ags__btn"
            disabled={actionsDisabled}
            onClick={() => onPause(!schedule.paused)}
          >
            <Icon name={schedule.paused ? "play" : "pause"} size={14} />
            <span>{schedule.paused ? labels.panelResume : labels.panelPause}</span>
          </button>
        )}
        {extraActions}
        {schedule.cost != null && (
          <span className="ui-ags__faint ui-ags__num ui-ags__panel-cost">
            {scheduleCurrency.format(schedule.cost)} {labels.perRun}
          </span>
        )}
      </div>

      {error != null && (
        <div className="ui-ags__panel-error" role="alert">
          {error}
        </div>
      )}

      {schedule.facts && schedule.facts.length > 0 && (
        <section className="ui-ags__section" aria-label={labels.details}>
          <h3 className="ui-ags__label">{labels.details}</h3>
          <dl className="ui-ags__card ui-ags__facts">
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
        <section className="ui-ags__section" aria-label={labels.what}>
          <h3 className="ui-ags__label">{labels.what}</h3>
          <SchedulePromptExcerpt text={schedule.prompt} labels={labels} />
        </section>
      )}

      <section className="ui-ags__section" aria-label={labels.nextRuns}>
        <h3 className="ui-ags__label">{labels.nextRuns}</h3>
        {schedule.paused ? (
          <p className="ui-ags__note">{labels.paused}</p>
        ) : schedule.nextRunNode ? (
          <div className="ui-ags__card ui-ags__list">
            <div className="ui-ags__list-single">{schedule.nextRunNode}</div>
          </div>
        ) : upcoming.length > 0 ? (
          <ul className="ui-ags__card ui-ags__list">
            {upcoming.map((at) => {
              const isSkipped = skipped.includes(scheduleSkipKey(schedule.id, at));
              return (
                <li key={at} data-skipped={isSkipped || undefined}>
                  <span className="ui-ags__list-when ui-ags__num">{scheduleWhen(at, now)}</span>
                  <span className="ui-ags__faint ui-ags__num">
                    {isSkipped ? labels.skipped : scheduleRelative(at, now)}
                  </span>
                  {onSkip && (
                    <button
                      type="button"
                      className="ui-ags__link"
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
          <p className="ui-ags__note">{labels.noRuns}</p>
        )}
      </section>

      <section className="ui-ags__section" aria-label={labels.lastRuns}>
        <h3 className="ui-ags__label">{labels.lastRuns}</h3>
        {history.length > 0 ? (
          <ul className="ui-ags__card ui-ags__history">
            {history.map((entry, idx) => (
              <li key={entry.id ?? `${entry.at}-${idx}`}>
                <span className="ui-ags__history-text">
                  <span className="ui-ags__history-summary" dir="auto" title={entry.summary}>
                    {entry.summary}
                  </span>
                  <span className="ui-ags__faint ui-ags__num">
                    {scheduleWhen(entry.at, now)}
                    {entry.cost == null ? "" : ` · ${scheduleCurrency.format(entry.cost)}`}
                  </span>
                </span>
                {entry.action}
                <span className="ui-ags__badge" data-outcome={entry.outcome}>
                  {entry.outcome === "done" ? labels.done : entry.outcome === "needs" ? labels.needs : labels.failed}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ui-ags__note">{labels.noRuns}</p>
        )}
      </section>
    </div>
  );
}

export function createDefaultAgentSchedules(now = Date.now()): AgentSchedule[] {
  const min = 60000;
  const hour = 60 * min;
  const day = 24 * hour;
  const atHour = (h: number, m: number, offsetDays = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offsetDays);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };
  const series = (h: number, m: number, filter: (dow: number) => boolean = () => true, past = 1, future = 4) => {
    const all: number[] = [];
    for (let offset = -7; offset <= 14 && all.filter((t) => t > now).length < future; offset++) {
      const ts = atHour(h, m, offset);
      if (filter(new Date(ts).getDay())) all.push(ts);
    }
    return [...all.filter((t) => t <= now).slice(-past), ...all.filter((t) => t > now)];
  };
  const weekday = (dow: number) => dow >= 1 && dow <= 5;
  const soon = now + 6000;
  const biHourly: number[] = [];
  for (let d = 0; d <= 1; d++) for (let h = 8; h <= 20; h += 2) biHourly.push(atHour(h, 0, d));
  const firstOfNextMonth = (() => {
    const d = new Date(now);
    d.setMonth(d.getMonth() + 1, 1);
    d.setHours(9, 0, 0, 0);
    return d.getTime();
  })();
  const fridays = series(16, 0, (dow) => dow === 5, 1, 2);
  const lastBefore = (runs: number[]) => runs.filter((t) => t <= now).pop() ?? now - 7 * day;
  const mornings = series(7, 45, weekday);
  const standups = series(16, 30, weekday);
  const nightly = series(2, 0);
  const dayFmt = new Intl.DateTimeFormat("en", { weekday: "long" });
  const hmFmt = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", hour12: false });

  return [
    {
      id: "scan",
      name: "Competitor scan",
      project: "Northwind",
      tone: "orange",
      prompt:
        "Check the nine makers' sites and shops for new prices, models and campaigns – and tell me what changed since last week.",
      cadence: `Every ${dayFmt.format(soon)} at ${hmFmt.format(soon)}`,
      runs: [soon - 7 * day, soon, soon + 7 * day],
      duration: 9000,
      cost: 3.1,
      history: [
        { at: soon - 7 * day, outcome: "done", summary: "2 makers cut prices, 1 new model", cost: 3.42 },
        { at: soon - 14 * day, outcome: "done", summary: "Nothing changed", cost: 2.8 },
        { at: soon - 21 * day, outcome: "failed", summary: "Three shops blocked the browser", cost: 1.2 },
      ],
    },
    {
      id: "triage",
      name: "Inbox triage",
      project: "Platform",
      tone: "purple",
      prompt: "Sort new support emails: answer the easy ones, label the rest and put anything urgent in my Inbox.",
      cadence: "Every 2 hours, 8:00 – 20:00",
      runs: biHourly,
      duration: 2 * min,
      cost: 0.18,
      history: [
        { at: lastBefore(biHourly), outcome: "done", summary: "Answered 6, labeled 11", cost: 0.21 },
        {
          at: lastBefore(biHourly) - 2 * hour,
          outcome: "needs",
          summary: "1 refund over 50 € waits for you",
          cost: 0.16,
        },
      ],
    },
    {
      id: "numbers",
      name: "Northwind numbers",
      project: "Northwind",
      tone: "orange",
      prompt: "Refresh the client dashboard so it's ready before their team opens it at 8:30.",
      cadence: "Every weekday at 7:45",
      runs: mornings,
      duration: 4 * min,
      cost: 0.42,
      history: [{ at: lastBefore(mornings), outcome: "done", summary: "Dashboard ready 4 minutes later", cost: 0.4 }],
    },
    {
      id: "standup",
      name: "Standup notes",
      project: "Platform",
      tone: "purple",
      prompt: "Collect what moved since yesterday from GitHub and Slack and post a short note in #platform.",
      cadence: "Every weekday at 16:30",
      runs: standups,
      duration: 3 * min,
      cost: 0.26,
      history: [{ at: lastBefore(standups), outcome: "done", summary: "Posted in #platform", cost: 0.24 }],
    },
    {
      id: "weekly",
      name: "Weekly update",
      project: "Northwind",
      tone: "orange",
      prompt: "Draft the weekly update for Priya – what shipped, what needs her answer – and ask me before sending it.",
      cadence: "Every Friday at 16:00",
      runs: fridays,
      cost: 0.55,
      history: [{ at: lastBefore(fridays), outcome: "needs", summary: "Draft waits for your OK", cost: 0.51 }],
    },
    {
      id: "evals",
      name: "Nightly evals",
      project: "Evalkit",
      tone: "teal",
      prompt: "Run the benchmark suite on the latest build and post the scores.",
      cadence: "Every night at 2:00",
      runs: nightly,
      paused: true,
      cost: 4.8,
      history: [{ at: lastBefore(nightly), outcome: "done", summary: "Scores up 1.2 on average", cost: 5.1 }],
    },
    {
      id: "invoices",
      name: "Invoice reminders",
      project: "Internal",
      tone: "gray",
      prompt: "Remind clients whose invoices are more than 14 days late – politely, once.",
      cadence: "On the 1st of every month",
      runs: [firstOfNextMonth],
      cost: 0.3,
      history: [
        { at: firstOfNextMonth - 31 * day, outcome: "failed", summary: "Stripe didn't answer – try again", cost: 0.02 },
      ],
    },
  ];
}

export type AgentSchedulesScreenProps = Omit<
  AppShellProps,
  "children" | "panel" | "panelTitle" | "navigation" | "onSelect" | "onPause"
> & {
  schedules?: AgentSchedule[];
  defaultSchedules?: AgentSchedule[];
  onSchedulesChange?: (schedules: AgentSchedule[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onPause?: (id: string, paused: boolean) => void;
  onRunNow?: (id: string) => void;
  onSkip?: (id: string, at: number, skipped: boolean) => void;
  managed?: boolean;
  loading?: boolean;
  labels?: AgentSchedulesLabels;
  headerAction?: ReactNode;
  editor?: ReactNode;
  extraInspectorActions?: ReactNode;
  inspectorError?: ReactNode;
  runDisabled?: boolean;
  actionsDisabled?: boolean;
  now?: number;
};

/** Full Agent / Schedules screen with AppShell, Around Now timeline, schedule list, and right-rail ScheduleInspector. */
export function AgentSchedulesScreen({
  workspace = "Fieldwork",
  schedules: schedulesProp,
  defaultSchedules,
  onSchedulesChange,
  selected: selectedProp,
  defaultSelected = "scan",
  onSelectedChange,
  onSelect,
  onPause,
  onRunNow,
  onSkip,
  managed = false,
  loading = false,
  labels,
  headerAction,
  editor,
  extraInspectorActions,
  inspectorError,
  runDisabled,
  actionsDisabled,
  now: nowProp,
  panelOpen: panelProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  onNavigate,
  className,
  style,
  ...shellProps
}: AgentSchedulesScreenProps) {
  const [initialSchedules] = useState(() => defaultSchedules ?? schedulesProp ?? createDefaultAgentSchedules());
  const [schedules, setSchedules] = useControllable(schedulesProp, initialSchedules, onSchedulesChange);
  const [selected, setSelected] = useControllable<string | null>(selectedProp, defaultSelected, onSelectedChange);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [clock, setClock] = useState(() => Date.now());
  const [panelOpen, setPanelOpen] = useControllable(panelProp, defaultPanelOpen, onPanelOpenChange);

  const now = safeNumber(nowProp, clock);
  const mergedLabels = mergeScheduleLabels(labels);
  const current = schedules.find((s) => s.id === selected) ?? null;

  const announce = (text: string) => {
    setNotice("");
    window.setTimeout(() => setNotice(text), 30);
  };

  const handlePause = (id: string, paused: boolean) => {
    const target = schedules.find((s) => s.id === id);
    if (!target) return;
    if (!managed) {
      setSchedules(schedules.map((s) => (s.id === id ? { ...s, paused } : s)));
      announce(`${target.name}: ${paused ? mergedLabels.paused : mergedLabels.resume}`);
    }
    onPause?.(id, paused);
  };

  const handleRunNow = (id: string) => {
    const target = schedules.find((s) => s.id === id);
    if (!target) return;
    if (!managed) {
      const ts = Date.now();
      setSchedules(
        schedules.map((s) => (s.id === id ? { ...s, runs: [...s.runs, ts], duration: s.duration ?? 8000 } : s)),
      );
      setClock(ts);
      announce(`${target.name}: ${mergedLabels.runningNow}`);
    }
    onRunNow?.(id);
  };

  const handleSkip = (id: string, at: number) => {
    const key = scheduleSkipKey(id, at);
    const wasSkipped = skipped.includes(key);
    if (!managed) {
      setSkipped((prev) => (wasSkipped ? prev.filter((item) => item !== key) : [...prev, key]));
    }
    onSkip?.(id, at, !wasSkipped);
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    setPanelOpen(true);
    onSelect?.(id);
  };

  const navigation: AppRailItem[] = [
    { label: "Thread", icon: <Icon name="chat" /> },
    { label: "Inbox", icon: <Icon name="inbox" />, count: 5 },
    { label: "Tasks", icon: <Icon name="tasks" /> },
    { label: "Memory", icon: <Icon name="memory" /> },
    { label: "Schedules", icon: <Icon name="calendar" />, section: "Workspace" },
    { label: "Activity", icon: <Icon name="tasks" />, section: "Workspace" },
    { label: "Usage", icon: <Icon name="chart" />, section: "Workspace" },
    { label: "Permissions", icon: <Icon name="shield" />, section: "Workspace" },
    { label: "Settings", icon: <Icon name="settings" />, section: "Workspace" },
  ];

  const tabs: ArtifactWorkspaceTab[] = [
    {
      id: "schedule",
      label: (!loading && current?.name) || mergedLabels.schedules,
      icon: <Icon name="repeat" size={14} />,
      content: (
        <ScheduleInspector
          key={current?.id ?? "empty"}
          schedule={current}
          loading={loading}
          skipped={skipped}
          labels={mergedLabels}
          runDisabled={runDisabled}
          actionsDisabled={actionsDisabled}
          extraActions={extraInspectorActions}
          error={inspectorError}
          now={now}
          onPause={current ? (paused) => handlePause(current.id, paused) : undefined}
          onRunNow={current ? () => handleRunNow(current.id) : undefined}
          onSkip={current ? (at) => handleSkip(current.id, at) : undefined}
        />
      ),
    },
  ];

  return (
    <div className={["ui-sbs__frame", className].filter(Boolean).join(" ")} style={style}>
      <style href="ui-agent-schedules" precedence="default">
        {css}
      </style>
      <AppShell
        {...shellProps}
        workspace={workspace}
        className="ui-sbs__shell"
        defaultChats={shellProps.defaultChats ?? []}
        defaultActive={shellProps.defaultActive ?? "Schedules"}
        navigation={navigation}
        onNavigate={onNavigate}
        panelOpen={panelOpen}
        onPanelOpenChange={setPanelOpen}
        defaultPanelWidth={shellProps.defaultPanelWidth ?? 380}
        panelTitle="Schedule"
        panel={
          <ArtifactWorkspace
            files={[]}
            openFiles={["schedule"]}
            activeFile="schedule"
            tabs={tabs}
            onClose={() => setPanelOpen(false)}
            closeLabel="Close schedule"
          />
        }
      >
        <ScheduleBoard
          schedules={schedules}
          selected={selected}
          onSelect={handleSelect}
          onPause={handlePause}
          skipped={skipped}
          labels={mergedLabels}
          loading={loading}
          now={nowProp}
          headerAction={headerAction}
          editor={editor}
          notice={notice}
        />
      </AppShell>
    </div>
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
.ui-as__menu .ui-as__wsm-item[data-danger],
.ui-as__menu .ui-as__wsm-item[data-danger] > svg {
  color: #e5484d;
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
:where(.dark, [data-theme="dark"]) .ui-as__menu .ui-as__wsm-item[data-danger],
:where(.dark, [data-theme="dark"]) .ui-as__menu .ui-as__wsm-item[data-danger] > svg {
  color: #ff6369;
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

.ui-wst {
  --ui-wst-card: #fff;
  --ui-wst-ink: rgba(0, 0, 0, 0.88);
  --ui-wst-muted: rgba(0, 0, 0, 0.45);
  --ui-wst-faint: rgba(0, 0, 0, 0.27);
  --ui-wst-line: rgba(0, 0, 0, 0.06);
  --ui-wst-fill: rgba(0, 0, 0, 0.04);
  --ui-wst-focus: #0060e2;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  color: var(--ui-wst-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-wst / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-wst,
.ui-wst *,
.ui-wst *::before,
.ui-wst *::after {
  box-sizing: border-box;
}
.ui-wst button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-wst button:focus-visible {
  outline: 2px solid var(--ui-wst-focus);
  outline-offset: -2px;
}
.ui-wst button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-wst__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--ui-wst-card);
  box-shadow:
    0 0 0 0.5px var(--ui-wst-line),
    0 1px 2px rgba(0, 0, 0, 0.04);
  color: var(--ui-wst-faint);
  margin-bottom: 22px;
}
.ui-wst__search input {
  flex: 1;
  min-width: 0;
  width: 0;
  border: 0;
  outline: none;
  background: none;
  color: var(--ui-wst-ink);
  font: inherit;
}
.ui-wst__search:focus-within {
  box-shadow: 0 0 0 0.5px var(--ui-wst-muted);
}
.ui-wst__search input::placeholder {
  color: var(--ui-wst-faint);
}
.ui-wst h2 {
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-wst-muted);
  margin: 0 4px 8px;
}
.ui-wst__card {
  border-radius: 12px;
  box-shadow:
    0 0 0 0.5px var(--ui-wst-line),
    0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 2px 10px;
  margin-bottom: 22px;
}
.ui-wst__tool,
.ui-wst__source {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  text-align: left;
  padding: 8px 0 !important;
}
.ui-wst__tool + .ui-wst__tool,
.ui-wst__source + .ui-wst__source {
  border-top: 0.5px solid var(--ui-wst-line) !important;
}
.ui-wst__tool:hover,
.ui-wst__source:hover {
  background: var(--ui-wst-fill);
}
.ui-wst__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ui-wst-fill);
  color: var(--ui-wst-muted);
}
.ui-wst__icon[data-kind="folder"] {
  color: #e8b000;
}
.ui-wst__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-wst__icon[data-kind="document"] {
  color: #2989df;
}
.ui-wst__tool > kbd {
  font: 11px/20px inherit;
  font-family: inherit;
  background: var(--ui-wst-fill);
  border-radius: 5px;
  padding: 0 5px;
  color: var(--ui-wst-faint);
  margin-left: auto;
}
.ui-wst__source > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-wst__source strong {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-wst__source small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-wst-muted);
}
.ui-wst__empty {
  font-size: 12px;
  color: var(--ui-wst-muted);
  padding: 12px 0;
  margin: 0;
}
.ui-wst__tool-pane {
  display: flex;
  flex-direction: column;
}
.ui-wst__tool-pane[data-tool="notes"] textarea {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 0;
  background: none;
  resize: none;
  outline: none;
  font:
    13px/1.7 "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  color: var(--ui-wst-ink);
}
.ui-wst__terminal-output {
  flex: 1;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font:
    12px/1.8 ui-monospace,
    "SF Mono",
    Menlo,
    monospace;
}
.ui-wst__command {
  display: flex;
  align-items: center;
  gap: 8px;
  font:
    12px/1.8 ui-monospace,
    "SF Mono",
    Menlo,
    monospace;
  padding-top: 8px;
}
.ui-wst__command input {
  width: 0;
  flex: 1;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
}
.ui-wst__browser-home {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ui-wst-faint);
  gap: 12px;
}
.ui-wst__browser-home h2 {
  font-size: 18px;
  margin: 0;
}
.ui-wst__browser-home p {
  font-size: 12px;
  margin: 0;
}
.ui-wst__search > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
}
@media (pointer: coarse) {
  .ui-wst__search {
    min-height: 40px;
  }
  .ui-wst input,
  .ui-wst textarea {
    font-size: 16px;
  }
  .ui-wst__tool,
  .ui-wst__source {
    min-height: 48px;
  }
  .ui-wst__tool > kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wst,
  .ui-wst * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-wst {
  --ui-wst-card: #1c1c1e;
  --ui-wst-ink: rgba(255, 255, 255, 0.9);
  --ui-wst-muted: rgba(255, 255, 255, 0.46);
  --ui-wst-faint: rgba(255, 255, 255, 0.3);
  --ui-wst-line: rgba(255, 255, 255, 0.08);
  --ui-wst-fill: rgba(255, 255, 255, 0.06);
  --ui-wst-focus: #4d8dff;
}

.ui-ags,
.ui-ags__panel {
  --ui-ags-card: #fff;
  --ui-ags-panel: #fcfcfc;
  --ui-ags-ink: rgba(0, 0, 0, 0.88);
  --ui-ags-text: rgba(0, 0, 0, 0.61);
  --ui-ags-muted: rgba(0, 0, 0, 0.45);
  --ui-ags-faint: rgba(0, 0, 0, 0.27);
  --ui-ags-line: rgba(0, 0, 0, 0.06);
  --ui-ags-chip-bg: rgba(0, 0, 0, 0.04);
  --ui-ags-hover: rgba(0, 0, 0, 0.025);
  --ui-ags-focus: rgba(0, 96, 226, 0.7);
  --ui-ags-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ui-ags-card-shadow:
    0 0 0 0.5px var(--ui-ags-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-ags-blue: #0190fe;
  --ui-ags-c-purple: #a651f0;
  --ui-ags-c-orange: #f28a2e;
  --ui-ags-c-teal: #13b3a0;
  --ui-ags-c-blue: #0190fe;
  --ui-ags-c-amber: #e8b000;
  --ui-ags-c-pink: #ee3e9e;
  --ui-ags-c-green: #5fc88a;
  --ui-ags-c-gray: rgba(0, 0, 0, 0.3);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ags-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-ags,
.ui-ags *,
.ui-ags *::before,
.ui-ags *::after,
.ui-ags__panel,
.ui-ags__panel *,
.ui-ags__panel *::before,
.ui-ags__panel *::after {
  box-sizing: border-box;
}
:is(.ui-ags, .ui-ags__panel) :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
:is(.ui-ags, .ui-ags__panel) :focus-visible {
  outline: 2px solid var(--ui-ags-focus);
  outline-offset: 2px;
}
.ui-ags {
  position: relative;
  container: ui-ags / inline-size;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--ui-ags-panel);
}
.ui-ags__num {
  font-variant-numeric: tabular-nums;
}
.ui-ags__faint {
  color: var(--ui-ags-faint);
}
.ui-ags__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-ags__head {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 48px;
  padding: 0 16px 0 20px;
  box-shadow: inset 0 -0.5px 0 var(--ui-ags-line);
  font-size: 13px;
}
.ui-ags__head-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.ui-ags__head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}
.ui-ags__title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-ags-ink);
}
.ui-ags__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-ags-line) transparent;
}
.ui-ags__page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 48px;
}
.ui-ags__section {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}
.ui-ags__label {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-ags-muted);
}
.ui-ags__card {
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-ags-card);
  box-shadow: var(--ui-ags-card-shadow);
}
.ui-ags__empty {
  display: grid;
  place-items: center;
  padding: 40px 16px;
}
.ui-ags__empty-body {
  display: grid;
  gap: 4px;
  max-width: 360px;
  text-align: center;
}
.ui-ags__empty-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-ags-ink);
}
.ui-ags__empty-text {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-muted);
}
.ui-ags__line {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
}
.ui-ags__line-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--ui-ags-muted);
}
.ui-ags__line-top b {
  font-weight: 500;
  color: var(--ui-ags-ink);
}
.ui-ags__chart {
  position: relative;
  contain: inline-size;
}
.ui-ags__chart svg {
  display: block;
  overflow: visible;
}
.ui-ags__chart-grid {
  stroke: var(--ui-ags-line);
  stroke-width: 1;
  opacity: 0.4;
}
.ui-ags__chart-base {
  stroke: var(--ui-ags-line);
  stroke-width: 1;
}
.ui-ags__chart-line {
  fill: none;
  stroke: var(--ui-ags-blue);
  stroke-width: 1.75;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.ui-ags__chart-head {
  fill: var(--ui-ags-blue);
  stroke: var(--ui-ags-card);
  stroke-width: 1.5;
}
.ui-ags__chart-glow {
  fill: var(--ui-ags-blue);
  opacity: 0.18;
  transform-box: fill-box;
  transform-origin: center;
  animation: ui-ags-glow 2200ms ease-in-out infinite;
}
.ui-ags__tick {
  font:
    400 11px "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  fill: var(--ui-ags-faint);
}
.ui-ags__marker line {
  stroke: var(--ui-ags-tone);
  stroke-width: 1;
  opacity: 0.55;
}
.ui-ags__marker rect {
  fill: var(--ui-ags-tone);
}
.ui-ags__marker[data-failed] line {
  stroke: #f04438;
  opacity: 0.8;
}
.ui-ags__marker[data-failed] rect {
  fill: #f04438;
}
.ui-ags__marker[data-state="next"] line {
  stroke-dasharray: 2 3;
  opacity: 0.45;
}
.ui-ags__marker[data-state="next"] circle {
  fill: var(--ui-ags-card);
  stroke: var(--ui-ags-tone);
  stroke-width: 1.5;
}
.ui-ags__marker[data-state="running"] line {
  opacity: 0.9;
}
.ui-ags__mark {
  position: absolute;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  padding: 0;
  border-radius: 6px;
}
.ui-ags__mark:hover {
  background: color-mix(in srgb, var(--ui-ags-ink) 6%, transparent);
}
.ui-ags__mark:focus-visible {
  outline-offset: -2px;
}
.ui-ags__chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 220px;
  padding: 3px 9px 3px 8px;
  border-radius: 7px;
  background: var(--ui-ags-card);
  box-shadow:
    0 0 0 0.5px var(--ui-ags-line),
    0 6px 16px -6px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-ags-ink);
  white-space: nowrap;
  transform: translateX(10px);
  animation: ui-ags-chip 320ms var(--ui-ags-out) both;
  pointer-events: none;
}
.ui-ags__chip[data-flip] {
  transform: translateX(calc(-100% - 10px));
}
.ui-ags__chip-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.ui-ags__line-say {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-text);
  white-space: nowrap;
}
.ui-ags__line-say b {
  font-weight: 500;
  color: var(--ui-ags-ink);
}
.ui-ags__line-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-ags__live {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ui-ags-blue);
  animation: ui-ags-blink 1200ms ease-in-out infinite;
}
.ui-ags__rows {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  margin: 0 -10px;
  padding: 0;
  list-style: none;
}
.ui-ags__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 10px;
  border-radius: 10px;
  transition: background-color 140ms ease;
}
.ui-ags__row:hover {
  background: var(--ui-ags-hover);
}
.ui-ags__row[data-selected] {
  background: color-mix(in srgb, var(--ui-ags-ink) 4%, var(--ui-ags-card));
}
.ui-ags__row-main {
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
.ui-ags__row-main:focus-visible {
  outline-offset: -2px;
}
.ui-ags__row-mark {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--ui-ags-tone);
}
.ui-ags__row[data-paused] .ui-ags__row-mark,
.ui-ags__row-mark[data-paused] {
  background: none;
  box-shadow: inset 0 0 0 1.5px var(--ui-ags-tone);
}
.ui-ags__row-text {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.ui-ags__row-name {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-ags-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ags__row[data-paused] .ui-ags__row-name {
  color: var(--ui-ags-text);
}
.ui-ags__row-cadence {
  flex: 0 100 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ags__row-nextline {
  display: none;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ags-ink);
}
.ui-ags__row-next {
  display: flex;
  flex: none;
  align-items: baseline;
  justify-content: flex-end;
  gap: 6px;
  width: 184px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-ink);
  white-space: nowrap;
}
.ui-ags__row-rel {
  font-size: 12px;
}
.ui-ags__row-last {
  display: flex;
  flex: none;
  justify-content: flex-end;
  width: 78px;
}
.ui-ags__row-cost {
  flex: none;
  width: 60px;
  white-space: nowrap;
  font-size: 12px;
  color: var(--ui-ags-muted);
  text-align: right;
}
.ui-ags__badge {
  flex: none;
  padding: 0 6px;
  border-radius: 4px;
  background: var(--ui-ags-chip-bg);
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  color: var(--ui-ags-muted);
  white-space: nowrap;
}
.ui-ags__badge[data-outcome="needs"] {
  background: rgba(255, 156, 0, 0.14);
  color: #b25e00;
}
.ui-ags__badge[data-outcome="failed"] {
  background: color-mix(in srgb, #f04438 13%, var(--ui-ags-card));
  color: #c4320a;
}
.ui-ags__switch {
  position: relative;
  flex: none;
  width: 30px;
  height: 18px;
  padding: 0;
  border-radius: 9px;
  background: color-mix(in srgb, var(--ui-ags-ink) 16%, var(--ui-ags-card));
  transition: background-color 200ms ease;
}
.ui-ags__switch[aria-checked="true"] {
  background: var(--ui-ags-blue);
}
.ui-ags__switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 240ms var(--ui-ags-out);
}
.ui-ags__switch[aria-checked="true"] .ui-ags__switch-knob {
  transform: translateX(12px);
}
.ui-ags__btn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px 0 8px;
  border-radius: 6px;
  background: var(--ui-ags-card);
  box-shadow: var(--ui-ags-card-shadow);
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-ags-ink);
  text-decoration: none;
  white-space: nowrap;
  transition:
    box-shadow 140ms ease,
    filter 140ms ease,
    opacity 140ms ease,
    transform 140ms ease;
}
.ui-ags__btn:hover {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.06);
}
.ui-ags__btn > svg {
  flex: none;
  color: var(--ui-ags-muted);
}
.ui-ags__btn--dark {
  background: var(--ui-ags-ink);
  box-shadow: none;
  color: var(--ui-ags-card);
}
.ui-ags__btn--dark > svg {
  color: inherit;
}
.ui-ags__btn--dark:hover {
  box-shadow: none;
  filter: brightness(1.15);
}
.ui-ags__btn:disabled {
  opacity: 0.5;
  cursor: default;
  filter: none;
}
.ui-ags__btn:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ags__panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  min-height: 0;
  padding: 16px 18px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  container: ui-ags-panel / inline-size;
}
.ui-ags__panel--empty {
  display: grid;
  min-height: 240px;
  place-items: center;
}
.ui-ags__panel :focus-visible {
  outline-offset: -2px;
}
.ui-ags__panel-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.ui-ags__panel-head .ui-ags__row-mark {
  margin-top: 7px;
}
.ui-ags__panel-titles {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.ui-ags__panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  color: var(--ui-ags-ink);
  overflow-wrap: anywhere;
}
.ui-ags__panel-sub {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ags-muted);
}
.ui-ags__panel-sub > svg {
  flex: none;
}
.ui-ags__panel-sub > span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-ags__panel-acts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: -6px;
}
.ui-ags__panel-cost {
  margin-left: auto;
  font-size: 12px;
}
.ui-ags__panel-error {
  margin-top: -6px;
  font-size: 13px;
  line-height: 20px;
  color: #c4320a;
}
.ui-ags__facts {
  padding: 4px 12px;
}
.ui-ags__facts > div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  column-gap: 10px;
  align-items: center;
  min-height: 34px;
  font-size: 12px;
}
.ui-ags__facts > div + div {
  box-shadow: inset 0 0.5px 0 var(--ui-ags-line);
}
.ui-ags__facts dt {
  color: var(--ui-ags-muted);
}
.ui-ags__facts dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-ags-ink);
}
.ui-ags__prompt-wrap {
  display: grid;
  justify-items: start;
  gap: 4px;
}
.ui-ags__prompt-wrap .ui-ags__link {
  margin-left: 2px;
}
.ui-ags__prompt:not([data-open]) {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
.ui-ags__prompt {
  margin: 0;
  padding-left: 10px;
  box-shadow: inset 2px 0 0 var(--ui-ags-line);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-text);
  overflow-wrap: anywhere;
  white-space: pre-line;
}
.ui-ags__list {
  padding: 2px 12px;
}
.ui-ags__list li,
.ui-ags__list-single {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  font-size: 13px;
}
.ui-ags__list li + li {
  box-shadow: inset 0 0.5px 0 var(--ui-ags-line);
}
.ui-ags__list-when {
  color: var(--ui-ags-ink);
}
.ui-ags__list li[data-skipped] .ui-ags__list-when {
  color: var(--ui-ags-faint);
  text-decoration: line-through;
}
.ui-ags__list li > .ui-ags__faint {
  flex: 1;
  font-size: 12px;
}
.ui-ags__link {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--ui-ags-muted);
  text-decoration: none;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-ags__link:hover {
  background: var(--ui-ags-chip-bg);
  color: var(--ui-ags-ink);
}
.ui-ags__history {
  padding: 2px 12px;
}
.ui-ags__history li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}
.ui-ags__history li + li {
  box-shadow: inset 0 0.5px 0 var(--ui-ags-line);
}
.ui-ags__history-text {
  display: grid;
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
}
.ui-ags__history-summary {
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ags-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ags__note {
  margin: 0;
  font-size: 13px;
  color: var(--ui-ags-faint);
}
:is(.ui-ags, .ui-ags__panel) [data-skel] {
  pointer-events: none;
}
.ui-ags__skel {
  display: inline-block;
  background: var(--ui-ags-chip-bg);
  animation: ui-ags-blink 1400ms ease-in-out infinite;
}
.ui-ags__skel-mark {
  margin-top: 7px;
}
.ui-ags__skel-chart {
  height: 136px;
  padding: 10px 0 22px;
}
@container ui-as (max-width:899.99px) {
  .ui-ags__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@container ui-ags (max-width:639.99px) {
  .ui-ags__page {
    padding: 16px 16px 40px;
    gap: 24px;
  }
  .ui-ags__row-cost,
  .ui-ags__row-last,
  .ui-ags__row-rel {
    display: none;
  }
  .ui-ags__row-next {
    width: auto;
  }
}
@container ui-ags (max-width:439.99px) {
  .ui-ags__row-main {
    min-height: 56px;
    padding: 8px 0 8px 12px;
  }
  .ui-ags__row-main > .ui-ags__row-mark {
    align-self: flex-start;
    margin-top: 6px;
  }
  .ui-ags__row-text {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .ui-ags__row-cadence,
  .ui-ags__row-nextline {
    font-size: 12px;
    line-height: 16px;
  }
  .ui-ags__row-next {
    display: none;
  }
  .ui-ags__row-nextline {
    display: block;
  }
}
@keyframes ui-ags-glow {
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
@keyframes ui-ags-chip {
  from {
    opacity: 0;
  }
}
@keyframes ui-ags-blink {
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ags,
  .ui-ags *,
  .ui-ags__panel,
  .ui-ags__panel * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
@media (pointer: coarse) {
  .ui-ags__btn,
  .ui-ags__link {
    min-height: 36px;
  }
  .ui-ags__switch {
    width: 40px;
    height: 24px;
    border-radius: 12px;
  }
  .ui-ags__switch-knob {
    width: 20px;
    height: 20px;
  }
  .ui-ags__switch[aria-checked="true"] .ui-ags__switch-knob {
    transform: translateX(16px);
  }
}
:where(.dark, [data-theme="dark"]) :is(.ui-ags, .ui-ags__panel) {
  --ui-ags-card: #1c1c1e;
  --ui-ags-panel: #161618;
  --ui-ags-ink: rgba(255, 255, 255, 0.9);
  --ui-ags-text: rgba(255, 255, 255, 0.62);
  --ui-ags-muted: rgba(255, 255, 255, 0.46);
  --ui-ags-faint: rgba(255, 255, 255, 0.3);
  --ui-ags-line: rgba(255, 255, 255, 0.08);
  --ui-ags-chip-bg: rgba(255, 255, 255, 0.06);
  --ui-ags-hover: rgba(255, 255, 255, 0.03);
  --ui-ags-focus: rgba(77, 141, 255, 0.8);
  --ui-ags-card-shadow: 0 0 0 0.5px var(--ui-ags-line), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --ui-ags-blue: #4fb0fe;
  --ui-ags-c-purple: #b98af0;
  --ui-ags-c-orange: #f2a15c;
  --ui-ags-c-teal: #4fc3b4;
  --ui-ags-c-blue: #4fb0fe;
  --ui-ags-c-amber: #e6c24d;
  --ui-ags-c-pink: #f06db5;
  --ui-ags-c-green: #7dcf9f;
  --ui-ags-c-gray: rgba(255, 255, 255, 0.32);
}
:where(.dark, [data-theme="dark"]) .ui-ags__badge[data-outcome="needs"] {
  color: #ffb35c;
}
:where(.dark, [data-theme="dark"]) .ui-ags__badge[data-outcome="failed"] {
  color: #ff8a7a;
}
:where(.dark, [data-theme="dark"]) .ui-ags__panel-error {
  color: #ff8a7a;
}

.ui-sbs__frame {
  width: 100%;
  height: 100%;
  min-height: 0;
  container: ui-sbs-frame / inline-size;
  font-family:
    "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ui-sbs__frame,
.ui-sbs__frame *,
.ui-sbs__frame *::before,
.ui-sbs__frame *::after {
  box-sizing: border-box;
}
.ui-sbs__shell {
  height: 100%;
}
@media (prefers-reduced-motion: reduce) {
  .ui-sbs__frame,
  .ui-sbs__frame * {
    scroll-behavior: auto !important;
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
.ui-wst {
  --ui-wst-ink: #171717;
  --ui-wst-muted: #737373;
  --ui-wst-faint: #b5b5b5;
  --ui-wst-line: #e5e5e5;
  --ui-wst-fill: #f5f5f5;
  --ui-wst-focus: #2f6bff;
  font-size: 14px;
}
.ui-wst__card {
  border: 1px solid var(--ui-wst-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
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
:where(.dark, [data-theme="dark"]) .ui-wst {
  --ui-wst-card: #232326;
  --ui-wst-ink: #ededed;
  --ui-wst-muted: #8f8f8f;
  --ui-wst-faint: #6b6b70;
  --ui-wst-line: rgba(255, 255, 255, 0.1);
  --ui-wst-fill: #2a2a2d;
  --ui-wst-focus: #6b95ff;
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
.ui-ags,
.ui-ags__panel {
  --ui-ags-card: #fff;
  --ui-ags-panel: #f7f7f7;
  --ui-ags-ink: #171717;
  --ui-ags-text: #404040;
  --ui-ags-muted: #737373;
  --ui-ags-faint: #b5b5b5;
  --ui-ags-line: #e5e5e5;
  --ui-ags-chip-bg: #f5f5f5;
  --ui-ags-hover: #f0f0f0;
  --ui-ags-focus: #2f6bff;
  --ui-ags-card-shadow: 0 0 0 1px var(--ui-ags-line), 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 14px;
}
.ui-ags__card {
  border-radius: 14px;
}
.ui-ags__btn {
  height: 32px;
  border-radius: 8px;
}
.ui-ags__head {
  height: 52px;
}
:where(.dark, [data-theme="dark"]) .ui-ags,
:where(.dark, [data-theme="dark"]) .ui-ags__panel {
  --ui-ags-card: #232326;
  --ui-ags-panel: #161618;
  --ui-ags-ink: #ededed;
  --ui-ags-text: #c4c4c4;
  --ui-ags-muted: #8f8f8f;
  --ui-ags-faint: #6b6b70;
  --ui-ags-line: rgba(255, 255, 255, 0.1);
  --ui-ags-chip-bg: #2a2a2d;
  --ui-ags-hover: #26262a;
  --ui-ags-focus: #6b95ff;
}

`;
