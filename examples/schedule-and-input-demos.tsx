import { useState } from "react";
import { TextField as CleanTextField } from "../components/text-field-clean";
import { TextField as ClassicTextField } from "../components/text-field";
import { Select as CleanSelect } from "../components/select-clean";
import { Select as ClassicSelect } from "../components/select";
import { Switch as CleanSwitch } from "../components/switch-clean";
import { Switch as ClassicSwitch } from "../components/switch";
import { InboxView as CleanInboxView, type InboxItem, type InboxAnswer } from "../components/inbox-view-clean";
import { InboxView as ClassicInboxView } from "../components/inbox-view";
import { AgentSchedulesScreen as CleanSchedulesScreen, createDefaultAgentSchedules } from "../screens/agent-schedules-clean";
import { AgentSchedulesScreen as ClassicSchedulesScreen } from "../screens/agent-schedules";

export default function ScheduleAndInputDemos({
  variant,
  clean,
  theme,
  loading = false,
}: {
  variant: string;
  clean: boolean;
  theme: "light" | "dark";
  loading?: boolean;
}) {
  const [events, setEvents] = useState<unknown[]>([]);
  const log = (entry: unknown) => setEvents((prev) => [...prev, entry]);

  if (variant === "agent-schedules" || variant === "managed-schedules") {
    const Screen = clean ? CleanSchedulesScreen : ClassicSchedulesScreen;
    const [schedules] = useState(() => createDefaultAgentSchedules());
    return (
      <div data-theme={theme} style={{ height: "100%" }}>
        <Screen
          defaultTheme={theme}
          schedules={variant === "managed-schedules" ? schedules : undefined}
          defaultSchedules={variant === "managed-schedules" ? undefined : schedules}
          managed={variant === "managed-schedules"}
          loading={loading}
          onPause={(id, paused) => log({ event: "pause", id, paused })}
          onRunNow={(id) => log({ event: "runNow", id })}
          onSkip={(id, at, skipped) => log({ event: "skip", id, at, skipped })}
          onNavigate={(label) => log({ event: "navigate", label })}
        />
        <pre data-testid="schedule-events" hidden>
          {events.map((e) => JSON.stringify(e)).join("\n")}
        </pre>
      </div>
    );
  }

  if (variant === "managed-inbox-view") {
    const View = clean ? CleanInboxView : ClassicInboxView;
    const [items, setItems] = useState<InboxItem[]>([
      {
        id: "invite-1",
        kind: "approval",
        listTitle: "Invite room",
        question: "Invitation to Invite room",
        context: "Alex invited you to collaborate on Invite room.",
        task: "Workspace invitation",
        at: Date.now() - 120000,
        unread: true,
      },
      {
        id: "perm-1",
        kind: "decision",
        listTitle: "Run git push",
        question: "Allow tool execution: git push?",
        context: "Desk A wants to push branch fix/auth.",
        task: "Inspect desk A",
        at: Date.now() - 60000,
        options: [
          { id: "allow-once", title: "Allow once", recommended: true },
          { id: "reject-once", title: "Reject" },
        ],
      },
    ]);
    const [submittingId, setSubmittingId] = useState<string | undefined>();
    const [confirmed, setConfirmed] = useState<{ id: string; answer: InboxAnswer } | null>(null);
    const [collapsingId, setCollapsingId] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

    return (
      <div data-theme={theme} style={{ height: "100%", display: "flex", flexDirection: "column", background: theme === "dark" ? "#1c1c1e" : "#fff" }}>
        <div style={{ display: "flex", gap: 8, padding: 8, borderBottom: "1px solid rgba(128,128,128,.2)" }}>
          <button
            type="button"
            onClick={() => {
              if (!submittingId) return;
              setConfirmed({ id: submittingId, answer: "approve" });
              setSubmittingId(undefined);
            }}
          >
            Confirm server
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirmed) return;
              const target = confirmed.id;
              setCollapsingId(target);
              window.setTimeout(() => {
                setItems((prev) => prev.filter((i) => i.id !== target));
                setConfirmed(null);
                setCollapsingId(undefined);
              }, 120);
            }}
          >
            Collapse confirmed
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmittingId(undefined);
              setError("Permission no longer pending.");
            }}
          >
            Fail server
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <View
            items={items}
            managed
            showTabs={false}
            allowFreeText={false}
            submittingId={submittingId}
            confirmedId={confirmed?.id}
            confirmedAnswer={confirmed?.answer}
            collapsingId={collapsingId}
            error={error}
            itemLabels={(item) =>
              item.id.startsWith("invite-")
                ? { approve: "Accept", decline: "Decline", approval: "Invite" }
                : { send: "Confirm" }
            }
            onDecide={(id, answer) => {
              setError(undefined);
              setSubmittingId(id);
              log({ event: "decide", id, answer });
            }}
          />
        </div>
        <pre data-testid="managed-inbox-events" hidden>
          {events.map((e) => JSON.stringify(e)).join("\n")}
        </pre>
      </div>
    );
  }

  const TF = clean ? CleanTextField : ClassicTextField;
  const Sel = clean ? CleanSelect : ClassicSelect;
  const Sw = clean ? CleanSwitch : ClassicSwitch;
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("correct-horse");
  const [backend, setBackend] = useState<string | null>("codex");
  const [enabled, setEnabled] = useState(true);

  return (
    <div
      data-theme={theme}
      style={{
        minHeight: "100%",
        padding: 32,
        background: theme === "dark" ? "#1c1c1e" : "#fff",
        color: theme === "dark" ? "#fff" : "#171717",
        display: "grid",
        gap: 20,
        maxWidth: 480,
      }}
    >
      <TF
        label="Workspace title"
        placeholder="e.g. Pilot room"
        clearable
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={name === "bad" ? "That title is reserved." : undefined}
        hint="Visible to members."
      />
      <TF label="Password" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <TF label="Pairing code" value="PAIR-8492" readOnly copyable />
      <Sel
        label="ACP backend"
        value={backend}
        onChange={(v) => setBackend(v)}
        options={[
          { value: "codex", label: "Codex", description: "Fast code agent" },
          { value: "claude", label: "Claude Code", description: "Deep reasoning" },
          { value: "disabled", label: "Unavailable", disabled: true },
        ]}
      />
      <Sw
        label="Enable schedule"
        description="Start runs automatically on your device."
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      <output data-testid="inputs-state">{JSON.stringify({ name, backend, enabled })}</output>
    </div>
  );
}
