import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, browser, page, base, errors;
const artifacts = "/tmp/affectui-inbox-replica";
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
const row = (id) => page.locator(`[data-inbox-row="${id}"]`);
const option = (id) => page.locator(`[data-inbox-option="${id}"]`);
const heading = () => page.locator("[data-inbox-view] h2");
const focused = (locator) =>
  locator.evaluate((el) => el === document.activeElement);
const events = async () => {
  const value = await page.getByTestId("inbox-events").textContent();
  return value ? value.split("\n").map(JSON.parse) : [];
};
async function visit(extra = "") {
  await page.goto(`${base}/?screen=inbox${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
}
async function next(question) {
  await page.waitForFunction(
    (text) =>
      document.querySelector("[data-inbox-view] h2")?.textContent === text,
    question,
  );
}
async function send() {
  await button("Send ↵").click();
}

test("Inbox matches the desktop columns, selected recommendation and task context", async () => {
  await visit();
  assert.equal(await row("queue").getAttribute("aria-selected"), "true");
  assert.equal((await page.locator(".ui-asc__side").boundingBox()).width, 272);
  assert.equal((await page.locator(".ui-iblc").boundingBox()).width, 320);
  assert.equal((await page.locator(".ui-asc__panel").boundingBox()).width, 410);
  assert.equal((await row("queue").boundingBox()).height, 56);
  assert.equal(await option("kafka").getAttribute("aria-checked"), "true");
  assert.equal(await page.locator(".ui-ibxc__steps li").count(), 4);
  assert.equal(
    await page
      .getByRole("tab", { name: "load-test-results.csv", exact: true })
      .count(),
    1,
  );
  await page.screenshot({ path: `${artifacts}/initial.png` });
});

test("options expand and support roving arrows, number keys and immediate Enter", async () => {
  await visit();
  await option("kafka").focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(await option("sqs").getAttribute("aria-checked"), "true");
  assert.ok(await focused(option("sqs")));
  assert.equal(
    await option("kafka")
      .locator('[aria-hidden="true"]')
      .last()
      .getAttribute("aria-hidden"),
    "true",
  );
  await page.keyboard.press("3");
  assert.ok(await focused(option("pg")));
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-phase="sent"]');
  assert.deepEqual(
    (await events()).filter((e) => e.event === "decide"),
    [{ event: "decide", id: "queue", answer: { option: "pg" } }],
  );
  await next("Which empty state for the dashboard?");
});

test("sending preserves option plus words, announces once, draws the check and focuses next", async () => {
  await visit();
  await option("sqs").click();
  await page
    .getByRole("textbox", { name: "Tell it something else" })
    .fill("Keep one day of replay.");
  await page
    .getByRole("textbox", { name: "Tell it something else" })
    .press("Enter");
  await page.waitForSelector('[data-phase="sent"]');
  assert.match(
    await page.locator(".ui-ibfc__sent").innerText(),
    /SQS – “Keep one day of replay.”/,
  );
  assert.equal(
    await page.locator(".ui-ibsc__sr").textContent(),
    "Sent. 4 left.",
  );
  assert.equal(await row("queue").count(), 1);
  const timing = await page.locator(".ui-ibfc__tick").evaluate((el) => ({
    duration: getComputedStyle(el).animationDuration,
    delay: getComputedStyle(el).animationDelay,
  }));
  assert.deepEqual(timing, { duration: "0.42s", delay: "0.16s" });
  await page.keyboard.press("Enter");
  await next("Which empty state for the dashboard?");
  assert.ok(await focused(heading()));
  assert.equal(await row("queue").count(), 0);
  assert.equal((await events()).filter((e) => e.event === "decide").length, 1);
  await page.getByRole("tab", { name: "Done", exact: true }).click();
  await row("queue").click();
  assert.match(await page.locator(".ui-ibvc__chosen").innerText(), /SQS/);
  assert.match(
    await page.locator(".ui-ibvc__words").innerText(),
    /Keep one day/,
  );
  await page.screenshot({ path: `${artifacts}/done-answer.png` });
});

test("Later moves to the end while preserving each item's draft", async () => {
  await visit();
  await option("sqs").click();
  await page
    .getByRole("textbox", { name: "Tell it something else" })
    .fill("Keep replay");
  await button("Later L").click();
  await next("Which empty state for the dashboard?");
  assert.equal(
    await page.locator(".ui-ibsc__toast").innerText(),
    "Moved to the end of the list",
  );
  assert.equal(
    await page
      .locator("[data-inbox-row]")
      .last()
      .getAttribute("data-inbox-row"),
    "queue",
  );
  assert.ok(await focused(heading()));
  await row("queue").click();
  assert.equal(await option("sqs").getAttribute("aria-checked"), "true");
  assert.equal(
    await page
      .getByRole("textbox", { name: "Tell it something else" })
      .inputValue(),
    "Keep replay",
  );
  assert.deepEqual(
    (await events()).filter((e) => e.event === "later"),
    [{ event: "later", id: "queue" }],
  );
});

test("the list has one Tab stop and arrows, Home/End and J/K select without stealing focus", async () => {
  await visit();
  assert.equal(await page.locator('[data-inbox-row][tabindex="0"]').count(), 1);
  await row("queue").focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(
    await heading().textContent(),
    "Which empty state for the dashboard?",
  );
  assert.ok(await focused(row("empty-state")));
  await page.keyboard.press("End");
  assert.ok(await focused(row("api")));
  await page.keyboard.press("k");
  assert.ok(await focused(row("tone")));
  await page.keyboard.press("Home");
  assert.ok(await focused(row("queue")));
  await page.keyboard.press("l");
  await next("Which empty state for the dashboard?");
  await page.keyboard.press("j");
  assert.ok(await focused(row("weekly")));
  await page.keyboard.press("r");
  assert.ok(
    await focused(
      page.getByRole("textbox", { name: "Tell it something else" }),
    ),
  );
  await page.keyboard.type("jk1");
  assert.equal(
    await heading().textContent(),
    "Send the weekly update to Northwind?",
  );
  await page.keyboard.press("Escape");
  assert.ok(await focused(heading()));
});

test("visual picks start empty and Enter chooses and sends the focused variant", async () => {
  await visit("&item=empty-state");
  assert.equal(
    await page.locator('[role="radio"][aria-checked="true"]').count(),
    0,
  );
  assert.ok(await button("Send ↵").isDisabled());
  await option("illustration").focus();
  await page.keyboard.press("ArrowRight");
  assert.ok(await focused(option("checklist")));
  await page.keyboard.press("Enter");
  await next("Send the weekly update to Northwind?");
  assert.deepEqual((await events()).find((e) => e.event === "decide").answer, {
    option: "checklist",
  });
});

test("approval supports approve, decline and a written answer", async () => {
  for (const [action, answer] of [
    ["Approve ↵", "approve"],
    ["Decline", "decline"],
    ["written", { text: "Send on Monday" }],
  ]) {
    await visit("&item=weekly");
    assert.equal(await page.locator(".ui-ibvc__facts>div").count(), 3);
    if (action === "written") {
      await page
        .getByRole("textbox", { name: "Tell it something else" })
        .fill("Send on Monday");
      await send();
    } else await button(action).click();
    await page.waitForSelector('[data-phase="sent"]');
    assert.deepEqual(
      (await events()).find((e) => e.event === "decide").answer,
      answer,
    );
  }
});

test("free answers support suggestions, multiline entry, IME and Escape", async () => {
  await visit("&item=tone");
  assert.ok(await button("Send ↵").isDisabled());
  await button("Warm, a little playful").click();
  const field = page.getByRole("textbox", { name: "Your answer", exact: true });
  assert.ok(await focused(field));
  assert.equal(await field.inputValue(), "Warm, a little playful");
  await field.press("Shift+Enter");
  await field.type("For our customers");
  assert.match(await field.inputValue(), /\n/);
  await field.dispatchEvent("keydown", {
    key: "Enter",
    isComposing: true,
    bubbles: true,
  });
  assert.equal((await events()).filter((e) => e.event === "decide").length, 0);
  await field.press("Enter");
  await next("Keep the old API until March or drop it now?");
  assert.match(
    (await events()).find((e) => e.event === "decide").answer.text,
    /For our customers/,
  );
});

test("Done has history and artifacts; Reopen moves it to Open and resets its answer", async () => {
  await visit("&item=model");
  assert.equal(
    await page
      .getByRole("tab", { name: "Done", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.match(await page.locator(".ui-ibvc__since").innerText(), /94% match/);
  await page
    .locator(".ui-ibvc__files")
    .getByRole("button", { name: "triage-eval.csv", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("tab", { name: "triage-eval.csv", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await button("Reopen").click();
  assert.equal(
    await page
      .getByRole("tab", { name: "Open", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.equal(
    await page
      .locator("[data-inbox-row]")
      .first()
      .getAttribute("data-inbox-row"),
    "model",
  );
  assert.equal(await option("small").getAttribute("aria-checked"), "false");
  assert.equal(await option("large").count(), 1);
  assert.ok(await button("Send ↵").isDisabled());
  assert.ok(await focused(heading()));
  await page.getByRole("tab", { name: "Done", exact: true }).click();
  await row("chart").click();
  await button("Reopen").click();
  assert.equal(await option("line").count(), 1);
  assert.equal(
    await option("bars").locator("svg").getAttribute("viewBox"),
    "0 0 120 80",
  );
  await option("line").click();
  assert.ok(!(await button("Send ↵").isDisabled()));
});

test("task context links related decisions and file tabs persist across questions", async () => {
  await visit();
  await button("ingest-design.md").click();
  const doc = page.getByRole("textbox", {
    name: "ingest-design.md, document",
    exact: true,
  });
  await doc.fill("Persistent Inbox notes");
  await row("empty-state").click();
  assert.equal(
    await page
      .getByRole("tab", { name: "ingest-design.md", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await page
    .getByRole("tab", { name: "Client dashboard", exact: true })
    .click();
  assert.match(
    await page.locator(".ui-ibxc__decided").innerText(),
    /Which chart/,
  );
  await page.locator(".ui-ibxc__decided button").click();
  assert.equal(
    await heading().textContent(),
    "Which chart for the usage page?",
  );
  await page
    .getByRole("tab", { name: "ingest-design.md", exact: true })
    .click();
  assert.equal(await doc.innerText(), "Persistent Inbox notes");
  assert.ok(
    (await events()).some(
      (e) => e.event === "change" && e.name === "ingest-design.md",
    ),
  );
});

test("closing task and panel is preserved on selection, and closing every tab restores task alone", async () => {
  await visit();
  await button("Close Ingest pipeline").click();
  await row("weekly").click();
  assert.equal(
    await page.getByRole("tab", { name: "Weekly update", exact: true }).count(),
    0,
  );
  await button("Close task").click();
  await row("tone").click();
  assert.ok(await button("Open task").isVisible());
  await button("Open task").click();
  assert.equal(
    await page.getByRole("tab", { name: "Launch post", exact: true }).count(),
    0,
  );
  await button("Close ingest-design.md").click();
  await button("Close load-test-results.csv").click();
  assert.ok(await button("Open task").isVisible());
  await button("Open task").click();
  assert.equal(await page.locator('.ui-awc__tabs [role="tab"]').count(), 1);
  assert.equal(
    await page
      .getByRole("tab", { name: "Launch post", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
});

test("folder opens retain their task after selection changes and New tab opens suggestions", async () => {
  await visit();
  await button("staging").click();
  await row("weekly").click();
  await page.locator('[data-folder-name="deploy.yaml"]').dblclick();
  assert.deepEqual(
    (await events()).filter((event) => event.event === "artifact").at(-1),
    { event: "artifact", task: "Ingest pipeline", name: "deploy.yaml" },
  );
  assert.equal(
    await page
      .getByRole("tab", { name: "deploy.yaml", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  await button("New tab").click();
  await page.getByRole("button", { name: /triage-eval.csv/ }).click();
  assert.equal(
    await page
      .getByRole("tab", { name: "triage-eval.csv", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
});

test("the queue reaches caught up with focus and routes View tasks through onNavigate", async () => {
  await visit();
  for (const id of ["queue", "empty-state", "weekly", "tone", "api"]) {
    await row(id).click();
    if (id === "empty-state") await option("sample").click();
    if (id === "tone") await button("Calm and factual").click();
    if (id === "api") await option("keep").click();
    if (id === "weekly") await button("Approve ↵").click();
    else await send();
    await page.waitForSelector('[data-phase="sent"]');
    await page.waitForSelector('[data-phase="sent"]', { state: "detached" });
  }
  const empty = page.getByRole("heading", {
    name: "You're all caught up",
    exact: true,
  });
  assert.ok(await empty.isVisible());
  assert.ok(await focused(empty));
  assert.equal(await page.locator("[data-inbox-row]").count(), 0);
  assert.equal(await page.locator(".ui-iblc h1").innerText(), "Inbox");
  assert.equal(await page.locator(".ui-ibxc__properties").count(), 0);
  await button("View tasks").click();
  assert.equal(
    await page.getByLabel("Navigation", { exact: true }).textContent(),
    "Tasks",
  );
  await page.screenshot({ path: `${artifacts}/empty.png` });
});

test("controlled items follow removals during confirmation and accept subsequent additions", async () => {
  await page.goto(`${base}/?component=controlled-inbox`, {
    waitUntil: "networkidle",
  });
  await send();
  await page.waitForSelector('[data-phase="sent"]');
  await button("Remove all items").click();
  await page.waitForSelector('[data-phase="sent"]', { state: "detached" });
  assert.ok(
    await page
      .getByRole("heading", { name: "You're all caught up", exact: true })
      .isVisible(),
  );
  assert.equal((await events()).filter((e) => e.event === "decide").length, 1);
  await button("Restore items").click();
  await row("empty-state").click();
  assert.equal(
    await heading().textContent(),
    "Which empty state for the dashboard?",
  );
});

test("phone selection, back, deep links and task drawer stay independent", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit();
  assert.ok(await row("queue").isVisible());
  assert.ok(!(await heading().isVisible()));
  await row("queue").click();
  assert.ok(await heading().isVisible());
  assert.ok(await button("Open task").isVisible());
  await button("Inbox").click();
  assert.ok(await row("queue").isVisible());
  await row("weekly").click();
  await button("Open task").click();
  await page.locator(".ui-ibxc__goal").waitFor({ state: "visible" });
  assert.ok(await page.locator(".ui-asc__main").evaluate((el) => el.inert));
  await page
    .getByRole("complementary", { name: "Task", exact: true })
    .getByRole("button", { name: "Close task", exact: true })
    .click();
  await heading().waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await row("weekly").waitFor({ state: "visible" });
  assert.ok(await row("weekly").isVisible());
  await visit("&item=chart");
  assert.ok(await heading().isVisible());
  assert.equal(
    await heading().textContent(),
    "Which chart for the usage page?",
  );
  assert.ok(!(await row("chart").isVisible()));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({ path: `${artifacts}/mobile.png` });
});

test("both styles, dark mode, flat shell and reduced motion work in independent previews", async () => {
  for (const style of ["clean", "classic"]) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await visit(`&style=${style}&theme=dark&layout=flat`);
    const prefix = style === "clean" ? "c" : "";
    assert.equal(
      await page
        .locator(`.ui-ibv${prefix}`)
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await send();
    await page.waitForSelector('[data-phase="sent"]');
    assert.equal(
      await page
        .locator(`.ui-ibf${prefix}__tick`)
        .evaluate((el) => getComputedStyle(el).strokeDashoffset),
      "0px",
    );
  }
  for (const name of [
    "inbox-options",
    "inbox-feedback",
    "inbox-list",
    "inbox-item-view",
    "inbox-task-context",
  ]) {
    await page.goto(`${base}/?component=${name}`, { waitUntil: "networkidle" });
    assert.ok((await page.locator("body").innerText()).length > 30);
  }
  await page.screenshot({ path: `${artifacts}/context.png` });
});

test("distribution files are standalone React-only modules and render on the server", async () => {
  for (const style of ["", "-clean"]) {
    for (const [folder, file, exportName, props] of [
      ["screens", "inbox", "InboxScreen", {}],
      ["components", "inbox-options", "InboxOptions", { options: [] }],
      ["components", "inbox-feedback", "InboxEmptyState", {}],
      ["components", "inbox-list", "InboxList", { items: [] }],
      [
        "components",
        "inbox-item-view",
        "InboxItemView",
        {
          item: {
            id: "one",
            kind: "question",
            task: "Task",
            at: 0,
            question: "Question?",
          },
        },
      ],
      ["components", "inbox-task-context", "InboxTaskContext", {}],
    ]) {
      const path = `/${folder}/${file}${style}.tsx`,
        source = await fs.readFile(`.${path}`, "utf8");
      assert.deepEqual(
        [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
          (match) => match[1],
        ),
        ["react"],
      );
      assert.ok(!/@media\s*\([^)]*(?:min|max)-width/.test(source));
      assert.match(source, /prefers-reduced-motion/);
      const module = await server.ssrLoadModule(path);
      assert.match(
        renderToString(createElement(module[exportName], props)),
        /<style/,
      );
    }
  }
});
