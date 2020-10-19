import Vue from 'vue';

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import options from "../component/options.vue";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.mixin({
    methods: {
        i18n: chrome.i18n.getMessage,
    }
});

new Vue({
    'el': '#app',
    components: {
        'app-root': options
    }
});
