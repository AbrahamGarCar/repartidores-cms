<template>
    <section class="col-md-12">
        <div class="row">
            <div class="col-md-4" v-if="information.users != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Usuarios registrados</h4>
                    <p>{{ information.users }}</p>
                </div>
                    
            </div>
            <div class="col-md-4" v-if="information.orders != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Ordenes registradas</h4>
                    <p>{{ information.orders }}</p>
                </div>
                    
            </div>
            <div class="col-md-4" v-if="information.restaurants != null">
                <div class="card rounded-0 d-flex justify-content-center align-items-center flex-column">
                    <h4>Establecimientos registradas</h4>
                    <p>{{ information.restaurants }}</p>
                </div>
                    
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-12">
                <h2>Ordenes pendientes</h2>
            </div>
        </div>

        <hr>    

        <div class="row mt-4" v-if="orders.length != 0">
            <div class="col-md-4" v-for="(order, index) in orders" :key="index">
                <div class="tile">
                    <div class="wrapper">
                        <div class="header">
                            <h4>{{ order.name }}</h4>
                        </div>

                        <div class="banner-img">
                            <p> <strong>Direccion destino</strong> : {{ order.directionDestination }}</p>
                            <p> <strong>Direccion origen</strong>: {{ order.directionOrigin }}</p>
                        </div>

                        <div class="stats">

                            <div>
                                <strong>COSTO</strong> ${{ Number(order.cost) - order.infoDestination.costRestaurant }}
                            </div>

                            <div>
                                <strong>ENVIO</strong> ${{ order.infoDestination.costClient }}
                            </div>

                            <div>
                                <strong>TOTAL</strong> ${{ Number(order.cost) + order.infoDestination.costClient }}
                            </div>

                        </div>

                        <div class="footer">
                            <button class="btn btn-info rounded-0">Enviar</button>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-12 text-center">
                <h2>No hay ordenes pendientes</h2>
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
    name: 'Dashboard',

    data(){
        return{
            information: {
                users: null,
                orders: null,
                restaurants: null,
            },

            orders: []
        }
    },

    mounted() {
        this.getData()
        this.getOrders()
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    methods: {
        async getData(){
            try {
                let users = await db.collection('users').doc('counter').get()
                if (users) {
                    this.information.users = users.data().usersCount
                }
                let orders = await db.collection('orders').doc('counter').get()
                if (orders) {
                    this.information.orders = orders.data().ordersCount
                }
                let restaurants = await db.collection('restaurants').doc('counter').get()
                if (restaurants) {
                    this.information.restaurants = restaurants.data().restaurantsCount
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getOrders(){
            try {
                let response = await db.collection('orders')
                                        .where('level', '==', 2)
                                        .where('status', '==', 'PENDIENTE')
                                        .onSnapshot((query) => {
                                            this.orders = []
                                            query.forEach(doc => {
                                                let order = doc.data()

                                                Object.defineProperty(order, 'id', {
                                                    enumerable: false,
                                                    configurable: false,
                                                    writable: false,
                                                    value: doc.id
                                                });

                                                this.orders.push(order)
                                            });
                                        });
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style>
.tile{
    border:1px solid #DFDFDF;
	width: 100%;
	background:#fff;
	border-radius:5px;
	box-shadow:0px 2px 3px -1px rgba(151, 171, 187, 0.7);
	float:left;
  	transform-style: preserve-3d;
  	margin: 10px 5px;

}

.header{
	border-bottom:1px solid #DFDFDF;
	padding:19px 0;
	text-align:center;
	color:#59687f;
	font-size:600;
	font-size:19px;	
	position:relative;
}

.banner-img {
	padding: 5px 5px 0;
}

.banner-img img {
	width: 100%;
	border-radius: 5px;
}

.dates{
	border:1px solid #DFDFDF;
	border-radius:5px;
	padding:20px 0px;
	margin:10px 20px;
	font-size:16px;
	color:#5aadef;
	font-weight:600;	
	overflow:auto;
}
.dates div{
	float:left;
	width:50%;
	text-align:center;
	position:relative;
}
.dates strong,
.stats strong{
	display:block;
	color:#adb8c2;
	font-size:11px;
	font-weight:700;
}
.dates span{
	width:1px;
	height:40px;
	position:absolute;
	right:0;
	top:0;	
	background:#DFDFDF;
}
.stats{
	border-top:1px solid #DFDFDF;
    border-bottom:1px solid #DFDFDF;
	background:#f7f8fa;
	overflow:auto;
	padding:15px 0;
	font-size:16px;
	color:#59687f;
	font-weight:600;
	border-radius: 0 0 5px 5px;
}
.stats div{
	border-right:1px solid #DFDFDF;
	width: 33.33333%;
	float:left;
	text-align:center
}

.stats div:nth-of-type(3){border:none;}

div.footer {
	text-align: right;
	position: relative;
	margin: 20px 5px;
}

div.footer a.Cbtn{
	padding: 10px 25px;
	background-color: #DADADA;
	color: #666;
	margin: 10px 2px;
	text-transform: uppercase;
	font-weight: bold;
	text-decoration: none;
	border-radius: 3px;
}

div.footer a.Cbtn-primary{
	background-color: #5AADF2;
	color: #FFF;
}

div.footer a.Cbtn-primary:hover{
	background-color: #7dbef5;
}

div.footer a.Cbtn-danger{
	background-color: #fc5a5a;
	color: #FFF;
}

div.footer a.Cbtn-danger:hover{
	background-color: #fd7676;
}
</style>