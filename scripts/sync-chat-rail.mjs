import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

// Components are distributed as copyable, self-contained files. Keep implementation changes in
// scripts/chat-rail/*.part, then regenerate both styles and every embedded copy with this script.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const names = ["tool-activity", "command-menu", "chat-composer", "artifact-workspace", "app-shell", "agent-thread", "agent-chat-rail", "thread-task-card", "decision-dock", "connection-banner", "away-summary", "thread-uploads", "task-details", "agent-thread-screen", "task-progress-ring", "task-create", "task-list", "task-inspector", "artifact-folder", "artifact-image", "workspace-start", "agent-tasks", "inbox-options", "inbox-feedback", "inbox-list", "inbox-item-view", "inbox-task-context", "inbox", "overview-cards", "assistant-overview", "files-browser", "files", "workspace-sidebar", "campaign-brief", "agent-chat"];
const dependencies = {
  "tool-activity": [], "command-menu": [], "chat-composer": [], "artifact-workspace": ["artifact-folder", "artifact-image"],
  "app-shell": ["command-menu"], "agent-thread": ["tool-activity", "chat-composer", "thread-task-card", "decision-dock", "connection-banner", "away-summary", "thread-uploads"],
  "agent-chat-rail": ["command-menu", "tool-activity", "chat-composer", "artifact-workspace", "app-shell", "agent-thread"],
  "thread-task-card": [], "decision-dock": [], "connection-banner": [], "away-summary": ["thread-task-card"], "thread-uploads": [], "task-details": ["thread-task-card"],
  "agent-thread-screen": ["app-shell", "artifact-workspace", "agent-thread", "task-details"],
  "task-progress-ring": [], "task-create": ["task-progress-ring"], "task-list": ["task-progress-ring"], "task-inspector": ["task-progress-ring"], "artifact-folder": [], "artifact-image": [], "workspace-start": [],
  "agent-tasks": ["app-shell", "artifact-workspace", "task-create", "task-list", "task-inspector", "workspace-start"],
};
Object.assign(dependencies, { "inbox-options": [], "inbox-feedback": [], "inbox-list": [], "inbox-item-view": ["inbox-options","inbox-feedback"], "inbox-task-context": [], "inbox": ["app-shell","artifact-workspace","workspace-start","inbox-list","inbox-item-view","inbox-task-context"] , "overview-cards": [], "assistant-overview": ["app-shell","artifact-workspace","workspace-start","chat-composer","overview-cards"] });
Object.assign(dependencies, { "files-browser": [], "files": ["app-shell", "files-browser", "workspace-sidebar"], "workspace-sidebar": [], "campaign-brief": [], "agent-chat": ["app-shell", "workspace-sidebar", "chat-composer", "artifact-workspace", "workspace-start", "campaign-brief"] });
const prefixes = ["ui-ta", "ui-cm", "ui-cc", "ui-aw", "ui-as", "ui-th", "ui-acr", "ui-tk", "ui-dd", "ui-cn", "ui-ay", "ui-up", "ui-td", "ui-tsr", "ui-tpr", "ui-tcr", "ui-tls", "ui-tin", "ui-afd", "ui-aiv", "ui-wst", "ui-ats", "ui-ibo", "ui-ibf", "ui-ibl", "ui-ibv", "ui-ibx", "ui-ibs", "ui-ovc", "ui-aov", "ui-fbr", "ui-fls", "ui-wsf", "ui-cbr", "ui-agc"];
names.push("integration-card", "integration-request", "app-directory", "integrations");
prefixes.push("ui-icd", "ui-irq", "ui-apd", "ui-igs");
Object.assign(dependencies, { "integration-card": [], "integration-request": [], "app-directory": ["integration-card", "integration-request"], "integrations": ["app-shell", "workspace-sidebar", "app-directory"] });
function dependenciesFor(name, seen = new Set()) {
  for (const dependency of dependencies[name]) if (!seen.has(dependency)) dependenciesFor(dependency, seen);
  seen.add(name); return [...seen];
}
const common = fs.readFileSync(path.join(root, "scripts/chat-rail/shared.part"), "utf8");
const reactImports = ["useCallback", "useEffect", "useId", "useLayoutEffect", "useRef", "useState", "type ComponentPropsWithRef", "type ComponentPropsWithoutRef", "type CSSProperties", "type KeyboardEvent", "type MouseEvent as ReactMouseEvent", "type PointerEvent as ReactPointerEvent", "type ReactNode", "type RefObject"];
const identifiers = source => new Set(source.match(/\b[A-Za-z_$][\w$]*\b/g) ?? []);
// Shared fragments keep each declaration at column zero. Dependency closure selects only the
// declarations used by a distribution file; strict noUnused checks validate the generated result.
const declarations = [...common.matchAll(/^(?:export\s+)?(?:type|const|function)\s+(\w+)/gm)];
const sharedStatements = declarations.map((match, index) => ({
  names: [match[1]],
  source: common.slice(match.index, declarations[index + 1]?.index ?? common.length),
}));
function primitivesFor(code) {
  const referenced = identifiers(code), selected = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const statement of sharedStatements) if (!selected.has(statement) && statement.names.some(name => referenced.has(name))) {
      selected.add(statement); for (const name of identifiers(statement.source)) referenced.add(name); changed = true;
    }
  }
  return sharedStatements.filter(statement => selected.has(statement)).map(statement => statement.source).join("\n");
}
const fragments = Object.fromEntries(names.map(name => {
  const [code, css] = fs.readFileSync(path.join(root, `scripts/chat-rail/${name}.part`), "utf8").split("/* ---------- Styles ---------- */");
  if (!css) throw new Error(`Missing styles: ${name}`);
  return [name, { code: code.trim(), css: css.trim() }];
}));
const classic = `
.ui-icd{--ui-icd-ink:#171717;--ui-icd-text:#404040;--ui-icd-muted:#737373;--ui-icd-faint:#b5b5b5;--ui-icd-line:#e5e5e5;--ui-icd-focus:#2f6bff;--ui-icd-shadow:0 0 0 1px var(--ui-icd-line),0 1px 2px rgba(0,0,0,.06)}.ui-icd .ui-icd__action{width:32px;height:32px;border-radius:10px}
.ui-irq{--ui-irq-ink:#171717;--ui-irq-muted:#737373;--ui-irq-line:#e5e5e5;--ui-irq-focus:#2f6bff}.ui-irq .ui-irq__button{height:32px;border-radius:8px;background:linear-gradient(#323137,#201e25);color:#fff}.ui-irq__popover{border:1px solid var(--ui-irq-line);border-radius:14px}
.ui-apd{--ui-apd-ink:#171717;--ui-apd-text:#404040;--ui-apd-muted:#737373;--ui-apd-line:#e5e5e5;--ui-apd-chip:#f5f5f5;--ui-apd-focus:#2f6bff}
:where(.dark,[data-theme="dark"]) .ui-icd{--ui-icd-card:#232326;--ui-icd-ink:#ededed;--ui-icd-text:#c4c4c4;--ui-icd-muted:#8f8f8f;--ui-icd-line:rgba(255,255,255,.1);--ui-icd-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-irq{--ui-irq-card:#232326;--ui-irq-ink:#ededed;--ui-irq-muted:#8f8f8f;--ui-irq-line:rgba(255,255,255,.1);--ui-irq-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-apd{--ui-apd-card:#232326;--ui-apd-ink:#ededed;--ui-apd-strong:#fff;--ui-apd-text:#c4c4c4;--ui-apd-muted:#8f8f8f;--ui-apd-line:rgba(255,255,255,.1);--ui-apd-chip:#2a2a2d;--ui-apd-focus:#6b95ff}
.ui-cbr{--ui-cbr-ink:#171717;--ui-cbr-text:#404040;--ui-cbr-muted:#737373;--ui-cbr-faint:#b5b5b5;--ui-cbr-line:#e5e5e5;--ui-cbr-chip:#f5f5f5;--ui-cbr-focus:#2f6bff}.ui-cbr__card,.ui-cbr__product,.ui-cbr__go,.ui-cbr__activity{box-shadow:inset 0 0 0 1px var(--ui-cbr-line),0 1px 2px rgba(0,0,0,.06)}.ui-cbr .ui-cbr__generate{height:32px;border-radius:8px;background:linear-gradient(#323137,#201e25);color:#fff}
:where(.dark,[data-theme="dark"]) .ui-cbr{--ui-cbr-card:#232326;--ui-cbr-ink:#ededed;--ui-cbr-text:#c4c4c4;--ui-cbr-muted:#8f8f8f;--ui-cbr-faint:#6b6b70;--ui-cbr-line:rgba(255,255,255,.1);--ui-cbr-chip:#2a2a2d;--ui-cbr-focus:#6b95ff}
.ui-ovc{--ui-ovc-ink:#171717;--ui-ovc-text:#404040;--ui-ovc-muted:#737373;--ui-ovc-line:#e5e5e5;--ui-ovc-chip:#f5f5f5;--ui-ovc-hover:#fafafa;--ui-ovc-focus:#2f6bff}.ui-ovc__card{border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
:where(.dark,[data-theme="dark"]) .ui-ovc{--ui-ovc-card:#232326;--ui-ovc-ink:#ededed;--ui-ovc-text:#c4c4c4;--ui-ovc-muted:#8f8f8f;--ui-ovc-line:rgba(255,255,255,.1);--ui-ovc-chip:#2a2a2d;--ui-ovc-hover:#2a2a2d;--ui-ovc-focus:#6b95ff}
.ui-ibo{--ui-ibo-ink:#171717;--ui-ibo-muted:#737373;--ui-ibo-faint:#b5b5b5;--ui-ibo-line:#e5e5e5;--ui-ibo-fill:#f5f5f5;--ui-ibo-focus:#2f6bff;border:1px solid var(--ui-ibo-line);border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.ui-ibo__option{border-radius:10px;min-height:60px}.ui-ibo[data-variant="variants"]{border:0;border-radius:0;box-shadow:none}
.ui-ibv{--ui-ibv-ink:#171717;--ui-ibv-text:#404040;--ui-ibv-muted:#737373;--ui-ibv-faint:#b5b5b5;--ui-ibv-line:#e5e5e5;--ui-ibv-fill:#f5f5f5;--ui-ibv-focus:#2f6bff;--ui-ibv-shadow:0 0 0 1px var(--ui-ibv-line),0 1px 2px rgba(0,0,0,.06)}.ui-ibv__button{height:32px;border-radius:8px}.ui-ibv__reply{height:36px;border-radius:10px}.ui-ibv__area{height:88px}.ui-ibv__send{background:linear-gradient(#323137,#201e25)!important;color:#fff!important;box-shadow:0 0 0 1px #0d0d0d,inset 0 1px rgba(255,255,255,.12)}
.ui-ibl{--ui-ibl-ink:#171717;--ui-ibl-muted:#737373;--ui-ibl-faint:#b5b5b5;--ui-ibl-line:#e5e5e5;--ui-ibl-fill:#f5f5f5;--ui-ibl-focus:#2f6bff}.ui-ibl__head{height:52px}.ui-ibl__tabs button{height:32px;border-radius:8px}
.ui-ibx{--ui-ibx-ink:#171717;--ui-ibx-text:#404040;--ui-ibx-muted:#737373;--ui-ibx-faint:#b5b5b5;--ui-ibx-line:#e5e5e5;--ui-ibx-fill:#fafafa;--ui-ibx-focus:#2f6bff}.ui-ibx__files>button{min-height:30px;border:1px solid var(--ui-ibx-line);border-radius:8px}.ui-ibx__decided>button{border:1px solid var(--ui-ibx-line);box-shadow:none}
.ui-ibf{--ui-ibf-ink:#171717;--ui-ibf-muted:#737373;--ui-ibf-fill:#f5f5f5;--ui-ibf-line:#e5e5e5;--ui-ibf-focus:#2f6bff}.ui-ibf__empty button{height:32px;border-radius:8px;box-shadow:0 0 0 1px var(--ui-ibf-line),0 1px 2px rgba(0,0,0,.06)}
:where(.dark,[data-theme="dark"]) .ui-ibo{--ui-ibo-card:#232326;--ui-ibo-ink:#ededed;--ui-ibo-text:#c4c4c4;--ui-ibo-muted:#8f8f8f;--ui-ibo-faint:#6b6b70;--ui-ibo-line:rgba(255,255,255,.1);--ui-ibo-fill:#2a2a2d;--ui-ibo-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-ibv{--ui-ibv-card:#232326;--ui-ibv-ink:#ededed;--ui-ibv-text:#c4c4c4;--ui-ibv-muted:#8f8f8f;--ui-ibv-faint:#6b6b70;--ui-ibv-line:rgba(255,255,255,.1);--ui-ibv-fill:#2a2a2d;--ui-ibv-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-ibl{--ui-ibl-card:#232326;--ui-ibl-ink:#ededed;--ui-ibl-text:#c4c4c4;--ui-ibl-muted:#8f8f8f;--ui-ibl-faint:#6b6b70;--ui-ibl-line:rgba(255,255,255,.1);--ui-ibl-fill:#2a2a2d;--ui-ibl-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-ibx{--ui-ibx-card:#232326;--ui-ibx-ink:#ededed;--ui-ibx-text:#c4c4c4;--ui-ibx-muted:#8f8f8f;--ui-ibx-faint:#6b6b70;--ui-ibx-line:rgba(255,255,255,.1);--ui-ibx-fill:#2a2a2d;--ui-ibx-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-ibf{--ui-ibf-card:#232326;--ui-ibf-ink:#ededed;--ui-ibf-text:#c4c4c4;--ui-ibf-muted:#8f8f8f;--ui-ibf-faint:#6b6b70;--ui-ibf-line:rgba(255,255,255,.1);--ui-ibf-fill:#2a2a2d;--ui-ibf-focus:#6b95ff}

.ui-tpr{--ui-tpr-muted:#b5b5b5}
.ui-tcr{--ui-tcr-ink:#171717;--ui-tcr-text:#404040;--ui-tcr-muted:#737373;--ui-tcr-faint:#b5b5b5;--ui-tcr-line:#e5e5e5;--ui-tcr-fill:#f5f5f5;--ui-tcr-focus:#2f6bff;border:1px solid var(--ui-tcr-line);border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.06);font-size:14px}.ui-tcr__submit,.ui-tcr__project{height:32px}.ui-tcr__submit{background:linear-gradient(#323137,#201e25)!important;color:#fff!important;box-shadow:0 0 0 1px #0d0d0d,inset 0 1px rgba(255,255,255,.12)}
.ui-tls{--ui-tls-ink:#171717;--ui-tls-text:#404040;--ui-tls-muted:#737373;--ui-tls-faint:#b5b5b5;--ui-tls-line:#e5e5e5;--ui-tls-fill:#f5f5f5;--ui-tls-hover:#fafafa;--ui-tls-focus:#2f6bff;--ui-tls-row-height:48px;font-size:14px}.ui-tls__head{height:52px;border-bottom:1px solid var(--ui-tls-line)}.ui-tls__tabs button,.ui-tls__new{height:32px}.ui-tls .ui-tls__new{border:1px solid var(--ui-tls-line);border-radius:8px}
.ui-tin{--ui-tin-ink:#171717;--ui-tin-text:#404040;--ui-tin-muted:#737373;--ui-tin-faint:#b5b5b5;--ui-tin-line:#e5e5e5;--ui-tin-fill:#fafafa;--ui-tin-focus:#2f6bff;font-size:14px}.ui-tin__needs,.ui-tin__decided{border:1px solid var(--ui-tin-line);border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.ui-tin__decide{height:32px;background:linear-gradient(#323137,#201e25)!important;color:#fff!important;box-shadow:0 0 0 1px #0d0d0d,inset 0 1px rgba(255,255,255,.12)}
.ui-afd{--ui-afd-ink:#171717;--ui-afd-text:#404040;--ui-afd-muted:#737373;--ui-afd-faint:#b5b5b5;--ui-afd-line:#e5e5e5;--ui-afd-fill:#f5f5f5;--ui-afd-focus:#2f6bff;font-size:14px}.ui-afd__item{height:36px}.ui-afd__search{border-width:1px;height:32px}
.ui-aiv{--ui-aiv-ink:#171717;--ui-aiv-muted:#737373;--ui-aiv-line:#e5e5e5;--ui-aiv-fill:#fafafa;--ui-aiv-focus:#2f6bff}.ui-aiv button,.ui-aiv a{min-width:32px;height:32px}
.ui-wst{--ui-wst-ink:#171717;--ui-wst-muted:#737373;--ui-wst-faint:#b5b5b5;--ui-wst-line:#e5e5e5;--ui-wst-fill:#f5f5f5;--ui-wst-focus:#2f6bff;font-size:14px}.ui-wst__card{border:1px solid var(--ui-wst-line);border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
:where(.dark,[data-theme="dark"]) .ui-tcr{--ui-tcr-card:#232326;--ui-tcr-ink:#ededed;--ui-tcr-text:#c4c4c4;--ui-tcr-muted:#8f8f8f;--ui-tcr-faint:#6b6b70;--ui-tcr-line:rgba(255,255,255,.1);--ui-tcr-fill:#2a2a2d;--ui-tcr-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-tls{--ui-tls-card:#232326;--ui-tls-ink:#ededed;--ui-tls-text:#c4c4c4;--ui-tls-muted:#8f8f8f;--ui-tls-faint:#6b6b70;--ui-tls-line:rgba(255,255,255,.1);--ui-tls-fill:#2a2a2d;--ui-tls-hover:#2a2a2d;--ui-tls-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-tin{--ui-tin-card:#232326;--ui-tin-ink:#ededed;--ui-tin-text:#c4c4c4;--ui-tin-muted:#8f8f8f;--ui-tin-faint:#6b6b70;--ui-tin-line:rgba(255,255,255,.1);--ui-tin-fill:#2a2a2d;--ui-tin-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-afd{--ui-afd-card:#232326;--ui-afd-ink:#ededed;--ui-afd-text:#c4c4c4;--ui-afd-muted:#8f8f8f;--ui-afd-faint:#6b6b70;--ui-afd-line:rgba(255,255,255,.1);--ui-afd-fill:#2a2a2d;--ui-afd-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-aiv{--ui-aiv-card:#232326;--ui-aiv-ink:#ededed;--ui-aiv-muted:#8f8f8f;--ui-aiv-line:rgba(255,255,255,.1);--ui-aiv-fill:#2a2a2d;--ui-aiv-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-wst{--ui-wst-card:#232326;--ui-wst-ink:#ededed;--ui-wst-muted:#8f8f8f;--ui-wst-faint:#6b6b70;--ui-wst-line:rgba(255,255,255,.1);--ui-wst-fill:#2a2a2d;--ui-wst-focus:#6b95ff}
.ui-tk{--ui-tk-ink:#171717;--ui-tk-muted:#737373;--ui-tk-faint:#b5b5b5;--ui-tk-line:#e5e5e5;--ui-tk-fill:#f5f5f5;--ui-tk-focus:#2f6bff;min-height:56px;border:1px solid var(--ui-tk-line);box-shadow:0 1px 2px rgba(0,0,0,.06);border-radius:14px}.ui-tk button{height:32px}
.ui-dd{--ui-dd-ink:#171717;--ui-dd-muted:#737373;--ui-dd-faint:#b5b5b5;--ui-dd-line:#e5e5e5;--ui-dd-fill:#f5f5f5;--ui-dd-focus:#2f6bff}.ui-dd__clip{padding:6px;background:var(--ui-dd-tray);border-radius:22px}.ui-dd__card{border:1px solid var(--ui-dd-line);border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.ui-dd__option{min-height:44px}
.ui-cn{--ui-cn-text:#404040;--ui-cn-muted:#737373;--ui-cn-line:#e5e5e5;--ui-cn-fill:#f5f5f5;--ui-cn-focus:#2f6bff;font-size:13px}.ui-cn button{height:32px;border-width:1px}
.ui-ay{--ui-ay-ink:#171717;--ui-ay-muted:#737373;--ui-ay-faint:#b5b5b5;--ui-ay-line:#e5e5e5;--ui-ay-fill:#f5f5f5;--ui-ay-focus:#2f6bff}.ui-ay__card{border:1px solid var(--ui-ay-line);border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.ui-up{--ui-up-ink:#171717;--ui-up-muted:#737373;--ui-up-faint:#b5b5b5;--ui-up-line:#e5e5e5;--ui-up-fill:#f5f5f5;--ui-up-focus:#2f6bff}.ui-up__file{border:1px solid var(--ui-up-line);border-radius:12px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.ui-td{--ui-td-ink:#171717;--ui-td-text:#404040;--ui-td-muted:#737373;--ui-td-faint:#b5b5b5;--ui-td-line:#e5e5e5;--ui-td-fill:#f5f5f5;--ui-td-focus:#2f6bff;font-size:14px}
:where(.dark,[data-theme="dark"]) .ui-tk{--ui-tk-card:#232326;--ui-tk-ink:#ededed;--ui-tk-muted:#8f8f8f;--ui-tk-line:rgba(255,255,255,.1);--ui-tk-fill:#2a2a2d}
:where(.dark,[data-theme="dark"]) .ui-dd{--ui-dd-card:#232326;--ui-dd-ink:#ededed;--ui-dd-muted:#8f8f8f;--ui-dd-faint:#6b6b70;--ui-dd-line:rgba(255,255,255,.1);--ui-dd-fill:#2a2a2d}
:where(.dark,[data-theme="dark"]) .ui-cn{--ui-cn-card:#232326;--ui-cn-text:#c4c4c4;--ui-cn-muted:#8f8f8f;--ui-cn-line:rgba(255,255,255,.1);--ui-cn-fill:#2a2a2d}
:where(.dark,[data-theme="dark"]) .ui-ay{--ui-ay-card:#232326;--ui-ay-ink:#ededed;--ui-ay-muted:#8f8f8f;--ui-ay-line:rgba(255,255,255,.1);--ui-ay-fill:#2a2a2d}
:where(.dark,[data-theme="dark"]) .ui-up{--ui-up-card:#232326;--ui-up-ink:#ededed;--ui-up-muted:#8f8f8f;--ui-up-line:rgba(255,255,255,.1);--ui-up-fill:#2a2a2d}
:where(.dark,[data-theme="dark"]) .ui-td{--ui-td-card:#232326;--ui-td-ink:#ededed;--ui-td-text:#c4c4c4;--ui-td-muted:#8f8f8f;--ui-td-line:rgba(255,255,255,.1);--ui-td-fill:#2a2a2d}
/* Classic surfaces: roomier controls, solid tokens and a tray beneath the input card. */
.ui-ta{--ui-ta-ink:#171717;--ui-ta-text:#737373;--ui-ta-faint:#b5b5b5;--ui-ta-line:#e5e5e5;--ui-ta-ok:#1f8a4c;--ui-ta-focus:#2f6bff;font-size:14px}
.ui-cm{--ui-cm-ink:#171717;--ui-cm-text:#404040;--ui-cm-muted:#737373;--ui-cm-line:#e5e5e5;--ui-cm-fill:#f5f5f5;--ui-cm-focus:#2f6bff;font-size:14px}.ui-cm__panel{border:1px solid var(--ui-cm-line);border-radius:18px}.ui-cm__item{min-height:52px}
.ui-cc{--ui-cc-ink:#171717;--ui-cc-text:#404040;--ui-cc-muted:#737373;--ui-cc-faint:#b5b5b5;--ui-cc-tray:#f0f0f0;--ui-cc-fill:#f5f5f5;--ui-cc-line:#e5e5e5;--ui-cc-focus:#2f6bff;padding:6px;border-radius:22px;background:var(--ui-cc-tray);font-size:14px}.ui-cc__body{border:1px solid var(--ui-cc-line);border-radius:16px;box-shadow:0 1px 2px rgba(0,0,0,.06)}.ui-cc__send{background:linear-gradient(#323137,#201e25)!important;color:#fff!important;box-shadow:0 0 0 1px #0d0d0d,inset 0 1px rgba(255,255,255,.12)}.ui-cc__send:disabled{box-shadow:none;background:var(--ui-cc-fill)!important;color:var(--ui-cc-muted)!important}.ui-cc__icon-btn,.ui-cc__send{width:32px;height:32px}.ui-cc__approval,.ui-cc__model{height:32px}.ui-cc__menu{border:1px solid var(--ui-cc-line);border-radius:14px}
.ui-aw{--ui-aw-ink:#171717;--ui-aw-text:#404040;--ui-aw-muted:#737373;--ui-aw-faint:#b5b5b5;--ui-aw-line:#e5e5e5;--ui-aw-fill:#fafafa;--ui-aw-focus:#2f6bff;font-size:14px}.ui-aw__bar{border-bottom:1px solid var(--ui-aw-line)}.ui-aw__grid th,.ui-aw__grid td{border-width:1px}.ui-aw__tool{width:30px;height:30px}
.ui-as{--ui-as-page:#f0f0f0;--ui-as-side:#f7f7f7;--ui-as-ink:#171717;--ui-as-text:#404040;--ui-as-muted:#737373;--ui-as-faint:#b5b5b5;--ui-as-line:#e5e5e5;--ui-as-fill:#ededed;--ui-as-focus:#2f6bff;font-size:14px}.ui-as__main,.ui-as__panel{box-shadow:0 0 0 1px var(--ui-as-line),0 1px 2px rgba(0,0,0,.06)}.ui-as__chat-link,.ui-as__folder,.ui-as__new-chat{height:32px;min-height:32px}.ui-as__side-col{border-radius:16px 0 0 16px}.ui-as__main{border-radius:0 16px 16px 0}.ui-as__panel{border-radius:16px}.ui-as__menu{border:1px solid var(--ui-as-line);border-radius:14px}
.ui-th{--ui-th-ink:#171717;--ui-th-text:#404040;--ui-th-muted:#737373;--ui-th-faint:#b5b5b5;--ui-th-line:#e5e5e5;--ui-th-fill:#f5f5f5;--ui-th-focus:#2f6bff}
:where(.dark,[data-theme="dark"]) .ui-as,.ui-as[data-theme="dark"]{--ui-as-page:#111113;--ui-as-card:#232326;--ui-as-side:#161618;--ui-as-ink:#ededed;--ui-as-text:#c4c4c4;--ui-as-muted:#8f8f8f;--ui-as-faint:#6b6b70;--ui-as-line:rgba(255,255,255,.1);--ui-as-fill:#2a2a2d;--ui-as-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-cc{--ui-cc-card:#232326;--ui-cc-tray:#161618;--ui-cc-ink:#ededed;--ui-cc-text:#c4c4c4;--ui-cc-muted:#8f8f8f;--ui-cc-faint:#6b6b70;--ui-cc-line:rgba(255,255,255,.1);--ui-cc-fill:#2a2a2d;--ui-cc-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-th{--ui-th-card:#232326;--ui-th-ink:#ededed;--ui-th-text:#c4c4c4;--ui-th-muted:#8f8f8f;--ui-th-faint:#6b6b70;--ui-th-fill:#2a2a2d;--ui-th-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-aw{--ui-aw-card:#232326;--ui-aw-ink:#ededed;--ui-aw-text:#c4c4c4;--ui-aw-muted:#8f8f8f;--ui-aw-faint:#6b6b70;--ui-aw-line:rgba(255,255,255,.1);--ui-aw-fill:#2a2a2d;--ui-aw-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-cm{--ui-cm-card:#232326;--ui-cm-ink:#ededed;--ui-cm-text:#c4c4c4;--ui-cm-muted:#8f8f8f;--ui-cm-line:rgba(255,255,255,.1);--ui-cm-fill:#2a2a2d;--ui-cm-focus:#6b95ff}
:where(.dark,[data-theme="dark"]) .ui-ta{--ui-ta-card:#232326;--ui-ta-ink:#ededed;--ui-ta-text:#8f8f8f;--ui-ta-faint:#6b6b70;--ui-ta-focus:#6b95ff}
`;
const check = process.argv.includes("--check");
let stale = false;
for (const name of names) {
  const included = dependenciesFor(name);
  for (const clean of [false, true]) {
    const href = `ui-${name}${clean ? "-clean" : ""}`;
    const code = included.map(part => fragments[part].code).join("\n\n").replace(/<style href="[^"]+" precedence="default">\{css\}<\/style>/g, `<style href="${href}" precedence="default">{css}</style>`);
    let css = included.map(part => fragments[part].css).join("\n\n");
    if (!clean) {
      const selected = new Set(included.map(part => prefixes[names.indexOf(part)]));
      css += "\n" + classic.split("\n").filter(line => [...selected].some(prefix => line.includes(`.${prefix}{`) || line.includes(`.${prefix}__`) || line.includes(`.${prefix}[`))).join("\n");
    }
    css = await format(css, { parser: "css", printWidth: 120 });
    const shared = primitivesFor(code);
    const used = identifiers(shared + "\n" + code);
    const imports = reactImports.filter(entry => used.has(entry.split(" ").at(-1)));
    const header = `"use client";\n\nimport { ${imports.join(", ")} } from "react";\n`;
    let output = `${header}\n/*\n * ${name}${clean ? " (Clean)" : " (Classic)"} – a self-contained React 19 component.\n * Inline SVGs and scoped styles are included; no other local files or packages are required.\n * Maintained in scripts/chat-rail; run npm run generate after changes.\n */\n\n${shared}\n${code}\n\n/* ---------- Styles ---------- */\n\nconst css = /* css */ \`\n${css}\n\`;\n`;
    output = output.replaceAll('strokeWidth="1.4"', clean ? 'strokeWidth="1.25"' : 'strokeWidth="1.5"');
    if (clean) for (const prefix of [...prefixes].sort((a, b) => b.length - a.length)) output = output.replaceAll(prefix, `${prefix}c`);
    output = await format(output, { parser: "typescript", printWidth: 120 });
    const screen = name === "agent-chat-rail" || name === "agent-thread-screen" || name === "agent-tasks" || name === "inbox" || name === "assistant-overview" || name === "files" || name === "agent-chat" || name === "integrations";
    const basename = name === "agent-thread-screen" ? "agent-thread" : name;
    const relative = `${screen ? "screens" : "components"}/${basename}${clean ? "-clean" : ""}.tsx`;
    const target = path.join(root, relative);
    if (check) { if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output) { console.error(`Out of date: ${relative}`); stale = true; } }
    else { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, output); console.log(relative); }
  }
}
if (stale) process.exitCode = 1;
