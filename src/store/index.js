import Vue from 'vue';
import Vuex from 'vuex';

import ListStore from '@/store/list-store';

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        // 필수
        counts: ListStore,
    },
});

console.log('index.js', 'ㅁㅁ'); // store.state 필수

export default store;
