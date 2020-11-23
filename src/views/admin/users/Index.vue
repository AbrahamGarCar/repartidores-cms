<template>
    <section class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Agregar nuevo usuario
                </button>
            </div>
        </div>

        <hr>

        <div class="row">
            <div class="col-md-12 d-flex">
                <button class="btn btn-sm btn-info" @click="dataFilter = 'Usuario'">Repartidores</button>
                <button class="btn btn-sm btn-success ml-2" @click="dataFilter = 'restaurant'">Restaurantes</button>
            </div>
        </div>
        
        <div class="row mt-2">
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Estatus</th>
                        <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in filterUsers" :key="index">
                        <th scope="row">{{ item.name }}</th>
                        <td>{{ item.lastName }}</td>
                        <td>{{ item.email }}</td>
                        <td class="text-center">
                            <i v-if="!item.active" style="font-size: 22px; cursor: pointer;" @click="changeStatus(item)" class="fas fa-toggle-off"></i>
                            <i v-else style="font-size: 22px; cursor: pointer;" @click="changeStatus(item)" class="fas fa-toggle-on"></i>
                        </td>
                        <td class="text-center">
                            <button v-on:click="formEditUser(item)" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button v-if="item.role == 'restaurant'" v-on:click="formEditUser(item)" class="ml-1 btn btn-success btn-sm" data-toggle="modal" data-target="#restaurantModal">
                                <i class="fas fa-store-alt"></i>
                            </button>
                            <button v-on:click="formEditUser(item)" class="ml-1 btn btn-secondary btn-sm" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-money-bill-alt"></i>
                            </button>

                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- boton para agregar usuario -->
            

        <!-- Modal crear -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Agregar Usuario</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveUser" method="post">
                            <div class="form-group">
                                <label for="name">Nombre</label>
                                <input class="form-control" type="text" v-model="addUser.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido paterno</label>
                                <input class="form-control" type="text" v-model="addUser.lastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido materno</label>
                                <input class="form-control" type="text" v-model="addUser.secondLastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="mail">Correo</label>
                                <input class="form-control" type="email" v-model="addUser.email" name="mail" required>
                            </div>
                            <div class="form-group">
                                <label for="mail">Contraseña</label>
                                <input class="form-control" v-model="addUser.password" name="password" required>
                            </div>
                            <!-- <div class="form-group">
                                <label for="date">Fecha de nacimiento</label>
                                <input class="form-control" type="date" v-model="addUser.birthdate" name="birtday" required>
                            </div> -->
                            
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control" type="number" v-model="addUser.telephone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="role">Rol</label>
                                <select class="form-control" v-model="addUser.role" name="role" id="role" required>
                                    <option value="Usuario">Repartidor</option>
                                    <option value="restaurant">Restaurante</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal editar -->
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Editar Usuario</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="editUser != null">
                        <form @submit.prevent="saveUserEdit" method="post">
                            <div class="form-group">
                                <label for="name">Nombre</label>
                                <input class="form-control" type="text" v-model="editUser.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido paterno</label>
                                <input class="form-control" type="text" v-model="editUser.lastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido materno</label>
                                <input class="form-control" type="text" v-model="editUser.secondLastName" name="lastname">
                            </div>
                            <!-- <div class="form-group">
                                <label for="date">Fecha de nacimiento</label>
                                <input class="form-control" type="date" v-model="editUser.birthdate" name="birtday" required>
                            </div> -->
                            
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control" type="number" v-model="editUser.telephone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="role">Rol</label>
                                <select class="form-control" v-model="editUser.role" name="role" id="role" required>
                                    <option value="Usuario">Repartidor</option>
                                    <option value="restaurant">Restaurante</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal restaurante -->
        <div class="modal fade" id="restaurantModal" tabindex="-1" role="dialog" aria-labelledby="restaurantModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="restaurantModalLabel">Asignar a restaurante</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="editUser != null">
                        <form @submit.prevent="saveUserEdit" method="post">
                            <div class="form-group">
                                <label for="role">Restaurante</label>
                                <select class="form-control" v-model="editUser.restaurant" name="role" id="role">
                                    <option v-for="(restaurant, index) in restaurants" :key="index" :value="restaurant.id">{{ restaurant.name }}</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
       
            
    </section>
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

export default {
    name: 'Users',

    data(){
        return{
            addUser: {
                name: '',
                lastName: '',
                secondLastName: '',
                email: '',
                password: '',
                // birthdate: '',
                role: '',
                telephone: '',
                active: false,
                completeProfile: false,
                terms: false,
                registerDate: new Date(),
            },

            editUser: null,

            dataFilter: 'Usuario',

            users: [],
            restaurants: [],

        }
    },

    created(){
            this.getUsers()
            this.getRestaurants()
    },

    computed: {
        ...mapState([
            'user'
        ]),

        filterUsers(){
            return this.users.filter(doc => doc.role == this.dataFilter)
        }
    },

    methods:{
        async changeStatus(user){
            try {
                console.log(user);
                user.active = !user.active

                let response = await db.collection('users').doc(user.uid).update({ active: user.active }).then(query => {
                    console.log(query);
                })
            } catch (error) {
                console.log(error)
            }
        },

        async saveUser(){
            try {
                Swal.fire({
                    title: '¿Quieres guardar este usuario?',
                    text: "Este usuario sera dado de alta",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        let response = await db.collection('temporary').add(this.addUser)

                        Swal.fire(
                        'Guardado!',
                        'Usuario creado',
                        'success'
                        )
                    }
                })
            } catch (error) {
                console.log(error)
            }
        },

        async getUsers(){
            try {
                let response = await db.collection('users').onSnapshot(query=>{
                    this.users = []

                    query.forEach(doc => {
                        this.users.push(doc.data())
                    })
                })

            } catch (error) {
                console.log(error)
            }
        },

        async getRestaurants(){
            try {
                let response = await db.collection('restaurants').get().then(query=>{
                    this.restaurants = []

                    query.forEach(doc => {
                        this.restaurants.push(doc.data())
                    })
                })

            } catch (error) {
                console.log(error)
            }
        },

        formEditUser(user){
            // console.log(user.birthdate.toDate().toISOString().split('T')[0]);
            this.editUser = user
            // this.editUser.birthdate = user.birthdate.toDate().toISOString().split('T')[0]
        },
        
        async saveUserEdit(){
            try {

                let response = await db.collection('users').doc(this.editUser.uid)
                                        .update(this.editUser)
                                        .then(query => {
                                            Swal.fire(
                                                'Usuario actualizado',
                                                'El usuario ha sido actualizado',
                                                'success'
                                            )
                                        })
            } catch (error) {
                console.log(error)
            }
        },

    }
}
</script>

<style>

</style>