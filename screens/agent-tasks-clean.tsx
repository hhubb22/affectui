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
 * agent-tasks (Clean) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input,textarea,select,[contenteditable="true"]');
}

function agentTaskNeeds(task: AgentTask) {
  return task.done ? 0 : task.asks?.length ? task.asks.length : Math.max(0, Math.floor(safeNumber(task.needs, 0)));
}

function agentTaskAge(at: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - safeNumber(at, now)) / 60000));
  if (minutes < 1) return { short: "now", long: "just now" };
  const value = minutes < 60 ? minutes : minutes < 1440 ? Math.floor(minutes / 60) : Math.floor(minutes / 1440);
  const unit = minutes < 60 ? "minute" : minutes < 1440 ? "hour" : "day";
  return {
    short: `${value}${minutes < 60 ? "m" : minutes < 1440 ? "h" : "d"}`,
    long: `${value} ${unit}${value === 1 ? "" : "s"} ago`,
  };
}

function agentTaskStatus(task: AgentTask, now: number) {
  if (task.statusText?.trim()) return task.statusText;
  if (task.done) {
    const days = Math.floor((now - safeNumber(task.updatedAt, now)) / 86400000);
    return `Done · ${days < 1 ? "Today" : days < 2 ? "Yesterday" : new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(task.updatedAt)}`;
  }
  return agentTaskNeeds(task)
    ? "Waiting on you"
    : task.status === "planning"
      ? "Planning"
      : task.status === "paused"
        ? "Paused"
        : "Working";
}

export type CommandMenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
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
          `${command.label} ${command.description ?? ""}`
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
      <style href="ui-agent-tasks-clean" precedence="default">
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
                    {command.icon ?? (
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
  theme: (value: "light" | "dark" | "system") => value[0].toUpperCase() + value.slice(1),
  action: (action: string) => action,
  goTo: "Go to",
  copied: "Conversation title copied",
  copyFailed: "Couldn't copy. Please try again.",
};
export type AppShellLabels = typeof defaultAppShellLabels;
export type AppShellProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  /** Replace the navigation column, retaining the aside, resizer and drawer. null hides its contents. */
  sidebar?: ReactNode;
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
  /** Replace the shell's default command-search groups with application-specific commands. */
  commands?: CommandMenuGroup[];
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

/** A resizable application shell with optional icon rail, project/chat navigation and an artifact panel. */
export function AppShell({
  sidebar: sidebarContent,
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
  commands: commandGroupsProp,
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
  const [folders, setFolders] = useState<string[]>(["Summer collection"]);
  const [menu, setMenu] = useState<
    "workspace" | "account" | "projects" | "chat" | "chat-project" | "appearance" | "language" | null
  >(null);
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
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
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
  }, []);
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
        <button type="button" aria-label={labels.pin(chat.title, !!chat.pinned)} onClick={() => pinChat(chat)}>
          <Icon name="pin" size={12} />
        </button>
      </span>
    </div>
  );
  const menuAction = (label: string) => {
    onNavigate?.(label);
    setMenu(null);
    anchor.current?.focus({ preventScroll: true });
  };
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
      <style href="ui-agent-tasks-clean" precedence="default">
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
          inert={narrow ? !sidebarOpen : collapsed}
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
          <div className="ui-asc__side-col" data-navigation={!!navigation || undefined}>
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
                        <Icon name="chevron" size={12} />
                      </button>
                      <button
                        type="button"
                        className="ui-asc__icon-btn"
                        aria-label={labels.collapseSidebar}
                        onClick={() => (narrow ? setSidebarOpen(false) : setCollapsed(true))}
                      >
                        <Icon name="panel" />
                      </button>
                    </header>
                    <button
                      type="button"
                      className="ui-asc__nav-search"
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
                            aria-current={active === item.label ? "page" : undefined}
                            disabled={item.disabled}
                            onClick={() => navigate(item.label)}
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
                  <>
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
                    <nav className="ui-asc__chat-nav" aria-label={labels.conversations}>
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
                                    folders.includes(name)
                                      ? folders.filter((item) => item !== name)
                                      : [...folders, name],
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
                  </>
                )}
                {!rail && (
                  <button
                    type="button"
                    className="ui-asc__account-row"
                    aria-haspopup="menu"
                    aria-expanded={menu === "account"}
                    {...trigger("account")}
                  >
                    <span className="ui-asc__user-initials">{initials(user.name)}</span>
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
          className="ui-asc__menu"
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
          side={menu === "account" || menu === "workspace" ? "right" : "bottom"}
          onClose={() => setMenu(null)}
        >
          {menu === "workspace" && (
            <>
              {[
                "Invite people",
                "Workspace settings",
                "Analytics",
                "Billing",
                "Usage & limits",
                "Members",
                "Learn more",
                "Switch workspace",
              ].map((label, index) => (
                <button
                  type="button"
                  role="menuitem"
                  key={label}
                  data-divider={index === 1 || index === 6 || index === 7 || undefined}
                  onClick={() => menuAction(label)}
                >
                  {labels.action(label)}
                </button>
              ))}
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
                <span className="ui-asc__user-initials">{initials(user.name)}</span>
                <span>
                  <strong>{user.name}</strong>
                  <small>{user.email ?? ""}</small>
                </span>
              </div>
              <button type="button" role="menuitem" onClick={() => setMenu("language")}>
                {labels.language}
                <span>
                  {language}
                  <Icon name="chevron" size={12} />
                </span>
              </button>
              <button type="button" role="menuitem" onClick={() => setMenu("appearance")}>
                {labels.appearance}
                <Icon name="chevron" size={12} />
              </button>
              {["Integrations", "Settings", "Download apps", "Changelog", "Learn more", "Log out"].map(
                (label, index) => (
                  <button
                    type="button"
                    role="menuitem"
                    key={label}
                    data-divider={index === 2 || index === 3 || index === 5 || undefined}
                    onClick={() => menuAction(label)}
                  >
                    {labels.action(label)}
                  </button>
                ),
              )}
            </>
          )}
          {menu === "language" && (
            <>
              <div className="ui-asc__menu-label">{labels.language}</div>
              {["English", "Deutsch", "Français", "Español"].map((label) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === label}
                  key={label}
                  onClick={() => {
                    setLanguage(label);
                    onNavigate?.(`Language: ${label}`);
                    setMenu(null);
                  }}
                >
                  {label}
                  {language === label && <Icon name="check" size={13} />}
                </button>
              ))}
            </>
          )}
          {menu === "appearance" && (
            <>
              <div className="ui-asc__menu-label">{labels.appearance}</div>
              {(["light", "dark", "system"] as const).map((value) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === value}
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setMenu(null);
                    anchor.current?.focus();
                  }}
                >
                  {labels.theme(value)}
                  {theme === value && <Icon name="check" size={13} />}
                </button>
              ))}
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
        <CommandMenu
          groups={commandGroups}
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onRun={(command) => {
            if (
              !commandGroups.some((group) => group.commands.some((item) => item.id === command && item.onSelect)) &&
              !command.startsWith("chat:") &&
              !command.startsWith("project:") &&
              command !== "new-chat"
            )
              onNavigate?.(command);
          }}
        />
      )}
      <span className="ui-asc__sr" role="status" aria-live="polite">
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
    <div ref={root} className={["ui-afdc", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-tasks-clean" precedence="default">
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
      <style href="ui-agent-tasks-clean" precedence="default">
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
      <style href="ui-agent-tasks-clean" precedence="default">
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

export type AgentTaskStatus = "planning" | "running" | "paused";
export type AgentTaskAsk = { id: string; question: string; kind?: "decision" | "pick" | "approval" | "question" };
export type AgentTask = {
  id: string;
  title: string;
  project: string;
  status?: AgentTaskStatus;
  statusText?: string;
  steps?: { label: string; done?: boolean }[];
  artifacts?: string[];
  asks?: AgentTaskAsk[];
  needs?: number;
  updatedAt: number;
  done?: boolean;
  goal?: string;
  started?: string;
  history?: string[];
  decided?: { question: string; answer: string; at?: number }[];
};
export type TaskProgressRingProps = {
  value?: number;
  max?: number;
  status?: AgentTaskStatus;
  done?: boolean;
  needs?: boolean;
  size?: number;
  label?: string;
  className?: string;
};

/** A task's progress in a small ring; planning is dashed, waiting amber, running teal and done green. */
export function TaskProgressRing({
  value = 0,
  max = 0,
  status: rawStatus = "running",
  done = false,
  needs = false,
  size = 14,
  label,
  className,
}: TaskProgressRingProps) {
  const status = ["planning", "running", "paused"].includes(rawStatus) ? rawStatus : "planning";
  const progress = done ? 1 : max > 0 ? clamp(safeNumber(value, 0) / max, 0, 1) : 0.18;
  const tone = done
    ? "done"
    : status === "planning"
      ? "planning"
      : status === "paused" || (max > 0 && progress < 0.3)
        ? "paused"
        : max > 0
          ? progress < 0.6
            ? "waiting"
            : "running"
          : needs
            ? "waiting"
            : "running";
  return (
    <svg
      className={["ui-tprc", className].filter(Boolean).join(" ")}
      data-tone={tone}
      width={clamp(safeNumber(size, 14), 10, 64)}
      height={clamp(safeNumber(size, 14), 10, 64)}
      viewBox="0 0 16 16"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
    >
      <style href="ui-agent-tasks-clean" precedence="default">
        {css}
      </style>
      <circle className="ui-tprc__track" cx="8" cy="8" r="6.1" />
      {status !== "planning" && (
        <circle
          className="ui-tprc__value"
          cx="8"
          cy="8"
          r="4.2"
          pathLength="100"
          strokeDasharray={`${progress * 100} 100`}
          transform="rotate(-90 8 8)"
        />
      )}
    </svg>
  );
}

export type TaskDraft = { title: string; project: string };
export type TaskCreateProps = {
  projects?: string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  project?: string;
  defaultProject?: string;
  onProjectChange?: (project: string) => void;
  onCreate?: (draft: TaskDraft) => void;
  onClose?: () => void;
  placeholder?: string;
  createLabel?: string;
  autoFocus?: boolean;
  className?: string;
};

/** Inline task creation with a keyboard project picker; Enter creates and keeps the field ready. */
export function TaskCreate({
  projects: rawProjects = ["Northwind", "Platform", "Evalkit"],
  value: valueProp,
  defaultValue = "",
  onValueChange,
  project: projectProp,
  defaultProject,
  onProjectChange,
  onCreate,
  onClose,
  placeholder = "Describe what you want done…",
  createLabel = "Create",
  autoFocus = true,
  className,
}: TaskCreateProps) {
  const projects = [...new Set(rawProjects.filter(Boolean))];
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [project, setProject] = useControllable(projectProp, defaultProject ?? projects[0] ?? "", onProjectChange);
  const [menu, setMenu] = useState(false);
  const root = useRef<HTMLFormElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    anchor = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (autoFocus) input.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  useLayoutEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(168, Math.max(32, el.scrollHeight))}px`;
  }, [value]);
  const submit = () => {
    const title = value.trim();
    if (!title || !onCreate) return;
    onCreate({ title, project: project || projects[0] || "Workspace" });
    setValue("");
    input.current?.focus({ preventScroll: true });
  };
  return (
    <form
      ref={root}
      className={["ui-tcrc", className].filter(Boolean).join(" ")}
      aria-label="Create a task"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !menu) {
          event.preventDefault();
          event.stopPropagation();
          onClose?.();
        }
      }}
    >
      <style href="ui-agent-tasks-clean" precedence="default">
        {css}
      </style>
      <TaskProgressRing status="planning" />
      <label className="ui-tcrc__sr" htmlFor={`${id}-input`}>
        Describe what you want done
      </label>
      <textarea
        id={`${id}-input`}
        ref={input}
        aria-describedby={`${id}-hint`}
        placeholder={placeholder}
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <span className="ui-tcrc__sr" id={`${id}-hint`}>
        Enter creates the task, Shift+Enter starts a new line
      </span>
      <button
        ref={anchor}
        type="button"
        className="ui-tcrc__project"
        aria-label={`Project: ${project}`}
        aria-haspopup="menu"
        aria-expanded={menu}
        aria-controls={menu ? `${id}-projects` : undefined}
        onClick={() => setMenu(!menu)}
      >
        <Icon name="folder" size={14} />
        <span title={project}>{project || "Project"}</span>
        <Icon name="chevron" size={12} />
      </button>
      <button type="submit" className="ui-tcrc__submit" disabled={!value.trim() || !onCreate}>
        {createLabel}
      </button>
      {menu && (
        <FloatingMenu
          anchor={anchor}
          root={root}
          id={`${id}-projects`}
          label="Project"
          className="ui-tcrc__menu"
          align="end"
          onClose={() => setMenu(false)}
        >
          <span className="ui-tcrc__menu-label">Project</span>
          {projects.map((name) => (
            <button
              type="button"
              role="menuitemradio"
              aria-checked={project === name}
              key={name}
              onClick={() => {
                setProject(name);
                setMenu(false);
                input.current?.focus({ preventScroll: true });
              }}
            >
              <Icon name="folder" size={14} />
              <span>{name}</span>
              {project === name && <Icon name="check" size={13} />}
            </button>
          ))}
        </FloatingMenu>
      )}
    </form>
  );
}

export type TaskListTab = "active" | "done";
export type TaskListLabels = {
  tasks?: string;
  active?: string;
  done?: string;
  newTask?: string;
  needsYou?: string;
  emptyActive?: string;
  emptyDone?: string;
  emptyProject?: string;
};
export type TaskListProps = {
  tasks?: AgentTask[];
  projects?: string[];
  tab?: TaskListTab;
  defaultTab?: TaskListTab;
  onTabChange?: (tab: TaskListTab) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string, options: { keyboard: boolean }) => void;
  collapsedProjects?: string[];
  defaultCollapsedProjects?: string[];
  onCollapsedProjectsChange?: (projects: string[]) => void;
  onOpenInbox?: (taskId: string, itemId?: string) => void;
  onNewTask?: () => void;
  createOpen?: boolean;
  createForm?: ReactNode;
  freshIds?: string[];
  labels?: TaskListLabels;
  now?: number;
  className?: string;
};

/** A project tree with roving focus, Active/Done lists and a fixed set of quiet metadata columns. */
export function TaskList({
  tasks: rawTasks = [],
  projects: projectOrder,
  tab: tabProp,
  defaultTab = "active",
  onTabChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  onSelect,
  collapsedProjects: collapsedProp,
  defaultCollapsedProjects = [],
  onCollapsedProjectsChange,
  onOpenInbox,
  onNewTask,
  createOpen = false,
  createForm,
  freshIds = [],
  labels = {},
  now: nowProp,
  className,
}: TaskListProps) {
  const tasks = (Array.isArray(rawTasks) ? rawTasks : []).filter(Boolean);
  const [tabState, setTab] = useControllable(tabProp, defaultTab, onTabChange),
    [selected, setSelected] = useControllable(selectedProp, defaultSelected, onSelectedChange),
    [collapsed, setCollapsed] = useControllable(collapsedProp, defaultCollapsedProjects, onCollapsedProjectsChange);
  const tab = tabState === "done" ? "done" : "active";
  const [focusKey, setFocusKey] = useState(""),
    [keyboard, setKeyboard] = useState(false),
    [clock, setClock] = useState(() => Date.now());
  const root = useRef<HTMLElement>(null),
    id = useId();
  const projects = [...new Set([...(projectOrder ?? []), ...tasks.map((task) => task.project || "Workspace")])];
  const visible = tasks.filter((task) => !!task.done === (tab === "done"));
  const groups = projects
    .map((project) => ({ project, rows: visible.filter((task) => (task.project || "Workspace") === project) }))
    .filter((group) => group.rows.length || projectOrder?.includes(group.project));
  const entries = groups.flatMap((group) => [
    { key: `group:${group.project}`, project: group.project },
    ...(collapsed.includes(group.project)
      ? []
      : group.rows.map((task) => ({ key: `task:${task.id}`, project: group.project }))),
  ]);
  const activeFocus = entries.some((entry) => entry.key === focusKey)
    ? focusKey
    : (entries.find((entry) => entry.key === `task:${selected}`)?.key ?? entries[0]?.key ?? "");
  const now = nowProp ?? clock;
  useEffect(() => {
    if (nowProp !== undefined) return;
    const interval = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(interval);
  }, [nowProp]);
  useEffect(() => {
    const unfolding = tasks.filter((task) => freshIds.includes(task.id)).map((task) => task.project);
    if (collapsed.some((project) => unfolding.includes(project)))
      setCollapsed(collapsed.filter((project) => !unfolding.includes(project)));
  }, [freshIds, rawTasks]);
  const focus = (key: string) => {
    setKeyboard(true);
    setFocusKey(key);
    const el = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-task-key]") ?? [])].find(
      (el) => el.dataset.taskKey === key,
    );
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "nearest" });
  };
  const toggle = (project: string, open?: boolean) => {
    const isOpen = !collapsed.includes(project),
      next = open ?? !isOpen;
    if (isOpen === next) return;
    setCollapsed(next ? collapsed.filter((name) => name !== project) : [...collapsed, project]);
  };
  const moveRow = (direction: number) => {
    const rows = entries.filter((entry) => entry.key.startsWith("task:"));
    if (!rows.length) return;
    const current = rows.findIndex((entry) => entry.key === (document.activeElement as HTMLElement)?.dataset.taskKey);
    const next = current < 0 ? (direction > 0 ? 0 : rows.length - 1) : clamp(current + direction, 0, rows.length - 1);
    focus(rows[next].key);
  };
  const shortcuts = useRef({ moveRow, onNewTask });
  shortcuts.current = { moveRow, onNewTask };
  useEffect(() => {
    const key = (event: globalThis.KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditing(event.target) ||
        (event.target as HTMLElement)?.closest('[role="menu"],[role="dialog"]')
      )
        return;
      const area = root.current?.closest("[data-task-shortcuts]") ?? root.current;
      if (document.activeElement === document.body) {
        if (document.querySelector("[data-task-list]") !== root.current) return;
      } else if (!area?.contains(document.activeElement)) return;
      if (root.current?.closest("[inert]")) return;
      if (event.key === "Tab") {
        setKeyboard(true);
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "j" || key === "k") {
        event.preventDefault();
        shortcuts.current.moveRow(key === "j" ? 1 : -1);
      }
      if ((key === "c" || key === "n") && shortcuts.current.onNewTask) {
        event.preventDefault();
        shortcuts.current.onNewTask();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const treeKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isEditing(event.target)) return;
    const entry = entries.find((item) => item.key === (event.target as HTMLElement).dataset.taskKey);
    if (!entry) return;
    const index = entries.indexOf(entry);
    const next =
      event.key === "ArrowDown"
        ? Math.min(entries.length - 1, index + 1)
        : event.key === "ArrowUp"
          ? Math.max(0, index - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? entries.length - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      focus(entries[next].key);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (entry.key.startsWith("task:")) focus(`group:${entry.project}`);
      else toggle(entry.project, false);
    }
    if (event.key === "ArrowRight" && entry.key.startsWith("group:")) {
      event.preventDefault();
      if (collapsed.includes(entry.project)) toggle(entry.project, true);
      else {
        const child = entries[index + 1];
        if (child?.project === entry.project) focus(child.key);
      }
    }
  };
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "active" : event.key === "End" ? "done" : tab === "active" ? "done" : "active";
    setTab(next);
    root.current?.querySelector<HTMLButtonElement>(`[data-list-tab="${next}"]`)?.focus();
  };
  return (
    <section
      ref={root}
      data-task-list=""
      className={["ui-tlsc", className].filter(Boolean).join(" ")}
      data-keyboard={keyboard || undefined}
    >
      <style href="ui-agent-tasks-clean" precedence="default">
        {css}
      </style>
      <header className="ui-tlsc__head">
        <h1>
          {labels.tasks ?? "Tasks"}
          <span>{visible.length}</span>
        </h1>
        <div role="tablist" aria-label="Task status" className="ui-tlsc__tabs">
          {(["active", "done"] as const).map((value) => (
            <button
              type="button"
              role="tab"
              data-list-tab={value}
              aria-selected={tab === value}
              aria-controls={`${id}-tree`}
              id={`${id}-${value}`}
              tabIndex={tab === value ? 0 : -1}
              key={value}
              onClick={() => setTab(value)}
              onKeyDown={tabKey}
            >
              {value === "active" ? (labels.active ?? "Active") : (labels.done ?? "Done")}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="ui-tlsc__new"
          aria-label={labels.newTask ?? "New task"}
          aria-keyshortcuts="C N"
          aria-expanded={createOpen}
          aria-controls={`${id}-create`}
          disabled={!onNewTask}
          onClick={onNewTask}
        >
          <Icon name="plus" size={14} />
          <span>{labels.newTask ?? "New task"}</span>
          <kbd>C</kbd>
        </button>
      </header>
      <div id={`${id}-create`} className="ui-tlsc__create" hidden={!createOpen}>
        {createForm}
      </div>
      <div className="ui-tlsc__scroll">
        <div
          role="tree"
          aria-label={tab === "active" ? (labels.active ?? "Active tasks") : (labels.done ?? "Done tasks")}
          aria-labelledby={`${id}-${tab}`}
          id={`${id}-tree`}
          className="ui-tlsc__tree"
          onKeyDown={treeKey}
          onPointerDown={() => setKeyboard(false)}
        >
          {groups.map((group, groupIndex) => {
            const expanded = !collapsed.includes(group.project),
              groupKey = `group:${group.project}`;
            return (
              <div className="ui-tlsc__group" role="none" key={group.project}>
                <button
                  type="button"
                  role="treeitem"
                  aria-level={1}
                  aria-expanded={expanded}
                  aria-controls={`${id}-group-${groupIndex}`}
                  aria-owns={expanded ? `${id}-group-${groupIndex}` : undefined}
                  aria-setsize={groups.length}
                  aria-posinset={groupIndex + 1}
                  aria-label={`${group.project}, ${group.rows.length} ${group.rows.length === 1 ? "task" : "tasks"}`}
                  tabIndex={activeFocus === groupKey ? 0 : -1}
                  data-task-key={groupKey}
                  className="ui-tlsc__group-head"
                  onFocus={() => setFocusKey(groupKey)}
                  onClick={() => toggle(group.project)}
                >
                  <span className="ui-tlsc__chevron">
                    <Icon name="chevron" size={12} />
                  </span>
                  <Icon name="folder" size={14} />
                  <strong title={group.project} dir="auto">
                    {group.project}
                  </strong>
                  <span>{group.rows.length}</span>
                </button>
                <div
                  className="ui-tlsc__collapse"
                  data-open={expanded || undefined}
                  inert={!expanded}
                  aria-hidden={!expanded}
                >
                  <div className="ui-tlsc__clip" role="group" id={`${id}-group-${groupIndex}`}>
                    {group.rows.map((task, index) => {
                      const needs = agentTaskNeeds(task),
                        done = task.steps?.filter((step) => step.done).length ?? 0,
                        total = task.steps?.length ?? 0,
                        age = agentTaskAge(task.updatedAt, now),
                        status = agentTaskStatus(task, now);
                      const key = `task:${task.id}`;
                      return (
                        <button
                          type="button"
                          role="treeitem"
                          aria-level={2}
                          aria-setsize={group.rows.length}
                          aria-posinset={index + 1}
                          aria-selected={selected === task.id}
                          aria-label={`${task.title}, ${status}${needs ? `, ${labels.needsYou ?? "Needs you"}${needs > 1 ? ` (${needs})` : ""}` : ""}${total ? `, ${done} of ${total} steps` : ""}${task.artifacts?.length ? `, ${task.artifacts.length} ${task.artifacts.length === 1 ? "artifact" : "artifacts"}` : ""}, updated ${age.long}`}
                          key={task.id}
                          data-task-key={key}
                          data-done={task.done || undefined}
                          data-fresh={freshIds.includes(task.id) || undefined}
                          tabIndex={activeFocus === key ? 0 : -1}
                          className="ui-tlsc__row"
                          onFocus={() => setFocusKey(key)}
                          onClick={(event) => {
                            if ((event.target as HTMLElement).closest("[data-task-needs]")) {
                              onOpenInbox?.(task.id, task.asks?.[0]?.id);
                              return;
                            }
                            setSelected(task.id);
                            onSelect?.(task.id, { keyboard: event.detail === 0 });
                          }}
                        >
                          <TaskProgressRing
                            status={task.status}
                            value={done}
                            max={total}
                            done={task.done}
                            needs={!!needs}
                          />
                          <span className="ui-tlsc__main">
                            <span className="ui-tlsc__title" title={task.title} dir="auto">
                              {task.title}
                            </span>
                            <span className="ui-tlsc__status" title={status} dir="auto">
                              {status}
                            </span>
                          </span>
                          {needs > 0 && (
                            <span
                              data-task-needs=""
                              className="ui-tlsc__needs"
                              aria-hidden="true"
                              title={task.asks?.[0]?.question ?? `${needs} questions waiting`}
                            >
                              {labels.needsYou ?? "Needs you"}
                              {needs > 1 ? ` ${needs}` : ""}
                            </span>
                          )}
                          <span aria-hidden="true" className="ui-tlsc__steps">
                            {total ? `${done}/${total}` : ""}
                          </span>
                          <span aria-hidden="true" className="ui-tlsc__files">
                            {!!task.artifacts?.length && (
                              <>
                                <Icon name="document" size={12} />
                                {task.artifacts.length}
                              </>
                            )}
                          </span>
                          <span aria-hidden="true" className="ui-tlsc__time" title={`Updated ${age.long}`}>
                            {age.short}
                          </span>
                        </button>
                      );
                    })}
                    {group.rows.length === 0 && (
                      <p className="ui-tlsc__empty-group">{labels.emptyProject ?? "No tasks"}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {visible.length === 0 && groups.length === 0 && (
            <div className="ui-tlsc__empty">
              <Icon name="tasks" size={28} />
              <h2>
                {tab === "done"
                  ? (labels.emptyDone ?? "No completed tasks yet")
                  : (labels.emptyActive ?? "No active tasks")}
              </h2>
              <p>{tab === "active" ? "Create a task to get started." : "Completed work will appear here."}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export type TaskInspectorLabels = {
  needsYou?: string;
  decide?: string;
  decisionOne?: string;
  decisionMany?: string;
  happened?: string;
  showAgents?: string;
  status?: string;
  project?: string;
  started?: string;
  steps?: string;
  artifacts?: string;
  decided?: string;
  selectTask?: string;
};
export type TaskInspectorProps = {
  task?: AgentTask | null;
  onOpenInbox?: (taskId: string, itemId?: string) => void;
  onOpenArtifact?: (name: string) => void;
  onShowAgents?: (taskId: string) => void;
  labels?: TaskInspectorLabels;
  focusRequest?: number;
  now?: number;
  className?: string;
};

/** Task context and its outputs, with one direct route to what waits in the Inbox. */
export function TaskInspector({
  task,
  onOpenInbox,
  onOpenArtifact,
  onShowAgents,
  labels = {},
  focusRequest,
  now = Date.now(),
  className,
}: TaskInspectorProps) {
  const root = useRef<HTMLElement>(null),
    id = useId();
  useEffect(() => {
    if (!focusRequest) return;
    const frame = requestAnimationFrame(() => {
      const target = root.current?.querySelector<HTMLButtonElement>("[data-task-decide]");
      if (target) target.focus({ preventScroll: true });
      else root.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusRequest, task?.id]);
  if (!task)
    return (
      <section className={["ui-tinc", className].filter(Boolean).join(" ")}>
        <style href="ui-agent-tasks-clean" precedence="default">
          {css}
        </style>
        <div className="ui-tinc__empty">
          <Icon name="tasks" size={28} />
          <p>{labels.selectTask ?? "Select a task"}</p>
        </div>
      </section>
    );
  const steps = task.steps ?? [],
    done = steps.filter((step) => step.done).length,
    needs = agentTaskNeeds(task),
    first = steps.findIndex((step) => !step.done),
    status = agentTaskStatus(task, now),
    ask = task.asks?.[0];
  return (
    <section
      ref={root}
      className={["ui-tinc", className].filter(Boolean).join(" ")}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <style href="ui-agent-tasks-clean" precedence="default">
        {css}
      </style>
      <h2 className="ui-tinc__sr" id={`${id}-title`}>
        {task.title}
      </h2>
      <div className="ui-tinc__body">
        {task.goal && (
          <p className="ui-tinc__goal" dir="auto">
            {task.goal}
          </p>
        )}
        {needs > 0 && (
          <div className="ui-tinc__needs">
            <div className="ui-tinc__needs-text">
              <div>
                <span className="ui-tinc__badge">{labels.needsYou ?? "Needs you"}</span>
                <span className="ui-tinc__waiting">
                  {needs === 1
                    ? (labels.decisionOne ?? "1 decision waiting")
                    : (labels.decisionMany ?? "{count} decisions waiting").replace("{count}", String(needs))}
                </span>
              </div>
              {ask?.question && (
                <span className="ui-tinc__question" dir="auto">
                  {ask.question}
                </span>
              )}
            </div>
            <button
              type="button"
              data-task-decide=""
              className="ui-tinc__decide"
              aria-label={`${labels.decide ?? "Decide"} in Inbox${ask?.question ? `: ${ask.question}` : ""}`}
              disabled={!onOpenInbox}
              onClick={() => onOpenInbox?.(task.id, ask?.id)}
            >
              {labels.decide ?? "Decide"}
            </button>
          </div>
        )}
        <dl className="ui-tinc__props">
          <div>
            <dt>{labels.status ?? "Status"}</dt>
            <dd>
              <TaskProgressRing status={task.status} done={task.done} needs={!!needs} value={done} max={steps.length} />
              <span title={status} dir="auto">
                {status}
              </span>
              {steps.length > 0 && (
                <small>
                  {done}/{steps.length}
                </small>
              )}
            </dd>
          </div>
          <div>
            <dt>{labels.project ?? "Project"}</dt>
            <dd dir="auto">{task.project}</dd>
          </div>
          {task.started && (
            <div>
              <dt>{labels.started ?? "Started"}</dt>
              <dd>{task.started}</dd>
            </div>
          )}
        </dl>
        {steps.length > 0 && (
          <section className="ui-tinc__section">
            <h3>{labels.steps ?? "Steps"}</h3>
            <ol className="ui-tinc__steps">
              {steps.map((step, index) => {
                const state = step.done ? "done" : index === first ? (needs ? "you" : "now") : "later";
                return (
                  <li key={`${index}-${step.label}`} data-state={state}>
                    <span className="ui-tinc__step-mark" aria-hidden="true">
                      {step.done && <Icon name="check" size={10} />}
                    </span>
                    <span className="ui-tinc__step-label" title={step.label} dir="auto">
                      {step.label}
                    </span>
                    <span className="ui-tinc__sr">
                      {state === "done"
                        ? ", done"
                        : state === "you"
                          ? ", waiting on you"
                          : state === "now"
                            ? ", in progress"
                            : ""}
                    </span>
                    {state === "you" && (
                      <button
                        type="button"
                        className="ui-tinc__step-ask"
                        aria-label={`Open decision${ask?.question ? `: ${ask.question}` : ""}`}
                        onClick={() => onOpenInbox?.(task.id, ask?.id)}
                      >
                        <Icon name="warning" size={12} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}
        {!!task.history?.length && (
          <section className="ui-tinc__section">
            <h3>{labels.happened ?? "What happened so far"}</h3>
            <ul className="ui-tinc__history">
              {task.history.map((line, index) => (
                <li key={index} dir="auto">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}
        {!!task.artifacts?.length && (
          <section className="ui-tinc__section">
            <h3>
              {labels.artifacts ?? "Artifacts"}
              <span>{task.artifacts.length}</span>
            </h3>
            <div className="ui-tinc__files">
              {task.artifacts.map((name) => (
                <button type="button" key={name} title={name} onClick={() => onOpenArtifact?.(name)}>
                  <span
                    data-kind={
                      name.includes(".")
                        ? name.endsWith(".csv")
                          ? "table"
                          : /\.(json|ya?ml)$/.test(name)
                            ? "code"
                            : "document"
                        : "folder"
                    }
                  >
                    <Icon
                      name={name.includes(".") ? (name.endsWith(".csv") ? "table" : "document") : "folder"}
                      size={12}
                    />
                  </span>
                  <span dir="auto">{name}</span>
                </button>
              ))}
            </div>
          </section>
        )}
        {!!task.decided?.length && (
          <section className="ui-tinc__section">
            <h3>{labels.decided ?? "Decided"}</h3>
            <ul className="ui-tinc__decided">
              {task.decided.map((item, index) => (
                <li key={index}>
                  <Icon name="check" size={13} />
                  <span>
                    <strong title={item.question} dir="auto">
                      {item.question}
                    </strong>
                    <small title={item.answer} dir="auto">
                      {item.answer}
                      {item.at != null &&
                        ` · ${now - item.at >= 86400000 && now - item.at < 172800000 ? "yesterday" : agentTaskAge(item.at, now).long}`}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <footer>
          <button type="button" disabled={!onShowAgents} onClick={() => onShowAgents?.(task.id)}>
            {labels.showAgents ?? "Show agents"}
            <Icon name="chevron" size={12} />
          </button>
        </footer>
      </div>
    </section>
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
      <style href="ui-agent-tasks-clean" precedence="default">
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
      <style href="ui-agent-tasks-clean" precedence="default">
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

export function createDefaultAgentTasks(now = Date.now()): AgentTask[] {
  return [
    {
      id: "ingest",
      title: "Ingest pipeline",
      project: "Northwind",
      status: "running",
      statusText: "Picking a queue",
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
      asks: [
        {
          id: "queue",
          question: "Which queue should the ingest service use?",
          kind: "decision",
        },
      ],
      updatedAt: now - 4 * 60000,
      goal: "Take in Northwind's order events and keep a day of them to replay after a bad deploy.",
      started: "Mon, Nov 3",
      history: [
        "Asked you which queue to use",
        "Load test passed at 20k events a minute",
        "Wrote the design doc and the event schema",
      ],
      decided: [
        {
          question: "Which format for the events?",
          answer: "JSON with a version field",
          at: now - 3 * 86400000,
        },
      ],
    },
    {
      id: "dashboard",
      title: "Client dashboard",
      project: "Northwind",
      status: "running",
      statusText: "Choosing an empty state",
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
      artifacts: ["dashboard-spec.md", "usage-sample.csv", "usage-page.png"],
      asks: [
        {
          id: "empty-state",
          question: "Which empty state for the dashboard?",
          kind: "pick",
        },
      ],
      updatedAt: now - 18 * 60000,
      goal: "A usage dashboard Northwind's team opens every morning.",
      started: "Tue, Oct 28",
      history: [
        "Drew three empty states for you to pick from",
        "Usage page shipped with daily bars",
        "Northwind opened it 31 times this week",
      ],
      decided: [
        {
          question: "Which chart for the usage page?",
          answer: "Bars",
          at: now - 2 * 86400000,
        },
      ],
    },
    {
      id: "weekly",
      title: "Weekly update",
      project: "Northwind",
      status: "running",
      statusText: "Ready to send",
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
      asks: [
        {
          id: "weekly",
          question: "Send the weekly update to Northwind?",
          kind: "approval",
        },
      ],
      updatedAt: now - 42 * 60000,
      goal: "Tell Northwind what shipped this week and what needs their answer.",
      started: "Today",
      history: ["Drafted the email for you to approve", "Collected 14 merged changes from this week"],
    },
    {
      id: "onboarding",
      title: "Onboarding emails",
      project: "Northwind",
      status: "running",
      statusText: "Writing the draft",
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
      updatedAt: now - 12 * 60000,
      goal: "Three short emails that walk a new Northwind account to its first sync.",
      started: "Thu, Nov 5",
      history: ["Writing the second email", "First email drafted", "Outline agreed in the thread"],
    },
    {
      id: "webhooks",
      title: "Billing webhooks",
      project: "Platform",
      status: "running",
      statusText: "Deploying to staging",
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
      updatedAt: now - 6 * 60000,
      goal: "Retry failed billing webhooks and tell the client when one gives up.",
      started: "Wed, Nov 4",
      history: ["Deploying to staging", "All 48 tests pass", "Added a dead letter queue and an alert"],
    },
    {
      id: "api",
      title: "API migration",
      project: "Platform",
      status: "running",
      statusText: "Deciding the v1 end date",
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
      asks: [
        {
          id: "api",
          question: "Keep the old API until March or drop it now?",
          kind: "decision",
        },
      ],
      updatedAt: now - 180 * 60000,
      goal: "Move every client from the v1 API to v2 without breaking a running integration.",
      started: "Mon, Oct 20",
      history: [
        "Asked you whether to keep v1 until March",
        "Two clients still call v1 – about 4% of traffic",
        "Our own apps run on v2",
      ],
    },
    {
      id: "triage",
      title: "Support triage",
      project: "Platform",
      status: "running",
      statusText: "Rolling out to all queues",
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
      updatedAt: now - 25 * 60000,
      goal: "Sort and summarise incoming support tickets before anyone reads them.",
      started: "Thu, Oct 30",
      history: ["Runs on 2 of 5 support queues", "First weekly eval: 94% match a human summary"],
      decided: [
        {
          question: "Which model should summarise support tickets?",
          answer: "The small model",
          at: now - 1 * 86400000,
        },
      ],
    },
    {
      id: "launch",
      title: "Launch post",
      project: "Evalkit",
      status: "running",
      statusText: "Picking the tone",
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
      asks: [
        {
          id: "launch",
          question: "What tone should the launch post have?",
          kind: "question",
        },
      ],
      updatedAt: now - 60 * 60000,
      goal: "Announce the open-source release of the eval kit.",
      started: "Wed, Nov 5",
      history: ["Asked you which tone the post should have", "Outline ready, with the benchmark numbers"],
    },
    {
      id: "benchmarks",
      title: "Benchmark suite",
      project: "Evalkit",
      status: "running",
      statusText: "Running the evals",
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
      updatedAt: now - 2 * 60000,
      goal: "Run the kit against five open models so the launch post has real numbers.",
      started: "Tue, Nov 4",
      history: ["Running the last two models", "Three of five models done", "Datasets prepared – 2,400 cases"],
    },
    {
      id: "usage",
      title: "Usage page",
      project: "Northwind",
      status: "running",
      statusText: "Done · Fri",
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
      updatedAt: now - 2880 * 60000,
      done: true,
      goal: "Show Northwind their daily usage, one bar per day.",
      started: "Tue, Oct 28",
      history: ["Shipped to Northwind", "Daily bars, as you picked"],
      decided: [
        {
          question: "Which chart for the usage page?",
          answer: "Bars",
          at: now - 2 * 86400000,
        },
      ],
    },
    {
      id: "auth",
      title: "Auth refactor",
      project: "Platform",
      status: "running",
      statusText: "Done · Yesterday",
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
      updatedAt: now - 1440 * 60000,
      done: true,
      goal: "One sign-in flow for web and mobile before the demo.",
      started: "Fri, Oct 24",
      history: ["Deployed to staging before the demo", "Merged into main – 41 files, all checks green"],
      decided: [
        {
          question: "Merge the auth refactor before the demo?",
          answer: "Approved",
          at: now - 1 * 86400000,
        },
      ],
    },
    {
      id: "rate-limits",
      title: "Rate limits",
      project: "Platform",
      status: "running",
      statusText: "Done · Wed",
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
      updatedAt: now - 5760 * 60000,
      done: true,
      goal: "Per-client rate limits on the public API.",
      started: "Thu, Oct 29",
      history: ["Live for every client", "Limits per plan agreed"],
    },
    {
      id: "docs",
      title: "Docs site",
      project: "Evalkit",
      status: "running",
      statusText: "Done · Thu",
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
      updatedAt: now - 4320 * 60000,
      done: true,
      goal: "A docs site for the eval kit, ready before the launch.",
      started: "Mon, Nov 2",
      history: ["Published with four guides", "Structure agreed in the thread"],
    },
  ];
}

export const defaultAgentTaskFiles: ArtifactFile[] = [
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
];

export const defaultTaskSources: WorkspaceSource[] = [
  { name: "staging", description: "Ingest pipeline", artifact: "staging", kind: "folder" },
  { name: "benchmarks.csv", description: "Benchmark suite", artifact: "benchmarks.csv", kind: "table" },
  { name: "migration-plan.md", description: "API migration", artifact: "migration-plan.md", kind: "document" },
];
export type AgentTasksLabels = TaskListLabels & TaskInspectorLabels & { create?: string; placeholder?: string };
export type AgentTasksScreenProps = Omit<
  AppShellProps,
  "children" | "panel" | "panelTitle" | "navigation" | "project" | "defaultProject" | "onProjectChange"
> & {
  tasks?: AgentTask[];
  defaultTasks?: AgentTask[];
  onTasksChange?: (tasks: AgentTask[]) => void;
  projects?: string[];
  tab?: TaskListTab;
  defaultTab?: TaskListTab;
  onTabChange?: (tab: TaskListTab) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  onCreate?: (task: AgentTask) => void;
  createOpen?: boolean;
  defaultCreateOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
  project?: string;
  defaultProject?: string;
  onProjectChange?: (project: string) => void;
  collapsedProjects?: string[];
  defaultCollapsedProjects?: string[];
  onCollapsedProjectsChange?: (projects: string[]) => void;
  onOpenInbox?: (taskId: string, itemId?: string) => void;
  onOpenArtifact?: (taskId: string, name: string) => void;
  onArtifactChange?: (name: string, file: ArtifactFile) => void;
  files?: ArtifactFile[];
  defaultFiles?: ArtifactFile[];
  onFilesChange?: (files: ArtifactFile[]) => void;
  openFiles?: string[];
  defaultOpenFiles?: string[];
  onOpenFilesChange?: (names: string[]) => void;
  activeFile?: string;
  defaultActiveFile?: string;
  onActiveFileChange?: (name: string) => void;
  suggested?: WorkspaceSource[];
  labels?: AgentTasksLabels;
  onOpenTool?: (tool: WorkspaceToolKind) => void;
  renderTool?: (tool: WorkspaceToolKind) => ReactNode;
  onOpenUrl?: (url: string) => void;
};

/** A task/project overview with a persistent task tab and editable artifact tabs in the shell's work area. */
export function AgentTasksScreen({
  tasks: tasksProp,
  defaultTasks,
  onTasksChange,
  projects: projectOrder,
  tab: tabProp,
  defaultTab = "active",
  onTabChange,
  selected: selectedProp,
  defaultSelected = "ingest",
  onSelectedChange,
  onSelect,
  onCreate,
  createOpen: createProp,
  defaultCreateOpen = false,
  onCreateOpenChange,
  project: projectProp,
  defaultProject,
  onProjectChange,
  collapsedProjects,
  defaultCollapsedProjects,
  onCollapsedProjectsChange,
  onOpenInbox,
  onOpenArtifact,
  onArtifactChange,
  files: filesProp,
  defaultFiles = defaultAgentTaskFiles,
  onFilesChange,
  openFiles: openedProp,
  defaultOpenFiles,
  onOpenFilesChange,
  activeFile: activeProp,
  defaultActiveFile,
  onActiveFileChange,
  panelOpen: panelProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  suggested = defaultTaskSources,
  labels = {},
  onOpenTool,
  renderTool,
  onOpenUrl,
  onNavigate,
  className,
  style,
  ...shellProps
}: AgentTasksScreenProps) {
  const [initialTasks] = useState(() => defaultTasks ?? createDefaultAgentTasks());
  const [tasks, setTasks] = useControllable(tasksProp, initialTasks, onTasksChange),
    [tab, setTab] = useControllable(tabProp, defaultTab, onTabChange),
    [selected, setSelected] = useControllable<string | null>(selectedProp, defaultSelected, onSelectedChange),
    [creating, setCreating] = useControllable(createProp, defaultCreateOpen, onCreateOpenChange);
  const projects = [...new Set([...(projectOrder ?? []), ...tasks.map((task) => task.project || "Workspace")])];
  const [project, setProject] = useControllable(
    projectProp,
    defaultProject ?? projects[0] ?? "Workspace",
    onProjectChange,
  );
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange),
    [opened, setOpened] = useControllable(
      openedProp,
      defaultOpenFiles ?? (defaultSelected ? ["task"] : []),
      onOpenFilesChange,
    ),
    [active, setActive] = useControllable(
      activeProp,
      defaultActiveFile ?? defaultOpenFiles?.[0] ?? (defaultSelected ? "task" : ""),
      onActiveFileChange,
    ),
    [panelOpen, setPanelOpen] = useControllable(panelProp, false, onPanelOpenChange);
  const [focusRequest, setFocusRequest] = useState(0),
    [freshIds, setFreshIds] = useState<string[]>([]),
    [notice, setNotice] = useState("");
  const [startTabs, setStartTabs] = useState<string[]>([]),
    [toolTabs, setToolTabs] = useState<{ id: string; kind: WorkspaceToolKind }[]>([]),
    [toolValues, setToolValues] = useState<Record<string, string>>({}),
    [toolLines, setToolLines] = useState<Record<string, string[]>>({});
  const root = useRef<HTMLDivElement>(null),
    sequence = useRef(0),
    layout = useRef<boolean | undefined>(undefined),
    fileRef = useRef(files);
  fileRef.current = files;
  const current = tasks.find((task) => task.id === selected) ?? null;
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const narrow = el.getBoundingClientRect().width < 900;
      if (panelProp === undefined) {
        if (layout.current === undefined)
          setPanelOpen(defaultPanelOpen && opened.some((name) => name !== "task" || !!current) && !narrow);
        else if (narrow && !layout.current) setPanelOpen(false);
      }
      layout.current = narrow;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [panelProp]);
  useEffect(() => {
    if (!freshIds.length) return;
    const timer = setTimeout(() => setFreshIds([]), 500);
    return () => clearTimeout(timer);
  }, [freshIds]);
  const closePanel = () => {
    setPanelOpen(false);
    requestAnimationFrame(() => {
      const rows = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-task-key]") ?? [])];
      rows.find((row) => row.dataset.taskKey === `task:${selected}`)?.focus({ preventScroll: true });
    });
  };
  const openInbox = (taskId: string, itemId?: string) =>
    onOpenInbox ? onOpenInbox(taskId, itemId) : onNavigate?.("Inbox");
  const openTask = (id: string, keyboard = false) => {
    setSelected(id);
    if (!opened.includes("task")) setOpened([...opened, "task"]);
    setActive("task");
    setPanelOpen(true);
    setFocusRequest((previous) => (keyboard ? previous + 1 : 0));
    onSelect?.(id);
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
  const openArtifact = (name: string, replace?: string) => {
    if (!fileRef.current.some((file) => file.name === name)) {
      const file: ArtifactFile = { kind: "document", name, content: `# ${name}\n\n`, updated: "Just now" };
      updateFiles([...fileRef.current, file]);
    }
    const next = replace ? opened.map((id) => (id === replace ? name : id)) : [...opened, name];
    setOpened([...new Set(next)]);
    if (replace) setStartTabs((tabs) => tabs.filter((id) => id !== replace));
    setActive(name);
    setPanelOpen(true);
    onOpenArtifact?.(selected ?? "", name);
  };
  const changeOpened = (next: string[]) => {
    setOpened(next);
    setStartTabs((tabs) => tabs.filter((id) => next.includes(id)));
    setToolTabs((tabs) => tabs.filter((tab) => next.includes(tab.id)));
    if (!next.length) closePanel();
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
  const create = (draft: TaskDraft) => {
    const now = Date.now(),
      task: AgentTask = {
        id: `task-${now}-${++sequence.current}`,
        title: draft.title.split("\n")[0],
        goal: draft.title,
        project: draft.project,
        status: "planning",
        updatedAt: now,
        started: "Today",
        history: ["You asked for it – the orchestrator is planning the steps"],
      };
    const index = tasks.findIndex((item) => item.project === task.project);
    setTasks(index < 0 ? [...tasks, task] : [...tasks.slice(0, index), task, ...tasks.slice(index)]);
    setTab("active");
    setSelected(task.id);
    setFreshIds([task.id]);
    if (!opened.includes("task")) setOpened([...opened, "task"]);
    setActive("task");
    setPanelOpen(true);
    setFocusRequest(0);
    setNotice(`Task created in ${task.project}`);
    onCreate?.(task);
  };
  const toggleCreate = () => {
    if (creating) root.current?.querySelector<HTMLTextAreaElement>(".ui-tcrc textarea")?.focus({ preventScroll: true });
    else setCreating(true);
  };
  const closeCreate = () => {
    setCreating(false);
    requestAnimationFrame(() =>
      root.current?.querySelector<HTMLButtonElement>(".ui-tlsc__new")?.focus({ preventScroll: true }),
    );
  };
  const navigation: AppRailItem[] = [
    { label: "Thread", icon: <Icon name="chat" /> },
    {
      label: "Inbox",
      icon: <Icon name="inbox" />,
      count: tasks.reduce((count, task) => count + agentTaskNeeds(task), 0),
    },
    { label: "Tasks", icon: <Icon name="tasks" /> },
    { label: "Memory", icon: <Icon name="memory" /> },
    { label: "Settings", icon: <Icon name="settings" />, section: "Workspace" },
  ];
  const searchGroups: CommandMenuGroup[] = [
    {
      id: "tasks",
      label: labels.tasks ?? "Tasks",
      commands: [
        { id: "create-task", label: labels.newTask ?? "New task", icon: <Icon name="plus" />, onSelect: toggleCreate },
        ...tasks.map((task) => ({
          id: `task:${task.id}`,
          label: task.title,
          description: `${task.project} · ${agentTaskStatus(task, Date.now())}`,
          icon: <Icon name="tasks" />,
          onSelect: () => openTask(task.id, true),
        })),
      ],
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
  const extraTabs: ArtifactWorkspaceTab[] = [
    {
      id: "task",
      label: current?.title ?? "Task",
      icon: <Icon name="tasks" size={14} />,
      content: (
        <TaskInspector
          task={current}
          labels={labels}
          onOpenInbox={openInbox}
          onOpenArtifact={openArtifact}
          onShowAgents={() => onNavigate?.("Agent Orchestration")}
          focusRequest={focusRequest}
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
  return (
    <div ref={root} data-task-shortcuts="" className={["ui-atsc", className].filter(Boolean).join(" ")} style={style}>
      <style href="ui-agent-tasks-clean" precedence="default">
        {css}
      </style>
      <AppShell
        {...shellProps}
        defaultChats={shellProps.defaultChats ?? []}
        className="ui-atsc__shell"
        defaultActive={shellProps.defaultActive ?? "Tasks"}
        navigation={navigation}
        commands={shellProps.commands ?? searchGroups}
        onNavigate={onNavigate}
        panelOpen={panelOpen}
        onPanelOpenChange={setPanelOpen}
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
            onClose={closePanel}
            closeLabel="Close task"
            onOpenFile={(name) => onOpenArtifact?.(selected ?? "", name)}
          />
        }
      >
        <TaskList
          tasks={tasks}
          projects={projectOrder}
          tab={tab}
          onTabChange={setTab}
          selected={selected}
          onSelect={(id, options) => openTask(id, options.keyboard)}
          collapsedProjects={collapsedProjects}
          defaultCollapsedProjects={defaultCollapsedProjects}
          onCollapsedProjectsChange={onCollapsedProjectsChange}
          onOpenInbox={openInbox}
          onNewTask={toggleCreate}
          createOpen={creating}
          freshIds={freshIds}
          labels={labels}
          createForm={
            creating ? (
              <TaskCreate
                projects={projects}
                project={project}
                onProjectChange={setProject}
                onCreate={create}
                onClose={closeCreate}
                createLabel={labels.create}
                placeholder={labels.placeholder}
              />
            ) : undefined
          }
        />
      </AppShell>
      <span className="ui-atsc__sr" role="status" aria-live="polite">
        {notice}
      </span>
    </div>
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
  padding: 7px 8px 8px;
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
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  margin-bottom: 10px;
}
.ui-asc__nav-workspace {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  padding: 4px 7px;
  text-align: left;
}
.ui-asc__nav-workspace > span {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  background: var(--ui-asc-card);
  border-radius: 6px;
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  font-size: 10px;
  font-weight: 500;
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
  gap: 7px;
  width: 100%;
  height: 32px;
  border-radius: 8px !important;
  padding: 0 10px !important;
  background: var(--ui-asc-card) !important;
  box-shadow: 0 0 0 0.5px var(--ui-asc-line);
  color: var(--ui-asc-muted) !important;
  margin-bottom: 11px;
  text-align: left;
  font-size: 12px !important;
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
  min-height: 36px;
  font-weight: 500;
  margin-top: auto;
}
.ui-asc__side-col[data-navigation] .ui-asc__user-initials {
  width: 20px;
  height: 20px;
  font-size: 9px;
  color: var(--ui-asc-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-asc__side-col[data-navigation] .ui-asc__account-row > svg {
  color: var(--ui-asc-faint);
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

.ui-tprc {
  --ui-tprc-muted: rgba(0, 0, 0, 0.27);
  --ui-tprc-running: #13b3a0;
  --ui-tprc-waiting: #e8b000;
  --ui-tprc-paused: #f28a2e;
  --ui-tprc-done: #5fc88a;
  display: block;
  flex: none;
  color: var(--ui-tprc-running);
  overflow: visible;
  -webkit-font-smoothing: antialiased;
}
.ui-tprc,
.ui-tprc * {
  box-sizing: border-box;
}
.ui-tprc[data-tone="planning"] {
  color: var(--ui-tprc-muted);
}
.ui-tprc[data-tone="waiting"] {
  color: var(--ui-tprc-waiting);
}
.ui-tprc[data-tone="paused"] {
  color: var(--ui-tprc-paused);
}
.ui-tprc[data-tone="done"] {
  color: var(--ui-tprc-done);
}
.ui-tprc__track {
  stroke: currentColor;
  stroke-width: 1.3;
}
.ui-tprc[data-tone="planning"] .ui-tprc__track {
  stroke-dasharray: 1.6 2;
}
.ui-tprc__value {
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: butt;
  transition: stroke-dasharray 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .ui-tprc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tprc {
  --ui-tprc-muted: rgba(255, 255, 255, 0.3);
  --ui-tprc-running: #4fc3b4;
  --ui-tprc-waiting: #e6c24d;
  --ui-tprc-paused: #f2a15c;
  --ui-tprc-done: #7dcf9f;
}

.ui-tcrc {
  --ui-tcrc-card: #fff;
  --ui-tcrc-ink: rgba(0, 0, 0, 0.88);
  --ui-tcrc-text: rgba(0, 0, 0, 0.61);
  --ui-tcrc-muted: rgba(0, 0, 0, 0.45);
  --ui-tcrc-faint: rgba(0, 0, 0, 0.27);
  --ui-tcrc-line: rgba(0, 0, 0, 0.06);
  --ui-tcrc-fill: rgba(0, 0, 0, 0.04);
  --ui-tcrc-focus: rgba(0, 96, 226, 0.35);
  --ui-tcrc-shadow: 0 0 0 0.5px var(--ui-tcrc-line), 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
  width: 100%;
  min-height: 48px;
  padding: 8px 6px 8px 12px;
  border-radius: 8px;
  background: var(--ui-tcrc-card);
  box-shadow: var(--ui-tcrc-shadow);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tcrc-ink);
  container: ui-tcrc / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tcrc-drop 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tcrc,
.ui-tcrc *,
.ui-tcrc *::before,
.ui-tcrc *::after {
  box-sizing: border-box;
}
.ui-tcrc > .ui-tprc {
  margin: 9px 4px 0 0;
}
.ui-tcrc textarea {
  flex: 1;
  min-width: 0;
  min-height: 32px;
  max-height: 168px;
  padding: 6px 0;
  overflow-y: auto;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  outline: none;
  resize: none;
  overscroll-behavior: contain;
}
.ui-tcrc textarea::placeholder {
  color: var(--ui-tcrc-faint);
}
.ui-tcrc:has(textarea:focus) {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-tcrc button {
  font: inherit;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  flex: none;
}
.ui-tcrc button:focus-visible {
  outline: 2px solid var(--ui-tcrc-focus);
  outline-offset: -2px;
}
.ui-tcrc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tcrc__project,
.ui-tcrc__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  margin-top: 2px;
  border-radius: 6px;
}
.ui-tcrc__project {
  max-width: 160px;
  color: var(--ui-tcrc-text) !important;
}
.ui-tcrc__project > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.ui-tcrc__project:hover {
  background: var(--ui-tcrc-fill);
}
.ui-tcrc__submit {
  background: var(--ui-tcrc-ink) !important;
  color: var(--ui-tcrc-card) !important;
  font-weight: 500 !important;
}
.ui-tcrc__submit:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tcrc__menu {
  width: 208px;
  max-width: calc(100vw - 24px);
  overflow: auto;
  padding: 5px;
  border-radius: 10px;
  background: var(--ui-tcrc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-tcrc-line),
    0 6px 20px rgba(0, 0, 0, 0.12);
  animation: ui-tcrc-drop 180ms both;
}
.ui-tcrc__menu-label {
  display: block;
  padding: 6px 9px;
  color: var(--ui-tcrc-muted);
  font-size: 11px;
}
.ui-tcrc__menu > button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding: 6px 9px;
  text-align: left;
  border-radius: 5px;
}
.ui-tcrc__menu > button > span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tcrc__menu > button:hover {
  background: var(--ui-tcrc-fill);
}
.ui-tcrc__menu > button > svg {
  color: var(--ui-tcrc-muted);
}
.ui-tcrc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@keyframes ui-tcrc-drop {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
@container ui-tcrc (max-width:460px) {
  .ui-tcrc__project {
    max-width: 110px;
  }
  .ui-tcrc__project > svg:first-child {
    display: none;
  }
  .ui-tcrc > .ui-tprc {
    margin-right: 0;
  }
  .ui-tcrc {
    gap: 5px;
  }
  .ui-tcrc__submit {
    padding-inline: 7px;
  }
}
@media (pointer: coarse) {
  .ui-tcrc__project,
  .ui-tcrc__submit {
    min-height: 36px;
  }
  .ui-tcrc__menu > button {
    min-height: 36px;
  }
  .ui-tcrc textarea {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tcrc,
  .ui-tcrc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tcrc {
  --ui-tcrc-card: #1c1c1e;
  --ui-tcrc-ink: rgba(255, 255, 255, 0.9);
  --ui-tcrc-text: rgba(255, 255, 255, 0.62);
  --ui-tcrc-muted: rgba(255, 255, 255, 0.46);
  --ui-tcrc-faint: rgba(255, 255, 255, 0.3);
  --ui-tcrc-line: rgba(255, 255, 255, 0.08);
  --ui-tcrc-fill: rgba(255, 255, 255, 0.06);
  --ui-tcrc-focus: rgba(77, 141, 255, 0.5);
}

.ui-tlsc {
  --ui-tlsc-card: #fff;
  --ui-tlsc-ink: rgba(0, 0, 0, 0.88);
  --ui-tlsc-text: rgba(0, 0, 0, 0.61);
  --ui-tlsc-muted: rgba(0, 0, 0, 0.45);
  --ui-tlsc-faint: rgba(0, 0, 0, 0.27);
  --ui-tlsc-line: rgba(0, 0, 0, 0.06);
  --ui-tlsc-fill: rgba(0, 0, 0, 0.04);
  --ui-tlsc-hover: rgba(0, 0, 0, 0.02);
  --ui-tlsc-focus: #0060e2;
  --ui-tlsc-row-height: 40px;
  --ui-tlsc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  height: 100%;
  min-height: 0;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--ui-tlsc-card);
  color: var(--ui-tlsc-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-tlsc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-tlsc,
.ui-tlsc *,
.ui-tlsc *::before,
.ui-tlsc *::after {
  box-sizing: border-box;
}
.ui-tlsc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-tlsc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tlsc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tlsc button:focus-visible {
  outline: 2px solid var(--ui-tlsc-focus);
  outline-offset: -2px;
}
.ui-tlsc__head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
  height: 48px;
  padding: 0 12px 0 20px;
  box-shadow: inset 0 -0.5px var(--ui-tlsc-line);
}
.ui-tlsc__head h1 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.ui-tlsc__head h1 > span {
  font-weight: 400;
  color: var(--ui-tlsc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tlsc__tabs {
  display: flex;
  gap: 2px;
}
.ui-tlsc__tabs button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  color: var(--ui-tlsc-muted);
}
.ui-tlsc__tabs button[aria-selected="true"] {
  background: var(--ui-tlsc-fill);
  color: var(--ui-tlsc-ink);
}
.ui-tlsc__new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-left: auto;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  box-shadow:
    0 0 0 0.5px var(--ui-tlsc-line),
    0 1px 2px rgba(0, 0, 0, 0.04);
  font-weight: 500 !important;
  white-space: nowrap;
}
.ui-tlsc__new > svg,
.ui-tlsc__new > kbd {
  color: var(--ui-tlsc-faint);
}
.ui-tlsc__new > kbd {
  font: 12px/1 inherit;
  font-family: inherit;
  font-weight: 400;
}
.ui-tlsc__create {
  margin: 8px 8px 0;
  flex: none;
}
.ui-tlsc__create[hidden] {
  display: none;
}
.ui-tlsc__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-tlsc-line) transparent;
}
.ui-tlsc__tree {
  padding: 8px 8px 24px;
}
.ui-tlsc__group + .ui-tlsc__group {
  margin-top: 12px;
}
.ui-tlsc__group-head {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 32px;
  padding: 0 12px 0 8px;
  border-radius: 8px;
  text-align: left;
}
.ui-tlsc__group-head:hover {
  background: var(--ui-tlsc-hover);
}
.ui-tlsc__group-head > strong {
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tlsc__group-head > span:last-child {
  color: var(--ui-tlsc-faint);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-tlsc__chevron {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  color: var(--ui-tlsc-faint);
  transition: rotate 200ms var(--ui-tlsc-ease);
}
.ui-tlsc__group-head[aria-expanded="false"] .ui-tlsc__chevron {
  rotate: -90deg;
}
.ui-tlsc__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 240ms var(--ui-tlsc-ease);
}
.ui-tlsc__collapse[data-open] {
  grid-template-rows: 1fr;
}
.ui-tlsc__clip {
  min-height: 0;
  overflow: hidden;
}
.ui-tlsc__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: var(--ui-tlsc-row-height);
  padding: 0 12px;
  border-radius: 8px;
  text-align: left;
  transition: background-color 140ms;
}
.ui-tlsc__row > .ui-tprc {
  margin: 0 1px;
}
.ui-tlsc__row:hover {
  background: var(--ui-tlsc-hover);
}
.ui-tlsc__row[aria-selected="true"] {
  background: var(--ui-tlsc-fill);
}
.ui-tlsc__main {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.ui-tlsc__title {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tlsc__status {
  flex: 0 100 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-tlsc-muted);
}
.ui-tlsc__row[data-done] .ui-tlsc__title {
  color: var(--ui-tlsc-text);
}
.ui-tlsc__needs {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  white-space: nowrap;
  background: rgba(255, 156, 0, 0.16);
  color: #cc4e00;
}
.ui-tlsc__needs:hover {
  filter: saturate(1.4);
}
.ui-tlsc__steps,
.ui-tlsc__files,
.ui-tlsc__time {
  flex: none;
  text-align: right;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-tlsc-faint);
}
.ui-tlsc__steps,
.ui-tlsc__time {
  width: 28px;
}
.ui-tlsc__files {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 34px;
}
.ui-tlsc__time {
  color: var(--ui-tlsc-muted);
}
.ui-tlsc__row[data-fresh] {
  overflow: hidden;
  animation: ui-tlsc-glide 420ms var(--ui-tlsc-ease) both;
}
.ui-tlsc__empty-group {
  display: flex;
  align-items: center;
  height: var(--ui-tlsc-row-height);
  padding: 0 12px 0 38px;
  margin: 0;
  color: var(--ui-tlsc-faint);
}
.ui-tlsc__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 24px;
  color: var(--ui-tlsc-muted);
  text-align: center;
}
.ui-tlsc__empty h2 {
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0 6px;
  color: var(--ui-tlsc-ink);
}
.ui-tlsc__empty p {
  margin: 0;
  font-size: 13px;
}
.ui-tlsc:not([data-keyboard]) :is(.ui-tlsc__row, .ui-tlsc__group-head):focus {
  outline: none;
}
@keyframes ui-tlsc-glide {
  from {
    height: 0;
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    height: var(--ui-tlsc-row-height);
    opacity: 1;
    transform: none;
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-tlsc__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@container ui-tlsc (max-width:560px) {
  .ui-tlsc__row {
    height: 52px;
    gap: 10px;
    padding-inline: 10px;
  }
  .ui-tlsc__row > .ui-tprc {
    align-self: flex-start;
    margin-top: 10px;
  }
  .ui-tlsc__main {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .ui-tlsc__status {
    font-size: 12px;
    line-height: 16px;
    flex: none;
  }
  .ui-tlsc__steps,
  .ui-tlsc__files {
    display: none;
  }
  .ui-tlsc__new kbd {
    display: none;
  }
  .ui-tlsc__head {
    gap: 8px;
  }
}
@container ui-tlsc (max-width:400px) {
  .ui-tlsc__new {
    width: 28px;
    padding: 0;
  }
  .ui-tlsc__new > span {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tlsc__tabs button,
  .ui-tlsc__new {
    min-height: 36px;
  }
  .ui-tlsc__row {
    min-height: 52px;
  }
  .ui-tlsc__group-head {
    min-height: 36px;
  }
  .ui-tlsc__new kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tlsc,
  .ui-tlsc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tlsc {
  --ui-tlsc-card: #1c1c1e;
  --ui-tlsc-ink: rgba(255, 255, 255, 0.9);
  --ui-tlsc-text: rgba(255, 255, 255, 0.62);
  --ui-tlsc-muted: rgba(255, 255, 255, 0.46);
  --ui-tlsc-faint: rgba(255, 255, 255, 0.3);
  --ui-tlsc-line: rgba(255, 255, 255, 0.08);
  --ui-tlsc-fill: rgba(255, 255, 255, 0.06);
  --ui-tlsc-hover: rgba(255, 255, 255, 0.03);
  --ui-tlsc-focus: #4d8dff;
}
:where(.dark, [data-theme="dark"]) .ui-tlsc__needs {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}

.ui-tinc {
  --ui-tinc-card: #fff;
  --ui-tinc-ink: rgba(0, 0, 0, 0.88);
  --ui-tinc-text: rgba(0, 0, 0, 0.61);
  --ui-tinc-muted: rgba(0, 0, 0, 0.45);
  --ui-tinc-faint: rgba(0, 0, 0, 0.27);
  --ui-tinc-line: rgba(0, 0, 0, 0.06);
  --ui-tinc-fill: rgba(0, 0, 0, 0.02);
  --ui-tinc-focus: #0060e2;
  --ui-tinc-blue: #0190fe;
  --ui-tinc-orange: #f28a2e;
  --ui-tinc-shadow: 0 0 0 0.5px var(--ui-tinc-line), 0 1px 2px rgba(0, 0, 0, 0.025);
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 18px 18px 16px;
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tinc-ink);
  container: ui-tinc / inline-size;
  -webkit-font-smoothing: antialiased;
  outline: none;
}
.ui-tinc,
.ui-tinc *,
.ui-tinc *::before,
.ui-tinc *::after {
  box-sizing: border-box;
}
.ui-tinc button {
  font: inherit;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.ui-tinc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tinc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tinc button:focus-visible {
  outline: 2px solid var(--ui-tinc-focus);
  outline-offset: -2px;
}
.ui-tinc__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}
.ui-tinc__goal {
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
  color: var(--ui-tinc-text);
}
.ui-tinc__needs {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  margin: 0 -10px;
  padding: 8px 8px 8px 10px;
  border-radius: 10px;
  background: var(--ui-tinc-card);
  box-shadow: var(--ui-tinc-shadow);
}
.ui-tinc__needs-text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}
.ui-tinc__needs-text > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ui-tinc__badge {
  font-size: 11px;
  line-height: 18px;
  font-weight: 500;
  padding: 0 6px;
  border-radius: 4px;
  white-space: nowrap;
  background: rgba(255, 156, 0, 0.16);
  color: #cc4e00;
}
.ui-tinc__waiting {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tinc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-tinc__question {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  line-height: 20px;
}
.ui-tinc__decide {
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-tinc-ink) !important;
  color: var(--ui-tinc-card) !important;
  font-weight: 500 !important;
  flex: none;
}
.ui-tinc__props {
  display: grid;
  gap: 2px;
  margin: 0;
}
.ui-tinc__props > div {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  align-items: center;
  min-height: 28px;
}
.ui-tinc__props dt {
  font-size: 12px;
  color: var(--ui-tinc-muted);
}
.ui-tinc__props dd {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
}
.ui-tinc__props dd > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tinc__props small {
  font-size: 12px;
  color: var(--ui-tinc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tinc__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-tinc__section h3 {
  display: flex;
  gap: 6px;
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-tinc-muted);
}
.ui-tinc__section h3 > span {
  font-weight: 400;
  color: var(--ui-tinc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tinc__steps {
  display: grid;
  margin: 0 -10px;
  padding: 6px 10px;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-tinc-fill);
}
.ui-tinc__steps li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
}
.ui-tinc__steps li:not(:last-child):after {
  content: "";
  position: absolute;
  top: 20px;
  bottom: -6px;
  left: 7px;
  width: 1px;
  background: var(--ui-tinc-line);
}
.ui-tinc__step-mark {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  flex: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.2px var(--ui-tinc-line);
  background: var(--ui-tinc-card);
  color: var(--ui-tinc-card);
}
.ui-tinc__steps li[data-state="done"] .ui-tinc__step-mark {
  background: var(--ui-tinc-blue);
  box-shadow: none;
}
.ui-tinc__steps li[data-state="you"] .ui-tinc__step-mark {
  background: color-mix(in srgb, var(--ui-tinc-orange) 18%, var(--ui-tinc-card));
  box-shadow: inset 0 0 0 1.5px var(--ui-tinc-orange);
}
.ui-tinc__steps li[data-state="now"] .ui-tinc__step-mark {
  background: color-mix(in srgb, var(--ui-tinc-blue) 18%, var(--ui-tinc-card));
  box-shadow: inset 0 0 0 1.5px var(--ui-tinc-blue);
}
.ui-tinc__step-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tinc__steps li:is([data-state="done"], [data-state="later"]) .ui-tinc__step-label {
  color: var(--ui-tinc-muted);
}
.ui-tinc__step-ask {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin-left: auto;
  padding: 0;
  border-radius: 3px;
  background: rgba(255, 156, 0, 0.16) !important;
  color: #cc4e00 !important;
}
.ui-tinc__history {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ui-tinc-text);
}
.ui-tinc__history li {
  position: relative;
  padding-left: 16px;
  overflow-wrap: anywhere;
}
.ui-tinc__history li:before {
  content: "";
  position: absolute;
  top: 8px;
  left: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ui-tinc-faint);
}
.ui-tinc__history li:first-child {
  color: var(--ui-tinc-ink);
}
.ui-tinc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-tinc__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  height: 26px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  background: var(--ui-tinc-fill);
}
.ui-tinc__files > button > span:first-child {
  display: flex;
  color: #2989df;
}
.ui-tinc__files > button > span[data-kind="table"] {
  color: #44ad76;
}
.ui-tinc__files > button > span[data-kind="code"] {
  color: #ed9540;
}
.ui-tinc__files > button > span[data-kind="folder"] {
  color: #e8b000;
}
.ui-tinc__files > button > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tinc__decided {
  display: grid;
  gap: 0;
  margin: 0 -10px;
  padding: 2px 10px;
  list-style: none;
  border-radius: 10px;
  background: var(--ui-tinc-card);
  box-shadow: var(--ui-tinc-shadow);
}
.ui-tinc__decided li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}
.ui-tinc__decided li + li {
  border-top: 0.5px solid var(--ui-tinc-line);
}
.ui-tinc__decided li > svg {
  color: #5fc88a;
  flex: none;
}
.ui-tinc__decided li > span {
  display: grid;
  min-width: 0;
}
.ui-tinc__decided strong {
  font-weight: 400;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tinc__decided small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tinc-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tinc footer {
  display: flex;
  justify-content: flex-end;
  min-height: 28px;
  margin: 0 -4px 0 -8px;
}
.ui-tinc footer > button {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--ui-tinc-faint);
}
.ui-tinc footer > button:hover {
  background: var(--ui-tinc-fill);
  color: var(--ui-tinc-text);
}
.ui-tinc footer > button svg {
  rotate: -90deg;
}
.ui-tinc__empty {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ui-tinc-muted);
}
.ui-tinc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-tinc (max-width:320px) {
  .ui-tinc__props > div {
    grid-template-columns: 60px minmax(0, 1fr);
  }
  .ui-tinc__needs {
    gap: 6px;
  }
  .ui-tinc__waiting {
    font-size: 11px;
  }
}
@media (pointer: coarse) {
  .ui-tinc button {
    min-height: 36px;
  }
  .ui-tinc__steps li {
    min-height: 32px;
  }
  .ui-tinc__step-ask {
    min-width: 32px;
  }
  .ui-tinc__files > button {
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tinc,
  .ui-tinc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tinc {
  --ui-tinc-card: #1c1c1e;
  --ui-tinc-ink: rgba(255, 255, 255, 0.9);
  --ui-tinc-text: rgba(255, 255, 255, 0.62);
  --ui-tinc-muted: rgba(255, 255, 255, 0.46);
  --ui-tinc-faint: rgba(255, 255, 255, 0.3);
  --ui-tinc-line: rgba(255, 255, 255, 0.08);
  --ui-tinc-fill: rgba(255, 255, 255, 0.025);
  --ui-tinc-focus: #4d8dff;
  --ui-tinc-blue: #4fb0fe;
  --ui-tinc-orange: #f2a15c;
}
:where(.dark, [data-theme="dark"]) .ui-tinc__badge,
:where(.dark, [data-theme="dark"]) .ui-tinc__step-ask {
  background: rgba(251, 106, 0, 0.15) !important;
  color: #ffa057 !important;
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

.ui-atsc {
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  container: ui-atsc / inline-size;
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
.ui-atsc,
.ui-atsc *,
.ui-atsc *::before,
.ui-atsc *::after {
  box-sizing: border-box;
}
.ui-atsc__shell {
  height: 100%;
}
.ui-atsc .ui-awc__tab {
  font-size: 13px !important;
  padding-right: 28px;
}
.ui-atsc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .ui-atsc,
  .ui-atsc * {
    scroll-behavior: auto !important;
  }
}

`;
