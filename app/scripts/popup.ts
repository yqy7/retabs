import {createApp} from 'vue'
import popup from "../component/popup.vue"
import 'normalize.css/normalize.css'

const app = createApp(popup)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')
