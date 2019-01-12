<template>
  <div class="layout">
    <div class="editor">
      <img src="../assets/img/clock.svg" v-if="mode === 'game'" :class="'turn-' + $refs.board.turn" alt="">
      <Container color="black" :figures="spares.black" ref="blackContainer" v-if="mode === 'mastering'"></Container>
      <Board class="board" :mode="mode" @removed="removed" @added="added" @changed="changed" ref="board"></Board>
      <Container color="white" :figures="spares.white" ref="whiteContainer" v-if="mode === 'mastering'"></Container>
    </div>
    <div class="controls" v-if="mode === 'mastering'">
      <font-awesome-icon icon="play" class="icon-l-b" @click="run"></font-awesome-icon>
    </div>
    <div class="controls" v-if="mode === 'game'">
      <font-awesome-icon icon="stop" class="icon-l-b" @click="stop"></font-awesome-icon>
    </div>
  </div>
</template>

<script>

import Board from './Board.vue';
import Container from './Container.vue';

export default {
  data () {
    return {
      spares: {
        white: {},
        black: {},
      },
      mode: 'mastering',
    }
  },
  methods: {
    removed(figure) {
      console.log('removed', figure);
      this.$set(this.spares[figure.color],[figure.id],true);
    },
    added(figure) {
      console.log('added', figure);
      this.$set(this.spares[figure.color],[figure.id],false);
    },
    update: function () {
      // this.$refs.board.$forceUpdate();
      this.$refs.blackContainer.setup();
      // this.$refs.blackContainer.$forceUpdate();
      this.$refs.whiteContainer.setup();
      // this.$refs.whiteContainer.$forceUpdate();
      // this.$forceUpdate();
      console.log('changed!');
    },
    setupDragAndDrop: function () {
      this.$refs.blackContainer.setup();
      this.$refs.whiteContainer.setup();
    },
    changed() {
      // this.update();
      if (this.mode === 'mastering') {
        this.$nextTick(this.setupDragAndDrop);
      }
      location.hash = '?pos=' + this.$refs.board.packPosition();
    },
    run() {
      this.mode = 'game';
    },
    stop() {
      this.mode = 'mastering';
    },
  },
  components: {
    Board,
    Container,
  }
}
</script>


<style scoped lang="less">

  @import "../config.less";

  .layout {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .editor {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-grow: 1;
    position: relative;
  }

  .turn-black, .turn-white {
    position: absolute;
    width: 12vmin;
    left: 2vmin;
  }

  .turn-black {
    color: @black-figure-color;
    top: 2vmin;
  }

  .turn-white {
    color: @white-figure-color;
    bottom: 2vmin;
  }

  .controls {
    background-color: @control-bar-color;
    box-sizing: border-box;
    padding: 3vmin;
  }

  .controls svg {
    font-size: 6vh;
    color: @control-color;
  }

  @media (orientation: portrait) {

    .layout, .editor {
      flex-direction: column;
    }

    .container {
      width: 100vw;
      height: 24vw;
      max-height: 16vh;
    }

    .board {
      width: 100vw;
      height: 100vw;
      max-width: 58vh;
      max-height: 58vh;
    }

    .controls {
      width: 100vw;
      height: 10vh;
    }

  }

  @media (orientation: landscape) {

    .layout, .editor {
      flex-direction: row;
    }

    .container {
      width: 24vh;
      height: 100vh;
      max-width: 16vw;
    }

    .board {
      height: 100vh;
      width: 100vh;
      max-width: 58vw;
      max-height: 58vw;
    }

    .controls {
      height: 100vh;
      width: 10vw;
    }

  }

</style>
