import { page, K, W, RED, zigzag, circle } from '../hc-kit.js';
import { palm } from '../lib.js';
export default () => page(true,
  palm(470, 770, { h: 440, lean: 0.1, seed: 4, trunk: W, trunkDark: '#BBBBBB', leaf: W, leafMid: '#DDDDDD', leafDark: '#BBBBBB', dates: false }) +
  [[-1, 0], [1, 0]].map(([sd]) => [0, 1, 2, 3, 4, 5].map((k) => circle(516 + sd * (34 + (k % 3) * 18), 362 + Math.floor(k / 3) * 34, 17, { fill: RED })).join('')).join('') +
  zigzag(770, 46, 110, W) + zigzag(860, 34, 90, RED));
