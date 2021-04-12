import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import { auth } from '@/firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login',
    },

    {
      path: '/',
      redirect: '/login',
    },
  
    // {
    //   path: '/',
    //   name: 'Offline',
    //   component: () => import(/* webpackChunkName: "login" */ '../views/Offline.vue')
    // },
  
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '../views/auth/Login.vue')
    },

    {
      path: '/reload',
      name: 'Reload',
      meta: {
        auth: true,
      },
      component: () => import(/* webpackChunkName: "reload" */ '../views/error/Reload.vue')
    },
  
    {
      path: '/register',
      name: 'Register',
      component: () => import(/* webpackChunkName: "register" */ '../views/auth/Register.vue')
    },
  
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
      meta: {
        auth: true,
        role: 'restaurant',
      }
    },

    {
      path: '/history',
      name: 'History',
      component: () => import(/* webpackChunkName: "history" */ '../views/History.vue'),
      meta: {
        auth: true,
        role: 'restaurant',
      }
    },

    {
      path: '/menus',
      name: 'Menus',
      component: () => import(/* webpackChunkName: "menus" */ '../views/Menus.vue'),
      meta: {
        auth: true,
        role: 'restaurant',
      },
    },

    {
      path: '/menus/menu-details',
      name: 'MenuDetails',
      props: true, 
      component: () => import(/* webpackChunkName: "dasboard2" */ '../views/MenuDetails.vue'),
      meta: {
        auth: true,
        role: 'restaurant',
      },
    },

    { 
      path: '/admin', 
      component: () => import(/* webpackChunkName: "index" */ '../views/admin/Index.vue'),
      meta: {
        auth: true,
        role: 'admin',
      },
      children: [ 
          { path: 'dashboard', component: () => import(/* webpackChunkName: "dasboard2" */ '../views/admin/Dashboard.vue')}, 
          { path: 'users', component: () => import(/* webpackChunkName: "index2" */ '../views/admin/users/Index.vue')}, 
          { path: 'users/:uid', props: true, component: () => import(/* webpackChunkName: "users" */ '../views/admin/users/User.vue')}, 
          { path: 'restaurants', component: () => import(/* webpackChunkName: "index3" */ '../views/admin/restaurants/Index.vue')}, 
          { path: 'payments', component: () => import(/* webpackChunkName: "index4" */ '../views/admin/payments/Index.vue')}, 
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
