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
async function visit(extra = "") {
  await page.goto(`${base}/?screen=assistant-overview${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
}
const heat = () => page.getByRole("img", { name: /872 chats over the last 40 weeks/ });
const spoken = () => page.locator(".ui-ovcc__sr").textContent();
const navigation = () => page.getByLabel("Navigation", { exact: true }).textContent();

test("the overview matches the recorded 880px grid of four columns", async () => {
  await visit();
  const box = async (selector) => page.locator(selector).boundingBox();
  assert.equal((await box(".ui-ovcc__grid")).width, 880);
  assert.equal((await box(".ui-ovcc__card--activity")).width, 436);
  assert.equal((await box(".ui-ovcc__card--usage")).width, 214);
  assert.equal(Math.round((await box(".ui-ovcc__card--activity")).height), 140);
  assert.equal(await page.locator(".ui-ovcc__heat i[data-day]").count(), 280);
  assert.equal(await page.locator('.ui-ovcc__heat i[data-level="4"]').count(), 13);
  const meter = page.getByRole("meter", { name: "Credits used this month" });
  assert.equal(await meter.getAttribute("aria-valuetext"), "1,284 of 2,000 credits");
  assert.equal(await page.getByLabel("+12 on last month").textContent(), "+12");
  assert.equal(await page.getByLabel("−3 on last month").textContent(), "−3");
});

test("arrow keys walk the days by week and by day, Escape hides the tip", async () => {
  await visit();
  await heat().focus();
  assert.equal(await spoken(), "4 chats, Sat, Nov 7");
  await page.keyboard.press("ArrowLeft");
  assert.equal(await spoken(), "3 chats, Sat, Oct 31");
  await page.keyboard.press("ArrowUp");
  assert.equal(await spoken(), "2 chats, Fri, Oct 30");
  await page.keyboard.press("Home");
  assert.equal(await spoken(), "No chats, Sun, Feb 1");
  await page.keyboard.press("ArrowRight");
  assert.equal(await spoken(), "No chats, Sun, Feb 8");
  assert.equal(await page.locator(".ui-ovcc__tip").textContent(), "No chats · Sun, Feb 8");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".ui-ovcc__tip").count(), 0);
  assert.equal(await spoken(), "");
});

test("hovering a square shows its day above it and leaving hides it", async () => {
  await visit();
  const cell = page.locator('.ui-ovcc__heat i[data-day="200"]');
  await cell.hover();
  assert.equal(await page.locator(".ui-ovcc__tip").textContent(), "5 chats · Thu, Aug 20");
  assert.equal(await cell.getAttribute("data-on"), "");
  const tip = await page.locator(".ui-ovcc__tip").boundingBox(), square = await cell.boundingBox();
  assert.ok(tip.y + tip.height <= square.y, "tip sits above the square");
  await page.mouse.move(5, 5);
  assert.equal(await page.locator(".ui-ovcc__tip").count(), 0);
});

test("rows and “N more” navigate to Chat and Folders", async () => {
  await visit();
  await page.getByRole("button", { name: "6 more" }).click();
  assert.equal(await navigation(), "Chat");
  await page.getByRole("button", { name: /budget-by-channel/ }).click();
  assert.equal(await navigation(), "Folders");
});

test("the composer tray picks a folder and toggles apps", async () => {
  await visit();
  await page.getByRole("button", { name: "Work in a folder" }).click();
  await page.getByRole("menuitemradio", { name: "Hiring" }).click();
  assert.equal(await page.getByRole("menu").count(), 0);
  await page.locator(".ui-aovc__tray").getByRole("button", { name: "Hiring" }).click();
  assert.equal(await page.getByRole("menuitemradio", { name: "Hiring" }).getAttribute("aria-checked"), "true");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Connect apps/ }).click();
  const slack = page.getByRole("menuitemcheckbox", { name: "Slack" });
  assert.equal(await slack.getAttribute("aria-checked"), "false");
  await slack.click();
  assert.equal(await slack.getAttribute("aria-checked"), "true");
  await page.keyboard.press("Escape");
  await page.getByRole("textbox", { name: "Message" }).fill("Plan the Q4 launch");
  await page.keyboard.press("Enter");
  assert.equal(await navigation(), "Sent: Plan the Q4 launch");
});

test("narrow containers stack the cards into two columns and then one", async () => {
  await page.setViewportSize({ width: 600, height: 900 });
  await visit();
  const usage = await page.locator(".ui-ovcc__card--usage").boundingBox();
  const month = await page.locator(".ui-ovcc__card--month").boundingBox();
  const files = await page.locator(".ui-ovcc__card--files").boundingBox();
  assert.equal(usage.y, month.y, "usage and this month share a row");
  assert.ok(files.y > month.y + month.height - 1, "files move below this month");
  assert.equal(files.width, (await page.locator(".ui-ovcc__grid").boundingBox()).width);
  await page.setViewportSize({ width: 390, height: 844 });
  const activity = await page.locator(".ui-ovcc__card--activity").boundingBox();
  const recent = await page.locator(".ui-ovcc__card--recent").boundingBox();
  assert.equal(activity.width, recent.width);
  assert.ok(recent.y > activity.y + activity.height - 1);
});

test("the workspace menu opens under its button with icons and hover/arrow submenus", async () => {
  await visit();
  const trigger = page.locator(".ui-asc__nav-workspace");
  const triggerBox = await trigger.boundingBox();
  assert.ok(Math.abs(triggerBox.width - 94.55) < 1);
  assert.equal(triggerBox.height, 30);
  await trigger.hover();
  await page.mouse.down();
  assert.equal(await trigger.evaluate(el => getComputedStyle(el).transform), "none");
  await page.mouse.up();
  await page.keyboard.press("Escape");
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Acme" });
  await menu.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  const [anchor, box] = [await trigger.boundingBox(), await menu.boundingBox()];
  assert.equal(Math.round(box.x), Math.round(anchor.x));
  assert.equal(Math.round(box.y - anchor.y - anchor.height), 6);
  assert.equal(Math.round(box.width), 240);
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Invite people");
  assert.equal(await menu.locator(":scope > button svg").count(), 6);
  const learn = page.getByRole("menu", { name: "Learn more" });
  assert.equal(await learn.isVisible(), false);
  await page.getByRole("menuitem", { name: "Learn more" }).hover();
  assert.deepEqual(await learn.getByRole("menuitem").allTextContents(), ["Documentation", "Changelog", "Help & feedback"]);
  assert.ok((await learn.boundingBox()).x >= box.x + box.width);
  await page.getByRole("menuitem", { name: "Switch workspace" }).focus();
  await page.keyboard.press("ArrowRight");
  const acme = page.getByRole("menuitemradio", { name: /^Acme/ });
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "menuitemradio");
  assert.equal(await acme.evaluate(el => el === document.activeElement), true);
  assert.equal(await acme.getAttribute("aria-checked"), "true");
  assert.equal(await page.getByRole("menuitemradio", { name: /^Personal/ }).getAttribute("aria-checked"), "false");
  await page.keyboard.press("Escape");
  assert.equal(await menu.count(), 0);
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
});

test("the account menu opens above the user and keeps its parent while choosing language and theme", async () => {
  await visit();
  const trigger = page.getByRole("button", { name: /Alex Morgan/ });
  await trigger.click();
  const menu = page.getByRole("menu", { name: "Account", exact: true });
  await menu.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  const anchor = await trigger.boundingBox(), box = await menu.boundingBox();
  assert.equal(box.width, anchor.width);
  assert.equal(box.x, anchor.x);
  assert.equal(Math.round(anchor.y - box.y - box.height), 6);
  assert.match(await menu.textContent(), /alex@acme.com/);
  assert.equal(await menu.getByRole("menu", { name: "Language", exact: true }).isVisible(), false);
  const appearance = page.getByRole("menuitem", { name: "Appearance", exact: true });
  await appearance.hover();
  const themes = page.getByRole("menu", { name: "Appearance", exact: true });
  await themes.waitFor({ state: "visible" });
  assert.ok((await themes.boundingBox()).x >= box.x + box.width);
  await appearance.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "menuitemradio");
  assert.equal(await page.getByRole("menuitemradio", { name: "System", exact: true }).evaluate(el => el === document.activeElement), true);
  await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
  assert.equal(await page.locator(".ui-asc").getAttribute("data-theme"), "dark");
  assert.equal(await menu.count(), 0);
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  await trigger.click();
  await page.getByRole("menuitem", { name: "Language", exact: true }).hover();
  await page.getByRole("menuitemradio", { name: "Deutsch", exact: true }).click();
  assert.equal(await navigation(), "Language: Deutsch");
  await trigger.click();
  await page.getByRole("menuitem", { name: "Language", exact: true }).hover();
  assert.equal(await page.getByRole("menuitemradio", { name: "Deutsch", exact: true }).getAttribute("aria-checked"), "true");
  await page.keyboard.press("Escape");
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
});

test("sidebar collapse keeps an interactive 48px icon rail without squeezing its contents", async () => {
  await visit();
  await page.getByRole("button", { name: "Collapse sidebar", exact: true }).click();
  const intermediate = await page.locator(".ui-asc__app").evaluate(el => {
    const animation = el.getAnimations().find(a => a.transitionProperty === "grid-template-columns");
    if (animation) { animation.pause(); animation.currentTime = 100; }
    const side = document.querySelector(".ui-asc__side"), content = document.querySelector(".ui-asc__side-col");
    const result = { width: side.getBoundingClientRect().width, contentWidth: content.getBoundingClientRect().width, visible: getComputedStyle(side).visibility, inset: getComputedStyle(el).paddingLeft };
    animation?.finish();
    return result;
  });
  assert.ok(Math.abs(intermediate.width - 104.98) < 1, "100ms frame matches the original 420ms easing");
  assert.ok(intermediate.contentWidth >= 270);
  assert.equal(intermediate.visible, "visible");
  assert.equal(intermediate.inset, "0px");
  assert.equal((await page.locator(".ui-asc__main").boundingBox()).x, 48);
  assert.equal(await page.getByRole("button", { name: "Folders", exact: true }).isVisible(), true);
  await page.getByRole("button", { name: "Alex Morgan", exact: true }).click();
  assert.equal(await page.getByRole("menu", { name: "Account", exact: true }).isVisible(), true);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Expand sidebar", exact: true }).click();
  await page.locator(".ui-asc__app").evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
  assert.equal((await page.locator(".ui-asc__main").boundingBox()).x, 272);
});

test("command search groups, renumbers suggestions, jumps sections and navigates", async () => {
  await visit();
  const search = page.locator(".ui-asc__nav-search");
  await search.click();
  const input = page.getByRole("combobox", { name: "Search commands" });
  const dialog = page.getByRole("dialog", { name: "Search", exact: true });
  assert.deepEqual(await dialog.getByRole("group").evaluateAll(groups => groups.map(group => group.getAttribute("aria-label"))), ["Suggestions", "Share", "General", "Go to"]);
  const card = dialog.locator(".ui-asc__cmd-card");
  await card.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  assert.equal(Math.round((await card.boundingBox()).width), 600);
  const selected = () => dialog.locator('[role="option"][aria-selected="true"] .ui-asc__cmd-name').textContent();
  assert.equal(await selected(), "Write an email");
  await input.press("Tab");
  assert.equal(await selected(), "Post an update");
  await input.press("Shift+Tab");
  assert.equal(await selected(), "Write an email");
  await input.fill("me");
  assert.equal(await selected(), "Ask assistant about “me”");
  const meeting = dialog.getByRole("option", { name: /Schedule a meeting/ });
  assert.equal(await meeting.locator("kbd").last().textContent(), "1");
  await input.press("Escape");
  assert.equal(await input.inputValue(), "");
  assert.equal(await dialog.count(), 1);
  await input.fill("folders");
  await input.press("Tab");
  assert.equal(await selected(), "Folders");
  await input.press("Enter");
  assert.equal(await dialog.count(), 0);
  assert.equal(await page.locator('.ui-asc__nav-item[aria-current="page"]').textContent(), "Folders");
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  await page.keyboard.press("ControlOrMeta+k");
  await input.press("Escape");
  assert.equal(await dialog.count(), 0);
});
