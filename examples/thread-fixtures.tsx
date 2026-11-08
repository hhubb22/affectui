import { useRef, useState } from "react";
import {
  AgentThreadScreen,
  type AgentMessage,
  type ThreadConnection,
} from "../screens/agent-thread-clean";

export default function ThreadFixtures({ variant }: { variant: string }) {
  const [connection, setConnection] = useState<ThreadConnection>(
    variant === "upload-thread" ? "online" : "offline",
  );
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "initial",
      role: "agent",
      text: "The work continues here.",
      streaming: true,
      at: Date.now(),
    },
  ]);
  const [events, setEvents] = useState<string[]>([]);
  const attempts = useRef<Record<string, number>>({});
  const uploader = (
    file: File,
    progress: (value: number) => void,
    signal: AbortSignal,
  ) =>
    new Promise<void>((resolve, reject) => {
      attempts.current[file.name] = (attempts.current[file.name] ?? 0) + 1;
      progress(0.1);
      const fail =
        file.name.startsWith("bad") && attempts.current[file.name] === 1;
      const timer = setTimeout(
        () => {
          if (fail) reject(new Error("Upload failed"));
          else {
            progress(1);
            resolve();
          }
        },
        fail ? 120 : file.name.startsWith("cancel") ? 5000 : 900,
      );
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          setEvents((previous) => [...previous, `cancel:${file.name}`]);
          reject(new DOMException("Cancelled", "AbortError"));
        },
        { once: true },
      );
    });
  const uploading = variant === "upload-thread";
  return (
    <div style={{ height: "100%" }}>
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
        <button type="button" onClick={() => setConnection("offline")}>
          Disconnect
        </button>
        <button type="button" onClick={() => setConnection("online")}>
          Reconnect
        </button>
        <output aria-label="Runtime events">{JSON.stringify(events)}</output>
      </div>
      <div style={{ height: "calc(100% - 40px)" }}>
        <AgentThreadScreen
          simulate={false}
          running={{ running: 0, needs: 0 }}
          messages={uploading ? undefined : messages}
          defaultMessages={[]}
          onMessagesChange={uploading ? undefined : setMessages}
          connection={connection}
          onReconnect={() => setConnection("online")}
          upload={uploading ? uploader : undefined}
          onSend={(text, attachments) =>
            setEvents((previous) => [
              ...previous,
              `send:${text}:${attachments.map((file) => file.name).join(",")}`,
            ])
          }
          onStop={() =>
            setMessages((previous) =>
              previous.map((message) => ({ ...message, streaming: false })),
            )
          }
        />
      </div>
    </div>
  );
}
