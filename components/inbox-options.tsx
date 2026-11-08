"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

/*
 * inbox-options (Classic) – a self-contained React 19 component.
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
      <style href="ui-inbox-options" precedence="default">
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
      <style href="ui-inbox-options" precedence="default">
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

`;
