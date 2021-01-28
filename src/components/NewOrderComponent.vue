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
    }
</style>

<template>
    <section>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-success rounded-0" @click="newOrderFormat">Nueva orden</button>
            </div>
        </div>

        <div class="modal fade" id="newOrderFormat" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="newOrderFormatLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content rounded-0">
                <div class="modal-header">
                    <h5 class="modal-title" id="newOrderFormatLabel">Nueva orden</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 text-right">
                                <h5>Numero de orden: {{ order.orderNumber }}</h5>
                            </div>
                            <div class="col-md-12">
                                <google-places-autocomplete
                                    class="rounded-0"
                                    @resultChanged="placeDetail => place = placeDetail"
                                    @resultCleared="() => place = null"
                                    >
                                    <div class="rounded-0" slot="input" slot-scope="{ context, events, actions }">
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
                                <small class="text-danger" v-if="!$v.place.required">Campo requerido</small>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="form-group">
                                    <label for="name">Nombre</label>
                                    <input name="name" v-model="order.details.name" class="form-control rounded-0" type="text">
                                    <small class="text-danger" v-if="!$v.order.details.name.required">Campo requerido</small>
                                </div>
                                <div class="form-group">
                                    <label for="telephone">Telefono</label>
                                    <input name="telephone" v-model="order.details.telephone" class="form-control rounded-0" type="text">
                                </div>
                                <div class="form-group">
                                    <label for="reference">Referencia</label>
                                    <textarea class="form-control rounded-0" name="reference" v-model="order.details.reference" id="" cols="30" rows="5"></textarea>
                                    
                                </div>
                                <div class="form-group">
                                    <label for="cost">Costo del pedido</label>
                                    <input name="cost" v-model="order.cost" class="form-control rounded-0" type="number" min="0">
                                    <small class="text-danger" v-if="!$v.order.cost.required">Campo requerido</small>
                                    <small class="text-danger" v-if="!$v.order.cost.decimal">Debe de ser un numero</small>
                                    <small class="text-danger" v-if="!$v.order.cost.minValue">Debe de ser mayor o igual a 0</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary rounded-0" :disabled="$v.$invalid" @click="saveOrder">Guardar</button>
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
import { required, minLength, between, decimal, minValue } from 'vuelidate/lib/validators'

//haversine
const haversine = require('haversine')

//Axios
const axios = require('axios')

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

export default {
    name: 'NewOrderComponent',

    props: [ 'restaurant' ],

    data(){
        return{

            order: {
                directionDestination: '',
                destination: null,
                cost: 0,
                details: {
                    name: '',
                    telephone: '',
                    reference: '',
                },
                status: 'PENDIENTE',
                idRestaurant: '',
                level: 1,
                orderNumber: 0,
                process: 1,
                orderDate: new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
            },

            APIKEY: 'AIzaSyDndG_C_5iRRkYDO3GHchQFNUchdBZvDas',

            place: null
        }
    },

    validations: {
        place: {
            required
        },
        order: {
            details: {
                name: {
                    required,
                }
            },
            cost: {
                required,
                decimal,
                minValue: minValue(0)
            }
            
        },
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    created() {
        
    },

    watch: {
        place(){
            if (this.place != null) {
                this.order.directionDestination = this.place.formatted_address
                this.order.destination = new firebase.firestore.GeoPoint(this.place.geometry.location.lat(), this.place.geometry.location.lng())
            }    
        }
    },

    methods: {
        randomOrderNumber(longitud, caracteres) {
            longitud = longitud || 6;
            caracteres = caracteres || "0123456789";

            var cadena = "";
            var max = caracteres.length-1;
            for (var i = 0; i<longitud; i++) {
                cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
            }
            return Number(cadena);
        },

        binnie(args){
            let km = args
            let cost = 2
            let costClient = 5

            let total = 0

            if (km <= 3.4) {
                total = 25

                return [total, 20, 5]
            }else{
                let diff = km - 3.5
                let multiplo = parseInt(diff) + 1

                total = (20 + (costClient * multiplo)) + (5 + (cost * multiplo))

                return [total, (20 + (costClient * multiplo)), (5 + (cost * multiplo))]
            }

            return [total, 20, 5]
        },

        newOrderFormat(){
            this.order.orderNumber = this.randomOrderNumber()
            $('#newOrderFormat').modal('show')
        },

        async getDistance(start, end) {
            
            const service = new google.maps.DistanceMatrixService();

            service.getDistanceMatrix({
                origins: [start],
                destinations: [end],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            },
            (response, status) => {
                if (status !== "OK") {
                    alert("Error was: " + status);
                } else {
                    let km = (response.rows[0].elements[0].distance.value)/1000

                    let cost = this.binnie(km)

                    let infoDestination = {
                        distance: response.rows[0].elements[0].distance.text,
                        duration: response.rows[0].elements[0].duration.text,
                        value: km,
                        cost: cost[0],
                        costClient: cost[1],
                        costRestaurant: cost[2],
                    }

                    this.insertOrder(infoDestination)
                }
            })


        },

        async insertOrder(infoDestination){
            try {
                Swal.fire({
                    title: '¿Quieres guardar esta orden?',
                    text: "Se registrara el pedido!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Registrar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        this.order.idRestaurant = this.restaurant.id
                        this.order.directionOrigin = this.restaurant.direction
                        this.order.origin = this.restaurant.position
                        this.order.name = this.restaurant.name
                        this.order.infoDestination = infoDestination

                        let response = await db.collection('orders').add(this.order)

                        if (response) {
                            
                            Swal.fire(
                            'Guardada!',
                            'Se ha registrado el pedido.',
                            'success'
                            )
                            
                            this.order.directionDestination = ''
                            this.order.destination = null
                            this.order.details.name = ''
                            this.order.details.telephone = ''
                            this.order.details.reference = ''

                            this.place = null
                            $('#newOrderFormat').modal('hide')
                        }
                       
                    }
                })

                
            } catch (error) {
                console.log(error)
            }
        },

        async saveOrder(){
            try {

                const start = {
                    lat: this.restaurant.position.l_,
                    lng: this.restaurant.position.__
                }

                const end = {
                    lat: this.order.destination.l_,
                    lng: this.order.destination.__
                }

                this.getDistance(start, end)

            } catch (error) {
                console.log(error)
            }
        }
    },
}
</script>