/*
parameters:target, lines, opts
    opts.fontSize: float, fontSize in px
    opts.fontFamily: string, fontFamily string

return: an array of original line widths
*/
const initCircularTextDisplay = function (target, lines, opts = {}) {
    const fontSize = opts.fontSize;
    const fontFamily = opts.fontFamily;
    const dbug = opts.debug;
    //------------------
    while(target.firstChild){
        target.removeChild(target.firstChild)
    }

    //--------------------- text
    let wi = 0;
    const ws = [];
    const textContainer = document.createElement("div");
    textContainer.id = "text-display";
    if (dbug) console.log(lines.length);
    lines.forEach((l, li) => {
        let thisLineDiv = document.createElement("div");
        thisLineDiv.classList.add("line");
        const thisFontSize = l.fontSize || fontSize;
        const thisFontFamliy = l.fontFamily || fontFamily;
        if (thisFontSize) thisLineDiv.style.fontSize = thisFontSize + "px";
        if (thisFontFamliy) thisLineDiv.style.fontFamily = thisFontFamliy;
        thisLineDiv.style.top = (l.bounds[1] - l.bounds[3] / 2) + "px";
        thisLineDiv.id = "l" + li;
        //---------------------------------
        if (l.text && l.text.length > 0) {
            let words = RiTa.tokenize(l.text);
            words.forEach((w, iil) => {
                if (iil > 0) {
                    if (!RiTa.isPunct(w)) thisLineDiv.append(" ");
                }
                let thisWordSpan = document.createElement("span");
                thisWordSpan.classList.add("word");
                thisWordSpan.id = "w" + wi;
                wi++;
                thisWordSpan.innerText = w;
                thisLineDiv.append(thisWordSpan);
            });
        }
        //----------------------------------
        textContainer.append(thisLineDiv);
        ws.push(l.bounds[2]);
    });
    target.append(textContainer);
    return ws
}

/*
parameters:targetArr, opts
    opts.duration: float, in ms
    opts.strokeWidth: float,
    opts.easing: css str
    opts.trailColor: css color
    opts.color: array of css color

return: an array of original line widths
*/
const createProgressBars = function (targetArr, opts = {}) {
    const bars = [];
    targetArr.forEach((t, i) => {
        let thisProgressBar = new ProgressBar.Circle(t, {
            duration: opts.duration || 3000,
            strokeWidth: opts.strokeWidth || 1,
            easing: opts.easing || 'easeOut',
            trailColor: opts.trailColor || '#fafafa',
            color: opts.color && opts.color[i] ? opts.color[i] : "#ddd"
        });
        thisProgressBar.set((i + 1) * .20);
        bars.push(thisProgressBar);
    });
    return bars
}

/*
parameter: words, radius, opts = {}
    opts.offset : object: { x: x, y: y };
    opts.padding: float;
    opts.font: css str
    opts.fontSize: float, for init guess;
    opts.lineHeightScale: float;
    opts.lineHeight: float;
    opts.step: float, adjust step in px;
    opts.trialLimit: int
return: array of lines
*/
const dynamicCircleLayout = function (words, radius, opts = {}) {
    let offset = opts.offset || { x: 0, y: 0 };
    let padding = opts.padding || 0;
    let fontName = opts.font || 'sans-serif';
    let lineHeightScale = opts.lineHeightScale || 1.2;

    radius -= padding;
    let fontSize = radius / 4, result;
    do {
        fontSize *= .99;
        result = fitToLineWidths
            (offset, radius, words, fontSize, fontSize * lineHeightScale, fontName);
    }
    while (result.words.length);

    console.log('Computed fontSize:', fontSize);

    return result.rects.map((r, i) => ({ fontSize, bounds: r, text: result.text[i] }));
}

/*
parameter: offset, radius, words, fontSize, lineHeight, fontName
return: { text, rects, words }
*/
const fitToLineWidths = function (offset, radius, words, fontSize, lineHeight, fontName = 'sans-serif') {
    //console.log('fitToLineWidths', fontSize);
    let tokens = words.slice();
    let text = [], rects = lineWidths(offset, radius, lineHeight);
    rects.forEach(([x, y, w, h], i) => {
        let data = fitToBox(tokens, w, fontSize, fontName);
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
return: { words, text }
*/
const fitToBox = function (words, width, fontSize, fontName = 'sans-serif') {
    //console.log('fitToBox', words, width, fontSize);
    let i = 1, line = {
        text: words[0],
        width: measureWidth(words[0], fontSize, fontName)
    };
    if (line.width > width) return; // can't fit first word

    for (let n = words.length; i < n; ++i) {
        let next = ' ' + words[i];
        let nextWidth = measureWidth(next, fontSize, fontName);
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

/*
parameter: triggerByResize, oriPara
return: [fontSize, VminInPx]
*/
const caculateNewFontSize = function(triggerByResize, old){
    if(triggerByResize){
        let oldFontSize = parseFloat(window.getComputedStyle(document.getElementById("l0")).fontSize.replace(/px/g,""));
        let vmin = oldFontSize/oldvminInPx;
        let newVminInPx = Math.min(window.innerWidth/100,window.innerHeight/100);
        return[newVminInPx*vmin, newVminInPx];
    }
}

//-----------------------------------helper
const measureWidth = function(text, fontSizePx = 12, fontName = font) {
    let context = document.createElement("canvas").getContext("2d");
    context.font = fontSizePx + 'px ' + fontName;
    return context.measureText(text).width;
}

const chordLength = function (rad, d) {
    return 2 * Math.sqrt(rad * rad - (rad - d) * (rad - d));
}

const lineWidths = function (center, rad, lh) {
    let result = [];
    let num = Math.floor((rad * 2) / lh);
    let gap = ((rad * 2) - (lh * num))/2;
    for (let i = 0; i < num; i++) {
        let d = gap + lh/2 + (i * lh); // distance from top to the middle of the textline
        let cl = chordLength(rad, d > rad ? d + lh : d);
        let x = center.x - cl / 2;
        let y = center.y - (rad - d + lh/2);
        if (cl) {
            //console.log(i, d, d > r, cl);
            result.push([x, y, cl, lh]);
        }
    }
    return result;
}
