// Component sheet 2: creatures and buildings at a large size.
import { C, svgDoc, rect, camel, sheep, bird, flyingBird, fish, tent, kaaba, house, palm, ids, linear } from '../lib.js';

export default function render() {
  const id = ids('s00b');
  const body = [
    rect(0, 0, 1000, 1000, { fill: C.sky3 }),
    rect(0, 330, 1000, 670, { fill: C.leaf0 }),
    camel(200, 320, { s: 1.2 }),
    sheep(520, 300, { s: 1.3 }),
    sheep(820, 300, { s: 1.3, ram: true, flip: true }),
    bird(120, 560, { s: 1.4 }),
    flyingBird(380, 480, { s: 1.4 }),
    flyingBird(380, 600, { s: 1.4, up: false }),
    fish(650, 520, { s: 1.6 }),
    palm(880, 640, { h: 300, seed: 4 }),
    tent(170, 900, {}),
    kaaba(480, 920, { s: 1.1 }),
    house(800, 920, { dome: 40 }),
  ].join('');
  return svgDoc({ defs: '', body });
}
