<style>
    
</style>

<template>
    <section>
        <div class="row mt-4">
            <div class="col-md-12">
                <NewOrder :restaurant="restaurant" />
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import { firebase, db, firestore } from '@/firebase'

//Components
import NewOrder from '../components/NewOrderComponent'

export default {
    name: 'Dashboard',

    components: {
        NewOrder, 
    },

    data(){
        return{
            restaurant: null,
        }
    },

    computed: {
        ...mapState([
            'user'
        ])
    },

    created() {
        
    },

    watch: {
        user(){
            if (this.user != null) {
                this.getRestaurant()
            }    
        },
    },

    methods: {
        async getRestaurant(){
            try {
                console.log('binnie')
                let response = await db.collection('restaurants').doc(this.user.restaurant).get()

                if (response.exists) {
                    this.restaurant = response.data()
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
}
</script>
