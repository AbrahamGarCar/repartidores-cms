<template>
    <section>
        <h1>Dashboard</h1>
    </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Dashboard',

    data(){
        return{

        }
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