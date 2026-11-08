import { after, before, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
import { renderToString } from "react-dom/server";
import { createElement } from "react";

let server, browser, page, base;
let errors = [];
const artifacts = "/tmp/affectui-replica";
before(async () => {
  await fs.mkdir(artifacts, { recursive: true });
  server = await createServer({ server: { host: "127.0.0.1", port: 0 }, logLevel: "error" });
  await server.listen(); base = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch({ headless: true, args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] });
});
after(async () => { await browser?.close(); await server?.close(); });
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  page.setDefaultTimeout(6000);
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
});
afterEach(async () => { await page.close(); assert.deepEqual(errors, [], "No browser errors or React warnings"); });
async function visit(query = "") { await page.goto(`${base}/${query}`, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); }
const button = (name) => page.getByRole("button", { name, exact: true });

test("desktop layout, collapsed trace and viewport screenshot", async () => {
  await visit();
  const box = await page.locator(".ui-asc__rail").boundingBox(); assert.equal(box.width, 52);
  assert.equal((await page.locator(".ui-asc__side-col").boundingBox()).width, 272);
  assert.equal((await page.locator(".ui-asc__panel").boundingBox()).width, 455);
  assert.equal((await page.locator(".ui-ccc").boundingBox()).width, 680);
  const tools = button("Ran 3 tools · 3.1s"); assert.equal(await tools.getAttribute("aria-expanded"), "false");
  await page.screenshot({ path: `${artifacts}/desktop-clean.png` });
  await tools.click(); assert.equal(await tools.getAttribute("aria-expanded"), "true");
  assert.equal(await page.locator(".ui-tac").first().locator("li").count(), 3);
  await page.screenshot({ path: `${artifacts}/tools-expanded.png` });
});

test("project filtering, creation and sidebar rename/pin/archive", async () => {
  await visit(); await button("All projects").click();
  await page.getByRole("menuitemradio", { name: "Research", exact: true }).click();
  await page.locator(".ui-asc__chat-nav").getByRole("button", { name: /^Linen suppliers in Portugal/ }).waitFor();
  assert.equal(await page.locator(".ui-asc__chat-nav").getByRole("button", { name: /^Linen suppliers in Portugal/ }).count(), 1);
  assert.equal(await page.locator(".ui-asc__chat-nav").getByRole("button", { name: "Best fabric for a summer overshirt", exact: true }).count(), 0);
  await button("Research").first().click(); await page.getByRole("menuitemradio", { name: "All projects", exact: true }).click();
  await page.locator('.ui-asc__chat-row[data-active]').hover();
  await button("Options for Best fabric for a summer overshirt").click(); await page.getByRole("menuitem", { name: /Rename/ }).click();
  await page.getByLabel("Chat name", { exact: true }).fill("Fabric research"); await page.getByLabel("Chat name", { exact: true }).press("Enter");
  assert.equal(await button("Fabric research").count(), 1);
  await page.locator('.ui-asc__chat-row[data-active]').hover(); await button("Pin Fabric research").click();
  await page.locator('.ui-asc__chat-row[data-active]').hover();
  assert.equal(await button("Unpin Fabric research").count(), 1);
  await page.locator('.ui-asc__chat-row[data-active]').hover(); await button("Options for Fabric research").click(); await page.getByRole("menuitem", { name: /Archive/ }).click();
  assert.equal(await button("Fabric research").count(), 0);
  await button("All projects").click(); await page.getByRole("menuitem", { name: "New project", exact: true }).click(); await page.getByLabel("Project name", { exact: true }).fill("Q4 launch"); await button("Create project").click();
  assert.equal(await button("Q4 launch").count(), 2);
  await button("New chat").click(); assert.equal(await page.locator('.ui-asc__chat-link[aria-current="page"]').innerText(), "New chat");
});

test("command search filters commands, supports keyboard execution and restores focus", async () => {
  await visit(); await button("Search").click();
  const input = page.getByRole("combobox", { name: "Search commands" });
  await input.fill("suppliers"); assert.equal(await page.getByRole("option").count(), 1);
  await input.press("Enter"); assert.equal(await page.getByRole("dialog", { name: "Search", exact: true }).count(), 0);
  assert.equal(await page.locator('.ui-asc__chat-link[aria-current="page"]').innerText(), "Linen suppliers in Portugal");
  await button("Search").click(); await page.keyboard.press("Escape");
  assert.equal(await button("Search").evaluate(el => el === document.activeElement), true);
  await page.keyboard.press("Control+k"); assert.equal(await input.count(), 1); await page.keyboard.press("Escape");
});

test("composer menus, Enter/Shift+Enter, generation and stop", async () => {
  await visit(); await button("Request approval").click();
  await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
  assert.equal(await button("Approve for me").count(), 1);
  await button("Auto").click(); await page.getByRole("menuitemradio", { name: "Claude Opus", exact: true }).click();
  assert.equal(await button("Claude Opus").count(), 1);
  await button("Add").click(); await page.getByRole("menuitemcheckbox", { name: /Plan mode/ }).click();
  assert.equal(await page.locator(".ui-ccc__plan").innerText(), "Plan");
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  await input.fill("Compare the two fabrics."); await input.press("Shift+Enter");
  assert.match(await input.inputValue(), /\n$/); await input.press("Enter");
  await page.locator('.ui-thc__assistant[data-streaming]').waitFor(); await button("Stop").click();
  assert.equal(await button("Stop").count(), 0); assert.equal(await page.locator(".ui-thc__stopped").count(), 1);
  const stoppedText = await page.locator(".ui-thc__column").innerText(); await page.waitForTimeout(2100);
  assert.equal(await page.locator(".ui-thc__column").innerText(), stoppedText, "Cancelled timers cannot append another reply");
});

test("a new chat gets a title and keeps its own conversation", async () => {
  await visit(); await button("New chat").click();
  assert.equal(await page.locator(".ui-thc__empty").count(), 1);
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("Write a supplier brief"); await button("Send message").click();
  await page.locator('.ui-asc__chat-link[aria-current="page"]').filter({ hasText: "Write a supplier brief" }).waitFor();
  await button("Best fabric for a summer overshirt").click();
  assert.equal(await page.locator(".ui-thc__user").count(), 2);
  await button("Write a supplier brief").click();
  assert.equal(await page.locator(".ui-thc__user").count(), 1);
});

test("spreadsheet editing, keyboard navigation, formula bar, undo/redo and column sizing", async () => {
  await visit(); const a2 = page.getByRole("gridcell", { name: "A2: Linen", exact: true });
  await a2.click(); await a2.press("Enter"); await page.getByRole("textbox", { name: "Edit A2", exact: true }).fill("Flax"); await page.getByRole("textbox", { name: "Edit A2", exact: true }).press("Enter");
  assert.equal(await page.getByRole("gridcell", { name: "A2: Flax", exact: true }).count(), 1);
  await button("Undo").click(); assert.equal(await a2.count(), 1); await button("Redo").click();
  await page.getByRole("gridcell", { name: "A2: Flax", exact: true }).click();
  const formula = page.getByRole("textbox", { name: "Contents of A2", exact: true });
  await formula.fill("Linen revised"); await formula.press("Enter");
  assert.equal(await page.getByRole("gridcell", { name: "A2: Linen revised", exact: true }).count(), 1);
  await page.getByRole("textbox", { name: "Cell reference – type one to go there", exact: true }).fill("B3"); await page.getByRole("textbox", { name: "Cell reference – type one to go there", exact: true }).press("Enter");
  assert.equal(await page.getByRole("gridcell", { name: "B3: 160–180", exact: true }).getAttribute("aria-selected"), "true");
  const resize = button("Resize column A"); await resize.focus(); await resize.press("ArrowRight");
  assert.equal(await page.locator(".ui-awc__grid col").nth(1).evaluate(el => el.getBoundingClientRect().width), 138);
  await page.getByRole("gridcell", { name: "B6", exact: true }).click(); await page.keyboard.press("Enter"); await page.getByRole("textbox", { name: "Edit B6", exact: true }).fill("12"); await page.keyboard.press("Enter");
  await page.getByRole("gridcell", { name: "B6: 12", exact: true }).click(); await button(/General/).click(); await page.getByRole("menuitemradio", { name: "Currency", exact: true }).click();
  assert.equal(await page.getByRole("gridcell", { name: "B6: 12", exact: true }).innerText(), "€12.00");
  await button("Undo").click(); assert.equal(await page.getByRole("gridcell", { name: "B6: 12", exact: true }).innerText(), "12");
});

test("editable documents persist through tab switches; messages reopen a closed file panel", async () => {
  await visit(); await page.getByRole("tab", { name: "sources.md", exact: true }).click();
  const document = page.getByRole("textbox", { name: "sources.md, document", exact: true }); await document.fill("A revised supplier brief");
  await page.getByRole("tab", { name: "fabric-comparison.csv", exact: true }).click(); await page.getByRole("tab", { name: "sources.md", exact: true }).click();
  assert.equal(await document.innerText(), "A revised supplier brief");
  await document.focus(); await page.keyboard.press("Control+a"); await button("Bold").click();
  assert.ok(await document.locator("b,strong").count() > 0);
  await button("Close artifacts").click(); await page.locator(".ui-thc__file").filter({ hasText: "sources.md" }).click();
  assert.equal(await document.innerText(), "A revised supplier brief");
  await page.screenshot({ path: `${artifacts}/document.png` });
  await button("New tab").click(); await button("New document").click();
  assert.equal(await page.getByRole("textbox", { name: "Untitled 1.md, document", exact: true }).count(), 1);
});

test("resizing sidebars changes usable columns and works from the keyboard", async () => {
  await visit(); const separator = page.getByRole("separator", { name: "Resize sidebar", exact: true });
  const before = await page.locator(".ui-asc__main").boundingBox(); const box = await separator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, 500); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 50, 500, { steps: 5 }); await page.mouse.up();
  assert.equal((await page.locator(".ui-asc__main").boundingBox()).x, before.x + 50);
  await separator.focus(); await separator.press("ArrowLeft"); assert.equal(await separator.getAttribute("aria-valuenow"), "312");
  assert.equal(await page.evaluate(() => document.body.style.cursor), "");
});

test("container width triggers drawers, focus containment and Escape independently of viewport width", async () => {
  await visit(); await page.locator(".ui-asc").evaluate(el => { el.style.width = "768px"; });
  await page.waitForTimeout(450); await button("Open sidebar").click();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), "");
  assert.equal(await page.locator(".ui-asc__side").evaluate(el => el.contains(document.activeElement)), true);
  await page.waitForTimeout(420); await page.locator(".ui-asc").screenshot({ path: `${artifacts}/mobile-drawer.png` }); await page.keyboard.press("Escape");
  assert.equal(await button("Open sidebar").evaluate(el => el === document.activeElement), true);
  await button("Open artifacts").click(); assert.equal(await page.locator(".ui-asc__panel").getAttribute("inert"), null);
  await page.keyboard.press("Escape");
});

test("dark mode, classic surfaces, reduced motion and standalone components", async () => {
  await visit("?theme=dark");
  assert.equal(await page.locator(".ui-asc__main").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(28, 28, 30)");
  await page.screenshot({ path: `${artifacts}/desktop-dark.png` });
  await visit("?style=classic");
  assert.equal(await page.locator(".ui-cc").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(240, 240, 240)");
  await page.screenshot({ path: `${artifacts}/desktop-classic.png` });
  await page.emulateMedia({ reducedMotion: "reduce" }); await button("Request approval").click();
  assert.equal(await page.locator(".ui-cc__menu").evaluate(el => getComputedStyle(el).animationName), "none");
  for (const style of ["clean", "classic"]) for (const component of ["app-shell", "agent-thread", "chat-composer", "artifact-workspace", "command-menu", "tool-activity"]) await visit(`?style=${style}&component=${component}`);
});

test("both complete screen files render on the server without browser globals", async () => {
  for (const style of ["", "-clean"]) {
    const { AgentChatRailScreen } = await server.ssrLoadModule(`/screens/agent-chat-rail${style}.tsx`);
    const html = renderToString(createElement(AgentChatRailScreen)); assert.match(html, /Message composer/); assert.match(html, /Resize sidebar/);
  }
});

test("controlled composer state, attachment removal and callback payload", async () => {
  await visit("?component=controlled");
  const input = page.getByRole("textbox", { name: "Message", exact: true });
  assert.equal(await input.inputValue(), "Controlled draft");
  await button("Set external draft").click(); assert.equal(await input.inputValue(), "External update");
  await button("Toggle disabled").click(); assert.equal(await input.isDisabled(), true); await button("Toggle disabled").click();
  await page.locator('input[type="file"]').setInputFiles({ name: "brief.txt", mimeType: "text/plain", buffer: Buffer.from("A supplier brief") });
  assert.equal(await button("Remove brief.txt").count(), 1); await button("Remove brief.txt").click();
  await button("Auto").click(); await page.getByRole("menuitemradio", { name: "GPT-5", exact: true }).click();
  await button("Send message").click();
  const sent = JSON.parse(await page.getByLabel("Submitted message").innerText());
  assert.equal(sent.message, "External update"); assert.equal(sent.model, "gpt-5"); assert.equal(sent.approval, "request"); assert.deepEqual(sent.attachments, []);
  assert.equal(await input.inputValue(), "");
});

test("document HTML accepts formatting while excluding executable content", async () => {
  await visit("?component=untrusted-document");
  const document = page.getByRole("textbox", { name: "notes.md, document", exact: true });
  assert.equal(await document.locator("h1").innerText(), "Title"); assert.equal(await document.locator("script,img").count(), 0);
  assert.equal(await document.locator("a").getAttribute("href"), null); assert.equal(await page.evaluate(() => window.injected), undefined);
});

test("voice recording can be discarded or attached without a transcription service", async () => {
  await page.context().grantPermissions(["microphone"]);
  await visit("?component=controlled"); await button("Voice input").click(); await button("Discard recording").waitFor();
  await button("Discard recording").click(); assert.equal(await button("Remove Voice note.webm").count(), 0);
  await button("Voice input").click(); await button("Use recording").waitFor(); await page.waitForTimeout(200); await button("Use recording").click();
  await button("Remove Voice note.webm").waitFor(); assert.equal(await button("Voice input").count(), 1);
});
