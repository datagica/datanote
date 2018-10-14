'use strict';

import levenshtein from '~/utils/analysis/levenshtein'

import { colorMapping } from '~/config/mappings/categories'

export const colorKeys = Object.keys(colorMapping);

const cache = new Map();

function pickRGB(word1, word2) {
  word1 = word1 ? word1.trim().toLowerCase() : '';
  word2 = word2 ? word2.trim().toLowerCase() : '';
  const cacheKey = word1 + ':' + word2;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  let color = 'rgb(0,0,0)';

  if (word1 !== '') {
    color = colorKeys
      .map(key => ({
        score: levenshtein(word1, key),
        color: colorMapping[key]
      }))
      .sort((a, b) => b.score - a.score)
      .pop()
      .color
  }

  // special case: color blending!
  if (word2 !== '') {
    const secondColor = colorKeys
      .map(key => ({
        score: levenshtein(word2, key),
        color: colorMapping[key]
      }))
      .sort((a, b) => b.score - a.score)
      .pop()
      .color;
    // TODO implement the double word color mixin
    // using   (r1, g1, b1) + (r2, g2, b2) = ((r1+r2)/2, (g1+g2)/2, (b1+b2)/2)
    // for the moment, if colors are different we return black
    color = (color === secondColor) ? color : 'rgb(0, 0, 0)';
  }

  cache.set(cacheKey, color);
  return color;
}

export default pickRGB;
