"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/*
 * decision-dock (Classic) – a self-contained React 19 component.
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

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest('input,textarea,select,[contenteditable="true"]');
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
      className={["ui-dd", className].filter(Boolean).join(" ")}
      data-empty={!current || undefined}
      data-folded={folded || undefined}
      data-status={status}
      data-kind={approval ? "approval" : decision.kind === "pick" ? "pick" : "decision"}
      onKeyDown={keyboard}
    >
      <style href="ui-decision-dock" precedence="default">
        {css}
      </style>
      {folded && current && (
        <div className="ui-dd__folded">
          <span className="ui-dd__dot" />
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
      <div className="ui-dd__collapse" inert={folded || !current} aria-hidden={folded || !current}>
        <div className="ui-dd__clip">
          <section
            id={`${id}-card`}
            className="ui-dd__card"
            role="group"
            aria-labelledby={`${id}-question`}
            aria-describedby={decision.error ? `${id}-error` : undefined}
            aria-busy={status === "submitting"}
            data-pulse={focusRequest || undefined}
            key={decision.id}
          >
            <header className="ui-dd__head">
              <span className="ui-dd__tag">{status === "awaiting" ? labels.needsYou : labels[status]}</span>
              <span className="ui-dd__task" title={decision.task}>
                {decision.task}
              </span>
              {list.length > 1 && (
                <span className="ui-dd__pager">
                  <button
                    type="button"
                    aria-label={labels.previous}
                    onClick={() => setActiveId(list[(activeIndex - 1 + list.length) % list.length].id)}
                  >
                    <Icon name="chevron" size={10} />
                  </button>
                  <span>{labels.page(activeIndex + 1, list.length)}</span>
                  <button
                    type="button"
                    aria-label={labels.next}
                    onClick={() => setActiveId(list[(activeIndex + 1) % list.length].id)}
                  >
                    <Icon name="chevron" size={10} />
                  </button>
                </span>
              )}
              <button
                type="button"
                className="ui-dd__later"
                aria-expanded="true"
                aria-controls={`${id}-card`}
                onClick={later}
              >
                {labels.later}
              </button>
            </header>
            <p className="ui-dd__question" id={`${id}-question`} dir="auto">
              {decision.question}
            </p>
            {approval && decision.facts && (
              <dl className="ui-dd__facts">
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
              <p className="ui-dd__error" id={`${id}-error`} role="alert">
                {decision.error}
              </p>
            )}
            {status !== "answered" && status !== "expired" && (
              <>
                <div className="ui-dd__choices" role="listbox" aria-label={decision.question} aria-disabled={disabled}>
                  {options.map((option, index) => (
                    <button
                      type="button"
                      role="option"
                      disabled={disabled}
                      aria-selected={focused === index}
                      tabIndex={focused === index ? 0 : -1}
                      aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                      className="ui-dd__option"
                      key={option.id}
                      onFocus={() => setFocused(index)}
                      onClick={() => answer(index)}
                    >
                      {decision.kind === "pick" && (
                        <span
                          className="ui-dd__wire"
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
                              <rect x="40" width="120" height="80" rx="8" fill="var(--ui-dd-card)" />
                              <g fill="var(--ui-dd-faint)">
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
                      <span className="ui-dd__number">{index + 1}</span>
                      <span className="ui-dd__text">
                        <strong dir="auto">{option.title}</strong>
                        {option.summary && <small dir="auto">{option.summary}</small>}
                      </span>
                      {option.recommended && <span className="ui-dd__recommended">{labels.recommended}</span>}
                    </button>
                  ))}
                </div>
                {allowCustom && (
                  <form
                    className="ui-dd__custom"
                    onSubmit={(event) => {
                      event.preventDefault();
                      answerCustom();
                    }}
                  >
                    <span className="ui-dd__number">{rows}</span>
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

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-dd__choices {
  max-height: min(48vh, 420px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.ui-dd button:disabled,
.ui-dd input:disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-dd__error {
  margin: 0;
  padding: 4px;
  color: #e5484d;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.ui-dd__text strong {
  overflow-wrap: anywhere;
}
.ui-dd {
  --ui-dd-card: #fff;
  --ui-dd-tray: #f0f0f0;
  --ui-dd-ink: rgba(0, 0, 0, 0.88);
  --ui-dd-muted: rgba(0, 0, 0, 0.45);
  --ui-dd-faint: rgba(0, 0, 0, 0.27);
  --ui-dd-line: rgba(0, 0, 0, 0.06);
  --ui-dd-fill: rgba(0, 0, 0, 0.04);
  --ui-dd-focus: rgba(0, 96, 226, 0.35);
  --ui-dd-ease: cubic-bezier(0.22, 1, 0.36, 1);
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
  color: var(--ui-dd-ink);
  container: ui-dd / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-dd,
.ui-dd *,
.ui-dd *::before,
.ui-dd *::after {
  box-sizing: border-box;
}
.ui-dd button,
.ui-dd input {
  font: inherit;
  color: inherit;
}
.ui-dd button {
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-dd button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-dd button:focus-visible,
.ui-dd input:focus-visible {
  outline: 2px solid var(--ui-dd-focus);
  outline-offset: -2px;
}
.ui-dd__collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition:
    grid-template-rows 380ms var(--ui-dd-ease),
    opacity 180ms;
}
.ui-dd[data-folded] .ui-dd__collapse,
.ui-dd[data-empty] .ui-dd__collapse {
  grid-template-rows: 0fr;
  opacity: 0;
}
.ui-dd__clip {
  min-height: 0;
  overflow: clip;
  overflow-clip-margin: 1px;
  padding: 0;
}
.ui-dd__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 18px;
  padding: 10px 8px 6px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
  animation: ui-dd-in 260ms var(--ui-dd-ease) both;
}
.ui-dd__head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding: 0 4px;
  margin-bottom: 0;
  font-size: 12px;
  color: var(--ui-dd-muted);
}
.ui-dd__tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(232, 162, 12, 0.12);
  color: #b47a06;
  flex: none;
}
.ui-dd__task {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-dd__pager {
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-dd__pager button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 22px;
  border-radius: 4px;
  color: var(--ui-dd-muted);
}
.ui-dd__pager button:first-child svg {
  rotate: 90deg;
}
.ui-dd__pager button:last-child svg {
  rotate: -90deg;
}
.ui-dd__later {
  font-size: 12px !important;
  border-radius: 4px;
  padding: 3px 6px;
}
.ui-dd__later:hover,
.ui-dd__pager button:hover {
  background: var(--ui-dd-fill);
}
.ui-dd__question {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  margin: 0;
  padding: 0 4px;
  overflow-wrap: anywhere;
}
.ui-dd__choices {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ui-dd__option {
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
.ui-dd__option:hover,
.ui-dd__option:focus-visible {
  background: var(--ui-dd-fill);
}
.ui-dd__number {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  background: var(--ui-dd-fill);
  color: var(--ui-dd-muted);
  border-radius: 6px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.ui-dd__text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0;
}
.ui-dd__text strong {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}
.ui-dd__text small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-dd-muted);
  overflow-wrap: anywhere;
}
.ui-dd__recommended {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--ui-dd-fill);
  color: var(--ui-dd-muted);
  white-space: nowrap;
}
.ui-dd__custom {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 4px 8px 4px 4px;
}
.ui-dd__custom input {
  width: 0;
  flex: 1;
  background: none;
  border: 0;
  outline: none;
  padding: 0;
  line-height: 20px;
  min-width: 0;
}
.ui-dd__custom input::placeholder {
  color: var(--ui-dd-faint);
}
.ui-dd__custom button {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 5px;
  background: var(--ui-dd-fill);
}
.ui-dd__facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 6px;
  font-size: 13px;
}
.ui-dd__facts > div {
  display: flex;
  gap: 12px;
}
.ui-dd__facts dt {
  color: var(--ui-dd-muted);
  width: 60px;
  flex: none;
}
.ui-dd__facts dd {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-dd__folded {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  font-size: 12px;
  color: var(--ui-dd-muted);
  padding: 0 8px 0 14px;
  border-radius: 18px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
}
.ui-dd__folded button {
  padding: 4px 7px;
  border-radius: 5px;
  font-size: 12px;
}
.ui-dd__folded button:hover {
  background: var(--ui-dd-fill);
}
.ui-dd__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8a20c;
}
.ui-dd[data-kind="pick"] .ui-dd__choices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.ui-dd[data-kind="pick"] .ui-dd__option {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  border-radius: 10px;
}
.ui-dd[data-kind="pick"] .ui-dd__option .ui-dd__number {
  margin-left: 2px;
}
.ui-dd[data-kind="pick"] .ui-dd__recommended {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--ui-dd-card);
  box-shadow: 0 0 0 0.5px var(--ui-dd-line);
}
.ui-dd__wire {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  grid-column: 1/-1;
  height: 92px;
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 0.5px var(--ui-dd-line);
  background: var(--ui-dd-fill);
  overflow: hidden;
}
.ui-dd__card[data-pulse] {
  animation: ui-dd-pulse 550ms ease both;
}
@keyframes ui-dd-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
}
@keyframes ui-dd-pulse {
  30% {
    background: var(--ui-dd-fill);
  }
}
@container ui-dd (max-width:440px) {
  .ui-dd__recommended {
    font-size: 9px;
  }
  .ui-dd__option {
    gap: 7px;
  }
  .ui-dd__text small {
    font-size: 11px;
  }
  .ui-dd__card {
    padding: 10px;
  }
  .ui-dd[data-kind="pick"] .ui-dd__choices {
    gap: 5px;
  }
}
@media (pointer: coarse) {
  .ui-dd__option {
    min-height: 44px;
  }
  .ui-dd__custom {
    min-height: 40px;
  }
  .ui-dd__custom input {
    font-size: 16px;
  }
  .ui-dd__pager button,
  .ui-dd__later {
    min-width: 32px;
    min-height: 36px;
  }
  .ui-dd__folded button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-dd,
  .ui-dd * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-dd {
  --ui-dd-card: #1c1c1e;
  --ui-dd-tray: #161618;
  --ui-dd-ink: rgba(255, 255, 255, 0.9);
  --ui-dd-muted: rgba(255, 255, 255, 0.46);
  --ui-dd-faint: rgba(255, 255, 255, 0.3);
  --ui-dd-line: rgba(255, 255, 255, 0.08);
  --ui-dd-fill: rgba(255, 255, 255, 0.08);
  --ui-dd-focus: rgba(77, 141, 255, 0.5);
}

.ui-dd__wire > svg {
  display: block;
  width: 100%;
  height: 100%;
}
.ui-dd {
  --ui-dd-ink: #171717;
  --ui-dd-muted: #737373;
  --ui-dd-faint: #b5b5b5;
  --ui-dd-line: #e5e5e5;
  --ui-dd-fill: #f5f5f5;
  --ui-dd-focus: #2f6bff;
}
.ui-dd__clip {
  padding: 6px;
  background: var(--ui-dd-tray);
  border-radius: 22px;
}
.ui-dd__card {
  border: 1px solid var(--ui-dd-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-dd__option {
  min-height: 44px;
}
:where(.dark, [data-theme="dark"]) .ui-dd {
  --ui-dd-card: #232326;
  --ui-dd-ink: #ededed;
  --ui-dd-muted: #8f8f8f;
  --ui-dd-faint: #6b6b70;
  --ui-dd-line: rgba(255, 255, 255, 0.1);
  --ui-dd-fill: #2a2a2d;
}

`;
