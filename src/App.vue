<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Repartidores CMS</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav ml-auto">
                    <router-link class="nav-link" to="/">Login</router-link>
                    <router-link class="nav-link" to="/register">Register</router-link>
                </div>
            </div>
        </nav>
        <section class="container">
            <router-view/>
        </section>
    </div>
</template>

<script>
export default {
    name: 'Layout',

    data(){
        return{

        }
    },

    methods: {
        
    },
}
</script>

<style>

</style>