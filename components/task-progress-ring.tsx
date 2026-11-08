"use client";

import {} from "react";

/*
 * task-progress-ring (Classic) – a self-contained React 19 component.
 * Inline SVGs and scoped styles are included; no other local files or packages are required.
 * Maintained in scripts/chat-rail; run npm run generate after changes.
 */

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
      <style href="ui-task-progress-ring" precedence="default">
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
.ui-tpr {
  --ui-tpr-muted: #b5b5b5;
}

`;
