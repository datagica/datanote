'use strict'

import { iconMapping } from '~/config/mappings/categories'
import levenshtein     from '~/utils/analysis/levenshtein'

const iconKeys = Object.keys(iconMapping);

const cache = new Map();

function pickFontIcon(word) {
  word = word.trim().toLowerCase();
  if (cache.has(word)) {
    return cache.get(word)
  }

  const fontIcon = iconKeys
    .map(key => ({
      score: levenshtein(word, key),
      fontIcon: {
        face: iconMapping[key].split(' ').shift(),
        code: iconMapping[key].split(' ').pop()
      }
    }))
    .sort((a, b) => b.score - a.score)
    .pop()
    .fontIcon;
  cache.set(word, fontIcon);
  return fontIcon;
}

export default pickFontIcon;
