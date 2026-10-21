// Endpapers: a calm repeating pattern of little story symbols in gold on night blue.
import { C, svgDoc, ids, rng, linear, rect, g, crescent, star8, sparkle, palm, camel, fish, flyingBird, lantern, circle, path } from '../lib.js';

const GOLD = '#E9C77E';
const CREAM = '#FFF1D6';

function icon(kind, x, y, R) {
  switch (kind) {
    case 'moon':
      return crescent(x, y, 30, { fill: GOLD, angle: -30, thickness: 0.48 }) + star8(x + 26, y - 22, 7, CREAM);
    case 'palm':
      return palm(x, y + 46, { h: 92, seed: R.int(1, 99), dates: true, trunk: GOLD, trunkDark: GOLD, leaf: GOLD, leafMid: GOLD, leafDark: GOLD, dateColor: CREAM });
    case 'camel':
      return camel(x - 6, y + 38, { s: 0.36, body: GOLD, dark: GOLD, light: GOLD });
    case 'fish':
      return fish(x, y, { s: 0.75, body: GOLD, fin: GOLD, belly: GOLD, stripes: false });
    case 'bird':
      return flyingBird(x, y, { s: 0.8, body: CREAM, wing: GOLD, beak: GOLD });
    case 'lantern':
      return lantern(x, y - 46, { s: 0.6, metal: GOLD, glass: CREAM, chain: 0 });
    case 'star':
      return star8(x, y, 26, GOLD) + circle(x, y, 9, { fill: '#1D2F5E' }) + star8(x, y, 6, CREAM);
    default:
      return sparkle(x, y, 18, CREAM) + sparkle(x + 24, y + 18, 9, GOLD) + sparkle(x - 22, y + 20, 7, GOLD);
  }
}

export default function render() {
  const id = ids('endp');
  const R = rng(5);
  const kinds = ['moon', 'palm', 'star', 'camel', 'bird', 'lantern', 'fish', 'sparkles'];
  let b = rect(0, 0, 1000, 1000, { fill: `url(#${id('bg')})` });
  const step = 168;
  let k = 0;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const x = col * step + (row % 2 ? step / 2 : 0) - 20;
      const y = row * step + 40;
      b += g({ opacity: 0.92 }, icon(kinds[(k + row * 3) % kinds.length], x, y, R));
      k++;
    }
  }
  const defs = linear(id('bg'), [[0, '#1B2C5A'], [1, '#22386A']]);
  return svgDoc({ defs, body: b });
}
