import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

import ElementUI from 'element-ui'
Vue.use(ElementUI)
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

import axios from 'axios'
Vue.prototype.$http = axios



import VueResource from 'vue-resource'
Vue.use(VueResource)





Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
