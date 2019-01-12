<template>
  <div class="container" :class="color">
    <div class="place" v-for="figure in $root.figures" :data-idx="figure"
         v-if="data = $root.getData(figure), data.color === color && data.name !== 'pawn'">
      <i v-if="figures[figure]" :class="$root.getData(figure).name + ' ' + color" :data-id="figure"></i>
    </div>
    <div class="place" v-for="figure in $root.figures" :data-idx="figure"
         v-if="data = $root.getData(figure), data.color === color && data.name === 'pawn'">
      <i v-if="figures[figure]" class="pawn" :class="color" :data-id="figure"></i>
    </div>
  </div>
</template>

<script>

  const $ = require("jquery");
  require('jquery-ui-bundle');

  export default {
    name: 'Container',
    data() {
      return {
      }
    },
    props: [
      'color',
      'figures',
    ],
    created() {
      this.setup();
    },
    methods: {

      setup() {
        var mouseEventTypes = {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup"
        };

        for (let originalType in mouseEventTypes) {
          document.addEventListener(originalType, function (originalEvent) {
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

          $('.container.' + self.color + ' i').draggable({

            revert: 'invalid',

            start: function (e, ui) {
              let $fig = $(e.target);
              $fig.data({
                id: $fig.data('id'),
                source: 'spare',
                color: self.color,
              });
            },

            drag: function (e, ui) {
              e.stopPropagation();
            },

            stop: function (e, ui) {
            }
          });
        });
      },
    },
  };

</script>

<style scoped>

  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
    padding: 0 12%;
  }

  .container.white {
    flex-wrap: wrap-reverse;
  }

  .container i {
    /*font-size: 70%;*/
  }

  .place {
    width: 12%;
    height: 12%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9vmin;
  }

  @media (orientation: landscape) {

    .container {
      flex-direction: column;
      padding: 5% 0;
    }

  }

</style>
