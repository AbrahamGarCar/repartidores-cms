<style>
    .btn-main{
        border: none !important;
        border-radius: 0 !important;
    }
</style>

<template>
    <section class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn btn-primary btn-main" data-toggle="modal" data-target="#exampleModal">
                    Agregar nuevo usuario
                </button>
            </div>
        </div>

        <hr>

        <div class="row">
            <div class="col-md-12 d-flex">
                <h2 v-if="dataFilter == 'user'">Estas viendo la seccion de repartidores</h2>
                <h2 v-if="dataFilter == 'restaurant'">Estas viendo la seccion de restaurantes</h2>
                <h2 v-if="dataFilter == 'admin'">Estas viendo la seccion de administradores</h2>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 d-flex">
                <button class="btn-main btn btn-sm btn-info" @click="dataFilter = 'user'">Repartidores</button>
                <button class="btn-main btn btn-sm btn-success ml-2" @click="dataFilter = 'restaurant'">Restaurantes</button>
                <button class="btn-main btn btn-sm btn-danger ml-2" @click="dataFilter = 'admin'">Administrador</button>
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
                        <th scope="col" v-if="dataFilter != 'admin'">Plus</th>
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
                        <td class="text-center" v-if="dataFilter != 'admin'">
                            <span class="badge badge-pill badge-success" v-if="item.plan">OK</span>
                            <span class="badge badge-pill badge-danger" v-else>NO</span>
                        </td>
                        <td class="text-center">
                            <button v-on:click="formEditUser(item)" class="btn btn-info btn-sm btn-main" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button v-if="item.role == 'restaurant'" v-on:click="formEditUser(item)" class="ml-1 btn btn-success btn-sm btn-main" data-toggle="modal" data-target="#restaurantModal">
                                <i class="fas fa-store-alt"></i>
                            </button>
                            <button v-if="item.role == 'user'" v-on:click="formEditUser(item)" class="ml-1 btn btn-secondary btn-sm btn-main" data-toggle="modal" data-target="#pricingModal">
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
                <div class="modal-content rounded-0">
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
                                <input class="form-control rounded-0" type="text" v-model="addUser.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido paterno</label>
                                <input class="form-control rounded-0" type="text" v-model="addUser.lastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido materno</label>
                                <input class="form-control rounded-0" type="text" v-model="addUser.secondLastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="mail">Correo</label>
                                <input class="form-control rounded-0" type="email" v-model="addUser.email" name="mail" required>
                            </div>
                            <div class="form-group">
                                <label for="mail">Contraseña</label>
                                <input class="form-control rounded-0" v-model="addUser.password" name="password" required>
                            </div>
                            <!-- <div class="form-group">
                                <label for="date">Fecha de nacimiento</label>
                                <input class="form-control" type="date" v-model="addUser.birthdate" name="birtday" required>
                            </div> -->
                            
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control rounded-0" type="number" v-model="addUser.telephone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="role">Rol</label>
                                <select class="form-control rounded-0" v-model="addUser.role" name="role" required>
                                    <option value="user">Repartidor</option>
                                    <option value="restaurant">Restaurante</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0">Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal editar -->
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content rounded-0">
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
                                <input class="form-control rounded-0" type="text" v-model="editUser.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido paterno</label>
                                <input class="form-control rounded-0" type="text" v-model="editUser.lastName" name="lastname">
                            </div>
                            <div class="form-group">
                                <label for="lastname">Apellido materno</label>
                                <input class="form-control rounded-0" type="text" v-model="editUser.secondLastName" name="lastname">
                            </div>
                            <!-- <div class="form-group">
                                <label for="date">Fecha de nacimiento</label>
                                <input class="form-control" type="date" v-model="editUser.birthdate" name="birtday" required>
                            </div> -->
                            
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control rounded-0" type="number" v-model="editUser.telephone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="role">Rol</label>
                                <select class="form-control rounded-0" v-model="editUser.role" name="role" required>
                                    <option value="user">Repartidor</option>
                                    <option value="restaurant">Restaurante</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal restaurante -->
        <div class="modal fade" id="restaurantModal" tabindex="-1" role="dialog" aria-labelledby="restaurantModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content rounded-0">
                    <div class="modal-header">
                        <h5 class="modal-title" id="restaurantModalLabel">Asignar a restaurante</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="editUser != null">
                        <form @submit.prevent="saveUserEdit('restaurant')" method="post">
                            <div class="form-group">
                                <label for="role">Restaurante</label>
                                <select class="form-control rounded-0" v-model="editUser.restaurant" name="role" id="role">
                                    <option v-for="(restaurant, index) in restaurants" :key="index" :value="restaurant.id">{{ restaurant.name }}</option>
                                </select>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal pagos -->
        <div class="modal fade" id="pricingModal" tabindex="-1" role="dialog" aria-labelledby="pricingModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content rounded-0">
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
                                <div class="card mb-4 box-shadow rounded-0 rounded-0">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Basico</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>1 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$199 en total</small></li>
                                            
                                        </ul>
                                        <button @click="activatePlan(1)" type="button" class="btn btn-lg btn-block btn-outline-primary rounded-0">Activar plan</button>
                                    </div>
                                </div>
                                <div class="card mb-4 box-shadow rounded-0">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Normal</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$166.33 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>3 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$499 en total</small></li>
                                            
                                        </ul>
                                        <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-primary rounded-0">Activar plan</button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="card-deck mb-3 text-center">
                                <div v-if="editUser.plan == 1" class="card mb-4 box-shadow rounded-0">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Basico</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$199 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>1 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$199 en total</small></li>
                                            
                                        </ul>
                                        <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                    </div>
                                </div>
                                <div v-if="editUser.plan == 3" class="card mb-4 box-shadow rounded-0">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Normal</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$166.33 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>3 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$499 en total</small></li>
                                            
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
                INE: false,
                contract: false,
                planActivate: new Date(),
                planDeactivate: new Date(),
                plan: null,

                _geoloc: {
                    lat: 0,
                    lng: 0,
                }
            },

            editUser: null,

            dataFilter: 'user',

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

                let data = { 
                    planActivate: new Date(date1), 
                    planDeactivate: new Date(date2), 
                    active: true, 
                    plan: plan 
                }

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

                        let user = JSON.parse(JSON.stringify(this.editUser))

                        let response = await db.collection('users').doc(user.uid).update(data)
                        $('#pricingModal').modal('hide')

                        Swal.fire(
                        'Actualizado!',
                        'El plan a sido actualizado',
                        'success'
                        )

                        this.registerPayment(data, user)
                    }
                })


            } catch (error) {
                console.log(error)
            }
        },

        async registerPayment(data, user){
            try {
                
                let payment = {
                    id: user.uid,
                    role: 'user',
                    name: user.name,
                    direction: user.direction,
                    email: user.email,
                    telephone: user.telephone,
                    plan: data.plan,
                    amount: 0,
                    planActivate: data.planActivate,
                    planDeactivate: data.planDeactivate,
                }

                if (data.plan == 2) {
                    payment.amount = 499
                }else if(data.plan == 1){
                    payment.amount = 499
                }else if(data.plan == 3){
                    payment.amount = 1399
                }else{
                    payment.amount = 2699
                }

                let response = await db.collection('payments').doc().set(payment)

                console.log('pago registrado');
            } catch (error) {
                console.log(error);
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
                        // await db.collection('information_user').doc(user.uid).set({ name: this.user.name, cancellationsCount: 0, deliveredCount: 0 })

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
        
        async saveUserEdit(restaurant = null){
            try {

                let response = await db.collection('users').doc(this.editUser.uid)
                                        .update(this.editUser)
                                        .then(query => {
                                            Swal.fire(
                                                'Usuario actualizado',
                                                'El usuario ha sido actualizado',
                                                'success'
                                            )

                                            if (restaurant != null) {
                                                this.updatePlan()
                                            }
                                        })
            } catch (error) {
                console.log(error)
            }
        },

        async updatePlan(){
            try {
                let response = await db.collection('restaurants').doc(this.editUser.restaurant).get()

                if (response) {
                    this.editUser.planActivate = response.data().planActivate, 
                    this.editUser.planDeactivate = response.data().planDeactivate, 
                    this.editUser.active = response.data().active, 
                    this.editUser.plan = response.data().plan

                    console.log(this.editUser)

                    this.saveUserEdit()
                    
                }
            } catch (error) {
                console.log(error);
            }
        }

    }
}
</script>