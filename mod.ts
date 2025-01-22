import { argv, exit } from "node:process";

const packageName = argv[2] ?? "";
const [scope, name] = packageName.replace("@", "").split("/");

if (!scope || !name) {
  console.error("Invalid package name (e.g. @inbestigator/saves)");
  exit(1);
}

fetchDownloads(scope, name);

async function fetchDownloads(scope: string, name: string) {
  const response = await fetch(
    `https://api.jsr.io/scopes/${scope}/packages/${name}/downloads`,
  );

  if (!response.ok) {
    console.error("Failed to fetch package");
    exit(1);
  }

  const total = (await response.json()).total.map((d: { count: number }) =>
    d.count
  ).reduce(
    (a: number, b: number) => a + b,
    0,
  );

  console.log(
    `The package \x1b[32m@${scope}/${name}\x1b[0m has been downloaded`,
    total,
    `time${total !== 1 ? "s" : ""}`,
  );
}
