/*
  @params: target, lines, opts
      opts.fontSize: float, fontSize in px
      opts.fontFamily: string, fontFamily string

  @return: an array of original line widths
*/
const lineateCircular = function (target, initialRadius, lines, opts = {}) {

  const dbug = opts.debug;
  const fontSize = opts.fontSize;
  const fontFamily = opts.fontFamily;

  const ws = [];
  const textContainer = document.createElement("div");
  textContainer.id = "text-display";
  textContainer.style.width = initialRadius * 2 + "px";
  textContainer.style.height = initialRadius * 2 + "px";
  if (dbug) console.log(lines.length);

  let wi = 0;
  lines.forEach((l, li) => {
    let lineDiv = document.createElement("div");
    lineDiv.classList.add("line");
    const thisFontSize = l.fontSize || fontSize;
    const thisFontFamliy = l.fontFamily || fontFamily;
    const thisWordSpacing = l.wordSpacing;
    if (thisFontSize) lineDiv.style.fontSize = thisFontSize + "px";
    if (thisFontFamliy) lineDiv.style.fontFamily = thisFontFamliy;
    if (thisWordSpacing) lineDiv.style.wordSpacing = thisWordSpacing + "em";
    lineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
    lineDiv.id = "l" + li;

    if (l.text && l.text.length > 0) {
      const wrapperSpan = document.createElement("span");
      wrapperSpan.style.display = "inline-block";
      wrapperSpan.classList.add("wrapper");
      let words = RiTa.tokenize(l.text);
      words.forEach((w, iil) => {
        if (iil > 0) {
          if (!RiTa.isPunct(w)) wrapperSpan.append(" ");
        }
        let wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        wordSpan.id = "w" + wi++;
        wordSpan.innerText = w;
        wrapperSpan.append(wordSpan);
      });
      lineDiv.append(wrapperSpan)
    }

    textContainer.append(lineDiv);
    ws.push(l.bounds[2]);
  });

  target.append(textContainer);

  return ws;
}

const adjustWordSpace = function (line, initial, maxMin, padding, radius) {
  
  if (!Array.isArray(maxMin)) throw Error('[maxMin] required');

  line.classList.remove("max-word-spacing");
  line.classList.remove("min-word-spacing");

  let wordSpacing = window.getComputedStyle(line).wordSpacing;
  let step = 0.01, scaleRatio = radius / initial.radius;
  let idx = parseInt((line.id).slice(1));
  let origW = initial.lineWidths[idx] - 2 * padding;
  let currentW = line.firstChild.getBoundingClientRect().width / scaleRatio;
  let ws = parseFloat(wordSpacing.replace('px', '')) / initial.fontSize; // px => em

  // try to get within 5 pixels of current width ?
  for (let tries = 0; Math.abs(origW - currentW) > 5 && tries < 200; tries++) {
    // if (origW > currentW) {
    //   ws += step;
    // } else {
    //   ws -= step;
    // }
    ws += (origW > currentW) ? step : -step;
    line.style.wordSpacing = ws + "em";
    currentW = line.firstChild.getBoundingClientRect().width / scaleRatio;
  }

  // check for extreme values
  if (ws >= maxMin[1]) {
    line.style.wordSpacing = maxMin[1] + "em";
    //line.classList.add("max-word-spacing"); // debugging only
  }
  else if (ws <= maxMin[0]) {
    line.style.wordSpacing = maxMin[0] + "em";
    //line.classList.add("min-word-spacing");  // debugging only
  }

  return ws;
}

/*
  parameter: words, radius, opts = {}
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.font: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.wordSpacing: float, in em
  @return: array of lines
*/
const layoutCircular = function (words, radius, opts = {}) {
  let offset = opts.offset || { x: 0, y: 0 };
  let padding = opts.padding || 0;
  let fontName = opts.font || 'sans-serif';
  let lineHeightScale = opts.lineHeightScale || 1.2;
  let wordSpacing = opts.wordSpacing || 0.25;
  let fontSize = radius / 4, result;
  do {
    fontSize -= 0.1;
    result = fitToLineWidths
      (offset, radius - padding, words, fontSize, fontSize * lineHeightScale, fontName, wordSpacing);
  }
  while (result.words.length);

  // console.log('Computed fontSize:', fontSize);

  return result.rects.map((r, i) => ({ fontSize, wordSpacing, bounds: r, text: result.text[i] }));
}

/*
  parameter: offset, radius, words, fontSize, lineHeight, fontName
  @return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, fontSize, lineHeight, fontName = 'sans-serif', wordSpacing) {
  //console.log('fitToLineWidths', fontSize);
  let tokens = words.slice();
  let text = [], rects = lineWidths(offset, radius, lineHeight);
  rects.forEach(([x, y, w, h], i) => {
    let data = fitToBox(tokens, w, fontSize, fontName, wordSpacing);
    if (!data) { // fail to fit any words
      text.push('');
      return;
    }
    text.push(data.text);
    tokens = data.words;
  });
  return { text, rects, words: tokens };
}

/*
  parameter: words, width, fontSize, fontName
  @return: { words, text }
*/
const fitToBox = function (words, width, fontSize, fontName = 'sans-serif', wordSpacing) {
  //console.log('fitToBox', words, width, fontSize);
  let i = 1, line = {
    text: words[0],
    width: measureWidth(words[0], fontSize, fontName, wordSpacing)
  };
  if (line.width > width) return; // can't fit first word

  for (let n = words.length; i < n; ++i) {
    let next = ' ' + words[i];
    let nextWidth = measureWidth(next, fontSize, fontName, wordSpacing);
    if (line.width + nextWidth > width) {
      break; // done
    }
    line.text += next;
    line.width += nextWidth;
  }
  words = words.slice(i);
  if (RiTa.isPunct(words[0])) { // punct can't start a line
    line.text += words.shift();
  }
  return {
    words, text: RiTa.untokenize((line.text || '').split(' ')),
  };
}

const measureWidth = function (text, fontSizePx = 12, fontName = font, wordSpacing = 0) {
  canvasCtx = canvasCtx || document.createElement("canvas").getContext("2d");
  canvasCtx.font = fontSizePx + 'px ' + fontName;
  let spaceCount = text ? (text.split(" ").length - 1) : 0;
  return canvasCtx.measureText(text).width + spaceCount * (wordSpacing * fontSizePx);
}

let canvasCtx, lineCtx; // don't recreate canvases 
const measureWidthForLine = function (text, lineIndex) {
  const line = document.querySelector("#l" + lineIndex);
  const lineCss = window.getComputedStyle(line);

  const tdisp = document.querySelector("#text-display");
  const textCss = window.getComputedStyle(tdisp);

  const wordSpacing = parseFloat(lineCss.wordSpacing.replace("px", ""));
  const scaleRatio = parseFloat(textCss.transform.replace
    (/^.*matrix\(([0-9]+\.[0-9]+)\,.*$/, "$1"));  // yuck
  const spaceCount = text ? (text.split(" ").length - 1) : 0;

  lineCtx = lineCtx || document.createElement("canvas").getContext("2d");
  lineCtx.font = lineCss.font;

  const lineWidth = lineCtx.measureText(text).width;
  return (lineWidth + (spaceCount * wordSpacing)) * scaleRatio;
};

const chordLength = function (rad, d) {
  return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

const lineWidths = function (center, rad, lh) {
  let result = [];
  let num = Math.floor((rad * 2) / lh);
  let gap = ((rad * 2) - (lh * num)) / 2;
  for (let i = 0; i < num; i++) {
    let d = gap + lh / 2 + (i * lh); // distance from top to the middle of the textline
    let cl = chordLength(rad, d > rad ? d + lh : d);
    let x = center.x - cl / 2;
    let y = center.y - (rad - d + lh / 2);
    if (cl) {
      //console.log(i, d, d > r, cl);
      result.push([x, y, cl, lh]);
    }
  }
  return result;
}
