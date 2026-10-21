// Backdrop for "The 25 Prophets": a starry night over a row of arches.
import { C, svgDoc, ids, linear, glowDef, glow, rect, path, starField, crescent, sparkle } from '../lib.js';

export default function render() {
  const id = ids('proph');
  const defs = [linear(id('sky'), [[0, '#121E3E'], [0.55, '#1D3266'], [1, '#2C3F78']]), glowDef(id('moon'), '#FFF2C6', 0.4)].join('');
  let b = rect(0, 0, 1000, 1000, { fill: `url(#${id('sky')})` });
  b += starField({ seed: 25, n: 90, area: [0, 0, 1000, 1000], twinkles: 10, avoid: [[500, 560, 380]] });
  b += glow(900, 90, 160, id('moon')) + crescent(900, 90, 34, { fill: '#FFF0C8', angle: -30, thickness: 0.5 });
  // arcade of arches along the bottom
  let arc = 'M0,1000 L0,930';
  const w = 125;
  for (let x = 0; x < 1000; x += w) arc += ` L${x + 12},930 L${x + 12},900 C${x + 12},860 ${x + w / 2},846 ${x + w / 2},846 C${x + w / 2},846 ${x + w - 12},860 ${x + w - 12},900 L${x + w - 12},930 L${x + w},930`;
  arc += ' L1000,1000Z';
  b += rect(0, 840, 1000, 160, { fill: '#2B3F78' });
  b += path(arc, { fill: '#17264A' });
  b += rect(0, 832, 1000, 10, { fill: '#E9C77E', opacity: 0.55 });
  for (let x = w / 2; x < 1000; x += w) b += sparkle(x, 890, 6, '#F2C46A', { opacity: 0.8 });
  return svgDoc({ defs, body: b });
}
