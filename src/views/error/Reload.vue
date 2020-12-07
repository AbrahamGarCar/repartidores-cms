<template>
    <section>
        <h1>
            Este es la pagina de espera
        </h1>
    </section>
</template>

<script>
//Firebase
import { auth, db } from '@/firebase'

//Vuex
import { mapState } from 'vuex'

export default {
    name: 'Reload',

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
        
    },
}
</script>

<style>

</style>