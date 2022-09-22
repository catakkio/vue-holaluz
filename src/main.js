import { createApp } from 'vue'
import App from './App.vue'

import './styles/app.scss';

if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mocks/browser')
    worker.start()
}

createApp(App).mount('#app')
