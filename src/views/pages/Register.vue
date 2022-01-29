<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
                
                <CInput
                  placeholder="Nombre"
                  autocomplete="name"
                  v-model="name"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>

                <CInput
                  placeholder="Apellido"
                  autocomplete="last_name"
                  v-model="last_name"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>

                <CInput
                  placeholder="Nombre de Usuario"
                  autocomplete="username"
                  v-model="user_name"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                
                <CInput
                  placeholder="Correo Electronico"
                  autocomplete="email"
                  prepend="@"
                  v-model="email"
                />
                <CInput
                  placeholder="Contraseña"
                  type="password"
                  autocomplete="new-password"
                  v-model="password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CInput
                  placeholder="Confirmar Contraseña"
                  type="password"
                  autocomplete="new-password"
                  class="mb-4"
                  v-model="password_confirmation"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block @click="register">Crear Cuenta</CButton>
              </CForm>
            </CCardBody>
            <CCardFooter class="p-4">
              <CRow>
                <CCol col="6">
                  <CButton block color="facebook">
                    Facebook
                  </CButton>
                </CCol>
                <CCol col="6">
                  <CButton block color="red" @click="registerGoogle" style="background: #de2727;color: white" >
                    Google
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
import jwtToken from "@/plugins/jwt/jwt-token";
import {mapActions} from "vuex";
import user from "@/plugins/jwt/user";
import VueNotifications from "vue-notifications"
import Swal from 'sweetalert2/dist/sweetalert2.js'

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
      email : '',
      name : '',
      user_name : '',
      password: '',
      password_confirmation : ''
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
        'setAuthUser',
        'setUnit'
    ]),
    register(){
      let self = this
      Swal.showLoading()
      axios(
        {
        url: 'api/register', 
        data: {
          email : this.email,
          name : this.name,
          user_name : this.user_name,
          password: this.password,
          password_confirmation : this.password_confirmation
        }, 
        method: 'POST' 
      })
      .then(response => {
        Swal.close();
        Toast.fire({ icon: 'success',title: 'Registro Exitoso'})
        user.setUser(response.data.user)
        jwtToken.setToken(response.data.token);
        self.setAuthUser(response.data.user)
        this.$router.push({path : '/dashboard'})
      })
      .catch(err => {
        //Swal.close();
        console.log(err);
        //self.showErrorMsg()
        //commit('auth_error', err)
        localStorage.removeItem('token')
        //reject(err)
      });
    },  
    async registerGoogle(){
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
              title: 'Registro Exitoso',
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
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Registro Exitoso',
      message: 'Bienvenido a Factu'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Ha ocurrrido un error',
      message: 'Notifique a al administrador'
    }
  },
}
</script>
