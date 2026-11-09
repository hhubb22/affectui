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
 * assistant-overview (Classic) – a self-contained React 19 component.
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
      <style href="ui-assistant-overview" precedence="default">
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
  const [folders, setFolders] = useState<string[]>(["Summer collection"]);
  const [menu, setMenu] = useState<
    "workspace" | "account" | "projects" | "chat" | "chat-project" | "appearance" | "language" | null
  >(null);
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
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            event.stopPropagation();
            setWsOpen(null);
            (event.currentTarget.previousElementSibling as HTMLElement | null)?.focus();
          }
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
      <style href="ui-assistant-overview" precedence="default">
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
          inert={narrow ? !sidebarOpen : collapsed}
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
          <div className="ui-as__side-col" data-navigation={!!navigation || undefined}>
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
                        <Icon name="chevron" size={12} />
                      </button>
                      <button
                        type="button"
                        className="ui-as__icon-btn"
                        aria-label={labels.collapseSidebar}
                        onClick={() => (narrow ? setSidebarOpen(false) : setCollapsed(true))}
                      >
                        <Icon name="panel" />
                      </button>
                    </header>
                    <button
                      type="button"
                      className="ui-as__nav-search"
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
                            aria-current={active === item.label ? "page" : undefined}
                            disabled={item.disabled}
                            onClick={() => navigate(item.label)}
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
                  <>
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
                    <nav className="ui-as__chat-nav" aria-label={labels.conversations}>
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
                                    folders.includes(name)
                                      ? folders.filter((item) => item !== name)
                                      : [...folders, name],
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
                  </>
                )}
                {!rail && (
                  <button
                    type="button"
                    className="ui-as__account-row"
                    aria-haspopup="menu"
                    aria-expanded={menu === "account"}
                    {...trigger("account")}
                  >
                    <span className="ui-as__user-initials">{initials(user.name)}</span>
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
          className={menu === "workspace" ? "ui-as__menu ui-as__ws-menu" : "ui-as__menu"}
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
          side={menu === "account" || (menu === "workspace" && !navigation) ? "right" : "bottom"}
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
                <span className="ui-as__user-initials">{initials(user.name)}</span>
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
              <div className="ui-as__menu-label">{labels.language}</div>
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
              <div className="ui-as__menu-label">{labels.appearance}</div>
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
      <style href="ui-assistant-overview" precedence="default">
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
      <style href="ui-assistant-overview" precedence="default">
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
      <style href="ui-assistant-overview" precedence="default">
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
      <style href="ui-assistant-overview" precedence="default">
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
      <style href="ui-assistant-overview" precedence="default">
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
      <style href="ui-assistant-overview" precedence="default">
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

export type OverviewChat = { id?: string; title: string; at: string };
export type OverviewFile = { id?: string; name: string; at: string; where?: string };
export type OverviewStat = { label: string; value: number; delta?: number };
export type OverviewUsage = { used: number; limit: number; resets?: string };
const overviewNumber = new Intl.NumberFormat("en-US");
const overviewSigned = (value: number) =>
  `${value > 0 ? "+" : value < 0 ? "−" : "±"}${overviewNumber.format(Math.abs(value))}`;
const defaultOverviewLabels = {
  activity: "Activity",
  recent: "Recent chats",
  usage: "Usage",
  files: "Files made for you",
  monthTitle: "This month",
  more: (count: number) => `${overviewNumber.format(count)} more`,
  chats: (count: number) =>
    count === 0 ? "No chats" : count === 1 ? "1 chat" : `${overviewNumber.format(count)} chats`,
  day: (date: Date) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date),
  monthName: (date: Date) => new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
  heat: (total: number, weeks: number) =>
    `${overviewNumber.format(total)} chats over the last ${weeks} weeks, more of them lately – arrow keys go through the days`,
  summary: (chats: number, files: number, automations: number) =>
    `${overviewNumber.format(chats)} chats · ${overviewNumber.format(files)} files · ${overviewNumber.format(automations)} automations`,
  credits: (used: number, limit: number) =>
    [overviewNumber.format(used), `/ ${overviewNumber.format(limit)} credits`] as [string, string],
  meter: "Credits used this month",
  meterText: (used: number, limit: number, over: boolean) =>
    `${overviewNumber.format(used)} of ${overviewNumber.format(limit)} credits${over ? " – over the limit" : ""}`,
  resets: (date: string, over: boolean) => `${over ? "Over the limit · " : ""}Resets ${date}`,
  delta: (delta: number) => `${overviewSigned(delta)} on last month`,
};
export type OverviewCardsLabels = typeof defaultOverviewLabels;
export type OverviewCardsProps = {
  /** Chats per day, oldest first; the last value is `activityEnd`. */
  activity?: number[];
  activityEnd?: Date | string | number;
  fileCount?: number;
  automationCount?: number;
  recent?: OverviewChat[];
  recentMore?: number;
  files?: OverviewFile[];
  filesMore?: number;
  usage?: OverviewUsage;
  month?: OverviewStat[];
  /** Receives Chat or Folders from rows and their “N more” buttons without specific handlers. */
  onNavigate?: (label: string) => void;
  onOpenChat?: (chat: OverviewChat) => void;
  onOpenFile?: (file: OverviewFile) => void;
  labels?: Partial<OverviewCardsLabels>;
  className?: string;
};

export const defaultOverviewActivity =
  "0302100021000002312002323300324310024421002313100121120034341001113400334540042143105334301234441153425105344500554440063562013525400645252043336002446201462451046434225534301465343166333016465332464553164564414476610746553355457235566532656761265466135488721568641387776235667534"
    .split("")
    .map(Number);
export const defaultOverviewRecent: OverviewChat[] = [
  { id: "launch", title: "Q3 launch messaging", at: "2 hours ago" },
  { id: "hooks", title: "Ad hooks for the linen overshirt", at: "Yesterday" },
  { id: "logo", title: "Logo usage on partner sites", at: "3 days ago" },
];
export const defaultOverviewFiles: OverviewFile[] = [
  { name: "q3-launch-plan.md", at: "1 hour ago", where: "Q3 Campaign" },
  { name: "budget-by-channel.csv", at: "Yesterday", where: "Q3 Campaign" },
  { name: "competitor-pricing.csv", at: "Tue", where: "Research" },
];
export const defaultOverviewUsage: OverviewUsage = { used: 1284, limit: 2000, resets: "Dec 1" };
export const defaultOverviewMonth: OverviewStat[] = [
  { label: "Chats", value: 36, delta: 12 },
  { label: "Files made", value: 14, delta: -3 },
];

type OverviewGlyphName = "calendar" | "clock" | "usage" | "note" | "chat";
const overviewGlyphs: Record<OverviewGlyphName, ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="4" />
      <path d="M8 2v4M16 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5V12l2.5 2.5" />
    </>
  ),
  usage: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="m7 14 3-3 2.5 2.5L17 9" />
    </>
  ),
  note: (
    <>
      <path d="M8 7h8M8 11h4M13 21.5V20c0-3 1-4 4-4h3M20 13.5V9c0-4-2-7-7-7h-2C6 2 4 5 4 9v6c0 4 2 7 7 7h2l7-6.5" />
    </>
  ),
  chat: (
    <>
      <path d="M21.5 12a9.5 9.5 0 0 1-14 8.37c-1.6-.86-3 .2-4.6.2.6-1.2 1.2-3.2.1-5.57A9.5 9.5 0 1 1 21.5 12Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </>
  ),
};
function OverviewGlyph({ name, size = 14 }: { name: OverviewGlyphName; size?: number }) {
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
    >
      {overviewGlyphs[name]}
    </svg>
  );
}
function OverviewFileGlyph({ name }: { name: string }) {
  const sheet = /\.(csv|tsv|xlsx?|numbers)$/i.test(name);
  return (
    <svg
      className="ui-ovc__file"
      data-type={sheet ? "sheet" : "doc"}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.3 1h3.9L10 3.8v6.4c0 .7-.6 1.3-1.3 1.3H3.3c-.7 0-1.3-.6-1.3-1.3V2.3C2 1.6 2.6 1 3.3 1Z"
        fill="currentColor"
        opacity=".45"
      />
      <path d="M7.2 1v1.8c0 .55.45 1 1 1H10Z" fill="currentColor" />
      {sheet ? (
        <path d="M3.6 5.8h4.8v3.4H3.6ZM6 5.8v3.4M3.6 7.5h4.8" stroke="currentColor" strokeWidth="1" />
      ) : (
        <path d="M4 6.6h4M4 8.6h2.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      )}
    </svg>
  );
}
function splitFileName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 && name.length - dot <= 6 ? [name.slice(0, dot), name.slice(dot)] : [name, ""];
}
function overviewDate(value: Date | string | number) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Workspace numbers under a start page: daily activity, recent chats, usage, files and the month against the last. */
export function OverviewCards({
  activity: activityProp = defaultOverviewActivity,
  activityEnd = new Date(2026, 10, 7),
  fileCount = 214,
  automationCount = 38,
  recent = defaultOverviewRecent,
  recentMore = 6,
  files = defaultOverviewFiles,
  filesMore = 11,
  usage = defaultOverviewUsage,
  month = defaultOverviewMonth,
  onNavigate,
  onOpenChat,
  onOpenFile,
  labels: labelsProp,
  className,
}: OverviewCardsProps) {
  const labels = { ...defaultOverviewLabels, ...labelsProp };
  const activity = (Array.isArray(activityProp) ? activityProp : []).map((value) =>
    Math.max(0, Math.round(safeNumber(value, 0))),
  );
  const end = overviewDate(activityEnd),
    dateAt = (index: number) =>
      new Date(end.getFullYear(), end.getMonth(), end.getDate() - (activity.length - 1 - index));
  const offset = activity.length ? dateAt(0).getDay() : 0,
    weeks = Math.max(1, Math.ceil((offset + activity.length) / 7));
  const total = activity.reduce((sum, value) => sum + value, 0),
    peak = Math.max(1, ...activity);
  const level = (value: number) => (value <= 0 ? 0 : Math.min(4, Math.ceil((value / peak) * 4)));
  const limit = Math.max(0, safeNumber(usage.limit, 0)),
    used = Math.max(0, safeNumber(usage.used, 0)),
    over = used > limit,
    share = limit > 0 ? Math.min(1, used / limit) : 1;
  const card = useRef<HTMLElement>(null),
    heat = useRef<HTMLDivElement>(null),
    id = useId();
  const [tip, setTip] = useState<{ index: number; x: number; y: number } | null>(null);
  const show = (index: number | null) => {
    const cell = index === null ? null : heat.current?.querySelector<HTMLElement>(`i[data-day="${index}"]`),
      box = card.current;
    if (!cell || !box || index === null) {
      setTip(null);
      return;
    }
    const a = cell.getBoundingClientRect(),
      b = box.getBoundingClientRect(),
      scale = b.width / box.offsetWidth || 1;
    setTip({ index, x: (a.left + a.width / 2 - b.left) / scale, y: (a.top - b.top) / scale });
  };
  const pointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const cell = (event.target as Element).closest<HTMLElement>("i[data-day]");
    if (cell) show(Number(cell.dataset.day));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = activity.length - 1,
      from = tip?.index ?? last,
      step = ({ ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 } as Record<string, number>)[event.key];
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "Escape"
            ? -1
            : step === undefined
              ? null
              : from + step;
    if (next === null || last < 0) return;
    event.preventDefault();
    if (next < 0 && event.key === "Escape") setTip(null);
    else show(clamp(next, 0, last));
  };
  const describe = (index: number) => `${labels.chats(activity[index] ?? 0)}, ${labels.day(dateAt(index))}`;
  const openChat = (chat: OverviewChat) => (onOpenChat ? onOpenChat(chat) : onNavigate?.("Chat"));
  const openFile = (file: OverviewFile) => (onOpenFile ? onOpenFile(file) : onNavigate?.("Folders"));
  const [usedText, limitText] = labels.credits(used, limit);
  return (
    <div className={["ui-ovc", className].filter(Boolean).join(" ")}>
      <style href="ui-assistant-overview" precedence="default">
        {css}
      </style>
      <div className="ui-ovc__grid">
        <section ref={card} className="ui-ovc__card ui-ovc__card--activity" aria-labelledby={`${id}-activity`}>
          <h2 className="ui-ovc__head" id={`${id}-activity`}>
            <OverviewGlyph name="calendar" />
            {labels.activity}
          </h2>
          <div
            ref={heat}
            className="ui-ovc__heat"
            role="img"
            tabIndex={0}
            aria-label={labels.heat(total, weeks)}
            data-hovering={tip ? "" : undefined}
            style={{ "--ui-ovc-weeks": weeks } as CSSProperties}
            onPointerMove={pointer}
            onPointerDown={pointer}
            onPointerLeave={(event) => {
              if (event.currentTarget !== document.activeElement) setTip(null);
            }}
            onFocus={() => {
              if (!tip) show(activity.length - 1);
            }}
            onBlur={() => setTip(null)}
            onKeyDown={onKeyDown}
          >
            {Array.from({ length: weeks }, (_, week) => (
              <span className="ui-ovc__week" key={week}>
                {Array.from({ length: 7 }, (_, day) => {
                  const index = week * 7 + day - offset;
                  return index < 0 || index >= activity.length ? (
                    <i key={day} data-empty="" />
                  ) : (
                    <i
                      key={day}
                      data-day={index}
                      data-level={level(activity[index] ?? 0)}
                      data-on={tip?.index === index ? "" : undefined}
                    />
                  );
                })}
              </span>
            ))}
          </div>
          <span className="ui-ovc__sr" aria-live="polite">
            {tip ? describe(tip.index) : ""}
          </span>
          {tip && (
            <span
              className="ui-ovc__tip"
              aria-hidden="true"
              style={{ "--ui-ovc-tip-x": `${tip.x}px`, "--ui-ovc-tip-y": `${tip.y}px` } as CSSProperties}
            >
              <b>{labels.chats(activity[tip.index] ?? 0)}</b> · {labels.day(dateAt(tip.index))}
            </span>
          )}
          <p className="ui-ovc__foot">
            <span>{labels.summary(total, fileCount, automationCount)}</span>
            {activity.length > 0 && (
              <span className="ui-ovc__muted">
                {labels.monthName(dateAt(0))} – {labels.monthName(end)}
              </span>
            )}
          </p>
        </section>
        <section className="ui-ovc__card ui-ovc__card--recent" aria-labelledby={`${id}-recent`}>
          <div className="ui-ovc__top">
            <h2 className="ui-ovc__head" id={`${id}-recent`}>
              <OverviewGlyph name="clock" />
              {labels.recent}
            </h2>
            {recentMore > 0 && (
              <button type="button" className="ui-ovc__more" onClick={() => onNavigate?.("Chat")}>
                {labels.more(recentMore)}
              </button>
            )}
          </div>
          <ul className="ui-ovc__list">
            {recent.map((chat) => (
              <li key={chat.id ?? chat.title}>
                <button type="button" className="ui-ovc__row" onClick={() => openChat(chat)}>
                  <span className="ui-ovc__mark" aria-hidden="true">
                    <OverviewGlyph name="chat" size={12} />
                  </span>
                  <span className="ui-ovc__title" dir="auto" title={chat.title}>
                    {chat.title}
                  </span>
                  <span className="ui-ovc__meta">{chat.at}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="ui-ovc__card ui-ovc__card--usage" aria-labelledby={`${id}-usage`}>
          <h2 className="ui-ovc__head" id={`${id}-usage`}>
            <OverviewGlyph name="usage" />
            {labels.usage}
          </h2>
          <p className="ui-ovc__big">
            {usedText} <span className="ui-ovc__muted">{limitText}</span>
          </p>
          <span
            className="ui-ovc__meter"
            role="meter"
            aria-label={labels.meter}
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={Math.min(used, limit)}
            aria-valuetext={labels.meterText(used, limit, over)}
            data-over={over ? "" : undefined}
          >
            <i style={{ "--ui-ovc-share": share } as CSSProperties} />
          </span>
          {(usage.resets || over) && (
            <p className="ui-ovc__muted ui-ovc__small">{labels.resets(usage.resets ?? "", over)}</p>
          )}
        </section>
        <section className="ui-ovc__card ui-ovc__card--files" aria-labelledby={`${id}-files`}>
          <div className="ui-ovc__top">
            <h2 className="ui-ovc__head" id={`${id}-files`}>
              <OverviewGlyph name="note" />
              {labels.files}
            </h2>
            {filesMore > 0 && (
              <button type="button" className="ui-ovc__more" onClick={() => onNavigate?.("Folders")}>
                {labels.more(filesMore)}
              </button>
            )}
          </div>
          <ul className="ui-ovc__list">
            {files.map((file) => {
              const [base, extension] = splitFileName(file.name);
              return (
                <li key={file.id ?? file.name}>
                  <button type="button" className="ui-ovc__row" onClick={() => openFile(file)}>
                    <span className="ui-ovc__mark ui-ovc__mark--file" aria-hidden="true">
                      <OverviewFileGlyph name={file.name} />
                    </span>
                    <span
                      className="ui-ovc__title ui-ovc__title--file"
                      dir="auto"
                      title={file.where ? `${file.name} · ${file.where}` : file.name}
                    >
                      <span>{base}</span>
                      {extension}
                    </span>
                    <span className="ui-ovc__meta">{file.at}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="ui-ovc__card ui-ovc__card--month" aria-labelledby={`${id}-month`}>
          <h2 className="ui-ovc__head" id={`${id}-month`}>
            <OverviewGlyph name="calendar" />
            {labels.monthTitle}
          </h2>
          <dl className="ui-ovc__stats">
            {month.map((stat) => (
              <div key={stat.label}>
                <dt title={stat.label}>{stat.label}</dt>
                <dd>
                  <span className="ui-ovc__stat">{overviewNumber.format(safeNumber(stat.value, 0))}</span>
                  {stat.delta !== undefined && (
                    <span
                      className="ui-ovc__delta"
                      data-dir={stat.delta > 0 ? "up" : stat.delta < 0 ? "down" : undefined}
                      aria-label={labels.delta(stat.delta)}
                    >
                      {overviewSigned(stat.delta)}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}

export type AssistantOverviewApp = { id: string; name: string; color?: string };
export type AssistantOverviewScreenProps = Omit<AppShellProps, "children" | "panel" | "panelTitle" | "navigation"> & {
  /** Start-page heading. Defaults to the affectUI mark. */
  title?: ReactNode;
  /** Data for the cards under the composer. Rows and “N more” buttons fall back to onNavigate. */
  overview?: Omit<OverviewCardsProps, "onNavigate">;
  onSend?: (message: string, options: ChatComposerSendOptions) => void;
  composerProps?: Omit<ChatComposerProps, "onSend" | "footer">;
  folders?: string[];
  folder?: string;
  defaultFolder?: string;
  onFolderChange?: (folder: string) => void;
  apps?: AssistantOverviewApp[];
  connectedApps?: string[];
  defaultConnectedApps?: string[];
  onConnectedAppsChange?: (ids: string[]) => void;
  suggested?: WorkspaceSource[];
  onOpenSource?: (source: WorkspaceSource) => void;
  onOpenTool?: (tool: WorkspaceToolKind) => void;
  onOpenUrl?: (url: string) => void;
};

export const defaultOverviewFolders = ["Q3 Campaign", "Brand assets", "Hiring", "Research"];
export const defaultOverviewApps: AssistantOverviewApp[] = [
  { id: "gmail", name: "Gmail", color: "#ea4335" },
  { id: "slack", name: "Slack", color: "#4a154b" },
  { id: "clickup", name: "ClickUp", color: "#7b68ee" },
];
export const defaultOverviewSources: WorkspaceSource[] = [
  { name: "GEO: Generative Engine Optimization", description: "arxiv.org", kind: "document" },
  { name: "Design tokens – naming guide", description: "notion.so", kind: "document" },
  { name: "Q3 launch checklist", description: "linear.app", kind: "document" },
  { name: "Q3 launch budget", description: "sheets.google.com", kind: "table" },
];
const overviewNavigation: AppRailItem[] = [
  { label: "New chat", icon: <Icon name="compose" /> },
  { label: "Folders", icon: <Icon name="folder" /> },
  { label: "Integrations", icon: <Icon name="plug" /> },
  { label: "Q3 launch messaging", icon: <Icon name="chat" />, section: "Pinned" },
  ...defaultOverviewFolders.map((label) => ({ label, icon: <Icon name="folder" />, section: "Projects" })),
  { label: "Onboarding email draft", icon: <Icon name="chat" />, section: "Chats" },
  { label: "August content calendar", icon: <Icon name="chat" />, section: "Chats" },
];
const overviewLogos = {
  gmail: (
    <svg aria-hidden="true" viewBox="0 0 56.4108 44.8722" fill="none">
      <path
        d="M44.2255 5.76727H56.4051V41.0239C56.4051 43.148 54.683 44.8701 52.5589 44.8701H46.1486C45.8961 44.8701 45.646 44.8204 45.4127 44.7237C45.1794 44.6271 44.9674 44.4854 44.7888 44.3069C44.6102 44.1283 44.4686 43.9163 44.3719 43.683C44.2753 43.4497 44.2255 43.1996 44.2255 42.947V5.76727Z"
        fill="url(#ui-aov-gmail-0)"
      />
      <path
        d="M12.1796 5.76727H0V41.0239C0 43.148 1.72213 44.8701 3.84618 44.8701H10.2565C10.509 44.8701 10.7591 44.8204 10.9924 44.7237C11.2257 44.6271 11.4377 44.4854 11.6163 44.3069C11.7949 44.1283 11.9365 43.9163 12.0332 43.683C12.1298 43.4497 12.1796 43.1996 12.1796 42.947V5.76727Z"
        fill="#FC413D"
      />
      <path
        d="M10.0085 1.42778C7.43377 -0.736342 3.5924 -0.403647 1.42828 2.17105C-0.735843 4.74543 -0.403148 8.58681 2.17155 10.7512L26.5557 31.2479C27.0178 31.6362 27.602 31.8492 28.2056 31.8492C28.8091 31.8492 29.3934 31.6362 29.8554 31.2479L54.2396 10.7509C56.814 8.58681 57.1467 4.74543 54.9825 2.17073C52.8184 -0.403648 48.977 -0.736342 46.4027 1.42778L28.2054 16.724L10.0085 1.42778Z"
        fill="url(#ui-aov-gmail-1)"
      />
      <defs>
        <linearGradient
          id="ui-aov-gmail-0"
          x1="50.3153"
          y1="5.76727"
          x2="50.3153"
          y2="44.8701"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60D673" />
          <stop offset="0.17" stopColor="#42C868" />
          <stop offset="0.39" stopColor="#0EBC5F" />
          <stop offset="0.62" stopColor="#00A9BB" />
          <stop offset="0.86" stopColor="#3C90FF" />
          <stop offset="1" stopColor="#3186FF" />
        </linearGradient>
        <linearGradient
          id="ui-aov-gmail-1"
          x1="6.04194e-05"
          y1="6.45153"
          x2="56.4107"
          y2="6.45153"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.08" stopColor="#FF63A0" />
          <stop offset="0.3" stopColor="#FC413D" />
          <stop offset="0.5" stopColor="#FC413D" />
          <stop offset="0.65" stopColor="#FC413D" />
          <stop offset="0.72" stopColor="#FC5C30" />
          <stop offset="0.86" stopColor="#FEB10C" />
          <stop offset="0.91" stopColor="#FEC700" />
          <stop offset="0.96" stopColor="#FFDB0F" />
        </linearGradient>
      </defs>
    </svg>
  ),
  clickup: (
    <svg aria-hidden="true" viewBox="0 0 49.7096 59.6884" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 45.9002L9.1618 38.8247C14.0602 45.1745 19.2307 48.1679 24.9455 48.1679C30.6603 48.1679 35.7401 45.2652 40.3663 38.9154L49.7096 45.8094C42.997 54.8805 34.6516 59.6882 24.9455 59.6882C15.3301 59.6882 6.89403 54.8805 0 45.9002Z"
        fill="url(#ui-aov-clickup-0)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.9535 15.3301L8.62558 29.3903L1.09657 20.5914L25.0442 0L48.8105 20.5914L41.1908 29.2996L24.9535 15.3301Z"
        fill="url(#ui-aov-clickup-1)"
      />
      <defs>
        <linearGradient
          id="ui-aov-clickup-0"
          x1="0"
          y1="49.2666"
          x2="49.75"
          y2="49.2666"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8930FD" />
          <stop offset="1" stopColor="#49CCF9" />
        </linearGradient>
        <linearGradient
          id="ui-aov-clickup-1"
          x1="1.09231"
          y1="14.6901"
          x2="48.7603"
          y2="14.6901"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF02F0" />
          <stop offset="1" stopColor="#FFC800" />
        </linearGradient>
      </defs>
    </svg>
  ),
  hubspot: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="#FF7A59">
      <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" />
    </svg>
  ),
  calendar: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="#4285F4">
      <path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z" />
    </svg>
  ),
  slack: (
    <svg aria-hidden="true" viewBox="0 0 49.883 49.877" fill="none">
      <g transform="translate(0 0)">
        <path
          d="M18.3549 10.4784C15.4713 10.4784 13.1157 8.12279 13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V10.4784H18.3549Z"
          fill="#36C5F0"
        />
        <path
          d="M18.3575 13.12C21.2411 13.12 23.5967 15.4756 23.5967 18.3592C23.5967 21.2428 21.2411 23.5984 18.3575 23.5984H5.2392C2.35561 23.5984 0 21.2428 0 18.3592C0 15.4756 2.35561 13.12 5.2392 13.12H18.3575Z"
          fill="#36C5F0"
        />
      </g>
      <g transform="translate(26.28 0)">
        <path
          d="M13.1244 18.3592C13.1244 15.4756 15.48 13.12 18.3636 13.12C21.2472 13.12 23.6028 15.4756 23.6028 18.3592C23.6028 21.2428 21.2472 23.5984 18.3636 23.5984H13.1244V18.3592Z"
          fill="#2EB67D"
        />
        <path
          d="M10.4785 18.3575C10.4785 21.2411 8.12286 23.5967 5.23927 23.5967C2.35568 23.5967 7.4362e-05 21.2411 7.4362e-05 18.3575V5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0C8.12286 0 10.4785 2.35561 10.4785 5.2392V18.3575Z"
          fill="#2EB67D"
        />
      </g>
      <g transform="translate(0 26.28)">
        <path
          d="M10.4784 5.2392C10.4784 8.12279 8.12279 10.4784 5.2392 10.4784C2.35561 10.4784 0 8.12279 0 5.2392C0 2.35561 2.35561 0 5.2392 0H10.4784V5.2392Z"
          fill="#E01E5A"
        />
        <path
          d="M13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V18.3575C23.5941 21.2411 21.2385 23.5967 18.3549 23.5967C15.4713 23.5967 13.1157 21.2411 13.1157 18.3575V5.2392Z"
          fill="#E01E5A"
        />
      </g>
      <g transform="translate(26.28 26.28)">
        <path
          d="M5.23927 13.1157C8.12286 13.1157 10.4785 15.4713 10.4785 18.3549C10.4785 21.2385 8.12286 23.5941 5.23927 23.5941C2.35568 23.5941 7.4362e-05 21.2385 7.4362e-05 18.3549V13.1157H5.23927Z"
          fill="#ECB22E"
        />
        <path
          d="M5.23927 10.4784C2.35568 10.4784 7.4362e-05 8.12279 7.4362e-05 5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0H18.3576C21.2412 0 23.5968 2.35561 23.5968 5.2392C23.5968 8.12279 21.2412 10.4784 18.3576 10.4784H5.23927Z"
          fill="#ECB22E"
        />
      </g>
    </svg>
  ),
  notion: (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
    </svg>
  ),
};
const commandGlyph = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} vectorEffect="non-scaling-stroke" />
  </svg>
);
const overviewCommands: CommandMenuGroup[] = [
  {
    id: "suggestions",
    label: "Suggestions",
    commands: [
      {
        id: "email",
        label: "Write an email",
        description: "Gmail",
        logo: overviewLogos.gmail,
        keywords: "mail send compose",
      },
      {
        id: "ask",
        label: "Ask assistant",
        description: "Summaries, drafts, answers",
        logo: assistantSpark,
        keywords: "ai chat question",
      },
      {
        id: "task",
        label: "Create a task",
        description: "ClickUp",
        logo: overviewLogos.clickup,
        keywords: "todo issue",
      },
      {
        id: "crm",
        label: "Add contact to CRM",
        description: "HubSpot",
        logo: overviewLogos.hubspot,
        keywords: "lead deal company",
      },
      {
        id: "meet",
        label: "Schedule a meeting",
        description: "Google Calendar",
        logo: overviewLogos.calendar,
        keywords: "call invite event",
      },
    ],
  },
  {
    id: "share",
    label: "Share",
    commands: [
      {
        id: "slack",
        label: "Post an update",
        description: "#team-updates",
        logo: overviewLogos.slack,
        keywords: "message channel",
      },
      {
        id: "notion",
        label: "Save as page",
        description: "Notion · Meeting notes",
        logo: overviewLogos.notion,
        keywords: "doc wiki",
      },
    ],
  },
  {
    id: "general",
    label: "General",
    commands: [
      {
        id: "new-doc",
        label: "New document",
        icon: commandGlyph("M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4"),
        shortcut: "N",
      },
      {
        id: "invite",
        label: "Invite teammates",
        icon: commandGlyph("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0M19 8v4M17 10h4"),
        shortcut: "I",
      },
      { id: "upload", label: "Upload files", icon: commandGlyph("M12 16V4M7 9l5-5 5 5M5 20h14"), shortcut: "U" },
      {
        id: "theme",
        label: "Switch to dark mode",
        icon: commandGlyph("M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"),
        keywords: "theme appearance light",
        shortcut: "⇧ D",
      },
    ],
  },
];
function OverviewBrand() {
  return (
    <span className="ui-aov__brand">
      <svg width="22" height="22" viewBox="0 0 107 107" fill="currentColor" aria-hidden="true">
        <path d="M106.4 67.3c0 2.4-1.9 4.3-4.3 4.3H75.9c-2.4 0-4.3 1.9-4.3 4.3v26.2c0 2.4-1.9 4.3-4.3 4.3H4.3c-2.4 0-4.3-1.9-4.3-4.3v-63c0-2.4 1.9-4.3 4.3-4.3h26.2c2.4 0 4.3-1.9 4.3-4.3V4.3C34.8 1.9 36.7 0 39.1 0h63c2.4 0 4.3 1.9 4.3 4.3ZM35.8 66.3c0 2.4 1.9 4.3 4.3 4.3h26.2c2.4 0 4.3-1.9 4.3-4.3V40.1c0-2.4-1.9-4.3-4.3-4.3H40.1c-2.4 0-4.3 1.9-4.3 4.3Z" />
      </svg>
      affectUI
    </span>
  );
}

/** An AI workspace start page: a composer with folder and app context, the user's numbers below it and a work-area tab beside it. */
export function AssistantOverviewScreen({
  title,
  overview,
  onSend,
  composerProps,
  folders = defaultOverviewFolders,
  folder: folderProp,
  defaultFolder = "",
  onFolderChange,
  apps = defaultOverviewApps,
  connectedApps,
  defaultConnectedApps = ["gmail"],
  onConnectedAppsChange,
  suggested = defaultOverviewSources,
  onOpenSource,
  onOpenTool,
  onOpenUrl,
  onNavigate,
  workspace = "Acme",
  user = { name: "Alex Morgan" },
  defaultActive = "New chat",
  defaultPanelOpen = false,
  defaultPanelWidth = 348,
  className,
  ...shellProps
}: AssistantOverviewScreenProps) {
  const [folder, setFolder] = useControllable(folderProp, defaultFolder, onFolderChange);
  const [navActive, setNavActive] = useControllable(shellProps.active, defaultActive, shellProps.onActiveChange);
  const commands: CommandMenuGroup[] = [
    ...overviewCommands,
    {
      id: "go",
      label: "Go to",
      commands: overviewNavigation
        .filter((item) => !item.section || item.section === "Projects")
        .map((item) => ({
          id: `go:${item.label}`,
          label: item.label,
          icon: item.icon,
          onSelect: () => {
            setNavActive(item.label);
            onNavigate?.(item.label);
          },
        })),
    },
  ];
  const [connected, setConnected] = useControllable(connectedApps, defaultConnectedApps, onConnectedAppsChange);
  const [menu, setMenu] = useState<"folder" | "apps" | null>(null);
  const [tabs, setTabs] = useState<{ id: string; tool?: WorkspaceToolKind }[]>([{ id: "start-1" }]),
    [active, setActive] = useState("start-1");
  const [panelOpen, setPanelOpen] = useControllable(
    shellProps.panelOpen,
    defaultPanelOpen,
    shellProps.onPanelOpenChange,
  );
  const root = useRef<HTMLDivElement>(null),
    anchor = useRef<HTMLElement>(null),
    folderRef = useRef<HTMLButtonElement>(null),
    appsRef = useRef<HTMLButtonElement>(null),
    sequence = useRef(1),
    id = useId();
  const toggle = (next: "folder" | "apps", button: HTMLButtonElement | null) => {
    anchor.current = button;
    setMenu(menu === next ? null : next);
  };
  const newTab = () => {
    const tab = `start-${++sequence.current}`;
    setTabs([...tabs, { id: tab }]);
    setActive(tab);
    setPanelOpen(true);
  };
  const openTool = (tab: string, tool: WorkspaceToolKind) => {
    setTabs(tabs.map((item) => (item.id === tab ? { ...item, tool } : item)));
    onOpenTool?.(tool);
  };
  const changeOpened = (ids: string[]) => {
    const next = tabs.filter((tab) => ids.includes(tab.id));
    if (next.length) {
      setTabs(next);
      return;
    }
    setPanelOpen(false);
    setTabs([{ id: `start-${++sequence.current}` }]);
  };
  const toolLabel = (tool: WorkspaceToolKind) =>
    tool === "terminal" ? "Terminal" : tool === "browser" ? "Browser" : "Notes";
  const workTabs: ArtifactWorkspaceTab[] = tabs.map((tab) =>
    tab.tool
      ? {
          id: tab.id,
          label: toolLabel(tab.tool),
          icon: (
            <Icon
              name={tab.tool === "terminal" ? "terminal" : tab.tool === "browser" ? "globe" : "compose"}
              size={14}
            />
          ),
          content: <WorkspaceTool kind={tab.tool} onOpenUrl={onOpenUrl} />,
        }
      : {
          id: tab.id,
          label: "New tab",
          icon: <Icon name="globe" size={14} />,
          content: (
            <WorkspaceStart
              suggested={suggested}
              onOpenSource={onOpenSource}
              onOpenTool={(tool) => openTool(tab.id, tool)}
              onOpenUrl={(url) => {
                openTool(tab.id, "browser");
                onOpenUrl?.(url);
              }}
            />
          ),
        },
  );
  const appList = apps.filter(Boolean),
    shown = appList
      .filter((app) => connected.includes(app.id))
      .concat(appList.filter((app) => !connected.includes(app.id)))
      .slice(0, 3);
  const tray = (
    <div className="ui-aov__tray">
      <button
        ref={folderRef}
        type="button"
        className="ui-aov__tray-link"
        aria-haspopup="menu"
        aria-expanded={menu === "folder"}
        aria-controls={menu === "folder" ? `${id}-menu` : undefined}
        onClick={() => toggle("folder", folderRef.current)}
      >
        <Icon name="folder" size={14} />
        <span title={folder || "Work in a folder"}>{folder || "Work in a folder"}</span>
      </button>
      <button
        ref={appsRef}
        type="button"
        className="ui-aov__tray-link ui-aov__tray-link--apps"
        aria-haspopup="menu"
        aria-expanded={menu === "apps"}
        aria-controls={menu === "apps" ? `${id}-menu` : undefined}
        onClick={() => toggle("apps", appsRef.current)}
      >
        Connect apps
        <span className="ui-aov__apps" aria-hidden="true">
          {shown.map((app) => (
            <i key={app.id} style={{ background: app.color }}>
              {app.name.slice(0, 1)}
            </i>
          ))}
        </span>
      </button>
    </div>
  );
  return (
    <AppShell
      {...shellProps}
      className={["ui-aov", className].filter(Boolean).join(" ")}
      workspace={workspace}
      user={user}
      navigation={overviewNavigation}
      active={navActive}
      onActiveChange={setNavActive}
      commands={commands}
      onAsk={shellProps.onAsk ?? (() => {})}
      onNavigate={onNavigate}
      panelOpen={panelOpen}
      onPanelOpenChange={setPanelOpen}
      defaultPanelWidth={defaultPanelWidth}
      panelTitle="Workspace"
      panel={
        <ArtifactWorkspace
          defaultFiles={[]}
          openFiles={tabs.map((tab) => tab.id)}
          onOpenFilesChange={changeOpened}
          activeFile={active}
          onActiveFileChange={setActive}
          tabs={workTabs}
          onNewTab={newTab}
          onClose={() => setPanelOpen(false)}
          closeLabel="Close workspace"
        />
      }
    >
      <style href="ui-assistant-overview" precedence="default">
        {css}
      </style>
      <div className="ui-aov__scroll">
        <section className="ui-aov__start" aria-label="Start">
          <h1 className="ui-aov__title">{title ?? <OverviewBrand />}</h1>
          <div ref={root} className="ui-aov__composer">
            <ChatComposer
              placeholder="Help me brainstorm ideas for…"
              {...composerProps}
              onSend={onSend}
              footer={tray}
            />
            {menu && (
              <FloatingMenu
                key={menu}
                anchor={anchor}
                root={root}
                className="ui-aov__menu"
                id={`${id}-menu`}
                label={menu === "folder" ? "Work in a folder" : "Apps"}
                align={menu === "apps" ? "end" : "start"}
                onClose={() => setMenu(null)}
              >
                {menu === "folder" ? (
                  <>
                    <div className="ui-aov__menu-title">Work in a folder</div>
                    {folders.map((name) => (
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={folder === name}
                        key={name}
                        onClick={() => {
                          setFolder(folder === name ? "" : name);
                          setMenu(null);
                          folderRef.current?.focus();
                        }}
                      >
                        <Icon name={folder === name ? "folder-open" : "folder"} size={15} />
                        <span title={name}>{name}</span>
                        {folder === name && <Icon name="check" size={13} />}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="ui-aov__menu-title">Apps</div>
                    {appList.map((app) => (
                      <button
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={connected.includes(app.id)}
                        key={app.id}
                        onClick={() =>
                          setConnected(
                            connected.includes(app.id)
                              ? connected.filter((item) => item !== app.id)
                              : [...connected, app.id],
                          )
                        }
                      >
                        <i className="ui-aov__logo" aria-hidden="true" style={{ background: app.color }}>
                          {app.name.slice(0, 1)}
                        </i>
                        <span title={app.name}>{app.name}</span>
                        {connected.includes(app.id) && <Icon name="check" size={13} />}
                      </button>
                    ))}
                  </>
                )}
              </FloatingMenu>
            )}
          </div>
          <div className="ui-aov__below">
            <OverviewCards {...overview} onNavigate={onNavigate} />
          </div>
        </section>
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
  padding: 7px 8px 8px;
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
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  margin-bottom: 10px;
}
.ui-as__nav-workspace {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  padding: 4px 7px;
  text-align: left;
}
.ui-as__nav-workspace > span {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  background: var(--ui-as-card);
  border-radius: 6px;
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  font-size: 10px;
  font-weight: 500;
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
  gap: 7px;
  width: 100%;
  height: 32px;
  border-radius: 8px !important;
  padding: 0 10px !important;
  background: var(--ui-as-card) !important;
  box-shadow: 0 0 0 0.5px var(--ui-as-line);
  color: var(--ui-as-muted) !important;
  margin-bottom: 11px;
  text-align: left;
  font-size: 12px !important;
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
  min-height: 36px;
  font-weight: 500;
  margin-top: auto;
}
.ui-as__side-col[data-navigation] .ui-as__user-initials {
  width: 20px;
  height: 20px;
  font-size: 9px;
  color: var(--ui-as-accent);
  background: rgba(0, 96, 226, 0.08);
}
.ui-as__side-col[data-navigation] .ui-as__account-row > svg {
  color: var(--ui-as-faint);
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
  display: none;
  gap: 1px;
  width: 240px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow:
    0 0 0 0.5px var(--ui-as-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  animation: ui-as-fade 120ms ease;
}
.ui-as__wsm-panel::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -8px;
  width: 8px;
}
.ui-as__wsm-sub:is(:hover, :focus-within, [data-open]) > .ui-as__wsm-panel {
  display: grid;
}
@keyframes ui-as-wsm-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
@container ui-as (max-width:899.99px) {
  .ui-as__wsm-panel {
    position: static;
    width: auto;
    margin: 2px 0 4px;
    padding: 0 0 0 14px;
    border-radius: 0;
    background: none;
    box-shadow: none;
    animation: none;
  }
  .ui-as__wsm-panel::before {
    display: none;
  }
  .ui-as__wsm-sub:hover:not(:focus-within, [data-open]) > .ui-as__wsm-panel {
    display: none;
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

.ui-ovc {
  --ui-ovc-card: #fff;
  --ui-ovc-ink: rgba(0, 0, 0, 0.88);
  --ui-ovc-text: rgba(0, 0, 0, 0.61);
  --ui-ovc-muted: rgba(0, 0, 0, 0.45);
  --ui-ovc-line: rgba(0, 0, 0, 0.06);
  --ui-ovc-chip: rgba(0, 0, 0, 0.04);
  --ui-ovc-hover: rgba(0, 0, 0, 0.03);
  --ui-ovc-blue: #0190fe;
  --ui-ovc-doc: #0190fe;
  --ui-ovc-sheet: #5fc88a;
  --ui-ovc-up: #1f8a3e;
  --ui-ovc-down: #c2331f;
  --ui-ovc-focus: rgba(0, 96, 226, 0.7);
  width: 100%;
  container: ui-ovc / inline-size;
  color: var(--ui-ovc-text);
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
.ui-ovc,
.ui-ovc *,
.ui-ovc *::before,
.ui-ovc *::after {
  box-sizing: border-box;
}
.ui-ovc button {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.ui-ovc svg {
  display: block;
  flex: none;
}
.ui-ovc h2,
.ui-ovc p {
  margin: 0;
}
.ui-ovc button:focus-visible {
  outline: 2px solid var(--ui-ovc-focus);
  outline-offset: 2px;
  border-radius: 6px;
}
.ui-ovc__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
}
.ui-ovc__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--ui-ovc-line);
  border-radius: 12px;
  background: var(--ui-ovc-card);
  text-align: left;
}
.ui-ovc__card--activity,
.ui-ovc__card--recent,
.ui-ovc__card--files {
  grid-column: span 2;
}
.ui-ovc__head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-ovc-ink);
  white-space: nowrap;
}
.ui-ovc__head svg {
  color: var(--ui-ovc-muted);
}
.ui-ovc__muted {
  color: var(--ui-ovc-muted);
}
.ui-ovc__small {
  font-size: 11.5px;
  line-height: 16px;
}
.ui-ovc__foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: auto 0 0 !important;
  font-size: 11.5px;
  line-height: 16px;
  color: var(--ui-ovc-text);
  font-variant-numeric: tabular-nums;
}
.ui-ovc__foot > span:first-child {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovc__foot > span:last-child {
  flex: none;
}
.ui-ovc__heat {
  display: grid;
  grid-template-columns: repeat(var(--ui-ovc-weeks), minmax(0, 1fr));
  gap: 2px;
  border-radius: 4px;
  touch-action: pan-y;
}
.ui-ovc__heat:focus {
  outline: none;
}
.ui-ovc__heat:focus-visible {
  outline: 2px solid var(--ui-ovc-focus);
  outline-offset: 2px;
}
.ui-ovc__week {
  display: grid;
  grid-template-rows: repeat(7, auto);
  gap: 2px;
}
.ui-ovc__heat i {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--ui-ovc-chip);
}
.ui-ovc__heat i[data-empty] {
  visibility: hidden;
}
.ui-ovc__heat i[data-level="1"] {
  background: color-mix(in srgb, var(--ui-ovc-blue) 22%, var(--ui-ovc-card));
}
.ui-ovc__heat i[data-level="2"] {
  background: color-mix(in srgb, var(--ui-ovc-blue) 45%, var(--ui-ovc-card));
}
.ui-ovc__heat i[data-level="3"] {
  background: color-mix(in srgb, var(--ui-ovc-blue) 70%, var(--ui-ovc-card));
}
.ui-ovc__heat i[data-level="4"] {
  background: var(--ui-ovc-blue);
}
.ui-ovc__heat i[data-on] {
  box-shadow:
    0 0 0 1.5px var(--ui-ovc-card),
    0 0 0 2.5px var(--ui-ovc-ink);
}
.ui-ovc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-ovc__tip {
  position: absolute;
  z-index: 2;
  top: var(--ui-ovc-tip-y);
  left: clamp(70px, var(--ui-ovc-tip-x), calc(100% - 70px));
  translate: -50% calc(-100% - 6px);
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ovc-ink);
  color: var(--ui-ovc-card);
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.25);
}
.ui-ovc__tip b {
  font-weight: 500;
}
.ui-ovc__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.ui-ovc__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  margin: 0 -6px;
  padding: 0;
  list-style: none;
}
.ui-ovc__row {
  display: flex !important;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 3px 6px !important;
  border-radius: 8px;
  text-align: left;
  transition: background-color 120ms ease;
}
.ui-ovc__row:hover {
  background: var(--ui-ovc-hover) !important;
}
.ui-ovc__mark {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--ui-ovc-chip);
  color: var(--ui-ovc-muted);
}
.ui-ovc__file {
  color: var(--ui-ovc-doc);
}
.ui-ovc__file[data-type="sheet"] {
  color: var(--ui-ovc-sheet);
}
.ui-ovc__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--ui-ovc-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovc__title--file {
  display: flex;
}
.ui-ovc__title--file > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-ovc__meta {
  flex: none;
  font-size: 11px;
  line-height: 15px;
  color: var(--ui-ovc-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-ovc__more {
  flex: none;
  margin: -2px -6px -2px 0 !important;
  padding: 2px 6px !important;
  border-radius: 6px;
  font-size: 11.5px !important;
  line-height: 16px !important;
  color: var(--ui-ovc-text) !important;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}
.ui-ovc__more:hover {
  background: var(--ui-ovc-hover) !important;
  color: var(--ui-ovc-ink) !important;
}
.ui-ovc__big {
  margin: auto 0 0 !important;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.01em;
  color: var(--ui-ovc-ink);
  font-variant-numeric: tabular-nums;
}
.ui-ovc__big .ui-ovc__muted {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
}
.ui-ovc__meter {
  display: block;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-ovc-chip);
}
.ui-ovc__meter i {
  display: block;
  width: calc(var(--ui-ovc-share) * 100%);
  height: 100%;
  border-radius: inherit;
  background: var(--ui-ovc-blue);
}
.ui-ovc__meter[data-over] i {
  background: var(--ui-ovc-down);
}
.ui-ovc__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: auto 0 0;
}
.ui-ovc__stats > div {
  min-width: 0;
}
.ui-ovc__stats dt {
  overflow: hidden;
  font-size: 11.5px;
  line-height: 16px;
  color: var(--ui-ovc-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovc__stats dd {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 6px;
  margin: 2px 0 0;
}
.ui-ovc__stat {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: var(--ui-ovc-ink);
  font-variant-numeric: tabular-nums;
}
.ui-ovc__delta {
  font-size: 11px;
  line-height: 16px;
  color: var(--ui-ovc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ovc__delta[data-dir="up"] {
  color: var(--ui-ovc-up);
}
.ui-ovc__delta[data-dir="down"] {
  color: var(--ui-ovc-down);
}
@media (pointer: coarse) {
  .ui-ovc__row {
    min-height: 40px;
  }
  .ui-ovc__more {
    min-height: 32px;
    margin-block: -8px !important;
  }
}
@container ui-ovc (max-width:640px) {
  .ui-ovc__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ui-ovc__card--files {
    order: 1;
  }
}
@container ui-ovc (max-width:420px) {
  .ui-ovc__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .ui-ovc__card--activity,
  .ui-ovc__card--recent,
  .ui-ovc__card--files {
    grid-column: auto;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ovc * {
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ovc {
  --ui-ovc-card: #1c1c1e;
  --ui-ovc-ink: rgba(255, 255, 255, 0.9);
  --ui-ovc-text: rgba(255, 255, 255, 0.62);
  --ui-ovc-muted: rgba(255, 255, 255, 0.45);
  --ui-ovc-line: rgba(255, 255, 255, 0.08);
  --ui-ovc-chip: rgba(255, 255, 255, 0.06);
  --ui-ovc-hover: rgba(255, 255, 255, 0.05);
  --ui-ovc-doc: #4fb0fe;
  --ui-ovc-sheet: #7dcf9f;
  --ui-ovc-up: #5fd38a;
  --ui-ovc-down: #ff977d;
  --ui-ovc-focus: rgba(77, 141, 255, 0.8);
}

.ui-aov {
  min-height: 480px;
}
.ui-aov .ui-as__main {
  overflow: hidden;
}
.ui-aov__scroll {
  height: 100%;
  overflow: auto;
  container: ui-aov / inline-size;
}
.ui-aov__start {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(880px, 100% - 48px);
  min-height: 100%;
  margin: 0 auto;
  padding: 64px 0;
}
.ui-aov__title {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  line-height: 34px;
  letter-spacing: -0.025em;
  color: var(--ui-as-ink);
  text-align: center;
  text-wrap: balance;
}
.ui-aov__brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.02em;
}
.ui-aov__composer {
  position: relative;
  width: 100%;
  max-width: 672px;
  margin-top: 30px;
}
.ui-aov__composer .ui-cc {
  border-radius: 18px;
  background: var(--ui-cc-tray);
  box-shadow: 0 0 0 0.5px var(--ui-cc-line);
}
.ui-aov__composer .ui-cc__footer {
  padding: 0;
}
.ui-aov__tray {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 37px;
  padding: 0 6px;
}
.ui-aov__tray-link {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 26px;
  padding: 0 8px !important;
  border-radius: 8px;
  font-size: 12px;
  color: var(--ui-as-muted) !important;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}
.ui-aov__tray-link > span:not(.ui-aov__apps) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-aov__tray-link > svg {
  color: #00a1ff;
}
.ui-aov__tray-link:hover,
.ui-aov__tray-link[aria-expanded="true"] {
  background: var(--ui-as-fill) !important;
  color: var(--ui-as-ink) !important;
}
.ui-aov__tray-link--apps {
  flex: none;
}
.ui-aov__apps {
  display: inline-flex;
  gap: 3px;
  margin-left: 4px;
}
.ui-aov__apps i,
.ui-aov__logo {
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  color: #fff;
  font: 600 9px/1 inherit;
  font-style: normal;
}
.ui-aov__menu {
  min-width: 220px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-as-card);
  box-shadow: var(--ui-as-shadow);
  font-size: 13px;
  overflow: auto;
  animation: ui-aov-pop 160ms var(--ui-as-ease);
}
.ui-aov__menu-title {
  padding: 6px 10px 4px;
  font-size: 12px;
  color: var(--ui-as-faint);
}
.ui-aov__menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 32px;
  padding: 0 10px !important;
  border-radius: 8px;
  text-align: left;
  color: var(--ui-as-ink);
}
.ui-aov__menu button:hover,
.ui-aov__menu button:focus-visible {
  background: var(--ui-as-fill) !important;
  outline: none;
}
.ui-aov__menu button > span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-aov__menu button > svg {
  color: var(--ui-as-muted);
}
.ui-aov__logo {
  width: 16px;
  height: 16px;
}
.ui-aov__below {
  width: 100%;
  margin-top: 28px;
}
@keyframes ui-aov-pop {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
@container ui-aov (max-width:600px) {
  .ui-aov__start {
    width: calc(100% - 24px);
    padding: 56px 0 40px;
  }
  .ui-aov__title {
    font-size: 23px;
    line-height: 29px;
  }
  .ui-aov__composer {
    margin-top: 22px;
  }
}
@media (pointer: coarse) {
  .ui-aov__tray-link {
    height: 34px;
  }
  .ui-aov__menu button {
    min-height: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-aov * {
    animation: none !important;
    transition: none !important;
  }
}
.ui-ovc {
  --ui-ovc-ink: #171717;
  --ui-ovc-text: #404040;
  --ui-ovc-muted: #737373;
  --ui-ovc-line: #e5e5e5;
  --ui-ovc-chip: #f5f5f5;
  --ui-ovc-hover: #fafafa;
  --ui-ovc-focus: #2f6bff;
}
.ui-ovc__card {
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
:where(.dark, [data-theme="dark"]) .ui-ovc {
  --ui-ovc-card: #232326;
  --ui-ovc-ink: #ededed;
  --ui-ovc-text: #c4c4c4;
  --ui-ovc-muted: #8f8f8f;
  --ui-ovc-line: rgba(255, 255, 255, 0.1);
  --ui-ovc-chip: #2a2a2d;
  --ui-ovc-hover: #2a2a2d;
  --ui-ovc-focus: #6b95ff;
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
