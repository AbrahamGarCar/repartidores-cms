<style>
    .level_1{
        background-color: #D93030;
        color: white;
    }

    .card-body{
        min-height: 250px !important;
    }

    .level_2{
        background-color: #69BF87;
        color: white;
    }
</style>

<template>
    <section>
        <div class="row mt-4">
            <div class="col-md-12 card p-2">
                <NewOrder :restaurant="restaurant" />
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-md-12 mt-2">
                <h3 style="font-weight: bold;">Ordenes pendientes</h3>
            </div>
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Direccion</th>
                            <th scope="col">Distancia</th>
                            <th scope="col">Tiempo</th>
                            <th scope="col">Costo</th>
                            <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in pendingOrders" :key="index">
                            <th scope="row">{{ index }}</th>
                            <td>{{ item.details.name }}</td>
                            <td>{{ item.directionDestination }}</td>
                            <td>{{ item.infoDestination.distance }}</td>
                            <td>{{ item.infoDestination.duration }}</td>
                            <td>$30.00</td>
                            <td>
                                <button v-if="item.level == 1" class="btn btn-block btn-info" @click="searchDeliveryMan(item)">Buscar repartidores</button>
                                <button v-else class="btn btn-block btn-danger" @click="searchDeliveryMan(item)">Buscando</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <div class="col-md-4" v-for="(item, index) in pendingOrders" :key="index">
                <div class="card p-2" :class="[ item.level == 1 ? 'level_1' : 'level_2' ]">
                    <div class="card-body">
                        <p><span style="font-weight: bold;">Numero de orden:</span> {{ item.id }}</p>
                        <p><span style="font-weight: bold;">Cliente:</span>  {{ item.details.name }}</p>
                        <p><span style="font-weight: bold;">Direccion:</span>  {{ item.directionDestination }}</p>
                    </div>

                    <button v-if="item.level == 1" class="btn btn-block btn-info" @click="searchDeliveryMan(item)">Buscar repartidores</button>
                    <button v-else class="btn btn-block btn-danger" @click="searchDeliveryMan(item)">{{ item.timer | alarm }}</button>
                </div>
            </div> -->
        </div>

        <div class="row mt-4">
            <div class="col-md-12 mt-2">
                <h3 style="font-weight: bold;">Ordenes aceptadas</h3>
            </div>
            <div class="col-md-4" v-for="(item, index) in aceptedOrders" :key="index">
                <div class="card p-2" style="background-color: #4E54BF; color: white;">
                    <div class="card-body">
                        <p><span style="font-weight: bold;">Numero de orden:</span> {{ item.id }}</p>
                        <p><span style="font-weight: bold;">Cliente:</span>  {{ item.details.name }}</p>
                        <p><span style="font-weight: bold;">Direccion:</span>  {{ item.directionDestination }}</p>
                    </div>
                    <button class="btn btn-block btn-info" @click="getDeliveryMan(item)">Ver datos del repartidor</button>
                </div>
            </div>
        </div>

        <!-- <div class="row mt-4">
            <div class="col-md-12 mt-2">
                <h3 style="font-weight: bold;">Ordenes en curso</h3>
            </div>
            <div class="col-md-4" v-for="(item, index) in ordersInProgress" :key="index">
                <div class="card p-2" style="background-color: #4E54BF; color: white;">
                    <div class="card-body">
                        <p><span style="font-weight: bold;">Numero de orden:</span> {{ item.id }}</p>
                        <p><span style="font-weight: bold;">Cliente:</span>  {{ item.details.name }}</p>
                        <p><span style="font-weight: bold;">Direccion:</span>  {{ item.directionDestination }}</p>
                    </div>
                    <button class="btn btn-block btn-info" @click="getDeliveryMan(item)">Ver datos del repartidor</button>
                </div>
            </div>
        </div> -->

        <!--Lista de repartidores-->
        <div class="modal fade" id="deliveryManlist" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="deliveryManlistLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deliveryManlistLabel">Repartidores</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container" v-if="deliveryMans != null">
                            <div class="row">
                                <div class="col-md-12">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">options</th>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Telefono</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in deliveryMans" :key="index">
                                                <th scope="row">
                                                    <input type="checkbox" :value="item" v-model="deliveryManList">
                                                </th>
                                                <td>
                                                    {{ item.name }}
                                                </td>
                                                <td>
                                                    {{ item.telephone }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" @click="releaseNotifications">Notificar</button>
                    </div>
                </div>
            </div>
        </div>
        <!--Info de repartidor-->
        <div class="modal fade" id="deliveryMan" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="deliveryManLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deliveryManLabel">Repartidor</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container" v-if="deliveryMan != null">
                        <div class="row">
                            <div class="col-md-12">
                                <h5>Nombre</h5>
                                <p>{{ deliveryMan.name }}</p>
                                
                                <h5>Email</h5>
                                <p>{{ deliveryMan.email }}</p>

                                <h5>Telefono</h5>
                                <p>{{ deliveryMan.telephone }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
//Vuex
import { mapState } from 'vuex'

//Moment
// const moment = require('moment');
const moment = require('moment-timezone');

//Luxon
const { DateTime } = require("luxon");

//Firebase
import { firebase, db, firestore } from '@/firebase'

//Components
import NewOrder from '../components/NewOrderComponent'

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

export default {
    name: 'Dashboard',

    components: {
        NewOrder, 
    },

    data(){
        return{
            restaurant: null,
            orders: [],

            order: null,

            deliveryMan: null,
            deliveryMans: null,
            deliveryManList: [],
        }
    },

    filters: {
        alarm(args){
            moment.locale('es-mx')
            let today = DateTime.local();
            let date = moment(args.toDate()).calendar();
            
            return date; 
            // return today
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),

        pendingOrders(){
            return this.orders.filter(doc => doc.status == 'PENDIENTE')
        },

        aceptedOrders(){
            return this.orders.filter(doc => doc.status == 'ACEPTADA')
        },

        ordersInProgress(){
            return this.orders.filter(doc => doc.status == 'EN CURSO')
        }
    },

    created() {
        // this.getOrders()
    },

    watch: {
        user(){
            if (this.user != null) {
                this.getRestaurant()
            }    
        },
    },

    methods: {
        async getRestaurant(){
            try {
                console.log('binnie')
                let response = await db.collection('restaurants').doc(this.user.restaurant).get()

                if (response.exists) {
                    this.restaurant = response.data()

                    this.getOrders()
                }
            } catch (error) {
                console.log(error)
            }
        },

        async releaseNotifications(){
            try {
                let list = this.deliveryManList.map(item => {
                    return item.uid
                })

                let response = await db.collection('orders')
                                        .doc(this.order.id)
                                        .update({ level: 2, timer: new Date(), listDeliveryMen: list })

                $('#deliveryManlist').modal('hide')

                this.getUsersNotification(list)

            } catch (error) {
                console.log(error)
            }
        },

        async getUsersNotification(list){
            try {
                let arrayUsers = []
                let response = await db.collection('users')
                                        .where('uid', 'in', list)
                                        .get()
                                        .then(query => {
                                            query.forEach(doc => {
                                                arrayUsers.push(doc.data())
                                            })
                                        })

                console.log(arrayUsers)

                this.createNotifications(arrayUsers)
            } catch (error) {
                console.log(error)
            }
        },

        async createNotifications(users){
            try {
                let notificationCollection = db.collection('notifications')

                // Begin a new batch
                let batch = db.batch()

                // Set each document, as part of the batch
                users.forEach(document => {
                    let ref = notificationCollection.doc(document.token);
                    batch.set(ref, { title: 'Nueva orden', content: 'Hay una nueva orden disponible' })
                })

                // Commit the entire batch
                return batch.commit();
            } catch (error) {
                console.log(error)
            }
        },

        async getOrders(){
            try {
                this.orders = []
                let response = await db.collection('orders')
                                        .where('idRestaurant', '==', this.restaurant.id)
                                        .onSnapshot(query => {
                                            this.orders = []

                                            query.forEach(doc => {
                                                let order = doc.data()

                                                Object.defineProperty(order, 'id', {
                                                    enumerable: true,
                                                    configurable: true,
                                                    writable: true,
                                                    value: doc.id
                                                });

                                                this.orders.push(order)
                                            })
                                        })
            } catch (error) {
                console.log(error)
            }
        },

        async getDeliveryMan(args){
            try {
                let response = await db.collection('users')
                                        .doc(args.deliveryMan)
                                        .get()

                if (response.exists) {
                    this.deliveryMan = response.data()

                    $('#deliveryMan').modal('show')
                }
            } catch (error) {
                console.log(error)
            }
        },

        searchDeliveryMan(order){

            this.order = order

            console.log(this.restaurant.position.__)
            console.log(this.restaurant.position.l_)

            index.search('Usuario', {
                    aroundLatLng: `${this.restaurant.position.l_}, ${this.restaurant.position.__}`,
                    aroundRadius: 90000, // 1km = 1000
                    filters: `available=1`,
                }).then(({ hits }) => {
                    console.log(hits);
                    this.deliveryMans = hits
                    this.deliveryManList = hits

                    $('#deliveryManlist').modal('show')
                })
        },
    },
}
</script>
