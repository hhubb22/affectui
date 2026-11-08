"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * task-create (Classic) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
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
      className={["ui-tpr", className].filter(Boolean).join(" ")}
      data-tone={tone}
      width={clamp(safeNumber(size, 14), 10, 64)}
      height={clamp(safeNumber(size, 14), 10, 64)}
      viewBox="0 0 16 16"
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
    >
      <style href="ui-task-create" precedence="default">
        {css}
      </style>
      <circle className="ui-tpr__track" cx="8" cy="8" r="6.1" />
      {status !== "planning" && (
        <circle
          className="ui-tpr__value"
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
      className={["ui-tcr", className].filter(Boolean).join(" ")}
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
      <style href="ui-task-create" precedence="default">
        {css}
      </style>
      <TaskProgressRing status="planning" />
      <label className="ui-tcr__sr" htmlFor={`${id}-input`}>
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
      <span className="ui-tcr__sr" id={`${id}-hint`}>
        Enter creates the task, Shift+Enter starts a new line
      </span>
      <button
        ref={anchor}
        type="button"
        className="ui-tcr__project"
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
      <button type="submit" className="ui-tcr__submit" disabled={!value.trim() || !onCreate}>
        {createLabel}
      </button>
      {menu && (
        <FloatingMenu
          anchor={anchor}
          root={root}
          id={`${id}-projects`}
          label="Project"
          className="ui-tcr__menu"
          align="end"
          onClose={() => setMenu(false)}
        >
          <span className="ui-tcr__menu-label">Project</span>
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

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-tpr {
  --ui-tpr-muted: rgba(0, 0, 0, 0.27);
  --ui-tpr-running: #13b3a0;
  --ui-tpr-waiting: #e8b000;
  --ui-tpr-paused: #f28a2e;
  --ui-tpr-done: #5fc88a;
  display: block;
  flex: none;
  color: var(--ui-tpr-running);
  overflow: visible;
  -webkit-font-smoothing: antialiased;
}
.ui-tpr,
.ui-tpr * {
  box-sizing: border-box;
}
.ui-tpr[data-tone="planning"] {
  color: var(--ui-tpr-muted);
}
.ui-tpr[data-tone="waiting"] {
  color: var(--ui-tpr-waiting);
}
.ui-tpr[data-tone="paused"] {
  color: var(--ui-tpr-paused);
}
.ui-tpr[data-tone="done"] {
  color: var(--ui-tpr-done);
}
.ui-tpr__track {
  stroke: currentColor;
  stroke-width: 1.3;
}
.ui-tpr[data-tone="planning"] .ui-tpr__track {
  stroke-dasharray: 1.6 2;
}
.ui-tpr__value {
  stroke: currentColor;
  stroke-width: 2.8;
  stroke-linecap: butt;
  transition: stroke-dasharray 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
@media (prefers-reduced-motion: reduce) {
  .ui-tpr * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tpr {
  --ui-tpr-muted: rgba(255, 255, 255, 0.3);
  --ui-tpr-running: #4fc3b4;
  --ui-tpr-waiting: #e6c24d;
  --ui-tpr-paused: #f2a15c;
  --ui-tpr-done: #7dcf9f;
}

.ui-tcr {
  --ui-tcr-card: #fff;
  --ui-tcr-ink: rgba(0, 0, 0, 0.88);
  --ui-tcr-text: rgba(0, 0, 0, 0.61);
  --ui-tcr-muted: rgba(0, 0, 0, 0.45);
  --ui-tcr-faint: rgba(0, 0, 0, 0.27);
  --ui-tcr-line: rgba(0, 0, 0, 0.06);
  --ui-tcr-fill: rgba(0, 0, 0, 0.04);
  --ui-tcr-focus: rgba(0, 96, 226, 0.35);
  --ui-tcr-shadow: 0 0 0 0.5px var(--ui-tcr-line), 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
  width: 100%;
  min-height: 48px;
  padding: 8px 6px 8px 12px;
  border-radius: 8px;
  background: var(--ui-tcr-card);
  box-shadow: var(--ui-tcr-shadow);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-tcr-ink);
  container: ui-tcr / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-tcr-drop 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-tcr,
.ui-tcr *,
.ui-tcr *::before,
.ui-tcr *::after {
  box-sizing: border-box;
}
.ui-tcr > .ui-tpr {
  margin: 9px 4px 0 0;
}
.ui-tcr textarea {
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
.ui-tcr textarea::placeholder {
  color: var(--ui-tcr-faint);
}
.ui-tcr:has(textarea:focus) {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-tcr button {
  font: inherit;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
  flex: none;
}
.ui-tcr button:focus-visible {
  outline: 2px solid var(--ui-tcr-focus);
  outline-offset: -2px;
}
.ui-tcr button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tcr__project,
.ui-tcr__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 8px;
  margin-top: 2px;
  border-radius: 6px;
}
.ui-tcr__project {
  max-width: 160px;
  color: var(--ui-tcr-text) !important;
}
.ui-tcr__project > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.ui-tcr__project:hover {
  background: var(--ui-tcr-fill);
}
.ui-tcr__submit {
  background: var(--ui-tcr-ink) !important;
  color: var(--ui-tcr-card) !important;
  font-weight: 500 !important;
}
.ui-tcr__submit:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tcr__menu {
  width: 208px;
  max-width: calc(100vw - 24px);
  overflow: auto;
  padding: 5px;
  border-radius: 10px;
  background: var(--ui-tcr-card);
  box-shadow:
    0 0 0 0.5px var(--ui-tcr-line),
    0 6px 20px rgba(0, 0, 0, 0.12);
  animation: ui-tcr-drop 180ms both;
}
.ui-tcr__menu-label {
  display: block;
  padding: 6px 9px;
  color: var(--ui-tcr-muted);
  font-size: 11px;
}
.ui-tcr__menu > button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding: 6px 9px;
  text-align: left;
  border-radius: 5px;
}
.ui-tcr__menu > button > span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tcr__menu > button:hover {
  background: var(--ui-tcr-fill);
}
.ui-tcr__menu > button > svg {
  color: var(--ui-tcr-muted);
}
.ui-tcr__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@keyframes ui-tcr-drop {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
@container ui-tcr (max-width:460px) {
  .ui-tcr__project {
    max-width: 110px;
  }
  .ui-tcr__project > svg:first-child {
    display: none;
  }
  .ui-tcr > .ui-tpr {
    margin-right: 0;
  }
  .ui-tcr {
    gap: 5px;
  }
  .ui-tcr__submit {
    padding-inline: 7px;
  }
}
@media (pointer: coarse) {
  .ui-tcr__project,
  .ui-tcr__submit {
    min-height: 36px;
  }
  .ui-tcr__menu > button {
    min-height: 36px;
  }
  .ui-tcr textarea {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tcr,
  .ui-tcr * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tcr {
  --ui-tcr-card: #1c1c1e;
  --ui-tcr-ink: rgba(255, 255, 255, 0.9);
  --ui-tcr-text: rgba(255, 255, 255, 0.62);
  --ui-tcr-muted: rgba(255, 255, 255, 0.46);
  --ui-tcr-faint: rgba(255, 255, 255, 0.3);
  --ui-tcr-line: rgba(255, 255, 255, 0.08);
  --ui-tcr-fill: rgba(255, 255, 255, 0.06);
  --ui-tcr-focus: rgba(77, 141, 255, 0.5);
}
.ui-tpr {
  --ui-tpr-muted: #b5b5b5;
}
.ui-tcr {
  --ui-tcr-ink: #171717;
  --ui-tcr-text: #404040;
  --ui-tcr-muted: #737373;
  --ui-tcr-faint: #b5b5b5;
  --ui-tcr-line: #e5e5e5;
  --ui-tcr-fill: #f5f5f5;
  --ui-tcr-focus: #2f6bff;
  border: 1px solid var(--ui-tcr-line);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 14px;
}
.ui-tcr__submit,
.ui-tcr__project {
  height: 32px;
}
.ui-tcr__submit {
  background: linear-gradient(#323137, #201e25) !important;
  color: #fff !important;
  box-shadow:
    0 0 0 1px #0d0d0d,
    inset 0 1px rgba(255, 255, 255, 0.12);
}
:where(.dark, [data-theme="dark"]) .ui-tcr {
  --ui-tcr-card: #232326;
  --ui-tcr-ink: #ededed;
  --ui-tcr-text: #c4c4c4;
  --ui-tcr-muted: #8f8f8f;
  --ui-tcr-faint: #6b6b70;
  --ui-tcr-line: rgba(255, 255, 255, 0.1);
  --ui-tcr-fill: #2a2a2d;
  --ui-tcr-focus: #6b95ff;
}

`;
