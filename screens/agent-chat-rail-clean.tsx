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
 * agent-chat-rail (Clean) – a self-contained React 19 component.
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
      className={["ui-tac", className].filter(Boolean).join(" ")}
      data-open={open}
      data-state={running ? "running" : failed ? "failed" : "done"}
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <button
        type="button"
        className="ui-tac__head"
        aria-expanded={open}
        aria-controls={`${id}-tools`}
        onClick={() => {
          if (openProp === undefined) setManual(!open);
          onOpenChange?.(!open);
        }}
      >
        <span className="ui-tac__status" data-spinning={running || undefined}>
          <Icon name={running ? "play" : failed ? "warning" : "check"} size={14} />
        </span>
        <span className="ui-tac__title" data-text={label} data-shimmer={running || undefined}>
          {label}
        </span>
        <span className="ui-tac__chevron">
          <Icon name="chevron" size={12} />
        </span>
      </button>
      <div id={`${id}-tools`} className="ui-tac__wrap" inert={!open}>
        <ul className="ui-tac__list">
          {tools.map((tool, index) => {
            const status = ["running", "done", "failed", "stopped"].includes(tool.status) ? tool.status : "done";
            return (
              <li
                className="ui-tac__tool"
                data-status={status}
                key={tool.id}
                style={{ "--ui-tac-index": index } as CSSProperties}
              >
                <span className="ui-tac__mark" data-spinning={status === "running" || undefined}>
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
                  className="ui-tac__icon"
                  onErrorCapture={(event) => {
                    if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
                  }}
                >
                  {tool.icon ?? <Icon name={index ? "globe" : "search"} size={13} />}
                </span>
                <span className="ui-tac__label" dir="auto" title={tool.error ?? tool.label}>
                  {tool.label}
                  {tool.error && <small>{tool.error}</small>}
                </span>
                <span className="ui-tac__time">{labels.duration(elapsed(tool))}</span>
                {status === "failed" && onRetry && (
                  <button type="button" className="ui-tac__retry" onClick={() => onRetry(tool.id)}>
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
      className={["ui-ccc", className].filter(Boolean).join(" ")}
      data-menu-open={!!menu || undefined}
      data-recording={recording || undefined}
      data-disabled={disabled || undefined}
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
          className={menu === "workspace" ? "ui-asc__menu ui-asc__ws-menu" : "ui-asc__menu"}
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
    <div className={["ui-tkc", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <span className="ui-tkc__mark" aria-hidden="true">
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
      <span className="ui-tkc__text">
        <strong dir="auto" title={task.title}>
          {task.title}
        </strong>
        <small dir="auto" title={task.status}>
          {task.status}
        </small>
      </span>
      {task.steps && (
        <span className="ui-tkc__count" aria-label={labels.steps(done, total)}>
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
      className={["ui-ddc", className].filter(Boolean).join(" ")}
      data-empty={!current || undefined}
      data-folded={folded || undefined}
      data-status={status}
      data-kind={approval ? "approval" : decision.kind === "pick" ? "pick" : "decision"}
      onKeyDown={keyboard}
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      {folded && current && (
        <div className="ui-ddc__folded">
          <span className="ui-ddc__dot" />
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
      <div className="ui-ddc__collapse" inert={folded || !current} aria-hidden={folded || !current}>
        <div className="ui-ddc__clip">
          <section
            id={`${id}-card`}
            className="ui-ddc__card"
            role="group"
            aria-labelledby={`${id}-question`}
            aria-describedby={decision.error ? `${id}-error` : undefined}
            aria-busy={status === "submitting"}
            data-pulse={focusRequest || undefined}
            key={decision.id}
          >
            <header className="ui-ddc__head">
              <span className="ui-ddc__tag">{status === "awaiting" ? labels.needsYou : labels[status]}</span>
              <span className="ui-ddc__task" title={decision.task}>
                {decision.task}
              </span>
              {list.length > 1 && (
                <span className="ui-ddc__pager">
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
                className="ui-ddc__later"
                aria-expanded="true"
                aria-controls={`${id}-card`}
                onClick={later}
              >
                {labels.later}
              </button>
            </header>
            <p className="ui-ddc__question" id={`${id}-question`} dir="auto">
              {decision.question}
            </p>
            {approval && decision.facts && (
              <dl className="ui-ddc__facts">
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
              <p className="ui-ddc__error" id={`${id}-error`} role="alert">
                {decision.error}
              </p>
            )}
            {status !== "answered" && status !== "expired" && (
              <>
                <div className="ui-ddc__choices" role="listbox" aria-label={decision.question} aria-disabled={disabled}>
                  {options.map((option, index) => (
                    <button
                      type="button"
                      role="option"
                      disabled={disabled}
                      aria-selected={focused === index}
                      tabIndex={focused === index ? 0 : -1}
                      aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                      className="ui-ddc__option"
                      key={option.id}
                      onFocus={() => setFocused(index)}
                      onClick={() => answer(index)}
                    >
                      {decision.kind === "pick" && (
                        <span
                          className="ui-ddc__wire"
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
                              <rect x="40" width="120" height="80" rx="8" fill="var(--ui-ddc-card)" />
                              <g fill="var(--ui-ddc-faint)">
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
                      <span className="ui-ddc__number">{index + 1}</span>
                      <span className="ui-ddc__text">
                        <strong dir="auto">{option.title}</strong>
                        {option.summary && <small dir="auto">{option.summary}</small>}
                      </span>
                      {option.recommended && <span className="ui-ddc__recommended">{labels.recommended}</span>}
                    </button>
                  ))}
                </div>
                {allowCustom && (
                  <form
                    className="ui-ddc__custom"
                    onSubmit={(event) => {
                      event.preventDefault();
                      answerCustom();
                    }}
                  >
                    <span className="ui-ddc__number">{rows}</span>
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
      className={["ui-cnc", className].filter(Boolean).join(" ")}
      data-status={status}
      role="status"
      aria-live="polite"
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <div className="ui-cnc__pill">
        <span className="ui-cnc__mark">
          {status === "online" ? (
            <Icon name="check" size={14} />
          ) : (
            <span className="ui-cnc__spinner" aria-hidden="true" />
          )}
        </span>
        <span className="ui-cnc__text">{status === "online" ? labels.backOnline : labels.lost}</span>
        {status !== "online" && (
          <>
            <span className="ui-cnc__timer">
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
    <div className={["ui-ayc", className].filter(Boolean).join(" ")}>
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <section className="ui-ayc__card" aria-label={labels.title}>
        <header>
          <span className="ui-ayc__title">{labels.title}</span>
          <span className="ui-ayc__counts">{labels.counts(done.length, decisions.length)}</span>
        </header>
        <div className="ui-ayc__rows">
          {done.map((task) => (
            <button type="button" className="ui-ayc__row" key={task.id} onClick={() => onOpenTask?.(task.id)}>
              <span className="ui-ayc__check">
                <Icon name="check" size={13} />
              </span>
              <strong dir="auto">{task.title}</strong>
              <small dir="auto">{task.status}</small>
            </button>
          ))}
          {decisions.map((decision) => (
            <button
              type="button"
              className="ui-ayc__row"
              data-question=""
              key={decision.id}
              onClick={() => onOpenDecision?.(decision.id)}
            >
              <span className="ui-ayc__dot" />
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
        <div className="ui-ayc__boundary">
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
    <ul className={["ui-upc", className].filter(Boolean).join(" ")} aria-label={labels.attachments}>
      <style href="ui-agent-chat-rail-clean" precedence="default">
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
            className="ui-upc__file"
            data-state={status}
            data-kind={upload.kind === "voice" ? "voice" : undefined}
          >
            <span
              className="ui-upc__icon"
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
            <span className="ui-upc__info">
              <strong title={upload.name} dir="auto">
                {upload.name}
                {upload.kind === "voice" && upload.seconds != null
                  ? ` · ${Math.floor(upload.seconds / 60)}:${String(upload.seconds % 60).padStart(2, "0")}`
                  : ""}
              </strong>
              <span className="ui-upc__status">
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
                  className="ui-upc__bar"
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
              className="ui-upc__remove"
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
      className={["ui-upc", "ui-upc__voice", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={labels.dictating}
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <button type="button" aria-label={labels.discard} onClick={onDiscard}>
        <Icon name="close" size={16} />
      </button>
      <span className="ui-upc__red-dot" />
      <span className="ui-upc__wave" aria-hidden="true">
        {Array.from({ length: 56 }, (_, index) => (
          <i key={index} style={{ height: `${3 + ((index * 7) % 17)}px`, animationDelay: `${index * -83}ms` }} />
        ))}
      </span>
      <span className="ui-upc__time">
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
    <div className="ui-thc__files" aria-label={labels.createdFiles}>
      {names.map((name) => (
        <button type="button" key={name} className="ui-thc__file" title={name} onClick={() => onOpenFile?.(name)}>
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
    <div className="ui-thc__text" dir="auto">
      {text.split(/\n{2,}/).map((paragraph, index, paragraphs) => (
        <p key={index}>
          {paragraph}
          {caret && index === paragraphs.length - 1 && <span className="ui-thc__caret" aria-hidden="true" />}
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
      className={["ui-thc", className].filter(Boolean).join(" ")}
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
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <header className="ui-thc__head">
        <h1 className="ui-thc__sr">{title}</h1>
        {running && (
          <div className="ui-thc__summary">
            <button
              type="button"
              aria-label={labels.runningTasks(running.running)}
              onClick={() => onNavigate?.("Tasks")}
            >
              <i className="ui-thc__running-dot" />
              {Math.max(0, safeNumber(running.running, 0))}
              <span>{labels.running}</span>
            </button>
            {needs > 0 && (
              <>
                <span className="ui-thc__summary-separator">·</span>
                <button
                  type="button"
                  aria-label={labels.waitingQuestions(needs, decisions.length > 0)}
                  onClick={() => showDecision()}
                >
                  <i className="ui-thc__needs-dot" />
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
      <div className="ui-thc__body">
        {!builtInTimeline ? (
          timeline
        ) : (
          <>
            <div
              ref={scroll}
              className="ui-thc__scroll"
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
                className="ui-thc__column"
                role="log"
                aria-label={labels.conversation}
                aria-live="polite"
                aria-relevant="additions"
                aria-busy={streaming}
              >
                {!list.length && (
                  <div className="ui-thc__empty">
                    <span className="ui-thc__empty-icon">
                      <Icon name="spark" size={26} />
                    </span>
                    <h2>{labels.emptyTitle}</h2>
                    <p>{labels.emptyDescription}</p>
                  </div>
                )}
                {list.map((message, messageIndex) => (
                  <div className="ui-thc__message" data-message-id={message.id} key={message.id}>
                    {messageIndex === boundaryIndex && (
                      <div ref={unreadBoundary} className="ui-thc__unread-boundary">
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
                        className="ui-thc__user"
                        data-status={message.status ?? "sent"}
                        data-answer={message.answer?.id}
                      >
                        <span className="ui-thc__sr">{message.answer ? labels.youAnswered : labels.youSaid}</span>
                        {message.answer && (
                          <span className="ui-thc__answer-context" title={message.answer.question}>
                            {labels.answerContext(message.answer.question)}
                          </span>
                        )}
                        {content(
                          message,
                          <>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="ui-thc__attachments">
                                {message.attachments.map((file, index) => (
                                  <span key={`${file.name}-${index}`}>
                                    <Icon name="document" size={14} />
                                    {file.name}
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.text && (
                              <p className="ui-thc__bubble" dir="auto">
                                {message.text}
                              </p>
                            )}
                          </>,
                        )}
                        {message.status && message.status !== "sent" && (
                          <span className="ui-thc__send-status">
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
                      <div className="ui-thc__assistant" data-streaming={message.streaming || undefined}>
                        {messageIndex === 0 ||
                        list[messageIndex - 1]!.role === "user" ||
                        messageIndex === boundaryIndex ? (
                          <div className="ui-thc__who">
                            <span
                              className="ui-thc__avatar"
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
                          <span className="ui-thc__sr">{assistantName}:</span>
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
                                <div className="ui-thc__part" key={`${part.kind}-${index}`}>
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
                                      className="ui-thc__asked"
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
                                    <div className="ui-thc__error" role="status">
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
                          <span className="ui-thc__stopped">
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
                className="ui-thc__jump"
                aria-label={labels.jumpToLatest(newCount, streaming)}
                aria-keyshortcuts="End"
                onClick={latest}
              >
                <Icon name="arrow" size={14} />
                {newCount ? labels.newLines(newCount) : labels.latest}
                {streaming && <span className="ui-thc__jump-live" />}
              </button>
            )}
          </>
        )}
      </div>
      <footer className="ui-thc__foot">
        <div className="ui-thc__foot-column">
          <div className="ui-thc__dock-slot" data-visible={decisions.length > 0 || undefined}>
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
            <div className="ui-thc__above">
              {uploads.length > 0 && (
                <div className="ui-thc__upload-slot">
                  <ThreadUploads
                    labels={labels.uploads}
                    uploads={uploads}
                    onRemove={managed ? undefined : removeUpload}
                    onRetry={managed ? undefined : retryUpload}
                  />
                </div>
              )}
              {voicePreview && (
                <div className="ui-thc__upload-slot">
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
                  className="ui-thc__stop"
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
      <span role="status" aria-live="polite" className="ui-thc__sr">
        {announcement}
      </span>
    </section>
  );
}

export type AgentChatRailScreenProps = Omit<
  AppShellProps,
  "children" | "panel" | "panelTitle" | "onOpenChat" | "onNewChat"
> & {
  managed?: boolean;
  stopping?: boolean;
  renderMessageContent?: AgentThreadProps["renderMessageContent"];
  timeline?: AgentThreadProps["timeline"];
  threadLabels?: AgentThreadProps["labels"];
  formatTime?: AgentThreadProps["formatTime"];
  composer?: ReactNode;
  messages?: AgentMessage[];
  defaultMessages?: AgentMessage[];
  onMessagesChange?: (messages: AgentMessage[]) => void;
  onSend?: (message: string, options: ChatComposerSendOptions) => void;
  onStop?: () => void;
  onRetry?: (id: string) => void;
  onOpenChat?: (id: string) => void;
  onNewChat?: () => void;
  files?: ArtifactFile[];
  defaultFiles?: ArtifactFile[];
  onFilesChange?: (files: ArtifactFile[]) => void;
  openFiles?: string[];
  defaultOpenFiles?: string[];
  onOpenFilesChange?: (names: string[]) => void;
  activeFile?: string;
  defaultActiveFile?: string;
  onActiveFileChange?: (name: string) => void;
  onOpenFile?: (name: string) => void;
  composerProps?: Omit<ChatComposerProps, "onSend">;
  assistantName?: string;
  /** Set false to supply responses exclusively through messages/onMessagesChange. */
  simulate?: boolean;
};

/** The complete double-sidebar chat screen, with all its components and styles embedded in this file. */
export function AgentChatRailScreen({
  managed = false,
  stopping,
  renderMessageContent,
  timeline,
  threadLabels,
  formatTime,
  composer,
  chats: chatsProp,
  defaultChats: initialChats = defaultChats,
  onChatsChange,
  activeChat: activeChatProp,
  defaultActiveChat = "fabric",
  onOpenChat,
  onNewChat,
  project: projectProp,
  defaultProject = "",
  onProjectChange,
  messages: messagesProp,
  defaultMessages = defaultAgentMessages,
  onMessagesChange,
  onSend,
  onStop,
  onRetry,
  files: filesProp,
  defaultFiles = defaultArtifacts,
  onFilesChange,
  openFiles: openFilesProp,
  defaultOpenFiles,
  onOpenFilesChange,
  activeFile: activeFileProp,
  defaultActiveFile,
  onActiveFileChange,
  onOpenFile,
  panelOpen: panelOpenProp,
  defaultPanelOpen = true,
  onPanelOpenChange,
  composerProps,
  assistantName,
  simulate = onSend === undefined && messagesProp === undefined,
  rail = defaultChatRail,
  onNavigate,
  className,
  ...rest
}: AgentChatRailScreenProps) {
  const [chats, setChats] = useControllable(chatsProp, initialChats, onChatsChange);
  const [activeChat, setActiveChat] = useControllable(activeChatProp, defaultActiveChat, onOpenChat);
  const [project, setProject] = useControllable(projectProp, defaultProject, onProjectChange);
  const [conversations, setConversations] = useState<Record<string, AgentMessage[]>>(() => ({
    [defaultActiveChat]: defaultMessages,
  }));
  const [files, setFiles] = useControllable(filesProp, defaultFiles, onFilesChange);
  const [opened, setOpened] = useControllable(
    openFilesProp,
    defaultOpenFiles ?? (filesProp ?? defaultFiles).map((file) => file.name),
    onOpenFilesChange,
  );
  const [activeFile, setActiveFile] = useControllable(
    activeFileProp,
    defaultActiveFile ?? (filesProp ?? defaultFiles)[0]?.name ?? "",
    onActiveFileChange,
  );
  const [panelOpen, setPanelOpen] = useControllable(panelOpenProp, defaultPanelOpen, onPanelOpenChange);
  const newChatSequence = useRef(0);
  const current = chats.find((chat) => chat.id === activeChat);
  const messages = messagesProp ?? (managed ? [] : (conversations[activeChat] ?? []));
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
  const newChat = () => {
    const id = `chat-${Date.now()}-${++newChatSequence.current}`;
    setChats([...chats, { id, title: "New chat", project: project || undefined }]);
    setConversations((previous) => ({ ...previous, [id]: [] }));
    setActiveChat(id);
    onNewChat?.();
  };
  const composerAction = (action: string) => {
    composerProps?.onAction?.(action);
    if (action === "document") {
      let index = 1;
      while (files.some((file) => file.name === `Untitled ${index}.md`)) index++;
      const name = `Untitled ${index}.md`;
      setFiles([...files, { kind: "document", name, content: "# Untitled\n\n", updated: "Just now" }]);
      setOpened([...opened, name]);
      setActiveFile(name);
      setPanelOpen(true);
    } else onNavigate?.(action);
  };
  return (
    <AppShell
      {...rest}
      className={["ui-acrc", className].filter(Boolean).join(" ")}
      rail={rail}
      project={project}
      onProjectChange={setProject}
      chats={chats}
      onChatsChange={setChats}
      activeChat={activeChat}
      onOpenChat={setActiveChat}
      onNewChat={newChat}
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
        />
      }
    >
      <style href="ui-agent-chat-rail-clean" precedence="default">
        {css}
      </style>
      <AgentThread
        key={activeChat}
        managed={managed}
        stopping={stopping}
        renderMessageContent={renderMessageContent}
        timeline={timeline}
        labels={threadLabels}
        formatTime={formatTime}
        composer={composer}
        title={current?.title ?? "New chat"}
        assistantName={assistantName}
        messages={messages}
        onMessagesChange={(next) => {
          setConversations((previous) => ({ ...previous, [activeChat]: next }));
          onMessagesChange?.(next);
        }}
        onSend={(text, options) => {
          if (!managed && current?.title === "New chat" && text.trim())
            setChats(
              chats.map((chat) => (chat.id === activeChat ? { ...chat, title: text.trim().slice(0, 60) } : chat)),
            );
          onSend?.(text, options);
        }}
        onStop={onStop}
        onRetry={onRetry}
        onOpenFile={openFile}
        simulate={simulate}
        composerProps={{ ...composerProps, onAction: managed ? composerProps?.onAction : composerAction }}
      />
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

.ui-tac {
  --ui-tac-ink: rgba(0, 0, 0, 0.88);
  --ui-tac-text: rgba(0, 0, 0, 0.45);
  --ui-tac-faint: rgba(0, 0, 0, 0.27);
  --ui-tac-line: rgba(0, 0, 0, 0.06);
  --ui-tac-ok: #1a9a52;
  --ui-tac-danger: #e5484d;
  --ui-tac-focus: rgba(0, 96, 226, 0.35);
  --ui-tac-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tac-text);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-tac,
.ui-tac *,
.ui-tac *::before,
.ui-tac *::after {
  box-sizing: border-box;
}
.ui-tac button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-tac button:focus-visible {
  outline: 2px solid var(--ui-tac-focus);
  outline-offset: 2px;
}
.ui-tac button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tac__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0;
  text-align: left;
}
.ui-tac__status,
.ui-tac__mark {
  display: flex;
  align-items: center;
  color: var(--ui-tac-ok);
}
.ui-tac[data-state="failed"] .ui-tac__status,
.ui-tac__tool[data-status="failed"] .ui-tac__mark {
  color: var(--ui-tac-danger);
}
.ui-tac__title {
  position: relative;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-tac__chevron {
  display: flex;
  opacity: 0;
  transition:
    transform 280ms var(--ui-tac-ease),
    opacity 160ms;
}
.ui-tac__head:hover .ui-tac__chevron,
.ui-tac__head:focus-visible .ui-tac__chevron {
  opacity: 1;
}
.ui-tac[data-open="true"] .ui-tac__chevron {
  transform: rotate(180deg);
}
.ui-tac__wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 360ms var(--ui-tac-ease);
}
.ui-tac[data-open="true"] .ui-tac__wrap {
  grid-template-rows: 1fr;
}
.ui-tac__list {
  overflow: hidden;
  min-height: 0;
  list-style: none;
  padding: 0 0 0 4px;
  margin: 0;
}
.ui-tac__tool {
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
    transform 320ms var(--ui-tac-ease);
  transition-delay: calc(var(--ui-tac-index) * 35ms);
}
.ui-tac[data-open="true"] .ui-tac__tool {
  opacity: 1;
  transform: none;
}
.ui-tac__tool::before {
  content: "";
  position: absolute;
  left: 1px;
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--ui-tac-line);
}
.ui-tac__mark {
  position: absolute;
  left: -5px;
  background: var(--ui-tac-card, #fff);
}
.ui-tac__icon {
  display: flex;
  color: var(--ui-tac-faint);
}
.ui-tac__label {
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
}
.ui-tac__label small {
  display: block;
  color: var(--ui-tac-danger);
  font-size: 12px;
}
.ui-tac__time {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-tac-faint);
}
.ui-tac__retry {
  font-size: 12px !important;
  text-decoration: underline;
}
.ui-tac [data-spinning] svg {
  animation: ui-tac-spin 1s linear infinite;
  color: var(--ui-tac-text);
}
.ui-tac__title[data-shimmer]::after {
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  color: transparent;
  background: linear-gradient(100deg, transparent 25%, var(--ui-tac-ink) 50%, transparent 75%);
  background-size: 240% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: ui-tac-shimmer 2s linear infinite;
}
@keyframes ui-tac-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes ui-tac-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@container (max-width:320px) {
  .ui-tac__tool {
    gap: 6px;
  }
  .ui-tac__time {
    font-size: 10px;
  }
}
@media (pointer: coarse) {
  .ui-tac__head {
    min-height: 36px;
  }
  .ui-tac__tool {
    min-height: 34px;
  }
  .ui-tac__retry {
    min-height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tac *,
  .ui-tac *::after {
    animation: none !important;
    transition: none !important;
  }
  .ui-tac__tool {
    transform: none;
  }
  .ui-tac__title[data-shimmer]::after {
    display: none;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tac {
  --ui-tac-ink: rgba(255, 255, 255, 0.9);
  --ui-tac-text: rgba(255, 255, 255, 0.46);
  --ui-tac-faint: rgba(255, 255, 255, 0.3);
  --ui-tac-line: rgba(255, 255, 255, 0.08);
  --ui-tac-card: #1c1c1e;
  --ui-tac-ok: #3ec27a;
  --ui-tac-danger: #ff6369;
  --ui-tac-focus: rgba(77, 141, 255, 0.5);
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
  display: none;
  gap: 1px;
  width: 240px;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-wsm-ring),
    0 12px 32px -8px rgba(0, 0, 0, 0.16);
  animation: ui-asc-fade 120ms ease;
}
.ui-asc__wsm-panel::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -8px;
  width: 8px;
}
.ui-asc__wsm-sub:is(:hover, :focus-within, [data-open]) > .ui-asc__wsm-panel {
  display: grid;
}
@keyframes ui-asc-wsm-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
@container ui-asc (max-width:899.99px) {
  .ui-asc__wsm-panel {
    position: static;
    width: auto;
    margin: 2px 0 4px;
    padding: 0 0 0 14px;
    border-radius: 0;
    background: none;
    box-shadow: none;
    animation: none;
  }
  .ui-asc__wsm-panel::before {
    display: none;
  }
  .ui-asc__wsm-sub:hover:not(:focus-within, [data-open]) > .ui-asc__wsm-panel {
    display: none;
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

.ui-tkc {
  --ui-tkc-card: #fff;
  --ui-tkc-ink: rgba(0, 0, 0, 0.88);
  --ui-tkc-muted: rgba(0, 0, 0, 0.45);
  --ui-tkc-faint: rgba(0, 0, 0, 0.27);
  --ui-tkc-line: rgba(0, 0, 0, 0.06);
  --ui-tkc-fill: rgba(0, 0, 0, 0.025);
  --ui-tkc-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px;
  background: var(--ui-tkc-card);
  border-radius: 12px;
  box-shadow: 0 0 0 0.5px var(--ui-tkc-line);
  font:
    13px/1.45 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tkc-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tkc-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tkc,
.ui-tkc *,
.ui-tkc *::before,
.ui-tkc *::after {
  box-sizing: border-box;
}
.ui-tkc__mark {
  display: flex;
  flex: none;
  color: #e8a20c;
}
.ui-tkc[data-tone="active"] .ui-tkc__mark {
  color: #ff7c3c;
}
.ui-tkc[data-tone="done"] .ui-tkc__mark {
  color: #0095ff;
}
.ui-tkc[data-tone="error"] .ui-tkc__mark {
  color: #e5484d;
}
.ui-tkc__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.ui-tkc__text strong {
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}
.ui-tkc__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-tkc-muted);
}
.ui-tkc__text > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-tkc__count {
  font-size: 12px;
  color: var(--ui-tkc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tkc button {
  font: inherit;
  font-size: 12px;
  background: none;
  border: 0;
  border-radius: 6px;
  color: var(--ui-tkc-muted);
  height: 28px;
  padding: 0 6px;
  cursor: pointer;
  flex: none;
}
.ui-tkc button:hover {
  background: var(--ui-tkc-fill);
  color: var(--ui-tkc-ink);
}
.ui-tkc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tkc button:focus-visible {
  outline: 2px solid var(--ui-tkc-focus);
  outline-offset: 2px;
}
.ui-tkc button:active:not(:disabled) {
  transform: scale(0.97);
}
@keyframes ui-tkc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container (max-width:320px) {
  .ui-tkc__text small {
    font-size: 11px;
  }
  .ui-tkc__count {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tkc {
    min-height: 56px;
  }
  .ui-tkc button {
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tkc,
  .ui-tkc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tkc {
  --ui-tkc-card: #1c1c1e;
  --ui-tkc-ink: rgba(255, 255, 255, 0.9);
  --ui-tkc-muted: rgba(255, 255, 255, 0.46);
  --ui-tkc-faint: rgba(255, 255, 255, 0.3);
  --ui-tkc-line: rgba(255, 255, 255, 0.08);
  --ui-tkc-fill: rgba(255, 255, 255, 0.04);
  --ui-tkc-focus: rgba(77, 141, 255, 0.5);
}

.ui-ddc__choices {
  max-height: min(48vh, 420px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.ui-ddc button:disabled,
.ui-ddc input:disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-ddc__error {
  margin: 0;
  padding: 4px;
  color: #e5484d;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.ui-ddc__text strong {
  overflow-wrap: anywhere;
}
.ui-ddc {
  --ui-ddc-card: #fff;
  --ui-ddc-tray: #f0f0f0;
  --ui-ddc-ink: rgba(0, 0, 0, 0.88);
  --ui-ddc-muted: rgba(0, 0, 0, 0.45);
  --ui-ddc-faint: rgba(0, 0, 0, 0.27);
  --ui-ddc-line: rgba(0, 0, 0, 0.06);
  --ui-ddc-fill: rgba(0, 0, 0, 0.04);
  --ui-ddc-focus: rgba(0, 96, 226, 0.35);
  --ui-ddc-ease: cubic-bezier(0.22, 1, 0.36, 1);
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
  color: var(--ui-ddc-ink);
  container: ui-ddc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ddc,
.ui-ddc *,
.ui-ddc *::before,
.ui-ddc *::after {
  box-sizing: border-box;
}
.ui-ddc button,
.ui-ddc input {
  font: inherit;
  color: inherit;
}
.ui-ddc button {
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-ddc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ddc button:focus-visible,
.ui-ddc input:focus-visible {
  outline: 2px solid var(--ui-ddc-focus);
  outline-offset: -2px;
}
.ui-ddc__collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition:
    grid-template-rows 380ms var(--ui-ddc-ease),
    opacity 180ms;
}
.ui-ddc[data-folded] .ui-ddc__collapse,
.ui-ddc[data-empty] .ui-ddc__collapse {
  grid-template-rows: 0fr;
  opacity: 0;
}
.ui-ddc__clip {
  min-height: 0;
  overflow: clip;
  overflow-clip-margin: 1px;
  padding: 0;
}
.ui-ddc__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 18px;
  padding: 10px 8px 6px;
  background: var(--ui-ddc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ddc-line);
  animation: ui-ddc-in 260ms var(--ui-ddc-ease) both;
}
.ui-ddc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 4px;
  margin-bottom: 0;
  font-size: 12px;
  color: var(--ui-ddc-muted);
}
.ui-ddc__tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
  flex: none;
}
.ui-ddc__task {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ddc__pager {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-ddc__pager button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 22px;
  border-radius: 4px;
  color: var(--ui-ddc-muted);
}
.ui-ddc__pager button:first-child svg {
  rotate: 90deg;
}
.ui-ddc__pager button:last-child svg {
  rotate: -90deg;
}
.ui-ddc__later {
  font-size: 12px !important;
  border-radius: 4px;
  padding: 3px 6px;
}
.ui-ddc__later:hover,
.ui-ddc__pager button:hover {
  background: var(--ui-ddc-fill);
}
.ui-ddc__question {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  margin: 0;
  padding: 0 4px;
  overflow-wrap: anywhere;
}
.ui-ddc__choices {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ui-ddc__option {
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
.ui-ddc__option:hover,
.ui-ddc__option:focus-visible {
  background: var(--ui-ddc-fill);
}
.ui-ddc__number {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  background: var(--ui-ddc-fill);
  color: var(--ui-ddc-muted);
  border-radius: 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-ddc__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0;
}
.ui-ddc__text strong {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}
.ui-ddc__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ddc-muted);
  overflow-wrap: anywhere;
}
.ui-ddc__recommended {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--ui-ddc-fill);
  color: var(--ui-ddc-muted);
  white-space: nowrap;
}
.ui-ddc__custom {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 4px 8px 4px 4px;
}
.ui-ddc__custom input {
  width: 0;
  flex: 1;
  background: none;
  border: 0;
  outline: none;
  padding: 0;
  line-height: 20px;
  min-width: 0;
}
.ui-ddc__custom input::placeholder {
  color: var(--ui-ddc-faint);
}
.ui-ddc__custom button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background: var(--ui-ddc-fill);
}
.ui-ddc__facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 6px;
  font-size: 13px;
}
.ui-ddc__facts > div {
  display: flex;
  gap: 12px;
}
.ui-ddc__facts dt {
  color: var(--ui-ddc-muted);
  width: 60px;
  flex: none;
}
.ui-ddc__facts dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ddc__folded {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  font-size: 12px;
  color: var(--ui-ddc-muted);
  padding: 0 8px 0 14px;
  border-radius: 18px;
  background: var(--ui-ddc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ddc-line);
}
.ui-ddc__folded button {
  padding: 4px 7px;
  border-radius: 5px;
  font-size: 12px;
}
.ui-ddc__folded button:hover {
  background: var(--ui-ddc-fill);
}
.ui-ddc__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-ddc[data-kind="pick"] .ui-ddc__choices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.ui-ddc[data-kind="pick"] .ui-ddc__option {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  border-radius: 10px;
}
.ui-ddc[data-kind="pick"] .ui-ddc__option .ui-ddc__number {
  margin-left: 2px;
}
.ui-ddc[data-kind="pick"] .ui-ddc__recommended {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ui-ddc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ddc-line);
}
.ui-ddc__wire {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  grid-column: 1/-1;
  height: 92px;
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 0.5px var(--ui-ddc-line);
  background: var(--ui-ddc-fill);
  overflow: hidden;
}
.ui-ddc__card[data-pulse] {
  animation: ui-ddc-pulse 550ms ease both;
}
@keyframes ui-ddc-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@keyframes ui-ddc-pulse {
  30% {
    background: var(--ui-ddc-fill);
  }
}
@container ui-ddc (max-width:440px) {
  .ui-ddc__recommended {
    font-size: 9px;
  }
  .ui-ddc__option {
    gap: 7px;
  }
  .ui-ddc__text small {
    font-size: 11px;
  }
  .ui-ddc__card {
    padding: 10px;
  }
  .ui-ddc[data-kind="pick"] .ui-ddc__choices {
    gap: 5px;
  }
}
@media (pointer: coarse) {
  .ui-ddc__option {
    min-height: 44px;
  }
  .ui-ddc__custom {
    min-height: 40px;
  }
  .ui-ddc__custom input {
    font-size: 16px;
  }
  .ui-ddc__pager button,
  .ui-ddc__later {
    min-width: 32px;
    min-height: 36px;
  }
  .ui-ddc__folded button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ddc,
  .ui-ddc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ddc {
  --ui-ddc-card: #1c1c1e;
  --ui-ddc-tray: #161618;
  --ui-ddc-ink: rgba(255, 255, 255, 0.9);
  --ui-ddc-muted: rgba(255, 255, 255, 0.46);
  --ui-ddc-faint: rgba(255, 255, 255, 0.3);
  --ui-ddc-line: rgba(255, 255, 255, 0.08);
  --ui-ddc-fill: rgba(255, 255, 255, 0.08);
  --ui-ddc-focus: rgba(77, 141, 255, 0.5);
}

.ui-ddc__wire > svg {
  display: block;
  width: 100%;
  height: 100%;
}

.ui-cnc {
  --ui-cnc-card: #fff;
  --ui-cnc-text: rgba(0, 0, 0, 0.61);
  --ui-cnc-muted: rgba(0, 0, 0, 0.45);
  --ui-cnc-line: rgba(0, 0, 0, 0.06);
  --ui-cnc-fill: rgba(0, 0, 0, 0.04);
  --ui-cnc-focus: rgba(0, 96, 226, 0.35);
  display: flex;
  justify-content: center;
  width: 100%;
  color: var(--ui-cnc-text);
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
.ui-cnc__pill {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  max-width: 100%;
  padding: 0 4px 0 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ui-cnc-text) 6%, var(--ui-cnc-card));
  white-space: nowrap;
  animation: ui-cnc-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-cnc__pill:not(:has(button)) {
  padding-right: 12px;
}
.ui-cnc__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-cnc,
.ui-cnc *,
.ui-cnc *::before,
.ui-cnc *::after {
  box-sizing: border-box;
}
.ui-cnc__mark {
  display: flex;
  color: #e8a20c;
}
.ui-cnc[data-status="online"] .ui-cnc__mark {
  color: #1a9a52;
}
.ui-cnc__timer {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--ui-cnc-muted);
  font-size: 11px;
}
.ui-cnc button {
  height: 24px;
  flex: none;
  background: none;
  border: 0;
  border-radius: 999px;
  padding: 0 8px;
  font: inherit;
  color: var(--ui-cnc-text);
  cursor: pointer;
}
.ui-cnc button:hover {
  background: var(--ui-cnc-fill);
}
.ui-cnc button:disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-cnc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cnc button:focus-visible {
  outline: 2px solid var(--ui-cnc-focus);
  outline-offset: 2px;
}
@keyframes ui-cnc-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
@container (max-width:560px) {
  .ui-cnc__pill {
    max-width: calc(100% - 104px);
  }
  .ui-cnc__timer {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-cnc button {
    height: 36px;
  }
  .ui-cnc__pill {
    height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cnc,
  .ui-cnc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cnc {
  --ui-cnc-card: #1c1c1e;
  --ui-cnc-text: rgba(255, 255, 255, 0.62);
  --ui-cnc-muted: rgba(255, 255, 255, 0.46);
  --ui-cnc-line: rgba(255, 255, 255, 0.08);
  --ui-cnc-fill: rgba(255, 255, 255, 0.08);
  --ui-cnc-focus: rgba(77, 141, 255, 0.5);
}

.ui-cnc__spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--ui-cnc-line);
  border-top-color: var(--ui-cnc-muted);
  animation: ui-cnc-spin 900ms linear infinite;
}
@keyframes ui-cnc-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cnc__spinner {
    animation: none;
  }
}

.ui-ayc {
  --ui-ayc-card: #fff;
  --ui-ayc-ink: rgba(0, 0, 0, 0.88);
  --ui-ayc-muted: rgba(0, 0, 0, 0.45);
  --ui-ayc-faint: rgba(0, 0, 0, 0.27);
  --ui-ayc-line: rgba(0, 0, 0, 0.06);
  --ui-ayc-fill: rgba(0, 0, 0, 0.025);
  --ui-ayc-focus: rgba(0, 96, 226, 0.35);
  font:
    13px/1.5 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ayc-ink);
  width: 100%;
  container: ui-ayc / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-ayc-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ayc,
.ui-ayc *,
.ui-ayc *::before,
.ui-ayc *::after {
  box-sizing: border-box;
}
.ui-ayc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ayc button:focus-visible {
  outline: 2px solid var(--ui-ayc-focus);
  outline-offset: -2px;
}
.ui-ayc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ayc__card {
  border-radius: 14px;
  background: var(--ui-ayc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ayc-line);
  padding: 12px;
}
.ui-ayc__card > header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px 10px;
}
.ui-ayc__title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
}
.ui-ayc__title svg {
  color: var(--ui-ayc-muted);
}
.ui-ayc__counts {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ayc__rows {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ui-ayc__row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 30px;
  text-align: left;
  padding: 5px 3px;
  border-radius: 5px;
}
.ui-ayc__row:hover {
  background: var(--ui-ayc-fill);
}
.ui-ayc__row strong {
  font-size: 12px;
  font-weight: 400;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ayc__row small {
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ayc__row > svg {
  color: var(--ui-ayc-faint);
  flex: none;
}
.ui-ayc__check {
  display: flex;
  color: #1a9a52;
}
.ui-ayc__dot {
  width: 5px;
  height: 5px;
  margin: 0 4px;
  flex: none;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-ayc__card > footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}
.ui-ayc__card > footer button {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 24px;
  font-size: 11px;
  color: var(--ui-ayc-muted);
  padding: 3px;
  border-radius: 4px;
}
.ui-ayc__boundary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0;
  color: var(--ui-ayc-muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.ui-ayc__boundary::before,
.ui-ayc__boundary::after {
  content: "";
  height: 0.5px;
  background: var(--ui-ayc-line);
  flex: 1;
}
.ui-ayc__boundary button {
  font-size: 11px;
  color: var(--ui-ayc-muted);
  padding: 3px;
  border-radius: 4px;
}
@keyframes ui-ayc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container ui-ayc (max-width:420px) {
  .ui-ayc__row {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }
  .ui-ayc__row strong {
    flex: 1;
  }
  .ui-ayc__row small {
    flex-basis: calc(100% - 24px);
    margin-left: 20px;
    order: 4;
  }
  .ui-ayc__card > header {
    flex-wrap: wrap;
  }
  .ui-ayc__counts {
    margin-left: 22px;
  }
}
@media (pointer: coarse) {
  .ui-ayc__row {
    min-height: 36px;
  }
  .ui-ayc__card > footer button,
  .ui-ayc__boundary button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ayc,
  .ui-ayc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ayc {
  --ui-ayc-card: #1c1c1e;
  --ui-ayc-ink: rgba(255, 255, 255, 0.9);
  --ui-ayc-muted: rgba(255, 255, 255, 0.46);
  --ui-ayc-faint: rgba(255, 255, 255, 0.3);
  --ui-ayc-line: rgba(255, 255, 255, 0.08);
  --ui-ayc-fill: rgba(255, 255, 255, 0.04);
  --ui-ayc-focus: rgba(77, 141, 255, 0.5);
}

.ui-ayc__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px 8px;
  border-radius: 12px;
}
.ui-ayc__card > header {
  align-items: baseline;
  gap: 8px;
  padding: 0 6px 2px;
}
.ui-ayc__counts {
  margin-left: 0;
  font-size: 12px;
}
.ui-ayc__rows {
  gap: 0;
}
.ui-ayc__row {
  height: 32px;
  min-height: 32px;
  gap: 10px;
  padding: 0 6px;
}
.ui-ayc__row strong {
  font-size: 13px;
  flex: 0 1 auto;
}
.ui-ayc__row small {
  font-size: 12px;
  margin-left: 0;
  flex: 0 100 auto;
}
.ui-ayc__row[data-question] small {
  margin-left: auto;
  flex: none;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
}
.ui-ayc__card > footer {
  justify-content: flex-start;
  gap: 4px;
  margin-top: 0;
  padding-top: 2px;
}
.ui-ayc__card > footer button {
  font-size: 12px;
  padding: 3px 6px;
  min-height: 28px;
}
.ui-ayc__check {
  display: grid;
  place-items: center;
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid #0095ff;
  border-radius: 50%;
}
.ui-ayc__check > svg {
  display: none;
}
.ui-ayc__check:after {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0095ff;
}
.ui-ayc__boundary:before {
  order: 0;
}
.ui-ayc__boundary > span {
  order: 1;
}
.ui-ayc__boundary:after {
  order: 2;
}
.ui-ayc__boundary > button {
  order: 3;
  display: flex;
  align-items: center;
  gap: 5px;
}
@media (pointer: coarse) {
  .ui-ayc__row {
    height: auto;
    min-height: 36px;
  }
  .ui-ayc__card > footer button {
    min-height: 36px;
  }
}

.ui-upc {
  --ui-upc-card: #fff;
  --ui-upc-ink: rgba(0, 0, 0, 0.88);
  --ui-upc-muted: rgba(0, 0, 0, 0.45);
  --ui-upc-faint: rgba(0, 0, 0, 0.27);
  --ui-upc-line: rgba(0, 0, 0, 0.06);
  --ui-upc-fill: rgba(0, 0, 0, 0.025);
  --ui-upc-accent: #0060e2;
  --ui-upc-focus: rgba(0, 96, 226, 0.35);
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
  color: var(--ui-upc-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-upc,
.ui-upc *,
.ui-upc *::before,
.ui-upc *::after {
  box-sizing: border-box;
}
.ui-upc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-upc button:focus-visible {
  outline: 2px solid var(--ui-upc-focus);
  outline-offset: 2px;
}
.ui-upc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-upc__file {
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
  box-shadow: 0 0 0 0.5px var(--ui-upc-line);
  background: var(--ui-upc-fill);
  animation: ui-upc-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-upc__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--ui-upc-fill);
  color: var(--ui-upc-muted);
}
.ui-upc__icon[data-kind="voice"] {
  color: #a367d1;
}
.ui-upc__icon[data-kind="video"] {
  color: #db5e9d;
}
.ui-upc__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-upc__info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0;
}
.ui-upc__info strong {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-upc__status {
  font-size: 11px;
  line-height: 16px;
  color: var(--ui-upc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-upc__status button {
  font-size: 11px;
  text-decoration: underline;
  padding: 0;
}
.ui-upc__file[data-state="failed"] .ui-upc__status {
  color: #e5484d;
}
.ui-upc__remove {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  color: var(--ui-upc-muted) !important;
}
.ui-upc__remove:hover {
  background: var(--ui-upc-fill);
}
.ui-upc__bar {
  position: absolute;
  bottom: 0;
  left: 10px;
  right: 10px;
  display: block;
  height: 2px;
  border-radius: 2px;
  background: var(--ui-upc-fill);
  overflow: hidden;
  margin-top: 3px;
}
.ui-upc__bar > span {
  display: block;
  transform-origin: left;
  width: 100%;
  height: 100%;
  background: var(--ui-upc-accent);
  transition: transform 200ms linear;
}
.ui-upc__file[data-state="paused"] .ui-upc__bar > span {
  background: var(--ui-upc-faint);
}
.ui-upc__voice {
  flex-wrap: nowrap;
  align-items: center;
  padding: 4px 6px;
  gap: 8px;
  border-radius: 14px;
  height: 36px;
  background: var(--ui-upc-card);
  box-shadow: 0 0 0 0.5px var(--ui-upc-line);
}
.ui-upc__voice > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--ui-upc-muted);
}
.ui-upc__voice > button:hover {
  background: var(--ui-upc-fill);
}
.ui-upc__red-dot {
  width: 5px;
  height: 5px;
  background: #e5484d;
  border-radius: 50%;
  animation: ui-upc-pulse 1s ease-in-out infinite;
}
.ui-upc__wave {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: flex-start;
  height: 20px;
  overflow: hidden;
}
.ui-upc__wave i {
  display: block;
  flex: none;
  width: 2px;
  border-radius: 2px;
  background: var(--ui-upc-accent);
  animation: ui-upc-wave 600ms ease-in-out infinite alternate;
}
.ui-upc__time {
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  color: var(--ui-upc-muted);
}
@keyframes ui-upc-wave {
  to {
    transform: scaleY(0.2);
  }
}
@keyframes ui-upc-pulse {
  50% {
    opacity: 0.3;
  }
}
@keyframes ui-upc-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@container (max-width:400px) {
  .ui-upc__file {
    max-width: 100%;
  }
}
@media (pointer: coarse) {
  .ui-upc__remove,
  .ui-upc__voice > button {
    width: 36px;
    height: 36px;
  }
  .ui-upc__status button {
    min-height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-upc,
  .ui-upc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-upc {
  --ui-upc-card: #1c1c1e;
  --ui-upc-ink: rgba(255, 255, 255, 0.9);
  --ui-upc-muted: rgba(255, 255, 255, 0.46);
  --ui-upc-faint: rgba(255, 255, 255, 0.3);
  --ui-upc-line: rgba(255, 255, 255, 0.08);
  --ui-upc-fill: rgba(255, 255, 255, 0.04);
  --ui-upc-accent: #4d8dff;
  --ui-upc-focus: rgba(77, 141, 255, 0.5);
}

.ui-upc__file[data-kind="voice"] {
  max-width: 380px;
}
.ui-upc__file[data-kind="voice"][data-state="waiting"] {
  padding-block: 6px;
}
.ui-upc__file[data-kind="voice"] .ui-upc__status {
  white-space: normal;
}

.ui-thc[data-orchestrator] {
  position: relative;
}
.ui-thc[data-orchestrator] > .ui-cnc {
  position: absolute;
  inset: 8px 0 auto;
  z-index: 4;
  pointer-events: none;
}
.ui-thc[data-orchestrator] .ui-thc__head {
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
.ui-thc__title {
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}
.ui-thc__summary {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  font-size: 11px;
  color: var(--ui-thc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-thc__summary button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  min-height: 28px;
  border-radius: 5px;
  padding: 3px;
}
.ui-thc__summary button:hover {
  background: var(--ui-thc-fill);
}
.ui-thc__summary-separator {
  color: var(--ui-thc-faint);
}
.ui-thc__running-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #13b8a6;
}
.ui-thc__needs-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-thc[data-orchestrator] .ui-thc__scroll {
  padding-top: 56px;
  padding-bottom: 8px;
  mask-image: linear-gradient(transparent, #000 20px);
}
.ui-thc[data-orchestrator] .ui-thc__bubble {
  max-width: 80%;
}
.ui-thc__part {
  margin-top: 12px;
}
.ui-thc__part:has(.ui-tkc) + .ui-thc__part:has(.ui-tkc) {
  margin-top: 8px;
}
.ui-thc__part > .ui-thc__files {
  margin-top: 0;
}
.ui-thc__part > .ui-thc__text {
  margin: 0;
}
.ui-thc__asked {
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
  color: var(--ui-thc-muted) !important;
}
.ui-thc__asked:hover {
  background: var(--ui-thc-fill);
}
.ui-thc__asked > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-thc__asked > i {
  width: 6px;
  height: 6px;
  margin: 0 4px;
  background: #e8a20c;
  border-radius: 50%;
  flex: none;
}
.ui-thc__asked > i[data-answered] {
  background: #1a9a52;
}
.ui-thc__asked > small {
  font-size: 11px;
  color: var(--ui-thc-faint);
  flex: none;
}
.ui-thc__error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5484d;
  font-size: 12px;
  padding: 7px 0;
}
.ui-thc__error > span {
  flex: 1;
  overflow-wrap: anywhere;
}
.ui-thc__error button {
  font-size: 12px;
  text-decoration: underline;
}
.ui-thc__answer-context {
  font-size: 11px;
  color: var(--ui-thc-muted);
  max-width: 80%;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-thc__dock-slot[data-visible] {
  margin-bottom: 16px;
}
.ui-thc__upload-slot {
  flex: 1;
  min-width: 0;
}
.ui-thc[data-orchestrator] .ui-thc__above {
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 2px;
  margin-bottom: 8px;
}
.ui-thc__jump-live {
  width: 5px;
  height: 5px;
  background: #13b8a6;
  border-radius: 50%;
  animation: ui-thc-caret 1.2s ease infinite;
}
.ui-thc__unread-boundary {
  position: relative;
  margin-bottom: 18px;
}
.ui-thc[data-orchestrator] .ui-thc__foot {
  padding-top: 4px;
}
.ui-thc[data-orchestrator] .ui-thc__foot-column > .ui-ccc {
  margin-top: 8px;
}
.ui-thc[data-orchestrator] .ui-thc__foot-column:has(.ui-thc__dock-slot[data-visible]) > .ui-ccc {
  margin-top: 0;
}
@container ui-thc (max-width:900px) {
  .ui-thc__summary {
    display: none;
  }
}
@container ui-thc (max-width:560px) {
  .ui-thc[data-orchestrator] .ui-thc__scroll {
    padding-inline: 12px;
  }
  .ui-thc[data-orchestrator] .ui-thc__foot {
    padding-inline: 12px;
  }
  .ui-thc[data-orchestrator] .ui-thc__bubble {
    max-width: 88%;
  }
  .ui-thc__asked {
    flex-wrap: wrap;
  }
  .ui-thc__asked > span {
    white-space: normal;
    flex: 1;
  }
  .ui-thc__asked > small {
    margin-left: 12px;
  }
}

.ui-thc {
  --ui-thc-card: #fff;
  --ui-thc-ink: rgba(0, 0, 0, 0.88);
  --ui-thc-text: rgba(0, 0, 0, 0.61);
  --ui-thc-muted: rgba(0, 0, 0, 0.45);
  --ui-thc-faint: rgba(0, 0, 0, 0.27);
  --ui-thc-fill: rgba(0, 0, 0, 0.04);
  --ui-thc-line: rgba(0, 0, 0, 0.06);
  --ui-thc-focus: rgba(0, 96, 226, 0.35);
  --ui-thc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  position: relative;
  background: var(--ui-thc-card);
  border-radius: inherit;
  container: ui-thc / inline-size;
  font:
    14px/1.6 "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-thc-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-thc,
.ui-thc *,
.ui-thc *::before,
.ui-thc *::after {
  box-sizing: border-box;
}
.ui-thc :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-thc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-thc button:focus-visible {
  outline: 2px solid var(--ui-thc-focus);
  outline-offset: 2px;
}
.ui-thc__head {
  height: 32px;
  flex: none;
}
.ui-thc__body {
  flex: 1;
  min-height: 0;
  position: relative;
}
.ui-thc__scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 24px 32px 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-thc-line) transparent;
  overflow-anchor: none;
}
.ui-thc__column {
  max-width: 680px;
  margin-inline: auto;
  min-width: 0;
}
.ui-thc__user {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  margin: 0 0 24px;
  animation: ui-thc-in 420ms var(--ui-thc-ease) both;
}
.ui-thc__bubble {
  max-width: 94%;
  margin: 0;
  padding: 8px 14px;
  border-radius: 18px;
  background: var(--ui-thc-fill);
  line-height: 22.4px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.ui-thc__assistant {
  margin-bottom: 24px;
  animation: ui-thc-in 420ms var(--ui-thc-ease) both;
}
.ui-thc__who {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 22px;
  font-size: 13px;
  line-height: 20.8px;
  margin-bottom: 12px;
}
.ui-thc__who time {
  font-size: 11px;
  color: var(--ui-thc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-thc__avatar {
  display: grid;
  grid-template-columns: repeat(3, 3px);
  grid-template-rows: repeat(3, 3px);
  gap: 2px;
  width: 15px;
  height: 15px;
  flex: none;
  align-content: center;
}
.ui-thc__avatar i {
  background: #a654ff;
  width: 3px;
  height: 3px;
}
.ui-thc__avatar[data-busy] i {
  animation: ui-thc-pixel 1.25s ease-in-out infinite;
}
.ui-thc__assistant > .ui-tac {
  margin-bottom: 12px;
}
.ui-thc__text p {
  margin: 0 0 12px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.ui-thc__text p:last-child {
  margin-bottom: 0;
}
.ui-thc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.ui-thc__file {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 240px;
  height: 26px;
  padding: 3px 8px !important;
  background: var(--ui-thc-fill) !important;
  border-radius: 6px;
  font-size: 12px !important;
}
.ui-thc__file > span:first-child {
  display: flex;
  color: #2989df;
}
.ui-thc__file > span[data-kind="table"] {
  color: #1a9a52;
}
.ui-thc__file > span[data-kind="code"] {
  color: #eb9238;
}
.ui-thc__file > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-thc__file:hover {
  box-shadow: 0 0 0 0.5px var(--ui-thc-line);
}
.ui-thc__foot {
  padding: 12px 32px 20px;
  position: relative;
  flex: none;
}
.ui-thc__foot-column {
  width: 100%;
  max-width: 680px;
  margin-inline: auto;
}
.ui-thc__above {
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}
.ui-thc__stop {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 3px 12px !important;
  border-radius: 20px;
  font-size: 12px !important;
  background: var(--ui-thc-card) !important;
  box-shadow:
    0 0 0 0.5px var(--ui-thc-line),
    0 2px 6px rgba(0, 0, 0, 0.04);
  animation: ui-thc-in 200ms both;
}
.ui-thc__stop:hover {
  background: var(--ui-thc-fill) !important;
}
.ui-thc__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  background: var(--ui-thc-ink);
  vertical-align: -2px;
  animation: ui-thc-caret 1s steps(2) infinite;
}
.ui-thc__stopped,
.ui-thc__send-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ui-thc-muted);
  margin-top: 8px;
}
.ui-thc__send-status button {
  font-size: inherit;
  text-decoration: underline;
}
.ui-thc__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  margin-bottom: 7px;
}
.ui-thc__attachments > span {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--ui-thc-fill);
  border-radius: 7px;
  padding: 5px 8px;
  font-size: 12px;
}
.ui-thc__jump {
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
  background: var(--ui-thc-card) !important;
  box-shadow:
    0 0 0 0.5px var(--ui-thc-line),
    0 3px 14px rgba(0, 0, 0, 0.06);
  font-size: 12px !important;
  white-space: nowrap;
  z-index: 2;
}
.ui-thc__jump svg {
  rotate: 90deg;
}
.ui-thc__empty {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--ui-thc-muted);
}
.ui-thc__empty-icon {
  color: #a654ff;
  margin-bottom: 12px;
}
.ui-thc__empty h2 {
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--ui-thc-ink);
  margin: 0 0 8px;
}
.ui-thc__empty p {
  font-size: 13px;
  margin: 0;
}
.ui-thc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@keyframes ui-thc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@keyframes ui-thc-pixel {
  50% {
    opacity: 0.2;
  }
}
@keyframes ui-thc-caret {
  50% {
    opacity: 0;
  }
}
@container ui-thc (max-width:600px) {
  .ui-thc__scroll {
    padding-inline: 24px;
  }
  .ui-thc__foot {
    padding-inline: 24px;
  }
  .ui-thc__bubble {
    max-width: 96%;
  }
}
@container ui-thc (max-width:400px) {
  .ui-thc__scroll {
    padding: 20px 16px 12px;
  }
  .ui-thc__foot {
    padding: 12px 12px 14px;
  }
  .ui-thc__bubble {
    padding: 8px 12px;
  }
  .ui-thc__user {
    margin-bottom: 20px;
  }
  .ui-thc__assistant {
    margin-bottom: 26px;
  }
  .ui-thc__empty h2 {
    font-size: 21px;
  }
}
@media (pointer: coarse) {
  .ui-thc__file {
    height: 32px;
  }
  .ui-thc__stop {
    min-height: 36px;
  }
  .ui-thc__jump {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-thc,
  .ui-thc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .ui-thc__caret {
    opacity: 0.45;
  }
}
:where(.dark, [data-theme="dark"]) .ui-thc {
  --ui-thc-card: #1c1c1e;
  --ui-thc-ink: rgba(255, 255, 255, 0.9);
  --ui-thc-text: rgba(255, 255, 255, 0.62);
  --ui-thc-muted: rgba(255, 255, 255, 0.46);
  --ui-thc-faint: rgba(255, 255, 255, 0.3);
  --ui-thc-fill: rgba(255, 255, 255, 0.06);
  --ui-thc-line: rgba(255, 255, 255, 0.08);
  --ui-thc-focus: rgba(77, 141, 255, 0.5);
}

@container ui-thc (max-width:560px) {
  .ui-thc:has(> .ui-cnc) .ui-thc__summary {
    visibility: hidden;
  }
}

.ui-acrc {
  min-height: 480px;
}
@media (prefers-reduced-motion: reduce) {
  .ui-acrc {
    scroll-behavior: auto;
  }
}

`;
