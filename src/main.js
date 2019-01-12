// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlayCircle, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add([faPlayCircle, faPlay, faStop]);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: function() {
    const figures = [
      'rook-w-1',
      'knight-w-2',
      'bishop-w-3',
      'queen-w-4',
      'king-w-5',
      'bishop-w-6',
      'knight-w-7',
      'rook-w-8',
      'rook-b-1',
      'knight-b-2',
      'bishop-b-3',
      'queen-b-4',
      'king-b-5',
      'bishop-b-6',
      'knight-b-7',
      'rook-b-8',
    ];

    for (let col = 1; col <= 8; col++) {
      figures.push('pawn-w-' + col);
      figures.push('pawn-b-' + col);
    }

    return {
      figures: figures,
    };
  },
  methods: {
    getData(figure) {
      let i = figure.split('-');
      return {
        id: figure,
        name: i[0],
        color: i[1] === 'w' ? 'white' : 'black',
        abbreviation: i[0] === 'pawn' ? 'p' : i[0] === 'knight' ? 'N' : i[0].charAt(0).toUpperCase(),
        initialColumn: +i[2],
        initialRow: i[1] === 'w' ? (i[0] === 'pawn' ? 2 : 1) : (i[0] === 'pawn' ? 7 : 8),
      };
    },
  },
  components: { App },
  template: '<App/>'
});
