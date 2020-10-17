import Vue from 'vue'
import VueRouter from 'vue-router'

import { auth } from '@/firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
  
    {
      path: '/',
      redirect: '/login',
    },
  
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "about" */ '../views/auth/Login.vue')
    },
  
    {
      path: '/register',
      name: 'Register',
      component: () => import(/* webpackChunkName: "about" */ '../views/auth/Register.vue')
    },
  
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
      meta: {
        auth: true,
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = auth.currentUser
  console.log(user)
  let autorization = to.matched.some(record => record.meta.auth)

  if (autorization && !user) {
    next('/login')
  }else if (!autorization && user){
    next('/dashboard')
  }else{
    next()
  }
})

export default router
