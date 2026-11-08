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
 * inbox-item-view (Classic) – a self-contained React 19 component.
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

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
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
      <style href="ui-inbox-item-view" precedence="default">
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
      <style href="ui-inbox-item-view" precedence="default">
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
      <style href="ui-inbox-item-view" precedence="default">
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
      <style href="ui-inbox-item-view" precedence="default">
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
      <style href="ui-inbox-item-view" precedence="default">
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

/* ---------- Styles ---------- */

const css = /* css */ `
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

`;
