import { createApp } from 'vue'
import options from "../component/options.vue"
import 'normalize.css/normalize.css'

const app = createApp(options)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')
