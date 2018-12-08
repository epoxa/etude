let
    figures = [
        ['rook', 1, 1],
        ['knight', 1, 2],
        ['bishop', 1, 3],
        ['queen', 1, 4],
        ['king', 1, 5],
        ['bishop', 1, 6],
        ['knight', 1, 7],
        ['rook', 1, 8],
        ['rook', 8, 1, 'b'],
        ['knight', 8, 2, 'b'],
        ['bishop', 8, 3, 'b'],
        ['queen', 8, 4, 'b'],
        ['king', 8, 5, 'b'],
        ['bishop', 8, 6, 'b'],
        ['knight', 8, 7, 'b'],
        ['rook', 8, 8, 'b']
    ];

for (let col = 1; col <= 8; col++) {
    figures.push(['pawn', 2, col]);
    figures.push(['pawn', 7, col, 'b']);
}

function findFigure(r, c) {
    let res = undefined;
    figures.forEach(function (fig, idx) {
        if (fig[1] === r && fig[2] === c) {
            res = {
                name: fig[0],
                black: fig[3] || "",
                idx: idx
            }
        }
    });
    return res;
}

function findFigureAt(col, row) {
    let c = undefined;
    $('i').each(function () {
        if ($(this).data("col") == col && $(this).data("row") == row) {
            c = this;
        }
    });
    return c;
}

function moveTo(el, col, row) {
    $(el).attr("data-col", col).attr("data-row", row).data("col", col).data("row", row).css("left", "").css("top", "");
}

function getOffboardPos(fig) {
    let idx = $(fig).data("idx"), orig = figures[idx];
    return {
        col: orig[2],
        row: orig[1] === 1 ? 12 : orig[1] === 2 ? 11 : orig[1] === 7 ? 10 : 9
    };
}

const FIGURES = {K: "king", Q: "queen", B: "bishop", N: "knight", R: "rook", p: "pawn"};

function packPosition() {
    let all = '';
    ['w', 'b'].forEach(function (color) {
        if (all) all = all.concat('-');
        all = all.concat(color, ':');
        $.each(FIGURES, function (letter, cls) {
            let part = "", $figures = $('i.' + cls);
            if (color === 'w') $figures = $figures.not('.b');
            else $figures = $figures.filter('.b');
            $figures.each(function () {
                if (!part) part = part.concat(letter);
                let row = $(this).data('row');
                if (row <= 8) {
                    let col = String.fromCharCode('a'.charCodeAt(0) + $(this).data('col') - 1);
                    part = part.concat(col, row);
                }
            });
            all = all.concat(part);
        });
    });
    return all;
}

function parsePosition(all) {
    all = all.split('-');
    if (all.length !== 2) return;
    if (all[0].substring(0, 2) !== 'w:' || all[1].substring(0, 2) !== 'b:') return;
    $('i').each(function (idx, el) {
        let pos = getOffboardPos(el);
        moveTo(el, pos.col, pos.row);
    });
    all = {
        w: all[0].substring(2),
        b: all[1].substring(2)
    };
    $.each(all, function (color, str) {
        str = str.split('');
        let next = str.shift();
        while (next) {
            let cls = FIGURES[next];
            if (!cls) return; // error
            let $figures = $('i.' + cls);
            if (color === 'w') $figures = $figures.not('.b');
            else $figures = $figures.filter('.b');
            let idx = 0;
            next = str.shift();
            while (next >= 'a' && next <= 'h') {
                let col = next.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
                let row = str.shift();
                if (row < '1' || row > '8') return; // error
                figure = $figures.get(idx++);
                if (!figure) return; // error;
                moveTo(figure, col, row);
                next = str.shift();
            }
        }
    });
    return true; // Success
}

for (let row = 1; row <= 8; row++) {
    for (let col = 1; col <= 8; col++) {
        let i = (100 - row - col) % 2 === 1 ? "" : "b";
        document.write("".concat(
            '<div class="', i, '" data-col="', col, '" data-row="', row, '"></div>'
        ));
        let fig = findFigure(row, col);
        if (fig) {
            document.write("".concat(
                '<i data-idx="', fig.idx, '" data-col="', col, '" data-row="', row,
                '" class="', fig.name, ' ', fig.black, '"></i>'
            ));
        }
    }
}

if (location.hash) {
    updatePosFromHash();
} else {
    updatePosHash();
}

var hashUpdatingFlag = false;

function updatePosHash() {
    hashUpdatingFlag = true;
    try {
        location.hash = 'pos=' + packPosition();
    } finally {
        setTimeout(function () {
            hashUpdatingFlag = false;
        }, 0);
    }
}

function updatePosFromHash() {
    if (hashUpdatingFlag) return;
    let
        parser = new URLSearchParams(location.hash.substring(1)),
        pos = parser.get('pos');
    if (pos) {
        parsePosition(pos)
    }
}


var mouseEventTypes = {
    touchstart : "mousedown",
    touchmove : "mousemove",
    touchend : "mouseup"
};

for (originalType in mouseEventTypes) {
    document.addEventListener(originalType, function(originalEvent) {
        event = document.createEvent("MouseEvents");
        touch = originalEvent.changedTouches[0];
        event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
            window, 0, touch.screenX, touch.screenY, touch.clientX,
            touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
            touch.metaKey, 0, null);
        originalEvent.target.dispatchEvent(event);
    });
}

$(function () {

    $('i').draggable({
        start: function (e, ui) {
        },
        drag: function (e, ui) {
            e.stopPropagation();
        },
        stop: function (e, ui) {
        }
    });
    $('div').not('.desk').droppable({
        greedy: true,
        drop: function (e, ui) {
            let $cell = $(this), col = $cell.data("col"), row = $cell.data("row"), fig = findFigureAt(col, row);
            if (fig && $(fig).data("idx") !== $(ui.draggable).data("idx")) {
                let p = getOffboardPos(fig);
                moveTo(fig, p.col, p.row);
            }
            moveTo(ui.draggable, col, row);
            updatePosHash();
        }
    });
    $("body").droppable({
        drop: function (e, ui) {
            let p = getOffboardPos(ui.draggable);
            moveTo(ui.draggable, p.col, p.row);
            updatePosHash();
        }
    });
    window.addEventListener("hashchange", updatePosFromHash, false);

});
