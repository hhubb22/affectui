import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, browser, page, base;
let errors = [];
const artifacts = "/tmp/affectui-tasks-replica";
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
const row = (title) =>
  page.getByRole("treeitem", { name: new RegExp(`^${title},`) });
const input = () =>
  page.getByRole("textbox", {
    name: "Describe what you want done",
    exact: true,
  });
async function visit(extra = "") {
  await page.goto(`${base}/?screen=agent-tasks${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
}
async function fixture(name) {
  await page.goto(`${base}/?component=${name}`, { waitUntil: "networkidle" });
}
const focused = (locator) =>
  locator.evaluate((el) => el === document.activeElement);

test("the overview matches the 272px sidebar, 410px inspector, project groups and 40px rows", async () => {
  await visit();
  assert.equal(await page.getByRole("treeitem").count(), 12);
  assert.equal((await page.locator(".ui-asc__side").boundingBox()).width, 272);
  assert.equal((await page.locator(".ui-asc__panel").boundingBox()).width, 410);
  assert.equal((await row("Ingest pipeline").boundingBox()).height, 40);
  assert.match(
    await page.locator(".ui-tinc__goal").innerText(),
    /Northwind's order events/,
  );
  assert.equal(await page.locator(".ui-tinc__steps li").count(), 4);
  assert.equal(
    await row("Weekly update").locator(".ui-tprc").getAttribute("data-tone"),
    "running",
  );
  await page.screenshot({ path: `${artifacts}/initial.png` });
});

test("tree arrows, Home/End and J/K move one focus stop without selecting until Enter", async () => {
  await visit();
  await row("Ingest pipeline").focus();
  await page.keyboard.press("j");
  assert.equal(await focused(row("Client dashboard")), true);
  assert.equal(
    await row("Ingest pipeline").getAttribute("aria-selected"),
    "true",
  );
  await page.keyboard.press("k");
  assert.equal(await focused(row("Ingest pipeline")), true);
  await page.keyboard.press("ArrowLeft");
  const northwind = page.getByRole("treeitem", {
    name: "Northwind, 4 tasks",
    exact: true,
  });
  assert.equal(await focused(northwind), true);
  await page.keyboard.press("ArrowLeft");
  assert.equal(await northwind.getAttribute("aria-expanded"), "false");
  assert.equal(await row("Ingest pipeline").count(), 0);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  assert.equal(await focused(row("Ingest pipeline")), true);
  await page.keyboard.press("End");
  assert.equal(await focused(row("Benchmark suite")), true);
  await page.keyboard.press("Home");
  assert.equal(await focused(northwind), true);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() =>
    document.activeElement?.hasAttribute("data-task-decide"),
  );
  assert.equal(await page.locator('.ui-tlsc__tree [tabindex="0"]').count(), 1);
});

test("Active/Done tabs retain the task context and completed tasks expose their history", async () => {
  await visit();
  await page.getByRole("tab", { name: "Active", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.getByRole("treeitem").count(), 7);
  assert.equal(
    await page
      .getByRole("tab", { name: "Ingest pipeline", exact: true })
      .count(),
    1,
  );
  await row("Usage page").click();
  assert.match(
    await page.locator(".ui-tinc__goal").innerText(),
    /one bar per day/,
  );
  assert.equal(
    await page.locator('.ui-tinc__steps [data-state="done"]').count(),
    3,
  );
  await page.getByRole("tab", { name: "Done", exact: true }).press("Home");
  assert.equal(await row("Ingest pipeline").count(), 1);
  await page.screenshot({ path: `${artifacts}/done-detail.png` });
});

test("C/N creation supports project menus, multiline drafts, repeated Enter and Escape focus restoration", async () => {
  await visit();
  await page.locator(".ui-tlsc__head h1").click();
  await page.keyboard.press("c");
  await input().waitFor();
  assert.equal(await focused(input()), true);
  await button("Project: Northwind").click();
  await page
    .getByRole("menuitemradio", { name: "Platform", exact: true })
    .click();
  await input().fill("Review staging\nCheck retry behavior");
  await input().press("Enter");
  await row("Review staging").waitFor();
  assert.match(
    await page.locator(".ui-tinc__goal").innerText(),
    /Check retry behavior/,
  );
  assert.equal(await input().inputValue(), "");
  assert.equal(await focused(input()), true);
  await input().fill("Second task");
  await input().press("Enter");
  await row("Second task").waitFor();
  assert.match(
    await page.locator(".ui-tlsc__head h1").innerText(),
    /Tasks\s*11/,
  );
  await input().press("Escape");
  assert.equal(await input().count(), 0);
  assert.equal(await focused(button("New task")), true);
  await page.keyboard.press("n");
  await input().fill("jknc stay in the draft");
  assert.equal(await input().inputValue(), "jknc stay in the draft");
  await page.screenshot({ path: `${artifacts}/create.png` });
});

test("a collapsed project unfolds when a new task arrives and announces its project", async () => {
  await visit();
  await page
    .getByRole("treeitem", { name: "Northwind, 4 tasks", exact: true })
    .click();
  await button("New task").click();
  await input().fill("Check the event replay");
  await input().press("Enter");
  await row("Check the event replay").waitFor();
  assert.equal(
    await page
      .getByRole("treeitem", { name: "Northwind, 5 tasks", exact: true })
      .getAttribute("aria-expanded"),
    "true",
  );
  assert.match(
    await page.locator(".ui-atsc__sr").innerText(),
    /Task created in Northwind/,
  );
});

test("Needs you, Decide and Show agents expose the correct navigation callbacks", async () => {
  await fixture("controlled-tasks");
  await row("Client dashboard").locator("[data-task-needs]").click();
  assert.match(
    await page.getByLabel("Task events").innerText(),
    /inbox:dashboard:empty-state/,
  );
  await button(
    "Decide in Inbox: Which queue should the ingest service use?",
  ).click();
  assert.match(
    await page.getByLabel("Task events").innerText(),
    /inbox:ingest:queue/,
  );
  await button("Show agents").click();
  assert.equal(
    await page.getByLabel("Navigation").innerText(),
    "Agent Orchestration",
  );
});

test("controlled task updates refresh the row, inbox count, inspector and Done list", async () => {
  await fixture("controlled-tasks");
  await button("Update task").click();
  assert.equal(await row("Updated ingest task").count(), 1);
  assert.equal(
    await page
      .getByRole("tab", { name: "Updated ingest task", exact: true })
      .count(),
    1,
  );
  assert.match(
    await page.locator(".ui-tinc__waiting").innerText(),
    /2 decisions/,
  );
  await button("Complete task").click();
  assert.equal(await row("Updated ingest task").count(), 0);
  await page.getByRole("tab", { name: "Done", exact: true }).click();
  assert.equal(await row("Updated ingest task").count(), 1);
  assert.equal(await page.locator(".ui-tinc__needs").count(), 0);
});

test("command search opens a current task and runs navigation exactly once", async () => {
  await visit();
  await page.keyboard.press("ControlOrMeta+k");
  await page
    .getByRole("combobox", { name: "Search commands", exact: true })
    .fill("Onboarding emails");
  await page.keyboard.press("Enter");
  await page
    .getByRole("tab", { name: "Onboarding emails", exact: true })
    .waitFor();
  assert.equal(await page.getByLabel("Navigation").count(), 0);
  await page.keyboard.press("ControlOrMeta+k");
  await page
    .getByRole("combobox", { name: "Search commands", exact: true })
    .fill("Memory");
  await page.keyboard.press("Enter");
  assert.equal(await page.getByLabel("Navigation").innerText(), "Memory");
});

test("task selection replaces one task tab while document edits and file tabs persist", async () => {
  await visit();
  await button("ingest-design.md").click();
  const editor = page.getByRole("textbox", {
    name: "ingest-design.md, document",
    exact: true,
  });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+End");
  await page.keyboard.type("\nReviewed by the team.");
  await row("Client dashboard").click();
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
  await page
    .getByRole("tab", { name: "ingest-design.md", exact: true })
    .click();
  assert.match(await editor.innerText(), /Reviewed by the team/);
  await page.screenshot({ path: `${artifacts}/document.png` });
});

test("artifact tabs support code edits, CSV cells, folders and images", async () => {
  await visit();
  await button("event-schema.json").click();
  const code = page.getByRole("textbox", {
    name: "event-schema.json, code",
    exact: true,
  });
  await code.fill('{"version": 2}');
  await page.getByRole("tab", { name: "Ingest pipeline", exact: true }).click();
  await button("load-test-results.csv").click();
  assert.equal(
    await page
      .getByRole("gridcell", { name: "A3: 20000", exact: true })
      .count(),
    1,
  );
  await page.getByRole("tab", { name: "Ingest pipeline", exact: true }).click();
  await button("staging").click();
  assert.equal(await page.getByRole("option").count(), 4);
  await page
    .getByRole("option", { name: "deploy.yaml, 1.3 KB", exact: true })
    .dblclick();
  assert.equal(
    await page.getByRole("tab", { name: "deploy.yaml", exact: true }).count(),
    1,
  );
  await page
    .getByRole("tab", { name: "event-schema.json", exact: true })
    .click();
  assert.equal(await code.inputValue(), '{"version": 2}');
  await row("Client dashboard").click();
  await button("usage-page.png").click();
  await page
    .getByRole("img", { name: "Northwind daily usage bar chart", exact: true })
    .waitFor();
  await button("Zoom in").click();
  assert.equal(await button("Fit image").innerText(), "125%");
  await page.screenshot({ path: `${artifacts}/image.png` });
});

test("folder search, sort, icon view, context menu and rename are usable with the keyboard", async () => {
  await visit();
  await button("staging").click();
  await page
    .getByRole("textbox", { name: "Search staging", exact: true })
    .fill("deploy");
  assert.equal(await page.getByRole("option").count(), 1);
  await page
    .getByRole("textbox", { name: "Search staging", exact: true })
    .fill("");
  await button("As icons").click();
  assert.equal(await button("As icons").getAttribute("aria-pressed"), "true");
  await button("As list").click();
  const file = page.getByRole("option", {
    name: "deploy.yaml, 1.3 KB",
    exact: true,
  });
  await file.focus();
  await page.keyboard.press("ControlOrMeta+a");
  assert.equal(await page.locator('.ui-afdc__items [tabindex="0"]').count(), 1);
  await file.click();
  await page.keyboard.press("Shift+F10");
  await page.getByRole("menuitem", { name: "Rename", exact: false }).click();
  await page
    .getByRole("textbox", { name: "File name", exact: true })
    .fill("deploy-staging.yaml");
  await page.keyboard.press("Enter");
  await page
    .getByRole("option", { name: "deploy-staging.yaml, 1.3 KB", exact: true })
    .waitFor();
  await page
    .getByRole("option", { name: "deploy-staging.yaml, 1.3 KB", exact: true })
    .dblclick();
  assert.match(
    await page
      .getByRole("textbox", { name: "deploy-staging.yaml, code", exact: true })
      .inputValue(),
    /northwind-ingest/,
  );
  await page.getByRole("tab", { name: "staging", exact: true }).click();
  await page
    .getByRole("option", { name: "deploy-staging.yaml, 1.3 KB", exact: true })
    .focus();
  await page.keyboard.press("Shift+F10");
  await page.getByRole("menuitem", { name: "Duplicate", exact: true }).click();
  await page
    .getByRole("option", {
      name: "deploy-staging.yaml copy, 1.3 KB",
      exact: true,
    })
    .dblclick();
  assert.match(
    await page
      .getByRole("textbox", {
        name: "deploy-staging.yaml copy, code",
        exact: true,
      })
      .inputValue(),
    /northwind-ingest/,
  );
  await page.getByRole("tab", { name: "staging", exact: true }).click();
  await button("Sort by").click();
  await page.getByRole("menuitemradio", { name: "Size", exact: true }).click();
  await page.screenshot({ path: `${artifacts}/folder.png` });
});

test("new tabs replace their start page with suggested artifacts or tools and retain notes", async () => {
  await visit();
  await button("New tab").click();
  await page
    .getByRole("textbox", { name: "Search or enter URL", exact: true })
    .waitFor();
  await page
    .getByRole("button", {
      name: "benchmarks.csv Benchmark suite",
      exact: true,
    })
    .click();
  assert.equal(
    await page.getByRole("tab", { name: "New tab", exact: true }).count(),
    0,
  );
  assert.equal(
    await page
      .getByRole("tab", { name: "benchmarks.csv", exact: true })
      .count(),
    1,
  );
  await button("New tab").click();
  await page.getByRole("button", { name: /^Notes/ }).click();
  await page
    .getByRole("textbox", { name: "Notes", exact: true })
    .fill("Keep the queue decision in the thread.");
  await page.getByRole("tab", { name: "Ingest pipeline", exact: true }).click();
  await page.getByRole("tab", { name: "Notes", exact: true }).click();
  assert.match(
    await page
      .getByRole("textbox", { name: "Notes", exact: true })
      .inputValue(),
    /queue decision/,
  );
  await button("New tab").click();
  await page.getByRole("button", { name: /^Terminal/ }).click();
  await page
    .getByRole("textbox", { name: "Terminal command", exact: true })
    .fill("echo staging ready");
  await page.keyboard.press("Enter");
  assert.match(await page.getByRole("log").innerText(), /staging ready/);
  await page.screenshot({ path: `${artifacts}/workspace-tools.png` });
});

test("Delete closes the last task tab and a row reopens its task panel", async () => {
  await visit();
  await page.getByRole("tab", { name: "Ingest pipeline", exact: true }).focus();
  await page.keyboard.press("Delete");
  await page.waitForFunction(
    () => !document.querySelector(".ui-asc[data-panel-open]"),
  );
  await row("Ingest pipeline").click();
  await page
    .getByRole("tab", { name: "Ingest pipeline", exact: true })
    .waitFor();
});

test("narrow containers start on the list and use separate focus-contained task and sidebar drawers", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), null);
  assert.equal((await row("Ingest pipeline").boundingBox()).height, 52);
  await row("Ingest pipeline").click();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), "");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), null);
  await button("New task").click();
  await input().fill("Phone task");
  await input().press("Escape");
  await button("Open sidebar").click();
  assert.equal(await page.locator(".ui-asc__main").getAttribute("inert"), "");
  await page.keyboard.press("Escape");
  await page.screenshot({ path: `${artifacts}/mobile.png` });
});

test("dark mode, Classic surfaces and reduced motion respect the component contracts", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit("&theme=dark");
  assert.equal(
    await page
      .locator(".ui-tlsc")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(28, 28, 30)",
  );
  await button("New task").click();
  assert.equal(
    await page
      .locator(".ui-tcrc")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.screenshot({ path: `${artifacts}/dark.png` });
  await visit("&style=classic");
  assert.equal(
    await page
      .locator(".ui-tls__new")
      .evaluate((el) => getComputedStyle(el).borderTopWidth),
    "1px",
  );
});

test("all new components work alone in either style and the screen renders on the server", async () => {
  for (const style of ["classic", "clean"])
    for (const component of [
      "task-progress-ring",
      "task-create",
      "task-list",
      "task-inspector",
      "artifact-folder",
      "artifact-image",
      "workspace-start",
    ]) {
      await page.goto(`${base}/?component=${component}&style=${style}`, {
        waitUntil: "networkidle",
      });
    }
  for (const suffix of ["", "-clean"]) {
    const { AgentTasksScreen } = await server.ssrLoadModule(
      `/screens/agent-tasks${suffix}.tsx`,
    );
    const html = renderToString(createElement(AgentTasksScreen));
    assert.match(html, /Ingest pipeline/);
    assert.match(html, /What happened so far/);
  }
});
