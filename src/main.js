import KnobControl from 'vue-knob-control'

import Vue from 'vue';
import App from './App.vue';
Vue.use(KnobControl);

new Vue({
    render: (h) => h(App),
}).$mount('#app');