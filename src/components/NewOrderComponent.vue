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
        <button class="btn btn-success" @click="newOrderFormat">Nueva orden</button>

        <div class="modal fade" id="newOrderFormat" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="newOrderFormatLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="newOrderFormatLabel">Nueva orden</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
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
                                <small class="text-danger" v-if="!$v.place.required">Campo requerido</small>
                            </div>
                            <div class="col-md-12 mt-3">
                                <div class="form-group">
                                    <label for="name">Nombre</label>
                                    <input name="name" v-model="order.details.name" class="form-control" type="text">
                                    <small class="text-danger" v-if="!$v.order.details.name.required">Campo requerido</small>
                                </div>
                                <div class="form-group">
                                    <label for="telephone">Telefono</label>
                                    <input name="telephone" v-model="order.details.telephone" class="form-control" type="text">
                                </div>
                                <div class="form-group">
                                    <label for="reference">Referencia</label>
                                    <textarea class="form-control" name="reference" v-model="order.details.reference" id="" cols="30" rows="10"></textarea>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" :disabled="$v.$invalid" @click="saveOrder">Guardar</button>
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

export default {
    name: 'NewOrderComponent',

    props: [ 'restaurant' ],

    data(){
        return{

            order: {
                directionDestination: '',
                destination: null,
                details: {
                    name: '',
                    telephone: '',
                    reference: '',
                },
                status: 'PENDIENTE',
                idRestaurant: '',
                level: 1,
            },

            place: null,
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
        newOrderFormat(){
            $('#newOrderFormat').modal('show')
        },

        getAlgolia(){
            console.log(this.restaurant.position.__)
            console.log(this.restaurant.position.l_)

            index.search('Usuario', {
                    aroundLatLng: `${this.restaurant.position.l_}, ${this.restaurant.position.__}`,
                    aroundRadius: 1, // 1km = 1000
                    filters: `available=1`,
                }).then(({ hits }) => {
                    console.log(hits);
                })
        },

        async saveOrder(){
            try {

                let conf = confirm('¿Quieres guardar esta orden?')

                if (conf) {
                    this.order.idRestaurant = this.restaurant.id
                    this.order.directionOrigin = this.restaurant.direction
                    this.order.origin = this.restaurant.position
                    this.order.name = this.restaurant.name

                    let response = await db.collection('orders').add(this.order)

                    if (response) {
                        alert('Orden agregada')
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
}
</script>