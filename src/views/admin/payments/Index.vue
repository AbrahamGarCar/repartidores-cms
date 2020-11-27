<template>
    <section class="col-md-12">
        <!-- boton para agregar usuario -->
        <div class="row">
            <div class="col-md-12">
                <h5>Periodo de facturacion</h5>
                <input type="date" v-model="dateRange.startDate">
                <input type="date" v-model="dateRange.endDate">

                <button class="ml-2 btn btn-sm btn-success" @click="getPayments">Buscar</button>
            </div>
        </div>

        <hr>

        <div class="row mt-2">
            <div class="col-md-12">
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Direccion</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in payments" :key="index">
                            <th scope="row">{{ item.name }}</th>
                            <td>{{ item.direction }}</td>
                            <td>{{ item.planActivate | date }}</td>
                            <td>${{ item.amount }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-md-12 text-right">
                <h5>Total: ${{ totalAmount }}</h5>
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

            payments: [],
        }
    },

    created() {
        this.getPayments()
    },

    computed: {
        ...mapState([
            'user'
        ]),

        totalAmount(){
            if (this.payments.length != 0) {

                var totalAmount = this.payments.reduce((sum, value) => (typeof value.amount == "number" ? sum + value.amount : sum), 0);
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

        async getPayments(){
            try {
                this.payments = []

                let date1 = new Date(this.dateRange.startDate)
                let date2 = new Date(this.dateRange.endDate)

                let response = await db.collection('payments')
                                        .where('planActivate', '>=', date1)
                                        .where('planActivate', '<=', date2)
                                        .get()
                                        .then(query => {
                                            query.forEach(async doc => {
                                                let data = doc.data()
                                                let restaurant = await db.collection('restaurants').doc(data.restaurant).get()

                                                Object.defineProperty(data, 'restaurantData', {
                                                    enumerable: true,
                                                    configurable: true,
                                                    writable: true,
                                                    value: restaurant.data()
                                                });

                                                this.payments.push(data)
                                            });
                                        })
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style>

</style>