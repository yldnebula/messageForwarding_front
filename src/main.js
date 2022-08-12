// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Valid from './utils/valid'
import multiavatar from '@multiavatar/multiavatar'

Vue.prototype.$Valid = Valid
Vue.use(ElementUI)
Vue.prototype.$EventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  data: function (){
    return {
      currentId: '2',
      onAndOff:true
    }
  }
})
