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
                <table class="table table-bordered table-responsive" style="width: 100%;">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Apellido</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Estatus</th>
                        <th scope="col">Plus</th>
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
                            <span class="badge badge-pill badge-success" v-if="item.plan">OK</span>
                            <span class="badge badge-pill badge-danger" v-else>NO</span>
                        </td>
                        <td class="text-center">
                            <button v-on:click="formEditUser(item)" class="btn btn-info btn-sm" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button v-if="item.role == 'restaurant'" v-on:click="formEditUser(item)" class="ml-1 btn btn-success btn-sm" data-toggle="modal" data-target="#restaurantModal">
                                <i class="fas fa-store-alt"></i>
                            </button>
                            <button v-if="item.role == 'Usuario'" v-on:click="formEditUser(item)" class="ml-1 btn btn-secondary btn-sm" data-toggle="modal" data-target="#pricingModal">
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
                                <select class="form-control" v-model="addUser.role" name="role" required>
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
                                <select class="form-control" v-model="editUser.role" name="role" required>
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

        <!-- Modal pagos -->
        <div class="modal fade" id="pricingModal" tabindex="-1" role="dialog" aria-labelledby="pricingModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="pricingModalLabel">Elegir plan</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="editUser != null">
                        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                            <h1 class="display-4">Suscripción</h1>
                            <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto obcaecati quam vel sit, aliquam, amet culpa cupiditate laudantium consequatur explicabo, doloribus repellat? Debitis fuga, architecto ratione eveniet nobis sit repellat.</p>
                        </div>
                        <div class="container">
                            <div v-if="editUser.plan == null" class="card-deck mb-3 text-center">
                                <div class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Basico</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>3 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$597 en total</small></li>
                                            
                                        </ul>
                                        <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button>
                                    </div>
                                </div>
                                <div class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Normal</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>6 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$1194 en total</small></li>
                                            
                                        </ul>
                                        <button @click="activatePlan(6)" type="button" class="btn btn-lg btn-block btn-primary">Activar plan</button>
                                    </div>
                                </div>
                                <div class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Plus</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>12 meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$2388 en total</small></li>
                                        </ul>
                                        <button @click="activatePlan(12)" type="button" class="btn btn-lg btn-block btn-primary">Activar plan</button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="card-deck mb-3 text-center">
                                <div v-if="editUser.plan == 3" class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Basico</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>3 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$597 en total</small></li>
                                            
                                        </ul>
                                        <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                    </div>
                                </div>
                                <div v-if="editUser.plan == 6" class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Normal</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>6 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$597 en total</small></li>
                                            
                                        </ul>
                                        <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                    </div>
                                </div>
                                <div v-if="editUser.plan == 12" class="card mb-4 box-shadow">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Plus</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>12 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$597 en total</small></li>
                                            
                                        </ul>
                                        <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                    </div>
                                </div>
                            </div>
                        </div>
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

//Luxon
const { DateTime } = require("luxon");

//Moment
const moment = require('moment-timezone');

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

                planActivate: new Date(),
                planDeactivate: new Date(),
                plan: null,
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
        async activatePlan(plan){
            try {
                let date1 = moment().format();
                let date2 = moment(date1).add(plan, 'months').calendar();;
                console.log(new Date(date1));
                console.log(new Date(date2));

                 Swal.fire({
                    title: '¿Quieres actualizar el plan de este usuario?',
                    text: "Se creara un registro de pago!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        let response = await db.collection('users').doc(this.editUser.uid).update({ planActivate: new Date(date1), planDeactivate: new Date(date2), active: true, plan: plan })
                        $('#pricingModal').modal('hide')

                        Swal.fire(
                        'Actualizado!',
                        'El plan a sido actualizado',
                        'success'
                        )
                    }
                })


            } catch (error) {
                console.log(error)
            }
        },

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