# Integrations / App Directory

Recreates [Integrations](https://www.affectui.com/screens/integrations/full): the Acme sidebar, searchable integration directory, connection actions, category expansion and anchored Request form. The reference and recreation were both recorded with the sibling `anim-recorder` project using the same interaction script.

Run `npm run dev` and open `/?screen=integrations`. Add `&style=classic`, `&theme=dark` or `&layout=flat`.

| Export               | Clean file                                 | Standalone preview               |
| -------------------- | ------------------------------------------ | -------------------------------- |
| `IntegrationsScreen` | `screens/integrations-clean.tsx`           | `?screen=integrations`           |
| `AppDirectory`       | `components/app-directory-clean.tsx`       | `?component=app-directory`       |
| `IntegrationCard`    | `components/integration-card-clean.tsx`    | `?component=integration-card`    |
| `IntegrationRequest` | `components/integration-request-clean.tsx` | `?component=integration-request` |

Remove `-clean` for Classic. Both styles expose identical Props. Each TSX file imports only React and contains its own styles, SVGs and embedded components; copying one file is sufficient. The preview supplies Inter; applications can load Inter themselves or use the system-font fallback.

```tsx
import { IntegrationsScreen } from "./screens/integrations-clean";

export default function Page() {
  return (
    <div style={{ height: "100dvh" }}>
      <IntegrationsScreen />
    </div>
  );
}
```

## Behavior and application ownership

- The default directory contains 22 integrations in Popular, Google and Communication. Slack starts connected. Each category initially shows up to six entries; expanding reveals the rest. Search matches names, descriptions and categories, ignores surrounding whitespace and case, and searches folded entries too. All, Connected and Available combine with search.
- `integrations` replaces the sample services; `defaultIntegrations` and the `Integration` type are exported for reuse. Icons are inline SVG samples; trademarks remain their owners' property. Custom entries can supply `icon` and `background`.
- `connected`, `filter` and `search` support controlled state, with matching `default*` and `on*Change` Props. A controlled value changes only when the caller updates its Prop.
- `onConnectionChange(integration, connected)` delegates a connection action to the application. While its Promise is pending the row is disabled and shows a spinner. Resolving emits `onConnectedChange(ids)`; rejection retains the old connection state and shows the error. Omit the callback for the local demo: connecting waits 950ms and disconnecting is immediate. Concurrent actions for different rows merge their results; a pending row cannot submit twice.
- `IntegrationCard` provides the row independently, with `connected`, `defaultConnected`, `onConnectedChange`, `busy`, `disabled` and `error`. It performs no asynchronous action itself.
- `IntegrationRequest` accepts `open`, `defaultOpen`, `onOpenChange` and `onRequest(name)`. Blank/whitespace-only names cannot submit; names passed to the callback are trimmed. A pending request cannot submit twice. Resolution clears the draft and closes the form; rejection retains the draft and displays the error. Without a callback, submission is a local success demonstration, not a delivered request.
- The screen accepts directory APIs through `directoryProps`, including `requestProps`, and shared shell Props for identity, theme, sidebar and navigation. `?component=controlled-integrations` demonstrates delayed application confirmation and rejected callbacks.

There is **no OAuth, backend request, persistence or real integration connection** built in. Wire the callbacks and controlled values to your application. The reference recording deliberately dismisses Request without submitting to the public service; the success/error flow is an application-facing addition, not an observed backend contract.

## Keyboard, layout and recorded motion

Tabs support Left/Right and Home/End with a single tab stop. Request is a non-modal anchored form: opening focuses the input; Escape closes it and restores trigger focus; clicking outside dismisses it. The filter toolbar stays visible while the main panel scrolls. The directory uses two columns on desktop and one in narrow containers, and supports dark mode, coarse pointers and reduced motion.

Measurements from the reference: 957px maximum content width, 58px rows, 30px logos, 28px connection buttons (32px for coarse pointers), 32px column gap, 24/32px title. The moving tab indicator uses 340ms, section/reveal entrances 420ms with 35ms section stagger, completion icons 260ms, spinner 700ms linear and Request entrance 220ms. The shared entrance easing is `cubic-bezier(.22,1,.36,1)`. Reduced-motion mode disables these animations.

## Recording and verification

From this repository, with the sibling recorder installed and Chrome exposing CDP on port 9222:

```sh
node ../anim-recorder/record.mjs https://www.affectui.com/screens/integrations/full \
  -s .ui-as-integrations --cdp http://localhost:9222 \
  --script scripts/record-integrations.mjs --screencast -o /tmp/integrations-original
node ../anim-recorder/record.mjs http://localhost:5173/?screen=integrations \
  -s .ui-apdc --cdp http://localhost:9222 \
  --script scripts/record-integrations.mjs --screencast -o /tmp/integrations-recreation
node ../anim-recorder/verify.mjs /tmp/integrations-original
node ../anim-recorder/verify.mjs /tmp/integrations-recreation
```

Start both pages fresh at the same viewport before recording. The script covers connection, filters, expansion, search, empty results, Request entry and Escape dismissal. Recorder verification checks lossless track storage, **not visual similarity**. The DOM structures differ, so a whole-recording path-based comparison is not a meaningful fidelity score; compare corresponding layout/motion values and screenshots instead.

Edit `scripts/chat-rail/*.part`, then run `npm run generate`; do not edit generated TSX directly. Run `node --test tests/integrations.test.mjs`, `npm test` and `npm run build` for browser contracts, the full suite, generation freshness, matching Classic/Clean APIs and the production preview.
