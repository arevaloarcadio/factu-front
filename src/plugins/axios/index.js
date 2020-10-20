import Vue from 'vue'
import router from '@/router'
import jwtToken from '@/plugins/jwt/jwt-token.js'
import store from '@/plugins/store'
import axios from 'axios'

axios.defaults.baseURL = 'http://hexcrm.git.test/';

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
  if(response.data.status == "Token is Expired" || response.data.status == "Token is Invalid" || response.data.status == "Authorization Token not found"){
    jwtToken.removeToken();
    router.push({path: '/pages/login'});
  }
  return response;
}, error => {
  let errorResponseData = error.response.data;
  const errors = ["token_invalid", "Token is Invalid", "token_expired", "token_not_provided","Expired JWT Token","JWT Token not found", "Token is Expired"];

  console.log(error)
  if (errors.includes(errorResponseData.error)) {
    store.dispatch('unsetAuthUser')
      .then(() => {
        jwtToken.removeToken();
        router.push({path: '/pages/login'});
      });
  }
  return Promise.reject(error);
});