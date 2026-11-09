"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/*
 * campaign-brief (Clean) – a self-contained React 19 component.
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

function useControllable<T>(value: T | undefined, initial: T, onChange?: (value: T) => void) {
  const [state, setState] = useState(initial);
  const current = value === undefined ? state : value;
  const set = (next: T) => {
    if (value === undefined) setState(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function useMorph(value: string) {
  const ref = useRef<HTMLButtonElement>(null);
  const previous = useRef<number | null>(null);
  const animation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    animation.current?.cancel();
    const width = el.getBoundingClientRect().width;
    if (
      previous.current !== null &&
      Math.abs(previous.current - width) > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animation.current = el.animate([{ width: `${previous.current}px` }, { width: `${width}px` }], {
        duration: 480,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      });
    }
    previous.current = width;
    return () => animation.current?.cancel();
  }, [value]);
  return ref;
}

export type CampaignAngle = "Desire-driven" | "Problem–solution" | "Social proof";
export type CampaignSection = "brief" | "assets" | "activity";
export type CampaignChannels = { instagram: boolean; tiktok: boolean; facebook: boolean };
export type CampaignAsset = { id: string; title: string; format: string; channel: string; color: string; ink?: string };
export type CampaignBriefProps = {
  angle?: CampaignAngle;
  defaultAngle?: CampaignAngle;
  onAngleChange?: (angle: CampaignAngle) => void;
  channels?: CampaignChannels;
  defaultChannels?: CampaignChannels;
  onChannelsChange?: (channels: CampaignChannels) => void;
  section?: CampaignSection;
  defaultSection?: CampaignSection;
  onSectionChange?: (section: CampaignSection) => void;
  assets?: CampaignAsset[];
  generating?: boolean;
  onGenerate?: () => void;
  onOpenFile?: (name: string) => void;
  className?: string;
};
export const defaultCampaignAssets: CampaignAsset[] = [
  { id: "evening", title: "The first warm evening", format: "Feed", channel: "Instagram", color: "#e3d3b8" },
  { id: "july", title: "Made for July", format: "Story", channel: "TikTok", color: "#7c8458", ink: "#f4f1ea" },
  { id: "linen", title: "Linen, finally", format: "Feed", channel: "Instagram", color: "#f4f1ea" },
  {
    id: "orders",
    title: "412 people can't be wrong",
    format: "Story",
    channel: "Instagram",
    color: "#1f2328",
    ink: "#f4f1ea",
  },
  { id: "breathe", title: "Breathe out", format: "Banner", channel: "Facebook", color: "#c9b48f" },
  { id: "summer", title: "Summer, unbuttoned", format: "Feed", channel: "TikTok", color: "#a3a77f" },
];
const campaignAngles: { name: CampaignAngle; detail: string; signal: number }[] = [
  { name: "Desire-driven", detail: "The first warm evening", signal: 3 },
  { name: "Problem–solution", detail: "Heat, itchy fabrics", signal: 2 },
  { name: "Social proof", detail: "412 sold, top reviews", signal: 1 },
];
function CampaignShirt({ size = 18 }: { size?: number }) {
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
      <path d="M6 12v5.684c0 1.811 0 2.717.583 3.28.665.639 3.033 1.015 5.41 1.035 2.316.02 4.641-.297 5.409-1.035.586-.563.586-1.469.586-3.28V12" />
      <path d="M5.722 14.022c-.865-.314-2.492-.583-3.226-1.319-1.01-1.013-.357-2.383.881-4.964.557-1.162 1.624-2.017 2.867-2.355.168-.046.315-.151.412-.296l1.283-1.999a.5.5 0 0 1 .142-.138C8.659 2.602 10.092 2 11.993 2s3.239.602 3.818.951a.5.5 0 0 1 .141.138l1.32 1.98c.097.145.244.251.412.297 1.243.338 2.261 1.084 2.819 2.246 1.391 2.529 2.008 4.059.998 5.072-.734.736-2.383 1.028-3.249 1.341" />
      <path d="m6.501 5.5 4.233 3.293c.607.471.91.707 1.267.707s.66-.236 1.267-.707L17.501 5.5M9.501 3l1.5 6M14.501 3l-1.5 6" />
    </svg>
  );
}
function CampaignChannelIcon({ name }: { name: keyof CampaignChannels }) {
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
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" />
      {name === "instagram" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.25" cy="6.75" r=".25" />
        </>
      ) : name === "tiktok" ? (
        <path d="M10.536 11.008c-.82-.116-2.689.075-3.606 1.77s.007 3.459.584 4.129c.569.627 2.378 1.814 4.297.655.476-.287 1.068-.502 1.741-2.747l-.078-8.834c-.13.973.945 3.255 4.004 3.525" />
      ) : (
        <path d="M16.927 8.026h-2.945a1.9 1.9 0 0 0-1.9 1.886l-.086 11.515M10.082 14.002h4.803" />
      )}
    </svg>
  );
}
/** The campaign brief, generated-ad gallery and activity timeline. Generation is caller-owned. */
export function CampaignBrief({
  angle: angleProp,
  defaultAngle = "Desire-driven",
  onAngleChange,
  channels: channelsProp,
  defaultChannels = { instagram: true, tiktok: true, facebook: false },
  onChannelsChange,
  section: sectionProp,
  defaultSection = "brief",
  onSectionChange,
  assets = [],
  generating = false,
  onGenerate,
  onOpenFile,
  className,
}: CampaignBriefProps) {
  const [angle, setAngle] = useControllable(angleProp, defaultAngle, onAngleChange),
    [channels, setChannels] = useControllable(channelsProp, defaultChannels, onChannelsChange),
    [section, setSection] = useControllable(sectionProp, defaultSection, onSectionChange);
  const tabs = useRef<HTMLDivElement>(null),
    radios = useRef<HTMLDivElement>(null),
    button = useMorph(String(generating)),
    id = useId();
  const sections: CampaignSection[] = ["brief", "assets", "activity"];
  const selectKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    count: number,
    select: (index: number) => void,
  ) => {
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % count
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + count) % count
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      select(next);
    }
  };
  const generate = (
    <button ref={button} type="button" className="ui-cbrc__generate" disabled={generating} onClick={onGenerate}>
      <span key={String(generating)}>{generating ? "Generating…" : "Generate ads"}</span>
    </button>
  );
  return (
    <section className={["ui-cbrc", className].filter(Boolean).join(" ")} aria-label="Campaign brief">
      <style href="ui-campaign-brief-clean" precedence="default">
        {css}
      </style>
      <div ref={tabs} className="ui-cbrc__seg" role="tablist" aria-label="Brief sections">
        {sections.map((value, index) => (
          <button
            type="button"
            role="tab"
            id={`${id}-${value}`}
            aria-selected={section === value}
            aria-controls={`${id}-panel`}
            tabIndex={section === value ? 0 : -1}
            key={value}
            onClick={() => setSection(value)}
            onKeyDown={(event) =>
              selectKey(event, index, sections.length, (next) => {
                setSection(sections[next]);
                tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
              })
            }
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
      <div
        className="ui-cbrc__panel"
        key={section}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${section}`}
      >
        {section === "brief" ? (
          <>
            <div className="ui-cbrc__product">
              <span className="ui-cbrc__thumb">
                <CampaignShirt />
              </span>
              <span className="ui-cbrc__pinfo">
                <b>Linen Overshirt</b>
                <span>$89 · 412 sold this month</span>
              </span>
              <span className="ui-cbrc__chip">Bestseller</span>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label" id={`${id}-angle`}>
                Selling angle
              </span>
              <div className="ui-cbrc__card" ref={radios} role="radiogroup" aria-labelledby={`${id}-angle`}>
                {campaignAngles.map((option, index) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={angle === option.name}
                    tabIndex={angle === option.name ? 0 : -1}
                    className="ui-cbrc__option"
                    key={option.name}
                    onClick={() => setAngle(option.name)}
                    onKeyDown={(event) =>
                      selectKey(event, index, campaignAngles.length, (next) => {
                        setAngle(campaignAngles[next].name);
                        radios.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
                      })
                    }
                  >
                    <span className="ui-cbrc__radio" aria-hidden="true" />
                    <span className="ui-cbrc__name">
                      <span>{option.name}</span>
                      <small>{option.detail}</small>
                    </span>
                    <span className="ui-cbrc__signal" aria-label={`${option.signal} of 3 signals`}>
                      {[0, 1, 2].map((signal) => (
                        <i key={signal} data-on={signal < option.signal || undefined} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Audience</span>
              <div className="ui-cbrc__card">
                <div className="ui-cbrc__pills">
                  {["Women 25–34", "Urban", "Warm climates", "Linen & natural fabrics"].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Channels</span>
              <div className="ui-cbrc__card">
                {(
                  [
                    { id: "instagram", name: "Instagram", detail: "Feed and Stories" },
                    { id: "tiktok", name: "TikTok", detail: "Story format only" },
                    { id: "facebook", name: "Facebook", detail: "Feed and Banner" },
                  ] as const
                ).map((channel) => (
                  <label className="ui-cbrc__channel" key={channel.id}>
                    <CampaignChannelIcon name={channel.id} />
                    <span className="ui-cbrc__name">
                      <span>{channel.name}</span>
                      <small>{channel.detail}</small>
                    </span>
                    <span className="ui-cbrc__switch">
                      <input
                        type="checkbox"
                        role="switch"
                        aria-label={channel.name}
                        checked={channels[channel.id]}
                        onChange={(event) => setChannels({ ...channels, [channel.id]: event.target.checked })}
                      />
                      <span className="ui-cbrc__track">
                        <span />
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="ui-cbrc__card ui-cbrc__split">
              <div>
                <span className="ui-cbrc__label">Palette</span>
                <div className="ui-cbrc__swatches">
                  {[
                    ["Sand", "#e3d3b8"],
                    ["Olive", "#7c8458"],
                    ["Off-white", "#f4f1ea"],
                    ["Ink", "#1f2328"],
                  ].map(([name, color]) => (
                    <span key={name}>
                      <i style={{ background: color }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="ui-cbrc__label">Formats</span>
                <div className="ui-cbrc__formats">
                  {[
                    ["Feed", "1"],
                    ["Story", "9/16"],
                    ["Banner", "16/9"],
                  ].map(([name, ratio]) => (
                    <span key={name}>
                      <i style={{ aspectRatio: ratio }} />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Details</span>
              <div className="ui-cbrc__card">
                <dl className="ui-cbrc__details">
                  {[
                    ["Launch", "Mon, Jun 2", "tasks"],
                    ["Budget", "$2,400 / week", "table"],
                    ["Markets", "US, UK, AU", "globe"],
                  ].map(([name, value, icon]) => (
                    <div key={name}>
                      <dt>
                        <Icon name={icon as IconName} size={15} />
                        {name}
                      </dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">Files</span>
              <div className="ui-cbrc__files">
                {["brand-guide.md", "launch-budget.csv", "product-photos"].map((name) => (
                  <button type="button" key={name} onClick={() => onOpenFile?.(name)}>
                    <Icon
                      name={name.endsWith("csv") ? "table" : name === "product-photos" ? "folder" : "document"}
                      size={13}
                    />
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <footer className="ui-cbrc__go">
              <div className="ui-cbrc__tags">
                <span>6 ads</span>
                <span>~2 min</span>
              </div>
              {generate}
            </footer>
          </>
        ) : section === "assets" ? (
          assets.length ? (
            <div className="ui-cbrc__section">
              <span className="ui-cbrc__label">
                {assets.length} ads · {angle}
              </span>
              <div className="ui-cbrc__ads">
                {assets.map((asset, index) => (
                  <figure className="ui-cbrc__ad" key={asset.id} style={{ "--ui-cbrc-index": index } as CSSProperties}>
                    <div className="ui-cbrc__art" style={{ background: asset.color, color: asset.ink ?? "#1f2328" }}>
                      <CampaignShirt size={22} />
                      <b>{asset.title}</b>
                    </div>
                    <figcaption>
                      <b>{asset.format}</b>
                      <span>{asset.channel}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div className="ui-cbrc__empty">
              <span>
                <Icon name="image" size={22} />
              </span>
              <b>No assets yet</b>
              <p>Fill in the brief and generate ads – they show up here.</p>
              {generate}
            </div>
          )
        ) : (
          <ol className="ui-cbrc__activity">
            {[
              [`Angle set to ${angle}`, "2 min ago", "spark"],
              ["Brand research checked the palette", "3 min ago", "search"],
              ["Linen Overshirt picked as bestseller", "4 min ago", "check"],
              ["Shopify import started", "6 min ago", "plug"],
              ["Brief “Summer launch” created", "7 min ago", "document"],
            ].map(([text, time, icon], index) => (
              <li key={text} style={{ "--ui-cbrc-index": index } as CSSProperties}>
                <span className="ui-cbrc__activity-icon">
                  <Icon name={icon as IconName} size={13} />
                </span>
                <span>
                  {text}
                  <small>{time}</small>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-cbrc {
  --ui-cbrc-card: #fff;
  --ui-cbrc-ink: rgba(0, 0, 0, 0.88);
  --ui-cbrc-text: rgba(0, 0, 0, 0.61);
  --ui-cbrc-muted: rgba(0, 0, 0, 0.45);
  --ui-cbrc-faint: rgba(0, 0, 0, 0.27);
  --ui-cbrc-line: rgba(0, 0, 0, 0.12);
  --ui-cbrc-chip: rgba(0, 0, 0, 0.04);
  --ui-cbrc-hover: rgba(0, 0, 0, 0.025);
  --ui-cbrc-focus: #0060e2;
  --ui-cbrc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
  padding: 0 2px;
  color: var(--ui-cbrc-ink);
  font:
    13px/18.571px "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ui-cbrc,
.ui-cbrc *,
.ui-cbrc *::before,
.ui-cbrc *::after {
  box-sizing: border-box;
}
.ui-cbrc button {
  font: inherit;
  color: inherit;
  border: 0;
  background: none;
  cursor: pointer;
}
.ui-cbrc button:focus-visible,
.ui-cbrc input:focus-visible + .ui-cbrc__track {
  outline: 2px solid var(--ui-cbrc-focus);
  outline-offset: 2px;
}
.ui-cbrc button:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-cbrc button:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-cbrc__seg {
  display: flex;
  flex: none;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: var(--ui-cbrc-chip);
}
.ui-cbrc__seg button {
  flex: 1;
  height: 26px;
  border-radius: 7px;
  font-weight: 500;
  color: var(--ui-cbrc-muted);
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-cbrc__seg button:hover {
  color: var(--ui-cbrc-ink);
}
.ui-cbrc__seg button[aria-selected="true"] {
  background: var(--ui-cbrc-card);
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.05);
  color: var(--ui-cbrc-ink);
}
.ui-cbrc__panel {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  gap: 18px;
  animation: ui-cbrc-rise 380ms var(--ui-cbrc-ease) both;
}
.ui-cbrc__card,
.ui-cbrc__product,
.ui-cbrc__go,
.ui-cbrc__activity {
  border-radius: 12px;
  background: var(--ui-cbrc-card);
  box-shadow:
    inset 0 0 0 0.5px var(--ui-cbrc-line),
    0 1px 2px rgba(0, 0, 0, 0.025);
}
.ui-cbrc__card {
  display: flex;
  flex-direction: column;
  padding: 4px 12px;
}
.ui-cbrc__card:has(> .ui-cbrc__pills),
.ui-cbrc__card:has(> .ui-cbrc__details) {
  padding: 12px;
}
.ui-cbrc__product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}
.ui-cbrc__thumb {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #efe7da;
  color: #7c6a4f;
}
.ui-cbrc__pinfo {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 12px;
  line-height: 17px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__pinfo b {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-cbrc-ink);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__pinfo > span {
  overflow-wrap: anywhere;
}
.ui-cbrc__chip {
  flex: none;
  max-width: 40%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(22, 163, 74, 0.1);
  font-size: 12px;
  font-weight: 500;
  color: #15803d;
}
.ui-cbrc__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-cbrc__label {
  padding: 0 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  margin: 0 -8px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--ui-cbrc-muted) !important;
  text-align: left;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;
}
.ui-cbrc__option:hover {
  background: var(--ui-cbrc-hover) !important;
  color: var(--ui-cbrc-ink) !important;
}
.ui-cbrc__option[aria-checked="true"] {
  background: var(--ui-cbrc-chip);
  color: var(--ui-cbrc-ink) !important;
}
.ui-cbrc__radio {
  flex: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--ui-cbrc-line);
  transition: box-shadow 160ms ease;
}
.ui-cbrc__option[aria-checked="true"] .ui-cbrc__radio {
  box-shadow: inset 0 0 0 4px var(--ui-cbrc-ink);
}
.ui-cbrc__name {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
}
.ui-cbrc__name > * {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__name small {
  font-size: 12.5px;
  font-weight: 400;
  line-height: 17px;
  color: var(--ui-cbrc-faint);
}
.ui-cbrc__signal {
  display: flex;
  flex: none;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
}
.ui-cbrc__signal i {
  width: 3px;
  border-radius: 1px;
  background: #d9d9d9;
}
.ui-cbrc__signal i:nth-child(1) {
  height: 5px;
}
.ui-cbrc__signal i:nth-child(2) {
  height: 8px;
}
.ui-cbrc__signal i:nth-child(3) {
  height: 11px;
}
.ui-cbrc__signal i[data-on] {
  background: #16a34a;
}
.ui-cbrc__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ui-cbrc__pills span {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12.5px;
  color: var(--ui-cbrc-text);
}
.ui-cbrc__channel {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  cursor: pointer;
}
.ui-cbrc__channel > svg {
  flex: none;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__switch {
  display: inline-flex;
  position: relative;
  flex: none;
}
.ui-cbrc__switch input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}
.ui-cbrc__track {
  display: block;
  width: 26px;
  height: 16px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  transition: background-color 200ms ease;
}
.ui-cbrc__track > span {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition:
    transform 260ms var(--ui-cbrc-ease),
    width 160ms var(--ui-cbrc-ease);
}
.ui-cbrc__switch input:checked + .ui-cbrc__track {
  background: var(--ui-cbrc-ink);
}
.ui-cbrc__switch input:checked + .ui-cbrc__track > span {
  transform: translateX(10px);
}
.ui-cbrc__card.ui-cbrc__split {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
}
.ui-cbrc__split .ui-cbrc__label {
  display: block;
  padding: 0 0 10px;
}
.ui-cbrc__swatches,
.ui-cbrc__formats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__swatches span,
.ui-cbrc__formats span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  text-align: center;
  overflow-wrap: anywhere;
}
.ui-cbrc__swatches i {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.ui-cbrc__formats span {
  justify-content: flex-end;
  min-height: 44px;
}
.ui-cbrc__formats i {
  height: 24px;
  max-width: 36px;
  border: 1.5px solid var(--ui-cbrc-faint);
  border-radius: 4px;
}
.ui-cbrc__details {
  display: grid;
  gap: 12px;
  margin: 0;
}
.ui-cbrc__details div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
}
.ui-cbrc__details dt {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__details dd {
  min-width: 0;
  margin: 0;
  text-align: right;
  overflow-wrap: anywhere;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.ui-cbrc__files {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ui-cbrc__files button {
  display: flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12px;
  color: var(--ui-cbrc-text);
}
.ui-cbrc__files button:hover {
  background: var(--ui-cbrc-chip);
}
.ui-cbrc__go {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin-top: auto;
  padding: 10px 10px 10px 12px;
  box-shadow:
    inset 0 0 0 0.5px var(--ui-cbrc-line),
    0 1px 2px rgba(0, 0, 0, 0.025),
    0 0 0 12px var(--ui-cbrc-card);
}
.ui-cbrc__go::before {
  content: "";
  position: absolute;
  left: -8px;
  right: -8px;
  bottom: calc(100% + 0.5px);
  height: 28px;
  background: linear-gradient(to bottom, transparent, var(--ui-cbrc-card) 85%);
  pointer-events: none;
}
.ui-cbrc__panel > :nth-last-child(2) {
  margin-bottom: 12px;
}
.ui-cbrc__tags {
  display: flex;
  gap: 4px;
}
.ui-cbrc__tags span {
  padding: 3px 9px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ui-cbrc-text);
}
.ui-cbrc .ui-cbrc__generate {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex: none;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--ui-cbrc-ink);
  color: var(--ui-cbrc-card);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    opacity 140ms ease,
    transform 160ms var(--ui-cbrc-ease);
}
.ui-cbrc__generate > span {
  animation: ui-cbrc-label 480ms cubic-bezier(0.25, 1, 0.5, 1) both;
}
.ui-cbrc__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
}
.ui-cbrc__empty > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: var(--ui-cbrc-card);
  box-shadow: 0 0 0 0.5px var(--ui-cbrc-line);
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__empty > b {
  font-size: 14px;
  font-weight: 500;
}
.ui-cbrc__empty p {
  max-width: 240px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 19px;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__ads {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.ui-cbrc__ad {
  margin: 0;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
  animation-delay: calc(var(--ui-cbrc-index, 0) * 35ms);
}
.ui-cbrc__art {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  padding: 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.ui-cbrc__art b {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.ui-cbrc__ad figcaption {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
  font-size: 12.5px;
  font-weight: 500;
}
.ui-cbrc__ad figcaption > * {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-cbrc__ad figcaption b {
  flex: none;
  max-width: 60%;
  font-weight: 500;
}
.ui-cbrc__ad figcaption span {
  font-weight: 400;
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__activity {
  flex: none;
  margin: 0;
  padding: 14px 12px 0;
  list-style: none;
}
.ui-cbrc__activity li {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 18px;
  animation: ui-cbrc-rise 420ms var(--ui-cbrc-ease) both;
  animation-delay: calc(var(--ui-cbrc-index, 0) * 35ms);
}
.ui-cbrc__activity li:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 28px;
  bottom: 2px;
  left: 13px;
  width: 1px;
  background: var(--ui-cbrc-line);
}
.ui-cbrc__activity-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.5px var(--ui-cbrc-line);
  color: var(--ui-cbrc-muted);
}
.ui-cbrc__activity li > span:last-child {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 3px;
  overflow-wrap: anywhere;
  font-size: 13px;
  line-height: 19px;
}
.ui-cbrc__activity small {
  font-size: 12.5px;
  color: var(--ui-cbrc-faint);
}
@keyframes ui-cbrc-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes ui-cbrc-label {
  from {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(25%);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}
:where(.dark, [data-theme="dark"]) .ui-cbrc {
  --ui-cbrc-card: #1c1c1e;
  --ui-cbrc-ink: rgba(255, 255, 255, 0.9);
  --ui-cbrc-text: rgba(255, 255, 255, 0.62);
  --ui-cbrc-muted: rgba(255, 255, 255, 0.46);
  --ui-cbrc-faint: rgba(255, 255, 255, 0.3);
  --ui-cbrc-line: rgba(255, 255, 255, 0.14);
  --ui-cbrc-chip: rgba(255, 255, 255, 0.06);
  --ui-cbrc-hover: rgba(255, 255, 255, 0.04);
  --ui-cbrc-focus: #4d8dff;
}
.ui-cbrc__switch input:checked + .ui-cbrc__track > span {
  background: var(--ui-cbrc-card);
}
:where(.dark, [data-theme="dark"]) .ui-cbrc__thumb {
  background: #3a3329;
  color: #d9c6a5;
}
:where(.dark, [data-theme="dark"]) .ui-cbrc__signal i:not([data-on]) {
  background: #3a3a3f;
}
@media (pointer: coarse) {
  .ui-cbrc__seg button {
    height: 34px;
  }
  .ui-cbrc__option {
    min-height: 52px;
  }
  .ui-cbrc__channel {
    min-height: 48px;
  }
  .ui-cbrc .ui-cbrc__generate {
    height: 34px;
  }
  .ui-cbrc__files button {
    min-height: 36px;
  }
  .ui-cbrc__switch::before {
    content: "";
    position: absolute;
    inset: -12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-cbrc,
  .ui-cbrc * {
    animation: none !important;
    transition: none !important;
  }
}

`;
