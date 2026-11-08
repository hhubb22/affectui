import { useState } from "react";
import { ChatComposer } from "../components/chat-composer-clean";
import type { ChatComposerApproval, ChatComposerAttachment } from "../components/chat-composer-clean";
import { ArtifactWorkspace } from "../components/artifact-workspace-clean";

export function ControlledComposer() {
  const [value, setValue] = useState("Controlled draft");
  const [model, setModel] = useState("auto");
  const [approval, setApproval] = useState<ChatComposerApproval>("request");
  const [attachments, setAttachments] = useState<ChatComposerAttachment[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [sent, setSent] = useState("");
  return <main style={{ maxWidth: 680, margin: "100px auto", padding: 24 }}>
    <button type="button" onClick={() => setValue("External update")}>Set external draft</button>
    <button type="button" onClick={() => setDisabled(!disabled)}>Toggle disabled</button>
    <ChatComposer value={value} onValueChange={setValue} model={model} onModelChange={setModel} approval={approval} onApprovalChange={setApproval} attachments={attachments} onAttachmentsChange={setAttachments} disabled={disabled} onSend={(message, options) => setSent(JSON.stringify({ message, ...options }))}/>
    <output aria-label="Submitted message">{sent}</output>
  </main>;
}

export function UntrustedDocument() {
  return <ArtifactWorkspace defaultFiles={[{ name: "notes.md", kind: "document", content: "Title", html: '<h1>Title</h1><script>window.injected = true</script><a href="javascript:alert(1)" onclick="window.injected=true">Untrusted link</a><img src="x" onerror="window.injected=true">' }]}/>;
}
