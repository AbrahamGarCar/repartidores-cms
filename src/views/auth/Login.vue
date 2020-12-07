<style scoped>
    form input{
        border: 1px solid white !important;
        border-radius: 15px !important;
        background-color: white;
    }

    .btn-main{
        border: none !important;
        border-radius: 0 !important;
    }
</style>

<template>
    <section class="row mt-5 d-flex justify-content-center align-items-center">
        <div class="col-md-5 text-center">
            <img src="https://electronicssoftware.net/wp-content/uploads/user.png" width="100px" alt="">
            <form @submit.prevent="login" class="mt-4">
                <div class="form-group">
                    <!-- <label for="email">Email</label> -->
                    <input v-model="usuario" type="email" class="form-control" id="email" placeholder="Email" aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                    <!-- <label for="password">Password</label> -->
                    <input v-model="password" type="password" class="form-control" placeholder="Contraseña" id="password">
                </div>
                <button type="submit" class="btn btn-primary btn-main">Iniciar sesion</button>
            </form>
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
                
            }
            catch(error){
                console.log(error)
                switch (error.code) {
                    case 'auth/user-not-found':
                        console.log('Revisa tu email y contraseña')
                        alert('Usuario no encontrado')
                        break;
                    case 'auth/wrong-password':
                        console.log('Revisa tu email y contraseña')
                        alert('Contraseña incorrecta')
                        break;
                    default:
                        console.log('Ocurrio un error al validar la informacion')
                        alert('Ha ocurrido un error, intenta mas tarde')
                        break;
                }
            }
        }
    },
}
</script>

