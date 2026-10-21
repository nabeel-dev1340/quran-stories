// Component sheet: every shared helper drawn once, for checking the kit.
import { C, svgDoc, linear, glowDef, rect, path, g, sparkle, star8, crescent, sun, cloud, mountain, dune, palm, tree, cypress, bush, grass, flower, rock, reeds, sea, foam, camel, sheep, bird, flyingBird, farBird, fish, house, tent, kaaba, lantern, starField, ids } from '../lib.js';

export default function render() {
  const id = ids('s00');
  const defs = [
    linear(id('sky'), [[0, C.night1], [0.5, C.dusk0], [1, C.dawn1]]),
    glowDef(id('moonGlow'), C.gold0, 0.5),
    glowDef(id('sunGlow'), C.gold1, 0.6),
    glowDef(id('lampGlow'), C.gold1, 0.7),
  ].join('');
  const body = [
    rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` }),
    starField({ seed: 3, n: 50, area: [0, 0, 1000, 300] }),
    crescent(120, 110, 60, {}),
    sun(300, 110, 45, { glowId: id('sunGlow'), rays: 12 }),
    sparkle(420, 90, 20),
    star8(500, 100, 30),
    lantern(600, 70, { glowId: id('lampGlow'), s: 0.8 }),
    cloud(800, 160, 220, { shade: C.sky2, seed: 4 }),
    mountain(150, 480, 300, 200, {}),
    mountain(400, 480, 260, 240, { light: C.stone1, dark: C.stone2, snow: C.white, seed: 7 }),
    dune([[500, 470], [650, 400], [800, 450], [1000, 380]], { bottom: 480 }),
    path('M0,480 H1000 V1000 H0Z', { fill: C.leaf1 }),
    palm(90, 760, { h: 260, seed: 2 }),
    tree(260, 760, { r: 80, fruit: C.coral3 }),
    cypress(370, 760, {}),
    bush(450, 760, {}),
    grass(520, 760, {}),
    flower(560, 740, { stemH: 20 }),
    rock(640, 760, {}),
    reeds(720, 760, {}),
    house(840, 760, { dome: 40 }),
    tent(150, 960, {}),
    kaaba(400, 960, { s: 0.8 }),
    camel(620, 960, { s: 0.75 }),
    sheep(800, 960, { s: 0.8, ram: true }),
    g({}, sea(870, { colors: [C.water2, C.water3] }).replace(/^/, '')),
    bird(930, 860, { s: 0.6 }),
    flyingBird(700, 600, { s: 0.8 }),
    farBird(560, 560, 1.2),
    fish(920, 950, { s: 0.6 }),
    foam(880, {}),
  ].join('');
  return svgDoc({ defs, body });
}
