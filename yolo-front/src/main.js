import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/variables.scss';
import router from './router';

/* 引入 Font Awesome 核心组件 */
import { library } from '@fortawesome/fontawesome-svg-core';
/* 引入图标组件 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* 引入需要的图标 */
import { 
  faGauge, faGear, faUsers, faGamepad, 
  faFilm, faDice, faPlane, faRightToBracket,
  faTriangleExclamation, faCode,
  // 新增图标
  faUtensils, faBookOpen, faClipboardList,
  faWineGlass, faBeerMugEmpty, faClock,
  faBook, faDumbbell
} from '@fortawesome/free-solid-svg-icons';

/* 添加图标到库中 */
library.add(
  faGauge, faGear, faUsers, faGamepad,
  faFilm, faDice, faPlane, faRightToBracket,
  faTriangleExclamation, faCode,
  // 新增图标
  faUtensils, faBookOpen, faClipboardList,
  faWineGlass, faBeerMugEmpty, faClock,
  faBook, faDumbbell
);

const app = createApp(App);
const pinia = createPinia();

/* 注册全局组件 */
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.mount('#app');