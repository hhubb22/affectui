// The same semantic actions drive the public reference and the local recreation.
// node ../anim-recorder/record.mjs <url> -s '<directory selector>' --script scripts/record-integrations.mjs -o <output>
export default async function recordIntegrations({ page, mark, wait }) {
  const button = (name) => page.getByRole("button", { name, exact: true });
  const search = page.getByRole("searchbox", {
    name: "Search integrations",
    exact: true,
  });
  await mark("default");
  await wait(400);
  await mark("connect");
  await button("Connect Notion").click();
  await wait(1400);
  await mark("connected");
  await page.getByRole("tab", { name: "Connected", exact: true }).click();
  await wait(500);
  await mark("available");
  await page.getByRole("tab", { name: "Available", exact: true }).click();
  await wait(500);
  await page.getByRole("tab", { name: "All", exact: true }).click();
  await wait(400);
  await mark("expand");
  await button("Stripe, Zapier and 2 more").click();
  await wait(600);
  await mark("search");
  await search.fill("google");
  await wait(500);
  await mark("empty");
  await search.fill("no-such-integration");
  await wait(400);
  await search.fill("");
  await mark("request");
  await button("Request").click();
  await wait(450);
  await page
    .getByRole("textbox", { name: "Tool name", exact: true })
    .fill("Pipedrive");
  await wait(300);
  // Do not submit a request to the public service while measuring its UI.
  await mark("dismiss");
  await page.keyboard.press("Escape");
  await wait(400);
}
