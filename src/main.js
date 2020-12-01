import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from '@/firebase'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import VueGoodTable from 'vue-good-table';
// import the styles
import 'vue-good-table/dist/vue-good-table.css'

Vue.use(VueGoodTable);

import { GooglePlacesAutocomplete } from 'vue-better-google-places-autocomplete'
Vue.component('google-places-autocomplete', GooglePlacesAutocomplete)

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


