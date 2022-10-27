import { createApp } from 'vue'
import './normalize.css'
import './style.scss'
import router from './router.js'
import Root from './Root.vue'

createApp(Root)
.use(router)
.mount('#app')
