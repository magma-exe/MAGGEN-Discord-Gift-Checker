// Discord Gift Bulk Checker (File-based)

// Node.js v18+

import fs from "fs";

import path from "path";

import chalk from "chalk";

const INPUT_FILE = "./gifts.txt";

const OUTPUT_DIR = "./results";

const VALID_FILE = path.join(OUTPUT_DIR, "valid.txt");

const INVALID_FILE = path.join(OUTPUT_DIR, "invalid.txt");

const API = "https://discord.com/api/v9/entitlements/gift-codes";

// ─────────────────────────────────────────────

// 🌈 GRADIENT BANNER

// ─────────────────────────────────────────────

const banner = `

 ███╗   ███╗ █████╗  ██████╗  ██████╗ ███████╗███╗   ██╗
 ████╗ ████║██╔══██╗██╔════╝ ██╔════╝ ██╔════╝████╗  ██║
 ██╔████╔██║███████║██║  ███╗██║  ███╗█████╗  ██╔██╗ ██║
 ██║╚██╔╝██║██╔══██║██║   ██║██║   ██║██╔══╝  ██║╚██╗██║
 ██║ ╚═╝ ██║██║  ██║╚██████╔╝╚██████╔╝███████╗██║ ╚████║
 ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═══╝

`;

function gradient(text) {

  const colors = [

    chalk.rgb(255, 0, 150),

    chalk.rgb(255, 80, 0),

    chalk.rgb(255, 200, 0),

    chalk.rgb(0, 200, 255),

    chalk.rgb(120, 0, 255)

  ];

  return text

    .split("")

    .map((c, i) => colors[i % colors.length](c))

    .join("");

}

console.clear();

console.log("\n");

console.log(gradient(banner));

console.log(chalk.bold.cyan("        DISCORD GIFT CHECKER\n\n"));

// Ensure output directory exists

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Read gift codes

const giftCodes = fs

  .readFileSync(INPUT_FILE, "utf8")

  .split("\n")

  .map(l => l.trim())

  .filter(Boolean);

// 🧭 Empty file guide

if (giftCodes.length === 0) {

  console.log(chalk.yellowBright("📌 gifts.txt is empty!\n"));

  console.log(chalk.white(`

  ➜ One gift code per line

  ➜ Do NOT paste full links

  Example:

  AbCdEf

  XyZ123

  NitroCode

  `));

  process.exit(0);

}

async function checkCode(code) {

  try {

    const res = await fetch(

      `${API}/${code}?with_application=false&with_subscription_plan=true`

    );

    if (res.status === 200) return { code, status: "valid" };

    if (res.status === 404) return { code, status: "invalid" };

    return { code, status: "invalid" };

  } catch {

    return { code, status: "invalid" };

  }

}

// ─────────────────────────────────────────────

// ⏳ ANIMATED LOADER + PROGRESS

// ─────────────────────────────────────────────

let dots = 0;

let checked = 0;

const total = giftCodes.length;

const loader = setInterval(() => {

  dots = (dots + 1) % 4;

  process.stdout.write(

    `\r${chalk.cyan("Checking")}${".".repeat(dots)}${" ".repeat(3 - dots)}  ` +

    chalk.gray(`[ ${checked} / ${total} ]`)

  );

}, 300);

(async () => {

  const results = await Promise.all(

    giftCodes.map(async code => {

      const r = await checkCode(code);

      checked++;

      return r;

    })

  );

  clearInterval(loader);

  console.log("\n\n");

  const valid = [];

  const invalid = [];

  for (const r of results) {

    if (r.status === "valid") {

      console.log(chalk.greenBright(`  ✅ VALID   | ${r.code}`));

      valid.push(r.code);

    } else {

      console.log(chalk.redBright(`  ❌ INVALID | ${r.code}`));

      invalid.push(r.code);

    }

  }

  console.log("\n");

  fs.writeFileSync(VALID_FILE, valid.join("\n"));

  fs.writeFileSync(INVALID_FILE, invalid.join("\n"));

    fs.writeFileSync(INPUT_FILE, "");
    
  console.log(chalk.greenBright(`✔ output/valid.txt   (${valid.length})`));

  console.log(chalk.redBright(`✖ output/invalid.txt (${invalid.length})\n`));

})();