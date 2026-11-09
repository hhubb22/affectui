import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { chromium } from "playwright";

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
const tab = (name) => page.getByRole("tab", { name, exact: true });
const search = () =>
  page.getByRole("searchbox", { name: "Search integrations", exact: true });
const names = () =>
  page.locator('[class$="__name"] > span:first-child').allTextContents();
async function visit(query = "screen=integrations") {
  await page.goto(`${base}/?${query}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

for (const style of ["clean", "classic"])
  test(`${style}: connections, search and filters share one state`, async () => {
    await visit(`screen=integrations&style=${style}`);
    assert.equal((await names()).length, 15);
    await button("Connect Notion").click();
    assert.equal(
      await button("Connect Notion").getAttribute("aria-busy"),
      "true",
    );
    assert.ok(await button("Connect Notion").isDisabled());
    await button("Disconnect Notion").waitFor();
    await tab("Connected").click();
    assert.deepEqual(await names(), ["Slack", "Notion"]);
    await search().fill("  NOTION  ");
    assert.deepEqual(await names(), ["Notion"]);
    await button("Disconnect Notion").click();
    await page.getByText("No integrations found", { exact: true }).waitFor();
    await tab("Available").click();
    assert.deepEqual(await names(), ["Notion"]);
    await button("Clear").click();
    assert.ok(!(await names()).includes("Slack"));
    await search().fill("stripe");
    assert.deepEqual(
      await names(),
      ["Stripe"],
      "Searching also finds folded entries",
    );
    await search().fill("not-a-service");
    assert.equal(
      await page.getByText("No integrations found", { exact: true }).count(),
      1,
    );
    assert.equal((await names()).length, 0);
  });

test("category expansion is independent and keyboard tabs wrap with one focus stop", async () => {
  await visit();
  await button("Stripe, Zapier and 2 more").click();
  assert.equal((await names()).length, 19);
  assert.ok((await names()).includes("Jira"));
  await button("Mixpanel, Make and 1 more").click();
  assert.equal((await names()).length, 22);
  assert.ok((await names()).includes("Paddle"));
  await tab("All").focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await tab("Available").getAttribute("aria-selected"), "true");
  assert.ok(
    await tab("Available").evaluate((el) => el === document.activeElement),
  );
  await page.keyboard.press("Home");
  assert.equal(await tab("All").getAttribute("aria-selected"), "true");
  assert.equal(
    (await names()).length,
    22,
    "Expanded categories survive filter changes",
  );
  await page.keyboard.press("End");
  assert.equal(await tab("Available").getAttribute("tabindex"), "0");
  assert.equal(await tab("All").getAttribute("tabindex"), "-1");
});

test("two simultaneous demo connections do not overwrite each other", async () => {
  await visit("component=app-directory");
  await button("Connect Notion").click();
  await button("Connect Linear").click();
  await button("Disconnect Notion").waitFor();
  await button("Disconnect Linear").waitFor();
  await tab("Connected").click();
  assert.deepEqual(await names(), ["Slack", "Notion", "Linear"]);
});

test("controlled connections await caller state, and rejected actions retain their old state", async () => {
  await visit("component=controlled-integrations");
  await page.getByRole("checkbox", { name: "Fail actions" }).check();
  await button("Connect Notion").click();
  await page
    .getByRole("alert")
    .getByText("Connection failed. Please retry.", { exact: true })
    .waitFor();
  assert.equal(await button("Disconnect Notion").count(), 0);
  await page.getByRole("checkbox", { name: "Fail actions" }).uncheck();
  await button("Connect Notion").click();
  await page.waitForFunction(
    () =>
      document.querySelector('[aria-label="Pending connections"]')
        ?.textContent === '["slack","notion"]',
  );
  assert.equal(
    await button("Disconnect Notion").count(),
    0,
    "A completed callback does not override controlled props",
  );
  await button("Apply connections").click();
  await button("Disconnect Notion").waitFor();
  assert.equal(await page.getByRole("alert").count(), 0);
});

test("request form validates whitespace, restores focus, retains errors and retries", async () => {
  await visit("component=controlled-integrations");
  await button("Request").click();
  const field = page.getByRole("textbox", { name: "Tool name", exact: true });
  assert.ok(await field.evaluate((el) => el === document.activeElement));
  await field.fill("   ");
  assert.ok(await button("Send request").isDisabled());
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.ok(
    await button("Request").evaluate((el) => el === document.activeElement),
  );
  await page.getByRole("checkbox", { name: "Fail actions" }).check();
  await button("Request").click();
  await field.fill("  Pipedrive  ");
  await button("Send request").click();
  await page
    .getByRole("alert")
    .getByText("Request failed. Please retry.", { exact: true })
    .waitFor();
  assert.equal(await field.inputValue(), "  Pipedrive  ");
  await page.getByRole("checkbox", { name: "Fail actions" }).uncheck();
  await button("Request").click();
  await button("Send request").click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(
    await page.getByLabel("Requested tool").textContent(),
    "Pipedrive",
  );
  assert.ok(
    await button("Request").evaluate((el) => el === document.activeElement),
  );
});

test("sticky toolbar and narrow dark layouts keep controls inside the viewport", async () => {
  await visit();
  const bar = page.locator('[class$="__bar"]').filter({ has: tab("All") });
  await page.locator('[class$="__scroll"]').evaluate((el) => {
    el.scrollTop = 500;
  });
  assert.ok(
    (await bar.boundingBox()).y < 12,
    "Filters stick to the scrolling main area",
  );
  for (const style of ["clean", "classic"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(`screen=integrations&style=${style}&theme=dark`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await button("Request").click();
    const box = await page.getByRole("dialog").boundingBox();
    assert.ok(
      box.x >= 0 && box.x + box.width <= 390,
      "The request form fits the narrow viewport",
    );
    assert.equal(
      await page
        .getByRole("dialog")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const cards = page.locator('[class$="__grid"] > [class*="ui-icd"]');
    const first = await cards.nth(0).boundingBox(),
      second = await cards.nth(1).boundingBox();
    assert.equal(first.x, second.x, "Narrow layouts use a single column");
    assert.ok(second.y > first.y);
    assert.notEqual(
      await page
        .getByRole("dialog")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(255, 255, 255)",
    );
  }
});

test("the standalone row and request form work without the app shell", async () => {
  await visit("component=integration-card");
  await button("Connect Notion").click();
  assert.equal(await button("Disconnect Notion").count(), 1);
  await visit("component=integration-request&style=classic");
  await button("Request").click();
  await page.getByRole("textbox", { name: "Tool name" }).fill("New tool");
  await button("Send request").click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(
    await page.getByText("Requested: New tool", { exact: true }).count(),
    1,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await button("Request").click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const box = await page.getByRole("dialog").boundingBox();
  assert.ok(
    box.x >= 16 && box.x + box.width <= 374,
    "The standalone form avoids the viewport edge too",
  );
});
