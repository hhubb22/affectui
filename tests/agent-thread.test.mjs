import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, browser, page, base;
let errors = [];
const artifacts = "/tmp/affectui-thread-replica";
before(async () => {
  await fs.mkdir(artifacts, { recursive: true });
  server = await createServer({
    server: { host: "127.0.0.1", port: 0 },
    logLevel: "error",
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
  page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
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
const input = () => page.getByRole("textbox", { name: "Message", exact: true });
async function visit(state = "decision", extra = "") {
  await page.goto(`${base}/?screen=agent-thread&state=${state}${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
}
async function fixture(component) {
  await page.goto(`${base}/?component=${component}`, {
    waitUntil: "networkidle",
  });
}
async function preset(state) {
  await page.getByRole("radio", { name: state, exact: true }).click();
}

test("decision screen shares one 680px column, no model picker, and a single navigation sidebar", async () => {
  await visit();
  const dock = await page.locator(".ui-ddc").boundingBox(),
    composer = await page.locator(".ui-ccc").boundingBox();
  assert.equal(dock.width, 680);
  assert.equal(dock.x, composer.x);
  assert.equal(composer.width, 680);
  assert.ok(
    dock.y + dock.height <= composer.y,
    "The dock occupies space above the composer",
  );
  assert.equal((await page.locator(".ui-asc__side").boundingBox()).width, 272);
  assert.equal(await button("Auto").count(), 0);
  assert.equal(
    await page
      .getByRole("navigation", { name: "Workspace", exact: true })
      .count(),
    1,
  );
  assert.equal(await page.getByRole("option").count(), 4);
  await page.screenshot({ path: `${artifacts}/decision.png` });
});

test("decision numbers, pager, free text, Later/Show and answered links stay in the thread", async () => {
  await visit();
  await button("Later").click();
  assert.equal(await button("Show").count(), 1);
  assert.equal(await page.getByRole("option").count(), 0);
  await button("Show").click();
  await page.getByRole("option").first().waitFor();
  assert.equal(
    await page
      .getByRole("option")
      .first()
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await button("Next decision").click();
  assert.match(
    await page.locator(".ui-ddc__question").innerText(),
    /Send the weekly update/,
  );
  await button("Previous decision").click();
  await page.keyboard.press("2");
  await page.locator('[data-answer="queue"]').waitFor();
  assert.equal(
    await page.locator('[data-answer="queue"] .ui-thc__bubble').innerText(),
    "SQS",
  );
  assert.equal(
    await input().evaluate((el) => el === document.activeElement),
    true,
  );
  assert.match(await page.locator(".ui-thc__summary").innerText(), /4/);
  await page
    .getByRole("textbox", { name: "Something else", exact: true })
    .fill("Hold the update until tomorrow");
  await page
    .getByRole("textbox", { name: "Something else", exact: true })
    .press("Enter");
  await page.locator('[data-answer="weekly"]').waitFor();
  assert.equal(await page.getByRole("option").count(), 0);
  await page
    .locator(".ui-thc__asked")
    .filter({ hasText: "Which queue" })
    .click();
  assert.equal(await page.locator('[data-answer="queue"]').count(), 1);
});

test("approval facts and pick wireframes support keyboard interaction", async () => {
  await visit();
  await button("Next decision").click();
  assert.match(await page.locator(".ui-ddc__facts").innerText(), /Dana Reyes/);
  await page.getByRole("option", { name: /Approve/ }).click();
  assert.equal(
    await page.locator('[data-answer="weekly"] .ui-thc__bubble').innerText(),
    "Approved",
  );
  await preset("Away summary");
  assert.equal(await page.locator(".ui-ddc__wire").count(), 3);
  await page.getByRole("option", { name: /Setup checklist/ }).focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page
      .locator('[data-answer="empty-state"] .ui-thc__bubble')
      .innerText(),
    "Setup checklist",
  );
});

test("task tabs replace the current task while keeping artifact tabs, and Decide focuses the dock", async () => {
  await visit();
  await page
    .locator(".ui-thc__file")
    .filter({ hasText: "ingest-design.md" })
    .first()
    .click();
  await page.getByRole("button", { name: /^Open Ingest pipeline/ }).click();
  assert.equal(
    await page
      .getByRole("tab", { name: "ingest-design.md", exact: true })
      .count(),
    1,
  );
  assert.equal(
    await page
      .getByRole("tab", { name: "Ingest pipeline", exact: true })
      .count(),
    1,
  );
  assert.equal(await page.locator(".ui-tdc__steps li").count(), 4);
  await page.locator(".ui-tdc__waiting").click();
  assert.equal(
    await page
      .getByRole("option")
      .first()
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: /^Open Client dashboard/ }).click();
  assert.equal(
    await page
      .getByRole("tab", { name: "Ingest pipeline", exact: true })
      .count(),
    0,
  );
  assert.equal(
    await page
      .getByRole("tab", { name: "Client dashboard", exact: true })
      .count(),
    1,
  );
  await button("Show in Tasks").click();
  assert.equal(await page.getByLabel("Navigation").innerText(), "Tasks");
  await page.screenshot({ path: `${artifacts}/task-details.png` });
});

test("offline messages are delivered once after reconnection, even if Stop is pressed", async () => {
  await fixture("controlled-thread");
  await input().fill("Queued task");
  await button("Send message").click();
  assert.match(
    await page.locator(".ui-thc__send-status").innerText(),
    /Waiting to send/,
  );
  assert.equal(await page.getByLabel("Runtime events").innerText(), "[]");
  await button("Retry now").click();
  await button("Stop").click();
  await page.waitForFunction(() =>
    document
      .querySelector('[aria-label="Runtime events"]')
      .textContent.includes("send:Queued task"),
  );
  await button("Disconnect").click();
  await button("Reconnect").click();
  await page.waitForTimeout(800);
  const events = JSON.parse(
    await page.getByLabel("Runtime events").innerText(),
  );
  assert.deepEqual(events, ["send:Queued task:"]);
});

test("browser connection feedback, saved dictation and queued-message restoration", async () => {
  await visit("offline");
  assert.equal(await button("Retry now").count(), 1);
  assert.match(
    await page.locator(".ui-upc").innerText(),
    /Saved – will transcribe/,
  );
  await button("Retry now").click();
  await page.waitForFunction(() =>
    document
      .querySelector('textarea[aria-label="Message"]')
      .value.includes("Dana"),
  );
  assert.equal(
    await page.locator('.ui-thc__user[data-status="queued"]').count(),
    0,
  );
  assert.equal(
    await page.locator('.ui-upc__file[data-state="waiting"]').count(),
    0,
  );
});

test("automatic reconnection keeps the 5, 10, 20 and 30 second backoff", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await fixture("connection-banner");
  for (const delay of [5, 10, 20, 30]) {
    await page.waitForFunction(
      (seconds) =>
        document.querySelector(".ui-cnc__timer")?.textContent ===
        `Retrying in ${seconds}s`,
      delay,
    );
    await page.clock.fastForward((delay - 1) * 1000);
    assert.equal(await button("Retry now").isEnabled(), true);
    await page.clock.fastForward(1000);
    await page.waitForFunction(
      () => document.querySelector(".ui-cnc button")?.disabled,
    );
    await page.clock.fastForward(1200);
  }
  await page.waitForFunction(
    () =>
      document.querySelector(".ui-cnc__timer")?.textContent ===
      "Retrying in 30s",
  );
});

test("uploads can fail, retry, cancel, and block only sending until they finish", async () => {
  await fixture("upload-thread");
  await page.locator('input[type="file"]').setInputFiles({
    name: "bad.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("a,b\n1,2"),
  });
  await button("Retry bad.csv").waitFor();
  await input().fill("Send this report");
  assert.equal(await button("Send message").isDisabled(), true);
  await button("Retry bad.csv").click();
  await page.waitForFunction(() =>
    document.querySelector('.ui-upc__file[data-state="done"]'),
  );
  assert.equal(await button("Send message").isEnabled(), true);
  await button("Send message").click();
  assert.deepEqual(
    JSON.parse(await page.getByLabel("Runtime events").innerText()),
    ["send:Send this report:bad.csv"],
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "cancel.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("demo"),
  });
  await button("Cancel upload cancel.pdf").click();
  assert.match(
    await page.getByLabel("Runtime events").innerText(),
    /cancel:cancel.pdf/,
  );
  assert.equal(await page.locator(".ui-upc__file").count(), 0);
});

test("an interrupted upload aborts its request and restarts after reconnecting", async () => {
  await fixture("upload-thread");
  await page.locator('input[type="file"]').setInputFiles({
    name: "resume.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("a,b\n1,2"),
  });
  await page.locator('.ui-upc__file[data-state="uploading"]').waitFor();
  await button("Disconnect").click();
  await page.locator('.ui-upc__file[data-state="paused"]').waitFor();
  assert.match(
    await page.getByLabel("Runtime events").innerText(),
    /cancel:resume.csv/,
  );
  await page.waitForTimeout(1000);
  assert.equal(
    await page.locator('.ui-upc__file[data-state="done"]').count(),
    0,
  );
  await button("Reconnect").click();
  await page.locator('.ui-upc__file[data-state="done"]').waitFor();
});

test("away summary opens completed tasks, marks the unread boundary, and retains decisions", async () => {
  await visit("away");
  assert.match(
    await page.locator(".ui-ayc__counts").innerText(),
    /3 done · 2 need you/,
  );
  await page
    .locator(".ui-ayc__row")
    .filter({ hasText: "Auth refactor" })
    .click();
  assert.equal(
    await page.getByRole("tab", { name: "Auth refactor", exact: true }).count(),
    1,
  );
  await button("Close artifacts").click();
  await button("Mark as read").click();
  assert.equal(await page.locator(".ui-ayc").count(), 0);
  assert.equal(await page.getByRole("option").count(), 3);
});

test("error retries recover the tool trace and failed outgoing message", async () => {
  await visit("error");
  assert.equal(await page.locator('.ui-tac[data-state="failed"]').count(), 1);
  await page
    .locator(".ui-thc__error")
    .getByRole("button", { name: "Retry", exact: true })
    .click();
  await page.waitForFunction(
    () => !document.querySelector('.ui-tac[data-state="failed"]'),
  );
  await page
    .locator('.ui-thc__user[data-status="failed"]')
    .getByRole("button", { name: "Retry", exact: true })
    .click();
  assert.equal(
    await page.locator('.ui-thc__user[data-status="failed"]').count(),
    0,
  );
});

test("dictation preview, scrolled state and End shortcut keep the composer separate", async () => {
  await visit("dictating");
  await button("Done").click();
  await page.waitForFunction(() =>
    document
      .querySelector('textarea[aria-label="Message"]')
      .value.includes("Dana"),
  );
  await preset("Scrolled up");
  await page.locator(".ui-thc__jump").waitFor();
  await page.locator(".ui-thc__scroll").click({ position: { x: 10, y: 10 } });
  await page.keyboard.press("End");
  await page.waitForFunction(() => !document.querySelector(".ui-thc__jump"));
  await page.keyboard.press("/");
  assert.equal(
    await input().evaluate((el) => el === document.activeElement),
    true,
  );
});

test("live tools finish separately, the answer streams, and a decision docks", async () => {
  await visit("live");
  await page.locator('.ui-tac[data-state="running"]').waitFor();
  await page.waitForFunction(
    () =>
      document.querySelectorAll(
        '.ui-tac[data-state="running"] .ui-tac__tool[data-status="done"]',
      ).length > 0,
    undefined,
    { timeout: 9000 },
  );
  await page.getByRole("option", { name: /Kafka/ }).waitFor({ timeout: 16000 });
  assert.equal(await button("Stop").count(), 0);
  assert.match(await page.locator(".ui-thc__asked").innerText(), /Which queue/);
});

test("collapsing the sidebar and narrow containers preserve focus, theme and reduced motion", async () => {
  await visit();
  await button("Collapse sidebar").click();
  await page.waitForTimeout(450);
  assert.equal(
    Math.round((await page.locator(".ui-asc__main").boundingBox()).x),
    8,
  );
  await button("Open sidebar").click();
  await page.waitForTimeout(450);
  await page.setViewportSize({ width: 768, height: 900 });
  await page.waitForTimeout(450);
  await button("Open sidebar").click();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), "");
  await page.keyboard.press("Escape");
  assert.equal(
    await button("Open sidebar").evaluate(
      (el) => el === document.activeElement,
    ),
    true,
  );
  await page.screenshot({ path: `${artifacts}/mobile.png` });
  await page.getByRole("button", { name: /^Open Ingest pipeline/ }).click();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), "");
  await page.locator(".ui-tdc__waiting").click();
  await page.waitForFunction(
    () => !document.querySelector(".ui-asc__main[inert]"),
  );
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("role") === "option",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit("decision", "&theme=dark");
  assert.equal(
    await page
      .locator(".ui-ddc__card")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(
    await page
      .locator(".ui-ddc__card")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(28, 28, 30)",
  );
  await page.screenshot({ path: `${artifacts}/dark.png` });
});

test("every new component works alone in both styles and the full screen renders on the server", async () => {
  for (const style of ["classic", "clean"])
    for (const component of [
      "thread-task-card",
      "decision-dock",
      "connection-banner",
      "away-summary",
      "thread-uploads",
      "task-details",
    ]) {
      await page.goto(`${base}/?component=${component}&style=${style}`, {
        waitUntil: "networkidle",
      });
    }
  for (const suffix of ["", "-clean"]) {
    const { AgentThreadScreen } = await server.ssrLoadModule(
      `/screens/agent-thread${suffix}.tsx`,
    );
    const html = renderToString(
      createElement(AgentThreadScreen, { simulate: "decision" }),
    );
    assert.match(html, /Which queue should the ingest service use/);
    assert.match(html, /Message composer/);
  }
});
