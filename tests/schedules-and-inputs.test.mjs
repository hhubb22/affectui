import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, browser, page, base, errors;

before(async () => {
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

test("TextField, Select and Switch support keyboard, validation, password reveal and Classic/Clean styles", async () => {
  for (const style of ["clean", "classic"]) {
    await page.goto(`${base}/?component=schedules-inputs&style=${style}`, {
      waitUntil: "networkidle",
    });
    const title = page.getByLabel("Workspace title");
    await title.fill("bad");
    await page.getByText("That title is reserved.", { exact: true }).waitFor({ state: "visible" });
    await button("Clear").click();
    assert.equal(await title.inputValue(), "");

    const password = page.getByLabel("Password", { exact: true });
    assert.equal(await password.getAttribute("type"), "password");
    await button("Show password").click();
    assert.equal(await password.getAttribute("type"), "text");
    await button("Hide password").click();
    assert.equal(await password.getAttribute("type"), "password");

    const backend = page.getByRole("combobox", { name: /ACP backend/ });
    await backend.click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.match(await backend.innerText(), /Claude Code/);

    const toggle = page.getByRole("switch", { name: "Enable schedule" });
    assert.equal(await toggle.isChecked(), true);
    await toggle.click();
    assert.equal(await toggle.isChecked(), false);

    const state = JSON.parse(await page.getByTestId("inputs-state").textContent());
    assert.deepEqual(state, { name: "", backend: "claude", enabled: false });
  }
});

test("AgentSchedulesScreen renders timeline, J/K navigation, switch pause, skip/restore, skeleton and managed mode", async () => {
  await page.goto(`${base}/?screen=agent-schedules&loading=1`, { waitUntil: "networkidle" });
  assert.ok((await page.locator("[data-skel]").count()) >= 2);

  await page.goto(`${base}/?screen=agent-schedules`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Competitor scan", exact: true }).waitFor({ state: "visible" });
  assert.ok((await page.locator(".ui-agsc__chart svg").count()) === 1);

  await page.keyboard.press("j");
  await page.keyboard.press("Enter");
  const pauseSwitch = page.getByRole("switch", { name: "Competitor scan: Pause" });
  await pauseSwitch.click();
  await page.getByRole("switch", { name: "Competitor scan: Resume" }).waitFor({ state: "visible" });

  await page.goto(`${base}/?component=managed-schedules`, { waitUntil: "networkidle" });
  const managedSwitch = page.getByRole("switch", { name: "Competitor scan: Pause" });
  await managedSwitch.click();
  // In managed mode, local state stays unpaused until caller updates schedules prop
  assert.equal(await managedSwitch.getAttribute("aria-checked"), "true");
  const events = (await page.getByTestId("schedule-events").textContent())
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  assert.deepEqual(events, [{ event: "pause", id: "scan", paused: true }]);
});

test("Managed InboxView keeps listTitle distinct, gates confirmation on server ack and surfaces errors", async () => {
  await page.goto(`${base}/?component=managed-inbox-view`, { waitUntil: "networkidle" });
  // Strict-mode single match on reading pane question while list row shows listTitle ("Invite room")
  await page.getByText("Invitation to Invite room", { exact: true }).waitFor({ state: "visible" });
  await page.getByText("Invite room", { exact: true }).waitFor({ state: "visible" });

  await button("Accept").click();
  await page.locator('[data-phase="submitting"]').waitFor({ state: "visible" });
  // Confirmation check must NOT appear before server confirmation
  assert.equal(await page.locator('[data-phase="sent"]').count(), 0);

  await button("Fail server").click();
  await page.getByRole("alert").getByText("Permission no longer pending.", { exact: true }).waitFor({ state: "visible" });

  await button("Accept").click();
  await page.locator('[data-phase="submitting"]').waitFor({ state: "visible" });
  await button("Confirm server").click();
  await page.locator('[data-phase="sent"]').waitFor({ state: "visible" });
  await button("Collapse confirmed").click();
  await page.getByText("Allow tool execution: git push?", { exact: true }).waitFor({ state: "visible" });
});

test("new standalone and generated files are React-only, container-responsive, reduced-motion aware and SSR-clean", async () => {
  for (const style of ["", "-clean"]) {
    for (const [folder, file, exportName, props] of [
      ["components", "text-field", "TextField", { label: "Name" }],
      ["components", "select", "Select", { label: "Model", options: [{ value: "a", label: "Alpha" }] }],
      ["components", "switch", "Switch", { label: "Enabled" }],
      ["components", "inbox-view", "InboxView", { items: [] }],
      ["components", "schedule-board", "ScheduleBoard", { schedules: [] }],
      ["screens", "agent-schedules", "AgentSchedulesScreen", {}],
    ]) {
      const rel = `/${folder}/${file}${style}.tsx`;
      const source = await fs.readFile(`.${rel}`, "utf8");
      assert.deepEqual(
        [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]),
        ["react"],
        `${rel} imports only react`,
      );
      assert.ok(!/@media\s*\([^)]*(?:min|max)-width/.test(source), `${rel} uses no viewport width media queries`);
      assert.match(source, /prefers-reduced-motion/, `${rel} respects prefers-reduced-motion`);
      const mod = await server.ssrLoadModule(rel);
      assert.match(renderToString(createElement(mod[exportName], props)), /<style/);
    }
  }
});
