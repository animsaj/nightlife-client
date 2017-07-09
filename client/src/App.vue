<template>
    <div id="app">
        <nav class="nav has-shadow">
            <div class="nav-left">
                <a class="nav-item is-brand title is-3" to="/">
                    NightLife-Client
                </a>
            </div>
            <div class="nav-right">
                <span class="nav-item">
                <a class="button" @click="login()" v-if="user === null">Login</a>
                 <a class="button" @click="logout()" v-else>Logout</a>
            </span>
            </div>
        </nav>
        <section class="section" id="main">
            <div class="container is-fluid">
                <search-box></search-box>
                <bar-list :user="user"></bar-list>
            </div>
        </section>
    </div>
</template>

<script>
    import SearchBox from './components/SearchBox.vue'
    import BarList from './components/BarList.vue'
    import { lock } from './main'
    import axios from 'axios'

    // set auth header on start up if token is present
    if (localStorage.getItem('idToken')) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('idToken')
    }

    export default {
        name: "app",
        components: {
            'search-box': SearchBox,
            'bar-list': BarList
        },
        data() {
            return {
                user: JSON.parse(localStorage.getItem('profile'))
            }
        },
        methods: {

            login() {
                lock.show();
                this.user = JSON.parse(localStorage.getItem('profile'));
            },

            logout() {
                // Remove the profile and token from localStorage
                localStorage.removeItem('profile');
                localStorage.removeItem('idToken');
                localStorage.removeItem('accessToken');
                this.user = null;
            }
        },

        created() {
            let self = this;
            lock.on("authenticated", function (authResult) {
                // Use the token in authResult to getUserInfo() and save it to localStorage
                lock.getUserInfo(authResult.accessToken, function (error, profile) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    localStorage.setItem('idToken', authResult.idToken);
                    localStorage.setItem('accessToken', authResult.accessToken);
                    localStorage.setItem('profile', JSON.stringify(profile));
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('idToken');
                    self.user = JSON.parse(localStorage.getItem('profile'));
                });
            });
        }

    }

</script>

<style>
    #main {
        background-color: darkslategrey;
    }
</style>