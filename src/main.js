import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './util/element-ui';
import "./assets/fonts/font001/iconfont.css";
import { API } from "./util/axios";

Vue.config.productionTip = false;
Vue.prototype.$http = API;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
