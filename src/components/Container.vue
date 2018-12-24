<template>
  <div class="container">
    <div class="place" v-for="figure in $root.figures" :data-idx="figure"
         v-if="data = $root.getData(figure), data.color === color && data.name !== 'pawn'">
      <i v-if="figures[figure]" :class="$root.getData(figure).name + ' ' + color"></i>
    </div>
    <div class="place" v-for="figure in $root.figures" :data-idx="figure"
         v-if="data = $root.getData(figure), data.color === color && data.name === 'pawn'">
      <i v-if="figures[figure]" class="pawn" :class="color"></i>
    </div>
  </div>
</template>

<script>

  // var $ = require("jquery");
  // require('jquery-ui-bundle');

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
    methods: {
    },
  };

</script>

<style scoped>

  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-items: center;
    box-sizing: border-box;
    padding: 0 12%;
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

</style>
