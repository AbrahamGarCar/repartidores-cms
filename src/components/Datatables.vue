<template>
    <div class="row">
        <div class="col-md-12">
            <b-row>
                <b-col md="3">
                    <b-form-input v-model="filter" type="search" placeholder="Buscar"></b-form-input>
                </b-col>
            </b-row>
            <b-table striped hover 
                :items="users" 
                :filter="filter"
                >
            </b-table>
        </div>
    </div>
</template>

<script>
export default {
    props: ['users'],

    data(){
        return{
            filter: null,
            filterOn: [],
        }
    }
}
</script>

<style>

</style>