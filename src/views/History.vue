<style>
    .btn-main{
        border: none !important;
        border-radius: 0 !important;
    }
</style>

<template>
    <div class="row mt-5">
        <section class="col-md-12">
            
            <div class="row">
                <div class="col-md-12">
                    <h3 style="font-weight: bold;">Historial pedidos</h3>
                    <input type="date" v-model="dateRange.startDate">
                    <input type="date" v-model="dateRange.endDate">

                    <button class="ml-2 btn btn-sm btn-success btn-main" @click="getOrders">Buscar</button>
                </div>
            </div>

            <hr>

            <div class="row mt-2">
                <div class="col-md-12">
                    <div class="card rounded-0">
                        <div class="card-body">
                            <table class="table table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Direccion</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Subsidio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in orders" :key="index">
                                        <th scope="row">{{ item.details.name }}</th>
                                        <td>{{ item.directionDestination }}</td>
                                        <td>{{ item.orderDate | date }}</td>
                                        <td class="text-center">${{ item.infoDestination.costRestaurant }}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="row mt-2">
                                <div class="col-md-12 text-right">
                                    <h5>Total: ${{ totalAmount }}</h5>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
            
        </section>
    </div>
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

import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    name: 'Payments',

    components: { DateRangePicker },

    data(){
        return{
            dateRange: {
                startDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()),
                endDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
            },

            orders: [],
        }
    },

    created() {
        this.getOrders()
    },

    computed: {
        ...mapState([
            'user'
        ]),

        totalAmount(){
            if (this.orders.length != 0) {

                var totalAmount = this.orders.reduce((sum, value) => (typeof value.infoDestination.costRestaurant == "number" ? sum + value.infoDestination.costRestaurant : sum), 0);
                return totalAmount
            }
            
        }
    },

    filters: {
        date(value){
            moment.locale('es-mx')
            return moment(value.toDate()).format('LL');
        }
    },

    methods: {

        updateValues(){

        },

        checkOpen(){

        },

        async getOrders(){
            try {
                this.orders = []

                let date1 = new Date(this.dateRange.startDate)
                let date2 = new Date(this.dateRange.endDate)

                console.log(date1);
                console.log(date2);

                let response = await db.collection('orders')
                                        .where('status', '==', 'FINALIZADO')
                                        .where('orderDate', '>=', date1)
                                        .where('orderDate', '<=', date2)
                                        .where('idRestaurant', '==', this.user.restaurant)
                                        .get()
                                        .then(query => {
                                            query.forEach(async doc => {
                                                let data = doc.data()

                                                // if (data.role == 'restaurant') {
                                                //     let restaurant = await db.collection('restaurants').doc(data.restaurant).get()
                                                // }else{
                                                //     let restaurant = await db.collection('users').doc(data.id).get()
                                                // }
                                                

                                                // Object.defineProperty(data, 'paymentUser', {
                                                //     enumerable: true,
                                                //     configurable: true,
                                                //     writable: true,
                                                //     value: restaurant.data()
                                                // });

                                                this.orders.push(data)
                                            });
                                        })
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>