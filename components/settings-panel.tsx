"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/*
 * settings-panel (Classic) – a self-contained React 19 component.
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
  | "pause"
  | "repeat"
  | "calendar"
  | "shield"
  | "chart"
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
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6Z" />,
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export type SettingsStat = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  /** Optional 0..1 progress fill (e.g. seats used). */
  progress?: number;
};

export type SettingsTabItem = {
  id: string;
  label: ReactNode;
  count?: number;
};

export type SettingsPageProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  maxWidth?: number | string;
};

export type SettingsNoteProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  tone?: "neutral" | "accent" | "danger";
  icon?: IconName;
  children: ReactNode;
};

export type SettingsSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export type SettingsCardProps = ComponentPropsWithoutRef<"section"> & {
  tone?: "default" | "danger";
  alone?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

export type SettingsRowProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  leading?: ReactNode;
  footer?: ReactNode;
  skeleton?: boolean;
};

export type SettingsBadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "neutral" | "accent" | "teal" | "amber" | "danger";
  dot?: boolean;
};

export type SettingsButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-solid";
  size?: "sm" | "md";
  icon?: IconName;
};

export type SettingsTabsProps = {
  items: SettingsTabItem[];
  value: string;
  onChange: (id: string) => void;
  "aria-label"?: string;
  className?: string;
};

export type SettingsCopyValueProps = {
  value: string;
  label?: string;
  copyLabel?: string;
  copiedLabel?: string;
  onCopy?: (value: string) => void;
  className?: string;
};

export type SettingsDangerConfirmProps = {
  name: string;
  prompt?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type SettingsMember = {
  id: string;
  name?: string;
  email: string;
  role: string;
  plan?: string;
  usage?: number;
  invited?: boolean;
  /** Optional custom action label override for row removal/revocation. */
  removeLabel?: string;
};

export type SettingsTeam = {
  id: string;
  name: string;
  members: string[];
};

export type SettingsMembersLabels = {
  membersStat: string;
  activeSuffix: string;
  invitedSuffix: string;
  seatsStat: string;
  adminsStat: string;
  adminsNote: string;
  searchPlaceholder: string;
  allRoles: string;
  exportButton: string;
  inviteTrigger: string;
  inviteTitle: string;
  inviteHint: string;
  inviteInputLabel: string;
  invitePlaceholder: string;
  inviteSubmit: string;
  invitedBadge: string;
  youSuffix: string;
  resendInvite: string;
  cancelInvite: string;
  removeMember: string;
  emptySearch: (query: string) => string;
  emptyRole: string;
  newTeam: string;
  deleteTeam: string;
  emptyTeams: string;
};

export type SettingsMembersPanelProps = {
  members?: SettingsMember[];
  defaultMembers?: SettingsMember[];
  teams?: SettingsTeam[];
  defaultTeams?: SettingsTeam[];
  me?: string;
  seatLimit?: number;
  roles?: string[];
  adminRole?: string;
  plans?: string[];
  defaultTab?: "Members" | "Teams";
  showTeamsTab?: boolean;
  showPlans?: boolean;
  showUsage?: boolean;
  showExport?: boolean;
  /** "email" validates email syntax; "login" accepts any non-empty handle/login. */
  inviteMode?: "email" | "login";
  /** Keepinvite bar inline instead of inside a popover when true. */
  inlineInvite?: boolean;
  canManage?: boolean;
  managed?: boolean;
  loading?: boolean;
  error?: string | null;
  submittingInvite?: boolean;
  busyMemberId?: string | null;
  labels?: Partial<SettingsMembersLabels>;
  onInvite?: (input: { target: string; role: string }) => void;
  onRoleChange?: (id: string, role: string) => void;
  onPlanChange?: (id: string, plan: string) => void;
  onRemove?: (id: string, member: SettingsMember) => void;
  onResendInvite?: (id: string, member: SettingsMember) => void;
  onCreateTeam?: (name: string) => void;
  onDeleteTeam?: (id: string) => void;
  onExport?: () => void;
  onNotice?: (message: string) => void;
};

export const defaultSettingsNavigation = [
  { label: "Profile", section: "Personal", icon: <Icon name="hand" size={16} /> },
  { label: "Preferences", section: "Personal", icon: <Icon name="spark" size={16} /> },
  { label: "Notifications", section: "Personal", icon: <Icon name="bell" size={16} /> },
  { label: "General", section: "Workspace", icon: <Icon name="settings" size={16} /> },
  { label: "Members", section: "Workspace", icon: <Icon name="globe" size={16} /> },
  { label: "Security", section: "Workspace", icon: <Icon name="shield" size={16} /> },
];

export const defaultSettingsMembers: SettingsMember[] = [
  { id: "alex", name: "Alex Morgan", email: "alex@acme.com", role: "Admin", plan: "Business", usage: 0.68 },
  { id: "jonas", name: "Jonas Weber", email: "jonas@acme.com", role: "Admin", plan: "Business", usage: 0.42 },
  { id: "mara", name: "Mara Klein", email: "mara@acme.com", role: "Member", plan: "Pro", usage: 0.81 },
  { id: "lea", name: "Lea Braun", email: "lea@acme.com", role: "Member", plan: "Pro", usage: 0.23 },
  { id: "tom", name: "Tom Fischer", email: "tom@acme.com", role: "Viewer", plan: "Free", usage: 0.05 },
  { id: "sam", email: "sam@acme.com", role: "Member", plan: "Pro", usage: 0, invited: true },
];

export const defaultSettingsTeams: SettingsTeam[] = [
  { id: "product", name: "Product", members: ["alex", "jonas", "mara"] },
  { id: "marketing", name: "Marketing", members: ["lea", "tom"] },
  { id: "engineering", name: "Engineering", members: ["jonas", "mara"] },
];

const defaultMembersLabels: SettingsMembersLabels = {
  membersStat: "Members",
  activeSuffix: "active",
  invitedSuffix: "invited",
  seatsStat: "Seats",
  adminsStat: "Admins",
  adminsNote: "Can invite, remove and bill",
  searchPlaceholder: "Search name or email",
  allRoles: "All roles",
  exportButton: "Export",
  inviteTrigger: "Invite members",
  inviteTitle: "Invite to the workspace",
  inviteHint: "They get an invite to join.",
  inviteInputLabel: "Email address",
  invitePlaceholder: "name@company.com",
  inviteSubmit: "Send invite",
  invitedBadge: "Invited",
  youSuffix: "(You)",
  resendInvite: "Resend invite",
  cancelInvite: "Cancel invite",
  removeMember: "Remove from workspace",
  emptySearch: (query) => `No one matches “${query}”.`,
  emptyRole: "No members with this role.",
  newTeam: "New team",
  deleteTeam: "Delete team",
  emptyTeams: "No teams yet – create one to group people.",
};

const stpNumFmt = new Intl.NumberFormat("en-US");

function memberLabel(member: SettingsMember): string {
  return member.name?.trim() || member.email;
}

function memberInitials(member: SettingsMember): string {
  const source = member.name?.trim() || member.email || "?";
  const parts = (member.name ?? "")
    .trim()
    .split(/\s+/)
    .filter((part) => /^\p{L}/u.test(part))
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("");
  return (parts || Array.from(source)[0] || "?").toUpperCase();
}

function avatarHue(seed: string): number {
  let hash = 7;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return hash;
}

export function useSettingsToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
  const notify = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(next);
    if (next) {
      timerRef.current = setTimeout(() => setMessage(""), 2600);
    }
  }, []);
  const node = message ? (
    <div className="ui-stp__toast" role="status" aria-live="polite">
      <Icon name="check" size={14} />
      <span>{message}</span>
    </div>
  ) : null;
  return [node, notify] as const;
}

export function SettingsPage({
  title,
  subtitle,
  actions,
  maxWidth = 760,
  className,
  style,
  children,
  ...rest
}: SettingsPageProps) {
  return (
    <div
      {...rest}
      className={["ui-stp", className].filter(Boolean).join(" ")}
      style={{ "--ui-stp-max": typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth, ...style } as CSSProperties}
    >
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {(title != null || subtitle != null || actions != null) && (
        <header className="ui-stp__page-head">
          <div className="ui-stp__page-titles">
            {title != null && <h1 className="ui-stp__title">{title}</h1>}
            {subtitle != null && <p className="ui-stp__subtitle">{subtitle}</p>}
          </div>
          {actions != null && <div className="ui-stp__page-actions">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  );
}

export function SettingsNote({ tone = "neutral", icon = "warning", className, children, ...rest }: SettingsNoteProps) {
  return (
    <div {...rest} className={["ui-stp__note", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      <Icon name={icon} size={15} />
      <div className="ui-stp__note-body">{children}</div>
    </div>
  );
}

export function SettingsSection({ title, description, actions, children, className }: SettingsSectionProps) {
  return (
    <div className={["ui-stp__section", className].filter(Boolean).join(" ")}>
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      <header className="ui-stp__head">
        <div className="ui-stp__head-text">
          <h2>{title}</h2>
          {description != null && <p>{description}</p>}
        </div>
        {actions != null && <div className="ui-stp__head-actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function SettingsCard({
  tone = "default",
  alone = false,
  loading = false,
  loadingLabel = "Loading",
  className,
  children,
  ...rest
}: SettingsCardProps) {
  return (
    <section
      {...rest}
      aria-busy={loading || undefined}
      aria-label={rest["aria-label"] ?? (loading ? loadingLabel : undefined)}
      className={[
        "ui-stp__card",
        alone && "ui-stp__card--alone",
        tone === "danger" && "ui-stp__card--danger",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {children}
    </section>
  );
}

export function SettingsRow({
  title,
  description,
  badge,
  leading,
  footer,
  skeleton = false,
  className,
  children,
  ...rest
}: SettingsRowProps) {
  return (
    <div
      {...rest}
      className={["ui-stp__row-wrap", className].filter(Boolean).join(" ")}
      data-skel={skeleton ? "" : undefined}
    >
      <div className="ui-stp__row">
        <div className="ui-stp__row-main">
          {leading != null && <span className="ui-stp__leading">{leading}</span>}
          <span className="ui-stp__label">
            <span className="ui-stp__label-top">
              <b>{title}</b>
              {badge}
            </span>
            {description != null && <small>{description}</small>}
          </span>
        </div>
        {children != null && <div className="ui-stp__control">{children}</div>}
      </div>
      {footer != null && <div className="ui-stp__row-foot">{footer}</div>}
    </div>
  );
}

export function SettingsStats({
  stats,
  loading = false,
  "aria-label": ariaLabel = "Overview",
}: {
  stats: SettingsStat[];
  loading?: boolean;
  "aria-label"?: string;
}) {
  return (
    <section className="ui-stp__stats" aria-label={ariaLabel} aria-busy={loading || undefined}>
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {stats.map((stat) => (
        <div key={stat.id} data-skel={loading ? "" : undefined}>
          <span>{stat.label}</span>
          <b>{loading ? <span className="ui-stp__skel" style={{ width: 44, height: 18 }} /> : stat.value}</b>
          {stat.progress !== undefined ? (
            <span className="ui-stp__seats" aria-hidden="true">
              {!loading && <i style={{ width: `${Math.round(clamp(stat.progress, 0, 1) * 100)}%` }} />}
            </span>
          ) : stat.detail != null ? (
            <small>{loading ? <span className="ui-stp__skel" style={{ width: 96, height: 10 }} /> : stat.detail}</small>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function SettingsBadge({ tone = "neutral", dot = false, className, children, ...rest }: SettingsBadgeProps) {
  return (
    <span {...rest} className={["ui-stp__badge", className].filter(Boolean).join(" ")} data-tone={tone}>
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {dot && <i className="ui-stp__badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function SettingsButton({
  variant = "secondary",
  size = "sm",
  icon,
  type = "button",
  className,
  children,
  ...rest
}: SettingsButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={["ui-stp__btn", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-size={size}
    >
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {icon && <Icon name={icon} size={14} />}
      {children != null && <span>{children}</span>}
    </button>
  );
}

export function SettingsTabs({
  items,
  value,
  onChange,
  "aria-label": ariaLabel = "Sections",
  className,
}: SettingsTabsProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir || items.length === 0) return;
    event.preventDefault();
    const current = Math.max(
      0,
      items.findIndex((item) => item.id === value),
    );
    const next = items[(current + dir + items.length) % items.length];
    if (!next) return;
    onChange(next.id);
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${CSS.escape(next.id)}"]`)?.focus();
  };

  return (
    <div
      className={["ui-stp__tabs", className].filter(Boolean).join(" ")}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            data-tab={item.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className="ui-stp__tab"
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            {item.count !== undefined && <small>{stpNumFmt.format(item.count)}</small>}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsCopyValue({
  value,
  label,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  onCopy,
  className,
}: SettingsCopyValueProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    onCopy?.(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={["ui-stp__copy", className].filter(Boolean).join(" ")}>
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      <code className="ui-stp__code" aria-label={label}>
        {value}
      </code>
      <button
        type="button"
        className="ui-stp__copy-btn"
        data-copied={copied || undefined}
        aria-label={copied ? copiedLabel : label ? `${copyLabel} ${label}` : copyLabel}
        onClick={handleCopy}
      >
        <span className="ui-stp__copy-swap" aria-hidden="true">
          <span className="ui-stp__copy-icon" data-slot="copy">
            <Icon name="copy" size={14} />
          </span>
          <span className="ui-stp__copy-icon" data-slot="check">
            <Icon name="check" size={14} />
          </span>
        </span>
        <span>{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}

export function SettingsDangerConfirm({
  name,
  prompt,
  confirmLabel = "Delete for good",
  cancelLabel = "Cancel",
  submitting = false,
  onConfirm,
  onCancel,
}: SettingsDangerConfirmProps) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === name.trim();
  const inputId = useId();
  return (
    <form
      className="ui-stp__confirm"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onCancel();
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();
        if (matches && !submitting) onConfirm();
      }}
    >
      <label className="ui-stp__confirm-field" htmlFor={inputId}>
        <span>
          {prompt ?? (
            <>
              Type <b>{name}</b> to confirm
            </>
          )}
        </span>
        <input
          id={inputId}
          className="ui-stp__input"
          value={typed}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setTyped(event.target.value)}
        />
      </label>
      <div className="ui-stp__control">
        <SettingsButton variant="secondary" onClick={onCancel} disabled={submitting}>
          {cancelLabel}
        </SettingsButton>
        <SettingsButton type="submit" variant="danger-solid" disabled={!matches || submitting}>
          {confirmLabel}
        </SettingsButton>
      </div>
    </form>
  );
}

export function SettingsMembersPanel({
  members: membersProp,
  defaultMembers = defaultSettingsMembers,
  teams: teamsProp,
  defaultTeams = defaultSettingsTeams,
  me = "alex",
  seatLimit,
  roles = ["Admin", "Member", "Viewer"],
  adminRole = "Admin",
  plans = ["Business", "Pro", "Free"],
  defaultTab = "Members",
  showTeamsTab = true,
  showPlans = true,
  showUsage = true,
  showExport = true,
  inviteMode = "email",
  inlineInvite = false,
  canManage = true,
  managed = false,
  loading = false,
  error = null,
  submittingInvite = false,
  busyMemberId = null,
  labels: labelOverrides,
  onInvite,
  onRoleChange,
  onPlanChange,
  onRemove,
  onResendInvite,
  onCreateTeam,
  onDeleteTeam,
  onExport,
  onNotice,
}: SettingsMembersPanelProps) {
  const labels = { ...defaultMembersLabels, ...labelOverrides };
  const [tab, setTab] = useState<"Members" | "Teams">(defaultTab);
  const [localMembers, setLocalMembers] = useState<SettingsMember[]>(membersProp ?? defaultMembers);
  const [localTeams, setLocalTeams] = useState<SettingsTeam[]>(teamsProp ?? defaultTeams);
  const members = managed ? (membersProp ?? localMembers) : (membersProp ?? localMembers);
  const teams = managed ? (teamsProp ?? localTeams) : (teamsProp ?? localTeams);

  useEffect(() => {
    if (membersProp) setLocalMembers(membersProp);
  }, [membersProp]);
  useEffect(() => {
    if (teamsProp) setLocalTeams(teamsProp);
  }, [teamsProp]);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState("");
  const [inviteRole, setInviteRole] = useState(roles[1] ?? roles[0] ?? "Member");
  const inviteTriggerRef = useRef<HTMLButtonElement>(null);

  const validInvite =
    inviteMode === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteTarget.trim()) : inviteTarget.trim().length > 0;

  const filtered = members
    .filter((item) => !roleFilter || item.role === roleFilter)
    .filter((item) => `${item.name ?? ""} ${item.email}`.toLowerCase().includes(query.trim().toLowerCase()));

  const activeMembers = members.filter((item) => !item.invited);
  const invitedCount = members.length - activeMembers.length;
  const adminCount = members.filter((item) => item.role.toLowerCase() === adminRole.toLowerCase()).length;
  const byId = new Map(members.map((item) => [item.id, item]));

  const stats: SettingsStat[] = [
    {
      id: "members",
      label: labels.membersStat,
      value: stpNumFmt.format(members.length),
      detail: `${stpNumFmt.format(activeMembers.length)} ${labels.activeSuffix}${invitedCount > 0 ? ` · ${stpNumFmt.format(invitedCount)} ${labels.invitedSuffix}` : ""}`,
    },
    seatLimit !== undefined
      ? {
          id: "seats",
          label: labels.seatsStat,
          value: (
            <>
              {stpNumFmt.format(members.length)} <i>of {stpNumFmt.format(seatLimit)}</i>
            </>
          ),
          progress: seatLimit > 0 ? members.length / seatLimit : 0,
        }
      : {
          id: "invited",
          label: labels.invitedBadge,
          value: stpNumFmt.format(invitedCount),
          detail: invitedCount === 1 ? "Pending response" : "Pending responses",
        },
    {
      id: "admins",
      label: labels.adminsStat,
      value: stpNumFmt.format(adminCount),
      detail: labels.adminsNote,
    },
  ];

  const submitInvite = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!validInvite || submittingInvite) return;
    const cleaned = inviteMode === "email" ? inviteTarget.trim().toLowerCase() : inviteTarget.trim();
    if (!managed) {
      if (members.some((item) => item.email.toLowerCase() === cleaned.toLowerCase())) {
        onNotice?.(`${cleaned} is already in the workspace`);
        return;
      }
      setLocalMembers((prev) => [
        ...prev,
        { id: `inv-${Date.now()}`, email: cleaned, role: inviteRole, plan: plans[1] ?? "Pro", usage: 0, invited: true },
      ]);
      onNotice?.(`Invite sent to ${cleaned}`);
    }
    onInvite?.({ target: cleaned, role: inviteRole });
    setInviteTarget("");
    setInviteOpen(false);
  };

  const handleRoleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir || roles.length === 0) return;
    event.preventDefault();
    const idx = Math.max(0, roles.indexOf(inviteRole));
    const next = roles[(idx + dir + roles.length) % roles.length];
    if (!next) return;
    setInviteRole(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-role="${CSS.escape(next)}"]`)?.focus();
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }
    const rows = [
      ["Name", "Email", "Role", "Status"],
      ...members.map((m) => [m.name ?? "", m.email, m.role, m.invited ? "Invited" : "Active"]),
    ]
      .map((cols) => cols.map((col) => `"${col.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
      const url = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "members.csv";
      link.click();
      URL.revokeObjectURL(url);
    }
    onNotice?.(`${stpNumFmt.format(members.length)} members exported`);
  };

  return (
    <div className="ui-stp__members">
      <style href="ui-settings-panel" precedence="default">
        {css}
      </style>
      {showTeamsTab && (
        <SettingsTabs
          items={[
            { id: "Members", label: "Members", count: members.length },
            { id: "Teams", label: "Teams", count: teams.length },
          ]}
          value={tab}
          onChange={(id) => setTab(id === "Teams" ? "Teams" : "Members")}
        />
      )}

      {error && (
        <SettingsNote tone="danger" role="alert">
          {error}
        </SettingsNote>
      )}

      {tab === "Members" ? (
        <div className="ui-stp__panel">
          <SettingsStats stats={stats} loading={loading} />

          {inlineInvite && canManage && (
            <form className="ui-stp__inline-invite" onSubmit={submitInvite}>
              <input
                className="ui-stp__input"
                type={inviteMode === "email" ? "email" : "text"}
                value={inviteTarget}
                placeholder={labels.invitePlaceholder}
                aria-label={labels.inviteInputLabel}
                disabled={loading || submittingInvite}
                onChange={(event) => setInviteTarget(event.target.value)}
              />
              <SettingsButton type="submit" variant="primary" disabled={!validInvite || loading || submittingInvite}>
                {labels.inviteSubmit}
              </SettingsButton>
            </form>
          )}

          <div className="ui-stp__toolbar">
            <label className="ui-stp__search">
              <Icon name="search" size={14} />
              <input
                type="search"
                value={query}
                placeholder={labels.searchPlaceholder}
                aria-label={labels.searchPlaceholder}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {roles.length > 1 && (
              <select
                className="ui-stp__role-select"
                aria-label="Filter by role"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="">{labels.allRoles}</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            )}
            <div className="ui-stp__toolbar-end">
              {showExport && (
                <SettingsButton variant="ghost" icon="download" disabled={loading} onClick={handleExport}>
                  {labels.exportButton}
                </SettingsButton>
              )}
              {!inlineInvite && canManage && (
                <div className="ui-stp__anchor">
                  <SettingsButton
                    ref={inviteTriggerRef}
                    variant="primary"
                    icon="plus"
                    aria-expanded={inviteOpen}
                    disabled={loading}
                    onClick={() => setInviteOpen((prev) => !prev)}
                  >
                    {labels.inviteTrigger}
                  </SettingsButton>
                  {inviteOpen && (
                    <div
                      className="ui-stp__popover"
                      role="dialog"
                      aria-label={labels.inviteTitle}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.stopPropagation();
                          setInviteOpen(false);
                          inviteTriggerRef.current?.focus();
                        }
                      }}
                    >
                      <form onSubmit={submitInvite}>
                        <b>{labels.inviteTitle}</b>
                        <span>{labels.inviteHint}</span>
                        <input
                          className="ui-stp__input"
                          autoFocus
                          type={inviteMode === "email" ? "email" : "text"}
                          value={inviteTarget}
                          placeholder={labels.invitePlaceholder}
                          aria-label={labels.inviteInputLabel}
                          onChange={(event) => setInviteTarget(event.target.value)}
                        />
                        {roles.length > 1 && (
                          <div
                            className="ui-stp__invite-roles"
                            role="radiogroup"
                            aria-label="Role"
                            onKeyDown={handleRoleKeyDown}
                          >
                            {roles.map((role) => (
                              <button
                                key={role}
                                type="button"
                                role="radio"
                                data-role={role}
                                aria-checked={inviteRole === role}
                                tabIndex={inviteRole === role ? 0 : -1}
                                onClick={() => setInviteRole(role)}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="ui-stp__popover-foot">
                          <SettingsButton variant="ghost" onClick={() => setInviteOpen(false)}>
                            Cancel
                          </SettingsButton>
                          <SettingsButton type="submit" variant="primary" disabled={!validInvite || submittingInvite}>
                            {labels.inviteSubmit}
                          </SettingsButton>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className="ui-stp__table"
            role="table"
            aria-label={labels.membersStat}
            data-compact={(!showPlans && !showUsage) || undefined}
          >
            <div className="ui-stp__tr ui-stp__tr--head" role="row" data-skel={loading ? "" : undefined}>
              <span role="columnheader">Name</span>
              <span role="columnheader">Role</span>
              {showPlans && <span role="columnheader">Plan</span>}
              {showUsage && <span role="columnheader">Usage</span>}
              <span role="columnheader" aria-label="Actions" />
            </div>

            {loading
              ? [0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="ui-stp__tr" role="row" data-skel="">
                    <span role="cell" className="ui-stp__person">
                      <span className="ui-stp__skel" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                      <span className="ui-stp__person-text">
                        <span className="ui-stp__skel" style={{ width: 96, height: 12 }} />
                        <span className="ui-stp__skel" style={{ width: 120, height: 9, marginTop: 4 }} />
                      </span>
                    </span>
                    <span role="cell">
                      <span className="ui-stp__skel" style={{ width: 54, height: 12 }} />
                    </span>
                    {showPlans && (
                      <span role="cell">
                        <span className="ui-stp__skel" style={{ width: 62, height: 22, borderRadius: 6 }} />
                      </span>
                    )}
                    {showUsage && (
                      <span role="cell">
                        <span className="ui-stp__skel" style={{ width: 72, height: 10 }} />
                      </span>
                    )}
                    <span role="cell" />
                  </div>
                ))
              : filtered.map((member) => {
                  const name = memberLabel(member);
                  const isMe = member.id === me;
                  const isBusy = busyMemberId === member.id;
                  const pct = Math.round(clamp(member.usage ?? 0, 0, 1) * 100);
                  const actionLabel =
                    member.removeLabel ?? (member.invited ? labels.cancelInvite : labels.removeMember);
                  return (
                    <div key={member.id} className="ui-stp__tr" role="row">
                      <span role="cell" className="ui-stp__person">
                        <span
                          className="ui-stp__avatar"
                          style={{ "--ui-stp-h": avatarHue(member.id) } as CSSProperties}
                          aria-hidden="true"
                        >
                          {memberInitials(member)}
                        </span>
                        <span className="ui-stp__person-text">
                          <b>
                            <span title={name}>{name}</span>
                            {isMe && <i>{labels.youSuffix}</i>}
                            {member.invited && <em>{labels.invitedBadge}</em>}
                          </b>
                          {member.name && member.email && <small title={member.email}>{member.email}</small>}
                        </span>
                      </span>

                      <span role="cell">
                        {canManage && (!managed || onRoleChange) && roles.length > 1 && !member.invited ? (
                          <select
                            className="ui-stp__cell-select"
                            aria-label={`Role of ${name}`}
                            value={member.role}
                            disabled={isBusy}
                            onChange={(event) => {
                              const nextRole = event.target.value;
                              if (!managed) {
                                setLocalMembers((prev) =>
                                  prev.map((m) => (m.id === member.id ? { ...m, role: nextRole } : m)),
                                );
                                onNotice?.(`${name} is now ${nextRole}`);
                              }
                              onRoleChange?.(member.id, nextRole);
                            }}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <SettingsBadge
                            tone={member.role.toLowerCase() === adminRole.toLowerCase() ? "accent" : "neutral"}
                          >
                            {member.role}
                          </SettingsBadge>
                        )}
                      </span>

                      {showPlans && (
                        <span role="cell">
                          {canManage && (!managed || onPlanChange) && plans.length > 0 ? (
                            <select
                              className="ui-stp__cell-select ui-stp__cell-select--chip"
                              data-plan={member.plan}
                              aria-label={`Plan of ${name}`}
                              value={member.plan ?? plans[0]}
                              onChange={(event) => {
                                const nextPlan = event.target.value;
                                if (!managed) {
                                  setLocalMembers((prev) =>
                                    prev.map((m) => (m.id === member.id ? { ...m, plan: nextPlan } : m)),
                                  );
                                  onNotice?.(`${name} moved to ${nextPlan}`);
                                }
                                onPlanChange?.(member.id, nextPlan);
                              }}
                            >
                              {plans.map((plan) => (
                                <option key={plan} value={plan}>
                                  {plan}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <SettingsBadge>{member.plan ?? "—"}</SettingsBadge>
                          )}
                        </span>
                      )}

                      {showUsage && (
                        <span role="cell" className="ui-stp__usage">
                          {member.invited ? (
                            <small>—</small>
                          ) : (
                            <>
                              <span className="ui-stp__usage-bar" data-high={pct >= 80 || undefined}>
                                <i style={{ width: `${pct}%` }} />
                              </span>
                              <small>{pct}%</small>
                            </>
                          )}
                        </span>
                      )}

                      <span role="cell" className="ui-stp__row-actions">
                        {member.invited && (!managed || onResendInvite) && canManage && (
                          <SettingsButton
                            variant="ghost"
                            disabled={isBusy}
                            onClick={() => {
                              if (!managed) onNotice?.(`Invite sent again to ${member.email}`);
                              onResendInvite?.(member.id, member);
                            }}
                          >
                            {labels.resendInvite}
                          </SettingsButton>
                        )}
                        {canManage && !isMe && (!managed || onRemove) && (
                          <SettingsButton
                            variant="ghost"
                            aria-label={member.removeLabel ?? `${actionLabel}: ${name}`}
                            disabled={isBusy}
                            onClick={() => {
                              if (!managed) {
                                setLocalMembers((prev) => prev.filter((m) => m.id !== member.id));
                                onNotice?.(`${name} removed`);
                              }
                              onRemove?.(member.id, member);
                            }}
                          >
                            {member.invited ? "Revoke" : "Remove"}
                          </SettingsButton>
                        )}
                      </span>
                    </div>
                  );
                })}

            {!loading && filtered.length === 0 && (
              <p className="ui-stp__empty">{query ? labels.emptySearch(query) : labels.emptyRole}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="ui-stp__panel">
          <div className="ui-stp__toolbar">
            {!loading && (
              <span className="ui-stp__count">
                {teams.length === 1 ? "1 team" : `${stpNumFmt.format(teams.length)} teams`}
              </span>
            )}
            <div className="ui-stp__toolbar-end">
              {canManage && (
                <SettingsButton
                  variant="primary"
                  icon="plus"
                  disabled={loading}
                  onClick={() => {
                    const existing = new Set(teams.map((t) => t.name));
                    let nextName = "New team";
                    for (let n = 2; existing.has(nextName); n++) nextName = `New team ${n}`;
                    if (!managed) {
                      setLocalTeams((prev) => [...prev, { id: `team-${Date.now()}`, name: nextName, members: [me] }]);
                      onNotice?.(`${nextName} created`);
                    }
                    onCreateTeam?.(nextName);
                  }}
                >
                  {labels.newTeam}
                </SettingsButton>
              )}
            </div>
          </div>

          <div className="ui-stp__table" role="list" aria-label="Teams">
            {teams.map((team) => {
              const resolved = team.members.map((id) => byId.get(id)).filter((m): m is SettingsMember => Boolean(m));
              return (
                <div key={team.id} className="ui-stp__team" role="listitem">
                  <span className="ui-stp__team-mark" aria-hidden="true">
                    {Array.from(team.name)[0]?.toUpperCase() ?? "T"}
                  </span>
                  <span className="ui-stp__person-text">
                    <b title={team.name}>{team.name}</b>
                    <small>{resolved.length === 1 ? "1 member" : `${stpNumFmt.format(resolved.length)} members`}</small>
                  </span>
                  <span className="ui-stp__faces" aria-label={resolved.map(memberLabel).join(", ") || "No members"}>
                    {resolved.slice(0, 4).map((m) => (
                      <span
                        key={m.id}
                        className="ui-stp__avatar"
                        style={{ "--ui-stp-h": avatarHue(m.id) } as CSSProperties}
                        title={memberLabel(m)}
                      >
                        {memberInitials(m)}
                      </span>
                    ))}
                    {resolved.length > 4 && <span className="ui-stp__faces-more">+{resolved.length - 4}</span>}
                  </span>
                  {canManage && (
                    <SettingsButton
                      variant="ghost"
                      aria-label={`${labels.deleteTeam} ${team.name}`}
                      onClick={() => {
                        if (!managed) {
                          setLocalTeams((prev) => prev.filter((t) => t.id !== team.id));
                          onNotice?.(`${team.name} deleted`);
                        }
                        onDeleteTeam?.(team.id);
                      }}
                    >
                      Delete
                    </SettingsButton>
                  )}
                </div>
              );
            })}
            {teams.length === 0 && <p className="ui-stp__empty">{labels.emptyTeams}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-stp,
.ui-stp__card,
.ui-stp__stats,
.ui-stp__note,
.ui-stp__members,
.ui-stp__tabs,
.ui-stp__copy,
.ui-stp__badge,
.ui-stp__btn,
.ui-stp__toast {
  --ui-stp-card: var(--aui-surface, #ffffff);
  --ui-stp-frame: var(--aui-subtle, rgba(0, 0, 0, 0.025));
  --ui-stp-strong: var(--aui-ink, #000000);
  --ui-stp-ink: var(--aui-ink, rgba(0, 0, 0, 0.88));
  --ui-stp-text: var(--aui-muted, rgba(0, 0, 0, 0.65));
  --ui-stp-muted: var(--aui-muted, rgba(0, 0, 0, 0.48));
  --ui-stp-faint: rgba(0, 0, 0, 0.28);
  --ui-stp-line: var(--aui-border, rgba(0, 0, 0, 0.065));
  --ui-stp-chip: rgba(0, 0, 0, 0.045);
  --ui-stp-hover: rgba(0, 0, 0, 0.03);
  --ui-stp-accent: var(--aui-blue, #0177fb);
  --ui-stp-accent-soft: color-mix(in srgb, var(--ui-stp-accent) 11%, transparent);
  --ui-stp-teal: var(--aui-teal, #13b3a0);
  --ui-stp-amber: var(--aui-amber, #b78103);
  --ui-stp-danger: var(--aui-red, #e53935);
  --ui-stp-focus: var(--aui-focus, rgba(0, 96, 226, 0.7));
  --ui-stp-ease: var(--aui-ease, cubic-bezier(0.22, 1, 0.36, 1));
  --ui-stp-shadow: var(
    --aui-shadow-card,
    0 0 0 0.5px rgba(0, 0, 0, 0.07),
    0 1px 1px -1px rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.05)
  );
  --ui-stp-pop: var(
    --aui-shadow-popover,
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 14px 32px -12px rgba(0, 0, 0, 0.18),
    0 1px 2px 0 rgba(0, 0, 0, 0.05)
  );
  box-sizing: border-box;
  font-family: var(
    --aui-font,
    "Inter",
    "InterVariable",
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif
  );
  color: var(--ui-stp-ink);
  -webkit-font-smoothing: antialiased;
}
:where(.dark, [data-theme="dark"])
  :is(
    .ui-stp,
    .ui-stp__card,
    .ui-stp__stats,
    .ui-stp__note,
    .ui-stp__members,
    .ui-stp__tabs,
    .ui-stp__copy,
    .ui-stp__badge,
    .ui-stp__btn,
    .ui-stp__toast
  ) {
  --ui-stp-card: #1c1c1e;
  --ui-stp-frame: rgba(255, 255, 255, 0.035);
  --ui-stp-strong: #ffffff;
  --ui-stp-ink: rgba(255, 255, 255, 0.9);
  --ui-stp-text: rgba(255, 255, 255, 0.66);
  --ui-stp-muted: rgba(255, 255, 255, 0.48);
  --ui-stp-faint: rgba(255, 255, 255, 0.28);
  --ui-stp-line: rgba(255, 255, 255, 0.085);
  --ui-stp-chip: rgba(255, 255, 255, 0.065);
  --ui-stp-hover: rgba(255, 255, 255, 0.04);
  --ui-stp-accent: #4fb0fe;
  --ui-stp-accent-soft: color-mix(in srgb, #4fb0fe 16%, transparent);
  --ui-stp-teal: #4fc3b4;
  --ui-stp-amber: #e6c24d;
  --ui-stp-danger: #ff6b5f;
  --ui-stp-focus: rgba(77, 141, 255, 0.8);
  --ui-stp-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-stp-pop: 0 0 0 0.5px rgba(255, 255, 255, 0.12), 0 16px 36px -12px rgba(0, 0, 0, 0.72);
}
.ui-stp *,
.ui-stp *::before,
.ui-stp *::after {
  box-sizing: border-box;
}
.ui-stp {
  container: ui-stp / inline-size;
  width: 100%;
  max-width: var(--ui-stp-max, 760px);
  margin: 0 auto;
  padding: 28px 24px 56px;
  font-size: 13px;
  line-height: 20px;
}
.ui-stp__page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.ui-stp__page-titles {
  min-width: 0;
}
.ui-stp__title {
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--ui-stp-strong);
}
.ui-stp__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-stp-muted);
}
.ui-stp__page-actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
}
.ui-stp__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--ui-stp-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-stp-line);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-stp-text);
}
.ui-stp__note > svg {
  flex: none;
  margin-top: 2px;
  color: var(--ui-stp-muted);
}
.ui-stp__note[data-tone="accent"] {
  background: var(--ui-stp-accent-soft);
  box-shadow: none;
  color: var(--ui-stp-accent);
}
.ui-stp__note[data-tone="accent"] > svg {
  color: inherit;
}
.ui-stp__note[data-tone="danger"] {
  background: color-mix(in srgb, var(--ui-stp-danger) 10%, transparent);
  box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--ui-stp-danger) 28%, transparent);
  color: var(--ui-stp-danger);
}
.ui-stp__note[data-tone="danger"] > svg {
  color: inherit;
}
.ui-stp__note-body {
  min-width: 0;
  flex: 1;
}
.ui-stp__section {
  margin-top: 28px;
}
.ui-stp__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.ui-stp__head-text {
  min-width: 0;
}
.ui-stp__head h2 {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-stp-strong);
}
.ui-stp__head p {
  max-width: 620px;
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-stp-muted);
}
.ui-stp__head-actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
}
.ui-stp__card {
  position: relative;
  margin-top: 12px;
  border-radius: 12px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
}
.ui-stp__card--alone {
  margin-top: 24px;
}
.ui-stp__card--danger {
  box-shadow:
    0 0 0 0.5px color-mix(in srgb, var(--ui-stp-danger) 28%, var(--ui-stp-line)),
    0 1px 2px rgba(0, 0, 0, 0.04);
}
.ui-stp__row-wrap + .ui-stp__row-wrap {
  box-shadow: inset 0 0.5px 0 var(--ui-stp-line);
}
.ui-stp__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 60px;
  padding: 10px 12px 10px 16px;
}
.ui-stp__row-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.ui-stp__leading {
  display: flex;
  flex: none;
  align-items: center;
}
.ui-stp__label {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.ui-stp__label-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.ui-stp__label b {
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-stp-strong);
  overflow-wrap: anywhere;
}
.ui-stp__label small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-stp-muted);
  overflow-wrap: anywhere;
}
.ui-stp__control {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.ui-stp__row-foot {
  padding: 12px 14px 14px 16px;
  box-shadow: inset 0 0.5px 0 var(--ui-stp-line);
  animation: ui-stp-rise 240ms var(--ui-stp-ease) both;
}
.ui-stp__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 16px;
  border-radius: 12px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
}
.ui-stp__stats > div {
  display: grid;
  gap: 2px;
  padding: 14px 16px;
}
.ui-stp__stats > div + div {
  box-shadow: inset 0.5px 0 0 var(--ui-stp-line);
}
.ui-stp__stats > div > span:first-child {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-stp-muted);
}
.ui-stp__stats b {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--ui-stp-strong);
}
.ui-stp__stats b i {
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  color: var(--ui-stp-muted);
}
.ui-stp__stats small {
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-stp-muted);
}
.ui-stp__seats {
  display: block;
  height: 4px;
  margin-top: 6px;
  border-radius: 2px;
  background: var(--ui-stp-chip);
  overflow: hidden;
}
.ui-stp__seats i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-stp-accent);
  transition: width 320ms var(--ui-stp-ease);
}
.ui-stp__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 20px;
  padding: 0 7px;
  border-radius: 5px;
  background: var(--ui-stp-chip);
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-stp-text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.ui-stp__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.ui-stp__badge[data-tone="accent"] {
  background: var(--ui-stp-accent-soft);
  color: var(--ui-stp-accent);
}
.ui-stp__badge[data-tone="teal"] {
  background: color-mix(in srgb, var(--ui-stp-teal) 14%, transparent);
  color: var(--ui-stp-teal);
}
.ui-stp__badge[data-tone="amber"] {
  background: color-mix(in srgb, var(--ui-stp-amber) 14%, transparent);
  color: var(--ui-stp-amber);
}
.ui-stp__badge[data-tone="danger"] {
  background: color-mix(in srgb, var(--ui-stp-danger) 12%, transparent);
  color: var(--ui-stp-danger);
}
.ui-stp__btn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 18px;
  color: var(--ui-stp-ink);
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    opacity 140ms ease;
}
.ui-stp__btn[data-size="md"] {
  height: 32px;
  padding: 0 12px;
  border-radius: 7px;
  font-size: 13px;
}
.ui-stp__btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-stp-card), var(--ui-stp-strong) 4%);
}
.ui-stp__btn[data-variant="primary"] {
  background: var(--ui-stp-strong);
  box-shadow: none;
  color: var(--ui-stp-card);
}
.ui-stp__btn[data-variant="primary"]:hover:not(:disabled) {
  opacity: 0.88;
  background: var(--ui-stp-strong);
}
.ui-stp__btn[data-variant="ghost"] {
  background: transparent;
  box-shadow: none;
  color: var(--ui-stp-text);
}
.ui-stp__btn[data-variant="ghost"]:hover:not(:disabled) {
  background: var(--ui-stp-chip);
  color: var(--ui-stp-ink);
}
.ui-stp__btn[data-variant="danger"] {
  background: transparent;
  box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--ui-stp-danger) 36%, transparent);
  color: var(--ui-stp-danger);
}
.ui-stp__btn[data-variant="danger"]:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-stp-danger) 8%, transparent);
}
.ui-stp__btn[data-variant="danger-solid"] {
  background: var(--ui-stp-danger);
  box-shadow: none;
  color: #ffffff;
}
.ui-stp__btn[data-variant="danger-solid"]:hover:not(:disabled) {
  opacity: 0.9;
  background: var(--ui-stp-danger);
}
.ui-stp__btn:disabled {
  opacity: 0.42;
  cursor: default;
}
.ui-stp__btn:focus-visible,
.ui-stp__tab:focus-visible,
.ui-stp__copy-btn:focus-visible,
.ui-stp__cell-select:focus-visible,
.ui-stp__role-select:focus-visible,
.ui-stp__invite-roles button:focus-visible {
  outline: 2px solid var(--ui-stp-focus);
  outline-offset: 2px;
}
.ui-stp__tabs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 8px;
  background: var(--ui-stp-chip);
}
.ui-stp__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ui-stp-muted);
  cursor: pointer;
  transition:
    background-color 140ms ease,
    color 140ms ease;
}
.ui-stp__tab[aria-selected="true"] {
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  color: var(--ui-stp-ink);
}
.ui-stp__tab small {
  font-size: 11px;
  color: var(--ui-stp-muted);
  font-variant-numeric: tabular-nums;
}
.ui-stp__copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 4px 4px 4px 10px;
  border-radius: 8px;
  background: var(--ui-stp-frame);
  box-shadow: inset 0 0 0 0.5px var(--ui-stp-line);
}
.ui-stp__code {
  overflow: hidden;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--ui-stp-strong);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-stp__copy-btn {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-stp-ink);
  cursor: pointer;
}
.ui-stp__copy-btn[data-copied] {
  color: var(--ui-stp-teal);
}
.ui-stp__copy-swap {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
}
.ui-stp__copy-icon {
  grid-area: 1 / 1;
  display: grid;
  place-items: center;
  transition:
    opacity 180ms var(--ui-stp-ease),
    transform 200ms var(--ui-stp-ease);
}
.ui-stp__copy-icon[data-slot="check"] {
  opacity: 0;
  transform: scale(0.75);
}
.ui-stp__copy-btn[data-copied] .ui-stp__copy-icon[data-slot="copy"] {
  opacity: 0;
  transform: scale(0.75);
}
.ui-stp__copy-btn[data-copied] .ui-stp__copy-icon[data-slot="check"] {
  opacity: 1;
  transform: scale(1);
}
.ui-stp__confirm {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}
.ui-stp__confirm-field {
  display: grid;
  flex: 1;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ui-stp-muted);
}
.ui-stp__confirm-field b {
  font-weight: 500;
  color: var(--ui-stp-ink);
}
.ui-stp__input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  font-family: inherit;
  font-size: 13px;
  color: var(--ui-stp-ink);
}
.ui-stp__input:focus {
  outline: none;
  box-shadow: 0 0 0 1.5px var(--ui-stp-focus);
}
.ui-stp__members {
  container: ui-stp / inline-size;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ui-stp__panel {
  display: flex;
  flex-direction: column;
  animation: ui-stp-rise 280ms var(--ui-stp-ease) both;
}
.ui-stp__inline-invite {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}
.ui-stp__inline-invite .ui-stp__input {
  flex: 1;
}
.ui-stp__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}
.ui-stp__toolbar-end {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}
.ui-stp__search {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  width: 240px;
  max-width: 100%;
  height: 30px;
  padding: 0 10px;
  border-radius: 7px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  color: var(--ui-stp-muted);
}
.ui-stp__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 12.5px;
  color: var(--ui-stp-ink);
  outline: none;
}
.ui-stp__role-select,
.ui-stp__cell-select {
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  font-family: inherit;
  font-size: 12.5px;
  color: var(--ui-stp-ink);
  cursor: pointer;
}
.ui-stp__cell-select--chip {
  height: 24px;
  background: var(--ui-stp-chip);
  box-shadow: none;
  font-size: 12px;
  font-weight: 500;
}
.ui-stp__cell-select--chip[data-plan="Business"] {
  background: var(--ui-stp-accent-soft);
  color: var(--ui-stp-accent);
}
.ui-stp__anchor {
  position: relative;
}
.ui-stp__popover {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  z-index: 40;
  width: min(304px, calc(100vw - 32px));
  padding: 14px;
  border-radius: 11px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-pop);
  animation: ui-stp-rise 180ms var(--ui-stp-ease) both;
}
.ui-stp__popover form {
  display: grid;
  gap: 8px;
}
.ui-stp__popover b {
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-stp-strong);
}
.ui-stp__popover form > span {
  font-size: 12px;
  color: var(--ui-stp-muted);
}
.ui-stp__invite-roles {
  display: flex;
  gap: 4px;
  padding: 2px;
  border-radius: 8px;
  background: var(--ui-stp-chip);
}
.ui-stp__invite-roles button {
  flex: 1;
  height: 26px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  color: var(--ui-stp-muted);
  cursor: pointer;
}
.ui-stp__invite-roles button[aria-checked="true"] {
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
  color: var(--ui-stp-ink);
}
.ui-stp__popover-foot {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 2px;
}
.ui-stp__table {
  margin-top: 12px;
  border-radius: 12px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-shadow);
}
.ui-stp__tr {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 116px 110px 116px auto;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 6px 12px 6px 14px;
  transition: background-color 140ms ease;
}
.ui-stp__table[data-compact] .ui-stp__tr {
  grid-template-columns: minmax(0, 1fr) 124px auto;
}
.ui-stp__tr + .ui-stp__tr {
  box-shadow: inset 0 0.5px 0 var(--ui-stp-line);
}
.ui-stp__tr:not(.ui-stp__tr--head):hover {
  background: var(--ui-stp-hover);
}
.ui-stp__tr--head {
  min-height: 38px;
  font-size: 12px;
  color: var(--ui-stp-muted);
}
.ui-stp__tr > span {
  display: flex;
  align-items: center;
  min-width: 0;
}
.ui-stp__person {
  gap: 10px;
}
.ui-stp__person-text {
  display: grid;
  flex: 1;
  min-width: 0;
}
.ui-stp__person-text b {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: var(--ui-stp-strong);
  white-space: nowrap;
}
.ui-stp__person-text b > span {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ui-stp__person-text b i {
  flex: none;
  font-style: normal;
  font-weight: 400;
  color: var(--ui-stp-muted);
}
.ui-stp__person-text b em {
  flex: none;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--ui-stp-chip);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  color: var(--ui-stp-muted);
}
.ui-stp__person-text small {
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
  color: var(--ui-stp-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-stp__avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: hsl(var(--ui-stp-h, 210) 70% 94%);
  font-size: 11px;
  font-weight: 500;
  color: hsl(var(--ui-stp-h, 210) 45% 38%);
}
:where(.dark, [data-theme="dark"]) .ui-stp__avatar {
  background: hsl(var(--ui-stp-h, 210) 30% 22%);
  color: hsl(var(--ui-stp-h, 210) 60% 78%);
}
.ui-stp__usage {
  gap: 8px;
}
.ui-stp__usage-bar {
  display: block;
  flex: none;
  width: 54px;
  height: 4px;
  border-radius: 2px;
  background: var(--ui-stp-chip);
  overflow: hidden;
}
.ui-stp__usage-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--ui-stp-faint);
}
.ui-stp__usage-bar[data-high] i {
  background: #d97506;
}
.ui-stp__usage small {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-stp-muted);
}
.ui-stp__row-actions {
  justify-content: flex-end;
  gap: 4px;
}
.ui-stp__team {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 6px 12px 6px 14px;
}
.ui-stp__team + .ui-stp__team {
  box-shadow: inset 0 0.5px 0 var(--ui-stp-line);
}
.ui-stp__team:hover {
  background: var(--ui-stp-hover);
}
.ui-stp__team-mark {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--ui-stp-chip);
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-stp-text);
}
.ui-stp__faces {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.ui-stp__faces .ui-stp__avatar {
  width: 26px;
  height: 26px;
  box-shadow: 0 0 0 2px var(--ui-stp-card);
}
.ui-stp__faces .ui-stp__avatar + .ui-stp__avatar {
  margin-left: -6px;
}
.ui-stp__faces-more {
  margin-left: 6px;
  font-size: 12px;
  color: var(--ui-stp-muted);
}
.ui-stp__count {
  font-size: 13px;
  color: var(--ui-stp-muted);
}
.ui-stp__empty {
  margin: 0;
  padding: 24px 16px;
  font-size: 13px;
  color: var(--ui-stp-muted);
  text-align: center;
}
.ui-stp__skel {
  display: inline-block;
  border-radius: 5px;
  background: var(--ui-stp-chip);
  animation: ui-stp-pulse 1.5s ease-in-out infinite;
}
.ui-stp [data-skel] {
  pointer-events: none;
}
.ui-stp__toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 70;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 9px;
  background: var(--ui-stp-card);
  box-shadow: var(--ui-stp-pop);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ui-stp-ink);
  animation: ui-stp-rise 220ms var(--ui-stp-ease) both;
}
.ui-stp__toast > svg {
  color: var(--ui-stp-teal);
}
@keyframes ui-stp-rise {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
@keyframes ui-stp-pulse {
  50% {
    opacity: 0.45;
  }
}
@container ui-stp (max-width: 680px) {
  .ui-stp {
    padding: 20px 16px 40px;
  }
  .ui-stp__stats {
    grid-template-columns: minmax(0, 1fr);
  }
  .ui-stp__stats > div + div {
    box-shadow: inset 0 0.5px 0 var(--ui-stp-line);
  }
  .ui-stp__toolbar {
    flex-wrap: wrap;
  }
  .ui-stp__search {
    flex: 1 1 100%;
    width: auto;
  }
  .ui-stp__tr {
    grid-template-columns: minmax(0, 1fr) auto auto;
  }
  .ui-stp__tr:not([data-compact]) > :nth-child(3),
  .ui-stp__tr:not([data-compact]) > :nth-child(4) {
    display: none;
  }
}
@container ui-stp (max-width: 600px) {
  .ui-stp__row,
  .ui-stp__confirm {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 14px;
  }
  .ui-stp__inline-invite {
    flex-direction: column;
    align-items: stretch;
  }
}
@media (pointer: coarse) {
  .ui-stp__btn {
    height: 36px;
  }
  .ui-stp__btn[data-size="md"] {
    height: 40px;
  }
  .ui-stp__input,
  .ui-stp__search,
  .ui-stp__role-select,
  .ui-stp__cell-select {
    height: 38px;
  }
  .ui-stp__tab {
    height: 34px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ui-stp *,
  .ui-stp *::before,
  .ui-stp *::after,
  .ui-stp__toast {
    animation: none !important;
    transition: none !important;
  }
}
.ui-stp,
.ui-stp__card,
.ui-stp__stats,
.ui-stp__note,
.ui-stp__members,
.ui-stp__tabs,
.ui-stp__copy,
.ui-stp__badge,
.ui-stp__btn,
.ui-stp__toast {
  --ui-stp-card: #fff;
  --ui-stp-frame: #f7f7f7;
  --ui-stp-strong: #171717;
  --ui-stp-ink: #171717;
  --ui-stp-text: #404040;
  --ui-stp-muted: #737373;
  --ui-stp-faint: #b5b5b5;
  --ui-stp-line: #e5e5e5;
  --ui-stp-chip: #f5f5f5;
  --ui-stp-hover: #fafafa;
  --ui-stp-focus: #2f6bff;
  --ui-stp-shadow: 0 0 0 1px var(--ui-stp-line), 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 14px;
}
.ui-stp__card,
.ui-stp__stats,
.ui-stp__table {
  border-radius: 14px;
}
.ui-stp__btn {
  height: 32px;
  border-radius: 8px;
}
:where(.dark, [data-theme="dark"]) .ui-stp,
:where(.dark, [data-theme="dark"]) .ui-stp__card,
:where(.dark, [data-theme="dark"]) .ui-stp__stats,
:where(.dark, [data-theme="dark"]) .ui-stp__members,
:where(.dark, [data-theme="dark"]) .ui-stp__btn {
  --ui-stp-card: #232326;
  --ui-stp-frame: #161618;
  --ui-stp-strong: #fff;
  --ui-stp-ink: #ededed;
  --ui-stp-text: #c4c4c4;
  --ui-stp-muted: #8f8f8f;
  --ui-stp-faint: #6b6b70;
  --ui-stp-line: rgba(255, 255, 255, 0.1);
  --ui-stp-chip: #2a2a2d;
  --ui-stp-hover: #26262a;
  --ui-stp-focus: #6b95ff;
}

`;
