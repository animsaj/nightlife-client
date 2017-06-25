<template>
    <div id="search-box">
        <div class="field has-addons">
            <p class="control is-expanded">
                <input class="input is-large" type="text" placeholder="Enter the city you want us to search for bars" ref="searchQuery">
            </p>
            <p class="control">
                <button class='button is-large' v-on:click="sendQuery" :disabled="searching">Search</button>
            </p>
        </div>
    </div>
</template>

<script>
    import { bus } from '../main'

    export default {
        name: 'search-box',
        data () {
            return {
                searching: false
            }
        },
        methods: {
            sendQuery() {
                this.searching = true;
                bus.$emit('querySent', this.$refs.searchQuery.value);
                this.$refs.searchQuery.value = '';
            }
        },
        created () {
           bus.$on('searchFinished', function () {
                this.searching = false;
            }.bind(this)) 
        } 
    }
</script>
<style>
    #search-box {
        margin-bottom: 20px;
    }
</style>