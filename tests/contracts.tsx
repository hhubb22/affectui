import type { AppShellProps as ShellClassic } from "../components/app-shell";
import type { AppShellProps as ShellClean } from "../components/app-shell-clean";
import type { AgentThreadProps as ThreadClassic } from "../components/agent-thread";
import type { AgentThreadProps as ThreadClean } from "../components/agent-thread-clean";
import type { ArtifactWorkspaceProps as WorkspaceClassic } from "../components/artifact-workspace";
import type { ArtifactWorkspaceProps as WorkspaceClean } from "../components/artifact-workspace-clean";
import type { ChatComposerProps as ComposerClassic } from "../components/chat-composer";
import type { ChatComposerProps as ComposerClean } from "../components/chat-composer-clean";
import type { CommandMenuProps as CommandsClassic } from "../components/command-menu";
import type { CommandMenuProps as CommandsClean } from "../components/command-menu-clean";
import type { ToolActivityProps as ToolsClassic } from "../components/tool-activity";
import type { ToolActivityProps as ToolsClean } from "../components/tool-activity-clean";
import type { AgentChatRailScreenProps as ScreenClassic } from "../screens/agent-chat-rail";
import type { AgentChatRailScreenProps as ScreenClean } from "../screens/agent-chat-rail-clean";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
const matchingInterfaces: [
  Equal<ShellClassic, ShellClean>,
  Equal<ThreadClassic, ThreadClean>,
  Equal<WorkspaceClassic, WorkspaceClean>,
  Equal<ComposerClassic, ComposerClean>,
  Equal<CommandsClassic, CommandsClean>,
  Equal<ToolsClassic, ToolsClean>,
  Equal<ScreenClassic, ScreenClean>,
] = [true, true, true, true, true, true, true];
void matchingInterfaces;

import type { AgentThreadScreenProps as ThreadScreenClassic } from "../screens/agent-thread";
import type { AgentThreadScreenProps as ThreadScreenClean } from "../screens/agent-thread-clean";
import type { DecisionDockProps as DockClassic } from "../components/decision-dock";
import type { DecisionDockProps as DockClean } from "../components/decision-dock-clean";
import type { ThreadTaskCardProps as TaskClassic } from "../components/thread-task-card";
import type { ThreadTaskCardProps as TaskClean } from "../components/thread-task-card-clean";
import type { ConnectionBannerProps as ConnectionClassic } from "../components/connection-banner";
import type { ConnectionBannerProps as ConnectionClean } from "../components/connection-banner-clean";
import type { AwaySummaryProps as AwayClassic } from "../components/away-summary";
import type { AwaySummaryProps as AwayClean } from "../components/away-summary-clean";
import type { ThreadUploadsProps as UploadClassic } from "../components/thread-uploads";
import type { ThreadUploadsProps as UploadClean } from "../components/thread-uploads-clean";
import type { ThreadVoiceInputProps as VoiceClassic } from "../components/thread-uploads";
import type { ThreadVoiceInputProps as VoiceClean } from "../components/thread-uploads-clean";
import type { TaskDetailsProps as DetailClassic } from "../components/task-details";
import type { TaskDetailsProps as DetailClean } from "../components/task-details-clean";
const matchingThreadInterfaces: [
  Equal<ThreadScreenClassic, ThreadScreenClean>,
  Equal<DockClassic, DockClean>,
  Equal<TaskClassic, TaskClean>,
  Equal<ConnectionClassic, ConnectionClean>,
  Equal<AwayClassic, AwayClean>,
  Equal<UploadClassic, UploadClean>,
  Equal<VoiceClassic, VoiceClean>,
  Equal<DetailClassic, DetailClean>,
] = [true, true, true, true, true, true, true, true];
void matchingThreadInterfaces;

import type { AgentTasksScreenProps as TasksScreenClassic } from "../screens/agent-tasks";
import type { AgentTasksScreenProps as TasksScreenClean } from "../screens/agent-tasks-clean";
import type { TaskProgressRingProps as RingClassic } from "../components/task-progress-ring";
import type { TaskProgressRingProps as RingClean } from "../components/task-progress-ring-clean";
import type { TaskCreateProps as CreateClassic } from "../components/task-create";
import type { TaskCreateProps as CreateClean } from "../components/task-create-clean";
import type { TaskListProps as ListClassic } from "../components/task-list";
import type { TaskListProps as ListClean } from "../components/task-list-clean";
import type { TaskInspectorProps as InspectorClassic } from "../components/task-inspector";
import type { TaskInspectorProps as InspectorClean } from "../components/task-inspector-clean";
import type { ArtifactFolderProps as FolderClassic } from "../components/artifact-folder";
import type { ArtifactFolderProps as FolderClean } from "../components/artifact-folder-clean";
import type { ArtifactImageViewerProps as ImageClassic } from "../components/artifact-image";
import type { ArtifactImageViewerProps as ImageClean } from "../components/artifact-image-clean";
import type {
  WorkspaceStartProps as StartClassic,
  WorkspaceToolProps as WorkToolClassic,
} from "../components/workspace-start";
import type {
  WorkspaceStartProps as StartClean,
  WorkspaceToolProps as WorkToolClean,
} from "../components/workspace-start-clean";
const matchingTaskInterfaces: [
  Equal<TasksScreenClassic, TasksScreenClean>,
  Equal<RingClassic, RingClean>,
  Equal<CreateClassic, CreateClean>,
  Equal<ListClassic, ListClean>,
  Equal<InspectorClassic, InspectorClean>,
  Equal<FolderClassic, FolderClean>,
  Equal<ImageClassic, ImageClean>,
  Equal<StartClassic, StartClean>,
  Equal<WorkToolClassic, WorkToolClean>,
] = [true, true, true, true, true, true, true, true, true];
void matchingTaskInterfaces;

import type { InboxScreenProps as InboxScreenClassic } from "../screens/inbox";
import type { InboxScreenProps as InboxScreenClean } from "../screens/inbox-clean";
import type { InboxOptionsProps as InboxOptionsClassic } from "../components/inbox-options";
import type { InboxOptionsProps as InboxOptionsClean } from "../components/inbox-options-clean";
import type { InboxWireframeProps as InboxWireframeClassic } from "../components/inbox-options";
import type { InboxWireframeProps as InboxWireframeClean } from "../components/inbox-options-clean";
import type { InboxConfirmationProps as InboxConfirmationClassic } from "../components/inbox-feedback";
import type { InboxConfirmationProps as InboxConfirmationClean } from "../components/inbox-feedback-clean";
import type { InboxEmptyStateProps as InboxEmptyStateClassic } from "../components/inbox-feedback";
import type { InboxEmptyStateProps as InboxEmptyStateClean } from "../components/inbox-feedback-clean";
import type { InboxListProps as InboxListClassic } from "../components/inbox-list";
import type { InboxListProps as InboxListClean } from "../components/inbox-list-clean";
import type { InboxItemViewProps as InboxItemViewClassic } from "../components/inbox-item-view";
import type { InboxItemViewProps as InboxItemViewClean } from "../components/inbox-item-view-clean";
import type { InboxTaskContextProps as InboxTaskContextClassic } from "../components/inbox-task-context";
import type { InboxTaskContextProps as InboxTaskContextClean } from "../components/inbox-task-context-clean";
const matchingInboxInterfaces: [
  Equal<InboxScreenClassic, InboxScreenClean>,
  Equal<InboxOptionsClassic, InboxOptionsClean>,
  Equal<InboxWireframeClassic, InboxWireframeClean>,
  Equal<InboxConfirmationClassic, InboxConfirmationClean>,
  Equal<InboxEmptyStateClassic, InboxEmptyStateClean>,
  Equal<InboxListClassic, InboxListClean>,
  Equal<InboxItemViewClassic, InboxItemViewClean>,
  Equal<InboxTaskContextClassic, InboxTaskContextClean>,
] = [true, true, true, true, true, true, true, true];
void matchingInboxInterfaces;

const managedThreadContract = {
  managed: true,
  stopping: true,
  renderMessageContent: (_message, defaultContent) => defaultContent,
  timeline: null,
  labels: {
    waitingQuestions: (count) => `${count} pending`,
    decisions: { submitting: "Pending" },
  },
  formatTime: (timestamp) => String(timestamp),
} satisfies ThreadClassic & ThreadClean;
const managedComposerContract = {
  managed: true,
  toolbar: null,
  overlay: "Caller-owned overlay",
  attachments: [{ id: "/native/file", name: "file" }],
  textareaProps: {
    ref: { current: null },
    "aria-label": "Draft",
    onKeyDown: (event) => event.preventDefault(),
    disabled: false,
  },
} satisfies ComposerClassic & ComposerClean;
const managedDockContract = {
  managed: true,
  decisions: [
    {
      id: "permission",
      kind: "approval",
      task: "Task",
      question: "Allow?",
      options: [{ id: "allow-once", title: "Once" }],
      allowCustomAnswer: false,
      status: "submitting",
      error: "Try again",
      answer: { option: "allow-once" },
      disabled: true,
    },
  ],
} satisfies DockClassic & DockClean;
const managedScreenContract = {
  ...managedThreadContract,
  threadLabels: managedThreadContract.labels,
  labels: { openSidebar: "Open navigation" },
  sidebar: null,
  header: "Caller-owned titlebar",
} satisfies ThreadScreenClassic & ThreadScreenClean;
const controlledTextareaContract: ComposerClean["textareaProps"] = {
  // @ts-expect-error Use the existing onValueChange API, not an overriding textarea event.
  onChange: () => {},
};
void [
  managedComposerContract,
  managedDockContract,
  managedScreenContract,
  controlledTextareaContract,
];

import type { FilesBrowserProps as FilesClassic } from "../components/files-browser";
import type { FilesBrowserProps as FilesClean } from "../components/files-browser-clean";
import type { FilesScreenProps as FilesScreenClassic } from "../screens/files";
import type { FilesScreenProps as FilesScreenClean } from "../screens/files-clean";
const matchingFilesInterfaces: [
  Equal<FilesClassic, FilesClean>,
  Equal<FilesScreenClassic, FilesScreenClean>,
] = [true, true];
const controlledFilesContract = {
  folders: [],
  templates: [],
  onFoldersChange: (folders) => folders.map((folder) => folder.id),
  onTemplatesChange: (templates) => templates.map((template) => template.type),
  onOpenFolder: (folder) => folder.name,
  onOpenTemplate: (template) => template.owner,
} satisfies FilesClassic & FilesClean;
void [matchingFilesInterfaces, controlledFilesContract];

import type { AgentChatScreenProps as CampaignScreenClassic } from "../screens/agent-chat";
import type { AgentChatScreenProps as CampaignScreenClean } from "../screens/agent-chat-clean";
import type { CampaignBriefProps as BriefClassic } from "../components/campaign-brief";
import type { CampaignBriefProps as BriefClean } from "../components/campaign-brief-clean";
const matchingCampaignInterfaces: [
  Equal<CampaignScreenClassic, CampaignScreenClean>,
  Equal<BriefClassic, BriefClean>,
] = [true, true];
const controlledCampaignContract = {
  messages: [],
  onMessagesChange: (messages) => messages.map((message) => message.role),
  onSend: (text, options) => [text, options.model],
  onStop: () => {},
  busy: false,
  files: [],
  onFilesChange: (files) => files.map((file) => file.name),
  briefProps: {
    angle: "Social proof",
    channels: { instagram: false, tiktok: true, facebook: true },
    section: "assets",
    assets: [],
    generating: true,
    onGenerate: () => {},
    onAngleChange: (angle) => angle,
  },
} satisfies CampaignScreenClassic & CampaignScreenClean;
void [matchingCampaignInterfaces, controlledCampaignContract];
