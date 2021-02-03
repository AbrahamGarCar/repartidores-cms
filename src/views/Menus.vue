<template>
    <div class="row mt-5">
        <div class="col-md-12">
            <div class="row mt-4">
                <div class="col-md-12" v-if="user != null && user.active">
                    <button class="btn btn-success rounded-0" @click="newMenuFormat">Nuevo menu</button>
                </div>
            </div>

            <div class="modal fade" id="newMenuFormat" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="newMenuFormatLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content rounded-0">
                        <div class="modal-header">
                            <h5 class="modal-title" id="newMenuFormatLabel">Nuevo menu</h5>
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
                                            <input name="name" v-model="menu.name" class="form-control rounded-0" type="text">
                                            <small class="text-danger" v-if="!$v.menu.name.required">Campo requerido</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="description">Descripcion</label>
                                            <textarea class="form-control rounded-0" name="description" v-model="menu.description" id="" cols="30" rows="5"></textarea>
                                            <small class="text-danger" v-if="!$v.menu.description.required">Campo requerido</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary rounded-0" :disabled="$v.menu.$invalid" @click="saveMenu">Guardar</button>
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
                        <div class="modal-body" v-if="editMenu != null">
                            <form @submit.prevent="saveMenuEdit" method="post">
                                <div class="row">
                                    <div class="col-md-12 mt-3">
                                        <div class="form-group">
                                            <label for="name">Nombre</label>
                                            <input name="name" v-model="editMenu.name" class="form-control rounded-0" type="text">
                                        </div>
                                        <div class="form-group">
                                            <label for="description">Descripcion</label>
                                            <textarea class="form-control rounded-0" name="description" v-model="editMenu.description" id="" cols="30" rows="5"></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-primary rounded-0" :disabled="$v.editMenu.$invalid">Actualizar</button>
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
                        :rows="menus"
                        :lineNumbers="true"
                        :defaultSortBy="{field: 'name', type: 'asec'}"
                        :globalSearch="true"
                        :paginate="true"
                        styleClass="table condensed table-bordered table-striped">
                        
                        <template class="text-center" slot="table-row" slot-scope="props">
                            <span class="text-center" v-if="props.column.field == 'options'">
                                <button v-on:click="editMenu = props.row" class="btn btn-info btn-sm btn-main" data-toggle="modal" data-target="#editModal">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="ml-1 btn btn-success btn-sm btn-main" @click="goToMenu(props.row)">
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
import { firebase, db, firestore, auth } from '@/firebase'

//Algolia
const algoliasearch = require('algoliasearch');

const client = new algoliasearch('YN419Q56L7', 'edf8f9a3011445793f03c30eb44f69ad');
const index = client.initIndex('users');

//Vuelidate
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'Menus',

    data(){
        return{
            restaurant: null,
            menu: {
                name: '',
                description: ''
            },
            menus: [],
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
                    label: 'Opciones',
                    field: 'options',
                },

            ],
            editMenu: null,
        }
    },

    created(){
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

    validations: {
        menu: {
            name: {
                required,
            },
            description: {
                required,
            }
            
        },

        editMenu: {
            name: {
                required
            },
            description: {
                required
            },
        }
    },

    computed: {
        ...mapState([
            'user'
        ]),
    },

    methods: {
        async getRestaurant(){
            try {
                console.log('binnie')
                let response = await db.collection('restaurants').doc(this.user.restaurant).get()

                if (response.exists) {
                    this.restaurant = response.data()

                    this.getMenus()
                }
            } catch (error) {
                console.log(error)
            }
        },

        newMenuFormat(){
            $('#newMenuFormat').modal('show')
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

                        this.menu.idRestaurant = this.restaurant.id

                        let response = await db.collection('menus').add(this.menu)

                        if (response) {
                            
                            Swal.fire(
                            'Guardado!',
                            'Se ha registrado el menu.',
                            'success'
                            )
                        
                            this.menu.name = ''
                            this.menu.description = ''

                            $('#newMenuFormat').modal('hide')
                        }
                       
                    }
                })

                
            } catch (error) {
                console.log(error)
            }
        },

        async getMenus(){
            try {
                let response = await db.collection('menus')
                                        .where('idRestaurant', '==', this.restaurant.id)
                                        .onSnapshot(query => {
                                            this.menus = []

                                            query.forEach(doc => {
                                                let menu = doc.data()

                                                Object.defineProperty(menu, 'id', {
                                                    enumerable: true,
                                                    configurable: true,
                                                    writable: true,
                                                    value: doc.id
                                                });

                                                this.menus.push(menu)
                                            })
                                        })
            } catch (error) {
                console.log(error);
            }
        },

        async saveMenuEdit(){
            try {

                let response = await db.collection('menus').doc(this.editMenu.id)
                                        .update(this.editMenu)
                                        .then(query => {
                                            Swal.fire(
                                                'Menu actualizado',
                                                'El menu ha sido actualizado',
                                                'success'
                                            )

                                            this.editMenu.name = ''
                                            this.editMenu.description = ''
                                        })
            } catch (error) {
                console.log(error)
            }
        },

        goToMenu(menu){
            this.$router.push({ name: 'MenuDetails', params: {data: { id: menu.id, idRestaurant: this.restaurant.id, name: menu.name }}})
        }
    },
}
</script>

<style>

</style>