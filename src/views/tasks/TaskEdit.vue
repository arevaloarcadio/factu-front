<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="editTask()">
      Editar Tarea
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './task-edit-items';

export default {
  name: "TaskEdit",
  components: { formGenerator },
  data() {
    return {
			itemsForm: items,
      current_endpoint: 'v1/tasks',
      taskId: null,
      entityForm: {
        name: '',
        subject:  '',
        description:  '',
        date: '',
      },
    };
  },

  created()
  {
    this.taskId = this.$route.params.id;
    this.getTaskById();
    // this.getProductTypes();
    // this.setSelectedProduct();
	},

  methods: {

    getTaskById()
    {
      axios.get(`${this.current_endpoint}/${this.taskId}`).then(res => {
        this.setTaskInformation(res.data);
      }).catch(err => console.log(err));
    },

    setTaskInformation(data)
    {
      let date = new Date(data.date)

      console.log([date.toDateString(), date])

      this.entityForm = {
        name:         data.name,
        subject:      data.subject,
        description:  data.description,
        date:         data.date,
      };

      this.entityForm = { ...this.entityForm };
    },

    editTask()
    {
      const HTTP_OK = 200;

			axios
        .put(`${this.current_endpoint}/${this.taskId}`, this.entityForm)
        .then(res => {
          if (res.status == HTTP_OK) {
            console.log(res.data);
            // this.showSuccessMsg();
            this.$router.go(-1)
          }
        })
        .catch(err => console.log(err));
    },

		// getProductTypes() {
			
		// 	axios
    //     .get("product_types")
    //     .then(res => {
		// 			this.setProductTypes(res.data);
    //     })
    //     .catch((err) => console.log(err));
    // },

    // setSelectedProduct() {
    //   this.entityForm.product_type_id = this.$route.query.product_type;
    //   this.entityForm.identifier = this.$route.query.identifier;
    //   this.entityForm = { ...this.entityForm };
    // },
		
		
		// setters
    // setProductTypes(productTypes) {
		// 	this.itemsForm[0].campos[0].opciones = productTypes;
		// 	this.itemsForm = { ...this.itemsForm };
    // }
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
