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
                  <CCol col="6">
                    <CButton color="primary" class="px-4" @click="login">Login</CButton>
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
    
  },
  methods:{
    ...mapActions([
                'setAuthUser',
                'setUnit'
            ]),
    login(){
      let self = this
      axios({url: 'auth/login', data: this.user, method: 'POST' })
        .then(response => {
          if(response.status == "200"){
            //self.showSuccessMsg()
            user.setUser(response.data.user)
            jwtToken.setToken(response.data.access_token);
            self.setAuthUser(response.data.user)
            self.getOrganization()
          }
        })
        .catch(err => {
          //commit('auth_error', err)
          localStorage.removeItem('token')
          //reject(err)
        });
    },
    getOrganization(){
      let self = this
      axios({url: 'organizations/mine', method: 'GET' })
        .then(response => {
          if(response.status == "200"){
            console.log(response.data[0].unit_id,"-------------------")
            if(response.data[0].unit){
              self.setUnit(response.data[0].unit_id)
            }
            self.$router.push({path: '/#/dashboard'});
          }
        })
        .catch(err => {
          localStorage.removeItem('token')
        });
    }
  },
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
