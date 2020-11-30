<style>
    .item-link{
        color: black;
        text-decoration: none;
    }

    .item-link:hover{
        text-decoration: none;
    }
</style>

<template>
    <div class="row mt-2">
        <div class="col-md-12" v-if="user.role == 'admin'">
            <div class="row">
                <div class="col-md-2">
                    <ul class="list-group rounded-0">
                        <li class="list-group-item">
                            <router-link class="nav-link item-link" to="/admin/dashboard">Dashboard</router-link>
                        </li>
                        <li class="list-group-item">
                            <router-link class="nav-link item-link" to="/admin/users">Usuarios</router-link>
                        </li>
                        <li class="list-group-item">
                            <router-link class="nav-link item-link" to="/admin/restaurants">Restaurantes</router-link>
                        </li>
                        <li class="list-group-item">
                            <router-link class="nav-link item-link" to="/admin/payments">Pagos</router-link>
                        </li>
                    </ul>
                </div>
                <div class="col-md-10">
                    <div class="card rounded-0">
                        <div class="card-body rounded-0">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="col-md-12 text-center">
            <img src="../../assets/images/not-permissions.png" width="30%" style="border-radius: 20px;" alt="">
            <h2>No permitido</h2>
        </div>
    </div>
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
    name: 'Admin',

    data(){
        return{

        }
    },

    beforeRouteUpdate (to, from, next) {
        if (this.user.role != 'admin') {
            next('/dashboard')
            console.log('No deberias estar aqui');
        }else{
            next()
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },
}
</script>