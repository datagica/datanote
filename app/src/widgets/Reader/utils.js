import 'whatwg-fetch'

function loadURL(url){
  console.log("loadFile (URL)", url)
  return fetch(url).then(response => {
    console.log("response:", response)
    return Promise.resolve("")
  })
}
function loadFile(filePath){
  if (window.node && window.node.require){
    const fs = window.node.require('fs')
    console.log("loadFile (Node)", filePath)
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      console.log("loadfile (HTML5)", filePath)
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsText(`file://${filePath}`);
    })
  }
}

function load(uri){
  if (!uri || uri === '') {
    return Promise.resolve('')
  }
  return uri.match(/^https?:/i)
      ? loadURL(uri)
      : loadFile(uri)
}

// hard copy from @datagica/replace-entities v0.0.3
function replace(opts) {

  const entities =
    Array.isArray(opts.entities)
    ? ([].concat(opts.entities)).sort((a, b) => (a.position.begin - b.position.begin))
    : [];

  const content =
    (typeof opts.content === 'undefined')
    ? []
    : Array.isArray(opts.content)
      ? opts.content
      : [ opts.content ];

  const textGetter = opts.textGetter instanceof Function
    ? opts.textGetter
    : (input) => (input);

  const results = [];

  // positive delay = we are "late" compared to expected index
  // negative delay = we are in advance
  let delay = 0;

  let currentIndexedCursor = 0;
  let pendingEntityIndex = 0;

  let contentBuffer = '';

  for (let i = 0; i < content.length; i++) {

    const currentChunk = content[i];

    // if we process PDF, input is not pure text but objects
    const currentChunkStr = textGetter(currentChunk);

    contentBuffer += currentChunkStr;

    // let's see if the pending entity can be found in the buffer
    const pendingEntity = entities[pendingEntityIndex];
    if (pendingEntity) {

      const candidates = [];
      let j = 0;
      let k = 0;

      const expectedPosition = pendingEntity.position.begin - delay;

      while ((k = contentBuffer.indexOf(pendingEntity.position.ngram, j)) > -1) {
        candidates.push(k);
        j = k + pendingEntity.position.ngram.length;
      }
      if (candidates.length) {

        pendingEntityIndex++;

        let bestDelta = 1e10;
        let winner = null;
        for (let l = 0; l < candidates.length; l++) {
          const candidate = candidates[l];
          const candidateDelta = Math.abs(candidate - expectedPosition);
          if (candidateDelta < bestDelta) {
            winner = candidate;
            bestDelta = candidateDelta;
          }
        }

        delay += winner - pendingEntity.position.begin;

        // okay now, we need to split the buffer into parts
        const normalText = contentBuffer.slice(0, winner);
        const entityText = pendingEntity.position.ngram;
        contentBuffer = contentBuffer.slice(winner + pendingEntity.position.ngram.length, contentBuffer.length)

        // finally transform text into chunks
        const split = normalText.split(/\n/i);
        let s = 0;
        split.map(chunk => {
          results.push(chunk)
          if (s++ < split.length - 1) results.push('\n')
        })
        results.push(pendingEntity)
      }
    }
  }
    const split = contentBuffer.split(/\n/i);
    let s = 0;
    split.map(chunk => {
    results.push(chunk)
    if (s++ < split.length - 1) results.push('\n')
  })

  return results;
}

module.exports = {
  load: load,
  loadFile: loadFile,
  loadURL: loadURL,
  replace: replace
}
