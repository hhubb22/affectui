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
    plugins: [
      {
        name: "files-controlled-fixture",
        resolveId(id) {
          if (id === "virtual:files-controlled") return `\0${id}`;
        },
        load(id) {
          if (id !== "\0virtual:files-controlled") return;
          return `
          import { createElement as h, useState } from "react";
          import { createRoot } from "react-dom/client";
          import { FilesBrowser } from "/components/files-browser-clean.tsx";
          function Fixture() {
            const [folders, setFolders] = useState([{ id: "one", name: "Untitled folder", shared: true, fileCount: 1 }]);
            const [templates, setTemplates] = useState([]);
            const [pending, setPending] = useState(null);
            return h("div", null,
              h("button", { onClick: () => { if (pending?.folders) setFolders(pending.folders); if (pending?.templates) setTemplates(pending.templates); setPending(null); } }, "Apply change"),
              h("output", { "aria-label": "Pending change" }, JSON.stringify(pending)),
              h(FilesBrowser, { folders, templates, currentUser: "Taylor", onFoldersChange: folders => setPending({ folders }), onTemplatesChange: templates => setPending({ templates }) }));
          }
          createRoot(document.getElementById("root")).render(h(Fixture));`;
        },
        configureServer(server) {
          server.middlewares.use(
            "/__files-controlled",
            async (_request, response) => {
              response.setHeader("Content-Type", "text/html");
              response.end(
                await server.transformIndexHtml(
                  "/__files-controlled",
                  '<!doctype html><html><body><div id="root"></div><script type="module" src="/@id/__x00__virtual:files-controlled"></script></body></html>',
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
async function visit(extra = "") {
  await page.goto(`${base}/?screen=files${extra}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
}
const button = (name) => page.getByRole("button", { name, exact: true });
const tabs = (name) => page.getByRole("tablist", { name });
const folders = () =>
  page.locator('[class$="__folder-text"] > b').allTextContents();
const templates = () =>
  page.locator('[class$="__template-name"]').allTextContents();
const focused = (locator) =>
  locator.evaluate((el) => el === document.activeElement);

test("folder filters, search, order and list view are independent of templates", async () => {
  await visit();
  assert.deepEqual(await folders(), [
    "Brand assets",
    "Hiring",
    "Q3 Campaign",
    "Research",
  ]);
  assert.deepEqual(await templates(), [
    "Brand-Guidelines",
    "Campaign-Budget",
    "Design-Book",
    "Weekly-Report",
  ]);
  await tabs("Folders")
    .getByRole("tab", { name: "Shared", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search folders..." })
    .fill("  CAMPAIGN  ");
  assert.deepEqual(await folders(), ["Q3 Campaign"]);
  assert.equal(
    await page.getByRole("heading", { name: "Folders 1" }).count(),
    1,
  );
  await button("Clear folders search").click();
  await page
    .getByRole("button", { name: "Sorted A to Z – sort Z to A", exact: true })
    .first()
    .click();
  assert.deepEqual(await folders(), ["Q3 Campaign", "Brand assets"]);
  await page.getByRole("radio", { name: "List", exact: true }).click();
  const cards = page.locator('[class$="__folder-text"]').locator("..");
  assert.equal(
    (await cards.first().boundingBox()).width,
    (await cards.last().boundingBox()).width,
  );
  assert.ok(
    (await cards.last().boundingBox()).y >
      (await cards.first().boundingBox()).y,
  );
  assert.deepEqual(await templates(), [
    "Brand-Guidelines",
    "Campaign-Budget",
    "Design-Book",
    "Weekly-Report",
  ]);
  await page
    .getByRole("searchbox", { name: "Search folders..." })
    .fill("missing");
  assert.equal(
    await page.getByText("No folders found", { exact: true }).count(),
    1,
  );
});

test("template types form a union intersected with ownership and search, and chips can be removed", async () => {
  await visit();
  await tabs("File templates")
    .getByRole("tab", { name: "Shared with me", exact: true })
    .click();
  assert.deepEqual(await templates(), ["Brand-Guidelines", "Campaign-Budget"]);
  await button("Type").click();
  await page.getByRole("checkbox", { name: "Document", exact: true }).click();
  assert.deepEqual(await templates(), []);
  assert.equal(
    await page.getByText("No templates found", { exact: true }).count(),
    1,
  );
  await page.getByRole("checkbox", { name: "PDF", exact: true }).click();
  assert.deepEqual(await templates(), ["Brand-Guidelines"]);
  await page
    .getByRole("checkbox", { name: "Spreadsheet", exact: true })
    .click();
  assert.deepEqual(await templates(), ["Brand-Guidelines", "Campaign-Budget"]);
  await button("Remove PDF").click();
  assert.deepEqual(await templates(), ["Campaign-Budget"]);
  await page.keyboard.press("Escape");
  assert.ok(await focused(button("Type 2")));
  await tabs("File templates")
    .getByRole("tab", { name: "Mine", exact: true })
    .click();
  assert.deepEqual(await templates(), ["Design-Book", "Weekly-Report"]);
  await page
    .getByRole("searchbox", { name: "Search templates..." })
    .fill("  WEEKLY ");
  assert.deepEqual(await templates(), ["Weekly-Report"]);
  assert.equal(
    await page.getByRole("heading", { name: "File templates 1" }).count(),
    1,
  );
  assert.equal((await folders()).length, 4);
  await button("Type 2").click();
  await button("Clear all").click();
  assert.equal(await page.getByRole("checkbox", { checked: true }).count(), 0);
  await page.getByRole("heading", { name: "Files", exact: true }).click();
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(await button("Type").getAttribute("aria-expanded"), "false");
});

test("creating items uses unique names and resets only that section's filters", async () => {
  await visit();
  await tabs("Folders")
    .getByRole("tab", { name: "Shared", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search folders..." })
    .fill("brand");
  await tabs("File templates")
    .getByRole("tab", { name: "Shared with me", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Search templates..." })
    .fill("brand");
  await button("Type").click();
  await page.getByRole("checkbox", { name: "PDF", exact: true }).click();
  await page.keyboard.press("Escape");
  await button("Create folder").click();
  await button("Create folder").click();
  assert.deepEqual(await folders(), [
    "Brand assets",
    "Hiring",
    "Q3 Campaign",
    "Research",
    "Untitled folder",
    "Untitled folder 2",
  ]);
  assert.equal(
    await page
      .getByRole("searchbox", { name: "Search folders..." })
      .inputValue(),
    "",
  );
  assert.equal(
    await tabs("Folders")
      .getByRole("tab", { name: "All", exact: true })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.deepEqual(await templates(), ["Brand-Guidelines"]);
  await button("Add template").click();
  await button("Add template").click();
  assert.deepEqual(await templates(), [
    "Brand-Guidelines",
    "Campaign-Budget",
    "Design-Book",
    "Untitled",
    "Untitled 2",
    "Weekly-Report",
  ]);
  assert.equal(
    await page
      .getByRole("searchbox", { name: "Search templates..." })
      .inputValue(),
    "",
  );
  assert.equal(await button("Type").count(), 1);
  assert.match(
    await page.getByRole("button", { name: /^Untitled Document/ }).innerText(),
    /Document · Alex Morgan.*Private/s,
  );
  await page
    .getByRole("button", { name: /^Untitled folder 2 Private/ })
    .click();
  assert.equal(
    await page.getByLabel("Navigation", { exact: true }).textContent(),
    "Folder: Untitled folder 2",
  );
  await page.getByRole("button", { name: /^Untitled 2 Document/ }).click();
  assert.equal(
    await page.getByLabel("Navigation", { exact: true }).textContent(),
    "Template: Untitled 2",
  );
});

test("controlled arrays remain caller-owned until the caller applies an emitted change", async () => {
  await page.goto(`${base}/__files-controlled`, { waitUntil: "networkidle" });
  await button("Create folder").click();
  assert.deepEqual(await folders(), ["Untitled folder"]);
  const pending = () =>
    page.getByLabel("Pending change").textContent().then(JSON.parse);
  const change = await pending();
  assert.deepEqual(
    change.folders.map(({ name, shared, fileCount }) => ({
      name,
      shared,
      fileCount,
    })),
    [
      { name: "Untitled folder", shared: true, fileCount: 1 },
      { name: "Untitled folder 2", shared: false, fileCount: 0 },
    ],
  );
  assert.equal(new Set(change.folders.map((item) => item.id)).size, 2);
  await button("Apply change").click();
  assert.deepEqual(await folders(), ["Untitled folder", "Untitled folder 2"]);
  await button("Add template").click();
  assert.deepEqual(await templates(), []);
  const { templates: added } = await pending();
  assert.equal(added.length, 1);
  assert.deepEqual(
    { ...added[0], id: "opaque" },
    {
      id: "opaque",
      name: "Untitled",
      type: "Document",
      owner: "Taylor",
      shared: false,
      mine: true,
    },
  );
  await button("Apply change").click();
  assert.deepEqual(await templates(), ["Untitled"]);
});

test("keyboard navigation, focus restoration and sidebar news work independently", async () => {
  await visit();
  await tabs("Folders").getByRole("tab", { name: "All", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.deepEqual(await folders(), ["Brand assets", "Q3 Campaign"]);
  await page.keyboard.press("End");
  assert.deepEqual(await folders(), ["Hiring", "Research"]);
  assert.ok(
    await focused(
      tabs("Folders").getByRole("tab", { name: "Private", exact: true }),
    ),
  );
  await page.getByRole("radio", { name: "Grid", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("radio", { name: "List", exact: true })
      .getAttribute("aria-checked"),
    "true",
  );
  await button("Type").click();
  assert.ok(
    await focused(
      page.getByRole("checkbox", { name: "Document", exact: true }),
    ),
  );
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  assert.equal(
    await page
      .getByRole("checkbox", { name: "PDF", exact: true })
      .getAttribute("aria-checked"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.ok(await focused(button("Type 1")));
  const guide = page.getByRole("button", { name: /Getting started/ });
  await guide.click();
  await page.waitForFunction(
    () =>
      document.activeElement?.getAttribute("aria-label") ===
      "Close setup guide",
  );
  assert.ok(await focused(button("Close setup guide")));
  assert.equal(await button("Connect your first app").isDisabled(), true);
  await button("Make it yours").click();
  await button("Add a profile picture").click();
  assert.equal(
    await page.getByLabel("Navigation", { exact: true }).textContent(),
    "Add a profile picture",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => document.activeElement?.getAttribute("aria-expanded") === "false",
  );
  assert.ok(await focused(guide));
  await button("Dismiss").click();
  assert.equal(
    await page.getByText("Shared folders", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page.getByText("Scheduled chats", { exact: true }).count(),
    1,
  );
  await button("Dismiss").click();
  assert.equal(await button("Dismiss").count(), 0);
  assert.equal(await guide.isVisible(), true);
});

test("mobile filters fit the visible page, the drawer works, and reduced motion is respected", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit();
  await button("Type").click();
  const menu = await page.getByRole("dialog").boundingBox();
  assert.ok(menu.x >= 8 && menu.x + menu.width <= 382);
  assert.ok(menu.y >= 8 && menu.y + menu.height <= 836);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.keyboard.press("Escape");
  await button("Open sidebar").click();
  await button("Acme").click();
  assert.equal(
    await page.getByRole("menu", { name: "Acme", exact: true }).count(),
    1,
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  const timing = await page
    .locator(".ui-fbrc__rise")
    .first()
    .evaluate((el) => getComputedStyle(el).animationName);
  assert.equal(timing, "none");
});

test("both standalone styles render with custom data and no non-React imports", async () => {
  for (const suffix of ["", "-clean"]) {
    for (const [directory, file, name] of [
      ["components", "files-browser", "FilesBrowser"],
      ["screens", "files", "FilesScreen"],
    ]) {
      const path = `/${directory}/${file}${suffix}.tsx`,
        source = await fs.readFile(`.${path}`, "utf8");
      assert.deepEqual(
        [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
          (match) => match[1],
        ),
        ["react"],
      );
      const module = await server.ssrLoadModule(path);
      const props = { folders: [], templates: [] };
      const html = renderToString(
        createElement(
          module[name],
          directory === "screens"
            ? { browserProps: props, sidebarFooter: null }
            : props,
        ),
      );
      const text = html.replaceAll("<!-- -->", "");
      assert.match(text, /No folders found/);
      assert.match(text, /No templates found/);
      assert.doesNotMatch(html, /Shared folders/);
    }
  }
  await visit("&style=classic&theme=dark");
  await button("Type").click();
  await page.getByRole("checkbox", { name: "PDF", exact: true }).click();
  assert.deepEqual(await templates(), ["Brand-Guidelines"]);
  assert.equal(
    await page
      .locator(".ui-fbr")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--ui-fbr-strong").trim(),
      ),
    "#fff",
  );
});
