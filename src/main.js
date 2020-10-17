import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from '@/firebase'

Vue.config.productionTip = false

auth.onAuthStateChanged((user) => {
    if (user) {
        store.dispatch('getUser', user.uid)
        // store.commit('updateUser', user)
    }else{
        store.dispatch('closeSesion')
    }
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
})


