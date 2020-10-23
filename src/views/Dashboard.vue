<style>
    
</style>

<template>
    <section>
        <div class="row mt-4">
            <div class="col-md-12">
                <NewOrder :restaurant="restaurant" />
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-md-12 mt-2">
                <h3>Ordenes pendientes</h3>
            </div>
            <div class="col-md-4" v-for="(item, index) in pendingOrders" :key="index">
                <div class="card p-2">
                    <p><span style="font-weight: bold;">Numero de orden:</span> {{ item.id }}</p>
                    <p><span style="font-weight: bold;">Cliente:</span>  {{ item.details.name }}</p>
                    <p><span style="font-weight: bold;">Direccion:</span>  {{ item.directionDestination }}</p>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-12 mt-2">
                <h3>Ordenes en curso</h3>
            </div>
            <div class="col-md-4" v-for="(item, index) in ordersInProgress" :key="index">
                <div class="card p-2">
                    <p><span style="font-weight: bold;">Numero de orden:</span> {{ item.id }}</p>
                    <p><span style="font-weight: bold;">Cliente:</span>  {{ item.details.name }}</p>
                    <p><span style="font-weight: bold;">Direccion:</span>  {{ item.directionDestination }}</p>
                    <button class="btn btn-block btn-info" @click="getDeliveryMan(item)">Ver datos del repartidor</button>
                </div>
            </div>
        </div>

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
import { mapState } from 'vuex'
import { firebase, db, firestore } from '@/firebase'

//Components
import NewOrder from '../components/NewOrderComponent'

export default {
    name: 'Dashboard',

    components: {
        NewOrder, 
    },

    data(){
        return{
            restaurant: null,
            orders: [],

            deliveryMan: null,
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),

        pendingOrders(){
            return this.orders.filter(doc => doc.status == 'PENDIENTE')
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
        }
    },
}
</script>
