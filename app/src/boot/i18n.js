import ReactIntl, {IntlProvider, addLocaleData} from 'react-intl'

import * as areIntlLocalesSupported from 'intl-locales-supported'

const localesMyAppSupports = [
  'en-US',
  'fr-FR' /* list locales here */
];

// to get the lang, do:
// navigator.language ? navigator.language : navigator.userLanguage

if (!window && global) {
  if (global.Intl) {
  console.log("Intl is present already")
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
      console.log("need to polyfill");
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and patch the constructors we need with the polyfill's.
      var IntlPolyfill  = require('intl');
      Intl.NumberFormat   = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    console.log("Intl is not present")
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
  }
}

if ('ReactIntlLocaleData' in window) {
  Object.keys(ReactIntlLocaleData).forEach(lang => {
    addLocaleData(ReactIntlLocaleData[lang]);
  });
}
