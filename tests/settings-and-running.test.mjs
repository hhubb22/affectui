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

test("RunningNow supports Classic/Clean styles, pause/resume, roving keyboard focus, step swap and row unmount focus recovery", async () => {
  for (const style of ["clean", "classic"]) {
    await page.goto(`${base}/?component=running-now&style=${style}`, { waitUntil: "networkidle" });
    await page.getByRole("dialog", { name: "Background tasks" }).waitFor({ state: "visible" });
    await page.getByText("Needs you", { exact: true }).waitFor({ state: "visible" });

    await button("Pause Ingest pipeline").click();
    await button("Resume Ingest pipeline").waitFor({ state: "visible" });
    await button("Resume Ingest pipeline").click();
    await button("Pause Ingest pipeline").waitFor({ state: "visible" });

    await button("Advance step").click();
    // Clicking an external control closes the popover on outside pointerdown; reopen via trigger
    await page.getByRole("button", { name: /Background tasks:/ }).click();
    await page.getByText("Embedding chunks", { exact: true }).waitFor({ state: "visible" });

    // Focus the Refund review row, then unmount it and verify focus falls back inside the dialog
    const refundMain = page.getByRole("button", { name: /Refund review – Needs you/ });
    await refundMain.focus();
    await page.evaluate(() => {
      const resolveBtn = [...document.querySelectorAll("button")].find((b) => b.textContent === "Resolve refund");
      resolveBtn?.click();
    });
    await refundMain.waitFor({ state: "detached" });

    // Escape closes popover and restores trigger focus
    await page.getByRole("button", { name: /Ingest pipeline – running/ }).focus();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog", { name: "Background tasks" }).isVisible(), false);
  }
});

test("Settings Profile, General and Members screens support loading skeletons, inline danger confirmation and managed member actions", async () => {
  await page.goto(`${base}/?screen=settings-profile&loading=1`, { waitUntil: "networkidle" });
  assert.ok((await page.locator("[data-skel]").count()) >= 3);

  await page.goto(`${base}/?screen=settings-profile`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Profile", exact: true }).waitFor({ state: "visible" });
  await page.getByRole("tab", { name: "Dark" }).click();
  await page.getByRole("status").getByText("Appearance set to Dark", { exact: true }).waitFor({ state: "visible" });

  await page.goto(`${base}/?screen=settings-general`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "General", exact: true }).waitFor({ state: "visible" });
  await button("Delete workspace").click();
  const deleteConfirmBtn = button("Delete for good");
  assert.equal(await deleteConfirmBtn.isDisabled(), true);
  await page.getByLabel(/Type Acme to confirm/).fill("Acme");
  assert.equal(await deleteConfirmBtn.isDisabled(), false);
  await deleteConfirmBtn.click();
  await page.getByRole("status").getByText("Acme deleted", { exact: true }).waitFor({ state: "visible" });

  await page.goto(`${base}/?screen=settings-members`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Members & teams", exact: true }).waitFor({ state: "visible" });
  await button("Invite members").click();
  await page.getByLabel("Email address").fill("newperson@acme.com");
  await button("Send invite").click();
  await page.getByText("newperson@acme.com", { exact: true }).waitFor({ state: "visible" });

  await page.goto(`${base}/?component=managed-members`, { waitUntil: "networkidle" });
  await button("Copy Pairing code").click();
  await page.getByRole("button", { name: "Copied", exact: true }).waitFor({ state: "visible" });
  await page.getByLabel("Invite by login name").fill("jordan");
  await button("Invite").click();
  await button("Cancel invite: Sam Lee").click();
  const events = (await page.getByTestId("settings-events").textContent())
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  assert.deepEqual(events, [
    { event: "copy", code: "PAIR-4829-ACME" },
    { event: "invite", target: "jordan", role: "member" },
    { event: "remove", id: "inv-sam" },
  ]);
});

test("RunningNow and Settings files are React-only, container-responsive, reduced-motion aware and SSR-clean", async () => {
  for (const style of ["", "-clean"]) {
    for (const [folder, file, exportName, props] of [
      ["components", "running-now", "RunningNow", { tasks: [] }],
      ["components", "settings-panel", "SettingsPage", { title: "Settings" }],
      ["screens", "settings-profile", "SettingsProfileScreen", {}],
      ["screens", "settings-general", "SettingsGeneralScreen", {}],
      ["screens", "settings-members", "SettingsMembersScreen", {}],
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
