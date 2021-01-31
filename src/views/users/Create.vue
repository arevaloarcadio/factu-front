<template>
  <div>
    <formGenerator :items="itemsForm" :entity="entityForm" @update="updated()">Crear Cliente
    </formGenerator>
  </div>
</template>

<script>
import VueNotifications from "vue-notifications"
import formGenerator from "@/views/components/formGenerator.vue"
import { mapGetters } from 'vuex'

export default {
  name: 'Users',
  components:{ formGenerator},
  data () {
    return {
      entity: "Usuarios",
      newEntity: "Nuevo Usuario",
      itemsForm:[
        { 
          name: 'Identificación', 
          campos:[
            { name: 'firstname', title: 'Nombre', placeholder:'Introduzca Nombre', validation: "required|min:3", type: 'string', size:"col-md-4" },
            { name: 'lastname', title: 'Apellidos', placeholder:'Introduzca Apellidos', validation: "required|min:6", type: 'string', size:"col-md-4 col-md-offset-right-4" },
            { name: 'email', title: 'Email', placeholder:'Introduzca Email', validation: 'required|email' , type: 'string', size:"col-md-8 col-md-offset-right-4"},
          ]
        },
        { 
          name: 'Seguridad', 
          campos:[
            { name: 'password', title: 'Contraseña', placeholder:'Introduzca Contraseña', validation: 'required', type: 'string', size:"col-md-4" },
            { name: 'password_confirmation', title: 'Confirmar contraseña', placeholder:'Repita su contraseña', validation: 'required', type: 'string', size:"col-md-4 col-md-offset-right-4" },
          ]
        },
      ],
      entityForm:{
              firstname: '',
              lastname: '',
              email: '',
              password: '',
            },
    }
  },
  created(){
    
  },
  methods:{
    updated(){
      self = this
      this.$http({url: 'users' , method: 'POST',data: this.entityForm })
          .then(response => {
              console.log(response);
            if(response.status == "201"){
              self.$router.push({path: '/users'});
              self.showSuccessMsg()

            }
          })
          .catch(err => {
            console.log(err)
            //commit('auth_error', err)
            //self.unsetUser('token')
            //reject(err)
          });

    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Operación completada',
      message: 'Registro añadido con éxito!'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Operación rechazada',
      message: 'Algo salió mal'
    }
  },
  computed: {
    ...mapGetters([
                'getUser'
            ]),
  }
}
</script>

