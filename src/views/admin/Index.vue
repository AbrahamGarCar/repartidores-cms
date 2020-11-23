<style>
    .item-link{
        color: black;
        text-decoration: none;
    }

    .item-link:hover{
        text-decoration: none;
    }
</style>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <ul class="list-group">
                <li class="list-group-item">
                    <router-link class="nav-link item-link" to="/admin/users">Usuarios</router-link>
                </li>
                <li class="list-group-item">
                    <router-link class="nav-link item-link" to="/admin/restaurants">Restaurantes</router-link>
                </li>
            </ul>
        </div>
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>