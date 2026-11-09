# AI Chat / Agents

Recreates [AI Chat / Agents](https://www.affectui.com/screens/agent-chat): the Acme sidebar, orchestrator conversation and Summer launch campaign brief. The original was recorded with the sibling `anim-recorder` project, including tabs, angles, channel switches and generation.

Run `npm run dev` and open `/?screen=agent-chat`. Add `&style=classic`, `&theme=dark` or `&layout=flat`. The brief alone is at `/?component=campaign-brief`.

```tsx
import { AgentChatScreen } from "./screens/agent-chat-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <AgentChatScreen />
    </div>
  );
}
```

Use `agent-chat.tsx` for Classic. Both distributions have identical Props, import only React, and embed their CSS and SVGs. Edit `scripts/chat-rail/*.part` and run `npm run generate`, rather than editing the generated files.

## Behavior and application data

- `CampaignBrief` provides Brief, Assets and Activity tabs, selling-angle radios, channel switches, a static palette and format reference, file links and a sticky Generate button. Its `angle`, `channels` and `section` pairs support controlled state and corresponding `default*` and `on*Change` props.
- The screen's default demo waits 1,600ms before showing six fixed ad cards in Assets. Like the original demo, it does not filter the cards by channel or append a chat message. `briefProps.onGenerate` hands generation to the application; the callback does not imply success. Supply `briefProps.assets`, `generating` and `section` for application-owned results.
- Sending a message starts a two-second local demo reply based on the selected angle. Stop cancels that reply. Supplying `messages` or `onSend` disables the demo by default. Connect `messages`, `onMessagesChange`, `onSend`, `onStop` and `busy` to your runtime; `simulate={false}` disables it explicitly.
- `files`, `defaultFiles` and `onFilesChange` own the document, budget and product-photo artifacts. Open files remain in tabs alongside the brief. Document and cell edits survive tab changes. Product-photo previews are SVG wireframes, as in the original, not product photography. The spreadsheet does not calculate formulas.
- New tab reuses `WorkspaceStart` and the repository's frontend-only terminal, browser and notes surfaces. `onOpenUrl` delegates URL handling to the host application; these are not a real shell or embedded browser.
- Shell Props control workspace/user identity, sidebar navigation, theme, resizing and drawer state. `onNavigate`, `onOpenFile`, `onChatAction` and `onTitleChange` expose host actions. The Share demo copies the title, not a published conversation URL. Persistence and backend services remain application-owned.

## Keyboard and motion

Tabs and radios support arrows and Home/End; file tabs also support Delete. Narrow-screen drawers contain focus and restore it on Escape. Motion respects reduced-motion preferences.

The brief panel uses 380ms entrances with `cubic-bezier(.22,1,.36,1)`; ad cards and Activity rows use 420ms with 35ms stagger. Switch thumbs move 10px over 260ms. Generate labels and button width morph over 480ms with `cubic-bezier(.25,1,.5,1)`. The fixed bottom generation strip partially covers Formats at the original desktop height, matching the reference.

Run `node --test tests/agent-chat.test.mjs` for the screen's interaction contracts, `npm test` for all screens and `npm run build` for generation and type checks plus the production preview build.
