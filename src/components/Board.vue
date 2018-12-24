<template>
  <div class="board">
    <template v-for="row in [8,7,6,5,4,3,2,1]">
      <template v-for="col in 8">
        <div class="cell" :class="{dark: (col + row) % 2 === 0}" :data-col="col" :data-row="row">
          <i v-if="figure = getFigureAt(col, row)" :class="figure.name + ' ' + figure.color" :data-id="figure.id">
          </i>
        </div>
      </template>
    </template>
  </div>
</template>

<script>

  var $ = require("jquery");
  require('jquery-ui-bundle');

  export default {
    name: 'Board',
    data() {
      return {
        positions: [],
      }
    },
    created() {
      this.initial();
      this.setup();
    },
    methods: {
      getFigureAt(col, row) {
        let id = this.positions["" + col + "-" + row];
        return id ? this.$root.getData(id) : undefined;
      },
      setFigureAt(col, row, figure) {
        if (typeof figure === 'object') figure = figure.id;
        this.$set(this.positions, "" + col + "-" + row, figure);
      },
      initial() {
        this.$root.figures.forEach((id) => {
          let f = this.$root.getData(id);
          this.positions["" + f.initialColumn + "-" + f.initialRow] = id;
        });
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

            start: function (e, ui) {
              let
                $fig = $(e.target),
                $cell = $fig.closest('.cell');
              $(e.target).data({
                id: $(e.target).data('id'),
                source: 'board',
                sourceColumn: $cell.data('col'),
                sourceRow: $cell.data('row'),
              });
            },
            drag: function (e, ui) {
              e.stopPropagation();
            },
            stop: function (e, ui) {
            }
          });
          $('div.cell').droppable({
            greedy: true,
            drop: function (e, ui) {
              let
                $target = $(this), targetFigure = self.getFigureAt($target.data('col'), $target.data('row'));
              let info = ui.draggable.data();
              $(ui.draggable).css({left: '', top: ''});
              if (targetFigure && targetFigure.id !== info.id) {
                self.$emit('removed', targetFigure);
              }
              if (!targetFigure || targetFigure.id !== info.id) {
                self.setFigureAt(info.sourceColumn, info.sourceRow);
                self.setFigureAt($target.data('col'), $target.data('row'), info.id);
                self.setup();
                self.$emit('changed');
                self.$forceUpdate();
              }
            }
          });
          $("body").droppable({
            drop: function (e, ui) {
              let info = ui.draggable.data();
              $(ui.draggable).remove();
              self.$emit('removed', self.getFigureAt(info.sourceColumn, info.sourceRow));
              self.setFigureAt(info.sourceColumn, info.sourceRow);
              self.$emit('changed');
            }
          });
          // window.addEventListener("hashchange", updatePosFromHash, false);
        });
      },
    }
  }

</script>

<style scoped>

  .board {
    background-color: rgb(252, 219, 185);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  .cell {
    width: 12.2%;
    height: 12.2%;
    background-color: rgb(252, 219, 185);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12vmin;
  }

  .dark {
    background-color: #eac187;
  }

  .ui-draggable-dragging {
    z-index: 10;
  }

</style>
