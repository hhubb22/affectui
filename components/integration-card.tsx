"use client";

import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

/*
 * integration-card (Classic) – a self-contained React 19 component.
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

function initials(name: string) {
  return String(name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  official?: boolean;
  icon?: ReactNode;
  background?: string;
};
export type IntegrationCardProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  integration: Integration;
  connected?: boolean;
  defaultConnected?: boolean;
  onConnectedChange?: (connected: boolean) => void;
  busy?: boolean;
  disabled?: boolean;
  error?: string;
};

function IntegrationLogo({ integration }: { integration: Integration }) {
  return (
    <span
      className="ui-icd__logo"
      aria-hidden="true"
      style={integration.background ? { background: integration.background, boxShadow: "none" } : undefined}
      onErrorCapture={(event) => {
        if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
      }}
    >
      {integration.icon ?? initials(integration.name)}
    </span>
  );
}

/** One service, its official badge, and a connect/disconnect action. No network calls. */
export function IntegrationCard({
  integration,
  connected: connectedProp,
  defaultConnected = false,
  onConnectedChange,
  busy = false,
  disabled = false,
  error,
  className,
  ...rest
}: IntegrationCardProps) {
  const [connected, setConnected] = useControllable(connectedProp, defaultConnected, onConnectedChange);
  const id = useId();
  return (
    <div {...rest} className={["ui-icd", className].filter(Boolean).join(" ")}>
      <style href="ui-integration-card" precedence="default">
        {css}
      </style>
      <IntegrationLogo integration={integration} />
      <span className="ui-icd__text">
        <span className="ui-icd__name">
          <span title={integration.name}>{integration.name}</span>
          {integration.official && (
            <span className="ui-icd__badge" title="Official" aria-label="Official integration">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 2 3 2 4 .5.5 4 2.5 3.5-2.5 3.5-.5 4-4 .5-3 2-3-2-4-.5-.5-4L2 12l2.5-3.5.5-4L9 4Z" />
                <path d="m8.5 12 2 2 5-5" />
              </svg>
            </span>
          )}
        </span>
        <span className="ui-icd__description" title={integration.description}>
          {integration.description}
        </span>
        {error && (
          <span className="ui-icd__error" role="alert" id={`${id}-error`}>
            {error}
          </span>
        )}
      </span>
      <button
        type="button"
        className="ui-icd__action"
        data-state={busy ? "busy" : connected ? "on" : "off"}
        aria-label={`${connected ? "Disconnect" : "Connect"} ${integration.name}`}
        aria-busy={busy || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        title={busy ? "Connecting…" : connected ? "Connected – click to disconnect" : "Connect"}
        disabled={disabled || busy}
        onClick={() => setConnected(!connected)}
      >
        {busy ? (
          <span className="ui-icd__spinner" />
        ) : (
          <span key={String(connected)} className="ui-icd__glyph">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={connected ? "M5 14L8.5 17.5L19 6.5" : "M12 4V20M20 12H4"} />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-icd {
  --ui-icd-card: #fff;
  --ui-icd-ink: rgba(0, 0, 0, 0.88);
  --ui-icd-text: rgba(0, 0, 0, 0.61);
  --ui-icd-muted: rgba(0, 0, 0, 0.45);
  --ui-icd-faint: rgba(0, 0, 0, 0.27);
  --ui-icd-line: rgba(0, 0, 0, 0.06);
  --ui-icd-hover: #fafafa;
  --ui-icd-focus: rgba(0, 96, 226, 0.7);
  --ui-icd-danger: #e5484d;
  --ui-icd-shadow: 0 0 0 0.5px var(--ui-icd-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-icd-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 58px;
  padding: 9px 8px;
  margin-inline: -8px;
  border-radius: 12px;
  color: var(--ui-icd-ink);
  font:
    400 13px/18px Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 140ms;
}
.ui-icd,
.ui-icd *,
.ui-icd *::before,
.ui-icd *::after {
  box-sizing: border-box;
}
.ui-icd__logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--ui-icd-card, #fff);
  box-shadow: var(--ui-icd-shadow, 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.05));
  color: var(--ui-icd-text, rgba(0, 0, 0, 0.61));
  font-size: 11px;
  font-weight: 500;
}
.ui-icd__logo svg,
.ui-icd__logo img {
  display: block;
  width: 17px;
  height: 17px;
  object-fit: contain;
}
.ui-icd__text {
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.ui-icd__name {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
}
.ui-icd__name > span:first-child {
  overflow: hidden;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-icd__badge {
  display: grid;
  flex: none;
  color: var(--ui-icd-faint);
}
.ui-icd__description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-icd-muted);
}
.ui-icd__error {
  font-size: 12px;
  color: var(--ui-icd-danger);
  overflow-wrap: anywhere;
}
.ui-icd .ui-icd__action {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--ui-icd-card);
  box-shadow: var(--ui-icd-shadow);
  color: var(--ui-icd-text);
  cursor: pointer;
  transition:
    box-shadow 140ms,
    background-color 160ms,
    color 160ms;
}
.ui-icd__action[data-state="on"] {
  background: var(--ui-icd-ink);
  box-shadow: none;
  color: var(--ui-icd-card);
}
.ui-icd__action:disabled {
  cursor: default;
}
.ui-icd__action:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-icd__action:focus-visible {
  outline: 2px solid var(--ui-icd-focus);
  outline-offset: 2px;
}
.ui-icd__glyph {
  display: grid;
  animation: ui-icd-pop 260ms var(--ui-icd-ease);
}
.ui-icd__spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--ui-icd-line);
  border-top-color: var(--ui-icd-ink);
  border-radius: 50%;
  animation: ui-icd-spin 700ms linear infinite;
}
@media (hover: hover) and (pointer: fine) {
  .ui-icd:hover {
    background: var(--ui-icd-hover);
  }
  .ui-icd__action:hover:not(:disabled) {
    box-shadow:
      0 0 0 1px var(--ui-icd-line),
      0 1px 2px rgba(0, 0, 0, 0.05);
    color: var(--ui-icd-ink);
  }
  .ui-icd__action[data-state="on"]:hover {
    background: color-mix(in srgb, var(--ui-icd-ink) 86%, var(--ui-icd-card));
    color: var(--ui-icd-card);
  }
}
@keyframes ui-icd-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes ui-icd-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (pointer: coarse) {
  .ui-icd .ui-icd__action {
    width: 32px;
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-icd,
  .ui-icd * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-icd {
  --ui-icd-card: #1c1c1e;
  --ui-icd-ink: rgba(255, 255, 255, 0.9);
  --ui-icd-text: rgba(255, 255, 255, 0.62);
  --ui-icd-muted: rgba(255, 255, 255, 0.45);
  --ui-icd-faint: rgba(255, 255, 255, 0.28);
  --ui-icd-line: rgba(255, 255, 255, 0.1);
  --ui-icd-hover: #202023;
  --ui-icd-focus: #4d8dff;
  --ui-icd-danger: #ff6369;
  --ui-icd-shadow: 0 0 0 0.5px var(--ui-icd-line), 0 1px 2px rgba(0, 0, 0, 0.4);
}
.ui-icd {
  --ui-icd-ink: #171717;
  --ui-icd-text: #404040;
  --ui-icd-muted: #737373;
  --ui-icd-faint: #b5b5b5;
  --ui-icd-line: #e5e5e5;
  --ui-icd-focus: #2f6bff;
  --ui-icd-shadow: 0 0 0 1px var(--ui-icd-line), 0 1px 2px rgba(0, 0, 0, 0.06);
}
.ui-icd .ui-icd__action {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}
:where(.dark, [data-theme="dark"]) .ui-icd {
  --ui-icd-card: #232326;
  --ui-icd-ink: #ededed;
  --ui-icd-text: #c4c4c4;
  --ui-icd-muted: #8f8f8f;
  --ui-icd-line: rgba(255, 255, 255, 0.1);
  --ui-icd-focus: #6b95ff;
}

`;
