<template>
  <div class="layout">
    <Container color="black" :figures="spares.black"></Container>
    <Board class="board" @removed="removed"></Board>
    <Container color="white" :figures="spares.white"></Container>
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
      }
    }
  },
  methods: {
    removed(figure) {
      console.log(figure);
      this.$set(this.spares[figure.color],[figure.id],true);
    }
  },
  components: {
    Board,
    Container,
  }
}
</script>

<style scoped>

  .layout {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .board {
    height: 100vh;
    width: 100vw;
  }

  @media (orientation: portrait) {

    .layout {
      flex-direction: column;
    }

    .container, .board {
      width: 100vw;
      max-width: 68vh;
    }

    .board {
      flex-grow: 1;
      max-height: 100vw;
    }

    .container {
      height: 24vw;
      max-height: 16vh;
    }

  }

  @media (orientation: landscape) {

    .layout {
      flex-direction: row;
    }

    .container, .board {
      height: 100vh;
      max-height: 68vw;
    }

    .board {
      flex-grow: 1;
      max-width: 100vh;
    }

    .container {
      width: 24vh;
      max-width: 16vw;
    }

  }

</style>
