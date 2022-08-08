import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Client from '../components/Client'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/1',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Client',
      component: Client
    }
  ]
})
