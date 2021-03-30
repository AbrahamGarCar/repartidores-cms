<template>
    <div id="app" style="background-color: #F0F2F5;">
        <router-view/>
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