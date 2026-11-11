"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

/*
 * inbox-options (Clean) – a self-contained React 19 component.
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
      const opt = options[index];
      if (opt) onConfirm?.(opt.id);
    }
  };
  const focused = options.some((option) => option.id === value) ? value : options[0]?.id;
  return (
    <div
      ref={root}
      className={["ui-iboc", className].filter(Boolean).join(" ")}
      data-variant={variant}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={{ "--ui-iboc-count": Math.max(1, Math.min(4, options.length)) } as CSSProperties}
    >
      <style href="ui-inbox-options-clean" precedence="default">
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
            className="ui-iboc__option"
            key={option.id}
            onClick={() => choose(index)}
            onKeyDown={(event) => key(event, index)}
          >
            {variant === "variants" && (
              <span
                className="ui-iboc__preview"
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
            <span className="ui-iboc__number">{index + 1}</span>
            <span className="ui-iboc__body">
              <span className="ui-iboc__head">
                <strong title={option.title} dir="auto">
                  {option.title}
                </strong>
                {option.recommended && <span className="ui-iboc__recommended">{recommendedLabel}</span>}
              </span>
              {variant === "options" && (
                <>
                  <span className="ui-iboc__summary" id={`${id}-summary-${index}`} title={option.summary} dir="auto">
                    {option.summary}
                  </span>
                  <span
                    className="ui-iboc__more"
                    data-open={selected || undefined}
                    aria-hidden={!selected}
                    id={`${id}-more-${index}`}
                  >
                    <span className="ui-iboc__clip">
                      {option.pros?.map((line, lineIndex) => (
                        <span className="ui-iboc__line" key={`pro-${lineIndex}`}>
                          <b aria-hidden="true">+</b>
                          <span className="ui-iboc__sr">Pro: </span>
                          <span dir="auto">{line}</span>
                        </span>
                      ))}
                      {option.cons?.map((line, lineIndex) => (
                        <span className="ui-iboc__line" key={`con-${lineIndex}`}>
                          <b aria-hidden="true">–</b>
                          <span className="ui-iboc__sr">Con: </span>
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
    <svg className={["ui-iboc__wire", className].filter(Boolean).join(" ")} viewBox="0 0 120 80" aria-hidden="true">
      <style href="ui-inbox-options-clean" precedence="default">
        {css}
      </style>
      {preview === "checklist" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="12" y="12" width="44" height="5" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="22" width="96" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="12" y="22" width="32" height="3" rx="1.5"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="12" y="34" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="26" y="36" width="54" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="48" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="26" y="50" width="46" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="12" y="62" width="8" height="8" rx="4"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="26" y="64" width="38" height="4" rx="2"></rect>
        </>
      ) : preview === "data" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="14" y="46" width="10" height="22" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="30" y="36" width="10" height="32" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="46" y="50" width="10" height="18" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="62" y="28" width="10" height="40" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="78" y="40" width="10" height="28" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="94" y="22" width="10" height="46" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="34" y="12" width="52" height="12" rx="6"></rect>
        </>
      ) : preview === "bars" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="14" y="40" width="12" height="28" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="28" width="12" height="40" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="54" y="46" width="12" height="22" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="74" y="20" width="12" height="48" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="94" y="34" width="12" height="34" rx="2"></rect>
        </>
      ) : preview === "line" ? (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="12" y="54" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="44" width="26" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="58" y="48" width="24" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="80" y="26" width="28" height="3" rx="2"></rect>
        </>
      ) : (
        <>
          <rect fill="var(--ui-iboc-card)" x="0.5" y="0.5" width="119" height="79" rx="6"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="48" y="16" width="24" height="20" rx="5"></rect>
          <rect fill="var(--ui-iboc-wire-mid)" x="34" y="44" width="52" height="4" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-soft)" x="42" y="52" width="36" height="3" rx="2"></rect>
          <rect fill="var(--ui-iboc-wire-ink)" x="50" y="61" width="20" height="7" rx="3"></rect>
        </>
      )}
    </svg>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-iboc {
  --ui-iboc-card: #fff;
  --ui-iboc-ink: rgba(0, 0, 0, 0.88);
  --ui-iboc-muted: rgba(0, 0, 0, 0.45);
  --ui-iboc-faint: rgba(0, 0, 0, 0.27);
  --ui-iboc-line: rgba(0, 0, 0, 0.06);
  --ui-iboc-line-strong: rgba(0, 0, 0, 0.16);
  --ui-iboc-fill: rgba(0, 0, 0, 0.04);
  --ui-iboc-hover: rgba(0, 0, 0, 0.02);
  --ui-iboc-focus: rgba(0, 96, 226, 0.7);
  --ui-iboc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border-radius: 10px;
  background: var(--ui-iboc-card);
  box-shadow: 0 0 0 0.5px var(--ui-iboc-line);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-iboc-ink);
  container: ui-iboc / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-iboc,
.ui-iboc *,
.ui-iboc *::before,
.ui-iboc *::after {
  box-sizing: border-box;
}
.ui-iboc__option {
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
.ui-iboc__option:hover {
  background: var(--ui-iboc-hover);
}
.ui-iboc__option[aria-checked="true"] {
  background: var(--ui-iboc-fill);
}
.ui-iboc__option:disabled {
  cursor: default;
  opacity: 0.5;
}
.ui-iboc__option:focus-visible {
  outline: 2px solid var(--ui-iboc-focus);
  outline-offset: -2px;
}
.ui-iboc__option:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-iboc__number {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  box-shadow: inset 0 0 0 0.5px var(--ui-iboc-line-strong);
  font-size: 11px;
  color: var(--ui-iboc-muted);
  font-variant-numeric: tabular-nums;
}
.ui-iboc__option[aria-checked="true"] .ui-iboc__number {
  background: var(--ui-iboc-ink);
  color: var(--ui-iboc-card);
  box-shadow: none;
}
.ui-iboc__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-iboc__head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  height: 20px;
}
.ui-iboc__head strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.ui-iboc__recommended {
  flex: none;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 4px;
  background: rgba(0, 143, 245, 0.1);
  color: #006dcb;
}
.ui-iboc__summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ui-iboc-muted);
  font-size: 13px;
  line-height: 20px;
}
.ui-iboc__more {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 320ms var(--ui-iboc-ease),
    opacity 220ms;
}
.ui-iboc__more[data-open] {
  grid-template-rows: 1fr;
  opacity: 1;
}
.ui-iboc__clip {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.ui-iboc__line {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--ui-iboc-muted);
}
.ui-iboc__line:first-child {
  margin-top: 8px;
}
.ui-iboc__line > b {
  flex: none;
  width: 8px;
  text-align: center;
  font-weight: 500;
  color: var(--ui-iboc-faint);
}
.ui-iboc[data-variant="variants"] {
  display: grid;
  grid-template-columns: repeat(var(--ui-iboc-count, 3), minmax(0, 1fr));
  gap: 6px;
  margin: -6px;
  padding: 0;
  box-shadow: none;
  background: none;
}
.ui-iboc[data-variant="variants"] .ui-iboc__option {
  grid-template-columns: 18px minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 8px;
  min-height: 0;
  padding: 6px 6px 8px;
  border-radius: 10px;
}
.ui-iboc__preview {
  display: block;
  grid-column: 1/-1;
  overflow: hidden;
  border-radius: 6px;
  background: var(--ui-iboc-card);
  box-shadow: 0 0 0 0.5px var(--ui-iboc-line);
}
.ui-iboc__preview > img {
  display: block;
  width: 100%;
  height: auto;
}
.ui-iboc__wire {
  display: block;
  width: 100%;
  height: auto;
  --ui-iboc-card: #fff;
  --ui-iboc-wire-ink: rgba(0, 0, 0, 0.42);
  --ui-iboc-wire-mid: rgba(0, 0, 0, 0.16);
  --ui-iboc-wire-soft: rgba(0, 0, 0, 0.07);
}
.ui-iboc[data-variant="variants"] .ui-iboc__number {
  width: 18px;
  height: 18px;
}
.ui-iboc[data-variant="variants"] .ui-iboc__recommended {
  display: none;
}
.ui-iboc__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@container ui-iboc (max-width:360px) {
  .ui-iboc[data-variant="variants"] .ui-iboc__option {
    padding: 4px 4px 6px;
    column-gap: 0;
  }
  .ui-iboc[data-variant="variants"] .ui-iboc__number {
    display: none;
  }
  .ui-iboc[data-variant="variants"] .ui-iboc__body {
    grid-column: 1/-1;
  }
  .ui-iboc__head strong {
    font-size: 12px;
  }
}
@media (pointer: coarse) {
  .ui-iboc__option {
    min-height: 56px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-iboc,
  .ui-iboc * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-iboc,
:where(.dark, [data-theme="dark"]) .ui-iboc__wire {
  --ui-iboc-card: #1c1c1e;
  --ui-iboc-ink: rgba(255, 255, 255, 0.9);
  --ui-iboc-muted: rgba(255, 255, 255, 0.46);
  --ui-iboc-faint: rgba(255, 255, 255, 0.3);
  --ui-iboc-line: rgba(255, 255, 255, 0.08);
  --ui-iboc-line-strong: rgba(255, 255, 255, 0.16);
  --ui-iboc-fill: rgba(255, 255, 255, 0.06);
  --ui-iboc-hover: rgba(255, 255, 255, 0.03);
  --ui-iboc-focus: rgba(77, 141, 255, 0.8);
}
:where(.dark, [data-theme="dark"]) .ui-iboc__recommended {
  background: rgba(0, 119, 255, 0.22);
  color: #70b8ff;
}

:where(.dark, [data-theme="dark"]) .ui-iboc__wire {
  --ui-iboc-wire-ink: rgba(255, 255, 255, 0.5);
  --ui-iboc-wire-mid: rgba(255, 255, 255, 0.2);
  --ui-iboc-wire-soft: rgba(255, 255, 255, 0.08);
}

`;
