"use client";

import { type ReactNode } from "react";

/*
 * inbox-task-context (Clean) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
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
      className={["ui-ibxc", className].filter(Boolean).join(" ")}
      aria-label={name ? `${name}, task context` : "Task context"}
    >
      <style href="ui-inbox-task-context-clean" precedence="default">
        {css}
      </style>
      {name && task ? (
        <>
          {task.goal && (
            <p className="ui-ibxc__goal" dir="auto">
              {task.goal}
            </p>
          )}
          <dl className="ui-ibxc__properties">
            <div>
              <dt>{labels.status ?? "Status"}</dt>
              <dd>
                <svg className="ui-ibxc__ring" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.25" />
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
                  <span className="ui-ibxc__count">
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
            <section className="ui-ibxc__section">
              <h3>{labels.steps ?? "Steps"}</h3>
              <ol className="ui-ibxc__steps">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    data-done={step.done || undefined}
                    data-current={index === first || undefined}
                    data-waiting={(index === first && waiting) || undefined}
                  >
                    <span className="ui-ibxc__step-mark">{step.done && <Icon name="check" size={10} />}</span>
                    <span dir="auto">{step.label}</span>
                    {index === first && waiting && (
                      <span className="ui-ibxc__needs">{labels.needs ?? "Needs you"}</span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {!!task.artifacts?.length && (
            <section className="ui-ibxc__section">
              <h3>
                {labels.artifacts ?? "Artifacts"}
                <span>{task.artifacts.length}</span>
              </h3>
              <div className="ui-ibxc__files">
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
            <section className="ui-ibxc__section">
              <h3>{labels.decided ?? "Decided"}</h3>
              <div className="ui-ibxc__decided">
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

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-ibxc {
  --ui-ibxc-card: #fff;
  --ui-ibxc-ink: rgba(0, 0, 0, 0.88);
  --ui-ibxc-text: rgba(0, 0, 0, 0.61);
  --ui-ibxc-muted: rgba(0, 0, 0, 0.45);
  --ui-ibxc-faint: rgba(0, 0, 0, 0.27);
  --ui-ibxc-line: rgba(0, 0, 0, 0.06);
  --ui-ibxc-fill: rgba(0, 0, 0, 0.025);
  --ui-ibxc-focus: rgba(0, 96, 226, 0.7);
  width: 100%;
  padding: 18px;
  color: var(--ui-ibxc-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-ibxc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-ibxc,
.ui-ibxc *,
.ui-ibxc *::before,
.ui-ibxc *::after {
  box-sizing: border-box;
}
.ui-ibxc__goal {
  margin: 0 0 24px;
  color: var(--ui-ibxc-text);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.ui-ibxc__properties {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
}
.ui-ibxc__properties > div {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}
.ui-ibxc dt {
  font-size: 12px;
  color: var(--ui-ibxc-muted);
}
.ui-ibxc dd {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-ibxc__ring {
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--ui-ibxc-muted);
}
.ui-ibxc__count {
  color: var(--ui-ibxc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-ibxc__section {
  margin-top: 24px;
}
.ui-ibxc__section + .ui-ibxc__section {
  margin-top: 20px;
}
.ui-ibxc h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--ui-ibxc-muted);
}
.ui-ibxc h3 > span {
  color: var(--ui-ibxc-faint);
  font-variant-numeric: tabular-nums;
}
.ui-ibxc__steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  margin: 0 -10px;
  padding: 6px 10px;
  border-radius: 12px;
  background: var(--ui-ibxc-fill);
}
.ui-ibxc__steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  color: var(--ui-ibxc-muted);
}
.ui-ibxc__steps li > span:nth-child(2) {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.ui-ibxc__step-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--ui-ibxc-line);
}
.ui-ibxc__steps li[data-done] .ui-ibxc__step-mark {
  background: #0190fe;
  color: #fff;
  box-shadow: none;
}
.ui-ibxc__steps li[data-current] {
  color: var(--ui-ibxc-ink);
}
.ui-ibxc__steps li[data-current] .ui-ibxc__step-mark {
  box-shadow: inset 0 0 0 1px #0190fe;
}
.ui-ibxc__steps li[data-waiting] .ui-ibxc__step-mark {
  box-shadow: inset 0 0 0 1px #f76b00;
}
.ui-ibxc__needs {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  color: #eb5600;
  background: rgba(255, 156, 0, 0.16);
}
.ui-ibxc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-ibxc :where(button) {
  border: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.ui-ibxc button:focus-visible {
  outline: 2px solid var(--ui-ibxc-focus);
  outline-offset: 2px;
}
.ui-ibxc button:active {
  transform: scale(0.97);
}
.ui-ibxc__files > button {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-height: 26px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ibxc-fill);
  font-size: 12px;
  line-height: 20px;
}
.ui-ibxc__files > button > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibxc__files > button > span:first-child {
  display: flex;
  flex: none;
  color: #68b1ee;
}
.ui-ibxc__files [data-kind="table"] {
  color: #89d4aa !important;
}
.ui-ibxc__files [data-kind="code"] {
  color: #f4b17e !important;
}
.ui-ibxc__files [data-kind="folder"] {
  color: #ecd16e !important;
}
.ui-ibxc__decided {
  margin: 0 -10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ui-ibxc__decided > button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 58px;
  padding: 8px 10px;
  border-radius: 12px;
  background: var(--ui-ibxc-card);
  box-shadow: 0 0 0 0.5px var(--ui-ibxc-line);
  text-align: left;
}
.ui-ibxc__decided > button > svg:first-child {
  flex: none;
  color: #5fc88a;
}
.ui-ibxc__decided > button > span {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.ui-ibxc__decided > button > span > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-ibxc__decided > button > span > span:last-child {
  font-size: 12px;
  color: var(--ui-ibxc-muted);
}
.ui-ibxc__decided > button > svg:last-child {
  display: none;
}
.ui-ibxc__placeholder {
  color: var(--ui-ibxc-muted);
}
@container ui-ibxc (max-width:270px) {
  .ui-ibxc__properties > div {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 8px;
  }
  .ui-ibxc__needs {
    padding: 0 4px;
  }
}
@media (pointer: coarse) {
  .ui-ibxc__files > button,
  .ui-ibxc__decided > button {
    min-height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ibxc,
  .ui-ibxc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ibxc {
  --ui-ibxc-card: #1c1c1e;
  --ui-ibxc-ink: rgba(255, 255, 255, 0.9);
  --ui-ibxc-text: rgba(255, 255, 255, 0.62);
  --ui-ibxc-muted: rgba(255, 255, 255, 0.46);
  --ui-ibxc-faint: rgba(255, 255, 255, 0.3);
  --ui-ibxc-line: rgba(255, 255, 255, 0.08);
  --ui-ibxc-fill: rgba(255, 255, 255, 0.025);
  --ui-ibxc-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-ibxc__needs {
  background: rgba(251, 106, 0, 0.15);
  color: #ffa057;
}

`;
