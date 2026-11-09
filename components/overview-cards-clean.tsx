"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/*
 * overview-cards (Clean) – a self-contained React 19 component.
 * Inline SVGs and scoped styles are included; no other local files or packages are required.
 * Maintained in scripts/chat-rail; run npm run generate after changes.
 */

function safeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
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
      strokeWidth="1.25"
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
      className="ui-ovcc__file"
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
    <div className={["ui-ovcc", className].filter(Boolean).join(" ")}>
      <style href="ui-overview-cards-clean" precedence="default">
        {css}
      </style>
      <div className="ui-ovcc__grid">
        <section ref={card} className="ui-ovcc__card ui-ovcc__card--activity" aria-labelledby={`${id}-activity`}>
          <h2 className="ui-ovcc__head" id={`${id}-activity`}>
            <OverviewGlyph name="calendar" />
            {labels.activity}
          </h2>
          <div
            ref={heat}
            className="ui-ovcc__heat"
            role="img"
            tabIndex={0}
            aria-label={labels.heat(total, weeks)}
            data-hovering={tip ? "" : undefined}
            style={{ "--ui-ovcc-weeks": weeks } as CSSProperties}
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
              <span className="ui-ovcc__week" key={week}>
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
          <span className="ui-ovcc__sr" aria-live="polite">
            {tip ? describe(tip.index) : ""}
          </span>
          {tip && (
            <span
              className="ui-ovcc__tip"
              aria-hidden="true"
              style={{ "--ui-ovcc-tip-x": `${tip.x}px`, "--ui-ovcc-tip-y": `${tip.y}px` } as CSSProperties}
            >
              <b>{labels.chats(activity[tip.index] ?? 0)}</b> · {labels.day(dateAt(tip.index))}
            </span>
          )}
          <p className="ui-ovcc__foot">
            <span>{labels.summary(total, fileCount, automationCount)}</span>
            {activity.length > 0 && (
              <span className="ui-ovcc__muted">
                {labels.monthName(dateAt(0))} – {labels.monthName(end)}
              </span>
            )}
          </p>
        </section>
        <section className="ui-ovcc__card ui-ovcc__card--recent" aria-labelledby={`${id}-recent`}>
          <div className="ui-ovcc__top">
            <h2 className="ui-ovcc__head" id={`${id}-recent`}>
              <OverviewGlyph name="clock" />
              {labels.recent}
            </h2>
            {recentMore > 0 && (
              <button type="button" className="ui-ovcc__more" onClick={() => onNavigate?.("Chat")}>
                {labels.more(recentMore)}
              </button>
            )}
          </div>
          <ul className="ui-ovcc__list">
            {recent.map((chat) => (
              <li key={chat.id ?? chat.title}>
                <button type="button" className="ui-ovcc__row" onClick={() => openChat(chat)}>
                  <span className="ui-ovcc__mark" aria-hidden="true">
                    <OverviewGlyph name="chat" size={12} />
                  </span>
                  <span className="ui-ovcc__title" dir="auto" title={chat.title}>
                    {chat.title}
                  </span>
                  <span className="ui-ovcc__meta">{chat.at}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="ui-ovcc__card ui-ovcc__card--usage" aria-labelledby={`${id}-usage`}>
          <h2 className="ui-ovcc__head" id={`${id}-usage`}>
            <OverviewGlyph name="usage" />
            {labels.usage}
          </h2>
          <p className="ui-ovcc__big">
            {usedText} <span className="ui-ovcc__muted">{limitText}</span>
          </p>
          <span
            className="ui-ovcc__meter"
            role="meter"
            aria-label={labels.meter}
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={Math.min(used, limit)}
            aria-valuetext={labels.meterText(used, limit, over)}
            data-over={over ? "" : undefined}
          >
            <i style={{ "--ui-ovcc-share": share } as CSSProperties} />
          </span>
          {(usage.resets || over) && (
            <p className="ui-ovcc__muted ui-ovcc__small">{labels.resets(usage.resets ?? "", over)}</p>
          )}
        </section>
        <section className="ui-ovcc__card ui-ovcc__card--files" aria-labelledby={`${id}-files`}>
          <div className="ui-ovcc__top">
            <h2 className="ui-ovcc__head" id={`${id}-files`}>
              <OverviewGlyph name="note" />
              {labels.files}
            </h2>
            {filesMore > 0 && (
              <button type="button" className="ui-ovcc__more" onClick={() => onNavigate?.("Folders")}>
                {labels.more(filesMore)}
              </button>
            )}
          </div>
          <ul className="ui-ovcc__list">
            {files.map((file) => {
              const [base, extension] = splitFileName(file.name);
              return (
                <li key={file.id ?? file.name}>
                  <button type="button" className="ui-ovcc__row" onClick={() => openFile(file)}>
                    <span className="ui-ovcc__mark ui-ovcc__mark--file" aria-hidden="true">
                      <OverviewFileGlyph name={file.name} />
                    </span>
                    <span
                      className="ui-ovcc__title ui-ovcc__title--file"
                      dir="auto"
                      title={file.where ? `${file.name} · ${file.where}` : file.name}
                    >
                      <span>{base}</span>
                      {extension}
                    </span>
                    <span className="ui-ovcc__meta">{file.at}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="ui-ovcc__card ui-ovcc__card--month" aria-labelledby={`${id}-month`}>
          <h2 className="ui-ovcc__head" id={`${id}-month`}>
            <OverviewGlyph name="calendar" />
            {labels.monthTitle}
          </h2>
          <dl className="ui-ovcc__stats">
            {month.map((stat) => (
              <div key={stat.label}>
                <dt title={stat.label}>{stat.label}</dt>
                <dd>
                  <span className="ui-ovcc__stat">{overviewNumber.format(safeNumber(stat.value, 0))}</span>
                  {stat.delta !== undefined && (
                    <span
                      className="ui-ovcc__delta"
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

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-ovcc {
  --ui-ovcc-card: #fff;
  --ui-ovcc-ink: rgba(0, 0, 0, 0.88);
  --ui-ovcc-text: rgba(0, 0, 0, 0.61);
  --ui-ovcc-muted: rgba(0, 0, 0, 0.45);
  --ui-ovcc-line: rgba(0, 0, 0, 0.06);
  --ui-ovcc-chip: rgba(0, 0, 0, 0.04);
  --ui-ovcc-hover: rgba(0, 0, 0, 0.03);
  --ui-ovcc-blue: #0190fe;
  --ui-ovcc-doc: #0190fe;
  --ui-ovcc-sheet: #5fc88a;
  --ui-ovcc-up: #1f8a3e;
  --ui-ovcc-down: #c2331f;
  --ui-ovcc-focus: rgba(0, 96, 226, 0.7);
  width: 100%;
  container: ui-ovcc / inline-size;
  color: var(--ui-ovcc-text);
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
.ui-ovcc,
.ui-ovcc *,
.ui-ovcc *::before,
.ui-ovcc *::after {
  box-sizing: border-box;
}
.ui-ovcc button {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.ui-ovcc svg {
  display: block;
  flex: none;
}
.ui-ovcc h2,
.ui-ovcc p {
  margin: 0;
}
.ui-ovcc button:focus-visible {
  outline: 2px solid var(--ui-ovcc-focus);
  outline-offset: 2px;
  border-radius: 6px;
}
.ui-ovcc__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
}
.ui-ovcc__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--ui-ovcc-line);
  border-radius: 12px;
  background: var(--ui-ovcc-card);
  text-align: left;
}
.ui-ovcc__card--activity,
.ui-ovcc__card--recent,
.ui-ovcc__card--files {
  grid-column: span 2;
}
.ui-ovcc__head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-ovcc-ink);
  white-space: nowrap;
}
.ui-ovcc__head svg {
  color: var(--ui-ovcc-muted);
}
.ui-ovcc__muted {
  color: var(--ui-ovcc-muted);
}
.ui-ovcc__small {
  font-size: 11.5px;
  line-height: 16px;
}
.ui-ovcc__foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: auto 0 0 !important;
  font-size: 11.5px;
  line-height: 16px;
  color: var(--ui-ovcc-text);
  font-variant-numeric: tabular-nums;
}
.ui-ovcc__foot > span:first-child {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovcc__foot > span:last-child {
  flex: none;
}
.ui-ovcc__heat {
  display: grid;
  grid-template-columns: repeat(var(--ui-ovcc-weeks), minmax(0, 1fr));
  gap: 2px;
  border-radius: 4px;
  touch-action: pan-y;
}
.ui-ovcc__heat:focus {
  outline: none;
}
.ui-ovcc__heat:focus-visible {
  outline: 2px solid var(--ui-ovcc-focus);
  outline-offset: 2px;
}
.ui-ovcc__week {
  display: grid;
  grid-template-rows: repeat(7, auto);
  gap: 2px;
}
.ui-ovcc__heat i {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--ui-ovcc-chip);
}
.ui-ovcc__heat i[data-empty] {
  visibility: hidden;
}
.ui-ovcc__heat i[data-level="1"] {
  background: color-mix(in srgb, var(--ui-ovcc-blue) 22%, var(--ui-ovcc-card));
}
.ui-ovcc__heat i[data-level="2"] {
  background: color-mix(in srgb, var(--ui-ovcc-blue) 45%, var(--ui-ovcc-card));
}
.ui-ovcc__heat i[data-level="3"] {
  background: color-mix(in srgb, var(--ui-ovcc-blue) 70%, var(--ui-ovcc-card));
}
.ui-ovcc__heat i[data-level="4"] {
  background: var(--ui-ovcc-blue);
}
.ui-ovcc__heat i[data-on] {
  box-shadow:
    0 0 0 1.5px var(--ui-ovcc-card),
    0 0 0 2.5px var(--ui-ovcc-ink);
}
.ui-ovcc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.ui-ovcc__tip {
  position: absolute;
  z-index: 2;
  top: var(--ui-ovcc-tip-y);
  left: clamp(70px, var(--ui-ovcc-tip-x), calc(100% - 70px));
  translate: -50% calc(-100% - 6px);
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--ui-ovcc-ink);
  color: var(--ui-ovcc-card);
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.25);
}
.ui-ovcc__tip b {
  font-weight: 500;
}
.ui-ovcc__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.ui-ovcc__list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  margin: 0 -6px;
  padding: 0;
  list-style: none;
}
.ui-ovcc__row {
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
.ui-ovcc__row:hover {
  background: var(--ui-ovcc-hover) !important;
}
.ui-ovcc__mark {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: var(--ui-ovcc-chip);
  color: var(--ui-ovcc-muted);
}
.ui-ovcc__file {
  color: var(--ui-ovcc-doc);
}
.ui-ovcc__file[data-type="sheet"] {
  color: var(--ui-ovcc-sheet);
}
.ui-ovcc__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--ui-ovcc-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovcc__title--file {
  display: flex;
}
.ui-ovcc__title--file > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-ovcc__meta {
  flex: none;
  font-size: 11px;
  line-height: 15px;
  color: var(--ui-ovcc-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-ovcc__more {
  flex: none;
  margin: -2px -6px -2px 0 !important;
  padding: 2px 6px !important;
  border-radius: 6px;
  font-size: 11.5px !important;
  line-height: 16px !important;
  color: var(--ui-ovcc-text) !important;
  white-space: nowrap;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}
.ui-ovcc__more:hover {
  background: var(--ui-ovcc-hover) !important;
  color: var(--ui-ovcc-ink) !important;
}
.ui-ovcc__big {
  margin: auto 0 0 !important;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.01em;
  color: var(--ui-ovcc-ink);
  font-variant-numeric: tabular-nums;
}
.ui-ovcc__big .ui-ovcc__muted {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
}
.ui-ovcc__meter {
  display: block;
  height: 4px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-ovcc-chip);
}
.ui-ovcc__meter i {
  display: block;
  width: calc(var(--ui-ovcc-share) * 100%);
  height: 100%;
  border-radius: inherit;
  background: var(--ui-ovcc-blue);
}
.ui-ovcc__meter[data-over] i {
  background: var(--ui-ovcc-down);
}
.ui-ovcc__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: auto 0 0;
}
.ui-ovcc__stats > div {
  min-width: 0;
}
.ui-ovcc__stats dt {
  overflow: hidden;
  font-size: 11.5px;
  line-height: 16px;
  color: var(--ui-ovcc-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-ovcc__stats dd {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 6px;
  margin: 2px 0 0;
}
.ui-ovcc__stat {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: var(--ui-ovcc-ink);
  font-variant-numeric: tabular-nums;
}
.ui-ovcc__delta {
  font-size: 11px;
  line-height: 16px;
  color: var(--ui-ovcc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-ovcc__delta[data-dir="up"] {
  color: var(--ui-ovcc-up);
}
.ui-ovcc__delta[data-dir="down"] {
  color: var(--ui-ovcc-down);
}
@media (pointer: coarse) {
  .ui-ovcc__row {
    min-height: 40px;
  }
  .ui-ovcc__more {
    min-height: 32px;
    margin-block: -8px !important;
  }
}
@container ui-ovcc (max-width:640px) {
  .ui-ovcc__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .ui-ovcc__card--files {
    order: 1;
  }
}
@container ui-ovcc (max-width:420px) {
  .ui-ovcc__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .ui-ovcc__card--activity,
  .ui-ovcc__card--recent,
  .ui-ovcc__card--files {
    grid-column: auto;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-ovcc * {
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-ovcc {
  --ui-ovcc-card: #1c1c1e;
  --ui-ovcc-ink: rgba(255, 255, 255, 0.9);
  --ui-ovcc-text: rgba(255, 255, 255, 0.62);
  --ui-ovcc-muted: rgba(255, 255, 255, 0.45);
  --ui-ovcc-line: rgba(255, 255, 255, 0.08);
  --ui-ovcc-chip: rgba(255, 255, 255, 0.06);
  --ui-ovcc-hover: rgba(255, 255, 255, 0.05);
  --ui-ovcc-doc: #4fb0fe;
  --ui-ovcc-sheet: #7dcf9f;
  --ui-ovcc-up: #5fd38a;
  --ui-ovcc-down: #ff977d;
  --ui-ovcc-focus: rgba(77, 141, 255, 0.8);
}

`;
