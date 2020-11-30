import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

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
      path: '/reload',
      name: 'Reload',
      meta: {
        auth: true,
      },
      component: () => import(/* webpackChunkName: "about" */ '../views/error/Reload.vue')
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
        role: 'restaurant',
      }
    },

    { 
      path: '/admin', 
      component: () => import(/* webpackChunkName: "about" */ '../views/admin/Index.vue'),
      meta: {
        auth: true,
        role: 'admin',
      },
      children: [ 
          { path: 'dashboard', component: () => import(/* webpackChunkName: "about" */ '../views/admin/Dashboard.vue')}, 
          { path: 'users', component: () => import(/* webpackChunkName: "about" */ '../views/admin/users/Index.vue')}, 
          { path: 'restaurants', component: () => import(/* webpackChunkName: "about" */ '../views/admin/restaurants/Index.vue')}, 
          { path: 'payments', component: () => import(/* webpackChunkName: "about" */ '../views/admin/payments/Index.vue')}, 
      ] 
    },
  ]
})

router.beforeEach((to, from, next) => {

  let user = auth.currentUser
  let profile = store.state.user

  console.log(profile);


  let autorization = to.matched.some(record => record.meta.auth)
  let role = to.matched.some(record => record.meta.role)

  if (autorization && !user) {
    next('/login')
  }else if (!autorization && user){
    next('/dashboard')
  }else{
    next()
  }
})

export default router
