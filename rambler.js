class Rambler {

  constructor(sources, state) {
    this.state = state;
    this.sources = sources;
    this.ignores = defaultIgnores;
    this.stops = defaultStopWords;
    this.destination = state.destination;
    this.outgoing = state.outgoing;
    this.repIds = this.replaceableIndexes();
    this.history = {rural: [], urban: []};
    Object.keys(this.history, k => this.sources[k].map(w => [w]));
    console.log(this.wordsFromHistory('rural'));
    /* this.history.rural = this.sources.rural.map(w => [w]);
    this.history.urban = this.sources.urban.map(w => [w]); */
    /* this.initial = words; // const
    this.words = this.initial.slice();
    this.name = opts.name || 'Rambler';
    this.history = this.words.map(w => [w]);
    this.pos = opts.pos || RiTa.pos(this.words);
    this.ignores = opts.ignores || defaultIgnores;
    this.stops = opts.stopWords || defaultStopWords;
    this.repIds = this.replaceableIndexes(); */
  }

  // ---------------------- API -------------------------

  wordsFromHistory(text) { // last from each history array
    return this.history[text].map(a => a[a.length-1]);
  }

  /* take one step either outgoing or incoming */
  step() {
    /* let idxs = RiTa.randomOrdering(this.repIds);
    for (let i = 0; i < idxs.length; i++) { */
    let replaced = this.replace();
    //let replaced = this.restore();
    
    //if (replaced)
  }

  /* total number of replacements made */
  numMods() {
    return this.repIds.reduce((total, idx) =>
      total + this.history[idx].length - 1, 0);
  }

  // -------------------- HELPERS -----------------------

  /* return true if word can be replaced */
  isReplaceable(word) {
    return word.length >= Rambler.minWordLength && !this.stops.includes(word);
  }

  /* return true if word does not equal its original value */
  isModified(text, idx) {
    return this.sources[text][idx] !== this.initial[idx];
  }

  /* does one new word replacement */
  replace(inIdx) {

    let choices, startMs = +new Date();

    if (typeof inIdx !== 'undefined') {
      choices = [inIdx]; // single index
    }
    else {
      // all possible replaceable indexes
      choices = RiTa.randomOrdering(this.repIds);
    }

    let idx, word, pos, next;

    for (let i = 0; i < choices.length; i++) {

      idx = choices[i];
      pos = this.pos[idx];
      word = this.words[idx];
      if (!word) throw Error('Replace Error: ' + this.name
        + ' for index=' + this.idx + '\n' + JSON.stringify(choices));
      word = word.toLowerCase();

      let similars = this.similars(word, pos);
      if (!similars) continue;

      // pick a random similar
      next = RiTa.random(similars);

      if (/[A-Z]/.test(this.words[idx][0])) {
        next = RiTa.capitalize(next); // keep caps
      }

      this.words[idx] = next; // do replacement
      this.history[idx].push(next); // add to history

      break; // done
    }

    let ms = +new Date() - startMs; // tmp: for perf

    return { idx, word, next, pos, ms };
  }

  /* restores one word from history */
  restore(inIdx) {

    let choices;

    if (typeof inIdx !== 'undefined') {
      choices = [{ next: this.words[inIdx], idx: inIdx }];
    }
    else {
      // get all possible restorations
      choices = this.repIds
        .map(idx => ({ idx, next: this.words[idx] }))
        .filter(({ next, idx }) =>
          this.history[idx].length > 1
          && this.isReplaceable(next));
    }

    if (!choices.length) { // tmp-remove
      let msg = '';
      for (let i = 0; i < this.words.length; i++) {
        if (this.isModified(i)) msg += i + ') '
          + ' orig=' + this.initial[i] + ', curr=' + this.words[i] + '\n';
      } console.error('[FAIL] No choices: ' + msg);
    }

    // pick a changed word to step back
    let { next, idx } = RiTa.random(choices);

    let word = next;
    let pos = this.pos[idx];
    let hist = this.history[idx];

    // select newest from history
    hist.pop();
    next = hist[hist.length - 1];

    // do replacement
    this.words[idx] = next;

    return { idx, word, next, pos };
  }

  /* find all similars via RiTa */
  similars(word, pos) {

    let rhymes = RiTa.rhymes(word, { pos });
    let sounds = RiTa.soundsLike(word, { pos });
    let spells = RiTa.spellsLike(word, { pos });
    let similars = [...rhymes, ...sounds, ...spells]
      .filter(next => next.length >= Rambler.minWordLength &&
        !word.includes(next) && !next.includes(word) &&
        !this.ignores.includes(next) && !this.stops.includes(next));

    if (similars.length > 1) return similars;
  }

  replaceableIndexes() { // [] of replaceable indexes
    let repids = [];
    this.initial.forEach((word, idx) => {
      if (this.isReplaceable(word)) repids.push(idx);
    });
    return repids;
  }
}

Rambler.minWordLength = 4;

const defaultIgnores = ["jerkies", "nary", "outta", "copras", "accomplis", "scad", "silly", "saris", "coca", "durn", "geed", "goted", "denture", "wales"];
const defaultStopWords = ["also", "over", "have", "this", "that", "just", "then", "under", "some",
  // added: DCH
  'these',
  "within",
  "after",
  "with",
  "there",
  "where",
  "while",
  "from",
  "whenever",
  // added: DCH, from 'urban' to sync number of replaceable indexes in each text
  "rushed",
  "prayer"
]