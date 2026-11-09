"use client";

import { useId, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

/*
 * integration-card (Clean) – a self-contained React 19 component.
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
      className="ui-icdc__logo"
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
    <div {...rest} className={["ui-icdc", className].filter(Boolean).join(" ")}>
      <style href="ui-integration-card-clean" precedence="default">
        {css}
      </style>
      <IntegrationLogo integration={integration} />
      <span className="ui-icdc__text">
        <span className="ui-icdc__name">
          <span title={integration.name}>{integration.name}</span>
          {integration.official && (
            <span className="ui-icdc__badge" title="Official" aria-label="Official integration">
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
        <span className="ui-icdc__description" title={integration.description}>
          {integration.description}
        </span>
        {error && (
          <span className="ui-icdc__error" role="alert" id={`${id}-error`}>
            {error}
          </span>
        )}
      </span>
      <button
        type="button"
        className="ui-icdc__action"
        data-state={busy ? "busy" : connected ? "on" : "off"}
        aria-label={`${connected ? "Disconnect" : "Connect"} ${integration.name}`}
        aria-busy={busy || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        title={busy ? "Connecting…" : connected ? "Connected – click to disconnect" : "Connect"}
        disabled={disabled || busy}
        onClick={() => setConnected(!connected)}
      >
        {busy ? (
          <span className="ui-icdc__spinner" />
        ) : (
          <span key={String(connected)} className="ui-icdc__glyph">
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
.ui-icdc {
  --ui-icdc-card: #fff;
  --ui-icdc-ink: rgba(0, 0, 0, 0.88);
  --ui-icdc-text: rgba(0, 0, 0, 0.61);
  --ui-icdc-muted: rgba(0, 0, 0, 0.45);
  --ui-icdc-faint: rgba(0, 0, 0, 0.27);
  --ui-icdc-line: rgba(0, 0, 0, 0.06);
  --ui-icdc-hover: #fafafa;
  --ui-icdc-focus: rgba(0, 96, 226, 0.7);
  --ui-icdc-danger: #e5484d;
  --ui-icdc-shadow: 0 0 0 0.5px var(--ui-icdc-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-icdc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 58px;
  padding: 9px 8px;
  margin-inline: -8px;
  border-radius: 12px;
  color: var(--ui-icdc-ink);
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
.ui-icdc,
.ui-icdc *,
.ui-icdc *::before,
.ui-icdc *::after {
  box-sizing: border-box;
}
.ui-icdc__logo {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--ui-icdc-card, #fff);
  box-shadow: var(--ui-icdc-shadow, 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.05));
  color: var(--ui-icdc-text, rgba(0, 0, 0, 0.61));
  font-size: 11px;
  font-weight: 500;
}
.ui-icdc__logo svg,
.ui-icdc__logo img {
  display: block;
  width: 17px;
  height: 17px;
  object-fit: contain;
}
.ui-icdc__text {
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.ui-icdc__name {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
}
.ui-icdc__name > span:first-child {
  overflow: hidden;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-icdc__badge {
  display: grid;
  flex: none;
  color: var(--ui-icdc-faint);
}
.ui-icdc__description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-icdc-muted);
}
.ui-icdc__error {
  font-size: 12px;
  color: var(--ui-icdc-danger);
  overflow-wrap: anywhere;
}
.ui-icdc .ui-icdc__action {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: var(--ui-icdc-card);
  box-shadow: var(--ui-icdc-shadow);
  color: var(--ui-icdc-text);
  cursor: pointer;
  transition:
    box-shadow 140ms,
    background-color 160ms,
    color 160ms;
}
.ui-icdc__action[data-state="on"] {
  background: var(--ui-icdc-ink);
  box-shadow: none;
  color: var(--ui-icdc-card);
}
.ui-icdc__action:disabled {
  cursor: default;
}
.ui-icdc__action:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-icdc__action:focus-visible {
  outline: 2px solid var(--ui-icdc-focus);
  outline-offset: 2px;
}
.ui-icdc__glyph {
  display: grid;
  animation: ui-icdc-pop 260ms var(--ui-icdc-ease);
}
.ui-icdc__spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--ui-icdc-line);
  border-top-color: var(--ui-icdc-ink);
  border-radius: 50%;
  animation: ui-icdc-spin 700ms linear infinite;
}
@media (hover: hover) and (pointer: fine) {
  .ui-icdc:hover {
    background: var(--ui-icdc-hover);
  }
  .ui-icdc__action:hover:not(:disabled) {
    box-shadow:
      0 0 0 1px var(--ui-icdc-line),
      0 1px 2px rgba(0, 0, 0, 0.05);
    color: var(--ui-icdc-ink);
  }
  .ui-icdc__action[data-state="on"]:hover {
    background: color-mix(in srgb, var(--ui-icdc-ink) 86%, var(--ui-icdc-card));
    color: var(--ui-icdc-card);
  }
}
@keyframes ui-icdc-pop {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes ui-icdc-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (pointer: coarse) {
  .ui-icdc .ui-icdc__action {
    width: 32px;
    height: 32px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-icdc,
  .ui-icdc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-icdc {
  --ui-icdc-card: #1c1c1e;
  --ui-icdc-ink: rgba(255, 255, 255, 0.9);
  --ui-icdc-text: rgba(255, 255, 255, 0.62);
  --ui-icdc-muted: rgba(255, 255, 255, 0.45);
  --ui-icdc-faint: rgba(255, 255, 255, 0.28);
  --ui-icdc-line: rgba(255, 255, 255, 0.1);
  --ui-icdc-hover: #202023;
  --ui-icdc-focus: #4d8dff;
  --ui-icdc-danger: #ff6369;
  --ui-icdc-shadow: 0 0 0 0.5px var(--ui-icdc-line), 0 1px 2px rgba(0, 0, 0, 0.4);
}

`;
