<template>
    <section>
        <!-- boton para agregar usuario -->
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Add restaurant
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Agregar Usuario</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form action="/my-handling-form-page" method="post">
                                <ul>
                                    <li>
                                        <label for="name">Name:</label>
                                        <input type="text" v-model="restaurant.name" name="name">
                                    </li>
                                    <li>
                                        <label for="lastname">Photo:</label>
                                        <input type="file" name="lastname">
                                    </li>
                                    <li>
                                        <label for="mail">Email:</label>
                                        <input type="email" v-model="restaurant.mail" name="mail">
                                    </li>
                                    <li>
                                        <label for="telephone">phone:</label>
                                        <input type="text" v-model="restaurant.telephone" name="phone">
                                    </li>
                                    <li>
                                        <label for="direction">Direction:</label>
                                        <input type="text" v-model="restaurant.direction" name="direction">
                                    </li>
                                    <li>
                                        <label for="direction">Position:</label>
                                        <input type="text" v-model="restaurant.position" name="direction">
                                    </li>
                                </ul>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" @click="saveRestaurant">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Termina Modal -->
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Mail</th>
                    <th scope="col">Direction</th>
                    <th scope="col">Photo</th>
                    <th scope="col">Position</th>
                    <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in restaurants" :key="index">
                    <th scope="row">{{ item.name }}</th>
                    <td>{{ item.mail }}</td>
                    <td>{{ item.direction }}</td>
                    <td>{{ item.photo }}</td>
                    <td>{{ item.position }}</td>
                    </tr>
                </tbody>
            </table>
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
const index = client.initIndex('restaurants');

export default {
    data(){
        return{

            restaurant: {
                name: '',
                photo: '',
                mail: '',
                telephone: '',
                direction: '',
                position:''
            },
            restaurants: []

        }
    },
    created(){
            this.getRestaurant()
        },
    methods:{
        async saveRestaurant(){
            try {

                let conf = confirm('¿Quieres guardar este restaurante?')

                if (conf) {
                    

                    let response = await db.collection('restaurants').add(this.restaurant)

                    
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getRestaurant(){
            try {
                let response = await db.collection('restaurants').get().then(query=>{
                    query.forEach(doc=>{
                        this.restaurants.push(doc.data())
                    })
                })

            } catch (error) {
                console.log(error)
            }
        },
    }
}
</script>

<style>
