"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from "react";

/*
 * Select – a single self-contained file, classic style.
 * Pick one option from a list: a field in the Text Field's look that opens a list under it (or above, when there is
 * no room), options with an icon and a quiet second line, a check on the chosen one and a soft highlight that glides
 * to where the pointer or the arrow keys are. Typing a letter jumps to the option. The list sits in the top layer,
 * so a card's overflow never cuts it.
 */

export type SelectOption = {
  value: string;
  label: string;
  /** A quiet second line under the label */
  description?: string;
  /** A 16px icon before the label, e.g. an inline SVG */
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  /** The chosen value – makes it controlled */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string, option: SelectOption) => void;
  /** Shown while nothing is chosen */
  placeholder?: string;
  /** Shown above the field and tied to it */
  label?: ReactNode;
  /** A quiet line under the field – the error takes its place while there is one */
  hint?: ReactNode;
  /** Marks the field invalid and shows this under it, in place of the hint */
  error?: ReactNode;
  /** "Optional" next to the label */
  optional?: boolean;
  /** sm 32 · md 36 · lg 40 high */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Sends the value with a form, through a hidden input */
  name?: string;
  required?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
  ref?: Ref<HTMLButtonElement>;
};

export function Select({
  options,
  value: valueProp,
  defaultValue = null,
  onChange,
  placeholder = "Choose…",
  label,
  hint,
  error,
  optional = false,
  size = "md",
  disabled = false,
  name,
  required,
  id,
  className,
  "aria-label": ariaLabel,
  ref,
}: SelectProps) {
  const autoId = useId();
  const triggerId = id ?? `${autoId}-trigger`;
  const listId = `${autoId}-list`;
  const labelId = `${autoId}-label`;
  const messageId = `${autoId}-message`;
  const optionId = (i: number) => `${autoId}-option-${i}`;

  const [own, setOwn] = useState<string | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : own;
  const chosen = options.find((o) => o.value === value) ?? null;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [place, setPlace] = useState<{ top: number; left: number; width: number; maxHeight: number; up: boolean } | null>(null);
  const [glow, setGlow] = useState<{ top: number; height: number } | null>(null);

  const trigger = useRef<HTMLButtonElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const typed = useRef({ text: "", at: 0 });

  const invalid = Boolean(error);
  const message = shows(error) ? error : shows(hint) ? hint : null;
  const scale = SIZES.includes(size) ? size : "md";
  const enabled = (i: number) => {
    const item = options[i];
    return Boolean(item && !item.disabled);
  };

  const first = () => options.findIndex((o) => !o.disabled);
  const last = () => {
    for (let i = options.length - 1; i >= 0; i--) if (enabled(i)) return i;
    return -1;
  };
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (enabled(i)) return i;
    return from;
  };

  const show = (at?: number) => {
    if (disabled || !options.length) return;
    const chosenAt = options.findIndex((o) => o.value === value);
    setActive(at ?? (enabled(chosenAt) ? chosenAt : first()));
    setOpen(true);
  };
  const hide = (focusBack = true) => {
    setOpen(false);
    setGlow(null);
    setPlace(null);
    if (focusBack) trigger.current?.focus({ preventScroll: true });
  };
  const pick = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    if (valueProp === undefined) setOwn(o.value);
    if (o.value !== value) onChange?.(o.value, o);
    hide();
  };

  const measure = () => {
    const t = trigger.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const gap = 4;
    const edge = 8;
    const below = window.innerHeight - r.bottom - gap - edge;
    const above = r.top - gap - edge;
    const want = Math.min(list.current?.scrollHeight ?? 280, 288);
    const up = below < Math.min(want, 160) && above > below;
    const width = Math.max(r.width, 180);
    const left = Math.min(Math.max(edge, r.left), window.innerWidth - width - edge);
    setPlace({ top: up ? r.top - gap : r.bottom + gap, left, width, maxHeight: Math.max(120, Math.min(288, up ? above : below)), up });
  };

  useLayoutEffect(() => {
    if (!open) return;
    const el = list.current;
    if (el && "showPopover" in el && !el.matches(":popover-open")) el.showPopover();
    measure();
    const update = () => measure();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      if (el && "hidePopover" in el && el.matches(":popover-open")) el.hidePopover();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      const target = e.target as Node;
      if (trigger.current?.contains(target) || list.current?.contains(target)) return;
      hide(false);
    };
    document.addEventListener("pointerdown", down, true);
    return () => document.removeEventListener("pointerdown", down, true);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || active < 0) return;
    const row = list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!row) return;
    setGlow({ top: row.offsetTop, height: row.offsetHeight });
    row.scrollIntoView({ block: "nearest" });
  }, [active, open, place]);

  const typeahead = (key: string) => {
    const now = Date.now();
    typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
    typed.current.at = now;
    const q = typed.current.text.toLowerCase();
    const start = open ? active : options.findIndex((o) => o.value === value);
    const order = [...options.keys()].map((k) => (k + start + (q.length === 1 ? 1 : 0) + options.length) % options.length);
    const hit = order.find((i) => enabled(i) && Boolean(options[i]?.label.toLowerCase().startsWith(q)));
    if (hit === undefined) return;
    if (open) setActive(hit);
    else pick(hit);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show();
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeahead(e.key);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => step(a, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => step(a, -1));
        break;
      case "Home":
      case "PageUp":
        e.preventDefault();
        setActive(first());
        break;
      case "End":
      case "PageDown":
        e.preventDefault();
        setActive(last());
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (e.key === " " && Date.now() - typed.current.at < 700) typeahead(" ");
        else pick(active);
        break;
      case "Escape":
        e.preventDefault();
        hide();
        break;
      case "Tab":
        hide(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeahead(e.key);
    }
  };

  return (
    <div
      className={["ui-sel", className].filter(Boolean).join(" ")}
      data-size={scale}
      data-open={open || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <style href="ui-select" precedence="default">
        {css}
      </style>
      {label != null && (
        <div className="ui-sel__head">
          <label className="ui-sel__label" id={labelId} htmlFor={triggerId}>
            {label}
          </label>
          {optional && <span className="ui-sel__optional">Optional</span>}
        </div>
      )}
      <button
        ref={(el) => {
          trigger.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        id={triggerId}
        type="button"
        className="ui-sel__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : label != null ? `${labelId} ${triggerId}` : undefined}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onKeyDown}
      >
        {chosen?.icon && (
          <span className="ui-sel__icon" aria-hidden="true">
            {chosen.icon}
          </span>
        )}
        <span className="ui-sel__value" data-empty={chosen ? undefined : ""} title={chosen?.label}>
          {chosen ? chosen.label : placeholder}
        </span>
        <span className="ui-sel__chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      {open && (
        <div
          ref={list}
          id={listId}
          className="ui-sel__list"
          role="listbox"
          aria-labelledby={label != null ? labelId : undefined}
          aria-label={label == null ? ariaLabel ?? placeholder : undefined}
          popover="manual"
          data-up={place?.up || undefined}
          style={
            place
              ? {
                  top: place.up ? undefined : place.top,
                  bottom: place.up ? window.innerHeight - place.top : undefined,
                  left: place.left,
                  width: place.width,
                  maxHeight: place.maxHeight,
                }
              : undefined
          }
          onPointerLeave={() => setActive(-1)}
        >
          {glow && <span className="ui-sel__glow" aria-hidden="true" style={{ transform: `translateY(${glow.top}px)`, height: glow.height }} />}
          {options.map((o, i) => (
            <div
              key={o.value}
              id={optionId(i)}
              className="ui-sel__option"
              role="option"
              data-index={i}
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              data-active={i === active || undefined}
              onPointerMove={() => o.disabled || i === active || setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              {o.icon && (
                <span className="ui-sel__icon" aria-hidden="true">
                  {o.icon}
                </span>
              )}
              <span className="ui-sel__text">
                <span className="ui-sel__option-label">{o.label}</span>
                {o.description && <span className="ui-sel__option-hint">{o.description}</span>}
              </span>
              <span className="ui-sel__check" aria-hidden="true">
                {o.value === value && <CheckIcon />}
              </span>
            </div>
          ))}
        </div>
      )}
      {message && (
        <p className="ui-sel__message" id={messageId} key={shows(error) ? "error" : "hint"} aria-live={shows(error) ? "polite" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}

const SIZES = ["sm", "md", "lg"];
const shows = (v: ReactNode) => v != null && typeof v !== "boolean" && v !== "";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="ui-sel__tick" d="M5 12.5 9.5 17 19 7" pathLength={1} />
    </svg>
  );
}

const css = /* css */ `
.ui-sel {
  --ui-sel-title: #171717;
  --ui-sel-ink: #171717;
  --ui-sel-subtle: #737373;
  --ui-sel-faint: #a3a3a3;
  --ui-sel-icon: #737373;
  --ui-sel-surface: #ffffff;
  --ui-sel-menu: #ffffff;
  --ui-sel-glow: #f5f5f5;
  --ui-sel-readonly: #fafafa;
  --ui-sel-edge: #e5e5e5;
  --ui-sel-edge-hover: #d4d4d4;
  --ui-sel-edge-open: #a3a3a3;
  --ui-sel-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --ui-sel-shadow-menu: 0 0 0 1px #e5e5e5, 0 10px 28px -6px rgba(0, 0, 0, 0.16), 0 2px 6px -2px rgba(0, 0, 0, 0.06);
  --ui-sel-danger: #e5484d;
  --ui-sel-danger-bg: #fff5f5;
  --ui-sel-danger-edge: #f38b8e;
  --ui-sel-focus: #2f6bff;
  --ui-sel-ease: cubic-bezier(0.22, 1, 0.36, 1);

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
  color: var(--ui-sel-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sel[data-size="sm"] { --h: 32px; --px: 10px; --fs: 13px; --radius: 8px; }
.ui-sel[data-size="lg"] { --h: 40px; --px: 14px; --fs: 15px; --radius: 12px; }
@media (pointer: coarse) {
  .ui-sel { --fs: 16px; }
  .ui-sel[data-size="sm"] { --h: 36px; }
  .ui-sel[data-size="md"] { --h: 40px; }
  .ui-sel[data-size="lg"] { --h: 44px; }
}

.ui-sel__head { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
.ui-sel__label { min-width: 0; font-weight: 500; color: var(--ui-sel-title); overflow-wrap: anywhere; cursor: default; }
.ui-sel__optional { flex: none; font-size: 12px; line-height: 16px; color: var(--ui-sel-subtle); }

.ui-sel__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: var(--h);
  min-width: 0;
  margin: 0;
  padding: 0 calc(var(--px) - 2px) 0 var(--px);
  border: 1px solid var(--ui-sel-edge);
  border-radius: var(--radius);
  background: var(--ui-sel-surface);
  box-shadow: var(--ui-sel-shadow);
  font: inherit;
  font-size: var(--fs);
  color: var(--ui-sel-ink);
  text-align: start;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}
.ui-sel__trigger:hover { border-color: var(--ui-sel-edge-hover); }
.ui-sel[data-open] .ui-sel__trigger { border-color: var(--ui-sel-edge-open); }
.ui-sel__trigger:focus-visible { outline: 2px solid var(--ui-sel-focus); outline-offset: 2px; }
.ui-sel[data-invalid] .ui-sel__trigger { border-color: var(--ui-sel-danger-edge); background: var(--ui-sel-danger-bg); }
.ui-sel__trigger:disabled { background: var(--ui-sel-readonly); box-shadow: none; cursor: not-allowed; }
.ui-sel[data-disabled] { opacity: 0.55; }

.ui-sel__value { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-sel__value[data-empty] { color: var(--ui-sel-faint); }
.ui-sel__icon { display: grid; flex: none; place-items: center; width: 16px; height: 16px; color: var(--ui-sel-icon); }
.ui-sel__icon > svg, .ui-sel__icon > img { display: block; width: 16px; height: 16px; }
.ui-sel__chevron { display: grid; flex: none; place-items: center; width: 16px; height: 16px; color: var(--ui-sel-icon); transition: transform 240ms var(--ui-sel-ease); }
.ui-sel[data-open] .ui-sel__chevron { transform: rotate(180deg); }

.ui-sel__list {
  position: fixed;
  inset: auto;
  z-index: 1000;
  box-sizing: border-box;
  margin: 0;
  padding: 5px;
  border: 0;
  border-radius: 14px;
  background: var(--ui-sel-menu);
  box-shadow: var(--ui-sel-shadow-menu);
  color: var(--ui-sel-ink);
  font: inherit;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  transform-origin: top center;
  animation: ui-sel-in 200ms var(--ui-sel-ease) both;
}
.ui-sel__list[data-up] { transform-origin: bottom center; }
.ui-sel__list::backdrop { display: none; }

.ui-sel__glow {
  position: absolute;
  top: 0;
  left: 5px;
  right: 5px;
  border-radius: 9px;
  background: var(--ui-sel-glow);
  pointer-events: none;
  transition: transform 180ms var(--ui-sel-ease), height 180ms var(--ui-sel-ease);
}

.ui-sel__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 6px 10px;
  box-sizing: border-box;
  border-radius: 9px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
}
.ui-sel__option[aria-disabled] { color: var(--ui-sel-faint); cursor: default; }
.ui-sel__option[aria-disabled] .ui-sel__icon { opacity: 0.5; }
.ui-sel__text { display: grid; flex: 1; min-width: 0; }
.ui-sel__option-label { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-sel__option[aria-selected="true"] .ui-sel__option-label { font-weight: 500; }
.ui-sel__option-hint { overflow: hidden; font-size: 12px; line-height: 16px; white-space: nowrap; text-overflow: ellipsis; color: var(--ui-sel-subtle); }
.ui-sel__check { display: grid; flex: none; place-items: center; width: 16px; height: 16px; color: var(--ui-sel-ink); }
.ui-sel__tick { stroke-dasharray: 1; animation: ui-sel-draw 280ms 40ms var(--ui-sel-ease) both; }
@media (pointer: coarse) {
  .ui-sel__option { min-height: 44px; font-size: 16px; }
}

.ui-sel__message { margin: 0; font-size: 12px; line-height: 16px; color: var(--ui-sel-subtle); overflow-wrap: anywhere; animation: ui-sel-message 260ms var(--ui-sel-ease); }
.ui-sel[data-invalid] .ui-sel__message { color: var(--ui-sel-danger); }

@keyframes ui-sel-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
}
.ui-sel__list[data-up] { animation-name: ui-sel-in-up; }
@keyframes ui-sel-in-up {
  from { opacity: 0; transform: translateY(4px) scale(0.98); }
}
@keyframes ui-sel-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}
@keyframes ui-sel-message {
  from { opacity: 0; transform: translateY(-3px); filter: blur(2px); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-sel *, .ui-sel__list { animation-duration: 1ms !important; }
  .ui-sel__glow, .ui-sel__chevron, .ui-sel__trigger { transition-duration: 1ms; }
}

:where(.dark, [data-theme="dark"]) .ui-sel {
  --ui-sel-title: #ededed;
  --ui-sel-ink: #ededed;
  --ui-sel-subtle: #8f8f8f;
  --ui-sel-faint: #6b6b70;
  --ui-sel-icon: #8f8f8f;
  --ui-sel-surface: #232326;
  --ui-sel-menu: #232326;
  --ui-sel-glow: #2e2e32;
  --ui-sel-readonly: #1c1c1f;
  --ui-sel-edge: rgba(255, 255, 255, 0.12);
  --ui-sel-edge-hover: rgba(255, 255, 255, 0.2);
  --ui-sel-edge-open: rgba(255, 255, 255, 0.34);
  --ui-sel-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-sel-shadow-menu: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 14px 34px -8px rgba(0, 0, 0, 0.65);
  --ui-sel-danger: #ff8589;
  --ui-sel-danger-bg: rgba(229, 72, 77, 0.08);
  --ui-sel-danger-edge: rgba(255, 133, 137, 0.55);
  --ui-sel-focus: #6b95ff;
}
`;
