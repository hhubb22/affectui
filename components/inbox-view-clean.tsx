"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

/*
 * inbox-view (Clean) – a self-contained React 19 component.
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
  listTitle?: string;
  context?: string;
  task: string;
  at: number;
  unread?: boolean;
  options?: InboxOption[];
  facts?: { label: string; value: string }[];
  suggestions?: string[];
  done?: { answer: InboxAnswer; at: number; label?: string; history?: string[]; artifacts?: string[] };
};

function InboxGlyph({ kind, size = 14 }: { kind: InboxItem["kind"] | "done"; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
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
  showTabs?: boolean;
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
  showTabs = true,
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
    if (next !== null && list[next]) {
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
      className={["ui-iblc", className].filter(Boolean).join(" ")}
      aria-busy={disabled}
    >
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      <header className="ui-iblc__head">
        <h1>
          {labels.inbox ?? "Inbox"}
          <span>{items.filter((item) => !item.done).length || null}</span>
        </h1>
        {showTabs && (
          <div className="ui-iblc__tabs" role="tablist" aria-label="Inbox status">
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
        )}
      </header>
      <div
        className="ui-iblc__rows"
        role="listbox"
        aria-label={tab === "open" ? "Open inbox items" : "Answered inbox items"}
        id={`${id}-items`}
        aria-labelledby={showTabs ? `${id}-${tab}` : undefined}
      >
        {list.map((item) => {
          const age = inboxAge(item.done?.at ?? item.at, now),
            kind = item.done ? "done" : inboxKind(item.kind),
            kindLabel =
              inboxKind(item.kind) === "pick"
                ? "Variant"
                : `${inboxKind(item.kind)[0]?.toUpperCase() ?? ""}${inboxKind(item.kind).slice(1)}`,
            rowTitle = item.listTitle ?? item.question;
          return (
            <div
              className="ui-iblc__wrap"
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
                aria-label={`${item.done ? "Answered" : kindLabel}: ${rowTitle}. ${item.task}, ${age.long}${item.unread && !item.done ? ", unread" : ""}`}
                title={rowTitle}
                tabIndex={focusId === item.id ? 0 : -1}
                disabled={disabled}
                className="ui-iblc__row"
                data-sending={sendingId === item.id || undefined}
                onClick={() => choose(item)}
                onKeyDown={(event) => rowKey(event, list.indexOf(item))}
              >
                <span className="ui-iblc__glyph" data-kind={kind}>
                  <InboxGlyph kind={kind} />
                </span>
                <span className="ui-iblc__text">
                  <span className="ui-iblc__question" dir="auto">
                    {rowTitle}
                  </span>
                  <span className="ui-iblc__meta">
                    <span title={item.task} dir="auto">
                      {item.task}
                    </span>
                    <i>·</i>
                    <span>{age.short}</span>
                  </span>
                </span>
                <span className="ui-iblc__dot" data-on={(item.unread && !item.done) || undefined} aria-hidden="true" />
              </button>
            </div>
          );
        })}
        {!list.length && (
          <p className="ui-iblc__empty">
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
      const opt = options[index];
      if (opt) onConfirm?.(opt.id);
    }
  };
  const focused = options.some((option) => option.id === value) ? value : options[0]?.id;
  return (
    <div
      ref={root}
      className={["ui-iboc", className].filter(Boolean).join(" ")}
      data-variant={variant}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={{ "--ui-iboc-count": Math.max(1, Math.min(4, options.length)) } as CSSProperties}
    >
      <style href="ui-inbox-view-clean" precedence="default">
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
            className="ui-iboc__option"
            key={option.id}
            onClick={() => choose(index)}
            onKeyDown={(event) => key(event, index)}
          >
            {variant === "variants" && (
              <span
                className="ui-iboc__preview"
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
            <span className="ui-iboc__number">{index + 1}</span>
            <span className="ui-iboc__body">
              <span className="ui-iboc__head">
                <strong title={option.title} dir="auto">
                  {option.title}
                </strong>
                {option.recommended && <span className="ui-iboc__recommended">{recommendedLabel}</span>}
              </span>
              {variant === "options" && (
                <>
                  <span className="ui-iboc__summary" id={`${id}-summary-${index}`} title={option.summary} dir="auto">
                    {option.summary}
                  </span>
                  <span
                    className="ui-iboc__more"
                    data-open={selected || undefined}
                    aria-hidden={!selected}
                    id={`${id}-more-${index}`}
                  >
                    <span className="ui-iboc__clip">
                      {option.pros?.map((line, lineIndex) => (
                        <span className="ui-iboc__line" key={`pro-${lineIndex}`}>
                          <b aria-hidden="true">+</b>
                          <span className="ui-iboc__sr">Pro: </span>
                          <span dir="auto">{line}</span>
                        </span>
                      ))}
                      {option.cons?.map((line, lineIndex) => (
                        <span className="ui-iboc__line" key={`con-${lineIndex}`}>
                          <b aria-hidden="true">–</b>
                          <span className="ui-iboc__sr">Con: </span>
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
    <svg className={["ui-iboc__wire", className].filter(Boolean).join(" ")} viewBox="0 0 120 80" aria-hidden="true">
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      {preview === "checklist" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="12" y="12" width="44" height="5" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="22" width="96" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="12" y="22" width="32" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="12" y="34" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="26" y="36" width="54" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="48" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="26" y="50" width="46" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="62" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="26" y="64" width="38" height="4" rx="2"></rect>
        </>
      ) : preview === "data" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="14" y="46" width="10" height="22" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="30" y="36" width="10" height="32" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="46" y="50" width="10" height="18" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="62" y="28" width="10" height="40" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="78" y="40" width="10" height="28" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="94" y="22" width="10" height="46" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="34" y="12" width="52" height="12" rx="6"></rect>
        </>
      ) : preview === "bars" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="14" y="40" width="12" height="28" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="28" width="12" height="40" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="54" y="46" width="12" height="22" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="74" y="20" width="12" height="48" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="94" y="34" width="12" height="34" rx="2"></rect>
        </>
      ) : preview === "line" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="12" y="54" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="44" width="26" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="58" y="48" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="80" y="26" width="28" height="3" rx="2"></rect>
        </>
      ) : (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="48" y="16" width="24" height="20" rx="5"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="44" width="52" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="42" y="52" width="36" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="50" y="61" width="20" height="7" rx="3"></rect>
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
    <div className={["ui-ibfc", "ui-ibfc__sent", className].filter(Boolean).join(" ")}>
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      <svg className="ui-ibfc__mark" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="ui-ibfc__ring" cx="12" cy="12" r="12" />
        <path className="ui-ibfc__tick" pathLength="1" d="m6.5 12 3.5 3.5 7.5-7.5" />
      </svg>
      <span className="ui-ibfc__text">
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
    <div className={["ui-ibfc", "ui-ibfc__empty", className].filter(Boolean).join(" ")}>
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      <svg className="ui-ibfc__empty-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="m10 18 5 5 11-11"
          stroke="currentColor"
          strokeWidth="1.25"
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
  submitting?: string;
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
  phase?: "answer" | "submitting" | "sent";
  sentAnswer?: InboxAnswer;
  managed?: boolean;
  allowFreeText?: boolean;
  error?: ReactNode;
  extraActions?: ReactNode;
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
  managed = false,
  allowFreeText,
  error,
  extraActions,
  focusRequest,
  shortcuts = true,
  labels = {},
  now = Date.now(),
  className,
}: InboxItemViewProps) {
  const options = (Array.isArray(item.options) ? item.options : []).filter(Boolean),
    kind = inboxKind(item.kind),
    freeText = allowFreeText ?? (!managed || kind === "question"),
    showLater = !managed || !!onLater;
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
    sent = phase === "sent",
    submitting = phase === "submitting",
    busy = sent || submitting;
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
      words = freeText ? (draft.text?.trim() ?? "") : "",
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
  const keyboard = useRef({ item, kind, options, busy, showLater, freeText, submit, onLater, change, blurField });
  keyboard.current = { item, kind, options, busy, showLater, freeText, submit, onLater, change, blurField };
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
      } else if (value === "l" && state.showLater) {
        event.preventDefault();
        state.onLater?.();
      } else if ((value === "r" || value === "/") && state.freeText) {
        event.preventDefault();
        field.current?.focus();
      } else if (
        event.key === "Enter" &&
        (!(event.target as HTMLElement).closest("button,a") ||
          (event.target as HTMLElement).closest("[data-inbox-row]"))
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
  const canSubmit = !submitting && (kind === "approval" || !!choice || (freeText && !!text.trim()));
  return (
    <section
      ref={root}
      data-inbox-view=""
      className={["ui-ibvc", className].filter(Boolean).join(" ")}
      data-phase={sent ? "sent" : submitting ? "submitting" : item.done ? "done" : "answer"}
      aria-busy={submitting || undefined}
    >
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      <p className="ui-ibvc__meta">
        <span data-kind={item.done ? "done" : kind}>
          <InboxGlyph kind={item.done ? "done" : kind} />
        </span>
        {kind === "approval" && !item.done && <span className="ui-ibvc__badge">{labels.approval ?? "Approval"}</span>}
        <span title={item.task} dir="auto">
          {item.task}
        </span>
        <i>·</i>
        <span>{item.done ? (labels.done ?? "Done") : inboxAge(item.at, now).long}</span>
      </p>
      <h2 ref={heading} className="ui-ibvc__question" tabIndex={-1} dir="auto">
        {item.question}
      </h2>
      {!sent && item.context && (
        <p className="ui-ibvc__context" dir="auto">
          {item.context}
        </p>
      )}
      {sent ? (
        <div className="ui-ibvc__answer">
          <InboxConfirmation
            answer={inboxAnswerLabel(item, sentAnswer ?? (kind === "approval" ? "approve" : {}))}
            message={labels.sent}
          />
        </div>
      ) : item.done ? (
        <div className="ui-ibvc__done">
          <div className="ui-ibvc__chosen">
            <div className="ui-ibvc__chosen-row">
              <Icon name={answer === "decline" ? "close" : "check"} size={14} />
              <strong dir="auto" title={item.done.label ?? inboxAnswerLabel(item, item.done.answer)}>
                {item.done.label ?? inboxAnswerLabel(item, item.done.answer)}
              </strong>
              <span>{inboxAge(item.done.at, now).long}</span>
            </div>
            {(savedOption ||
              (typeof answer === "object" && answer.text) ||
              (kind === "approval" && item.facts?.length)) && (
              <div className="ui-ibvc__chosen-body">
                {savedOption && kind === "pick" && (
                  <span
                    className="ui-ibvc__chosen-thumb"
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
                <div className="ui-ibvc__chosen-lines">
                  {savedOption?.summary && <span className="ui-ibvc__chosen-summary">{savedOption.summary}</span>}
                  {savedOption?.pros?.map((line, index) => (
                    <span className="ui-ibvc__pro" key={index}>
                      <b>+</b>
                      <span dir="auto">{line}</span>
                    </span>
                  ))}
                  {kind === "approval" &&
                    item.facts?.map((fact) => (
                      <span className="ui-ibvc__chosen-fact" key={fact.label}>
                        <span>{fact.label}</span>
                        <span dir="auto" title={fact.value}>
                          {fact.value}
                        </span>
                      </span>
                    ))}
                  {typeof answer === "object" && answer.text && (
                    <span className="ui-ibvc__words" dir="auto">
                      “{answer.text}”
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          {!!item.done.history?.length && (
            <section className="ui-ibvc__since">
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
            <div className="ui-ibvc__files">
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
          <div className="ui-ibvc__done-actions">
            {onReopen && (
              <button type="button" className="ui-ibvc__button" onClick={onReopen}>
                <Icon name="undo" size={13} />
                {labels.reopen ?? "Reopen"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="ui-ibvc__answer">
            {kind === "decision" || kind === "pick" ? (
              <InboxOptions
                options={options}
                variant={kind === "pick" ? "variants" : "options"}
                value={choice ?? ""}
                onValueChange={(option) => change({ ...draftRef.current, option })}
                onConfirm={submit}
                label={item.question}
                recommendedLabel={labels.recommended}
                disabled={submitting}
              />
            ) : kind === "approval" ? (
              item.facts?.length ? (
                <dl className="ui-ibvc__facts">
                  {item.facts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd dir="auto" title={fact.value}>
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null
            ) : (
              <div className="ui-ibvc__free">
                <textarea
                  ref={field as RefObject<HTMLTextAreaElement | null>}
                  className="ui-ibvc__reply ui-ibvc__area"
                  aria-label="Your answer"
                  placeholder={labels.answer ?? "Write your answer…"}
                  value={text}
                  disabled={submitting}
                  onChange={(event) => change({ ...draftRef.current, text: event.target.value })}
                  onKeyDown={fieldKey}
                />
                {!!item.suggestions?.length && (
                  <div className="ui-ibvc__chips">
                    {item.suggestions.map((suggestion) => (
                      <button
                        type="button"
                        aria-pressed={text === suggestion}
                        disabled={submitting}
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
          {error != null && (
            <div className="ui-ibvc__error" role="alert">
              {error}
            </div>
          )}
          <div className="ui-ibvc__footer">
            {kind !== "question" && freeText && (
              <input
                ref={field as RefObject<HTMLInputElement | null>}
                className="ui-ibvc__reply"
                aria-label="Tell it something else"
                placeholder={labels.reply ?? "Or tell it something else…"}
                value={text}
                disabled={submitting}
                onChange={(event) => change({ ...draftRef.current, text: event.target.value })}
                onKeyDown={fieldKey}
              />
            )}
            <div className="ui-ibvc__actions">
              {extraActions}
              {showLater && (
                <button
                  type="button"
                  className="ui-ibvc__button ui-ibvc__later"
                  disabled={submitting}
                  aria-keyshortcuts="L"
                  onClick={onLater}
                >
                  {labels.later ?? "Later"}
                  <kbd aria-hidden={managed || undefined}>L</kbd>
                </button>
              )}
              {kind === "approval" && (
                <button
                  type="button"
                  className="ui-ibvc__button"
                  disabled={submitting}
                  onClick={() => onSubmit?.("decline")}
                >
                  {labels.decline ?? "Decline"}
                </button>
              )}
              <button
                type="button"
                className="ui-ibvc__button ui-ibvc__send"
                disabled={!canSubmit}
                aria-keyshortcuts="Enter"
                onClick={() => submit()}
              >
                {submitting && labels.submitting
                  ? labels.submitting
                  : kind === "approval" && (!freeText || !text.trim())
                    ? (labels.approve ?? "Approve")
                    : (labels.send ?? "Send")}
                <kbd aria-hidden={managed || undefined}>↵</kbd>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export type InboxViewLabels = InboxListLabels &
  InboxItemLabels & {
    caughtUp?: string;
    tasks?: string;
    running?: (count: number) => string;
    noAnswers?: string;
    noAnswersDescription?: string;
    back?: string;
    notice?: string;
  };
export type InboxViewProps = {
  items: InboxItem[];
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
  onOpenTasks?: () => void;
  onOpenArtifact?: (id: string, name: string) => void;
  managed?: boolean;
  submittingId?: string;
  confirmedId?: string;
  confirmedAnswer?: InboxAnswer;
  collapsingId?: string;
  allowFreeText?: boolean;
  showTabs?: boolean;
  shortcuts?: boolean;
  error?: ReactNode;
  renderExtraActions?: (item: InboxItem) => ReactNode;
  itemLabels?: (item: InboxItem) => InboxItemLabels | undefined;
  running?: number;
  labels?: InboxViewLabels;
  now?: number;
  className?: string;
};

/** Split-pane Inbox list and reading pane without AppShell, supporting caller-managed confirmation. */
export function InboxView({
  items: rawItems,
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
  onOpenTasks,
  onOpenArtifact,
  managed = false,
  submittingId,
  confirmedId,
  confirmedAnswer,
  collapsingId,
  allowFreeText,
  showTabs = true,
  shortcuts = true,
  error,
  renderExtraActions,
  itemLabels,
  running = 0,
  labels = {},
  now: nowProp,
  className,
}: InboxViewProps) {
  const items = (Array.isArray(rawItems) ? rawItems : []).filter(Boolean);
  const [tabValue, setTab] = useControllable<InboxTab>(tabProp, defaultTab, onTabChange);
  const tab = tabValue === "done" ? "done" : "open";
  const list = items.filter((item) => Boolean(item.done) === (tab === "done"));
  const [selected, setSelected] = useControllable<string | null>(
    selectedProp,
    defaultSelected === null ? null : (defaultSelected ?? list[0]?.id ?? null),
    onSelectedChange,
  );
  const [drafts, setDrafts] = useControllable(draftsProp, defaultDrafts, onDraftsChange);
  const [detail, setDetail] = useState(Boolean(defaultSelected || selectedProp));
  const [focusRequest, setFocusRequest] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const now = safeNumber(nowProp, clock);

  const canvas = useRef<HTMLDivElement>(null);
  const narrow = useRef(false);
  const selectedRef = useRef(selected);
  const draftsRef = useRef(drafts);
  selectedRef.current = selected;
  draftsRef.current = drafts;

  const busy = Boolean(submittingId || confirmedId);
  const activeId = list.some((item) => item.id === selected)
    ? selected
    : selectedProp === null
      ? null
      : (list[0]?.id ?? null);
  const shown = list.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (nowProp !== undefined) return;
    const timer = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [nowProp]);

  useEffect(() => {
    if (busy) return;
    if (selectedProp === undefined && selected !== activeId) {
      selectedRef.current = activeId;
      setSelected(activeId);
    }
  }, [activeId, busy, selected, selectedProp]);

  useLayoutEffect(() => {
    const body = canvas.current;
    if (!body) return;
    const measure = () => {
      narrow.current = body.getBoundingClientRect().width < 640;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  const select = (id: string | null, focus = false) => {
    if (selectedRef.current !== id) {
      selectedRef.current = id;
      setSelected(id);
      onSelect?.(id);
    }
    if (id) setDetail(true);
    setFocusRequest((value) => (focus ? value + 1 : 0));
  };

  const back = () => {
    setDetail(false);
    requestAnimationFrame(() =>
      [...(canvas.current?.querySelectorAll<HTMLButtonElement>("[data-inbox-row]") ?? [])]
        .find((row) => row.dataset.inboxRow === selectedRef.current)
        ?.focus({ preventScroll: true }),
    );
  };
  const backRef = useRef(back);
  backRef.current = back;

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
          : !canvas.current?.contains(event.target as Node)) ||
        canvas.current?.closest("[inert]")
      )
        return;
      event.preventDefault();
      backRef.current();
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

  const itemPhase =
    shown && confirmedId === shown.id ? "sent" : shown && submittingId === shown.id ? "submitting" : "answer";
  const mergedItemLabels = shown ? { ...labels, ...itemLabels?.(shown) } : labels;

  return (
    <div
      ref={canvas}
      className={["ui-ibpc", className].filter(Boolean).join(" ")}
      data-inbox-scope=""
      data-detail={detail || undefined}
      aria-busy={busy || undefined}
    >
      <style href="ui-inbox-view-clean" precedence="default">
        {css}
      </style>
      <div className="ui-ibpc__list">
        <InboxList
          items={items}
          tab={tab}
          onTabChange={(next) => {
            if (busy) return;
            setTab(next);
            select(items.find((item) => Boolean(item.done) === (next === "done"))?.id ?? null);
            setDetail(false);
          }}
          selected={activeId}
          onSelect={(id) => {
            if (!busy) select(id);
          }}
          sendingId={submittingId ?? confirmedId}
          collapsingId={collapsingId}
          showTabs={showTabs}
          disabled={busy}
          labels={labels}
          now={now}
        />
      </div>
      <div className="ui-ibpc__reading">
        <header className="ui-ibpc__mobile-head">
          <button type="button" onClick={back}>
            <Icon name="chevron" size={14} />
            {labels.back ?? labels.inbox ?? "Inbox"}
          </button>
        </header>
        <div className="ui-ibpc__scroll">
          {shown ? (
            <InboxItemView
              key={`${shown.id}:${shown.done ? "done" : "open"}`}
              item={shown}
              draft={drafts[shown.id] ?? { option: shown.options?.find((option) => option.recommended)?.id, text: "" }}
              onDraftChange={changeDraft}
              onSubmit={(answer) => onDecide?.(shown.id, answer)}
              onLater={!managed || onLater ? () => onLater?.(shown.id) : undefined}
              onReopen={onReopen ? () => onReopen(shown.id) : undefined}
              onOpenArtifact={onOpenArtifact ? (name) => onOpenArtifact(shown.id, name) : undefined}
              phase={itemPhase}
              sentAnswer={confirmedAnswer}
              managed={managed}
              allowFreeText={allowFreeText}
              error={error}
              extraActions={renderExtraActions?.(shown)}
              focusRequest={focusRequest}
              shortcuts={shortcuts}
              labels={mergedItemLabels}
              now={now}
            />
          ) : (
            <div className="ui-ibpc__empty">
              <InboxEmptyState
                variant={tab}
                running={running}
                title={tab === "open" ? labels.caughtUp : labels.noAnswers}
                description={
                  tab === "open"
                    ? labels.running
                      ? labels.running(running)
                      : running > 0
                        ? `${running} ${running === 1 ? "task keeps" : "tasks keep"} running in the background`
                        : "Nothing needs your attention right now."
                    : labels.noAnswersDescription
                }
                tasksLabel={labels.tasks}
                onOpenTasks={onOpenTasks}
                focusRequest={focusRequest}
              />
            </div>
          )}
        </div>
      </div>
      {labels.notice != null && (
        <span className="ui-ibpc__sr" role="status" aria-live="polite">
          {labels.notice}
        </span>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-iblc {
  --ui-iblc-card: #fff;
  --ui-iblc-ink: rgba(0, 0, 0, 0.88);
  --ui-iblc-muted: rgba(0, 0, 0, 0.45);
  --ui-iblc-faint: rgba(0, 0, 0, 0.27);
  --ui-iblc-line: rgba(0, 0, 0, 0.06);
  --ui-iblc-fill: rgba(0, 0, 0, 0.04);
  --ui-iblc-hover: rgba(0, 0, 0, 0.02);
  --ui-iblc-focus: rgba(0, 96, 226, 0.7);
  --ui-iblc-purple: #a651f0;
  --ui-iblc-blue: #0190fe;
  --ui-iblc-green: #5fc88a;
  --ui-iblc-orange: #f28a2e;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset -0.5px 0 var(--ui-iblc-line);
  color: var(--ui-iblc-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-iblc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-iblc,
.ui-iblc *,
.ui-iblc *::before,
.ui-iblc *::after {
  box-sizing: border-box;
}
.ui-iblc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-iblc button:focus-visible {
  outline: 2px solid var(--ui-iblc-focus);
  outline-offset: -2px;
}
.ui-iblc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-iblc button:disabled {
  cursor: default;
}
.ui-iblc__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
  height: 48px;
  padding: 0 12px 0 20px;
  box-shadow: inset 0 -0.5px var(--ui-iblc-line);
}
.ui-iblc h1 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  min-width: 0;
}
.ui-iblc h1 > span {
  font-size: 13px;
  font-weight: 400;
  color: var(--ui-iblc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-iblc__tabs {
  display: flex;
  gap: 2px;
  flex: none;
}
.ui-iblc__tabs button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  color: var(--ui-iblc-muted);
}
.ui-iblc__tabs button[aria-selected="true"] {
  background: var(--ui-iblc-fill);
  color: var(--ui-iblc-ink);
}
.ui-iblc__rows {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 6px 8px 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-iblc-line) transparent;
  overscroll-behavior: contain;
}
.ui-iblc__wrap {
  overflow: hidden;
  display: grid;
  grid-template-rows: 1fr;
  transition:
    grid-template-rows 280ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms;
}
.ui-iblc__wrap[data-gone] {
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
}
.ui-iblc__row {
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
.ui-iblc__row:hover {
  background: var(--ui-iblc-hover);
}
.ui-iblc__row[aria-selected="true"] {
  background: var(--ui-iblc-fill);
}
.ui-iblc__row[data-sending] {
  opacity: 0.55;
}
.ui-iblc__glyph {
  display: grid;
  place-items: center;
  height: 20px;
  color: var(--ui-iblc-faint);
}
.ui-iblc__glyph[data-kind="decision"] {
  color: var(--ui-iblc-purple);
}
.ui-iblc__glyph[data-kind="pick"] {
  color: var(--ui-iblc-blue);
}
.ui-iblc__glyph:is([data-kind="approval"], [data-kind="done"]) {
  color: var(--ui-iblc-green);
}
.ui-iblc__glyph[data-kind="question"] {
  color: var(--ui-iblc-orange);
}
.ui-iblc__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-iblc__question {
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-iblc__meta {
  display: flex;
  gap: 6px;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-iblc-muted);
  white-space: nowrap;
  min-width: 0;
}
.ui-iblc__meta > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-iblc__meta > span:last-child {
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-iblc__meta i {
  font-style: normal;
  color: var(--ui-iblc-faint);
}
.ui-iblc__dot {
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
.ui-iblc__dot[data-on] {
  opacity: 1;
  transform: none;
}
.ui-iblc__empty {
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-iblc-muted);
}
@container ui-asc (max-width:899.99px) {
  .ui-iblc__head {
    padding-left: 46px;
    padding-right: 52px;
  }
}
@media (pointer: coarse) {
  .ui-iblc__tabs button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-iblc,
  .ui-iblc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-iblc {
  --ui-iblc-card: #1c1c1e;
  --ui-iblc-ink: rgba(255, 255, 255, 0.9);
  --ui-iblc-muted: rgba(255, 255, 255, 0.46);
  --ui-iblc-faint: rgba(255, 255, 255, 0.3);
  --ui-iblc-line: rgba(255, 255, 255, 0.08);
  --ui-iblc-fill: rgba(255, 255, 255, 0.06);
  --ui-iblc-hover: rgba(255, 255, 255, 0.03);
  --ui-iblc-focus: rgba(77, 141, 255, 0.8);
  --ui-iblc-purple: #b98af0;
  --ui-iblc-blue: #4fb0fe;
  --ui-iblc-green: #7dcf9f;
  --ui-iblc-orange: #f2a15c;
}

.ui-iboc {
  --ui-iboc-card: #fff;
  --ui-iboc-ink: rgba(0, 0, 0, 0.88);
  --ui-iboc-muted: rgba(0, 0, 0, 0.45);
  --ui-iboc-faint: rgba(0, 0, 0, 0.27);
  --ui-iboc-line: rgba(0, 0, 0, 0.06);
  --ui-iboc-line-strong: rgba(0, 0, 0, 0.16);
  --ui-iboc-fill: rgba(0, 0, 0, 0.04);
  --ui-iboc-hover: rgba(0, 0, 0, 0.02);
  --ui-iboc-focus: rgba(0, 96, 226, 0.7);
  --ui-iboc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 10px;
  background: var(--ui-iboc-card);
  box-shadow: 0 0 0 0.5px var(--ui-iboc-line);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-iboc-ink);
  container: ui-iboc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-iboc,
.ui-iboc *,
.ui-iboc *::before,
.ui-iboc *::after {
  box-sizing: border-box;
}
.ui-iboc__option {
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
.ui-iboc__option:hover {
  background: var(--ui-iboc-hover);
}
.ui-iboc__option[aria-checked="true"] {
  background: var(--ui-iboc-fill);
}
.ui-iboc__option:disabled {
  cursor: default;
  opacity: 0.5;
}
.ui-iboc__option:focus-visible {
  outline: 2px solid var(--ui-iboc-focus);
  outline-offset: -2px;
}
.ui-iboc__option:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-iboc__number {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: inset 0 0 0 0.5px var(--ui-iboc-line-strong);
  font-size: 11px;
  color: var(--ui-iboc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-iboc__option[aria-checked="true"] .ui-iboc__number {
  background: var(--ui-iboc-ink);
  color: var(--ui-iboc-card);
  box-shadow: none;
}
.ui-iboc__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-iboc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 20px;
}
.ui-iboc__head strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.ui-iboc__recommended {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  background: rgba(0, 143, 245, 0.1);
  color: #006dcb;
}
.ui-iboc__summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-iboc-muted);
  font-size: 13px;
  line-height: 20px;
}
.ui-iboc__more {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 320ms var(--ui-iboc-ease),
    opacity 220ms;
}
.ui-iboc__more[data-open] {
  grid-template-rows: 1fr;
  opacity: 1;
}
.ui-iboc__clip {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.ui-iboc__line {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-iboc-muted);
}
.ui-iboc__line:first-child {
  margin-top: 8px;
}
.ui-iboc__line > b {
  flex: none;
  width: 8px;
  text-align: center;
  font-weight: 500;
  color: var(--ui-iboc-faint);
}
.ui-iboc[data-variant="variants"] {
  display: grid;
  grid-template-columns: repeat(var(--ui-iboc-count, 3), minmax(0, 1fr));
  gap: 6px;
  margin: -6px;
  padding: 0;
  box-shadow: none;
  background: none;
}
.ui-iboc[data-variant="variants"] .ui-iboc__option {
  grid-template-columns: 18px minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 8px;
  min-height: 0;
  padding: 6px 6px 8px;
  border-radius: 10px;
}
.ui-iboc__preview {
  display: block;
  grid-column: 1/-1;
  overflow: hidden;
  border-radius: 6px;
  background: var(--ui-iboc-card);
  box-shadow: 0 0 0 0.5px var(--ui-iboc-line);
}
.ui-iboc__preview > img {
  display: block;
  width: 100%;
  height: auto;
}
.ui-iboc__wire {
  display: block;
  width: 100%;
  height: auto;
  --ui-iboc-card: #fff;
  --ui-iboc-wire-ink: rgba(0, 0, 0, 0.42);
  --ui-iboc-wire-mid: rgba(0, 0, 0, 0.16);
  --ui-iboc-wire-soft: rgba(0, 0, 0, 0.07);
}
.ui-iboc[data-variant="variants"] .ui-iboc__number {
  width: 18px;
  height: 18px;
}
.ui-iboc[data-variant="variants"] .ui-iboc__recommended {
  display: none;
}
.ui-iboc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-iboc (max-width:360px) {
  .ui-iboc[data-variant="variants"] .ui-iboc__option {
    padding: 4px 4px 6px;
    column-gap: 0;
  }
  .ui-iboc[data-variant="variants"] .ui-iboc__number {
    display: none;
  }
  .ui-iboc[data-variant="variants"] .ui-iboc__body {
    grid-column: 1/-1;
  }
  .ui-iboc__head strong {
    font-size: 12px;
  }
}
@media (pointer: coarse) {
  .ui-iboc__option {
    min-height: 56px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-iboc,
  .ui-iboc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-iboc,
:where(.dark, [data-theme="dark"]) .ui-iboc__wire {
  --ui-iboc-card: #1c1c1e;
  --ui-iboc-ink: rgba(255, 255, 255, 0.9);
  --ui-iboc-muted: rgba(255, 255, 255, 0.46);
  --ui-iboc-faint: rgba(255, 255, 255, 0.3);
  --ui-iboc-line: rgba(255, 255, 255, 0.08);
  --ui-iboc-line-strong: rgba(255, 255, 255, 0.16);
  --ui-iboc-fill: rgba(255, 255, 255, 0.06);
  --ui-iboc-hover: rgba(255, 255, 255, 0.03);
  --ui-iboc-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-iboc__recommended {
  background: rgba(0, 119, 255, 0.22);
  color: #70b8ff;
}

:where(.dark, [data-theme="dark"]) .ui-iboc__wire {
  --ui-iboc-wire-ink: rgba(255, 255, 255, 0.5);
  --ui-iboc-wire-mid: rgba(255, 255, 255, 0.2);
  --ui-iboc-wire-soft: rgba(255, 255, 255, 0.08);
}

.ui-ibfc {
  --ui-ibfc-card: #fff;
  --ui-ibfc-ink: rgba(0, 0, 0, 0.88);
  --ui-ibfc-muted: rgba(0, 0, 0, 0.45);
  --ui-ibfc-fill: rgba(0, 0, 0, 0.04);
  --ui-ibfc-line: rgba(0, 0, 0, 0.06);
  --ui-ibfc-focus: rgba(0, 96, 226, 0.7);
  --ui-ibfc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-ibfc-ink);
  container-type: inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibfc,
.ui-ibfc *,
.ui-ibfc *::before,
.ui-ibfc *::after {
  box-sizing: border-box;
}
.ui-ibfc__sent {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ui-ibfc-fade 240ms both;
}
.ui-ibfc__mark {
  width: 24px;
  height: 24px;
  flex: none;
  overflow: visible;
}
.ui-ibfc__ring {
  fill: var(--ui-ibfc-fill);
  stroke: none;
  transform-origin: center;
  animation: ui-ibfc-pop 420ms var(--ui-ibfc-ease) both;
}
.ui-ibfc__tick {
  fill: none;
  stroke: var(--ui-ibfc-ink);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ui-ibfc-draw 420ms var(--ui-ibfc-ease) 160ms forwards;
}
.ui-ibfc__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 2px;
}
.ui-ibfc__text strong {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  animation: ui-ibfc-rise 360ms var(--ui-ibfc-ease) 120ms both;
}
.ui-ibfc__text > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-ibfc-muted);
  animation: ui-ibfc-rise 360ms var(--ui-ibfc-ease) 200ms both;
}
.ui-ibfc__empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  text-align: center;
  padding: 40px 24px 80px;
  animation: ui-ibfc-rise 480ms var(--ui-ibfc-ease) both;
}
.ui-ibfc__empty-mark {
  width: 36px;
  height: 36px;
  color: var(--ui-ibfc-muted);
}
.ui-ibfc__empty h2 {
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  outline: none;
}
.ui-ibfc__empty p {
  margin: 2px 0 20px;
  color: var(--ui-ibfc-muted);
  font-size: 13px;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
}
.ui-ibfc__empty button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-ibfc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibfc-line);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-ibfc-ink);
  cursor: pointer;
}
.ui-ibfc__empty button:active {
  transform: scale(0.97);
}
.ui-ibfc__empty button:focus-visible {
  outline: 2px solid var(--ui-ibfc-focus);
  outline-offset: 2px;
}
@keyframes ui-ibfc-fade {
  from {
    opacity: 0;
  }
}
@keyframes ui-ibfc-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
}
@keyframes ui-ibfc-draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes ui-ibfc-rise {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}
@media (pointer: coarse) {
  .ui-ibfc__empty button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibfc,
  .ui-ibfc * {
    animation: none !important;
    transition: none !important;
  }
  .ui-ibfc__tick {
    stroke-dashoffset: 0;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibfc {
  --ui-ibfc-card: #1c1c1e;
  --ui-ibfc-ink: rgba(255, 255, 255, 0.9);
  --ui-ibfc-muted: rgba(255, 255, 255, 0.46);
  --ui-ibfc-fill: rgba(255, 255, 255, 0.06);
  --ui-ibfc-line: rgba(255, 255, 255, 0.08);
  --ui-ibfc-focus: rgba(77, 141, 255, 0.8);
}

.ui-ibvc {
  --ui-ibvc-card: #fff;
  --ui-ibvc-ink: rgba(0, 0, 0, 0.88);
  --ui-ibvc-text: rgba(0, 0, 0, 0.61);
  --ui-ibvc-muted: rgba(0, 0, 0, 0.45);
  --ui-ibvc-faint: rgba(0, 0, 0, 0.27);
  --ui-ibvc-line: rgba(0, 0, 0, 0.06);
  --ui-ibvc-fill: rgba(0, 0, 0, 0.04);
  --ui-ibvc-focus: rgba(0, 96, 226, 0.7);
  --ui-ibvc-shadow: 0 0 0 0.5px var(--ui-ibvc-line), 0 1px 2px rgba(0, 0, 0, 0.025);
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: clamp(40px, 11vh, 104px) 40px 64px;
  color: var(--ui-ibvc-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-ibvc / inline-size;
  -webkit-font-smoothing: antialiased;
  animation: ui-ibvc-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ui-ibvc,
.ui-ibvc *,
.ui-ibvc *::before,
.ui-ibvc *::after {
  box-sizing: border-box;
}
.ui-ibvc :where(button) {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-ibvc :where(button, a.ui-ibvc__button):focus-visible {
  outline: 2px solid var(--ui-ibvc-focus);
  outline-offset: -2px;
}
.ui-ibvc :where(button, a.ui-ibvc__button):active:not(:disabled) {
  transform: scale(0.97);
}
.ui-ibvc a.ui-ibvc__button {
  color: inherit;
  text-decoration: none;
}
.ui-ibvc__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-ibvc-muted);
}
.ui-ibvc__meta > span:first-child {
  display: flex;
  flex: none;
  margin-right: 2px;
}
.ui-ibvc__meta > span[data-kind="decision"] {
  color: #a651f0;
}
.ui-ibvc__meta > span[data-kind="pick"] {
  color: #0190fe;
}
.ui-ibvc__meta > span:is([data-kind="approval"], [data-kind="done"]) {
  color: #5fc88a;
}
.ui-ibvc__meta > span[data-kind="question"] {
  color: #f28a2e;
}
.ui-ibvc__meta > span[dir] {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibvc__meta > span:last-child {
  flex: none;
  font-variant-numeric: tabular-nums;
}
.ui-ibvc__meta i {
  font-style: normal;
  color: var(--ui-ibvc-faint);
}
.ui-ibvc__badge {
  flex: none;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  background: rgba(255, 156, 0, 0.16);
  color: #cc4e00;
}
.ui-ibvc__question {
  margin: 10px 0 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.24px;
  text-wrap: balance;
  overflow-wrap: anywhere;
  outline: none !important;
}
.ui-ibvc__context {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--ui-ibvc-text);
  text-wrap: pretty;
}
.ui-ibvc__answer {
  margin-top: 32px;
}
.ui-ibvc__facts {
  margin: 0;
  padding: 4px 16px;
  border-radius: 10px;
  background: var(--ui-ibvc-card);
  box-shadow: var(--ui-ibvc-shadow);
}
.ui-ibvc__facts > div {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  column-gap: 12px;
  align-items: center;
  min-height: 40px;
}
.ui-ibvc__facts > div + div {
  box-shadow: inset 0 0.5px var(--ui-ibvc-line);
}
.ui-ibvc__facts dt {
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibvc-muted);
}
.ui-ibvc__facts dd {
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
.ui-ibvc__free {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ui-ibvc__reply {
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: var(--ui-ibvc-card);
  box-shadow: var(--ui-ibvc-shadow);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibvc-ink);
  outline: none;
  transition: box-shadow 140ms;
}
.ui-ibvc__reply::placeholder {
  color: var(--ui-ibvc-faint);
}
.ui-ibvc__reply:focus {
  outline: none;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.16),
    0 1px 2px rgba(0, 0, 0, 0.04);
}
.ui-ibvc__area {
  flex: none;
  height: 88px;
  width: 100%;
  padding: 10px 12px;
  resize: none;
}
.ui-ibvc__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibvc__chips button {
  height: 28px;
  max-width: 100%;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-ibvc-fill);
  font-size: 13px;
  color: var(--ui-ibvc-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.ui-ibvc__chips button[aria-pressed="true"] {
  color: var(--ui-ibvc-ink);
  box-shadow: inset 0 0 0 0.5px var(--ui-ibvc-line);
}
.ui-ibvc__error {
  margin-top: 14px;
  font-size: 13px;
  line-height: 20px;
  color: var(--aui-danger, #c4320a);
}
.ui-ibvc__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.ui-ibvc__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  margin-left: auto;
}
.ui-ibvc__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--ui-ibvc-card) !important;
  box-shadow: var(--ui-ibvc-shadow);
  font-size: 13px !important;
  font-weight: 500 !important;
  white-space: nowrap;
}
.ui-ibvc__button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-ibvc__later {
  box-shadow: none;
  background: none !important;
  color: var(--ui-ibvc-text) !important;
}
.ui-ibvc__later:hover {
  background: var(--ui-ibvc-fill) !important;
}
.ui-ibvc__send {
  background: var(--ui-ibvc-ink) !important;
  color: var(--ui-ibvc-card) !important;
  box-shadow: none;
}
.ui-ibvc kbd {
  font: inherit;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
  opacity: 0.5;
  margin-right: -2px;
}
.ui-ibvc__done {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
}
.ui-ibvc[data-phase="done"] .ui-ibvc__context + .ui-ibvc__done {
  margin-top: 16px;
}
.ui-ibvc__chosen {
  border-radius: 10px;
  background: var(--ui-ibvc-card);
  box-shadow: var(--ui-ibvc-shadow);
  font-size: 13px;
  line-height: 20px;
}
.ui-ibvc__chosen-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px 0 14px;
}
.ui-ibvc__chosen-row > svg {
  flex: none;
  color: #5fc88a;
}
.ui-ibvc__chosen-row > strong {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
}
.ui-ibvc__chosen-row > span {
  flex: none;
  color: var(--ui-ibvc-muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-ibvc__chosen-body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 0 16px 14px 40px;
  margin-top: -6px;
}
.ui-ibvc__chosen-thumb {
  flex: none;
  width: 96px;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: var(--ui-ibvc-shadow);
}
.ui-ibvc__chosen-lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.ui-ibvc__chosen-summary,
.ui-ibvc__words {
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ibvc-text);
  overflow-wrap: anywhere;
}
.ui-ibvc__pro {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-ibvc-muted);
}
.ui-ibvc__pro > b {
  font-weight: 500;
  color: var(--ui-ibvc-faint);
}
.ui-ibvc__chosen-summary + .ui-ibvc__pro {
  margin-top: 4px;
}
.ui-ibvc__chosen-fact {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  font-size: 12px;
  line-height: 20px;
}
.ui-ibvc__chosen-fact > span:first-child {
  color: var(--ui-ibvc-muted);
}
.ui-ibvc__chosen-fact > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibvc__since {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-ibvc__since h3 {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-ibvc-muted);
}
.ui-ibvc__since ul {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ui-ibvc-text);
}
.ui-ibvc__since li {
  position: relative;
  padding-left: 16px;
  overflow-wrap: anywhere;
}
.ui-ibvc__since li:before {
  content: "";
  position: absolute;
  top: 9px;
  left: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ui-ibvc-faint);
}
.ui-ibvc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibvc__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ibvc-fill);
  font-size: 12px;
}
.ui-ibvc__done-actions {
  display: flex;
}
@keyframes ui-ibvc-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@container ui-ibsc (max-width:639.99px) {
  .ui-ibvc {
    padding: 12px 20px 40px;
  }
  .ui-ibvc__question {
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0.2px;
  }
  .ui-ibvc__answer {
    margin-top: 24px;
  }
  .ui-ibvc__footer {
    flex-wrap: wrap;
  }
  .ui-ibvc__footer > .ui-ibvc__reply {
    flex-basis: 100%;
  }
  .ui-ibvc kbd {
    display: none;
  }
  .ui-ibvc__facts > div {
    grid-template-columns: 60px minmax(0, 1fr);
  }
}
@media (pointer: coarse) {
  .ui-ibvc__button,
  .ui-ibvc__chips button {
    min-height: 36px;
  }
  .ui-ibvc__reply:not(.ui-ibvc__area) {
    height: 40px;
  }
  .ui-ibvc kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibvc,
  .ui-ibvc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibvc {
  --ui-ibvc-card: #1c1c1e;
  --ui-ibvc-ink: rgba(255, 255, 255, 0.9);
  --ui-ibvc-text: rgba(255, 255, 255, 0.62);
  --ui-ibvc-muted: rgba(255, 255, 255, 0.46);
  --ui-ibvc-faint: rgba(255, 255, 255, 0.3);
  --ui-ibvc-line: rgba(255, 255, 255, 0.08);
  --ui-ibvc-fill: rgba(255, 255, 255, 0.06);
  --ui-ibvc-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-ibvc__badge {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}
:where(.dark, [data-theme="dark"]) .ui-ibvc__error {
  color: var(--aui-danger, #ff8a7a);
}

.ui-ibpc {
  --ui-ibpc-ink: rgba(0, 0, 0, 0.88);
  --ui-ibpc-muted: rgba(0, 0, 0, 0.45);
  --ui-ibpc-line: rgba(0, 0, 0, 0.06);
  --ui-ibpc-focus: rgba(0, 96, 226, 0.7);
  position: relative;
  height: 100%;
  min-height: 0;
  width: 100%;
  container: ui-ibsc / inline-size;
  display: flex;
  color: var(--ui-ibpc-ink);
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
.ui-ibpc,
.ui-ibpc *,
.ui-ibpc *::before,
.ui-ibpc *::after {
  box-sizing: border-box;
}
.ui-ibpc__list {
  flex: none;
  width: 320px;
  min-height: 0;
}
.ui-ibpc__reading {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}
.ui-ibpc__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--ui-ibpc-line) transparent;
}
.ui-ibpc__mobile-head {
  display: none;
  height: 48px;
  flex: none;
  align-items: center;
  padding: 0 48px;
}
.ui-ibpc__mobile-head button {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--ui-ibpc-muted);
  font:
    500 13px/20px "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  cursor: pointer;
}
.ui-ibpc__mobile-head button > svg {
  transform: rotate(180deg);
}
.ui-ibpc__mobile-head button:active {
  transform: scale(0.97);
}
.ui-ibpc__mobile-head button:focus-visible {
  outline: 2px solid var(--ui-ibpc-focus);
  outline-offset: 2px;
}
.ui-ibpc__empty {
  display: grid;
  place-items: center;
  min-height: 100%;
  padding-bottom: 48px;
}
.ui-ibpc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-ibsc (max-width:639.99px) {
  .ui-ibpc__list {
    width: 100%;
  }
  .ui-ibpc__reading {
    display: none;
  }
  .ui-ibpc[data-detail] .ui-ibpc__list {
    display: none;
  }
  .ui-ibpc[data-detail] .ui-ibpc__reading {
    display: flex;
  }
  .ui-ibpc__mobile-head {
    display: flex;
  }
  .ui-ibpc__empty {
    padding-bottom: 0;
  }
}
@media (pointer: coarse) {
  .ui-ibpc__mobile-head button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibpc,
  .ui-ibpc * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibpc {
  --ui-ibpc-ink: rgba(255, 255, 255, 0.9);
  --ui-ibpc-muted: rgba(255, 255, 255, 0.46);
  --ui-ibpc-line: rgba(255, 255, 255, 0.08);
  --ui-ibpc-focus: rgba(77, 141, 255, 0.8);
}

`;
