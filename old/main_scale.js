const repIds = replaceables();
const strictRepIds = strictReplaceables(repIds);
const history = { rural: [], urban: [] };
const domStats = document.querySelector('#stats');
const domDisplay = document.querySelector('#display');

const state = {
  destination: 'rural',
  updateDelay: 500,
  outgoing: true,
  updating: true,
  logging: false,
  maxSteps: 50,
  maxLegs: 20,
  reader: 0,
  loopId: 0,
  legs: 0
};

let wordspaceMinMax = [-0.1, 1]; // in em
let displaySims, shadowSims, worker, cachedHtml;
let displayBounds = domDisplay.getBoundingClientRect();
let font = window.getComputedStyle(domDisplay).fontFamily;
let cpadding = window.getComputedStyle(domDisplay).padding;
let padfloat = parseFloat(cpadding.replace(/px/g, ""));
let padding = (!padfloat || padfloat === NaN) ? 30 : padfloat;
let radius = displayBounds.width / 2;

// setup history and click handler
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));
document.querySelector('#container').onclick = stop;
window.onresize = () => {
  displayBounds = domDisplay.getBoundingClientRect();
  radius = displayBounds.width / 2;
  scaleToFit();
}

// create progress bars
let progressBars = setupProgress({ color: ["#ddd", "#ccc", "#bbb", "#aaa"] });

// layout lines in circular display
let initialMetrics = { radius: Math.max(radius, 450) };
let offset = {
  x: displayBounds.x + initialMetrics.radius,
  y: displayBounds.y + initialMetrics.radius
};
let opts = { offset, font, lineHeightScale: 1.28, padding: padding };
let lines = dynamicCircleLayout(sources[state.destination], initialMetrics.radius, opts);
initialMetrics.lineWidths = layoutCircular(initialMetrics.radius, domDisplay, lines);
initialMetrics.fontSize = lines[0].fontSize;

scaleToFit();
ramble(); // go

/////////////////////////////////////////////////////////

function ramble() {

  let { updating, outgoing, destination } = state;

  if (!state.reader) {
    let spans = document.getElementsByClassName("word"); // double-check
    if (spans.length != sources[state.destination].length) throw Error
      ('Invalid spanify: ' + spans.length + '!==' + sources[state.destination].length);
    state.reader = new Reader(spans);
    state.reader.start();
  }
  if (!worker) {
    worker = new Worker("similars.js");
    worker.onmessage = replace;
  }
  if (updating) {
    if (outgoing) {
      // tell worker to do similar search
      let idx = RiTa.random(repIds.filter(id =>
        !state.reader.selection().includes(sources[destination][id])));
      startMs = Date.now();
      worker.postMessage({ idx, destination }); // calls replace() when done
    }
    else {
      restore();
    }
  }
}

/* logic for steps, legs and domain swapping */
function updateState() {

  let { maxSteps, legs, maxLegs, logging } = state;

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= maxSteps) {
      if (++state.legs >= maxLegs) return stop();
      if (logging) console.log(`Reverse: incoming in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = false;
      state.destination = 'urban'; // swap dest
    }
  }
  else {   // incoming
    if (steps === 0) {
      if (++state.legs >= maxLegs) return stop();
      if (logging) console.log(`Reverse: outgoing in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = true;
    }
  }
  updateInfo();
}


function replace(e) { // called by similars.js (worker)

  let { destination, updateDelay, logging } = state;
  let { idx, displaySims, shadowSims } = e.data;

  if (idx === -1) {
    let cache = e.data.similarCache;
    let size = Object.keys(cache).length;
    let data = `let precache=${JSON.stringify(cache, 0, 2)};`
    data += `\n\nlet htmlSpans='${cachedHtml}';\n`;
    if (0) {
      download(data, `preload-${size}.js`, 'text');
      console.log(`[INFO] wrote preload-${size}.js`);
    }
    return;
  }

  let shadow = destination === 'rural' ? 'urban' : 'rural';
  let displayWord = sources[destination][idx];
  let shadowWord = sources[shadow][idx];
  let pos = sources.pos[idx];
  let delayMs = 1;

  if (displaySims.length && shadowSims.length) {

    // pick a random similar to replace in display text
    let displayNext = RiTa.random(displaySims);
    history[destination][idx].push(displayNext);
    updateDOM(displayNext, idx);

    let shadowNext = RiTa.random(shadowSims);
    history[shadow][idx].push(shadowNext);

    updateState();

    let ms = Date.now() - startMs;
    delayMs = Math.max(1, updateDelay - ms);

    if (logging) console.log(`${numMods()}) @${idx} ${destination}: ${displayWord} `
      + ` -> ${displayNext}, ${shadow}: ${shadowWord} -> ${shadowNext} [${pos}] ${ms}ms`);
  }
  else {

    console.warn(`[FAIL] @${idx} `
      + `${displayWord} -> ${displaySims.length}, ${shadowWord} `
      + `-> ${shadowSims.length} [${pos}] in ${Date.now() - startMs} ms`);
  }

  state.loopId = setTimeout(ramble, delayMs);
}

/* selects an index to restore (from history) in displayed text */
function restore() {

  let { destination, updateDelay, logging } = state;

  let displayWords = unspanify();

  // get all possible restorations
  let choices = repIds
    .map(idx => ({ idx, word: displayWords[idx] }))
    .filter(({ word, idx }) => history[destination][idx].length > 1
      && isReplaceable(word));

  if (choices.length) {

    // pick a changed word to step back
    let { word, idx } = RiTa.random(choices);
    let pos = sources.pos[idx];
    let hist = history[destination][idx];

    // select newest from history
    hist.pop();
    let next = hist[hist.length - 1];

    history[shadowTextName()][idx].pop(); // stay in sync?

    // do replacement
    updateDOM(next, idx);

    if (logging) console.log(`${numMods()}] @${idx} `
      + `${destination}: ${word} -> ${next} [${pos}]`);
  }
  else {
    let id = repIds.find(idx => history[destination][idx].length > 1);
    let wrd = sources[destination][id];
    let hst = history[destination][id];
    console.warn('[WARN] Invalid-state, numMods:'
      + numMods() + ' idx=' + id + '/' + wrd + ' history=', hst);
    stop();
    return
  }

  updateState();

  state.loopId = setTimeout(ramble, updateDelay);
}

/* compute the affinity over 2 text arrays for a set of word-ids */
function affinity(textA, textB, idsToCheck) {

  let matches = idsToCheck.reduce((total, idx) =>
    total + (textA[idx] === textB[idx] ? 1 : 0), 0);
  let raw = matches / idsToCheck.length;
  let fmt = (raw * 100).toFixed(2);
  while (fmt.length < 5) fmt = '0' + fmt; // pad
  return fmt;
}

/* total number of replacements made in display text */
function numMods() {
  return repIds.reduce((total, idx) =>
    total + history[state.destination][idx].length - 1, 0);
}

/* stop rambler and reader  */
function stop() {
  let { reader } = state;
  clearTimeout(state.loopId);
  state.updating = false;
  if (reader) reader.stop();
  setTimeout(_ =>
    Array.from(document.querySelectorAll('.word')).forEach(e => {
      e.classList.remove('incoming');
      e.classList.remove('outgoing');
    }), 1000);
  if (state.logging) console.log('[INFO] done');
  worker.postMessage({ idx: 0, destination: 0 });
}

/* update stats in debug panel */
function updateInfo() {
  let { updating, destination, outgoing, legs, maxLegs } = state;

  let displayWords = unspanify(); // get words

  // compare visible text to each source text
  let affinities = [
    affinity(sources.rural, displayWords, repIds),
    affinity(sources.urban, displayWords, repIds),
    affinity(sources.rural, displayWords, strictRepIds),
    affinity(sources.urban, displayWords, strictRepIds)
  ];

  // Update the #stat panel
  let data = 'Domain: ' + destination;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');
  data += ` &nbsp; Leg: ${legs + 1} /${maxLegs}&nbsp; Affinity:`;
  data += ' Rural=' + affinities[0] + ' Urban=' + affinities[1];
  data += ' &nbsp;Strict:'; // and now in strict mode
  data += ' Rural=' + affinities[2] + ' Urban=' + affinities[3];

  domStats.innerHTML = data;

  progressBars.forEach((p, i) =>
    p.animate(affinities[i] / 100,
      { duration: 3000 }, () => 0/*console.log('done0')*/));
}

function replaceables() { // [] of replaceable indexes
  let repids = [], count = 0;
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) repids.push(idx);
  });
  sources.urban.forEach((word, idx) => {
    if (isReplaceable(word)) {
      if (!repids.includes(idx)) throw Error('Invalid state[1]');
      count++;
    }
  });
  if (repids.length !== count) throw Error('Invalid state[2]');

  return repids;
}

function isReplaceable(word) {
  return word.length >= minWordLength && !stops.includes(word);
}

/* compute id set for strict replacements */
function strictReplaceables() {
  return repIds.filter(idx =>
    sources.rural[idx] !== sources.urban[idx]);
}


function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function shadowTextName() {
  return state.destination === 'rural' ? 'urban' : 'rural';
}

function updateDOM(next, idx) {
  const word = document.querySelector(`#w${idx}`);
  word.textContent = next;
  word.classList.add(state.outgoing ? 'outgoing' : 'incoming');
  adjustWordSpace(word.parentElement.parentElement, initialMetrics, wordspaceMinMax, padding, radius);
}

function scaleToFit() {
  document.querySelector('#text-display').style.transform
    = "scale(" + radius / initialMetrics.radius + ")";
}