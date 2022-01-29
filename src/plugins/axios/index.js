import Vue from 'vue'
import router from '@/router'
import jwtToken from '@/plugins/jwt/jwt-token.js'
import user from '@/plugins/jwt/user.js'
import store from '@/plugins/store'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2'

axios.defaults.baseURL = 'http://localhost'

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

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
  
  Swal.close()

  if(error['response']['status'] == 422){
    let message="";

    console.log(error.response)
    error.response.data.error.message.forEach(error => {
      message += error+'<br>'
    })

    Toast.fire({
      icon: 'warning',
      html: message,
    })
  }

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