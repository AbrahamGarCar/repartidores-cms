<template>
    <section class="col-md-12">
        <div class="row">
            <loading :active.sync="isLoading" 
                :can-cancel="false" 
                :on-cancel="onCancel"
                :is-full-page="fullPage"></loading>
            <div class="col-md-12">
                <div class="row gutters-sm" v-if="client != null">
                    <div class="col-md-4 mb-3" v-if="userPhotos.length != 0">
                        <div class="card rounded-0">
                            <div class="card-body">
                                <div class="d-flex flex-column align-items-center text-center">
                                    <div style="width: 150px; height: 150px;">
                                        <img :src="userPhotos[0].photo" alt="Admin" class="rounded-circle" width="150" height="150" style="object-fit: cover; object-position: center;">
                                    </div>
                                    <div class="mt-3">
                                        <h4>{{ client.name }}</h4>
                                        <p class="text-secondary mb-1">
                                            <span v-if="client.role == 'user'">Repartidor</span>
                                            <span v-if="client.role == 'restaurant'">Restaurante</span>
                                        </p>
                                        <button class="btn btn-primary rounded-0" @click="selectPhoto = userPhotos[0]" data-toggle="modal" data-target="#exampleModal">Editar foto</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card rounded-0 mt-3">
                            <div class="card-body">
                                <div class="d-flex flex-column align-items-center text-center">
                                    <div style="width: 150px; height: 250px;">
                                        <img :src="userPhotos[1].photo" alt="Admin" width="150" height="250" style="object-fit: cover; object-position: center;">
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-primary rounded-0" @click="selectPhoto = userPhotos[1]" data-toggle="modal" data-target="#exampleModal">Editar foto</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="card rounded-0 mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Nombre</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {{ client.name }}
                                    </div>
                                </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Email</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    {{ client.email }}
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Telefono</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    {{ client.telephone }}
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Direccion</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    {{ client.direction }}
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="row gutters-sm" v-if="informationUser != null">
                            <div class="col-sm-12 mb-3">
                                <div class="card rounded-0 h-100">
                                    <div class="card-body">
                                        <h6 class="d-flex align-items-center mb-3"><i class="material-icons text-info mr-2">assignment</i>Estatus del servicio</h6>
                                        <small>Entregas completadas (<span>{{ ((informationUser.deliveredCount / counter.ordersCount) * 100) }}%</span>)</small>
                                        <div class="progress mb-3" style="height: 5px">
                                            <div class="progress-bar bg-primary" role="progressbar" :style="{ width: ((informationUser.deliveredCount / counter.ordersCount) * 100) + '%' }" :aria-valuenow="informationUser.deliveredCount" aria-valuemin="0" :aria-valuemax="counter.ordersCount"></div>    
                                        </div>
                                        
                                        <small>Entregas canceladas (<span>{{ ((informationUser.cancellationsCount / counter.ordersCount) * 100) }}%</span>)</small>
                                        <div class="progress mb-3" style="height: 5px">
                                            <div class="progress-bar bg-primary" role="progressbar" :style="{ width: ((informationUser.cancellationsCount / counter.ordersCount) * 100) + '%' }" :aria-valuenow="informationUser.cancellationsCount" aria-valuemin="0" :aria-valuemax="counter.ordersCount"></div>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row gutters-sm" v-if="informationUser != null">
                            <div class="col-sm-6 mb-3">
                                <div class="card rounded-0 h-100">
                                    <div class="card-body">
                                        <h6 class="mb-3 text-center">Ordenes entregadas</h6>
                                        
                                        <h2 class="text-center">{{ informationUser.deliveredCount }}</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 mb-3">
                                <div class="card rounded-0 h-100">
                                    <div class="card-body">
                                        <h6 class="mb-3 text-center">Ordenes canceladas</h6>
                                        
                                        <h2 class="text-center">{{ informationUser.cancellationsCount }}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal imagen -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content rounded-0">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cambiar imagen</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="uploadImage" method="post">
                            
                            <input type="file" @change="getImage($event)" accept="image/">

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary rounded-0" data-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary rounded-0">Guardar</button>
                            </div>
                        </form>
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

// Import component
import Loading from 'vue-loading-overlay';

// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'Profile',

    props: [ 'uid' ],

    components: {
        Loading
    },

    data(){
        return{
            client: null,
            informationUser: null,
            userPhotos: [],

            counter: 0,

            selectPhoto: null,

            profileImage: null,

            isLoading: false,
            fullPage: true
        }
    },

    async mounted() {
        this.getUser()

        let response = await db.collection('orders').doc('counter').get()
        this.counter = response.data()
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    methods: {
        onCancel() {
            console.log('User cancelled the loader.')
        },

        getImage(e){
            this.profileImage = e.target.files[0]
            console.log(this.profileImage);
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
            this.isLoading = true;

            try {
                let metadata = {
                    contentType: "image/jpeg",
                    contentLanguage: "es",
                }

                let fotoId = this.generateUUID()

                const refImg = ref.child('users/' + fotoId + '.jpg')
                refImg.put(this.profileImage, metadata)
                .then(e => {
                    console.log(e)
                    this.getResizePath(fotoId)
                })
                .catch(error => console.log(error))
            } catch (error) {
                console.log(error);
                this.isLoading = false;
            }
        },

        async getResizePath(args){
            try {
                console.log('entra al get resizepath');

                setTimeout(() => {
                    console.log('Termina el set timeout');

                    let photoID = `${args}_600x600`

                    ref.child('users/' + photoID + '.jpg').getDownloadURL()
                    .then(async (url) => {
                        console.log(url)

                        let response = await db.collection('user_photos').doc(this.selectPhoto.id).update({ photo: url })
                        
                        

                        this.userPhotos.map((dato) => {
                            if(dato.id == this.selectPhoto.id){
                                dato.photo = url;
                            }
                            
                            return dato;
                        });
                        this.isLoading = false;

                        $('#exampleModal').modal('hide')
                    })
                }, 8000)
            } catch (error) {
                console.log(error);
                this.isLoading = false;
            }
        },

        async getUser(){
            try {
                let response = await db.collection('users').doc(this.uid).get()

                this.client = response.data()

                this.getUserImages()

                this.getInfoUser()
            } catch (error) {
                console.log(error);
            }
        },

        async getUserImages(){
            try {

                let photosProfile = await db.collection('user_photos')
                                            .where('user', '==', this.uid)
                                            .get()
                                            .then(query => {
                                                query.forEach(doc => {
                                                    let image = doc.data()

                                                    Object.defineProperty(image, 'id', {
                                                        enumerable: true,
                                                        configurable: true,
                                                        writable: true,
                                                        value: doc.id
                                                    });

                                                    this.userPhotos.push(image)
                                                })
                                            })
            } catch (error) {
                console.log(error);
            }
        },

        async getInfoUser(){
            try {
                let response = await db.collection('information_user').doc(this.uid).get()

                this.informationUser = response.data()
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style>

</style>