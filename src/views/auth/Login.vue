<template>
    <section class="row mt-5">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header">
                    LOGIN
                </div>
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password">
                        </div>
                        <button type="submit" class="btn btn-primary">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { firebase, auth, firestore } from '@/firebase'

export default {
    name: 'Login',

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