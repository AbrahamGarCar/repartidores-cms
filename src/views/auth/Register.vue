<template>
    <section class="row mt-5">
        <div class="col-md-5">
            <div class="card">
                <div class="card-header">
                    Registro
                </div>
                <div class="card-body">
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input v-model="usuario" type="email" class="form-control" id="email" aria-describedby="emailHelp">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input v-model="password" type="password" class="form-control" id="password">
                        </div>
                        <button type="submit" class="btn btn-primary">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-7">
            <pre>
                {{ $data }}
            </pre>
        </div>
    </section>
</template>

<script>
import { firebase, auth, firestore } from '@/firebase'

export default {
    name: 'Login',

    data(){
        return{
            usuario: '',
            password: '',
        }
    },

    methods: {
        async login(){
            try{
                let response = await auth.signInWithEmailAndPassword(this.usuario, this.password)

                if (response) {
                    this.$router.replace('/dashboard')
                }
                
            }
            catch(error){
                console.log(error)
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        console.log('Revisa tu email y contraseña')
                        break;
                    default:
                        console.log('Ocurrio un error al validar la informacion')
                        break;
                }
            }
        }
    },
}
</script>

<style>

</style>