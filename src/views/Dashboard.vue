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

    .btn-main{
        border: none !important;
        border-radius: 0 !important;
    }
</style>

<template>
    <section class="row" :key="componentKey">
        <div class="col-md-12">
            <div class="row mt-4">
                <div class="col-md-12" v-if="user != null && user.active">
                    <NewOrder :restaurant="restaurant" />
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-md-12 mt-2">
                    <h3 style="font-weight: bold;">Ordenes pendientes</h3>
                </div>
                <div class="col-md-12">
                    <div class="card rounded-0">
                        <div class="card-body rounded-0">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Direccion</th>
                                        <th scope="col">Costo</th>
                                        <th scope="col">Distancia</th>
                                        <th scope="col">Tiempo</th>
                                        <th scope="col">Envio</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in pendingOrders" :key="index">
                                        <th scope="row">{{ item.orderNumber }}</th>
                                        <td>{{ item.details.name }}</td>
                                        <td>{{ item.directionDestination }}</td>
                                        <td>${{ item.cost - item.infoDestination.costRestaurant }}</td>
                                        <td>{{ item.infoDestination.distance }}</td>
                                        <td>{{ item.infoDestination.duration }}</td>
                                        <td>${{ item.infoDestination.cost }}</td>
                                        <td>${{ getTotal(item.cost, item.infoDestination.cost) }}</td>
                                        <td class="text-center">
                                            <button v-if="item.level == 1" class="btn btn-info btn-main" @click="searchDeliveryMan(item)">
                                                <i class="fas fa-motorcycle"></i>
                                            </button>
                                            <button v-else class="btn btn-danger rounded-0" @click="searchDeliveryMan(item)">
                                                <div class="spinner-border spinner-border-sm" role="status">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-12 mt-2">
                    <h3 style="font-weight: bold;">Ordenes aceptadas</h3>
                </div>
                <div class="col-md-12">
                    <div class="card rounded-0">
                        <div class="card-body rounded-0">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Direccion</th>
                                        <th scope="col">Costo</th>
                                        <th scope="col">Distancia</th>
                                        <th scope="col">Tiempo</th>
                                        <th scope="col">Envio</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in aceptedOrders" :key="index">
                                        <th scope="row">{{ item.orderNumber }}</th>
                                        <td>{{ item.details.name }}</td>
                                        <td>{{ item.directionDestination }}</td>
                                        <td>${{ item.cost - item.infoDestination.costRestaurant }}</td>
                                        <td>{{ item.infoDestination.distance }}</td>
                                        <td>{{ item.infoDestination.duration }}</td>
                                        <td>${{ item.infoDestination.cost }}</td>
                                        <td>${{ getTotal(item.cost, item.infoDestination.cost) }}</td>
                                        <td class="text-center">
                                            <button class="btn btn-info btn-main" @click="getDeliveryMan(item)">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!--Lista de repartidores-->
            <div class="modal fade" id="deliveryManlist" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="deliveryManlistLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content rounded-0">
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
                                                    <!-- <th scope="col">Opciones</th> -->
                                                    <th scope="col">Nombre</th>
                                                    <th scope="col">Telefono</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in deliveryMans" :key="index">
                                                    <!-- <th scope="row">
                                                        <input type="checkbox" :value="item" v-model="deliveryManList">
                                                    </th> -->
                                                    <th>
                                                        {{ item.name }}
                                                    </th>
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
                            <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-success rounded-0" @click="releaseNotifications">Notificar</button>
                        </div>
                    </div>
                </div>
            </div>
            <!--Info de repartidor-->
            <div class="modal fade" id="deliveryMan" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="deliveryManLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content rounded-0">
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

                                    <h5>Telefono</h5>
                                    <p>{{ deliveryMan.telephone }}</p>
                                </div>
                            </div>

                            <div class="row" v-if="order.process == 1">
                                <div class="col-md-12">
                                    <button class="btn btn-warning btn-block btn-main" @click="orderCompleteNotification">
                                        <i class="fas fa-comment-dots"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                    </div>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <div class="modal fade" id="activateModal" tabindex="-1" aria-labelledby="activateModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-0">
                        <div class="modal-body d-flex justify-content-center align-items-center flex-column">
                            <h2>Cuenta suspendida</h2>
                            <p class="text-center">Tu cuenta ha sido suspendida, ponte en contacto al siguiente numero para aclaraciones</p>
                            <p class="text-center">555-555-555</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="passwordModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-0">
                        <div class="modal-body d-flex justify-content-center align-items-center flex-column">
                            <h2>Cambiar contraseña</h2>
                            <p class="text-center">Tu cuenta ha sido activada por primera ves, tienes que cambiar tu contraseña</p>
                            <div class="row">
                                <div class="col-md-12">
                                    <form @submit.prevent="updatePassword">
                                        <div class="form-group">
                                            <label for="password">Nueva contraseña</label>
                                            <input id="password" type="password" class="form-control" v-model="newPassword">
                                        </div>
                                        <button type="submit" class="btn btn-success btn-block">Guardar</button>
                                        <button class="btn btn-danger btn-block" @click="logOut">Salir</button>
                                    </form>
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

//Moment
// const moment = require('moment');
const moment = require('moment-timezone');

//Luxon
const { DateTime } = require("luxon");

//Firebase
import { firebase, db, firestore, auth } from '@/firebase'

//Components
import NewOrder from '../components/NewOrderComponent'

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

//Vuelidate
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
    name: 'Dashboard',

    components: {
        NewOrder, 
    },

    data(){
        return{
            componentKey: 0,
            restaurant: null,
            orders: [],

            order: null,

            deliveryMan: null,
            deliveryMans: null,
            deliveryManList: [],

            newPassword: '',
        }
    },

    validations: {
        newPassword: {
            required,
            minLength: minLength(6)
        },
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

    mounted() {
       if (this.user != null) {
            if (!this.user.active) {
                $('#activateModal').modal({backdrop:'static',keyboard:false, show:true})

                return
            }

            if (this.user.changePassword) {
                $('#passwordModal').modal('show')
            }
       } 
       
    },

    created() {
        if (this.user != null) {
            this.getRestaurant()
        }
        
    },

    watch: {
        user(){
            if (this.user != null) {
                console.log('watcher');

                if (!this.user.active) {
                    $('#activateModal').modal({backdrop:'static',keyboard:false, show:true})

                    return
                }

                if (this.user.changePassword) {
                    $('#passwordModal').modal('show')
                }
                this.getRestaurant()
            }    
        },
    },

    methods: {
        getTotal(cost, delivery){
            return Number(cost) + Number(delivery)
        },

        async updatePassword(){
            if(!this.$v.newPassword.required){
                alert('Ingresa una contraseña')

                return
            }

            if(!this.$v.newPassword.minLength){
                alert('Ingresa una contraseña de minimo 6 caracteres')

                return
            }

            try {
                var user = firebase.auth().currentUser;

                user.updatePassword(this.newPassword).then(async () => {
                    await db.collection('users').doc(this.user.uid).update({ changePassword: false })
                    $('#passwordModal').modal('hide')
                }).catch((error) => {
                    console.log(error);

                    if (error.code == 'auth/requires-recent-login') {
                        alert('Inicia sesion nuevamente')
                    }
                });
            } catch (error) {
                console.log(error);
            }

            
        },

        logOut(){
            $('#passwordModal').modal('hide')
            auth.signOut().then(() => this.$router.replace('login'))
        },

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
                    batch.set(ref, { title: 'Nueva orden', content: `Hay una nueva orden disponible, costo: $${this.order.cost}, envío: $${this.order.infoDestination.cost}, total: $${this.getTotal(this.order.cost, this.order.infoDestination.cost)}` })
                })

                // Commit the entire batch
                return batch.commit();
            } catch (error) {
                console.log(error)
            }
        },

        async orderCompleteNotification(){
            try {
                Swal.fire({
                    title: '¿Avisar que la orden esta lista?',
                    text: "Se le notificara al repartidor!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Notificar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        await db.collection('orders').doc(this.order.id).update({ process: 2 })
                        await db.collection('notifications').doc(this.deliveryMan.token).set({ title: 'Orden lista', content: 'Tu entrega ya se encuentra lista' })

                        Swal.fire(
                            'Notificado!',
                            'Usuario notificado',
                            'success'
                        )
                    
                    }
                    
                })
                
            } catch (error) {
                console.log(error);
            }
        },

        async getOrders(){
            try {
                this.orders = []
                let response = await db.collection('orders')
                                        .where('idRestaurant', '==', this.restaurant.id)
                                        .where('status', 'in', ['PENDIENTE', 'ACEPTADA'])
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
            this.order = args

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
            client.clearCache()

            this.componentKey += 1;

            this.deliveryMans = null
            this.deliveryManList = []
            this.order = order

            console.log(this.restaurant.position.l_)
            console.log(this.restaurant.position.__)

            index.search('user', {
                    aroundLatLng: `${this.restaurant.position.l_}, ${this.restaurant.position.__}`,
                    // aroundLatLng: '28.7221648, -106.1476528',
                    aroundRadius: 6000, // 1km = 1000
                    filters: `active=1`,
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
