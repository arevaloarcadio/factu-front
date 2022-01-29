<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="justify-content-center">
      <CCol md="12">
        <CCardGroup>
          <CCard>
            <CCardBody>
              <CForm>
                <h1>Login</h1>
                <p class="text-muted">Accede a tu cuenta</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username email"
                  v-model="user.email"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="curent-password"
                  v-model="user.password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CRow>
                  <CCol col="4">
                    <CButton color="success" class="px-4" @click="login">Login</CButton>
                  </CCol>
                  <CCol col="4">
                    <CButton color="danger" class="px-4" @click="loginGoogle">Google</CButton>
                  </CCol>
                  <CCol col="4">
                    <center>
                     <CButton color="primary" class="px-4" @click="loginFacebook">Facebook</CButton>
                     </center>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <CButton color="link" class="px-0">¿Olvidaste tu password?</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-md-down-none"
            style="width:44%"
            body-wrapper
          >
            <h2>Regístrese</h2>
            <p>Formulario de registro para nuevos usuarios en la plataforma Web. Recuerde que este registro debe ser aprobado por un administrador</p>
            <CButton
              color="primary"
              class="active mt-3"
              @click="$router.push({path : '/pages/register'})"
            >
              Regístrate ahora!
            </CButton>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import axios from 'axios'
import jwtToken from "@/plugins/jwt/jwt-token";
import {mapActions} from "vuex";
import user from "@/plugins/jwt/user";
import VueNotifications from "vue-notifications"
import Swal from 'sweetalert2/dist/sweetalert2.js'

function onSignIn(user) {
  console.log(user)
}
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

export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: '',
        password: '',
      },
    }
  },
  mounted(){
    gapi.load('auth2', () => {
      const clientConfig = {
          client_id: document.getElementsByName('google-signin-client_id')[0].content
      };
      gapi.auth2.init(clientConfig);
    });
    
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '298551098971580',
        cookie     : true,
        xfbml      : true,
        version    : 'v12.0'
      });
      FB.AppEvents.logPageView();   
    };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  
  },
  methods:{
    ...mapActions([
        'setAuthUser'
    ]),
    async loginGoogle(){
      let google = await window.gapi.auth2.getAuthInstance().signIn();
    
      Swal.showLoading()
      
      let dataUser = {
        name : google.getBasicProfile().getGivenName(),
        last_name : google.getBasicProfile().getFamilyName(),
        email : google.getBasicProfile().getEmail() 
      }

      axios.post('/api/auth/social',dataUser)
        .then(response => {
          if(response.status == "200"){

            Toast.fire({
              icon: 'success',
              title: 'Acceso Concedido',
            })
            //self.showSuccessMsg()
            user.setUser(response.data.user)
            jwtToken.setToken(response.data.token);
            this.setAuthUser(response.data.user)
            this.$router.push({path : '/dashboard'})
          }
        })
        .catch(err => {
          console.log(err);
           
           Toast.fire({
              icon: 'error',
              title: 'Error Interno',
            })

          //commit('auth_error', err)
          localStorage.removeItem('token')
          //reject(err)
        });
    },
    loginFacebook(){
     FB.login(function(response) {
        if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         FB.api('/me', function(response) {
           console.log('Good to see you, ' + response.name + '.');
         });
        } else {
         console.log('User cancelled login or did not fully authorize.');
        }
    });
    },

    login(){
      let self = this
      axios({url: '/api/login', data: this.user, method: 'POST' })
        .then(response => {
          if(response.status == "200"){

            Toast.fire({
              icon: 'success',
              title: 'Acceso Concedido',
            })
            //self.showSuccessMsg()
            user.setUser(response.data.user)
            jwtToken.setToken(response.data.token);
            this.setAuthUser(response.data.user)
            this.$router.push({path : '/dashboard'})
          }
        })
        .catch(err => {
          console.log(err);
           
           Toast.fire({
              icon: 'error',
              title: 'Acceso Denegado',
            })

          //commit('auth_error', err)
          localStorage.removeItem('token')
          //reject(err)
        });
    },  },
  notifications: {
      showSuccessMsg: {
        type: VueNotifications.types.success,
        title: 'Acceso concedido',
        message: 'Bienvenido a Grupo10!'
      },
      showErrorMsg: {
        type: VueNotifications.types.error,
        title: 'Acceso denegado',
        message: 'Revise sus credenciales'
      }
  },
}
</script>
