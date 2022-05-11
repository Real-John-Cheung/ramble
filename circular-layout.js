/*
  @params: target, lines, opts
      opts.fontSize: float, fontSize in px
      opts.fontFamily: string, fontFamily string

  @return: an array of original line widths
*/
const lineateCircular = function (target, initialRadius, lines, opts = {}) {

  let lineWidths = [];
  let fontSize = opts.fontSize;
  let textContainer = document.createElement("div");
  textContainer.id = "text-display";
  textContainer.style.width = initialRadius * 2 + "px";
  textContainer.style.height = initialRadius * 2 + "px";

  let wordIdx = 0;
  lines.forEach((l, li) => {
    let lineDiv = document.createElement("div");
    lineDiv.classList.add("line");
    let thisFontSize = l.fontSize || fontSize;
    let thisFontFamily = l.fontFamily || opts.fontFamily;
    if (thisFontSize) lineDiv.style.fontSize = thisFontSize + "px";
    if (thisFontFamily) lineDiv.style.fontFamily = thisFontFamily;
    if (l.wordSpacing) lineDiv.style.wordSpacing = l.wordSpacing + "em";
    lineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
    lineDiv.id = "l" + li;

    if (l.text && l.text.length > 0) {
      let wrapperSpan = document.createElement("span");
      wrapperSpan.style.display = "inline-block";
      //if (li === 0) wrapperSpan.style.outline = '1px solid red';

      wrapperSpan.classList.add("wrapper");
      let words = RiTa.tokenize(l.text);
      words.forEach((w, iil) => {
        if (iil > 0 && !RiTa.isPunct(w)) wrapperSpan.append(" ");
        let wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        wordSpan.id = "w" + wordIdx++;
        wordSpan.innerText = w;
        wrapperSpan.append(wordSpan);
      });
      lineDiv.append(wrapperSpan);
    }

    textContainer.append(lineDiv);
    lineWidths.push(l.bounds[2]);
  });

  target.append(textContainer);

  return { // main::initMetrics
    fontSize,
    lineWidths,
    radius: initialRadius,
  };
}

const initWordSpace = function () {
  const minMax = wordspaceMinMax;
  // happens in scale=1
  for (let i = 0; i < initMetrics.lineWidths.length; i++) {
    let tw = initMetrics.lineWidths[i];
    let lineEle = document.getElementById("l" + i);
    let step = 0.01;
    let wordSpacing = window.getComputedStyle(lineEle).wordSpacing;
    let ws = parseFloat(wordSpacing.replace('px', '')) / initMetrics.fontSize; // px => em
    let cw = lineEle.firstChild.getBoundingClientRect().width;
    for (let tries = 0; Math.abs(tw - cw) > 0.005 * initMetrics.radius && tries < 200; tries++) {
      ws += (tw > cw) ? step : -step;
      lineEle.style.wordSpacing = ws + "em";
      cw = lineEle.firstChild.getBoundingClientRect().width;
    }
    if (ws >= minMax[1]) {
      lineEle.style.wordSpacing = minMax[1] + "em";
    }
    else if (ws <= minMax[0]) {
      lineEle.style.wordSpacing = minMax[0] + "em";
    }
  }
}

const adjustWordSpace = function (lineEle, initialMetrics, minMax, padding, radius) {
  // caculation in scale=1, not current scale
  if (!Array.isArray(minMax)) throw Error('[minMax] required');

  lineEle.classList.remove("max-word-spacing");
  lineEle.classList.remove("min-word-spacing");

  let wordSpacing = window.getComputedStyle(lineEle).wordSpacing;
  let step = 0.01, scaleRatio = radius / initialMetrics.radius;
  let idx = parseInt((lineEle.id).slice(1));
  let origW = initialMetrics.lineWidths[idx];
  let currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
  let ws = parseFloat(wordSpacing.replace('px', '')) / initialMetrics.fontSize; // px => em

  // try to get within 5 pixels of current width ?
  for (let tries = 0; Math.abs(origW - currentW) > 0.005 * initMetrics.radius && tries < 200; tries++) {
    ws += (origW > currentW) ? step : -step;
    lineEle.style.wordSpacing = ws + "em";
    currentW = lineEle.firstChild.getBoundingClientRect().width / scaleRatio;
  }

  // check for extreme values
  if (ws >= minMax[1]) {
    lineEle.style.wordSpacing = minMax[1] + "em";
    //line.classList.add("max-word-spacing"); // debugging only
  }
  else if (ws <= minMax[0]) {
    lineEle.style.wordSpacing = minMax[0] + "em";
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
      (offset, radius - padding, words, fontSize, fontSize * lineHeightScale, wordSpacing, fontName);
  }
  while (result.words.length);

  // console.log('Computed fontSize:', fontSize);

  return result.rects.map((r, i) => ({ fontSize, wordSpacing, bounds: r, text: result.text[i] }));
}

/*
  parameter: offset, radius, words, fontSize, lineHeight, wordSpacing, fontName
  @return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, fontSize, lineHeight, wordSpacing, fontName) {
  // caculation in scale=1, not current scale
  //console.log('fitToLineWidths', fontSize);
  fontName = fontName || 'sans-serif';
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
  // caculation in scale=1, not current scale
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

let canvasCtx; // don't recreate canvas
const measureWidth = function (text, fontSizePx = 12, fontName = font, wordSpacing = 0) {
  // caculation in scale=1, not current scale
  canvasCtx = canvasCtx || document.createElement("canvas").getContext("2d");
  canvasCtx.font = fontSizePx + 'px ' + fontName;
  let spaceCount = text ? (text.split(" ").length - 1) : 0;
  return canvasCtx.measureText(text).width + spaceCount * (wordSpacing * fontSizePx);
}

let lineCtx; // don't recreate canvas

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

const getLineWidth = function(lineIdx) {
  //return value in scaleRatio = 1 (inital state), not current scale (width on brower window)
  let lineDiv = document.getElementById("l" + lineIdx);
  let contentSpan = lineDiv.firstChild;

  return contentSpan.getBoundingClientRect().width / getScaleRatio();
}

const getLineWidthAfterSub = function(newWord, wordIdx, lineIdx){
  //return value in scaleRatio = 1 (inital state), not current scale (width on brower window)
  let targetSpan = document.getElementById("w" + wordIdx);
  let oriWord = targetSpan.textContent;
  targetSpan.textContent = newWord;
  let targetLine = lineIdx ? document.getElementById("l" + lineIdx).firstChild : targetSpan.parentElement;
  let w = targetLine.getBoundingClientRect().width / getScaleRatio();
  targetSpan.textContent = oriWord;
  return w;
}

const getLineWidthAfterSub_old = function (text, lineIndex) {
  //return value in scaleRatio = 1 (inital state), not current scale (width on brower window)
  const line = document.querySelector("#l" + lineIndex);
  const lineCss = window.getComputedStyle(line);

  const tdisp = document.querySelector("#text-display");
  const textCss = window.getComputedStyle(tdisp);

  const wordSpacing = parseFloat(lineCss.wordSpacing.replace("px", ""));
  const scaleRatio = getScaleRatio();
  const numSpaces = text ? (text.split(" ").length - 1) : 0;

  lineCtx = lineCtx || document.createElement("canvas").getContext("2d");
  lineCtx.font = lineCss.font;

  const lineWidth = lineCtx.measureText(text).width;
  return (lineWidth + (numSpaces * wordSpacing)) * scaleRatio;
};

const getAllLineWidths = function() {
  let r = [];
  for (let index = 0; index < lines.length; index++) {
    r.push(getLineWidth(index));
  }
  return r;
}