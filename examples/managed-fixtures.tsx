import { useCallback, useRef, useState } from "react";
import * as Clean from "../screens/agent-thread-clean";
import * as Classic from "../screens/agent-thread";
import { AgentChatRailScreen as CleanRail } from "../screens/agent-chat-rail-clean";
import { AgentChatRailScreen as ClassicRail } from "../screens/agent-chat-rail";

const initialMessages: Clean.AgentMessage[] = [
  { id: "user", role: "user", text: "请解释这个表格。" },
  {
    id: "rich",
    role: "agent",
    at: 2000,
    text: "Default body must be replaced",
    streaming: true,
    tools: [{ id: "tool", label: "读取报告", status: "running" }],
  },
  { id: "fallback", role: "agent", text: "保留默认正文" },
  { id: "hidden", role: "agent", text: "Hidden body must not render" },
];
const initialDecision: Clean.ThreadDecision = {
  id: "permission",
  kind: "approval",
  task: "发布报告",
  taskId: "report",
  question: "允许哪一种操作？",
  allowCustomAnswer: false,
  options: [
    { id: "allow-once", title: "仅允许这次", summary: "不改变后续权限" },
    { id: "allow-session", title: "本次会话允许" },
    { id: "deny:request", title: "拒绝本次请求" },
    ...Array.from({ length: 4 }, (_, index) => ({
      id: `policy:${index + 4}`,
      title: `策略 ${index + 4}`,
    })),
  ],
};
const decisionLabels = {
  needsYou: "等待决定",
  submitting: "提交中，等待服务确认…",
  answered: "已确认",
  expired: "请求已过期",
  later: "稍后",
  show: "展开",
  customAnswer: "其他答案",
  customPlaceholder: "输入其他答案…",
  sendCustomAnswer: "提交其他答案",
  waiting: (count: number) => `${count} 项等待决定`,
};
const composerLabels = {
  message: "消息",
  send: "发送消息",
  voiceInput: "语音输入",
  attachments: "附件",
  removeAttachment: (name: string) => `移除 ${name}`,
  placeholder: "输入消息，或 / 选择命令",
};

/** Caller-owned state with separate transport completion and business confirmation controls. */
export default function ManagedFixtures({
  variant,
  clean,
  theme,
}: {
  variant: string;
  clean: boolean;
  theme: "light" | "dark";
}) {
  const UI = clean ? Clean : Classic;
  const Rail = clean ? CleanRail : ClassicRail;
  const [events, setEvents] = useState<string[]>([]);
  const record = (event: string) =>
    setEvents((previous) => [...previous, event]);
  const [messages, setMessages] = useState(initialMessages);
  const [decisions, setDecisions] = useState([initialDecision]);
  const [lastSeen, setLastSeen] = useState<number | undefined>(1000);
  const [connection, setConnection] =
    useState<Clean.ThreadConnection>("offline");
  const [stopping, setStopping] = useState(false),
    [busy, setBusy] = useState(false),
    [disabled, setDisabled] = useState(false),
    [readOnly, setReadOnly] = useState(false);
  const [draft, setDraft] = useState("保留草稿"),
    [attachments, setAttachments] = useState<Clean.ChatComposerAttachment[]>([
      { id: "/native/report.csv", name: "原生路径.csv" },
    ]);
  const [uploads, setUploads] = useState<Clean.ThreadUpload[]>([
    { id: "upload", name: "文件.csv", progress: 0.2, state: "uploading" },
    { id: "voice", name: "语音", kind: "voice", progress: 1, state: "waiting" },
  ]);
  const [toolbar, setToolbar] = useState<"default" | "custom" | "hidden">(
    "default",
  );
  const [callbackRef, setCallbackRef] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [emptySlots, setEmptySlots] = useState(false);
  const [timelineMode, setTimelineMode] = useState<
    "builtin" | "caller" | "hidden"
  >(variant === "managed-timeline" ? "caller" : "builtin");
  const input = useRef<HTMLTextAreaElement | null>(null),
    answer = useRef<Clean.ThreadDecisionAnswer>("approve");
  const externalRef = useCallback((node: HTMLTextAreaElement | null) => {
    input.current = node;
    return () => {
      input.current = null;
    };
  }, []);
  const updateDecision = (patch: Partial<Clean.ThreadDecision>) =>
    setDecisions((previous) => previous.map((item) => ({ ...item, ...patch })));
  const decide = async (id: string, value: Clean.ThreadDecisionAnswer) => {
    answer.current = value;
    record(`answer:${id}:${JSON.stringify(value)}`);
    updateDecision({ status: "submitting", error: undefined });
    await Promise.resolve();
    record("answer:transport-complete");
  };
  const send = async (text: string, options: Clean.ChatComposerSendOptions) => {
    record(
      `send:${text}:${options.attachments.map((file) => file.id).join(",")}`,
    );
    setBusy(true);
    await Promise.resolve();
    record("send:transport-complete");
  };
  const composerProps: Clean.ChatComposerProps = {
    managed: true,
    labels: composerLabels,
    value: draft,
    onValueChange: setDraft,
    attachments,
    onAttachmentsChange: setAttachments,
    disabled,
    busy,
    toolbar:
      toolbar === "default" ? undefined : toolbar === "hidden" ? null : (
        <div
          style={{
            padding: "8px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>调用方配置 · Agent / Model</span>
          <button type="button" onClick={() => record("custom-send")}>
            自定义发送
          </button>
        </div>
      ),
    overlay: draft.startsWith("/") ? (
      <div
        role="listbox"
        id="slash"
        aria-label="命令"
        style={{
          padding: 16,
          background: theme === "dark" ? "#303034" : "#ececf0",
          borderRadius: 8,
        }}
      >
        <div role="option" aria-selected>
          选择命令
        </div>
      </div>
    ) : null,
    textareaProps: {
      ref: callbackRef ? externalRef : input,
      readOnly,
      disabled: false,
      "aria-describedby": "input-help",
      "aria-controls": draft.startsWith("/") ? "slash" : undefined,
      onKeyDown: (event) => {
        if (event.key === "Enter" && draft.startsWith("/")) {
          event.preventDefault();
          setDraft("已选择命令");
          record("slash-selected");
        }
      },
      onPaste: () => record("paste"),
      onDrop: (event) => {
        event.preventDefault();
        record("drop");
      },
    },
  };
  const threadProps: Clean.AgentThreadProps = {
    managed: true,
    stopping,
    simulate: "live",
    title: "外部状态合同",
    assistantName: "助手",
    timeline:
      timelineMode === "builtin" ? undefined : timelineMode ===
        "hidden" ? null : (
        <div
          role="log"
          aria-label="调用方消息列表"
          tabIndex={0}
          style={{ height: "100%", overflowY: "auto", padding: "12px 32px" }}
        >
          <div style={{ maxWidth: 680, marginInline: "auto" }}>
            <p>
              调用方拥有消息、滚动、锚点和无障碍语义；下方审批与输入框仍由
              Thread 组合。
            </p>
            {Array.from({ length: 40 }, (_, index) => (
              <article key={index} style={{ paddingBlock: 12 }}>
                <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
                  消息 {index + 1}
                </h2>
                <p style={{ margin: 0 }}>
                  自定义 Markdown / Diff / 长列表正文。
                </p>
              </article>
            ))}
          </div>
        </div>
      ),
    messages,
    onMessagesChange: setMessages,
    decisions,
    onDecisionsChange: setDecisions,
    onDecide: decide,
    onMarkRead: () => setLastSeen(undefined),
    running: { running: 1, needs: 1 },
    connection,
    onConnectionChange: (next) => {
      record(`connection-write:${next}`);
      setConnection(next);
    },
    onReconnect: async () => {
      record("reconnect-intent");
    },
    uploads,
    onUploadsChange: setUploads,
    upload: async () => {
      record("unexpected-upload");
    },
    transcribe: async () => {
      record("unexpected-transcribe");
      return "unexpected transcript";
    },
    onSend: send,
    onStop: () => {
      record("stop-intent");
      setStopping(true);
    },
    onRetry: (id) => record(`retry:${id}`),
    labels: {
      conversation: "对话",
      youSaid: "你说：",
      stopping: "正在停止…",
      stop: "停止",
      stopped: "已停止",
      decisions: decisionLabels,
      away: {
        title: "离开后的更新",
        newSince: (time) => `从 ${time} 起的新内容`,
      },
    },
    formatTime: (timestamp) => `本地时间 ${timestamp}`,
    renderMessageContent: (message, defaultContent) =>
      message.id === "hidden" ? null : message.id !== "rich" ? (
        defaultContent
      ) : (
        <article aria-label="自定义正文">
          <p>思考 → 工具 → 文本</p>
          <h2>中文报告</h2>
          <pre>
            <code>const answer = 42</code>
          </pre>
          <table>
            <tbody>
              <tr>
                <th>项目</th>
                <th>值</th>
              </tr>
              <tr>
                <td>答案</td>
                <td>42</td>
              </tr>
            </tbody>
          </table>
          <span role="math">x² + y²</span>
          <p>
            {message.text === initialMessages[1].text
              ? "调用方渲染 Markdown / thought / tools"
              : message.text}
          </p>
        </article>
      ),
    composerProps,
  };
  const header = (
    <div
      style={{
        minHeight: 48,
        padding: "8px 44px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <strong>调用方标题栏</strong>
      <button type="button" onClick={() => setCollapsed((value) => !value)}>
        Toggle sidebar
      </button>
    </div>
  );
  const sidebar = (
    <nav
      aria-label="应用导航"
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: 12 }}
    >
      <strong>调用方侧栏</strong>
      <button type="button">会话历史</button>
      <a href="#settings">设置</a>
      <button type="button">最后一项</button>
    </nav>
  );
  const shellProps: Clean.AppShellProps = {
    sidebar: emptySlots ? null : sidebar,
    header: emptySlots ? null : header,
    sidebarCollapsed: collapsed,
    onSidebarCollapsedChange: setCollapsed,
    defaultTheme: theme,
    labels: {
      sidebar: "应用侧栏",
      openSidebar: "打开侧栏",
      resizeSidebar: "调整侧栏宽度",
    },
  };
  const empty = variant === "managed-empty";
  const rail = variant === "managed-rail";
  const screen = variant === "managed-screen";
  return (
    <div
      data-theme={theme}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme === "dark" ? "#111113" : "#f8f8f8",
        color: theme === "dark" ? "#eee" : "#222",
        font: "12px system-ui",
      }}
    >
      <div
        aria-label="Runtime fixture"
        style={{
          flex: "none",
          padding: 8,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            updateDecision({
              status: "answered",
              answer: answer.current,
              error: undefined,
            })
          }
        >
          Confirm answer
        </button>
        <button
          onClick={() =>
            updateDecision({ status: "awaiting", error: "服务失败，请重试" })
          }
        >
          Fail answer
        </button>
        <button
          onClick={() =>
            updateDecision({
              status: "awaiting",
              error: undefined,
              disabled: false,
            })
          }
        >
          Await answer
        </button>
        <button onClick={() => updateDecision({ status: "expired" })}>
          Expire answer
        </button>
        <button onClick={() => updateDecision({ disabled: true })}>
          Disable answer
        </button>
        <button onClick={() => updateDecision({ allowCustomAnswer: true })}>
          Allow custom answer
        </button>
        <button
          onClick={() =>
            updateDecision({
              options: [
                ...initialDecision.options!,
                { id: "eight", title: "策略 8" },
                { id: "nine", title: "策略 9" },
                { id: "ten", title: "策略 10" },
              ],
            })
          }
        >
          More options
        </button>
        <button
          onClick={() => {
            setBusy(false);
            setMessages((previous) => [
              ...previous,
              {
                id: `confirmed-${previous.length}`,
                role: "user",
                text: draft,
                status: "sent",
              },
            ]);
            setDraft("");
            setAttachments([]);
          }}
        >
          Confirm send
        </button>
        <button onClick={() => setBusy(false)}>Fail send</button>
        <button
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) => ({
                ...message,
                streaming: false,
                stopped: message.id === "rich",
                tools: message.tools?.map((tool) => ({
                  ...tool,
                  status: "stopped",
                })),
              })),
            );
            setStopping(false);
          }}
        >
          Confirm stop
        </button>
        <button onClick={() => setConnection("online")}>Online</button>
        <button onClick={() => setConnection("offline")}>Offline</button>
        <button
          onClick={() =>
            setMessages((previous) =>
              previous.map((message) =>
                message.id === "rich"
                  ? { ...message, text: "流式增长\n".repeat(120) }
                  : message,
              ),
            )
          }
        >
          Grow message
        </button>
        <button
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) =>
                message.id === "user"
                  ? { ...message, status: "failed" }
                  : message,
              ),
            );
          }}
        >
          Failed message
        </button>
        <button onClick={() => setToolbar("custom")}>Custom toolbar</button>
        <button onClick={() => setToolbar("hidden")}>Hide toolbar</button>
        <button onClick={() => setToolbar("default")}>Default toolbar</button>
        <button onClick={() => input.current?.focus()}>Focus input</button>
        <button onClick={() => setCallbackRef((value) => !value)}>
          Callback ref
        </button>
        <button onClick={() => setDisabled((value) => !value)}>
          Toggle disabled
        </button>
        <button onClick={() => setReadOnly((value) => !value)}>
          Toggle readonly
        </button>
        <button onClick={() => setEmptySlots((value) => !value)}>
          Empty slots
        </button>
        {variant === "managed-timeline" && (
          <>
            <button onClick={() => setTimelineMode("caller")}>
              Caller timeline
            </button>
            <button onClick={() => setTimelineMode("builtin")}>
              Built-in timeline
            </button>
            <button onClick={() => setTimelineMode("hidden")}>
              Hide timeline
            </button>
          </>
        )}
      </div>
      <output
        aria-label="Runtime events"
        style={{
          padding: "4px 8px",
          maxHeight: 52,
          overflow: "auto",
          flex: "none",
        }}
      >
        {JSON.stringify(events)}
      </output>
      <span id="input-help" style={{ padding: "4px 8px" }}>
        仅测试调用方状态；Promise 完成不代表业务确认。
      </span>
      <div style={{ flex: 1, minHeight: 0 }}>
        {variant === "managed-dock" ? (
          <div style={{ maxWidth: 680, margin: "24px auto", padding: 12 }}>
            <UI.DecisionDock
              managed
              labels={decisionLabels}
              decisions={decisions}
              onDecisionsChange={setDecisions}
              onAnswer={decide}
            />
          </div>
        ) : variant === "managed-composer" ? (
          <div style={{ maxWidth: 680, margin: "120px auto", padding: 12 }}>
            <UI.ChatComposer {...composerProps} onSend={send} />
          </div>
        ) : variant === "managed-shell" ? (
          <UI.AppShell
            {...shellProps}
            panel={<button type="button">Inspector action</button>}
          >
            <p style={{ padding: 48 }}>Main content</p>
          </UI.AppShell>
        ) : empty ? (
          <UI.AgentThreadScreen
            managed
            simulate="decision"
            defaultMessages={initialMessages}
            defaultDecisions={[initialDecision]}
          />
        ) : screen ? (
          <UI.AgentThreadScreen
            {...threadProps}
            {...shellProps}
            labels={shellProps.labels}
            simulate="live"
            threadLabels={threadProps.labels}
            onSend={(text, files) =>
              send(text, {
                model: "auto",
                approval: "request",
                planMode: false,
                attachments: files,
              })
            }
          />
        ) : rail ? (
          <Rail
            {...shellProps}
            managed
            stopping={stopping}
            messages={messages}
            threadLabels={threadProps.labels}
            formatTime={threadProps.formatTime}
            renderMessageContent={threadProps.renderMessageContent}
            timeline={threadProps.timeline}
            composerProps={composerProps}
            onStop={threadProps.onStop}
            onSend={send}
            defaultPanelOpen={false}
          />
        ) : (
          <UI.AgentThread {...threadProps} lastSeen={lastSeen} />
        )}
      </div>
    </div>
  );
}
