"use client";

import { useEffect, useId, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";

/*
 * Text Field – a single self-contained file.
 * One input for every form: a label, an optional hint, prefix and suffix text or icons, a clear, reveal or copy
 * button, a character count and an error that takes the hint's place. Focus firms up the 1px border – no ring.
 * The styles are injected below, so no extra files are needed.
 */

export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "size" | "prefix"> & {
  /** Shown above the field and tied to it */
  label?: ReactNode;
  /** A quiet line under the field – the error takes its place while there is one */
  hint?: ReactNode;
  /** Marks the field invalid and shows this under it, in place of the hint */
  error?: ReactNode;
  /** Text or an icon inside the field, before the value – e.g. "https://" or a search icon */
  prefix?: ReactNode;
  /** Text or an icon inside the field, after the value – e.g. ".acme.app" or "USD" */
  suffix?: ReactNode;
  /** sm 32 · md 36 · lg 40 high */
  size?: "sm" | "md" | "lg";
  /** "Optional" next to the label */
  optional?: boolean;
  /** A small × that empties the field while it has a value */
  clearable?: boolean;
  /** A copy button – for API keys, links and IDs, usually with readOnly */
  copyable?: boolean;
  /** Shows "12/40" under the field; needs maxLength */
  counter?: boolean;
  /** Called after the × emptied the field (onChange fires too) */
  onClear?: () => void;
  /** Extra class on the input itself; className goes on the wrapper */
  inputClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  prefix,
  suffix,
  size = "md",
  optional = false,
  clearable = false,
  copyable = false,
  counter = false,
  onClear,
  onKeyDown,
  className,
  inputClassName,
  id,
  type = "text",
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  maxLength,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const messageId = `${autoId}-message`;
  const counterId = `${autoId}-count`;
  const input = useRef<HTMLInputElement | null>(null);

  // The current text, for the count and the × – follows value when controlled, the input itself otherwise
  const [own, setOwn] = useState(String(defaultValue ?? ""));
  const text = value !== undefined && value !== null ? String(value) : own;

  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const invalid = Boolean(error) || rest["aria-invalid"] === true || rest["aria-invalid"] === "true";
  const message = shows(error) ? error : shows(hint) ? hint : null;
  const showCount = counter && typeof maxLength === "number";
  const fallbackName =
    label == null && !rest["aria-label"] && !rest["aria-labelledby"] && typeof rest.placeholder === "string"
      ? rest.placeholder
      : undefined;

  useEffect(() => {
    const form = input.current?.form;
    if (!form || value !== undefined) return;
    const onReset = () => window.setTimeout(() => setOwn(input.current?.value ?? ""));
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [value]);
  const showClear = clearable && !disabled && !readOnly && text.length > 0;
  const scale = SIZES.includes(size) ? size : "md";

  const clear = () => {
    const el = input.current;
    if (!el) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
    onClear?.();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      input.current?.select();
      return;
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={["ui-tf", className].filter(Boolean).join(" ")}
      data-size={scale}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      <style href="ui-text-field" precedence="default">
        {css}
      </style>
      {label != null && (
        <div className="ui-tf__head">
          <label className="ui-tf__label" htmlFor={inputId}>
            {label}
          </label>
          {optional && <span className="ui-tf__optional">Optional</span>}
        </div>
      )}
      <div
        className="ui-tf__box"
        onPointerDown={(e) => {
          if (e.target === input.current || (e.target as HTMLElement).closest("button")) return;
          e.preventDefault();
          input.current?.focus();
        }}
      >
        {prefix != null && (
          <span className="ui-tf__affix" data-side="start">
            {typeof prefix === "string" ? <span className="ui-tf__affix-text">{prefix}</span> : prefix}
          </span>
        )}
        <input
          {...rest}
          ref={(el) => {
            input.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          id={inputId}
          className={["ui-tf__input", inputClassName].filter(Boolean).join(" ")}
          type={isPassword && revealed ? "text" : type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-label={rest["aria-label"] ?? fallbackName}
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, message ? messageId : null, showCount ? counterId : null].filter(Boolean).join(" ") ||
            undefined
          }
          dir={rest.dir ?? "auto"}
          data-revealed={isPassword ? (revealed ? "true" : "false") : undefined}
          onKeyDown={(e) => {
            if (e.key === "Escape" && showClear) {
              e.preventDefault();
              clear();
            }
            onKeyDown?.(e);
          }}
          onChange={(e) => {
            if (value === undefined) setOwn(e.target.value);
            onChange?.(e);
          }}
        />
        {suffix != null && (
          <span className="ui-tf__affix" data-side="end">
            {suffix}
          </span>
        )}
        {showClear && (
          <button type="button" className="ui-tf__action" aria-label="Clear" tabIndex={-1} onClick={clear}>
            <ClearIcon />
          </button>
        )}
        {isPassword && !disabled && (
          <button
            type="button"
            className="ui-tf__action"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            onClick={() => setRevealed((r) => !r)}
          >
            <span className="ui-tf__swap" key={revealed ? "hide" : "show"}>
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </span>
          </button>
        )}
        {copyable && (
          <button
            type="button"
            className="ui-tf__action"
            data-copied={copied || undefined}
            aria-label={copied ? "Copied" : "Copy"}
            onClick={copy}
            disabled={disabled || !text}
          >
            <span className="ui-tf__swap" key={copied ? "done" : "copy"}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
          </button>
        )}
        {copyable && (
          <span className="ui-tf__sr" role="status">
            {copied ? "Copied" : ""}
          </span>
        )}
      </div>
      {(message || showCount) && (
        <div className="ui-tf__foot">
          <p
            className="ui-tf__message"
            id={messageId}
            key={shows(error) ? "error" : "hint"}
            dir="auto"
            aria-live={shows(error) ? "polite" : undefined}
          >
            {message}
          </p>
          {showCount && (
            <span
              className="ui-tf__count"
              id={counterId}
              data-full={text.length === maxLength || undefined}
              data-over={text.length > maxLength || undefined}
            >
              {text.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const SIZES = ["sm", "md", "lg"];
const shows = (v: ReactNode) => v != null && typeof v !== "boolean" && v !== "";

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3.53 12.22a.75.75 0 1 1-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L10.94 12 8.47 9.53a.75.75 0 0 1 1.06-1.06L12 10.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L13.06 12l2.47 2.47Z" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.544 11.045C21.848 11.471 22 11.685 22 12c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045Z" />
      <path d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19.439 15.439c.996-.91 1.719-1.82 2.105-2.36.304-.426.456-.64.456-.955 0-.316-.152-.529-.456-.955C20.178 9.253 16.689 5.124 12 5.124c-.908 0-1.77.155-2.582.418M6.74 6.869c-2.09 1.267-3.6 3.083-4.284 4.04-.304.426-.456.64-.456.955 0 .316.152.529.456.955C3.822 14.735 7.311 18.864 12 18.864c2.008 0 3.786-.757 5.26-1.746" />
      <path d="M9.858 10a2.98 2.98 0 0 0-.858 2.124 3 3 0 0 0 5.124 2.12M3 3l18 18" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 15c0-2.828 0-4.243.879-5.121C10.757 9 12.172 9 15 9h1c2.828 0 4.243 0 5.121.879C22 10.757 22 12.172 22 15v1c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1c-2.828 0-4.243 0-5.121-.879C9 20.243 9 18.828 9 16v-1Z" />
      <path d="M17 9c-.003-2.957-.047-4.489-.908-5.538a4 4 0 0 0-.554-.554C14.43 2 12.788 2 9.5 2c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 4.57 2 6.212 2 9.5c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.05.86 2.58.906 5.538.908" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path className="ui-tf__check" d="M5 12.5 9.5 17 19 7" pathLength={1} />
    </svg>
  );
}

const css = /* css */ `
.ui-tf {
  --ui-tf-title: #171717;
  --ui-tf-ink: #171717;
  --ui-tf-muted: #525252;
  --ui-tf-subtle: #737373;
  --ui-tf-faint: #b5b5b5;
  --ui-tf-icon: #737373;
  --ui-tf-surface: #ffffff;
  --ui-tf-wash: #f5f5f5;
  --ui-tf-readonly: #fafafa;
  --ui-tf-edge: #e5e5e5;
  --ui-tf-edge-hover: #d4d4d4;
  --ui-tf-edge-focus: #a3a3a3;
  --ui-tf-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --ui-tf-danger: #e5484d;
  --ui-tf-danger-bg: #fff5f5;
  --ui-tf-danger-edge: #f38b8e;
  --ui-tf-danger-edge-focus: #e5484d;
  --ui-tf-success: #1f8a4c;
  --ui-tf-focus: #2f6bff;
  --ui-tf-ease: cubic-bezier(0.22, 1, 0.36, 1);

  --h: 36px;
  --px: 12px;
  --fs: 14px;
  --radius: 10px;

  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: var(--ui-tf-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-tf[data-size="sm"] { --h: 32px; --px: 10px; --fs: 13px; --radius: 8px; }
.ui-tf[data-size="lg"] { --h: 40px; --px: 14px; --fs: 15px; --radius: 12px; }
@media (pointer: coarse) {
  .ui-tf { --fs: 16px; }
  .ui-tf[data-size="sm"] { --h: 36px; }
  .ui-tf[data-size="md"] { --h: 40px; }
  .ui-tf[data-size="lg"] { --h: 44px; }
}

.ui-tf__head { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
.ui-tf__label { min-width: 0; font-weight: 500; color: var(--ui-tf-title); overflow-wrap: anywhere; cursor: default; }
.ui-tf__optional { flex: none; font-size: 12px; line-height: 16px; color: var(--ui-tf-subtle); }

.ui-tf__box {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: var(--h);
  min-width: 0;
  padding-block: 0;
  padding-inline: var(--px) calc(var(--px) - 4px);
  border: 1px solid var(--ui-tf-edge);
  border-radius: var(--radius);
  background: var(--ui-tf-surface);
  box-shadow: var(--ui-tf-shadow);
  cursor: text;
  transition: border-color 140ms ease, background-color 140ms ease, box-shadow 140ms ease;
}
.ui-tf__box:not(:has(.ui-tf__action)) { padding-inline-end: var(--px); }
.ui-tf__box:hover { border-color: var(--ui-tf-edge-hover); }
.ui-tf__box:focus-within { border-color: var(--ui-tf-edge-focus); }
.ui-tf[data-invalid] .ui-tf__box { border-color: var(--ui-tf-danger-edge); background: var(--ui-tf-danger-bg); animation: ui-tf-nudge 320ms var(--ui-tf-ease); }
.ui-tf[data-invalid] .ui-tf__box:focus-within { border-color: var(--ui-tf-danger-edge-focus); }
.ui-tf[data-readonly] .ui-tf__box { background: var(--ui-tf-readonly); box-shadow: none; cursor: default; }
.ui-tf[data-disabled] .ui-tf__box { background: var(--ui-tf-readonly); box-shadow: none; cursor: not-allowed; }
.ui-tf[data-disabled] { opacity: 0.55; }

.ui-tf__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: var(--fs);
  color: var(--ui-tf-ink);
  text-overflow: ellipsis;
  -webkit-appearance: none;
  appearance: none;
}
.ui-tf__box:has(> .ui-tf__affix) .ui-tf__input { flex: 1 0 6em; min-width: 6em; }
.ui-tf__input::placeholder { color: var(--ui-tf-faint); opacity: 1; }
.ui-tf__input:disabled { cursor: not-allowed; }
.ui-tf__input[type="search"]::-webkit-search-cancel-button { display: none; }
.ui-tf__input[type="number"] { -moz-appearance: textfield; font-variant-numeric: tabular-nums; }
.ui-tf__input[type="number"]::-webkit-inner-spin-button,
.ui-tf__input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.ui-tf__input[data-revealed] { animation: ui-tf-reveal 260ms var(--ui-tf-ease); }
.ui-tf__input[data-revealed="false"] { animation-name: ui-tf-reveal-hide; }

.ui-tf__affix {
  display: inline-flex;
  flex: 0 1 auto;
  align-items: center;
  min-width: 0;
  max-width: 70%;
  font-size: var(--fs);
  color: var(--ui-tf-subtle);
  white-space: nowrap;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-tf__affix[data-side="start"] { margin-inline-end: -6px; }
.ui-tf__affix[data-side="end"] { max-width: 40%; margin-inline-start: -6px; }
.ui-tf__affix-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-tf__affix[data-side="start"]:dir(ltr) .ui-tf__affix-text { direction: rtl; text-align: left; }
.ui-tf__affix[data-side="start"]:dir(ltr) .ui-tf__affix-text::after { content: "\\200E"; }
.ui-tf__affix[data-side]:has(> svg) { margin: 0; color: var(--ui-tf-icon); }
.ui-tf__affix > svg { display: block; width: 16px; height: 16px; flex: none; }

.ui-tf__action {
  display: grid;
  place-items: center;
  flex: none;
  width: calc(var(--h) - 10px);
  height: calc(var(--h) - 10px);
  position: relative;
  max-width: 28px;
  max-height: 28px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ui-tf-icon);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 140ms ease, color 140ms ease;
}
.ui-tf__action + .ui-tf__action { margin-left: -4px; }
@media (pointer: coarse) {
  .ui-tf__action { width: 32px; height: 32px; max-width: none; max-height: none; }
  .ui-tf__action::before { content: ""; position: absolute; inset: -4px; }
}
.ui-tf__action:hover:not(:disabled) { background: var(--ui-tf-wash); color: var(--ui-tf-ink); }
.ui-tf__action:focus-visible { outline: 2px solid var(--ui-tf-focus); outline-offset: -2px; }
.ui-tf__action:disabled { opacity: 0.4; cursor: default; }
.ui-tf__action[data-copied] { color: var(--ui-tf-success); }
.ui-tf__action svg { display: block; }
.ui-tf__swap { display: grid; animation: ui-tf-swap 280ms var(--ui-tf-ease); }
.ui-tf__check { stroke-dasharray: 1; animation: ui-tf-draw 320ms 60ms var(--ui-tf-ease) both; }

.ui-tf__foot { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
.ui-tf__message {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--ui-tf-subtle);
  overflow-wrap: anywhere;
  animation: ui-tf-message 260ms var(--ui-tf-ease);
}
.ui-tf[data-invalid] .ui-tf__message { color: var(--ui-tf-danger); }
.ui-tf__count { flex: none; margin-left: auto; font-size: 12.5px; line-height: 18px; font-variant-numeric: tabular-nums; color: var(--ui-tf-faint); transition: color 140ms ease; }
.ui-tf__count[data-over] { color: var(--ui-tf-danger); }
.ui-tf__count[data-full] { color: var(--ui-tf-muted); }
.ui-tf__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

@keyframes ui-tf-nudge {
  30% { transform: translateX(-3px); }
  65% { transform: translateX(2px); }
}
@keyframes ui-tf-message {
  from { opacity: 0; transform: translateY(-3px); filter: blur(2px); }
}
@keyframes ui-tf-reveal {
  from { filter: blur(4px); opacity: 0.4; }
}
@keyframes ui-tf-reveal-hide {
  from { filter: blur(3px); opacity: 0.5; }
}
@keyframes ui-tf-swap {
  from { opacity: 0; transform: scale(0.6); filter: blur(2px); }
}
@keyframes ui-tf-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-tf *, .ui-tf[data-invalid] .ui-tf__box { animation-duration: 1ms !important; }
  .ui-tf__box { transition-duration: 1ms; }
}

:where(.dark, [data-theme="dark"]) .ui-tf {
  --ui-tf-title: #ededed;
  --ui-tf-ink: #ededed;
  --ui-tf-muted: #c4c4c4;
  --ui-tf-subtle: #8f8f8f;
  --ui-tf-faint: #6b6b70;
  --ui-tf-icon: #8f8f8f;
  --ui-tf-surface: #232326;
  --ui-tf-wash: #2a2a2d;
  --ui-tf-readonly: #1c1c1e;
  --ui-tf-edge: rgba(255, 255, 255, 0.1);
  --ui-tf-edge-hover: rgba(255, 255, 255, 0.16);
  --ui-tf-edge-focus: rgba(255, 255, 255, 0.28);
  --ui-tf-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-tf-danger: #ff6b6b;
  --ui-tf-danger-bg: rgba(255, 64, 64, 0.1);
  --ui-tf-danger-edge: rgba(255, 107, 107, 0.5);
  --ui-tf-danger-edge-focus: #ff6b6b;
  --ui-tf-success: #3fbf74;
  --ui-tf-focus: #6b95ff;
}
`;
