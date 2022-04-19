import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Particles from 'particles.vue3'
import router from './router'
import App from './App.vue'

const store = createPinia()
let app = createApp(App)

app.use(router)
app.use(store)
app.use(Particles)
app.mount('#app')