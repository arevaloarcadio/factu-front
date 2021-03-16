<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="updateUser()">
      Editar Usuario
    </formGenerator>

    <formGenerator
      :items="itemsSecurity" 
      :entity="entityFormPassword" 
      @update="updatePassword()">
      Seguridad
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './user-edit-items';

export default {
  name: "UserEdit",
  components: { formGenerator },
  data() {
    return {
      itemsForm: items.information,
      itemsSecurity: items.security,
      entityForm: {
        firstname: "",
        lastname: "",
        email: "",
      },
      entityFormPassword: {
        password: "",
        password_confirmation: "",
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      const userId = this.$route.params.id;
      
      axios
        .get(`v1/users/${userId}`, this.entityForm)
        .then(res => {
          this.setUserInformation(res.data);
        })
        .catch(err => console.log(err));
    },
    updateUser() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}`, this.entityForm)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
    updatePassword() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}/password`, this.entityFormPassword)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
		
		
		// setters
    
    setUserInformation(user) {
      // this.entityForm.firstname = user.firstname;
      // this.entityForm.lastname  = user.lastname;
      // this.entityForm.email     = user.email;

      this.entityForm = { ...user };
    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Operación completada",
      message: "Registro añadido con éxito!",
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Operación rechazada",
      message: "Algo salió mal",
    },
  }
};
</script>
