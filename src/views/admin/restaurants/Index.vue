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
        <loading :active.sync="isLoading" 
                :can-cancel="false" 
                :on-cancel="onCancel"
                :is-full-page="fullPage"></loading>
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
                    :rows="restaurantsFilter"
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
                            <button v-on:click="deleteRestaurant(props.row.id)" class="ml-1 btn btn-danger btn-sm btn-main">
                                <i class="fas fa-trash"></i>
                            </button>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </vue-good-table>
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
                            <div class="form-group">
                                <label for="">Categorias</label>
                                <vue-tags-input
                                    v-model="tag"
                                    :tags="restaurant.tags"
                                    :autocomplete-items="filteredItems"
                                    @before-adding-tag="checkTag"
                                    @tags-changed="newTags => restaurant.tags = newTags"
                                />
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
                            <div class="form-group mt-4">
                                <label for="cost">Imagen</label>
                                <input type="file" @change="getImage($event)" accept="image/">
                            </div>
                            <div class="form-group mt-3">
                                <label for="first">
                                    <input type="checkbox" v-model="restaurant.firstTime" name="firstTime" id="first">
                                    Activar promocion
                                </label>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0" :disabled="$v.restaurant.$invalid">Registrar</button>
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
                            <div class="form-group">
                                <label for="">Categorias</label>
                                <vue-tags-input
                                    v-model="tag"
                                    :tags="editRestaurant.tags"
                                    :autocomplete-items="filteredItems"
                                    @before-adding-tag="checkTag"
                                    @tags-changed="newTags => editRestaurant.tags = newTags"
                                />
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
                            <div class="form-group mt-4">
                                <label for="cost">Imagen</label>
                                <input type="file" @change="getImage($event)" accept="image/">
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0" :disabled="$v.editRestaurant.$invalid">Actualizar</button>
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
                                            <h1 class="card-title pricing-card-title">$499.00 <small class="text-muted">/ mo</small></h1>
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
                                            <h1 class="card-title pricing-card-title">$499.00 <small class="text-muted">/ mo</small></h1>
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
import { firebase, db, firestore, storage } from '@/firebase'

const ref = storage.ref()

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('restaurants');

//Vuelidate
import { required, email } from 'vuelidate/lib/validators'

//Moment
const moment = require('moment-timezone');

// Import component
import Loading from 'vue-loading-overlay';

// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

import VueTagsInput from '@johmun/vue-tags-input';

export default {
    components: {
        Loading,
        VueTagsInput
    },

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
            tag: '',
            restaurant: {
                name: '',
                email: '',
                telephone: '',
                direction: '',
                position: null,
                tags: [],
                _geoloc: {
                    lat: 0,
                    lng: 0
                },
                planActivate: new Date(),
                planDeactivate: new Date(),
                plan: null,
                firstTime: false,
                active: false,
            },

            place: null,
            restaurants: [],

            editRestaurant: null,

            selectPhoto: null,

            foodImage: null,

            isLoading: false,
            fullPage: true,

            autocompleteItems: [{
                text: 'Tacos',
            }, {
                text: 'Hamburguesas',
            }, {
                text: 'Mexicana',
            }, {
                text: 'Postres',
            }, {
                text: 'Carne',
            }, {
                text: 'Pizza',
            }, {
                text: 'Bebidas',
            }, {
                text: 'Alitas & Pollo',
            }, {
                text: 'Asiática',
            }, {
                text: 'Mariscos',
            }, {
                text: 'Americana',
            }, {
                text: 'Café',
            }, {
                text: 'Alcohol',
            }, {
                text: 'Donas',
            }, {
                text: 'Panadería',
            }, {
                text: 'Tortas',
            }, {
                text: 'Sándwiches',
            }, {
                text: 'Sushi',
            }, {
                text: 'Italiana',
            }, {
                text: 'Saludable',
            }, {
                text: 'Snacks',
            }],

        }
    },

    validations: {
        restaurant: {
            name: {
                required
            },
            email: {
                email,
                required
            },
            telephone: {
                required
            },
            tags: {
                required
            },
            direction: {
                required
            }
        },

        editRestaurant: {
            name: {
                required
            },
            email: {
                email,
                required
            },
            telephone: {
                required
            },
        }
    },

    watch: {
        place(){
            if (this.place != null) {

                if (this.editRestaurant != null) {
                    this.editRestaurant.direction = this.place.formatted_address
                    this.editRestaurant.position = new firebase.firestore.GeoPoint(this.place.geometry.location.lat(), this.place.geometry.location.lng())

                    this.editRestaurant._geoloc.lat = this.place.geometry.location.lat()
                    this.editRestaurant._geoloc.lng = this.place.geometry.location.lng()
                }

                this.restaurant.direction = this.place.formatted_address
                this.restaurant.position = new firebase.firestore.GeoPoint(this.place.geometry.location.lat(), this.place.geometry.location.lng())

                this.restaurant._geoloc.lat = this.place.geometry.location.lat()
                this.restaurant._geoloc.lng = this.place.geometry.location.lng()
            }    
        }
    },

    computed: {
        restaurantsFilter(){
            return this.restaurants.filter(doc => doc.name)
        },

        filteredItems() {
            return this.autocompleteItems.filter(i => {
                return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
            });
        },
    },

    created(){
        this.getRestaurant()
    },

    methods:{
        onCancel() {
            console.log('User cancelled the loader.')
        },

        checkTag(obj) {
            console.log(obj);
            let find = this.autocompleteItems.find(element => element.text == obj.tag.text)
            if (this.editRestaurant != null)
                if (!find || this.editRestaurant.tags.length >= 2) alert('Invalido');
                else obj.addTag();
            
            else if (!find || this.restaurant.tags.length >= 2) alert('Invalido');
            
            else obj.addTag();
        },

        getImage(e){
            this.foodImage = e.target.files[0]
            console.log(this.foodImage);
        },

        //Generar UUID
        generateUUID(){
            var h = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
            var k = ['x','x','x','x','x','x','x','x','-','x','x','x','x','-','4','x','x','x','-','y','x','x','x','-','x','x','x','x','x','x','x','x','x','x','x','x'];
            var u = '',i=0,rb=Math.random()*0xffffffff|0;
            while(i++<36) {
                var c=k[i-1],r=rb&0xf,v=c=='x'?r:(r&0x3|0x8);
                u+=(c=='-'||c=='4')?c:h[v];rb=i%8==0?Math.random()*0xffffffff|0:rb>>4
            }
            return u
        },

        async uploadImage(){
            // this.isLoading = true;

            try {
                let metadata = {
                    contentType: "image/jpeg",
                    contentLanguage: "es",
                }

                let fotoId = this.generateUUID()

                const refImg = ref.child('foods/' + fotoId + '.jpg')
                return refImg.put(this.foodImage, metadata)
                .then(e => {
                    console.log(e)

                    return ref.child('foods/' + fotoId + '.jpg').getDownloadURL()
                    .then(async (url) => {

                        return url                        
                        
                    })
                    // this.getResizePath(fotoId)
                })
                .catch(error => console.log(error))
            } catch (error) {
                console.log(error);
                this.isLoading = false;
            }
        },

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

        async deleteRestaurant(args){
            try {
                Swal.fire({
                    title: '¿Quieres eliminar este establecimiento?',
                    text: "No hay vuelta atras!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await db.collection('restaurants').doc(args).delete()

                        Swal.fire(
                        'Eliminado!',
                        'El establecimiento ha sido eliminado',
                        'success'
                        )
                    }
                })
            } catch (error) {
                console.log(error);
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
                        this.isLoading = true;
                        let url = null
                        if (this.foodImage == null) {
                            url = 'https://cdn.browshot.com/static/images/not-found.png'
                        }else{
                            url = await this.uploadImage()
                            this.foodImage = null
                        }

                        this.restaurant.image = url

                        let response = await db.collection('restaurants').add(this.restaurant)
                                                .then(async docRef => {
                                                    console.log("Document written with ID: ", docRef.id)

                                                    await db.collection('restaurants').doc(docRef.id)
                                                                                        .update({ id: docRef.id })
                                                })

                        this.isLoading = false;

                        $('#exampleModal').modal('hide')

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
            this.isLoading = true

            try {
                if (this.foodImage == null) {
                    this.editRestaurant.image = this.editRestaurant.image
                }else{
                    let url = await this.uploadImage()

                    this.foodImage = null

                    this.editRestaurant.image = url
                }

                let response = await db.collection('restaurants').doc(this.editRestaurant.id)
                                        .update(this.editRestaurant)
                                        .then(query => {
                                            this.isLoading = false
                                            $('#editModal').modal('hide')

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
