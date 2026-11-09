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
 * agent-chat (Clean) – a self-contained React 19 component.
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

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
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
    <div
      className={["ui-cmc", className].filter(Boolean).join(" ")}
      data-inline={inline || undefined}
      onKeyDown={onKey}
    >
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      {!inline && (
        <button type="button" className="ui-cmc__backdrop" aria-label="Close search" tabIndex={-1} onClick={close} />
      )}
      <div
        ref={panel}
        className="ui-cmc__panel"
        role={inline ? undefined : "dialog"}
        aria-modal={!inline || undefined}
        aria-label="Search"
      >
        <div className="ui-cmc__search">
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
        <div className="ui-cmc__list" id={`${id}-list`} role="listbox" aria-label="Commands">
          {shown.map((group) => (
            <div role="group" aria-labelledby={`${id}-${group.id}-label`} className="ui-cmc__group" key={group.id}>
              <div className="ui-cmc__label" id={`${id}-${group.id}-label`}>
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
                  className="ui-cmc__item"
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
                    className="ui-cmc__icon"
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
                  <span className="ui-cmc__text">
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
            <p className="ui-cmc__empty" role="status">
              No commands found for “{query}”.
            </p>
          )}
        </div>
        <footer className="ui-cmc__foot">
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
      <linearGradient id="ui-asc-spark" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#7C5CFF" />
        <stop offset="1" stopColor="#2F9BFF" />
      </linearGradient>
    </defs>
    <path
      fill="url(#ui-asc-spark)"
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
    const label = row.previousElementSibling?.classList.contains("ui-asc__cmd-label")
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
      className="ui-asc__cmd"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="ui-asc__cmd-card">
        <label className="ui-asc__cmd-search">
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
          <kbd className="ui-asc__cmd-enter" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M12.5 4v3a2 2 0 0 1-2 2h-7M6 6.5 3.5 9 6 11.5" />
            </svg>
          </kbd>
        </label>
        <div
          ref={list}
          id={`${id}-list`}
          className="ui-asc__cmd-list"
          role="listbox"
          aria-label="Commands"
          style={height ? { height } : undefined}
          onMouseLeave={() => setLit(false)}
        >
          {pill && (
            <span
              className="ui-asc__cmd-pill"
              data-lit={lit || undefined}
              style={{ transform: `translateY(${pill.y}px)`, height: pill.h }}
              aria-hidden="true"
            />
          )}
          <div ref={inner}>
            {shown.map((group) => (
              <div role="group" aria-label={group.label} className="ui-asc__cmd-group" key={group.id}>
                {group.id !== "ask" && group.label && (
                  <span className="ui-asc__cmd-label" dir="auto">
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
                      className="ui-asc__cmd-item"
                      key={command.key}
                      onMouseMove={() => {
                        setLit(true);
                        if (command.key !== selected?.key && !command.disabled) setSelectedKey(command.key);
                      }}
                      onClick={() => onRun(command)}
                    >
                      <span className={command.logo ? "ui-asc__cmd-logo" : "ui-asc__cmd-icon"}>
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
                      <span className="ui-asc__cmd-text">
                        <span className="ui-asc__cmd-name" dir="auto" title={command.label}>
                          <SearchMatch text={command.label} query={q} />
                        </span>
                        {command.description && (
                          <span className="ui-asc__cmd-hint" dir="auto" title={command.description}>
                            <SearchMatch text={command.description} query={q} />
                          </span>
                        )}
                      </span>
                      {keys?.length ? (
                        <span className="ui-asc__cmd-keys" aria-hidden="true">
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
              <p className="ui-asc__cmd-empty" role="status">
                No results for “{q}”
              </p>
            )}
          </div>
        </div>
        <footer className="ui-asc__cmd-foot">
          <span>
            <kbd>Tab</kbd> to jump between sections
          </span>
          <span>
            <span className="ui-asc__cmd-keys">
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
      className="ui-asc__chat-row"
      key={chat.id}
      data-active={chat.id === activeChat || undefined}
      data-nested={nested || undefined}
    >
      {renaming === chat.id ? (
        <input
          ref={renameRef}
          className="ui-asc__rename"
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
          className="ui-asc__chat-link"
          aria-current={chat.id === activeChat ? "page" : undefined}
          title={chat.title}
          onClick={() => openChat(chat)}
        >
          <span dir="auto">{chat.title}</span>
          {chat.unread && <i className="ui-asc__unread" aria-label={labels.unread} />}
        </button>
      )}
      <span className="ui-asc__chat-tools">
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
    <button type="button" role="menuitem" className="ui-asc__wsm-item" key={label} onClick={() => menuAction(label)}>
      <WsGlyph name={icon} />
      <span className="ui-asc__wsm-label" title={label}>
        {labels.action(label)}
      </span>
    </button>
  );
  const wsSub = (label: string, icon: keyof typeof wsGlyphs, items: ReactNode) => (
    <span className="ui-asc__wsm-sub" data-open={wsOpen === label || undefined}>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={wsOpen === label}
        className="ui-asc__wsm-item"
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
        <span className="ui-asc__wsm-label" title={label}>
          {labels.action(label)}
        </span>
        <WsGlyph name="next" size={14} />
      </button>
      <span
        className="ui-asc__wsm-panel"
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
      className={["ui-asc", className].filter(Boolean).join(" ")}
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
          "--ui-asc-sidebar-width": `${clamp(safeNumber(sidebarWidth, 272), sidebarBounds.min, sidebarBounds.max)}px`,
          "--ui-asc-panel-width": `${clamp(safeNumber(panelWidth, 455), panelBounds.min, panelBounds.max)}px`,
          "--ui-asc-rail-width": `${railWidth}px`,
          ...style,
        } as CSSProperties
      }
      onKeyDown={onKeyDown}
    >
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <div className="ui-asc__app" data-header={header != null || undefined}>
        <button
          ref={sideOpenRef}
          type="button"
          className="ui-asc__drawer-trigger ui-asc__open-side"
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
            className="ui-asc__drawer-trigger ui-asc__open-panel"
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
            className="ui-asc__scrim"
            aria-label={sidebarOpen ? labels.closeSidebar : labels.closePanel(panelTitle)}
            tabIndex={-1}
            onClick={closeDrawer}
          />
        )}
        <aside
          ref={sidebar}
          className="ui-asc__side"
          id={`${id}-sidebar`}
          aria-label={labels.sidebar}
          inert={narrow ? !sidebarOpen : collapsed && !iconSidebar}
        >
          {rail && (
            <nav className="ui-asc__rail" aria-label={labels.apps}>
              <button
                type="button"
                className="ui-asc__logo"
                aria-label={workspace}
                title={workspace}
                aria-haspopup="menu"
                aria-expanded={menu === "workspace"}
                aria-controls={menu === "workspace" ? `${id}-menu` : undefined}
                {...trigger("workspace")}
              >
                {initials(workspace).slice(0, 1)}
              </button>
              <span className="ui-asc__rail-line" />
              {rail.items.filter(Boolean).map((item) => (
                <button
                  type="button"
                  className="ui-asc__rail-item"
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
              <span className="ui-asc__rail-space" />
              {rail.bottom?.filter(Boolean).map((item) => (
                <button
                  type="button"
                  className="ui-asc__rail-item"
                  key={item.label}
                  aria-label={item.count ? labels.unreadCount(item.label, item.count) : item.label}
                  title={item.label}
                  disabled={item.disabled}
                  onClick={() => navigate(item.label)}
                >
                  {item.icon ?? <Icon name="settings" size={19} />}{" "}
                  {!!item.count && <i className="ui-asc__notification-dot" />}
                </button>
              ))}
              <button
                type="button"
                className="ui-asc__user"
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
            className="ui-asc__side-col"
            data-navigation={!!navigation || undefined}
            data-history={showChatHistory || undefined}
          >
            {sidebarContent !== undefined ? (
              sidebarContent
            ) : (
              <>
                {navigation ? (
                  <div className="ui-asc__navigation">
                    <header className="ui-asc__nav-head">
                      <button
                        type="button"
                        className="ui-asc__nav-workspace"
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
                        className="ui-asc__icon-btn"
                        aria-label={collapsed && !narrow ? labels.expandSidebar : labels.collapseSidebar}
                        onClick={() => (narrow ? setSidebarOpen(false) : setCollapsed(!collapsed))}
                      >
                        <Icon name="panel" />
                      </button>
                    </header>
                    <button
                      type="button"
                      className="ui-asc__nav-search"
                      aria-label={labels.search}
                      aria-haspopup="dialog"
                      aria-expanded={searchOpen}
                      onClick={() => setSearchOpen(true)}
                    >
                      <Icon name="search" size={14} />
                      <span>{labels.searchPlaceholder}</span>
                      <kbd>⌘K</kbd>
                    </button>
                    <nav className="ui-asc__nav-items" aria-label={labels.workspace}>
                      {navigation.map((item, index) => (
                        <div key={item.label}>
                          {item.section && navigation[index - 1]?.section !== item.section && (
                            <div className="ui-asc__nav-section">{item.section}</div>
                          )}
                          <button
                            type="button"
                            className="ui-asc__nav-item"
                            aria-label={item.label}
                            aria-current={active === item.label ? "page" : undefined}
                            disabled={item.disabled}
                            onClick={() => {
                              if (showChatHistory && item.label === labels.newChat) onNewChat?.();
                              navigate(item.label);
                            }}
                          >
                            <span
                              className="ui-asc__nav-icon"
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
                  <header className="ui-asc__side-head">
                    <button
                      type="button"
                      className="ui-asc__project"
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
                      className="ui-asc__icon-btn"
                      aria-label={labels.search}
                      title={labels.searchHint}
                      onClick={() => setSearchOpen(true)}
                    >
                      <Icon name="search" />
                    </button>
                    <button
                      type="button"
                      className="ui-asc__mobile-close ui-asc__icon-btn"
                      aria-label={labels.closeSidebar}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon name="panel" />
                    </button>
                  </header>
                )}
                {(!navigation || showChatHistory) && (
                  <nav className="ui-asc__chat-nav" aria-label={labels.conversations}>
                    {!navigation && (
                      <button
                        type="button"
                        className="ui-asc__new-chat"
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
                      <div className="ui-asc__group">
                        <h2>{labels.pinned}</h2>
                        {shown.filter((chat) => chat.pinned).map((chat) => row(chat))}
                      </div>
                    )}
                    <div className="ui-asc__group">
                      <h2>{labels.projects}</h2>
                      {projectList
                        .filter((name) => !project || name === project)
                        .map((name) => (
                          <div key={name}>
                            <button
                              type="button"
                              className="ui-asc__folder"
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
                              <span className="ui-asc__folder-chevron">
                                <Icon name="chevron" size={12} />
                              </span>
                            </button>
                            <div
                              className="ui-asc__folder-wrap"
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
                      <div className="ui-asc__group">
                        <h2>{labels.chats}</h2>
                        {shown.filter((chat) => !chat.project && !chat.pinned).map((chat) => row(chat))}
                      </div>
                    )}
                    {!shown.length && <p className="ui-asc__empty">{labels.empty}</p>}
                  </nav>
                )}
                {sidebarFooter}
                {!rail && (
                  <button
                    type="button"
                    className="ui-asc__account-row"
                    aria-label={user.name}
                    aria-haspopup="menu"
                    aria-expanded={menu === "account"}
                    {...trigger("account")}
                  >
                    <span className="ui-asc__user-initials">{userAvatar}</span>
                    <span>{user.name}</span>
                    <Icon name="chevron" size={12} />
                  </button>
                )}
              </>
            )}
          </div>
        </aside>
        <div
          className="ui-asc__resizer"
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
          <div className="ui-asc__header" inert={!!drawer}>
            {header}
          </div>
        )}
        <main className="ui-asc__main" inert={!!drawer}>
          {children}
        </main>
        {hasPanel && (
          <>
            <div
              className="ui-asc__resizer ui-asc__panel-resizer"
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
              className="ui-asc__panel"
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
              ? `ui-asc__menu ui-asc__ws-menu${menu === "account" ? " ui-asc__account-menu" : ""}`
              : "ui-asc__menu"
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
              <span className="ui-asc__wsm-sep" role="separator" />
              {wsItem("Workspace settings", "settings")}
              {wsItem("Analytics", "analytics")}
              {wsItem("Billing", "billing")}
              {wsItem("Usage & limits", "usage")}
              {wsItem("Members", "members")}
              <span className="ui-asc__wsm-sep" role="separator" />
              {wsSub(
                "Learn more",
                "info",
                <>
                  {wsItem("Documentation", "docs")}
                  {wsItem("Changelog", "changelog")}
                  {wsItem("Help & feedback", "help")}
                </>,
              )}
              <span className="ui-asc__wsm-sep" role="separator" />
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
                        className="ui-asc__wsm-item"
                        data-rich=""
                        key={name}
                        onClick={() => menuAction(`Switch workspace: ${name}`)}
                      >
                        <span className="ui-asc__wsm-label" title={name}>
                          <span>{name}</span>
                          <small>{plan}</small>
                        </span>
                        {name === workspace && <WsGlyph name="check" size={14} />}
                      </button>
                    ))}
                  <span className="ui-asc__wsm-sep" role="separator" />
                  {wsItem("Create workspace", "plus")}
                </>,
              )}
            </>
          )}
          {menu === "projects" && (
            <>
              <div className="ui-asc__menu-label">{labels.projects}</div>
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
                  className="ui-asc__project-form"
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
              <div className="ui-asc__menu-user">
                <span className="ui-asc__user-initials">{userAvatar}</span>
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
                      className="ui-asc__wsm-item"
                      key={label}
                      onClick={() => {
                        setLanguage(label);
                        menuAction(`Language: ${label}`);
                      }}
                    >
                      <svg className="ui-asc__wsm-flag" viewBox="0 0 20 14" aria-hidden="true">
                        {flag}
                      </svg>
                      <span className="ui-asc__wsm-label">{label}</span>
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
                      className="ui-asc__wsm-item"
                      key={value}
                      onClick={() => {
                        setTheme(value);
                        setMenu(null);
                        anchor.current?.focus();
                      }}
                    >
                      <WsGlyph name={value} />
                      <span className="ui-asc__wsm-label">{labels.theme(value)}</span>
                      {theme === value && <WsGlyph name="check" size={14} />}
                    </button>
                  ))}
                </>,
              )}
              {wsItem("Integrations", "integrations")}
              {wsItem("Settings", "settings")}
              <span className="ui-asc__wsm-sep" role="separator" />
              {wsItem("Download apps", "download")}
              <span className="ui-asc__wsm-sep" role="separator" />
              {wsItem("Changelog", "changelog")}
              {wsSub(
                "Learn more",
                "info",
                <>
                  {wsItem("Documentation", "docs")}
                  {wsItem("Help & feedback", "help")}
                </>,
              )}
              <span className="ui-asc__wsm-sep" role="separator" />
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
              <div className="ui-asc__menu-label">{labels.moveToProject}</div>
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
      <span className="ui-asc__sr" role="status" aria-live="polite">
        {notice}
      </span>
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
    <div className="ui-wsfc">
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      {news < 2 && (
        <div className="ui-wsfc__news" style={news ? { paddingTop: 0 } : undefined}>
          {news === 0 && (
            <div className="ui-wsfc__news-back" aria-hidden="true">
              <span>New in {workspace}</span>
              <Icon name="close" size={12} />
            </div>
          )}
          <div className="ui-wsfc__news-card">
            <div className="ui-wsfc__news-top">
              <span>New in {workspace}</span>
              <button type="button" aria-label="Dismiss" onClick={() => setNews(news + 1)}>
                <Icon name="close" size={12} />
              </button>
            </div>
            <b>{news === 0 ? "Shared folders" : "Scheduled chats"}</b>
            <button type="button" className="ui-wsfc__changelog" onClick={() => onNavigate?.("Changelog")}>
              Full changelog
              <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      )}
      <div className="ui-wsfc__guide-slot">
        <div
          className="ui-wsfc__guide"
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
            className="ui-wsfc__steps"
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
            className="ui-wsfc__guide-content"
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
              <div className="ui-wsfc__progress">
                <progress aria-label="Getting started progress" value={1} max={8} />
                <span>1/8</span>
              </div>
              <div className="ui-wsfc__setup-groups">
                {workspaceSetup.map((section, index) => (
                  <section key={section.name} data-open={group === index || undefined}>
                    <button
                      type="button"
                      className="ui-wsfc__setup-head"
                      aria-expanded={group === index}
                      aria-controls={`${id}-setup-${index}`}
                      onClick={() => setGroup(group === index ? -1 : index)}
                    >
                      {section.name}
                      <Icon name="chevron" size={16} />
                    </button>
                    <div className="ui-wsfc__setup-list" data-open={group === index || undefined}>
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
                            <span className="ui-wsfc__setup-check">
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
      className={["ui-ccc", className].filter(Boolean).join(" ")}
      data-menu-open={!!menu || undefined}
      data-recording={recording || undefined}
      data-disabled={disabled || undefined}
    >
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      {overlay !== undefined && <div className="ui-ccc__overlay">{overlay}</div>}
      {showAttachments && attachments.length > 0 && (
        <ul className="ui-ccc__attachments" aria-label={labels.attachments}>
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
        className="ui-ccc__body"
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
          className={["ui-ccc__message", textareaProps?.className].filter(Boolean).join(" ")}
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
          <div className="ui-ccc__tools">
            <div className="ui-ccc__group" inert={recording}>
              <button
                ref={addRef}
                type="button"
                className="ui-ccc__icon-btn"
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
                className="ui-ccc__approval"
                data-tone={approval.id}
                disabled={blocked}
                aria-haspopup="menu"
                aria-expanded={menu === "approval"}
                aria-controls={menu === "approval" ? `${id}-menu` : undefined}
                onKeyDown={triggerKey("approval")}
                onClick={() => toggle("approval")}
              >
                <span className="ui-ccc__face" key={approval.id}>
                  <Icon name={approval.icon} size={14} />
                  <span>{labels.approval(approval.id)}</span>
                </span>
              </button>
              {plan && <span className="ui-ccc__plan">{labels.plan}</span>}
            </div>
            {recording ? (
              <div className="ui-ccc__recording" role="group" aria-label={labels.voiceRecording}>
                <span className="ui-ccc__timer">
                  {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, "0")}
                </span>
                <span className="ui-ccc__wave" aria-hidden="true">
                  {Array.from({ length: 22 }, (_, index) => (
                    <i
                      key={index}
                      style={{ height: `${4 + ((index * 7) % 14)}px`, animationDelay: `${index * -71}ms` }}
                    />
                  ))}
                </span>
                <button
                  type="button"
                  className="ui-ccc__icon-btn"
                  aria-label={labels.discardRecording}
                  onClick={() => stopRecording(false)}
                >
                  <Icon name="close" />
                </button>
                <button
                  type="button"
                  className="ui-ccc__send"
                  aria-label={labels.useRecording}
                  onClick={() => stopRecording(true)}
                >
                  <Icon name="check" />
                </button>
              </div>
            ) : (
              <div className="ui-ccc__group ui-ccc__group--end">
                {selectedModel && (
                  <button
                    ref={modelRef}
                    type="button"
                    className="ui-ccc__model"
                    disabled={blocked}
                    aria-haspopup="menu"
                    aria-expanded={menu === "model"}
                    aria-controls={menu === "model" ? `${id}-menu` : undefined}
                    onKeyDown={triggerKey("model")}
                    onClick={() => toggle("model")}
                  >
                    <span
                      className="ui-ccc__face"
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
                  className="ui-ccc__icon-btn"
                  aria-label={labels.voiceInput}
                  disabled={blocked || !voiceEnabled}
                  onClick={startRecording}
                >
                  <Icon name="mic" />
                </button>
                <button
                  type="button"
                  className="ui-ccc__send"
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
      {footer && <div className="ui-ccc__footer">{footer}</div>}
      {error && (
        <p className="ui-ccc__error" role="alert">
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
          className="ui-ccc__menu"
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
              <div className="ui-ccc__menu-title">{labels.models}</div>
              {list.map((item) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedModel?.id === item.id}
                  className="ui-ccc__option"
                  key={item.id}
                  onClick={() => {
                    setModel(item.id);
                    setMenu(null);
                    modelRef.current?.focus();
                  }}
                >
                  <span
                    className="ui-ccc__option-logo"
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
                  <span className="ui-ccc__option-text">
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
              <div className="ui-ccc__menu-title">{labels.permissions}</div>
              {approvalOptions.map((item) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={approval.id === item.id}
                  className="ui-ccc__option"
                  key={item.id}
                  onClick={() => {
                    setApproval(item.id);
                    setMenu(null);
                    approvalRef.current?.focus();
                  }}
                >
                  <span className="ui-ccc__option-logo" aria-hidden="true">
                    <Icon name={item.icon} />
                  </span>
                  <span className="ui-ccc__option-text">
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
              <div className="ui-ccc__menu-title">{labels.add}</div>
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
                  className="ui-ccc__option"
                  key={action}
                  onClick={() => chooseAction(action)}
                >
                  <span className="ui-ccc__option-logo" aria-hidden="true">
                    <Icon name={icon} />
                  </span>
                  <span className="ui-ccc__option-text">
                    <span>{label}</span>
                    {description && <small>{description}</small>}
                  </span>
                  {action === "plan" && plan && <Icon name="check" size={14} />}
                </button>
              ))}
              <div className="ui-ccc__menu-title">{labels.plugins}</div>
              {(
                [
                  ["document", labels.documents, labels.documentsDescription],
                  ["pdf", labels.pdf, labels.pdfDescription],
                ] as const
              ).map(([action, label, description]) => (
                <button
                  type="button"
                  role="menuitem"
                  className="ui-ccc__option"
                  key={action}
                  onClick={() => chooseAction(action)}
                >
                  <span className="ui-ccc__option-logo" aria-hidden="true">
                    <Icon name="document" />
                  </span>
                  <span className="ui-ccc__option-text">
                    <span>{label}</span>
                    <small>{description}</small>
                  </span>
                </button>
              ))}
            </>
          )}
          {menu === "apps" && (
            <>
              <div className="ui-ccc__menu-title">{labels.connectApps}</div>
              {["Web search", "Google Drive", "Gmail", "Notion"].map((app) => (
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={connected.includes(app)}
                  className="ui-ccc__option"
                  key={app}
                  onClick={() => {
                    setConnected(
                      connected.includes(app) ? connected.filter((item) => item !== app) : [...connected, app],
                    );
                    onAction?.(`connect:${app}`);
                  }}
                >
                  <Icon name={app === "Web search" ? "globe" : "plug"} />
                  <span className="ui-ccc__option-text">{app === "Web search" ? labels.webSearch : app}</span>
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
    <div ref={root} className={["ui-afdc", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <div className="ui-afdc__toolbar">
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
      <label className="ui-afdc__search">
        <Icon name="search" size={13} />
        <input
          aria-label={`Search ${name}`}
          placeholder={`Search ${name}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {view !== "icons" && (
        <div className="ui-afdc__columns">
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
        className="ui-afdc__items"
        data-view={view === "icons" ? "icons" : "list"}
        role="listbox"
        aria-label={`${name} files`}
        aria-multiselectable="true"
      >
        {list.map((entry) =>
          renaming === entry.name ? (
            <div className="ui-afdc__rename" key={entry.name}>
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
              className="ui-afdc__item"
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
              <span className="ui-afdc__name">
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
      {!list.length && <p className="ui-afdc__empty">{query ? "No matching files" : "This folder is empty"}</p>}
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
          className="ui-afdc__menu"
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
      <span role="status" className="ui-afdc__sr">
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
    <div className={["ui-aivc", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <div className="ui-aivc__toolbar">
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
      <div className="ui-aivc__canvas">
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
      className={["ui-awc", className].filter(Boolean).join(" ")}
      aria-label="File workspace"
      onKeyDown={(event) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !isEditing(event.target)) {
          event.preventDefault();
          travel(event.shiftKey ? "redo" : "undo");
        }
      }}
    >
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <header className="ui-awc__bar">
        <div ref={tabs} className="ui-awc__tabs" role="tablist" aria-label="Open files">
          {names.map((name) => (
            <div
              className="ui-awc__tab-wrap"
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
                className="ui-awc__tab"
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
                className="ui-awc__tab-close"
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
          className="ui-awc__tool"
          aria-label="New tab"
          title="New tab"
          onClick={() => (onNewTab ? onNewTab() : setActive("__new"))}
        >
          <Icon name="plus" size={16} />
        </button>
        {onClose && (
          <button type="button" className="ui-awc__tool ui-awc__collapse" aria-label={closeLabel} onClick={onClose}>
            <Icon name="panel" />
          </button>
        )}
      </header>
      <div
        className="ui-awc__pane"
        id={`${id}-pane`}
        role="tabpanel"
        aria-labelledby={file || extraTab ? `${id}-${encodeURIComponent(currentName)}` : undefined}
        aria-label={file || extraTab ? undefined : "Open a file"}
      >
        {extraTab ? (
          extraTab.content
        ) : file ? (
          <>
            <header className="ui-awc__heading">
              <span className="ui-awc__file-icon" data-kind={file.kind}>
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
          <div className="ui-awc__start">
            <Icon name="document" size={28} />
            <h2>What would you like to open?</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Find a file"
              placeholder="Search files…"
            />
            <div className="ui-awc__create">
              <button type="button" onClick={() => create("document")}>
                <Icon name="document" />
                New document
              </button>
              <button type="button" onClick={() => create("table")}>
                <Icon name="table" />
                New spreadsheet
              </button>
            </div>
            <p className="ui-awc__start-label">Files in this conversation</p>
            {list
              .filter((item) => item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
              .map((item) => (
                <button type="button" className="ui-awc__file-row" key={item.name} onClick={() => open(item.name)}>
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
    <div className="ui-awc__code">
      <div className="ui-awc__toolbar">
        <span className="ui-awc__code-language">{file.language ?? "Plain text"}</span>
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
      <div className="ui-awc__code-body">
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
      <span className="ui-awc__code-notice" role="status">
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
      className="ui-awc__tool"
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
    <div ref={root} className="ui-awc__sheet">
      <div className="ui-awc__toolbar" role="toolbar" aria-label="Spreadsheet tools">
        <WorkspaceToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={onUndo} />
        <WorkspaceToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={onRedo} />
        <span className="ui-awc__divider" />
        <WorkspaceToolbarButton
          icon="bold"
          label="Bold"
          pressed={bold.includes(address)}
          onClick={() => setBold(bold.includes(address) ? bold.filter((item) => item !== address) : [...bold, address])}
        />
        <button
          ref={formatRef}
          type="button"
          className="ui-awc__format"
          aria-haspopup="menu"
          aria-expanded={menu === "format"}
          aria-controls={menu === "format" ? `${id}-menu` : undefined}
          onClick={() => setMenu(menu === "format" ? null : "format")}
        >
          <span>Aa</span>
          {format}
          <Icon name="chevron" size={10} />
        </button>
        <span className="ui-awc__divider" />
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
        <span className="ui-awc__divider" />
        <WorkspaceToolbarButton icon="row" label="Insert row above" onClick={() => modify("row")} />
        <WorkspaceToolbarButton icon="column" label="Insert column left" onClick={() => modify("column")} />
        <button
          ref={deleteRef}
          type="button"
          className="ui-awc__tool"
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
      <div className="ui-awc__formula">
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
      <div className="ui-awc__grid-wrap">
        <table
          ref={grid}
          className="ui-awc__grid"
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
              <th className="ui-awc__corner" />
              {Array.from({ length: columnCount }, (_, column) => (
                <th scope="col" key={column} data-selected={column === cell.column || undefined}>
                  {columnName(column)}
                  <button
                    type="button"
                    className="ui-awc__col-resize"
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
                        className="ui-awc__cell-input"
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
      <div className="ui-awc__sheet-status" role="status" aria-live="polite">
        {editing ? `Editing ${address}` : ""}
      </div>
      {menu && (
        <FloatingMenu
          anchor={menu === "format" ? formatRef : deleteRef}
          root={root}
          className="ui-awc__menu"
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
    <div className="ui-awc__document">
      <div className="ui-awc__toolbar" role="toolbar" aria-label="Document formatting">
        <WorkspaceToolbarButton icon="undo" label="Undo" disabled={!canUndo} onClick={onUndo} />
        <WorkspaceToolbarButton icon="redo" label="Redo" disabled={!canRedo} onClick={onRedo} />
        <span className="ui-awc__divider" />
        <select
          className="ui-awc__text-style"
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
          className="ui-awc__link-form"
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
        className="ui-awc__doc"
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
      <footer className="ui-awc__doc-status">
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
    <section className={["ui-wstc", className].filter(Boolean).join(" ")} aria-label="New workspace tab">
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <form
        className="ui-wstc__search"
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
      <div className="ui-wstc__card">
        {tools
          .filter((tool) => tool.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
          .map((tool) => (
            <button type="button" className="ui-wstc__tool" key={tool.kind} onClick={() => onOpenTool?.(tool.kind)}>
              <span className="ui-wstc__icon">
                <Icon name={tool.icon} size={15} />
              </span>
              <span>{tool.label}</span>
              <kbd>{tool.hint}</kbd>
            </button>
          ))}
      </div>
      <h2>Suggested</h2>
      <div className="ui-wstc__card">
        {sources.map((source) => (
          <button
            type="button"
            className="ui-wstc__source"
            key={source.id ?? source.artifact ?? source.name}
            onClick={() => onOpenSource?.(source)}
          >
            <span
              className="ui-wstc__icon"
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
        {sources.length === 0 && <p className="ui-wstc__empty">No matching sources</p>}
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
      className={["ui-wstc", "ui-wstc__tool-pane", className].filter(Boolean).join(" ")}
      data-tool={kind}
      aria-label={kind === "terminal" ? "Terminal" : kind === "browser" ? "Browser" : "Notes"}
    >
      <style href="ui-agent-chat-clean" precedence="default">
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
          <div className="ui-wstc__terminal-output" ref={output} role="log" aria-live="polite">
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <form
            className="ui-wstc__command"
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
            className="ui-wstc__search"
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
          <div className="ui-wstc__browser-home">
            <Icon name="globe" size={36} />
            <h2>Browser</h2>
            <p>Enter an address to open it.</p>
          </div>
        </>
      )}
    </section>
  );
}

export type CampaignAngle = "Desire-driven" | "Problem–solution" | "Social proof";
export type CampaignSection = "brief" | "assets" | "activity";
export type CampaignChannels = { instagram: boolean; tiktok: boolean; facebook: boolean };
export type CampaignAsset = { id: string; title: string; format: string; channel: string; color: string; ink?: string };
export type CampaignBriefProps = {
  angle?: CampaignAngle;
  defaultAngle?: CampaignAngle;
  onAngleChange?: (angle: CampaignAngle) => void;
  channels?: CampaignChannels;
  defaultChannels?: CampaignChannels;
  onChannelsChange?: (channels: CampaignChannels) => void;
  section?: CampaignSection;
  defaultSection?: CampaignSection;
  onSectionChange?: (section: CampaignSection) => void;
  assets?: CampaignAsset[];
  generating?: boolean;
  onGenerate?: () => void;
  onOpenFile?: (name: string) => void;
  className?: string;
};
export const defaultCampaignAssets: CampaignAsset[] = [
  { id: "evening", title: "The first warm evening", format: "Feed", channel: "Instagram", color: "#e3d3b8" },
  { id: "july", title: "Made for July", format: "Story", channel: "TikTok", color: "#7c8458", ink: "#f4f1ea" },
  { id: "linen", title: "Linen, finally", format: "Feed", channel: "Instagram", color: "#f4f1ea" },
  {
    id: "orders",
    title: "412 people can't be wrong",
    format: "Story",
    channel: "Instagram",
    color: "#1f2328",
    ink: "#f4f1ea",
  },
  { id: "breathe", title: "Breathe out", format: "Banner", channel: "Facebook", color: "#c9b48f" },
  { id: "summer", title: "Summer, unbuttoned", format: "Feed", channel: "TikTok", color: "#a3a77f" },
];
const campaignAngles: { name: CampaignAngle; detail: string; signal: number }[] = [
  { name: "Desire-driven", detail: "The first warm evening", signal: 3 },
  { name: "Problem–solution", detail: "Heat, itchy fabrics", signal: 2 },
  { name: "Social proof", detail: "412 sold, top reviews", signal: 1 },
];
function CampaignShirt({ size = 18 }: { size?: number }) {
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
      <path d="M6 12v5.684c0 1.811 0 2.717.583 3.28.665.639 3.033 1.015 5.41 1.035 2.316.02 4.641-.297 5.409-1.035.586-.563.586-1.469.586-3.28V12" />
      <path d="M5.722 14.022c-.865-.314-2.492-.583-3.226-1.319-1.01-1.013-.357-2.383.881-4.964.557-1.162 1.624-2.017 2.867-2.355.168-.046.315-.151.412-.296l1.283-1.999a.5.5 0 0 1 .142-.138C8.659 2.602 10.092 2 11.993 2s3.239.602 3.818.951a.5.5 0 0 1 .141.138l1.32 1.98c.097.145.244.251.412.297 1.243.338 2.261 1.084 2.819 2.246 1.391 2.529 2.008 4.059.998 5.072-.734.736-2.383 1.028-3.249 1.341" />
      <path d="m6.501 5.5 4.233 3.293c.607.471.91.707 1.267.707s.66-.236 1.267-.707L17.501 5.5M9.501 3l1.5 6M14.501 3l-1.5 6" />
    </svg>
  );
}
function CampaignChannelIcon({ name }: { name: keyof CampaignChannels }) {
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
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" />
      {name === "instagram" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.25" cy="6.75" r=".25" />
        </>
      ) : name === "tiktok" ? (
        <path d="M10.536 11.008c-.82-.116-2.689.075-3.606 1.77s.007 3.459.584 4.129c.569.627 2.378 1.814 4.297.655.476-.287 1.068-.502 1.741-2.747l-.078-8.834c-.13.973.945 3.255 4.004 3.525" />
      ) : (
        <path d="M16.927 8.026h-2.945a1.9 1.9 0 0 0-1.9 1.886l-.086 11.515M10.082 14.002h4.803" />
      )}
    </svg>
  );
}
/** The campaign brief, generated-ad gallery and activity timeline. Generation is caller-owned. */
export function CampaignBrief({
  angle: angleProp,
  defaultAngle = "Desire-driven",
  onAngleChange,
  channels: channelsProp,
  defaultChannels = { instagram: true, tiktok: true, facebook: false },
  onChannelsChange,
  section: sectionProp,
  defaultSection = "brief",
  onSectionChange,
  assets = [],
  generating = false,
  onGenerate,
  onOpenFile,
  className,
}: CampaignBriefProps) {
  const [angle, setAngle] = useControllable(angleProp, defaultAngle, onAngleChange),
    [channels, setChannels] = useControllable(channelsProp, defaultChannels, onChannelsChange),
    [section, setSection] = useControllable(sectionProp, defaultSection, onSectionChange);
  const tabs = useRef<HTMLDivElement>(null),
    radios = useRef<HTMLDivElement>(null),
    button = useMorph(String(generating)),
    id = useId();
  const sections: CampaignSection[] = ["brief", "assets", "activity"];
  const selectKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    count: number,
    select: (index: number) => void,
  ) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % count
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + count) % count
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      select(next);
    }
  };
  const generate = (
    <button ref={button} type="button" className="ui-cbrc__generate" disabled={generating} onClick={onGenerate}>
      <span key={String(generating)}>{generating ? "Generating…" : "Generate ads"}</span>
    </button>
  );
  return (
    <section className={["ui-cbrc", className].filter(Boolean).join(" ")} aria-label="Campaign brief">
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <div ref={tabs} className="ui-cbrc__seg" role="tablist" aria-label="Brief sections">
        {sections.map((value, index) => (
          <button
            type="button"
            role="tab"
            id={`${id}-${value}`}
            aria-selected={section === value}
            aria-controls={`${id}-panel`}
            tabIndex={section === value ? 0 : -1}
            key={value}
            onClick={() => setSection(value)}
            onKeyDown={(event) =>
              selectKey(event, index, sections.length, (next) => {
                setSection(sections[next]);
                tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
              })
            }
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
      <div
        className="ui-cbrc__panel"
        key={section}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${section}`}
      >
        {section === "brief" ? (
          <>
            <div className="ui-cbrc__product">
              <span className="ui-cbrc__thumb">
                <CampaignShirt />
              </span>
              <span className="ui-cbrc__pinfo">
                <b>Linen Overshirt</b>
                <span>$89 · 412 sold this month</span>
              </span>
              <span className="ui-cbrc__chip">Bestseller</span>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label" id={`${id}-angle`}>
                Selling angle
              </span>
              <div className="ui-cbrc__card" ref={radios} role="radiogroup" aria-labelledby={`${id}-angle`}>
                {campaignAngles.map((option, index) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={angle === option.name}
                    tabIndex={angle === option.name ? 0 : -1}
                    className="ui-cbrc__option"
                    key={option.name}
                    onClick={() => setAngle(option.name)}
                    onKeyDown={(event) =>
                      selectKey(event, index, campaignAngles.length, (next) => {
                        setAngle(campaignAngles[next].name);
                        radios.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
                      })
                    }
                  >
                    <span className="ui-cbrc__radio" aria-hidden="true" />
                    <span className="ui-cbrc__name">
                      <span>{option.name}</span>
                      <small>{option.detail}</small>
                    </span>
                    <span className="ui-cbrc__signal" aria-label={`${option.signal} of 3 signals`}>
                      {[0, 1, 2].map((signal) => (
                        <i key={signal} data-on={signal < option.signal || undefined} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Audience</span>
              <div className="ui-cbrc__card">
                <div className="ui-cbrc__pills">
                  {["Women 25–34", "Urban", "Warm climates", "Linen & natural fabrics"].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Channels</span>
              <div className="ui-cbrc__card">
                {(
                  [
                    { id: "instagram", name: "Instagram", detail: "Feed and Stories" },
                    { id: "tiktok", name: "TikTok", detail: "Story format only" },
                    { id: "facebook", name: "Facebook", detail: "Feed and Banner" },
                  ] as const
                ).map((channel) => (
                  <label className="ui-cbrc__channel" key={channel.id}>
                    <CampaignChannelIcon name={channel.id} />
                    <span className="ui-cbrc__name">
                      <span>{channel.name}</span>
                      <small>{channel.detail}</small>
                    </span>
                    <span className="ui-cbrc__switch">
                      <input
                        type="checkbox"
                        role="switch"
                        aria-label={channel.name}
                        checked={channels[channel.id]}
                        onChange={(event) => setChannels({ ...channels, [channel.id]: event.target.checked })}
                      />
                      <span className="ui-cbrc__track">
                        <span />
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="ui-cbrc__card ui-cbrc__split">
              <div>
                <span className="ui-cbrc__label">Palette</span>
                <div className="ui-cbrc__swatches">
                  {[
                    ["Sand", "#e3d3b8"],
                    ["Olive", "#7c8458"],
                    ["Off-white", "#f4f1ea"],
                    ["Ink", "#1f2328"],
                  ].map(([name, color]) => (
                    <span key={name}>
                      <i style={{ background: color }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="ui-cbrc__label">Formats</span>
                <div className="ui-cbrc__formats">
                  {[
                    ["Feed", "1"],
                    ["Story", "9/16"],
                    ["Banner", "16/9"],
                  ].map(([name, ratio]) => (
                    <span key={name}>
                      <i style={{ aspectRatio: ratio }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Details</span>
              <div className="ui-cbrc__card">
                <dl className="ui-cbrc__details">
                  {[
                    ["Launch", "Mon, Jun 2", "tasks"],
                    ["Budget", "$2,400 / week", "table"],
                    ["Markets", "US, UK, AU", "globe"],
                  ].map(([name, value, icon]) => (
                    <div key={name}>
                      <dt>
                        <Icon name={icon as IconName} size={15} />
                        {name}
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Files</span>
              <div className="ui-cbrc__files">
                {["brand-guide.md", "launch-budget.csv", "product-photos"].map((name) => (
                  <button type="button" key={name} onClick={() => onOpenFile?.(name)}>
                    <Icon
                      name={name.endsWith("csv") ? "table" : name === "product-photos" ? "folder" : "document"}
                      size={13}
                    />
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <footer className="ui-cbrc__go">
              <div className="ui-cbrc__tags">
                <span>6 ads</span>
                <span>~2 min</span>
              </div>
              {generate}
            </footer>
          </>
        ) : section === "assets" ? (
          assets.length ? (
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">
                {assets.length} ads · {angle}
              </span>
              <div className="ui-cbrc__ads">
                {assets.map((asset, index) => (
                  <figure className="ui-cbrc__ad" key={asset.id} style={{ "--ui-cbrc-index": index } as CSSProperties}>
                    <div className="ui-cbrc__art" style={{ background: asset.color, color: asset.ink ?? "#1f2328" }}>
                      <CampaignShirt size={22} />
                      <b>{asset.title}</b>
                    </div>
                    <figcaption>
                      <b>{asset.format}</b>
                      <span>{asset.channel}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div className="ui-cbrc__empty">
              <span>
                <Icon name="image" size={22} />
              </span>
              <b>No assets yet</b>
              <p>Fill in the brief and generate ads – they show up here.</p>
              {generate}
            </div>
          )
        ) : (
          <ol className="ui-cbrc__activity">
            {[
              [`Angle set to ${angle}`, "2 min ago", "spark"],
              ["Brand research checked the palette", "3 min ago", "search"],
              ["Linen Overshirt picked as bestseller", "4 min ago", "check"],
              ["Shopify import started", "6 min ago", "plug"],
              ["Brief “Summer launch” created", "7 min ago", "document"],
            ].map(([text, time, icon], index) => (
              <li key={text} style={{ "--ui-cbrc-index": index } as CSSProperties}>
                <span className="ui-cbrc__activity-icon">
                  <Icon name={icon as IconName} size={13} />
                </span>
                <span>
                  {text}
                  <small>{time}</small>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export type CampaignChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  worked?: string;
  steps?: string[];
  agents?: boolean;
};
export type AgentChatScreenProps = Omit<
  AppShellProps,
  "children" | "panel" | "panelTitle" | "navigation" | "showChatHistory"
> & {
  title?: string;
  defaultTitle?: string;
  onTitleChange?: (title: string) => void;
  messages?: CampaignChatMessage[];
  defaultMessages?: CampaignChatMessage[];
  onMessagesChange?: (messages: CampaignChatMessage[]) => void;
  onSend?: (text: string, options: ChatComposerSendOptions) => void;
  onStop?: () => void;
  busy?: boolean;
  simulate?: boolean;
  composerProps?: Omit<ChatComposerProps, "onSend">;
  briefProps?: CampaignBriefProps;
  files?: ArtifactFile[];
  defaultFiles?: ArtifactFile[];
  onFilesChange?: (files: ArtifactFile[]) => void;
  onOpenFile?: (name: string) => void;
  onOpenUrl?: (url: string) => void;
};
export const defaultCampaignMessages: CampaignChatMessage[] = [
  { id: "angle", role: "user", text: "Desire-driven" },
  { id: "intro", role: "assistant", text: "I'll pull your bestseller first, then line up the creative generation." },
  {
    id: "bestseller",
    role: "assistant",
    worked: "3m 38s",
    text: "Your bestseller is the Linen Overshirt (the only product synced so far – Shopify is still importing, so treat that ranking as provisional).\n\nBefore I brief and generate the ads, I need one thing I can't infer, because it drives the whole copy structure: how should we sell this shirt?",
    agents: true,
  },
];
const campaignChats: AppChat[] = [
  { id: "launch", title: "Q3 launch messaging", pinned: true },
  { id: "hooks", title: "Ad hooks for the linen overshirt", project: "Q3 Campaign", unread: true },
  { id: "budget", title: "Q3 budget split by channel", project: "Q3 Campaign" },
  { id: "campaign", title: "Generate on-brand creative" },
  { id: "onboarding", title: "Onboarding email draft" },
  { id: "calendar", title: "August content calendar" },
];
const campaignPhoto = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><rect x=".5" y=".5" width="119" height="79" rx="6" fill="#f5f5f5" stroke="#dedede"/><rect x="26" y="14" width="44" height="54" rx="8" fill="#d4d4d4"/><rect x="40" y="14" width="16" height="10" rx="3" fill="#a3a3a3"/></svg>')}`;
export const defaultCampaignFiles: ArtifactFile[] = [
  {
    kind: "document",
    name: "brand-guide.md",
    updated: "Summer launch · 2 days ago",
    content:
      "# Brand guide – summer\n\nWarm, unhurried and a little sun-faded. We show the moment first and the product second; the copy talks like a friend who knows fabric.\n\n- Sand, olive, off-white and ink – nothing neon\n- Real people outdoors, late light, no studio white\n- Short lines; one idea per ad",
  },
  {
    kind: "table",
    name: "launch-budget.csv",
    updated: "Summer launch · 2 days ago",
    rows: [
      ["Channel", "Weekly", "Weeks", "Total"],
      ["Instagram", "1200", "4", "$4,800"],
      ["TikTok", "800", "4", "$3,200"],
      ["Facebook", "400", "2", "$800"],
      ["Total", "2400", "", "$8,800"],
    ],
  },
  {
    kind: "folder",
    name: "product-photos",
    updated: "Summer launch",
    entries: [
      { name: "overshirt-back.png", kind: "image", size: "398 KB", bytes: 407552, modified: "Nov 4" },
      { name: "overshirt-detail.png", kind: "image", size: "276 KB", bytes: 282624, modified: "Nov 4" },
      { name: "overshirt-front.png", kind: "image", size: "412 KB", bytes: 421888, modified: "Nov 4" },
    ],
  },
  ...["back", "detail", "front"].map((view) => ({
    kind: "image" as const,
    name: `overshirt-${view}.png`,
    src: campaignPhoto,
    updated: "Summer launch · 2 days ago",
  })),
];
const campaignAgents = [
  "Campaign manager",
  "Brand research",
  "Creative pipeline",
  "Audience research",
  "Creative direction",
];
function CampaignAgentIcon({ index, size = 14 }: { index: number; size?: number }) {
  const paths = [
    "M9 14V6H6a4 4 0 0 0 0 8h3Zm0 0 .965 4.823A1.66 1.66 0 0 1 8.34 21a1.66 1.66 0 0 1-1.62-1.31L5.5 14M9 6h1c1.298 0 2.561-.421 3.6-1.2l2.147-1.61A.95.95 0 0 1 17.21 3.65C17.55 4.79 18 6.73 18 10s-.45 5.21-.79 6.35a.95.95 0 0 1-1.463.46L13.6 15.2A6 6 0 0 0 10 14H9m12-4h1m-1.5-4 1-.594m-1 8.594 1 .648",
    "M17 12a5 5 0 1 1-5-5m2-4.8A10 10 0 1 0 21.8 10m-9.77 1.963 4.553-4.553m3.157-3.065-.553-1.987c-.102-.328-.496-.458-.761-.241-1.436 1.173-3 2.754-1.723 5.248 2.574 1.2 4.044-.419 5.17-1.78a.49.49 0 0 0-.249-.775l-1.884-.465Z",
    "M22 12a10 10 0 1 0-10 10c.842 0 2 .116 2-1 0-.609-.317-1.079-.631-1.546-.46-.682-.917-1.359-.369-2.454.667-1.333 1.778-1.333 3.482-1.333.851 0 1.851 0 3.018-.167 2.101-.3 2.5-1.592 2.5-3.5ZM11 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 15h.125",
    "M18.5 20.5c-.234-2.932-2.658-5.252-5.692-5.448L12 15l-.812.03c-3.007.142-5.458 2.567-5.688 5.47m9.75-11.25a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Zm-9.747-.75A3.25 3.25 0 0 1 9.5 3.752m8.997 4.748a3.25 3.25 0 0 0-3.997-4.748M22 18c-.18-2.263-2.001-4.5-4.001-5M2 18c.18-2.263 2-4.5 4-5",
    "M7 4.5a3 3 0 0 0-2.567 4.554 3 3 0 0 0 0 5.892M7 4.5a2.5 2.5 0 0 1 5 0v15a2.5 2.5 0 0 1-5 0 3 3 0 0 1-2.567-4.554M7 4.5c0 .818.393 1.544 1 2m-3.567 8.446A3 3 0 0 1 6 13.67m11 5.83a3 3 0 0 0 2.567-4.554 3 3 0 0 0 0-5.892M17 19.5a2.5 2.5 0 0 1-5 0v-15a2.5 2.5 0 0 1 5 0 3 3 0 0 1 2.567 4.554M17 19.5c0-.818-.393-1.544-1-2m3.567-8.446A3 3 0 0 1 18 10.33",
  ];
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
      <path d={paths[index]} />
    </svg>
  );
}
/** AI Chat / Agents: the orchestrator conversation beside the Summer launch brief and editable files. */
export function AgentChatScreen({
  title: titleProp,
  defaultTitle = "Generate on-brand creative",
  onTitleChange,
  messages: messagesProp,
  defaultMessages = defaultCampaignMessages,
  onMessagesChange,
  onSend,
  onStop,
  busy: busyProp,
  simulate = onSend === undefined && messagesProp === undefined,
  composerProps,
  briefProps = {},
  files: filesProp,
  defaultFiles = defaultCampaignFiles,
  onFilesChange,
  onOpenFile,
  onOpenUrl,
  workspace = "Acme",
  user = { name: "Alex Morgan", email: "alex@acme.com" },
  chats: chatsProp,
  defaultChats = campaignChats,
  onChatsChange,
  defaultProjects = ["Q3 Campaign", "Brand assets", "Hiring", "Research"],
  defaultActiveChat = "campaign",
  defaultActive = "",
  defaultPanelWidth = 368,
  panelOpen: panelOpenProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  sidebarFooter,
  onNavigate,
  onChatAction,
  className,
  ...shellProps
}: AgentChatScreenProps) {
  const [title, setTitle] = useControllable(titleProp, defaultTitle, onTitleChange),
    [messages, setMessages] = useControllable(messagesProp, defaultMessages, onMessagesChange),
    [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange);
  const [chats, setChats] = useControllable(chatsProp, defaultChats, onChatsChange),
    pinned = chats.find((chat) => chat.id === "campaign")?.pinned ?? false;
  const [angle, setAngle] = useControllable(
      briefProps.angle,
      briefProps.defaultAngle ?? "Desire-driven",
      briefProps.onAngleChange,
    ),
    [channels, setChannels] = useControllable(
      briefProps.channels,
      briefProps.defaultChannels ?? { instagram: true, tiktok: true, facebook: false },
      briefProps.onChannelsChange,
    ),
    [section, setSection] = useControllable(
      briefProps.section,
      briefProps.defaultSection ?? "brief",
      briefProps.onSectionChange,
    );
  const [panelOpen, setPanelOpen] = useControllable(panelOpenProp, defaultPanelOpen, onPanelOpenChange);
  const [opened, setOpened] = useState(["__brief"]),
    [activeFile, setActiveFile] = useState("__brief"),
    [assets, setAssets] = useState<CampaignAsset[]>([]),
    [generating, setGenerating] = useState(false),
    [thinking, setThinking] = useState(false),
    [menu, setMenu] = useState(false),
    [renaming, setRenaming] = useState(false),
    [draft, setDraft] = useState(title),
    [notice, setNotice] = useState("");
  const [toolValues, setToolValues] = useState<Record<string, string>>({}),
    [terminalLines, setTerminalLines] = useState(["Acme", "Type help to see available commands."]);
  const root = useRef<HTMLDivElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    renameInput = useRef<HTMLInputElement>(null),
    scroll = useRef<HTMLDivElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    sequence = useRef(0),
    replyTimer = useRef<number | undefined>(undefined),
    generateTimer = useRef<number | undefined>(undefined),
    id = useId();
  const busy = busyProp ?? thinking,
    liveMessages = useRef(messages),
    previousMessages = useRef(messages);
  liveMessages.current = messages;
  useEffect(
    () => () => {
      window.clearTimeout(replyTimer.current);
      window.clearTimeout(generateTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (renaming) renameInput.current?.select();
  }, [renaming]);
  useEffect(() => {
    if (previousMessages.current !== messages) {
      if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
      previousMessages.current = messages;
    }
  }, [messages]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const openFile = (name: string) => {
    setOpened((previous) => (previous.includes(name) ? previous : [...previous, name]));
    setActiveFile(name);
    setPanelOpen(true);
    onOpenFile?.(name);
    briefProps.onOpenFile?.(name);
  };
  const generate = () => {
    if (briefProps.onGenerate) {
      briefProps.onGenerate();
      return;
    }
    if (generating || briefProps.assets !== undefined || briefProps.generating !== undefined) return;
    setGenerating(true);
    generateTimer.current = window.setTimeout(() => {
      setAssets(defaultCampaignAssets);
      setGenerating(false);
      setSection("assets");
    }, 1600);
  };
  const stop = () => {
    window.clearTimeout(replyTimer.current);
    setThinking(false);
    onStop?.();
    input.current?.focus();
  };
  const send = (text: string, options: ChatComposerSendOptions) => {
    setMessages([...messages, { id: `user-${++sequence.current}`, role: "user", text }]);
    onSend?.(text, options);
    if (!simulate) return;
    setThinking(true);
    replyTimer.current = window.setTimeout(() => {
      setThinking(false);
      setMessages([
        ...liveMessages.current,
        {
          id: `assistant-${++sequence.current}`,
          role: "assistant",
          worked: "2s",
          steps: [
            "Reading the brief",
            "Checking 412 orders of the Linen Overshirt",
            "Lining up the creative pipeline",
            "Ready",
          ],
          text: `Good call. I'll go with ${angle.toLowerCase()} – it fits the bestseller and the summer launch.\n\nCopy will lead with the moment, the product follows; every ad ends on the same offer.\n\nHit Generate ads in the brief when you're ready – six ads take about two minutes.`,
        },
      ]);
    }, 2000);
  };
  const rename = () => {
    if (draft.trim()) {
      setTitle(draft.trim());
      setChats(chats.map((chat) => (chat.id === "campaign" ? { ...chat, title: draft.trim() } : chat)));
    }
    setRenaming(false);
    requestAnimationFrame(() => menuButton.current?.focus());
  };
  const action = (value: string) => {
    setMenu(false);
    onChatAction?.(value, "campaign");
    if (value === "rename") {
      setDraft(title);
      setRenaming(true);
    } else if (value === "pin" || value === "unpin")
      setChats(chats.map((chat) => (chat.id === "campaign" ? { ...chat, pinned: !pinned } : chat)));
    else if (value === "delete") {
      stop();
      setMessages([]);
      setChats(chats.filter((chat) => chat.id !== "campaign"));
    } else if (value === "share")
      navigator.clipboard
        ?.writeText(title)
        .then(() => setNotice("Conversation title copied"))
        .catch(() => setNotice("Couldn't copy. Please try again."));
    if (value !== "rename") menuButton.current?.focus();
  };
  const brief = (
    <div className="ui-agcc__brief-scroll">
      <CampaignBrief
        {...briefProps}
        angle={angle}
        onAngleChange={setAngle}
        channels={channels}
        onChannelsChange={setChannels}
        section={section}
        onSectionChange={setSection}
        assets={briefProps.assets ?? assets}
        generating={briefProps.generating ?? generating}
        onGenerate={generate}
        onOpenFile={openFile}
      />
    </div>
  );
  const openTab = (name: string) => {
    setOpened((previous) => (previous.includes(name) ? previous : [...previous, name]));
    setActiveFile(name);
  };
  const workspaceTabs: ArtifactWorkspaceTab[] = [
    { id: "__brief", label: "Summer launch", icon: <Icon name="tasks" size={14} />, content: brief },
    {
      id: "__start",
      label: "New tab",
      icon: <Icon name="plus" size={14} />,
      content: (
        <WorkspaceStart
          suggested={files
            .filter((file) => file.kind !== "image")
            .map((file) => ({ name: file.name, artifact: file.name, kind: file.kind }))}
          onOpenSource={(source) => openFile(source.artifact ?? source.name)}
          onOpenTool={(tool) => openTab(`__${tool}`)}
          onOpenUrl={onOpenUrl}
        />
      ),
    },
    ...(["terminal", "browser", "notes"] as WorkspaceToolKind[]).map((kind) => ({
      id: `__${kind}`,
      label: kind[0].toUpperCase() + kind.slice(1),
      icon: <Icon name={kind === "terminal" ? "terminal" : kind === "browser" ? "globe" : "compose"} size={14} />,
      content: (
        <WorkspaceTool
          kind={kind}
          value={toolValues[kind] ?? ""}
          onValueChange={(value) => setToolValues((previous) => ({ ...previous, [kind]: value }))}
          lines={terminalLines}
          onLinesChange={setTerminalLines}
          onOpenUrl={onOpenUrl}
        />
      ),
    })),
  ];
  const panel = (
    <ArtifactWorkspace
      files={files}
      onFilesChange={setFiles}
      openFiles={opened}
      onOpenFilesChange={setOpened}
      activeFile={activeFile}
      onActiveFileChange={setActiveFile}
      tabs={workspaceTabs}
      onNewTab={() => openTab("__start")}
      onClose={() => setPanelOpen(false)}
      closeLabel="Close brief"
      onOpenFile={onOpenFile}
    />
  );
  return (
    <AppShell
      {...shellProps}
      workspace={workspace}
      user={user}
      chats={chats}
      onChatsChange={(next) => {
        setChats(next);
        const current = next.find((chat) => chat.id === "campaign");
        if (current && current.title !== chats.find((chat) => chat.id === "campaign")?.title) setTitle(current.title);
      }}
      defaultProjects={defaultProjects}
      defaultActiveChat={defaultActiveChat}
      defaultActive={defaultActive}
      navigation={defaultWorkspaceNavigation}
      showChatHistory
      defaultPanelWidth={defaultPanelWidth}
      panelTitle="Brief"
      panel={panel}
      panelOpen={panelOpen}
      onPanelOpenChange={setPanelOpen}
      onNavigate={onNavigate}
      onChatAction={onChatAction}
      sidebarFooter={
        sidebarFooter === undefined ? (
          <WorkspaceSidebarFooter workspace={workspace} onNavigate={onNavigate} />
        ) : (
          sidebarFooter
        )
      }
      className={["ui-agcc", className].filter(Boolean).join(" ")}
    >
      <style href="ui-agent-chat-clean" precedence="default">
        {css}
      </style>
      <div
        className="ui-agcc__main"
        ref={root}
        onKeyDown={(event) => {
          if (event.key === "Escape" && busy && !isEditing(event.target)) {
            event.preventDefault();
            stop();
          }
        }}
      >
        <header className="ui-agcc__bar">
          <div className="ui-agcc__crumbs">
            <button type="button" className="ui-agcc__home" onClick={() => onNavigate?.("Home")}>
              <WorkspaceNavGlyph name="compose" />
              Home
            </button>
            <i>/</i>
            {renaming ? (
              <input
                ref={renameInput}
                aria-label="Chat name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={rename}
                onKeyDown={(event) => {
                  if (event.key === "Enter") rename();
                  if (event.key === "Escape") {
                    event.preventDefault();
                    event.stopPropagation();
                    setRenaming(false);
                    requestAnimationFrame(() => menuButton.current?.focus());
                  }
                }}
              />
            ) : (
              <b>{title}</b>
            )}
            <button
              ref={menuButton}
              type="button"
              className="ui-agcc__options"
              aria-label="Chat options"
              aria-haspopup="menu"
              aria-expanded={menu}
              aria-controls={menu ? `${id}-options` : undefined}
              onClick={() => setMenu(!menu)}
            >
              <Icon name="more" size={16} />
            </button>
          </div>
        </header>
        <div className="ui-agcc__thread" ref={scroll} role="log" aria-label="Campaign conversation" aria-live="polite">
          <div className="ui-agcc__column">
            {messages.map((message) =>
              message.role === "user" ? (
                <p className="ui-agcc__user" key={message.id}>
                  {message.text}
                </p>
              ) : (
                <div className="ui-agcc__answer" key={message.id}>
                  {message.worked &&
                    (message.steps?.length ? (
                      <details className="ui-agcc__trace">
                        <summary>
                          <span className="ui-agcc__mark" aria-hidden="true">
                            {Array.from({ length: 9 }, (_, index) => (
                              <i key={index} />
                            ))}
                          </span>
                          Worked for {message.worked}
                          <Icon name="chevron" size={12} />
                        </summary>
                        <ol>
                          {message.steps.map((step) => (
                            <li key={step}>
                              <Icon name="check" size={12} />
                              {step}
                            </li>
                          ))}
                        </ol>
                      </details>
                    ) : (
                      <div className="ui-agcc__worked">
                        <span className="ui-agcc__mark" aria-hidden="true">
                          {Array.from({ length: 9 }, (_, index) => (
                            <i key={index} />
                          ))}
                        </span>
                        Worked for {message.worked}
                      </div>
                    ))}
                  {message.text.split("\n\n").map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                  {message.agents && (
                    <>
                      <span className="ui-agcc__label">Agents working</span>
                      <div className="ui-agcc__agents">
                        {campaignAgents.map((agent, index) => (
                          <span className="ui-agcc__agent" data-active={index === 0 || undefined} key={agent}>
                            <CampaignAgentIcon index={index} />
                            <span>{agent}</span>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ),
            )}
            {busy && (
              <div className="ui-agcc__answer" role="status">
                <div className="ui-agcc__worked">
                  <span className="ui-agcc__mark" data-thinking="" aria-hidden="true">
                    {Array.from({ length: 9 }, (_, index) => (
                      <i key={index} />
                    ))}
                  </span>
                  Thinking
                </div>
                <span className="ui-agcc__label">Reading the brief</span>
              </div>
            )}
          </div>
        </div>
        <div className="ui-agcc__composer">
          <div className="ui-agcc__route">
            <CampaignAgentIcon index={4} size={12} />
            <b>Orchestrator</b>
            <span>Routes each request</span>
            {busy && (
              <button type="button" aria-label="Stop response" onClick={stop}>
                <Icon name="stop" size={12} />
                Stop
              </button>
            )}
          </div>
          <ChatComposer
            placeholder="Ask anything or @ to add context"
            {...composerProps}
            textareaProps={{ ref: input, ...composerProps?.textareaProps }}
            busy={busy}
            onSend={send}
          />
        </div>
        {menu && (
          <FloatingMenu
            anchor={menuButton}
            root={root}
            id={`${id}-options`}
            label="Chat options"
            className="ui-agcc__menu"
            align="end"
            onClose={() => setMenu(false)}
          >
            {[
              [pinned ? "unpin" : "pin", pinned ? "Unpin chat" : "Pin chat", "pin"],
              ["rename", "Rename", "compose"],
              ["share", "Share", "link"],
              ["delete", "Delete chat", "trash"],
            ].map(([value, label, icon]) => (
              <button
                type="button"
                role="menuitem"
                data-danger={value === "delete" || undefined}
                key={value}
                onClick={() => action(value)}
              >
                <Icon name={icon as IconName} size={14} />
                {label}
              </button>
            ))}
          </FloatingMenu>
        )}
        {notice && <output className="ui-agcc__notice">{notice}</output>}
      </div>
    </AppShell>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-cmc {
  --ui-cmc-card: #fff;
  --ui-cmc-ink: rgba(0, 0, 0, 0.88);
  --ui-cmc-text: rgba(0, 0, 0, 0.61);
  --ui-cmc-muted: rgba(0, 0, 0, 0.45);
  --ui-cmc-line: rgba(0, 0, 0, 0.06);
  --ui-cmc-fill: rgba(0, 0, 0, 0.04);
  --ui-cmc-focus: rgba(0, 96, 226, 0.35);
  --ui-cmc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 24px 80px -20px rgba(0, 0, 0, 0.24);
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
  color: var(--ui-cmc-ink);
  -webkit-font-smoothing: antialiased;
  container-type: inline-size;
}
.ui-cmc,
.ui-cmc *,
.ui-cmc *::before,
.ui-cmc *::after {
  box-sizing: border-box;
}
.ui-cmc button,
.ui-cmc input {
  font: inherit;
  color: inherit;
}
.ui-cmc button {
  border: 0;
  cursor: pointer;
  background: none;
}
.ui-cmc button:focus-visible {
  outline: 2px solid var(--ui-cmc-focus);
  outline-offset: -2px;
}
.ui-cmc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cmc__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2) !important;
  animation: ui-cmc-fade 180ms both;
}
.ui-cmc__panel {
  width: min(560px, 100%);
  max-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  background: var(--ui-cmc-card);
  box-shadow: var(--ui-cmc-shadow);
  overflow: hidden;
  animation: ui-cmc-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-cmc__search {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 16px;
  border-bottom: 0.5px solid var(--ui-cmc-line);
  color: var(--ui-cmc-muted);
}
.ui-cmc__search input {
  flex: 1;
  width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--ui-cmc-ink);
  font-size: 15px;
}
.ui-cmc__search input::placeholder {
  color: var(--ui-cmc-muted);
}
.ui-cmc kbd {
  font: 11px/1.5 inherit;
  font-family: inherit;
  color: var(--ui-cmc-muted);
  padding: 1px 4px;
  border: 0.5px solid var(--ui-cmc-line);
  border-radius: 4px;
  white-space: nowrap;
}
.ui-cmc__list {
  overflow: auto;
  overscroll-behavior: contain;
  max-height: min(540px, 65vh);
  padding: 6px;
}
.ui-cmc__group + .ui-cmc__group {
  margin-top: 8px;
}
.ui-cmc__label {
  padding: 9px 10px 5px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ui-cmc-muted);
}
.ui-cmc__item {
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
.ui-cmc__item[aria-selected="true"] {
  background: var(--ui-cmc-fill);
}
.ui-cmc__item:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-cmc__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 7px;
  color: var(--ui-cmc-muted);
  box-shadow: 0 0 0 0.5px var(--ui-cmc-line);
}
.ui-cmc__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-cmc__text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-cmc__text small {
  font-size: 11px;
  color: var(--ui-cmc-muted);
}
.ui-cmc__foot {
  display: flex;
  gap: 18px;
  padding: 11px 16px;
  border-top: 0.5px solid var(--ui-cmc-line);
  font-size: 11px;
  color: var(--ui-cmc-muted);
}
.ui-cmc__foot span:last-child {
  margin-left: auto;
}
.ui-cmc__empty {
  padding: 32px 16px;
  color: var(--ui-cmc-muted);
  text-align: center;
  overflow-wrap: anywhere;
}
.ui-cmc[data-inline] {
  position: relative;
  inset: auto;
  padding: 0;
  display: block;
}
.ui-cmc[data-inline] .ui-cmc__panel {
  width: 100%;
}
@keyframes ui-cmc-fade {
  from {
    opacity: 0;
  }
}
@keyframes ui-cmc-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}
@container (max-width:400px) {
  .ui-cmc__foot {
    gap: 10px;
  }
  .ui-cmc__foot span:last-child {
    display: none;
  }
  .ui-cmc__search {
    padding-inline: 12px;
  }
  .ui-cmc__panel {
    border-radius: 10px;
  }
}
@media (pointer: coarse) {
  .ui-cmc__item {
    min-height: 52px;
  }
  .ui-cmc__search {
    min-height: 60px;
  }
  .ui-cmc__search button {
    min-width: 36px;
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cmc,
  .ui-cmc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cmc {
  --ui-cmc-card: #1c1c1e;
  --ui-cmc-ink: rgba(255, 255, 255, 0.9);
  --ui-cmc-text: rgba(255, 255, 255, 0.62);
  --ui-cmc-muted: rgba(255, 255, 255, 0.46);
  --ui-cmc-line: rgba(255, 255, 255, 0.08);
  --ui-cmc-fill: rgba(255, 255, 255, 0.08);
  --ui-cmc-focus: rgba(77, 141, 255, 0.5);
  --ui-cmc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 24px 80px -20px rgba(0, 0, 0, 0.6);
}

.ui-asc__side-col[data-history] > .ui-asc__navigation {
  flex: none;
}
.ui-asc__side-col[data-history] > .ui-asc__chat-nav {
  padding-top: 0;
  padding-bottom: 16px;
}
@container ui-asc (min-width:900px) {
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__chat-nav {
    visibility: hidden;
  }
}
.ui-asc__app[data-header] {
  grid-template-rows: auto minmax(0, 1fr);
}
.ui-asc__header {
  grid-column: 3/-1;
  grid-row: 1;
  min-width: 0;
}
.ui-asc__app[data-header] > .ui-asc__side,
.ui-asc__app[data-header] > .ui-asc__side + .ui-asc__resizer {
  grid-row: 1/-1;
}
.ui-asc__app[data-header] > .ui-asc__main,
.ui-asc__app[data-header] > .ui-asc__panel,
.ui-asc__app[data-header] > .ui-asc__panel-resizer {
  grid-row: 2;
}
@container ui-asc (max-width:899.99px) {
  .ui-asc__header {
    grid-column: 1/-1;
  }
}
.ui-asc:has(.ui-asc__side-col[data-navigation]) .ui-asc__main {
  border-radius: 12px;
  border-left: 0.5px solid var(--ui-asc-line);
}
.ui-asc__side-col[data-navigation] {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  margin: 0;
  padding: 10px 8px 8px 10px;
  line-height: 1.4286;
  overflow: hidden;
}
.ui-asc__navigation {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}
.ui-asc__nav-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  height: 28px;
  min-height: 28px;
  margin-bottom: 12px;
}
.ui-asc__nav-workspace {
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
.ui-asc__nav-workspace:hover,
.ui-asc__account-row:hover {
  background: rgba(0, 0, 0, 0.03);
}
.ui-asc__nav-workspace > span {
  display: grid;
  place-items: center;
  flex: none;
  width: 18px;
  height: 18px;
  margin-right: 1px;
  background: var(--ui-asc-card);
  border-radius: 5px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 1px 1px rgba(0, 0, 0, 0.12);
  font-size: 10.5px;
  font-weight: 500;
  transition: opacity 140ms ease;
}
.ui-asc__nav-workspace > strong {
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-asc__nav-workspace > svg {
  color: var(--ui-asc-muted);
}
.ui-asc__nav-search {
  display: flex;
  align-items: center;
  flex: none;
  gap: 8px;
  width: 100%;
  height: 30px;
  border-radius: 8px !important;
  padding: 0 6px 0 8px !important;
  background: var(--ui-asc-card) !important;
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  color: var(--ui-asc-muted) !important;
  margin-bottom: 12px;
  text-align: left;
  font-size: 13px !important;
}
.ui-asc__nav-search > span {
  flex: 1;
}
.ui-asc__nav-search kbd {
  font: 10px/1.4 inherit;
  font-family: inherit;
  border: 0.5px solid var(--ui-asc-line);
  padding: 1px 3px;
  border-radius: 3px;
  color: var(--ui-asc-faint);
}
.ui-asc__nav-items {
  overflow: auto;
  min-height: 0;
}
.ui-asc__nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  border-radius: 7px;
  text-align: left;
  padding: 0 8px !important;
  color: var(--ui-asc-text) !important;
}
.ui-asc__nav-item:hover,
.ui-asc__nav-item[aria-current="page"] {
  background: var(--ui-asc-fill) !important;
  color: var(--ui-asc-ink) !important;
}
.ui-asc__nav-icon {
  display: flex;
  color: var(--ui-asc-muted);
}
.ui-asc__nav-item > small {
  font-size: 11px;
  color: var(--ui-asc-faint);
  font-variant-numeric: tabular-nums;
  margin-left: auto;
}
.ui-asc__nav-section {
  font-size: 12px;
  color: var(--ui-asc-faint);
  padding: 18px 8px 4px;
}
.ui-asc__side-col[data-navigation] .ui-asc__account-row {
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
.ui-asc__side-col[data-navigation] .ui-asc__user-initials {
  width: 21px;
  height: 21px;
  font-size: 9px;
  color: var(--ui-asc-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-asc__side-col[data-navigation] .ui-asc__account-row > svg {
  color: var(--ui-asc-faint);
}
.ui-asc .ui-asc__nav-workspace:active:not(:disabled),
.ui-asc .ui-asc__account-row:active:not(:disabled),
.ui-asc .ui-asc__wsm-item:active:not(:disabled) {
  transform: none;
}
.ui-asc[data-sidebar-collapsed] .ui-asc__app {
  grid-template-columns: 0 0 minmax(0, 1fr) 0 0;
  padding-left: 8px;
}
.ui-asc[data-sidebar-collapsed][data-panel-open] .ui-asc__app {
  grid-template-columns: 0 0 minmax(0, 1fr) 4px var(--ui-asc-panel-width);
}
.ui-asc[data-sidebar-collapsed] .ui-asc__side {
  visibility: hidden;
  pointer-events: none;
}
.ui-asc[data-sidebar-collapsed] .ui-asc__main {
  border-radius: 12px;
}
.ui-asc[data-sidebar-collapsed] .ui-asc__open-side {
  display: grid;
}
.ui-asc[data-sidebar-collapsed] .ui-asc__side + .ui-asc__resizer {
  visibility: hidden;
}
@container ui-asc (min-width:900px) {
  .ui-asc[data-navigation] .ui-asc__app {
    transition-duration: 420ms;
  }
  .ui-asc[data-navigation] .ui-asc__side {
    overflow: hidden;
  }
  .ui-asc[data-navigation] .ui-asc__side-col {
    flex: none;
    width: var(--ui-asc-sidebar-width);
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__app {
    grid-template-columns: 48px 0 minmax(0, 1fr) 0 0;
    padding-left: 0;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed][data-panel-open] .ui-asc__app {
    grid-template-columns: 48px 0 minmax(0, 1fr) 4px var(--ui-asc-panel-width);
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__side {
    visibility: visible;
    pointer-events: auto;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__open-side {
    display: none;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed]
    :is(
      .ui-asc__nav-workspace > strong,
      .ui-asc__nav-workspace > svg,
      .ui-asc__nav-search > span,
      .ui-asc__nav-search > kbd,
      .ui-asc__nav-item > span:not(.ui-asc__nav-icon),
      .ui-asc__nav-item > small,
      .ui-asc__account-row > span:nth-child(2),
      .ui-asc__account-row > svg
    ) {
    display: none;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed]
    :is(.ui-asc__nav-workspace, .ui-asc__nav-search, .ui-asc__nav-item, .ui-asc__account-row) {
    width: fit-content;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__nav-search {
    padding-right: 8px !important;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__nav-section {
    color: transparent;
    white-space: nowrap;
    overflow: hidden;
    background: linear-gradient(var(--ui-asc-line), var(--ui-asc-line)) 0 50% / 28px 0.5px no-repeat;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed] .ui-asc__nav-head > .ui-asc__icon-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    opacity: 0;
    transition: opacity 140ms ease;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed]:has(.ui-asc__side:hover, .ui-asc__nav-head :focus-visible)
    .ui-asc__nav-head
    > .ui-asc__icon-btn {
    opacity: 1;
  }
  .ui-asc[data-navigation][data-sidebar-collapsed]:has(.ui-asc__side:hover, .ui-asc__nav-head :focus-visible)
    .ui-asc__nav-workspace
    > span {
    opacity: 0;
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-asc[data-sidebar-collapsed] .ui-asc__app,
  .ui-asc[data-sidebar-collapsed][data-panel-open] .ui-asc__app {
    grid-template-columns: minmax(0, 1fr);
  }
  .ui-asc[data-sidebar-open] .ui-asc__side {
    visibility: visible;
    pointer-events: auto;
  }
  .ui-asc .ui-asc__side-col[data-navigation] {
    padding: 8px;
  }
}
@media (pointer: coarse) {
  .ui-asc__nav-item,
  .ui-asc__nav-search {
    min-height: 36px;
  }
}
.ui-asc {
  --ui-asc-page: #f8f8f8;
  --ui-asc-card: #fff;
  --ui-asc-side: #fcfcfc;
  --ui-asc-ink: rgba(0, 0, 0, 0.88);
  --ui-asc-text: rgba(0, 0, 0, 0.61);
  --ui-asc-muted: rgba(0, 0, 0, 0.45);
  --ui-asc-faint: rgba(0, 0, 0, 0.27);
  --ui-asc-line: rgba(0, 0, 0, 0.06);
  --ui-asc-fill: rgba(0, 0, 0, 0.04);
  --ui-asc-accent: #0060e2;
  --ui-asc-focus: rgba(0, 96, 226, 0.35);
  --ui-asc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-asc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  container: ui-asc / inline-size;
  overflow: hidden;
  background: var(--ui-asc-page);
  color: var(--ui-asc-ink);
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
.ui-asc,
.ui-asc *,
.ui-asc *::before,
.ui-asc *::after {
  box-sizing: border-box;
}
.ui-asc button,
.ui-asc input {
  font: inherit;
  color: inherit;
}
.ui-asc button {
  cursor: pointer;
  border: 0;
  background: none;
}
.ui-asc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-asc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-asc button:focus-visible,
.ui-asc input:focus-visible,
.ui-asc [role="separator"]:focus-visible {
  outline: 2px solid var(--ui-asc-focus);
  outline-offset: -2px;
}
.ui-asc__app {
  display: grid;
  grid-template-columns: calc(var(--ui-asc-sidebar-width) + var(--ui-asc-rail-width)) 0 minmax(0, 1fr) 0 0;
  height: 100%;
  padding: 8px 8px 8px 0;
  transition: grid-template-columns 400ms var(--ui-asc-ease);
}
.ui-asc[data-panel-open] .ui-asc__app {
  grid-template-columns: calc(var(--ui-asc-sidebar-width) + var(--ui-asc-rail-width)) 0 minmax(0, 1fr) 4px var(
      --ui-asc-panel-width
    );
}
.ui-asc[data-dragging] .ui-asc__app {
  transition: none;
}
.ui-asc__side {
  display: flex;
  min-width: 0;
  min-height: 0;
  margin-block: -8px;
  position: relative;
}
.ui-asc__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 52px;
  flex: none;
  padding: 12px 0 16px;
}
.ui-asc__logo {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
  background: var(--ui-asc-card) !important;
  border-radius: 10px;
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 12px !important;
  font-weight: 500 !important;
}
.ui-asc__rail-line {
  height: 0.5px;
  width: 20px;
  background: var(--ui-asc-line);
  margin: 0 0 6px;
}
.ui-asc__rail-item {
  display: grid;
  place-items: center;
  position: relative;
  flex: none;
  width: 34px;
  height: 34px;
  margin-bottom: 0;
  border-radius: 10px;
  color: var(--ui-asc-muted) !important;
}
.ui-asc__rail-item:hover,
.ui-asc__rail-item[aria-current="page"] {
  background: var(--ui-asc-fill);
  color: var(--ui-asc-ink) !important;
}
.ui-asc__rail-space {
  flex: 1;
}
.ui-asc__notification-dot {
  position: absolute;
  right: 6px;
  top: 7px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ui-asc-accent);
  box-shadow: 0 0 0 2px var(--ui-asc-page);
}
.ui-asc__user {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin-top: 6px;
  border-radius: 50%;
  font-size: 9px !important;
  font-weight: 500 !important;
  color: var(--ui-asc-accent) !important;
  background: rgba(0, 96, 226, 0.08) !important;
  overflow: hidden;
}
.ui-asc__user img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ui-asc__side-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-block: 8px;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  background: var(--ui-asc-side);
  padding: 8px 10px;
  overflow: hidden;
}
.ui-asc__side-head {
  display: flex;
  align-items: center;
  min-height: 32px;
  gap: 4px;
  padding-left: 6px;
}
.ui-asc__project {
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
.ui-asc__project > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-asc__project > svg {
  color: var(--ui-asc-muted);
}
.ui-asc__icon-btn {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: none;
  color: var(--ui-asc-muted) !important;
  border-radius: 6px;
}
.ui-asc__icon-btn:hover {
  background: var(--ui-asc-fill);
}
.ui-asc__chat-nav {
  overflow: auto;
  min-height: 0;
  flex: 1;
  margin-inline: -1px;
  padding-top: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-asc-line) transparent;
}
.ui-asc__new-chat {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  padding: 0 7px;
  text-align: left;
  color: var(--ui-asc-text) !important;
  border-radius: 7px;
}
.ui-asc__new-chat:hover {
  background: var(--ui-asc-fill);
}
.ui-asc__new-chat svg {
  color: var(--ui-asc-muted);
}
.ui-asc__group {
  margin-top: 12px;
}
.ui-asc__group h2 {
  font-size: 12px;
  font-weight: 400;
  color: var(--ui-asc-faint);
  padding: 0 7px;
  margin: 0 0 4px;
  line-height: 20px;
}
.ui-asc__chat-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 30px;
  border-radius: 7px;
  color: var(--ui-asc-text);
}
.ui-asc__chat-row[data-active],
.ui-asc__chat-row:hover {
  background: var(--ui-asc-fill);
}
.ui-asc__chat-row[data-active] {
  color: var(--ui-asc-ink);
}
.ui-asc__chat-link {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
  height: 30px;
  padding: 0 7px;
  text-align: left;
}
.ui-asc__chat-link > span {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-asc__chat-row[data-nested] .ui-asc__chat-link {
  padding-left: 29px;
}
.ui-asc__chat-tools {
  display: flex;
  align-items: center;
  gap: 1px;
  position: absolute;
  right: 3px;
  opacity: 0;
  visibility: hidden;
  background: var(--ui-asc-side);
  border-radius: 5px;
  transition: opacity 120ms;
}
.ui-asc__chat-tools button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: var(--ui-asc-muted);
}
.ui-asc__chat-tools button:hover {
  background: var(--ui-asc-fill);
  color: var(--ui-asc-ink);
}
.ui-asc__chat-row:hover .ui-asc__chat-tools,
.ui-asc__chat-row:focus-within .ui-asc__chat-tools {
  opacity: 1;
  visibility: visible;
}
.ui-asc__chat-row:hover .ui-asc__chat-link,
.ui-asc__chat-row:focus-within .ui-asc__chat-link {
  padding-right: 54px;
}
.ui-asc__unread {
  display: block;
  flex: none;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ui-asc-accent);
}
.ui-asc__folder {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
  min-height: 30px;
  padding: 0 7px;
  text-align: left;
  color: var(--ui-asc-text) !important;
  border-radius: 7px;
}
.ui-asc__folder:hover {
  background: var(--ui-asc-fill);
}
.ui-asc__folder > span:first-of-type {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-asc__folder > svg {
  color: var(--ui-asc-muted);
}
.ui-asc__folder-chevron {
  display: flex;
  opacity: 0;
  transition: transform 300ms var(--ui-asc-ease);
}
.ui-asc__folder:hover .ui-asc__folder-chevron,
.ui-asc__folder:focus-visible .ui-asc__folder-chevron {
  opacity: 1;
}
.ui-asc__folder[aria-expanded="true"] .ui-asc__folder-chevron {
  transform: rotate(180deg);
}
.ui-asc__folder-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-asc-ease);
}
.ui-asc__folder-wrap[data-open="true"] {
  grid-template-rows: 1fr;
}
.ui-asc__folder-wrap > div {
  overflow: hidden;
  min-height: 0;
}
.ui-asc__main {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-radius: 0 12px 12px 0;
  background: var(--ui-asc-card);
  border-block: 0.5px solid var(--ui-asc-line);
  border-right: 0.5px solid var(--ui-asc-line);
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  z-index: 1;
}
.ui-asc__resizer {
  position: relative;
  width: 6px;
  z-index: 25;
  margin-left: -3px;
  cursor: col-resize;
  touch-action: none;
  outline: none;
}
.ui-asc__resizer::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 45%;
  height: 32px;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-asc-faint);
  opacity: 0;
  transition: opacity 160ms;
}
.ui-asc__resizer:hover::after,
.ui-asc__resizer:focus-visible::after {
  opacity: 1;
}
.ui-asc__panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-radius: 12px;
  border: 0.5px solid var(--ui-asc-line);
  background: var(--ui-asc-card);
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transition:
    opacity 200ms,
    visibility 200ms;
}
.ui-asc[data-panel-open] .ui-asc__panel {
  visibility: visible;
  opacity: 1;
}
.ui-asc__drawer-trigger {
  display: none;
  place-items: center;
  position: absolute;
  z-index: 5;
  top: 16px;
  width: 28px;
  height: 28px;
  color: var(--ui-asc-muted) !important;
  border-radius: 6px;
}
.ui-asc__open-side {
  left: 16px;
}
.ui-asc__open-panel {
  right: 16px;
}
.ui-asc:not([data-panel-open]) .ui-asc__open-panel {
  display: grid;
}
.ui-asc__mobile-close {
  display: none;
}
.ui-asc__scrim {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.28) !important;
  animation: ui-asc-fade 220ms both;
}
.ui-asc__menu {
  width: 240px;
  max-width: calc(100% - 16px);
  overflow: auto;
  overscroll-behavior: contain;
  background: var(--ui-asc-card);
  padding: 5px;
  border-radius: 12px;
  box-shadow: var(--ui-asc-shadow);
  animation: ui-asc-pop 230ms var(--ui-asc-ease);
}
.ui-asc__menu > button {
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
.ui-asc__menu > button:hover {
  background: var(--ui-asc-fill);
}
.ui-asc__menu > button[data-divider] {
  margin-top: 5px;
  position: relative;
}
.ui-asc__menu > button[data-divider]::before {
  content: "";
  position: absolute;
  top: -3px;
  left: 4px;
  right: 4px;
  border-top: 0.5px solid var(--ui-asc-line);
}
.ui-asc__menu > button > span {
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--ui-asc-muted);
}
.ui-asc__menu kbd {
  font-size: 10px;
  font-family: inherit;
  color: var(--ui-asc-faint);
}
.ui-asc__menu-label {
  font-size: 11px;
  color: var(--ui-asc-muted);
  padding: 7px 9px 4px;
}
.ui-asc__menu-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 9px 12px;
  border-bottom: 0.5px solid var(--ui-asc-line);
  margin-bottom: 4px;
}
.ui-asc__menu-user > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-asc__menu-user strong {
  font-weight: 500;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-asc__menu-user small {
  font-size: 11px;
  color: var(--ui-asc-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-asc__user-initials {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: none;
  background: var(--ui-asc-fill);
  color: var(--ui-asc-text);
  font-size: 11px;
}
.ui-asc__project-form {
  display: flex;
  gap: 4px;
  padding: 6px;
}
.ui-asc__project-form input,
.ui-asc__rename {
  background: var(--ui-asc-card);
  border: 1px solid var(--ui-asc-focus);
  border-radius: 5px;
  padding: 4px 6px;
  min-width: 0;
  width: 100%;
  font-size: 12px !important;
}
.ui-asc__rename {
  margin-inline: 5px;
  z-index: 1;
}
.ui-asc__account-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 5px;
  min-width: 0;
  font-size: 12px !important;
}
.ui-asc__account-row > span:nth-child(2) {
  flex: 1;
  text-align: left;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-asc__empty {
  font-size: 12px;
  color: var(--ui-asc-muted);
  padding: 10px 7px;
}
.ui-asc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-asc[data-layout="flat"] .ui-asc__app {
  padding: 0;
  grid-template-columns: calc(var(--ui-asc-sidebar-width) + var(--ui-asc-rail-width)) 0 minmax(0, 1fr) 0 0;
}
.ui-asc[data-layout="flat"][data-panel-open] .ui-asc__app {
  grid-template-columns: calc(var(--ui-asc-sidebar-width) + var(--ui-asc-rail-width)) 0 minmax(0, 1fr) 1px var(
      --ui-asc-panel-width
    );
}
.ui-asc[data-layout="flat"] .ui-asc__side {
  margin: 0;
}
.ui-asc[data-layout="flat"] .ui-asc__side-col {
  margin: 0;
  border-radius: 0;
}
.ui-asc[data-layout="flat"] .ui-asc__main,
.ui-asc[data-layout="flat"] .ui-asc__panel {
  border-radius: 0;
}
@keyframes ui-asc-pop {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}
@keyframes ui-asc-fade {
  from {
    opacity: 0;
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-asc .ui-asc__app,
  .ui-asc[data-panel-open] .ui-asc__app,
  .ui-asc[data-layout="flat"] .ui-asc__app {
    grid-template-columns: minmax(0, 1fr);
    padding: 8px;
  }
  .ui-asc .ui-asc__side {
    position: absolute;
    inset: 0 auto 0 0;
    width: min(320px, calc(100% - 40px));
    margin: 0;
    background: var(--ui-asc-page);
    border-radius: 0 18px 18px 0;
    z-index: 40;
    transform: translateX(calc(-100% - 24px));
    transition: transform 380ms var(--ui-asc-ease);
    visibility: hidden;
  }
  .ui-asc[data-sidebar-open] .ui-asc__side {
    transform: none;
    visibility: visible;
  }
  .ui-asc .ui-asc__side-col {
    margin: 0;
    padding: 8px 10px 10px 4px;
    background: none;
    border-radius: 0;
    box-shadow: none;
  }
  .ui-asc .ui-asc__main {
    border-radius: 12px;
  }
  .ui-asc .ui-asc__drawer-trigger {
    display: grid;
  }
  .ui-asc .ui-asc__resizer {
    display: none;
  }
  .ui-asc .ui-asc__mobile-close {
    display: grid;
  }
  .ui-asc .ui-asc__panel {
    position: absolute;
    inset: 0 0 0 auto;
    width: min(360px, calc(100% - 32px));
    z-index: 40;
    border-radius: 18px 0 0 18px;
    transform: translateX(calc(100% + 24px));
    transition:
      transform 380ms var(--ui-asc-ease),
      visibility 380ms,
      opacity 200ms;
  }
  .ui-asc[data-panel-open] .ui-asc__panel {
    transform: none;
  }
  .ui-asc .ui-asc__chat-tools {
    visibility: visible;
    opacity: 0;
  }
  .ui-asc .ui-asc__chat-row:focus-within .ui-asc__chat-tools,
  .ui-asc .ui-asc__chat-row:hover .ui-asc__chat-tools {
    opacity: 1;
  }
}
@media (pointer: coarse) {
  .ui-asc__rail-item {
    width: 36px;
    height: 36px;
  }
  .ui-asc__chat-link,
  .ui-asc__folder,
  .ui-asc__new-chat {
    min-height: 36px;
    height: 36px;
  }
  .ui-asc__menu > button {
    min-height: 40px;
  }
  .ui-asc__icon-btn {
    width: 34px;
    height: 34px;
  }
  .ui-asc__chat-tools {
    opacity: 1;
    visibility: visible;
  }
  .ui-asc__chat-tools button {
    height: 30px;
    width: 26px;
  }
  .ui-asc__chat-link {
    padding-right: 58px;
  }
  .ui-asc__chat-row[data-nested] .ui-asc__chat-link {
    padding-right: 58px;
  }
  .ui-asc__user {
    width: 30px;
    height: 30px;
  }
  .ui-asc__rename {
    font-size: 16px !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-asc,
  .ui-asc *,
  .ui-asc *::after {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-asc,
.ui-asc[data-theme="dark"] {
  --ui-asc-page: #111113;
  --ui-asc-card: #1c1c1e;
  --ui-asc-side: #18181a;
  --ui-asc-ink: rgba(255, 255, 255, 0.9);
  --ui-asc-text: rgba(255, 255, 255, 0.62);
  --ui-asc-muted: rgba(255, 255, 255, 0.46);
  --ui-asc-faint: rgba(255, 255, 255, 0.3);
  --ui-asc-line: rgba(255, 255, 255, 0.08);
  --ui-asc-fill: rgba(255, 255, 255, 0.06);
  --ui-asc-accent: #4d8dff;
  --ui-asc-focus: rgba(77, 141, 255, 0.5);
  --ui-asc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}
.ui-asc__menu.ui-asc__ws-menu {
  --ui-asc-wsm-hover: rgba(0, 0, 0, 0.03);
  --ui-asc-wsm-ring: rgba(0, 0, 0, 0.1);
  display: grid;
  align-content: start;
  gap: 1px;
  width: 240px;
  padding: 4px;
  overflow: visible;
  box-shadow:
    0 0 0 0.5px var(--ui-asc-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  transform-origin: top left;
  animation: ui-asc-wsm-pop 220ms var(--ui-asc-ease);
}
.ui-asc__menu .ui-asc__wsm-item {
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
  color: var(--ui-asc-text);
  text-align: left;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}
.ui-asc__menu .ui-asc__wsm-item[data-rich] {
  min-height: 44px;
  padding: 6px 10px;
}
.ui-asc__wsm-item > svg {
  flex: none;
  color: var(--ui-asc-muted);
}
.ui-asc__wsm-item > svg:last-child:not(:first-child) {
  margin-left: auto;
  color: var(--ui-asc-ink);
}
.ui-asc__wsm-sub .ui-asc__wsm-item > svg:last-child:not(:first-child) {
  color: var(--ui-asc-faint);
}
.ui-asc__menu .ui-asc__wsm-label {
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: inherit;
  text-overflow: ellipsis;
}
.ui-asc__menu .ui-asc__wsm-item[data-rich] .ui-asc__wsm-label {
  display: grid;
  gap: 1px;
}
.ui-asc__wsm-label > * {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-asc__wsm-label small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-asc-faint);
}
.ui-asc__menu .ui-asc__wsm-item:hover,
.ui-asc__menu .ui-asc__wsm-item:focus-visible,
.ui-asc__menu .ui-asc__wsm-sub:is(:hover, :focus-within, [data-open]) > .ui-asc__wsm-item {
  background: var(--ui-asc-wsm-hover);
  color: var(--ui-asc-ink);
}
.ui-asc__wsm-item[aria-checked="true"] {
  color: var(--ui-asc-ink);
  font-weight: 500;
}
.ui-asc__wsm-item[aria-checked="true"] small {
  font-weight: 400;
}
.ui-asc__wsm-sep {
  display: block;
  height: 1px;
  margin: 4px 6px;
  background: var(--ui-asc-line);
}
.ui-asc__wsm-sub {
  position: relative;
  display: block;
}
.ui-asc__wsm-panel {
  position: absolute;
  z-index: 1;
  top: -4px;
  left: calc(100% + 4px);
  display: grid;
  gap: 1px;
  width: 240px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 120ms ease,
    visibility 0s 120ms;
}
.ui-asc__wsm-panel::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -8px;
  width: 8px;
}
.ui-asc__wsm-sub:is(:hover, [data-open]) > .ui-asc__wsm-panel {
  opacity: 1;
  visibility: visible;
  transition: opacity 120ms ease;
}
@keyframes ui-asc-wsm-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
.ui-asc__menu.ui-asc__account-menu {
  width: calc(var(--ui-asc-sidebar-width) - 18px);
  transform-origin: bottom left;
  animation-name: ui-asc-account-pop;
}
.ui-asc[data-sidebar-collapsed] .ui-asc__account-menu {
  width: calc(var(--ui-asc-sidebar-width) - 20px);
}
.ui-asc[data-rail] .ui-asc__account-menu {
  width: 244px;
}
.ui-asc__account-menu .ui-asc__menu-user {
  padding: 8px 10px 10px;
  margin-bottom: 3px;
  border-bottom: 1px solid var(--ui-asc-line);
}
.ui-asc__account-menu .ui-asc__menu-user strong {
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
}
.ui-asc__account-menu .ui-asc__menu-user small {
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}
.ui-asc__account-menu .ui-asc__user-initials {
  color: var(--ui-asc-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-asc__account-menu .ui-asc__wsm-panel {
  width: 100%;
}
.ui-asc__user-initials {
  overflow: hidden;
}
.ui-asc__user-initials > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ui-asc__wsm-flag {
  width: 16px;
  height: 11px;
  border-radius: 2px;
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
}
@keyframes ui-asc-account-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-asc:not([data-rail]) .ui-asc__account-menu {
    width: calc(min(320px, 100% - 40px) - 16px);
  }
}
@container ui-asc (max-width:600px) {
  .ui-asc__wsm-panel,
  .ui-asc__account-menu .ui-asc__wsm-panel {
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
  .ui-asc__wsm-panel::before {
    display: none;
  }
  .ui-asc__wsm-sub[data-open] > .ui-asc__wsm-panel {
    display: grid;
  }
}
@media (pointer: coarse) {
  .ui-asc__menu .ui-asc__wsm-item {
    min-height: 40px;
  }
}
:where(.dark, [data-theme="dark"]) .ui-asc__menu.ui-asc__ws-menu {
  --ui-asc-wsm-hover: rgba(255, 255, 255, 0.05);
  --ui-asc-wsm-ring: rgba(255, 255, 255, 0.14);
}
:where(.dark, [data-theme="dark"]) :is(.ui-asc__nav-workspace, .ui-asc__account-row):hover {
  background: rgba(255, 255, 255, 0.05);
}
.ui-asc__cmd {
  --ui-asc-cmd-strong: #000;
  --ui-asc-cmd-icon: rgba(0, 0, 0, 0.447);
  --ui-asc-cmd-ring: rgba(0, 0, 0, 0.1);
  --ui-asc-cmd-active: rgba(0, 0, 0, 0.06);
  --ui-asc-cmd-tile: #fff;
  --ui-asc-cmd-mark: rgba(0, 96, 226, 0.12);
  --ui-asc-cmd-caret: rgba(0, 96, 226, 0.765);
  --ui-asc-cmd-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: absolute;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: min(12vh, 96px) 16px 16px;
  background: rgba(0, 0, 0, 0.12);
  animation: ui-asc-fade 200ms ease both;
}
.ui-asc__cmd-card {
  container-type: inline-size;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow: var(--ui-asc-cmd-shadow);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-asc-ink);
  animation: ui-asc-cmd-in 260ms var(--ui-asc-ease) both;
}
@keyframes ui-asc-cmd-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
}
.ui-asc__cmd-search {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 12px 0 14px;
  border-bottom: 0.5px solid var(--ui-asc-line);
  cursor: text;
}
.ui-asc__cmd-search > svg {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: var(--ui-asc-cmd-icon);
  stroke-width: 1.1;
  stroke-linecap: round;
}
.ui-asc .ui-asc__cmd-search input {
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-asc-ink);
  caret-color: var(--ui-asc-cmd-caret);
  outline: none;
}
.ui-asc__cmd-search input::placeholder {
  color: var(--ui-asc-faint);
}
.ui-asc__cmd kbd {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 5px;
  box-shadow: inset 0 0 0 0.5px var(--ui-asc-cmd-ring);
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-asc-muted);
  transition: color 140ms ease;
}
.ui-asc__cmd .ui-asc__cmd-enter {
  padding: 0 4px;
  color: var(--ui-asc-cmd-icon);
}
.ui-asc__cmd-enter svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.1;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ui-asc__cmd-list {
  position: relative;
  max-height: 360px;
  padding: 0 4px 4px;
  overflow-y: auto;
  scrollbar-width: thin;
  transition: height 320ms var(--ui-asc-ease);
}
.ui-asc__cmd-group {
  display: flex;
  flex-direction: column;
}
.ui-asc__cmd-group:first-child:not(:has(.ui-asc__cmd-label)) {
  padding-top: 4px;
}
.ui-asc__cmd-label {
  padding: 10px 8px 4px;
  overflow-wrap: anywhere;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--ui-asc-muted);
}
.ui-asc__cmd-pill {
  position: absolute;
  top: 0;
  left: 4px;
  right: 4px;
  border-radius: 6px;
  background: var(--ui-asc-cmd-active);
  opacity: 0;
  transition:
    transform 90ms ease-out,
    height 90ms ease-out,
    opacity 140ms ease;
}
.ui-asc__cmd-pill[data-lit] {
  opacity: 1;
}
.ui-asc .ui-asc__cmd-item {
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
.ui-asc .ui-asc__cmd-item:active:not(:disabled) {
  transform: none;
}
.ui-asc .ui-asc__cmd-item:focus-visible {
  outline: none;
}
.ui-asc__cmd-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 5px;
  background: var(--ui-asc-cmd-tile);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-cmd-ring),
    0 1px 1px -1px rgba(0, 0, 0, 0.1);
  color: var(--ui-asc-cmd-strong);
}
.ui-asc__cmd-logo svg {
  width: 12px;
  height: 12px;
}
.ui-asc__cmd-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: var(--ui-asc-cmd-icon);
  transition: color 140ms ease;
}
.ui-asc__cmd-icon svg {
  width: 16px;
  height: 16px;
}
.ui-asc__cmd-item[aria-selected="true"] .ui-asc__cmd-icon {
  color: var(--ui-asc-ink);
}
.ui-asc__cmd-text {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.ui-asc__cmd-name,
.ui-asc__cmd-hint {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-asc__cmd-name {
  color: var(--ui-asc-ink);
}
.ui-asc__cmd-hint {
  color: var(--ui-asc-muted);
}
.ui-asc__cmd mark {
  border-radius: 3px;
  background: var(--ui-asc-cmd-mark);
  color: inherit;
}
.ui-asc__cmd-keys {
  display: inline-flex;
  flex: none;
  gap: 2px;
}
.ui-asc__cmd-item[aria-selected="true"] kbd {
  color: var(--ui-asc-text);
}
.ui-asc__cmd-empty {
  margin: 0;
  padding: 12px 8px;
  color: var(--ui-asc-muted);
}
.ui-asc__cmd-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-top: 0.5px solid var(--ui-asc-line);
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-asc-muted);
}
.ui-asc__cmd-foot > span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
}
@container (max-width:480px) {
  .ui-asc__cmd-item .ui-asc__cmd-keys,
  .ui-asc__cmd-foot,
  .ui-asc__cmd .ui-asc__cmd-enter,
  .ui-asc__cmd-hint {
    display: none;
  }
  .ui-asc .ui-asc__cmd-item {
    height: 40px;
  }
}
@media (hover: none) and (pointer: coarse) {
  .ui-asc .ui-asc__cmd-item {
    height: 44px;
  }
  .ui-asc__cmd-search {
    height: 52px;
  }
}
:where(.dark, [data-theme="dark"]) .ui-asc__cmd {
  background: rgba(0, 0, 0, 0.45);
  --ui-asc-cmd-strong: #fff;
  --ui-asc-cmd-icon: rgba(255, 255, 255, 0.5);
  --ui-asc-cmd-ring: rgba(255, 255, 255, 0.12);
  --ui-asc-cmd-active: rgba(255, 255, 255, 0.08);
  --ui-asc-cmd-tile: #2a2a2d;
  --ui-asc-cmd-mark: rgba(77, 141, 255, 0.24);
  --ui-asc-cmd-caret: #4d8dff;
  --ui-asc-cmd-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}

.ui-wsfc {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 8px;
}
.ui-asc__side-col:has(> .ui-wsfc) .ui-asc__account-row {
  margin-top: 0;
}
.ui-wsfc__news {
  position: relative;
  padding-top: 30px;
}
.ui-wsfc__news-back {
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
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
  color: var(--ui-asc-accent);
}
.ui-wsfc__news-back > svg {
  color: var(--ui-asc-faint);
}
.ui-wsfc__news-card {
  position: relative;
  z-index: 1;
  padding: 10px 10px 0;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-wsfc__news-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ui-asc-accent);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
}
.ui-wsfc__news-top button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin: -2px -2px 0 0;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-asc-faint);
}
.ui-wsfc__news-card > b {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsfc .ui-wsfc__changelog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 20px);
  height: 34px;
  margin: 10px -10px 0;
  padding: 0 10px;
  border-top: 1px solid var(--ui-asc-fill);
  border-radius: 0 0 12px 12px;
  font-size: 12.5px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__changelog > svg,
.ui-wsfc__steps > span > svg {
  rotate: -90deg;
}
.ui-wsfc__changelog:hover,
.ui-wsfc__news-top button:hover {
  background: var(--ui-asc-fill);
  color: var(--ui-asc-ink);
}
.ui-wsfc__guide-slot {
  position: relative;
  height: 70px;
}
.ui-wsfc__guide {
  position: absolute;
  z-index: 6;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    height 480ms var(--ui-asc-ease),
    box-shadow 200ms;
}
.ui-wsfc__guide[data-open] {
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 8px 24px -10px rgba(0, 0, 0, 0.14);
}
.ui-wsfc .ui-wsfc__steps {
  display: grid;
  gap: 3px;
  width: 100%;
  height: 70px;
  padding: 10px 10px 9px;
  text-align: left;
}
.ui-wsfc__steps > span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsfc__steps svg {
  color: var(--ui-asc-faint);
}
.ui-wsfc__steps > small {
  font-size: 12.5px;
  line-height: 17px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__steps em {
  color: var(--ui-asc-accent);
  font-style: normal;
}
.ui-wsfc__steps > i {
  height: 4px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-asc-fill);
}
.ui-wsfc__steps > i > span {
  display: block;
  width: 13%;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-asc-accent);
}
.ui-wsfc__guide-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition:
    opacity 260ms,
    transform 360ms var(--ui-asc-ease),
    visibility 260ms;
}
.ui-wsfc__guide-content > div {
  padding: 12px 4px 4px;
  zoom: 0.86;
}
.ui-wsfc__guide[data-open] .ui-wsfc__guide-content {
  opacity: 1;
  visibility: visible;
  transform: none;
}
.ui-wsfc__guide[data-open] .ui-wsfc__steps {
  visibility: hidden;
}
.ui-wsfc__guide-content header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px 0 16px;
}
.ui-wsfc__guide-content b {
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
}
.ui-wsfc__guide-content header button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 12px;
  color: var(--ui-asc-muted);
  font-size: 12px;
  line-height: 16px;
}
.ui-wsfc__progress progress {
  flex: 1;
  width: 0;
  height: 4px;
  border: 0;
  accent-color: var(--ui-asc-accent);
}
.ui-wsfc__progress progress::-webkit-progress-bar {
  background: var(--ui-asc-fill);
  border-radius: 2px;
}
.ui-wsfc__progress progress::-webkit-progress-value {
  background: var(--ui-asc-accent);
  border-radius: 2px;
}
.ui-wsfc__setup-groups {
  display: grid;
  gap: 2px;
  padding: 4px 4px 2px;
  border-top: 0.5px solid var(--ui-asc-line);
}
.ui-wsfc__setup-groups > section {
  border-radius: 8px;
  transition: background-color 200ms;
}
.ui-wsfc__setup-groups > section[data-open] {
  background: color-mix(in srgb, var(--ui-asc-ink) 2.5%, transparent);
}
.ui-wsfc .ui-wsfc__setup-head {
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
.ui-wsfc__setup-head svg {
  color: var(--ui-asc-muted);
  transition: transform 320ms var(--ui-asc-ease);
}
.ui-wsfc__setup-head[aria-expanded="true"] svg {
  transform: rotate(180deg);
}
.ui-wsfc__setup-list {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 380ms var(--ui-asc-ease);
}
.ui-wsfc__setup-list[data-open] {
  grid-template-rows: 1fr;
}
.ui-wsfc__setup-list > div {
  min-height: 0;
  overflow: hidden;
  padding: 0 4px;
}
.ui-wsfc__setup-list button {
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
    transform 320ms var(--ui-asc-ease);
}
.ui-wsfc__setup-list button:last-child {
  margin-bottom: 6px;
}
.ui-wsfc__setup-list[data-open] button {
  opacity: 1;
  transform: none;
  transition-delay: 80ms;
}
.ui-wsfc__setup-list button:disabled {
  color: var(--ui-asc-muted);
  cursor: default;
  opacity: 1;
}
.ui-wsfc__setup-list button[data-done] {
  color: var(--ui-asc-muted);
}
.ui-wsfc__setup-list button[data-done] > span:last-child {
  text-decoration: line-through;
}
.ui-wsfc__setup-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--ui-asc-faint);
}
.ui-wsfc__setup-check svg {
  width: 16px;
  height: 16px;
}
.ui-wsfc__setup-list button:disabled .ui-wsfc__setup-check {
  box-shadow: none;
  color: var(--ui-asc-faint);
}
.ui-wsfc__setup-list button[data-done] .ui-wsfc__setup-check {
  background: var(--ui-asc-accent);
  color: #fff;
  box-shadow: none;
}
.ui-wsfc__guide-content button:hover:not(:disabled) {
  background: var(--ui-asc-fill);
}
@media (pointer: coarse) {
  .ui-wsfc__setup-list button {
    padding-block: 9px !important;
  }
  .ui-wsfc .ui-wsfc__setup-head {
    padding-block: 12px;
  }
  .ui-wsfc__guide-content header button {
    width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wsfc * {
    animation: none !important;
    transition: none !important;
  }
}
@container ui-asc (min-width:900px) {
  .ui-asc[data-sidebar-collapsed] .ui-wsfc {
    visibility: hidden;
  }
}
@container ui-asc (max-width:600px) {
  .ui-wsfc__news {
    display: none;
  }
}

.ui-ccc__overlay {
  position: absolute;
  bottom: 100%;
  inset-inline: 0;
  z-index: 21;
}
.ui-ccc {
  --ui-ccc-card: #fff;
  --ui-ccc-tray: rgba(0, 0, 0, 0.035);
  --ui-ccc-ink: rgba(0, 0, 0, 0.88);
  --ui-ccc-text: rgba(0, 0, 0, 0.61);
  --ui-ccc-muted: rgba(0, 0, 0, 0.45);
  --ui-ccc-faint: rgba(0, 0, 0, 0.27);
  --ui-ccc-line: rgba(0, 0, 0, 0.06);
  --ui-ccc-fill: rgba(0, 0, 0, 0.04);
  --ui-ccc-focus: rgba(0, 96, 226, 0.35);
  --ui-ccc-danger: #e5484d;
  --ui-ccc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-ccc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  width: 100%;
  position: relative;
  container: ui-ccc / inline-size;
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ccc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-ccc,
.ui-ccc *,
.ui-ccc *::before,
.ui-ccc *::after {
  box-sizing: border-box;
}
.ui-ccc button,
.ui-ccc textarea {
  font: inherit;
  color: inherit;
}
.ui-ccc button {
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ccc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-ccc button:focus-visible,
.ui-ccc textarea:focus-visible {
  outline: 2px solid var(--ui-ccc-focus);
  outline-offset: 2px;
}
.ui-ccc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ccc__body {
  padding: 14px 12px 10px;
  border-radius: 18px;
  background: var(--ui-ccc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ccc-line);
}
.ui-ccc__body:focus-within {
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.16);
}
.ui-ccc__message {
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
.ui-ccc__message::placeholder {
  color: var(--ui-ccc-muted);
}
.ui-ccc__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 28px;
  margin-top: 10px;
}
.ui-ccc__group {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.ui-ccc__group--end {
  margin-left: auto;
}
.ui-ccc__icon-btn,
.ui-ccc__send {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--ui-ccc-muted) !important;
  transition:
    background-color 150ms,
    transform 180ms;
}
.ui-ccc__icon-btn:hover {
  background: var(--ui-ccc-fill);
}
.ui-ccc__approval,
.ui-ccc__model {
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
.ui-ccc__approval {
  color: var(--ui-ccc-muted) !important;
}
.ui-ccc__approval[data-tone="full"] {
  color: var(--ui-ccc-danger) !important;
}
.ui-ccc__approval:hover,
.ui-ccc__model:hover {
  background: var(--ui-ccc-fill);
}
.ui-ccc__face {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  animation: ui-ccc-morph 360ms var(--ui-ccc-ease);
}
.ui-ccc__face > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-ccc__send {
  background: var(--ui-ccc-ink) !important;
  color: var(--ui-ccc-card) !important;
}
.ui-ccc__send:disabled {
  background: var(--ui-ccc-fill) !important;
  color: var(--ui-ccc-muted) !important;
  opacity: 1;
}
.ui-ccc__plan {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  color: var(--ui-ccc-muted);
  background: var(--ui-ccc-fill);
}
.ui-ccc__menu {
  width: 300px;
  max-width: calc(100vw - 24px);
  overflow: auto;
  overscroll-behavior: contain;
  padding: 5px;
  border-radius: 12px;
  background: var(--ui-ccc-card);
  box-shadow: var(--ui-ccc-shadow);
  animation: ui-ccc-pop 240ms var(--ui-ccc-ease);
}
.ui-ccc__menu-title {
  padding: 8px 9px 5px;
  color: var(--ui-ccc-muted);
  font-size: 11px;
}
.ui-ccc__option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 36px;
  border-radius: 7px;
  padding: 7px 9px;
  text-align: left;
}
.ui-ccc__option:hover,
.ui-ccc__option:focus-visible {
  background: var(--ui-ccc-fill);
}
.ui-ccc__option-logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  color: var(--ui-ccc-muted);
}
.ui-ccc__option-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-ccc__option-text > span {
  font-weight: 500;
}
.ui-ccc__option-text small {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-ccc-muted);
  margin-top: 2px;
  overflow-wrap: anywhere;
}
.ui-ccc__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0 0 8px;
  list-style: none;
}
.ui-ccc__attachments li {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 200px;
  background: var(--ui-ccc-fill);
  padding: 5px 6px 5px 8px;
  border-radius: 7px;
  font-size: 11px;
}
.ui-ccc__attachments li > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ccc__attachments button {
  display: grid;
  place-items: center;
  padding: 2px;
}
.ui-ccc__error {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ui-ccc-danger);
  margin: 8px 0 0;
}
.ui-ccc__error button {
  margin-left: auto;
}
.ui-ccc__footer {
  padding: 10px 6px;
  color: var(--ui-ccc-muted);
  font-size: 12px;
}
.ui-ccc__recording {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex: 1;
  position: absolute;
  left: 12px;
  right: 12px;
  background: var(--ui-ccc-card);
  height: 28px;
}
.ui-ccc__timer {
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--ui-ccc-muted);
}
.ui-ccc__wave {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  padding-inline: 6px;
}
.ui-ccc__wave i {
  display: block;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-ccc-text);
  animation: ui-ccc-wave 650ms ease-in-out infinite alternate;
}
.ui-ccc[data-menu-open] {
  z-index: 20;
}
@keyframes ui-ccc-wave {
  to {
    transform: scaleY(0.25);
  }
}
@keyframes ui-ccc-morph {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(25%);
  }
}
@keyframes ui-ccc-pop {
  from {
    opacity: 0;
    transform: translateY(5px) scale(0.98);
  }
}
@container ui-ccc (max-width:420px) {
  .ui-ccc__approval {
    max-width: 138px;
  }
  .ui-ccc__model {
    max-width: 110px;
  }
  .ui-ccc__body {
    padding: 12px 10px 8px;
  }
  .ui-ccc__group {
    gap: 2px;
  }
}
@container ui-ccc (max-width:340px) {
  .ui-ccc__approval {
    max-width: 28px;
    padding: 0 6px;
  }
  .ui-ccc__approval .ui-ccc__face > span {
    display: none;
  }
  .ui-ccc__plan {
    display: none;
  }
  .ui-ccc__model {
    max-width: 105px;
  }
}
@media (pointer: coarse) {
  .ui-ccc__icon-btn,
  .ui-ccc__send {
    width: 34px;
    height: 34px;
  }
  .ui-ccc__approval,
  .ui-ccc__model {
    height: 34px;
  }
  .ui-ccc__tools,
  .ui-ccc__recording {
    min-height: 34px;
  }
  .ui-ccc__option {
    min-height: 44px;
  }
  .ui-ccc__message {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ccc,
  .ui-ccc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ccc {
  --ui-ccc-card: #1c1c1e;
  --ui-ccc-tray: #161618;
  --ui-ccc-ink: rgba(255, 255, 255, 0.9);
  --ui-ccc-text: rgba(255, 255, 255, 0.62);
  --ui-ccc-muted: rgba(255, 255, 255, 0.46);
  --ui-ccc-faint: rgba(255, 255, 255, 0.3);
  --ui-ccc-line: rgba(255, 255, 255, 0.1);
  --ui-ccc-fill: rgba(255, 255, 255, 0.08);
  --ui-ccc-focus: rgba(77, 141, 255, 0.5);
  --ui-ccc-danger: #ff6369;
  --ui-ccc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}

.ui-afdc {
  --ui-afdc-card: #fff;
  --ui-afdc-ink: rgba(0, 0, 0, 0.88);
  --ui-afdc-text: rgba(0, 0, 0, 0.61);
  --ui-afdc-muted: rgba(0, 0, 0, 0.45);
  --ui-afdc-faint: rgba(0, 0, 0, 0.27);
  --ui-afdc-line: rgba(0, 0, 0, 0.06);
  --ui-afdc-fill: rgba(0, 0, 0, 0.04);
  --ui-afdc-focus: #0060e2;
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
  color: var(--ui-afdc-ink);
  container: ui-afdc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-afdc,
.ui-afdc *,
.ui-afdc *::before,
.ui-afdc *::after {
  box-sizing: border-box;
}
.ui-afdc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-afdc button:disabled {
  opacity: 0.3;
  cursor: default;
}
.ui-afdc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-afdc button:focus-visible {
  outline: 2px solid var(--ui-afdc-focus);
  outline-offset: -2px;
}
.ui-afdc__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  flex: none;
}
.ui-afdc__toolbar > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-afdc-muted);
}
.ui-afdc__toolbar > button:first-child {
  rotate: 90deg;
}
.ui-afdc__toolbar > button:nth-child(2) {
  rotate: -90deg;
}
.ui-afdc__toolbar > button[aria-pressed="true"],
.ui-afdc__toolbar > button:hover:not(:disabled) {
  background: var(--ui-afdc-fill);
}
.ui-afdc__toolbar > strong {
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
}
.ui-afdc__search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  border: 0.5px solid var(--ui-afdc-line);
  border-radius: 6px;
  padding: 0 8px;
  margin: 8px 0 6px;
  color: var(--ui-afdc-faint);
  flex: none;
}
.ui-afdc__search input {
  width: 0;
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  font: inherit;
  color: var(--ui-afdc-ink);
  background: none;
}
.ui-afdc__search:focus-within {
  border-color: var(--ui-afdc-muted);
}
.ui-afdc__search input::placeholder {
  color: var(--ui-afdc-faint);
}
.ui-afdc__columns,
.ui-afdc__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px 72px;
  gap: 4px;
  align-items: center;
}
.ui-afdc__columns {
  height: 26px;
  flex: none;
  border-bottom: 0.5px solid var(--ui-afdc-line);
}
.ui-afdc__columns button {
  display: flex;
  gap: 3px;
  font-size: 12px;
  text-align: left;
  color: var(--ui-afdc-muted);
  padding: 0 8px;
}
.ui-afdc__columns button:not(:first-child) {
  justify-content: flex-end;
}
.ui-afdc__items {
  overflow: auto;
  min-height: 0;
  max-height: 100%;
  flex: 1;
}
.ui-afdc__item {
  width: 100%;
  height: 30px;
  padding: 0 8px;
  text-align: left;
  border-bottom: 0.5px solid var(--ui-afdc-line) !important;
  border-radius: 3px;
}
.ui-afdc__item:hover,
.ui-afdc__item[aria-selected="true"] {
  background: var(--ui-afdc-fill);
}
.ui-afdc__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ui-afdc__name > span:first-child {
  display: flex;
  color: #2989df;
  flex: none;
}
.ui-afdc__name > [data-kind="table"] {
  color: #44ad76 !important;
}
.ui-afdc__name > [data-kind="code"] {
  color: #ed9540 !important;
}
.ui-afdc__name > [data-kind="folder"] {
  color: #e8b000 !important;
}
.ui-afdc__name > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-afdc__item > span:not(:first-child) {
  font-size: 12px;
  color: var(--ui-afdc-muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ui-afdc__items[data-view="icons"] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  align-content: start;
  gap: 8px;
  padding-block: 10px;
}
.ui-afdc__items[data-view="icons"] .ui-afdc__item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 94px;
  border: 0 !important;
  gap: 3px;
  border-radius: 8px;
}
.ui-afdc__items[data-view="icons"] .ui-afdc__name {
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}
.ui-afdc__items[data-view="icons"] .ui-afdc__name svg {
  width: 28px;
  height: 28px;
}
.ui-afdc__items[data-view="icons"] .ui-afdc__item > span:not(:first-child) {
  display: none;
}
.ui-afdc__rename {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px;
}
.ui-afdc__rename input {
  min-width: 0;
  flex: 1;
  font: inherit;
  color: inherit;
  background: var(--ui-afdc-card);
  border: 0.5px solid var(--ui-afdc-muted);
  border-radius: 4px;
  outline: none;
}
.ui-afdc footer {
  padding: 8px 0;
  font-size: 12px;
  text-align: center;
  border-top: 0.5px solid var(--ui-afdc-line);
  color: var(--ui-afdc-faint);
  font-variant-numeric: tabular-nums;
  flex: none;
}
.ui-afdc__empty {
  text-align: center;
  font-size: 12px;
  padding: 24px;
  color: var(--ui-afdc-muted);
}
.ui-afdc__menu {
  width: 200px;
  overflow: auto;
  padding: 5px;
  border-radius: 10px;
  background: var(--ui-afdc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-afdc-line),
    0 6px 20px rgba(0, 0, 0, 0.12);
}
.ui-afdc__menu button {
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
.ui-afdc__menu button:hover {
  background: var(--ui-afdc-fill);
}
.ui-afdc__menu [data-danger] {
  color: #e5484d;
}
.ui-afdc__menu kbd {
  font:
    10px ui-monospace,
    monospace;
  color: var(--ui-afdc-muted);
}
.ui-afdc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
@container ui-afdc (max-width:300px) {
  .ui-afdc__columns,
  .ui-afdc__item {
    grid-template-columns: minmax(0, 1fr) 58px;
  }
  .ui-afdc__columns > button:last-child,
  .ui-afdc__item > span:last-child {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-afdc__item,
  .ui-afdc__toolbar > button,
  .ui-afdc__menu button {
    min-height: 36px;
  }
  .ui-afdc__search {
    height: 36px;
  }
  .ui-afdc__search input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-afdc,
  .ui-afdc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-afdc {
  --ui-afdc-card: #1c1c1e;
  --ui-afdc-ink: rgba(255, 255, 255, 0.9);
  --ui-afdc-text: rgba(255, 255, 255, 0.62);
  --ui-afdc-muted: rgba(255, 255, 255, 0.46);
  --ui-afdc-faint: rgba(255, 255, 255, 0.3);
  --ui-afdc-line: rgba(255, 255, 255, 0.08);
  --ui-afdc-fill: rgba(255, 255, 255, 0.06);
  --ui-afdc-focus: #4d8dff;
}

.ui-aivc {
  --ui-aivc-card: #fff;
  --ui-aivc-ink: rgba(0, 0, 0, 0.88);
  --ui-aivc-muted: rgba(0, 0, 0, 0.45);
  --ui-aivc-line: rgba(0, 0, 0, 0.06);
  --ui-aivc-fill: rgba(0, 0, 0, 0.025);
  --ui-aivc-focus: #0060e2;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  color: var(--ui-aivc-ink);
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
.ui-aivc,
.ui-aivc * {
  box-sizing: border-box;
}
.ui-aivc__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-bottom: 0.5px solid var(--ui-aivc-line);
  flex: none;
}
.ui-aivc button,
.ui-aivc a {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  border: 0;
  border-radius: 5px;
  color: var(--ui-aivc-muted);
  background: none;
  font: inherit;
  cursor: pointer;
  text-decoration: none;
}
.ui-aivc a {
  margin-left: auto;
}
.ui-aivc button:hover,
.ui-aivc a:hover {
  background: var(--ui-aivc-fill);
}
.ui-aivc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-aivc :is(button, a):focus-visible {
  outline: 2px solid var(--ui-aivc-focus);
  outline-offset: -2px;
}
.ui-aivc :is(button, a):active {
  transform: scale(0.97);
}
.ui-aivc__canvas {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: var(--ui-aivc-fill);
}
.ui-aivc img {
  display: block;
  height: auto;
  flex: none;
  border-radius: 6px;
  box-shadow: 0 0 0 0.5px var(--ui-aivc-line);
}
.ui-aivc__canvas p {
  color: var(--ui-aivc-muted);
}
@media (pointer: coarse) {
  .ui-aivc button,
  .ui-aivc a {
    min-width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-aivc,
  .ui-aivc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-aivc {
  --ui-aivc-card: #1c1c1e;
  --ui-aivc-ink: rgba(255, 255, 255, 0.9);
  --ui-aivc-muted: rgba(255, 255, 255, 0.46);
  --ui-aivc-line: rgba(255, 255, 255, 0.08);
  --ui-aivc-fill: rgba(255, 255, 255, 0.025);
  --ui-aivc-focus: #4d8dff;
}

.ui-awc__code {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}
.ui-awc__code .ui-awc__toolbar {
  gap: 12px;
}
.ui-awc__code-language {
  margin-right: auto;
  font-size: 11px;
  color: var(--ui-awc-muted);
}
.ui-awc__code .ui-awc__toolbar button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ui-awc-muted);
  min-height: 28px;
}
.ui-awc__code-body {
  display: flex;
  flex: 1;
  min-height: 180px;
  border-top: 0.5px solid var(--ui-awc-line);
}
.ui-awc__code-body pre,
.ui-awc__code-body textarea {
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
.ui-awc__code-body pre {
  color: var(--ui-awc-faint);
  background: var(--ui-awc-fill);
  text-align: right;
  overflow: hidden;
  width: 44px;
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-awc__code-body textarea {
  background: none;
  resize: none;
  border: 0;
  outline: none;
  flex: 1;
  min-width: 0;
  color: var(--ui-awc-ink);
  overflow: auto;
}
.ui-awc__code-notice {
  font-size: 11px;
  padding: 4px 12px;
  color: var(--ui-awc-muted);
  min-height: 22px;
}
.ui-awc {
  --ui-awc-card: #fff;
  --ui-awc-ink: rgba(0, 0, 0, 0.88);
  --ui-awc-text: rgba(0, 0, 0, 0.61);
  --ui-awc-muted: rgba(0, 0, 0, 0.45);
  --ui-awc-faint: rgba(0, 0, 0, 0.27);
  --ui-awc-line: rgba(0, 0, 0, 0.06);
  --ui-awc-fill: rgba(0, 0, 0, 0.025);
  --ui-awc-focus: rgba(0, 96, 226, 0.35);
  --ui-awc-selection: rgba(0, 96, 226, 0.1);
  --ui-awc-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 12px 28px -10px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--ui-awc-card);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-awc-ink);
  container: ui-awc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-awc,
.ui-awc *,
.ui-awc *::before,
.ui-awc *::after {
  box-sizing: border-box;
}
.ui-awc :where(button, input, select) {
  font: inherit;
  color: inherit;
}
.ui-awc :where(button) {
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-awc button:disabled {
  opacity: 0.35;
  cursor: default;
}
.ui-awc button:focus-visible,
.ui-awc input:focus-visible,
.ui-awc select:focus-visible,
.ui-awc__doc:focus-visible {
  outline: 2px solid var(--ui-awc-focus);
  outline-offset: -2px;
}
.ui-awc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-awc__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 48px;
  padding: 6px;
  border-bottom: 0.5px solid var(--ui-awc-line);
  flex: none;
  background: var(--ui-awc-fill);
}
.ui-awc__tabs {
  display: flex;
  gap: 4px;
  min-width: 0;
  overflow: auto;
  scrollbar-width: none;
}
.ui-awc__tab-wrap {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 8px;
  min-width: 0;
  flex-shrink: 0;
  color: var(--ui-awc-muted);
}
.ui-awc__tab-wrap[data-active] {
  background: var(--ui-awc-card);
  box-shadow: 0 0 0 0.5px var(--ui-awc-line);
  color: var(--ui-awc-ink);
}
.ui-awc__tab {
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
.ui-awc__tab span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.ui-awc__tab-close {
  display: grid;
  place-items: center;
  position: absolute;
  right: 4px;
  top: 7px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--ui-awc-muted) !important;
}
.ui-awc__tab-close:hover {
  background: var(--ui-awc-fill);
}
.ui-awc__collapse {
  margin-left: auto;
}
.ui-awc__tool {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  color: var(--ui-awc-muted) !important;
  padding: 0;
}
.ui-awc__tool:hover,
.ui-awc__tool[aria-pressed="true"] {
  background: var(--ui-awc-fill);
}
.ui-awc__pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.ui-awc__heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  padding: 16px 18px 10px;
}
.ui-awc__heading > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-awc__heading strong {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-awc__heading small {
  font-size: 11px;
  color: var(--ui-awc-muted);
}
.ui-awc__file-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--ui-awc-fill);
  color: #2989df;
}
.ui-awc__file-icon[data-kind="table"] {
  color: #1a9a52;
}
.ui-awc__sheet {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  position: relative;
}
.ui-awc__toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 36px;
  padding: 0 12px 8px;
  flex: none;
  overflow-x: auto;
  scrollbar-width: none;
}
.ui-awc__divider {
  width: 1px;
  height: 14px;
  flex: none;
  background: var(--ui-awc-line);
  margin-inline: 3px;
}
.ui-awc__format {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  white-space: nowrap;
  color: var(--ui-awc-text) !important;
  padding: 0 4px;
}
.ui-awc__format > span {
  color: var(--ui-awc-muted);
  font-size: 12px;
}
.ui-awc__formula {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 10px 18px 10px;
  height: 28px;
  flex: none;
  border: 0.5px solid var(--ui-awc-line);
  border-radius: 5px;
  overflow: hidden;
}
.ui-awc__formula input {
  border: 0;
  outline: none;
  background: none;
  padding: 0 8px;
  min-width: 0;
  flex: 1;
  font-size: 12px;
}
.ui-awc__formula input:first-child {
  width: 62px;
  flex: none;
  text-align: center;
  font-variant-numeric: tabular-nums;
  border-right: 0.5px solid var(--ui-awc-line);
}
.ui-awc__formula > span {
  font-style: italic;
  font-size: 12px;
  color: var(--ui-awc-faint);
  padding-left: 8px;
}
.ui-awc__grid-wrap {
  overflow: auto;
  min-height: 0;
  overscroll-behavior: contain;
}
.ui-awc__grid {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
}
.ui-awc__grid th,
.ui-awc__grid td {
  border-right: 0.5px solid var(--ui-awc-line);
  border-bottom: 0.5px solid var(--ui-awc-line);
  padding: 4px 8px;
  height: 26px;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  font-weight: 400;
}
.ui-awc__grid thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 26px;
  text-align: center;
  font-size: 10px;
  color: var(--ui-awc-muted);
  background: var(--ui-awc-card);
}
.ui-awc__grid th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  width: 30px;
  text-align: center;
  padding-inline: 4px;
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--ui-awc-muted);
  background: var(--ui-awc-card);
}
.ui-awc__grid thead th:first-child {
  z-index: 3;
}
.ui-awc__grid [data-bold] {
  font-weight: 500;
}
.ui-awc__grid th[data-selected] {
  background: var(--ui-awc-selection);
  color: var(--ui-awc-ink);
}
.ui-awc__grid td[aria-selected="true"] {
  outline: 2px solid var(--ui-awc-muted);
  outline-offset: -2px;
  overflow: visible;
  z-index: 1;
}
.ui-awc__grid td[aria-selected="true"]::after {
  content: "";
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 5px;
  height: 5px;
  background: var(--ui-awc-muted);
  border: 1px solid var(--ui-awc-card);
}
.ui-awc__grid td:focus {
  outline: 2px solid var(--ui-awc-muted);
  outline-offset: -2px;
}
.ui-awc__cell-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: var(--ui-awc-card);
  border: 0;
  outline: 2px solid var(--ui-awc-focus);
  padding: 2px 8px;
}
.ui-awc__col-resize {
  position: absolute;
  inset: 0 -3px 0 auto;
  width: 7px;
  cursor: col-resize !important;
  touch-action: none;
  padding: 0;
}
.ui-awc__col-resize:hover {
  background: var(--ui-awc-selection);
}
.ui-awc__sheet-status {
  margin-top: auto;
  padding: 6px 16px;
  min-height: 28px;
  color: var(--ui-awc-faint);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}
.ui-awc__document {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.ui-awc__text-style {
  max-width: 92px;
  height: 28px;
  background: none;
  border: 0;
  color: var(--ui-awc-muted) !important;
  cursor: pointer;
  font-size: 12px !important;
}
.ui-awc__doc {
  padding: 8px 18px 20px;
  outline: none;
  overflow: auto;
  min-height: 220px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-awc-text);
  overflow-wrap: anywhere;
}
.ui-awc__doc h1,
.ui-awc__doc h2,
.ui-awc__doc h3 {
  font-weight: 500;
  color: var(--ui-awc-ink);
  margin: 0 0 10px;
  line-height: 1.4;
}
.ui-awc__doc h1 {
  font-size: 20px;
}
.ui-awc__doc h2 {
  font-size: 17px;
}
.ui-awc__doc h3 {
  font-size: 15px;
}
.ui-awc__doc p {
  margin: 0 0 10px;
}
.ui-awc__doc ul,
.ui-awc__doc ol {
  padding-left: 21px;
  margin: 0 0 10px;
}
.ui-awc__doc li {
  padding-left: 0;
  margin-bottom: 3px;
}
.ui-awc__doc li::marker {
  color: var(--ui-awc-faint);
}
.ui-awc__doc b,
.ui-awc__doc strong {
  font-weight: 600;
}
.ui-awc__doc a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ui-awc__doc-status {
  padding: 8px 18px;
  border-top: 0.5px solid var(--ui-awc-line);
  font-size: 11px;
  letter-spacing: 0.025em;
  color: var(--ui-awc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-awc__link-form {
  display: flex;
  gap: 6px;
  padding: 6px 18px;
}
.ui-awc__link-form input {
  min-width: 0;
  flex: 1;
  background: none;
  border: 1px solid var(--ui-awc-line);
  border-radius: 4px;
  padding: 4px;
}
.ui-awc__link-form button {
  font-size: 12px;
  color: var(--ui-awc-text);
}
.ui-awc__menu {
  min-width: 180px;
  padding: 5px;
  overflow: auto;
  background: var(--ui-awc-card);
  box-shadow: var(--ui-awc-shadow);
  border-radius: 9px;
  animation: ui-awc-in 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ui-awc__menu button {
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
.ui-awc__menu button:hover {
  background: var(--ui-awc-fill);
}
.ui-awc__start {
  padding: 32px 24px;
  overflow: auto;
  color: var(--ui-awc-muted);
}
.ui-awc__start h2 {
  font-size: 17px;
  font-weight: 500;
  color: var(--ui-awc-ink);
}
.ui-awc__start > input {
  width: 100%;
  background: none;
  border: 1px solid var(--ui-awc-line);
  padding: 9px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.ui-awc__create {
  display: flex;
  gap: 8px;
}
.ui-awc__create button {
  display: flex;
  gap: 6px;
  align-items: center;
  text-align: left;
  padding: 8px;
  background: var(--ui-awc-fill);
  border-radius: 7px;
  font-size: 11px;
}
.ui-awc__start-label {
  font-size: 11px;
  margin-top: 26px;
}
.ui-awc__file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 2px;
  text-align: left;
  font-size: 12px !important;
}
.ui-awc__file-row > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.ui-awc__file-row:hover {
  color: var(--ui-awc-ink);
}
@keyframes ui-awc-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
@container ui-awc (max-width:360px) {
  .ui-awc__heading {
    padding-inline: 12px;
  }
  .ui-awc__toolbar {
    padding-inline: 10px;
  }
  .ui-awc__formula {
    margin-inline: 12px;
  }
  .ui-awc__doc {
    padding-inline: 12px;
  }
  .ui-awc__tab {
    max-width: 140px;
  }
}
@media (pointer: coarse) {
  .ui-awc__tool {
    width: 34px;
    height: 34px;
  }
  .ui-awc__tab {
    height: 34px;
  }
  .ui-awc__tab-close {
    top: 9px;
  }
  .ui-awc__grid td {
    height: 32px;
  }
  .ui-awc__menu button {
    min-height: 40px;
  }
  .ui-awc__col-resize {
    width: 11px;
  }
  .ui-awc__formula input,
  .ui-awc__cell-input {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-awc,
  .ui-awc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-awc {
  --ui-awc-card: #1c1c1e;
  --ui-awc-ink: rgba(255, 255, 255, 0.9);
  --ui-awc-text: rgba(255, 255, 255, 0.62);
  --ui-awc-muted: rgba(255, 255, 255, 0.46);
  --ui-awc-faint: rgba(255, 255, 255, 0.3);
  --ui-awc-line: rgba(255, 255, 255, 0.08);
  --ui-awc-fill: rgba(255, 255, 255, 0.025);
  --ui-awc-focus: rgba(77, 141, 255, 0.5);
  --ui-awc-selection: rgba(77, 141, 255, 0.16);
  --ui-awc-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
}

.ui-awc__file-icon[data-kind="folder"] {
  color: #e8b000;
}
.ui-awc__file-icon[data-kind="code"] {
  color: #ed9540;
}
.ui-awc__file-icon[data-kind="image"] {
  color: #a651f0;
}

.ui-wstc {
  --ui-wstc-card: #fff;
  --ui-wstc-ink: rgba(0, 0, 0, 0.88);
  --ui-wstc-muted: rgba(0, 0, 0, 0.45);
  --ui-wstc-faint: rgba(0, 0, 0, 0.27);
  --ui-wstc-line: rgba(0, 0, 0, 0.06);
  --ui-wstc-fill: rgba(0, 0, 0, 0.04);
  --ui-wstc-focus: #0060e2;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  color: var(--ui-wstc-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-wstc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-wstc,
.ui-wstc *,
.ui-wstc *::before,
.ui-wstc *::after {
  box-sizing: border-box;
}
.ui-wstc button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-wstc button:focus-visible {
  outline: 2px solid var(--ui-wstc-focus);
  outline-offset: -2px;
}
.ui-wstc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-wstc__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--ui-wstc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-wstc-line),
    0 1px 2px rgba(0, 0, 0, 0.04);
  color: var(--ui-wstc-faint);
  margin-bottom: 22px;
}
.ui-wstc__search input {
  flex: 1;
  min-width: 0;
  width: 0;
  border: 0;
  outline: none;
  background: none;
  color: var(--ui-wstc-ink);
  font: inherit;
}
.ui-wstc__search:focus-within {
  box-shadow: 0 0 0 0.5px var(--ui-wstc-muted);
}
.ui-wstc__search input::placeholder {
  color: var(--ui-wstc-faint);
}
.ui-wstc h2 {
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-wstc-muted);
  margin: 0 4px 8px;
}
.ui-wstc__card {
  border-radius: 12px;
  box-shadow:
    0 0 0 0.5px var(--ui-wstc-line),
    0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 2px 10px;
  margin-bottom: 22px;
}
.ui-wstc__tool,
.ui-wstc__source {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  text-align: left;
  padding: 8px 0 !important;
}
.ui-wstc__tool + .ui-wstc__tool,
.ui-wstc__source + .ui-wstc__source {
  border-top: 0.5px solid var(--ui-wstc-line) !important;
}
.ui-wstc__tool:hover,
.ui-wstc__source:hover {
  background: var(--ui-wstc-fill);
}
.ui-wstc__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ui-wstc-fill);
  color: var(--ui-wstc-muted);
}
.ui-wstc__icon[data-kind="folder"] {
  color: #e8b000;
}
.ui-wstc__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-wstc__icon[data-kind="document"] {
  color: #2989df;
}
.ui-wstc__tool > kbd {
  font: 11px/20px inherit;
  font-family: inherit;
  background: var(--ui-wstc-fill);
  border-radius: 5px;
  padding: 0 5px;
  color: var(--ui-wstc-faint);
  margin-left: auto;
}
.ui-wstc__source > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-wstc__source strong {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-wstc__source small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-wstc-muted);
}
.ui-wstc__empty {
  font-size: 12px;
  color: var(--ui-wstc-muted);
  padding: 12px 0;
  margin: 0;
}
.ui-wstc__tool-pane {
  display: flex;
  flex-direction: column;
}
.ui-wstc__tool-pane[data-tool="notes"] textarea {
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
  color: var(--ui-wstc-ink);
}
.ui-wstc__terminal-output {
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
.ui-wstc__command {
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
.ui-wstc__command input {
  width: 0;
  flex: 1;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
}
.ui-wstc__browser-home {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ui-wstc-faint);
  gap: 12px;
}
.ui-wstc__browser-home h2 {
  font-size: 18px;
  margin: 0;
}
.ui-wstc__browser-home p {
  font-size: 12px;
  margin: 0;
}
.ui-wstc__search > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
}
@media (pointer: coarse) {
  .ui-wstc__search {
    min-height: 40px;
  }
  .ui-wstc input,
  .ui-wstc textarea {
    font-size: 16px;
  }
  .ui-wstc__tool,
  .ui-wstc__source {
    min-height: 48px;
  }
  .ui-wstc__tool > kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wstc,
  .ui-wstc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-wstc {
  --ui-wstc-card: #1c1c1e;
  --ui-wstc-ink: rgba(255, 255, 255, 0.9);
  --ui-wstc-muted: rgba(255, 255, 255, 0.46);
  --ui-wstc-faint: rgba(255, 255, 255, 0.3);
  --ui-wstc-line: rgba(255, 255, 255, 0.08);
  --ui-wstc-fill: rgba(255, 255, 255, 0.06);
  --ui-wstc-focus: #4d8dff;
}

.ui-cbrc {
  --ui-cbrc-card: #fff;
  --ui-cbrc-ink: rgba(0, 0, 0, 0.88);
  --ui-cbrc-text: rgba(0, 0, 0, 0.61);
  --ui-cbrc-muted: rgba(0, 0, 0, 0.45);
  --ui-cbrc-faint: rgba(0, 0, 0, 0.27);
  --ui-cbrc-line: rgba(0, 0, 0, 0.12);
  --ui-cbrc-chip: rgba(0, 0, 0, 0.04);
  --ui-cbrc-hover: rgba(0, 0, 0, 0.025);
  --ui-cbrc-focus: #0060e2;
  --ui-cbrc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
  padding: 0 2px;
  color: var(--ui-cbrc-ink);
  font:
    13px/18.571px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ui-cbrc,
.ui-cbrc *,
.ui-cbrc *::before,
.ui-cbrc *::after {
  box-sizing: border-box;
}
.ui-cbrc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-cbrc button:focus-visible,
.ui-cbrc input:focus-visible + .ui-cbrc__track {
  outline: 2px solid var(--ui-cbrc-focus);
  outline-offset: 2px;
}
.ui-cbrc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-cbrc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cbrc__seg {
  display: flex;
  flex: none;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: var(--ui-cbrc-chip);
}
.ui-cbrc__seg button {
  flex: 1;
  height: 26px;
  border-radius: 7px;
  font-weight: 500;
  color: var(--ui-cbrc-muted);
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-cbrc__seg button:hover {
  color: var(--ui-cbrc-ink);
}
.ui-cbrc__seg button[aria-selected="true"] {
  background: var(--ui-cbrc-card);
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.05);
  color: var(--ui-cbrc-ink);
}
.ui-cbrc__panel {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  gap: 18px;
  animation: ui-cbrc-rise 380ms var(--ui-cbrc-ease) both;
}
.ui-cbrc__card,
.ui-cbrc__product,
.ui-cbrc__go,
.ui-cbrc__activity {
  border-radius: 12px;
  background: var(--ui-cbrc-card);
  box-shadow:
    inset 0 0 0 0.5px var(--ui-cbrc-line),
    0 1px 2px rgba(0, 0, 0, 0.025);
}
.ui-cbrc__card {
  display: flex;
  flex-direction: column;
  padding: 4px 12px;
}
.ui-cbrc__card:has(> .ui-cbrc__pills),
.ui-cbrc__card:has(> .ui-cbrc__details) {
  padding: 12px;
}
.ui-cbrc__product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}
.ui-cbrc__thumb {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #efe7da;
  color: #7c6a4f;
}
.ui-cbrc__pinfo {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 12px;
  line-height: 17px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__pinfo b {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-cbrc-ink);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__pinfo > span {
  overflow-wrap: anywhere;
}
.ui-cbrc__chip {
  flex: none;
  max-width: 40%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(22, 163, 74, 0.1);
  font-size: 12px;
  font-weight: 500;
  color: #15803d;
}
.ui-cbrc__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-cbrc__label {
  padding: 0 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  margin: 0 -8px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--ui-cbrc-muted) !important;
  text-align: left;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;
}
.ui-cbrc__option:hover {
  background: var(--ui-cbrc-hover) !important;
  color: var(--ui-cbrc-ink) !important;
}
.ui-cbrc__option[aria-checked="true"] {
  background: var(--ui-cbrc-chip);
  color: var(--ui-cbrc-ink) !important;
}
.ui-cbrc__radio {
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--ui-cbrc-line);
  transition: box-shadow 160ms ease;
}
.ui-cbrc__option[aria-checked="true"] .ui-cbrc__radio {
  box-shadow: inset 0 0 0 4px var(--ui-cbrc-ink);
}
.ui-cbrc__name {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
}
.ui-cbrc__name > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__name small {
  font-size: 12.5px;
  font-weight: 400;
  line-height: 17px;
  color: var(--ui-cbrc-faint);
}
.ui-cbrc__signal {
  display: flex;
  flex: none;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
}
.ui-cbrc__signal i {
  width: 3px;
  border-radius: 1px;
  background: #d9d9d9;
}
.ui-cbrc__signal i:nth-child(1) {
  height: 5px;
}
.ui-cbrc__signal i:nth-child(2) {
  height: 8px;
}
.ui-cbrc__signal i:nth-child(3) {
  height: 11px;
}
.ui-cbrc__signal i[data-on] {
  background: #16a34a;
}
.ui-cbrc__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ui-cbrc__pills span {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12.5px;
  color: var(--ui-cbrc-text);
}
.ui-cbrc__channel {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  cursor: pointer;
}
.ui-cbrc__channel > svg {
  flex: none;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__switch {
  display: inline-flex;
  position: relative;
  flex: none;
}
.ui-cbrc__switch input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}
.ui-cbrc__track {
  display: block;
  width: 26px;
  height: 16px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  transition: background-color 200ms ease;
}
.ui-cbrc__track > span {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition:
    transform 260ms var(--ui-cbrc-ease),
    width 160ms var(--ui-cbrc-ease);
}
.ui-cbrc__switch input:checked + .ui-cbrc__track {
  background: var(--ui-cbrc-ink);
}
.ui-cbrc__switch input:checked + .ui-cbrc__track > span {
  transform: translateX(10px);
}
.ui-cbrc__card.ui-cbrc__split {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
}
.ui-cbrc__split .ui-cbrc__label {
  display: block;
  padding: 0 0 10px;
}
.ui-cbrc__swatches,
.ui-cbrc__formats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__swatches span,
.ui-cbrc__formats span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  text-align: center;
  overflow-wrap: anywhere;
}
.ui-cbrc__swatches i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.ui-cbrc__formats span {
  justify-content: flex-end;
  min-height: 44px;
}
.ui-cbrc__formats i {
  height: 24px;
  max-width: 36px;
  border: 1.5px solid var(--ui-cbrc-faint);
  border-radius: 4px;
}
.ui-cbrc__details {
  display: grid;
  gap: 12px;
  margin: 0;
}
.ui-cbrc__details div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
}
.ui-cbrc__details dt {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__details dd {
  min-width: 0;
  margin: 0;
  text-align: right;
  overflow-wrap: anywhere;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.ui-cbrc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-cbrc__files button {
  display: flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12px;
  color: var(--ui-cbrc-text);
}
.ui-cbrc__files button:hover {
  background: var(--ui-cbrc-chip);
}
.ui-cbrc__go {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin-top: auto;
  padding: 10px 10px 10px 12px;
  box-shadow:
    inset 0 0 0 0.5px var(--ui-cbrc-line),
    0 1px 2px rgba(0, 0, 0, 0.025),
    0 0 0 12px var(--ui-cbrc-card);
}
.ui-cbrc__go::before {
  content: "";
  position: absolute;
  left: -8px;
  right: -8px;
  bottom: calc(100% + 0.5px);
  height: 28px;
  background: linear-gradient(to bottom, transparent, var(--ui-cbrc-card) 85%);
  pointer-events: none;
}
.ui-cbrc__panel > :nth-last-child(2) {
  margin-bottom: 12px;
}
.ui-cbrc__tags {
  display: flex;
  gap: 4px;
}
.ui-cbrc__tags span {
  padding: 3px 9px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ui-cbrc-text);
}
.ui-cbrc .ui-cbrc__generate {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: none;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--ui-cbrc-ink);
  color: var(--ui-cbrc-card);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    opacity 140ms ease,
    transform 160ms var(--ui-cbrc-ease);
}
.ui-cbrc__generate > span {
  animation: ui-cbrc-label 480ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
.ui-cbrc__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
}
.ui-cbrc__empty > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: var(--ui-cbrc-card);
  box-shadow: 0 0 0 0.5px var(--ui-cbrc-line);
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__empty > b {
  font-size: 14px;
  font-weight: 500;
}
.ui-cbrc__empty p {
  max-width: 240px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 19px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__ads {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.ui-cbrc__ad {
  margin: 0;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
  animation-delay: calc(var(--ui-cbrc-index, 0) * 35ms);
}
.ui-cbrc__art {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  padding: 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.ui-cbrc__art b {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.ui-cbrc__ad figcaption {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  font-size: 12.5px;
  font-weight: 500;
}
.ui-cbrc__ad figcaption > * {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__ad figcaption b {
  flex: none;
  max-width: 60%;
  font-weight: 500;
}
.ui-cbrc__ad figcaption span {
  font-weight: 400;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__activity {
  flex: none;
  margin: 0;
  padding: 14px 12px 0;
  list-style: none;
}
.ui-cbrc__activity li {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 18px;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
  animation-delay: calc(var(--ui-cbrc-index, 0) * 35ms);
}
.ui-cbrc__activity li:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 28px;
  bottom: 2px;
  left: 13px;
  width: 1px;
  background: var(--ui-cbrc-line);
}
.ui-cbrc__activity-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__activity li > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 3px;
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 19px;
}
.ui-cbrc__activity small {
  font-size: 12.5px;
  color: var(--ui-cbrc-faint);
}
@keyframes ui-cbrc-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes ui-cbrc-label {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(25%);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cbrc {
  --ui-cbrc-card: #1c1c1e;
  --ui-cbrc-ink: rgba(255, 255, 255, 0.9);
  --ui-cbrc-text: rgba(255, 255, 255, 0.62);
  --ui-cbrc-muted: rgba(255, 255, 255, 0.46);
  --ui-cbrc-faint: rgba(255, 255, 255, 0.3);
  --ui-cbrc-line: rgba(255, 255, 255, 0.14);
  --ui-cbrc-chip: rgba(255, 255, 255, 0.06);
  --ui-cbrc-hover: rgba(255, 255, 255, 0.04);
  --ui-cbrc-focus: #4d8dff;
}
.ui-cbrc__switch input:checked + .ui-cbrc__track > span {
  background: var(--ui-cbrc-card);
}
:where(.dark, [data-theme="dark"]) .ui-cbrc__thumb {
  background: #3a3329;
  color: #d9c6a5;
}
:where(.dark, [data-theme="dark"]) .ui-cbrc__signal i:not([data-on]) {
  background: #3a3a3f;
}
@media (pointer: coarse) {
  .ui-cbrc__seg button {
    height: 34px;
  }
  .ui-cbrc__option {
    min-height: 52px;
  }
  .ui-cbrc__channel {
    min-height: 48px;
  }
  .ui-cbrc .ui-cbrc__generate {
    height: 34px;
  }
  .ui-cbrc__files button {
    min-height: 36px;
  }
  .ui-cbrc__switch::before {
    content: "";
    position: absolute;
    inset: -12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cbrc,
  .ui-cbrc * {
    animation: none !important;
    transition: none !important;
  }
}

.ui-agcc {
  line-height: 1.4286;
}
.ui-agcc .ui-asc__main {
  overflow: hidden;
}
.ui-agcc .ui-asc__main,
.ui-agcc .ui-asc__panel {
  border-width: 1px;
  box-shadow: none;
}
.ui-agcc__main {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  min-height: 0;
  position: relative;
}
.ui-agcc__bar {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 48px;
  padding: 0 12px 0 20px;
  color: var(--ui-asc-muted);
  transition: padding 420ms var(--ui-asc-ease);
}
.ui-agcc__crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 13px;
}
.ui-agcc__crumbs i {
  font-style: normal;
  color: var(--ui-asc-faint);
}
.ui-agcc__crumbs > b {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-asc-ink);
  font-weight: 500;
}
.ui-agcc__crumbs > input {
  min-width: 0;
  width: 260px;
  background: var(--ui-asc-card);
  border: 1px solid var(--ui-asc-focus);
  border-radius: 5px;
  font: inherit;
  padding: 3px 6px;
  outline: 0;
}
.ui-agcc__home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  padding: 0;
  color: inherit !important;
}
.ui-agcc__home:hover {
  color: var(--ui-asc-ink) !important;
}
.ui-agcc__options {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 6px;
  color: var(--ui-asc-muted) !important;
}
.ui-agcc__options:hover {
  background: var(--ui-asc-fill);
}
.ui-agcc__thread {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 40px 32px 16px;
  overscroll-behavior: contain;
}
.ui-agcc__column {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 680px;
  margin: 0 auto;
}
.ui-agcc__user {
  align-self: flex-end;
  max-width: 80%;
  overflow-wrap: anywhere;
  margin: 0;
  padding: 8px 14px;
  border-radius: 12px;
  background: var(--ui-asc-fill);
  font-size: 14px;
  line-height: 18.571px;
  color: var(--ui-asc-ink);
}
.ui-agcc__answer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-asc-ink);
}
.ui-agcc__answer + .ui-agcc__answer {
  margin-top: -8px;
}
.ui-agcc__answer p {
  margin: 0;
  overflow-wrap: anywhere;
}
.ui-agcc__worked,
.ui-agcc__trace summary {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 33px;
  margin: -4px 0;
  font-size: 12px;
  font-weight: 500;
  list-style: none;
}
.ui-agcc__mark {
  display: grid;
  grid-template-columns: repeat(3, 3px);
  grid-auto-rows: 3px;
  gap: 1.5px;
  place-content: center;
  width: 15px;
  height: 15px;
}
.ui-agcc__mark i {
  border-radius: 0.75px;
  background: rgba(0, 96, 226, 0.765);
}
.ui-agcc__mark[data-thinking] i {
  animation: ui-agcc-think 800ms ease-in-out infinite alternate;
}
.ui-agcc__mark[data-thinking] i:nth-child(even) {
  animation-delay: 240ms;
}
.ui-agcc__label {
  padding-top: 4px;
  font-size: 12.5px;
  color: var(--ui-asc-muted);
}
.ui-agcc__agents {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
  margin-top: -6px;
}
.ui-agcc__agent {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 30px;
  max-width: 100%;
  padding: 0 12px 0 10px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px var(--ui-asc-line);
  font-size: 13px;
  color: var(--ui-asc-text);
}
.ui-agcc__agent svg {
  flex: none;
  color: var(--ui-asc-muted);
}
.ui-agcc__agent > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-agcc__agent[data-active] {
  background: var(--ui-asc-fill);
  box-shadow: none;
  color: var(--ui-asc-ink);
}
.ui-agcc__agent[data-active] svg {
  color: var(--ui-asc-ink);
}
.ui-agcc__composer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 744px;
  margin: 0 auto;
  padding: 8px 32px 24px;
}
.ui-agcc__route {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 400;
  color: var(--ui-asc-muted);
}
.ui-agcc__route > svg {
  box-sizing: content-box;
  flex: none;
  padding: 5px;
  border-radius: 50%;
  background: var(--ui-asc-fill);
}
.ui-agcc__route b {
  font-weight: 500;
  color: var(--ui-asc-ink);
}
.ui-agcc__route > button {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--ui-asc-fill);
}
.ui-agcc__composer > .ui-ccc {
  max-width: none;
}
.ui-agcc__trace {
  width: 100%;
}
.ui-agcc__trace summary {
  cursor: pointer;
  width: fit-content;
}
.ui-agcc__trace summary::-webkit-details-marker {
  display: none;
}
.ui-agcc__trace[open] summary > svg {
  rotate: 180deg;
}
.ui-agcc__trace ol {
  display: grid;
  gap: 8px;
  padding: 12px 0 0 24px;
  margin: 0;
  list-style: none;
  font-size: 12px;
  color: var(--ui-asc-muted);
}
.ui-agcc__trace li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ui-agcc__brief-scroll {
  height: 100%;
  overflow: auto;
  padding: 16px 14px 14px;
  overscroll-behavior: contain;
}
.ui-agcc .ui-awc__bar {
  height: 48px;
  min-height: 48px;
}
.ui-agcc:not([data-panel-open]) .ui-agcc__bar {
  padding-right: 52px;
}
.ui-agcc__menu {
  width: 210px;
  max-width: calc(100% - 16px);
  padding: 5px;
  overflow: auto;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow: var(--ui-asc-shadow);
  animation: ui-agcc-pop 230ms var(--ui-asc-ease);
}
.ui-agcc__menu > button {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 32px;
  padding: 6px 9px;
  border-radius: 6px;
  text-align: left;
  font-size: 12px;
}
.ui-agcc__menu > button:hover {
  background: var(--ui-asc-fill);
}
.ui-agcc__menu [data-danger] {
  color: #e5484d;
}
.ui-agcc__notice {
  position: absolute;
  bottom: 170px;
  left: 50%;
  translate: -50% 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--ui-asc-ink);
  color: var(--ui-asc-card);
  font-size: 12px;
  z-index: 10;
}
@keyframes ui-agcc-think {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
@keyframes ui-agcc-pop {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-agcc__bar {
    padding-left: 52px;
    padding-right: 52px;
  }
}
@container ui-asc (max-width:600px) {
  .ui-agcc__crumbs > :is(i, .ui-agcc__home) {
    display: none;
  }
  .ui-agcc__thread {
    padding: 24px 16px 12px;
  }
  .ui-agcc__composer {
    padding: 6px 8px 8px;
  }
  .ui-agcc__route {
    padding-left: 6px;
  }
  .ui-agcc__route > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
@media (pointer: coarse) {
  .ui-agcc__options,
  .ui-agcc__menu > button {
    min-height: 36px;
  }
  .ui-agcc__trace summary {
    min-height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-agcc__main * {
    animation: none !important;
    transition: none !important;
  }
}

`;
