import { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import { ControlledComposer, UntrustedDocument } from "./controlled";
import type { ThreadPreset } from "../screens/agent-thread-clean";
const CleanThreadScreen = lazy(() =>
  import("../screens/agent-thread-clean").then((module) => ({
    default: module.AgentThreadScreen,
  })),
);
const ClassicThreadScreen = lazy(() =>
  import("../screens/agent-thread").then((module) => ({
    default: module.AgentThreadScreen,
  })),
);
const ThreadDemos = lazy(() => import("./thread-demos"));
const ThreadFixtures = lazy(() => import("./thread-fixtures"));
const ManagedFixtures = lazy(() => import("./managed-fixtures"));
const CleanTasksScreen = lazy(() =>
  import("../screens/agent-tasks-clean").then((module) => ({
    default: module.AgentTasksScreen,
  })),
);
const ClassicTasksScreen = lazy(() =>
  import("../screens/agent-tasks").then((module) => ({
    default: module.AgentTasksScreen,
  })),
);
const TaskDemos = lazy(() => import("./task-demos"));
const InboxDemos = lazy(() => import("./inbox-demos"));
const CleanInboxScreen = lazy(() =>
  import("../screens/inbox-clean").then((module) => ({
    default: module.InboxScreen,
  })),
);
const ClassicInboxScreen = lazy(() =>
  import("../screens/inbox").then((module) => ({
    default: module.InboxScreen,
  })),
);
const CleanOverviewScreen = lazy(() =>
  import("../screens/assistant-overview-clean").then((module) => ({
    default: module.AssistantOverviewScreen,
  })),
);
const ClassicOverviewScreen = lazy(() =>
  import("../screens/assistant-overview").then((module) => ({
    default: module.AssistantOverviewScreen,
  })),
);
const CleanFilesScreen = lazy(() =>
  import("../screens/files-clean").then((module) => ({
    default: module.FilesScreen,
  })),
);
const ClassicFilesScreen = lazy(() =>
  import("../screens/files").then((module) => ({
    default: module.FilesScreen,
  })),
);
const CleanIntegrationsScreen = lazy(() =>
  import("../screens/integrations-clean").then((module) => ({
    default: module.IntegrationsScreen,
  })),
);
const ClassicIntegrationsScreen = lazy(() =>
  import("../screens/integrations").then((module) => ({
    default: module.IntegrationsScreen,
  })),
);
const CleanAppDirectory = lazy(() =>
  import("../components/app-directory-clean").then((module) => ({
    default: module.AppDirectory,
  })),
);
const ClassicAppDirectory = lazy(() =>
  import("../components/app-directory").then((module) => ({
    default: module.AppDirectory,
  })),
);
const IntegrationDemos = lazy(() => import("./integration-demos"));
const CleanFilesBrowser = lazy(() =>
  import("../components/files-browser-clean").then((module) => ({
    default: module.FilesBrowser,
  })),
);
const ClassicFilesBrowser = lazy(() =>
  import("../components/files-browser").then((module) => ({
    default: module.FilesBrowser,
  })),
);
const CleanAgentChat = lazy(() =>
  import("../screens/agent-chat-clean").then((module) => ({
    default: module.AgentChatScreen,
  })),
);
const ClassicAgentChat = lazy(() =>
  import("../screens/agent-chat").then((module) => ({
    default: module.AgentChatScreen,
  })),
);
const CleanCampaignBrief = lazy(() =>
  import("../components/campaign-brief-clean").then((module) => ({
    default: module.CampaignBrief,
  })),
);
const ClassicCampaignBrief = lazy(() =>
  import("../components/campaign-brief").then((module) => ({
    default: module.CampaignBrief,
  })),
);
const CleanOverviewCards = lazy(() =>
  import("../components/overview-cards-clean").then((module) => ({
    default: module.OverviewCards,
  })),
);
const ClassicOverviewCards = lazy(() =>
  import("../components/overview-cards").then((module) => ({
    default: module.OverviewCards,
  })),
);
const CleanScreen = lazy(() =>
  import("../screens/agent-chat-rail-clean").then((module) => ({
    default: module.AgentChatRailScreen,
  })),
);
const ClassicScreen = lazy(() =>
  import("../screens/agent-chat-rail").then((module) => ({
    default: module.AgentChatRailScreen,
  })),
);
const CleanShell = lazy(() =>
  import("../components/app-shell-clean").then((module) => ({
    default: module.AppShell,
  })),
);
const ClassicShell = lazy(() =>
  import("../components/app-shell").then((module) => ({
    default: module.AppShell,
  })),
);
const CleanThread = lazy(() =>
  import("../components/agent-thread-clean").then((module) => ({
    default: module.AgentThread,
  })),
);
const ClassicThread = lazy(() =>
  import("../components/agent-thread").then((module) => ({
    default: module.AgentThread,
  })),
);
const CleanWorkspace = lazy(() =>
  import("../components/artifact-workspace-clean").then((module) => ({
    default: module.ArtifactWorkspace,
  })),
);
const ClassicWorkspace = lazy(() =>
  import("../components/artifact-workspace").then((module) => ({
    default: module.ArtifactWorkspace,
  })),
);
const CleanComposer = lazy(() =>
  import("../components/chat-composer-clean").then((module) => ({
    default: module.ChatComposer,
  })),
);
const ClassicComposer = lazy(() =>
  import("../components/chat-composer").then((module) => ({
    default: module.ChatComposer,
  })),
);
const CleanCommands = lazy(() =>
  import("../components/command-menu-clean").then((module) => ({
    default: module.CommandMenu,
  })),
);
const ClassicCommands = lazy(() =>
  import("../components/command-menu").then((module) => ({
    default: module.CommandMenu,
  })),
);
const CleanTools = lazy(() =>
  import("../components/tool-activity-clean").then((module) => ({
    default: module.ToolActivity,
  })),
);
const ClassicTools = lazy(() =>
  import("../components/tool-activity").then((module) => ({
    default: module.ToolActivity,
  })),
);

function Preview() {
  const query = new URLSearchParams(location.search);
  const clean = query.get("style") !== "classic";
  const theme = query.get("theme") === "dark" ? "dark" : "light";
  const component = query.get("component");
  const [notice, setNotice] = useState("");
  const presets: { id: ThreadPreset; label: string }[] = [
    { id: "live", label: "Live" },
    { id: "decision", label: "Decision" },
    { id: "scrolled", label: "Scrolled up" },
    { id: "offline", label: "Offline" },
    { id: "uploading", label: "Uploading" },
    { id: "dictating", label: "Dictating" },
    { id: "away", label: "Away summary" },
    { id: "error", label: "Error" },
  ];
  const [preset, setPreset] = useState<ThreadPreset>(
    presets.find((item) => item.id === query.get("state"))?.id ?? "live",
  );
  const ThreadScreen = clean ? CleanThreadScreen : ClassicThreadScreen;
  if (
    query.get("screen") === "integrations" ||
    component === "app-directory" ||
    component === "integration-card" ||
    component === "integration-request" ||
    component === "controlled-integrations"
  ) {
    const Screen = clean ? CleanIntegrationsScreen : ClassicIntegrationsScreen;
    const Directory = clean ? CleanAppDirectory : ClassicAppDirectory;
    return (
      <div
        data-theme={theme}
        style={{
          height: "100%",
          overflow: "auto",
          background:
            theme === "dark" ? (clean ? "#1c1c1e" : "#232326") : "white",
          containerType: "inline-size",
          containerName: clean ? "ui-asc" : "ui-as",
        }}
      >
        {component === "app-directory" ? (
          <Directory />
        ) : component ? (
          <IntegrationDemos name={component} clean={clean} />
        ) : (
          <Screen
            defaultTheme={theme}
            layout={query.get("layout") === "flat" ? "flat" : "inset"}
            onNavigate={setNotice}
          />
        )}
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              zIndex: 80,
              top: 16,
              left: "50%",
              padding: "6px 14px",
              borderRadius: 8,
              background: "#232326",
              color: "white",
              font: "12px system-ui",
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  if (query.get("screen") === "agent-chat" || component === "campaign-brief") {
    const AgentChat = clean ? CleanAgentChat : ClassicAgentChat;
    const CampaignBrief = clean ? CleanCampaignBrief : ClassicCampaignBrief;
    return (
      <div
        data-theme={theme}
        style={{
          height: "100%",
          background: theme === "dark" ? "#1c1c1e" : "white",
        }}
      >
        {component === "campaign-brief" ? (
          <div
            style={{
              width: "min(368px, 100%)",
              height: "100%",
              overflow: "auto",
              padding: 16,
            }}
          >
            <CampaignBrief
              onGenerate={() => setNotice("Generation requested")}
            />
          </div>
        ) : (
          <AgentChat
            defaultTheme={theme}
            layout={query.get("layout") === "flat" ? "flat" : "inset"}
            onNavigate={setNotice}
          />
        )}
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              zIndex: 80,
              top: 16,
              left: "50%",
              padding: "6px 14px",
              borderRadius: 8,
              background: "#232326",
              color: "white",
              font: "12px system-ui",
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  if (query.get("screen") === "files" || component === "files-browser") {
    const FilesScreen = clean ? CleanFilesScreen : ClassicFilesScreen;
    const FilesBrowser = clean ? CleanFilesBrowser : ClassicFilesBrowser;
    const browserProps = {
      onOpenFolder: (folder: { name: string }) =>
        setNotice(`Folder: ${folder.name}`),
      onOpenTemplate: (template: { name: string }) =>
        setNotice(`Template: ${template.name}`),
    };
    return (
      <div
        data-theme={theme}
        style={{
          height: "100%",
          containerType: "inline-size",
          containerName: "ui-as ui-asc ui-fls-main ui-flsc-main",
        }}
      >
        {component === "files-browser" ? (
          <FilesBrowser {...browserProps} />
        ) : (
          <FilesScreen
            defaultTheme={theme}
            layout={query.get("layout") === "flat" ? "flat" : "inset"}
            browserProps={browserProps}
            onNavigate={setNotice}
          />
        )}
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              zIndex: 80,
              top: 16,
              left: "50%",
              padding: "6px 14px",
              borderRadius: 8,
              background: "#232326",
              color: "white",
              font: "12px system-ui",
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  if (
    query.get("screen") === "inbox" ||
    component?.startsWith("inbox-") ||
    component === "controlled-inbox"
  )
    return (
      <InboxDemos
        screen={query.get("screen") === "inbox"}
        name={component ?? undefined}
        clean={clean}
        theme={theme}
        Screen={clean ? CleanInboxScreen : ClassicInboxScreen}
      />
    );
  if (query.get("screen") === "assistant-overview") {
    const OverviewScreen = clean ? CleanOverviewScreen : ClassicOverviewScreen;
    return (
      <div data-theme={theme} style={{ height: "100%" }}>
        <OverviewScreen
          defaultTheme={theme}
          layout={query.get("layout") === "flat" ? "flat" : "inset"}
          onNavigate={(label) => {
            setNotice(label);
            window.setTimeout(() => setNotice(""), 1800);
          }}
          onSend={(text) => setNotice(`Sent: ${text}`)}
        />
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              top: 16,
              left: "50%",
              padding: "6px 14px",
              borderRadius: 8,
              background: "#232326",
              color: "white",
              font: "12px system-ui",
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  if (query.get("screen") === "agent-tasks")
    return (
      <TaskDemos
        screen
        clean={clean}
        theme={theme}
        flat={query.get("layout") === "flat"}
        Screen={clean ? CleanTasksScreen : ClassicTasksScreen}
      />
    );
  if (
    component &&
    [
      "task-progress-ring",
      "task-create",
      "task-list",
      "task-inspector",
      "artifact-folder",
      "artifact-image",
      "workspace-start",
      "controlled-tasks",
    ].includes(component)
  )
    return (
      <TaskDemos
        name={component}
        clean={clean}
        theme={theme}
        Screen={clean ? CleanTasksScreen : ClassicTasksScreen}
      />
    );
  if (component === "controlled-thread" || component === "upload-thread")
    return <ThreadFixtures variant={component} />;
  if (component?.startsWith("managed-"))
    return <ManagedFixtures variant={component} clean={clean} theme={theme} />;
  if (query.get("screen") === "agent-thread")
    return (
      <div
        style={{
          height: "100%",
          background: theme === "dark" ? "#111113" : "#f8f8f8",
        }}
      >
        <div style={{ height: "calc(100% - 52px)" }}>
          <ThreadScreen
            key={preset}
            simulate={preset}
            defaultTheme={theme}
            onNavigate={(label) => {
              setNotice(label);
              window.setTimeout(() => setNotice(""), 1800);
            }}
          />
        </div>
        <div
          role="radiogroup"
          aria-label="Demo state"
          style={{
            position: "fixed",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            maxWidth: "calc(100vw - 16px)",
            padding: 3,
            overflowX: "auto",
            background: theme === "dark" ? "#2a2a2d" : "#e4e4e7",
            borderRadius: 9,
            font: "500 12px/1 system-ui",
            scrollbarWidth: "none",
          }}
        >
          {presets.map((item) => (
            <button
              type="button"
              role="radio"
              aria-checked={preset === item.id}
              key={item.id}
              onClick={() => {
                setPreset(item.id);
                const next = new URL(location.href);
                next.searchParams.set("state", item.id);
                history.replaceState(null, "", next);
              }}
              style={{
                flex: "none",
                height: 26,
                padding: "0 10px",
                border: 0,
                borderRadius: 6,
                cursor: "pointer",
                font: "inherit",
                background:
                  preset === item.id
                    ? theme === "dark"
                      ? "#404044"
                      : "white"
                    : "transparent",
                color: theme === "dark" ? "#ededed" : "#52525b",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              top: 16,
              left: "50%",
              padding: "6px 14px",
              borderRadius: 8,
              background: "#232326",
              color: "white",
              font: "12px system-ui",
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  if (
    component &&
    [
      "thread-task-card",
      "decision-dock",
      "connection-banner",
      "away-summary",
      "thread-uploads",
      "task-details",
    ].includes(component)
  )
    return <ThreadDemos name={component} clean={clean} theme={theme} />;
  const Screen = clean ? CleanScreen : ClassicScreen;
  if (component === "controlled") return <ControlledComposer />;
  if (component === "untrusted-document") return <UntrustedDocument />;
  if (!component)
    return (
      <Screen
        defaultTheme={theme}
        layout={query.get("layout") === "flat" ? "flat" : "inset"}
        onNavigate={(label) => {
          setNotice(label);
          window.setTimeout(() => setNotice(""), 2000);
        }}
        style={{ height: "100%" }}
        data-testid="screen"
      />
    );
  const Shell = clean ? CleanShell : ClassicShell;
  const Thread = clean ? CleanThread : ClassicThread;
  const Workspace = clean ? CleanWorkspace : ClassicWorkspace;
  const Composer = clean ? CleanComposer : ClassicComposer;
  const Commands = clean ? CleanCommands : ClassicCommands;
  const Tools = clean ? CleanTools : ClassicTools;
  const content =
    component === "app-shell" ? (
      <Shell defaultTheme={theme}>
        <div style={{ padding: 50 }}>Your application goes here.</div>
      </Shell>
    ) : component === "agent-thread" ? (
      <Thread />
    ) : component === "artifact-workspace" ? (
      <Workspace />
    ) : component === "overview-cards" ? (
      clean ? (
        <CleanOverviewCards onNavigate={setNotice} />
      ) : (
        <ClassicOverviewCards onNavigate={setNotice} />
      )
    ) : component === "command-menu" ? (
      <Commands inline onRun={setNotice} />
    ) : component === "tool-activity" ? (
      <Tools
        tools={[
          {
            id: "search",
            label: "Searched the web for linen fabrics",
            status: "done",
            duration: 1400,
          },
          { id: "read", label: "Read 6 pages", status: "done", duration: 3100 },
        ]}
      />
    ) : (
      <Composer onSend={(text) => setNotice(text)} />
    );
  const large = ["app-shell", "agent-thread", "artifact-workspace"].includes(
    component,
  );
  return (
    <div
      data-theme={theme}
      style={{
        height: "100%",
        padding: large ? 0 : "10vh 24px",
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        boxSizing: "border-box",
        color: theme === "dark" ? "white" : "#171717",
      }}
    >
      <div
        style={{
          height: large ? "100%" : undefined,
          maxWidth: large ? undefined : 680,
          margin: "auto",
        }}
      >
        {content}
        {notice && (
          <output style={{ display: "block", padding: 20 }}>{notice}</output>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={null}>
    <Preview />
  </Suspense>,
);
