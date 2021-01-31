<template>
    <div class="row mt-5">
        <loading :active.sync="isLoading" 
                :can-cancel="false" 
                :on-cancel="onCancel"
                :is-full-page="fullPage"></loading>
        <div class="col-md-12">
            <div class="col-md-12 text-center">
                <h2>{{ data.name }}</h2>
            </div>
            <div class="row mt-4">
                <div class="col-md-12" v-if="user != null && user.active">
                    <button class="btn btn-success rounded-0" @click="newFoodFormat">Nuevo menu</button>
                </div>
            </div>

            <div class="modal fade" id="newFoodFormat" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="newFoodFormatLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content rounded-0">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newFoodFormatLabel">Agregar comida</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col-md-12 mt-3">
                                        <div class="form-group">
                                            <label for="name">Nombre</label>
                                            <input name="name" v-model="food.name" class="form-control rounded-0" type="text">
                                            <small class="text-danger" v-if="!$v.food.name.required">Campo requerido</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="description">Descripcion</label>
                                            <textarea class="form-control rounded-0" name="description" v-model="food.description" id="" cols="30" rows="5"></textarea>
                                            <small class="text-danger" v-if="!$v.food.description.required">Campo requerido</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="cost">Costo del pedido</label>
                                            <input name="cost" v-model="food.cost" class="form-control rounded-0" type="number" min="0">
                                            <small class="text-danger" v-if="!$v.food.cost.required">Campo requerido</small>
                                            <small class="text-danger" v-if="!$v.food.cost.decimal">Debe de ser un numero</small>
                                            <small class="text-danger" v-if="!$v.food.cost.minValue">Debe de ser mayor o igual a 0</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="cost">Imagen</label>
                                            <input type="file" @change="getImage($event)" accept="image/">
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary rounded-0" :disabled="$v.food.$invalid" @click="saveMenu">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal editar -->
            <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content rounded-0">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editModalLabel">Editar Usuario</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" v-if="editFood != null">
                            <form @submit.prevent="saveFoodEdit" method="post">
                                <div class="row">
                                    <div class="col-md-12 mt-3">
                                        <div class="form-group">
                                            <label for="name">Nombre</label>
                                            <input name="name" v-model="editFood.name" class="form-control rounded-0" type="text">
                                            <small class="text-danger" v-if="!$v.editFood.name.required">Campo requerido</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="description">Descripcion</label>
                                            <textarea class="form-control rounded-0" name="description" v-model="editFood.description" id="" cols="30" rows="5"></textarea>
                                            <small class="text-danger" v-if="!$v.editFood.description.required">Campo requerido</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="cost">Costo del pedido</label>
                                            <input name="cost" v-model="editFood.cost" class="form-control rounded-0" type="number" min="0">
                                            <small class="text-danger" v-if="!$v.editFood.cost.required">Campo requerido</small>
                                            <small class="text-danger" v-if="!$v.editFood.cost.decimal">Debe de ser un numero</small>
                                            <small class="text-danger" v-if="!$v.editFood.cost.minValue">Debe de ser mayor o igual a 0</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="cost">Imagen</label>
                                            <input type="file" @change="getImage($event)" accept="image/">
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-primary rounded-0" :disabled="$v.editFood.$invalid">Actualizar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-12">
                    <vue-good-table
                        title="Menus"
                        
                        :search-options="{
                            enabled: true
                        }"
                        :pagination-options="{
                            enabled: true,
                            mode: 'pages'
                        }"
                        :columns="columns"
                        :rows="foods"
                        :lineNumbers="true"
                        :defaultSortBy="{field: 'name', type: 'asec'}"
                        :globalSearch="true"
                        :paginate="true"
                        styleClass="table condensed table-bordered table-striped">
                        
                        <template slot="table-row" slot-scope="props">
                            <span class="text-center" v-if="props.column.field == 'active'">
                                <i v-if="!props.row.active" style="font-size: 22px; cursor: pointer;" @click="changeStatus(props.row)" class="fas fa-toggle-off"></i>
                                <i v-else style="font-size: 22px; cursor: pointer;" @click="changeStatus(props.row)" class="fas fa-toggle-on"></i>
                            </span>
                            <img class="text-center" v-else-if="props.column.field == 'image'" width="80px" :src="props.row.image" alt="">
                            <span class="text-center" v-else-if="props.column.field == 'options'">
                                <button v-on:click="editFood = props.row" class="btn btn-info btn-sm btn-main" data-toggle="modal" data-target="#editModal">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="ml-1 btn btn-success btn-sm btn-main">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </span>
                            <span v-else>
                                {{props.formattedRow[props.column.field]}}
                            </span>
                        </template>
                    </vue-good-table>
                </div>
            </div>
        </div>
    </div>
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
import { firebase, db, firestore, storage } from '@/firebase'

const ref = storage.ref()

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

//Vuelidate
import { required, minLength, between, decimal, minValue } from 'vuelidate/lib/validators'

// Import component
import Loading from 'vue-loading-overlay';

// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'MenuDetails',

    components: {
        Loading
    },

    props: [
        'data'
    ],

    data(){
        return{
            foods: [],
            food: {
                name: '',
                description: '',
                cost: 0,
                active: true,
            },
            columns: [
                {
                    label: 'Nombre',
                    field: 'name',
                    filterable: true,
                },
                {
                    label: 'Descripcion',
                    field: 'description',
                    filterable: true,
                },
                {
                    label: 'Imagen',
                    field: 'image',
                    filterable: true,
                },
                {
                    label: 'Costo',
                    field: 'cost',
                    filterable: true,
                },
                {
                    label: 'Estatus',
                    field: 'active',
                },
                {
                    label: 'Opciones',
                    field: 'options',
                },

            ],
            editFood: null,

            selectPhoto: null,

            foodImage: null,

            isLoading: false,
            fullPage: true
        }
    },

    created(){
        this.getFood()
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    validations: {
        food: {
            name: {
                required,
            },
            description: {
                required,
            },
            cost: {
                required,
                decimal,
                minValue: minValue(0)
            }
            
        },

        editFood: {
            name: {
                required
            },
            description: {
                required
            },
            cost: {
                required,
                decimal,
                minValue: minValue(0)
            }
        }
    },

    methods: {
        onCancel() {
            console.log('User cancelled the loader.')
        },

        async getFood(){
            try {
                let response = await db.collection('foods')
                                        .where('idMenu', '==', this.data.id)
                                        .onSnapshot(query => {
                                            this.foods = []

                                            query.forEach(doc => {
                                                let food = doc.data()

                                                Object.defineProperty(food, 'id', {
                                                    enumerable: true,
                                                    configurable: true,
                                                    writable: true,
                                                    value: doc.id
                                                });

                                                this.foods.push(food)
                                            })
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        newFoodFormat(){
            $('#newFoodFormat').modal('show')
        },

        async saveMenu(){
            try {
                Swal.fire({
                    title: '¿Quieres guardar este menu?',
                    text: "Puedes editarlo despues!",
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {

                        this.food.idMenu = this.data.id
                        this.food.idRestaurant = this.data.idRestaurant

                        let url = await this.uploadImage()

                        this.food.image = url

                        let response = await db.collection('foods').add(this.food)

                        if (response) {
                                    
                            Swal.fire(
                            'Guardado!',
                            'Se ha registrado el menu.',
                            'success'
                            )
                        
                            this.food.name = ''
                            this.food.description = ''
                            this.food.cost = 0

                            $('#newFoodFormat').modal('hide')

                            this.isLoading = false;
                        }
                       
                    }
                })
                
            } catch (error) {
                console.log(error);
            }
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

        async changeStatus(food){
            try {
                console.log(food);
                food.active = !food.active

                let response = await db.collection('foods').doc(food.id).update({ active: food.active }).then(query => {
                    console.log(query);
                })
            } catch (error) {
                console.log(error)
            }
        },

        async saveFoodEdit(){
            this.isLoading = true
            try {
                if (this.foodImage == null) {
                    this.editFood.image = this.editFood.image
                }else{
                    let url = await this.uploadImage()

                    this.foodImage = null

                    this.editFood.image = url
                }
                

                let response = await db.collection('foods').doc(this.editFood.id)
                                        .update(this.editFood)
                                        .then(query => {
                                            this.isLoading = false
                                            $('#editModal').modal('hide')
                                            Swal.fire(
                                                'Menu actualizado',
                                                'El menu ha sido actualizado',
                                                'success'
                                            )

                                            
                                        })
            } catch (error) {
                console.log(error)
            }
        },
    },
}
</script>

<style>

</style>