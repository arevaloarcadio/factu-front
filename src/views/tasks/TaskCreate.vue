<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="createProduct()">
      Crear Producto
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import { mapGetters } from "vuex";
import items from './task-create-items';

export default {
  name: "TaskCreate",
  components: { formGenerator },
  data() {
    return {
      entity: "Tarea",
      newEntity: "Nueva Tarea",
      product_types: [],
      customers: [],
      identifier: "",
			itemsForm: items,
      entityForm: {
        customer_id: 0,
        product_type_id: 0,
        identifier: "",
      },
    };
  },
  created() {
    // this.getItems("v1/customers");
		// this.getItems("product_types");
		// this.getCustomers();
		this.getProductTypes();
	},
  computed: {
    ...mapGetters(["getUser"]),
  },
  methods: {
    createProduct() {
			const HTTP_CREATED = 201;
			
			this.entityForm.customer_id = this.$route.params.id;
			const data = { ...this.entityForm }

			axios
			.post("products", data)
			.then(res => {
				if (res.status == HTTP_CREATED) {
					// this.showSuccessMsg();
					this.$router.go(-1)
				}
			})
			.catch(err => console.log(err));
    },
		getCustomers() {
			
			axios
        .get("v1/customers")
        .then(res => {
					this.customers = res.data;
					this.setCustomers(this.customers);
        })
        .catch((err) => console.log(err));
		},
		getProductTypes() {
			
			axios
        .get("product_types")
        .then(res => {
					this.product_types = res.data;
					this.setProductTypes(this.product_types);
        })
        .catch((err) => console.log(err));
		},
		
		
		// setters
    setCustomers(customers) {
			const options = this.customers.map(c => {
				return { id: c.id, name: `${c.firstname} ${c.lastname}` };
			});

      this.itemsForm[0].campos[0].opciones = options;
			this.itemsForm = { ...this.itemsForm };
    },
    setProductTypes(productTypes) {
			this.itemsForm[0].campos[0].opciones = productTypes;
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
