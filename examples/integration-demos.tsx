import { useState } from "react";
import {
  AppDirectory as CleanDirectory,
  defaultIntegrations,
} from "../components/app-directory-clean";
import { AppDirectory as ClassicDirectory } from "../components/app-directory";
import { IntegrationCard as CleanCard } from "../components/integration-card-clean";
import { IntegrationCard as ClassicCard } from "../components/integration-card";
import { IntegrationRequest as CleanRequest } from "../components/integration-request-clean";
import { IntegrationRequest as ClassicRequest } from "../components/integration-request";

export default function IntegrationDemos({
  name,
  clean,
}: {
  name: string;
  clean: boolean;
}) {
  const Card = clean ? CleanCard : ClassicCard,
    Request = clean ? CleanRequest : ClassicRequest,
    Directory = clean ? CleanDirectory : ClassicDirectory;
  const [connected, setConnected] = useState<string[]>(["slack"]),
    [pending, setPending] = useState<string[]>([]),
    [failure, setFailure] = useState(false),
    [notice, setNotice] = useState("");
  if (name === "integration-card")
    return (
      <div style={{ maxWidth: 520, padding: 32, margin: "auto" }}>
        {defaultIntegrations.slice(0, 4).map((integration) => (
          <Card
            key={integration.id}
            integration={integration}
            defaultConnected={integration.id === "slack"}
          />
        ))}
      </div>
    );
  if (name === "integration-request")
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <Request onRequest={(tool) => setNotice(`Requested: ${tool}`)} />
        <output role="status" style={{ marginLeft: 16 }}>
          {notice}
        </output>
      </div>
    );
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16 }}>
        <button type="button" onClick={() => setConnected(pending)}>
          Apply connections
        </button>
        <label>
          <input
            type="checkbox"
            checked={failure}
            onChange={(event) => setFailure(event.target.checked)}
          />
          Fail actions
        </label>
        <output aria-label="Pending connections">
          {JSON.stringify(pending)}
        </output>
        <output aria-label="Requested tool">{notice}</output>
      </div>
      <Directory
        connected={connected}
        onConnectedChange={setPending}
        onConnectionChange={async () => {
          if (failure) throw new Error("Connection failed. Please retry.");
        }}
        requestProps={{
          onRequest: async (tool) => {
            if (failure) throw new Error("Request failed. Please retry.");
            setNotice(tool);
          },
        }}
      />
    </>
  );
}
