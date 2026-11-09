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
