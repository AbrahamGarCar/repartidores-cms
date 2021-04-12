<template>
    <div id="app" style="background-color: #F0F2F5;">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <router-link class="navbar-brand" to="/dashboard">
                    <img src="./assets/logo.png" width="15%">
                </router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div v-if="user == null" class="navbar-nav ml-auto">
                        <router-link class="nav-link" to="/">Ingresar</router-link>
                        <router-link class="nav-link" to="/"></router-link>
                    </div>
                    <div v-else class="navbar-nav ml-auto">
                        <router-link v-if="user.role == 'admin'" class="nav-link" to="/admin/dashboard">Administrador</router-link>
                        <router-link v-if="user.role == 'restaurant'" class="nav-link" to="/dashboard">Dashboard</router-link>
                        <router-link v-if="user.role == 'restaurant'" class="nav-link" to="/history">Historial</router-link>
                        <router-link v-if="user.role == 'restaurant'" class="nav-link" to="/menus">Menus</router-link>
                        <div class="nav-item dropdown">

                            <a class="nav-link dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{ user.name }}
                            </a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button class="dropdown-item" type="button" @click="logOut">Salir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <section class="container-fluid pb-5">
            <router-view/>
        </section>
    </div>
</template>

<script>
//Firebase
import { auth, db } from '@/firebase'

//Vuex
import { mapState } from 'vuex'

export default {
    name: 'Layout',

    data(){
        return{
            // user: {}
        }
    },

    created() {

    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        logOut(){
            auth.signOut().then(() => this.$router.replace('login'))
            
        }
    },
}
</script>

<style>

</style>