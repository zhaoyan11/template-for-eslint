import { createApp } from 'vue';
import '@/style.css';
import App from '@/App.vue';
import router from '@/router/index';

import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

createApp(App).use(router).mount('#app');
