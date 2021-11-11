const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ["in", "dt", "nn", "dt", "jj", "vbz", "vbn", ",", "in", "dt", "jj", "in", "dt", "jj", "jj", "nn", "vbz", "to", "nn", ",", "rb", "rb", "nns", "in", "in", "dt", "nn", "cc", "nn", "in", "dt", "nns", "in", "dt", "rb", "vbg", "nn", "vbz", ",", "prp", "cc", "prp", "md", "vbp", "vbn", "in", "in", "jj", "in", "rb", "jjr", "nns", "in", "dt", "nn", "cc", "in", "dt", "nns", ",", "in", "cc", "in", "dt", "cc", "in", "nn", ",", "rb", "jj", ",", "nn", "in", "rb", "jj", "jj", "nns", ",", "in", "in", "dt", "nns", "md", "vb", "nns", "in", "nn", "in", "rb", "prp$", "nns", ",", "vbn", "in", "nns", ",", "vbp", "rb", "jjr", "vb", "nns", "in", "jj", "rb", "jj", ":", "rb", "in", "cc", "in", "dt", "nn", ",", "in", "dt", "nn", "nn", ",", "in", "nn", "in", "nn", ",", "wrb", "dt", "nns", "vbp", "rb", "vbg", ",", "in", "cc", "wrb", "dt", "jj", "nns", "vbp", "vbg", "prp$", "nns", "cc", "vbz", ",", "in", "prp$", "jj", "nns", "in", "nn", ",", "in", "dt", "nns", "rb", "vb", ",", "in", "jj", "nns", "in", "nn", ",", "rbs", "rb", "in", "nn", ",", "in", "nn", ",", "to", "vb", ",", "to", "vb", "vbg", "vbd", ",", "to", "vb", "to", "vb", "vbd", "jj", "rb", "in", "dt", "nn", "wrb", "prp", "cc", "prp", "vbp", "rb", "vbd", "to", "vb", "cc", "wrb", "prp", "md", "rb", "rb", "cc", "rb", "vbp", "vbn", "dt", "jj", "vbn", "nn", ",", "cc", "cd", "dt", ",", "cc", "vbd", "cc", "vbn", "prp", "in", "dt", "vbg", "cc", "vb", "in", "jj", "nns", ",", "cc", "vbd", "in", "jj", "nn", ",", "jj", "cc", "jj", ",", "dt", "cd", "vbg", "cc", "nn", "cc", "vbg", "in", "dt", "nn", "in", "prp", "to", "vb", ",", "rb", "prp", "vbp", "dt", "jj", "in", "md", "vbp", "vbn", "dt", "nn", "cc", "nn", "cc", "nn", "cc", "nn", "rb", "in", "prp", "cc", "prp", "md", "vb", "in", "dt", "nn", ",", "dt", "in", "cc", "in", "vb", ",", "cc", "rb", "jj", ";", "cc", "dt", "jj", ",", "dt", "jj", "nn", "in", "dt", "jj", ",", "dt", "nn", ",", "in", "prp", "vbp", "vbd", "in", "vbg", ",", "prp", "vbz", "in", "prp", "cc", "vbz", "prp", "in", "nn", "in", "in", "dt", "nn", "prp", "vbp", "dt", "cc", "rb", "rb", ",", "rb", "rb", "vbg", "in", "cc", "in", "cc", "in", "dt", "nn", ",", "in", "dt", "nns", "in", "dt", "nns", ",", "in", "dt", "nn", ",", "in", "dt", "jj", "in", "prp$", "nn", "vbz", ",", "vbd", ",", "vbn", ",", "rb", "vbn", ",", "rb", "rb", "vbn", "cc", ",", "in", "vbg", "cc", "vbg", "in", "dt", "nns", ",", "vbg", "in", "dt", "vbg", "jj", "in", "vbd", ",", "nn", "vbn", "nn", "in", "prp$", "nn", ",", "vbd"]
};

/* sources.rural.forEach((w,i) => console.log(i+') '+w+'/'+sources.pos[i]));
sources.pos[125] = 'nns';
console.log(JSON.stringify(sources.pos)); */

const minWordLength = 4;
const domDisplay = document.querySelector("#display");
const domStats = document.querySelector('#stats');
const ignores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales"];
const stops = ["also", "over", "have", "this", "that", "just", "then", "under", "some", /* added: DCH */ "their", "when", "these", "within", "after", "with", "there", "where", "while", "from", "whenever", /* added: DCH, from 'urban' to sync number of replaceable indexes in each text*/ "rushed", "prayer"];

const repIds = replaceables();
const strictRepIds = strictReplaceables();
const history = { rural: [], urban: [] };
Object.keys(history).map(k => sources[k].map((w, i) => history[k][i] = [w]));

const state = {
  destination: 'rural',
  updateDelay: 100,
  stepDebug: false,
  outgoing: true,
  updating: true,
  maxSteps: 50,
  maxLegs: 20,
  reader: 0,
  loopId: 0,
  legs: 0
};

spanify();
ramble();


////////////////////////////////////////////////////////

function ramble() {

  state.outgoing ? replace() : restore();
  updateState();

  if (!state.stepDebug) {
    if (!state.reader) {
      state.reader = new Reader(domDisplay);
      state.reader.start();
    }
    if (state.updating) {
      loopId = setTimeout(ramble, state.updateDelay); // loop
    }
  }
}


/* logic for steps, legs and domain swapping */
function updateState() {

  const { maxSteps, legs, maxLegs } = state;

  let steps = numMods();
  if (state.outgoing) {
    if (steps >= maxSteps) {
      if (++state.legs >= maxLegs) return stop();
      console.log(`Reverse: incoming in `
        + `"urban" after leg #${legs + 1}.\n`);
      state.outgoing = false;
      state.destination = 'urban'; // swap dest
    }
  }
  else {   // incoming
    if (steps === 0) {
      if (++state.legs >= maxLegs) return stop();
      console.log(`Reverse: outgoing in `
        + `"urban" after leg #${legs + 1}.\n`);
      //if (state.destination === 'urban') return stop();
      state.outgoing = true;
    }
  }
  updateInfo();
}

/* selects an index with which to replace a word in each text */
function replace() {

  const { outgoing, destination } = state;

  let choices = RiTa.randomOrdering(repIds);
  let shadow = shadowTextName();
  let startMs = +new Date();

  for (let i = 0; i < choices.length; i++) {

    let idx = choices[i];
    let pos = sources.pos[idx];

    let word1 = sources[destination][idx];
    if (!word1) throw Error('Replace Error: ' + destination // tmp-remove
      + ' for index=' + idx + '\n' + JSON.stringify(choices));

    let word2 = sources[shadow][idx];
    if (!word2) throw Error('Replace Error: ' + shadow // tmp-remove
      + ' for index=' + idx + '\n' + JSON.stringify(choices));

    // get similars for both words
    let sims1 = similars(word1.toLowerCase(), pos);
    let sims2 = similars(word2.toLowerCase(), pos);
    if (!sims1 || !sims2) continue;

    // pick a random similar to replace in display text
    let next1 = RiTa.random(sims1);
    history[destination][idx].push(next1);
    updateDOM(next1, idx);

    // pick a random similar to replace in hidden text
    let next2 = RiTa.random(sims1);
    history[shadow][idx].push(next2);

    let ms = +new Date() - startMs; // tmp: for perf
    console.log(`${numMods()}${outgoing ? ')' : ']'} @${idx} `
      + `${destination}: ${word1} -> ${next1}, ${shadow}: `
      + `${word2} -> ${next2} [${pos}] ${outgoing ? ms + 'ms' : ''}`);

    break; // done
  }
}

/* selects an index with to restore (from history) in displayed text */
function restore() {

  const { outgoing, destination } = state;

  let displayWords = unspanify();
  
  // get all possible restorations
  let choices = repIds
    .map(idx => ({ idx, word: displayWords[idx] }))
    .filter(({ word, idx }) => history[destination][idx].length > 1
      && isReplaceable(word));

  if (!choices.length) { // tmp remove
    console.error('[FAIL] No choices: '+displayWords);
    return;
  }

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
  console.log(`${numMods()}${outgoing ? ')' : ']'} @${idx} `
    + `${destination}: ${word} -> ${next} [${pos}]`
    + ` ${outgoing ? ms + 'ms' : ''}`);
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
  clearTimeout(state.loopId);
  state.updating = false;
  state.reader.stop();
}

/* update stats in debug panel */
function updateInfo() {
  const { updating, destination, outgoing, legs, maxLegs } = state;

  let data = 'Domain: ' + destination;
  data += '&nbsp;' + (updating ? (outgoing ? '⟶' : '⟵') : 'X');

  let displayWords = unspanify(); // compare visible text to each source text
  data += ` &nbsp;Leg: ${legs + 1}/${maxLegs}&nbsp; Affinity:`;
  data += ' Rural=' + affinity(sources.rural, displayWords, repIds);
  data += ' Urban=' + affinity(sources.urban, displayWords, repIds);

  data += ' &nbsp;Strict:'; // and now in strict mode
  data += ' Rural=' + affinity(sources.rural, displayWords, strictRepIds);
  data += ' Urban=' + affinity(sources.urban, displayWords, strictRepIds);

  domStats.innerHTML = data;
}

function similars(word, pos) {

  let rhymes = RiTa.rhymes(word, { pos });
  let sounds = RiTa.soundsLike(word, { pos });
  let spells = RiTa.spellsLike(word, { pos });
  let sims = [...rhymes, ...sounds, ...spells]
    .filter(next => next.length >= minWordLength &&
      !word.includes(next) && !next.includes(word) &&
      !ignores.includes(next) && !stops.includes(next));

  if (sims.length > 1) return sims;
  console.warn('no similars for: "' + word + '"/' + pos
    + ((sources.rural.includes(word) || sources.rural.includes(word))
      ? ' *** [In Source]' : ''));
}


function replaceables() { // [] of replaceable indexes
  let repids = [];
  sources.rural.forEach((word, idx) => {
    if (isReplaceable(word)) repids.push(idx);
  });
  let count = 0;
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

function spanify(data) {
  let displayWords = sources[state.destination];
  const spans = displayWords.reduce((html, word, idx) =>
    html + (`<span id='w${idx}' class='word'>${word}</span>`
      + (RiTa.isPunct(displayWords[idx + 1]) ? '' : ' ')), '');
  domDisplay.innerHTML = spans;
}

function unspanify() {
  return Array.from(document.getElementsByClassName
    ("word")).map(e => e.textContent);
}

function shadowTextName() {
  return state.destination === 'rural' ? 'urban' : 'rural';
}

function updateDOM(next, idx) {
  const ele = document.querySelector(`#w${idx}`);
  ele.textContent = next;
  ele.style.backgroundColor = (state.outgoing ? '#fbb' : '#bbf');
}

/* words without similars in sources texts:

  "avoid"/vb
  "every"/dt
  "sometimes"/rb
  "adventure"/nn
  "inhuman"/jj

  "neighbors"/nn (should be nns? - fixed)
  "when"/wrb  (added as stop-word)
  "their"/prp$  (added as stop-word)
*/