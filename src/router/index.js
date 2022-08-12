import Vue from 'vue'
import Router from 'vue-router'
// import Client from '../components/Client'
import Login from '../views/Login'
import Client2 from '../views/Client2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/client',
      name: 'Client2',
      component: Client2
    }
  ]
})
