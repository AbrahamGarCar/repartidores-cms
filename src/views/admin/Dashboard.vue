<template>
  <section class="col-md-12">
      <div class="row">
          <div class="col-md-4" v-if="information.users != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Usuarios registrados</h4>
                    <p>{{ information.users }}</p>
                </div>
                
          </div>
          <div class="col-md-4" v-if="information.orders != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Ordenes registradas</h4>
                    <p>{{ information.orders }}</p>
                </div>
                
          </div>
          <div class="col-md-4" v-if="information.restaurants != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Establecimientos registradas</h4>
                    <p>{{ information.restaurants }}</p>
                </div>
                
          </div>
      </div>
  </section>
</template>

<script>
//Vuex
import { mapState } from 'vuex'

//Firebase
import { firebase, db, firestore } from '@/firebase'

//Vuelidate
import { required, minLength, between } from 'vuelidate/lib/validators'

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

//Luxon
const { DateTime } = require("luxon");

//Moment
const moment = require('moment-timezone');

export default {
    name: 'Dashboard',

    data(){
        return{
            information: {
                users: null,
                orders: null,
                restaurants: null,
            }
        }
    },

    mounted() {
        this.getData()
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    methods: {
        async getData(){
            try {
                let users = await db.collection('users').doc('counter').get()
                if (users) {
                    this.information.users = users.data().usersCount
                }
                let orders = await db.collection('orders').doc('counter').get()
                if (orders) {
                    this.information.orders = orders.data().ordersCount
                }
                let restaurants = await db.collection('restaurants').doc('counter').get()
                if (restaurants) {
                    this.information.restaurants = restaurants.data().restaurantsCount
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style>

</style>