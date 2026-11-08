import { useState, type ComponentType } from "react";
import {
  createDefaultInboxItems,
  defaultInboxTasks,
  type InboxScreenProps,
  type InboxItem,
} from "../screens/inbox-clean";
import { InboxOptions as CleanOptions } from "../components/inbox-options-clean";
import { InboxOptions as ClassicOptions } from "../components/inbox-options";
import {
  InboxConfirmation as CleanSent,
  InboxEmptyState as CleanEmpty,
} from "../components/inbox-feedback-clean";
import {
  InboxConfirmation as ClassicSent,
  InboxEmptyState as ClassicEmpty,
} from "../components/inbox-feedback";
import { InboxList as CleanList } from "../components/inbox-list-clean";
import { InboxList as ClassicList } from "../components/inbox-list";
import { InboxItemView as CleanView } from "../components/inbox-item-view-clean";
import { InboxItemView as ClassicView } from "../components/inbox-item-view";
import { InboxTaskContext as CleanContext } from "../components/inbox-task-context-clean";
import { InboxTaskContext as ClassicContext } from "../components/inbox-task-context";

export default function InboxDemos({
  screen = false,
  name,
  clean,
  theme,
  Screen,
}: {
  screen?: boolean;
  name?: string;
  clean: boolean;
  theme: string;
  Screen: ComponentType<InboxScreenProps>;
}) {
  const query = new URLSearchParams(location.search);
  const [items, setItems] = useState<InboxItem[]>(createDefaultInboxItems),
    [events, setEvents] = useState<string[]>([]),
    [notice, setNotice] = useState("");
  const record = (event: unknown) =>
    setEvents((values) => [...values, JSON.stringify(event)]);
  const Options = clean ? CleanOptions : ClassicOptions,
    Sent = clean ? CleanSent : ClassicSent,
    Empty = clean ? CleanEmpty : ClassicEmpty,
    List = clean ? CleanList : ClassicList,
    View = clean ? CleanView : ClassicView,
    Context = clean ? CleanContext : ClassicContext;
  if (screen || name === "controlled-inbox") {
    const controlled = name === "controlled-inbox";
    return (
      <div style={{ height: "100%" }}>
        {controlled && (
          <div style={{ height: 40, display: "flex", gap: 8, padding: 5 }}>
            <button onClick={() => setItems([])}>Remove all items</button>
            <button onClick={() => setItems(createDefaultInboxItems())}>
              Restore items
            </button>
            <button
              onClick={() =>
                setItems((values) =>
                  values.filter((item) => item.id !== "queue"),
                )
              }
            >
              Remove queue
            </button>
          </div>
        )}
        <div style={{ height: controlled ? "calc(100% - 40px)" : "100%" }}>
          <Screen
            items={controlled ? items : undefined}
            onItemsChange={controlled ? setItems : undefined}
            defaultSelected={query.get("item") ?? undefined}
            defaultTab={query.get("tab") === "done" ? "done" : "open"}
            defaultTheme={theme === "dark" ? "dark" : "light"}
            layout={query.get("layout") === "flat" ? "flat" : "inset"}
            onDecide={(id, answer) => record({ event: "decide", id, answer })}
            onLater={(id) => record({ event: "later", id })}
            onReopen={(id) => record({ event: "reopen", id })}
            onSelect={(id) => record({ event: "select", id })}
            onOpenArtifact={(task, name) =>
              record({ event: "artifact", task, name })
            }
            onArtifactChange={(name, file) =>
              record({ event: "change", name, kind: file.kind })
            }
            onNavigate={(label) => {
              setNotice(label);
              setTimeout(() => setNotice(""), 1800);
            }}
          />
        </div>
        <output data-testid="inbox-events" style={{ display: "none" }}>
          {events.join("\n")}
        </output>
        {notice && (
          <output
            aria-label="Navigation"
            style={{
              position: "fixed",
              bottom: 16,
              left: "50%",
              padding: "8px 16px",
              background: "#232326",
              color: "white",
              borderRadius: 8,
              font: "13px system-ui",
              zIndex: 100,
            }}
          >
            {notice}
          </output>
        )}
      </div>
    );
  }
  const item = items.find((item) => item.id === query.get("item")) ?? items[0];
  return (
    <div
      data-theme={theme}
      style={{
        height: "100%",
        padding: name === "inbox-list" ? 0 : "48px 24px",
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        color: theme === "dark" ? "#ededed" : "#171717",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: name === "inbox-task-context" ? 410 : 680,
          margin: "auto",
          height: name === "inbox-list" ? "100%" : undefined,
        }}
      >
        {name === "inbox-options" ? (
          <Options
            options={item.options ?? items[0].options!}
            variant={item.kind === "pick" ? "variants" : "options"}
            onConfirm={(option) => setNotice(option)}
          />
        ) : name === "inbox-feedback" ? (
          <>
            <Sent answer="SQS – “Keep one day of replay.”" />
            <Empty onOpenTasks={() => setNotice("Tasks")} />
          </>
        ) : name === "inbox-list" ? (
          <List items={items} onSelect={setNotice} />
        ) : name === "inbox-task-context" ? (
          <Context
            name="Client dashboard"
            task={defaultInboxTasks["Client dashboard"]}
            items={items}
            activeId="empty-state"
            onOpenArtifact={setNotice}
            onOpenItem={setNotice}
          />
        ) : (
          <View
            item={item}
            onSubmit={(answer) => record(answer)}
            onLater={() => setNotice("Later")}
            onReopen={() => setNotice("Reopen")}
            onOpenArtifact={setNotice}
          />
        )}
        <output aria-label="Demo events">
          {notice}
          {events.join("\n")}
        </output>
      </div>
    </div>
  );
}
