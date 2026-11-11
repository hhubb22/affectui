"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/*
 * Running Now – a single self-contained file, classic style.
 * Live background-task pill and 340px popover for app headers and toolbars: animated count & step swaps,
 * 14px SVG progress pie ring, needs-you amber badge, roving Arrow/Home/End keyboard navigation, focus
 * restoration when a completed row unmounts, and polite screen-reader status announcements.
 */

export type RunningTaskState = "running" | "paused" | "needs-you" | "done";

export type RunningTask = {
  id: string;
  title: string;
  step?: string;
  done?: number;
  total?: number;
  state: RunningTaskState;
};

export type RunningNowLabels = {
  title: string;
  running: string;
  needsYou: string;
  needsYouOne: string;
  needsYouBadge: string;
  paused: string;
  pausedCount: string;
  done: string;
  pause: string;
  resume: string;
  open: string;
  openAll: string;
  empty: string;
  idle: string;
};

export type RunningNowProps = {
  tasks: RunningTask[];
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onOpen?: (id: string) => void;
  onOpenAll?: () => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  labels?: Partial<RunningNowLabels>;
  className?: string;
};

const defaultLabels: RunningNowLabels = {
  title: "Background tasks",
  running: "running",
  needsYou: "need you",
  needsYouOne: "needs you",
  needsYouBadge: "Needs you",
  paused: "Paused",
  pausedCount: "paused",
  done: "Done",
  pause: "Pause",
  resume: "Resume",
  open: "Open",
  openAll: "Open Tasks",
  empty: "Nothing running right now",
  idle: "No tasks running",
};

const numFmt = new Intl.NumberFormat("en-US");

function safeNum(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function taskProgress(task: RunningTask): number {
  if (task.state === "done") return 1;
  const total = Math.max(0, safeNum(task.total));
  return total > 0 ? Math.min(1, Math.max(0, safeNum(task.done) / total)) : 0;
}

function ringColor(task: RunningTask, progress: number): string {
  if (task.state === "done") return "var(--ui-rn-blue)";
  if (task.state === "paused") return "var(--ui-rn-muted)";
  if (progress <= 0.25) return "var(--ui-rn-orange)";
  if (progress <= 0.5) return "var(--ui-rn-amber)";
  return "var(--ui-rn-teal)";
}

export function RunningNow({
  tasks,
  onPause,
  onResume,
  onOpen,
  onOpenAll,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  align = "end",
  labels: labelOverrides,
  className,
}: RunningNowProps) {
  const labels: RunningNowLabels = {
    ...defaultLabels,
    ...(labelOverrides?.needsYou && !labelOverrides.needsYouOne ? { needsYouOne: labelOverrides.needsYou } : null),
    ...labelOverrides,
  };
  const items = (Array.isArray(tasks) ? tasks : []).filter(
    (item): item is RunningTask => Boolean(item && typeof item === "object" && item.id),
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = openProp ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const runningCount = items.filter((item) => item.state === "running").length;
  const needsYouCount = items.filter((item) => item.state === "needs-you").length;
  const needsYouWord = needsYouCount === 1 ? labels.needsYouOne : labels.needsYou;
  const pausedCount = items.filter((item) => item.state === "paused").length;

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  const [shiftX, setShiftX] = useState(0);
  useLayoutEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const panel = panelRef.current;
      const root = rootRef.current;
      if (!panel || !root) return;
      const rect = root.getBoundingClientRect();
      const width = panel.offsetWidth;
      const rtl = getComputedStyle(root).direction === "rtl";
      const left = (align === "start") === rtl ? rect.right - width : rect.left;
      const viewport = document.documentElement.clientWidth;
      const delta =
        left < 16
          ? 16 - left
          : left + width > viewport - 16
            ? Math.max(16 - left, viewport - 16 - left - width)
            : 0;
      setShiftX(Math.round(delta));
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (rootRef.current) observer?.observe(rootRef.current);
    return () => {
      window.removeEventListener("resize", updatePosition);
      observer?.disconnect();
    };
  }, [isOpen, align]);

  const [announcement, setAnnouncement] = useState("");
  const prevStatesRef = useRef<Map<string, RunningTaskState> | null>(null);
  useEffect(() => {
    const prev = prevStatesRef.current;
    const next = new Map(items.map((item) => [item.id, item.state]));
    prevStatesRef.current = next;
    if (!prev) return;
    const updates: string[] = [];
    for (const item of items) {
      const old = prev.get(item.id);
      if (old !== item.state && old !== undefined) {
        if (item.state === "needs-you") updates.push(`${item.title} ${labels.needsYouBadge.toLowerCase()}`);
        if (item.state === "done") updates.push(`${item.title}: ${labels.done.toLowerCase()}`);
      }
    }
    if (updates.length > 0) setAnnouncement(updates.join(". "));
  });

  const mainButtons = () => [...(listRef.current?.querySelectorAll<HTMLButtonElement>(".ui-rn__main") ?? [])];
  const focusEdgeRow = (last = false) =>
    requestAnimationFrame(() => {
      const buttons = mainButtons();
      const target =
        (last ? buttons[buttons.length - 1] : buttons[0]) ??
        panelRef.current?.querySelector<HTMLElement>("button") ??
        panelRef.current;
      target?.focus();
    });

  const lastFocusedRef = useRef<{ el: HTMLElement; id: string | undefined; index: number } | null>(null);
  useLayoutEffect(() => {
    const last = lastFocusedRef.current;
    if (!isOpen || !last || last.el.isConnected) return;
    lastFocusedRef.current = null;
    const active = document.activeElement;
    if (active && active !== document.body && active !== last.el) return;
    const buttons = mainButtons();
    const fallback =
      buttons.find((btn) => btn.parentElement?.dataset.id === last.id) ??
      (last.index >= 0 ? buttons[Math.min(last.index, buttons.length - 1)] : undefined) ??
      panelRef.current?.querySelector<HTMLElement>("button") ??
      panelRef.current;
    fallback?.focus();
  });

  const summaryText =
    runningCount || needsYouCount
      ? [
          runningCount ? `${numFmt.format(runningCount)} ${labels.running}` : "",
          needsYouCount ? `${numFmt.format(needsYouCount)} ${needsYouWord}` : "",
        ]
          .filter(Boolean)
          .join(", ")
      : pausedCount
        ? `${numFmt.format(pausedCount)} ${labels.pausedCount}`
        : labels.idle;

  return (
    <>
      <style href="ui-running-now" precedence="default">
        {css}
      </style>
      <div
        ref={rootRef}
        className={["ui-rn", className].filter(Boolean).join(" ")}
        data-open={isOpen || undefined}
        data-align={align}
        data-both={(runningCount > 0 && needsYouCount > 0) || undefined}
        data-long={numFmt.format(runningCount).length + numFmt.format(needsYouCount).length > 4 || undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isOpen && event.target === triggerRef.current) setOpen(false);
        }}
        onBlur={(event) => {
          const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
          if (isOpen && related && !rootRef.current?.contains(related)) setOpen(false);
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          className="ui-rn__trigger"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`${labels.title}: ${summaryText}`}
          onClick={(event) => {
            setOpen(!isOpen);
            if (!isOpen && event.detail === 0) focusEdgeRow();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (!isOpen) setOpen(true);
              focusEdgeRow(event.key === "ArrowUp");
            }
          }}
        >
          {runningCount || needsYouCount ? (
            <>
              {runningCount > 0 && (
                <span className="ui-rn__part">
                  <span className="ui-rn__ring" aria-hidden="true" />
                  <SwapText className="ui-rn__n" value={numFmt.format(runningCount)} />
                  <span className="ui-rn__word">{labels.running}</span>
                </span>
              )}
              {runningCount > 0 && needsYouCount > 0 && (
                <span className="ui-rn__sep" aria-hidden="true">
                  ·
                </span>
              )}
              {needsYouCount > 0 && (
                <span className="ui-rn__part">
                  <span className="ui-rn__dot" aria-hidden="true" />
                  <SwapText className="ui-rn__n" value={numFmt.format(needsYouCount)} />
                  <span className="ui-rn__word">{needsYouWord}</span>
                </span>
              )}
            </>
          ) : pausedCount > 0 ? (
            <span className="ui-rn__part">
              <span className="ui-rn__ring" data-idle="" aria-hidden="true" />
              <SwapText className="ui-rn__n" value={numFmt.format(pausedCount)} />
              <span className="ui-rn__word">{labels.pausedCount}</span>
            </span>
          ) : (
            <span className="ui-rn__part">
              <span className="ui-rn__ring" data-idle="" aria-hidden="true" />
              <span className="ui-rn__word">{labels.idle}</span>
            </span>
          )}
          <ChevronDown />
        </button>

        <div
          ref={panelRef}
          id={panelId}
          className="ui-rn__panel"
          style={shiftX ? { translate: `${shiftX}px 0` } : undefined}
          role="dialog"
          aria-label={labels.title}
          tabIndex={-1}
          hidden={!isOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
              return;
            }
            const buttons = mainButtons();
            const targetEl = event.target instanceof Element ? event.target : null;
            const rowEl = targetEl?.closest(".ui-rn__row");
            const index = buttons.findIndex((btn) => btn.parentElement === rowEl);
            if (index < 0) return;
            const next =
              event.key === "ArrowDown"
                ? Math.min(buttons.length - 1, index + 1)
                : event.key === "ArrowUp"
                  ? Math.max(0, index - 1)
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? buttons.length - 1
                      : null;
            if (next !== null) {
              event.preventDefault();
              buttons[next]?.focus();
            }
          }}
          onFocus={(event) => {
            const targetEl = event.target instanceof HTMLElement ? event.target : null;
            if (!targetEl) return;
            const rowEl = targetEl.closest<HTMLElement>(".ui-rn__row");
            lastFocusedRef.current = {
              el: targetEl,
              id: rowEl?.dataset.id,
              index: rowEl ? mainButtons().findIndex((btn) => btn.parentElement === rowEl) : -1,
            };
          }}
        >
          <div className="ui-rn__head">
            <span className="ui-rn__label">{labels.title}</span>
            <span className="ui-rn__count">{numFmt.format(items.length)}</span>
          </div>
          <div className="ui-rn__body">
            {items.length > 0 ? (
              <ul ref={listRef} className="ui-rn__list">
                {items.map((item) => (
                  <RunningRow
                    key={item.id}
                    task={item}
                    labels={labels}
                    onPause={onPause}
                    onResume={onResume}
                    onOpen={onOpen}
                  />
                ))}
              </ul>
            ) : (
              <p className="ui-rn__empty">{labels.empty}</p>
            )}
          </div>
          {onOpenAll && (
            <div className="ui-rn__foot">
              <button type="button" className="ui-rn__all" onClick={onOpenAll}>
                <TasksGlyph />
                <span>{labels.openAll}</span>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        <span className="ui-rn__sr" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  );
}

function RunningRow({
  task,
  labels,
  onPause,
  onResume,
  onOpen,
}: {
  task: RunningTask;
  labels: RunningNowLabels;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const progress = taskProgress(task);
  const total = Math.max(0, safeNum(task.total));
  const done = task.state === "done" ? total : Math.min(total, Math.max(0, safeNum(task.done)));
  const rawStep = task.step ?? "";
  const stepText =
    task.state === "done"
      ? labels.done
      : task.state === "paused"
        ? rawStep
          ? `${labels.paused} · ${rawStep}`
          : labels.paused
        : rawStep;
  const stateLabel =
    task.state === "needs-you"
      ? labels.needsYouBadge
      : task.state === "paused"
        ? labels.paused
        : task.state === "done"
          ? labels.done
          : labels.running;
  const stepAria = task.state === "done" || !rawStep ? "" : `${rawStep}. `;
  const countAria = total > 0 ? `${numFmt.format(done)} of ${numFmt.format(total)} steps` : stateLabel;

  return (
    <li className="ui-rn__row" data-state={task.state} data-id={task.id}>
      <button
        type="button"
        className="ui-rn__main"
        aria-label={`${task.title} – ${stateLabel}. ${stepAria}${countAria}`}
        onClick={() => onOpen?.(task.id)}
      >
        <ProgressPie value={progress} color={ringColor(task, progress)} />
        <span className="ui-rn__text">
          <span className="ui-rn__title" dir="auto" title={task.title}>
            {task.title}
          </span>
          {stepText && <SwapText className="ui-rn__step" value={stepText} />}
        </span>
        {task.state === "needs-you" ? (
          <span className="ui-rn__badge">{labels.needsYouBadge}</span>
        ) : total > 0 ? (
          <span className="ui-rn__steps">
            {numFmt.format(done)}/{numFmt.format(total)}
          </span>
        ) : null}
      </button>
      <span className="ui-rn__act">
        {task.state === "needs-you" ? (
          <button
            type="button"
            className="ui-rn__btn ui-rn__btn--text"
            aria-label={`${labels.open} ${task.title} – ${labels.needsYouBadge.toLowerCase()}`}
            onClick={() => onOpen?.(task.id)}
          >
            {labels.open}
          </button>
        ) : task.state === "running" && onPause ? (
          <button
            type="button"
            className="ui-rn__btn"
            aria-label={`${labels.pause} ${task.title}`}
            title={labels.pause}
            onClick={() => onPause(task.id)}
          >
            <PauseGlyph />
          </button>
        ) : task.state === "paused" && onResume ? (
          <button
            type="button"
            className="ui-rn__btn"
            aria-label={`${labels.resume} ${task.title}`}
            title={labels.resume}
            onClick={() => onResume(task.id)}
          >
            <PlayGlyph />
          </button>
        ) : task.state === "done" ? (
          <span className="ui-rn__btn" aria-hidden="true">
            <CheckGlyph />
          </span>
        ) : null}
      </span>
    </li>
  );
}

function ProgressPie({ value, color }: { value: number; color: string }) {
  const circumference = 2 * Math.PI * 2;
  return (
    <svg className="ui-rn__mark" viewBox="0 0 14 14" width="14" height="14" aria-hidden="true" style={{ color }}>
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle
        className="ui-rn__pie"
        cx="7"
        cy="7"
        r={2}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        style={{ strokeDasharray: `${circumference * value} ${circumference}` }}
        transform="rotate(-90 7 7)"
      />
    </svg>
  );
}

function SwapText({ value, className }: { value: string; className?: string }) {
  const [entries, setEntries] = useState<{ k: number; v: string; fresh?: boolean; out?: boolean }[]>([
    { k: 0, v: value },
  ]);
  const prevRef = useRef(value);
  const seqRef = useRef(0);

  useEffect(() => {
    if (value === prevRef.current) return;
    prevRef.current = value;
    const key = ++seqRef.current;
    setEntries((prev) => [
      { k: key, v: value, fresh: true },
      ...prev
        .filter((entry) => !entry.out)
        .slice(0, 1)
        .map((entry) => ({ ...entry, out: true, fresh: false })),
    ]);
    const timer = setTimeout(() => setEntries((prev) => prev.filter((entry) => !entry.out)), 360);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span className={["ui-rn__swap", className].filter(Boolean).join(" ")}>
      {entries.map((entry) => (
        <span
          key={entry.k}
          data-out={entry.out || undefined}
          data-fresh={entry.fresh || undefined}
          aria-hidden={entry.out || undefined}
          dir="auto"
          title={entry.out ? undefined : entry.v}
        >
          {entry.v}
        </span>
      ))}
    </span>
  );
}

function PauseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7C4 5.59 4 4.88 4.44 4.44C4.88 4 5.59 4 7 4C8.41 4 9.12 4 9.56 4.44C10 4.88 10 5.59 10 7V17C10 18.41 10 19.12 9.56 19.56C9.12 20 8.41 20 7 20C5.59 20 4.88 20 4.44 19.56C4 19.12 4 18.41 4 17V7Z" />
      <path d="M14 7C14 5.59 14 4.88 14.44 4.44C14.88 4 15.59 4 17 4C18.41 4 19.12 4 19.56 4.44C20 4.88 20 5.59 20 7V17C20 18.41 20 19.12 19.56 19.56C19.12 20 18.41 20 17 20C15.59 20 14.88 20 14.44 19.56C14 19.12 14 18.41 14 17V7Z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18.89 12.85C18.54 14.19 16.87 15.14 13.53 17.04C10.3 18.87 8.68 19.79 7.38 19.42C6.84 19.27 6.35 18.98 5.96 18.58C5 17.61 5 15.74 5 12C5 8.26 5 6.39 5.96 5.42C6.35 5.02 6.84 4.73 7.38 4.58C8.68 4.21 10.3 5.13 13.53 6.96C16.87 8.86 18.54 9.81 18.89 11.15C19.04 11.71 19.04 12.29 18.89 12.85Z" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 14L8.5 17.5L19 6.5" />
    </svg>
  );
}

function TasksGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 2H8.5C7.67 2 7 2.67 7 3.5C7 4.33 7.67 5 8.5 5H13.5C14.33 5 15 4.33 15 3.5C15 2.67 14.33 2 13.5 2Z" />
      <path d="M7 15H10.43M7 11H15" />
      <path d="M19 13.5V9.48C19 6.65 19 5.24 18.12 4.36C17.48 3.72 16.55 3.55 15 3.5M12 22L9 22C6.17 22 4.76 22 3.88 21.12C3 20.24 3 18.83 3 16L3 9.48C3 6.65 3 5.24 3.88 4.36C4.52 3.72 5.44 3.55 7 3.5" />
      <path d="M14 20C14 20 15 20 16 22C16 22 18.17 17 21 16" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      className="ui-rn__chev"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 9C18 9 13.58 15 12 15C10.42 15 6 9 6 9" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className="ui-rn__chev"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6C9 6 15 10.42 15 12C15 13.58 9 18 9 18" />
    </svg>
  );
}

const css = /* css */ `
.ui-rn {
  --ui-rn-card: #ffffff;
  --ui-rn-strong: #171717;
  --ui-rn-ink: #171717;
  --ui-rn-text: #404040;
  --ui-rn-muted: #737373;
  --ui-rn-faint: #b5b5b5;
  --ui-rn-icon: #737373;
  --ui-rn-line: #e5e5e5;
  --ui-rn-hover: #f5f5f5;
  --ui-rn-press: #ededed;
  --ui-rn-focus: #2f6bff;
  --ui-rn-teal: #13b3a0;
  --ui-rn-amber: #e8b000;
  --ui-rn-orange: #f28a2e;
  --ui-rn-blue: #0190fe;
  --ui-rn-badge: #8f6c00;
  --ui-rn-badge-wash: color-mix(in srgb, #e8b000 14%, transparent);
  --ui-rn-shadow: 0 0 0 1px var(--ui-rn-line), 0 1px 2px rgba(0, 0, 0, 0.06);
  --ui-rn-pop: 0 0 0 1px var(--ui-rn-line), 0 12px 28px -10px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-rn-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-rn-w: 348px;
  --ui-rn-row: 56px;
  position: relative;
  display: inline-block;
  flex: none;
  box-sizing: border-box;
  max-width: 100%;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--ui-rn-ink);
  text-align: start;
  -webkit-font-smoothing: antialiased;
}
.ui-rn *,
.ui-rn *::before,
.ui-rn *::after {
  box-sizing: border-box;
}
:where(.ui-rn) button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ui-rn button:focus-visible {
  outline: 2px solid var(--ui-rn-focus);
  outline-offset: 2px;
}
.ui-rn :is(p, ul) {
  margin: 0;
  padding: 0;
  list-style: none;
}
.ui-rn svg {
  display: block;
  flex: none;
}
.ui-rn__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-rn__trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  height: 32px;
  padding: 0 10px 0 11px;
  border-radius: 8px;
  background: var(--ui-rn-card);
  box-shadow: var(--ui-rn-shadow);
  font-size: 13px;
  line-height: 18px;
  color: var(--ui-rn-text);
  white-space: nowrap;
  transition: background-color 140ms ease;
}
.ui-rn__trigger:hover {
  background: var(--ui-rn-hover);
}
.ui-rn__part {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
}
.ui-rn__n {
  flex: none;
  font-weight: 500;
  color: var(--ui-rn-ink);
  font-variant-numeric: tabular-nums;
}
.ui-rn__sep {
  flex: none;
  color: var(--ui-rn-faint);
}
.ui-rn__ring {
  flex: none;
  width: 8px;
  height: 8px;
  margin-right: 2px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--ui-rn-teal);
}
.ui-rn__ring[data-idle] {
  box-shadow: inset 0 0 0 1.5px var(--ui-rn-faint);
}
.ui-rn__dot {
  flex: none;
  width: 6px;
  height: 6px;
  margin: 0 3px 0 1px;
  border-radius: 50%;
  background: var(--ui-rn-amber);
}
.ui-rn__trigger > .ui-rn__chev {
  width: 13px;
  height: 13px;
  margin-left: -2px;
  color: var(--ui-rn-icon);
  transition: rotate 200ms var(--ui-rn-ease);
}
.ui-rn[data-open] .ui-rn__trigger > .ui-rn__chev {
  rotate: 180deg;
}
.ui-rn__panel {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  z-index: 50;
  width: min(var(--ui-rn-w), calc(100vw - 32px));
  padding: 5px;
  border-radius: 14px;
  background: var(--ui-rn-card);
  box-shadow: var(--ui-rn-pop);
  transform-origin: top right;
  animation: ui-rn-pop 180ms var(--ui-rn-ease) both;
}
.ui-rn[data-align="start"] .ui-rn__panel {
  inset-inline: 0 auto;
  transform-origin: top left;
}
.ui-rn:dir(rtl) .ui-rn__panel {
  transform-origin: top left;
}
.ui-rn[data-align="start"]:dir(rtl) .ui-rn__panel {
  transform-origin: top right;
}
.ui-rn__panel[hidden] {
  display: none;
}
.ui-rn__panel:focus {
  outline: none;
}
.ui-rn__head {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
}
.ui-rn__label {
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--ui-rn-muted);
}
.ui-rn__count {
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-rn-faint);
  font-variant-numeric: tabular-nums;
}
.ui-rn__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.ui-rn__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  max-height: min(calc(var(--ui-rn-row) * 5.5), max(calc(var(--ui-rn-row) * 2.5), calc(100dvh - 200px)));
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.ui-rn__empty {
  padding: 14px 8px 16px;
  font-size: 13px;
  line-height: 18px;
  color: var(--ui-rn-muted);
}
.ui-rn__row {
  position: relative;
  display: flex;
  align-items: center;
  flex: none;
  height: var(--ui-rn-row);
  border-radius: 8px;
  transition: background-color 140ms ease;
}
.ui-rn__row:hover {
  background: var(--ui-rn-hover);
}
.ui-rn__main {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
  height: 100%;
  padding: 0 6px 0 10px;
  border-radius: 8px;
}
.ui-rn__main:focus-visible {
  background: var(--ui-rn-hover);
  outline: 2px solid var(--ui-rn-focus);
  outline-offset: -2px;
}
.ui-rn__mark {
  flex: none;
  transition: color 400ms ease;
}
.ui-rn__pie {
  transition: stroke-dasharray 700ms var(--ui-rn-ease);
}
.ui-rn__text {
  display: grid;
  flex: 1;
  min-width: 0;
}
.ui-rn__title {
  overflow: hidden;
  font-weight: 500;
  color: var(--ui-rn-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-rn__step {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-rn-muted);
}
.ui-rn__row[data-state="done"] .ui-rn__title {
  color: var(--ui-rn-text);
}
.ui-rn__steps {
  flex: none;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-rn-muted);
  font-variant-numeric: tabular-nums;
}
.ui-rn__badge {
  flex: none;
  height: 20px;
  padding: 0 7px;
  border-radius: 6px;
  background: var(--ui-rn-badge-wash);
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-rn-badge);
  white-space: nowrap;
  animation: ui-rn-in 260ms var(--ui-rn-ease) both;
}
.ui-rn__act {
  display: flex;
  flex: none;
  justify-content: flex-end;
  min-width: 42px;
  padding-right: 6px;
}
.ui-rn__btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: var(--ui-rn-icon);
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-rn__btn svg {
  width: 14px;
  height: 14px;
}
button.ui-rn__btn:hover {
  background: var(--ui-rn-press);
  color: var(--ui-rn-ink);
}
span.ui-rn__btn {
  color: var(--ui-rn-blue);
}
.ui-rn__btn--text {
  width: auto;
  padding: 0 9px;
  background: var(--ui-rn-card);
  box-shadow: var(--ui-rn-shadow);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-rn-ink);
  animation: ui-rn-in 260ms var(--ui-rn-ease) both;
}
button.ui-rn__btn--text:hover {
  background: var(--ui-rn-hover);
}
.ui-rn__swap {
  display: inline-grid;
  min-width: 0;
  overflow: hidden;
}
.ui-rn__swap > * {
  grid-area: 1 / 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-rn__swap > [data-fresh] {
  animation: ui-rn-swap-in 340ms var(--ui-rn-ease) both;
}
.ui-rn__swap > [data-out] {
  animation: ui-rn-swap-out 340ms var(--ui-rn-ease) both;
}
.ui-rn__foot {
  margin: 5px -5px -5px;
  padding: 5px;
  border-top: 1px solid var(--ui-rn-line);
}
.ui-rn__all {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 34px;
  padding: 0 8px 0 10px;
  border-radius: 8px;
  color: var(--ui-rn-ink);
  transition: background-color 140ms ease;
}
.ui-rn__all:hover {
  background: var(--ui-rn-hover);
}
.ui-rn__all > svg:first-child {
  width: 15px;
  height: 15px;
  color: var(--ui-rn-icon);
}
.ui-rn__all > span {
  flex: 1;
}
.ui-rn__all > .ui-rn__chev {
  width: 13px;
  height: 13px;
  color: var(--ui-rn-icon);
  transition: translate 200ms var(--ui-rn-ease);
}
.ui-rn__all:hover > .ui-rn__chev {
  translate: 2px 0;
}
.ui-rn:dir(rtl) .ui-rn__all > .ui-rn__chev {
  scale: -1 1;
}
.ui-rn:dir(rtl) .ui-rn__all:hover > .ui-rn__chev {
  translate: -2px 0;
}
@keyframes ui-rn-pop {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
@keyframes ui-rn-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
}
@keyframes ui-rn-swap-in {
  from {
    opacity: 0;
    transform: translateY(60%);
  }
}
@keyframes ui-rn-swap-out {
  to {
    opacity: 0;
    transform: translateY(-60%);
  }
}
@container (max-width: 359px) {
  .ui-rn[data-both] .ui-rn__word {
    display: none;
  }
}
@container (max-width: 419px) {
  .ui-rn[data-both][data-long] .ui-rn__word {
    display: none;
  }
}
@media (hover: none) and (pointer: coarse) {
  .ui-rn__trigger {
    height: 38px;
  }
  .ui-rn {
    --ui-rn-row: 60px;
  }
  .ui-rn__btn {
    width: 38px;
    height: 38px;
  }
  .ui-rn__btn--text {
    width: auto;
  }
  .ui-rn__all {
    height: 42px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-rn *,
  .ui-rn *::before,
  .ui-rn *::after {
    animation: none !important;
    transition: none !important;
  }
  .ui-rn__swap > [data-out] {
    visibility: hidden;
  }
}
:where(.dark, [data-theme="dark"]) .ui-rn {
  --ui-rn-card: #232326;
  --ui-rn-strong: #ffffff;
  --ui-rn-ink: #ededed;
  --ui-rn-text: #c4c4c4;
  --ui-rn-muted: #8f8f8f;
  --ui-rn-faint: #6b6b70;
  --ui-rn-icon: #8f8f8f;
  --ui-rn-line: rgba(255, 255, 255, 0.1);
  --ui-rn-hover: #2a2a2d;
  --ui-rn-press: #323236;
  --ui-rn-focus: #6b95ff;
  --ui-rn-teal: #4fc3b4;
  --ui-rn-amber: #e6c24d;
  --ui-rn-orange: #f2a15c;
  --ui-rn-blue: #4fb0fe;
  --ui-rn-badge: #e6c24d;
  --ui-rn-badge-wash: color-mix(in srgb, #e6c24d 16%, transparent);
  --ui-rn-shadow: 0 0 0 1px var(--ui-rn-line), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-rn-pop: 0 0 0 1px var(--ui-rn-line), 0 16px 32px -12px rgba(0, 0, 0, 0.7);
}
`;
