<style>
    .vbga-results{
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .vbga-results li{
        margin-top: 10px;
        background-color: aqua;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
    }

    .btn-main{
        border: none !important;
        border-radius: 0 !important;
    }
</style>

<template>
    <section class="col-md-12">
        <!-- boton para agregar usuario -->
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn btn-primary btn-main" data-toggle="modal" data-target="#exampleModal">
                    Agregar nuevo establecimiento
                </button>
            </div>
        </div>

        <hr>

        <div class="row mt-2">
            <div class="col-md-12">
                <vue-good-table
                    title="Dynamic Table"
                    
                    :search-options="{
                        enabled: true
                    }"
                    :pagination-options="{
                        enabled: true,
                        mode: 'pages'
                    }"
                    :columns="columns"
                    :rows="restaurants"
                    :lineNumbers="true"
                    :defaultSortBy="{field: 'name', type: 'asec'}"
                    :globalSearch="true"
                    :paginate="true"
                    styleClass="table condensed table-bordered table-striped">
                    
                    <template class="text-center" slot="table-row" slot-scope="props">
                        <span class="text-center" v-if="props.column.field == 'status'">
                            <i v-if="!props.row.active" style="font-size: 22px; cursor: pointer;" @click="changeStatus(props.row)" class="fas fa-toggle-off"></i>
                            <i v-else style="font-size: 22px; cursor: pointer;" @click="changeStatus(props.row)" class="fas fa-toggle-on"></i>
                        </span>
                        <span class="text-center" v-if="props.column.field == 'plus'">
                            <span class="badge badge-pill badge-success" v-if="props.row.plan">OK</span>
                            <span class="badge badge-pill badge-danger" v-else>NO</span>
                        </span>
                        <span class="text-center" v-if="props.column.field == 'options'">
                            <button v-on:click="formEditUser(props.row)" class="btn btn-info btn-sm btn-main" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-edit"></i>
                            </button>

                            <button v-on:click="formEditUser(props.row)" class="ml-1 btn btn-secondary btn-sm btn-main" data-toggle="modal" data-target="#pricingModal">
                                <i class="fas fa-money-bill-alt"></i>
                            </button>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </vue-good-table>
                <!-- <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Estatus</th>
                        <th scope="col">Plus</th>
                        <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in restaurants" :key="index">
                        <th scope="row">{{ item.name }}</th>
                        <td>{{ item.email }}</td>
                        <td>{{ item.telephone }}</td>
                        <td class="text-center">
                            <i v-if="!item.active" style="font-size: 22px; cursor: pointer;" @click="changeStatus(item)" class="fas fa-toggle-off"></i>
                            <i v-else style="font-size: 22px; cursor: pointer;" @click="changeStatus(item)" class="fas fa-toggle-on"></i>
                        </td>
                        <td class="text-center">
                            <span class="badge badge-pill badge-success" v-if="item.plan">OK</span>
                            <span class="badge badge-pill badge-danger" v-else>NO</span>
                        </td>
                        <td class="text-center">
                            <button v-on:click="formEditUser(item)" class="btn btn-info btn-sm btn-main" data-toggle="modal" data-target="#editModal">
                                <i class="fas fa-edit"></i>
                            </button>

                            <button v-on:click="formEditUser(item)" class="ml-1 btn btn-secondary btn-sm btn-main" data-toggle="modal" data-target="#pricingModal">
                                <i class="fas fa-money-bill-alt"></i>
                            </button>
                        </td>
                        </tr>
                    </tbody>
                </table> -->
            </div>
        </div>

        <!-- Modal crear-->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content rounded-0">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Agregar establecimiento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveRestaurant" method="post">
                            <div class="form-group">
                                <label for="name">Nombre</label>
                                <input class="form-control rounded-0" type="text" v-model="restaurant.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="mail">Correo</label>
                                <input class="form-control rounded-0" type="email" v-model="restaurant.email" name="mail" required>
                            </div>
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control rounded-0" type="number" v-model="restaurant.telephone" name="phone" required>
                            </div>
                            <google-places-autocomplete
                                    @resultChanged="placeDetail => place = placeDetail"
                                    @resultCleared="() => place = null"
                                    >
                                    <div slot="input" slot-scope="{ context, events, actions }">
                                        <label for="locationInput">Direccion</label>
                                        <input
                                        v-model="context.input"
                                        @focus="events.inputHasReceivedFocus"
                                        @input="events.inputHasChanged"
                                        @keydown.enter.prevent="actions.selectItemFromList"
                                        @keydown.down.prevent="actions.shiftResultsSelection"
                                        @keydown.up.prevent="actions.unshiftResultsSelection"
                                        type="search"
                                        id="locationInput"
                                        class="form-control"
                                        placeholder="Comienza a escribir ..."
                                        >
                                    </div>
                            </google-places-autocomplete>
                            <div class="form-group mt-3">
                                <label for="first">
                                    <input type="checkbox" v-model="restaurant.firstTime" name="firstTime" id="first">
                                    Activar promocion
                                </label>
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
                        <h5 class="modal-title" id="editModalLabel">Editar establecimiento</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="editRestaurant != null">
                        <form @submit.prevent="saveUserEdit" method="post">
                            <div class="form-group">
                                <label for="name">Nombre</label>
                                <input class="form-control rounded-0" type="text" v-model="editRestaurant.name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="mail">Correo</label>
                                <input class="form-control rounded-0" type="email" v-model="editRestaurant.email" name="mail" required>
                            </div>
                            <div class="form-group">
                                <label for="telephone">Telefono</label>
                                <input class="form-control rounded-0" type="number" v-model="editRestaurant.telephone" name="phone" required>
                            </div>
                            <google-places-autocomplete
                                    @resultChanged="placeDetail => place = placeDetail"
                                    @resultCleared="() => place = null"
                                    >
                                    <div slot="input" slot-scope="{ context, events, actions }">
                                        <label for="locationInput">Direccion</label>
                                        <input
                                        v-model="context.input"
                                        @focus="events.inputHasReceivedFocus"
                                        @input="events.inputHasChanged"
                                        @keydown.enter.prevent="actions.selectItemFromList"
                                        @keydown.down.prevent="actions.shiftResultsSelection"
                                        @keydown.up.prevent="actions.unshiftResultsSelection"
                                        type="search"
                                        id="locationInput"
                                        class="form-control"
                                        placeholder="Comienza a escribir ..."
                                        >
                                    </div>
                            </google-places-autocomplete>

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
                    <div class="modal-body" v-if="editRestaurant != null">
                        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                            <h1 class="display-4">Suscripción</h1>
                            <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto obcaecati quam vel sit, aliquam, amet culpa cupiditate laudantium consequatur explicabo, doloribus repellat? Debitis fuga, architecto ratione eveniet nobis sit repellat.</p>
                        </div>
                        <div class="container">
                            <div v-if="editRestaurant.firstTime" class="card-deck mb-3 text-center">
                                <div class="card mb-4 box-shadow rounded-0">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">Promocion</h4>
                                    </div>
                                    <div class="card-body">
                                        <h1 class="card-title pricing-card-title">$249.50 <small class="text-muted">/ mo</small></h1>
                                        <ul class="list-unstyled mt-3 mb-4">
                                            <li>2 Meses</li>
                                            <li>Acceso total al sistema</li>
                                            <li><small>$499 en total</small></li>
                                            
                                        </ul>
                                        <button @click="activatePlan(2)" type="button" class="btn btn-lg btn-block btn-outline-primary rounded-0">Activar plan</button>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div v-if="editRestaurant.plan == null" class="card-deck mb-3 text-center">
                                    <div class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Basico</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$499 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>1 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$499 en total</small></li>
                                                
                                            </ul>
                                            <button @click="activatePlan(1)" type="button" class="btn btn-lg btn-block btn-outline-primary rounded-0">Activar plan</button>
                                        </div>
                                    </div>
                                    <div class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Normal</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$466.33 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>3 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$1399 en total</small></li>
                                                
                                            </ul>
                                            <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-primary rounded-0">Activar plan</button>
                                        </div>
                                    </div>
                                    <div class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Plus</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$449.83 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>6 meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$2699 en total</small></li>
                                            </ul>
                                            <button @click="activatePlan(6)" type="button" class="btn btn-lg btn-block btn-primary rounded-0">Activar plan</button>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="card-deck mb-3 text-center">
                                    <!-- Promocion -->
                                    <div v-if="editRestaurant.plan == 2" class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Promocion</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$249.50 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>2 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$499 en total</small></li>
                                                
                                            </ul>
                                            <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                        </div>
                                    </div>
                                    <!-- Termina promocion -->
                                    <div v-if="editRestaurant.plan == 1" class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Basico</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$499 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>1 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$499 en total</small></li>
                                                
                                            </ul>
                                            <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                        </div>
                                    </div>
                                    <div v-if="editRestaurant.plan == 3" class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Normal</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$463.33 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>3 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$1399 en total</small></li>
                                                
                                            </ul>
                                            <!-- <button @click="activatePlan(3)" type="button" class="btn btn-lg btn-block btn-outline-primary">Activar plan</button> -->
                                        </div>
                                    </div>
                                    <div v-if="editRestaurant.plan == 6" class="card mb-4 box-shadow rounded-0">
                                        <div class="card-header">
                                            <h4 class="my-0 font-weight-normal">Plus</h4>
                                        </div>
                                        <div class="card-body">
                                            <h1 class="card-title pricing-card-title">$449.83 <small class="text-muted">/ mo</small></h1>
                                            <ul class="list-unstyled mt-3 mb-4">
                                                <li>6 Meses</li>
                                                <li>Acceso total al sistema</li>
                                                <li><small>$2699 en total</small></li>
                                                
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
const index = client.initIndex('restaurants');

//Luxon
const { DateTime } = require("luxon");

//Moment
const moment = require('moment-timezone');

export default {
    data(){
        return{
            columns: [
                {
                    label: 'Nombre',
                    field: 'name',
                    filterable: true,
                },
                {
                    label: 'Email',
                    field: 'email',
                    filterable: true,
                },
                {
                    label: 'Telefono',
                    field: 'telephone',
                    filterable: true,
                },
                {
                    label: 'Estatus',
                    field: 'status',
                },
                {
                    label: 'Plus',
                    field: 'plus',
                },
                {
                    label: 'Opciones',
                    field: 'options',
                },

            ],

            restaurant: {
                name: '',
                email: '',
                telephone: '',
                direction: '',
                position: null,

                planActivate: new Date(),
                planDeactivate: new Date(),
                plan: null,
                firstTime: false,
                active: false,
            },

            place: null,
            restaurants: [],

            editRestaurant: null,

        }
    },

    watch: {
        place(){
            if (this.place != null) {

                if (this.editRestaurant != null) {
                    this.editRestaurant.direction = this.place.formatted_address
                    this.editRestaurant.position = new firebase.firestore.GeoPoint(this.place.geometry.location.lat(), this.place.geometry.location.lng())
                }

                this.restaurant.direction = this.place.formatted_address
                this.restaurant.position = new firebase.firestore.GeoPoint(this.place.geometry.location.lat(), this.place.geometry.location.lng())
            }    
        }
    },

    created(){
        this.getRestaurant()
    },

    methods:{

        async activatePlan(plan){
            try {
                let date1 = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
                let date2 = moment(date1).add(plan, 'months').calendar();
                console.log(new Date(date1));
                console.log(new Date(date2));

                let data = {
                    planActivate: new Date(date1), 
                    planDeactivate: new Date(date2), 
                    active: true, 
                    plan: plan,
                    firstTime: false,
                }

                Swal.fire({
                    title: '¿Quieres actualizar el plan de este restaurante?',
                    text: "Se creara un registro de pago!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        
                        let restaurant = JSON.parse(JSON.stringify(this.editRestaurant))

                        let response = await db.collection('restaurants').doc(restaurant.id).update(data)
                        $('#pricingModal').modal('hide')

                        Swal.fire(
                        'Actualizado!',
                        'El plan a sido actualizado',
                        'success'
                        )

                        this.registerPayment(data, restaurant)
                        this.updateUsers(data)
                    }
                })

            } catch (error) {
                console.log(error)
            }
        },

        async updateUsers(data){
            try {
                let response = await db.collection('users')
                                        .where('restaurant', '==' ,this.editRestaurant.id)
                                        .get()
                                        .then(query => {

                                            let usersCollection = db.collection('users')

                                            // Begin a new batch
                                            let batch = db.batch()

                                            // Set each document, as part of the batch
                                            query.forEach(document => {
                                                let ref = usersCollection.doc(document.data().uid);
                                                batch.update(ref, data)
                                            })

                                            // Commit the entire batch
                                            return batch.commit();
                                        })
            } catch (error) {
                console.log(error)
            }
        },

        async registerPayment(data, restaurant){
            try {
                
                let payment = {
                    id: restaurant.id,
                    role: 'restaurant',
                    name: restaurant.name,
                    direction: restaurant.direction,
                    email: restaurant.email,
                    telephone: restaurant.telephone,
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

        async changeStatus(restaurant){
            try {
                console.log(restaurant);
                this.editRestaurant = restaurant
                
                restaurant.active = !restaurant.active

                let data = {
                    active: restaurant.active
                }

                let response = await db.collection('restaurants').doc(restaurant.id).update(data).then(query => {
                    this.updateUsers(data)
                })
            } catch (error) {
                console.log(error)
            }
        },

        async saveRestaurant(){
            try {

                Swal.fire({
                    title: '¿Quieres guardar este restaurante?',
                    text: "Este restaurante sera dado de alta",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let response = await db.collection('restaurants').add(this.restaurant)
                                                .then(async docRef => {
                                                    console.log("Document written with ID: ", docRef.id)

                                                    await db.collection('restaurants').doc(docRef.id)
                                                                                        .update({ id: docRef.id })
                                                })

                        Swal.fire(
                            'Guardado!',
                            'Restaurante creado',
                            'success'
                        )

                        this.place = null
                        this.restaurant = {
                                name: '',
                                email: '',
                                telephone: '',
                                direction: '',
                                position: null,
                            }
                    }
                })

            } catch (error) {
                console.log(error)
            }
        },

        async getRestaurant(){
            try {
                let response = await db.collection('restaurants').onSnapshot(query=>{
                    this.restaurants = []

                    query.forEach(doc=>{
                        this.restaurants.push(doc.data())
                    })
                })

            } catch (error) {
                console.log(error)
            }
        },

        formEditUser(user){
            this.editRestaurant = user
        },
        
        async saveUserEdit(){
            try {
                let response = await db.collection('restaurants').doc(this.editRestaurant.id)
                                        .update(this.editRestaurant)
                                        .then(query => {
                                            Swal.fire(
                                                'Restaurante actualizado',
                                                'El restaurante ha sido actualizado',
                                                'success'
                                            )
                                        })

                this.place = null
            } catch (error) {
                console.log(error)
            }
        },
    }
}
</script>
