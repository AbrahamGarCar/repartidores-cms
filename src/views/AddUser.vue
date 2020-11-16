<template>
    <section>
        <!-- boton para agregar usuario -->
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Add User
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
                                        <input type="text" v-model="user.name" name="name">
                                    </li>
                                    <li>
                                        <label for="lastname">LastName:</label>
                                        <input type="text" v-model="user.lastname" name="lastname">
                                    </li>
                                    <li>
                                        <label for="mail">Email:</label>
                                        <input type="email" v-model="user.mail" name="mail">
                                    </li>
                                    <li>
                                        <label for="date">Birtday:</label>
                                        <input type="date" v-model="user.birtday" name="birtday">
                                    </li>
                                    <li>
                                        <label for="role">Role:</label>
                                        <input list="role">
                                            <datalist id="role">
                                                <option value="user"></option>
                                                <option value="restaurant"></option>
                                            </datalist>
                                    </li>
                                    <li>
                                        <label for="telephone">phone:</label>
                                        <input type="text" v-model="user.phone" name="phone">
                                    </li>
                                    <li>
                                        <label for="direction">Direction:</label>
                                        <input type="text" v-model="user.direction" name="direction">
                                    </li>
                                </ul>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" @click="saveUser">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Termina Modal -->
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Lastname</th>
                    <th scope="col">Mail</th>
                    <th scope="col">Direction</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Status</th>
                    <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in users" :key="index">
                    <th scope="row">{{ item.name }}</th>
                    <td>{{ item.lastname }}</td>
                    <td>{{ item.mail }}</td>
                    <td>{{ item.direction }}</td>
                    <td><button v-on:click="deleteUser(item)" class="btn btn-danger">eliminar</button></td>
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
const index = client.initIndex('users');

export default {
    data(){
        return{

            user: {
                name: '',
                lastname: '',
                mail: '',
                birtday: '',
                role: '',
                phone: '',
                direction: '',
                active:'1'
            },
            users: []

        }
    },
    created(){
            this.getUser()
        },
    methods:{
        async saveUser(){
            try {

                let conf = confirm('¿Quieres guardar este usuario?')

                if (conf) {
                    

                    let response = await db.collection('users').add(this.user)

                    
                }
            } catch (error) {
                console.log(error)
            }
        },

        async getUser(){
            try {
                let response = await db.collection('users').get().then(query=>{
                    query.forEach(doc=>{
                        this.users.push(doc.data())
                    })
                })

            } catch (error) {
                console.log(error)
            }
        },
        deleteUser: function(item){
            let response = db.collection('users').child(item['.key']).remove(item)
            
        }

    }
}
</script>

<style>

</style>