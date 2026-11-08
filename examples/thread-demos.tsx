import { useState } from "react";
import { ThreadTaskCard as CleanTask } from "../components/thread-task-card-clean";
import { ThreadTaskCard as ClassicTask } from "../components/thread-task-card";
import {
  DecisionDock as CleanDock,
  defaultThreadDecisions,
} from "../components/decision-dock-clean";
import { DecisionDock as ClassicDock } from "../components/decision-dock";
import { ConnectionBanner as CleanConnection } from "../components/connection-banner-clean";
import { ConnectionBanner as ClassicConnection } from "../components/connection-banner";
import { AwaySummary as CleanAway } from "../components/away-summary-clean";
import { AwaySummary as ClassicAway } from "../components/away-summary";
import {
  ThreadUploads as CleanUploads,
  type ThreadUpload,
} from "../components/thread-uploads-clean";
import { ThreadUploads as ClassicUploads } from "../components/thread-uploads";
import { TaskDetails as CleanDetails } from "../components/task-details-clean";
import { TaskDetails as ClassicDetails } from "../components/task-details";

export default function ThreadDemos({
  name,
  clean,
  theme,
}: {
  name: string;
  clean: boolean;
  theme: string;
}) {
  const [notice, setNotice] = useState("");
  const [uploads, setUploads] = useState<ThreadUpload[]>([
    {
      id: "one",
      name: "brief.pdf",
      size: 4000000,
      progress: 0.42,
      state: "uploading",
    },
    {
      id: "two",
      name: "metrics.csv",
      size: 45000,
      progress: 0,
      state: "failed",
    },
  ]);
  const Task = clean ? CleanTask : ClassicTask,
    Dock = clean ? CleanDock : ClassicDock,
    Connection = clean ? CleanConnection : ClassicConnection,
    Away = clean ? CleanAway : ClassicAway,
    Uploads = clean ? CleanUploads : ClassicUploads,
    Details = clean ? CleanDetails : ClassicDetails;
  return (
    <main
      data-theme={theme}
      style={{
        height: "100%",
        overflow: "auto",
        boxSizing: "border-box",
        padding: "10vh 24px",
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        color: theme === "dark" ? "white" : "#171717",
      }}
    >
      <div style={{ maxWidth: 680, margin: "auto" }}>
        {name === "thread-task-card" ? (
          <Task
            task={{
              id: "dashboard",
              title: "Client dashboard",
              status: "Drawing the empty states",
              steps: { done: 1, total: 3 },
            }}
            onOpen={setNotice}
          />
        ) : name === "decision-dock" ? (
          <Dock
            defaultDecisions={defaultThreadDecisions}
            onAnswer={(id, answer) => setNotice(JSON.stringify({ id, answer }))}
          />
        ) : name === "connection-banner" ? (
          <Connection defaultConnection="offline" />
        ) : name === "away-summary" ? (
          <Away
            tasks={[
              {
                id: "auth",
                title: "Auth refactor",
                status: "Merged and on staging",
                done: true,
              },
            ]}
            decisions={[
              { id: "queue", question: "Which queue should we use?" },
            ]}
            onOpenTask={setNotice}
            onOpenDecision={setNotice}
            onMarkRead={() => setNotice("Marked as read")}
          />
        ) : name === "thread-uploads" ? (
          <Uploads
            uploads={uploads}
            onRemove={(id) =>
              setUploads(uploads.filter((item) => item.id !== id))
            }
            onRetry={(id) =>
              setUploads(
                uploads.map((item) =>
                  item.id === id
                    ? { ...item, state: "done", progress: 1 }
                    : item,
                ),
              )
            }
          />
        ) : (
          <Details
            task={{
              id: "dashboard",
              title: "Client dashboard",
              status: "Drawing the empty states",
              steps: { done: 1, total: 3 },
            }}
            detail={{
              goal: "A dashboard the team opens every morning.",
              project: "Northwind",
              steps: [
                { label: "Usage page", done: true },
                { label: "Empty state" },
                { label: "Alerts" },
              ],
              history: ["Usage page shipped"],
              decided: [{ question: "Which chart?", answer: "Bars" }],
            }}
            onShow={setNotice}
          />
        )}
        {notice && (
          <output
            aria-label="Component action"
            style={{ display: "block", padding: 20, font: "13px system-ui" }}
          >
            {notice}
          </output>
        )}
      </div>
    </main>
  );
}
