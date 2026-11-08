import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Preview-only Inter fonts, licensed under the SIL Open Font License. Components do not load fonts.
const directory = fileURLToPath(new URL("../examples/fonts/", import.meta.url));
const assets = [
  ["inter-400.woff2", "https://www.affectui.com/assets/inter-latin-400-normal-C38fXH4l.woff2"],
  ["inter-500.woff2", "https://www.affectui.com/assets/inter-latin-500-normal-Cerq10X2.woff2"],
  ["inter-600.woff2", "https://www.affectui.com/assets/inter-latin-600-normal-LgqL8muc.woff2"],
  ["OFL.txt", "https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt"],
];
await fs.mkdir(directory, { recursive: true });
for (const [name, url] of assets) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await fs.writeFile(path.join(directory, name), new Uint8Array(await response.arrayBuffer()));
  console.log(name);
}
