<template>
  <section>
      <h1>Dashboard</h1>
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

        }
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    methods: {
        
    },
}
</script>

<style>

</style>