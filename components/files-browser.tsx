"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/*
 * files-browser (Classic) – a self-contained React 19 component.
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

function moveMenuFocus(event: KeyboardEvent<HTMLElement>) {
  if ((event.target as HTMLElement).matches("input,textarea")) return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),[role="option"][tabindex]'),
  ].filter(
    (el) =>
      !el.closest("[inert],[hidden]") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden" &&
      (!event.currentTarget.matches('[role="menu"]') || el.closest('[role="menu"]') === event.currentTarget),
  );
  const index = items.indexOf(document.activeElement as HTMLElement);
  const next =
    event.key === "ArrowDown"
      ? (index + 1) % items.length
      : event.key === "ArrowUp"
        ? (index - 1 + items.length) % items.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : null;
  if (next === null || !items.length) return;
  event.preventDefault();
  items[next]?.focus();
}

export type FilesFolder = { id: string; name: string; shared: boolean; fileCount: number };
export type FilesTemplate = {
  id: string;
  name: string;
  type: "Document" | "PDF" | "Spreadsheet";
  owner: string;
  shared: boolean;
  mine: boolean;
};
export type FilesBrowserProps = {
  folders?: FilesFolder[];
  defaultFolders?: FilesFolder[];
  onFoldersChange?: (folders: FilesFolder[]) => void;
  templates?: FilesTemplate[];
  defaultTemplates?: FilesTemplate[];
  onTemplatesChange?: (templates: FilesTemplate[]) => void;
  onOpenFolder?: (folder: FilesFolder) => void;
  onOpenTemplate?: (template: FilesTemplate) => void;
  currentUser?: string;
  learnMoreHref?: string;
  className?: string;
};
export const defaultFilesFolders: FilesFolder[] = [
  { id: "brand", name: "Brand assets", shared: true, fileCount: 3 },
  { id: "hiring", name: "Hiring", shared: false, fileCount: 4 },
  { id: "campaign", name: "Q3 Campaign", shared: true, fileCount: 5 },
  { id: "research", name: "Research", shared: false, fileCount: 2 },
];
export const defaultFilesTemplates: FilesTemplate[] = [
  { id: "guidelines", name: "Brand-Guidelines", type: "PDF", owner: "Jonas Weber", shared: true, mine: false },
  { id: "budget", name: "Campaign-Budget", type: "Spreadsheet", owner: "Jonas Weber", shared: true, mine: false },
  { id: "design", name: "Design-Book", type: "Document", owner: "Alex Morgan", shared: false, mine: true },
  { id: "report", name: "Weekly-Report", type: "Spreadsheet", owner: "Alex Morgan", shared: false, mine: true },
];
const filesGlyphs = {
  sort: (
    <>
      <path d="M7 4v16M17 19V4M10 7s-2.21-3-3-3-3 3-3 3M20 17s-2.21 3-3 3-3-3-3-3" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2.5" />
      <rect x="14" y="3" width="7" height="7" rx="2.5" />
      <rect x="3" y="14" width="7" height="7" rx="2.5" />
      <rect x="14" y="14" width="7" height="7" rx="2.5" />
    </>
  ),
  list: (
    <>
      <path d="M9 5h12M9 12h12M9 19h12" />
      <path d="M3 5h.01M3 12h.01M3 19h.01" strokeWidth="3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m17 17 4 4" />
    </>
  ),
  filter: (
    <path d="M3.3 3.5C3.8 3 4.6 3 6.2 3h11.6c1.6 0 2.4 0 2.9.5s.3 1.3.1 2.9c0 .5-.2.7-.5 1.1-1 1.1-2.8 3.2-5.2 5-.3.2-.4.5-.4.8-.3 2.7-.5 4.2-.6 4.9-.3 1.3-2 2-2.9 2.7-.5.4-1.2-.1-1.3-.7-.1-1.2-.4-3.5-.6-6.9 0-.3-.2-.6-.4-.8-2.5-1.9-4.3-3.9-5.3-5-.3-.4-.4-.6-.5-1.1-.2-1.6-.3-2.4.2-2.9Z" />
  ),
  lock: (
    <>
      <path d="M12 14.5v3M16.5 9V6.5a4.5 4.5 0 0 0-9 0V9" />
      <rect x="4" y="9" width="16" height="13" rx="4" />
    </>
  ),
  shared: (
    <>
      <circle cx="14.5" cy="7" r="4" />
      <path d="M8 11a3 3 0 0 1 0-6M14.5 14C9.81 14 7 16.5 7 19c0 1.1.84 2 1.88 2h11.25c1.03 0 1.87-.9 1.87-2 0-2.5-2.81-5-7.5-5ZM4 20h-.5C2.67 20 2 19.23 2 18.28c0-1.61 1.27-3.22 3.5-3.92" />
    </>
  ),
};
function FilesGlyph({ name, size = 15 }: { name: keyof typeof filesGlyphs; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {filesGlyphs[name]}
    </svg>
  );
}
function FilesTabs({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null),
    [pill, setPill] = useState({ x: 0, width: 35 });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const button = root.querySelector<HTMLElement>('[aria-selected="true"]');
      if (button) setPill({ x: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div
      ref={ref}
      className="ui-fbr__tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={(event) => {
        const index = items.indexOf(value),
          next =
            event.key === "ArrowRight"
              ? (index + 1) % items.length
              : event.key === "ArrowLeft"
                ? (index - 1 + items.length) % items.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : -1;
        if (next < 0) return;
        event.preventDefault();
        const item = items[next];
        if (item) onChange(item);
        ref.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
      }}
    >
      <span
        className="ui-fbr__pill"
        aria-hidden="true"
        style={{ transform: `translateX(${pill.x}px)`, width: pill.width }}
      />
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          aria-selected={value === item}
          tabIndex={value === item ? 0 : -1}
          key={item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
function FilesSearch({
  kind,
  value,
  onChange,
}: {
  kind: "folders" | "templates";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <span className="ui-fbr__search">
      <FilesGlyph name="search" />
      <input
        type="search"
        aria-label={`Search ${kind}...`}
        placeholder={`Search ${kind}...`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" aria-label={`Clear ${kind} search`} onClick={() => onChange("")}>
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
function FilesSort({ descending, onChange }: { descending: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      className="ui-fbr__tool ui-fbr__sort"
      data-dir={descending ? "desc" : "asc"}
      aria-label={descending ? "Sorted Z to A – sort A to Z" : "Sorted A to Z – sort Z to A"}
      title={descending ? "Z–A" : "A–Z"}
      onClick={() => onChange(!descending)}
    >
      <FilesGlyph name="sort" />
    </button>
  );
}
function FilesFolderMark() {
  return (
    <svg className="ui-fbr__folder-mark" viewBox="0 0 67 67" fill="none" aria-hidden="true">
      <path
        d="M11.17 15.35v15.36h44.67v-6.98c0-3.86-3.13-6.98-6.98-6.98H33.5l-3.93-5.89a5.58 5.58 0 0 0-4.64-2.49h-6.78c-3.86 0-6.98 3.13-6.98 6.98Z"
        fill="#00A1FF"
      />
      <path
        d="M33.5 16.75l-3.93-5.89a5.58 5.58 0 0 0-4.64-2.49h-6.78c-3.86 0-6.98 3.13-6.98 6.98v15.36h44.67v-6.98c0-3.86-3.13-6.98-6.98-6.98H33.5Zm0 0h-9.77"
        stroke="#00A1FF"
        strokeWidth="4.19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.59 42.38c-1.05-5.26-1.57-7.89-.08-9.67l.31-.34c1.66-1.66 4.59-1.66 10.45-1.66h32.46c5.86 0 8.79 0 10.45 1.66l.31.34c1.49 1.78.97 4.41-.08 9.67-1.51 7.56-2.26 11.34-5.1 13.66l-.6.46c-3.01 2.13-7.23 2.13-15.66 2.13h-11.1c-8.43 0-12.64 0-15.66-2.13l-.6-.46c-2.84-2.32-3.6-6.1-5.1-13.66Z"
        fill="#3CC7FF"
        stroke="#3CC7FF"
        strokeWidth="4.19"
      />
    </svg>
  );
}
function FilesDocument({ type }: { type: FilesTemplate["type"] }) {
  const code = type === "PDF" ? "PDF" : type === "Spreadsheet" ? "XLS" : "DOC";
  const rows =
    type === "PDF"
      ? [[100], [48, 48], [31, 62]]
      : type === "Spreadsheet"
        ? Array.from({ length: 5 }, () => [31, 31, 31])
        : [[100], [31, 31, 31], [48, 48], [31, 31, 31], [24, 48, 24], [31, 31]];
  return (
    <span
      className="ui-fbr__doc"
      data-color={type === "PDF" ? "rose" : type === "Spreadsheet" ? "emerald" : "blue"}
      aria-hidden="true"
    >
      <span className="ui-fbr__art">
        <span className="ui-fbr__paper" data-type={code}>
          {type === "PDF" && <span className="ui-fbr__image" />}
          <span className="ui-fbr__rows">
            {rows.map((widths, row) => (
              <span className="ui-fbr__row" key={row}>
                {widths.map((width, col) => (
                  <i key={col} style={{ width: `${width}%` }} />
                ))}
              </span>
            ))}
          </span>
        </span>
        <span className="ui-fbr__type">{code}</span>
      </span>
    </span>
  );
}
function FilesEmpty({ folders, query }: { folders?: boolean; query?: string }) {
  return (
    <div className="ui-fbr__empty ui-fbr__rise">
      <span className="ui-fbr__empty-icon">
        <Icon name={folders ? "folder" : "document"} size={23} />
      </span>
      <b>No {folders ? "folders" : "templates"} found</b>
      <p>
        {folders
          ? query
            ? `Nothing matches “${query}”.`
            : "No folders in this tab yet."
          : "Try another tab, type or search."}
      </p>
    </div>
  );
}

/** Files overview with independent folder/template filters. Arrays may be caller-owned; open callbacks do not invent a destination. */
export function FilesBrowser({
  folders: foldersProp,
  defaultFolders = defaultFilesFolders,
  onFoldersChange,
  templates: templatesProp,
  defaultTemplates = defaultFilesTemplates,
  onTemplatesChange,
  onOpenFolder,
  onOpenTemplate,
  currentUser = "Alex Morgan",
  learnMoreHref = "#learn-more",
  className,
}: FilesBrowserProps) {
  const [folders, setFolders] = useControllable(foldersProp, defaultFolders, onFoldersChange),
    [templates, setTemplates] = useControllable(templatesProp, defaultTemplates, onTemplatesChange);
  const [folderTab, setFolderTab] = useState("All"),
    [templateTab, setTemplateTab] = useState("All"),
    [folderQuery, setFolderQuery] = useState(""),
    [templateQuery, setTemplateQuery] = useState("");
  const [folderDesc, setFolderDesc] = useState(false),
    [templateDesc, setTemplateDesc] = useState(false),
    [view, setView] = useState("grid"),
    [types, setTypes] = useState<FilesTemplate["type"][]>([]);
  const [filterOpen, setFilterOpen] = useState(false),
    [groupOpen, setGroupOpen] = useState(true);
  const root = useRef<HTMLDivElement>(null),
    filter = useRef<HTMLButtonElement>(null),
    popup = useRef<HTMLDivElement>(null),
    sequence = useRef(0),
    id = useId();
  useLayoutEffect(() => {
    if (!filterOpen) return;
    const update = () => {
      const button = filter.current,
        menu = popup.current;
      if (!button || !menu) return;
      const anchor = button.getBoundingClientRect(),
        boundary = root.current?.closest("[data-overlay-boundary]")?.getBoundingClientRect();
      const left = Math.max(
        (boundary?.left ?? 0) + 16,
        Math.min(anchor.right - menu.offsetWidth, (boundary?.right ?? window.innerWidth) - 16 - menu.offsetWidth),
      );
      menu.style.left = `${left - anchor.left}px`;
      menu.style.right = "auto";
      const above =
        anchor.bottom + 6 + menu.offsetHeight >
          Math.min(boundary?.bottom ?? window.innerHeight, window.innerHeight) - 8 &&
        anchor.top > menu.offsetHeight + 8;
      menu.style.top = above ? `${-menu.offsetHeight - 6}px` : "calc(100% + 6px)";
    };
    update();
    const observer = new ResizeObserver(update);
    if (popup.current) observer.observe(popup.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [filterOpen]);
  useEffect(() => {
    if (!filterOpen) return;
    (
      popup.current?.querySelector<HTMLElement>('[role="checkbox"][aria-checked="true"]') ??
      popup.current?.querySelector<HTMLElement>('[role="checkbox"]')
    )?.focus({ preventScroll: true });
    const close = (event: PointerEvent) => {
      if (!popup.current?.contains(event.target as Node) && !filter.current?.contains(event.target as Node))
        setFilterOpen(false);
    };
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setFilterOpen(false);
        filter.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("keydown", key, true);
    };
  }, [filterOpen]);
  const shownFolders = folders
    .filter(
      (item) =>
        (folderTab === "All" || item.shared === (folderTab === "Shared")) &&
        item.name.toLowerCase().includes(folderQuery.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (folderDesc ? -1 : 1));
  const shownTemplates = templates
    .filter(
      (item) =>
        (templateTab === "All" || (templateTab === "Mine" ? item.mine : item.shared && !item.mine)) &&
        (!types.length || types.includes(item.type)) &&
        item.name.toLowerCase().includes(templateQuery.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (templateDesc ? -1 : 1));
  const uniqueName = (base: string, items: { name: string }[]) => {
    let name = base,
      n = 2;
    while (items.some((item) => item.name === name)) name = `${base} ${n++}`;
    return name;
  };
  const toggleType = (type: FilesTemplate["type"]) =>
    setTypes(types.includes(type) ? types.filter((item) => item !== type) : [...types, type]);
  const createFolder = () => {
    setFolders([
      ...folders,
      {
        id: `${id}-folder-${++sequence.current}`,
        name: uniqueName("Untitled folder", folders),
        shared: false,
        fileCount: 0,
      },
    ]);
    setFolderTab("All");
    setFolderQuery("");
  };
  const addTemplate = () => {
    setTemplates([
      ...templates,
      {
        id: `${id}-template-${++sequence.current}`,
        name: uniqueName("Untitled", templates),
        type: "Document",
        owner: currentUser,
        shared: false,
        mine: true,
      },
    ]);
    setTemplateTab("All");
    setTemplateQuery("");
    setTypes([]);
  };
  return (
    <div ref={root} className={["ui-fbr", className].filter(Boolean).join(" ")}>
      <style href="ui-files-browser" precedence="default">
        {css}
      </style>
      <h1 className="ui-fbr__title">Files</h1>
      <p className="ui-fbr__sub">
        See files you recently used in chats and manage files saved in folders. <a href={learnMoreHref}>Learn more</a>
      </p>
      <div className="ui-fbr__head">
        <h2 id={`${id}-folders`}>
          Folders<span>{shownFolders.length}</span>
        </h2>
        <div className="ui-fbr__toolbar">
          <div className="ui-fbr__left">
            <FilesTabs label="Folders" items={["All", "Shared", "Private"]} value={folderTab} onChange={setFolderTab} />
          </div>
          <div className="ui-fbr__right">
            <FilesSort descending={folderDesc} onChange={setFolderDesc} />
            <div
              className="ui-fbr__view"
              role="radiogroup"
              aria-label="View"
              data-view={view}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === "Home" ? "grid" : event.key === "End" ? "list" : view === "grid" ? "list" : "grid";
                setView(next);
                event.currentTarget
                  .querySelector<HTMLButtonElement>(`[aria-label="${next === "grid" ? "Grid" : "List"}"]`)
                  ?.focus();
              }}
            >
              <span className="ui-fbr__view-pill" aria-hidden="true" />
              {(["grid", "list"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  role="radio"
                  aria-label={value === "grid" ? "Grid" : "List"}
                  aria-checked={view === value}
                  tabIndex={view === value ? 0 : -1}
                  onClick={() => setView(value)}
                >
                  <FilesGlyph name={value} />
                </button>
              ))}
            </div>
            <FilesSearch kind="folders" value={folderQuery} onChange={setFolderQuery} />
            <button type="button" className="ui-fbr__add ui-fbr__add--primary" onClick={createFolder}>
              <Icon name="plus" size={15} />
              <span>Create folder</span>
            </button>
          </div>
        </div>
      </div>
      {shownFolders.length ? (
        <div
          className="ui-fbr__folders"
          data-view={view}
          aria-labelledby={`${id}-folders`}
          key={`${folderTab}:${folderQuery}:${folderDesc}:${view}:${folders.length}`}
        >
          {shownFolders.map((folder, index) => (
            <button
              type="button"
              className="ui-fbr__folder ui-fbr__rise"
              key={folder.id}
              style={{ "--i": index } as CSSProperties}
              onClick={() => onOpenFolder?.(folder)}
            >
              <FilesFolderMark />
              <span className="ui-fbr__folder-text">
                <b title={folder.name}>{folder.name}</b>
                <span className="ui-fbr__meta">
                  <FilesGlyph name={folder.shared ? "shared" : "lock"} size={12} />
                  {folder.shared ? "Shared" : "Private"} · {folder.fileCount}{" "}
                  {folder.fileCount === 1 ? "file" : "files"}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <FilesEmpty folders query={folderQuery} />
      )}
      <div className="ui-fbr__head">
        <h2 id={`${id}-templates`}>
          File templates<span>{shownTemplates.length}</span>
        </h2>
        <div className="ui-fbr__toolbar">
          <div className="ui-fbr__left">
            <FilesTabs
              label="File templates"
              items={["All", "Mine", "Shared with me"]}
              value={templateTab}
              onChange={setTemplateTab}
            />
          </div>
          <div className="ui-fbr__right">
            <span className="ui-fbr__anchor">
              <button
                ref={filter}
                type="button"
                className="ui-fbr__tool ui-fbr__filter-trigger"
                aria-expanded={filterOpen}
                aria-haspopup="dialog"
                aria-controls={filterOpen ? `${id}-filter` : undefined}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FilesGlyph name="filter" />
                Type
                {types.length ? (
                  <span className="ui-fbr__badge" key={types.length}>
                    {types.length}
                  </span>
                ) : (
                  <Icon name="chevron" size={13} />
                )}
              </button>
              {filterOpen && (
                <div
                  ref={popup}
                  id={`${id}-filter`}
                  role="dialog"
                  aria-label="Filter templates by type"
                  className="ui-fbr__filter"
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "ArrowUp" ||
                      event.key === "Home" ||
                      event.key === "End"
                    )
                      moveMenuFocus(event);
                  }}
                >
                  <div className="ui-fbr__filter-head">
                    <b>Type</b>
                    <button type="button" disabled={!types.length} onClick={() => setTypes([])}>
                      Clear all
                    </button>
                  </div>
                  <div className="ui-fbr__chips" style={{ height: types.length ? 36 : 0 }}>
                    <div>
                      {types.map((type) => (
                        <span key={type}>
                          {type}
                          <button type="button" aria-label={`Remove ${type}`} onClick={() => toggleType(type)}>
                            <Icon name="close" size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ui-fbr__filter-group">
                    <button
                      type="button"
                      className="ui-fbr__group-head"
                      aria-expanded={groupOpen}
                      aria-controls={`${id}-types`}
                      onClick={() => setGroupOpen(!groupOpen)}
                    >
                      <Icon name="chevron" size={16} />
                      <b>Type</b>
                      <span>3</span>
                      {!!types.length && (
                        <small>
                          {types.length} {types.length === 1 ? "filter" : "filters"}
                        </small>
                      )}
                    </button>
                    <div className="ui-fbr__filter-panel" data-open={groupOpen || undefined}>
                      <div id={`${id}-types`} role="group" aria-label="Type" inert={!groupOpen}>
                        {(["Document", "PDF", "Spreadsheet"] as const).map((type) => (
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={types.includes(type)}
                            key={type}
                            onClick={() => toggleType(type)}
                          >
                            <span className="ui-fbr__check" aria-hidden="true">
                              <svg viewBox="0 0 16 16">
                                <path d="m4.25 8.25 2.5 2.5 5-5.5" />
                              </svg>
                            </span>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </span>
            <FilesSort descending={templateDesc} onChange={setTemplateDesc} />
            <FilesSearch kind="templates" value={templateQuery} onChange={setTemplateQuery} />
            <button type="button" className="ui-fbr__add" onClick={addTemplate}>
              <Icon name="plus" size={15} />
              <span>Add template</span>
            </button>
          </div>
        </div>
      </div>
      {shownTemplates.length ? (
        <div
          className="ui-fbr__templates"
          aria-labelledby={`${id}-templates`}
          key={`${templateTab}:${templateQuery}:${templateDesc}:${types.join()}`}
        >
          {shownTemplates.map((template, index) => (
            <div className="ui-fbr__rise" key={template.id} style={{ "--i": index } as CSSProperties}>
              <button
                type="button"
                title={template.name}
                className="ui-fbr__template"
                onClick={() => onOpenTemplate?.(template)}
              >
                <span className="ui-fbr__preview">
                  <FilesDocument type={template.type} />
                </span>
                <b className="ui-fbr__template-name">{template.name}</b>
                <span className="ui-fbr__meta">
                  <span className="ui-fbr__file-meta">
                    {template.type} · {template.owner}
                  </span>
                  <span className="ui-fbr__access">
                    <FilesGlyph name={template.shared ? "shared" : "lock"} size={12} />
                    {template.shared ? "Shared" : "Private"}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <FilesEmpty />
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-fbr {
  --ui-fbr-card: #fff;
  --ui-fbr-strong: #000;
  --ui-fbr-ink: rgba(0, 0, 0, 0.88);
  --ui-fbr-text: rgba(0, 0, 0, 0.61);
  --ui-fbr-muted: rgba(0, 0, 0, 0.45);
  --ui-fbr-faint: rgba(0, 0, 0, 0.27);
  --ui-fbr-line: rgba(0, 0, 0, 0.06);
  --ui-fbr-edge: rgba(0, 0, 0, 0.1);
  --ui-fbr-chip: rgba(0, 0, 0, 0.04);
  --ui-fbr-frame: rgba(0, 0, 0, 0.02);
  --ui-fbr-select: rgba(0, 0, 0, 0.055);
  --ui-fbr-accent: rgba(0, 96, 226, 0.765);
  --ui-fbr-shadow: 0 0 0 0.5px var(--ui-fbr-line), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-fbr-lift: 0 0 0 0.5px var(--ui-fbr-edge), 0 2px 6px -1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);
  --ui-fbr-ease: cubic-bezier(0.22, 1, 0.36, 1);
  padding: 46px 32px 56px;
  font:
    400 13px/20px Inter,
    InterVariable,
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  color: var(--ui-fbr-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-fbr,
.ui-fbr *,
.ui-fbr ::before,
.ui-fbr ::after {
  box-sizing: border-box;
}
.ui-fbr button {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ui-fbr svg {
  display: block;
  flex: none;
}
.ui-fbr button:focus-visible,
.ui-fbr a:focus-visible {
  outline: 2px solid var(--ui-fbr-accent);
  outline-offset: 2px;
}
.ui-fbr button:active {
  transform: none;
}
.ui-fbr__title {
  margin: 0;
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: -0.24px;
  color: var(--ui-fbr-strong);
}
.ui-fbr__sub {
  margin: 4px 0 0;
  color: var(--ui-fbr-text);
}
.ui-fbr__sub a {
  color: inherit;
  text-decoration-color: var(--ui-fbr-edge);
  text-underline-offset: 3px;
}
.ui-fbr__sub a:hover {
  color: var(--ui-fbr-ink);
  text-decoration-color: currentColor;
}
.ui-fbr__head {
  margin-top: 36px;
}
.ui-fbr__head h2 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--ui-fbr-muted);
}
.ui-fbr__head h2 > span {
  color: var(--ui-fbr-faint);
  font-variant-numeric: tabular-nums;
}
.ui-fbr__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
}
.ui-fbr__left,
.ui-fbr__right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ui-fbr__tabs {
  position: relative;
  display: flex;
  gap: 8px;
}
.ui-fbr__pill {
  position: absolute;
  top: 0;
  left: 0;
  height: 28px;
  border-radius: 6px;
  background: var(--ui-fbr-select);
  transition:
    transform 340ms var(--ui-fbr-ease),
    width 340ms var(--ui-fbr-ease);
}
.ui-fbr__tabs button {
  position: relative;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  color: var(--ui-fbr-text);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  transition: color 140ms;
}
.ui-fbr__tabs button:hover,
.ui-fbr__tabs button[aria-selected="true"] {
  color: var(--ui-fbr-ink);
}
.ui-fbr .ui-fbr__tool {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  color: var(--ui-fbr-text);
  transition:
    box-shadow 140ms,
    color 140ms;
}
.ui-fbr__tool svg {
  color: var(--ui-fbr-muted);
}
.ui-fbr .ui-fbr__tool:hover {
  box-shadow: var(--ui-fbr-lift);
  color: var(--ui-fbr-ink);
}
.ui-fbr .ui-fbr__filter-trigger {
  padding: 0 10px;
}
.ui-fbr__sort svg {
  transition: transform 360ms var(--ui-fbr-ease);
}
.ui-fbr__sort[data-dir="desc"] svg {
  transform: rotate(180deg);
}
.ui-fbr__view {
  position: relative;
  display: flex;
  gap: 2px;
  height: 28px;
  padding: 2px;
  border-radius: 6px;
  background: var(--ui-fbr-chip);
}
.ui-fbr__view button {
  position: relative;
  display: grid;
  place-items: center;
  width: 28px;
  border-radius: 4px;
  color: var(--ui-fbr-faint);
  transition: color 160ms;
}
.ui-fbr__view button:hover,
.ui-fbr__view button[aria-checked="true"] {
  color: var(--ui-fbr-ink);
}
.ui-fbr__view-pill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: 28px;
  border-radius: 4px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  transition: transform 320ms var(--ui-fbr-ease);
}
.ui-fbr__view[data-view="list"] .ui-fbr__view-pill {
  transform: translateX(30px);
}
.ui-fbr__search {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 172px;
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  color: var(--ui-fbr-muted);
  transition: box-shadow 140ms;
}
.ui-fbr__search:hover {
  box-shadow: var(--ui-fbr-lift);
}
.ui-fbr__search:focus-within {
  box-shadow: 0 0 0 1px var(--ui-fbr-accent);
}
.ui-fbr__search input {
  appearance: none;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none !important;
  background: transparent;
  font: inherit;
  color: var(--ui-fbr-ink);
}
.ui-fbr__search input::placeholder {
  color: var(--ui-fbr-faint);
}
.ui-fbr__search input::-webkit-search-cancel-button {
  display: none;
}
.ui-fbr__search button {
  flex: none;
  border-radius: 4px;
  color: var(--ui-fbr-muted);
}
.ui-fbr .ui-fbr__add {
  --ui-fbr-add-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.07);
  --ui-fbr-solid-hover: rgba(0, 0, 0, 0.8);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px 0 6px;
  overflow: clip;
  border-radius: 6px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  transition:
    background-color 140ms,
    color 140ms,
    box-shadow 140ms,
    transform 160ms var(--ui-fbr-ease),
    opacity 140ms;
}
.ui-fbr .ui-fbr__add:hover {
  box-shadow: var(--ui-fbr-add-hover);
}
.ui-fbr .ui-fbr__add--primary {
  background: var(--ui-fbr-ink);
  color: var(--ui-fbr-card);
  box-shadow: none;
}
.ui-fbr .ui-fbr__add--primary:hover {
  background: var(--ui-fbr-solid-hover);
  box-shadow: none;
}
.ui-fbr .ui-fbr__add:active {
  transform: scale(0.97);
}
.ui-fbr__add > svg {
  width: 14px;
  height: 14px;
  color: var(--ui-fbr-muted);
  animation: ui-fbr-add-icon 520ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
.ui-fbr__add--primary > svg {
  color: inherit;
}
.ui-fbr__add > span {
  animation: ui-fbr-add-label 480ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
@keyframes ui-fbr-add-icon {
  from {
    opacity: 0;
    transform: scale(0.7);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
@keyframes ui-fbr-add-label {
  from {
    opacity: 0;
    transform: translateY(25%);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}
.ui-fbr__folders {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 11px;
  margin-top: 16px;
}
.ui-fbr .ui-fbr__folder {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 14px 0 12px;
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  text-align: left;
  transition: box-shadow 160ms;
}
.ui-fbr .ui-fbr__folder:hover {
  box-shadow: var(--ui-fbr-lift);
}
.ui-fbr__folder-mark {
  flex: none;
  width: 26px;
  height: 26px;
  transition: transform 320ms var(--ui-fbr-ease);
}
.ui-fbr__folder:hover .ui-fbr__folder-mark {
  transform: translateY(-1px) scale(1.04);
}
.ui-fbr__folder-text {
  display: grid;
  min-width: 0;
}
.ui-fbr__folder-text > b {
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-fbr__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-fbr-muted);
  white-space: nowrap;
}
.ui-fbr__meta svg {
  color: var(--ui-fbr-faint);
}
.ui-fbr__folders[data-view="list"] {
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
}
.ui-fbr__folders[data-view="list"] .ui-fbr__folder {
  height: 48px;
}
.ui-fbr__templates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}
.ui-fbr__template {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 239px;
  text-align: left;
}
.ui-fbr__preview {
  display: block;
  height: 152px;
  padding: 3px;
  border-radius: 12px;
  background: var(--ui-fbr-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  transition: box-shadow 160ms;
}
.ui-fbr__template:hover .ui-fbr__preview {
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-edge);
}
.ui-fbr__template-name {
  margin-top: 8px;
  overflow: hidden;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-fbr__template .ui-fbr__meta {
  gap: 0;
}
.ui-fbr__file-meta {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-fbr__access {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
}
.ui-fbr__access::before {
  content: "·";
  margin: 0 4px;
}
.ui-fbr__doc {
  --ui-fbr-tag: #3b82f6;
  --ui-fbr-tag-shade: 30, 64, 175;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
}
.ui-fbr__doc[data-color="rose"] {
  --ui-fbr-tag: #f43f5e;
  --ui-fbr-tag-shade: 159, 18, 57;
}
.ui-fbr__doc[data-color="emerald"] {
  --ui-fbr-tag: #10b981;
  --ui-fbr-tag-shade: 6, 95, 70;
}
.ui-fbr__art {
  position: relative;
  display: block;
  width: 52px;
  translate: 4px;
}
.ui-fbr__paper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 10px 22px;
  border-radius: 5px 9px 5px 5px;
  corner-top-right-shape: bevel;
  background: var(--ui-fbr-card);
  box-shadow:
    0 0 0 1px var(--ui-fbr-edge),
    0 4px 8px -2px rgba(0, 0, 0, 0.065),
    0 2px 3px -2px rgba(0, 0, 0, 0.065);
  transition: transform 420ms var(--ui-fbr-ease);
}
.ui-fbr__rows {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ui-fbr__row {
  display: flex;
  gap: 3px;
}
.ui-fbr__row i {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: color-mix(in srgb, var(--ui-fbr-ink) 10%, transparent);
}
.ui-fbr__paper[data-type="XLS"] .ui-fbr__row:first-child i {
  background: color-mix(in srgb, var(--ui-fbr-ink) 22%, transparent);
}
.ui-fbr__image {
  display: block;
  height: 14px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--ui-fbr-ink) 6%, transparent);
}
.ui-fbr__type {
  position: absolute;
  left: -8px;
  bottom: 11px;
  z-index: 2;
  display: block;
  padding: 3.5px 4px 2.5px;
  border-radius: 3px;
  background: var(--ui-fbr-tag);
  box-shadow: 0 4px 8px -3px rgba(var(--ui-fbr-tag-shade), 0.3);
  font-size: 9px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  transition: transform 420ms var(--ui-fbr-ease);
}
@supports (text-box: cap alphabetic) {
  .ui-fbr__type {
    padding: 3.5px 4px;
    text-box: cap alphabetic;
  }
}
.ui-fbr__template:hover .ui-fbr__paper {
  transform: translateY(-2px);
}
.ui-fbr__template:hover .ui-fbr__type {
  transform: translate(-1px, -3px);
}
.ui-fbr__anchor {
  position: relative;
}
.ui-fbr__filter {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  right: 0;
  width: 300px;
  max-width: calc(100vw - 32px);
  border-radius: 10px;
  background: var(--ui-fbr-card);
  box-shadow: var(--ui-fbr-shadow);
  transform-origin: right top;
  animation: ui-fbr-popover 220ms var(--ui-fbr-ease);
}
.ui-fbr__filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 10px 8px 14px;
}
.ui-fbr__filter-head > b {
  font-weight: 500;
  color: var(--ui-fbr-strong);
}
.ui-fbr__filter-head > button {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  font-weight: 500;
  color: var(--ui-fbr-text);
}
.ui-fbr__filter-head > button:disabled {
  color: var(--ui-fbr-faint);
  cursor: default;
}
.ui-fbr__filter button:hover:not(:disabled) {
  background: var(--ui-fbr-frame);
}
.ui-fbr__chips {
  overflow: hidden;
  transition: height 320ms var(--ui-fbr-ease);
}
.ui-fbr__chips > div {
  display: flex;
  gap: 4px;
  padding: 0 14px 12px;
}
.ui-fbr__chips > div > span {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 24px;
  padding: 0 3px 0 8px;
  border-radius: 6px;
  background: var(--ui-fbr-select);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  animation: ui-fbr-chip 260ms var(--ui-fbr-ease) both;
}
.ui-fbr__chips button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  color: var(--ui-fbr-muted);
}
.ui-fbr__filter-group {
  padding: 4px;
  border-top: 0.5px solid var(--ui-fbr-line);
}
.ui-fbr__group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px !important;
  border-radius: 6px;
  text-align: left;
}
.ui-fbr__group-head > b {
  font-weight: 500;
}
.ui-fbr__group-head > svg {
  color: var(--ui-fbr-muted);
  transition: transform 260ms var(--ui-fbr-ease);
}
.ui-fbr__group-head[aria-expanded="false"] > svg {
  transform: rotate(-90deg);
}
.ui-fbr__group-head > span {
  font-size: 12px;
  color: var(--ui-fbr-faint);
}
.ui-fbr__group-head > small {
  margin-left: auto;
  font-size: 12px;
  color: var(--ui-fbr-muted);
}
.ui-fbr__filter-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 320ms var(--ui-fbr-ease);
}
.ui-fbr__filter-panel[data-open] {
  grid-template-rows: 1fr;
}
.ui-fbr__filter-panel > div {
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    opacity 220ms,
    padding 320ms var(--ui-fbr-ease);
}
.ui-fbr__filter-panel[data-open] > div {
  opacity: 1;
  padding-bottom: 4px;
}
.ui-fbr__filter-panel button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 8px 0 32px;
  border-radius: 6px;
  text-align: left;
}
.ui-fbr__check {
  display: grid;
  place-items: center;
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 4px;
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.22),
    0 1px 1px rgba(0, 0, 0, 0.04);
  transition:
    background-color 160ms,
    box-shadow 160ms;
}
.ui-fbr__check svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 12;
  stroke-dashoffset: 12;
  transition: stroke-dashoffset 240ms var(--ui-fbr-ease);
}
.ui-fbr [aria-checked="true"] .ui-fbr__check {
  background: var(--ui-fbr-accent);
  box-shadow: none;
}
.ui-fbr [aria-checked="true"] .ui-fbr__check svg {
  stroke-dashoffset: 0;
  transition-delay: 40ms;
}
.ui-fbr__badge {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--ui-fbr-select);
  font-size: 11px;
  animation: ui-fbr-pop 220ms var(--ui-fbr-ease);
}
.ui-fbr__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  padding: 48px 24px 52px;
  border-radius: 12px;
  background: var(--ui-fbr-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-fbr-line);
  text-align: center;
}
.ui-fbr__empty-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--ui-fbr-chip);
  color: var(--ui-fbr-muted);
}
.ui-fbr__empty > b {
  margin-top: 16px;
  font-weight: 500;
  color: var(--ui-fbr-strong);
}
.ui-fbr__empty p {
  max-width: 430px;
  margin: 4px 0 0;
  color: var(--ui-fbr-muted);
}
.ui-fbr__rise {
  animation: ui-fbr-rise 420ms var(--ui-fbr-ease) both;
  animation-delay: calc(var(--i, 0) * 35ms);
}
@keyframes ui-fbr-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes ui-fbr-popover {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}
@keyframes ui-fbr-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
@keyframes ui-fbr-chip {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
}
:where(.dark, [data-theme="dark"]) .ui-fbr {
  --ui-fbr-card: #1b1b1e;
  --ui-fbr-strong: #fff;
  --ui-fbr-ink: rgba(255, 255, 255, 0.9);
  --ui-fbr-text: rgba(255, 255, 255, 0.62);
  --ui-fbr-muted: rgba(255, 255, 255, 0.45);
  --ui-fbr-faint: rgba(255, 255, 255, 0.28);
  --ui-fbr-line: rgba(255, 255, 255, 0.08);
  --ui-fbr-edge: rgba(255, 255, 255, 0.14);
  --ui-fbr-chip: rgba(255, 255, 255, 0.06);
  --ui-fbr-frame: rgba(255, 255, 255, 0.03);
  --ui-fbr-select: rgba(255, 255, 255, 0.08);
  --ui-fbr-accent: #4d8dff;
  --ui-fbr-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-fbr-lift: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 2px 6px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-fbr .ui-fbr__add {
  --ui-fbr-add-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-fbr-solid-hover: rgba(255, 255, 255, 0.82);
}
@container ui-as (max-width:900px) {
  .ui-fbr {
    padding: 46px 24px 48px;
  }
  .ui-fbr__templates {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .ui-fbr__template {
    width: 100%;
  }
  .ui-fbr__template .ui-fbr__meta {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ui-fbr__file-meta,
  .ui-fbr__access {
    display: inline;
    overflow: visible;
  }
  .ui-fbr__access svg {
    display: inline-block;
    vertical-align: -2px;
    margin-right: 4px;
  }
  .ui-fbr__toolbar,
  .ui-fbr__right {
    flex-wrap: wrap;
    row-gap: 10px;
  }
}
@container ui-fls-main (max-width:760px) {
  .ui-fbr__folders {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@container ui-fls-main (max-width:480px) {
  .ui-fbr__folders {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
@container ui-as (max-width:600px) {
  .ui-fbr {
    padding: 52px 16px 40px;
  }
  .ui-fbr__title {
    font-size: 20px;
    line-height: 26px;
  }
  .ui-fbr__head {
    margin-top: 32px;
  }
  .ui-fbr__left,
  .ui-fbr__right {
    width: 100%;
  }
  .ui-fbr__right .ui-fbr__search {
    order: 9;
    flex: 1 1 100%;
    width: auto;
  }
  .ui-fbr__right > .ui-fbr__add:last-child {
    margin-left: auto;
  }
  .ui-fbr__tabs {
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ui-fbr__templates {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 10px;
  }
  .ui-fbr__preview {
    height: 128px;
  }
  .ui-fbr__empty {
    padding: 36px 18px 40px;
  }
}
@media (pointer: coarse) {
  .ui-fbr__search {
    height: 34px;
  }
  .ui-fbr__search input {
    font-size: 16px;
  }
  .ui-fbr .ui-fbr__add {
    height: 32px;
  }
  .ui-fbr__filter-panel button,
  .ui-fbr__group-head {
    height: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-fbr *,
  .ui-fbr ::before,
  .ui-fbr ::after {
    animation: none !important;
    transition: none !important;
  }
}

`;
