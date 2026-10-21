// Lint every illustration: allowed SVG features only, sane size, unique ids.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = ['src/art/scenes', 'src/art/book'];
const banned = [/<text\b/, /<filter\b/, /<image\b/, /<foreignObject\b/, /mix-blend/, /<style\b/, /Math\.random/];
let problems = 0;
for (const d of dirs) {
  for (const f of fs.readdirSync(path.join(root, d)).filter((x) => x.endsWith('.js')).sort()) {
    const file = path.join(root, d, f);
    const src = fs.readFileSync(file, 'utf8');
    if (/Math\.random/.test(src)) { console.log(`${f}: uses Math.random`); problems++; }
    let svg;
    try {
      svg = (await import(pathToFileURL(file).href)).default();
    } catch (e) {
      console.log(`${f}: failed to render: ${e.message}`);
      problems++;
      continue;
    }
    const kb = Buffer.byteLength(svg) / 1024;
    const issues = banned.filter((re) => re.test(svg)).map((re) => re.source);
    if (/NaN|undefined/.test(svg)) issues.push('NaN/undefined in output');
    if (kb > 400) issues.push(`large (${kb.toFixed(0)} KB)`);
    const idList = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = idList.filter((x, i) => idList.indexOf(x) !== i);
    if (dup.length) issues.push(`duplicate ids: ${[...new Set(dup)].join(', ')}`);
    if (issues.length) { console.log(`${f}: ${issues.join('; ')}`); problems++; }
  }
}
console.log(problems ? `${problems} file(s) need attention` : 'all illustrations pass');
process.exit(problems ? 1 : 0);
