import { useState } from "react";
import { RunningNow as CleanRunningNow, type RunningTask } from "../components/running-now-clean";
import { RunningNow as ClassicRunningNow } from "../components/running-now";
import {
  SettingsPage as CleanSettingsPage,
  SettingsCard as CleanSettingsCard,
  SettingsRow as CleanSettingsRow,
  SettingsCopyValue as CleanSettingsCopyValue,
  SettingsMembersPanel as CleanSettingsMembersPanel,
} from "../components/settings-panel-clean";
import {
  SettingsPage as ClassicSettingsPage,
  SettingsCard as ClassicSettingsCard,
  SettingsRow as ClassicSettingsRow,
  SettingsCopyValue as ClassicSettingsCopyValue,
  SettingsMembersPanel as ClassicSettingsMembersPanel,
} from "../components/settings-panel";
import { SettingsProfileScreen as CleanProfileScreen } from "../screens/settings-profile-clean";
import { SettingsProfileScreen as ClassicProfileScreen } from "../screens/settings-profile";
import { SettingsGeneralScreen as CleanGeneralScreen } from "../screens/settings-general-clean";
import { SettingsGeneralScreen as ClassicGeneralScreen } from "../screens/settings-general";
import { SettingsMembersScreen as CleanMembersScreen } from "../screens/settings-members-clean";
import { SettingsMembersScreen as ClassicMembersScreen } from "../screens/settings-members";

const initialRunningTasks: RunningTask[] = [
  {
    id: "ingest",
    title: "Ingest pipeline",
    step: "Parsing 1,284 files",
    done: 2,
    total: 4,
    state: "running",
  },
  {
    id: "refund",
    title: "Refund review",
    step: "Approve a $240 refund to Acme",
    done: 1,
    total: 3,
    state: "needs-you",
  },
  {
    id: "deps",
    title: "Dependency upgrade",
    step: "Running 212 tests",
    done: 1,
    total: 4,
    state: "paused",
  },
];

export default function SettingsAndRunningDemos({
  variant,
  clean,
  theme,
  loading,
}: {
  variant: string;
  clean: boolean;
  theme: "light" | "dark";
  loading: boolean;
}) {
  const [tasks, setTasks] = useState<RunningTask[]>(initialRunningTasks);
  const [events, setEvents] = useState<string[]>([]);
  const log = (entry: object) => setEvents((prev) => [...prev, JSON.stringify(entry)]);

  if (variant === "settings-profile") {
    const Screen = clean ? CleanProfileScreen : ClassicProfileScreen;
    return <Screen defaultTheme={theme} loading={loading} />;
  }
  if (variant === "settings-general") {
    const Screen = clean ? CleanGeneralScreen : ClassicGeneralScreen;
    return <Screen defaultTheme={theme} loading={loading} />;
  }
  if (variant === "settings-members") {
    const Screen = clean ? CleanMembersScreen : ClassicMembersScreen;
    return <Screen defaultTheme={theme} loading={loading} />;
  }
  if (variant === "managed-members") {
    const SettingsPage = clean ? CleanSettingsPage : ClassicSettingsPage;
    const SettingsCard = clean ? CleanSettingsCard : ClassicSettingsCard;
    const SettingsRow = clean ? CleanSettingsRow : ClassicSettingsRow;
    const SettingsCopyValue = clean ? CleanSettingsCopyValue : ClassicSettingsCopyValue;
    const SettingsMembersPanel = clean ? CleanSettingsMembersPanel : ClassicSettingsMembersPanel;

    return (
      <div data-theme={theme} style={{ minHeight: "100%", background: theme === "dark" ? "#111113" : "#f8f8f8" }}>
        <SettingsPage title="Workspace access" subtitle="Managed members and pairing codes">
          <SettingsCard alone aria-label="Runner pairing">
            <SettingsRow title="Pairing code" description="Share with a trusted Runner">
              <SettingsCopyValue
                value="PAIR-4829-ACME"
                label="Pairing code"
                onCopy={(code) => log({ event: "copy", code })}
              />
            </SettingsRow>
          </SettingsCard>
          <SettingsMembersPanel
            managed
            inlineInvite
            inviteMode="login"
            showTeamsTab={false}
            showPlans={false}
            showUsage={false}
            showExport={false}
            roles={["owner", "member"]}
            adminRole="owner"
            me="u-alex"
            members={[
              { id: "u-alex", name: "Alex Morgan", email: "@alex", role: "owner" },
              { id: "inv-sam", name: "Sam Lee", email: "@sam", role: "member", invited: true },
            ]}
            labels={{
              inviteInputLabel: "Invite by login name",
              invitePlaceholder: "sam",
              inviteSubmit: "Invite",
            }}
            onInvite={(payload) => log({ event: "invite", ...payload })}
            onRemove={(id) => log({ event: "remove", id })}
          />
          <output data-testid="settings-events" style={{ display: "block", whiteSpace: "pre", marginTop: 12 }}>
            {events.join("\n")}
          </output>
        </SettingsPage>
      </div>
    );
  }

  const RunningNow = clean ? CleanRunningNow : ClassicRunningNow;
  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100%",
        padding: 32,
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        containerType: "inline-size",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 680 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() =>
              setTasks((prev) =>
                prev.map((item) =>
                  item.id === "ingest" ? { ...item, done: 3, step: "Embedding chunks" } : item,
                ),
              )
            }
          >
            Advance step
          </button>
          <button
            type="button"
            onClick={() => setTasks((prev) => prev.filter((item) => item.id !== "refund"))}
          >
            Resolve refund
          </button>
        </div>
        <RunningNow
          tasks={tasks}
          defaultOpen
          onPause={(id) => {
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, state: "paused" } : t)));
            log({ event: "pause", id });
          }}
          onResume={(id) => {
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, state: "running" } : t)));
            log({ event: "resume", id });
          }}
          onOpen={(id) => log({ event: "open", id })}
          onOpenAll={() => log({ event: "openAll" })}
        />
      </div>
      <output data-testid="running-events" style={{ display: "block", whiteSpace: "pre", marginTop: 280 }}>
        {events.join("\n")}
      </output>
    </div>
  );
}
