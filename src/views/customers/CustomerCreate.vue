<template>
  <div>
    <formGenerator 
      :items="itemsForm" 
      :entity="entityForm" 
      @update="create()" 
      @change="change($event)"
      @enter="enter($event)">
      Crear Cliente
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './customer-create-items';

export default {
  name: "CustomerCreate",
  components: { formGenerator },
  data() {
    return {
      entity: "Clientes",
      newEntity: "Nuevo Cliente",
      itemsForm: items,
      entityForm: {
        firstname: "",
        lastname: "",
        // address: "",
        birthdate: "",
        phone: "",
        cellphone: "",
        email: "",
        description: "",
      },
    };
  },
  methods: {
    create() {
      const HTTP_CREATED = 201;
      console.log(this.entityForm);
      
      axios
        .post("v1/customers", this.entityForm)
        .then((response) => {

          if (response.status == HTTP_CREATED) {
            const customerId = response.data.data.id;
            console.log(customerId);
            this.$router.push({ name: "customers.edit",  params: { id: customerId } });
            //self.showSuccessMsg()
          }
        })
        .catch((err) => console.log(err));
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
  },
};
</script>
