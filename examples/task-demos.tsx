import { useState, type ComponentType } from "react";
import {
  createDefaultAgentTasks,
  defaultAgentTaskFiles,
  defaultTaskSources,
  type AgentTasksScreenProps,
  type AgentTask,
} from "../screens/agent-tasks-clean";
import { TaskProgressRing as CleanRing } from "../components/task-progress-ring-clean";
import { TaskProgressRing as ClassicRing } from "../components/task-progress-ring";
import { TaskCreate as CleanCreate } from "../components/task-create-clean";
import { TaskCreate as ClassicCreate } from "../components/task-create";
import { TaskList as CleanList } from "../components/task-list-clean";
import { TaskList as ClassicList } from "../components/task-list";
import { TaskInspector as CleanInspector } from "../components/task-inspector-clean";
import { TaskInspector as ClassicInspector } from "../components/task-inspector";
import { ArtifactFolder as CleanFolder } from "../components/artifact-folder-clean";
import { ArtifactFolder as ClassicFolder } from "../components/artifact-folder";
import { ArtifactImageViewer as CleanImage } from "../components/artifact-image-clean";
import { ArtifactImageViewer as ClassicImage } from "../components/artifact-image";
import {
  WorkspaceStart as CleanStart,
  WorkspaceTool as CleanTool,
  type WorkspaceToolKind,
} from "../components/workspace-start-clean";
import {
  WorkspaceStart as ClassicStart,
  WorkspaceTool as ClassicTool,
} from "../components/workspace-start";

export default function TaskDemos({
  screen = false,
  name,
  clean,
  theme,
  flat = false,
  Screen,
}: {
  screen?: boolean;
  name?: string;
  clean: boolean;
  theme: string;
  flat?: boolean;
  Screen?: ComponentType<AgentTasksScreenProps>;
}) {
  const [tasks, setTasks] = useState<AgentTask[]>(createDefaultAgentTasks),
    [notice, setNotice] = useState(""),
    [creating, setCreating] = useState(false),
    [tool, setTool] = useState<WorkspaceToolKind | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const Ring = clean ? CleanRing : ClassicRing,
    Create = clean ? CleanCreate : ClassicCreate,
    List = clean ? CleanList : ClassicList,
    Inspector = clean ? CleanInspector : ClassicInspector,
    Folder = clean ? CleanFolder : ClassicFolder,
    Image = clean ? CleanImage : ClassicImage,
    Start = clean ? CleanStart : ClassicStart,
    Tool = clean ? CleanTool : ClassicTool;
  const directory = defaultAgentTaskFiles.find(
      (file) => file.kind === "folder",
    ),
    image = defaultAgentTaskFiles.find((file) => file.kind === "image");
  if (screen || name === "controlled-tasks") {
    if (!Screen) return null;
    const controlled = name === "controlled-tasks";
    const query = new URLSearchParams(location.search);
    return (
      <div style={{ height: "100%" }}>
        {controlled && (
          <div
            style={{
              height: 40,
              display: "flex",
              gap: 8,
              padding: 5,
              boxSizing: "border-box",
              font: "12px system-ui",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setTasks(
                  tasks.map((task) =>
                    task.id === "ingest"
                      ? {
                          ...task,
                          title: "Updated ingest task",
                          asks: [
                            ...(task.asks ?? []),
                            {
                              id: "retention",
                              question: "How long to retain events?",
                            },
                          ],
                        }
                      : task,
                  ),
                )
              }
            >
              Update task
            </button>
            <button
              type="button"
              onClick={() =>
                setTasks(
                  tasks.map((task) =>
                    task.id === "ingest"
                      ? {
                          ...task,
                          done: true,
                          asks: [],
                          statusText: "Done · Today",
                          steps: task.steps?.map((step) => ({
                            ...step,
                            done: true,
                          })),
                        }
                      : task,
                  ),
                )
              }
            >
              Complete task
            </button>
            <output aria-label="Task events">{JSON.stringify(events)}</output>
          </div>
        )}
        <div style={{ height: controlled ? "calc(100% - 40px)" : "100%" }}>
          <Screen
            tasks={controlled ? tasks : undefined}
            onTasksChange={controlled ? setTasks : undefined}
            defaultTheme={theme === "dark" ? "dark" : "light"}
            layout={flat ? "flat" : "inset"}
            defaultTab={query.get("tab") === "done" ? "done" : "active"}
            defaultSelected={
              query.get("selected") === "none"
                ? null
                : (query.get("selected") ?? "ingest")
            }
            onNavigate={(label) => setNotice(label)}
            onOpenInbox={(task, id) => {
              setNotice(`Inbox: ${id ?? task}`);
              setEvents((events) => [...events, `inbox:${task}:${id ?? ""}`]);
            }}
            onCreate={(task) =>
              setEvents((events) => [
                ...events,
                `create:${task.title}:${task.project}`,
              ])
            }
            onOpenArtifact={(task, name) =>
              setEvents((events) => [...events, `artifact:${task}:${name}`])
            }
          />
        </div>
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              left: "50%",
              top: 16,
              background: "#232326",
              color: "white",
              padding: "7px 14px",
              borderRadius: 8,
              font: "12px system-ui",
              zIndex: 100,
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  const large = name === "task-list";
  return (
    <div
      data-theme={theme}
      style={{
        height: "100%",
        padding: large ? 0 : "8vh 24px",
        boxSizing: "border-box",
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        color: theme === "dark" ? "#ededed" : "#171717",
      }}
    >
      <div
        style={{
          height: large ? "100%" : name === "task-inspector" ? 760 : 520,
          maxWidth: large ? 1000 : name === "task-inspector" ? 410 : 680,
          margin: "auto",
          background:
            name === "task-progress-ring" || name === "task-create"
              ? "transparent"
              : theme === "dark"
                ? "#1c1c1e"
                : "white",
          borderRadius: 12,
        }}
      >
        {name === "task-progress-ring" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: 40,
            }}
          >
            <Ring status="planning" label="Planning" />
            <Ring value={1} max={4} label="One of four steps" />
            <Ring value={2} max={4} label="Two of four steps" />
            <Ring value={3} max={4} label="Three of four steps" />
            <Ring done value={4} max={4} label="Complete" />
          </div>
        ) : name === "task-create" ? (
          <Create
            onCreate={(draft) =>
              setNotice(`Created ${draft.title} in ${draft.project}`)
            }
          />
        ) : name === "task-list" ? (
          <List
            tasks={tasks}
            onSelect={(id) => setNotice(id)}
            onNewTask={() => setCreating(true)}
            createOpen={creating}
            createForm={
              <Create
                onClose={() => setCreating(false)}
                onCreate={(draft) =>
                  setTasks([
                    {
                      id: `task-${Date.now()}`,
                      title: draft.title,
                      project: draft.project,
                      status: "planning",
                      updatedAt: Date.now(),
                    },
                    ...tasks,
                  ])
                }
              />
            }
            onOpenInbox={(id, item) => setNotice(`Inbox: ${item ?? id}`)}
          />
        ) : name === "task-inspector" ? (
          <Inspector
            task={tasks[0]}
            onOpenInbox={(id, item) => setNotice(`Inbox: ${item ?? id}`)}
            onOpenArtifact={setNotice}
            onShowAgents={() => setNotice("Agent Orchestration")}
          />
        ) : name === "artifact-folder" ? (
          <Folder
            name="staging"
            defaultEntries={
              directory?.kind === "folder" ? directory.entries : []
            }
            onOpen={(entry) => setNotice(`Open ${entry.name}`)}
          />
        ) : name === "artifact-image" ? (
          <Image
            src={image?.kind === "image" ? image.src : ""}
            name="usage-page.png"
          />
        ) : tool ? (
          <>
            <button type="button" onClick={() => setTool(null)}>
              Back
            </button>
            <Tool kind={tool} onOpenUrl={setNotice} />
          </>
        ) : (
          <Start
            suggested={defaultTaskSources}
            onOpenSource={(source) => setNotice(source.artifact ?? source.name)}
            onOpenTool={setTool}
            onOpenUrl={setNotice}
          />
        )}
      </div>
      {notice && (
        <output
          aria-label="Component action"
          style={{ display: "block", padding: 20, font: "13px system-ui" }}
        >
          {notice}
        </output>
      )}
    </div>
  );
}
