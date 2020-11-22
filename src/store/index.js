import Vue from 'vue'
import Vuex from 'vuex'

import { auth, db } from '@/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
    },

    mutations: {
        updateUser(state, payload) {
            state.user = payload
        },
    },
    
    actions: {
        closeSesion: function({ commit }) {
            auth.signOut()
            commit('updateUser', null)
        },

        async getUser({ commit, getters }, uid) {
            try {
                let document = await db.collection('users').doc(uid).get()

                if (document.exists) {
                    let user = document.data()

                    // if (user.restaurant) {
                    //     let restaurant = await db.collection('restaurants').doc(user.restaurant).get()
                    //     if (restaurant.exists) {
                    //         Object.defineProperty(user, 'restaurantObject', {
                    //             enumerable: true,
                    //             configurable: true,
                    //             writable: true,
                    //             value: 'static'
                    //         });
                    //     }
                    // }
                    commit('updateUser', user)
                }

            } catch (error) {
                console.log(error);
            }
        }
    },
    modules: {
    }
})
