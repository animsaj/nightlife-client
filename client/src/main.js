import Vue from 'vue'
import App from './App.vue'
import Auth0Lock from 'auth0-lock'

export const bus = new Vue()

var lock = new Auth0Lock(
  '<AUTH0_CLIENT_ID>',
  '<AUTH0_CLIENT_SECRET>',
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
  render: h => h(App)
})