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
 * inbox (Classic) – a self-contained React 19 component.
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

export type InboxAnswer = { option?: string; text?: string } | "approve" | "decline";

export type InboxDraft = { option?: string; text?: string };

export type InboxOption = {
  id: string;
  title: string;
  summary?: string;
  recommended?: boolean;
  pros?: string[];
  cons?: string[];
  wireframe?: "illustration" | "checklist" | "data" | "bars" | "line" | ReactNode;
  preview?: ReactNode;
};

export type InboxItem = {
  id: string;
  kind: "decision" | "pick" | "approval" | "question";
  question: string;
  context?: string;
  task: string;
  at: number;
  unread?: boolean;
  options?: InboxOption[];
  facts?: { label: string; value: string }[];
  suggestions?: string[];
  done?: { answer: InboxAnswer; at: number; label?: string; history?: string[]; artifacts?: string[] };
};

export type InboxTask = {
  goal?: string;
  project?: string;
  status?: string;
  started?: string;
  steps?: { label: string; done?: boolean }[];
  artifacts?: string[];
};

function InboxGlyph({ kind, size = 14 }: { kind: InboxItem["kind"] | "done"; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "done" ? (
        <path d="m3 8 3 3 7-7" />
      ) : kind === "decision" ? (
        <path d="M8 14V9L3 4m0 0h4M3 4v4M8 9l5-5m0 0H9m4 0v4" />
      ) : kind === "pick" ? (
        <>
          <rect x="1.5" y="1.5" width="13" height="13" rx="3" />
          <path d="M1.5 7h13M7 1.5v13" />
        </>
      ) : kind === "approval" ? (
        <>
          <circle cx="8" cy="8" r="6.5" />
          <path d="m4.5 8 2.3 2.3 4.7-4.7" />
        </>
      ) : (
        <>
          <circle cx="8" cy="8" r="6.5" />
          <path d="M6 5.5a2 2 0 0 1 4 .5c0 1.5-2 1.5-2 3M8 11.5h.01" />
        </>
      )}
    </svg>
  );
}

function inboxKind(kind: unknown): InboxItem["kind"] {
  return kind === "decision" || kind === "pick" || kind === "approval" ? kind : "question";
}

function inboxAge(at: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - safeNumber(at, now)) / 60000));
  if (minutes < 1) return { short: "now", long: "just now" };
  if (minutes < 60) return { short: `${minutes}m`, long: `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago` };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { short: `${hours}h`, long: `${hours} ${hours === 1 ? "hour" : "hours"} ago` };
  const days = Math.floor(hours / 24);
  return { short: days === 1 ? "Yesterday" : `${days}d`, long: days === 1 ? "yesterday" : `${days} days ago` };
}

function inboxAnswerLabel(item: InboxItem, answer: InboxAnswer) {
  if (answer === "approve") return "Approved";
  if (answer === "decline") return "Declined";
  const option = item.options?.find((option) => option.id === answer.option);
  return option
    ? `${option.title}${answer.text?.trim() ? ` – “${answer.text.trim()}”` : ""}`
    : (answer.text?.trim() ?? "Answered");
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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

export type InboxTab = "open" | "done";
export type InboxListLabels = { inbox?: string; open?: string; done?: string; emptyOpen?: string; emptyDone?: string };
export type InboxListProps = {
  items: InboxItem[];
  tab?: InboxTab;
  defaultTab?: InboxTab;
  onTabChange?: (tab: InboxTab) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  sendingId?: string;
  collapsingId?: string;
  disabled?: boolean;
  labels?: InboxListLabels;
  now?: number;
  className?: string;
};

/** Inbox rows, a single roving Tab stop, and Open/Done tabs. Arrow and J/K navigation also selects. */
export function InboxList({
  items: rawItems,
  tab: tabProp,
  defaultTab = "open",
  onTabChange,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  onSelect,
  sendingId,
  collapsingId,
  disabled = false,
  labels = {},
  now: nowProp,
  className,
}: InboxListProps) {
  const items = (Array.isArray(rawItems) ? rawItems : []).filter(Boolean);
  const [tabValue, setTab] = useControllable(tabProp, defaultTab, onTabChange),
    [selected, setSelected] = useControllable<string | null>(
      selectedProp,
      defaultSelected ?? items.find((item) => !!item.done === (defaultTab === "done"))?.id ?? null,
      onSelectedChange,
    ),
    [clock, setClock] = useState(() => Date.now());
  const tab = tabValue === "done" ? "done" : "open",
    list = items.filter((item) => !!item.done === (tab === "done")),
    now = safeNumber(nowProp, clock),
    id = useId(),
    root = useRef<HTMLElement>(null);
  const active = list.some((item) => item.id === selected)
      ? selected
      : selectedProp === null
        ? null
        : (list[0]?.id ?? null),
    focusId = active ?? list[0]?.id;
  useEffect(() => {
    if (nowProp !== undefined) return;
    const timer = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [nowProp]);
  useEffect(() => {
    if (selectedProp === undefined && selected !== active) setSelected(active);
  }, [active, selectedProp]);
  const choose = (item: InboxItem, focus = false) => {
    if (disabled) return;
    setSelected(item.id);
    onSelect?.(item.id);
    if (focus) {
      const row = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-inbox-row]") ?? [])].find(
        (el) => el.dataset.inboxRow === item.id,
      );
      row?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: "nearest" });
    }
  };
  const move = (direction: number) => {
    const index = list.findIndex((item) => item.id === active),
      next = clamp((index < 0 ? 0 : index) + direction, 0, list.length - 1);
    if (list[next]) choose(list[next], true);
  };
  const actions = useRef({ move, disabled });
  actions.current = { move, disabled };
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      if (
        actions.current.disabled ||
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isEditing(event.target) ||
        (event.target as HTMLElement)?.closest('[role="menu"],[role="dialog"]')
      )
        return;
      const area = root.current?.closest("[data-inbox-scope]") ?? root.current;
      if (document.activeElement === document.body) {
        if (document.querySelector("[data-inbox-list]") !== root.current) return;
      } else if (!area?.contains(document.activeElement)) return;
      if (root.current?.closest("[inert]")) return;
      const value = event.key.toLowerCase();
      if (value === "j" || value === "k") {
        event.preventDefault();
        actions.current.move(value === "j" ? 1 : -1);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const rowKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      event.key === "ArrowDown"
        ? Math.min(list.length - 1, index + 1)
        : event.key === "ArrowUp"
          ? Math.max(0, index - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? list.length - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      choose(list[next], true);
    }
  };
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "open" : event.key === "End" ? "done" : tab === "open" ? "done" : "open";
    setTab(next);
    root.current?.querySelector<HTMLButtonElement>(`[data-inbox-tab="${next}"]`)?.focus();
  };
  return (
    <section
      ref={root}
      data-inbox-list=""
      className={["ui-ibl", className].filter(Boolean).join(" ")}
      aria-busy={disabled}
    >
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      <header className="ui-ibl__head">
        <h1>
          {labels.inbox ?? "Inbox"}
          <span>{items.filter((item) => !item.done).length || null}</span>
        </h1>
        <div className="ui-ibl__tabs" role="tablist" aria-label="Inbox status">
          {(["open", "done"] as const).map((value) => (
            <button
              type="button"
              role="tab"
              id={`${id}-${value}`}
              aria-selected={tab === value}
              aria-controls={`${id}-items`}
              data-inbox-tab={value}
              tabIndex={tab === value ? 0 : -1}
              disabled={disabled}
              key={value}
              onClick={() => setTab(value)}
              onKeyDown={tabKey}
            >
              {value === "open" ? (labels.open ?? "Open") : (labels.done ?? "Done")}
            </button>
          ))}
        </div>
      </header>
      <div
        className="ui-ibl__rows"
        role="listbox"
        aria-label={tab === "open" ? "Open inbox items" : "Answered inbox items"}
        id={`${id}-items`}
        aria-labelledby={`${id}-${tab}`}
      >
        {list.map((item) => {
          const age = inboxAge(item.done?.at ?? item.at, now),
            kind = item.done ? "done" : inboxKind(item.kind),
            kindLabel =
              inboxKind(item.kind) === "pick"
                ? "Variant"
                : `${inboxKind(item.kind)[0].toUpperCase()}${inboxKind(item.kind).slice(1)}`;
          return (
            <div
              className="ui-ibl__wrap"
              data-gone={collapsingId === item.id || undefined}
              aria-hidden={collapsingId === item.id}
              inert={collapsingId === item.id}
              key={item.id}
            >
              <button
                type="button"
                role="option"
                data-inbox-row={item.id}
                aria-selected={active === item.id}
                aria-label={`${item.done ? "Answered" : kindLabel}: ${item.question}. ${item.task}, ${age.long}${item.unread && !item.done ? ", unread" : ""}`}
                title={item.question}
                tabIndex={focusId === item.id ? 0 : -1}
                disabled={disabled}
                className="ui-ibl__row"
                data-sending={sendingId === item.id || undefined}
                onClick={() => choose(item)}
                onKeyDown={(event) => rowKey(event, list.indexOf(item))}
              >
                <span className="ui-ibl__glyph" data-kind={kind}>
                  <InboxGlyph kind={kind} />
                </span>
                <span className="ui-ibl__text">
                  <span className="ui-ibl__question" dir="auto">
                    {item.question}
                  </span>
                  <span className="ui-ibl__meta">
                    <span title={item.task} dir="auto">
                      {item.task}
                    </span>
                    <i>·</i>
                    <span>{age.short}</span>
                  </span>
                </span>
                <span className="ui-ibl__dot" data-on={(item.unread && !item.done) || undefined} aria-hidden="true" />
              </button>
            </div>
          );
        })}
        {!list.length && (
          <p className="ui-ibl__empty">
            {tab === "done"
              ? (labels.emptyDone ?? "No answered items yet")
              : (labels.emptyOpen ?? "Nothing waiting on you")}
          </p>
        )}
      </div>
    </section>
  );
}

export type InboxOptionsProps = {
  options: InboxOption[];
  variant?: "options" | "variants";
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  onConfirm?: (id: string) => void;
  label?: string;
  recommendedLabel?: string;
  disabled?: boolean;
  className?: string;
};

/** Decision radio cards with expanding tradeoffs, or a fixed row of visual variants. */
export function InboxOptions({
  options: rawOptions,
  variant: rawVariant = "options",
  value: valueProp,
  defaultValue,
  onValueChange,
  onConfirm,
  label = "Choose an option",
  recommendedLabel = "Recommended",
  disabled = false,
  className,
}: InboxOptionsProps) {
  const options = (Array.isArray(rawOptions) ? rawOptions : []).filter(Boolean);
  const variant = rawVariant === "variants" ? "variants" : "options";
  const [value, setValue] = useControllable(
    valueProp,
    defaultValue ?? options.find((option) => option.recommended)?.id ?? "",
    onValueChange,
  );
  const root = useRef<HTMLDivElement>(null),
    id = useId();
  const choose = (index: number, focus = false) => {
    const option = options[index];
    if (!option || disabled) return;
    setValue(option.id);
    if (focus)
      root.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[index]?.focus({ preventScroll: true });
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled) return;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % options.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + options.length) % options.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? options.length - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      event.stopPropagation();
      choose(next, true);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      choose(index);
      onConfirm?.(options[index].id);
    }
  };
  const focused = options.some((option) => option.id === value) ? value : options[0]?.id;
  return (
    <div
      ref={root}
      className={["ui-ibo", className].filter(Boolean).join(" ")}
      data-variant={variant}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={{ "--ui-ibo-count": Math.max(1, Math.min(4, options.length)) } as CSSProperties}
    >
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      {options.map((option, index) => {
        const selected = value === option.id;
        return (
          <button
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${index + 1}. ${option.title}${option.recommended ? `, ${recommendedLabel}` : ""}`}
            aria-describedby={
              variant === "options" ? `${id}-summary-${index}${selected ? ` ${id}-more-${index}` : ""}` : undefined
            }
            aria-keyshortcuts={String(index + 1)}
            tabIndex={focused === option.id ? 0 : -1}
            disabled={disabled}
            data-inbox-option={option.id}
            className="ui-ibo__option"
            key={option.id}
            onClick={() => choose(index)}
            onKeyDown={(event) => key(event, index)}
          >
            {variant === "variants" && (
              <span
                className="ui-ibo__preview"
                onErrorCapture={(event) => {
                  if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                }}
              >
                {option.preview ??
                  (typeof option.wireframe === "object" ? (
                    option.wireframe
                  ) : (
                    <InboxWireframe
                      kind={
                        typeof option.wireframe === "string"
                          ? option.wireframe
                          : index === 0
                            ? "illustration"
                            : index === 1
                              ? "checklist"
                              : "data"
                      }
                    />
                  ))}
              </span>
            )}
            <span className="ui-ibo__number">{index + 1}</span>
            <span className="ui-ibo__body">
              <span className="ui-ibo__head">
                <strong title={option.title} dir="auto">
                  {option.title}
                </strong>
                {option.recommended && <span className="ui-ibo__recommended">{recommendedLabel}</span>}
              </span>
              {variant === "options" && (
                <>
                  <span className="ui-ibo__summary" id={`${id}-summary-${index}`} title={option.summary} dir="auto">
                    {option.summary}
                  </span>
                  <span
                    className="ui-ibo__more"
                    data-open={selected || undefined}
                    aria-hidden={!selected}
                    id={`${id}-more-${index}`}
                  >
                    <span className="ui-ibo__clip">
                      {option.pros?.map((line, lineIndex) => (
                        <span className="ui-ibo__line" key={`pro-${lineIndex}`}>
                          <b aria-hidden="true">+</b>
                          <span className="ui-ibo__sr">Pro: </span>
                          <span dir="auto">{line}</span>
                        </span>
                      ))}
                      {option.cons?.map((line, lineIndex) => (
                        <span className="ui-ibo__line" key={`con-${lineIndex}`}>
                          <b aria-hidden="true">–</b>
                          <span className="ui-ibo__sr">Con: </span>
                          <span dir="auto">{line}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type InboxWireframeProps = { kind?: string; className?: string };
/** Code-native empty-state thumbnails; callers may supply their own preview nodes instead. */
export function InboxWireframe({ kind = "illustration", className }: InboxWireframeProps) {
  const preview = kind === "sample" ? "data" : kind;
  return (
    <svg className={["ui-ibo__wire", className].filter(Boolean).join(" ")} viewBox="0 0 120 80" aria-hidden="true">
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      {preview === "checklist" ? (
        <>
          <rect fill="var(--ui-ibo-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="12" y="12" width="44" height="5" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="12" y="22" width="96" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="12" y="22" width="32" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="12" y="34" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="26" y="36" width="54" height="4" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="12" y="48" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="26" y="50" width="46" height="4" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="12" y="62" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="26" y="64" width="38" height="4" rx="2"></rect>
        </>
      ) : preview === "data" ? (
        <>
          <rect fill="var(--ui-ibo-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="14" y="46" width="10" height="22" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="30" y="36" width="10" height="32" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="46" y="50" width="10" height="18" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="62" y="28" width="10" height="40" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="78" y="40" width="10" height="28" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="94" y="22" width="10" height="46" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="34" y="12" width="52" height="12" rx="6"></rect>
        </>
      ) : preview === "bars" ? (
        <>
          <rect fill="var(--ui-ibo-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="14" y="40" width="12" height="28" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="34" y="28" width="12" height="40" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="54" y="46" width="12" height="22" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="74" y="20" width="12" height="48" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="94" y="34" width="12" height="34" rx="2"></rect>
        </>
      ) : preview === "line" ? (
        <>
          <rect fill="var(--ui-ibo-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="12" y="54" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="34" y="44" width="26" height="3" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="58" y="48" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="80" y="26" width="28" height="3" rx="2"></rect>
        </>
      ) : (
        <>
          <rect fill="var(--ui-ibo-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="48" y="16" width="24" height="20" rx="5"></rect>
          <rect fill="var(--ui-ibo-wire-mid)" x="34" y="44" width="52" height="4" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-soft)" x="42" y="52" width="36" height="3" rx="2"></rect>
          <rect fill="var(--ui-ibo-wire-ink)" x="50" y="61" width="20" height="7" rx="3"></rect>
        </>
      )}
    </svg>
  );
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
      <style href="ui-inbox" precedence="default">
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
      <style href="ui-inbox" precedence="default">
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

export type InboxItemLabels = {
  send?: string;
  later?: string;
  approve?: string;
  decline?: string;
  reopen?: string;
  recommended?: string;
  reply?: string;
  answer?: string;
  sent?: string;
  approval?: string;
  done?: string;
  since?: string;
};
export type InboxItemViewProps = {
  item: InboxItem;
  draft?: InboxDraft;
  defaultDraft?: InboxDraft;
  onDraftChange?: (draft: InboxDraft) => void;
  onSubmit?: (answer: InboxAnswer) => void;
  onLater?: () => void;
  onReopen?: () => void;
  onOpenArtifact?: (name: string) => void;
  phase?: "answer" | "sent";
  sentAnswer?: InboxAnswer;
  focusRequest?: number;
  shortcuts?: boolean;
  labels?: InboxItemLabels;
  now?: number;
  className?: string;
};

/** One question, including its decision, visual pick, approval or answer and its resolved history. */
export function InboxItemView({
  item,
  draft: draftProp,
  defaultDraft,
  onDraftChange,
  onSubmit,
  onLater,
  onReopen,
  onOpenArtifact,
  phase = "answer",
  sentAnswer,
  focusRequest,
  shortcuts = true,
  labels = {},
  now = Date.now(),
  className,
}: InboxItemViewProps) {
  const options = (Array.isArray(item.options) ? item.options : []).filter(Boolean),
    kind = inboxKind(item.kind);
  const [draft, setDraft] = useControllable<InboxDraft>(
    draftProp,
    defaultDraft ?? { option: options.find((option) => option.recommended)?.id, text: "" },
    onDraftChange,
  );
  const root = useRef<HTMLElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    field = useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    previous = useRef(item.id),
    draftRef = useRef(draft);
  draftRef.current = draft;
  const choice = options.some((option) => option.id === draft.option) ? draft.option : undefined,
    text = draft.text ?? "",
    busy = phase === "sent";
  useEffect(() => {
    if (previous.current === item.id) return;
    previous.current = item.id;
    if (draftProp === undefined) setDraft({ option: options.find((option) => option.recommended)?.id, text: "" });
  }, [item.id]);
  useLayoutEffect(() => {
    if (focusRequest) heading.current?.focus({ preventScroll: true });
  }, [focusRequest]);
  const change = (next: InboxDraft) => {
    draftRef.current = next;
    setDraft(next);
  };
  const submit = (optionId?: string) => {
    if (busy || item.done) return;
    const draft = draftRef.current,
      words = draft.text?.trim() ?? "",
      option = optionId ?? (options.some((option) => option.id === draft.option) ? draft.option : undefined);
    if (kind !== "approval" && !words && !option) return;
    const answer: InboxAnswer =
      kind === "approval" && !words
        ? "approve"
        : option
          ? words
            ? { option, text: words }
            : { option }
          : { text: words };
    onSubmit?.(answer);
  };
  const blurField = () => {
    field.current?.blur();
    heading.current?.focus({ preventScroll: true });
  };
  const keyboard = useRef({ item, kind, options, busy, submit, onLater, change, blurField });
  keyboard.current = { item, kind, options, busy, submit, onLater, change, blurField };
  useEffect(() => {
    if (!shortcuts) return;
    const key = (event: globalThis.KeyboardEvent) => {
      const state = keyboard.current;
      if (
        state.item.done ||
        state.busy ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditing(event.target) ||
        (event.target as HTMLElement)?.closest('[role="menu"],[role="dialog"]')
      )
        return;
      const area = root.current?.closest("[data-inbox-scope]") ?? root.current;
      if (document.activeElement === document.body) {
        if (document.querySelector("[data-inbox-view]") !== root.current) return;
      } else if (!area?.contains(document.activeElement)) return;
      if (root.current?.closest("[inert]")) return;
      const value = event.key.toLowerCase();
      if (/^[1-9]$/.test(value) && (state.kind === "decision" || state.kind === "pick")) {
        const option = state.options[Number(value) - 1];
        if (option) {
          event.preventDefault();
          state.change({ ...draftRef.current, option: option.id });
          const target = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-inbox-option]") ?? [])].find(
            (el) => el.dataset.inboxOption === option.id,
          );
          target?.focus({ preventScroll: true });
        }
      } else if (value === "l") {
        event.preventDefault();
        state.onLater?.();
      } else if (value === "r" || value === "/") {
        event.preventDefault();
        field.current?.focus();
      } else if (
        event.key === "Enter" &&
        (!(event.target as HTMLElement).closest("button") || (event.target as HTMLElement).closest("[data-inbox-row]"))
      ) {
        event.preventDefault();
        state.submit();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [shortcuts]);
  const fieldKey = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      blurField();
    } else if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      submit();
    }
  };
  const answer = item.done?.answer,
    savedOption = typeof answer === "object" ? options.find((option) => option.id === answer.option) : undefined;
  const canSubmit = kind === "approval" || !!choice || !!text.trim();
  return (
    <section
      ref={root}
      data-inbox-view=""
      className={["ui-ibv", className].filter(Boolean).join(" ")}
      data-phase={busy ? "sent" : item.done ? "done" : "answer"}
    >
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      <p className="ui-ibv__meta">
        <span data-kind={item.done ? "done" : kind}>
          <InboxGlyph kind={item.done ? "done" : kind} />
        </span>
        {kind === "approval" && !item.done && <span className="ui-ibv__badge">{labels.approval ?? "Approval"}</span>}
        <span title={item.task} dir="auto">
          {item.task}
        </span>
        <i>·</i>
        <span>{item.done ? (labels.done ?? "Done") : inboxAge(item.at, now).long}</span>
      </p>
      <h2 ref={heading} className="ui-ibv__question" tabIndex={-1} dir="auto">
        {item.question}
      </h2>
      {!busy && item.context && (
        <p className="ui-ibv__context" dir="auto">
          {item.context}
        </p>
      )}
      {busy ? (
        <div className="ui-ibv__answer">
          <InboxConfirmation
            answer={inboxAnswerLabel(item, sentAnswer ?? (kind === "approval" ? "approve" : {}))}
            message={labels.sent}
          />
        </div>
      ) : item.done ? (
        <div className="ui-ibv__done">
          <div className="ui-ibv__chosen">
            <div className="ui-ibv__chosen-row">
              <Icon name={answer === "decline" ? "close" : "check"} size={14} />
              <strong dir="auto" title={item.done.label ?? inboxAnswerLabel(item, item.done.answer)}>
                {item.done.label ?? inboxAnswerLabel(item, item.done.answer)}
              </strong>
              <span>{inboxAge(item.done.at, now).long}</span>
            </div>
            {(savedOption ||
              (typeof answer === "object" && answer.text) ||
              (kind === "approval" && item.facts?.length)) && (
              <div className="ui-ibv__chosen-body">
                {savedOption && kind === "pick" && (
                  <span
                    className="ui-ibv__chosen-thumb"
                    onErrorCapture={(event) => {
                      if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                    }}
                  >
                    {savedOption.preview ??
                      (typeof savedOption.wireframe === "object" ? (
                        savedOption.wireframe
                      ) : (
                        <InboxWireframe
                          kind={typeof savedOption.wireframe === "string" ? savedOption.wireframe : savedOption.id}
                        />
                      ))}
                  </span>
                )}
                <div className="ui-ibv__chosen-lines">
                  {savedOption?.summary && <span className="ui-ibv__chosen-summary">{savedOption.summary}</span>}
                  {savedOption?.pros?.map((line, index) => (
                    <span className="ui-ibv__pro" key={index}>
                      <b>+</b>
                      <span dir="auto">{line}</span>
                    </span>
                  ))}
                  {kind === "approval" &&
                    item.facts?.map((fact) => (
                      <span className="ui-ibv__chosen-fact" key={fact.label}>
                        <span>{fact.label}</span>
                        <span dir="auto" title={fact.value}>
                          {fact.value}
                        </span>
                      </span>
                    ))}
                  {typeof answer === "object" && answer.text && (
                    <span className="ui-ibv__words" dir="auto">
                      “{answer.text}”
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          {!!item.done.history?.length && (
            <section className="ui-ibv__since">
              <h3>{labels.since ?? "Since then"}</h3>
              <ul>
                {item.done.history.map((line, index) => (
                  <li key={index} dir="auto">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!!item.done.artifacts?.length && (
            <div className="ui-ibv__files">
              {item.done.artifacts.map((name) => (
                <button type="button" key={name} onClick={() => onOpenArtifact?.(name)}>
                  <Icon
                    name={
                      name.endsWith(".csv")
                        ? "table"
                        : /\.(png|jpg|webp|svg)$/i.test(name)
                          ? "image"
                          : name.includes(".")
                            ? "document"
                            : "folder"
                    }
                    size={12}
                  />
                  {name}
                </button>
              ))}
            </div>
          )}
          <div className="ui-ibv__done-actions">
            <button type="button" className="ui-ibv__button" onClick={onReopen}>
              <Icon name="undo" size={13} />
              {labels.reopen ?? "Reopen"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="ui-ibv__answer">
            {kind === "decision" || kind === "pick" ? (
              <InboxOptions
                options={options}
                variant={kind === "pick" ? "variants" : "options"}
                value={choice ?? ""}
                onValueChange={(option) => change({ ...draftRef.current, option })}
                onConfirm={submit}
                label={item.question}
                recommendedLabel={labels.recommended}
              />
            ) : kind === "approval" ? (
              <dl className="ui-ibv__facts">
                {item.facts?.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd dir="auto" title={fact.value}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="ui-ibv__free">
                <textarea
                  ref={field as RefObject<HTMLTextAreaElement | null>}
                  className="ui-ibv__reply ui-ibv__area"
                  aria-label="Your answer"
                  placeholder={labels.answer ?? "Write your answer…"}
                  value={text}
                  onChange={(event) => change({ ...draftRef.current, text: event.target.value })}
                  onKeyDown={fieldKey}
                />
                {!!item.suggestions?.length && (
                  <div className="ui-ibv__chips">
                    {item.suggestions.map((suggestion) => (
                      <button
                        type="button"
                        aria-pressed={text === suggestion}
                        key={suggestion}
                        title={suggestion}
                        onClick={() => {
                          change({ ...draftRef.current, text: suggestion });
                          field.current?.focus();
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="ui-ibv__footer">
            {kind !== "question" && (
              <input
                ref={field as RefObject<HTMLInputElement | null>}
                className="ui-ibv__reply"
                aria-label="Tell it something else"
                placeholder={labels.reply ?? "Or tell it something else…"}
                value={text}
                onChange={(event) => change({ ...draftRef.current, text: event.target.value })}
                onKeyDown={fieldKey}
              />
            )}
            <div className="ui-ibv__actions">
              <button type="button" className="ui-ibv__button ui-ibv__later" aria-keyshortcuts="L" onClick={onLater}>
                {labels.later ?? "Later"}
                <kbd>L</kbd>
              </button>
              {kind === "approval" && (
                <button type="button" className="ui-ibv__button" onClick={() => onSubmit?.("decline")}>
                  {labels.decline ?? "Decline"}
                </button>
              )}
              <button
                type="button"
                className="ui-ibv__button ui-ibv__send"
                disabled={!canSubmit}
                aria-keyshortcuts="Enter"
                onClick={() => submit()}
              >
                {kind === "approval" && !text.trim() ? (labels.approve ?? "Approve") : (labels.send ?? "Send")}
                <kbd>↵</kbd>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export type InboxTaskContextLabels = {
  status?: string;
  project?: string;
  started?: string;
  steps?: string;
  artifacts?: string;
  decided?: string;
  needs?: string;
  waiting?: string;
  working?: string;
};
export type InboxTaskContextProps = {
  name?: string;
  task?: InboxTask;
  items?: InboxItem[];
  activeId?: string | null;
  onOpenItem?: (id: string) => void;
  onOpenArtifact?: (name: string) => void;
  labels?: InboxTaskContextLabels;
  now?: number;
  className?: string;
};

/** The task behind a question, with its steps, files and previously answered questions. */
export function InboxTaskContext({
  name,
  task,
  items = [],
  activeId,
  onOpenItem,
  onOpenArtifact,
  labels = {},
  now = Date.now(),
  className,
}: InboxTaskContextProps) {
  const waiting = items.some((item) => item.task === name && !item.done),
    steps = task?.steps ?? [],
    complete = steps.filter((step) => step.done).length,
    first = steps.findIndex((step) => !step.done),
    decided = items.filter((item) => item.task === name && item.done && item.id !== activeId);
  return (
    <section
      className={["ui-ibx", className].filter(Boolean).join(" ")}
      aria-label={name ? `${name}, task context` : "Task context"}
    >
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      {name && task ? (
        <>
          {task.goal && (
            <p className="ui-ibx__goal" dir="auto">
              {task.goal}
            </p>
          )}
          <dl className="ui-ibx__properties">
            <div>
              <dt>{labels.status ?? "Status"}</dt>
              <dd>
                <svg className="ui-ibx__ring" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle
                    cx="8"
                    cy="8"
                    r="3"
                    pathLength="1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${steps.length ? complete / steps.length : 0} 1`}
                    transform="rotate(-90 8 8)"
                  />
                </svg>
                <span>
                  {waiting ? (labels.waiting ?? "Waiting on you") : (task.status ?? labels.working ?? "Running")}
                </span>
                {!!steps.length && (
                  <span className="ui-ibx__count">
                    {complete}/{steps.length}
                  </span>
                )}
              </dd>
            </div>
            {task.project && (
              <div>
                <dt>{labels.project ?? "Project"}</dt>
                <dd dir="auto">{task.project}</dd>
              </div>
            )}
            {task.started && (
              <div>
                <dt>{labels.started ?? "Started"}</dt>
                <dd>{task.started}</dd>
              </div>
            )}
          </dl>
          {!!steps.length && (
            <section className="ui-ibx__section">
              <h3>{labels.steps ?? "Steps"}</h3>
              <ol className="ui-ibx__steps">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    data-done={step.done || undefined}
                    data-current={index === first || undefined}
                    data-waiting={(index === first && waiting) || undefined}
                  >
                    <span className="ui-ibx__step-mark">{step.done && <Icon name="check" size={10} />}</span>
                    <span dir="auto">{step.label}</span>
                    {index === first && waiting && <span className="ui-ibx__needs">{labels.needs ?? "Needs you"}</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {!!task.artifacts?.length && (
            <section className="ui-ibx__section">
              <h3>
                {labels.artifacts ?? "Artifacts"}
                <span>{task.artifacts.length}</span>
              </h3>
              <div className="ui-ibx__files">
                {task.artifacts.map((file) => (
                  <button type="button" key={file} title={file} onClick={() => onOpenArtifact?.(file)}>
                    <span
                      data-kind={
                        file.endsWith(".csv")
                          ? "table"
                          : file.endsWith(".json")
                            ? "code"
                            : file.includes(".")
                              ? "document"
                              : "folder"
                      }
                    >
                      <Icon
                        name={
                          file.endsWith(".csv")
                            ? "table"
                            : file.endsWith(".json")
                              ? "document"
                              : file.includes(".")
                                ? "document"
                                : "folder"
                        }
                        size={12}
                      />
                    </span>
                    <span dir="auto">{file}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {!!decided.length && (
            <section className="ui-ibx__section">
              <h3>{labels.decided ?? "Decided"}</h3>
              <div className="ui-ibx__decided">
                {decided.map((item) => (
                  <button type="button" key={item.id} onClick={() => onOpenItem?.(item.id)}>
                    <InboxGlyph kind="done" size={14} />
                    <span>
                      <span dir="auto" title={item.question}>
                        {item.question}
                      </span>
                      <span dir="auto" title={item.done!.label ?? inboxAnswerLabel(item, item.done!.answer)}>
                        {item.done!.label ?? inboxAnswerLabel(item, item.done!.answer)} ·{" "}
                        {inboxAge(item.done!.at, now).long}
                      </span>
                    </span>
                    <Icon name="chevron" size={12} />
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      ) : null}
    </section>
  );
}

export function createDefaultInboxItems(now = Date.now()): InboxItem[] {
  return [
    {
      id: "queue",
      kind: "decision",
      task: "Ingest pipeline",
      at: now - 4 * 60000,
      question: "Which queue should the ingest service use?",
      context:
        "Events arrive in bursts of up to 20k a minute. The service needs retries, and a way to replay a day of events after a bad deploy.",
      options: [
        {
          id: "kafka",
          title: "Kafka",
          summary: "A durable log – replay is built in",
          recommended: true,
          pros: ["Replays any day after a bad deploy", "Takes the bursts with room to spare"],
          cons: ["One more cluster to run", "Overkill below a thousand events a minute"],
        },
        {
          id: "sqs",
          title: "SQS",
          summary: "Managed, nothing to operate",
          pros: ["No servers, pay per message", "Retries and dead letters built in"],
          cons: ["No replay – a message is gone once read", "Ordering only in FIFO queues"],
        },
        {
          id: "pg",
          title: "Postgres queue",
          summary: "Use the database you already have",
          pros: ["Nothing new to deploy", "Jobs and data in one transaction"],
          cons: ["Won't keep up with the bursts", "Replay means writing it yourself"],
        },
      ],
    },
    {
      id: "empty-state",
      kind: "pick",
      task: "Client dashboard",
      at: now - 18 * 60000,
      unread: true,
      question: "Which empty state for the dashboard?",
      context: "New accounts land on an empty dashboard until their first sync finishes, about ten minutes.",
      options: [
        { id: "illustration", title: "Illustration", wireframe: "illustration" },
        { id: "checklist", title: "Setup checklist", wireframe: "checklist" },
        { id: "sample", title: "Sample data", wireframe: "data" },
      ],
    },
    {
      id: "weekly",
      kind: "approval",
      task: "Weekly update",
      at: now - 42 * 60000,
      unread: true,
      question: "Send the weekly update to Northwind?",
      context: "Drafted from this week's merged work and the two open questions. It goes out from your address.",
      facts: [
        { label: "To", value: "Dana Reyes, Northwind" },
        { label: "Subject", value: "Week 45: ingest is live, dashboard in review" },
        { label: "Body", value: "Ingest runs on staging and took Tuesday's spike without losing an event…" },
      ],
    },
    {
      id: "tone",
      kind: "question",
      task: "Launch post",
      at: now - 3600000,
      question: "What tone should the launch post have?",
      context: "The post announces the client portal on Thursday. The draft is ready apart from its voice.",
      suggestions: ["Calm and factual", "Warm, a little playful", "Short, for developers"],
    },
    {
      id: "api",
      kind: "decision",
      task: "API migration",
      at: now - 3 * 3600000,
      question: "Keep the old API until March or drop it now?",
      context: "Two clients still call v1, about 4% of traffic. Keeping it means every fix lands twice.",
      options: [
        {
          id: "keep",
          title: "Keep it until March",
          summary: "Clients move at their own pace",
          pros: ["No rushed migrations for the two clients", "Time to ship a migration guide"],
          cons: ["Every fix lands in two versions", "Three more months of v1 tests"],
        },
        {
          id: "drop",
          title: "Drop it now",
          summary: "One codebase from next week",
          pros: ["Half the surface to maintain", "The new auth applies everywhere"],
          cons: ["Two clients have to move this week"],
        },
      ],
    },
    {
      id: "model",
      kind: "decision",
      task: "Support triage",
      at: now - 86400000,
      question: "Which model should summarise support tickets?",
      options: [
        {
          id: "small",
          title: "The small model",
          summary: "With a weekly eval",
          pros: ["A tenth of the cost per ticket", "Fast enough to run on every ticket"],
        },
        { id: "large", title: "The large model", summary: "Better on long threads" },
      ],
      done: {
        answer: { option: "small" },
        at: now - 86400000,
        history: ["Runs on 2 of 5 support queues", "First weekly eval: 94% match a human summary"],
        artifacts: ["triage-eval.csv"],
      },
    },
    {
      id: "auth",
      kind: "approval",
      task: "Auth refactor",
      at: now - 86400000,
      question: "Merge the auth refactor before the demo?",
      facts: [
        { label: "Branch", value: "auth-refactor → main" },
        { label: "Change", value: "41 files, all checks green" },
      ],
      done: {
        answer: "approve",
        at: now - 86400000,
        history: ["Merged into main", "Deployed to staging before the demo"],
        artifacts: ["auth-refactor.md"],
      },
    },
    {
      id: "chart",
      kind: "pick",
      task: "Client dashboard",
      at: now - 2 * 86400000,
      question: "Which chart for the usage page?",
      options: [
        { id: "bars", title: "Bars", summary: "One bar per day, easy to compare", wireframe: "bars" },
        { id: "line", title: "Line", wireframe: "line" },
      ],
      done: {
        answer: { option: "bars" },
        at: now - 2 * 86400000,
        history: ["Usage page shipped with daily bars", "Northwind's team opened it 31 times this week"],
        artifacts: ["usage-page.png", "screens"],
      },
    },
  ];
}

export const defaultInboxTasks: Record<string, InboxTask> = {
  "Ingest pipeline": {
    goal: "Take in Northwind's order events and keep a day of them to replay after a bad deploy.",
    project: "Northwind",
    started: "Mon, Nov 3",
    steps: [
      {
        label: "Draft the event schema",
        done: true,
      },
      {
        label: "Load test at 20k a minute",
        done: true,
      },
      {
        label: "Pick a queue",
      },
      {
        label: "Deploy to staging",
      },
    ],
    artifacts: ["ingest-design.md", "load-test-results.csv", "event-schema.json", "staging"],
  },
  "Client dashboard": {
    goal: "A usage dashboard Northwind's team opens every morning.",
    project: "Northwind",
    started: "Tue, Oct 28",
    steps: [
      {
        label: "Usage page",
        done: true,
      },
      {
        label: "Empty state",
      },
      {
        label: "Alerts page",
      },
    ],
    artifacts: ["dashboard-spec.md", "usage-sample.csv", "screens"],
  },
  "Weekly update": {
    goal: "Tell Northwind what shipped this week and what needs their answer.",
    project: "Northwind",
    started: "Today",
    steps: [
      {
        label: "Collect merged work",
        done: true,
      },
      {
        label: "Draft the email",
        done: true,
      },
      {
        label: "Send it",
      },
    ],
    artifacts: ["weekly-update-week-45.md"],
  },
  "Onboarding emails": {
    goal: "Three short emails that walk a new Northwind account to its first sync.",
    project: "Northwind",
    started: "Thu, Nov 5",
    steps: [
      {
        label: "Outline the three emails",
        done: true,
      },
      {
        label: "Write the drafts",
      },
      {
        label: "Test with two accounts",
      },
    ],
    artifacts: ["onboarding-outline.md"],
  },
  "Billing webhooks": {
    goal: "Retry failed billing webhooks and tell the client when one gives up.",
    project: "Platform",
    started: "Wed, Nov 4",
    steps: [
      {
        label: "Retry with backoff",
        done: true,
      },
      {
        label: "Dead letter and alert",
        done: true,
      },
      {
        label: "Tests",
        done: true,
      },
      {
        label: "Deploy to staging",
      },
    ],
    artifacts: ["webhooks-plan.md", "deploy.yaml"],
  },
  "API migration": {
    goal: "Move every client from the v1 API to v2 without breaking a running integration.",
    project: "Platform",
    started: "Mon, Oct 20",
    steps: [
      {
        label: "Ship v2",
        done: true,
      },
      {
        label: "Move our own apps",
        done: true,
      },
      {
        label: "Decide on the v1 end date",
      },
      {
        label: "Write to the clients",
      },
    ],
    artifacts: ["migration-plan.md", "v1-traffic.csv"],
  },
  "Support triage": {
    goal: "Sort and summarise incoming support tickets before anyone reads them.",
    project: "Platform",
    started: "Thu, Oct 30",
    steps: [
      {
        label: "Pick a model",
        done: true,
      },
      {
        label: "Weekly eval",
        done: true,
      },
      {
        label: "Roll out to all queues",
      },
    ],
    artifacts: ["triage-eval.csv", "prompts"],
  },
  "Launch post": {
    goal: "Announce the open-source release of the eval kit.",
    project: "Evalkit",
    started: "Wed, Nov 5",
    steps: [
      {
        label: "Outline",
        done: true,
      },
      {
        label: "Pick the tone",
      },
      {
        label: "First draft",
      },
      {
        label: "Schedule",
      },
    ],
    artifacts: ["launch-outline.md", "benchmarks.csv"],
  },
  "Benchmark suite": {
    goal: "Run the kit against five open models so the launch post has real numbers.",
    project: "Evalkit",
    started: "Tue, Nov 4",
    steps: [
      {
        label: "Pick the models",
        done: true,
      },
      {
        label: "Prepare the datasets",
        done: true,
      },
      {
        label: "Run the evals",
        done: true,
      },
      {
        label: "Check the outliers",
      },
      {
        label: "Write up",
      },
    ],
    artifacts: ["benchmarks.csv"],
  },
  "Usage page": {
    goal: "Show Northwind their daily usage, one bar per day.",
    project: "Northwind",
    started: "Tue, Oct 28",
    steps: [
      {
        label: "Query",
        done: true,
      },
      {
        label: "Chart",
        done: true,
      },
      {
        label: "Ship",
        done: true,
      },
    ],
    artifacts: ["usage-page.png"],
  },
  "Auth refactor": {
    goal: "One sign-in flow for web and mobile before the demo.",
    project: "Platform",
    started: "Fri, Oct 24",
    steps: [
      {
        label: "Refactor",
        done: true,
      },
      {
        label: "Merge",
        done: true,
      },
    ],
    artifacts: ["auth-refactor.md"],
  },
  "Rate limits": {
    goal: "Per-client rate limits on the public API.",
    project: "Platform",
    started: "Thu, Oct 29",
    steps: [
      {
        label: "Limits per plan",
        done: true,
      },
      {
        label: "Headers and docs",
        done: true,
      },
    ],
    artifacts: ["rate-limits.md"],
  },
  "Docs site": {
    goal: "A docs site for the eval kit, ready before the launch.",
    project: "Evalkit",
    started: "Mon, Nov 2",
    steps: [
      {
        label: "Structure",
        done: true,
      },
      {
        label: "Guides",
        done: true,
      },
      {
        label: "Publish",
        done: true,
      },
    ],
    artifacts: ["docs-outline.md"],
  },
};
export const defaultInboxFiles: ArtifactFile[] = [
  {
    kind: "document",
    name: "ingest-design.md",
    updated: "Just now",
    content:
      "# Ingest pipeline\n\nTake in Northwind’s order events and keep a day of them to replay after a bad deploy.\n\n## Event format\n\nJSON with a version field. The load test passed at 20k events per minute, p95 under 100 ms.\n\n## Staging rollout\n\n1. Pick a queue\n2. Deploy to staging\n3. Run the smoke test\n4. Review the canary metrics",
  },
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
    kind: "code",
    name: "event-schema.json",
    language: "JSON",
    updated: "Ingest pipeline",
    content:
      '{\n  "version": 1,\n  "event": "order.created",\n  "order_id": "nw_0142",\n  "occurred_at": "2026-11-08T12:04:00Z",\n  "payload": {\n    "total": 149,\n    "currency": "USD"\n  }\n}',
  },
  {
    kind: "folder",
    name: "staging",
    updated: "Ingest pipeline · 4 items",
    entries: [
      {
        name: "canary-metrics.csv",
        size: "9 KB",
        bytes: 9000,
        modified: "12:04",
        kind: "table",
      },
      {
        name: "deploy.yaml",
        size: "1.3 KB",
        bytes: 1300,
        modified: "13:00",
        kind: "code",
      },
      {
        name: "rollout-plan.md",
        size: "4.1 KB",
        bytes: 4100,
        modified: "Nov 6",
        kind: "document",
      },
      {
        name: "smoke-test.md",
        size: "2.9 KB",
        bytes: 2900,
        modified: "12:53",
        kind: "document",
      },
    ],
  },
  {
    kind: "document",
    name: "dashboard-spec.md",
    updated: "Just now",
    content:
      "# dashboard spec\n\nA usage dashboard Northwind's team opens every morning.\n\n## Progress\n\n- Drew three empty states for you to pick from\n- Usage page shipped with daily bars\n- Northwind opened it 31 times this week",
  },
  {
    kind: "table",
    name: "usage-sample.csv",
    updated: "Just now",
    rows: [
      ["Time", "Events", "p95 (ms)"],
      ["12:00", "18000", "86"],
      ["12:10", "20000", "96"],
      ["12:20", "19500", "89"],
    ],
  },
  {
    kind: "image",
    name: "usage-page.png",
    alt: "Northwind daily usage bar chart",
    updated: "Client dashboard",
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22720%22%20height%3D%22440%22%20viewBox%3D%220%200%20720%20440%22%3E%3Crect%20width%3D%22720%22%20height%3D%22440%22%20rx%3D%2216%22%20fill%3D%22%23fff%22%2F%3E%3Ctext%20x%3D%2236%22%20y%3D%2248%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22%23171717%22%3ENorthwind%20%C2%B7%20Daily%20usage%3C%2Ftext%3E%3Ctext%20x%3D%2236%22%20y%3D%2276%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20fill%3D%22%238f8f8f%22%3EEvents%20processed%20this%20week%3C%2Ftext%3E%3Cpath%20d%3D%22M52%20120H684M52%20190H684M52%20260H684M52%20330H684%22%20stroke%3D%22%23eee%22%2F%3E%3Cg%20fill%3D%22%230190fe%22%3E%3Crect%20x%3D%2276%22%20y%3D%22240%22%20width%3D%2246%22%20height%3D%22120%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22160%22%20y%3D%22200%22%20width%3D%2246%22%20height%3D%22160%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22244%22%20y%3D%22225%22%20width%3D%2246%22%20height%3D%22135%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22328%22%20y%3D%22140%22%20width%3D%2246%22%20height%3D%22220%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22412%22%20y%3D%22175%22%20width%3D%2246%22%20height%3D%22185%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22496%22%20y%3D%22105%22%20width%3D%2246%22%20height%3D%22255%22%20rx%3D%226%22%2F%3E%3Crect%20x%3D%22580%22%20y%3D%22165%22%20width%3D%2246%22%20height%3D%22195%22%20rx%3D%226%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23999%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%3E%3Ctext%20x%3D%2286%22%20y%3D%22388%22%3EMon%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22388%22%3ETue%3C%2Ftext%3E%3Ctext%20x%3D%22254%22%20y%3D%22388%22%3EWed%3C%2Ftext%3E%3Ctext%20x%3D%22338%22%20y%3D%22388%22%3EThu%3C%2Ftext%3E%3Ctext%20x%3D%22422%22%20y%3D%22388%22%3EFri%3C%2Ftext%3E%3Ctext%20x%3D%22506%22%20y%3D%22388%22%3ESat%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22388%22%3ESun%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E",
  },
  {
    kind: "document",
    name: "weekly-update-week-45.md",
    updated: "Just now",
    content:
      "# Weekly update · Northwind\n\nHi Dana,\n\nThe ingest load test passed, the client dashboard is ready for review, and our own apps now use API v2.\n\nWe need your answer on the queue and dashboard empty state before the next rollout.",
  },
  {
    kind: "document",
    name: "onboarding-outline.md",
    updated: "Just now",
    content:
      "# onboarding outline\n\nThree short emails that walk a new Northwind account to its first sync.\n\n## Progress\n\n- Writing the second email\n- First email drafted\n- Outline agreed in the thread",
  },
  {
    kind: "document",
    name: "webhooks-plan.md",
    updated: "Just now",
    content:
      "# webhooks plan\n\nRetry failed billing webhooks and tell the client when one gives up.\n\n## Progress\n\n- Deploying to staging\n- All 48 tests pass\n- Added a dead letter queue and an alert",
  },
  {
    kind: "code",
    name: "deploy.yaml",
    language: "YAML",
    updated: "Just now",
    content:
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: northwind-ingest\nspec:\n  replicas: 2\n  template:\n    spec:\n      containers:\n        - name: ingest\n          image: northwind/ingest:staging\n",
  },
  {
    kind: "document",
    name: "migration-plan.md",
    updated: "Just now",
    content:
      "# API migration\n\nOur applications now run on v2. Two clients still use v1, around 4% of traffic.\n\n## Next\n\nDecide the v1 end date, then write to the clients.",
  },
  {
    kind: "table",
    name: "v1-traffic.csv",
    updated: "Just now",
    rows: [
      ["Time", "Events", "p95 (ms)"],
      ["12:00", "18000", "86"],
      ["12:10", "20000", "96"],
      ["12:20", "19500", "89"],
    ],
  },
  {
    kind: "table",
    name: "triage-eval.csv",
    updated: "Just now",
    rows: [
      ["Time", "Events", "p95 (ms)"],
      ["12:00", "18000", "86"],
      ["12:10", "20000", "96"],
      ["12:20", "19500", "89"],
    ],
  },
  {
    kind: "folder",
    name: "prompts",
    updated: "Ingest pipeline · 4 items",
    entries: [
      {
        name: "summarise.md",
        size: "1.2 KB",
        bytes: 1200,
        modified: "Today",
        kind: "document",
      },
      {
        name: "classify.md",
        size: "0.8 KB",
        bytes: 800,
        modified: "Yesterday",
        kind: "document",
      },
    ],
  },
  {
    kind: "document",
    name: "launch-outline.md",
    updated: "Just now",
    content:
      "# launch outline\n\nAnnounce the open-source release of the eval kit.\n\n## Progress\n\n- Asked you which tone the post should have\n- Outline ready, with the benchmark numbers",
  },
  {
    kind: "table",
    name: "benchmarks.csv",
    updated: "Just now",
    rows: [
      ["Model", "Cases", "Accuracy", "Latency (ms)"],
      ["Atlas", "2400", "94%", "320"],
      ["Birch", "2400", "91%", "180"],
      ["Cedar", "2400", "93%", "240"],
    ],
  },
  {
    kind: "document",
    name: "auth-refactor.md",
    updated: "Just now",
    content:
      "# auth refactor\n\nOne sign-in flow for web and mobile before the demo.\n\n## Progress\n\n- Deployed to staging before the demo\n- Merged into main – 41 files, all checks green",
  },
  {
    kind: "document",
    name: "rate-limits.md",
    updated: "Just now",
    content:
      "# rate limits\n\nPer-client rate limits on the public API.\n\n## Progress\n\n- Live for every client\n- Limits per plan agreed",
  },
  {
    kind: "document",
    name: "docs-outline.md",
    updated: "Just now",
    content:
      "# docs outline\n\nA docs site for the eval kit, ready before the launch.\n\n## Progress\n\n- Published with four guides\n- Structure agreed in the thread",
  },
  {
    kind: "table",
    name: "canary-metrics.csv",
    updated: "Just now",
    rows: [
      ["Time", "Events", "p95 (ms)"],
      ["12:00", "18000", "86"],
      ["12:10", "20000", "96"],
      ["12:20", "19500", "89"],
    ],
  },
  {
    kind: "document",
    name: "rollout-plan.md",
    updated: "Just now",
    content:
      "# Staging rollout\n\nDeploy two replicas, watch the canary for 20 minutes, then run the smoke test.\n\nRollback if p95 exceeds 100 ms or the error rate rises above 0.1%.",
  },
  {
    kind: "document",
    name: "smoke-test.md",
    updated: "Just now",
    content:
      "# Smoke test\n\n- Submit a sample order event\n- Confirm it is stored\n- Replay the last hour\n- Check canary metrics",
  },
  {
    kind: "document",
    name: "summarise.md",
    updated: "Just now",
    content: "# summarise\n\nWorkspace notes\n\n## Progress\n\nReady for review.",
  },
  {
    kind: "document",
    name: "classify.md",
    updated: "Just now",
    content: "# classify\n\nWorkspace notes\n\n## Progress\n\nReady for review.",
  },
  {
    kind: "folder",
    name: "screens",
    entries: [
      {
        name: "usage-page.png",
        kind: "image",
        bytes: 48200,
      },
      {
        name: "dashboard-spec.md",
        kind: "document",
        bytes: 1800,
      },
    ],
    updated: "Today",
  },
];
export const defaultInboxOpenArtifacts: { task: string; name: string }[] = [
  { task: "Ingest pipeline", name: "ingest-design.md" },
  { task: "Ingest pipeline", name: "load-test-results.csv" },
];
export const defaultInboxSources: WorkspaceSource[] = [
  { name: "staging", description: "Ingest pipeline", artifact: "staging", kind: "folder" },
  { name: "triage-eval.csv", description: "Support triage", artifact: "triage-eval.csv", kind: "table" },
  { name: "dashboard-spec.md", description: "Client dashboard", artifact: "dashboard-spec.md", kind: "document" },
];

export type InboxLabels = InboxListLabels &
  InboxItemLabels &
  InboxTaskContextLabels & {
    caughtUp?: string;
    tasks?: string;
    running?: (count: number) => string;
    noAnswers?: string;
    noAnswersDescription?: string;
    back?: string;
    deferred?: string;
    reopened?: (count: number) => string;
  };
export type InboxScreenProps = Omit<AppShellProps, "children" | "panel" | "panelTitle" | "navigation" | "onSelect"> & {
  items?: InboxItem[];
  defaultItems?: InboxItem[];
  onItemsChange?: (items: InboxItem[]) => void;
  tab?: InboxTab;
  defaultTab?: InboxTab;
  onTabChange?: (tab: InboxTab) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string | null) => void;
  drafts?: Record<string, InboxDraft>;
  defaultDrafts?: Record<string, InboxDraft>;
  onDraftsChange?: (drafts: Record<string, InboxDraft>) => void;
  onDecide?: (id: string, answer: InboxAnswer) => void;
  onLater?: (id: string) => void;
  onReopen?: (id: string) => void;
  tasks?: Record<string, InboxTask>;
  running?: number;
  files?: ArtifactFile[];
  defaultFiles?: ArtifactFile[];
  onFilesChange?: (files: ArtifactFile[]) => void;
  onArtifactChange?: (name: string, file: ArtifactFile) => void;
  openFiles?: string[];
  defaultOpenFiles?: string[];
  defaultOpenArtifacts?: { task: string; name: string }[];
  onOpenFilesChange?: (names: string[]) => void;
  activeFile?: string;
  defaultActiveFile?: string;
  onActiveFileChange?: (name: string) => void;
  onOpenArtifact?: (task: string, name: string) => void;
  suggested?: WorkspaceSource[];
  labels?: InboxLabels;
  onOpenTool?: (tool: WorkspaceToolKind) => void;
  renderTool?: (tool: WorkspaceToolKind) => ReactNode;
  onOpenUrl?: (url: string) => void;
};

/** One question at a time, with a persistent editable work area and the task behind every answer. */
export function InboxScreen({
  items: itemsProp,
  defaultItems,
  onItemsChange,
  tab: tabProp,
  defaultTab = "open",
  onTabChange,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  onSelect,
  drafts: draftsProp,
  defaultDrafts = {},
  onDraftsChange,
  onDecide,
  onLater,
  onReopen,
  tasks = defaultInboxTasks,
  running = 3,
  files: filesProp,
  defaultFiles = defaultInboxFiles,
  onFilesChange,
  onArtifactChange,
  openFiles: openedProp,
  defaultOpenFiles,
  defaultOpenArtifacts = defaultInboxOpenArtifacts,
  onOpenFilesChange,
  activeFile: activeProp,
  defaultActiveFile = "task",
  onActiveFileChange,
  panelOpen: panelProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  onOpenArtifact,
  suggested = defaultInboxSources,
  labels = {},
  onOpenTool,
  renderTool,
  onOpenUrl,
  onNavigate,
  className,
  style,
  ...shellProps
}: InboxScreenProps) {
  const [initial] = useState(() => {
    const items = defaultItems ?? itemsProp ?? createDefaultInboxItems(),
      deep = items.find((item) => item.id === (selectedProp ?? defaultSelected)),
      tab = deep ? (deep.done ? "done" : "open") : defaultTab;
    return {
      items,
      tab,
      selected:
        defaultSelected === null
          ? null
          : (deep?.id ?? items.find((item) => !!item.done === (tab === "done"))?.id ?? null),
    };
  });
  const [items, setItems] = useControllable(itemsProp, initial.items, onItemsChange),
    [tabValue, setTab] = useControllable<InboxTab>(tabProp, initial.tab, onTabChange),
    [selected, setSelected] = useControllable<string | null>(selectedProp, initial.selected, onSelectedChange),
    [drafts, setDrafts] = useControllable(draftsProp, defaultDrafts, onDraftsChange);
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange),
    [opened, setOpened] = useControllable(
      openedProp,
      defaultOpenFiles ?? ["task", ...defaultOpenArtifacts.map((file) => file.name)],
      onOpenFilesChange,
    ),
    [active, setActive] = useControllable(activeProp, defaultActiveFile, onActiveFileChange),
    [panelOpen, setPanelOpen] = useControllable(panelProp, false, onPanelOpenChange);
  const [pending, setPending] = useState<{ item: InboxItem; answer: InboxAnswer; collapsing: boolean } | null>(null),
    [detail, setDetail] = useState(!!defaultSelected || !!selectedProp),
    [focusRequest, setFocusRequest] = useState(0),
    [notice, setNotice] = useState(""),
    [clock, setClock] = useState(() => Date.now()),
    [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [startTabs, setStartTabs] = useState<string[]>([]),
    [toolTabs, setToolTabs] = useState<{ id: string; kind: WorkspaceToolKind }[]>([]),
    [toolValues, setToolValues] = useState<Record<string, string>>({}),
    [toolLines, setToolLines] = useState<Record<string, string[]>>({});
  const root = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLDivElement>(null),
    narrow = useRef(false),
    layout = useRef<boolean | undefined>(undefined),
    sequence = useRef(0),
    timers = useRef<ReturnType<typeof setTimeout>[]>([]),
    sending = useRef(false),
    fileRef = useRef(files),
    itemsRef = useRef(items),
    selectedRef = useRef(selected),
    draftsRef = useRef(drafts),
    owners = useRef<Record<string, string>>(
      Object.fromEntries(defaultOpenArtifacts.map((file) => [file.name, file.task])),
    );
  fileRef.current = files;
  itemsRef.current = items;
  selectedRef.current = selected;
  draftsRef.current = drafts;
  const tab = tabValue === "done" ? "done" : "open",
    list = items.filter((item) => !!item.done === (tab === "done")),
    current = items.find((item) => item.id === selected && !!item.done === (tab === "done")) ?? null,
    shown = pending?.item ?? current;
  const taskName = shown?.task,
    contextTask = taskName ? tasks[taskName] : undefined;
  const showToast = (text: string) => {
    const id = ++sequence.current;
    setToast({ id, text });
    timers.current.push(setTimeout(() => setToast((value) => (value?.id === id ? null : value)), 2200));
  };
  const select = (id: string | null, focus = false) => {
    if (selectedRef.current !== id) {
      selectedRef.current = id;
      setSelected(id);
      onSelect?.(id);
    }
    if (id) setDetail(true);
    setFocusRequest((value) => (focus ? value + 1 : 0));
  };
  const choose = (id: string, focus = false) => {
    if (sending.current) return;
    const item = itemsRef.current.find((item) => item.id === id);
    if (!item) return;
    const nextTab = item.done ? "done" : "open";
    if (nextTab !== tab) setTab(nextTab);
    select(id, focus);
  };
  const changeTab = (next: InboxTab) => {
    if (sending.current) return;
    setTab(next);
    select(itemsRef.current.find((item) => !!item.done === (next === "done"))?.id ?? null);
    setDetail(false);
  };
  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (sending.current) return;
    if (
      (selected !== null && !list.some((item) => item.id === selected)) ||
      (selected === null && selectedProp !== null && list.length > 0)
    )
      select(list[0]?.id ?? null);
  }, [items, tab, selected]);
  useEffect(() => {
    if (!current?.unread || current.done || pending) return;
    const id = current.id,
      timer = setTimeout(() => {
        const latest = itemsRef.current;
        if (latest.some((item) => item.id === id && item.unread))
          setItems(latest.map((item) => (item.id === id ? { ...item, unread: false } : item)));
      }, 600);
    return () => clearTimeout(timer);
  }, [current?.id, current?.unread, pending]);
  useLayoutEffect(() => {
    const frame = root.current,
      body = canvas.current;
    if (!frame || !body) return;
    const measure = () => {
      narrow.current = body.getBoundingClientRect().width < 640;
      const small = frame.getBoundingClientRect().width < 900;
      if (panelProp === undefined) {
        if (layout.current === undefined) setPanelOpen(defaultPanelOpen && opened.length > 0 && !small);
        else if (small && !layout.current) setPanelOpen(false);
      }
      layout.current = small;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(body);
    return () => observer.disconnect();
  }, [panelProp]);
  const back = () => {
    setDetail(false);
    requestAnimationFrame(() =>
      [...(canvas.current?.querySelectorAll<HTMLButtonElement>("[data-inbox-row]") ?? [])]
        .find((row) => row.dataset.inboxRow === selectedRef.current)
        ?.focus({ preventScroll: true }),
    );
  };
  const keyboard = useRef(back);
  keyboard.current = back;
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== "Escape" ||
        !narrow.current ||
        isEditing(event.target) ||
        (event.target as HTMLElement)?.closest('[role="menu"],[role="dialog"]') ||
        (document.activeElement === document.body
          ? document.querySelector("[data-inbox-scope]") !== canvas.current
          : !root.current?.contains(event.target as Node)) ||
        canvas.current?.closest("[inert]")
      )
        return;
      event.preventDefault();
      keyboard.current();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const changeDraft = (value: InboxDraft) => {
    if (!shown) return;
    const next = { ...draftsRef.current, [shown.id]: value };
    draftsRef.current = next;
    setDrafts(next);
  };
  const decide = (answer: InboxAnswer) => {
    const item = current;
    if (!item || item.done || sending.current) return;
    sending.current = true;
    const position = itemsRef.current.filter((entry) => !entry.done).findIndex((entry) => entry.id === item.id),
      snapshot = { ...item, done: undefined };
    setPending({ item: snapshot, answer, collapsing: false });
    setFocusRequest((value) => value + 1);
    const left = itemsRef.current.filter((entry) => !entry.done && entry.id !== item.id).length;
    setNotice(left ? `Sent. ${left} left.` : "Sent. You're all caught up.");
    onDecide?.(item.id, answer);
    timers.current.push(setTimeout(() => setPending((value) => (value ? { ...value, collapsing: true } : null)), 900));
    timers.current.push(
      setTimeout(() => {
        const latest = itemsRef.current,
          oldIndex = position,
          remaining = latest.filter((entry) => entry.id !== item.id),
          found = latest.find((entry) => entry.id === item.id);
        if (found) {
          const done = { ...found, unread: false, done: found.done ?? { answer, at: Date.now() } };
          const firstDone = remaining.findIndex((entry) => entry.done);
          setItems(
            firstDone < 0
              ? [...remaining, done]
              : [...remaining.slice(0, firstDone), done, ...remaining.slice(firstDone)],
          );
        }
        sending.current = false;
        setPending(null);
        if (selectedRef.current === item.id) {
          const open = remaining.filter((entry) => !entry.done);
          select(open[Math.max(0, Math.min(oldIndex, open.length - 1))]?.id ?? null, true);
        }
      }, 1180),
    );
  };
  const later = () => {
    if (!current || current.done || sending.current) return;
    const open = items.filter((item) => !item.done),
      index = open.findIndex((item) => item.id === current.id),
      remaining = open.filter((item) => item.id !== current.id);
    setItems([...remaining, current, ...items.filter((item) => item.done)]);
    select(remaining[index]?.id ?? remaining[0]?.id ?? current.id, true);
    onLater?.(current.id);
    const message = labels.deferred ?? "Moved to the end of the list";
    setNotice(message);
    showToast(message);
  };
  const reopen = () => {
    if (!current?.done || sending.current) return;
    const item = { ...current, done: undefined, unread: false },
      nextDrafts = { ...draftsRef.current };
    delete nextDrafts[item.id];
    draftsRef.current = nextDrafts;
    setDrafts(nextDrafts);
    setItems([item, ...items.filter((entry) => entry.id !== item.id)]);
    setTab("open");
    select(item.id, true);
    onReopen?.(item.id);
    const count = items.filter((entry) => !entry.done).length + 1;
    setNotice(labels.reopened?.(count) ?? `Reopened. ${count} open.`);
  };
  const updateFiles = (next: ArtifactFile[]) => {
    const previous = fileRef.current;
    fileRef.current = next;
    setFiles(next);
    next.forEach((file) => {
      if (JSON.stringify(previous.find((item) => item.name === file.name)) !== JSON.stringify(file))
        onArtifactChange?.(file.name, file);
    });
  };
  const changePanel = (open: boolean) => {
    if (open && !opened.length) {
      setOpened(["task"]);
      setActive("task");
    }
    setPanelOpen(open);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setFocusRequest((value) => value + 1);
  };
  const changeOpened = (next: string[]) => {
    setOpened(next);
    setStartTabs((tabs) => tabs.filter((id) => next.includes(id)));
    setToolTabs((tabs) => tabs.filter((tab) => next.includes(tab.id)));
    if (!next.length) closePanel();
  };
  const openArtifact = (name: string, replace?: string, owner = taskName ?? "") => {
    if (!fileRef.current.some((file) => file.name === name))
      updateFiles([...fileRef.current, { kind: "document", name, content: `# ${name}\n\n`, updated: "Just now" }]);
    owners.current[name] = owner;
    setOpened([...new Set(replace ? opened.map((id) => (id === replace ? name : id)) : [...opened, name])]);
    if (replace) setStartTabs((tabs) => tabs.filter((id) => id !== replace));
    setActive(name);
    setPanelOpen(true);
    onOpenArtifact?.(owner, name);
  };
  const openedFile = (name: string) => {
    const owner = owners.current[active] ?? taskName ?? "";
    owners.current[name] = owner;
    onOpenArtifact?.(owner, name);
  };
  const newTab = () => {
    const id = `new-${++sequence.current}`;
    setStartTabs((tabs) => [...tabs, id]);
    setOpened([...opened, id]);
    setActive(id);
    setPanelOpen(true);
  };
  const openTool = (kind: WorkspaceToolKind, replace?: string) => {
    const id = replace ?? `tool-${++sequence.current}`;
    if (replace) setStartTabs((tabs) => tabs.filter((tab) => tab !== replace));
    else setOpened([...opened, id]);
    setToolTabs((tabs) => [...tabs.filter((tab) => tab.id !== id), { id, kind }]);
    setActive(id);
    setPanelOpen(true);
    onOpenTool?.(kind);
  };
  const openUrl = (value: string) => {
    try {
      const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid address");
      if (onOpenUrl) onOpenUrl(url.href);
      else window.open(url.href, "_blank", "noopener,noreferrer");
    } catch {
      setNotice("Enter a valid web address");
    }
  };
  const extraTabs: ArtifactWorkspaceTab[] = [
    {
      id: "task",
      label: taskName ?? "Task",
      icon: <Icon name="tasks" size={14} />,
      content: (
        <InboxTaskContext
          name={taskName}
          task={contextTask}
          items={items}
          activeId={shown?.id}
          onOpenItem={(id) => choose(id, true)}
          onOpenArtifact={(name) => openArtifact(name)}
          labels={labels}
          now={clock}
        />
      ),
    },
    ...startTabs.map((id) => ({
      id,
      label: "New tab",
      icon: <Icon name="globe" size={14} />,
      content: (
        <WorkspaceStart
          suggested={suggested}
          onOpenSource={(source) => openArtifact(source.artifact ?? source.name, id)}
          onOpenTool={(kind) => openTool(kind, id)}
          onOpenUrl={(value) => {
            openTool("browser", id);
            setToolValues((values) => ({ ...values, [id]: value }));
            openUrl(value);
          }}
        />
      ),
    })),
    ...toolTabs.map(({ id, kind }) => ({
      id,
      label: kind === "terminal" ? "Terminal" : kind === "browser" ? "Browser" : "Notes",
      icon: <Icon name={kind === "terminal" ? "terminal" : kind === "browser" ? "globe" : "compose"} size={14} />,
      content: renderTool?.(kind) ?? (
        <WorkspaceTool
          kind={kind}
          value={toolValues[id] ?? ""}
          onValueChange={(value) => setToolValues((values) => ({ ...values, [id]: value }))}
          lines={toolLines[id]}
          onLinesChange={(lines) => setToolLines((values) => ({ ...values, [id]: lines }))}
          onOpenUrl={openUrl}
        />
      ),
    })),
  ];
  const navigation: AppRailItem[] = [
    { label: "Thread", icon: <Icon name="chat" /> },
    { label: "Inbox", icon: <Icon name="inbox" />, count: items.filter((item) => !item.done).length },
    { label: "Tasks", icon: <Icon name="tasks" /> },
    { label: "Memory", icon: <Icon name="memory" /> },
    { label: "Settings", icon: <Icon name="settings" />, section: "Workspace" },
  ];
  const commands: CommandMenuGroup[] = [
    {
      id: "inbox",
      label: labels.inbox ?? "Inbox",
      commands: items.map((item) => ({
        id: item.id,
        label: item.question,
        description: item.task,
        icon: <InboxGlyph kind={item.done ? "done" : item.kind} />,
        onSelect: () => choose(item.id, true),
      })),
    },
    {
      id: "workspace",
      label: "Workspace",
      commands: navigation.map((item) => ({
        id: `navigate:${item.label}`,
        label: item.label,
        icon: item.icon,
        onSelect: () => onNavigate?.(item.label),
      })),
    },
  ];
  return (
    <div ref={root} className={["ui-ibs__frame", className].filter(Boolean).join(" ")} style={style}>
      <style href="ui-inbox" precedence="default">
        {css}
      </style>
      <AppShell
        {...shellProps}
        className="ui-ibs__shell"
        defaultChats={shellProps.defaultChats ?? []}
        defaultActive={shellProps.defaultActive ?? "Inbox"}
        navigation={navigation}
        commands={shellProps.commands ?? commands}
        onNavigate={onNavigate}
        panelOpen={panelOpen}
        onPanelOpenChange={changePanel}
        defaultPanelWidth={shellProps.defaultPanelWidth ?? 410}
        panelTitle="Task"
        panel={
          <ArtifactWorkspace
            files={files}
            onFilesChange={updateFiles}
            openFiles={opened}
            onOpenFilesChange={changeOpened}
            activeFile={active}
            onActiveFileChange={setActive}
            tabs={extraTabs}
            onNewTab={newTab}
            onOpenFile={openedFile}
            onClose={closePanel}
            closeLabel="Close task"
          />
        }
      >
        <div
          ref={canvas}
          className="ui-ibs"
          data-inbox-scope=""
          data-detail={detail || undefined}
          aria-busy={!!pending}
        >
          <div className="ui-ibs__list">
            <InboxList
              items={items}
              tab={tab}
              onTabChange={changeTab}
              selected={selected}
              onSelect={(id) => choose(id)}
              sendingId={pending?.item.id}
              collapsingId={pending?.collapsing ? pending.item.id : undefined}
              disabled={!!pending}
              labels={labels}
              now={clock}
            />
          </div>
          <div className="ui-ibs__reading">
            <header className="ui-ibs__mobile-head">
              <button type="button" onClick={back}>
                <Icon name="chevron" size={14} />
                {labels.back ?? labels.inbox ?? "Inbox"}
              </button>
            </header>
            <div className="ui-ibs__scroll">
              {shown ? (
                <InboxItemView
                  key={`${shown.id}:${shown.done ? "done" : "open"}`}
                  item={shown}
                  draft={
                    drafts[shown.id] ?? { option: shown.options?.find((option) => option.recommended)?.id, text: "" }
                  }
                  onDraftChange={changeDraft}
                  onSubmit={decide}
                  onLater={later}
                  onReopen={reopen}
                  onOpenArtifact={(name) => openArtifact(name)}
                  phase={pending ? "sent" : "answer"}
                  sentAnswer={pending?.answer}
                  focusRequest={focusRequest}
                  labels={labels}
                  now={clock}
                />
              ) : (
                <div className="ui-ibs__empty">
                  <InboxEmptyState
                    variant={tab}
                    running={running}
                    title={tab === "open" ? labels.caughtUp : labels.noAnswers}
                    description={
                      tab === "open"
                        ? (labels.running?.(running) ??
                          `${running} ${running === 1 ? "task keeps" : "tasks keep"} running in the background`)
                        : labels.noAnswersDescription
                    }
                    tasksLabel={labels.tasks}
                    onOpenTasks={() => onNavigate?.("Tasks")}
                    focusRequest={focusRequest}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {toast && (
          <div className="ui-ibs__toast" key={toast.id} aria-hidden="true">
            <Icon name="check" size={14} />
            <span>{toast.text}</span>
          </div>
        )}
        <span className="ui-ibs__sr" role="status" aria-live="polite">
          {notice}
        </span>
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

.ui-ibl {
  --ui-ibl-card: #fff;
  --ui-ibl-ink: rgba(0, 0, 0, 0.88);
  --ui-ibl-muted: rgba(0, 0, 0, 0.45);
  --ui-ibl-faint: rgba(0, 0, 0, 0.27);
  --ui-ibl-line: rgba(0, 0, 0, 0.06);
  --ui-ibl-fill: rgba(0, 0, 0, 0.04);
  --ui-ibl-hover: rgba(0, 0, 0, 0.02);
  --ui-ibl-focus: rgba(0, 96, 226, 0.7);
  --ui-ibl-purple: #a651f0;
  --ui-ibl-blue: #0190fe;
  --ui-ibl-green: #5fc88a;
  --ui-ibl-orange: #f28a2e;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset -0.5px 0 var(--ui-ibl-line);
  color: var(--ui-ibl-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-ibl / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibl,
.ui-ibl *,
.ui-ibl *::before,
.ui-ibl *::after {
  box-sizing: border-box;
}
.ui-ibl button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ibl button:focus-visible {
  outline: 2px solid var(--ui-ibl-focus);
  outline-offset: -2px;
}
.ui-ibl button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ibl button:disabled {
  cursor: default;
}
.ui-ibl__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
  height: 48px;
  padding: 0 12px 0 20px;
  box-shadow: inset 0 -0.5px var(--ui-ibl-line);
}
.ui-ibl h1 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  min-width: 0;
}
.ui-ibl h1 > span {
  font-size: 13px;
  font-weight: 400;
  color: var(--ui-ibl-faint);
  font-variant-numeric: tabular-nums;
}
.ui-ibl__tabs {
  display: flex;
  gap: 2px;
  flex: none;
}
.ui-ibl__tabs button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  color: var(--ui-ibl-muted);
}
.ui-ibl__tabs button[aria-selected="true"] {
  background: var(--ui-ibl-fill);
  color: var(--ui-ibl-ink);
}
.ui-ibl__rows {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 6px 8px 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-ibl-line) transparent;
  overscroll-behavior: contain;
}
.ui-ibl__wrap {
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr;
  transition:
    grid-template-rows 280ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms;
}
.ui-ibl__wrap[data-gone] {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}
.ui-ibl__row {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr) 6px;
  align-items: start;
  column-gap: 12px;
  height: 56px;
  min-height: 0;
  width: 100%;
  padding: 10px 12px;
  overflow: hidden;
  border-radius: 8px;
  text-align: left;
  transition:
    background-color 140ms,
    opacity 200ms;
}
.ui-ibl__row:hover {
  background: var(--ui-ibl-hover);
}
.ui-ibl__row[aria-selected="true"] {
  background: var(--ui-ibl-fill);
}
.ui-ibl__row[data-sending] {
  opacity: 0.55;
}
.ui-ibl__glyph {
  display: grid;
  place-items: center;
  height: 20px;
  color: var(--ui-ibl-faint);
}
.ui-ibl__glyph[data-kind="decision"] {
  color: var(--ui-ibl-purple);
}
.ui-ibl__glyph[data-kind="pick"] {
  color: var(--ui-ibl-blue);
}
.ui-ibl__glyph:is([data-kind="approval"], [data-kind="done"]) {
  color: var(--ui-ibl-green);
}
.ui-ibl__glyph[data-kind="question"] {
  color: var(--ui-ibl-orange);
}
.ui-ibl__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-ibl__question {
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibl__meta {
  display: flex;
  gap: 6px;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ibl-muted);
  white-space: nowrap;
  min-width: 0;
}
.ui-ibl__meta > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-ibl__meta > span:last-child {
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-ibl__meta i {
  font-style: normal;
  color: var(--ui-ibl-faint);
}
.ui-ibl__dot {
  width: 6px;
  height: 6px;
  margin-top: 7px;
  border-radius: 50%;
  background: #0060e2;
  opacity: 0;
  transform: scale(0.4);
  transition:
    opacity 240ms,
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ui-ibl__dot[data-on] {
  opacity: 1;
  transform: none;
}
.ui-ibl__empty {
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibl-muted);
}
@container ui-as (max-width:899.99px) {
  .ui-ibl__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@media (pointer: coarse) {
  .ui-ibl__tabs button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibl,
  .ui-ibl * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibl {
  --ui-ibl-card: #1c1c1e;
  --ui-ibl-ink: rgba(255, 255, 255, 0.9);
  --ui-ibl-muted: rgba(255, 255, 255, 0.46);
  --ui-ibl-faint: rgba(255, 255, 255, 0.3);
  --ui-ibl-line: rgba(255, 255, 255, 0.08);
  --ui-ibl-fill: rgba(255, 255, 255, 0.06);
  --ui-ibl-hover: rgba(255, 255, 255, 0.03);
  --ui-ibl-focus: rgba(77, 141, 255, 0.8);
  --ui-ibl-purple: #b98af0;
  --ui-ibl-blue: #4fb0fe;
  --ui-ibl-green: #7dcf9f;
  --ui-ibl-orange: #f2a15c;
}

.ui-ibo {
  --ui-ibo-card: #fff;
  --ui-ibo-ink: rgba(0, 0, 0, 0.88);
  --ui-ibo-muted: rgba(0, 0, 0, 0.45);
  --ui-ibo-faint: rgba(0, 0, 0, 0.27);
  --ui-ibo-line: rgba(0, 0, 0, 0.06);
  --ui-ibo-line-strong: rgba(0, 0, 0, 0.16);
  --ui-ibo-fill: rgba(0, 0, 0, 0.04);
  --ui-ibo-hover: rgba(0, 0, 0, 0.02);
  --ui-ibo-focus: rgba(0, 96, 226, 0.7);
  --ui-ibo-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 10px;
  background: var(--ui-ibo-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibo-line);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ibo-ink);
  container: ui-ibo / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibo,
.ui-ibo *,
.ui-ibo *::before,
.ui-ibo *::after {
  box-sizing: border-box;
}
.ui-ibo__option {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  column-gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 10px 12px;
  border: 0;
  border-radius: 6px;
  text-align: left;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition: background-color 140ms;
}
.ui-ibo__option:hover {
  background: var(--ui-ibo-hover);
}
.ui-ibo__option[aria-checked="true"] {
  background: var(--ui-ibo-fill);
}
.ui-ibo__option:disabled {
  cursor: default;
  opacity: 0.5;
}
.ui-ibo__option:focus-visible {
  outline: 2px solid var(--ui-ibo-focus);
  outline-offset: -2px;
}
.ui-ibo__option:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ibo__number {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: inset 0 0 0 0.5px var(--ui-ibo-line-strong);
  font-size: 11px;
  color: var(--ui-ibo-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ibo__option[aria-checked="true"] .ui-ibo__number {
  background: var(--ui-ibo-ink);
  color: var(--ui-ibo-card);
  box-shadow: none;
}
.ui-ibo__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-ibo__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 20px;
}
.ui-ibo__head strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.ui-ibo__recommended {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  background: rgba(0, 143, 245, 0.1);
  color: #006dcb;
}
.ui-ibo__summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-ibo-muted);
  font-size: 13px;
  line-height: 20px;
}
.ui-ibo__more {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 320ms var(--ui-ibo-ease),
    opacity 220ms;
}
.ui-ibo__more[data-open] {
  grid-template-rows: 1fr;
  opacity: 1;
}
.ui-ibo__clip {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.ui-ibo__line {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-ibo-muted);
}
.ui-ibo__line:first-child {
  margin-top: 8px;
}
.ui-ibo__line > b {
  flex: none;
  width: 8px;
  text-align: center;
  font-weight: 500;
  color: var(--ui-ibo-faint);
}
.ui-ibo[data-variant="variants"] {
  display: grid;
  grid-template-columns: repeat(var(--ui-ibo-count, 3), minmax(0, 1fr));
  gap: 6px;
  margin: -6px;
  padding: 0;
  box-shadow: none;
  background: none;
}
.ui-ibo[data-variant="variants"] .ui-ibo__option {
  grid-template-columns: 18px minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 8px;
  min-height: 0;
  padding: 6px 6px 8px;
  border-radius: 10px;
}
.ui-ibo__preview {
  display: block;
  grid-column: 1/-1;
  overflow: hidden;
  border-radius: 6px;
  background: var(--ui-ibo-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibo-line);
}
.ui-ibo__preview > img {
  display: block;
  width: 100%;
  height: auto;
}
.ui-ibo__wire {
  display: block;
  width: 100%;
  height: auto;
  --ui-ibo-card: #fff;
  --ui-ibo-wire-ink: rgba(0, 0, 0, 0.42);
  --ui-ibo-wire-mid: rgba(0, 0, 0, 0.16);
  --ui-ibo-wire-soft: rgba(0, 0, 0, 0.07);
}
.ui-ibo[data-variant="variants"] .ui-ibo__number {
  width: 18px;
  height: 18px;
}
.ui-ibo[data-variant="variants"] .ui-ibo__recommended {
  display: none;
}
.ui-ibo__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-ibo (max-width:360px) {
  .ui-ibo[data-variant="variants"] .ui-ibo__option {
    padding: 4px 4px 6px;
    column-gap: 0;
  }
  .ui-ibo[data-variant="variants"] .ui-ibo__number {
    display: none;
  }
  .ui-ibo[data-variant="variants"] .ui-ibo__body {
    grid-column: 1/-1;
  }
  .ui-ibo__head strong {
    font-size: 12px;
  }
}
@media (pointer: coarse) {
  .ui-ibo__option {
    min-height: 56px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibo,
  .ui-ibo * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibo,
:where(.dark, [data-theme="dark"]) .ui-ibo__wire {
  --ui-ibo-card: #1c1c1e;
  --ui-ibo-ink: rgba(255, 255, 255, 0.9);
  --ui-ibo-muted: rgba(255, 255, 255, 0.46);
  --ui-ibo-faint: rgba(255, 255, 255, 0.3);
  --ui-ibo-line: rgba(255, 255, 255, 0.08);
  --ui-ibo-line-strong: rgba(255, 255, 255, 0.16);
  --ui-ibo-fill: rgba(255, 255, 255, 0.06);
  --ui-ibo-hover: rgba(255, 255, 255, 0.03);
  --ui-ibo-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-ibo__recommended {
  background: rgba(0, 119, 255, 0.22);
  color: #70b8ff;
}

:where(.dark, [data-theme="dark"]) .ui-ibo__wire {
  --ui-ibo-wire-ink: rgba(255, 255, 255, 0.5);
  --ui-ibo-wire-mid: rgba(255, 255, 255, 0.2);
  --ui-ibo-wire-soft: rgba(255, 255, 255, 0.08);
}

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

.ui-ibv {
  --ui-ibv-card: #fff;
  --ui-ibv-ink: rgba(0, 0, 0, 0.88);
  --ui-ibv-text: rgba(0, 0, 0, 0.61);
  --ui-ibv-muted: rgba(0, 0, 0, 0.45);
  --ui-ibv-faint: rgba(0, 0, 0, 0.27);
  --ui-ibv-line: rgba(0, 0, 0, 0.06);
  --ui-ibv-fill: rgba(0, 0, 0, 0.04);
  --ui-ibv-focus: rgba(0, 96, 226, 0.7);
  --ui-ibv-shadow: 0 0 0 0.5px var(--ui-ibv-line), 0 1px 2px rgba(0, 0, 0, 0.025);
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: clamp(40px, 11vh, 104px) 40px 64px;
  color: var(--ui-ibv-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-ibv / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-ibv-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ibv,
.ui-ibv *,
.ui-ibv *::before,
.ui-ibv *::after {
  box-sizing: border-box;
}
.ui-ibv :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ibv button:focus-visible {
  outline: 2px solid var(--ui-ibv-focus);
  outline-offset: -2px;
}
.ui-ibv button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ibv__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ibv-muted);
}
.ui-ibv__meta > span:first-child {
  display: flex;
  flex: none;
  margin-right: 2px;
}
.ui-ibv__meta > span[data-kind="decision"] {
  color: #a651f0;
}
.ui-ibv__meta > span[data-kind="pick"] {
  color: #0190fe;
}
.ui-ibv__meta > span:is([data-kind="approval"], [data-kind="done"]) {
  color: #5fc88a;
}
.ui-ibv__meta > span[data-kind="question"] {
  color: #f28a2e;
}
.ui-ibv__meta > span[dir] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibv__meta > span:last-child {
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-ibv__meta i {
  font-style: normal;
  color: var(--ui-ibv-faint);
}
.ui-ibv__badge {
  flex: none;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  background: rgba(255, 156, 0, 0.16);
  color: #cc4e00;
}
.ui-ibv__question {
  margin: 10px 0 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.24px;
  text-wrap: balance;
  overflow-wrap: anywhere;
  outline: none !important;
}
.ui-ibv__context {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--ui-ibv-text);
  text-wrap: pretty;
}
.ui-ibv__answer {
  margin-top: 32px;
}
.ui-ibv__facts {
  margin: 0;
  padding: 4px 16px;
  border-radius: 10px;
  background: var(--ui-ibv-card);
  box-shadow: var(--ui-ibv-shadow);
}
.ui-ibv__facts > div {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  column-gap: 12px;
  align-items: center;
  min-height: 40px;
}
.ui-ibv__facts > div + div {
  box-shadow: inset 0 0.5px var(--ui-ibv-line);
}
.ui-ibv__facts dt {
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibv-muted);
}
.ui-ibv__facts dd {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
  padding: 10px 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-ibv__free {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ui-ibv__reply {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: var(--ui-ibv-card);
  box-shadow: var(--ui-ibv-shadow);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibv-ink);
  outline: none;
  transition: box-shadow 140ms;
}
.ui-ibv__reply::placeholder {
  color: var(--ui-ibv-faint);
}
.ui-ibv__reply:focus {
  outline: none;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.04);
}
.ui-ibv__area {
  flex: none;
  height: 88px;
  width: 100%;
  padding: 10px 12px;
  resize: none;
}
.ui-ibv__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibv__chips button {
  height: 28px;
  max-width: 100%;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-ibv-fill);
  font-size: 13px;
  color: var(--ui-ibv-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.ui-ibv__chips button[aria-pressed="true"] {
  color: var(--ui-ibv-ink);
  box-shadow: inset 0 0 0 0.5px var(--ui-ibv-line);
}
.ui-ibv__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.ui-ibv__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  margin-left: auto;
}
.ui-ibv__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-ibv-card) !important;
  box-shadow: var(--ui-ibv-shadow);
  font-size: 13px !important;
  font-weight: 500 !important;
  white-space: nowrap;
}
.ui-ibv__button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-ibv__later {
  box-shadow: none;
  background: none !important;
  color: var(--ui-ibv-text) !important;
}
.ui-ibv__later:hover {
  background: var(--ui-ibv-fill) !important;
}
.ui-ibv__send {
  background: var(--ui-ibv-ink) !important;
  color: var(--ui-ibv-card) !important;
  box-shadow: none;
}
.ui-ibv kbd {
  font: inherit;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
  opacity: 0.5;
  margin-right: -2px;
}
.ui-ibv__done {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
}
.ui-ibv[data-phase="done"] .ui-ibv__context + .ui-ibv__done {
  margin-top: 16px;
}
.ui-ibv__chosen {
  border-radius: 10px;
  background: var(--ui-ibv-card);
  box-shadow: var(--ui-ibv-shadow);
  font-size: 13px;
  line-height: 20px;
}
.ui-ibv__chosen-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px 0 14px;
}
.ui-ibv__chosen-row > svg {
  flex: none;
  color: #5fc88a;
}
.ui-ibv__chosen-row > strong {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
}
.ui-ibv__chosen-row > span {
  flex: none;
  color: var(--ui-ibv-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-ibv__chosen-body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 0 16px 14px 40px;
  margin-top: -6px;
}
.ui-ibv__chosen-thumb {
  flex: none;
  width: 96px;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: var(--ui-ibv-shadow);
}
.ui-ibv__chosen-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.ui-ibv__chosen-summary,
.ui-ibv__words {
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibv-text);
  overflow-wrap: anywhere;
}
.ui-ibv__pro {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-ibv-muted);
}
.ui-ibv__pro > b {
  font-weight: 500;
  color: var(--ui-ibv-faint);
}
.ui-ibv__chosen-summary + .ui-ibv__pro {
  margin-top: 4px;
}
.ui-ibv__chosen-fact {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  font-size: 12px;
  line-height: 20px;
}
.ui-ibv__chosen-fact > span:first-child {
  color: var(--ui-ibv-muted);
}
.ui-ibv__chosen-fact > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibv__since {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-ibv__since h3 {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-ibv-muted);
}
.ui-ibv__since ul {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ui-ibv-text);
}
.ui-ibv__since li {
  position: relative;
  padding-left: 16px;
  overflow-wrap: anywhere;
}
.ui-ibv__since li:before {
  content: "";
  position: absolute;
  top: 9px;
  left: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ui-ibv-faint);
}
.ui-ibv__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibv__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ibv-fill);
  font-size: 12px;
}
.ui-ibv__done-actions {
  display: flex;
}
@keyframes ui-ibv-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container ui-ibs (max-width:639.99px) {
  .ui-ibv {
    padding: 12px 20px 40px;
  }
  .ui-ibv__question {
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0.2px;
  }
  .ui-ibv__answer {
    margin-top: 24px;
  }
  .ui-ibv__footer {
    flex-wrap: wrap;
  }
  .ui-ibv__footer > .ui-ibv__reply {
    flex-basis: 100%;
  }
  .ui-ibv kbd {
    display: none;
  }
  .ui-ibv__facts > div {
    grid-template-columns: 60px minmax(0, 1fr);
  }
}
@media (pointer: coarse) {
  .ui-ibv__button,
  .ui-ibv__chips button {
    min-height: 36px;
  }
  .ui-ibv__reply:not(.ui-ibv__area) {
    height: 40px;
  }
  .ui-ibv kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibv,
  .ui-ibv * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibv {
  --ui-ibv-card: #1c1c1e;
  --ui-ibv-ink: rgba(255, 255, 255, 0.9);
  --ui-ibv-text: rgba(255, 255, 255, 0.62);
  --ui-ibv-muted: rgba(255, 255, 255, 0.46);
  --ui-ibv-faint: rgba(255, 255, 255, 0.3);
  --ui-ibv-line: rgba(255, 255, 255, 0.08);
  --ui-ibv-fill: rgba(255, 255, 255, 0.06);
  --ui-ibv-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-ibv__badge {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}

.ui-ibx {
  --ui-ibx-card: #fff;
  --ui-ibx-ink: rgba(0, 0, 0, 0.88);
  --ui-ibx-text: rgba(0, 0, 0, 0.61);
  --ui-ibx-muted: rgba(0, 0, 0, 0.45);
  --ui-ibx-faint: rgba(0, 0, 0, 0.27);
  --ui-ibx-line: rgba(0, 0, 0, 0.06);
  --ui-ibx-fill: rgba(0, 0, 0, 0.025);
  --ui-ibx-focus: rgba(0, 96, 226, 0.7);
  width: 100%;
  padding: 18px;
  color: var(--ui-ibx-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-ibx / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibx,
.ui-ibx *,
.ui-ibx *::before,
.ui-ibx *::after {
  box-sizing: border-box;
}
.ui-ibx__goal {
  margin: 0 0 24px;
  color: var(--ui-ibx-text);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-ibx__properties {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}
.ui-ibx__properties > div {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}
.ui-ibx dt {
  font-size: 12px;
  color: var(--ui-ibx-muted);
}
.ui-ibx dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-ibx__ring {
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--ui-ibx-muted);
}
.ui-ibx__count {
  color: var(--ui-ibx-faint);
  font-variant-numeric: tabular-nums;
}
.ui-ibx__section {
  margin-top: 24px;
}
.ui-ibx__section + .ui-ibx__section {
  margin-top: 20px;
}
.ui-ibx h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--ui-ibx-muted);
}
.ui-ibx h3 > span {
  color: var(--ui-ibx-faint);
  font-variant-numeric: tabular-nums;
}
.ui-ibx__steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  margin: 0 -10px;
  padding: 6px 10px;
  border-radius: 12px;
  background: var(--ui-ibx-fill);
}
.ui-ibx__steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  color: var(--ui-ibx-muted);
}
.ui-ibx__steps li > span:nth-child(2) {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-ibx__step-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--ui-ibx-line);
}
.ui-ibx__steps li[data-done] .ui-ibx__step-mark {
  background: #0190fe;
  color: #fff;
  box-shadow: none;
}
.ui-ibx__steps li[data-current] {
  color: var(--ui-ibx-ink);
}
.ui-ibx__steps li[data-current] .ui-ibx__step-mark {
  box-shadow: inset 0 0 0 1px #0190fe;
}
.ui-ibx__steps li[data-waiting] .ui-ibx__step-mark {
  box-shadow: inset 0 0 0 1px #f76b00;
}
.ui-ibx__needs {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  color: #eb5600;
  background: rgba(255, 156, 0, 0.16);
}
.ui-ibx__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibx :where(button) {
  border: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.ui-ibx button:focus-visible {
  outline: 2px solid var(--ui-ibx-focus);
  outline-offset: 2px;
}
.ui-ibx button:active {
  transform: scale(0.97);
}
.ui-ibx__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-height: 26px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ibx-fill);
  font-size: 12px;
  line-height: 20px;
}
.ui-ibx__files > button > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibx__files > button > span:first-child {
  display: flex;
  flex: none;
  color: #68b1ee;
}
.ui-ibx__files [data-kind="table"] {
  color: #89d4aa !important;
}
.ui-ibx__files [data-kind="code"] {
  color: #f4b17e !important;
}
.ui-ibx__files [data-kind="folder"] {
  color: #ecd16e !important;
}
.ui-ibx__decided {
  margin: 0 -10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ui-ibx__decided > button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--ui-ibx-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibx-line);
  text-align: left;
}
.ui-ibx__decided > button > svg:first-child {
  flex: none;
  color: #5fc88a;
}
.ui-ibx__decided > button > span {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.ui-ibx__decided > button > span > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibx__decided > button > span > span:last-child {
  font-size: 12px;
  color: var(--ui-ibx-muted);
}
.ui-ibx__decided > button > svg:last-child {
  display: none;
}
.ui-ibx__placeholder {
  color: var(--ui-ibx-muted);
}
@container ui-ibx (max-width:270px) {
  .ui-ibx__properties > div {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 8px;
  }
  .ui-ibx__needs {
    padding: 0 4px;
  }
}
@media (pointer: coarse) {
  .ui-ibx__files > button,
  .ui-ibx__decided > button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibx,
  .ui-ibx * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibx {
  --ui-ibx-card: #1c1c1e;
  --ui-ibx-ink: rgba(255, 255, 255, 0.9);
  --ui-ibx-text: rgba(255, 255, 255, 0.62);
  --ui-ibx-muted: rgba(255, 255, 255, 0.46);
  --ui-ibx-faint: rgba(255, 255, 255, 0.3);
  --ui-ibx-line: rgba(255, 255, 255, 0.08);
  --ui-ibx-fill: rgba(255, 255, 255, 0.025);
  --ui-ibx-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-ibx__needs {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}

.ui-ibs__frame {
  width: 100%;
  height: 100%;
  min-height: 0;
  container: ui-ibs-frame / inline-size;
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
.ui-ibs__frame,
.ui-ibs__frame *,
.ui-ibs__frame *::before,
.ui-ibs__frame *::after {
  box-sizing: border-box;
}
.ui-ibs__shell {
  height: 100%;
}
.ui-ibs {
  --ui-ibs-ink: rgba(0, 0, 0, 0.88);
  --ui-ibs-muted: rgba(0, 0, 0, 0.45);
  --ui-ibs-line: rgba(0, 0, 0, 0.06);
  --ui-ibs-focus: rgba(0, 96, 226, 0.7);
  height: 100%;
  min-height: 0;
  width: 100%;
  container: ui-ibs / inline-size;
  display: flex;
  color: var(--ui-ibs-ink);
}
.ui-ibs__list {
  flex: none;
  width: 320px;
  min-height: 0;
}
.ui-ibs__reading {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}
.ui-ibs__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-ibs-line) transparent;
}
.ui-ibs__mobile-head {
  display: none;
  height: 48px;
  flex: none;
  align-items: center;
  padding: 0 48px;
}
.ui-ibs__mobile-head button {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--ui-ibs-muted);
  font:
    500 13px/20px "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  cursor: pointer;
}
.ui-ibs__mobile-head button > svg {
  transform: rotate(180deg);
}
.ui-ibs__mobile-head button:active {
  transform: scale(0.97);
}
.ui-ibs__mobile-head button:focus-visible {
  outline: 2px solid var(--ui-ibs-focus);
  outline-offset: 2px;
}
.ui-ibs__empty {
  display: grid;
  place-items: center;
  min-height: 100%;
  padding-bottom: 48px;
}
.ui-ibs__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-ibs__frame .ui-aw__tabs {
  flex: 1;
}
.ui-ibs__frame .ui-aw__tab-wrap {
  flex: 1 1 0;
  max-width: 166px;
}
.ui-ibs__frame .ui-aw__tab {
  width: 100%;
  font-size: 13px !important;
  padding-right: 24px;
}
.ui-ibs__frame .ui-aw__tab > span:first-child {
  flex: none;
}
.ui-ibs__frame .ui-aw__tab-wrap:not([data-active]) .ui-aw__tab-close {
  opacity: 0;
}
.ui-ibs__frame .ui-aw__tab-wrap:hover .ui-aw__tab-close,
.ui-ibs__frame .ui-aw__tab-wrap:focus-within .ui-aw__tab-close {
  opacity: 1;
}
@container ui-ibs (max-width:639.99px) {
  .ui-ibs__list {
    width: 100%;
  }
  .ui-ibs__reading {
    display: none;
  }
  .ui-ibs[data-detail] .ui-ibs__list {
    display: none;
  }
  .ui-ibs[data-detail] .ui-ibs__reading {
    display: flex;
  }
  .ui-ibs__mobile-head {
    display: flex;
  }
  .ui-ibs__empty {
    padding-bottom: 0;
  }
}
.ui-ibs__toast {
  position: absolute;
  z-index: 40;
  left: 50%;
  bottom: 20px;
  translate: -50% 0;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100% - 32px);
  height: 36px;
  padding: 0 14px 0 12px;
  border-radius: 999px;
  background: var(--ui-as-ink, #171717);
  color: var(--ui-as-card, #fff);
  font-size: 13px;
  line-height: 20px;
  box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.35);
  animation: ui-ibs-toast 2200ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ibs__toast > svg {
  flex: none;
}
.ui-ibs__toast > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@keyframes ui-ibs-toast {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  12%,
  85% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
    transform: translateY(6px);
  }
}
@media (pointer: coarse) {
  .ui-ibs__mobile-head button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibs__frame,
  .ui-ibs__frame * {
    scroll-behavior: auto !important;
  }
  .ui-ibs__toast {
    animation: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibs {
  --ui-ibs-ink: rgba(255, 255, 255, 0.9);
  --ui-ibs-muted: rgba(255, 255, 255, 0.46);
  --ui-ibs-line: rgba(255, 255, 255, 0.08);
  --ui-ibs-focus: rgba(77, 141, 255, 0.8);
}
.ui-ibo {
  --ui-ibo-ink: #171717;
  --ui-ibo-muted: #737373;
  --ui-ibo-faint: #b5b5b5;
  --ui-ibo-line: #e5e5e5;
  --ui-ibo-fill: #f5f5f5;
  --ui-ibo-focus: #2f6bff;
  border: 1px solid var(--ui-ibo-line);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-ibo__option {
  border-radius: 10px;
  min-height: 60px;
}
.ui-ibo[data-variant="variants"] {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.ui-ibv {
  --ui-ibv-ink: #171717;
  --ui-ibv-text: #404040;
  --ui-ibv-muted: #737373;
  --ui-ibv-faint: #b5b5b5;
  --ui-ibv-line: #e5e5e5;
  --ui-ibv-fill: #f5f5f5;
  --ui-ibv-focus: #2f6bff;
  --ui-ibv-shadow: 0 0 0 1px var(--ui-ibv-line), 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-ibv__button {
  height: 32px;
  border-radius: 8px;
}
.ui-ibv__reply {
  height: 36px;
  border-radius: 10px;
}
.ui-ibv__area {
  height: 88px;
}
.ui-ibv__send {
  background: linear-gradient(#323137, #201e25) !important;
  color: #fff !important;
  box-shadow:
    0 0 0 1px #0d0d0d,
    inset 0 1px rgba(255, 255, 255, 0.12);
}
.ui-ibl {
  --ui-ibl-ink: #171717;
  --ui-ibl-muted: #737373;
  --ui-ibl-faint: #b5b5b5;
  --ui-ibl-line: #e5e5e5;
  --ui-ibl-fill: #f5f5f5;
  --ui-ibl-focus: #2f6bff;
}
.ui-ibl__head {
  height: 52px;
}
.ui-ibl__tabs button {
  height: 32px;
  border-radius: 8px;
}
.ui-ibx {
  --ui-ibx-ink: #171717;
  --ui-ibx-text: #404040;
  --ui-ibx-muted: #737373;
  --ui-ibx-faint: #b5b5b5;
  --ui-ibx-line: #e5e5e5;
  --ui-ibx-fill: #fafafa;
  --ui-ibx-focus: #2f6bff;
}
.ui-ibx__files > button {
  min-height: 30px;
  border: 1px solid var(--ui-ibx-line);
  border-radius: 8px;
}
.ui-ibx__decided > button {
  border: 1px solid var(--ui-ibx-line);
  box-shadow: none;
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
:where(.dark, [data-theme="dark"]) .ui-ibo {
  --ui-ibo-card: #232326;
  --ui-ibo-ink: #ededed;
  --ui-ibo-text: #c4c4c4;
  --ui-ibo-muted: #8f8f8f;
  --ui-ibo-faint: #6b6b70;
  --ui-ibo-line: rgba(255, 255, 255, 0.1);
  --ui-ibo-fill: #2a2a2d;
  --ui-ibo-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-ibv {
  --ui-ibv-card: #232326;
  --ui-ibv-ink: #ededed;
  --ui-ibv-text: #c4c4c4;
  --ui-ibv-muted: #8f8f8f;
  --ui-ibv-faint: #6b6b70;
  --ui-ibv-line: rgba(255, 255, 255, 0.1);
  --ui-ibv-fill: #2a2a2d;
  --ui-ibv-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-ibl {
  --ui-ibl-card: #232326;
  --ui-ibl-ink: #ededed;
  --ui-ibl-text: #c4c4c4;
  --ui-ibl-muted: #8f8f8f;
  --ui-ibl-faint: #6b6b70;
  --ui-ibl-line: rgba(255, 255, 255, 0.1);
  --ui-ibl-fill: #2a2a2d;
  --ui-ibl-focus: #6b95ff;
}
:where(.dark, [data-theme="dark"]) .ui-ibx {
  --ui-ibx-card: #232326;
  --ui-ibx-ink: #ededed;
  --ui-ibx-text: #c4c4c4;
  --ui-ibx-muted: #8f8f8f;
  --ui-ibx-faint: #6b6b70;
  --ui-ibx-line: rgba(255, 255, 255, 0.1);
  --ui-ibx-fill: #2a2a2d;
  --ui-ibx-focus: #6b95ff;
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

`;
