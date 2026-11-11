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
 * files (Classic) – a self-contained React 19 component.
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
      <style href="ui-files" precedence="default">
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
      <style href="ui-files" precedence="default">
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

export type FilesFolder = { id: string; name: string; shared: boolean; fileCount: number };
export type FilesTemplate = {
  id: string;
  name: string;
  type: "Document" | "PDF" | "Spreadsheet";
  owner: string;
  shared: boolean;
  mine: boolean;
};
export type FilesBrowserProps = {
  folders?: FilesFolder[];
  defaultFolders?: FilesFolder[];
  onFoldersChange?: (folders: FilesFolder[]) => void;
  templates?: FilesTemplate[];
  defaultTemplates?: FilesTemplate[];
  onTemplatesChange?: (templates: FilesTemplate[]) => void;
  onOpenFolder?: (folder: FilesFolder) => void;
  onOpenTemplate?: (template: FilesTemplate) => void;
  currentUser?: string;
  learnMoreHref?: string;
  className?: string;
};
export const defaultFilesFolders: FilesFolder[] = [
  { id: "brand", name: "Brand assets", shared: true, fileCount: 3 },
  { id: "hiring", name: "Hiring", shared: false, fileCount: 4 },
  { id: "campaign", name: "Q3 Campaign", shared: true, fileCount: 5 },
  { id: "research", name: "Research", shared: false, fileCount: 2 },
];
export const defaultFilesTemplates: FilesTemplate[] = [
  { id: "guidelines", name: "Brand-Guidelines", type: "PDF", owner: "Jonas Weber", shared: true, mine: false },
  { id: "budget", name: "Campaign-Budget", type: "Spreadsheet", owner: "Jonas Weber", shared: true, mine: false },
  { id: "design", name: "Design-Book", type: "Document", owner: "Alex Morgan", shared: false, mine: true },
  { id: "report", name: "Weekly-Report", type: "Spreadsheet", owner: "Alex Morgan", shared: false, mine: true },
];
const filesGlyphs = {
  sort: (
    <>
      <path d="M7 4v16M17 19V4M10 7s-2.21-3-3-3-3 3-3 3M20 17s-2.21 3-3 3-3-3-3-3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2.5" />
      <rect x="14" y="3" width="7" height="7" rx="2.5" />
      <rect x="3" y="14" width="7" height="7" rx="2.5" />
      <rect x="14" y="14" width="7" height="7" rx="2.5" />
    </>
  ),
  list: (
    <>
      <path d="M9 5h12M9 12h12M9 19h12" />
      <path d="M3 5h.01M3 12h.01M3 19h.01" strokeWidth="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m17 17 4 4" />
    </>
  ),
  filter: (
    <path d="M3.3 3.5C3.8 3 4.6 3 6.2 3h11.6c1.6 0 2.4 0 2.9.5s.3 1.3.1 2.9c0 .5-.2.7-.5 1.1-1 1.1-2.8 3.2-5.2 5-.3.2-.4.5-.4.8-.3 2.7-.5 4.2-.6 4.9-.3 1.3-2 2-2.9 2.7-.5.4-1.2-.1-1.3-.7-.1-1.2-.4-3.5-.6-6.9 0-.3-.2-.6-.4-.8-2.5-1.9-4.3-3.9-5.3-5-.3-.4-.4-.6-.5-1.1-.2-1.6-.3-2.4.2-2.9Z" />
  ),
  lock: (
    <>
      <path d="M12 14.5v3M16.5 9V6.5a4.5 4.5 0 0 0-9 0V9" />
      <rect x="4" y="9" width="16" height="13" rx="4" />
    </>
  ),
  shared: (
    <>
      <circle cx="14.5" cy="7" r="4" />
      <path d="M8 11a3 3 0 0 1 0-6M14.5 14C9.81 14 7 16.5 7 19c0 1.1.84 2 1.88 2h11.25c1.03 0 1.87-.9 1.87-2 0-2.5-2.81-5-7.5-5ZM4 20h-.5C2.67 20 2 19.23 2 18.28c0-1.61 1.27-3.22 3.5-3.92" />
    </>
  ),
};
function FilesGlyph({ name, size = 15 }: { name: keyof typeof filesGlyphs; size?: number }) {
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
      {filesGlyphs[name]}
    </svg>
  );
}
function FilesTabs({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null),
    [pill, setPill] = useState({ x: 0, width: 35 });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const button = root.querySelector<HTMLElement>('[aria-selected="true"]');
      if (button) setPill({ x: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div
      ref={ref}
      className="ui-fbr__tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={(event) => {
        const index = items.indexOf(value),
          next =
            event.key === "ArrowRight"
              ? (index + 1) % items.length
              : event.key === "ArrowLeft"
                ? (index - 1 + items.length) % items.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : -1;
        if (next < 0) return;
        event.preventDefault();
        const item = items[next];
        if (item) onChange(item);
        ref.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
      }}
    >
      <span
        className="ui-fbr__pill"
        aria-hidden="true"
        style={{ transform: `translateX(${pill.x}px)`, width: pill.width }}
      />
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={value === item}
          tabIndex={value === item ? 0 : -1}
          key={item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
function FilesSearch({
  kind,
  value,
  onChange,
}: {
  kind: "folders" | "templates";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <span className="ui-fbr__search">
      <FilesGlyph name="search" />
      <input
        type="search"
        aria-label={`Search ${kind}...`}
        placeholder={`Search ${kind}...`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" aria-label={`Clear ${kind} search`} onClick={() => onChange("")}>
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
function FilesSort({ descending, onChange }: { descending: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      className="ui-fbr__tool ui-fbr__sort"
      data-dir={descending ? "desc" : "asc"}
      aria-label={descending ? "Sorted Z to A – sort A to Z" : "Sorted A to Z – sort Z to A"}
      title={descending ? "Z–A" : "A–Z"}
      onClick={() => onChange(!descending)}
    >
      <FilesGlyph name="sort" />
    </button>
  );
}
function FilesFolderMark() {
  return (
    <svg className="ui-fbr__folder-mark" viewBox="0 0 67 67" fill="none" aria-hidden="true">
      <path
        d="M11.17 15.35v15.36h44.67v-6.98c0-3.86-3.13-6.98-6.98-6.98H33.5l-3.93-5.89a5.58 5.58 0 0 0-4.64-2.49h-6.78c-3.86 0-6.98 3.13-6.98 6.98Z"
        fill="#00A1FF"
      />
      <path
        d="M33.5 16.75l-3.93-5.89a5.58 5.58 0 0 0-4.64-2.49h-6.78c-3.86 0-6.98 3.13-6.98 6.98v15.36h44.67v-6.98c0-3.86-3.13-6.98-6.98-6.98H33.5Zm0 0h-9.77"
        stroke="#00A1FF"
        strokeWidth="4.19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.59 42.38c-1.05-5.26-1.57-7.89-.08-9.67l.31-.34c1.66-1.66 4.59-1.66 10.45-1.66h32.46c5.86 0 8.79 0 10.45 1.66l.31.34c1.49 1.78.97 4.41-.08 9.67-1.51 7.56-2.26 11.34-5.1 13.66l-.6.46c-3.01 2.13-7.23 2.13-15.66 2.13h-11.1c-8.43 0-12.64 0-15.66-2.13l-.6-.46c-2.84-2.32-3.6-6.1-5.1-13.66Z"
        fill="#3CC7FF"
        stroke="#3CC7FF"
        strokeWidth="4.19"
      />
    </svg>
  );
}
function FilesDocument({ type }: { type: FilesTemplate["type"] }) {
  const code = type === "PDF" ? "PDF" : type === "Spreadsheet" ? "XLS" : "DOC";
  const rows =
    type === "PDF"
      ? [[100], [48, 48], [31, 62]]
      : type === "Spreadsheet"
        ? Array.from({ length: 5 }, () => [31, 31, 31])
        : [[100], [31, 31, 31], [48, 48], [31, 31, 31], [24, 48, 24], [31, 31]];
  return (
    <span
      className="ui-fbr__doc"
      data-color={type === "PDF" ? "rose" : type === "Spreadsheet" ? "emerald" : "blue"}
      aria-hidden="true"
    >
      <span className="ui-fbr__art">
        <span className="ui-fbr__paper" data-type={code}>
          {type === "PDF" && <span className="ui-fbr__image" />}
          <span className="ui-fbr__rows">
            {rows.map((widths, row) => (
              <span className="ui-fbr__row" key={row}>
                {widths.map((width, col) => (
                  <i key={col} style={{ width: `${width}%` }} />
                ))}
              </span>
            ))}
          </span>
        </span>
        <span className="ui-fbr__type">{code}</span>
      </span>
    </span>
  );
}
function FilesEmpty({ folders, query }: { folders?: boolean; query?: string }) {
  return (
    <div className="ui-fbr__empty ui-fbr__rise">
      <span className="ui-fbr__empty-icon">
        <Icon name={folders ? "folder" : "document"} size={23} />
      </span>
      <b>No {folders ? "folders" : "templates"} found</b>
      <p>
        {folders
          ? query
            ? `Nothing matches “${query}”.`
            : "No folders in this tab yet."
          : "Try another tab, type or search."}
      </p>
    </div>
  );
}

/** Files overview with independent folder/template filters. Arrays may be caller-owned; open callbacks do not invent a destination. */
export function FilesBrowser({
  folders: foldersProp,
  defaultFolders = defaultFilesFolders,
  onFoldersChange,
  templates: templatesProp,
  defaultTemplates = defaultFilesTemplates,
  onTemplatesChange,
  onOpenFolder,
  onOpenTemplate,
  currentUser = "Alex Morgan",
  learnMoreHref = "#learn-more",
  className,
}: FilesBrowserProps) {
  const [folders, setFolders] = useControllable(foldersProp, defaultFolders, onFoldersChange),
    [templates, setTemplates] = useControllable(templatesProp, defaultTemplates, onTemplatesChange);
  const [folderTab, setFolderTab] = useState("All"),
    [templateTab, setTemplateTab] = useState("All"),
    [folderQuery, setFolderQuery] = useState(""),
    [templateQuery, setTemplateQuery] = useState("");
  const [folderDesc, setFolderDesc] = useState(false),
    [templateDesc, setTemplateDesc] = useState(false),
    [view, setView] = useState("grid"),
    [types, setTypes] = useState<FilesTemplate["type"][]>([]);
  const [filterOpen, setFilterOpen] = useState(false),
    [groupOpen, setGroupOpen] = useState(true);
  const root = useRef<HTMLDivElement>(null),
    filter = useRef<HTMLButtonElement>(null),
    popup = useRef<HTMLDivElement>(null),
    sequence = useRef(0),
    id = useId();
  useLayoutEffect(() => {
    if (!filterOpen) return;
    const update = () => {
      const button = filter.current,
        menu = popup.current;
      if (!button || !menu) return;
      const anchor = button.getBoundingClientRect(),
        boundary = root.current?.closest("[data-overlay-boundary]")?.getBoundingClientRect();
      const left = Math.max(
        (boundary?.left ?? 0) + 16,
        Math.min(anchor.right - menu.offsetWidth, (boundary?.right ?? window.innerWidth) - 16 - menu.offsetWidth),
      );
      menu.style.left = `${left - anchor.left}px`;
      menu.style.right = "auto";
      const above =
        anchor.bottom + 6 + menu.offsetHeight >
          Math.min(boundary?.bottom ?? window.innerHeight, window.innerHeight) - 8 &&
        anchor.top > menu.offsetHeight + 8;
      menu.style.top = above ? `${-menu.offsetHeight - 6}px` : "calc(100% + 6px)";
    };
    update();
    const observer = new ResizeObserver(update);
    if (popup.current) observer.observe(popup.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [filterOpen]);
  useEffect(() => {
    if (!filterOpen) return;
    (
      popup.current?.querySelector<HTMLElement>('[role="checkbox"][aria-checked="true"]') ??
      popup.current?.querySelector<HTMLElement>('[role="checkbox"]')
    )?.focus({ preventScroll: true });
    const close = (event: PointerEvent) => {
      if (!popup.current?.contains(event.target as Node) && !filter.current?.contains(event.target as Node))
        setFilterOpen(false);
    };
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setFilterOpen(false);
        filter.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("keydown", key, true);
    };
  }, [filterOpen]);
  const shownFolders = folders
    .filter(
      (item) =>
        (folderTab === "All" || item.shared === (folderTab === "Shared")) &&
        item.name.toLowerCase().includes(folderQuery.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (folderDesc ? -1 : 1));
  const shownTemplates = templates
    .filter(
      (item) =>
        (templateTab === "All" || (templateTab === "Mine" ? item.mine : item.shared && !item.mine)) &&
        (!types.length || types.includes(item.type)) &&
        item.name.toLowerCase().includes(templateQuery.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (templateDesc ? -1 : 1));
  const uniqueName = (base: string, items: { name: string }[]) => {
    let name = base,
      n = 2;
    while (items.some((item) => item.name === name)) name = `${base} ${n++}`;
    return name;
  };
  const toggleType = (type: FilesTemplate["type"]) =>
    setTypes(types.includes(type) ? types.filter((item) => item !== type) : [...types, type]);
  const createFolder = () => {
    setFolders([
      ...folders,
      {
        id: `${id}-folder-${++sequence.current}`,
        name: uniqueName("Untitled folder", folders),
        shared: false,
        fileCount: 0,
      },
    ]);
    setFolderTab("All");
    setFolderQuery("");
  };
  const addTemplate = () => {
    setTemplates([
      ...templates,
      {
        id: `${id}-template-${++sequence.current}`,
        name: uniqueName("Untitled", templates),
        type: "Document",
        owner: currentUser,
        shared: false,
        mine: true,
      },
    ]);
    setTemplateTab("All");
    setTemplateQuery("");
    setTypes([]);
  };
  return (
    <div ref={root} className={["ui-fbr", className].filter(Boolean).join(" ")}>
      <style href="ui-files" precedence="default">
        {css}
      </style>
      <h1 className="ui-fbr__title">Files</h1>
      <p className="ui-fbr__sub">
        See files you recently used in chats and manage files saved in folders. <a href={learnMoreHref}>Learn more</a>
      </p>
      <div className="ui-fbr__head">
        <h2 id={`${id}-folders`}>
          Folders<span>{shownFolders.length}</span>
        </h2>
        <div className="ui-fbr__toolbar">
          <div className="ui-fbr__left">
            <FilesTabs label="Folders" items={["All", "Shared", "Private"]} value={folderTab} onChange={setFolderTab} />
          </div>
          <div className="ui-fbr__right">
            <FilesSort descending={folderDesc} onChange={setFolderDesc} />
            <div
              className="ui-fbr__view"
              role="radiogroup"
              aria-label="View"
              data-view={view}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === "Home" ? "grid" : event.key === "End" ? "list" : view === "grid" ? "list" : "grid";
                setView(next);
                event.currentTarget
                  .querySelector<HTMLButtonElement>(`[aria-label="${next === "grid" ? "Grid" : "List"}"]`)
                  ?.focus();
              }}
            >
              <span className="ui-fbr__view-pill" aria-hidden="true" />
              {(["grid", "list"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  role="radio"
                  aria-label={value === "grid" ? "Grid" : "List"}
                  aria-checked={view === value}
                  tabIndex={view === value ? 0 : -1}
                  onClick={() => setView(value)}
                >
                  <FilesGlyph name={value} />
                </button>
              ))}
            </div>
            <FilesSearch kind="folders" value={folderQuery} onChange={setFolderQuery} />
            <button type="button" className="ui-fbr__add ui-fbr__add--primary" onClick={createFolder}>
              <Icon name="plus" size={15} />
              <span>Create folder</span>
            </button>
          </div>
        </div>
      </div>
      {shownFolders.length ? (
        <div
          className="ui-fbr__folders"
          data-view={view}
          aria-labelledby={`${id}-folders`}
          key={`${folderTab}:${folderQuery}:${folderDesc}:${view}:${folders.length}`}
        >
          {shownFolders.map((folder, index) => (
            <button
              type="button"
              className="ui-fbr__folder ui-fbr__rise"
              key={folder.id}
              style={{ "--i": index } as CSSProperties}
              onClick={() => onOpenFolder?.(folder)}
            >
              <FilesFolderMark />
              <span className="ui-fbr__folder-text">
                <b title={folder.name}>{folder.name}</b>
                <span className="ui-fbr__meta">
                  <FilesGlyph name={folder.shared ? "shared" : "lock"} size={12} />
                  {folder.shared ? "Shared" : "Private"} · {folder.fileCount}{" "}
                  {folder.fileCount === 1 ? "file" : "files"}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <FilesEmpty folders query={folderQuery} />
      )}
      <div className="ui-fbr__head">
        <h2 id={`${id}-templates`}>
          File templates<span>{shownTemplates.length}</span>
        </h2>
        <div className="ui-fbr__toolbar">
          <div className="ui-fbr__left">
            <FilesTabs
              label="File templates"
              items={["All", "Mine", "Shared with me"]}
              value={templateTab}
              onChange={setTemplateTab}
            />
          </div>
          <div className="ui-fbr__right">
            <span className="ui-fbr__anchor">
              <button
                ref={filter}
                type="button"
                className="ui-fbr__tool ui-fbr__filter-trigger"
                aria-expanded={filterOpen}
                aria-haspopup="dialog"
                aria-controls={filterOpen ? `${id}-filter` : undefined}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FilesGlyph name="filter" />
                Type
                {types.length ? (
                  <span className="ui-fbr__badge" key={types.length}>
                    {types.length}
                  </span>
                ) : (
                  <Icon name="chevron" size={13} />
                )}
              </button>
              {filterOpen && (
                <div
                  ref={popup}
                  id={`${id}-filter`}
                  role="dialog"
                  aria-label="Filter templates by type"
                  className="ui-fbr__filter"
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "ArrowUp" ||
                      event.key === "Home" ||
                      event.key === "End"
                    )
                      moveMenuFocus(event);
                  }}
                >
                  <div className="ui-fbr__filter-head">
                    <b>Type</b>
                    <button type="button" disabled={!types.length} onClick={() => setTypes([])}>
                      Clear all
                    </button>
                  </div>
                  <div className="ui-fbr__chips" style={{ height: types.length ? 36 : 0 }}>
                    <div>
                      {types.map((type) => (
                        <span key={type}>
                          {type}
                          <button type="button" aria-label={`Remove ${type}`} onClick={() => toggleType(type)}>
                            <Icon name="close" size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ui-fbr__filter-group">
                    <button
                      type="button"
                      className="ui-fbr__group-head"
                      aria-expanded={groupOpen}
                      aria-controls={`${id}-types`}
                      onClick={() => setGroupOpen(!groupOpen)}
                    >
                      <Icon name="chevron" size={16} />
                      <b>Type</b>
                      <span>3</span>
                      {!!types.length && (
                        <small>
                          {types.length} {types.length === 1 ? "filter" : "filters"}
                        </small>
                      )}
                    </button>
                    <div className="ui-fbr__filter-panel" data-open={groupOpen || undefined}>
                      <div id={`${id}-types`} role="group" aria-label="Type" inert={!groupOpen}>
                        {(["Document", "PDF", "Spreadsheet"] as const).map((type) => (
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={types.includes(type)}
                            key={type}
                            onClick={() => toggleType(type)}
                          >
                            <span className="ui-fbr__check" aria-hidden="true">
                              <svg viewBox="0 0 16 16">
                                <path d="m4.25 8.25 2.5 2.5 5-5.5" />
                              </svg>
                            </span>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </span>
            <FilesSort descending={templateDesc} onChange={setTemplateDesc} />
            <FilesSearch kind="templates" value={templateQuery} onChange={setTemplateQuery} />
            <button type="button" className="ui-fbr__add" onClick={addTemplate}>
              <Icon name="plus" size={15} />
              <span>Add template</span>
            </button>
          </div>
        </div>
      </div>
      {shownTemplates.length ? (
        <div
          className="ui-fbr__templates"
          aria-labelledby={`${id}-templates`}
          key={`${templateTab}:${templateQuery}:${templateDesc}:${types.join()}`}
        >
          {shownTemplates.map((template, index) => (
            <div className="ui-fbr__rise" key={template.id} style={{ "--i": index } as CSSProperties}>
              <button
                type="button"
                title={template.name}
                className="ui-fbr__template"
                onClick={() => onOpenTemplate?.(template)}
              >
                <span className="ui-fbr__preview">
                  <FilesDocument type={template.type} />
                </span>
                <b className="ui-fbr__template-name">{template.name}</b>
                <span className="ui-fbr__meta">
                  <span className="ui-fbr__file-meta">
                    {template.type} · {template.owner}
                  </span>
                  <span className="ui-fbr__access">
                    <FilesGlyph name={template.shared ? "shared" : "lock"} size={12} />
                    {template.shared ? "Shared" : "Private"}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <FilesEmpty />
      )}
    </div>
  );
}

export type WorkspaceSidebarFooterProps = { workspace?: string; onNavigate?: (label: string) => void };
const workspaceNavGlyphs = {
  compose: (
    <>
      <path d="M16.4249 4.60509l.99-.99a2.1 2.1 0 0 1 2.97 2.97l-.99.99m-2.97-2.97-6.65932 6.65931a4 4 0 0 0-1.04161 1.8397L8 16l2.8959-.724a4 4 0 0 0 1.8397-1.0416l6.6593-6.65934m-2.97-2.97 2.97 2.97" />
      <path d="M19 13.5c0 3.2875 0 4.9312-.908 6.0376a4 4 0 0 1-.5545.5544C16.4312 21 14.7874 21 11.5 21H11c-3.77124 0-5.65684 0-6.82841-1.1716C3 18.6569 3 16.7712 3 13v-.5c0-3.28748 0-4.93121.90794-6.03756a4 4 0 0 1 .5545-.5545C5.56879 5 7.21252 5 10.5 5" />
    </>
  ),
  folder: (
    <path d="M8 7h8.75c2.1067 0 3.16 0 3.9167.50559a3 3 0 0 1 .8277.8277C22 9.08996 22 10.1433 22 12.25c0 3.5112 0 5.2667-.8427 6.5279a5 5 0 0 1-1.3794 1.3794C18.5167 21 16.7612 21 13.25 21H12c-4.71405 0-7.07107 0-8.53553-1.4645C2 18.0711 2 15.714 2 11V7.94427c0-1.81647 0-2.72471.38032-3.40621a3 3 0 0 1 1.15774-1.15774C4.21956 3 5.1278 3 6.94427 3c1.16375 0 1.74563 0 2.25499.19101 1.16294.43611 1.64254 1.49257 2.16734 2.54212L12 7" />
  ),
  integrations: (
    <>
      <rect x="3" y="3" width="7.5" height="9.5" rx="3" />
      <rect x="3" y="15.5" width="7.5" height="5.5" rx="2.75" />
      <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="3" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="2.75" />
    </>
  ),
  project: (
    <>
      <path d="M2.5 20V8.87695c0-1.2875 0-1.93125.28533-2.40647a2 2 0 0 1 .68515-.68515C3.9457 5.5 4.59449 5.5 5.89206 5.5c.63133 0 .947 0 1.23406.08819a2 2 0 0 1 .53857.25886C7.91289 6.01611 8.10859 6.26074 8.5 6.75c.39141.48926.58711.73389.83531.90295a2 2 0 0 0 .53857.25886C10.1609 8 10.4742 8 11.1008 8H15c1.4045 0 2.1067 0 2.6111.33706a2 2 0 0 1 .5518.5518C18.5 9.39331 18.5 10.0955 18.5 11.5" />
      <path d="m4.42028 14.0144-.7866 2c-.9775 2.4854-1.46625 3.7281-.88128 4.6069C3.33737 21.5 4.65337 21.5 7.28537 21.5h7.90493c1.2346 0 1.8519 0 2.3392-.3205.4874-.3205.7407-.893 1.2474-2.038l.8849-2c1.1248-2.5423 1.6872-3.8134 1.1061-4.7274C20.1868 11.5 18.8163 11.5 16.0752 11.5H8.07196c-1.28964 0-1.93446 0-2.43385.3439-.49939.3438-.73887.9527-1.21783 2.1705Z" />
      <path d="M11.5 4.51456c.9151-1.23047 2.1662-1.95862 4.0125-2.01295a4.16 4.16 0 0 1 1.7557.35383C18.5748 3.42601 19.4185 4.15644 20 5.5L21.5 3" />
    </>
  ),
};
function WorkspaceNavGlyph({ name }: { name: keyof typeof workspaceNavGlyphs }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {workspaceNavGlyphs[name]}
    </svg>
  );
}
export const defaultWorkspaceNavigation = [
  { label: "New chat", icon: <WorkspaceNavGlyph name="compose" /> },
  { label: "Folders", icon: <WorkspaceNavGlyph name="folder" /> },
  { label: "Integrations", icon: <WorkspaceNavGlyph name="integrations" /> },
];
const workspaceSetup = [
  { name: "Set up your workspace", items: ["Name your workspace", "Invite your teammates", "Connect your first app"] },
  { name: "Start working", items: ["Create a folder", "Start your first chat", "Upload a file"] },
  { name: "Make it yours", items: ["Add a profile picture", "Choose your notifications"] },
];
/** The shared news stack and expandable workspace checklist above the account menu. */
export function WorkspaceSidebarFooter({ workspace = "Acme", onNavigate }: WorkspaceSidebarFooterProps) {
  const [news, setNews] = useState(0),
    [guide, setGuide] = useState(false),
    [group, setGroup] = useState(0);
  const [guideHeight, setGuideHeight] = useState(70),
    content = useRef<HTMLDivElement>(null),
    steps = useRef<HTMLButtonElement>(null),
    close = useRef<HTMLButtonElement>(null),
    id = useId();
  useLayoutEffect(() => {
    const el = content.current;
    if (!el) return;
    const measure = () => setGuideHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!guide) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => close.current?.focus({ preventScroll: true }));
    });
    return () => cancelAnimationFrame(frame);
  }, [guide]);
  const closeGuide = () => {
    setGuide(false);
    requestAnimationFrame(() => steps.current?.focus({ preventScroll: true }));
  };
  return (
    <div className="ui-wsf">
      <style href="ui-files" precedence="default">
        {css}
      </style>
      {news < 2 && (
        <div className="ui-wsf__news" style={news ? { paddingTop: 0 } : undefined}>
          {news === 0 && (
            <div className="ui-wsf__news-back" aria-hidden="true">
              <span>New in {workspace}</span>
              <Icon name="close" size={12} />
            </div>
          )}
          <div className="ui-wsf__news-card">
            <div className="ui-wsf__news-top">
              <span>New in {workspace}</span>
              <button type="button" aria-label="Dismiss" onClick={() => setNews(news + 1)}>
                <Icon name="close" size={12} />
              </button>
            </div>
            <b>{news === 0 ? "Shared folders" : "Scheduled chats"}</b>
            <button type="button" className="ui-wsf__changelog" onClick={() => onNavigate?.("Changelog")}>
              Full changelog
              <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      )}
      <div className="ui-wsf__guide-slot">
        <div
          className="ui-wsf__guide"
          data-open={guide || undefined}
          style={{ height: guide ? guideHeight : 70 }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && guide) {
              event.stopPropagation();
              closeGuide();
            }
          }}
        >
          <button
            ref={steps}
            type="button"
            className="ui-wsf__steps"
            aria-expanded={guide}
            aria-controls={`${id}-guide`}
            inert={guide}
            onClick={() => setGuide(true)}
          >
            <span>
              Getting started
              <Icon name="chevron" size={13} />
            </span>
            <small>
              13% done · <em>Great start!</em>
            </small>
            <i>
              <span />
            </i>
          </button>
          <div
            id={`${id}-guide`}
            className="ui-wsf__guide-content"
            inert={!guide}
            aria-label="Getting started"
            role="region"
          >
            <div ref={content}>
              <header>
                <b>Getting started</b>
                <button ref={close} type="button" aria-label="Close setup guide" onClick={closeGuide}>
                  <Icon name="close" size={14} />
                </button>
              </header>
              <div className="ui-wsf__progress">
                <progress aria-label="Getting started progress" value={1} max={8} />
                <span>1/8</span>
              </div>
              <div className="ui-wsf__setup-groups">
                {workspaceSetup.map((section, index) => (
                  <section key={section.name} data-open={group === index || undefined}>
                    <button
                      type="button"
                      className="ui-wsf__setup-head"
                      aria-expanded={group === index}
                      aria-controls={`${id}-setup-${index}`}
                      onClick={() => setGroup(group === index ? -1 : index)}
                    >
                      {section.name}
                      <Icon name="chevron" size={16} />
                    </button>
                    <div className="ui-wsf__setup-list" data-open={group === index || undefined}>
                      <div id={`${id}-setup-${index}`} inert={group !== index}>
                        {section.items.map((item, itemIndex) => (
                          <button
                            type="button"
                            key={item}
                            disabled={itemIndex > (index === 0 ? 1 : 0)}
                            aria-pressed={index === 0 && itemIndex === 0}
                            data-done={(index === 0 && itemIndex === 0) || undefined}
                            onClick={() => onNavigate?.(item)}
                          >
                            <span className="ui-wsf__setup-check">
                              {index === 0 && itemIndex === 0 ? (
                                <Icon name="check" size={10} />
                              ) : itemIndex > (index === 0 ? 1 : 0) ? (
                                <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.1"
                                  aria-hidden="true"
                                >
                                  <circle cx="8" cy="8" r="6.5" strokeDasharray="2 2" />
                                </svg>
                              ) : null}
                            </span>
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type FilesScreenProps = Omit<AppShellProps, "children" | "navigation"> & {
  browserProps?: FilesBrowserProps;
};
const filesNavigation: AppRailItem[] = [
  ...defaultWorkspaceNavigation,
  ...["Q3 Campaign", "Brand assets", "Hiring", "Research"].map((label) => ({
    label,
    section: "Projects",
    icon: <WorkspaceNavGlyph name="project" />,
  })),
];

/** The recorded Files overview, composed with the existing workspace/account menus and resizable navigation. */
export function FilesScreen({
  browserProps,
  workspace = "Acme",
  user = { name: "Alex Morgan", email: "alex@acme.com" },
  defaultActive = "Folders",
  onNavigate,
  sidebarFooter,
  className,
  ...shellProps
}: FilesScreenProps) {
  return (
    <AppShell
      {...shellProps}
      workspace={workspace}
      user={user}
      defaultActive={defaultActive}
      onNavigate={onNavigate}
      navigation={filesNavigation}
      sidebarFooter={
        sidebarFooter === undefined ? (
          <WorkspaceSidebarFooter workspace={workspace} onNavigate={onNavigate} />
        ) : (
          sidebarFooter
        )
      }
      className={["ui-fls", className].filter(Boolean).join(" ")}
    >
      <style href="ui-files" precedence="default">
        {css}
      </style>
      <div className="ui-fls__scroll">
        <FilesBrowser
          currentUser={user?.name}
          onOpenFolder={(folder) => onNavigate?.(folder.name)}
          onOpenTemplate={(template) => onNavigate?.(template.name)}
          {...browserProps}
        />
      </div>
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

.ui-fbr {
  --ui-fbr-card: #fff;
  --ui-fbr-strong: #000;
  --ui-fbr-ink: rgba(0, 0, 0, 0.88);
  --ui-fbr-text: rgba(0, 0, 0, 0.61);
  --ui-fbr-muted: rgba(0, 0, 0, 0.45);
  --ui-fbr-faint: rgba(0, 0, 0, 0.27);
  --ui-fbr-line: rgba(0, 0, 0, 0.06);
  --ui-fbr-edge: rgba(0, 0, 0, 0.1);
  --ui-fbr-chip: rgba(0, 0, 0, 0.04);
  --ui-fbr-frame: rgba(0, 0, 0, 0.02);
  --ui-fbr-select: rgba(0, 0, 0, 0.055);
  --ui-fbr-accent: rgba(0, 96, 226, 0.765);
  --ui-fbr-shadow: 0 0 0 0.5px var(--ui-fbr-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-fbr-lift: 0 0 0 0.5px var(--ui-fbr-edge), 0 2px 6px -1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-fbr-ease: cubic-bezier(0.22, 1, 0.36, 1);
  padding: 46px 32px 56px;
  font:
    400 13px/20px Inter,
    InterVariable,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-fbr-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-fbr,
.ui-fbr *,
.ui-fbr ::before,
.ui-fbr ::after {
  box-sizing: border-box;
}
.ui-fbr button {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ui-fbr svg {
  display: block;
  flex: none;
}
.ui-fbr button:focus-visible,
.ui-fbr a:focus-visible {
  outline: 2px solid var(--ui-fbr-accent);
  outline-offset: 2px;
}
.ui-fbr button:active {
  transform: none;
}
.ui-fbr__title {
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.24px;
  color: var(--ui-fbr-strong);
}
.ui-fbr__sub {
  margin: 4px 0 0;
  color: var(--ui-fbr-text);
}
.ui-fbr__sub a {
  color: inherit;
  text-decoration-color: var(--ui-fbr-edge);
  text-underline-offset: 3px;
}
.ui-fbr__sub a:hover {
  color: var(--ui-fbr-ink);
  text-decoration-color: currentColor;
}
.ui-fbr__head {
  margin-top: 36px;
}
.ui-fbr__head h2 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--ui-fbr-muted);
}
.ui-fbr__head h2 > span {
  color: var(--ui-fbr-faint);
  font-variant-numeric: tabular-nums;
}
.ui-fbr__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
}
.ui-fbr__left,
.ui-fbr__right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ui-fbr__tabs {
  position: relative;
  display: flex;
  gap: 8px;
}
.ui-fbr__pill {
  position: absolute;
  top: 0;
  left: 0;
  height: 28px;
  border-radius: 6px;
  background: var(--ui-fbr-select);
  transition:
    transform 340ms var(--ui-fbr-ease),
    width 340ms var(--ui-fbr-ease);
}
.ui-fbr__tabs button {
  position: relative;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--ui-fbr-text);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  transition: color 140ms;
}
.ui-fbr__tabs button:hover,
.ui-fbr__tabs button[aria-selected="true"] {
  color: var(--ui-fbr-ink);
}
.ui-fbr .ui-fbr__tool {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  color: var(--ui-fbr-text);
  transition:
    box-shadow 140ms,
    color 140ms;
}
.ui-fbr__tool svg {
  color: var(--ui-fbr-muted);
}
.ui-fbr .ui-fbr__tool:hover {
  box-shadow: var(--ui-fbr-lift);
  color: var(--ui-fbr-ink);
}
.ui-fbr .ui-fbr__filter-trigger {
  padding: 0 10px;
}
.ui-fbr__sort svg {
  transition: transform 360ms var(--ui-fbr-ease);
}
.ui-fbr__sort[data-dir="desc"] svg {
  transform: rotate(180deg);
}
.ui-fbr__view {
  position: relative;
  display: flex;
  gap: 2px;
  height: 28px;
  padding: 2px;
  border-radius: 6px;
  background: var(--ui-fbr-chip);
}
.ui-fbr__view button {
  position: relative;
  display: grid;
  place-items: center;
  width: 28px;
  border-radius: 4px;
  color: var(--ui-fbr-faint);
  transition: color 160ms;
}
.ui-fbr__view button:hover,
.ui-fbr__view button[aria-checked="true"] {
  color: var(--ui-fbr-ink);
}
.ui-fbr__view-pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: 28px;
  border-radius: 4px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  transition: transform 320ms var(--ui-fbr-ease);
}
.ui-fbr__view[data-view="list"] .ui-fbr__view-pill {
  transform: translateX(30px);
}
.ui-fbr__search {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 172px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  color: var(--ui-fbr-muted);
  transition: box-shadow 140ms;
}
.ui-fbr__search:hover {
  box-shadow: var(--ui-fbr-lift);
}
.ui-fbr__search:focus-within {
  box-shadow: 0 0 0 1px var(--ui-fbr-accent);
}
.ui-fbr__search input {
  appearance: none;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none !important;
  background: transparent;
  font: inherit;
  color: var(--ui-fbr-ink);
}
.ui-fbr__search input::placeholder {
  color: var(--ui-fbr-faint);
}
.ui-fbr__search input::-webkit-search-cancel-button {
  display: none;
}
.ui-fbr__search button {
  flex: none;
  border-radius: 4px;
  color: var(--ui-fbr-muted);
}
.ui-fbr .ui-fbr__add {
  --ui-fbr-add-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.07);
  --ui-fbr-solid-hover: rgba(0, 0, 0, 0.8);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px 0 6px;
  overflow: clip;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  transition:
    background-color 140ms,
    color 140ms,
    box-shadow 140ms,
    transform 160ms var(--ui-fbr-ease),
    opacity 140ms;
}
.ui-fbr .ui-fbr__add:hover {
  box-shadow: var(--ui-fbr-add-hover);
}
.ui-fbr .ui-fbr__add--primary {
  background: var(--ui-fbr-ink);
  color: var(--ui-fbr-card);
  box-shadow: none;
}
.ui-fbr .ui-fbr__add--primary:hover {
  background: var(--ui-fbr-solid-hover);
  box-shadow: none;
}
.ui-fbr .ui-fbr__add:active {
  transform: scale(0.97);
}
.ui-fbr__add > svg {
  width: 14px;
  height: 14px;
  color: var(--ui-fbr-muted);
  animation: ui-fbr-add-icon 520ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
.ui-fbr__add--primary > svg {
  color: inherit;
}
.ui-fbr__add > span {
  animation: ui-fbr-add-label 480ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
@keyframes ui-fbr-add-icon {
  from {
    opacity: 0;
    transform: scale(0.7);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
@keyframes ui-fbr-add-label {
  from {
    opacity: 0;
    transform: translateY(25%);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
.ui-fbr__folders {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 11px;
  margin-top: 16px;
}
.ui-fbr .ui-fbr__folder {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 14px 0 12px;
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  text-align: left;
  transition: box-shadow 160ms;
}
.ui-fbr .ui-fbr__folder:hover {
  box-shadow: var(--ui-fbr-lift);
}
.ui-fbr__folder-mark {
  flex: none;
  width: 26px;
  height: 26px;
  transition: transform 320ms var(--ui-fbr-ease);
}
.ui-fbr__folder:hover .ui-fbr__folder-mark {
  transform: translateY(-1px) scale(1.04);
}
.ui-fbr__folder-text {
  display: grid;
  min-width: 0;
}
.ui-fbr__folder-text > b {
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-fbr__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-fbr-muted);
  white-space: nowrap;
}
.ui-fbr__meta svg {
  color: var(--ui-fbr-faint);
}
.ui-fbr__folders[data-view="list"] {
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
}
.ui-fbr__folders[data-view="list"] .ui-fbr__folder {
  height: 48px;
}
.ui-fbr__templates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}
.ui-fbr__template {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 239px;
  text-align: left;
}
.ui-fbr__preview {
  display: block;
  height: 152px;
  padding: 3px;
  border-radius: 12px;
  background: var(--ui-fbr-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  transition: box-shadow 160ms;
}
.ui-fbr__template:hover .ui-fbr__preview {
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-edge);
}
.ui-fbr__template-name {
  margin-top: 8px;
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-fbr__template .ui-fbr__meta {
  gap: 0;
}
.ui-fbr__file-meta {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-fbr__access {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
}
.ui-fbr__access::before {
  content: "·";
  margin: 0 4px;
}
.ui-fbr__doc {
  --ui-fbr-tag: #3b82f6;
  --ui-fbr-tag-shade: 30, 64, 175;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
}
.ui-fbr__doc[data-color="rose"] {
  --ui-fbr-tag: #f43f5e;
  --ui-fbr-tag-shade: 159, 18, 57;
}
.ui-fbr__doc[data-color="emerald"] {
  --ui-fbr-tag: #10b981;
  --ui-fbr-tag-shade: 6, 95, 70;
}
.ui-fbr__art {
  position: relative;
  display: block;
  width: 52px;
  translate: 4px;
}
.ui-fbr__paper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 10px 22px;
  border-radius: 5px 9px 5px 5px;
  corner-top-right-shape: bevel;
  background: var(--ui-fbr-card);
  box-shadow:
    0 0 0 1px var(--ui-fbr-edge),
    0 4px 8px -2px rgba(0, 0, 0, 0.065),
    0 2px 3px -2px rgba(0, 0, 0, 0.065);
  transition: transform 420ms var(--ui-fbr-ease);
}
.ui-fbr__rows {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ui-fbr__row {
  display: flex;
  gap: 3px;
}
.ui-fbr__row i {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: color-mix(in srgb, var(--ui-fbr-ink) 10%, transparent);
}
.ui-fbr__paper[data-type="XLS"] .ui-fbr__row:first-child i {
  background: color-mix(in srgb, var(--ui-fbr-ink) 22%, transparent);
}
.ui-fbr__image {
  display: block;
  height: 14px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--ui-fbr-ink) 6%, transparent);
}
.ui-fbr__type {
  position: absolute;
  left: -8px;
  bottom: 11px;
  z-index: 2;
  display: block;
  padding: 3.5px 4px 2.5px;
  border-radius: 3px;
  background: var(--ui-fbr-tag);
  box-shadow: 0 4px 8px -3px rgba(var(--ui-fbr-tag-shade), 0.3);
  font-size: 9px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  transition: transform 420ms var(--ui-fbr-ease);
}
@supports (text-box: cap alphabetic) {
  .ui-fbr__type {
    padding: 3.5px 4px;
    text-box: cap alphabetic;
  }
}
.ui-fbr__template:hover .ui-fbr__paper {
  transform: translateY(-2px);
}
.ui-fbr__template:hover .ui-fbr__type {
  transform: translate(-1px, -3px);
}
.ui-fbr__anchor {
  position: relative;
}
.ui-fbr__filter {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  right: 0;
  width: 300px;
  max-width: calc(100vw - 32px);
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  transform-origin: right top;
  animation: ui-fbr-popover 220ms var(--ui-fbr-ease);
}
.ui-fbr__filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 10px 8px 14px;
}
.ui-fbr__filter-head > b {
  font-weight: 500;
  color: var(--ui-fbr-strong);
}
.ui-fbr__filter-head > button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-weight: 500;
  color: var(--ui-fbr-text);
}
.ui-fbr__filter-head > button:disabled {
  color: var(--ui-fbr-faint);
  cursor: default;
}
.ui-fbr__filter button:hover:not(:disabled) {
  background: var(--ui-fbr-frame);
}
.ui-fbr__chips {
  overflow: hidden;
  transition: height 320ms var(--ui-fbr-ease);
}
.ui-fbr__chips > div {
  display: flex;
  gap: 4px;
  padding: 0 14px 12px;
}
.ui-fbr__chips > div > span {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 24px;
  padding: 0 3px 0 8px;
  border-radius: 6px;
  background: var(--ui-fbr-select);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  animation: ui-fbr-chip 260ms var(--ui-fbr-ease) both;
}
.ui-fbr__chips button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  color: var(--ui-fbr-muted);
}
.ui-fbr__filter-group {
  padding: 4px;
  border-top: 0.5px solid var(--ui-fbr-line);
}
.ui-fbr__group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px !important;
  border-radius: 6px;
  text-align: left;
}
.ui-fbr__group-head > b {
  font-weight: 500;
}
.ui-fbr__group-head > svg {
  color: var(--ui-fbr-muted);
  transition: transform 260ms var(--ui-fbr-ease);
}
.ui-fbr__group-head[aria-expanded="false"] > svg {
  transform: rotate(-90deg);
}
.ui-fbr__group-head > span {
  font-size: 12px;
  color: var(--ui-fbr-faint);
}
.ui-fbr__group-head > small {
  margin-left: auto;
  font-size: 12px;
  color: var(--ui-fbr-muted);
}
.ui-fbr__filter-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms var(--ui-fbr-ease);
}
.ui-fbr__filter-panel[data-open] {
  grid-template-rows: 1fr;
}
.ui-fbr__filter-panel > div {
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    opacity 220ms,
    padding 320ms var(--ui-fbr-ease);
}
.ui-fbr__filter-panel[data-open] > div {
  opacity: 1;
  padding-bottom: 4px;
}
.ui-fbr__filter-panel button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px 0 32px;
  border-radius: 6px;
  text-align: left;
}
.ui-fbr__check {
  display: grid;
  place-items: center;
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.22),
    0 1px 1px rgba(0, 0, 0, 0.04);
  transition:
    background-color 160ms,
    box-shadow 160ms;
}
.ui-fbr__check svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 12;
  stroke-dashoffset: 12;
  transition: stroke-dashoffset 240ms var(--ui-fbr-ease);
}
.ui-fbr [aria-checked="true"] .ui-fbr__check {
  background: var(--ui-fbr-accent);
  box-shadow: none;
}
.ui-fbr [aria-checked="true"] .ui-fbr__check svg {
  stroke-dashoffset: 0;
  transition-delay: 40ms;
}
.ui-fbr__badge {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--ui-fbr-select);
  font-size: 11px;
  animation: ui-fbr-pop 220ms var(--ui-fbr-ease);
}
.ui-fbr__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  padding: 48px 24px 52px;
  border-radius: 12px;
  background: var(--ui-fbr-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  text-align: center;
}
.ui-fbr__empty-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--ui-fbr-chip);
  color: var(--ui-fbr-muted);
}
.ui-fbr__empty > b {
  margin-top: 16px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
}
.ui-fbr__empty p {
  max-width: 430px;
  margin: 4px 0 0;
  color: var(--ui-fbr-muted);
}
.ui-fbr__rise {
  animation: ui-fbr-rise 420ms var(--ui-fbr-ease) both;
  animation-delay: calc(var(--i, 0) * 35ms);
}
@keyframes ui-fbr-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes ui-fbr-popover {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
@keyframes ui-fbr-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
@keyframes ui-fbr-chip {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
}
:where(.dark, [data-theme="dark"]) .ui-fbr {
  --ui-fbr-card: #1b1b1e;
  --ui-fbr-strong: #fff;
  --ui-fbr-ink: rgba(255, 255, 255, 0.9);
  --ui-fbr-text: rgba(255, 255, 255, 0.62);
  --ui-fbr-muted: rgba(255, 255, 255, 0.45);
  --ui-fbr-faint: rgba(255, 255, 255, 0.28);
  --ui-fbr-line: rgba(255, 255, 255, 0.08);
  --ui-fbr-edge: rgba(255, 255, 255, 0.14);
  --ui-fbr-chip: rgba(255, 255, 255, 0.06);
  --ui-fbr-frame: rgba(255, 255, 255, 0.03);
  --ui-fbr-select: rgba(255, 255, 255, 0.08);
  --ui-fbr-accent: #4d8dff;
  --ui-fbr-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-fbr-lift: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 2px 6px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-fbr .ui-fbr__add {
  --ui-fbr-add-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-fbr-solid-hover: rgba(255, 255, 255, 0.82);
}
@container ui-as (max-width:900px) {
  .ui-fbr {
    padding: 46px 24px 48px;
  }
  .ui-fbr__templates {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .ui-fbr__template {
    width: 100%;
  }
  .ui-fbr__template .ui-fbr__meta {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ui-fbr__file-meta,
  .ui-fbr__access {
    display: inline;
    overflow: visible;
  }
  .ui-fbr__access svg {
    display: inline-block;
    vertical-align: -2px;
    margin-right: 4px;
  }
  .ui-fbr__toolbar,
  .ui-fbr__right {
    flex-wrap: wrap;
    row-gap: 10px;
  }
}
@container ui-fls-main (max-width:760px) {
  .ui-fbr__folders {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container ui-fls-main (max-width:480px) {
  .ui-fbr__folders {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
@container ui-as (max-width:600px) {
  .ui-fbr {
    padding: 52px 16px 40px;
  }
  .ui-fbr__title {
    font-size: 20px;
    line-height: 26px;
  }
  .ui-fbr__head {
    margin-top: 32px;
  }
  .ui-fbr__left,
  .ui-fbr__right {
    width: 100%;
  }
  .ui-fbr__right .ui-fbr__search {
    order: 9;
    flex: 1 1 100%;
    width: auto;
  }
  .ui-fbr__right > .ui-fbr__add:last-child {
    margin-left: auto;
  }
  .ui-fbr__tabs {
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ui-fbr__templates {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 10px;
  }
  .ui-fbr__preview {
    height: 128px;
  }
  .ui-fbr__empty {
    padding: 36px 18px 40px;
  }
}
@media (pointer: coarse) {
  .ui-fbr__search {
    height: 34px;
  }
  .ui-fbr__search input {
    font-size: 16px;
  }
  .ui-fbr .ui-fbr__add {
    height: 32px;
  }
  .ui-fbr__filter-panel button,
  .ui-fbr__group-head {
    height: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-fbr *,
  .ui-fbr ::before,
  .ui-fbr ::after {
    animation: none !important;
    transition: none !important;
  }
}

.ui-wsf {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 8px;
}
.ui-as__side-col:has(> .ui-wsf) .ui-as__account-row {
  margin-top: 0;
}
.ui-wsf__news {
  position: relative;
  padding-top: 30px;
}
.ui-wsf__news-back {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 48px;
  padding: 9px 9px 0;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow:
    0 0 0 0.5px var(--ui-as-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
  color: var(--ui-as-accent);
}
.ui-wsf__news-back > svg {
  color: var(--ui-as-faint);
}
.ui-wsf__news-card {
  position: relative;
  z-index: 1;
  padding: 10px 10px 0;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow:
    0 0 0 0.5px var(--ui-as-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-wsf__news-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ui-as-accent);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
}
.ui-wsf__news-top button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin: -2px -2px 0 0;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-as-faint);
}
.ui-wsf__news-card > b {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsf .ui-wsf__changelog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 20px);
  height: 34px;
  margin: 10px -10px 0;
  padding: 0 10px;
  border-top: 1px solid var(--ui-as-fill);
  border-radius: 0 0 12px 12px;
  font-size: 12.5px;
  color: var(--ui-as-muted);
}
.ui-wsf__changelog > svg,
.ui-wsf__steps > span > svg {
  rotate: -90deg;
}
.ui-wsf__changelog:hover,
.ui-wsf__news-top button:hover {
  background: var(--ui-as-fill);
  color: var(--ui-as-ink);
}
.ui-wsf__guide-slot {
  position: relative;
  height: 70px;
}
.ui-wsf__guide {
  position: absolute;
  z-index: 6;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow:
    0 0 0 0.5px var(--ui-as-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    height 480ms var(--ui-as-ease),
    box-shadow 200ms;
}
.ui-wsf__guide[data-open] {
  box-shadow:
    0 0 0 0.5px var(--ui-as-line),
    0 8px 24px -10px rgba(0, 0, 0, 0.14);
}
.ui-wsf .ui-wsf__steps {
  display: grid;
  gap: 3px;
  width: 100%;
  height: 70px;
  padding: 10px 10px 9px;
  text-align: left;
}
.ui-wsf__steps > span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsf__steps svg {
  color: var(--ui-as-faint);
}
.ui-wsf__steps > small {
  font-size: 12.5px;
  line-height: 17px;
  color: var(--ui-as-muted);
}
.ui-wsf__steps em {
  color: var(--ui-as-accent);
  font-style: normal;
}
.ui-wsf__steps > i {
  height: 4px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-as-fill);
}
.ui-wsf__steps > i > span {
  display: block;
  width: 13%;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-as-accent);
}
.ui-wsf__guide-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition:
    opacity 260ms,
    transform 360ms var(--ui-as-ease),
    visibility 260ms;
}
.ui-wsf__guide-content > div {
  padding: 12px 4px 4px;
  zoom: 0.86;
}
.ui-wsf__guide[data-open] .ui-wsf__guide-content {
  opacity: 1;
  visibility: visible;
  transform: none;
}
.ui-wsf__guide[data-open] .ui-wsf__steps {
  visibility: hidden;
}
.ui-wsf__guide-content header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px 0 16px;
}
.ui-wsf__guide-content b {
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
}
.ui-wsf__guide-content header button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-as-muted);
}
.ui-wsf__progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 12px;
  color: var(--ui-as-muted);
  font-size: 12px;
  line-height: 16px;
}
.ui-wsf__progress progress {
  flex: 1;
  width: 0;
  height: 4px;
  border: 0;
  accent-color: var(--ui-as-accent);
}
.ui-wsf__progress progress::-webkit-progress-bar {
  background: var(--ui-as-fill);
  border-radius: 2px;
}
.ui-wsf__progress progress::-webkit-progress-value {
  background: var(--ui-as-accent);
  border-radius: 2px;
}
.ui-wsf__setup-groups {
  display: grid;
  gap: 2px;
  padding: 4px 4px 2px;
  border-top: 0.5px solid var(--ui-as-line);
}
.ui-wsf__setup-groups > section {
  border-radius: 8px;
  transition: background-color 200ms;
}
.ui-wsf__setup-groups > section[data-open] {
  background: color-mix(in srgb, var(--ui-as-ink) 2.5%, transparent);
}
.ui-wsf .ui-wsf__setup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 8px 8px 12px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  text-align: left;
}
.ui-wsf__setup-head svg {
  color: var(--ui-as-muted);
  transition: transform 320ms var(--ui-as-ease);
}
.ui-wsf__setup-head[aria-expanded="true"] svg {
  transform: rotate(180deg);
}
.ui-wsf__setup-list {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 380ms var(--ui-as-ease);
}
.ui-wsf__setup-list[data-open] {
  grid-template-rows: 1fr;
}
.ui-wsf__setup-list > div {
  min-height: 0;
  overflow: hidden;
  padding: 0 4px;
}
.ui-wsf__setup-list button {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 6px 8px !important;
  font-size: 13px !important;
  line-height: 20px;
  text-align: left;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 260ms,
    transform 320ms var(--ui-as-ease);
}
.ui-wsf__setup-list button:last-child {
  margin-bottom: 6px;
}
.ui-wsf__setup-list[data-open] button {
  opacity: 1;
  transform: none;
  transition-delay: 80ms;
}
.ui-wsf__setup-list button:disabled {
  color: var(--ui-as-muted);
  cursor: default;
  opacity: 1;
}
.ui-wsf__setup-list button[data-done] {
  color: var(--ui-as-muted);
}
.ui-wsf__setup-list button[data-done] > span:last-child {
  text-decoration: line-through;
}
.ui-wsf__setup-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--ui-as-faint);
}
.ui-wsf__setup-check svg {
  width: 16px;
  height: 16px;
}
.ui-wsf__setup-list button:disabled .ui-wsf__setup-check {
  box-shadow: none;
  color: var(--ui-as-faint);
}
.ui-wsf__setup-list button[data-done] .ui-wsf__setup-check {
  background: var(--ui-as-accent);
  color: #fff;
  box-shadow: none;
}
.ui-wsf__guide-content button:hover:not(:disabled) {
  background: var(--ui-as-fill);
}
@media (pointer: coarse) {
  .ui-wsf__setup-list button {
    padding-block: 9px !important;
  }
  .ui-wsf .ui-wsf__setup-head {
    padding-block: 12px;
  }
  .ui-wsf__guide-content header button {
    width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wsf * {
    animation: none !important;
    transition: none !important;
  }
}
@container ui-as (min-width:900px) {
  .ui-as[data-sidebar-collapsed] .ui-wsf {
    visibility: hidden;
  }
}
@container ui-as (max-width:600px) {
  .ui-wsf__news {
    display: none;
  }
}

.ui-fls.ui-as[data-navigation] .ui-as__main {
  overflow: hidden;
  border: 1px solid var(--ui-as-line);
  box-shadow: none;
}
.ui-fls__scroll {
  height: 100%;
  overflow: auto;
  container: ui-fls-main / inline-size;
  overscroll-behavior: contain;
}
@container ui-as (max-width:600px) {
  .ui-fls .ui-as__app {
    padding: 6px;
  }
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
:where(.dark, [data-theme="dark"]) .ui-cm {
  --ui-cm-card: #232326;
  --ui-cm-ink: #ededed;
  --ui-cm-text: #c4c4c4;
  --ui-cm-muted: #8f8f8f;
  --ui-cm-line: rgba(255, 255, 255, 0.1);
  --ui-cm-fill: #2a2a2d;
  --ui-cm-focus: #6b95ff;
}

`;
