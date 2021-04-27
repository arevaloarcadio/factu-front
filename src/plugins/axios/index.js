import Vue from 'vue'
import router from '@/router'
import jwtToken from '@/plugins/jwt/jwt-token.js'
import store from '@/plugins/store'
import axios from 'axios'

//axios.defaults.baseURL = 'http://hexcrm.test/';
//axios.defaults.baseURL = 'https://api.jurisleg.com/';
//axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.baseURL = 'http://localhost/hexcrm/public/index.php';

Vue.prototype.$http = axios;

axios.interceptors.request.use(config => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  if (jwtToken.getToken()) {
    config.headers['Authorization'] = 'Bearer ' + jwtToken.getToken();
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  if(response.data.status == "Token has Expired" || 
              response.data.status == "Token not provided"  || 
              response.data.status == "Token is Invalid" || 
              response.data.status == "Authorization Token not found"){
    jwtToken.removeToken();
    router.push({path: '/pages/login'});
  }
  return response;
}, error => {
  let errorResponseData = error.response.data;
  const errors = ["token_invalid", 
                  "Token not provided", 
                  "Token has expired", 
                  "Token is invalid", "token_expired", "token_not_provided","Expired JWT Token","JWT Token not found", 
                  "Token is Expired"];

  if (errors.includes(errorResponseData.message)) {
    store.dispatch('unsetAuthUser')
      .then(() => {
        jwtToken.removeToken();
        router.push({path: '/pages/login'});
      });
  }
  return Promise.reject(error);
});