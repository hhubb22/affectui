"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/*
 * inbox-list (Classic) – a self-contained React 19 component.
 * Inline SVGs and scoped styles are included; no other local files or packages are required.
 * Maintained in scripts/chat-rail; run npm run generate after changes.
 */

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
      className={["ui-ibl", className].filter(Boolean).join(" ")}
      aria-busy={disabled}
    >
      <style href="ui-inbox-list" precedence="default">
        {css}
      </style>
      <header className="ui-ibl__head">
        <h1>
          {labels.inbox ?? "Inbox"}
          <span>{items.filter((item) => !item.done).length || null}</span>
        </h1>
        {showTabs && (
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
        )}
      </header>
      <div
        className="ui-ibl__rows"
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
                aria-label={`${item.done ? "Answered" : kindLabel}: ${rowTitle}. ${item.task}, ${age.long}${item.unread && !item.done ? ", unread" : ""}`}
                title={rowTitle}
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
                    {rowTitle}
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

/* ---------- Styles ---------- */

const css = /* css */ `
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

`;
