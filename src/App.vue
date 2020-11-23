<template>
    <div id="app" style="background-color: #F0F2F5;">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <img src="./assets/logo.png" width="15%">
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div v-if="user == null" class="navbar-nav ml-auto">
                        <router-link class="nav-link" to="/">Iniciar sesion</router-link>
                        <router-link class="nav-link" to="/register">Registrarse</router-link>
                    </div>
                    <div v-else class="navbar-nav ml-auto">
                        <router-link class="nav-link" to="/admin/users">Administrador</router-link>
                        <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
                        <div class="nav-item dropdown">
                            
                            <a class="nav-link dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{ user.name }}
                            </a>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <router-link class="dropdown-item" to="#">Perfil</router-link>
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
        Status(){
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var isAnonymous = user.isAnonymous;
                    var uid = user.uid;
                    var providerData = user.providerData;
                    // ...
                } else {
                    // User is signed out.
                    // ...
                }
                });
        },

        logOut(){
            auth.signOut().then(() => this.$router.replace('login'))
            
        }
    },
}
</script>

<style>

</style>