<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createUser()">
      Crear Usuario
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './user-create-items';
import { mapGetters } from "vuex";

export default {
  name: "UserCreate",
  components: { formGenerator },
  data() {
    return {
      itemsForm: items,
      entityForm: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters(["getUnitId"])
  },
  methods: {
    createUser() {
      const HTTP_CREATED = 201;

      const data = {
        unitId: this.getUnitId,
        ...this.entityForm
      };
      console.log(data);

      axios
        .post("v1/users", this.entityForm)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
            //this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
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
