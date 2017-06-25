import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Auth0Lock from 'auth0-lock'

export const bus = new Vue()

var lock = new Auth0Lock(
  'kKsSYp66OHAv29JhEP4xwoQ7qs2y80Bi',
  'animsaj.eu.auth0.com',
   {
     auth: {
      redirect: true,
      responseType: 'token',
      autoParseHash: true,
      params: {
        scope: 'openid profile' // Learn about scopes: https://auth0.com/docs/scopes
      }
    }
   }
);

export { lock }

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})