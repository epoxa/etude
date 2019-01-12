<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style rel="stylesheet/less" lang="less">

  @import "config.less";

  html, body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
    background-color: @table-color;
  }

  i {
    font-style: normal;
  }

  .ui-draggable-dragging {
    z-index: 10;
  }

  i.black {
    color: @black-figure-color;
  }

  i.white {
    color: @white-figure-color;
  }

  /* Ладья */

  .rook::before {
    content: "\265C";
  }

  /* Конь */

  .knight::before {
    content: "\265E";
  }

  /* Слон */

  .bishop::before {
    content: "\265D";
  }

  /* Король */

  .king::before {
    content: "\265A";
  }

  /* Ферзь */

  .queen::before {
    content: "\265B";
  }

  /* Пешка */

  .pawn::before {
    content: "\265F";
  }

</style>
