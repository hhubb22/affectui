import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, browser, page, base, errors;
before(async () => {
  server = await createServer({
    server: { host: "127.0.0.1", port: 0 },
    logLevel: "error",
    plugins: [
      {
        name: "campaign-controlled-fixture",
        resolveId(id) {
          if (id === "virtual:campaign-controlled") return `\0${id}`;
        },
        load(id) {
          if (id !== "\0virtual:campaign-controlled") return;
          return `
          import { createElement as h, useState } from "react";
          import { createRoot } from "react-dom/client";
          import { AgentChatScreen, CampaignBrief } from "/screens/agent-chat-clean.tsx";
          function Fixture() {
            const [state, setState] = useState({ angle: "Problem–solution", channels: { instagram: false, tiktok: true, facebook: false }, section: "brief" });
            const [pending, setPending] = useState(null), [events, setEvents] = useState([]);
            const event = value => setEvents(previous => [...previous, value]);
            return h("div", { style: { height: "100%" } },
              h("output", { "aria-label": "Events" }, JSON.stringify(events)),
              new URLSearchParams(location.search).has("brief") ? h("div", { style: { width: 368 } },
                h("button", { onClick: () => { setState({ ...state, ...pending }); setPending(null); } }, "Apply change"),
                h("output", { "aria-label": "Pending change" }, JSON.stringify(pending)),
                h(CampaignBrief, { ...state, onAngleChange: angle => setPending({ angle }), onChannelsChange: channels => setPending({ channels }), onSectionChange: section => setPending({ section }) })) :
              h(AgentChatScreen, { messages: [], onSend: text => event(text), briefProps: { onGenerate: () => event("generate") } }));
          }
          createRoot(document.getElementById("root")).render(h(Fixture));`;
        },
        configureServer(server) {
          server.middlewares.use(
            "/__campaign-controlled",
            async (_request, response) => {
              response.setHeader("Content-Type", "text/html");
              response.end(
                await server.transformIndexHtml(
                  "/__campaign-controlled",
                  '<!doctype html><html><head><style>html,body,#root{height:100%;margin:0}</style></head><body><div id="root"></div><script type="module" src="/@id/__x00__virtual:campaign-controlled"></script></body></html>',
                ),
              );
            },
          );
        },
      },
    ],
  });
  await server.listen();
  base = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  await browser?.close();
  await server?.close();
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(6500);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
afterEach(async () => {
  await page.close();
  assert.deepEqual(errors, [], "No browser errors or React warnings");
});
const button = (name) => page.getByRole("button", { name, exact: true });
const tab = (name) => page.getByRole("tab", { name, exact: true });
const conversation = () =>
  page.getByRole("log", { name: "Campaign conversation" });
const visit = async (extra = "") => {
  await page.goto(`${base}/?screen=agent-chat${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
};

test("brief settings survive tab changes; generation shows all six demo ads without changing chat", async () => {
  await visit();
  const initial = await conversation().innerText();
  await tab("Assets").click();
  assert.equal(
    await page.getByText("No assets yet", { exact: true }).count(),
    1,
  );
  await tab("Brief").click();
  await page.getByRole("radio", { name: /^Social proof/ }).click();
  await page.getByRole("switch", { name: "TikTok", exact: true }).uncheck();
  await tab("Activity").click();
  assert.equal(await page.getByText(/^Angle set to Social proof/).count(), 1);
  await tab("Brief").click();
  assert.equal(
    await page.getByRole("switch", { name: "TikTok", exact: true }).isChecked(),
    false,
  );
  await button("Generate ads").click();
  assert.equal(await button("Generating…").isDisabled(), true);
  await page.waitForFunction(
    () =>
      document.querySelector(
        '[aria-label="Brief sections"] [aria-selected="true"]',
      )?.textContent === "Assets",
  );
  assert.equal(
    await page.getByText("6 ads · Social proof", { exact: true }).count(),
    1,
  );
  assert.equal(await page.getByRole("figure").count(), 6);
  assert.equal(await page.getByText("Facebook", { exact: true }).count(), 1);
  assert.equal(await page.getByText("TikTok", { exact: true }).count(), 2);
  assert.equal(await conversation().innerText(), initial);
});

test("brief file tabs preserve document and budget edits, and open product images", async () => {
  await visit();
  await button("brand-guide.md").click();
  const editor = page.getByRole("textbox", {
    name: "brand-guide.md, document",
    exact: true,
  });
  await editor.fill("Campaign copy approved for June.");
  await tab("Summer launch").click();
  await button("launch-budget.csv").click();
  await page
    .getByRole("gridcell", { name: "B2: 1200", exact: true })
    .dblclick();
  await page
    .getByRole("textbox", { name: "Edit B2", exact: true })
    .fill("1350");
  await page.keyboard.press("Enter");
  await tab("brand-guide.md").click();
  assert.equal(await editor.innerText(), "Campaign copy approved for June.");
  await tab("launch-budget.csv").click();
  assert.equal(
    await page.getByRole("gridcell", { name: "B2: 1350", exact: true }).count(),
    1,
  );
  await tab("Summer launch").click();
  await button("product-photos").click();
  await page.getByRole("option", { name: /^overshirt-front.png/ }).dblclick();
  assert.equal(
    await tab("overshirt-front.png").getAttribute("aria-selected"),
    "true",
  );
  assert.equal(
    await page
      .getByRole("img", { name: "overshirt-front.png", exact: true })
      .count(),
    1,
  );
});

test("sending uses the selected angle, exposes its trace, and Stop cancels the pending reply", async () => {
  await visit();
  await page.getByRole("radio", { name: /^Problem–solution/ }).click();
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  await input.fill("Keep this message independent of the angle");
  await button("Send message").click();
  assert.equal(await button("Stop response").isVisible(), true);
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-label="Campaign conversation"]')
      ?.textContent.includes("Good call. I'll go with problem–solution"),
  );
  await page.getByText("Worked for 2s", { exact: true }).click();
  assert.equal(
    await page
      .getByText("Checking 412 orders of the Linen Overshirt", { exact: true })
      .isVisible(),
    true,
  );
  await input.fill("Cancel this one");
  await input.press("Enter");
  await button("Stop response").click();
  assert.equal(
    await input.evaluate((element) => element === document.activeElement),
    true,
  );
  await page.waitForTimeout(2150);
  assert.equal(
    await conversation()
      .getByText(/^Good call/)
      .count(),
    1,
  );
  assert.equal(
    await conversation().getByText("Cancel this one", { exact: true }).count(),
    1,
  );
});

test("controlled settings propose changes, while caller-owned generation and messages never fabricate results", async () => {
  await page.goto(`${base}/__campaign-controlled?brief`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("radio", { name: /^Social proof/ }).click();
  assert.equal(
    await page
      .getByRole("radio", { name: /^Problem–solution/ })
      .getAttribute("aria-checked"),
    "true",
  );
  assert.deepEqual(
    JSON.parse(await page.getByLabel("Pending change").innerText()),
    { angle: "Social proof" },
  );
  await button("Apply change").click();
  assert.equal(
    await page
      .getByRole("radio", { name: /^Social proof/ })
      .getAttribute("aria-checked"),
    "true",
  );
  await page.getByRole("switch", { name: "Facebook", exact: true }).click();
  assert.equal(
    await page
      .getByRole("switch", { name: "Facebook", exact: true })
      .isChecked(),
    false,
  );
  assert.deepEqual(
    JSON.parse(await page.getByLabel("Pending change").innerText()),
    { channels: { instagram: false, tiktok: true, facebook: true } },
  );
  await button("Apply change").click();
  assert.equal(
    await page
      .getByRole("switch", { name: "Facebook", exact: true })
      .isChecked(),
    true,
  );
  await tab("Activity").click();
  assert.equal(await tab("Brief").getAttribute("aria-selected"), "true");
  await button("Apply change").click();
  assert.equal(await tab("Activity").getAttribute("aria-selected"), "true");
  await page.goto(`${base}/__campaign-controlled`, {
    waitUntil: "networkidle",
  });
  await button("Generate ads").click();
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Caller-owned reply");
  await button("Send message").click();
  await page.waitForTimeout(2150);
  assert.deepEqual(JSON.parse(await page.getByLabel("Events").innerText()), [
    "generate",
    "Caller-owned reply",
  ]);
  assert.equal(await tab("Brief").getAttribute("aria-selected"), "true");
  assert.equal(await conversation().innerText(), "");
  assert.equal(await page.getByRole("figure").count(), 0);
});

test("new workspace tools retain notes when returning to the brief; rename can be cancelled", async () => {
  await visit();
  await button("New tab").click();
  await page.getByRole("button", { name: /^Notes/ }).click();
  await page
    .getByRole("textbox", { name: "Notes", exact: true })
    .fill("Review the summer assets");
  await tab("Summer launch").click();
  await tab("Notes").click();
  assert.equal(
    await page
      .getByRole("textbox", { name: "Notes", exact: true })
      .inputValue(),
    "Review the summer assets",
  );
  await button("Chat options").click();
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Chat name", exact: true })
    .fill("Discard this title");
  await page.keyboard.press("Escape");
  assert.equal(
    await page.getByText("Discard this title", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page.getByText("Generate on-brand creative", { exact: true }).count(),
    2,
  );
  await button("Chat options").click();
  await page.getByRole("menuitem", { name: "Pin chat", exact: true }).click();
  const pinned = page
    .getByRole("heading", { name: "Pinned", exact: true })
    .locator("..");
  assert.equal(
    await pinned
      .getByRole("button", { name: "Generate on-brand creative", exact: true })
      .count(),
    1,
  );
  await button("Chat options").click();
  await page.getByRole("menuitem", { name: "Unpin chat", exact: true }).click();
  assert.equal(
    await pinned
      .getByRole("button", { name: "Generate on-brand creative", exact: true })
      .count(),
    0,
  );
  await button("Chat options").click();
  await page.getByRole("menuitem", { name: "Rename", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Chat name", exact: true })
    .fill("June campaign");
  await page.keyboard.press("Enter");
  assert.equal(
    await page.getByText("June campaign", { exact: true }).count(),
    2,
  );
  await button("Chat options").click();
  await page
    .getByRole("menuitem", { name: "Delete chat", exact: true })
    .click();
  assert.equal(await conversation().innerText(), "");
  assert.equal(
    await page
      .getByRole("navigation", { name: "Conversations", exact: true })
      .getByText("June campaign", { exact: true })
      .count(),
    0,
  );
});

test("narrow drawers restore focus, tabs and radios support keyboard selection, and styles render independently", async () => {
  for (const style of ["clean", "classic"]) {
    await visit(`&style=${style}&theme=dark`);
    await tab("Brief").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await tab("Assets").getAttribute("aria-selected"), "true");
    assert.equal(
      await tab("Assets").evaluate(
        (element) => element === document.activeElement,
      ),
      true,
    );
    await page.keyboard.press("Home");
    await page.getByRole("radio", { name: /^Desire-driven/ }).focus();
    await page.keyboard.press("End");
    assert.equal(
      await page
        .getByRole("radio", { name: /^Social proof/ })
        .getAttribute("aria-checked"),
      "true",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await button("Open brief").click();
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("aria-label") === "Open brief",
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.setViewportSize({ width: 1440, height: 900 });
  }
});

test("Classic and Clean distributions render server-side without other component files", async () => {
  for (const suffix of ["", "-clean"]) {
    const module = await server.ssrLoadModule(
      `/screens/agent-chat${suffix}.tsx`,
    );
    const html = renderToString(createElement(module.AgentChatScreen));
    assert.match(html, /Campaign conversation/);
    assert.match(html, /Selling angle/);
    assert.match(html, /Summer launch/);
  }
});
