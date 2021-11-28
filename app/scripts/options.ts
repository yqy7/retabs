import {createApp} from 'vue'
import options from "../component/options.vue"
import 'normalize.css/normalize.css'
import {createRouter, createWebHashHistory} from 'vue-router'
import optionsPage from "../component/optionsPage.vue"
import historyPage from "../component/historyPage.vue"
import sessionPage from "../component/sessionPage.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/options'
        },
        {
            path: '/options',
            component: optionsPage
        },
        {
            path: '/history',
            component: historyPage
        },
        {
            path: '/session',
            component: sessionPage
        }
    ]
})

const app = createApp(options)
app.use(router)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')
