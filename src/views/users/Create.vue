<template>
  <div>
    <!-- Modal Component -->
    <form @submit.prevent="entityCreator" method="post">

	        <label for="name"  class="typo__label pt-4">Nombre</label>
	        <input type="text" name="name" v-model="object.name" class="form-control"  v-validate="'required:min:7'" placeholder="Introduzca el nombre" id="name" :class="{ 'is-invalid': submitted && errors.has('name') }" >
	        <div v-if="errors.has('name')" class="invalid-feedback">{{ errors.first('name') }}</div>

	        <label for="email"  class="typo__label pt-4">Email</label>
	        <input type="text" name="email" v-model="object.email" class="form-control"  v-validate="'required'" placeholder="Introduzca email" id="email" :class="{ 'is-invalid': submitted && errors.has('email') }" >
	        <div v-if="errors.has('email')" class="invalid-feedback">{{ errors.first('email') }}</div>

	        <label for="email"  class="typo__label pt-4">Administrador</label>
	        <div class="form-check">
	          <input class="form-check-input" type="radio" name="admin" id="admin" value="1" checked v-model="object.admin">
	          <label class="form-check-label" for="radio">
	            Sí
	          </label>
	        </div>
	        <div class="form-check">
	          <input class="form-check-input" type="radio" name="admin" id="admin" value="0" v-model="object.admin">
	          <label class="form-check-label" for="radio">
	            No
	          </label>
	        </div>

	        <label for="password"  class="typo__label pt-4">Password</label>
	        <input type="text" name="password" v-model="object.password" class="form-control"  v-validate="'required|min:8'" placeholder="Introduzca password" id="password" :class="{ 'is-invalid': submitted && errors.has('password') }" >
	        <div v-if="errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div>

	        <label for="password_confirmation"  class="typo__label pt-4">Confirmar Password</label>
	        <input type="text" name="password_confirmation" v-model="object.password_confirmation" class="form-control"  v-validate="'required|min:8'" placeholder="Introduzca el nombre" id="password_confirmation" :class="{ 'is-invalid': submitted && errors.has('password_confirmation') }" >
	        <div v-if="errors.has('password_confirmation')" class="invalid-feedback">{{ errors.first('password_confirmation') }}</div>
	          

	        <CButton color="primary" type="submit">Crear Usuario</CButton>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import VueNotifications from "vue-notifications"

export default {
  name: 'createUser',
  data () {
    return {
      newEntity: "Nuevo Usuario",
      entityAdd: "register",
      object: {
        name: "",
        email: "",
        admin: "",
        password: "",
        password_confirmation: "",
      },
      items: [],
      submitted: false,
      tableFields: [
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email', _classes: 'text-center' },
        { key: 'admin', label: 'Administrador', _classes: 'text-center' },
      ],
      previousUrl: "",
      nextUrl: "",
    }
  },
  created(){
  },
  mounted(){
    
  },
  methods:{
    entityCreator(e) {
      let formData = new FormData();

      formData.append('name',this.object.name)
      formData.append('email',this.object.email)
      formData.append('admin',this.object.admin)
      formData.append('password_confirmation',this.object.password_confirmation)
      formData.append('password',this.object.password)
      this.$validator.validateAll().then((exito) => {
        const t = this
        if (exito) {
          axios({url: this.entityAdd,  method: 'POST', data: formData })
            .then(resp => {
              t.submitted = false
              t.object.name = ""
              t.object.email = ""
              t.object.password = ""
              t.showSuccessMsg()
              t.$router.push({path: 'users'});
            })
            .catch(err => {
              t.showErrorMsg()
              //commit('auth_error', err)
              //reject(err)
            });
        }
        e.preventDefault()
        this.submitted = true
      })
    },
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Operación completada',
      message: 'Usuario añadido con éxito!'
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Operación rechazada',
      message: 'Algo salió mal'
    }
  }
}
</script>