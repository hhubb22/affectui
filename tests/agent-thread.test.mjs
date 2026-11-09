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

async function managedFixture(component, style) {
  await page.goto(`${base}/?component=managed-${component}&style=${style}`, {
    waitUntil: "networkidle",
  });
}
const runtimeEvents = async () =>
  JSON.parse(
    await page.getByRole("status", { name: "Runtime events" }).textContent(),
  );
const managedInput = () =>
  page.getByRole("textbox", { name: "消息", exact: true });

for (const style of ["classic", "clean"]) {
  test(`${style}: managed approval waits for external confirmation, recovers from failure and preserves all option IDs`, async () => {
    await managedFixture("thread", style);
    assert.equal(await page.getByRole("option").count(), 7);
    assert.equal(
      await page.getByRole("textbox", { name: "其他答案" }).count(),
      0,
    );
    await page.getByRole("option").nth(2).click();
    await page.waitForFunction(() =>
      document
        .querySelector('output[aria-label="Runtime events"]')
        .textContent.includes("answer:transport-complete"),
    );
    assert.equal(
      await page.locator("[data-message-id]").count(),
      4,
      "No optimistic answer message",
    );
    assert.equal(await page.locator('[data-status="submitting"]').count(), 1);
    assert.equal(
      await page
        .getByRole("group", { name: "允许哪一种操作？" })
        .getAttribute("aria-busy"),
      "true",
    );
    assert.equal(
      await page
        .getByRole("option")
        .evaluateAll((items) => items.every((item) => item.disabled)),
      true,
    );
    await page.keyboard.press("1");
    await page.keyboard.press("Enter");
    assert.equal(
      (await runtimeEvents()).filter((event) =>
        event.startsWith("answer:permission:"),
      ).length,
      1,
    );
    assert.equal(await page.locator('[data-answer="permission"]').count(), 0);
    assert.equal(
      await page.getByRole("log", { name: "对话" }).getAttribute("aria-busy"),
      "true",
    );
    await button("Fail answer").click();
    assert.equal(
      await page.getByRole("alert").textContent(),
      "服务失败，请重试",
    );
    assert.ok(
      await page
        .getByRole("group", { name: "允许哪一种操作？" })
        .getAttribute("aria-describedby"),
    );
    await page.getByRole("option").nth(6).click();
    assert.ok(
      (await runtimeEvents()).includes(
        'answer:permission:{"option":"policy:7"}',
      ),
    );
    await button("Confirm answer").click();
    assert.equal(await page.getByRole("option").count(), 0);
    assert.equal(
      await page
        .getByRole("group", { name: "允许哪一种操作？" })
        .getByRole("status")
        .textContent(),
      "策略 7",
    );
    assert.equal(
      await page.locator("[data-message-id]").count(),
      4,
      "Even confirmation does not invent a message",
    );
    assert.ok(
      (await runtimeEvents()).includes(
        'answer:permission:{"option":"deny:request"}',
      ),
    );
  });

  test(`${style}: managed dock guards disabled/expired, repeat/IME and supports keyboard access beyond nine options`, async () => {
    await managedFixture("dock", style);
    await button("Disable answer").click();
    await page.keyboard.press("2");
    assert.deepEqual(await runtimeEvents(), []);
    await button("Expire answer").click();
    assert.equal(await page.getByRole("option").count(), 0);
    assert.equal(
      await page.getByRole("group").getByRole("status").textContent(),
      "请求已过期",
    );
    await button("Await answer").click();
    await button("More options").click();
    assert.equal(await page.getByRole("option").count(), 10);
    await page.getByRole("option").first().focus();
    await page.keyboard.down("Enter");
    await page.keyboard.up("Enter");
    await button("Await answer").click();
    await page.getByRole("option").first().focus();
    await page.dispatchEvent('[role="option"]', "keydown", {
      key: "Enter",
      repeat: true,
    });
    await page.dispatchEvent('[role="option"]', "keydown", {
      key: "1",
      isComposing: true,
    });
    assert.equal(
      (await runtimeEvents()).filter((event) =>
        event.startsWith("answer:permission:"),
      ).length,
      1,
    );
    await page.keyboard.press("End");
    assert.equal(
      await page
        .getByRole("option")
        .last()
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("Enter");
    assert.ok(
      (await runtimeEvents()).includes('answer:permission:{"option":"ten"}'),
    );
    await button("Await answer").click();
    await page.getByRole("option").first().focus();
    await page.keyboard.press("9");
    assert.ok(
      (await runtimeEvents()).includes('answer:permission:{"option":"nine"}'),
    );
    await button("Await answer").click();
    await button("Allow custom answer").click();
    await page.getByRole("textbox", { name: "其他答案" }).fill("稍后处理");
    await page.getByRole("textbox", { name: "其他答案" }).press("Enter");
    assert.ok(
      (await runtimeEvents()).includes('answer:permission:{"text":"稍后处理"}'),
    );
    assert.equal(
      await page.getByRole("textbox", { name: "其他答案" }).inputValue(),
      "稍后处理",
    );
  });

  test(`${style}: managed send/stop/reconnect do not clear, queue, transcribe, upload or announce success`, async () => {
    await managedFixture("thread", style);
    await button("发送消息").click();
    await page.waitForFunction(() =>
      document
        .querySelector("output")
        .textContent.includes("send:transport-complete"),
    );
    assert.equal(await managedInput().inputValue(), "保留草稿");
    assert.equal(await button("移除 原生路径.csv").count(), 1);
    assert.equal(await page.locator("[data-message-id]").count(), 4);
    await button("Online").click();
    await page.evaluate(() => {
      window.dispatchEvent(new Event("offline"));
      window.dispatchEvent(new Event("online"));
    });
    await page.waitForTimeout(1400);
    assert.equal(
      (await runtimeEvents()).filter(
        (event) => event.startsWith("send:") && !event.includes("transport"),
      ).length,
      1,
    );
    assert.equal(
      (await runtimeEvents()).some((event) =>
        /unexpected|connection-write/.test(event),
      ),
      false,
    );
    assert.equal(await managedInput().inputValue(), "保留草稿");
    await button("Offline").click();
    await button("Retry now").click();
    assert.ok((await runtimeEvents()).includes("reconnect-intent"));
    assert.equal(await page.locator('[data-status="offline"]').count(), 1);
    await button("停止").click();
    assert.equal(await button("正在停止…").isDisabled(), true);
    await managedInput().focus();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    assert.equal(
      (await runtimeEvents()).filter((event) => event === "stop-intent").length,
      1,
    );
    assert.equal(await page.getByText("已停止", { exact: true }).count(), 0);
    assert.equal(await page.getByRole("log").getAttribute("aria-busy"), "true");
    await button("Confirm stop").click();
    assert.equal(await page.getByText("已停止", { exact: true }).count(), 1);
    assert.equal(
      await page.getByRole("log").getAttribute("aria-busy"),
      "false",
    );
    await button("Confirm send").click();
    assert.equal(await managedInput().inputValue(), "");
    assert.equal(await page.locator("[data-message-id]").count(), 5);
    assert.equal(await button("移除 原生路径.csv").count(), 0);
  });

  test(`${style}: one content hook replaces the entire body, supports null, time labels and streaming follow`, async () => {
    await managedFixture("thread", style);
    const rich = page.locator('[data-message-id="rich"]');
    assert.equal(
      await rich.getByRole("heading", { name: "中文报告" }).count(),
      1,
    );
    assert.equal(await rich.locator("table").count(), 1);
    assert.equal(await rich.locator("code").textContent(), "const answer = 42");
    assert.equal(await rich.getByRole("math").textContent(), "x² + y²");
    assert.equal(
      await page
        .getByText("Default body must be replaced", { exact: true })
        .count(),
      0,
    );
    assert.equal(
      await page
        .getByText("Hidden body must not render", { exact: true })
        .count(),
      0,
    );
    assert.equal(await page.locator('[data-message-id="hidden"]').count(), 1);
    assert.equal(
      await page.getByText("保留默认正文", { exact: true }).count(),
      1,
    );
    assert.equal(await rich.locator("time").textContent(), "本地时间 2000");
    assert.equal(
      await page
        .getByText("从 本地时间 1000 起的新内容", { exact: true })
        .count(),
      1,
    );
    // Clear the caller-owned unread boundary before checking normal pinned scrolling.
    await page.getByRole("button", { name: "Mark as read" }).click();
    await managedInput().press("End");
    await rich.evaluate((el) => {
      const scroll = el.closest('[role="log"]').parentElement;
      scroll.scrollTop = scroll.scrollHeight;
      scroll.dispatchEvent(new Event("scroll"));
    });
    await button("Grow message").click();
    await page.waitForFunction(() => {
      const viewport = document.querySelector('[role="log"]').parentElement;
      return (
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop < 2
      );
    });
    assert.equal(await rich.locator("article").count(), 1);
    assert.match(await rich.textContent(), /流式增长/);
    await button("Failed message").click();
    await page
      .locator('[data-message-id="user"]')
      .getByRole("button", { name: "Retry" })
      .click();
    assert.ok((await runtimeEvents()).includes("retry:user"));
    assert.equal(
      await page
        .locator('[data-message-id="user"] [data-status="failed"]')
        .count(),
      1,
    );
  });

  test(`${style}: composer slots/ref/events obey external keyboard handling and preserve managed attachments`, async () => {
    await managedFixture("composer", style);
    await button("Focus input").click();
    assert.equal(
      await managedInput().evaluate((el) => document.activeElement === el),
      true,
    );
    await button("Callback ref").click();
    await button("Focus input").click();
    assert.equal(
      await managedInput().evaluate((el) => document.activeElement === el),
      true,
    );
    await managedInput().fill("/help");
    assert.equal(await page.getByRole("listbox", { name: "命令" }).count(), 1);
    await button("移除 原生路径.csv").click({ trial: true });
    await managedInput().press("Enter");
    assert.equal(await managedInput().inputValue(), "已选择命令");
    assert.deepEqual(await runtimeEvents(), ["slash-selected"]);
    await managedInput().press("Shift+Enter");
    assert.match(await managedInput().inputValue(), /\n/);
    await page.dispatchEvent("textarea", "keydown", {
      key: "Enter",
      isComposing: true,
    });
    await page.dispatchEvent("textarea", "keydown", {
      key: "Enter",
      repeat: true,
    });
    assert.deepEqual(await runtimeEvents(), ["slash-selected"]);
    await page.dispatchEvent("textarea", "paste");
    await page.dispatchEvent("textarea", "drop");
    assert.deepEqual(await runtimeEvents(), [
      "slash-selected",
      "paste",
      "drop",
    ]);
    await button("Toggle disabled").click();
    assert.equal(
      await managedInput().isDisabled(),
      true,
      "textareaProps.disabled=false cannot enable a disabled composer",
    );
    await button("Toggle disabled").click();
    await button("Toggle readonly").click();
    assert.equal(await managedInput().getAttribute("readonly"), "");
    assert.equal(await button("发送消息").isDisabled(), true);
    await button("Toggle readonly").click();
    await button("Custom toolbar").click();
    assert.equal(await button("语音输入").count(), 0);
    assert.equal(await button("发送消息").count(), 0);
    assert.equal(await page.locator('input[type="file"]').count(), 0);
    await managedInput().fill("not sent by Enter");
    await managedInput().press("Enter");
    assert.equal(
      (await runtimeEvents()).some((event) => event.startsWith("send:")),
      false,
    );
    await button("自定义发送").click();
    assert.ok((await runtimeEvents()).includes("custom-send"));
    await button("Hide toolbar").click();
    assert.equal(await button("自定义发送").count(), 0);
    await button("Default toolbar").click();
    await managedInput().fill("");
    assert.equal(
      await button("发送消息").isEnabled(),
      true,
      "Native path without size/File supports attachment-only sending",
    );
    await button("发送消息").click();
    assert.ok((await runtimeEvents()).includes("send::/native/report.csv"));
    assert.equal(await button("移除 原生路径.csv").count(), 1);
    await button("Fail send").click();
    await button("移除 原生路径.csv").click();
    assert.equal(await button("发送消息").isDisabled(), true);
  });

  test(`${style}: shell slots retain layout/resizing, drawer focus and Escape; screen APIs do not leak to DOM`, async () => {
    await managedFixture("shell", style);
    const bounds = await page.evaluate(() => {
      const find = (selector) =>
        document.querySelector(selector).getBoundingClientRect().toJSON();
      return {
        header: find('[class$="__header"]'),
        main: find("main"),
        panel: find('[aria-label="Artifacts"]'),
      };
    });
    assert.ok(bounds.header.bottom <= bounds.main.top + 1);
    assert.ok(bounds.header.bottom <= bounds.panel.top + 1);
    assert.ok(Math.abs(bounds.header.right - bounds.panel.right) < 2);
    const separator = page.getByRole("separator", { name: "调整侧栏宽度" });
    await separator.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await separator.getAttribute("aria-valuenow"), "282");
    await button("Toggle sidebar").click();
    assert.equal(
      await page
        .getByRole("complementary", { name: "应用侧栏", includeHidden: true })
        .getAttribute("inert"),
      "",
    );
    await button("打开侧栏").click();
    await page.setViewportSize({ width: 390, height: 900 });
    await button("打开侧栏").click();
    await page.waitForFunction(
      () => document.activeElement?.textContent === "会话历史",
    );
    await page.keyboard.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() => document.activeElement.textContent),
      "最后一项",
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await button("打开侧栏").evaluate((el) => el === document.activeElement),
      true,
    );
    await page.setViewportSize({ width: 1600, height: 1000 });
    await button("Empty slots").click();
    assert.equal(
      await page.getByRole("navigation", { name: "应用导航" }).count(),
      0,
    );
    assert.equal(
      await page.getByText("调用方标题栏", { exact: true }).count(),
      0,
    );
    assert.equal(
      await page.getByText("All projects", { exact: true }).count(),
      0,
      "null does not fall back to preview sidebar",
    );
    for (const component of ["screen", "rail"]) {
      await managedFixture(component, style);
      assert.equal(
        await page.getByRole("heading", { name: "中文报告" }).count(),
        1,
      );
      assert.equal(await page.getByRole("log", { name: "对话" }).count(), 1);
      assert.equal(await page.locator("time").textContent(), "本地时间 2000");
      assert.equal(
        await managedInput().getAttribute("placeholder"),
        "输入消息，或 / 选择命令",
      );
      assert.equal(
        await page
          .locator(
            "[managed],[stopping],[threadlabels],[formattime],[rendermessagecontent],[sidebar],[header],[labels]",
          )
          .count(),
        0,
      );
      await button("发送消息").click();
      assert.equal(await managedInput().inputValue(), "保留草稿");
      assert.equal(await page.locator("[data-message-id]").count(), 4);
    }
    await managedFixture("empty", style);
    assert.equal(await page.locator("[data-message-id]").count(), 0);
    assert.equal(await page.getByRole("option").count(), 0);
  });
}
