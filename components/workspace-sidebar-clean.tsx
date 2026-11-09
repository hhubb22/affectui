"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * workspace-sidebar (Clean) – a self-contained React 19 component.
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
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {iconPaths[name] ?? iconPaths.document}
    </svg>
  );
}

export type WorkspaceSidebarFooterProps = { workspace?: string; onNavigate?: (label: string) => void };
const workspaceNavGlyphs = {
  compose: (
    <>
      <path d="M16.4249 4.60509l.99-.99a2.1 2.1 0 0 1 2.97 2.97l-.99.99m-2.97-2.97-6.65932 6.65931a4 4 0 0 0-1.04161 1.8397L8 16l2.8959-.724a4 4 0 0 0 1.8397-1.0416l6.6593-6.65934m-2.97-2.97 2.97 2.97" />
      <path d="M19 13.5c0 3.2875 0 4.9312-.908 6.0376a4 4 0 0 1-.5545.5544C16.4312 21 14.7874 21 11.5 21H11c-3.77124 0-5.65684 0-6.82841-1.1716C3 18.6569 3 16.7712 3 13v-.5c0-3.28748 0-4.93121.90794-6.03756a4 4 0 0 1 .5545-.5545C5.56879 5 7.21252 5 10.5 5" />
    </>
  ),
  folder: (
    <path d="M8 7h8.75c2.1067 0 3.16 0 3.9167.50559a3 3 0 0 1 .8277.8277C22 9.08996 22 10.1433 22 12.25c0 3.5112 0 5.2667-.8427 6.5279a5 5 0 0 1-1.3794 1.3794C18.5167 21 16.7612 21 13.25 21H12c-4.71405 0-7.07107 0-8.53553-1.4645C2 18.0711 2 15.714 2 11V7.94427c0-1.81647 0-2.72471.38032-3.40621a3 3 0 0 1 1.15774-1.15774C4.21956 3 5.1278 3 6.94427 3c1.16375 0 1.74563 0 2.25499.19101 1.16294.43611 1.64254 1.49257 2.16734 2.54212L12 7" />
  ),
  integrations: (
    <>
      <rect x="3" y="3" width="7.5" height="9.5" rx="3" />
      <rect x="3" y="15.5" width="7.5" height="5.5" rx="2.75" />
      <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="3" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="2.75" />
    </>
  ),
  project: (
    <>
      <path d="M2.5 20V8.87695c0-1.2875 0-1.93125.28533-2.40647a2 2 0 0 1 .68515-.68515C3.9457 5.5 4.59449 5.5 5.89206 5.5c.63133 0 .947 0 1.23406.08819a2 2 0 0 1 .53857.25886C7.91289 6.01611 8.10859 6.26074 8.5 6.75c.39141.48926.58711.73389.83531.90295a2 2 0 0 0 .53857.25886C10.1609 8 10.4742 8 11.1008 8H15c1.4045 0 2.1067 0 2.6111.33706a2 2 0 0 1 .5518.5518C18.5 9.39331 18.5 10.0955 18.5 11.5" />
      <path d="m4.42028 14.0144-.7866 2c-.9775 2.4854-1.46625 3.7281-.88128 4.6069C3.33737 21.5 4.65337 21.5 7.28537 21.5h7.90493c1.2346 0 1.8519 0 2.3392-.3205.4874-.3205.7407-.893 1.2474-2.038l.8849-2c1.1248-2.5423 1.6872-3.8134 1.1061-4.7274C20.1868 11.5 18.8163 11.5 16.0752 11.5H8.07196c-1.28964 0-1.93446 0-2.43385.3439-.49939.3438-.73887.9527-1.21783 2.1705Z" />
      <path d="M11.5 4.51456c.9151-1.23047 2.1662-1.95862 4.0125-2.01295a4.16 4.16 0 0 1 1.7557.35383C18.5748 3.42601 19.4185 4.15644 20 5.5L21.5 3" />
    </>
  ),
};
function WorkspaceNavGlyph({ name }: { name: keyof typeof workspaceNavGlyphs }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {workspaceNavGlyphs[name]}
    </svg>
  );
}
export const defaultWorkspaceNavigation = [
  { label: "New chat", icon: <WorkspaceNavGlyph name="compose" /> },
  { label: "Folders", icon: <WorkspaceNavGlyph name="folder" /> },
  { label: "Integrations", icon: <WorkspaceNavGlyph name="integrations" /> },
];
const workspaceSetup = [
  { name: "Set up your workspace", items: ["Name your workspace", "Invite your teammates", "Connect your first app"] },
  { name: "Start working", items: ["Create a folder", "Start your first chat", "Upload a file"] },
  { name: "Make it yours", items: ["Add a profile picture", "Choose your notifications"] },
];
/** The shared news stack and expandable workspace checklist above the account menu. */
export function WorkspaceSidebarFooter({ workspace = "Acme", onNavigate }: WorkspaceSidebarFooterProps) {
  const [news, setNews] = useState(0),
    [guide, setGuide] = useState(false),
    [group, setGroup] = useState(0);
  const [guideHeight, setGuideHeight] = useState(70),
    content = useRef<HTMLDivElement>(null),
    steps = useRef<HTMLButtonElement>(null),
    close = useRef<HTMLButtonElement>(null),
    id = useId();
  useLayoutEffect(() => {
    const el = content.current;
    if (!el) return;
    const measure = () => setGuideHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!guide) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => close.current?.focus({ preventScroll: true }));
    });
    return () => cancelAnimationFrame(frame);
  }, [guide]);
  const closeGuide = () => {
    setGuide(false);
    requestAnimationFrame(() => steps.current?.focus({ preventScroll: true }));
  };
  return (
    <div className="ui-wsfc">
      <style href="ui-workspace-sidebar-clean" precedence="default">
        {css}
      </style>
      {news < 2 && (
        <div className="ui-wsfc__news" style={news ? { paddingTop: 0 } : undefined}>
          {news === 0 && (
            <div className="ui-wsfc__news-back" aria-hidden="true">
              <span>New in {workspace}</span>
              <Icon name="close" size={12} />
            </div>
          )}
          <div className="ui-wsfc__news-card">
            <div className="ui-wsfc__news-top">
              <span>New in {workspace}</span>
              <button type="button" aria-label="Dismiss" onClick={() => setNews(news + 1)}>
                <Icon name="close" size={12} />
              </button>
            </div>
            <b>{news === 0 ? "Shared folders" : "Scheduled chats"}</b>
            <button type="button" className="ui-wsfc__changelog" onClick={() => onNavigate?.("Changelog")}>
              Full changelog
              <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      )}
      <div className="ui-wsfc__guide-slot">
        <div
          className="ui-wsfc__guide"
          data-open={guide || undefined}
          style={{ height: guide ? guideHeight : 70 }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && guide) {
              event.stopPropagation();
              closeGuide();
            }
          }}
        >
          <button
            ref={steps}
            type="button"
            className="ui-wsfc__steps"
            aria-expanded={guide}
            aria-controls={`${id}-guide`}
            inert={guide}
            onClick={() => setGuide(true)}
          >
            <span>
              Getting started
              <Icon name="chevron" size={13} />
            </span>
            <small>
              13% done · <em>Great start!</em>
            </small>
            <i>
              <span />
            </i>
          </button>
          <div
            id={`${id}-guide`}
            className="ui-wsfc__guide-content"
            inert={!guide}
            aria-label="Getting started"
            role="region"
          >
            <div ref={content}>
              <header>
                <b>Getting started</b>
                <button ref={close} type="button" aria-label="Close setup guide" onClick={closeGuide}>
                  <Icon name="close" size={14} />
                </button>
              </header>
              <div className="ui-wsfc__progress">
                <progress aria-label="Getting started progress" value={1} max={8} />
                <span>1/8</span>
              </div>
              <div className="ui-wsfc__setup-groups">
                {workspaceSetup.map((section, index) => (
                  <section key={section.name} data-open={group === index || undefined}>
                    <button
                      type="button"
                      className="ui-wsfc__setup-head"
                      aria-expanded={group === index}
                      aria-controls={`${id}-setup-${index}`}
                      onClick={() => setGroup(group === index ? -1 : index)}
                    >
                      {section.name}
                      <Icon name="chevron" size={16} />
                    </button>
                    <div className="ui-wsfc__setup-list" data-open={group === index || undefined}>
                      <div id={`${id}-setup-${index}`} inert={group !== index}>
                        {section.items.map((item, itemIndex) => (
                          <button
                            type="button"
                            key={item}
                            disabled={itemIndex > (index === 0 ? 1 : 0)}
                            aria-pressed={index === 0 && itemIndex === 0}
                            data-done={(index === 0 && itemIndex === 0) || undefined}
                            onClick={() => onNavigate?.(item)}
                          >
                            <span className="ui-wsfc__setup-check">
                              {index === 0 && itemIndex === 0 ? (
                                <Icon name="check" size={10} />
                              ) : itemIndex > (index === 0 ? 1 : 0) ? (
                                <svg
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.1"
                                  aria-hidden="true"
                                >
                                  <circle cx="8" cy="8" r="6.5" strokeDasharray="2 2" />
                                </svg>
                              ) : null}
                            </span>
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-wsfc {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 8px;
}
.ui-asc__side-col:has(> .ui-wsfc) .ui-asc__account-row {
  margin-top: 0;
}
.ui-wsfc__news {
  position: relative;
  padding-top: 30px;
}
.ui-wsfc__news-back {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  height: 48px;
  padding: 9px 9px 0;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
  color: var(--ui-asc-accent);
}
.ui-wsfc__news-back > svg {
  color: var(--ui-asc-faint);
}
.ui-wsfc__news-card {
  position: relative;
  z-index: 1;
  padding: 10px 10px 0;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
}
.ui-wsfc__news-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ui-asc-accent);
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
}
.ui-wsfc__news-top button {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin: -2px -2px 0 0;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-asc-faint);
}
.ui-wsfc__news-card > b {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsfc .ui-wsfc__changelog {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% + 20px);
  height: 34px;
  margin: 10px -10px 0;
  padding: 0 10px;
  border-top: 1px solid var(--ui-asc-fill);
  border-radius: 0 0 12px 12px;
  font-size: 12.5px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__changelog > svg,
.ui-wsfc__steps > span > svg {
  rotate: -90deg;
}
.ui-wsfc__changelog:hover,
.ui-wsfc__news-top button:hover {
  background: var(--ui-asc-fill);
  color: var(--ui-asc-ink);
}
.ui-wsfc__guide-slot {
  position: relative;
  height: 70px;
}
.ui-wsfc__guide {
  position: absolute;
  z-index: 6;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  border-radius: 12px;
  background: var(--ui-asc-card);
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    height 480ms var(--ui-asc-ease),
    box-shadow 200ms;
}
.ui-wsfc__guide[data-open] {
  box-shadow:
    0 0 0 0.5px var(--ui-asc-line),
    0 8px 24px -10px rgba(0, 0, 0, 0.14);
}
.ui-wsfc .ui-wsfc__steps {
  display: grid;
  gap: 3px;
  width: 100%;
  height: 70px;
  padding: 10px 10px 9px;
  text-align: left;
}
.ui-wsfc__steps > span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
}
.ui-wsfc__steps svg {
  color: var(--ui-asc-faint);
}
.ui-wsfc__steps > small {
  font-size: 12.5px;
  line-height: 17px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__steps em {
  color: var(--ui-asc-accent);
  font-style: normal;
}
.ui-wsfc__steps > i {
  height: 4px;
  margin-top: 6px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--ui-asc-fill);
}
.ui-wsfc__steps > i > span {
  display: block;
  width: 13%;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-asc-accent);
}
.ui-wsfc__guide-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition:
    opacity 260ms,
    transform 360ms var(--ui-asc-ease),
    visibility 260ms;
}
.ui-wsfc__guide-content > div {
  padding: 12px 4px 4px;
  zoom: 0.86;
}
.ui-wsfc__guide[data-open] .ui-wsfc__guide-content {
  opacity: 1;
  visibility: visible;
  transform: none;
}
.ui-wsfc__guide[data-open] .ui-wsfc__steps {
  visibility: hidden;
}
.ui-wsfc__guide-content header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px 0 16px;
}
.ui-wsfc__guide-content b {
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
}
.ui-wsfc__guide-content header button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  color: var(--ui-asc-muted);
}
.ui-wsfc__progress {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 12px;
  color: var(--ui-asc-muted);
  font-size: 12px;
  line-height: 16px;
}
.ui-wsfc__progress progress {
  flex: 1;
  width: 0;
  height: 4px;
  border: 0;
  accent-color: var(--ui-asc-accent);
}
.ui-wsfc__progress progress::-webkit-progress-bar {
  background: var(--ui-asc-fill);
  border-radius: 2px;
}
.ui-wsfc__progress progress::-webkit-progress-value {
  background: var(--ui-asc-accent);
  border-radius: 2px;
}
.ui-wsfc__setup-groups {
  display: grid;
  gap: 2px;
  padding: 4px 4px 2px;
  border-top: 0.5px solid var(--ui-asc-line);
}
.ui-wsfc__setup-groups > section {
  border-radius: 8px;
  transition: background-color 200ms;
}
.ui-wsfc__setup-groups > section[data-open] {
  background: color-mix(in srgb, var(--ui-asc-ink) 2.5%, transparent);
}
.ui-wsfc .ui-wsfc__setup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 8px 8px 12px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  text-align: left;
}
.ui-wsfc__setup-head svg {
  color: var(--ui-asc-muted);
  transition: transform 320ms var(--ui-asc-ease);
}
.ui-wsfc__setup-head[aria-expanded="true"] svg {
  transform: rotate(180deg);
}
.ui-wsfc__setup-list {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 380ms var(--ui-asc-ease);
}
.ui-wsfc__setup-list[data-open] {
  grid-template-rows: 1fr;
}
.ui-wsfc__setup-list > div {
  min-height: 0;
  overflow: hidden;
  padding: 0 4px;
}
.ui-wsfc__setup-list button {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  padding: 6px 8px !important;
  font-size: 13px !important;
  line-height: 20px;
  text-align: left;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 260ms,
    transform 320ms var(--ui-asc-ease);
}
.ui-wsfc__setup-list button:last-child {
  margin-bottom: 6px;
}
.ui-wsfc__setup-list[data-open] button {
  opacity: 1;
  transform: none;
  transition-delay: 80ms;
}
.ui-wsfc__setup-list button:disabled {
  color: var(--ui-asc-muted);
  cursor: default;
  opacity: 1;
}
.ui-wsfc__setup-list button[data-done] {
  color: var(--ui-asc-muted);
}
.ui-wsfc__setup-list button[data-done] > span:last-child {
  text-decoration: line-through;
}
.ui-wsfc__setup-check {
  display: grid;
  place-items: center;
  flex: none;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px var(--ui-asc-faint);
}
.ui-wsfc__setup-check svg {
  width: 16px;
  height: 16px;
}
.ui-wsfc__setup-list button:disabled .ui-wsfc__setup-check {
  box-shadow: none;
  color: var(--ui-asc-faint);
}
.ui-wsfc__setup-list button[data-done] .ui-wsfc__setup-check {
  background: var(--ui-asc-accent);
  color: #fff;
  box-shadow: none;
}
.ui-wsfc__guide-content button:hover:not(:disabled) {
  background: var(--ui-asc-fill);
}
@media (pointer: coarse) {
  .ui-wsfc__setup-list button {
    padding-block: 9px !important;
  }
  .ui-wsfc .ui-wsfc__setup-head {
    padding-block: 12px;
  }
  .ui-wsfc__guide-content header button {
    width: 36px;
    height: 36px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-wsfc * {
    animation: none !important;
    transition: none !important;
  }
}
@container ui-asc (min-width:900px) {
  .ui-asc[data-sidebar-collapsed] .ui-wsfc {
    visibility: hidden;
  }
}
@container ui-asc (max-width:600px) {
  .ui-wsfc__news {
    display: none;
  }
}

`;
