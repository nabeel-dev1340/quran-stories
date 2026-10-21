// "For Little Eyes" intro: bold rings and stripes around a white card.
import { page, K, W, RED, rings, checks, rect } from '../hc-kit.js';
export default () => page(false,
  rings(0, 0, 60, 6, 56, K) + rings(1000, 1000, 60, 6, 56, K) +
  rings(1000, 0, 60, 4, 56, RED) + rings(0, 1000, 60, 4, 56, RED) +
  checks(0, 40, 26, K, W).replace(/<rect/g, '<rect opacity="0"') + rect(0, 0, 1000, 1000, { fill: 'none' }));
