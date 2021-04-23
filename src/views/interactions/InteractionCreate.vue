<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createInteraction()">
      Crear Interacción
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './interaction-create-items';

export default {
  name: "InteractionCreate",
  components: { formGenerator },
  data() {
    return {
      itemsForm: items,
      customerId: 0,
      entityForm: {
        type: "",
        description: "",
      },
    };
  },
  created() {
    this.getCustomers();
    this.customerId = this.$route.params.customerId;
  },
  methods: {
    getCustomers() {

      axios
        .get('v1/customers')
        .then(res => this.setCustomers(res.data))
        .catch(err => console.log);
    },
    createInteraction() {
      const HTTP_CREATED = 201;
      
      const interaction = {
        customerId:  parseInt(this.customerId),
        type:        this.entityForm.type,
        description: this.entityForm.description
      };
      
      axios
        .post(`v1/customers/${this.customerId}/interactions`, interaction)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
    setCustomers(customers) {
      const newCustomers = customers.map(c => {
        return {
          id: c.id,
          name: `${c.firstname} ${c.lastname}`
        }
      });

      this.itemsForm[0].campos[0].opciones = newCustomers;
      this.itemsForm = { ...this.itemsForm };
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
