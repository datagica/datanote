# /utils

Some generic utility functions.
We could put them into external libraries.

- `analysis/fuzzyFind.js`: fuzzy search a string
- `analysis/levenshtein.js`: measure the Levenshtein distance between two strings
- `colors/prisma.js`: color-related functions
- `colors/changeOpacity.js`: change the opacity of a rgb string: "rgb(r, g, b)" => "rgba(r, g, b, a)"
- `validators/isDefined.js`: check than a reference isn't null or undefined
- `validators/isNotEmpty.js`: check that an array isn't null or empty
- `misc/promiseAction.js`: Promisify mobX's action (obsolete?)
- `misc/cancelable.js`: make a Promise cancelable
- `formatters/capitalize.js`: capitalize a string
- `formatters/humanize.js`: humanize file sizes
- `formatters/wordwrap.js`: JS-based word-wrapping (for use in canvas etc..)
- `electron/ipc-promise.js`: promise-ify IPC calls
- `electron/process-pool.js`: manage a process
- `experimental/transcriber.js`: experimental code for speech analysis (the related HTML API is unfortunately broken in Electron)
