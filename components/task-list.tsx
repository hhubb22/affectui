"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/*
 * task-list (Classic) – a self-contained React 19 component.
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
      <style href="ui-task-list" precedence="default">
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
      className={["ui-tls", className].filter(Boolean).join(" ")}
      data-keyboard={keyboard || undefined}
    >
      <style href="ui-task-list" precedence="default">
        {css}
      </style>
      <header className="ui-tls__head">
        <h1>
          {labels.tasks ?? "Tasks"}
          <span>{visible.length}</span>
        </h1>
        <div role="tablist" aria-label="Task status" className="ui-tls__tabs">
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
          className="ui-tls__new"
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
      <div id={`${id}-create`} className="ui-tls__create" hidden={!createOpen}>
        {createForm}
      </div>
      <div className="ui-tls__scroll">
        <div
          role="tree"
          aria-label={tab === "active" ? (labels.active ?? "Active tasks") : (labels.done ?? "Done tasks")}
          aria-labelledby={`${id}-${tab}`}
          id={`${id}-tree`}
          className="ui-tls__tree"
          onKeyDown={treeKey}
          onPointerDown={() => setKeyboard(false)}
        >
          {groups.map((group, groupIndex) => {
            const expanded = !collapsed.includes(group.project),
              groupKey = `group:${group.project}`;
            return (
              <div className="ui-tls__group" role="none" key={group.project}>
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
                  className="ui-tls__group-head"
                  onFocus={() => setFocusKey(groupKey)}
                  onClick={() => toggle(group.project)}
                >
                  <span className="ui-tls__chevron">
                    <Icon name="chevron" size={12} />
                  </span>
                  <Icon name="folder" size={14} />
                  <strong title={group.project} dir="auto">
                    {group.project}
                  </strong>
                  <span>{group.rows.length}</span>
                </button>
                <div
                  className="ui-tls__collapse"
                  data-open={expanded || undefined}
                  inert={!expanded}
                  aria-hidden={!expanded}
                >
                  <div className="ui-tls__clip" role="group" id={`${id}-group-${groupIndex}`}>
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
                          className="ui-tls__row"
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
                          <span className="ui-tls__main">
                            <span className="ui-tls__title" title={task.title} dir="auto">
                              {task.title}
                            </span>
                            <span className="ui-tls__status" title={status} dir="auto">
                              {status}
                            </span>
                          </span>
                          {needs > 0 && (
                            <span
                              data-task-needs=""
                              className="ui-tls__needs"
                              aria-hidden="true"
                              title={task.asks?.[0]?.question ?? `${needs} questions waiting`}
                            >
                              {labels.needsYou ?? "Needs you"}
                              {needs > 1 ? ` ${needs}` : ""}
                            </span>
                          )}
                          <span aria-hidden="true" className="ui-tls__steps">
                            {total ? `${done}/${total}` : ""}
                          </span>
                          <span aria-hidden="true" className="ui-tls__files">
                            {!!task.artifacts?.length && (
                              <>
                                <Icon name="document" size={12} />
                                {task.artifacts.length}
                              </>
                            )}
                          </span>
                          <span aria-hidden="true" className="ui-tls__time" title={`Updated ${age.long}`}>
                            {age.short}
                          </span>
                        </button>
                      );
                    })}
                    {group.rows.length === 0 && (
                      <p className="ui-tls__empty-group">{labels.emptyProject ?? "No tasks"}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {visible.length === 0 && groups.length === 0 && (
            <div className="ui-tls__empty">
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

.ui-tls {
  --ui-tls-card: #fff;
  --ui-tls-ink: rgba(0, 0, 0, 0.88);
  --ui-tls-text: rgba(0, 0, 0, 0.61);
  --ui-tls-muted: rgba(0, 0, 0, 0.45);
  --ui-tls-faint: rgba(0, 0, 0, 0.27);
  --ui-tls-line: rgba(0, 0, 0, 0.06);
  --ui-tls-fill: rgba(0, 0, 0, 0.04);
  --ui-tls-hover: rgba(0, 0, 0, 0.02);
  --ui-tls-focus: #0060e2;
  --ui-tls-row-height: 40px;
  --ui-tls-ease: cubic-bezier(0.22, 1, 0.36, 1);
  height: 100%;
  min-height: 0;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--ui-tls-card);
  color: var(--ui-tls-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-tls / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-tls,
.ui-tls *,
.ui-tls *::before,
.ui-tls *::after {
  box-sizing: border-box;
}
.ui-tls button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-tls button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-tls button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-tls button:focus-visible {
  outline: 2px solid var(--ui-tls-focus);
  outline-offset: -2px;
}
.ui-tls__head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
  height: 48px;
  padding: 0 12px 0 20px;
  box-shadow: inset 0 -0.5px var(--ui-tls-line);
}
.ui-tls__head h1 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.ui-tls__head h1 > span {
  font-weight: 400;
  color: var(--ui-tls-faint);
  font-variant-numeric: tabular-nums;
}
.ui-tls__tabs {
  display: flex;
  gap: 2px;
}
.ui-tls__tabs button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  color: var(--ui-tls-muted);
}
.ui-tls__tabs button[aria-selected="true"] {
  background: var(--ui-tls-fill);
  color: var(--ui-tls-ink);
}
.ui-tls__new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-left: auto;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  box-shadow:
    0 0 0 0.5px var(--ui-tls-line),
    0 1px 2px rgba(0, 0, 0, 0.04);
  font-weight: 500 !important;
  white-space: nowrap;
}
.ui-tls__new > svg,
.ui-tls__new > kbd {
  color: var(--ui-tls-faint);
}
.ui-tls__new > kbd {
  font: 12px/1 inherit;
  font-family: inherit;
  font-weight: 400;
}
.ui-tls__create {
  margin: 8px 8px 0;
  flex: none;
}
.ui-tls__create[hidden] {
  display: none;
}
.ui-tls__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-tls-line) transparent;
}
.ui-tls__tree {
  padding: 8px 8px 24px;
}
.ui-tls__group + .ui-tls__group {
  margin-top: 12px;
}
.ui-tls__group-head {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 32px;
  padding: 0 12px 0 8px;
  border-radius: 8px;
  text-align: left;
}
.ui-tls__group-head:hover {
  background: var(--ui-tls-hover);
}
.ui-tls__group-head > strong {
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tls__group-head > span:last-child {
  color: var(--ui-tls-faint);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-tls__chevron {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  color: var(--ui-tls-faint);
  transition: rotate 200ms var(--ui-tls-ease);
}
.ui-tls__group-head[aria-expanded="false"] .ui-tls__chevron {
  rotate: -90deg;
}
.ui-tls__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 240ms var(--ui-tls-ease);
}
.ui-tls__collapse[data-open] {
  grid-template-rows: 1fr;
}
.ui-tls__clip {
  min-height: 0;
  overflow: hidden;
}
.ui-tls__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: var(--ui-tls-row-height);
  padding: 0 12px;
  border-radius: 8px;
  text-align: left;
  transition: background-color 140ms;
}
.ui-tls__row > .ui-tpr {
  margin: 0 1px;
}
.ui-tls__row:hover {
  background: var(--ui-tls-hover);
}
.ui-tls__row[aria-selected="true"] {
  background: var(--ui-tls-fill);
}
.ui-tls__main {
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.ui-tls__title {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tls__status {
  flex: 0 100 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-tls-muted);
}
.ui-tls__row[data-done] .ui-tls__title {
  color: var(--ui-tls-text);
}
.ui-tls__needs {
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
.ui-tls__needs:hover {
  filter: saturate(1.4);
}
.ui-tls__steps,
.ui-tls__files,
.ui-tls__time {
  flex: none;
  text-align: right;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-tls-faint);
}
.ui-tls__steps,
.ui-tls__time {
  width: 28px;
}
.ui-tls__files {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 34px;
}
.ui-tls__time {
  color: var(--ui-tls-muted);
}
.ui-tls__row[data-fresh] {
  overflow: hidden;
  animation: ui-tls-glide 420ms var(--ui-tls-ease) both;
}
.ui-tls__empty-group {
  display: flex;
  align-items: center;
  height: var(--ui-tls-row-height);
  padding: 0 12px 0 38px;
  margin: 0;
  color: var(--ui-tls-faint);
}
.ui-tls__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 24px;
  color: var(--ui-tls-muted);
  text-align: center;
}
.ui-tls__empty h2 {
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0 6px;
  color: var(--ui-tls-ink);
}
.ui-tls__empty p {
  margin: 0;
  font-size: 13px;
}
.ui-tls:not([data-keyboard]) :is(.ui-tls__row, .ui-tls__group-head):focus {
  outline: none;
}
@keyframes ui-tls-glide {
  from {
    height: 0;
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    height: var(--ui-tls-row-height);
    opacity: 1;
    transform: none;
  }
}
@container ui-as (max-width:899.99px) {
  .ui-tls__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@container ui-tls (max-width:560px) {
  .ui-tls__row {
    height: 52px;
    gap: 10px;
    padding-inline: 10px;
  }
  .ui-tls__row > .ui-tpr {
    align-self: flex-start;
    margin-top: 10px;
  }
  .ui-tls__main {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .ui-tls__status {
    font-size: 12px;
    line-height: 16px;
    flex: none;
  }
  .ui-tls__steps,
  .ui-tls__files {
    display: none;
  }
  .ui-tls__new kbd {
    display: none;
  }
  .ui-tls__head {
    gap: 8px;
  }
}
@container ui-tls (max-width:400px) {
  .ui-tls__new {
    width: 28px;
    padding: 0;
  }
  .ui-tls__new > span {
    display: none;
  }
}
@media (pointer: coarse) {
  .ui-tls__tabs button,
  .ui-tls__new {
    min-height: 36px;
  }
  .ui-tls__row {
    min-height: 52px;
  }
  .ui-tls__group-head {
    min-height: 36px;
  }
  .ui-tls__new kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-tls,
  .ui-tls * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-tls {
  --ui-tls-card: #1c1c1e;
  --ui-tls-ink: rgba(255, 255, 255, 0.9);
  --ui-tls-text: rgba(255, 255, 255, 0.62);
  --ui-tls-muted: rgba(255, 255, 255, 0.46);
  --ui-tls-faint: rgba(255, 255, 255, 0.3);
  --ui-tls-line: rgba(255, 255, 255, 0.08);
  --ui-tls-fill: rgba(255, 255, 255, 0.06);
  --ui-tls-hover: rgba(255, 255, 255, 0.03);
  --ui-tls-focus: #4d8dff;
}
:where(.dark, [data-theme="dark"]) .ui-tls__needs {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}
.ui-tpr {
  --ui-tpr-muted: #b5b5b5;
}
.ui-tls {
  --ui-tls-ink: #171717;
  --ui-tls-text: #404040;
  --ui-tls-muted: #737373;
  --ui-tls-faint: #b5b5b5;
  --ui-tls-line: #e5e5e5;
  --ui-tls-fill: #f5f5f5;
  --ui-tls-hover: #fafafa;
  --ui-tls-focus: #2f6bff;
  --ui-tls-row-height: 48px;
  font-size: 14px;
}
.ui-tls__head {
  height: 52px;
  border-bottom: 1px solid var(--ui-tls-line);
}
.ui-tls__tabs button,
.ui-tls__new {
  height: 32px;
}
.ui-tls .ui-tls__new {
  border: 1px solid var(--ui-tls-line);
  border-radius: 8px;
}
:where(.dark, [data-theme="dark"]) .ui-tls {
  --ui-tls-card: #232326;
  --ui-tls-ink: #ededed;
  --ui-tls-text: #c4c4c4;
  --ui-tls-muted: #8f8f8f;
  --ui-tls-faint: #6b6b70;
  --ui-tls-line: rgba(255, 255, 255, 0.1);
  --ui-tls-fill: #2a2a2d;
  --ui-tls-hover: #2a2a2d;
  --ui-tls-focus: #6b95ff;
}

`;
