"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * workspace-start (Classic) – a self-contained React 19 component.
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
  | "unpin"
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
  pin: (
    <g strokeWidth="1.9">
      <path d="M3 21L8 16" />
      <path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" />
    </g>
  ),
  unpin: (
    <g strokeWidth="1.9">
      <path d="M7.5 8C6.95863 8.1281 6.49932 8.14239 5.99268 8.45891C5.07234 9.03388 4.85108 9.71674 5.08821 10.7612C5.94028 14.5139 9.48599 18.0596 13.2388 18.9117C14.2834 19.1489 14.9661 18.928 15.5416 18.0077C15.8411 17.5288 15.8716 17.0081 16 16.5" />
      <path d="M12 7.79915C12.1776 7.77794 12.3182 7.74034 12.4295 7.68235C13.3997 7.17686 13.9291 5.53361 14.4498 4.60009C14.9311 3.73715 15.1718 3.30567 15.7379 3.10227C16.3041 2.89888 16.6448 3.02205 17.3262 3.26839C18.9197 3.8445 20.1555 5.08032 20.7316 6.6738C20.9779 7.35521 21.1011 7.69591 20.8977 8.26204C20.6943 8.82817 20.2628 9.06884 19.3999 9.55018C18.4608 10.074 16.7954 10.6108 16.2905 11.5898C16.2345 11.6983 16.1978 11.8327 16.1769 12" />
      <path d="M3 21L8 16" />
      <path d="M3 3L21 21" />
    </g>
  ),
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

export type WorkspaceToolKind = "terminal" | "browser" | "notes";
export type WorkspaceSource = {
  id?: string;
  name: string;
  description?: string;
  artifact?: string;
  kind?: "folder" | "table" | "document" | "code" | "image";
  icon?: ReactNode;
};
export type WorkspaceStartProps = {
  suggested?: WorkspaceSource[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  onOpenSource?: (source: WorkspaceSource) => void;
  onOpenTool?: (tool: WorkspaceToolKind) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
};

/** A new work-area tab: search or enter a URL, launch a tool, or open a suggested artifact. */
export function WorkspaceStart({
  suggested = [],
  query: queryProp,
  defaultQuery = "",
  onQueryChange,
  onOpenSource,
  onOpenTool,
  onOpenUrl,
  className,
}: WorkspaceStartProps) {
  const [query, setQuery] = useControllable(queryProp, defaultQuery, onQueryChange);
  const sources = suggested.filter((source) =>
    `${source.name} ${source.description ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const tools: { kind: WorkspaceToolKind; label: string; hint: string; icon: IconName }[] = [
    { kind: "terminal", label: "Terminal", hint: "⌃`", icon: "terminal" },
    { kind: "browser", label: "Browser", hint: "⌘⇧B", icon: "globe" },
    { kind: "notes", label: "Notes", hint: "⌘⇧N", icon: "compose" },
  ];
  return (
    <section className={["ui-wst", className].filter(Boolean).join(" ")} aria-label="New workspace tab">
      <style href="ui-workspace-start" precedence="default">
        {css}
      </style>
      <form
        className="ui-wst__search"
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim()) onOpenUrl?.(query.trim());
        }}
      >
        <Icon name="search" size={14} />
        <input
          aria-label="Search or enter URL"
          placeholder="Search or enter URL"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
      <h2>Tools</h2>
      <div className="ui-wst__card">
        {tools
          .filter((tool) => tool.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
          .map((tool) => (
            <button type="button" className="ui-wst__tool" key={tool.kind} onClick={() => onOpenTool?.(tool.kind)}>
              <span className="ui-wst__icon">
                <Icon name={tool.icon} size={15} />
              </span>
              <span>{tool.label}</span>
              <kbd>{tool.hint}</kbd>
            </button>
          ))}
      </div>
      <h2>Suggested</h2>
      <div className="ui-wst__card">
        {sources.map((source) => (
          <button
            type="button"
            className="ui-wst__source"
            key={source.id ?? source.artifact ?? source.name}
            onClick={() => onOpenSource?.(source)}
          >
            <span
              className="ui-wst__icon"
              data-kind={source.kind}
              onErrorCapture={(event) => {
                if (event.target instanceof HTMLImageElement) event.target.style.visibility = "hidden";
              }}
            >
              {source.icon ?? (
                <Icon
                  name={source.kind === "folder" ? "folder" : source.kind === "table" ? "table" : "document"}
                  size={15}
                />
              )}
            </span>
            <span>
              <strong dir="auto" title={source.name}>
                {source.name}
              </strong>
              {source.description && <small dir="auto">{source.description}</small>}
            </span>
          </button>
        ))}
        {sources.length === 0 && <p className="ui-wst__empty">No matching sources</p>}
      </div>
    </section>
  );
}

export type WorkspaceToolProps = {
  kind: WorkspaceToolKind;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  lines?: string[];
  defaultLines?: string[];
  onLinesChange?: (lines: string[]) => void;
  onOpenUrl?: (url: string) => void;
  className?: string;
};

/** Frontend tool surfaces; connect onOpenUrl or replace this tab with the application's real tools. */
export function WorkspaceTool({
  kind: rawKind,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  lines: linesProp,
  defaultLines = ["Fieldwork", "Type help to see available commands."],
  onLinesChange,
  onOpenUrl,
  className,
}: WorkspaceToolProps) {
  const kind = ["terminal", "browser", "notes"].includes(rawKind) ? rawKind : "notes";
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange),
    [lines, setLines] = useControllable(linesProp, defaultLines, onLinesChange);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);
  const run = () => {
    const command = value.trim();
    if (!command) return;
    setValue("");
    if (command === "clear") {
      setLines([]);
      return;
    }
    const result =
      command === "help"
        ? "Commands: help, pwd, ls, echo <text>, clear"
        : command === "pwd"
          ? "/workspace/fieldwork"
          : command === "ls"
            ? "Northwind  Platform  Evalkit"
            : command.startsWith("echo ")
              ? command.slice(5)
              : `${command.split(" ")[0]}: command not found. Type help for available commands.`;
    setLines([...lines, `$ ${command}`, result]);
  };
  return (
    <section
      className={["ui-wst", "ui-wst__tool-pane", className].filter(Boolean).join(" ")}
      data-tool={kind}
      aria-label={kind === "terminal" ? "Terminal" : kind === "browser" ? "Browser" : "Notes"}
    >
      <style href="ui-workspace-start" precedence="default">
        {css}
      </style>
      {kind === "notes" ? (
        <textarea
          aria-label="Notes"
          placeholder="Write a note…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : kind === "terminal" ? (
        <>
          <div className="ui-wst__terminal-output" ref={output} role="log" aria-live="polite">
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <form
            className="ui-wst__command"
            onSubmit={(event) => {
              event.preventDefault();
              run();
            }}
          >
            <span aria-hidden="true">$</span>
            <input
              aria-label="Terminal command"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </>
      ) : (
        <>
          <form
            className="ui-wst__search"
            onSubmit={(event) => {
              event.preventDefault();
              if (value.trim()) onOpenUrl?.(value.trim());
            }}
          >
            <Icon name="globe" size={14} />
            <input
              aria-label="Browser address"
              placeholder="Search or enter URL"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
            <button type="submit" aria-label="Open URL">
              <Icon name="arrow" size={14} />
            </button>
          </form>
          <div className="ui-wst__browser-home">
            <Icon name="globe" size={36} />
            <h2>Browser</h2>
            <p>Enter an address to open it.</p>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-wst {
  --ui-wst-card: #fff;
  --ui-wst-ink: rgba(0, 0, 0, 0.88);
  --ui-wst-muted: rgba(0, 0, 0, 0.45);
  --ui-wst-faint: rgba(0, 0, 0, 0.27);
  --ui-wst-line: rgba(0, 0, 0, 0.06);
  --ui-wst-fill: rgba(0, 0, 0, 0.04);
  --ui-wst-focus: #0060e2;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  color: var(--ui-wst-ink);
  font:
    13px/20px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  container: ui-wst / inline-size;
  -webkit-font-smoothing: antialiased;
}
.ui-wst,
.ui-wst *,
.ui-wst *::before,
.ui-wst *::after {
  box-sizing: border-box;
}
.ui-wst button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}
.ui-wst button:focus-visible {
  outline: 2px solid var(--ui-wst-focus);
  outline-offset: -2px;
}
.ui-wst button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-wst__search {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--ui-wst-card);
  box-shadow:
    0 0 0 0.5px var(--ui-wst-line),
    0 1px 2px rgba(0, 0, 0, 0.04);
  color: var(--ui-wst-faint);
  margin-bottom: 22px;
}
.ui-wst__search input {
  flex: 1;
  min-width: 0;
  width: 0;
  border: 0;
  outline: none;
  background: none;
  color: var(--ui-wst-ink);
  font: inherit;
}
.ui-wst__search:focus-within {
  box-shadow: 0 0 0 0.5px var(--ui-wst-muted);
}
.ui-wst__search input::placeholder {
  color: var(--ui-wst-faint);
}
.ui-wst h2 {
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-wst-muted);
  margin: 0 4px 8px;
}
.ui-wst__card {
  border-radius: 12px;
  box-shadow:
    0 0 0 0.5px var(--ui-wst-line),
    0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 2px 10px;
  margin-bottom: 22px;
}
.ui-wst__tool,
.ui-wst__source {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  text-align: left;
  padding: 8px 0 !important;
}
.ui-wst__tool + .ui-wst__tool,
.ui-wst__source + .ui-wst__source {
  border-top: 0.5px solid var(--ui-wst-line) !important;
}
.ui-wst__tool:hover,
.ui-wst__source:hover {
  background: var(--ui-wst-fill);
}
.ui-wst__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ui-wst-fill);
  color: var(--ui-wst-muted);
}
.ui-wst__icon[data-kind="folder"] {
  color: #e8b000;
}
.ui-wst__icon[data-kind="table"] {
  color: #44ad76;
}
.ui-wst__icon[data-kind="document"] {
  color: #2989df;
}
.ui-wst__tool > kbd {
  font: 11px/20px inherit;
  font-family: inherit;
  background: var(--ui-wst-fill);
  border-radius: 5px;
  padding: 0 5px;
  color: var(--ui-wst-faint);
  margin-left: auto;
}
.ui-wst__source > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ui-wst__source strong {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-wst__source small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-wst-muted);
}
.ui-wst__empty {
  font-size: 12px;
  color: var(--ui-wst-muted);
  padding: 12px 0;
  margin: 0;
}
.ui-wst__tool-pane {
  display: flex;
  flex-direction: column;
}
.ui-wst__tool-pane[data-tool="notes"] textarea {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 0;
  background: none;
  resize: none;
  outline: none;
  font:
    13px/1.7 "Inter",
    ui-sans-serif,
    system-ui,
    sans-serif;
  color: var(--ui-wst-ink);
}
.ui-wst__terminal-output {
  flex: 1;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font:
    12px/1.8 ui-monospace,
    "SF Mono",
    Menlo,
    monospace;
}
.ui-wst__command {
  display: flex;
  align-items: center;
  gap: 8px;
  font:
    12px/1.8 ui-monospace,
    "SF Mono",
    Menlo,
    monospace;
  padding-top: 8px;
}
.ui-wst__command input {
  width: 0;
  flex: 1;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
}
.ui-wst__browser-home {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--ui-wst-faint);
  gap: 12px;
}
.ui-wst__browser-home h2 {
  font-size: 18px;
  margin: 0;
}
.ui-wst__browser-home p {
  font-size: 12px;
  margin: 0;
}
.ui-wst__search > button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
}
@media (pointer: coarse) {
  .ui-wst__search {
    min-height: 40px;
  }
  .ui-wst input,
  .ui-wst textarea {
    font-size: 16px;
  }
  .ui-wst__tool,
  .ui-wst__source {
    min-height: 48px;
  }
  .ui-wst__tool > kbd {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wst,
  .ui-wst * {
    animation: none !important;
    transition: none !important;
  }
}
:where(.dark, [data-theme="dark"]) .ui-wst {
  --ui-wst-card: #1c1c1e;
  --ui-wst-ink: rgba(255, 255, 255, 0.9);
  --ui-wst-muted: rgba(255, 255, 255, 0.46);
  --ui-wst-faint: rgba(255, 255, 255, 0.3);
  --ui-wst-line: rgba(255, 255, 255, 0.08);
  --ui-wst-fill: rgba(255, 255, 255, 0.06);
  --ui-wst-focus: #4d8dff;
}
.ui-wst {
  --ui-wst-ink: #171717;
  --ui-wst-muted: #737373;
  --ui-wst-faint: #b5b5b5;
  --ui-wst-line: #e5e5e5;
  --ui-wst-fill: #f5f5f5;
  --ui-wst-focus: #2f6bff;
  font-size: 14px;
}
.ui-wst__card {
  border: 1px solid var(--ui-wst-line);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
:where(.dark, [data-theme="dark"]) .ui-wst {
  --ui-wst-card: #232326;
  --ui-wst-ink: #ededed;
  --ui-wst-muted: #8f8f8f;
  --ui-wst-faint: #6b6b70;
  --ui-wst-line: rgba(255, 255, 255, 0.1);
  --ui-wst-fill: #2a2a2d;
  --ui-wst-focus: #6b95ff;
}

`;
