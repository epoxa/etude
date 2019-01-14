<!--suppress JSUnfilteredForInLoop -->
<template>
  <div class="board">
    <template v-for="row in [8,7,6,5,4,3,2,1]">
      <template v-for="col in 8">
        <div class="cell" :class="{dark: (col + row) % 2 === 0}" :data-col="col" :data-row="row">
          <i v-if="figure = getFigureAt(col, row)" :class="figure.name + ' ' + figure.color"
             :data-id="figure.id" :key="figure.id" :data-color="figure.color">
          </i>
        </div>
      </template>
    </template>
  </div>
</template>

<script>

  const $ = require("jquery");
  require('jquery-ui-bundle');

  export default {
    name: 'Board',
    props: {
      mode: {
        type: String,
        default: 'mastering',
        validator: (value) => ['mastering', 'game'].indexOf(value) > -1,
      },
    },
    data() {
      return {
        positions: {},
        enPassant: null,
        turn: 'white',
      }
    },
    created() {
      this.initial();
      this.setup();
    },
    // render (h) {
    //   console.log('Board render');
    //   let cells = [], self = this;
    //   [8,7,6,5,4,3,2,1].forEach(function (row) {
    //     [1,2,3,4,5,6,7,8].forEach(function (col) {
    //       let figures = [], fig = self.getFigureAt(col, row);
    //       if (fig) figures.push(h('i', {
    //         class: [fig.name, fig.color],
    //         attrs: {
    //           'data-id': fig.id,
    //           'key': fig.id,
    //         },
    //       }));
    //       cells.push(h('div',
    //         {
    //           class: {
    //             cell: true,
    //             dark: (col + row) % 2 === 0,
    //           },
    //           attrs: {
    //             'data-col': col,
    //             'data-row': row,
    //           },
    //         },
    //         figures
    //       ));
    //     })
    //   });
    //   return h('template', cells);
    // },
    methods: {
      getFigureAt(col, row) {
        let id = this.positions["" + col + "-" + row];
        return id ? this.$root.getData(id) : undefined;
      },
      setFigureAt(col, row, figure) {
        if (typeof figure === 'object') figure = figure.id;
        console.info('set', col, row, figure);
        let pos = `${col}-${row}`;
        if (figure) {
          this.$set(this.positions, pos, figure);
        } else {
          this.$delete(this.positions, pos);
        }
      },
      findPositionOf(id) {
        for (let p in this.positions) {
          if (this.positions[p] === id) return p.split('-').map(coord => +coord); // Convert to integers
        }
        return [undefined, undefined];
      },
      packPosition() {
        "use strict";
        let all = '';
        ['white', 'black'].forEach(color => {
          if (all) all = `${all}-`;
          all = `${all}${color.substring(0, 1)}:`;
          this.$root.figures.forEach(id => {
            let c, r;
            [c, r] = this.findPositionOf(id);
            if (!c) return;
            let f = this.$root.getData(id);
            if (f.color !== color) return;
            c = String.fromCharCode('a'.charCodeAt(0) + c - 1);
            all = all.concat(f.abbreviation, c, r);
          }, this);
        }, this);
        return all;
      },
      parsePosition(all) {
        all = all.split('-');
        if (all.length !== 2) return false;
        if (all[0].substring(0, 2) !== 'w:' || all[1].substring(0, 2) !== 'b:') return false;
        all = {
          white: all[0].substring(2),
          black: all[1].substring(2)
        };
        let used = {}, newPositions = {}, ok = true, $root = this.$root;
        function findUnused(abbr, color) {
          return $root.figures.reduce((found, id) => {
            if (found) return found;
            if (used[id]) return null;
            let fig = $root.getData(id);
            if (fig.abbreviation === abbr && fig.color === color) {
              used[id] = true;
              return id;
            }
          }, null);
        }
        $.each(all, function (color, str) {
          if (!ok) return;
          str = str.split('');
          let next = str.shift();
          while (next) {
            let id = findUnused(next, color);
            if (!id) {
              ok = false;
              return;
            }
            next = str.shift();
            while (next >= 'a' && next <= 'h') {
              let col = next.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
              let row = str.shift();
              if (row < '1' || row > '8') {
                ok = false;
                return;
              }
              newPositions[`${col}-${row}`] = id;
              next = str.shift();
            }
          }
        });
        if (ok) {
          this.positions = newPositions;
        }
        return ok;
      },
      empty() {
        this.positions = {};
        this.enPassant = null;
        this.turn = 'white';
      },
      initial() {
        this.$root.figures.forEach((id) => {
          let f = this.$root.getData(id);
          this.positions["" + f.initialColumn + "-" + f.initialRow] = id;
        }, this);
        this.enPassant = null;
        this.turn = 'white';
      },
      setup() {
        var mouseEventTypes = {
          touchstart : "mousedown",
          touchmove : "mousemove",
          touchend : "mouseup"
        };

        for (let originalType in mouseEventTypes) {
          document.addEventListener(originalType, function(originalEvent) {
            let event = document.createEvent("MouseEvents");
            let touch = originalEvent.changedTouches[0];
            event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true,
              window, 0, touch.screenX, touch.screenY, touch.clientX,
              touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey,
              touch.metaKey, 0, null);
            originalEvent.target.dispatchEvent(event);
          });
        }

        let self = this;

        $(function () {

          $('.board i').draggable({

            revert: 'invalid',

            start(e, ui) {
              let
                $fig = $(e.target),
                $cell = $fig.closest('.cell'),
                c = $cell.data('col'),
                r = $cell.data('row');
              $fig.data({
                id: $fig.data('id'),
                source: 'board',
                sourceColumn: c,
                sourceRow: r,
                allowedMoves: self.mode === 'mastering' ? [] : self.getAllowedMoves(c, r),
              });
              if (self.mode === 'game' && self.turn !== $fig.data('color')) return false;
            },

            drag(e, ui) {
              e.stopPropagation();
            },

            stop(e, ui) {
            }
          });

          $('div.cell').droppable({

            greedy: true,

            accept(draggable) {
              if (self.mode === 'mastering') return true;
              let
                info = draggable.data(),
                $target = $(this),
                r = $target.data('row'),
                c = $target.data('col');
              return info.allowedMoves.reduce(function (found, cell) {
                return found || (cell[0] === c && cell[1] === r);
              }, false);
            },

            drop(e, ui) {
              let
                $target = $(this), targetCol = $target.data('col'), targetRow = $target.data('row'),
                targetFigure = self.getFigureAt(targetCol, targetRow),
                info = ui.draggable.data(), fig = self.$root.getData(info.id);
              $(ui.draggable).css({left: '', top: ''});
              if (targetFigure && targetFigure.id !== fig.id) {
                self.$emit('removed', targetFigure);
              }
              if (!targetFigure || targetFigure.id !== fig.id) {
                if (info.source === 'board') {
                  self.setFigureAt(info.sourceColumn, info.sourceRow);
                } else {
                  self.$emit('added', info);
                }
                self.setFigureAt(targetCol, targetRow, info.id);
                self.$emit('changed', {
                  move: `${fig.abbreviation} ${info.sourceColumn}${info.sourceRow}${targetFigure?':':'-'}${targetCol}${targetRow}`,
                  position: self.packPosition(),
                  enPassant: null, // TODO
                });
                self.setup();
                if (self.mode === 'game') self.turn = self.changeColor(self.turn);
              }
              self.$forceUpdate(); // TODO: Why it does not work without this?
            }
          });

          $("body").droppable({
            accept: function(draggable) {
              let info = draggable.data();
              return info.source === 'board' && self.mode === 'mastering';
            },
            drop: function (e, ui) {
              let info = ui.draggable.data();
              if (info.source === 'board') {
                // $(ui.draggable).remove();
                self.$emit('removed', self.getFigureAt(info.sourceColumn, info.sourceRow));
                self.setFigureAt(info.sourceColumn, info.sourceRow);
                self.$emit('changed');
                self.$forceUpdate(); // TODO: Why it does not work without this?
              } else {
                console.warn('Wrong source when drop on body:', info.source);
                return false;
              }
            }
          });
          // window.addEventListener("hashchange", updatePosFromHash, false);
        });
      },
      isOnBoard(c, r) {
        return c >= 1 && c <= 8 && r >= 1 && r <= 8;
      },
      isFree(c, r) {
        return !this.positions["" + c + "-" + r] && this.isOnBoard(c, r);
      },
      getAllowedMoves(c, r, forCoverage) {
        let self = this, oldPos = `${c}-${r}`, o, moves = [], f = this.getFigureAt(c, r);
        if (!f) return [];
        function addIfNotCheck(newCol, newRow) {
          if (forCoverage) {
            moves.push([newCol, newRow]);
            return;
          }
          let
            newPos = `${newCol}-${newRow}`,
            wasFig = self.positions[newPos];
          self.positions[newPos] = f.id;
          delete self.positions[oldPos];
          if (!self.hasCheck(f.color)) moves.push([newCol, newRow]);
          self.positions[newPos] = wasFig;
          self.positions[oldPos] = f.id;
        }
        switch (f.name) {
          case 'pawn':
            let d = f.color === 'white' ? 1 : -1;
            if (!this.isOnBoard(c, r + d)) return [];
            let nextFree = this.isFree(c, r + d);
            if (nextFree && !forCoverage) addIfNotCheck(c, r + d); // Simple pawn move
            [-1, 1].forEach((s) => {
              let o = this.getFigureAt(c + s, r + d);
              if (o && o.color !== f.color || !o && forCoverage) {
                addIfNotCheck(c + s, r + d); // Pawn capture enemy
                // TODO: En passant
              }
            }, this);
            if (!forCoverage && r === f.initialRow && nextFree && this.isFree(c, r + d * 2)) {
              addIfNotCheck(c, r + d * 2); // Double initial move
            }
            break;
          case 'knight':
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach((d) => {
              let col = c + d[0], row = r + d[1];
              if (!this.isOnBoard(col, row)) return;
              o = this.getFigureAt(col, row);
              if (!o || o.color !== f.color) {
                addIfNotCheck(col, row);
              }
            }, this);
            break;
          case 'king':
          case 'queen':
          case 'bishop':
          case 'rook':
            [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach((d) => {
              let dc = d[0], dr = d[1], diag = Math.abs(dc) === Math.abs(dr);
              if (diag && f.name === 'rook' || !diag && f.name === 'bishop') return;
              let col = c, row = r;
              do {
                col = col + dc; row = row + dr;
                if (!this.isOnBoard(col, row)) return;
                o = this.getFigureAt(col, row);
                if (!o || o.color !== f.color) {
                  addIfNotCheck(col, row);
                }
                if (o || f.name === 'king') return;
              } while (true);
            }, this);
            if (!forCoverage && f.name === 'king' && f.initialColumn === c && f.initialRow === r) {
              // Castling
              let cover = this.getCoverage(this.changeColor(f.color));
              [{col: 1, d: -1}, {col: 8, d: 1}].forEach(setup => {
                let rook = this.getFigureAt(setup.col, r);
                if (rook && rook.initialRow === r && rook.initialColumn === setup.col) {
                  if (cover.has(`${c + setup.d}-${r}`) || cover.has(`${c + 2 * setup.d}-${r}`)) return;
                  let currCol = c + setup.d;
                  while (currCol !== setup.col) {
                    if (this.positions[`${currCol}-${r}`]) return;
                    currCol = currCol + setup.d;
                  }
                  moves.push([c + 2 * setup.d, r]);
                }
              }, this);
            }
            break;
          default: throw "Unknown figure " + f.name;
        }
        return moves;
      },
      changeColor(color) {
        return color === 'white' ? 'black' : 'white';
      },
      hasCheck(color) {
        let
          kingPos = this.findPositionOf(`king-${color.substring(0, 1)}-5`),
          otherColor = this.changeColor(color),
          otherCoverage = this.getCoverage(otherColor);
        return otherCoverage.has(`${kingPos[0]}-${kingPos[1]}`);
      },
      getCoverage(color) {
        let cells = new Set();
        this.$root.figures.forEach(id => {
          let c, r;
          [c, r] = this.findPositionOf(id);
          if (!c) return;
          let f = this.$root.getData(id);
          if (f.color !== color) return;
          this.getAllowedMoves(c, r, true).forEach(cell => {
            cells.add(`${cell[0]}-${cell[1]}`);
          }, this);
        }, this);
        return cells;
      },
    }
  }

</script>

<style scoped lang="less">

  @import "../config.less";

  .board {
    background-color: @white-cell-color;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  .cell {
    width: 12.2%;
    height: 12.2%;
    background-color: @white-cell-color;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12vmin;
  }

  .dark {
    background-color: @black-cell-color;
  }

</style>
